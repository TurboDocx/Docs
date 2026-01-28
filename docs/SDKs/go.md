---
title: Sign Documents with Go | TurboDocx
sidebar_position: 4
sidebar_label: 'TurboSign: Go'
description: Learn how to sign documents with Go using TurboDocx SDK. Send documents for signature via API and automate signing directly in your Golang application.
keywords:
  - sign documents go
  - sign pdf golang
  - esignature api go
  - turbodocx go sdk
  - turbosign golang
  - go module turbodocx
  - golang digital signature api
  - go document signing
  - send documents for signature go
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Sign Documents with Go

Learn how to sign documents with Go using the TurboDocx SDK. This guide covers installation, configuration, sending documents for signature, and processing results directly in your Golang application.

## Installation

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

## Requirements

- Go 1.21+

---

## Configuration

```go
package main

import (
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    // Create a new client
    client, err := turbodocx.NewClient(
        os.Getenv("TURBODOCX_API_KEY"),
        os.Getenv("TURBODOCX_ORG_ID"),
    )
    if err != nil {
        log.Fatal(err)
    }

    // Or with custom configuration
    client, err := turbodocx.NewClientWithConfig(turbodocx.ClientConfig{
        APIKey:  os.Getenv("TURBODOCX_API_KEY"),
        OrgID:   os.Getenv("TURBODOCX_ORG_ID"),
        BaseURL: "https://api.turbodocx.com", // Optional custom base URL
    })
}
```

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
```

---

## Quick Start

### Send a Document for Signature

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    client, err := turbodocx.NewClient(
        os.Getenv("TURBODOCX_API_KEY"),
        os.Getenv("TURBODOCX_ORG_ID"),
    )
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
        FileLink:     "https://example.com/contract.pdf",
        DocumentName: "Service Agreement",
        SenderName:   "Acme Corp",
        SenderEmail:  "contracts@acme.com",
        Recipients: []turbodocx.Recipient{
            {Name: "Alice Smith", Email: "alice@example.com", SigningOrder: 1},
            {Name: "Bob Johnson", Email: "bob@example.com", SigningOrder: 2},
        },
        Fields: []turbodocx.Field{
            // Alice's signature
            {Type: "signature", Page: 1, X: 100, Y: 650, Width: 200, Height: 50, RecipientEmail: "alice@example.com"},
            {Type: "date", Page: 1, X: 320, Y: 650, Width: 100, Height: 30, RecipientEmail: "alice@example.com"},
            // Bob's signature
            {Type: "signature", Page: 1, X: 100, Y: 720, Width: 200, Height: 50, RecipientEmail: "bob@example.com"},
            {Type: "date", Page: 1, X: 320, Y: 720, Width: 100, Height: 30, RecipientEmail: "bob@example.com"},
        },
    })
    if err != nil {
        log.Fatal(err)
    }

    b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
}
```

### Using Template-Based Fields

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    FileLink: "https://example.com/contract-with-placeholders.pdf",
    Recipients: []turbodocx.Recipient{
        {Name: "Alice Smith", Email: "alice@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {
            Type:           "signature",
            RecipientEmail: "alice@example.com",
            Template: &turbodocx.TemplateAnchor{
                Anchor:    "{SIGNATURE_ALICE}",
                Placement: "replace",
                Size:      &turbodocx.Size{Width: 200, Height: 50},
            },
        },
        {
            Type:           "date",
            RecipientEmail: "alice@example.com",
            Template: &turbodocx.TemplateAnchor{
                Anchor:    "{DATE_ALICE}",
                Placement: "replace",
                Size:      &turbodocx.Size{Width: 100, Height: 30},
            },
        },
    },
})
```

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.
:::

---

## File Input Methods

The SDK supports multiple ways to provide your document:

### 1. File Upload ([]byte)

Upload a document directly from file bytes:

```go
pdfBytes, err := os.ReadFile("/path/to/document.pdf")
if err != nil {
    log.Fatal(err)
}

result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    File: pdfBytes,
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})
```

### 2. File URL

Provide a publicly accessible URL to your document:

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    FileLink: "https://example.com/documents/contract.pdf",
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})
```

:::tip When to use FileLink
Use `FileLink` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

### 3. TurboDocx Deliverable ID

Use a document generated by TurboDocx document generation:

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    DeliverableID: "deliverable-uuid-from-turbodocx",
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})
```

:::info Integration with TurboDocx
`DeliverableID` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

### 4. TurboDocx Template ID

Use a pre-configured TurboDocx template:

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    TemplateID: "template-uuid-from-turbodocx",
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})
```

