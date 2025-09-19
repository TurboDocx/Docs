import java.io.*;
import java.net.URI;
import java.net.http.*;
import java.time.Instant;
import java.util.UUID;
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
            ObjectNode deliverableData = mapper.createObjectNode();
            deliverableData.put("name", "Employee Contract - John Smith");
            deliverableData.put("description", "Employment contract for new senior software engineer");
            deliverableData.set("variables", createComplexVariables(mapper));

            ArrayNode tags = mapper.createArrayNode();
            tags.add("hr").add("contract").add("employee").add("engineering");
            deliverableData.set("tags", tags);

            deliverableData.put("fonts", "[{\"name\":\"Arial\",\"usage\":269}]");
            deliverableData.put("defaultFont", "Arial");
            deliverableData.put("replaceFonts", true);
            deliverableData.set("metadata", createMetadata(mapper));

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
        payload.put("name", deliverableData.get("name").asText());
        payload.put("description", deliverableData.get("description").asText());
        payload.set("variables", deliverableData.get("variables"));
        payload.set("tags", deliverableData.get("tags"));
        payload.put("fonts", deliverableData.get("fonts").asText());
        payload.put("defaultFont", deliverableData.get("defaultFont").asText());
        payload.put("replaceFonts", deliverableData.get("replaceFonts").asBoolean());
        payload.set("metadata", deliverableData.get("metadata"));

        System.out.println("Generating deliverable...");
        System.out.println("Template ID: " + templateId);
        System.out.println("Deliverable Name: " + payload.get("name").asText());
        System.out.println("Variables: " + payload.get("variables").size());

        String jsonBody = mapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/deliverable"))
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

        System.out.println("✅ Deliverable generated successfully!");
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
                .uri(URI.create(BASE_URL + "/deliverable/file/" + deliverableId))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Download failed: " + response.statusCode());
        }

        System.out.println("✅ File ready for download: " + filename);
        String contentType = response.headers().firstValue("content-type").orElse("N/A");
        String contentLength = response.headers().firstValue("content-length").orElse("N/A");
        System.out.println("📁 Content-Type: " + contentType);
        System.out.println("📊 Content-Length: " + contentLength + " bytes");

        // In a real application, you would save the file
        // Files.write(Paths.get(filename), response.body().getBytes());
    }

    /**
     * Example: Complex variable structure with all features
     */
    private static ArrayNode createComplexVariables(ObjectMapper mapper) {
        ArrayNode variables = mapper.createArrayNode();

        // Employee variable with subvariables
        ObjectNode employeeVar = mapper.createObjectNode();
        employeeVar.put("mimeType", "text");
        employeeVar.put("name", "Employee Name");
        employeeVar.put("placeholder", "{EmployeeName}");
        employeeVar.put("text", "John Smith");
        employeeVar.put("allowRichTextInjection", 0);
        employeeVar.put("autogenerated", false);
        employeeVar.put("count", 1);
        employeeVar.put("order", 1);

        ArrayNode empSubVars = mapper.createArrayNode();
        ObjectNode titleSub = mapper.createObjectNode();
        titleSub.put("placeholder", "{EmployeeName.Title}");
        titleSub.put("text", "Senior Software Engineer");
        empSubVars.add(titleSub);

        ObjectNode dateSub = mapper.createObjectNode();
        dateSub.put("placeholder", "{EmployeeName.StartDate}");
        dateSub.put("text", "January 15, 2024");
        empSubVars.add(dateSub);

        employeeVar.set("subvariables", empSubVars);

        ObjectNode empMetadata = mapper.createObjectNode();
        empMetadata.put("department", "Engineering");
        empMetadata.put("level", "Senior");
        employeeVar.set("metadata", empMetadata);

        employeeVar.put("aiPrompt", "Generate a professional job description for a senior software engineer role");

        variables.add(employeeVar);

        // Company Information variable
        ObjectNode companyVar = mapper.createObjectNode();
        companyVar.put("mimeType", "text");
        companyVar.put("name", "Company Information");
        companyVar.put("placeholder", "{CompanyInfo}");
        companyVar.put("text", "TechCorp Solutions Inc.");
        companyVar.put("allowRichTextInjection", 1);
        companyVar.put("autogenerated", false);
        companyVar.put("count", 1);
        companyVar.put("order", 2);

        ArrayNode compSubVars = mapper.createArrayNode();
        ObjectNode addressSub = mapper.createObjectNode();
        addressSub.put("placeholder", "{CompanyInfo.Address}");
        addressSub.put("text", "123 Innovation Drive, Tech City, TC 12345");
        compSubVars.add(addressSub);

        ObjectNode phoneSub = mapper.createObjectNode();
        phoneSub.put("placeholder", "{CompanyInfo.Phone}");
        phoneSub.put("text", "(555) 123-4567");
        compSubVars.add(phoneSub);

        companyVar.set("subvariables", compSubVars);
        companyVar.set("metadata", mapper.createObjectNode());
        companyVar.put("aiPrompt", "");

        variables.add(companyVar);

        return variables;
    }

    /**
     * Create metadata for the deliverable
     */
    private static ObjectNode createMetadata(ObjectMapper mapper) {
        ObjectNode metadata = mapper.createObjectNode();

        ArrayNode sessions = mapper.createArrayNode();
        ObjectNode session = mapper.createObjectNode();
        session.put("id", UUID.randomUUID().toString());
        session.put("starttime", Instant.now().toString());
        session.put("endtime", Instant.now().toString());
        sessions.add(session);

        metadata.set("sessions", sessions);
        metadata.put("createdBy", "HR Department");
        metadata.put("documentType", "Employment Contract");
        metadata.put("version", "v1.0");

        return metadata;
    }
}