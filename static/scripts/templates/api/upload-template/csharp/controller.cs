using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;

// Register in Program.cs:
//   builder.Services.AddControllers();
//   builder.Services.AddHttpClient<TemplateUploadController>();
//   app.MapControllers();

[ApiController]
[Route("api/templates")]
public class TemplateUploadController : ControllerBase
{
    // Configuration - Update these values
    private const string ApiToken = "YOUR_API_TOKEN";
    private const string OrgId = "YOUR_ORGANIZATION_ID";
    private const string BaseUrl = "https://api.turbodocx.com";
    private const string TemplatePath = "./contract-template.docx";

    private readonly HttpClient _httpClient;

    public TemplateUploadController(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(BaseUrl);
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {ApiToken}");
        _httpClient.DefaultRequestHeaders.Add("x-rapiddocx-org-id", OrgId);
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
    }

    /// <summary>
    /// Path A: upload a .docx/.pptx template; TurboDocx extracts its variables.
    /// POST api/templates/upload
    /// </summary>
    [HttpPost("upload")]
    public async Task<IActionResult> UploadTemplate()
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

        var response = await _httpClient.PostAsync("/template/upload-and-create", form);

        // Upload and create answers 201 Created
        if (response.StatusCode != HttpStatusCode.Created)
        {
            var error = await response.Content.ReadAsStringAsync();
            return StatusCode(502, new { error = "Template upload failed", details = error });
        }

        // { "data": { "results": { "template": { "id", "name", "variables", ... }, "redirectUrl" } } }
        var body = await response.Content.ReadAsStringAsync();
        return Content(body, "application/json");
    }
}
