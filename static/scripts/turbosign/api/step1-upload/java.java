import java.io.*;
import java.net.http.*;
import java.nio.file.*;

public class TurboSignUpload {
    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://api.turbodocx.com";
    private static final String DOCUMENT_NAME = "Contract Agreement";
    public static void main(String[] args) throws Exception {
        // Step 1: Upload Document
        HttpClient client = HttpClient.newHttpClient();
        
        String boundary = "----JavaBoundary" + System.currentTimeMillis();
        String fileName = "./document.pdf";
        byte[] fileBytes = Files.readAllBytes(Paths.get(fileName));
        
        StringBuilder formData = new StringBuilder();
        formData.append("--").append(boundary).append("\r\n");
        formData.append("Content-Disposition: form-data; name=\"name\"\r\n\r\n");
        formData.append(DOCUMENT_NAME + "\r\n");
        formData.append("--").append(boundary).append("\r\n");
        formData.append("Content-Disposition: form-data; name=\"file\"; filename=\"document.pdf\"\r\n");
        formData.append("Content-Type: application/pdf\r\n\r\n");
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        baos.write(formData.toString().getBytes());
        baos.write(fileBytes);
        baos.write(("\r\n--" + boundary + "--\r\n").getBytes());
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/documents/upload"))
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("x-rapiddocx-org-id", ORG_ID)
            .header("User-Agent", "TurboDocx API Client")
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .POST(HttpRequest.BodyPublishers.ofByteArray(baos.toByteArray()))
            .build();
        
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}