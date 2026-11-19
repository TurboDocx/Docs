using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;

// Register in Program.cs:
//   builder.Services.AddControllers();
//   builder.Services.AddHttpClient<TemplateWorkflowController>();
//   app.MapControllers();

[ApiController]
[Route("api")]
public class TemplateWorkflowController : ControllerBase
{
    // Configuration - Update these values
    private const string ApiToken = "YOUR_API_TOKEN";
    private const string OrgId = "YOUR_ORGANIZATION_ID";
    private const string BaseUrl = "https://api.turbodocx.com";
    private const string TemplatePath = "./contract-template.docx";

    private readonly HttpClient _httpClient;

    public TemplateWorkflowController(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(BaseUrl);
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {ApiToken}");
        _httpClient.DefaultRequestHeaders.Add("x-rapiddocx-org-id", OrgId);
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
    }

    public record BrowseRequest(string? Query);

    /// <summary>Path A: upload a new template, then generate from it. POST api/workflow/upload</summary>
    [HttpPost("workflow/upload")]
    public async Task<IActionResult> WorkflowUpload()
    {
        if (!System.IO.File.Exists(TemplatePath))
        {
            return BadRequest(new { error = $"Template file not found: {TemplatePath}" });
        }

        using var form = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(await System.IO.File.ReadAllBytesAsync(TemplatePath));
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        form.Add(fileContent, "templateFile", Path.GetFileName(TemplatePath));
        form.Add(new StringContent("Employee Contract Template"), "name");
        form.Add(new StringContent("Standard employee contract with variable placeholders"), "description");
        form.Add(new StringContent("[]"), "variables");
        form.Add(new StringContent("[]"), "tags");

        // Upload and create answers 201 Created
        var upload = await _httpClient.PostAsync("/template/upload-and-create", form);
        if (upload.StatusCode != HttpStatusCode.Created)
        {
            return StatusCode(502, new { error = await upload.Content.ReadAsStringAsync() });
        }

        var template = JsonNode.Parse(await upload.Content.ReadAsStringAsync())!["data"]!["results"]!["template"]!;
        return await GenerateFrom(template, "A");
    }

    /// <summary>Path B: pick an existing template, then generate from it. POST api/workflow/browse</summary>
    [HttpPost("workflow/browse")]
    public async Task<IActionResult> WorkflowBrowse([FromBody] BrowseRequest? request)
    {
        var query = Uri.EscapeDataString(request?.Query ?? "contract");
        var browse = await _httpClient.GetAsync($"/template-item?limit=10&offset=0&showTags=true&query={query}");
        if (!browse.IsSuccessStatusCode)
        {
            return StatusCode(502, new { error = await browse.Content.ReadAsStringAsync() });
        }

        var items = JsonNode.Parse(await browse.Content.ReadAsStringAsync())!["data"]!["results"]!.AsArray();
        var selected = items.FirstOrDefault(item => (string?)item?["type"] == "template");
        if (selected is null)
        {
            return NotFound(new { error = "No matching template" });
        }

        var details = await _httpClient.GetAsync($"/template/{Uri.EscapeDataString((string)selected["id"]!)}");
        if (!details.IsSuccessStatusCode)
        {
            return StatusCode(502, new { error = await details.Content.ReadAsStringAsync() });
        }

        var template = JsonNode.Parse(await details.Content.ReadAsStringAsync())!["data"]!["results"]!;
        return await GenerateFrom(template, "B");
    }

    /// <summary>The generated file. GET api/deliverables/{id}/download</summary>
    [HttpGet("deliverables/{id}/download")]
    public async Task<IActionResult> Download(string id)
    {
        var response = await _httpClient.GetAsync($"/v1/deliverable/file/{Uri.EscapeDataString(id)}");
        if (!response.IsSuccessStatusCode)
        {
            return StatusCode(502, new { error = await response.Content.ReadAsStringAsync() });
        }

        var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";
        return File(await response.Content.ReadAsByteArrayAsync(), contentType, $"deliverable-{id}.docx");
    }

    // Both paths: generate a deliverable, filling each of the template's variables
    private async Task<IActionResult> GenerateFrom(JsonNode template, string pathLabel)
    {
        var variables = (template["variables"]?.AsArray() ?? new JsonArray())
            .Select(variable => new
            {
                placeholder = (string?)variable?["placeholder"],
                text = $"Sample value for {(string?)variable?["name"] ?? (string?)variable?["placeholder"]}",
                mimeType = "text",
            });

        var payload = new
        {
            templateId = (string?)template["id"],
            name = $"Contract Document - Path {pathLabel}",
            description = $"Employment contract generated via workflow path {pathLabel}",
            variables,
            tags = new[] { "api-generated" },
        };

        var response = await _httpClient.PostAsJsonAsync("/v1/deliverable", payload);
        if (!response.IsSuccessStatusCode)
        {
            return StatusCode(502, new { error = await response.Content.ReadAsStringAsync() });
        }

        var deliverable = JsonNode.Parse(await response.Content.ReadAsStringAsync())!["data"]!["results"]!["deliverable"]!;
        var deliverableId = (string?)deliverable["id"];
        return Ok(new { templateId = (string?)template["id"], deliverableId, download = $"/api/deliverables/{deliverableId}/download" });
    }
}
