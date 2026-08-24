---
title: TurboSign Go SDK
sidebar_position: 4
sidebar_label: "TurboSign: Go"
description: Official TurboDocx Go SDK. Idiomatic Go with context support for document generation and digital signatures.
keywords:
  - turbodocx go
  - turbosign go
  - golang sdk
  - go module
  - document api go
  - esignature golang
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboSign Go SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" />

The official TurboDocx SDK for Go applications. Build document generation and digital signature workflows with idiomatic Go patterns, context support, and comprehensive error handling. Available as `github.com/TurboDocx/SDK/packages/go-sdk`.

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
    "log"
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    // Create a new client (reads SenderEmail from TURBODOCX_SENDER_EMAIL)
    client, err := turbodocx.NewClient(
        os.Getenv("TURBODOCX_API_KEY"),
        os.Getenv("TURBODOCX_ORG_ID"),
    )
    if err != nil {
        log.Fatal(err)
    }
    _ = client

    // Or with custom configuration
    client, err = turbodocx.NewClientWithConfig(turbodocx.ClientConfig{
        APIKey:      os.Getenv("TURBODOCX_API_KEY"),
        OrgID:       os.Getenv("TURBODOCX_ORG_ID"),
        SenderEmail: os.Getenv("TURBODOCX_SENDER_EMAIL"), // Required for TurboSign
        BaseURL:     "https://api.turbodocx.com",         // Optional custom base URL
    })
    if err != nil {
        log.Fatal(err)
    }
    _ = client
}
```

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
export TURBODOCX_SENDER_EMAIL=you@example.com  # Required for TurboSign (reply-to address)
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
        FileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
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
    FileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
    FileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
    APIKey:      "your-api-key",
    OrgID:       "your-org-id",
    SenderEmail: "you@example.com",            // Required for TurboSign (reply-to address)
    BaseURL:     "https://api.turbodocx.com", // Optional
})
```

:::warning API Credentials Required
`APIKey` (or `AccessToken`), `OrgID`, **and** `SenderEmail` are **required** for TurboSign operations. `SenderEmail` is used as the reply-to address for signature request emails (it can also be supplied via the `TURBODOCX_SENDER_EMAIL` environment variable). To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

### Prepare for review

Upload a document for preview without sending emails.

```go
result, err := client.TurboSign.CreateSignatureReviewLink(ctx, &turbodocx.CreateSignatureReviewLinkRequest{
    FileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
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
    FileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
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

### Schedule reminders and expiration

`SendSignature` accepts an optional `SignatureSchedule` that turns on automatic reminder emails and a signing deadline. Every field is a pointer, and **both features are off by default** — omit the schedule entirely to preserve the original send behavior. The resolved schedule is **frozen onto the document at send time**, so later changes to your org defaults never touch a document already out for signature.

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    // ...file, recipients, fields, etc.
    SignatureSchedule: turbodocx.SignatureSchedule{
        RemindersEnabled:  turbodocx.BoolPtr(true),
        ReminderDelay:     &turbodocx.Duration{Value: 2, Unit: "days"},  // time to the first reminder
        ReminderInterval:  &turbodocx.Duration{Value: 3, Unit: "days"},  // gap between later reminders
        MaxReminders:      turbodocx.IntPtr(5),                          // cap per signer
        ExpirationEnabled: turbodocx.BoolPtr(true),
        ExpireAfter:       &turbodocx.Duration{Value: 14, Unit: "days"}, // how long the document stays signable
        ExpirationWarning: &turbodocx.Duration{Value: 3, Unit: "days"},  // how far before expiry warnings start
    },
})
```

| Field | Type | Notes |
| ----- | ---- | ----- |
| `RemindersEnabled` | `*bool` | Master switch for automatic reminders. Default off. |
| `ReminderDelay` | `*Duration` | Time to the **first** reminder, measured from that signer's invitation. |
| `ReminderInterval` | `*Duration` | Gap between **subsequent** reminders. |
| `MaxReminders` | `*int` | Automatic reminders per signer. Valid range **-1..50** — `-1` unlimited, `0` none, default `5`. |
| `ExpirationEnabled` | `*bool` | Master switch for the signing deadline. Default off. |
| `ExpireAfter` | `*Duration` | How long the document stays signable, counted from sending. |
| `ExpirationWarning` | `*Duration` | How far **before** expiry warnings start. `0` = never warn. |
| `ExpirationWarningInterval` | `*Duration` | Gap between warnings once they start. |

A `Duration` is a `{Value, Unit}` pair; `Unit` is `"hours"` or `"days"`. `Value` is a whole number, **minimum 1** and at most **999 days (23976 hours)**. Reminders and expiry warnings run as two independent clocks, so a signer can receive both streams; they are coordinated so a reminder and a warning never land in the same moment.

### Get status

Check the status of a document. The response includes `ExpiresAt` — the signing-window deadline as an ISO 8601 string, or `""` when expiration is off — and a `Status` that can reach the terminal value `expired` once the deadline passes.

```go
status, err := client.TurboSign.GetStatus(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Status: %s\n", status.Status)  // "under_review", "completed", "voided", "expired", ...
// ExpiresAt is the signing-window deadline (ISO 8601), or "" when expiration is off.
fmt.Printf("Expires: %s\n", status.ExpiresAt)
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

### Send reminder

Send a standalone reminder to whoever's turn it is to sign (`POST /turbosign/documents/:id/send-reminder`). It is independent of the automatic reminder cadence — it works even when reminders are disabled or the per-signer `MaxReminders` cap is already spent, does **not** consume that cap, and only emails signers at the **current** signing order. Pass `nil` for `recipientIDs` to remind everyone eligible; do **not** pass an empty slice, which the API rejects.

```go
resp, err := client.TurboSign.SendReminder(ctx, "document-uuid", nil)
if err != nil {
    log.Fatal(err)
}

for _, r := range resp.Results {
    // "sent", "skipped_wrong_order", "skipped_completed", ...
    fmt.Printf("%s: %s\n", r.RecipientID, r.Status)
}
```

This differs from **Resend**: resend re-sends the original invitation email, while send-reminder sends the reminder copy.

---

## Error Handling

The SDK provides typed errors for different error scenarios:

### Error Types

| Error Type            | Status Code | Description                        |
| --------------------- | ----------- | ---------------------------------- |
| `TurboDocxError`      | varies      | Base error type for all API errors |
| `AuthenticationError` | 401         | Invalid or missing API key         |
| `AuthorizationError`  | 403         | Authenticated but lacks required permissions |
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
    var authzErr *turbodocx.AuthorizationError
    var validationErr *turbodocx.ValidationError
    var notFoundErr *turbodocx.NotFoundError
    var rateLimitErr *turbodocx.RateLimitError
    var networkErr *turbodocx.NetworkError

    switch {
    case errors.As(err, &authErr):
        log.Printf("Authentication failed: %s", authErr.Message)
    case errors.As(err, &authzErr):
        log.Printf("Authorization failed: %s", authzErr.Message)
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
| `Width`           | `int`             | No\*     | Field width in pixels                       |
| `Height`          | `int`             | No\*     | Field height in pixels                      |
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
| `File`                | `[]byte`      | Conditional | File content as bytes    |
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