:::info Integration with TurboDocx
`TemplateID` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

---

## API Reference

### Configure

Create a new TurboDocx client.

```go
// Simple initialization
client, err := turbodocx.NewClient(apiKey, orgID string)

// With custom configuration
client, err := turbodocx.NewClientWithConfig(turbodocx.ClientConfig{
    APIKey:  "your-api-key",
    OrgID:   "your-org-id",
    BaseURL: "https://api.turbodocx.com", // Optional
})
```

:::warning API Credentials Required
Both `APIKey` and `OrgID` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

### Prepare for review

Upload a document for preview without sending emails.

```go
result, err := client.TurboSign.CreateSignatureReviewLink(ctx, &turbodocx.CreateSignatureReviewLinkRequest{
    FileLink:     "https://example.com/document.pdf",
    DocumentName: "Contract Draft",
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})

b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
```

### Prepare for signing

Upload a document and immediately send signature requests.

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    FileLink:     "https://example.com/document.pdf",
    DocumentName: "Service Agreement",
    SenderName:   "Your Company",
    SenderEmail:  "sender@company.com",
    Recipients: []turbodocx.Recipient{
        {Name: "Recipient Name", Email: "recipient@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "recipient@example.com"},
    },
})
```

### Get status

Check the status of a document.

```go
status, err := client.TurboSign.GetStatus(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(status, "", "  "); fmt.Println("Result:", string(b))
```

### Download document

Download the completed signed document.

```go
pdfData, err := client.TurboSign.Download(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

// Save to file
err = os.WriteFile("signed-contract.pdf", pdfData, 0644)
if err != nil {
    log.Fatal(err)
}
```

### Get audit trail

Retrieve the audit trail for a document.

```go
auditTrail, err := client.TurboSign.GetAuditTrail(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(auditTrail, "", "  "); fmt.Println("Result:", string(b))
```

### Void

Cancel/void a signature request.

```go
result, err := client.TurboSign.VoidDocument(ctx, "document-uuid", "Contract terms changed")
```

### Resend

Resend signature request emails.

```go
// Resend to specific recipients
result, err := client.TurboSign.ResendEmail(ctx, "document-uuid", []string{"recipient-uuid-1", "recipient-uuid-2"})
```

---

## Error Handling

The SDK provides typed errors for different error scenarios:

### Error Types

| Error Type            | Status Code | Description                        |
| --------------------- | ----------- | ---------------------------------- |
| `TurboDocxError`      | varies      | Base error type for all API errors |
| `AuthenticationError` | 401         | Invalid or missing API key         |
| `ValidationError`     | 400         | Invalid request parameters         |
| `NotFoundError`       | 404         | Resource not found                 |
| `RateLimitError`      | 429         | Too many requests                  |
| `NetworkError`        | -           | Network connectivity issues        |

### Error Properties

| Property     | Type     | Description                  |
| ------------ | -------- | ---------------------------- |
| `Message`    | `string` | Human-readable error message |
| `StatusCode` | `int`    | HTTP status code             |
| `Code`       | `string` | Error code (if available)    |

### Example

```go
import (
    "errors"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

result, err := client.TurboSign.SendSignature(ctx, request)
if err != nil {
    // Check for specific error types
    var authErr *turbodocx.AuthenticationError
    var validationErr *turbodocx.ValidationError
    var notFoundErr *turbodocx.NotFoundError
    var rateLimitErr *turbodocx.RateLimitError
    var networkErr *turbodocx.NetworkError

    switch {
    case errors.As(err, &authErr):
        log.Printf("Authentication failed: %s", authErr.Message)
    case errors.As(err, &validationErr):
        log.Printf("Validation error: %s", validationErr.Message)
    case errors.As(err, &notFoundErr):
        log.Printf("Not found: %s", notFoundErr.Message)
    case errors.As(err, &rateLimitErr):
        log.Printf("Rate limited: %s", rateLimitErr.Message)
    case errors.As(err, &networkErr):
        log.Printf("Network error: %s", networkErr.Message)
    default:
        // Base TurboDocxError or unexpected error
        var turboErr *turbodocx.TurboDocxError
        if errors.As(err, &turboErr) {
            log.Printf("API error [%d]: %s", turboErr.StatusCode, turboErr.Message)
        } else {
            log.Fatal(err)
        }
    }
}
```

---

## Types

### Signature Field Types

The `Type` field accepts the following string values:

| Type           | Description      |
| -------------- | ---------------- |
| `"signature"`  | Signature field  |
| `"initials"`   | Initials field   |
| `"text"`       | Text input field |
| `"date"`       | Date field       |
| `"checkbox"`   | Checkbox field   |
| `"full_name"`  | Full name field  |
| `"first_name"` | First name field |
| `"last_name"`  | Last name field  |
| `"email"`      | Email field      |
| `"title"`      | Title field      |
| `"company"`    | Company field    |

### Recipient

| Property       | Type     | Required | Description                                       |
| -------------- | -------- | -------- | ------------------------------------------------- |
| `Name`         | `string` | Yes      | Recipient's full name                             |
| `Email`        | `string` | Yes      | Recipient's email address                         |
| `SigningOrder` | `int`    | Yes      | Order in which recipient should sign (1, 2, 3...) |

### Field

| Property          | Type              | Required | Description                                 |
| ----------------- | ----------------- | -------- | ------------------------------------------- |
| `Type`            | `string`          | Yes      | Field type (see table above)                |
| `RecipientEmail`  | `string`          | Yes      | Email of the recipient who fills this field |
| `Page`            | `int`             | No\*     | Page number (1-indexed)                     |
| `X`               | `int`             | No\*     | X coordinate in pixels                      |
| `Y`               | `int`             | No\*     | Y coordinate in pixels                      |
| `Width`           | `int`             | No*      | Field width in pixels                       |
| `Height`          | `int`             | No*      | Field height in pixels                      |
| `DefaultValue`    | `string`          | No       | Pre-filled value                            |
| `IsMultiline`     | `bool`            | No       | Enable multiline for text fields            |
| `IsReadonly`      | `bool`            | No       | Make field read-only                        |
| `Required`        | `bool`            | No       | Make field required                         |
| `BackgroundColor` | `string`          | No       | Background color                            |
| `Template`        | `*TemplateAnchor` | No       | Template anchor configuration               |

\*Required when not using template anchors

#### Template Configuration

When using `Template` instead of coordinates:

| Property        | Type     | Required | Description                                                                           |
| --------------- | -------- | -------- | ------------------------------------------------------------------------------------- |
| `Anchor`        | `string` | Yes      | Text to find in document (e.g., `"{SIGNATURE}"`)                                      |
| `Placement`     | `string` | Yes      | Position relative to anchor: `"replace"`, `"before"`, `"after"`, `"above"`, `"below"` |
| `Size`          | `*Size`  | Yes      | Size with `Width` and `Height`                                                        |
| `Offset`        | `*Point` | No       | Offset with `X` and `Y`                                                               |
| `CaseSensitive` | `bool`   | No       | Case-sensitive anchor search                                                          |
| `UseRegex`      | `bool`   | No       | Use regex for anchor search                                                           |

### Request Parameters

Both `CreateSignatureReviewLinkRequest` and `SendSignatureRequest` accept:

| Property              | Type          | Required    | Description              |
| --------------------- | ------------- | ----------- | ------------------------ |
| `File`                | `[]byte`      | Conditional | File content as bytes      |
| `FileLink`            | `string`      | Conditional | URL to document          |
| `DeliverableID`       | `string`      | Conditional | TurboDocx deliverable ID |
| `TemplateID`          | `string`      | Conditional | TurboDocx template ID    |
| `Recipients`          | `[]Recipient` | Yes         | List of recipients       |
| `Fields`              | `[]Field`     | Yes         | List of fields           |
| `DocumentName`        | `string`      | No          | Document display name    |
| `DocumentDescription` | `string`      | No          | Document description     |
| `SenderName`          | `string`      | No          | Sender's name            |
| `SenderEmail`         | `string`      | No          | Sender's email           |
| `CCEmails`            | `[]string`    | No          | CC email addresses       |

:::info File Source (Conditional)
Exactly one file source is required: `File`, `FileLink`, `DeliverableID`, or `TemplateID`.
:::

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[Request Body Reference](/docs/TurboSign/API%20Signatures#request-body-multipartform-data)** - Complete request body parameters, file sources, and multipart/form-data structure
- **[Recipients Reference](/docs/TurboSign/API%20Signatures#recipients-reference)** - Recipient properties, signing order, metadata, and configuration options
- **[Field Types Reference](/docs/TurboSign/API%20Signatures#field-types-reference)** - All available field types (signature, date, text, checkbox, etc.) with properties and behaviors
- **[Field Positioning Methods](/docs/TurboSign/API%20Signatures#field-positioning-methods)** - Template-based vs coordinate-based positioning, anchor configuration, and best practices

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
