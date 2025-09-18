import java.net.http.*;
import java.net.URI;

public class TurboSignRecipients {
    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://www.turbodocx.com/turbosign";
    private static final String DOCUMENT_NAME = "Contract Agreement";
    public static void main(String[] args) throws Exception {
        // Step 2: Add Recipients
        String documentId = "4a20eca5-7944-430c-97d5-fcce4be24296";
        
        HttpClient client = HttpClient.newHttpClient();
        
        String payload = """
        {
          "document": {
            "name": "" + DOCUMENT_NAME + " - Updated",
            "description": "This document requires electronic signatures from both parties. Please review all content carefully before signing."
          },
          "recipients": [
            {
              "name": "John Smith",
              "email": "john.smith@company.com",
              "signingOrder": 1,
              "metadata": {
                "color": "hsl(200, 75%, 50%)",
                "lightColor": "hsl(200, 75%, 93%)"
              },
              "documentId": "%s"
            },
            {
              "name": "Jane Doe",
              "email": "jane.doe@partner.com",
              "signingOrder": 2,
              "metadata": {
                "color": "hsl(270, 75%, 50%)",
                "lightColor": "hsl(270, 75%, 93%)"
              },
              "documentId": "%s"
            }
          ]
        }
        """.formatted(documentId, documentId);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/documents/" + documentId + "/update-with-recipients"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("x-rapiddocx-org-id", ORG_ID)
            .header("User-Agent", "TurboDocx API Client")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();
        
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}