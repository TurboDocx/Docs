using System.Net;
using System.Net.Http.Headers;

// ── Configuration ───────────────────────────────────────────────────
const string ApiToken     = "YOUR_API_TOKEN";
const string OrgId        = "YOUR_ORGANIZATION_ID";
const string BaseUrl      = "https://api.turbodocx.com";
const string TemplateName = "Employee Contract Template";
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

// ── POST /api/templates/upload ──────────────────────────────────────
// Path A: upload a .docx/.pptx template; TurboDocx extracts its variables
app.MapPost("/api/templates/upload", async (IHttpClientFactory httpFactory) =>
{
    if (!File.Exists(TemplatePath))
    {
        return Results.NotFound($"Template file not found: {TemplatePath}");
    }

    using var form = new MultipartFormDataContent();

    var fileContent = new ByteArrayContent(await File.ReadAllBytesAsync(TemplatePath));
    fileContent.Headers.ContentType = new MediaTypeHeaderValue(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    form.Add(fileContent, "templateFile", Path.GetFileName(TemplatePath));
    form.Add(new StringContent(TemplateName), "name");
    form.Add(new StringContent("Standard employee contract with variable placeholders"), "description");
    form.Add(new StringContent("[]"), "variables");
    form.Add(new StringContent("[]"), "tags");

    var client   = httpFactory.CreateClient("TurboDocx");
    var response = await client.PostAsync("/template/upload-and-create", form);

    // Upload and create answers 201 Created
    if (response.StatusCode != HttpStatusCode.Created)
    {
        var error = await response.Content.ReadAsStringAsync();
        return Results.Problem($"TurboDocx API error: {error}", statusCode: (int)response.StatusCode);
    }

    // { "data": { "results": { "template": { "id", "name", "variables", ... }, "redirectUrl" } } }
    var body = await response.Content.ReadAsStringAsync();
    return Results.Content(body, "application/json");
});

app.Run();
