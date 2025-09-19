import java.io.*;
import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

/**
 * Complete Template Generation Workflows
 * Demonstrates both Path A (Upload) and Path B (Browse/Select) followed by generation
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

    public static void main(String[] args) throws Exception {
        TemplateWorkflowManager workflow = new TemplateWorkflowManager();

        try {
            // Demo Path B (Browse existing templates)
            workflow.demoPathB();

            // Uncomment to demo Path A (requires template file):
            // workflow.demoPathA("./path/to/your/template.docx");

            // Uncomment to run full comparison:
            // workflow.demoComparison();

        } catch (Exception e) {
            System.err.println("Workflow demo failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ===============================
    // PATH A: Upload New Template
    // ===============================

    /**
     * Complete Path A workflow: Upload → Generate
     */
    public TemplateWorkflowResult pathA_UploadAndGenerate(String templateFilePath, String deliverableName) throws Exception {
        System.out.println("🔄 PATH A: Upload New Template → Generate Deliverable");
        System.out.println("=".repeat(48));

        try {
            // Step 1: Upload and create template
            System.out.println("\n📤 Step 1: Uploading template...");
            JsonNode template = uploadTemplate(templateFilePath);

            // Step 2: Generate deliverable using uploaded template
            System.out.println("\n📝 Step 2: Generating deliverable...");
            JsonNode deliverable = generateDeliverable(template.get("id").asText(),
                    createDeliverableData(deliverableName, "Generated from uploaded template: " + template.get("name").asText()));

            System.out.println("\n✅ PATH A COMPLETE!");
            System.out.println("Template ID: " + template.get("id").asText());
            System.out.println("Deliverable ID: " + deliverable.get("id").asText());

            // Download the generated file
            downloadDeliverable(deliverable.get("id").asText(), deliverable.get("name").asText() + ".docx");

            return new TemplateWorkflowResult(template, deliverable, null);

        } catch (Exception e) {
            System.err.println("❌ Path A failed: " + e.getMessage());
            throw e;
        }
    }

    private JsonNode uploadTemplate(String templateFilePath) throws Exception {
        Path filePath = Paths.get(templateFilePath);
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("Template file not found: " + templateFilePath);
        }

        String boundary = "----JavaBoundary" + System.currentTimeMillis();
        byte[] fileBytes = Files.readAllBytes(filePath);

        // Build multipart form data
        StringBuilder formData = new StringBuilder();
        formData.append("--").append(boundary).append("\r\n");
        formData.append("Content-Disposition: form-data; name=\"templateFile\"; filename=\"")
                .append(filePath.getFileName().toString()).append("\"\r\n");
        formData.append("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n");

        String additionalFields = "\r\n--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"name\"\r\n\r\n" +
                "API Upload Template" +
                "\r\n--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"description\"\r\n\r\n" +
                "Template uploaded via API for testing" +
                "\r\n--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"variables\"\r\n\r\n" +
                "[]" +
                "\r\n--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"tags\"\r\n\r\n" +
                "[\"api\", \"test\", \"upload\"]" +
                "\r\n--" + boundary + "--\r\n";

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        baos.write(formData.toString().getBytes());
        baos.write(fileBytes);
        baos.write(additionalFields.getBytes());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/template/upload-and-create"))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(baos.toByteArray()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Upload failed: " + response.statusCode());
        }

        JsonNode result = mapper.readTree(response.body());
        JsonNode template = result.get("data").get("results").get("template");

        System.out.println("✅ Template uploaded: " + template.get("name").asText() + " (" + template.get("id").asText() + ")");

        JsonNode variables = template.get("variables");
        int variableCount = (variables != null && !variables.isNull()) ? variables.size() : 0;
        System.out.println("📊 Variables extracted: " + variableCount);

        System.out.println("🔤 Default font: " + template.get("defaultFont").asText());

        JsonNode fonts = template.get("fonts");
        int fontCount = (fonts != null && !fonts.isNull()) ? fonts.size() : 0;
        System.out.println("📝 Fonts used: " + fontCount);

        return template;
    }

    // ===============================
    // PATH B: Browse and Select
    // ===============================

    /**
     * Complete Path B workflow: Browse → Select → Generate
     */
    public TemplateWorkflowResult pathB_BrowseAndGenerate(String searchQuery, String deliverableName) throws Exception {
        System.out.println("🔍 PATH B: Browse Existing Templates → Generate Deliverable");
        System.out.println("=".repeat(56));

        try {
            // Step 1: Browse templates
            System.out.println("\n🔍 Step 1: Browsing templates...");
            JsonNode browseResult = browseTemplates(searchQuery);

            // Step 2: Select first available template
            JsonNode selectedTemplate = null;
            for (JsonNode item : browseResult.get("results")) {
                if ("template".equals(item.get("type").asText())) {
                    selectedTemplate = item;
                    break;
                }
            }

            if (selectedTemplate == null) {
                throw new RuntimeException("No templates found in browse results");
            }

            System.out.println("📋 Selected: " + selectedTemplate.get("name").asText() +
                               " (" + selectedTemplate.get("id").asText() + ")");

            // Step 3: Get template details
            System.out.println("\n📖 Step 2: Getting template details...");
            JsonNode templateDetails = getTemplateDetails(selectedTemplate.get("id").asText());

            // Step 4: Get PDF preview (optional)
            System.out.println("\n🖼️  Step 3: Getting PDF preview...");
            String pdfPreview = getTemplatePDFPreview(selectedTemplate.get("id").asText());

            // Step 5: Generate deliverable
            System.out.println("\n📝 Step 4: Generating deliverable...");
            JsonNode deliverable = generateDeliverable(templateDetails.get("id").asText(),
                    createDeliverableData(deliverableName, "Generated from existing template: " + templateDetails.get("name").asText()));

            System.out.println("\n✅ PATH B COMPLETE!");
            System.out.println("Template ID: " + templateDetails.get("id").asText());
            System.out.println("Deliverable ID: " + deliverable.get("id").asText());
            System.out.println("PDF Preview: " + pdfPreview);

            // Download the generated file
            System.out.println("\n📥 Step 5: Downloading file...");
            downloadDeliverable(deliverable.get("id").asText(), deliverable.get("name").asText() + ".docx");

            return new TemplateWorkflowResult(templateDetails, deliverable, pdfPreview);

        } catch (Exception e) {
            System.err.println("❌ Path B failed: " + e.getMessage());
            throw e;
        }
    }

    private JsonNode browseTemplates(String query) throws Exception {
        StringBuilder params = new StringBuilder();
        params.append("limit=25&offset=0&showTags=true");

        if (query != null && !query.isEmpty()) {
            params.append("&query=").append(URLEncoder.encode(query, StandardCharsets.UTF_8));
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/template-item?" + params.toString()))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Browse failed: " + response.statusCode());
        }

        JsonNode result = mapper.readTree(response.body());
        JsonNode data = result.get("data");

        System.out.println("🔍 Found " + data.get("totalRecords").asInt() + " templates/folders");

        return data;
    }

    private JsonNode getTemplateDetails(String templateId) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/template/" + templateId))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Template details failed: " + response.statusCode());
        }

        JsonNode result = mapper.readTree(response.body());
        JsonNode template = result.get("data").get("results");

        JsonNode variables = template.get("variables");
        int variableCount = (variables != null && !variables.isNull()) ? variables.size() : 0;
        System.out.println("📊 Variables: " + variableCount);

        String defaultFont = template.has("defaultFont") ? template.get("defaultFont").asText() : "N/A";
        System.out.println("🔤 Default font: " + defaultFont);

        return template;
    }

    private String getTemplatePDFPreview(String templateId) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/template/" + templateId + "/previewpdflink"))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("PDF preview failed: " + response.statusCode());
        }

        JsonNode result = mapper.readTree(response.body());
        String pdfUrl = result.get("results").asText();

        System.out.println("🖼️  PDF Preview available: " + pdfUrl);

        return pdfUrl;
    }

    // ===============================
    // COMMON: Generate Deliverable
    // ===============================

    private JsonNode generateDeliverable(String templateId, ObjectNode deliverableData) throws Exception {
        ObjectNode payload = mapper.createObjectNode();
        payload.put("templateId", templateId);
        payload.put("name", deliverableData.get("name").asText());
        payload.put("description", deliverableData.get("description").asText());
        payload.set("variables", deliverableData.get("variables"));
        payload.set("tags", deliverableData.get("tags"));
        payload.put("fonts", "[]");
        payload.put("defaultFont", "Arial");
        payload.put("replaceFonts", true);
        payload.set("metadata", createMetadata());

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
            throw new RuntimeException("Deliverable generation failed: " + response.statusCode() + " - " + response.body());
        }

        JsonNode result = mapper.readTree(response.body());
        JsonNode deliverable = result.get("data").get("results").get("deliverable");

        System.out.println("✅ Generated: " + deliverable.get("name").asText());
        System.out.println("📄 Created by: " + deliverable.get("createdBy").asText());
        System.out.println("📅 Created on: " + deliverable.get("createdOn").asText());

        return deliverable;
    }

    private void downloadDeliverable(String deliverableId, String filename) throws Exception {
        System.out.println("📥 Downloading file: " + filename);

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
    }

    // ===============================
    // UTILITY FUNCTIONS
    // ===============================

    private ObjectNode createDeliverableData(String name, String description) {
        ObjectNode data = mapper.createObjectNode();
        data.put("name", name);
        data.put("description", description);
        data.set("variables", createSampleVariables());

        ArrayNode tags = mapper.createArrayNode();
        tags.add("api-generated");
        data.set("tags", tags);

        return data;
    }

    private ArrayNode createSampleVariables() {
        ArrayNode variables = mapper.createArrayNode();

        ObjectNode variable = mapper.createObjectNode();
        variable.put("mimeType", "text");
        variable.put("name", "Sample Variable");
        variable.put("placeholder", "{SampleVariable}");
        variable.put("text", "Sample Content from Java Workflow");
        variable.put("allowRichTextInjection", 0);
        variable.put("autogenerated", false);
        variable.put("count", 1);
        variable.put("order", 1);
        variable.set("subvariables", mapper.createArrayNode());

        ObjectNode metadata = mapper.createObjectNode();
        metadata.put("generatedBy", "Java Workflow");
        variable.set("metadata", metadata);

        variable.put("aiPrompt", "");

        variables.add(variable);
        return variables;
    }

    private ObjectNode createMetadata() {
        ObjectNode metadata = mapper.createObjectNode();

        ArrayNode sessions = mapper.createArrayNode();
        ObjectNode session = mapper.createObjectNode();
        session.put("id", UUID.randomUUID().toString());
        session.put("starttime", Instant.now().toString());
        session.put("endtime", Instant.now().toString());
        sessions.add(session);

        metadata.set("sessions", sessions);
        metadata.put("workflow", "Java Complete Workflow");
        metadata.put("generated", Instant.now().toString());

        return metadata;
    }

    // ===============================
    // DEMO FUNCTIONS
    // ===============================

    public TemplateWorkflowResult demoPathA(String templateFilePath) throws Exception {
        System.out.println("🚀 DEMO: Path A - Upload New Template Workflow");
        System.out.println("=".repeat(45));
        System.out.println();

        return pathA_UploadAndGenerate(templateFilePath, "Contract Generated via Path A - API Upload");
    }

    public TemplateWorkflowResult demoPathB() throws Exception {
        System.out.println("🚀 DEMO: Path B - Browse Existing Template Workflow");
        System.out.println("=".repeat(51));
        System.out.println();

        return pathB_BrowseAndGenerate("contract", "Contract Generated via Path B - Browse & Select");
    }

    public void demoComparison() throws Exception {
        System.out.println("🚀 DEMO: Complete Workflow Comparison");
        System.out.println("=".repeat(36));
        System.out.println();

        try {
            System.out.println("Testing both paths with the same template type...\\n");

            // Run Path B first (browse existing)
            TemplateWorkflowResult pathBResult = demoPathB();

            System.out.println("\\n" + "=".repeat(60) + "\\n");

            // For Path A, we'd need a template file
            System.out.println("📝 Path A requires a template file to upload.");
            System.out.println("   Example: workflow.demoPathA(\"./contract-template.docx\")");

        } catch (Exception e) {
            System.err.println("Demo comparison failed: " + e.getMessage());
        }
    }

    // Result container class
    public static class TemplateWorkflowResult {
        public final JsonNode template;
        public final JsonNode deliverable;
        public final String pdfPreview;

        public TemplateWorkflowResult(JsonNode template, JsonNode deliverable, String pdfPreview) {
            this.template = template;
            this.deliverable = deliverable;
            this.pdfPreview = pdfPreview;
        }
    }
}