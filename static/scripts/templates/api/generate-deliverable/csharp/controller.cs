using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;

namespace TurboDocx.Api.Controllers;

// --- Models ---

public record Subvariable(
    [property: JsonPropertyName("placeholder")] string Placeholder,
    [property: JsonPropertyName("text")] string Text,
    [property: JsonPropertyName("mimeType")] string MimeType
);

public record Variable(
    [property: JsonPropertyName("placeholder")] string Placeholder,
    [property: JsonPropertyName("text")] string Text,
    [property: JsonPropertyName("mimeType")] string MimeType,
    [property: JsonPropertyName("subvariables"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    Subvariable[]? Subvariables
);

public record DeliverableRequest(
    [property: JsonPropertyName("templateId")] string TemplateId,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("variables")] Variable[] Variables,
    [property: JsonPropertyName("tags")] string[] Tags,
    [property: JsonPropertyName("replaceFonts")] bool ReplaceFonts = true
);

// --- Controller ---

[ApiController]
[Route("api/deliverable")]
public class DeliverableController : ControllerBase
{
    // Configuration - Update these values
    private const string ApiToken = "YOUR_API_TOKEN";
    private const string OrgId = "YOUR_ORGANIZATION_ID";
    private const string BaseUrl = "https://api.turbodocx.com";

    private readonly HttpClient _httpClient;

    public DeliverableController(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(BaseUrl);
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {ApiToken}");
        _httpClient.DefaultRequestHeaders.Add("x-rapiddocx-org-id", OrgId);
    }

    /// <summary>
    /// Generate a deliverable document from a template with variable substitution.
    /// POST api/deliverable/generate
    /// </summary>
    [HttpPost("generate")]
    public async Task<IActionResult> GenerateDeliverable([FromBody] DeliverableRequest request)
    {
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("/v1/deliverable", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            return StatusCode((int)response.StatusCode, new { message = "Generation failed", details = error });
        }

        var result = await response.Content.ReadAsStringAsync();
        return Ok(JsonSerializer.Deserialize<JsonElement>(result));
    }

    /// <summary>
    /// Download a previously generated deliverable file by its ID.
    /// GET api/deliverable/download/{id}
    /// </summary>
    [HttpGet("download/{id}")]
    public async Task<IActionResult> DownloadDeliverable(string id)
    {
        var response = await _httpClient.GetAsync($"/v1/deliverable/file/{id}");

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, new { message = "Download failed" });
        }

        var fileBytes = await response.Content.ReadAsByteArrayAsync();
        var contentType = response.Content.Headers.ContentType?.ToString()
            ?? "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        var fileName = $"deliverable-{id}.docx";

        return File(fileBytes, contentType, fileName);
    }
}

// --- Example usage: how to call POST api/deliverable/generate ---
//
// Send the following JSON body to POST api/deliverable/generate:
//
// {
//   "templateId": "YOUR_TEMPLATE_ID",
//   "name": "Employee Contract - John Smith",
//   "description": "Employment contract for new senior developer",
//   "variables": [
//     { "placeholder": "{EmployeeName}", "text": "John Smith", "mimeType": "text" },
//     { "placeholder": "{CompanyName}", "text": "TechCorp Solutions Inc.", "mimeType": "text" },
//     { "placeholder": "{JobTitle}", "text": "Senior Software Engineer", "mimeType": "text" },
//     {
//       "mimeType": "html",
//       "placeholder": "{ContactBlock}",
//       "text": "<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>",
//       "subvariables": [
//         { "placeholder": "{contactName}", "text": "Jane Doe", "mimeType": "text" },
//         { "placeholder": "{contactPhone}", "text": "(555) 123-4567", "mimeType": "text" }
//       ]
//     }
//   ],
//   "tags": ["hr", "contract", "employee"],
//   "replaceFonts": true
// }
