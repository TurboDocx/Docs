using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;

namespace TurboDocx.Webhooks
{
    // Functional webhook verification methods
    public static class WebhookVerification
    {
        /// <summary>
        /// Verifies a TurboDocx webhook signature
        /// </summary>
        /// <param name="signature">X-TurboDocx-Signature header value</param>
        /// <param name="timestamp">X-TurboDocx-Timestamp header value</param>
        /// <param name="body">Raw request body</param>
        /// <param name="secret">Webhook secret</param>
        /// <returns>True if signature is valid</returns>
        public static bool VerifySignature(string signature, string timestamp, string body, string secret)
        {
            if (string.IsNullOrEmpty(signature) || string.IsNullOrEmpty(timestamp) || body == null || string.IsNullOrEmpty(secret))
                return false;

            // Check timestamp is within 5 minutes
            if (!long.TryParse(timestamp, out long webhookTime))
                return false;

            var currentTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            if (Math.Abs(currentTime - webhookTime) > 300)
                return false;

            // Generate expected signature
            var signedString = $"{timestamp}.{body}";
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(signedString));
            var expectedSignature = $"sha256={BitConverter.ToString(hash).Replace("-", "").ToLower()}";

            // Timing-safe comparison
            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(signature),
                Encoding.UTF8.GetBytes(expectedSignature)
            );
        }

        /// <summary>
        /// Process webhook event payload
        /// </summary>
        /// <param name="eventType">The event type</param>
        /// <param name="data">Event data</param>
        /// <param name="logger">Optional logger</param>
        public static async Task ProcessEventAsync(string eventType, JsonElement data, ILogger logger = null)
        {
            logger?.LogInformation("Received event: {EventType}", eventType);

            switch (eventType)
            {
                case "signature.document.completed":
                    await HandleDocumentCompletedAsync(data, logger);
                    break;

                case "signature.document.voided":
                    await HandleDocumentVoidedAsync(data, logger);
                    break;

                default:
                    logger?.LogWarning("Unknown event type: {EventType}", eventType);
                    break;
            }
        }

        private static async Task HandleDocumentCompletedAsync(JsonElement data, ILogger logger)
        {
            var documentId = data.TryGetProperty("document_id", out var idProp) ? idProp.GetString() : "unknown";
            logger?.LogInformation("Document completed: {DocumentId}", documentId);
            
            // Add your completion logic here
            await Task.CompletedTask;
        }

        private static async Task HandleDocumentVoidedAsync(JsonElement data, ILogger logger)
        {
            var documentId = data.TryGetProperty("document_id", out var idProp) ? idProp.GetString() : "unknown";
            logger?.LogInformation("Document voided: {DocumentId}", documentId);
            
            // Add your void logic here
            await Task.CompletedTask;
        }
    }

    // Simple webhook payload structure
    public struct WebhookPayload
    {
        public string Event { get; set; }
        public JsonElement Data { get; set; }
        public string Timestamp { get; set; }
    }

    // Functional webhook handler for ASP.NET Core
    [ApiController]
    [Route("api/[controller]")]
    public class WebhookController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<WebhookController> _logger;

        public WebhookController(IConfiguration configuration, ILogger<WebhookController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> HandleWebhook()
        {
            try
            {
                var webhookSecret = _configuration["TurboDocx:WebhookSecret"] ?? 
                                   _configuration["WEBHOOK_SECRET"] ?? 
                                   throw new InvalidOperationException("Webhook secret not configured");

                // Get headers
                var signature = Request.Headers["X-TurboDocx-Signature"].FirstOrDefault();
                var timestamp = Request.Headers["X-TurboDocx-Timestamp"].FirstOrDefault();

                // Read raw body
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                // Verify signature
                if (!WebhookVerification.VerifySignature(signature, timestamp, body, webhookSecret))
                {
                    _logger.LogWarning("Webhook signature verification failed");
                    return Unauthorized();
                }

                // Parse and process webhook
                var payload = JsonSerializer.Deserialize<WebhookPayload>(body);
                await WebhookVerification.ProcessEventAsync(payload.Event, payload.Data, _logger);

                return Ok();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Invalid JSON payload received");
                return BadRequest("Invalid payload");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing webhook");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    // Minimal setup helper functions
    public static class WebhookSetup
    {
        /// <summary>
        /// Simple webhook handler function for minimal APIs or Azure Functions
        /// </summary>
        public static async Task<IResult> HandleWebhookRequest(HttpRequest request, string webhookSecret, ILogger logger = null)
        {
            try
            {
                // Get headers
                var signature = request.Headers["X-TurboDocx-Signature"].FirstOrDefault();
                var timestamp = request.Headers["X-TurboDocx-Timestamp"].FirstOrDefault();

                // Read body
                using var reader = new StreamReader(request.Body);
                var body = await reader.ReadToEndAsync();

                // Verify signature
                if (!WebhookVerification.VerifySignature(signature, timestamp, body, webhookSecret))
                {
                    logger?.LogWarning("Webhook signature verification failed");
                    return Results.Unauthorized();
                }

                // Parse and process
                var payload = JsonSerializer.Deserialize<WebhookPayload>(body);
                await WebhookVerification.ProcessEventAsync(payload.Event, payload.Data, logger);

                return Results.Ok("OK");
            }
            catch (JsonException ex)
            {
                logger?.LogError(ex, "Invalid JSON payload");
                return Results.BadRequest("Invalid payload");
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Error processing webhook");
                return Results.Problem("Internal server error");
            }
        }
    }
}