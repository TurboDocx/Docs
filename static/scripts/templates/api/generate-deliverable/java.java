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
            deliverableData.put("name", "Contract - John Smith");
            deliverableData.put("description", "Simple contract example");
            deliverableData.set("variables", createSimpleVariables(mapper));
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
     * Example: Simple variable structure - easy to understand
     */
    private static ArrayNode createSimpleVariables(ObjectMapper mapper) {
        ArrayNode variables = mapper.createArrayNode();

        // Company Name variable
        ObjectNode companyVar = mapper.createObjectNode();
        companyVar.put("name", "Company Name");
        companyVar.put("placeholder", "{CompanyName}");
        companyVar.put("text", "Acme Corporation");
        variables.add(companyVar);

        // Employee Name variable
        ObjectNode employeeVar = mapper.createObjectNode();
        employeeVar.put("name", "Employee Name");
        employeeVar.put("placeholder", "{EmployeeName}");
        employeeVar.put("text", "John Smith");
        variables.add(employeeVar);

        // Date variable
        ObjectNode dateVar = mapper.createObjectNode();
        dateVar.put("name", "Date");
        dateVar.put("placeholder", "{Date}");
        dateVar.put("text", "January 15, 2024");
        variables.add(dateVar);

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