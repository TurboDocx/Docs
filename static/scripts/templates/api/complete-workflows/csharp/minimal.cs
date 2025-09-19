using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text;
using System.Web;

/**
 * Complete Template Generation Workflows
 * Demonstrates both Path A (Upload) and Path B (Browse/Select) followed by generation
 */
class TemplateWorkflowManager
{
    // Configuration - Update these values
    private const string API_TOKEN = "YOUR_API_TOKEN";
    private const string ORG_ID = "YOUR_ORGANIZATION_ID";
    private const string BASE_URL = "https://api.turbodocx.com";

    private readonly HttpClient client;

    public TemplateWorkflowManager()
    {
        client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + API_TOKEN);
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
    }

    static async Task Main(string[] args)
    {
        var workflow = new TemplateWorkflowManager();

        try
        {
            // Demo Path B (Browse existing templates)
            await workflow.DemoPathB();

            // Uncomment to demo Path A (requires template file):
            // await workflow.DemoPathA("./path/to/your/template.docx");

            // Uncomment to run full comparison:
            // await workflow.DemoComparison();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Workflow demo failed: {ex.Message}");
        }
        finally
        {
            workflow.client?.Dispose();
        }
    }

    // ===============================
    // PATH A: Upload New Template
    // ===============================

    /**
     * Complete Path A workflow: Upload → Generate
     */
    public async Task<TemplateWorkflowResult> PathA_UploadAndGenerate(string templateFilePath, string deliverableName)
    {
        Console.WriteLine("🔄 PATH A: Upload New Template → Generate Deliverable");
        Console.WriteLine(new string('=', 48));

        try
        {
            // Step 1: Upload and create template
            Console.WriteLine("\n📤 Step 1: Uploading template...");
            var template = await UploadTemplate(templateFilePath);

            // Step 2: Generate deliverable using uploaded template
            Console.WriteLine("\n📝 Step 2: Generating deliverable...");
            using var templateDoc = JsonDocument.Parse(template);
            var templateInfo = templateDoc.RootElement.GetProperty("data").GetProperty("results").GetProperty("template");

            var deliverable = await GenerateDeliverable(
                templateInfo.GetProperty("id").GetString(),
                deliverableName,
                $"Generated from uploaded template: {templateInfo.GetProperty("name").GetString()}"
            );

            Console.WriteLine("\n✅ PATH A COMPLETE!");
            Console.WriteLine($"Template ID: {templateInfo.GetProperty("id").GetString()}");

            using var deliverableDoc = JsonDocument.Parse(deliverable);
            var deliverableInfo = deliverableDoc.RootElement.GetProperty("data").GetProperty("results").GetProperty("deliverable");
            Console.WriteLine($"Deliverable ID: {deliverableInfo.GetProperty("id").GetString()}");

            // Download the generated file
            await DownloadDeliverable(
                deliverableInfo.GetProperty("id").GetString(),
                $"{deliverableInfo.GetProperty("name").GetString()}.docx"
            );

            return new TemplateWorkflowResult(template, deliverable, null);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Path A failed: {ex.Message}");
            throw;
        }
    }

    private async Task<string> UploadTemplate(string templateFilePath)
    {
        if (!File.Exists(templateFilePath))
        {
            throw new FileNotFoundException($"Template file not found: {templateFilePath}");
        }

        using var content = new MultipartFormDataContent();

        var fileContent = new ByteArrayContent(File.ReadAllBytes(templateFilePath));
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        content.Add(fileContent, "templateFile", Path.GetFileName(templateFilePath));

        content.Add(new StringContent("API Upload Template"), "name");
        content.Add(new StringContent("Template uploaded via API for testing"), "description");
        content.Add(new StringContent("[]"), "variables");
        content.Add(new StringContent("[\"api\", \"test\", \"upload\"]"), "tags");

        var response = await client.PostAsync($"{BASE_URL}/template/upload-and-create", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Upload failed: {response.StatusCode} - {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(result);
        var template = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("template");

        Console.WriteLine($"✅ Template uploaded: {template.GetProperty("name").GetString()} ({template.GetProperty("id").GetString()})");

        var variableCount = 0;
        if (template.TryGetProperty("variables", out var variables) && variables.ValueKind != JsonValueKind.Null)
        {
            variableCount = variables.GetArrayLength();
        }
        Console.WriteLine($"📊 Variables extracted: {variableCount}");

        Console.WriteLine($"🔤 Default font: {template.GetProperty("defaultFont").GetString()}");

        var fontCount = 0;
        if (template.TryGetProperty("fonts", out var fonts) && fonts.ValueKind != JsonValueKind.Null)
        {
            fontCount = fonts.GetArrayLength();
        }
        Console.WriteLine($"📝 Fonts used: {fontCount}");

        return result;
    }

    // ===============================
    // PATH B: Browse and Select
    // ===============================

    /**
     * Complete Path B workflow: Browse → Select → Generate
     */
    public async Task<TemplateWorkflowResult> PathB_BrowseAndGenerate(string searchQuery, string deliverableName)
    {
        Console.WriteLine("🔍 PATH B: Browse Existing Templates → Generate Deliverable");
        Console.WriteLine(new string('=', 56));

        try
        {
            // Step 1: Browse templates
            Console.WriteLine("\n🔍 Step 1: Browsing templates...");
            var browseResult = await BrowseTemplates(searchQuery);

            // Step 2: Select first available template
            using var browseDoc = JsonDocument.Parse(browseResult);
            var results = browseDoc.RootElement.GetProperty("data").GetProperty("results");

            JsonElement? selectedTemplate = null;
            foreach (var item in results.EnumerateArray())
            {
                if (item.GetProperty("type").GetString() == "template")
                {
                    selectedTemplate = item;
                    break;
                }
            }

            if (!selectedTemplate.HasValue)
            {
                throw new Exception("No templates found in browse results");
            }

            var template = selectedTemplate.Value;
            Console.WriteLine($"📋 Selected: {template.GetProperty("name").GetString()} ({template.GetProperty("id").GetString()})");

            // Step 3: Get template details
            Console.WriteLine("\n📖 Step 2: Getting template details...");
            var templateDetails = await GetTemplateDetails(template.GetProperty("id").GetString());

            // Step 4: Get PDF preview (optional)
            Console.WriteLine("\n🖼️  Step 3: Getting PDF preview...");
            var pdfPreview = await GetTemplatePDFPreview(template.GetProperty("id").GetString());

            // Step 5: Generate deliverable
            Console.WriteLine("\n📝 Step 4: Generating deliverable...");
            using var detailsDoc = JsonDocument.Parse(templateDetails);
            var templateInfo = detailsDoc.RootElement.GetProperty("data").GetProperty("results");

            var deliverable = await GenerateDeliverable(
                templateInfo.GetProperty("id").GetString(),
                deliverableName,
                $"Generated from existing template: {templateInfo.GetProperty("name").GetString()}"
            );

            Console.WriteLine("\n✅ PATH B COMPLETE!");
            Console.WriteLine($"Template ID: {templateInfo.GetProperty("id").GetString()}");

            using var deliverableDoc = JsonDocument.Parse(deliverable);
            var deliverableInfo = deliverableDoc.RootElement.GetProperty("data").GetProperty("results").GetProperty("deliverable");
            Console.WriteLine($"Deliverable ID: {deliverableInfo.GetProperty("id").GetString()}");
            Console.WriteLine($"PDF Preview: {pdfPreview}");

            // Download the generated file
            Console.WriteLine("\n📥 Step 5: Downloading file...");
            await DownloadDeliverable(
                deliverableInfo.GetProperty("id").GetString(),
                $"{deliverableInfo.GetProperty("name").GetString()}.docx"
            );

            return new TemplateWorkflowResult(templateDetails, deliverable, pdfPreview);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Path B failed: {ex.Message}");
            throw;
        }
    }

    private async Task<string> BrowseTemplates(string query)
    {
        var queryParams = "limit=25&offset=0&showTags=true";

        if (!string.IsNullOrEmpty(query))
        {
            queryParams += $"&query={HttpUtility.UrlEncode(query)}";
        }

        var response = await client.GetAsync($"{BASE_URL}/template-item?{queryParams}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Browse failed: {response.StatusCode} - {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(result);
        var totalRecords = document.RootElement.GetProperty("data").GetProperty("totalRecords").GetInt32();
        Console.WriteLine($"🔍 Found {totalRecords} templates/folders");

        return result;
    }

    private async Task<string> GetTemplateDetails(string templateId)
    {
        var response = await client.GetAsync($"{BASE_URL}/template/{templateId}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Template details failed: {response.StatusCode} - {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(result);
        var template = document.RootElement.GetProperty("data").GetProperty("results");

        var variableCount = 0;
        if (template.TryGetProperty("variables", out var variables) && variables.ValueKind != JsonValueKind.Null)
        {
            variableCount = variables.GetArrayLength();
        }
        Console.WriteLine($"📊 Variables: {variableCount}");

        var defaultFont = template.TryGetProperty("defaultFont", out var font) ? font.GetString() : "N/A";
        Console.WriteLine($"🔤 Default font: {defaultFont}");

        return result;
    }

    private async Task<string> GetTemplatePDFPreview(string templateId)
    {
        var response = await client.GetAsync($"{BASE_URL}/template/{templateId}/previewpdflink");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"PDF preview failed: {response.StatusCode} - {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(result);
        var pdfUrl = document.RootElement.GetProperty("results").GetString();

        Console.WriteLine($"🖼️  PDF Preview available: {pdfUrl}");

        return pdfUrl;
    }

    // ===============================
    // COMMON: Generate Deliverable
    // ===============================

    private async Task<string> GenerateDeliverable(string templateId, string name, string description)
    {
        var payload = $$"""
        {
          "templateId": "{{templateId}}",
          "name": "{{name}}",
          "description": "{{description}}",
          "variables": [
            {
              "mimeType": "text",
              "name": "Sample Variable",
              "placeholder": "{SampleVariable}",
              "text": "Sample Content from C# Workflow",
              "allowRichTextInjection": 0,
              "autogenerated": false,
              "count": 1,
              "order": 1,
              "subvariables": [],
              "metadata": {
                "generatedBy": "C# Workflow"
              },
              "aiPrompt": ""
            }
          ],
          "tags": ["api-generated"],
          "fonts": "[]",
          "defaultFont": "Arial",
          "replaceFonts": true,
          "metadata": {
            "sessions": [
              {
                "id": "{{Guid.NewGuid()}}",
                "starttime": "{{DateTime.UtcNow:yyyy-MM-ddTHH:mm:ss.fffZ}}",
                "endtime": "{{DateTime.UtcNow:yyyy-MM-ddTHH:mm:ss.fffZ}}"
              }
            ],
            "workflow": "C# Complete Workflow",
            "generated": "{{DateTime.UtcNow:yyyy-MM-ddTHH:mm:ss.fffZ}}"
          }
        }
        """;

        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{BASE_URL}/deliverable", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Deliverable generation failed: {response.StatusCode} - {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(result);
        var deliverable = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("deliverable");

        Console.WriteLine($"✅ Generated: {deliverable.GetProperty("name").GetString()}");
        Console.WriteLine($"📄 Created by: {deliverable.GetProperty("createdBy").GetString()}");
        Console.WriteLine($"📅 Created on: {deliverable.GetProperty("createdOn").GetString()}");

        return result;
    }

    private async Task DownloadDeliverable(string deliverableId, string filename)
    {
        Console.WriteLine($"📥 Downloading file: {filename}");

        var response = await client.GetAsync($"{BASE_URL}/deliverable/file/{deliverableId}");

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Download failed: {response.StatusCode}");
        }

        Console.WriteLine($"✅ File ready for download: {filename}");

        var contentType = response.Content.Headers.ContentType?.ToString() ?? "N/A";
        var contentLength = response.Content.Headers.ContentLength?.ToString() ?? "N/A";

        Console.WriteLine($"📁 Content-Type: {contentType}");
        Console.WriteLine($"📊 Content-Length: {contentLength} bytes");

        // In a real application, you would save the file
        // var fileBytes = await response.Content.ReadAsByteArrayAsync();
        // await File.WriteAllBytesAsync(filename, fileBytes);
    }

    // ===============================
    // DEMO FUNCTIONS
    // ===============================

    public async Task<TemplateWorkflowResult> DemoPathA(string templateFilePath)
    {
        Console.WriteLine("🚀 DEMO: Path A - Upload New Template Workflow");
        Console.WriteLine(new string('=', 45));
        Console.WriteLine();

        return await PathA_UploadAndGenerate(templateFilePath, "Contract Generated via Path A - API Upload");
    }

    public async Task<TemplateWorkflowResult> DemoPathB()
    {
        Console.WriteLine("🚀 DEMO: Path B - Browse Existing Template Workflow");
        Console.WriteLine(new string('=', 51));
        Console.WriteLine();

        return await PathB_BrowseAndGenerate("contract", "Contract Generated via Path B - Browse & Select");
    }

    public async Task DemoComparison()
    {
        Console.WriteLine("🚀 DEMO: Complete Workflow Comparison");
        Console.WriteLine(new string('=', 36));
        Console.WriteLine();

        try
        {
            Console.WriteLine("Testing both paths with the same template type...\n");

            // Run Path B first (browse existing)
            var pathBResult = await DemoPathB();

            Console.WriteLine("\n" + new string('=', 60) + "\n");

            // For Path A, we'd need a template file
            Console.WriteLine("📝 Path A requires a template file to upload.");
            Console.WriteLine("   Example: await workflow.DemoPathA(\"./contract-template.docx\")");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Demo comparison failed: {ex.Message}");
        }
    }

    // Result container class
    public class TemplateWorkflowResult
    {
        public string Template { get; }
        public string Deliverable { get; }
        public string PdfPreview { get; }

        public TemplateWorkflowResult(string template, string deliverable, string pdfPreview)
        {
            Template = template;
            Deliverable = deliverable;
            PdfPreview = pdfPreview;
        }
    }
}