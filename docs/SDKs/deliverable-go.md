---
title: Go SDK
sidebar_position: 11
sidebar_label: "Deliverable: Go"
description: Official TurboDocx Deliverable Go SDK. Idiomatic Go with context support for document generation from templates.
keywords:
  - turbodocx deliverable go
  - document generation go
  - template api go
  - deliverable sdk golang
  - go module
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Go SDK

The official TurboDocx Deliverable SDK for Go applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically with idiomatic Go patterns, context support, and comprehensive error handling. Available as `github.com/TurboDocx/SDK/packages/go-sdk`.

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

    sdk "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    // Option 1: Standalone deliverable client (no SenderEmail needed)
    deliverable, err := sdk.NewDeliverableClientOnly(sdk.ClientConfig{
        APIKey: os.Getenv("TURBODOCX_API_KEY"),
        OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
    })
    if err != nil {
        log.Fatal(err)
    }

    // Option 2: Full client (includes TurboSign + Deliverable)
    client, err := sdk.NewClientWithConfig(sdk.ClientConfig{
        APIKey:      os.Getenv("TURBODOCX_API_KEY"),
        OrgID:       os.Getenv("TURBODOCX_ORG_ID"),
        SenderEmail: "sender@example.com",
        BaseURL:     "https://api.turbodocx.com", // Optional custom base URL
    })
    if err != nil {
        log.Fatal(err)
    }
    deliverable = client.Deliverable
}
```

:::tip No SenderEmail Required
Use `NewDeliverableClientOnly()` when you only need document generation — it skips the `SenderEmail` validation required by TurboSign.
:::

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
```

---

## Quick Start

### Generate a document from a template

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"

    sdk "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    deliverable, err := sdk.NewDeliverableClientOnly(sdk.ClientConfig{
        APIKey: os.Getenv("TURBODOCX_API_KEY"),
        OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
    })
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    result, err := deliverable.GenerateDeliverable(ctx, &sdk.CreateDeliverableRequest{
        Name:       "Q1 Report",
        TemplateID: "your-template-id",
        Variables: []sdk.DeliverableVariable{
            {Placeholder: "{CompanyName}", Text: "Acme Corporation", MimeType: "text"},
            {Placeholder: "{Date}", Text: "2026-03-12", MimeType: "text"},
        },
        Description: "Quarterly business report",
        Tags:        []string{"reports", "quarterly"},
    })
    if err != nil {
        log.Fatal(err)
    }

    b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
}
```

### Download and manage deliverables

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"

    sdk "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    deliverable, err := sdk.NewDeliverableClientOnly(sdk.ClientConfig{
        APIKey: os.Getenv("TURBODOCX_API_KEY"),
        OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
    })
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    // List deliverables with pagination
    list, err := deliverable.ListDeliverables(ctx, &sdk.ListDeliverablesOptions{
        Limit:    10,
        ShowTags: true,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Total: %d\n", list.TotalRecords)

    // Get deliverable details
    details, err := deliverable.GetDeliverableDetails(ctx, "deliverable-uuid", &sdk.GetDeliverableOptions{
        ShowTags: true,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Name: %s\n", details.Name)

    // Download source file (DOCX/PPTX)
    sourceData, err := deliverable.DownloadSourceFile(ctx, "deliverable-uuid")
    if err != nil {
        log.Fatal(err)
    }
    os.WriteFile("report.docx", sourceData, 0644)

    // Download PDF
    pdfData, err := deliverable.DownloadPDF(ctx, "deliverable-uuid")
    if err != nil {
        log.Fatal(err)
    }
    os.WriteFile("report.pdf", pdfData, 0644)

    // Update deliverable
    updateResult, err := deliverable.UpdateDeliverableInfo(ctx, "deliverable-uuid", &sdk.UpdateDeliverableRequest{
        Name:        "Q1 Report - Final",
        Description: "Final quarterly business report",
        Tags:        &[]string{"reports", "final"},
    })
    if err != nil {
        log.Fatal(err)
    }
    b, _ := json.MarshalIndent(updateResult, "", "  "); fmt.Println("Result:", string(b))

    // Delete deliverable
    deleteResult, err := deliverable.DeleteDeliverable(ctx, "deliverable-uuid")
    if err != nil {
        log.Fatal(err)
    }
    b, _ = json.MarshalIndent(deleteResult, "", "  "); fmt.Println("Result:", string(b))
}
```

---

## Variable Types

The Deliverable module supports four variable types for template injection:

### 1. Text Variables

Inject plain text values into template placeholders:

```go
variables := []sdk.DeliverableVariable{
    {Placeholder: "{CompanyName}", Text: "Acme Corporation", MimeType: "text"},
    {Placeholder: "{Date}", Text: "2026-03-12", MimeType: "text"},
}
```

### 2. HTML Variables

Inject rich HTML content with formatting:

```go
variables := []sdk.DeliverableVariable{
    {
        Placeholder: "{Summary}",
        Text:        "<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>",
        MimeType:    "html",
    },
}
```

