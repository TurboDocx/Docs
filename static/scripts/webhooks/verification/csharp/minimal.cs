using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddLogging();

var app = builder.Build();

// Webhook verification helper
static bool VerifySignature(string signature, string timestamp, string body, string secret)
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

// Process webhook event
static async Task ProcessEventAsync(string eventType, JsonElement data, ILogger logger)
{
    logger.LogInformation("Received event: {EventType}", eventType);

    switch (eventType)
    {
        case "signature.document.completed":
            await HandleDocumentCompletedAsync(data, logger);
            break;

        case "signature.document.voided":
            await HandleDocumentVoidedAsync(data, logger);
            break;

        default:
            logger.LogWarning("Unknown event type: {EventType}", eventType);
            break;
    }
}

static async Task HandleDocumentCompletedAsync(JsonElement data, ILogger logger)
{
    var documentId = data.TryGetProperty("documentId", out var idProp) ? idProp.GetString() : "unknown";
    logger.LogInformation("Document completed: {DocumentId}", documentId);
    
    // Add your completion logic here
    await Task.CompletedTask;
}

static async Task HandleDocumentVoidedAsync(JsonElement data, ILogger logger)
{
    var documentId = data.TryGetProperty("documentId", out var idProp) ? idProp.GetString() : "unknown";
    logger.LogInformation("Document voided: {DocumentId}", documentId);
    
    // Add your void logic here
    await Task.CompletedTask;
}

// Configure webhook secret
var webhookSecret = builder.Configuration["TurboDocx:WebhookSecret"] ?? 
                    builder.Configuration["WEBHOOK_SECRET"] ?? 
                    Environment.GetEnvironmentVariable("WEBHOOK_SECRET") ??
                    "your-webhook-secret";

// Webhook endpoint
app.MapPost("/webhook", async (HttpRequest request, ILogger<Program> logger) =>
{
    try
    {
        // Get headers
        var signature = request.Headers["X-TurboDocx-Signature"].FirstOrDefault() ?? "";
        var timestamp = request.Headers["X-TurboDocx-Timestamp"].FirstOrDefault() ?? "";

        // Read raw body
        using var reader = new StreamReader(request.Body);
        var body = await reader.ReadToEndAsync();

        // Verify signature
        if (!VerifySignature(signature, timestamp, body, webhookSecret))
        {
            logger.LogWarning("Webhook signature verification failed");
            return Results.Unauthorized();
        }

        // Parse and process webhook
        var payload = JsonSerializer.Deserialize<JsonDocument>(body);
        var eventType = payload.RootElement.GetProperty("event").GetString();
        var data = payload.RootElement.GetProperty("data");
        
        await ProcessEventAsync(eventType, data, logger);

        return Results.Ok(new { status = "ok" });
    }
    catch (JsonException ex)
    {
        logger.LogError(ex, "Invalid JSON payload received");
        return Results.BadRequest("Invalid payload");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error processing webhook");
        return Results.Problem("Internal server error");
    }
});

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { 
    status = "ok", 
    timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() 
}));

// Webhook endpoint with middleware approach
app.MapPost("/webhook/middleware", async (HttpRequest request, ILogger<Program> logger) =>
{
    var payload = JsonSerializer.Deserialize<JsonDocument>(await request.ReadFromJsonAsync<string>());
    var eventType = payload.RootElement.GetProperty("event").GetString();
    var data = payload.RootElement.GetProperty("data");
    
    await ProcessEventAsync(eventType, data, logger);
    return Results.Ok();
}).AddEndpointFilter(async (context, next) =>
{
    var request = context.HttpContext.Request;
    var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
    
    var signature = request.Headers["X-TurboDocx-Signature"].FirstOrDefault() ?? "";
    var timestamp = request.Headers["X-TurboDocx-Timestamp"].FirstOrDefault() ?? "";
    
    // Read body for verification
    request.EnableBuffering();
    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();
    request.Body.Position = 0;
    
    if (!VerifySignature(signature, timestamp, body, webhookSecret))
    {
        logger.LogWarning("Webhook signature verification failed");
        return Results.Unauthorized();
    }
    
    return await next(context);
});

// Configure logging
if (app.Environment.IsDevelopment())
{
    app.UseRouting();
    app.UseDeveloperExceptionPage();
}

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Logger.LogInformation("Starting TurboDocx webhook server on port {Port}", port);
app.Logger.LogInformation("Webhook secret configured: {SecretLength} characters", webhookSecret.Length);

app.Run();

// Record types for structured data
public record WebhookPayload(string Event, JsonElement Data, string Timestamp);
public record WebhookResponse(string Status, DateTime Timestamp);