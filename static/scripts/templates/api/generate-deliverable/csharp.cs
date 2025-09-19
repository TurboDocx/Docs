using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text;

/**
 * Final Step: Generate Deliverable (Both Paths Converge Here)
 */
class DeliverableGenerator
{
    // Configuration - Update these values
    private const string API_TOKEN = "YOUR_API_TOKEN";
    private const string ORG_ID = "YOUR_ORGANIZATION_ID";
    private const string BASE_URL = "https://api.turbodocx.com";

    static async Task Main(string[] args)
    {
        try
        {
            Console.WriteLine("=== Final Step: Generate Deliverable ===");

            // This would come from either Path A (upload) or Path B (browse/select)
            var templateId = "0b1099cf-d7b9-41a4-822b-51b68fd4885a";

            var deliverableData = CreateDeliverableData();
            var deliverable = await GenerateDeliverable(templateId, deliverableData);

            // Download the generated file
            Console.WriteLine("\n=== Download Generated File ===");
            using var document = JsonDocument.Parse(deliverable);
            var deliverableInfo = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("deliverable");

            var deliverableId = deliverableInfo.GetProperty("id").GetString();
            var deliverableName = deliverableInfo.GetProperty("name").GetString();
            await DownloadDeliverable(deliverableId, $"{deliverableName}.docx");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Deliverable generation failed: {ex.Message}");
        }
    }

    /**
     * Generate a deliverable document from template with variable substitution
     */
    private static async Task<string> GenerateDeliverable(string templateId, string deliverableDataJson)
    {
        using var client = new HttpClient();

        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + API_TOKEN);
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");

        Console.WriteLine("Generating deliverable...");
        Console.WriteLine($"Template ID: {templateId}");

        using var document = JsonDocument.Parse(deliverableDataJson);
        var deliverableName = document.RootElement.GetProperty("name").GetString();
        var variableCount = document.RootElement.GetProperty("variables").GetArrayLength();

        Console.WriteLine($"Deliverable Name: {deliverableName}");
        Console.WriteLine($"Variables: {variableCount}");

        var content = new StringContent(deliverableDataJson, Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{BASE_URL}/deliverable", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"HTTP error {response.StatusCode}: {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();

        using var resultDoc = JsonDocument.Parse(result);
        var deliverable = resultDoc.RootElement.GetProperty("data").GetProperty("results").GetProperty("deliverable");

        Console.WriteLine("✅ Deliverable generated successfully!");
        Console.WriteLine($"Deliverable ID: {deliverable.GetProperty("id").GetString()}");
        Console.WriteLine($"Created by: {deliverable.GetProperty("createdBy").GetString()}");
        Console.WriteLine($"Created on: {deliverable.GetProperty("createdOn").GetString()}");
        Console.WriteLine($"Template ID: {deliverable.GetProperty("templateId").GetString()}");

        return result;
    }

    /**
     * Download the generated deliverable file
     */
    private static async Task DownloadDeliverable(string deliverableId, string filename)
    {
        using var client = new HttpClient();

        Console.WriteLine($"Downloading file: {filename}");

        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + API_TOKEN);
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");

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

    /**
     * Create example deliverable data with complex variables
     */
    private static string CreateDeliverableData()
    {
        var templateId = "0b1099cf-d7b9-41a4-822b-51b68fd4885a";

        return $$"""
        {
          "templateId": "{{templateId}}",
          "name": "Employee Contract - John Smith",
          "description": "Employment contract for new senior software engineer",
          "variables": [
            {
              "mimeType": "text",
              "name": "Employee Name",
              "placeholder": "{EmployeeName}",
              "text": "John Smith",
              "allowRichTextInjection": 0,
              "autogenerated": false,
              "count": 1,
              "order": 1,
              "subvariables": [
                {
                  "placeholder": "{EmployeeName.Title}",
                  "text": "Senior Software Engineer"
                },
                {
                  "placeholder": "{EmployeeName.StartDate}",
                  "text": "January 15, 2024"
                }
              ],
              "metadata": {
                "department": "Engineering",
                "level": "Senior"
              },
              "aiPrompt": "Generate a professional job description for a senior software engineer role"
            },
            {
              "mimeType": "text",
              "name": "Company Information",
              "placeholder": "{CompanyInfo}",
              "text": "TechCorp Solutions Inc.",
              "allowRichTextInjection": 1,
              "autogenerated": false,
              "count": 1,
              "order": 2,
              "subvariables": [
                {
                  "placeholder": "{CompanyInfo.Address}",
                  "text": "123 Innovation Drive, Tech City, TC 12345"
                },
                {
                  "placeholder": "{CompanyInfo.Phone}",
                  "text": "(555) 123-4567"
                }
              ],
              "metadata": {},
              "aiPrompt": ""
            }
          ],
          "tags": ["hr", "contract", "employee", "engineering"],
          "fonts": "[{\"name\":\"Arial\",\"usage\":269}]",
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
            "createdBy": "HR Department",
            "documentType": "Employment Contract",
            "version": "v1.0"
          }
        }
        """;
    }
}