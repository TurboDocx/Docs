import java.io.*;
import java.net.http.*;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;

public class FileAttachmentExamples {
    // Configuration - Update these values
    private static final String API_TOKEN = "YOUR_API_TOKEN";
    private static final String ORG_ID = "YOUR_ORGANIZATION_ID";
    private static final String BASE_URL = "https://api.turbodocx.com";

    private static final ObjectMapper mapper = new ObjectMapper();

    public static void main(String[] args) {
        System.out.println("🚀 TurboDocx Java File Attachment Examples");
        System.out.println("===========================================");

        if ("YOUR_API_TOKEN".equals(API_TOKEN) || "YOUR_ORGANIZATION_ID".equals(ORG_ID)) {
            System.err.println("❌ Please update API_TOKEN and ORG_ID in the source code.");
            System.exit(1);
        }

        System.out.println("Note: Ensure the following files exist in the current directory:");
        System.out.println("  • financial-report-template.docx - Your Word template file");
        System.out.println("  • q4-financial-data.xlsx - Excel file with financial data");
        System.out.println("  • comprehensive-report-template.docx - Multi-purpose template");
        System.out.println("  • business-data.xlsx - Excel file with multiple sheets");
        System.out.println();

        try {
            // Example 1: Single sheet data attachment
            uploadTemplateWithDataFile();
            System.out.println("✅ Example 1 completed successfully!\n");

            // Example 2: Multiple sheet data attachment
            uploadTemplateWithMultipleSheets();
            System.out.println("✅ Example 2 completed successfully!");

            System.out.println("\n🎉 All Java file attachment examples completed!");
            System.out.println("Ready to generate documents with data-enhanced templates!");

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static void uploadTemplateWithDataFile() throws Exception {
        System.out.println("📊 Java: Upload template with Excel data file attachment");
        System.out.println("======================================================");

        String templateFile = "./financial-report-template.docx";
        String dataFile = "./q4-financial-data.xlsx";

        // Check if files exist
        if (!Files.exists(Paths.get(templateFile))) {
            throw new FileNotFoundException("Template file not found: " + templateFile);
        }
        if (!Files.exists(Paths.get(dataFile))) {
            throw new FileNotFoundException("Data file not found: " + dataFile);
        }

        String dataFileId = "java-data-123";
        String boundary = "----JavaBoundary" + System.currentTimeMillis();

        // Create multipart form data
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(baos, "UTF-8"), true);

        // Add template file
        writer.append("--").append(boundary).append("\r\n");
        writer.append("Content-Disposition: form-data; name=\"templateFile\"; filename=\"")
               .append(Paths.get(templateFile).getFileName().toString()).append("\"\r\n");
        writer.append("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n");
        writer.flush();
        baos.write(Files.readAllBytes(Paths.get(templateFile)));
        writer.append("\r\n");

        // Add data file
        writer.append("--").append(boundary).append("\r\n");
        writer.append("Content-Disposition: form-data; name=\"FileResource-").append(dataFileId)
               .append("\"; filename=\"").append(Paths.get(dataFile).getFileName().toString()).append("\"\r\n");
        writer.append("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n");
        writer.flush();
        baos.write(Files.readAllBytes(Paths.get(dataFile)));
        writer.append("\r\n");

        // Add form fields
        addFormField(writer, boundary, "name", "Q4 Financial Report Template (Java)");
        addFormField(writer, boundary, "description", "Financial report template with Excel data integration uploaded via Java");

        // File metadata
        Map<String, Object> fileMetadata = new HashMap<>();
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("selectedSheet", "Income Statement");
        metadata.put("hasMultipleSheets", true);
        metadata.put("dataRange", "A1:F50");
        metadata.put("description", "Q4 financial data for AI variable generation");
        fileMetadata.put(dataFileId, metadata);
        addFormField(writer, boundary, "fileResourceMetadata", mapper.writeValueAsString(fileMetadata));

        // Variables
        List<Map<String, Object>> variables = new ArrayList<>();
        Map<String, Object> var1 = new HashMap<>();
        var1.put("name", "Revenue Summary");
        var1.put("placeholder", "{RevenueSummary}");
        var1.put("aiHint", "Generate revenue summary from attached financial data");
        var1.put("dataSourceId", dataFileId);
        variables.add(var1);

        Map<String, Object> var2 = new HashMap<>();
        var2.put("name", "Expense Analysis");
        var2.put("placeholder", "{ExpenseAnalysis}");
        var2.put("aiHint", "Analyze expense trends from Q4 data");
        var2.put("dataSourceId", dataFileId);
        variables.add(var2);
        addFormField(writer, boundary, "variables", mapper.writeValueAsString(variables));

        // Tags
        List<String> tags = Arrays.asList("java-upload", "financial", "q4", "ai-enhanced", "data-driven");
        addFormField(writer, boundary, "tags", mapper.writeValueAsString(tags));

        // End boundary
        writer.append("--").append(boundary).append("--\r\n");
        writer.flush();

        byte[] requestBody = baos.toByteArray();

        System.out.println("Template: " + templateFile);
        System.out.println("Data Source: " + dataFile + " (Sheet: Income Statement)");
        System.out.println("Data Range: A1:F50");
        System.out.println();

        // Create HTTP request
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/template/upload-and-create"))
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("x-rapiddocx-org-id", ORG_ID)
            .header("User-Agent", "TurboDocx Java Client")
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .POST(HttpRequest.BodyPublishers.ofByteArray(requestBody))
            .build();

        // Send request
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("API error: " + response.statusCode() + " - " + response.body());
        }

        // Parse response
        Map<String, Object> result = mapper.readValue(response.body(), Map.class);
        Map<String, Object> data = (Map<String, Object>) result.get("data");
        Map<String, Object> results = (Map<String, Object>) data.get("results");
        Map<String, Object> template = (Map<String, Object>) results.get("template");

        System.out.println("✅ Template with data file uploaded successfully!");
        System.out.println("Template ID: " + template.get("id"));
        System.out.println("Template Name: " + template.get("name"));

        if (template.get("variables") instanceof List) {
            System.out.println("Variables Extracted: " + ((List<?>) template.get("variables")).size());
        }

        if (template.get("defaultFont") != null) {
            System.out.println("Default Font: " + template.get("defaultFont"));
        }

        System.out.println("🔗 Redirect URL: " + results.get("redirectUrl"));
    }