### 3. Image Variables

Inject images by providing a URL or base64-encoded content:

```go
variables := []sdk.DeliverableVariable{
    {
        Placeholder: "{Logo}",
        Text:        "https://example.com/logo.png",
        MimeType:    "image",
    },
}
```

### 4. Markdown Variables

Inject markdown content that gets converted to formatted text:

```go
variables := []sdk.DeliverableVariable{
    {
        Placeholder: "{Notes}",
        Text:        "## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.",
        MimeType:    "markdown",
    },
}
```

:::info Variable Stack
For repeating content (e.g., table rows), use `VariableStack` instead of `Text` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

---

## API Reference

### Configure

Create a new TurboDocx Deliverable client.

```go
// Standalone deliverable client (no SenderEmail needed)
deliverable, err := sdk.NewDeliverableClientOnly(sdk.ClientConfig{
    APIKey: "your-api-key",
    OrgID:  "your-org-id",
})

// Full client (includes TurboSign + Deliverable)
client, err := sdk.NewClientWithConfig(sdk.ClientConfig{
    APIKey:      "your-api-key",
    OrgID:       "your-org-id",
    SenderEmail: "sender@example.com",
    BaseURL:     "https://api.turbodocx.com", // Optional
})
deliverable := client.Deliverable
```

:::caution API Credentials Required
Both `APIKey` and `OrgID` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

### Generate deliverable

Generate a new document from a template with variable substitution.

```go
result, err := deliverable.GenerateDeliverable(ctx, &sdk.CreateDeliverableRequest{
    Name:       "Q1 Report",
    TemplateID: "your-template-id",
    Variables: []sdk.DeliverableVariable{
        {Placeholder: "{CompanyName}", Text: "Acme Corp", MimeType: "text"},
        {Placeholder: "{Date}", Text: "2026-03-12", MimeType: "text"},
    },
    Description: "Quarterly business report",
    Tags:        []string{"reports", "quarterly"},
})
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
```

### List deliverables

List deliverables with pagination, search, and filtering.

```go
list, err := deliverable.ListDeliverables(ctx, &sdk.ListDeliverablesOptions{
    Limit:    10,
    Offset:   0,
    Query:    "report",
    ShowTags: true,
})
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(list, "", "  "); fmt.Println("Result:", string(b))
```

### Get deliverable details

Retrieve the full details of a single deliverable, including variables and fonts.

```go
details, err := deliverable.GetDeliverableDetails(ctx, "deliverable-uuid", &sdk.GetDeliverableOptions{
    ShowTags: true,
})
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(details, "", "  "); fmt.Println("Result:", string(b))
```

### Update deliverable info

Update a deliverable's name, description, or tags.

```go
result, err := deliverable.UpdateDeliverableInfo(ctx, "deliverable-uuid", &sdk.UpdateDeliverableRequest{
    Name:        "Q1 Report - Final",
    Description: "Final quarterly business report",
    Tags:        &[]string{"reports", "final"},
})
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
```

### Delete deliverable

Soft-delete a deliverable.

```go
result, err := deliverable.DeleteDeliverable(ctx, "deliverable-uuid")
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
```

### Download source file

Download the original source file (DOCX or PPTX).

```go
sourceData, err := deliverable.DownloadSourceFile(ctx, "deliverable-uuid")
if err != nil {
    log.Fatal(err)
}

// Save to file
err = os.WriteFile("report.docx", sourceData, 0644)
if err != nil {
    log.Fatal(err)
}
```

### Download PDF

Download the PDF version of a deliverable.

```go
pdfData, err := deliverable.DownloadPDF(ctx, "deliverable-uuid")
if err != nil {
    log.Fatal(err)
}

// Save to file
err = os.WriteFile("report.pdf", pdfData, 0644)
if err != nil {
    log.Fatal(err)
}
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
| `NotFoundError`       | 404         | Deliverable or template not found  |
| `RateLimitError`      | 429         | Too many requests                  |
| `NetworkError`        | -           | Network connectivity issues        |

### Handling Errors

```go
import (
    "errors"

    sdk "github.com/TurboDocx/SDK/packages/go-sdk"
)

