import java.io.*;
import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

/**
 * Complete Workflow: Upload → Generate → Download
 * Simple 3-step process for document generation
 */
public class TemplateWorkflowManager {
    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://api.turbodocx.com";

    private final HttpClient client;
    private final ObjectMapper mapper;

    public TemplateWorkflowManager() {
        this.client = HttpClient.newHttpClient();
        this.mapper = new ObjectMapper();
    }

    // Step 1: Upload template file
    public JsonNode uploadTemplate(String templateFilePath) throws Exception {
        String boundary = "----WebKitFormBoundary" + System.currentTimeMillis();
        byte[] templateBytes = Files.readAllBytes(Paths.get(templateFilePath));

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8), true);

        // Add template file
        writer.append("--" + boundary).append("\r\n");
        writer.append("Content-Disposition: form-data; name=\"templateFile\"; filename=\"template.docx\"").append("\r\n");
        writer.append("Content-Type: application/octet-stream").append("\r\n\r\n");
        writer.flush();
        outputStream.write(templateBytes);
        writer.append("\r\n");

        // Add name field
        writer.append("--" + boundary).append("\r\n");
        writer.append("Content-Disposition: form-data; name=\"name\"").append("\r\n\r\n");
        writer.append("Simple Template").append("\r\n");

        // Add description field
        writer.append("--" + boundary).append("\r\n");
        writer.append("Content-Disposition: form-data; name=\"description\"").append("\r\n\r\n");
        writer.append("Template uploaded for document generation").append("\r\n");

        writer.append("--" + boundary + "--").append("\r\n");
        writer.close();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/template/upload-and-create"))
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("x-rapiddocx-org-id", ORG_ID)
            .header("User-Agent", "TurboDocx API Client")
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .POST(HttpRequest.BodyPublishers.ofByteArray(outputStream.toByteArray()))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Upload failed: " + response.statusCode());
        }

        JsonNode result = mapper.readTree(response.body());
        JsonNode template = result.get("data").get("results").get("template");

        System.out.printf("✅ Template uploaded: %s (%s)%n",
            template.get("name").asText(), template.get("id").asText());

        return template;
    }

    // Step 2: Generate deliverable with simple variables
    public JsonNode generateDeliverable(String templateId) throws Exception {
        ArrayNode variables = mapper.createArrayNode();

        ObjectNode companyVar = mapper.createObjectNode();
        companyVar.put("mimeType", "text");
        companyVar.put("name", "Company Name");
        companyVar.put("placeholder", "{CompanyName}");
        companyVar.put("text", "Acme Corporation");
        variables.add(companyVar);

        ObjectNode employeeVar = mapper.createObjectNode();
        employeeVar.put("mimeType", "text");
        employeeVar.put("name", "Employee Name");
        employeeVar.put("placeholder", "{EmployeeName}");
        employeeVar.put("text", "John Smith");
        variables.add(employeeVar);

        ObjectNode dateVar = mapper.createObjectNode();
        dateVar.put("mimeType", "text");
        dateVar.put("name", "Date");
        dateVar.put("placeholder", "{Date}");
        dateVar.put("text", "January 15, 2024");
        variables.add(dateVar);

        ObjectNode payload = mapper.createObjectNode();
        payload.put("templateId", templateId);
        payload.put("name", "Generated Document");
        payload.put("description", "Simple document example");
        payload.set("variables", variables);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/deliverable"))
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("x-rapiddocx-org-id", ORG_ID)
            .header("User-Agent", "TurboDocx API Client")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Generation failed: " + response.statusCode());
        }

        JsonNode result = mapper.readTree(response.body());
        JsonNode deliverable = result.get("data").get("results").get("deliverable");

        System.out.printf("✅ Document generated: %s (%s)%n",
            deliverable.get("name").asText(), deliverable.get("id").asText());

        return deliverable;
    }

    // Step 3: Download generated file
    public void downloadFile(String deliverableId, String filename) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/deliverable/file/" + deliverableId))
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("x-rapiddocx-org-id", ORG_ID)
            .header("User-Agent", "TurboDocx API Client")
            .GET()
            .build();

        HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Download failed: " + response.statusCode());
        }

        System.out.printf("✅ File ready for download: %s%n", filename);

        // In a real application, you would save the file:
        // Files.write(Paths.get(filename), response.body());
    }

    // Complete workflow: Upload → Generate → Download
    public void completeWorkflow(String templateFilePath) throws Exception {
        System.out.println("🚀 Starting complete workflow...");

        // Step 1: Upload template
        System.out.println("\n📤 Step 1: Uploading template...");
        JsonNode template = uploadTemplate(templateFilePath);

        // Step 2: Generate deliverable
        System.out.println("\n📝 Step 2: Generating document...");
        JsonNode deliverable = generateDeliverable(template.get("id").asText());

        // Step 3: Download file
        System.out.println("\n📥 Step 3: Downloading file...");
        String filename = deliverable.get("name").asText() + ".docx";
        downloadFile(deliverable.get("id").asText(), filename);

        System.out.println("\n✅ Workflow complete!");
        System.out.printf("Template: %s%n", template.get("id").asText());
        System.out.printf("Document: %s%n", deliverable.get("id").asText());
        System.out.printf("File: %s%n", filename);
    }

    // Example usage
    public static void main(String[] args) {
        try {
            TemplateWorkflowManager manager = new TemplateWorkflowManager();

            // Replace with your template file path
            String templatePath = "./template.docx";
            manager.completeWorkflow(templatePath);

        } catch (Exception e) {
            System.err.printf("❌ Workflow failed: %s%n", e.getMessage());
            e.printStackTrace();
        }
    }
}