using System.Text.Json.Nodes;
using System.Web;
using Microsoft.AspNetCore.Mvc;

// Register in Program.cs:
//   builder.Services.AddControllers();
//   builder.Services.AddHttpClient<TemplateBrowserController>();
//   app.MapControllers();

[ApiController]
[Route("api/templates")]
public class TemplateBrowserController : ControllerBase
{
    // Configuration - Update these values
    private const string ApiToken = "YOUR_API_TOKEN";
    private const string OrgId = "YOUR_ORGANIZATION_ID";
    private const string BaseUrl = "https://api.turbodocx.com";

    private readonly HttpClient _httpClient;

    public TemplateBrowserController(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(BaseUrl);
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {ApiToken}");
        _httpClient.DefaultRequestHeaders.Add("x-rapiddocx-org-id", OrgId);
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
    }

    /// <summary>
    /// Path B: browse templates and folders.
    /// GET api/templates?query=contract&amp;limit=25&amp;offset=0&amp;selectedTags=TAG_ID
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> BrowseTemplates(
        [FromQuery] string? query,
        [FromQuery] int limit = 25,
        [FromQuery] int offset = 0,
        [FromQuery] string[]? selectedTags = null)
    {
        var queryString = $"limit={limit}&offset={offset}&showTags=true";
        if (!string.IsNullOrEmpty(query))
        {
            queryString += $"&query={HttpUtility.UrlEncode(query)}";
        }

        // Repeat selectedTags once per tag ID (the API reads ?selectedTags=<id>&selectedTags=<id>)
        foreach (var tagId in selectedTags ?? Array.Empty<string>())
        {
            queryString += $"&selectedTags={HttpUtility.UrlEncode(tagId)}";
        }

        var response = await _httpClient.GetAsync($"/template-item?{queryString}");
        if (!response.IsSuccessStatusCode)
        {
            return StatusCode(502, new { error = await response.Content.ReadAsStringAsync() });
        }

        var data = JsonNode.Parse(await response.Content.ReadAsStringAsync())!["data"]!;
        var items = data["results"]!.AsArray();

        return Ok(new
        {
            totalRecords = data["totalRecords"]?.GetValue<int>(),
            templates = items.Where(item => (string?)item?["type"] == "template"),
            folders = items.Where(item => (string?)item?["type"] == "folder"),
        });
    }

    /// <summary>
    /// Template details (variables, fonts) and its PDF preview link.
    /// GET api/templates/{id}
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTemplate(string id)
    {
        var templatePath = $"/template/{Uri.EscapeDataString(id)}";

        var details = await _httpClient.GetAsync(templatePath);
        var preview = await _httpClient.GetAsync($"{templatePath}/previewpdflink");
        if (!details.IsSuccessStatusCode || !preview.IsSuccessStatusCode)
        {
            return StatusCode(502, new { error = "Failed to load the template" });
        }

        var template = JsonNode.Parse(await details.Content.ReadAsStringAsync())!["data"]!["results"]!;
        var previewUrl = JsonNode.Parse(await preview.Content.ReadAsStringAsync())!["results"]!;

        return Ok(new
        {
            id = (string?)template["id"],
            name = (string?)template["name"],
            defaultFont = (string?)template["defaultFont"],
            variables = template["variables"],
            pdfPreviewUrl = (string?)previewUrl,
        });
    }
}
