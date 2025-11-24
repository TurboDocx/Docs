---
title: .NET SDK
sidebar_position: 5
sidebar_label: .NET / C#
description: Official TurboDocx .NET SDK. Full async/await support with dependency injection for ASP.NET Core applications.
keywords:
  - turbodocx dotnet
  - turbodocx csharp
  - turbosign dotnet
  - nuget turbodocx
  - asp.net core sdk
  - document api dotnet
  - esignature csharp
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# .NET SDK

The official TurboDocx SDK for .NET applications. Full async/await support with ASP.NET Core dependency injection.

[![NuGet version](https://img.shields.io/nuget/v/TurboDocx.Sdk?logo=nuget&logoColor=white)](https://www.nuget.org/packages/TurboDocx.Sdk)
[![GitHub](https://img.shields.io/github/stars/turbodocx/sdk?style=social)](https://github.com/TurboDocx/SDK)

## Installation

<Tabs>
<TabItem value="cli" label=".NET CLI" default>

```bash
dotnet add package TurboDocx.Sdk
```

</TabItem>
<TabItem value="pm" label="Package Manager">

```powershell
Install-Package TurboDocx.Sdk
```

</TabItem>
<TabItem value="reference" label="PackageReference">

```xml
<PackageReference Include="TurboDocx.Sdk" Version="1.0.0" />
```

</TabItem>
</Tabs>

## Requirements

- .NET 6.0+ or .NET Standard 2.1+

---

## Configuration

### Basic Configuration

```csharp
using TurboDocx.Sdk;

// Create a client directly
var turboSign = new TurboSignClient(Environment.GetEnvironmentVariable("TURBODOCX_API_KEY"));

// Or with options
var turboSign = new TurboSignClient(new TurboSignOptions
{
    ApiKey = Environment.GetEnvironmentVariable("TURBODOCX_API_KEY"),
    BaseUrl = "https://api.turbodocx.com",
    Timeout = TimeSpan.FromSeconds(30)
});
```

### ASP.NET Core Dependency Injection

```csharp
// Program.cs or Startup.cs
builder.Services.AddTurboDocx(options =>
{
    options.ApiKey = builder.Configuration["TurboDocx:ApiKey"];
});

// Then inject ITurboSignClient in your services
public class ContractService
{
    private readonly ITurboSignClient _turboSign;

    public ContractService(ITurboSignClient turboSign)
    {
        _turboSign = turboSign;
    }
}
```

### Configuration File

```json
// appsettings.json
{
  "TurboDocx": {
    "ApiKey": "your_api_key_here"
  }
}
```

---

## Quick Start

### Send a Document for Signature

```csharp
using TurboDocx.Sdk;

var turboSign = new TurboSignClient(Environment.GetEnvironmentVariable("TURBODOCX_API_KEY"));

var result = await turboSign.PrepareForSigningSingleAsync(new SigningRequest
{
    FileLink = "https://example.com/contract.pdf",
    DocumentName = "Service Agreement",
    SenderName = "Acme Corp",
    SenderEmail = "contracts@acme.com",
    Recipients = new[]
    {
        new Recipient { Name = "Alice Smith", Email = "alice@example.com", Order = 1 },
        new Recipient { Name = "Bob Johnson", Email = "bob@example.com", Order = 2 }
    },
    Fields = new[]
    {
        // Alice's signature
        new Field { Type = FieldType.Signature, Page = 1, X = 100, Y = 650, Width = 200, Height = 50, RecipientOrder = 1 },
        new Field { Type = FieldType.Date, Page = 1, X = 320, Y = 650, Width = 100, Height = 30, RecipientOrder = 1 },
        // Bob's signature
        new Field { Type = FieldType.Signature, Page = 1, X = 100, Y = 720, Width = 200, Height = 50, RecipientOrder = 2 },
        new Field { Type = FieldType.Date, Page = 1, X = 320, Y = 720, Width = 100, Height = 30, RecipientOrder = 2 }
    }
});

Console.WriteLine($"Document ID: {result.DocumentId}");
foreach (var recipient in result.Recipients)
{
    Console.WriteLine($"{recipient.Name}: {recipient.SignUrl}");
}
```

### Using Template-Based Fields

```csharp
var result = await turboSign.PrepareForSigningSingleAsync(new SigningRequest
{
    FileLink = "https://example.com/contract-with-placeholders.pdf",
    Recipients = new[]
    {
        new Recipient { Name = "Alice Smith", Email = "alice@example.com", Order = 1 }
    },
    Fields = new[]
    {
        new Field { Type = FieldType.Signature, Anchor = "{SIGNATURE_ALICE}", Width = 200, Height = 50, RecipientOrder = 1 },
        new Field { Type = FieldType.Date, Anchor = "{DATE_ALICE}", Width = 100, Height = 30, RecipientOrder = 1 }
    }
});
```

---

## API Reference

### PrepareForReviewAsync()

Upload a document for preview without sending emails.

```csharp
var result = await turboSign.PrepareForReviewAsync(new ReviewRequest
{
    FileLink = "https://example.com/document.pdf",
    // Or upload directly:
    // File = await File.ReadAllBytesAsync("document.pdf"),
    DocumentName = "Contract Draft",
    Recipients = new[]
    {
        new Recipient { Name = "John Doe", Email = "john@example.com", Order = 1 }
    },
    Fields = new[]
    {
        new Field { Type = FieldType.Signature, Page = 1, X = 100, Y = 500, Width = 200, Height = 50, RecipientOrder = 1 }
    }
});

Console.WriteLine(result.DocumentId);
Console.WriteLine(result.PreviewUrl);
```

### PrepareForSigningSingleAsync()

Upload a document and immediately send signature requests.

```csharp
var result = await turboSign.PrepareForSigningSingleAsync(new SigningRequest
{
    FileLink = "https://example.com/document.pdf",
    DocumentName = "Service Agreement",
    SenderName = "Your Company",
    SenderEmail = "sender@company.com",
    Recipients = new[]
    {
        new Recipient { Name = "Recipient Name", Email = "recipient@example.com", Order = 1 }
    },
    Fields = new[]
    {
        new Field { Type = FieldType.Signature, Page = 1, X = 100, Y = 500, Width = 200, Height = 50, RecipientOrder = 1 }
    }
});
```

### GetStatusAsync()

Check the status of a document.

```csharp
var status = await turboSign.GetStatusAsync("document-uuid");

Console.WriteLine(status.Status); // "pending", "completed", or "voided"
Console.WriteLine(status.CompletedAt);

foreach (var recipient in status.Recipients)
{
    Console.WriteLine($"{recipient.Name}: {recipient.Status}");
    Console.WriteLine($"Signed at: {recipient.SignedAt}");
}
```

### DownloadAsync()

Download the completed signed document.

```csharp
var pdfBytes = await turboSign.DownloadAsync("document-uuid");

// Save to file
await File.WriteAllBytesAsync("signed-contract.pdf", pdfBytes);

// Or upload to Azure Blob Storage
await blobClient.UploadAsync(new MemoryStream(pdfBytes));
```

### VoidAsync()

Cancel/void a signature request.

```csharp
await turboSign.VoidAsync("document-uuid", "Contract terms changed");
```

### ResendAsync()

Resend signature request emails.

```csharp
// Resend to all pending recipients
await turboSign.ResendAsync("document-uuid");

// Resend to specific recipients
await turboSign.ResendAsync("document-uuid", new[] { "recipient-uuid-1", "recipient-uuid-2" });
```

---

## ASP.NET Core Examples

### Minimal API

```csharp
using TurboDocx.Sdk;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTurboDocx(options =>
{
    options.ApiKey = builder.Configuration["TurboDocx:ApiKey"];
});

var app = builder.Build();

app.MapPost("/api/send-contract", async (
    SendContractRequest request,
    ITurboSignClient turboSign) =>
{
    var result = await turboSign.PrepareForSigningSingleAsync(new SigningRequest
    {
        FileLink = request.ContractUrl,
        Recipients = new[]
        {
            new Recipient { Name = request.RecipientName, Email = request.RecipientEmail, Order = 1 }
        },
        Fields = new[]
        {
            new Field { Type = FieldType.Signature, Page = 1, X = 100, Y = 650, Width = 200, Height = 50, RecipientOrder = 1 }
        }
    });

    return Results.Ok(new { result.DocumentId, SignUrl = result.Recipients[0].SignUrl });
});

app.MapGet("/api/document/{id}/status", async (string id, ITurboSignClient turboSign) =>
{
    var status = await turboSign.GetStatusAsync(id);
    return Results.Ok(status);
});

app.Run();

record SendContractRequest(string RecipientName, string RecipientEmail, string ContractUrl);
```

### Controller-Based API

```csharp
using Microsoft.AspNetCore.Mvc;
using TurboDocx.Sdk;

[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly ITurboSignClient _turboSign;

    public ContractsController(ITurboSignClient turboSign)
    {
        _turboSign = turboSign;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendContract([FromBody] SendContractRequest request)
    {
        try
        {
            var result = await _turboSign.PrepareForSigningSingleAsync(new SigningRequest
            {
                FileLink = request.ContractUrl,
                Recipients = new[]
                {
                    new Recipient { Name = request.RecipientName, Email = request.RecipientEmail, Order = 1 }
                },
                Fields = new[]
                {
                    new Field { Type = FieldType.Signature, Page = 1, X = 100, Y = 650, Width = 200, Height = 50, RecipientOrder = 1 }
                }
            });

            return Ok(new { result.DocumentId, SignUrl = result.Recipients[0].SignUrl });
        }
        catch (TurboDocxException ex)
        {
            return StatusCode(500, new { Error = ex.Message });
        }
    }

    [HttpGet("{id}/status")]
    public async Task<IActionResult> GetStatus(string id)
    {
        try
        {
            var status = await _turboSign.GetStatusAsync(id);
            return Ok(status);
        }
        catch (TurboDocxException ex) when (ex.Code == ErrorCode.NotFound)
        {
            return NotFound();
        }
    }

    [HttpGet("{id}/download")]
    public async Task<IActionResult> Download(string id)
    {
        var pdfBytes = await _turboSign.DownloadAsync(id);
        return File(pdfBytes, "application/pdf", "signed-document.pdf");
    }
}

public record SendContractRequest(string RecipientName, string RecipientEmail, string ContractUrl);
```

---

## Error Handling

```csharp
using TurboDocx.Sdk;
using TurboDocx.Sdk.Exceptions;

try
{
    var result = await turboSign.PrepareForSigningSingleAsync(request);
}
catch (UnauthorizedException)
{
    Console.WriteLine("Invalid API key");
}
catch (InvalidDocumentException ex)
{
    Console.WriteLine($"Could not process document: {ex.Message}");
}
catch (RateLimitedException ex)
{
    Console.WriteLine($"Rate limited, retry after: {ex.RetryAfter} seconds");
}
catch (NotFoundException)
{
    Console.WriteLine("Document not found");
}
catch (TurboDocxException ex)
{
    Console.WriteLine($"Error {ex.Code}: {ex.Message}");
}
```

---

## Types

### Field Types

```csharp
public enum FieldType
{
    Signature,
    Initials,
    Text,
    Date,
    Checkbox,
    FullName,
    Email,
    Title,
    Company
}
```

### Models

```csharp
public class Recipient
{
    public string Name { get; set; }
    public string Email { get; set; }
    public int Order { get; set; }
    // Response properties
    public string? Id { get; set; }
    public string? Status { get; set; }
    public string? SignUrl { get; set; }
    public DateTime? SignedAt { get; set; }
}

public class Field
{
    public FieldType Type { get; set; }
    public int? Page { get; set; }
    public int? X { get; set; }
    public int? Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public int RecipientOrder { get; set; }
    public string? Anchor { get; set; } // For template-based fields
}

public class SigningRequest
{
    public string? FileLink { get; set; }
    public byte[]? File { get; set; }
    public string? DocumentName { get; set; }
    public string? SenderName { get; set; }
    public string? SenderEmail { get; set; }
    public Recipient[] Recipients { get; set; }
    public Field[] Fields { get; set; }
}

public class SigningResult
{
    public string DocumentId { get; set; }
    public Recipient[] Recipients { get; set; }
}

public class DocumentStatus
{
    public string Status { get; set; } // "pending", "completed", "voided"
    public DateTime? CompletedAt { get; set; }
    public Recipient[] Recipients { get; set; }
}
```

---

## Webhook Signature Verification

Verify that webhooks are genuinely from TurboDocx:

```csharp
using Microsoft.AspNetCore.Mvc;
using TurboDocx.Sdk;

[ApiController]
[Route("webhook")]
public class WebhookController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public WebhookController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost]
    public async Task<IActionResult> HandleWebhook()
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();

        var signature = Request.Headers["X-TurboDocx-Signature"].FirstOrDefault();
        var timestamp = Request.Headers["X-TurboDocx-Timestamp"].FirstOrDefault();
        var secret = _configuration["TurboDocx:WebhookSecret"];

        var isValid = WebhookVerifier.VerifySignature(signature, timestamp, body, secret);

        if (!isValid)
        {
            return Unauthorized("Invalid signature");
        }

        var webhookEvent = JsonSerializer.Deserialize<WebhookEvent>(body);

        switch (webhookEvent.Event)
        {
            case "signature.document.completed":
                Console.WriteLine($"Document completed: {webhookEvent.Data.DocumentId}");
                break;
            case "signature.document.voided":
                Console.WriteLine($"Document voided: {webhookEvent.Data.DocumentId}");
                break;
        }

        return Ok(new { Received = true });
    }
}
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/dotnet-sdk)
- [NuGet Package](https://www.nuget.org/packages/TurboDocx.Sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
