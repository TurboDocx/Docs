using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text;

class Program
{
    // Configuration
    private const string API_TOKEN = "YOUR_API_TOKEN";
    private const string ORG_ID = "YOUR_ORGANIZATION_ID";
    private const string BASE_URL = "https://api.turbodocx.com";

    static async Task Main(string[] args)
    {
        try
        {
            await GenerateAIVariable();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    static async Task GenerateAIVariable()
    {
        using var client = new HttpClient();

        var payload = new
        {
            name = "Company Performance Summary",
            placeholder = "{Q4Performance}",
            templateId = "template-abc123",
            aiHint = "Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements",
            richTextEnabled = true
        };

        string jsonPayload = JsonSerializer.Serialize(payload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        // Set headers
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {API_TOKEN}");
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);

        // Send request
        var response = await client.PostAsync($"{BASE_URL}/ai/generate/variable/one", content);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"AI generation failed: {response.StatusCode}");
        }

        var result = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Generated variable: {result}");
    }
}