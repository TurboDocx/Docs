---
title: Go SDK
sidebar_position: 4
sidebar_label: Go
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

# Go SDK

The official TurboDocx SDK for Go applications. Idiomatic Go with full context support.

[![Go Reference](https://pkg.go.dev/badge/github.com/turbodocx/sdk.svg)](https://pkg.go.dev/github.com/turbodocx/sdk)
[![GitHub](https://img.shields.io/github/stars/turbodocx/sdk?style=social)](https://github.com/TurboDocx/SDK)

## Installation

```bash
go get github.com/turbodocx/sdk
```

## Requirements

- Go 1.21+

---

## Configuration

```go
package main

import (
    "os"

    "github.com/turbodocx/sdk"
)

func main() {
    // Create a new client
    client := sdk.NewTurboSign(os.Getenv("TURBODOCX_API_KEY"))

    // Or with options
    client := sdk.NewTurboSign(
        os.Getenv("TURBODOCX_API_KEY"),
        sdk.WithBaseURL("https://api.turbodocx.com"),
        sdk.WithTimeout(30 * time.Second),
    )
}
```

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
```

---

## Quick Start

### Send a Document for Signature

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"

    "github.com/turbodocx/sdk"
)

func main() {
    client := sdk.NewTurboSign(os.Getenv("TURBODOCX_API_KEY"))

    ctx := context.Background()

    result, err := client.PrepareForSigningSingle(ctx, &sdk.SigningRequest{
        FileLink:     "https://example.com/contract.pdf",
        DocumentName: "Service Agreement",
        SenderName:   "Acme Corp",
        SenderEmail:  "contracts@acme.com",
        Recipients: []sdk.Recipient{
            {Name: "Alice Smith", Email: "alice@example.com", Order: 1},
            {Name: "Bob Johnson", Email: "bob@example.com", Order: 2},
        },
        Fields: []sdk.Field{
            // Alice's signature
            {Type: sdk.FieldTypeSignature, Page: 1, X: 100, Y: 650, Width: 200, Height: 50, RecipientOrder: 1},
            {Type: sdk.FieldTypeDate, Page: 1, X: 320, Y: 650, Width: 100, Height: 30, RecipientOrder: 1},
            // Bob's signature
            {Type: sdk.FieldTypeSignature, Page: 1, X: 100, Y: 720, Width: 200, Height: 50, RecipientOrder: 2},
            {Type: sdk.FieldTypeDate, Page: 1, X: 320, Y: 720, Width: 100, Height: 30, RecipientOrder: 2},
        },
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Document ID: %s\n", result.DocumentID)
    for _, recipient := range result.Recipients {
        fmt.Printf("%s: %s\n", recipient.Name, recipient.SignURL)
    }
}
```

### Using Template-Based Fields

```go
result, err := client.PrepareForSigningSingle(ctx, &sdk.SigningRequest{
    FileLink: "https://example.com/contract-with-placeholders.pdf",
    Recipients: []sdk.Recipient{
        {Name: "Alice Smith", Email: "alice@example.com", Order: 1},
    },
    Fields: []sdk.Field{
        {Type: sdk.FieldTypeSignature, Anchor: "{SIGNATURE_ALICE}", Width: 200, Height: 50, RecipientOrder: 1},
        {Type: sdk.FieldTypeDate, Anchor: "{DATE_ALICE}", Width: 100, Height: 30, RecipientOrder: 1},
    },
})
```

---

## API Reference

### NewTurboSign()

Create a new TurboSign client.

```go
func NewTurboSign(apiKey string, opts ...Option) *TurboSign

// Available options
sdk.WithBaseURL(url string)
sdk.WithTimeout(timeout time.Duration)
sdk.WithHTTPClient(client *http.Client)
```

### PrepareForReview()

Upload a document for preview without sending emails.

```go
result, err := client.PrepareForReview(ctx, &sdk.ReviewRequest{
    FileLink:     "https://example.com/document.pdf",
    DocumentName: "Contract Draft",
    Recipients: []sdk.Recipient{
        {Name: "John Doe", Email: "john@example.com", Order: 1},
    },
    Fields: []sdk.Field{
        {Type: sdk.FieldTypeSignature, Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientOrder: 1},
    },
})

fmt.Println(result.DocumentID)
fmt.Println(result.PreviewURL)
```

### PrepareForSigningSingle()

Upload a document and immediately send signature requests.

```go
result, err := client.PrepareForSigningSingle(ctx, &sdk.SigningRequest{
    FileLink:     "https://example.com/document.pdf",
    DocumentName: "Service Agreement",
    SenderName:   "Your Company",
    SenderEmail:  "sender@company.com",
    Recipients: []sdk.Recipient{
        {Name: "Recipient Name", Email: "recipient@example.com", Order: 1},
    },
    Fields: []sdk.Field{
        {Type: sdk.FieldTypeSignature, Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientOrder: 1},
    },
})
```

### GetStatus()

Check the status of a document.

```go
status, err := client.GetStatus(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

fmt.Println(status.Status) // "pending", "completed", or "voided"
fmt.Println(status.CompletedAt)

for _, recipient := range status.Recipients {
    fmt.Printf("%s: %s\n", recipient.Name, recipient.Status)
}
```

### Download()

Download the completed signed document.

```go
pdfData, err := client.Download(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

// Save to file
err = os.WriteFile("signed-contract.pdf", pdfData, 0644)
if err != nil {
    log.Fatal(err)
}

// Or upload to S3
_, err = s3Client.PutObject(ctx, &s3.PutObjectInput{
    Bucket: aws.String("my-bucket"),
    Key:    aws.String("signed-contract.pdf"),
    Body:   bytes.NewReader(pdfData),
})
```

### Void()

Cancel/void a signature request.

```go
err := client.Void(ctx, "document-uuid", "Contract terms changed")
```

### Resend()

Resend signature request emails.

```go
// Resend to all pending recipients
err := client.Resend(ctx, "document-uuid", nil)

// Resend to specific recipients
err := client.Resend(ctx, "document-uuid", []string{"recipient-uuid-1", "recipient-uuid-2"})
```

---

## HTTP Handler Examples

### Basic HTTP Handler

```go
package main

import (
    "encoding/json"
    "net/http"
    "os"

    "github.com/turbodocx/sdk"
)

var client = sdk.NewTurboSign(os.Getenv("TURBODOCX_API_KEY"))

type SendContractRequest struct {
    RecipientName  string `json:"recipient_name"`
    RecipientEmail string `json:"recipient_email"`
    ContractURL    string `json:"contract_url"`
}

type SendContractResponse struct {
    DocumentID string `json:"document_id"`
    SignURL    string `json:"sign_url"`
}

func sendContractHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var req SendContractRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    result, err := client.PrepareForSigningSingle(r.Context(), &sdk.SigningRequest{
        FileLink: req.ContractURL,
        Recipients: []sdk.Recipient{
            {Name: req.RecipientName, Email: req.RecipientEmail, Order: 1},
        },
        Fields: []sdk.Field{
            {Type: sdk.FieldTypeSignature, Page: 1, X: 100, Y: 650, Width: 200, Height: 50, RecipientOrder: 1},
        },
    })
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(SendContractResponse{
        DocumentID: result.DocumentID,
        SignURL:    result.Recipients[0].SignURL,
    })
}

func main() {
    http.HandleFunc("/api/send-contract", sendContractHandler)
    http.ListenAndServe(":8080", nil)
}
```

### Gin Framework

```go
package main

import (
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
    "github.com/turbodocx/sdk"
)

var client = sdk.NewTurboSign(os.Getenv("TURBODOCX_API_KEY"))

func main() {
    r := gin.Default()

    r.POST("/api/send-contract", func(c *gin.Context) {
        var req struct {
            RecipientName  string `json:"recipient_name" binding:"required"`
            RecipientEmail string `json:"recipient_email" binding:"required"`
            ContractURL    string `json:"contract_url" binding:"required"`
        }

        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        result, err := client.PrepareForSigningSingle(c.Request.Context(), &sdk.SigningRequest{
            FileLink: req.ContractURL,
            Recipients: []sdk.Recipient{
                {Name: req.RecipientName, Email: req.RecipientEmail, Order: 1},
            },
            Fields: []sdk.Field{
                {Type: sdk.FieldTypeSignature, Page: 1, X: 100, Y: 650, Width: 200, Height: 50, RecipientOrder: 1},
            },
        })
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "document_id": result.DocumentID,
            "sign_url":    result.Recipients[0].SignURL,
        })
    })

    r.GET("/api/document/:id/status", func(c *gin.Context) {
        status, err := client.GetStatus(c.Request.Context(), c.Param("id"))
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, status)
    })

    r.Run(":8080")
}
```

---

## Error Handling

```go
import (
    "errors"

    "github.com/turbodocx/sdk"
)

result, err := client.PrepareForSigningSingle(ctx, request)
if err != nil {
    var turboErr *sdk.TurboDocxError
    if errors.As(err, &turboErr) {
        switch turboErr.Code {
        case sdk.ErrCodeUnauthorized:
            log.Println("Invalid API key")
        case sdk.ErrCodeInvalidDocument:
            log.Printf("Could not process document: %s", turboErr.Message)
        case sdk.ErrCodeRateLimited:
            log.Printf("Rate limited, retry after: %d seconds", turboErr.RetryAfter)
        case sdk.ErrCodeNotFound:
            log.Println("Document not found")
        default:
            log.Printf("Error %s: %s", turboErr.Code, turboErr.Message)
        }
    } else {
        // Network or unexpected error
        log.Fatal(err)
    }
}
```

---

## Types

### Field Types

```go
const (
    FieldTypeSignature sdk.FieldType = "signature"
    FieldTypeInitials  sdk.FieldType = "initials"
    FieldTypeText      sdk.FieldType = "text"
    FieldTypeDate      sdk.FieldType = "date"
    FieldTypeCheckbox  sdk.FieldType = "checkbox"
    FieldTypeFullName  sdk.FieldType = "full_name"
    FieldTypeEmail     sdk.FieldType = "email"
    FieldTypeTitle     sdk.FieldType = "title"
    FieldTypeCompany   sdk.FieldType = "company"
)
```

### Structs

```go
type Recipient struct {
    Name    string `json:"name"`
    Email   string `json:"email"`
    Order   int    `json:"order"`
    // Response fields
    ID      string `json:"id,omitempty"`
    Status  string `json:"status,omitempty"`
    SignURL string `json:"sign_url,omitempty"`
}

type Field struct {
    Type           FieldType `json:"type"`
    Page           int       `json:"page,omitempty"`
    X              int       `json:"x,omitempty"`
    Y              int       `json:"y,omitempty"`
    Width          int       `json:"width"`
    Height         int       `json:"height"`
    RecipientOrder int       `json:"recipient_order"`
    Anchor         string    `json:"anchor,omitempty"` // For template-based fields
}

type SigningRequest struct {
    FileLink     string      `json:"file_link,omitempty"`
    File         []byte      `json:"-"` // For direct upload
    DocumentName string      `json:"document_name,omitempty"`
    SenderName   string      `json:"sender_name,omitempty"`
    SenderEmail  string      `json:"sender_email,omitempty"`
    Recipients   []Recipient `json:"recipients"`
    Fields       []Field     `json:"fields"`
}

type SigningResult struct {
    DocumentID string      `json:"document_id"`
    Recipients []Recipient `json:"recipients"`
}

type DocumentStatus struct {
    Status      string      `json:"status"` // "pending", "completed", "voided"
    CompletedAt *time.Time  `json:"completed_at,omitempty"`
    Recipients  []Recipient `json:"recipients"`
}
```

---

## Webhook Signature Verification

Verify that webhooks are genuinely from TurboDocx:

```go
package main

import (
    "encoding/json"
    "io"
    "net/http"
    "os"

    "github.com/turbodocx/sdk"
)

func webhookHandler(w http.ResponseWriter, r *http.Request) {
    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Failed to read body", http.StatusBadRequest)
        return
    }

    signature := r.Header.Get("X-TurboDocx-Signature")
    timestamp := r.Header.Get("X-TurboDocx-Timestamp")
    secret := os.Getenv("TURBODOCX_WEBHOOK_SECRET")

    isValid := sdk.VerifyWebhookSignature(signature, timestamp, body, secret)
    if !isValid {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }

    var event sdk.WebhookEvent
    if err := json.Unmarshal(body, &event); err != nil {
        http.Error(w, "Failed to parse event", http.StatusBadRequest)
        return
    }

    switch event.Event {
    case "signature.document.completed":
        log.Printf("Document completed: %s", event.Data.DocumentID)
    case "signature.document.voided":
        log.Printf("Document voided: %s", event.Data.DocumentID)
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]bool{"received": true})
}
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [Go Package Documentation](https://pkg.go.dev/github.com/turbodocx/sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
