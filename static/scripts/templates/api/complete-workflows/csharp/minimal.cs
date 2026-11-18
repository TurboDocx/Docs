using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Nodes;

// ── Configuration ───────────────────────────────────────────────────
const string ApiToken     = "YOUR_API_TOKEN";
const string OrgId        = "YOUR_ORGANIZATION_ID";
const string BaseUrl      = "https://api.turbodocx.com";
const string TemplatePath = "./contract-template.docx";

// ── App bootstrap ───────────────────────────────────────────────────
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("TurboDocx", client =>
{
    client.BaseAddress = new Uri(BaseUrl);
    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {ApiToken}");
    client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", OrgId);
    client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
});

var app = builder.Build();

// Both paths: generate a deliverable, filling each of the template's variables
async Task<IResult> GenerateFrom(HttpClient client, JsonNode template, string pathLabel)
{
    var variables = (template["variables"]?.AsArray() ?? new JsonArray())
        .Select(variable => new
        {
            placeholder = (string?)variable?["placeholder"],
            text        = $"Sample value for {(string?)variable?["name"] ?? (string?)variable?["placeholder"]}",
            mimeType    = "text",
        });

    var payload = new
    {
        templateId  = (string?)template["id"],
        name        = $"Contract Document - Path {pathLabel}",
        description = $"Employment contract generated via workflow path {pathLabel}",
        variables,
        tags        = new[] { "api-generated" },
    };

    var response = await client.PostAsJsonAsync("/v1/deliverable", payload);
    if (!response.IsSuccessStatusCode)
    {
        return Results.Problem(await response.Content.ReadAsStringAsync(), statusCode: 502);
    }

    var deliverable   = JsonNode.Parse(await response.Content.ReadAsStringAsync())!["data"]!["results"]!["deliverable"]!;
    var deliverableId = (string?)deliverable["id"];
    return Results.Ok(new { templateId = (string?)template["id"], deliverableId, download = $"/api/deliverables/{deliverableId}/download" });
}

// ── POST /api/workflow/upload ───────────────────────────────────────
// Path A: upload a new template, then generate from it
app.MapPost("/api/workflow/upload", async (IHttpClientFactory httpFactory) =>
{
    if (!File.Exists(TemplatePath))
    {
        return Results.BadRequest(new { error = $"Template file not found: {TemplatePath}" });
    }

    var client = httpFactory.CreateClient("TurboDocx");

    using var form = new MultipartFormDataContent();
    var fileContent = new ByteArrayContent(await File.ReadAllBytesAsync(TemplatePath));
    fileContent.Headers.ContentType = new MediaTypeHeaderValue(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    form.Add(fileContent, "templateFile", Path.GetFileName(TemplatePath));
    form.Add(new StringContent("Employee Contract Template"), "name");
    form.Add(new StringContent("Standard employee contract with variable placeholders"), "description");
    form.Add(new StringContent("[]"), "variables");
    form.Add(new StringContent("[]"), "tags");

    // Upload and create answers 201 Created
    var upload = await client.PostAsync("/template/upload-and-create", form);
    if (upload.StatusCode != HttpStatusCode.Created)
    {
        return Results.Problem(await upload.Content.ReadAsStringAsync(), statusCode: 502);
    }

    var template = JsonNode.Parse(await upload.Content.ReadAsStringAsync())!["data"]!["results"]!["template"]!;
    return await GenerateFrom(client, template, "A");
});

// ── POST /api/workflow/browse  { "query": "contract" } ──────────────
// Path B: pick an existing template, then generate from it
app.MapPost("/api/workflow/browse", async (IHttpClientFactory httpFactory, BrowseRequest? request) =>
{
    var client = httpFactory.CreateClient("TurboDocx");
    var query  = Uri.EscapeDataString(request?.Query ?? "contract");

    var browse = await client.GetAsync($"/template-item?limit=10&offset=0&showTags=true&query={query}");
    if (!browse.IsSuccessStatusCode)
    {
        return Results.Problem(await browse.Content.ReadAsStringAsync(), statusCode: 502);
    }

    var items    = JsonNode.Parse(await browse.Content.ReadAsStringAsync())!["data"]!["results"]!.AsArray();
    var selected = items.FirstOrDefault(item => (string?)item?["type"] == "template");
    if (selected is null)
    {
        return Results.NotFound(new { error = "No matching template" });
    }

    var details = await client.GetAsync($"/template/{Uri.EscapeDataString((string)selected["id"]!)}");
    if (!details.IsSuccessStatusCode)
    {
        return Results.Problem(await details.Content.ReadAsStringAsync(), statusCode: 502);
    }

    var template = JsonNode.Parse(await details.Content.ReadAsStringAsync())!["data"]!["results"]!;
    return await GenerateFrom(client, template, "B");
});

// ── GET /api/deliverables/{id}/download ─────────────────────────────
app.MapGet("/api/deliverables/{id}/download", async (string id, IHttpClientFactory httpFactory) =>
{
    var client   = httpFactory.CreateClient("TurboDocx");
    var response = await client.GetAsync($"/v1/deliverable/file/{Uri.EscapeDataString(id)}");

    if (!response.IsSuccessStatusCode)
    {
        return Results.Problem(await response.Content.ReadAsStringAsync(), statusCode: 502);
    }

    var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";
    return Results.File(await response.Content.ReadAsByteArrayAsync(), contentType, $"deliverable-{id}.docx");
});

app.Run();

record BrowseRequest(string? Query);
