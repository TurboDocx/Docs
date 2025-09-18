import java.net.http.*;
import java.net.URI;

public class TurboSignPrepare {
    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://www.turbodocx.com/turbosign";
    private static final String DOCUMENT_NAME = "Contract Agreement";
    public static void main(String[] args) throws Exception {
        // Step 3: Prepare for Signing
        String documentId = "4a20eca5-7944-430c-97d5-fcce4be24296";
        
        HttpClient client = HttpClient.newHttpClient();
        
        String payload = """
        [
          {
            "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
            "type": "signature",
            "template": {
              "anchor": "{Signature1}",
              "placement": "replace",
              "size": { "width": 200, "height": 80 },
              "offset": { "x": 0, "y": 0 },
              "caseSensitive": true,
              "useRegex": false
            },
            "defaultValue": "",
            "required": true
          },
          {
            "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
            "type": "date",
            "template": {
              "anchor": "{Date1}",
              "placement": "replace",
              "size": { "width": 150, "height": 30 },
              "offset": { "x": 0, "y": 0 },
              "caseSensitive": true,
              "useRegex": false
            },
            "defaultValue": "",
            "required": true
          },
          {
            "recipientId": "a8b9c1d2-3456-7890-abcd-ef1234567890",
            "type": "signature",
            "template": {
              "anchor": "{Signature2}",
              "placement": "replace",
              "size": { "width": 200, "height": 80 },
              "offset": { "x": 0, "y": 0 },
              "caseSensitive": true,
              "useRegex": false
            },
            "defaultValue": "",
            "required": true
          },
          {
            "recipientId": "a8b9c1d2-3456-7890-abcd-ef1234567890",
            "type": "text",
            "template": {
              "anchor": "{Title2}",
              "placement": "replace",
              "size": { "width": 200, "height": 30 },
              "offset": { "x": 0, "y": 0 },
              "caseSensitive": true,
              "useRegex": false
            },
            "defaultValue": "Business Partner",
            "required": false
          }
        ]
        """;
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/documents/" + documentId + "/prepare-for-signing"))
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