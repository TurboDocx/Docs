import java.io.*;
import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Path A: Upload and Create Template
 * Uploads a .docx/.pptx template and extracts variables automatically
 */
public class TemplateUpload {
    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://api.turbodocx.com";
    private static final String TEMPLATE_NAME = "Employee Contract Template";

    public static void main(String[] args) throws Exception {
        try {
            JsonNode result = uploadTemplate("./contract-template.docx");
            JsonNode template = result.get("data").get("results").get("template");

            System.out.println("Template uploaded successfully: " + template.get("id").asText());
            System.out.println("Template name: " + template.get("name").asText());

            // Handle nullable variables field
            JsonNode variables = template.get("variables");
            int variableCount = (variables != null && !variables.isNull()) ? variables.size() : 0;
            System.out.println("Variables extracted: " + variableCount);

            System.out.println("Default font: " + template.get("defaultFont").asText());

            // Handle nullable fonts field
            JsonNode fonts = template.get("fonts");
            int fontCount = (fonts != null && !fonts.isNull()) ? fonts.size() : 0;
            System.out.println("Fonts used: " + fontCount);

            System.out.println("Redirect to: " + result.get("data").get("results").get("redirectUrl").asText());
            System.out.println("Ready to generate documents with template: " + template.get("id").asText());

        } catch (Exception e) {
            System.err.println("Upload failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static JsonNode uploadTemplate(String templateFilePath) throws Exception {
        // Check if file exists
        Path filePath = Paths.get(templateFilePath);
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("Template file not found: " + templateFilePath);
        }

        HttpClient client = HttpClient.newHttpClient();
        String boundary = "----JavaBoundary" + System.currentTimeMillis();
        byte[] fileBytes = Files.readAllBytes(filePath);

        // Build multipart form data
        StringBuilder formData = new StringBuilder();

        // Template file field
        formData.append("--").append(boundary).append("\r\n");
        formData.append("Content-Disposition: form-data; name=\"templateFile\"; filename=\"")
                .append(filePath.getFileName().toString()).append("\"\r\n");
        formData.append("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n");

        // Name field
        String nameField = "\r\n--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"name\"\r\n\r\n" +
                TEMPLATE_NAME;

        // Description field
        String descField = "\r\n--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"description\"\r\n\r\n" +
                "Standard employee contract with variable placeholders";

        // Variables field
        String varsField = "\r\n--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"variables\"\r\n\r\n" +
                "[]";

        // Tags field
        String tagsField = "\r\n--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"tags\"\r\n\r\n" +
                "[\"hr\", \"contract\", \"template\"]";

        String endBoundary = "\r\n--" + boundary + "--\r\n";

        // Combine all parts
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        baos.write(formData.toString().getBytes());
        baos.write(fileBytes);
        baos.write(nameField.getBytes());
        baos.write(descField.getBytes());
        baos.write(varsField.getBytes());
        baos.write(tagsField.getBytes());
        baos.write(endBoundary.getBytes());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/template/upload-and-create"))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(baos.toByteArray()))
                .timeout(java.time.Duration.ofMinutes(2))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP error " + response.statusCode() + ": " + response.body());
        }

        // Parse JSON response
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readTree(response.body());
    }
}