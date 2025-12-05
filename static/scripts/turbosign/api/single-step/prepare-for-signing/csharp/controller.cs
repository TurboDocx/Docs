using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TurboSign.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SignatureController : ControllerBase
    {
        private const string API_TOKEN = "YOUR_API_TOKEN";
        private const string ORG_ID = "YOUR_ORGANIZATION_ID";
        private const string BASE_URL = "https://api.turbodocx.com";
        private readonly HttpClient _httpClient;

        public SignatureController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost("prepare-for-signing")]
        public async Task<IActionResult> PrepareForSigning(IFormFile file)
        {
            try
            {
                using var formData = new MultipartFormDataContent();

                // Add file
                var fileContent = new StreamContent(file.OpenReadStream());
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
                formData.Add(fileContent, "file", file.FileName);

                // Add document metadata
                formData.Add(new StringContent("Contract Agreement"), "documentName");
                formData.Add(new StringContent("Please review and sign this contract"), "documentDescription");
                formData.Add(new StringContent("Your Company"), "senderName");
                formData.Add(new StringContent("sender@company.com"), "senderEmail");

                // Add recipients (as JSON string)
                var recipients = JsonSerializer.Serialize(new[]
                {
                    new
                    {
                        name = "John Smith",
                        email = "john.smith@company.com",
                        signingOrder = 1
                    },
                    new
                    {
                        name = "Jane Doe",
                        email = "jane.doe@partner.com",
                        signingOrder = 2
                    }
                });
                formData.Add(new StringContent(recipients), "recipients");

                // Add fields (as JSON string) - Coordinate-based positioning
                var fields = JsonSerializer.Serialize(new[]
                {
                    new
                    {
                        recipientEmail = "john.smith@company.com",
                        type = "signature",
                        page = 1,
                        x = 100,
                        y = 200,
                        width = 200,
                        height = 80,
                        required = true
                    },
                    new
                    {
                        recipientEmail = "john.smith@company.com",
                        type = "date",
                        page = 1,
                        x = 100,
                        y = 300,
                        width = 150,
                        height = 30,
                        required = true
                    },
                    new
                    {
                        recipientEmail = "jane.doe@partner.com",
                        type = "signature",
                        page = 1,
                        x = 350,
                        y = 200,
                        width = 200,
                        height = 80,
                        required = true
                    }
                });
                formData.Add(new StringContent(fields), "fields");

                // Optional: Add CC emails
                var ccEmails = JsonSerializer.Serialize(new[] { "manager@company.com", "legal@company.com" });
                formData.Add(new StringContent(ccEmails), "ccEmails");

                // Set headers
                var request = new HttpRequestMessage(HttpMethod.Post, $"{BASE_URL}/turbosign/single/prepare-for-signing")
                {
                    Content = formData
                };
                request.Headers.Add("Authorization", $"Bearer {API_TOKEN}");
                request.Headers.Add("x-rapiddocx-org-id", ORG_ID);
                request.Headers.Add("User-Agent", "TurboDocx API Client");

                // Send request
                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

                if (result.GetProperty("success").GetBoolean())
                {
                    return Ok(new
                    {
                        success = true,
                        documentId = result.GetProperty("documentId").GetString(),
                        message = result.GetProperty("message").GetString()
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        error = result.GetProperty("error").GetString(),
                        code = result.TryGetProperty("code", out var code) ? code.GetString() : null
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = "Internal server error",
                    message = ex.Message
                });
            }
        }
    }
}
