import java.io.*;
import java.net.http.*;
import java.net.URI;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.HashMap;

public class AIVariableGenerator {
    // Configuration
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://api.turbodocx.com";

    public static void main(String[] args) {
        try {
            generateAIVariable();
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    public static void generateAIVariable() throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        // Create payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("name", "Company Performance Summary");
        payload.put("placeholder", "{Q4Performance}");
        payload.put("aiHint", "Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements");
        payload.put("richTextEnabled", true);

        String jsonPayload = mapper.writeValueAsString(payload);

        // Create request
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/ai/generate/variable/one"))
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("x-rapiddocx-org-id", ORG_ID)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
            .build();

        // Send request
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("AI generation failed: " + response.statusCode());
        }

        System.out.println("Generated variable: " + response.body());
    }
}