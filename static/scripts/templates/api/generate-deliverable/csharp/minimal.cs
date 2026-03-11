using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

// ── Configuration ───────────────────────────────────────────────────
const string ApiToken = "YOUR_API_TOKEN";
const string OrgId    = "YOUR_ORGANIZATION_ID";
const string BaseUrl  = "https://api.turbodocx.com";

// ── Record types ────────────────────────────────────────────────────
record Subvariable(
    [property: JsonPropertyName("placeholder")] string Placeholder,
    [property: JsonPropertyName("text")]        string Text,
    [property: JsonPropertyName("mimeType")]    string MimeType
);

record Variable(
    [property: JsonPropertyName("placeholder")]   string Placeholder,
    [property: JsonPropertyName("text")]           string Text,
    [property: JsonPropertyName("mimeType")]       string MimeType,
    [property: JsonPropertyName("subvariables")]   Subvariable[]? Subvariables = null
);

record DeliverableRequest(
    [property: JsonPropertyName("templateId")]    string TemplateId,
    [property: JsonPropertyName("name")]          string Name,
    [property: JsonPropertyName("description")]   string Description,
    [property: JsonPropertyName("variables")]     Variable[] Variables,
    [property: JsonPropertyName("tags")]          string[] Tags,
    [property: JsonPropertyName("replaceFonts")]  bool ReplaceFonts = true
);

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

// ── POST /api/deliverable/generate ──────────────────────────────────
app.MapPost("/api/deliverable/generate", async (IHttpClientFactory httpFactory) =>
{
    var request = new DeliverableRequest(
        TemplateId:  "YOUR_TEMPLATE_ID",
        Name:        "Employee Contract - John Smith",
        Description: "Employment contract for new senior developer",
        Variables: new Variable[]
        {
            new("{EmployeeName}", "John Smith",              "text"),
            new("{CompanyName}",  "TechCorp Solutions Inc.",  "text"),
            new("{JobTitle}",     "Senior Software Engineer", "text"),
            new(
                Placeholder:  "{ContactBlock}",
                Text:         "<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>",
                MimeType:     "html",
                Subvariables: new Subvariable[]
                {
                    new("{contactName}",  "Jane Doe",        "text"),
                    new("{contactPhone}", "(555) 123-4567", "text")
                }
            )
        },
        Tags:         new[] { "hr", "contract", "employee" },
        DefaultFont:  "Arial",
        ReplaceFonts: true
    );

    var client  = httpFactory.CreateClient("TurboDocx");
    var json    = JsonSerializer.Serialize(request);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    var response = await client.PostAsync("/v1/deliverable", content);

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadAsStringAsync();
        return Results.Problem($"TurboDocx API error: {error}", statusCode: (int)response.StatusCode);
    }

    var body = await response.Content.ReadAsStringAsync();
    return Results.Content(body, "application/json");
});

// ── GET /api/deliverable/download/{id} ──────────────────────────────
app.MapGet("/api/deliverable/download/{id}", async (string id, IHttpClientFactory httpFactory) =>
{
    var client   = httpFactory.CreateClient("TurboDocx");
    var response = await client.GetAsync($"/v1/deliverable/file/{id}");

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadAsStringAsync();
        return Results.Problem($"Download failed: {error}", statusCode: (int)response.StatusCode);
    }

    var fileBytes   = await response.Content.ReadAsByteArrayAsync();
    var contentType = response.Content.Headers.ContentType?.ToString()
                      ?? "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return Results.File(fileBytes, contentType, $"deliverable-{id}.docx");
});

app.Run();
