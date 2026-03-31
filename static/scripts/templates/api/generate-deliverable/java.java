import java.io.*;
import java.net.URI;
import java.net.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

/**
 * Final Step: Generate Deliverable (Both Paths Converge Here)
 */
public class DeliverableGenerator {
    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://api.turbodocx.com";

    public static void main(String[] args) throws Exception {
        try {
            System.out.println("=== Final Step: Generate Deliverable ===");

            // This would come from either Path A (upload) or Path B (browse/select)
            String templateId = "0b1099cf-d7b9-41a4-822b-51b68fd4885a";

            ObjectMapper mapper = new ObjectMapper();

            // Build variables
            ArrayNode variables = mapper.createArrayNode();

            ObjectNode employeeVar = mapper.createObjectNode();
            employeeVar.put("placeholder", "{EmployeeName}");
            employeeVar.put("text", "John Smith");
            employeeVar.put("mimeType", "text");
            variables.add(employeeVar);

            ObjectNode companyVar = mapper.createObjectNode();
            companyVar.put("placeholder", "{CompanyName}");
            companyVar.put("text", "TechCorp Solutions Inc.");
            companyVar.put("mimeType", "text");
            variables.add(companyVar);

            ObjectNode jobTitleVar = mapper.createObjectNode();
            jobTitleVar.put("placeholder", "{JobTitle}");
            jobTitleVar.put("text", "Senior Software Engineer");
            jobTitleVar.put("mimeType", "text");
            variables.add(jobTitleVar);

            ObjectNode contactBlockVar = mapper.createObjectNode();
            contactBlockVar.put("mimeType", "html");
            contactBlockVar.put("placeholder", "{ContactBlock}");
            contactBlockVar.put("text", "<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>");

            ArrayNode contactSubVars = mapper.createArrayNode();
            ObjectNode contactNameSub = mapper.createObjectNode();
            contactNameSub.put("placeholder", "{contactName}");
            contactNameSub.put("text", "Jane Doe");
            contactNameSub.put("mimeType", "text");
            contactSubVars.add(contactNameSub);

            ObjectNode contactPhoneSub = mapper.createObjectNode();
            contactPhoneSub.put("placeholder", "{contactPhone}");
            contactPhoneSub.put("text", "(555) 123-4567");
            contactPhoneSub.put("mimeType", "text");
            contactSubVars.add(contactPhoneSub);

            contactBlockVar.set("subvariables", contactSubVars);
            variables.add(contactBlockVar);

            // Build deliverable data
            ObjectNode deliverableData = mapper.createObjectNode();
            deliverableData.put("description", "Employment contract for new senior software engineer");
            deliverableData.set("variables", variables);

            ArrayNode tags = mapper.createArrayNode();
            tags.add("hr").add("contract").add("employee");
            deliverableData.set("tags", tags);

            JsonNode deliverable = generateDeliverable(templateId, deliverableData);

            // Download the generated file
            System.out.println("\n=== Download Generated File ===");
            downloadDeliverable(deliverable.get("id").asText(), deliverable.get("name").asText() + ".docx");

        } catch (Exception e) {
            System.err.println("Deliverable generation failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Generate a deliverable document from template with variable substitution
     */
    private static JsonNode generateDeliverable(String templateId, ObjectNode deliverableData) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper mapper = new ObjectMapper();

        ObjectNode payload = mapper.createObjectNode();
        payload.put("templateId", templateId);
        payload.put("description", deliverableData.get("description").asText());
        payload.set("variables", deliverableData.get("variables"));
        payload.set("tags", deliverableData.get("tags"));

        System.out.println("Generating deliverable...");
        System.out.println("Template ID: " + templateId);
        System.out.println("Variables: " + payload.get("variables").size());

        String jsonBody = mapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/v1/deliverable"))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP error " + response.statusCode() + ": " + response.body());
        }

        JsonNode result = mapper.readTree(response.body());
        JsonNode deliverable = result.get("data").get("results").get("deliverable");

        System.out.println("Deliverable generated successfully!");
        System.out.println("Deliverable ID: " + deliverable.get("id").asText());
        System.out.println("Created by: " + deliverable.get("createdBy").asText());
        System.out.println("Created on: " + deliverable.get("createdOn").asText());
        System.out.println("Template ID: " + deliverable.get("templateId").asText());

        return deliverable;
    }

    /**
     * Download the generated deliverable file
     */
    private static void downloadDeliverable(String deliverableId, String filename) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        System.out.println("Downloading file: " + filename);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/v1/deliverable/file/" + deliverableId))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Download failed: " + response.statusCode());
        }

        System.out.println("File ready for download: " + filename);
        String contentType = response.headers().firstValue("content-type").orElse("N/A");
        String contentLength = response.headers().firstValue("content-length").orElse("N/A");
        System.out.println("Content-Type: " + contentType);
        System.out.println("Content-Length: " + contentLength + " bytes");

        // In a real application, you would save the file
        // Files.write(Paths.get(filename), response.body().getBytes());
    }
}
