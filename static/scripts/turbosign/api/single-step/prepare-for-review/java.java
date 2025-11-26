import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;

public class TurboSignPrepareForReview {

    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://api.turbodocx.com";

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void prepareDocumentForReview(File pdfFile) throws IOException {
        // Prepare recipients
        List<Map<String, Object>> recipients = new ArrayList<>();
        Map<String, Object> recipient1 = new HashMap<>();
        recipient1.put("name", "John Smith");
        recipient1.put("email", "john.smith@company.com");
        recipient1.put("signingOrder", 1);
        Map<String, Object> recipient2 = new HashMap<>();
        recipient2.put("name", "Jane Doe");
        recipient2.put("email", "jane.doe@partner.com");
        recipient2.put("signingOrder", 2);
        String recipientsJson = objectMapper.writeValueAsString(recipients);

        // Prepare fields - Coordinate-based
        List<Map<String, Object>> fields = new ArrayList<>();

        Map<String, Object> field1 = new HashMap<>();
        field1.put("recipientEmail", "john.smith@company.com");
        field1.put("type", "signature");
        field1.put("page", 1);
        field1.put("x", 100);
        field1.put("y", 200);
        field1.put("width", 200);
        field1.put("height", 80);
        field1.put("required", true);
        fields.add(field1);

        Map<String, Object> field2 = new HashMap<>();
        field2.put("recipientEmail", "john.smith@company.com");
        field2.put("type", "date");
        field2.put("page", 1);
        field2.put("x", 100);
        field2.put("y", 300);
        field2.put("width", 150);
        field2.put("height", 30);
        field2.put("required", true);
        fields.add(field2);

        Map<String, Object> field3 = new HashMap<>();
        field3.put("recipientEmail", "jane.doe@partner.com");
        field3.put("type", "signature");
        field3.put("page", 1);
        field3.put("x", 350);
        field3.put("y", 200);
        field3.put("width", 200);
        field3.put("height", 80);
        field3.put("required", true);
        fields.add(field3);

        String fieldsJson = objectMapper.writeValueAsString(fields);

        // Build multipart request
        RequestBody requestBody = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", pdfFile.getName(),
                RequestBody.create(pdfFile, MediaType.parse("application/pdf")))
            .addFormDataPart("documentName", "Contract Agreement")
            .addFormDataPart("documentDescription", "Please review and sign this contract")
            .addFormDataPart("senderName", "Your Company")
            .addFormDataPart("senderEmail", "sender@company.com")
            .addFormDataPart("recipients", recipientsJson)
            .addFormDataPart("fields", fieldsJson)
            .build();

        // Build request
        Request request = new Request.Builder()
            .url(BASE_URL + "/turbosign/single/prepare-for-review")
            .addHeader("Authorization", "Bearer " + API_TOKEN)
            .addHeader("x-rapiddocx-org-id", ORG_ID)
            .addHeader("User-Agent", "TurboDocx API Client")
            .post(requestBody)
            .build();

        // Execute request
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected response: " + response);
            }

            String responseBody = response.body().string();
            Map<String, Object> result = objectMapper.readValue(responseBody, Map.class);

            if ((Boolean) result.get("success")) {
                System.out.println("✅ Document prepared for review");
                System.out.println("Document ID: " + result.get("documentId"));
                System.out.println("Status: " + result.get("status"));
                System.out.println("Preview URL: " + result.get("previewUrl"));
                System.out.println("\n🔍 Open this URL to preview the document:");
                System.out.println(result.get("previewUrl"));
            } else {
                System.err.println("❌ Error: " + result.get("error"));
                if (result.containsKey("code")) {
                    System.err.println("Error Code: " + result.get("code"));
                }
            }
        }
    }

    public static void main(String[] args) {
        try {
            TurboSignPrepareForReview service = new TurboSignPrepareForReview();
            File pdfFile = new File("./contract.pdf");
            service.prepareDocumentForReview(pdfFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
