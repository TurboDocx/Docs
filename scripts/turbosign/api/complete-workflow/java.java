import java.io.*;
import java.net.http.*;
import java.net.URI;
import java.nio.file.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class TurboSignWorkflow {
    public static void main(String[] args) throws Exception {
        // Complete Workflow: Upload → Recipients → Prepare
        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper mapper = new ObjectMapper();
        
        // Step 1: Upload Document
        String boundary = "----JavaBoundary" + System.currentTimeMillis();
        String fileName = "./document.pdf";
        byte[] fileBytes = Files.readAllBytes(Paths.get(fileName));
        
        StringBuilder formData = new StringBuilder();
        formData.append("--").append(boundary).append("\r\n");
        formData.append("Content-Disposition: form-data; name=\"name\"\r\n\r\n");
        formData.append("Contract Agreement\r\n");
        formData.append("--").append(boundary).append("\r\n");
        formData.append("Content-Disposition: form-data; name=\"file\"; filename=\"document.pdf\"\r\n");
        formData.append("Content-Type: application/pdf\r\n\r\n");
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        baos.write(formData.toString().getBytes());
        baos.write(fileBytes);
        baos.write(("\r\n--" + boundary + "--\r\n").getBytes());
        
        HttpRequest uploadRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://www.turbodocx.com/turbosign/documents/upload"))
            .header("Authorization", "Bearer YOUR_API_TOKEN")
            .header("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID")
            .header("origin", "https://www.turbodocx.com")
            .header("referer", "https://www.turbodocx.com")
            .header("accept", "application/json, text/plain, */*")
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .POST(HttpRequest.BodyPublishers.ofByteArray(baos.toByteArray()))
            .build();
        
        HttpResponse<String> uploadResponse = client.send(uploadRequest, HttpResponse.BodyHandlers.ofString());
        JsonNode uploadResult = mapper.readTree(uploadResponse.body());
        String documentId = uploadResult.get("data").get("id").asText();
        
        // Step 2: Add Recipients
        String recipientPayload = String.format("""
        {
          "document": {
            "name": "Contract Agreement - Updated",
            "description": "This document requires electronic signatures from both parties. Please review all content carefully before signing."
          },
          "recipients": [
            {
              "name": "John Smith",
              "email": "john.smith@company.com",
              "signingOrder": 1,
              "metadata": {
                "color": "hsl(200, 75%%, 50%%)",
                "lightColor": "hsl(200, 75%%, 93%%)"
              },
              "documentId": "%s"
            },
            {
              "name": "Jane Doe",
              "email": "jane.doe@partner.com",
              "signingOrder": 2,
              "metadata": {
                "color": "hsl(270, 75%%, 50%%)",
                "lightColor": "hsl(270, 75%%, 93%%)"
              },
              "documentId": "%s"
            }
          ]
        }
        """, documentId, documentId);
        
        HttpRequest recipientRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://www.turbodocx.com/turbosign/documents/" + documentId + "/update-with-recipients"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer YOUR_API_TOKEN")
            .header("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID")
            .header("origin", "https://www.turbodocx.com")
            .header("referer", "https://www.turbodocx.com")
            .header("accept", "application/json, text/plain, */*")
            .POST(HttpRequest.BodyPublishers.ofString(recipientPayload))
            .build();
        
        HttpResponse<String> recipientResponse = client.send(recipientRequest, HttpResponse.BodyHandlers.ofString());
        JsonNode recipientResult = mapper.readTree(recipientResponse.body());
        JsonNode recipients = recipientResult.get("data").get("recipients");
        
        // Step 3: Prepare for Signing
        String signaturePayload = String.format("""
        [
          {
            "recipientId": "%s",
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
            "recipientId": "%s",
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
            "recipientId": "%s",
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
            "recipientId": "%s",
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
        """, 
        recipients.get(0).get("id").asText(),
        recipients.get(0).get("id").asText(),
        recipients.get(1).get("id").asText(),
        recipients.get(1).get("id").asText());
        
        HttpRequest prepareRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://www.turbodocx.com/turbosign/documents/" + documentId + "/prepare-for-signing"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer YOUR_API_TOKEN")
            .header("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID")
            .header("origin", "https://www.turbodocx.com")
            .header("referer", "https://www.turbodocx.com")
            .header("accept", "application/json, text/plain, */*")
            .POST(HttpRequest.BodyPublishers.ofString(signaturePayload))
            .build();
        
        HttpResponse<String> prepareResponse = client.send(prepareRequest, HttpResponse.BodyHandlers.ofString());
        System.out.println(prepareResponse.body());
    }
}