result, err := deliverable.GenerateDeliverable(ctx, request)
if err != nil {
    // Check for specific error types
    var authErr *sdk.AuthenticationError
    var validationErr *sdk.ValidationError
    var notFoundErr *sdk.NotFoundError
    var rateLimitErr *sdk.RateLimitError
    var networkErr *sdk.NetworkError

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
        var turboErr *sdk.TurboDocxError
        if errors.As(err, &turboErr) {
            log.Printf("API error [%d]: %s", turboErr.StatusCode, turboErr.Message)
        } else {
            log.Fatal(err)
        }
    }
}
```

### Error Properties

| Property     | Type     | Description                  |
| ------------ | -------- | ---------------------------- |
| `Message`    | `string` | Human-readable error message |
| `StatusCode` | `int`    | HTTP status code             |
| `Code`       | `string` | Error code (if available)    |

---

## Types

### DeliverableVariable

Variable configuration for template injection:

| Property                 | Type                    | Required | Description                                          |
| ------------------------ | ----------------------- | -------- | ---------------------------------------------------- |
| `Placeholder`            | `string`                | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `Text`                   | `string`                | No\*     | Value to inject                                      |
| `MimeType`               | `string`                | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `IsDisabled`             | `bool`                  | No       | Skip this variable during generation                 |
| `Subvariables`           | `[]DeliverableVariable` | No       | Nested sub-variables for HTML content                |
| `VariableStack`          | `interface{}`           | No       | Multiple instances for repeating content             |
| `AIPrompt`               | `string`                | No       | AI prompt for content generation (max 16,000 chars)  |

\*Required unless `VariableStack` is provided or `IsDisabled` is true.

### CreateDeliverableRequest

Request configuration for `GenerateDeliverable`:

| Property       | Type                    | Required | Description                                |
| -------------- | ----------------------- | -------- | ------------------------------------------ |
| `Name`         | `string`                | Yes      | Deliverable name (3-255 characters)        |
| `TemplateID`   | `string`                | Yes      | Template ID to generate from               |
| `Variables`    | `[]DeliverableVariable` | Yes      | Variables for template substitution        |
| `Description`  | `string`                | No       | Description (up to 65,535 characters)      |
| `Tags`         | `[]string`              | No       | Tag strings to associate                   |

### UpdateDeliverableRequest

Request configuration for `UpdateDeliverableInfo`:

| Property      | Type        | Required | Description                                                      |
| ------------- | ----------- | -------- | ---------------------------------------------------------------- |
| `Name`        | `string`    | No       | Updated name (3-255 characters)                                  |
| `Description` | `string`    | No       | Updated description                                              |
| `Tags`        | `*[]string` | No       | Replace all tags (`nil` = no change, `&[]string{}` = remove all) |

### ListDeliverablesOptions

Options for `ListDeliverables`:

| Property       | Type       | Required | Description                          |
| -------------- | ---------- | -------- | ------------------------------------ |
| `Limit`        | `int`      | No       | Results per page (1-100, default 6)  |
| `Offset`       | `int`      | No       | Results to skip (default 0)          |
| `Query`        | `string`   | No       | Search query to filter by name       |
| `ShowTags`     | `bool`     | No       | Include tags in the response         |

### DeliverableRecord

The deliverable object returned by `ListDeliverables`:

| Property       | Type     | Description                           |
| -------------- | -------- | ------------------------------------- |
| `ID`           | `string` | Unique deliverable ID (UUID)          |
| `Name`         | `string` | Deliverable name                      |
| `Description`  | `string` | Description text                      |
| `TemplateID`   | `string` | Source template ID                    |
| `CreatedBy`    | `string` | User ID of the creator                |
| `Email`        | `string` | Creator's email address               |
| `FileSize`     | `int64`  | File size in bytes                    |
| `FileType`     | `string` | MIME type of the generated file       |
| `DefaultFont`  | `string` | Default font used                     |
| `Fonts`        | `[]Font` | Fonts used in the document            |
| `IsActive`     | `bool`   | Whether the deliverable is active     |
| `CreatedOn`    | `string` | ISO 8601 creation timestamp           |
| `UpdatedOn`    | `string` | ISO 8601 last update timestamp        |
| `Tags`         | `[]Tag`  | Associated tags (when `ShowTags=true`)|

### DeliverableDetailRecord

The deliverable object returned by `GetDeliverableDetails`. Includes all fields from [DeliverableRecord](#deliverablerecord) **except `FileSize`**, plus:

| Property             | Type                    | Description                              |
| -------------------- | ----------------------- | ---------------------------------------- |
| `TemplateName`       | `string`                | Source template name                     |
| `TemplateNotDeleted` | `*bool`                 | Whether the source template still exists |
| `Variables`          | `[]DeliverableVariable` | Parsed variable objects with values      |

### Tag

Tag object included when `ShowTags` is enabled:

| Property    | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `ID`        | `string` | Tag unique identifier (UUID)         |
| `Label`     | `string` | Tag display name                     |
| `IsActive`  | `bool`   | Whether the tag is active            |
| `UpdatedOn` | `string` | ISO 8601 last update timestamp       |
| `CreatedOn` | `string` | ISO 8601 creation timestamp          |
| `CreatedBy` | `string` | User ID of the tag creator           |
| `OrgID`     | `string` | Organization ID                      |

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[TurboDocx Templating](/docs/TurboDocx%20Templating/How%20to%20Create%20a%20Template)** - How to create and configure document templates
- **[Variable Reference](/docs/API/Deliverable%20API#variable-object-structure)** - Complete guide to variable types, formatting, and advanced injection options
- **[API Reference](/docs/API/Deliverable%20API)** - Full REST API documentation for Deliverable endpoints

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [API Reference](/docs/API/Deliverable%20API)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
