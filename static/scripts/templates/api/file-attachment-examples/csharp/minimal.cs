using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Configuration - Update these values
const string API_TOKEN = "YOUR_API_TOKEN";
const string ORG_ID = "YOUR_ORGANIZATION_ID";
const string BASE_URL = "https://api.turbodocx.com";

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseRouting();

// Upload template with Excel data file attachment and sheet selection
app.MapPost("/upload-template-with-data", async (HttpRequest request) =>
{
    try
    {
        if (!request.HasFormContentType)
        {
            return Results.BadRequest("Request must be multipart/form-data");
        }

        var form = await request.ReadFormAsync();

        // Check required files
        if (!form.Files.Any(f => f.Name == "templateFile") ||
            !form.Files.Any(f => f.Name == "dataFile"))
        {
            return Results.BadRequest("Both templateFile and dataFile are required");
        }

        var templateFile = form.Files["templateFile"];
        var dataFile = form.Files["dataFile"];

        // Get form parameters
        var templateName = form["templateName"].ToString() ?? "C# Minimal API Template";
        var templateDescription = form["templateDescription"].ToString() ?? "Template uploaded via C# Minimal API";
        var selectedSheet = form["selectedSheet"].ToString() ?? "Sheet1";
        var dataRange = form["dataRange"].ToString() ?? "A1:F50";
        var aiHint = form["aiHint"].ToString() ?? "";

        // Generate unique data file ID
        var dataFileId = $"csharp-data-{Math.Abs(dataFile.FileName.GetHashCode() % 10000)}";

        using var httpClient = new HttpClient();

        // Prepare multipart form content
        using var formContent = new MultipartFormDataContent();

        // Add template file
        var templateContent = new StreamContent(templateFile.OpenReadStream());
        templateContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(templateFile.ContentType ?? "application/octet-stream");
        formContent.Add(templateContent, "templateFile", templateFile.FileName);

        // Add data file
        var dataContent = new StreamContent(dataFile.OpenReadStream());
        dataContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(dataFile.ContentType ?? "application/octet-stream");
        formContent.Add(dataContent, $"FileResource-{dataFileId}", dataFile.FileName);

        // Sheet selection and data range metadata
        var fileMetadata = new Dictionary<string, object>
        {
            [dataFileId] = new
            {
                selectedSheet = selectedSheet,
                hasMultipleSheets = true,
                dataRange = dataRange,
                description = "C# Minimal API uploaded data source"
            }
        };

        // Add form fields
        formContent.Add(new StringContent(templateName), "name");
        formContent.Add(new StringContent(templateDescription), "description");
        formContent.Add(new StringContent(JsonSerializer.Serialize(fileMetadata)), "fileResourceMetadata");
        formContent.Add(new StringContent(JsonSerializer.Serialize(new[] { "csharp-minimal", "data-enhanced", "file-attachment" })), "tags");

        // Add variables if AI hint is provided
        if (!string.IsNullOrEmpty(aiHint))
        {
            var variables = new[]
            {
                new
                {
                    name = "C# Generated Content",
                    placeholder = "{CSharpContent}",
                    aiHint = aiHint,
                    dataSourceId = dataFileId
                },
                new
                {
                    name = "Data Analysis",
                    placeholder = "{DataAnalysis}",
                    aiHint = $"Analyze data from {selectedSheet} sheet, range {dataRange}",
                    dataSourceId = dataFileId
                }
            };
            formContent.Add(new StringContent(JsonSerializer.Serialize(variables)), "variables");
        }

        // Set headers
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {API_TOKEN}");
        httpClient.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        httpClient.DefaultRequestHeaders.Add("User-Agent", "TurboDocx C# Minimal API Client");

        Console.WriteLine($"C# Minimal API: Uploading template {templateFile.FileName}");
        Console.WriteLine($"C# Minimal API: Data source {dataFile.FileName} (Sheet: {selectedSheet})");
        Console.WriteLine($"C# Minimal API: Data range: {dataRange}");

        // Upload to TurboDocx API
        var response = await httpClient.PostAsync($"{BASE_URL}/template/upload-and-create", formContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            return Results.Problem(
                detail: $"TurboDocx API error: {errorContent}",
                statusCode: (int)response.StatusCode,
                title: "Upload Failed"
            );
        }

        var resultJson = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(resultJson);
        var template = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("template");

        return Results.Ok(new
        {
            success = true,
            message = "Template with data file uploaded successfully via C# Minimal API",
            template = new
            {
                id = template.GetProperty("id").GetString(),
                name = template.GetProperty("name").GetString(),
                variables_count = template.TryGetProperty("variables", out var vars) ? vars.GetArrayLength() : 0,
                data_sources_count = template.TryGetProperty("dataSources", out var sources) ? sources.GetArrayLength() : 0,
                default_font = template.TryGetProperty("defaultFont", out var font) ? font.GetString() : "N/A"
            },
            data_source = new
            {
                filename = dataFile.FileName,
                selected_sheet = selectedSheet,
                data_range = dataRange
            },
            redirect_url = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("redirectUrl").GetString()
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Upload error: {ex.Message}");
        return Results.Problem(
            detail: ex.Message,
            statusCode: 500,
            title: "Internal Server Error"
        );
    }
});

// Upload template with multiple sheets from the same Excel file
app.MapPost("/upload-multi-sheet-template", async (HttpRequest request) =>
{
    try
    {
        if (!request.HasFormContentType)
        {
            return Results.BadRequest("Request must be multipart/form-data");
        }

        var form = await request.ReadFormAsync();

        if (!form.Files.Any(f => f.Name == "templateFile") ||
            !form.Files.Any(f => f.Name == "dataFile"))
        {
            return Results.BadRequest("Both templateFile and dataFile are required");
        }

        var templateFile = form.Files["templateFile"];
        var dataFile = form.Files["dataFile"];

        var templateName = form["templateName"].ToString() ?? "Multi-Sheet C# Template";
        var primarySheet = form["primarySheet"].ToString() ?? "Summary";
        var alternativeSheetsStr = form["alternativeSheets"].ToString() ?? "Revenue,Expenses,Projections";

        // Parse alternative sheets
        var alternativeSheets = alternativeSheetsStr.Split(',')
            .Select(s => s.Trim())
            .Where(s => !string.IsNullOrEmpty(s))
            .ToArray();

        var dataFileId = $"csharp-multisheet-{Math.Abs(dataFile.FileName.GetHashCode() % 10000)}";

        using var httpClient = new HttpClient();
        using var formContent = new MultipartFormDataContent();

        // Add files
        var templateContent = new StreamContent(templateFile.OpenReadStream());
        templateContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(templateFile.ContentType ?? "application/octet-stream");
        formContent.Add(templateContent, "templateFile", templateFile.FileName);

        var dataContent = new StreamContent(dataFile.OpenReadStream());
        dataContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(dataFile.ContentType ?? "application/octet-stream");
        formContent.Add(dataContent, $"FileResource-{dataFileId}", dataFile.FileName);

        // Define multiple sheet usage
        var fileMetadata = new Dictionary<string, object>
        {
            [dataFileId] = new
            {
                selectedSheet = primarySheet,
                hasMultipleSheets = true,
                alternativeSheets = alternativeSheets,
                dataRange = "A1:Z100",
                description = "C# multi-sheet data source"
            }
        };

        // Variables that reference different sheets
        var variables = new List<object>
        {
            new
            {
                name = "Primary Sheet Summary",
                placeholder = "{PrimarySummary}",
                aiHint = $"Create summary from {primarySheet} sheet data",
                dataSourceId = dataFileId,
                sheetReference = primarySheet
            }
        };

        // Add variables for alternative sheets (limit to 3)
        foreach (var sheet in alternativeSheets.Take(3))
        {
            variables.Add(new
            {
                name = $"{sheet} Analysis",
                placeholder = $"{{{sheet.Replace(" ", "")}Analysis}}",
                aiHint = $"Analyze data trends from {sheet} sheet",
                dataSourceId = dataFileId,
                sheetReference = sheet
            });
        }

        // Add form fields
        formContent.Add(new StringContent(templateName), "name");
        formContent.Add(new StringContent("C# multi-sheet data analysis template"), "description");
        formContent.Add(new StringContent(JsonSerializer.Serialize(fileMetadata)), "fileResourceMetadata");
        formContent.Add(new StringContent(JsonSerializer.Serialize(variables)), "variables");
        formContent.Add(new StringContent(JsonSerializer.Serialize(new[] { "csharp-multi-sheet", "comprehensive", "data-analysis" })), "tags");

        // Set headers
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {API_TOKEN}");
        httpClient.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        httpClient.DefaultRequestHeaders.Add("User-Agent", "TurboDocx C# Minimal API Client");

        var response = await httpClient.PostAsync($"{BASE_URL}/template/upload-and-create", formContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            return Results.Problem(
                detail: $"TurboDocx API error: {errorContent}",
                statusCode: (int)response.StatusCode,
                title: "Multi-Sheet Upload Failed"
            );
        }

        var resultJson = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(resultJson);
        var template = document.RootElement.GetProperty("data").GetProperty("results").GetProperty("template");

        return Results.Ok(new
        {
            success = true,
            message = "Multi-sheet template uploaded successfully via C# Minimal API",
            template = new
            {
                id = template.GetProperty("id").GetString(),
                name = template.GetProperty("name").GetString(),
                sheets_referenced = new[] { primarySheet }.Concat(alternativeSheets).ToArray(),
                variables_count = template.TryGetProperty("variables", out var vars) ? vars.GetArrayLength() : 0
            },
            sheets_configuration = new
            {
                primary_sheet = primarySheet,
                alternative_sheets = alternativeSheets
            }
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Multi-sheet upload error: {ex.Message}");
        return Results.Problem(
            detail: ex.Message,
            statusCode: 500,
            title: "Internal Server Error"
        );
    }
});

// API information endpoint
app.MapGet("/", () => Results.Ok(new
{
    message = "TurboDocx C# Minimal API File Attachment Service",
    endpoints = new
    {
        post_upload_template_with_data = "Upload template with single sheet data file",
        post_upload_multi_sheet_template = "Upload template with multi-sheet data file",
        get_root = "API information"
    },
    description = "Upload templates with Excel data file attachments and sheet selection using C# Minimal API"
}));

Console.WriteLine("Starting C# Minimal API server for TurboDocx file attachment examples...");
Console.WriteLine("Available endpoints:");
Console.WriteLine("  POST /upload-template-with-data - Upload template with single sheet data");
Console.WriteLine("  POST /upload-multi-sheet-template - Upload template with multi-sheet data");
Console.WriteLine("  GET / - API information");

app.Run();