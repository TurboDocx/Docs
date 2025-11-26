using System.Net.Http.Headers;
using System.Text.Json;

// Configuration - Update these values
const string API_TOKEN = "YOUR_API_TOKEN";
const string ORG_ID = "YOUR_ORGANIZATION_ID";
const string BASE_URL = "https://api.turbodocx.com";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();

var app = builder.Build();

app.MapPost("/prepare-for-review", async (IFormFile file, IHttpClientFactory httpClientFactory) =>
{
    try
    {
        var httpClient = httpClientFactory.CreateClient();
        using var formData = new MultipartFormDataContent();

        // Add file
        var fileContent = new StreamContent(file.OpenReadStream());
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
        formData.Add(fileContent, "file", file.FileName);

        // Add document metadata
        formData.Add(new StringContent("Contract Agreement"), "documentName");
        formData.Add(new StringContent("Please review and sign this contract"), "documentDescription");

        // Add recipients (as JSON string)
        var recipients = JsonSerializer.Serialize(new[]
        {
            new
            {
                name = "John Smith",
                email = "john.smith@company.com",
                signingOrder = 1}
        });
        formData.Add(new StringContent(recipients), "recipients");

        // Add fields (as JSON string) - Coordinate-based
        var fields = JsonSerializer.Serialize(new[]
        {
            new
            {
                recipientEmail = "john.smith@company.com",
                type = "signature",
                page = 1,
                x = 100,
                y = 200,
                width = 200,
                height = 80,
                required = true
            },
            new
            {
                recipientEmail = "john.smith@company.com",
                type = "date",
                page = 1,
                x = 350,
                y = 200,
                width = 150,
                height = 30,
                required = true
            }
        });
        formData.Add(new StringContent(fields), "fields");

        // Set headers
        var request = new HttpRequestMessage(HttpMethod.Post, $"{BASE_URL}/turbosign/single/prepare-for-review")
        {
            Content = formData
        };
        request.Headers.Add("Authorization", $"Bearer {API_TOKEN}");
        request.Headers.Add("x-rapiddocx-org-id", ORG_ID);
        request.Headers.Add("User-Agent", "TurboDocx API Client");

        // Send request
        var response = await httpClient.SendAsync(request);
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

        if (result.GetProperty("success").GetBoolean())
        {
            return Results.Ok(new
            {
                success = true,
                documentId = result.GetProperty("documentId").GetString(),
                status = result.GetProperty("status").GetString(),
                previewUrl = result.GetProperty("previewUrl").GetString(),
                message = "Document prepared for review successfully"
            });
        }
        else
        {
            return Results.BadRequest(new
            {
                success = false,
                error = result.GetProperty("error").GetString()
            });
        }
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();
