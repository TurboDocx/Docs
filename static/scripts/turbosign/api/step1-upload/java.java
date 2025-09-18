import java.io.*;
import java.net.http.*;
import java.nio.file.*;

public class TurboSignUpload {
    public static void main(String[] args) throws Exception {
        // Step 1: Upload Document
        HttpClient client = HttpClient.newHttpClient();
        
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
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://www.turbodocx.com/turbosign/documents/upload"))
            .header("Authorization", "Bearer YOUR_API_TOKEN")
            .header("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID")
            .header("User-Agent", "TurboDocx API Client")
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .POST(HttpRequest.BodyPublishers.ofByteArray(baos.toByteArray()))
            .build();
        
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}