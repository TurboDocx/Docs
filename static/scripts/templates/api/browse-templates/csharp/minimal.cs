using System.Text.Json.Nodes;
using System.Web;

// ── Configuration ───────────────────────────────────────────────────
const string ApiToken = "YOUR_API_TOKEN";
const string OrgId    = "YOUR_ORGANIZATION_ID";
const string BaseUrl  = "https://api.turbodocx.com";

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

// ── GET /api/templates?query=contract&selectedTags=TAG_ID ───────────
// Path B: browse templates and folders
app.MapGet("/api/templates", async (IHttpClientFactory httpFactory, string? query, int? limit, int? offset, string[]? selectedTags) =>
{
    var queryString = $"limit={limit ?? 25}&offset={offset ?? 0}&showTags=true";
    if (!string.IsNullOrEmpty(query))
    {
        queryString += $"&query={HttpUtility.UrlEncode(query)}";
    }

    // Repeat selectedTags once per tag ID (the API reads ?selectedTags=<id>&selectedTags=<id>)
    foreach (var tagId in selectedTags ?? Array.Empty<string>())
    {
        queryString += $"&selectedTags={HttpUtility.UrlEncode(tagId)}";
    }

    var client   = httpFactory.CreateClient("TurboDocx");
    var response = await client.GetAsync($"/template-item?{queryString}");

    if (!response.IsSuccessStatusCode)
    {
        return Results.Problem(await response.Content.ReadAsStringAsync(), statusCode: 502);
    }

    var data  = JsonNode.Parse(await response.Content.ReadAsStringAsync())!["data"]!;
    var items = data["results"]!.AsArray();

    return Results.Ok(new
    {
        totalRecords = data["totalRecords"]?.GetValue<int>(),
        templates    = items.Where(item => (string?)item?["type"] == "template"),
        folders      = items.Where(item => (string?)item?["type"] == "folder"),
    });
});

// ── GET /api/templates/{id} ─────────────────────────────────────────
// Template details (variables, fonts) and its PDF preview link
app.MapGet("/api/templates/{id}", async (string id, IHttpClientFactory httpFactory) =>
{
    var client       = httpFactory.CreateClient("TurboDocx");
    var templatePath = $"/template/{Uri.EscapeDataString(id)}";

    var details = await client.GetAsync(templatePath);
    var preview = await client.GetAsync($"{templatePath}/previewpdflink");

    if (!details.IsSuccessStatusCode || !preview.IsSuccessStatusCode)
    {
        return Results.Problem("Failed to load the template", statusCode: 502);
    }

    var template   = JsonNode.Parse(await details.Content.ReadAsStringAsync())!["data"]!["results"]!;
    var previewUrl = JsonNode.Parse(await preview.Content.ReadAsStringAsync())!["results"]!;

    return Results.Ok(new
    {
        id            = (string?)template["id"],
        name          = (string?)template["name"],
        defaultFont   = (string?)template["defaultFont"],
        variables     = template["variables"],
        pdfPreviewUrl = (string?)previewUrl,
    });
});

app.Run();
