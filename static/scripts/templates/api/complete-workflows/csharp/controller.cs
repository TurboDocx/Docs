using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text;

/**
 * Complete Workflow: Upload → Generate → Download
 * Simple 3-step process for document generation
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
            // Replace with your template file path
            string templatePath = "./template.docx";
            await workflow.CompleteWorkflow(templatePath);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Workflow failed: {ex.Message}");
        }
        finally
        {
            workflow.client?.Dispose();
        }
    }

    // Step 1: Upload template file
    public async Task<JsonElement> UploadTemplate(string templateFilePath)
    {
        if (!File.Exists(templateFilePath))
        {
            throw new FileNotFoundException($"Template file not found: {templateFilePath}");
        }

        using var content = new MultipartFormDataContent();

        var fileContent = new ByteArrayContent(File.ReadAllBytes(templateFilePath));
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
        content.Add(fileContent, "templateFile", "template.docx");

        content.Add(new StringContent("Simple Template"), "name");
        content.Add(new StringContent("Template uploaded for document generation"), "description");

        var response = await client.PostAsync($"{BASE_URL}/template/upload-and-create", content);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Upload failed: {response.StatusCode}");
        }

        var result = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(result);
        var template = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("template");

        Console.WriteLine($"✅ Template uploaded: {template.GetProperty("name").GetString()} ({template.GetProperty("id").GetString()})");

        return template;
    }

    // Step 2: Generate deliverable with simple variables
    public async Task<JsonElement> GenerateDeliverable(string templateId)
    {
        var payload = $$"""
        {
          "templateId": "{{templateId}}",
          "name": "Generated Document",
          "description": "Simple document example",
          "variables": [
            {
              "mimeType": "text",
              "name": "Company Name",
              "placeholder": "{CompanyName}",
              "text": "Acme Corporation"
            },
            {
              "mimeType": "text",
              "name": "Employee Name",
              "placeholder": "{EmployeeName}",
              "text": "John Smith"
            },
            {
              "mimeType": "text",
              "name": "Date",
              "placeholder": "{Date}",
              "text": "January 15, 2024"
            }
          ]
        }
        """;

        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{BASE_URL}/deliverable", content);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Generation failed: {response.StatusCode}");
        }

        var result = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(result);
        var deliverable = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("deliverable");

        Console.WriteLine($"✅ Document generated: {deliverable.GetProperty("name").GetString()} ({deliverable.GetProperty("id").GetString()})");

        return deliverable;
    }

    // Step 3: Download generated file
    public async Task DownloadFile(string deliverableId, string filename)
    {
        var response = await client.GetAsync($"{BASE_URL}/deliverable/file/{deliverableId}");

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Download failed: {response.StatusCode}");
        }

        Console.WriteLine($"✅ File ready for download: {filename}");

        // In a real application, you would save the file:
        // var fileBytes = await response.Content.ReadAsByteArrayAsync();
        // await File.WriteAllBytesAsync(filename, fileBytes);
    }

    // Complete workflow: Upload → Generate → Download
    public async Task CompleteWorkflow(string templateFilePath)
    {
        Console.WriteLine("🚀 Starting complete workflow...");

        // Step 1: Upload template
        Console.WriteLine("\n📤 Step 1: Uploading template...");
        var template = await UploadTemplate(templateFilePath);

        // Step 2: Generate deliverable
        Console.WriteLine("\n📝 Step 2: Generating document...");
        var deliverable = await GenerateDeliverable(template.GetProperty("id").GetString());

        // Step 3: Download file
        Console.WriteLine("\n📥 Step 3: Downloading file...");
        string filename = deliverable.GetProperty("name").GetString() + ".docx";
        await DownloadFile(deliverable.GetProperty("id").GetString(), filename);

        Console.WriteLine("\n✅ Workflow complete!");
        Console.WriteLine($"Template: {template.GetProperty("id").GetString()}");
        Console.WriteLine($"Document: {deliverable.GetProperty("id").GetString()}");
        Console.WriteLine($"File: {filename}");
    }
}