    public static void uploadTemplateWithMultipleSheets() throws Exception {
        System.out.println("\n📈 Java: Upload template with multi-sheet data");
        System.out.println("===============================================");

        String templateFile = "./comprehensive-report-template.docx";
        String dataFile = "./business-data.xlsx";

        // Check if files exist
        if (!Files.exists(Paths.get(templateFile))) {
            throw new FileNotFoundException("Template file not found: " + templateFile);
        }
        if (!Files.exists(Paths.get(dataFile))) {
            throw new FileNotFoundException("Data file not found: " + dataFile);
        }

        String dataFileId = "java-multisheet-456";
        String boundary = "----JavaMultiBoundary" + System.currentTimeMillis();

        // Create multipart form data
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(baos, "UTF-8"), true);

        // Add template file
        writer.append("--").append(boundary).append("\r\n");
        writer.append("Content-Disposition: form-data; name=\"templateFile\"; filename=\"")
               .append(Paths.get(templateFile).getFileName().toString()).append("\"\r\n");
        writer.append("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n");
        writer.flush();
        baos.write(Files.readAllBytes(Paths.get(templateFile)));
        writer.append("\r\n");

        // Add data file
        writer.append("--").append(boundary).append("\r\n");
        writer.append("Content-Disposition: form-data; name=\"FileResource-").append(dataFileId)
               .append("\"; filename=\"").append(Paths.get(dataFile).getFileName().toString()).append("\"\r\n");
        writer.append("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n");
        writer.flush();
        baos.write(Files.readAllBytes(Paths.get(dataFile)));
        writer.append("\r\n");

