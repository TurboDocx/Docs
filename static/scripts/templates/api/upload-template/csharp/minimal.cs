using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

/**
 * Path A: Upload and Create Template
 * Uploads a .docx/.pptx template and extracts variables automatically
 */
class TemplateUpload
{
    // Configuration - Update these values
    private const string API_TOKEN = "YOUR_API_TOKEN";
    private const string ORG_ID = "YOUR_ORGANIZATION_ID";
    private const string BASE_URL = "https://api.turbodocx.com";
    private const string TEMPLATE_NAME = "Employee Contract Template";

    static async Task Main(string[] args)
    {
        try
        {
            var result = await UploadTemplate("./contract-template.docx");

            using var document = JsonDocument.Parse(result);
            var template = document.RootElement
                .GetProperty("data")
                .GetProperty("results")
                .GetProperty("template");

            Console.WriteLine($"Template uploaded successfully: {template.GetProperty("id").GetString()}");
            Console.WriteLine($"Template name: {template.GetProperty("name").GetString()}");

            // Handle nullable variables field
            var variableCount = 0;
            if (template.TryGetProperty("variables", out var variables) &&
                variables.ValueKind != JsonValueKind.Null)
            {
                variableCount = variables.GetArrayLength();
            }
            Console.WriteLine($"Variables extracted: {variableCount}");

            Console.WriteLine($"Default font: {template.GetProperty("defaultFont").GetString()}");

            // Handle nullable fonts field
            var fontCount = 0;
            if (template.TryGetProperty("fonts", out var fonts) &&
                fonts.ValueKind != JsonValueKind.Null)
            {
                fontCount = fonts.GetArrayLength();
            }
            Console.WriteLine($"Fonts used: {fontCount}");

            var redirectUrl = document.RootElement
                .GetProperty("data")
                .GetProperty("results")
                .GetProperty("redirectUrl");
            Console.WriteLine($"Redirect to: {redirectUrl.GetString()}");

            Console.WriteLine($"Ready to generate documents with template: {template.GetProperty("id").GetString()}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Upload failed: {ex.Message}");
        }
    }

    private static async Task<string> UploadTemplate(string templateFilePath)
    {
        // Check if file exists
        if (!File.Exists(templateFilePath))
        {
            throw new FileNotFoundException($"Template file not found: {templateFilePath}");
        }

        using var client = new HttpClient();

        // Set headers
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + API_TOKEN);
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");

        // Create multipart form data
        using var content = new MultipartFormDataContent();

        // Add template file
        var fileContent = new ByteArrayContent(File.ReadAllBytes(templateFilePath));
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        content.Add(fileContent, "templateFile", Path.GetFileName(templateFilePath));

        // Add form fields
        content.Add(new StringContent(TEMPLATE_NAME), "name");
        content.Add(new StringContent("Standard employee contract with variable placeholders"), "description");
        content.Add(new StringContent("[]"), "variables");
        content.Add(new StringContent("[\"hr\", \"contract\", \"template\"]"), "tags");

        // Make request
        var response = await client.PostAsync(BASE_URL + "/template/upload-and-create", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"HTTP error {response.StatusCode}: {errorContent}");
        }

        return await response.Content.ReadAsStringAsync();
    }
}