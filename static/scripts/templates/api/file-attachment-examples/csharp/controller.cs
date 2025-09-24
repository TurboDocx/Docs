using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace TurboDocxFileAttachment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplateUploadController : ControllerBase
    {
        // Configuration - Update these values
        private const string API_TOKEN = "YOUR_API_TOKEN";
        private const string ORG_ID = "YOUR_ORGANIZATION_ID";
        private const string BASE_URL = "https://api.turbodocx.com";

        private readonly HttpClient _httpClient;
        private readonly ILogger<TemplateUploadController> _logger;

        public TemplateUploadController(HttpClient httpClient, ILogger<TemplateUploadController> logger)
        {
            _httpClient = httpClient;
            _logger = logger;

            // Configure HTTP client
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {API_TOKEN}");
            _httpClient.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "TurboDocx C# Controller Client");
        }

        /// <summary>
        /// Upload template with Excel data file attachment and sheet selection
        /// </summary>
        [HttpPost("upload-with-data")]
        public async Task<IActionResult> UploadTemplateWithDataFile(
            [FromForm] IFormFile templateFile,
            [FromForm] IFormFile dataFile,
            [FromForm] string templateName = "C# Controller Template",
            [FromForm] string templateDescription = "Template uploaded via C# Controller",
            [FromForm] string selectedSheet = "Sheet1",
            [FromForm] string dataRange = "A1:F50",
            [FromForm] string aiHint = "")
        {
            try
            {
                // Validate input
                if (templateFile == null || dataFile == null)
                {
                    return BadRequest(new { error = "Both templateFile and dataFile are required" });
                }

                if (templateFile.Length == 0 || dataFile.Length == 0)
                {
                    return BadRequest(new { error = "Both files must have content" });
                }

                // Generate unique data file ID
                var dataFileId = $"controller-data-{Math.Abs(dataFile.FileName.GetHashCode() % 10000)}";

                // Prepare multipart form content
                using var formContent = new MultipartFormDataContent();

                // Add template file
                var templateContent = new StreamContent(templateFile.OpenReadStream());
                templateContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
                    templateFile.ContentType ?? "application/octet-stream");
                formContent.Add(templateContent, "templateFile", templateFile.FileName);

                // Add data file
                var dataContent = new StreamContent(dataFile.OpenReadStream());
                dataContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
                    dataFile.ContentType ?? "application/octet-stream");
                formContent.Add(dataContent, $"FileResource-{dataFileId}", dataFile.FileName);

                // Sheet selection and data range metadata
                var fileMetadata = new Dictionary<string, object>
                {
                    [dataFileId] = new
                    {
                        selectedSheet = selectedSheet,
                        hasMultipleSheets = true,
                        dataRange = dataRange,
                        description = "C# Controller uploaded data source"
                    }
                };

                // Add form fields
                formContent.Add(new StringContent(templateName), "name");
                formContent.Add(new StringContent(templateDescription), "description");
                formContent.Add(new StringContent(JsonSerializer.Serialize(fileMetadata)), "fileResourceMetadata");
                formContent.Add(new StringContent(JsonSerializer.Serialize(new[] { "csharp-controller", "data-enhanced", "file-attachment" })), "tags");

                // Add variables if AI hint is provided
                if (!string.IsNullOrEmpty(aiHint))
                {
                    var variables = new[]
                    {
                        new
                        {
                            name = "Controller Generated Content",
                            placeholder = "{ControllerContent}",
                            aiHint = aiHint,
                            dataSourceId = dataFileId
                        },
                        new
                        {
                            name = "Spreadsheet Analysis",
                            placeholder = "{SpreadsheetAnalysis}",
                            aiHint = $"Analyze spreadsheet data from {selectedSheet} sheet, range {dataRange}",
                            dataSourceId = dataFileId
                        }
                    };
                    formContent.Add(new StringContent(JsonSerializer.Serialize(variables)), "variables");
                }

                _logger.LogInformation("Controller: Uploading template {TemplateFileName}", templateFile.FileName);
                _logger.LogInformation("Controller: Data source {DataFileName} (Sheet: {SelectedSheet})",
                    dataFile.FileName, selectedSheet);
                _logger.LogInformation("Controller: Data range: {DataRange}", dataRange);

                // Upload to TurboDocx API
                var response = await _httpClient.PostAsync($"{BASE_URL}/template/upload-and-create", formContent);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("TurboDocx API error: {StatusCode} - {ErrorContent}",
                        response.StatusCode, errorContent);

                    return StatusCode((int)response.StatusCode, new
                    {
                        error = "TurboDocx API error",
                        detail = errorContent
                    });
                }

                var resultJson = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(resultJson);
                var template = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("template");

                var result = new
                {
                    success = true,
                    message = "Template with data file uploaded successfully via C# Controller",
                    template = new
                    {
                        id = template.GetProperty("id").GetString(),
                        name = template.GetProperty("name").GetString(),
                        variables_count = template.TryGetProperty("variables", out var vars) ? vars.GetArrayLength() : 0,
                        data_sources_count = template.TryGetProperty("dataSources", out var sources) ? sources.GetArrayLength() : 0,
                        default_font = template.TryGetProperty("defaultFont", out var font) ? font.GetString() : "N/A",
                        fonts_count = template.TryGetProperty("fonts", out var fonts) ? fonts.GetArrayLength() : 0
                    },
                    data_source = new
                    {
                        filename = dataFile.FileName,
                        selected_sheet = selectedSheet,
                        data_range = dataRange,
                        file_size_mb = Math.Round(dataFile.Length / 1024.0 / 1024.0, 2)
                    },
                    redirect_url = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("redirectUrl").GetString()
                };

                _logger.LogInformation("Template uploaded successfully: {TemplateId}", result.template.id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading template with data file");
                return StatusCode(500, new { error = "Upload failed", detail = ex.Message });
            }
        }

        /// <summary>
        /// Upload template with multiple sheets from the same Excel file
        /// </summary>
        [HttpPost("upload-multi-sheet")]
        public async Task<IActionResult> UploadTemplateWithMultipleSheets(
            [FromForm] IFormFile templateFile,
            [FromForm] IFormFile dataFile,
            [FromForm] string templateName = "Multi-Sheet Controller Template",
            [FromForm] string primarySheet = "Summary",
            [FromForm] string alternativeSheets = "Revenue,Expenses,Projections")
        {
            try
            {
                if (templateFile == null || dataFile == null)
                {
                    return BadRequest(new { error = "Both templateFile and dataFile are required" });
                }

                // Parse alternative sheets
                var alternativeSheetsArray = alternativeSheets.Split(',')
                    .Select(s => s.Trim())
                    .Where(s => !string.IsNullOrEmpty(s))
                    .ToArray();

                var dataFileId = $"controller-multisheet-{Math.Abs(dataFile.FileName.GetHashCode() % 10000)}";

                using var formContent = new MultipartFormDataContent();

                // Add files
                var templateContent = new StreamContent(templateFile.OpenReadStream());
                templateContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
                    templateFile.ContentType ?? "application/octet-stream");
                formContent.Add(templateContent, "templateFile", templateFile.FileName);

                var dataContent = new StreamContent(dataFile.OpenReadStream());
                dataContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
                    dataFile.ContentType ?? "application/octet-stream");
                formContent.Add(dataContent, $"FileResource-{dataFileId}", dataFile.FileName);

                // Define multiple sheet usage
                var fileMetadata = new Dictionary<string, object>
                {
                    [dataFileId] = new
                    {
                        selectedSheet = primarySheet,
                        hasMultipleSheets = true,
                        alternativeSheets = alternativeSheetsArray,
                        dataRange = "A1:Z100",
                        description = "C# Controller multi-sheet data source"
                    }
                };

                // Variables that reference different sheets
                var variables = new List<object>
                {
                    new
                    {
                        name = "Primary Sheet Analysis",
                        placeholder = "{PrimaryAnalysis}",
                        aiHint = $"Create comprehensive analysis from {primarySheet} sheet data",
                        dataSourceId = dataFileId,
                        sheetReference = primarySheet
                    }
                };

                // Add variables for alternative sheets (limit to 3)
                foreach (var sheet in alternativeSheetsArray.Take(3))
                {
                    variables.Add(new
                    {
                        name = $"{sheet} Insights",
                        placeholder = $"{{{sheet.Replace(" ", "")}Insights}}",
                        aiHint = $"Generate insights and trends from {sheet} sheet data",
                        dataSourceId = dataFileId,
                        sheetReference = sheet
                    });
                }

                // Add form fields
                formContent.Add(new StringContent(templateName), "name");
                formContent.Add(new StringContent("C# Controller multi-sheet data analysis template"), "description");
                formContent.Add(new StringContent(JsonSerializer.Serialize(fileMetadata)), "fileResourceMetadata");
                formContent.Add(new StringContent(JsonSerializer.Serialize(variables)), "variables");
                formContent.Add(new StringContent(JsonSerializer.Serialize(new[] { "csharp-controller-multi", "comprehensive", "data-analysis" })), "tags");

                _logger.LogInformation("Controller: Uploading multi-sheet template {TemplateFileName}", templateFile.FileName);
                _logger.LogInformation("Controller: Primary sheet: {PrimarySheet}, Alternative sheets: {AlternativeSheets}",
                    primarySheet, string.Join(", ", alternativeSheetsArray));

                var response = await _httpClient.PostAsync($"{BASE_URL}/template/upload-and-create", formContent);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Multi-sheet upload error: {StatusCode} - {ErrorContent}",
                        response.StatusCode, errorContent);

                    return StatusCode((int)response.StatusCode, new
                    {
                        error = "Multi-sheet upload failed",
                        detail = errorContent
                    });
                }

                var resultJson = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(resultJson);
                var template = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("template");

                var result = new
                {
                    success = true,
                    message = "Multi-sheet template uploaded successfully via C# Controller",
                    template = new
                    {
                        id = template.GetProperty("id").GetString(),
                        name = template.GetProperty("name").GetString(),
                        sheets_referenced = new[] { primarySheet }.Concat(alternativeSheetsArray).ToArray(),
                        variables_count = template.TryGetProperty("variables", out var vars) ? vars.GetArrayLength() : 0
                    },
                    sheets_configuration = new
                    {
                        primary_sheet = primarySheet,
                        alternative_sheets = alternativeSheetsArray,
                        total_sheets_configured = 1 + alternativeSheetsArray.Length
                    }
                };

                _logger.LogInformation("Multi-sheet template uploaded successfully: {TemplateId}", result.template.id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading multi-sheet template");
                return StatusCode(500, new { error = "Multi-sheet upload failed", detail = ex.Message });
            }
        }

        /// <summary>
        /// API information endpoint
        /// </summary>
        [HttpGet]
        public IActionResult GetApiInfo()
        {
            return Ok(new
            {
                message = "TurboDocx C# Controller File Attachment API",
                endpoints = new
                {
                    post_upload_with_data = "POST /api/templateupload/upload-with-data - Upload template with single sheet data",
                    post_upload_multi_sheet = "POST /api/templateupload/upload-multi-sheet - Upload template with multi-sheet data",
                    get_api_info = "GET /api/templateupload - API information"
                },
                description = "Upload templates with Excel data file attachments and sheet selection using C# Controller",
                supported_formats = new
                {
                    templates = new[] { "docx", "pptx" },
                    data_files = new[] { "xlsx", "xls", "csv" }
                }
            });
        }
    }
}

// Program.cs configuration
public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services
        builder.Services.AddControllers();
        builder.Services.AddHttpClient();
        builder.Services.AddLogging();

        // Configure file upload limits
        builder.Services.Configure<IISServerOptions>(options =>
        {
            options.MaxRequestBodySize = 50 * 1024 * 1024; // 50MB
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseRouting();
        app.MapControllers();

        Console.WriteLine("Starting C# Controller API server for TurboDocx file attachment examples...");
        Console.WriteLine("Available endpoints:");
        Console.WriteLine("  POST /api/templateupload/upload-with-data - Upload template with single sheet data");
        Console.WriteLine("  POST /api/templateupload/upload-multi-sheet - Upload template with multi-sheet data");
        Console.WriteLine("  GET /api/templateupload - API information");

        app.Run();
    }
}