        // Add form fields
        addFormField(writer, boundary, "name", "Comprehensive Business Report (Java Multi-Sheet)");
        addFormField(writer, boundary, "description", "Multi-sheet data analysis template uploaded via Java");

        // File metadata for multiple sheets
        Map<String, Object> fileMetadata = new HashMap<>();
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("selectedSheet", "Summary");
        metadata.put("hasMultipleSheets", true);
        metadata.put("alternativeSheets", Arrays.asList("Revenue", "Expenses", "Projections"));
        metadata.put("dataRange", "A1:Z100");
        metadata.put("description", "Comprehensive business data across multiple sheets");
        fileMetadata.put(dataFileId, metadata);
        addFormField(writer, boundary, "fileResourceMetadata", mapper.writeValueAsString(fileMetadata));

        // Variables that reference different sheets
        List<Map<String, Object>> variables = new ArrayList<>();

        Map<String, Object> var1 = new HashMap<>();
        var1.put("name", "Executive Summary");
        var1.put("placeholder", "{ExecutiveSummary}");
        var1.put("aiHint", "Create executive summary from Summary sheet data");
        var1.put("dataSourceId", dataFileId);
        var1.put("sheetReference", "Summary");
        variables.add(var1);

        Map<String, Object> var2 = new HashMap<>();
        var2.put("name", "Revenue Analysis");
        var2.put("placeholder", "{RevenueAnalysis}");
        var2.put("aiHint", "Analyze revenue trends from Revenue sheet");
        var2.put("dataSourceId", dataFileId);
        var2.put("sheetReference", "Revenue");
        variables.add(var2);

        Map<String, Object> var3 = new HashMap<>();
        var3.put("name", "Expense Insights");
        var3.put("placeholder", "{ExpenseInsights}");
        var3.put("aiHint", "Generate expense insights from Expenses sheet");
        var3.put("dataSourceId", dataFileId);
        var3.put("sheetReference", "Expenses");
        variables.add(var3);

        addFormField(writer, boundary, "variables", mapper.writeValueAsString(variables));

        // Tags
        List<String> tags = Arrays.asList("java-multi-sheet", "comprehensive", "business-analysis");
        addFormField(writer, boundary, "tags", mapper.writeValueAsString(tags));

        // End boundary
        writer.append("--").append(boundary).append("--\r\n");
        writer.flush();

        byte[] requestBody = baos.toByteArray();

        System.out.println("Template: " + templateFile);
        System.out.println("Data Source: " + dataFile);
        System.out.println("Primary Sheet: Summary");
        System.out.println("Alternative Sheets: Revenue, Expenses, Projections");
        System.out.println();

        // Create and send request
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/template/upload-and-create"))
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("x-rapiddocx-org-id", ORG_ID)
            .header("User-Agent", "TurboDocx Java Client")
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .POST(HttpRequest.BodyPublishers.ofByteArray(requestBody))
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("API error: " + response.statusCode() + " - " + response.body());
        }

        Map<String, Object> result = mapper.readValue(response.body(), Map.class);
        Map<String, Object> data = (Map<String, Object>) result.get("data");
        Map<String, Object> results = (Map<String, Object>) data.get("results");
        Map<String, Object> template = (Map<String, Object>) results.get("template");

        System.out.println("✅ Multi-sheet template uploaded successfully!");
        System.out.println("Template ID: " + template.get("id"));
        System.out.println("Template Name: " + template.get("name"));

        if (template.get("variables") instanceof List) {
            System.out.println("Variables with Sheet References: " + ((List<?>) template.get("variables")).size());
        }

        System.out.println("Sheets Configured: Summary (primary), Revenue, Expenses, Projections");
    }

    private static void addFormField(PrintWriter writer, String boundary, String name, String value) {
        writer.append("--").append(boundary).append("\r\n");
        writer.append("Content-Disposition: form-data; name=\"").append(name).append("\"\r\n\r\n");
        writer.append(value).append("\r\n");
        writer.flush();
    }
}