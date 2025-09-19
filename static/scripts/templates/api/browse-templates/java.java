import java.io.*;
import java.net.URI;
import java.net.http.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Path B: Browse and Select Existing Templates
 */
public class TemplateBrowser {
    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://api.turbodocx.com";

    public static void main(String[] args) throws Exception {
        try {
            System.out.println("=== Path B: Browse and Select Template ===");

            // Step 1: Browse templates
            System.out.println("\n1. Browsing templates...");
            JsonNode browseResult = browseTemplates(10, 0, "contract", true, null);

            // Find a template (not a folder)
            JsonNode selectedTemplate = null;
            for (JsonNode item : browseResult.get("results")) {
                if ("template".equals(item.get("type").asText())) {
                    selectedTemplate = item;
                    break;
                }
            }

            if (selectedTemplate == null) {
                System.out.println("No templates found in browse results");
                return;
            }

            System.out.println("\nSelected template: " + selectedTemplate.get("name").asText() +
                               " (" + selectedTemplate.get("id").asText() + ")");

            // Step 2: Get detailed template information
            System.out.println("\n2. Getting template details...");
            JsonNode templateDetails = getTemplateDetails(selectedTemplate.get("id").asText());

            // Step 3: Get PDF preview (optional)
            System.out.println("\n3. Getting PDF preview...");
            String pdfPreview = getTemplatePDFPreview(selectedTemplate.get("id").asText());

            System.out.println("\n=== Template Ready for Generation ===");
            System.out.println("Template ID: " + templateDetails.get("id").asText());

            JsonNode variables = templateDetails.get("variables");
            int variableCount = (variables != null && !variables.isNull()) ? variables.size() : 0;
            System.out.println("Variables available: " + variableCount);
            System.out.println("PDF Preview: " + pdfPreview);

        } catch (Exception e) {
            System.err.println("Browsing workflow failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Step 1: Browse Templates and Folders
     */
    private static JsonNode browseTemplates(int limit, int offset, String query,
                                          boolean showTags, String[] selectedTags) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        // Build query parameters
        StringBuilder params = new StringBuilder();
        params.append("limit=").append(limit);
        params.append("&offset=").append(offset);
        params.append("&showTags=").append(showTags);

        if (query != null && !query.isEmpty()) {
            params.append("&query=").append(URLEncoder.encode(query, StandardCharsets.UTF_8));
        }

        if (selectedTags != null) {
            for (String tag : selectedTags) {
                params.append("&selectedTags[]=").append(URLEncoder.encode(tag, StandardCharsets.UTF_8));
            }
        }

        String url = BASE_URL + "/template-item?" + params.toString();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP error " + response.statusCode() + ": " + response.body());
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode result = mapper.readTree(response.body());
        JsonNode data = result.get("data");

        System.out.println("Found " + data.get("totalRecords").asInt() + " templates/folders");

        return data;
    }

    /**
     * Step 2: Get Template Details by ID
     */
    private static JsonNode getTemplateDetails(String templateId) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/template/" + templateId))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP error " + response.statusCode() + ": " + response.body());
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode result = mapper.readTree(response.body());
        JsonNode template = result.get("data").get("results");

        System.out.println("Template: " + template.get("name").asText());

        JsonNode variables = template.get("variables");
        int variableCount = (variables != null && !variables.isNull()) ? variables.size() : 0;
        System.out.println("Variables: " + variableCount);

        String defaultFont = template.has("defaultFont") ? template.get("defaultFont").asText() : "N/A";
        System.out.println("Default font: " + defaultFont);

        return template;
    }

    /**
     * Step 3: Get PDF Preview Link (Optional)
     */
    private static String getTemplatePDFPreview(String templateId) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/template/" + templateId + "/previewpdflink"))
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("x-rapiddocx-org-id", ORG_ID)
                .header("User-Agent", "TurboDocx API Client")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP error " + response.statusCode() + ": " + response.body());
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode result = mapper.readTree(response.body());
        String pdfUrl = result.get("results").asText();

        System.out.println("PDF Preview: " + pdfUrl);

        return pdfUrl;
    }
}