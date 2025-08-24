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
    public class WebhookVerificationService
    {
        private readonly string _webhookSecret;
        private readonly ILogger<WebhookVerificationService> _logger;

        public WebhookVerificationService(string webhookSecret, ILogger<WebhookVerificationService> logger = null)
        {
            _webhookSecret = webhookSecret ?? throw new ArgumentNullException(nameof(webhookSecret));
            _logger = logger;
        }

        /// <summary>
        /// Verifies a TurboDocx webhook signature
        /// </summary>
        /// <param name="signature">X-TurboDocx-Signature header value</param>
        /// <param name="timestamp">X-TurboDocx-Timestamp header value</param>
        /// <param name="body">Raw request body</param>
        /// <returns>True if signature is valid</returns>
        public bool VerifySignature(string signature, string timestamp, string body)
        {
            if (string.IsNullOrEmpty(signature) || string.IsNullOrEmpty(timestamp) || body == null)
                return false;

            // Check timestamp is within 5 minutes
            if (!long.TryParse(timestamp, out long webhookTime))
                return false;

            var currentTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            if (Math.Abs(currentTime - webhookTime) > 300)
                return false;

            // Generate expected signature
            var signedString = $"{timestamp}.{body}";
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_webhookSecret));
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
        /// <param name="payload">The webhook payload</param>
        public async Task ProcessEventAsync(WebhookPayload payload)
        {
            _logger?.LogInformation("Received event: {EventType}", payload.Event);

            switch (payload.Event)
            {
                case "signature.document.completed":
                    await HandleDocumentCompletedAsync(payload.Data);
                    break;

                case "signature.document.voided":
                    await HandleDocumentVoidedAsync(payload.Data);
                    break;

                default:
                    _logger?.LogWarning("Unknown event type: {EventType}", payload.Event);
                    break;
            }
        }

        private async Task HandleDocumentCompletedAsync(JsonElement data)
        {
            var documentId = data.GetProperty("documentId").GetString();
            _logger?.LogInformation("Document completed: {DocumentId}", documentId);
            
            // Add your completion logic here
            await Task.CompletedTask;
        }

        private async Task HandleDocumentVoidedAsync(JsonElement data)
        {
            var documentId = data.GetProperty("documentId").GetString();
            _logger?.LogInformation("Document voided: {DocumentId}", documentId);
            
            // Add your void logic here
            await Task.CompletedTask;
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class WebhookController : ControllerBase
    {
        private readonly WebhookVerificationService _verificationService;
        private readonly ILogger<WebhookController> _logger;

        public WebhookController(WebhookVerificationService verificationService, ILogger<WebhookController> logger)
        {
            _verificationService = verificationService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> HandleWebhook()
        {
            try
            {
                // Get headers
                var signature = Request.Headers["X-TurboDocx-Signature"].FirstOrDefault();
                var timestamp = Request.Headers["X-TurboDocx-Timestamp"].FirstOrDefault();

                // Read raw body
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                // Verify signature
                if (!_verificationService.VerifySignature(signature, timestamp, body))
                {
                    _logger.LogWarning("Webhook signature verification failed");
                    return Unauthorized();
                }

                // Parse and process webhook
                var payload = JsonSerializer.Deserialize<WebhookPayload>(body);
                await _verificationService.ProcessEventAsync(payload);

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

    public class WebhookPayload
    {
        public string Event { get; set; }
        public JsonElement Data { get; set; }
        public string Timestamp { get; set; }
    }

    // Extension methods for DI setup
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddTurboDocxWebhooks(this IServiceCollection services, IConfiguration configuration)
        {
            var webhookSecret = configuration["TurboDocx:WebhookSecret"] ?? 
                              throw new InvalidOperationException("Webhook secret not configured");

            services.AddScoped(provider => 
                new WebhookVerificationService(webhookSecret, provider.GetService<ILogger<WebhookVerificationService>>()));

            return services;
        }
    }
}