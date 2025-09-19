using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Web;

/**
 * Path B: Browse and Select Existing Templates
 */
class TemplateBrowser
{
    // Configuration - Update these values
    private const string API_TOKEN = "YOUR_API_TOKEN";
    private const string ORG_ID = "YOUR_ORGANIZATION_ID";
    private const string BASE_URL = "https://api.turbodocx.com";

    static async Task Main(string[] args)
    {
        try
        {
            Console.WriteLine("=== Path B: Browse and Select Template ===");

            // Step 1: Browse templates
            Console.WriteLine("\n1. Browsing templates...");
            var browseResult = await BrowseTemplates(10, 0, "contract", true, null);

            using var browseDoc = JsonDocument.Parse(browseResult);
            var results = browseDoc.RootElement.GetProperty("data").GetProperty("results");

            // Find a template (not a folder)
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
                Console.WriteLine("No templates found in browse results");
                return;
            }

            var template = selectedTemplate.Value;
            Console.WriteLine($"\nSelected template: {template.GetProperty("name").GetString()} ({template.GetProperty("id").GetString()})");

            // Step 2: Get detailed template information
            Console.WriteLine("\n2. Getting template details...");
            var templateDetails = await GetTemplateDetails(template.GetProperty("id").GetString());

            // Step 3: Get PDF preview (optional)
            Console.WriteLine("\n3. Getting PDF preview...");
            var pdfPreview = await GetTemplatePDFPreview(template.GetProperty("id").GetString());

            using var detailsDoc = JsonDocument.Parse(templateDetails);
            var templateInfo = detailsDoc.RootElement.GetProperty("data").GetProperty("results");

            Console.WriteLine("\n=== Template Ready for Generation ===");
            Console.WriteLine($"Template ID: {templateInfo.GetProperty("id").GetString()}");

            var variableCount = 0;
            if (templateInfo.TryGetProperty("variables", out var variables) &&
                variables.ValueKind != JsonValueKind.Null)
            {
                variableCount = variables.GetArrayLength();
            }
            Console.WriteLine($"Variables available: {variableCount}");
            Console.WriteLine($"PDF Preview: {pdfPreview}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Browsing workflow failed: {ex.Message}");
        }
    }

    /**
     * Step 1: Browse Templates and Folders
     */
    private static async Task<string> BrowseTemplates(int limit, int offset, string query,
                                                    bool showTags, string[] selectedTags)
    {
        using var client = new HttpClient();

        // Set headers
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + API_TOKEN);
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");

        // Build query parameters
        var queryParams = $"limit={limit}&offset={offset}&showTags={showTags.ToString().ToLower()}";

        if (!string.IsNullOrEmpty(query))
        {
            queryParams += $"&query={HttpUtility.UrlEncode(query)}";
        }

        if (selectedTags != null)
        {
            foreach (var tag in selectedTags)
            {
                queryParams += $"&selectedTags[]={HttpUtility.UrlEncode(tag)}";
            }
        }

        var url = $"{BASE_URL}/template-item?{queryParams}";

        var response = await client.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"HTTP error {response.StatusCode}: {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(result);
        var totalRecords = document.RootElement.GetProperty("data").GetProperty("totalRecords").GetInt32();
        Console.WriteLine($"Found {totalRecords} templates/folders");

        return result;
    }

    /**
     * Step 2: Get Template Details by ID
     */
    private static async Task<string> GetTemplateDetails(string templateId)
    {
        using var client = new HttpClient();

        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + API_TOKEN);
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");

        var response = await client.GetAsync($"{BASE_URL}/template/{templateId}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"HTTP error {response.StatusCode}: {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(result);
        var template = document.RootElement.GetProperty("data").GetProperty("results");

        Console.WriteLine($"Template: {template.GetProperty("name").GetString()}");

        var variableCount = 0;
        if (template.TryGetProperty("variables", out var variables) &&
            variables.ValueKind != JsonValueKind.Null)
        {
            variableCount = variables.GetArrayLength();
        }
        Console.WriteLine($"Variables: {variableCount}");

        var defaultFont = template.TryGetProperty("defaultFont", out var font) ? font.GetString() : "N/A";
        Console.WriteLine($"Default font: {defaultFont}");

        return result;
    }

    /**
     * Step 3: Get PDF Preview Link (Optional)
     */
    private static async Task<string> GetTemplatePDFPreview(string templateId)
    {
        using var client = new HttpClient();

        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + API_TOKEN);
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");

        var response = await client.GetAsync($"{BASE_URL}/template/{templateId}/previewpdflink");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"HTTP error {response.StatusCode}: {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(result);
        var pdfUrl = document.RootElement.GetProperty("results").GetString();

        Console.WriteLine($"PDF Preview: {pdfUrl}");

        return pdfUrl;
    }
}