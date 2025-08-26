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
    public static class WebhookVerification
    {
        /// <summary>
        /// Verifies a TurboDocx webhook signature
        /// </summary>
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

    public struct WebhookPayload
    {
        public string Event { get; set; }
        public JsonElement Data { get; set; }
        public string Timestamp { get; set; }
    }

    /// <summary>
    /// ASP.NET Core Controller-based webhook handler
    /// </summary>
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

        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            return Ok(new { 
                status = "ok", 
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() 
            });
        }
    }

    /// <summary>
    /// Alternative attribute-based approach
    /// </summary>
    public class WebhookVerificationAttribute : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var configuration = context.HttpContext.RequestServices.GetService<IConfiguration>();
            var logger = context.HttpContext.RequestServices.GetService<ILogger<WebhookVerificationAttribute>>();
            
            var webhookSecret = configuration["TurboDocx:WebhookSecret"] ?? 
                               configuration["WEBHOOK_SECRET"];

            if (string.IsNullOrEmpty(webhookSecret))
            {
                context.Result = new BadRequestObjectResult("Webhook secret not configured");
                return;
            }

            var signature = context.HttpContext.Request.Headers["X-TurboDocx-Signature"].FirstOrDefault();
            var timestamp = context.HttpContext.Request.Headers["X-TurboDocx-Timestamp"].FirstOrDefault();

            context.HttpContext.Request.EnableBuffering();
            using var reader = new StreamReader(context.HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            context.HttpContext.Request.Body.Position = 0;

            if (!WebhookVerification.VerifySignature(signature, timestamp, body, webhookSecret))
            {
                logger?.LogWarning("Webhook signature verification failed");
                context.Result = new UnauthorizedResult();
                return;
            }

            await next();
        }
    }

    /// <summary>
    /// Usage example with attribute
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SecureWebhookController : ControllerBase
    {
        private readonly ILogger<SecureWebhookController> _logger;

        public SecureWebhookController(ILogger<SecureWebhookController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [WebhookVerification]
        public async Task<IActionResult> HandleSecureWebhook()
        {
            try
            {
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();
                var payload = JsonSerializer.Deserialize<WebhookPayload>(body);
                
                await WebhookVerification.ProcessEventAsync(payload.Event, payload.Data, _logger);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing webhook");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}