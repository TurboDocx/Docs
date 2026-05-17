---
title: TurboWebhooks Go SDK
sidebar_position: 18
sidebar_label: "TurboWebhooks: Go"
description: Official TurboDocx Webhooks SDK for Go. Subscribe to signature.document.completed and signature.document.voided events, verify inbound webhook signatures with HMAC-SHA256, and manage delivery history programmatically.
keywords:
  - turbodocx webhooks
  - turbowebhooks go
  - webhook go
  - hmac signature verification go
  - signature webhook nethttp
  - signature webhook gin
  - webhook receiver net/http
  - webhook receiver gin
  - webhook secret go
  - webhook events go
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboWebhooks Go SDK

The official TurboDocx Webhooks SDK for Go applications (net/http, Gin, Echo, Chi, AWS Lambda, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Go 1.21+. Distributed as `github.com/TurboDocx/SDK/packages/go-sdk` (same module as TurboSign).

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications when signature documents complete or get voided, instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

For the full conceptual overview of how webhooks work in TurboSign (delivery retries, payload schema, dashboard UI), see [TurboSign → Webhooks](/docs/TurboSign/Webhooks).
:::

## Installation

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

Then import:

```go
import turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
```

## Requirements

- Go 1.21 or higher
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)
- All client methods accept a `context.Context` — pass `context.Background()` for one-offs or the request context inside handlers

## Configuration

```go
import (
    "os"
    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

wh, err := turbodocx.NewWebhooksClientWithConfig(turbodocx.ClientConfig{
    APIKey: os.Getenv("TURBODOCX_API_KEY"),
    OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
})
if err != nil {
    log.Fatal(err)
}
```

`NewWebhooksClientWithConfig` does **not** require `SenderEmail` — webhook routes don't send email, so the sender validation that `NewClientWithConfig` enforces for TurboSign is skipped here. If `APIKey`, `OrgID`, or `BaseURL` are blank, the SDK falls back to `TURBODOCX_API_KEY`, `TURBODOCX_ORG_ID`, and `TURBODOCX_BASE_URL`.

### Environment Variables

```bash
TURBODOCX_API_KEY=your_admin_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
# store the secret returned by CreateWebhook so your receiver can verify signatures
TURBODOCX_WEBHOOK_SECRET=whsec_...
```

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role returns `*turbodocx.AuthorizationError` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

## Quick Start

### 1. Create the signature webhook

```go
package main

import (
    "context"
    "errors"
    "fmt"
    "log"
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    ctx := context.Background()

    wh, err := turbodocx.NewWebhooksClientWithConfig(turbodocx.ClientConfig{
        APIKey: os.Getenv("TURBODOCX_API_KEY"),
        OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
    })
    if err != nil {
        log.Fatal(err)
    }

    created, err := wh.CreateWebhook(ctx, turbodocx.CreateWebhookRequest{
        URLs:   []string{"https://your-server.example.com/webhooks/turbodocx"},
        Events: []string{"signature.document.completed", "signature.document.voided"},
    })
    if err != nil {
        var conflict *turbodocx.ConflictError
        var valErr *turbodocx.ValidationError
        switch {
        case errors.As(err, &conflict):
            // 409 — the signature webhook already exists for this org.
            // Use UpdateWebhook or DeleteWebhook instead.
            log.Println("Webhook already exists. Use UpdateWebhook or DeleteWebhook.")
            return
        case errors.As(err, &valErr):
            // 400 — most commonly a non-HTTPS URL or empty events array.
            log.Fatalf("Validation failed: %s", valErr.Message)
        default:
            log.Fatal(err)
        }
    }

    // SAVE THIS SECRET — it is shown ONCE and cannot be retrieved later.
    if err := os.WriteFile(".secret", []byte(created.Secret), 0600); err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Created webhook id=%s\n", created.ID)
}
```

:::warning HTTPS only
TurboDocx rejects non-HTTPS webhook URLs with HTTP 400. For local development, expose your receiver via an HTTPS tunnel ([ngrok](https://ngrok.com), [cloudflared](https://github.com/cloudflare/cloudflared), or [webhook.site](https://webhook.site)) and pass the tunnel URL to `CreateWebhook`.
:::

### 2. Verify inbound webhook signatures

When TurboDocx POSTs to your receiver, every request carries an `X-TurboDocx-Signature` header. Verify it before trusting the payload — the helper enforces a 300-second timestamp tolerance and uses `hmac.Equal` for constant-time comparison.

<Tabs>
<TabItem value="nethttp" label="net/http">

```go
package main

import (
    "io"
    "log"
    "net/http"
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func turbodocxWebhook(w http.ResponseWriter, r *http.Request) {
    // IMPORTANT: read raw bytes — the signature is computed over them.
    // Decoding to a struct first will lose whitespace and break verification.
    rawBody, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "read failed", http.StatusBadRequest)
        return
    }
    defer r.Body.Close()

    signature := r.Header.Get("X-TurboDocx-Signature")
    timestamp := r.Header.Get("X-TurboDocx-Timestamp")
    secret := os.Getenv("TURBODOCX_WEBHOOK_SECRET")

    if !turbodocx.VerifyWebhookSignature(rawBody, signature, timestamp, secret, nil) {
        http.Error(w, "invalid signature", http.StatusUnauthorized)
        return
    }

    // Now safe to json.Unmarshal(rawBody, &event) and dispatch on event.eventType.
    w.WriteHeader(http.StatusOK)
}

func main() {
    http.HandleFunc("/webhooks/turbodocx", turbodocxWebhook)
    log.Fatal(http.ListenAndServe(":3000", nil))
}
```

</TabItem>
<TabItem value="gin" label="Gin">

```go
package main

import (
    "io"
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    r := gin.Default()

    r.POST("/webhooks/turbodocx", func(c *gin.Context) {
        rawBody, err := io.ReadAll(c.Request.Body)
        if err != nil {
            c.String(http.StatusBadRequest, "read failed")
            return
        }
        defer c.Request.Body.Close()

        if !turbodocx.VerifyWebhookSignature(
            rawBody,
            c.GetHeader("X-TurboDocx-Signature"),
            c.GetHeader("X-TurboDocx-Timestamp"),
            os.Getenv("TURBODOCX_WEBHOOK_SECRET"),
            nil,
        ) {
            c.String(http.StatusUnauthorized, "invalid signature")
            return
        }

        // dispatch event["eventType"] ...
        c.Status(http.StatusOK)
    })

    r.Run(":3000")
}
```

</TabItem>
<TabItem value="echo" label="Echo">

```go
package main

import (
    "io"
    "net/http"
    "os"

    "github.com/labstack/echo/v4"
    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    e := echo.New()

    e.POST("/webhooks/turbodocx", func(c echo.Context) error {
        rawBody, err := io.ReadAll(c.Request().Body)
        if err != nil {
            return c.String(http.StatusBadRequest, "read failed")
        }
        defer c.Request().Body.Close()

        if !turbodocx.VerifyWebhookSignature(
            rawBody,
            c.Request().Header.Get("X-TurboDocx-Signature"),
            c.Request().Header.Get("X-TurboDocx-Timestamp"),
            os.Getenv("TURBODOCX_WEBHOOK_SECRET"),
            nil,
        ) {
            return c.String(http.StatusUnauthorized, "invalid signature")
        }

        // dispatch event["eventType"] ...
        return c.NoContent(http.StatusOK)
    })

    e.Logger.Fatal(e.Start(":3000"))
}
```

</TabItem>
</Tabs>

:::danger Use the raw request body
The HMAC is computed over the **exact bytes** that left the TurboDocx server. Never decode JSON into a struct and re-marshal before verifying — re-encoded JSON will not byte-match and verification will fail. Always read with `io.ReadAll(r.Body)` first.
:::

The signature contract:

| Field | Value |
|---|---|
| Header | `X-TurboDocx-Signature: sha256=<hex>` |
| Timestamp header | `X-TurboDocx-Timestamp: <unix-seconds>` |
| Signed string | `timestamp + "." + rawBody` |
| Algorithm | HMAC-SHA256 |
| Tolerance | 300 seconds (configurable via `VerifyWebhookSignatureOptions.ToleranceSeconds`) |
| Comparison | `hmac.Equal` (constant-time) |

## Method Reference

All methods are instance methods on `*turbodocx.WebhooksClient`. Construct once, then reuse.

### CreateWebhook

Subscribe the org to events. Returns `*CreateWebhookResponse` with `ID` and `Secret` — the **secret is shown once**.

```go
created, err := wh.CreateWebhook(ctx, turbodocx.CreateWebhookRequest{
    URLs:   []string{"https://your-server.example.com/webhooks/turbodocx"},
    Events: []string{"signature.document.completed", "signature.document.voided"},
})
```

| Error type | Why |
|---|---|
| `*ConflictError` (409) | The signature webhook already exists for this org. |
| `*ValidationError` (400) | A URL is not HTTPS, or `Events` is empty. |
| `*AuthorizationError` (403) | API key lacks the administrator role. |

### GetWebhook

Get the org's signature webhook plus delivery statistics. Returns `map[string]interface{}` so new fields surface without an SDK upgrade.

```go
webhook, err := wh.GetWebhook(ctx)
// webhook["urls"], webhook["events"], webhook["isActive"]
// webhook["deliveryStats"]: { totalDeliveries, successfulDeliveries, failedDeliveries, pendingRetries }
// webhook["availableEvents"]
```

### UpdateWebhook

Patch one or more fields. Leave any field at its zero value to skip it. Use `turbodocx.BoolPtr(false)` to toggle `IsActive`.

```go
updated, err := wh.UpdateWebhook(ctx, turbodocx.UpdateWebhookRequest{
    URLs:     []string{"https://your-server.example.com/webhooks/turbodocx"},
    Events:   []string{"signature.document.completed"},
    IsActive: turbodocx.BoolPtr(true),
})
```

### DeleteWebhook

Soft-delete the webhook and its delivery history.

```go
_, err := wh.DeleteWebhook(ctx)
```

### TestWebhook

Fire a synthetic delivery to every URL configured on the webhook. Useful for CI smoke tests before flipping a new receiver into production.

```go
result, err := wh.TestWebhook(ctx, turbodocx.TestWebhookRequest{
    EventType: "signature.document.completed",
    Payload: map[string]interface{}{
        "documentId":   "...",
        "documentName": "...",
    },
})

summary := result["summary"].(map[string]interface{})
fmt.Printf("%v/%v succeeded\n", summary["successful"], summary["total"])
if errs, ok := summary["errors"].([]interface{}); ok {
    for _, e := range errs {
        fmt.Printf("  failure: %v\n", e) // per-URL failure messages
    }
}
```

`NotifyWebhook` is also exposed for symmetry with the backend surface — it routes through the same handler and returns the same shape. Prefer `TestWebhook` in new code.

### RegenerateWebhookSecret

Rotate the HMAC secret. The new secret is shown **once**; old signatures fail immediately after rotation.

```go
rotated, err := wh.RegenerateWebhookSecret(ctx)
newSecret := rotated["secret"]
// rotated["regeneratedAt"]
```

### ListWebhookDeliveries

Page through historical delivery attempts with filters. All filter fields are pointers — leave nil to skip.

```go
limit := 20
delivered := false
httpStatus := 500
page, err := wh.ListWebhookDeliveries(ctx, turbodocx.ListDeliveriesRequest{
    Limit:       &limit,
    EventType:   "signature.document.completed",
    IsDelivered: &delivered,
    HTTPStatus:  &httpStatus,
})
// page["results"]: []WebhookDelivery
// page["totalRecords"]
```

### ReplayWebhookDelivery

Manually retry a past delivery by ID. Returns a freshly-created delivery row.

```go
replayed, err := wh.ReplayWebhookDelivery(ctx, "delivery-uuid-here")
// replayed["id"], replayed["httpStatus"], replayed["attemptCount"], ...
```

### GetWebhookStats

Aggregate delivery stats over a sliding window. Pass `0` for the backend default (30 days).

```go
stats, err := wh.GetWebhookStats(ctx, 30)
// stats["summary"]["successRate"]
// stats["summary"]["avgResponseTime"]  (milliseconds)
// stats["eventBreakdown"]  (per-event totals)
```

### VerifyWebhookSignature (free function)

Verify the `X-TurboDocx-Signature` header on an incoming request. Exported directly from the package and does **not** require a `WebhooksClient` — receivers commonly run in a different process (or different deploy) than the management code.

```go
ok := turbodocx.VerifyWebhookSignature(
    rawBody,         // []byte — raw bytes as received
    signatureHeader, // value of X-TurboDocx-Signature
    timestampHeader, // value of X-TurboDocx-Timestamp
    webhookSecret,   // the Secret from CreateWebhook
    nil,             // *VerifyWebhookSignatureOptions — nil uses 300s tolerance
)
```

Pass `&turbodocx.VerifyWebhookSignatureOptions{ToleranceSeconds: 60}` to tighten the window, or `ToleranceSeconds: -1` to disable the timestamp check entirely (NOT recommended in production).

## Error Handling

```go
import "errors"

_, err := wh.CreateWebhook(ctx, req)
if err != nil {
    var conflict *turbodocx.ConflictError
    var valErr   *turbodocx.ValidationError
    var authz    *turbodocx.AuthorizationError
    var auth     *turbodocx.AuthenticationError
    var nf       *turbodocx.NotFoundError
    var rate     *turbodocx.RateLimitError
    var netErr   *turbodocx.NetworkError
    var tdx      *turbodocx.TurboDocxError

    switch {
    case errors.As(err, &conflict):
        // 409 — signature webhook already exists; update or delete it instead
    case errors.As(err, &valErr):
        // 400 — non-HTTPS URL, empty events array, etc.
    case errors.As(err, &authz):
        // 403 — API key lacks the administrator role
    case errors.As(err, &auth):
        // 401 — bad or revoked API key
    case errors.As(err, &nf):
        // 404 — operating on a non-existent webhook
    case errors.As(err, &rate):
        // 429 — back off and retry
    case errors.As(err, &netErr):
        // request never reached the server (DNS, refused, timeout)
    case errors.As(err, &tdx):
        // catch-all for any other typed SDK error (raw 5xx, etc.)
        log.Printf("Error %d: %s", tdx.StatusCode, tdx.Message)
    }
}
```

### Common Error Codes

| Status | Type | When |
|---|---|---|
| 400 | `*ValidationError` | Non-HTTPS URL, empty events, invalid body |
| 401 | `*AuthenticationError` | Missing or invalid API key |
| 403 | `*AuthorizationError` | Valid key without administrator role |
| 404 | `*NotFoundError` | Operating on a non-existent webhook |
| 409 | `*ConflictError` | Creating when the signature webhook already exists |
| 429 | `*RateLimitError` | Rate limit exceeded — back off |

## Runnable End-to-End Example

A complete, validated CRUD walkthrough lives in the SDK repo:

**[`packages/go-sdk/examples/turbowebhooks_crud.go`](https://github.com/TurboDocx/SDK/blob/main/packages/go-sdk/examples/turbowebhooks_crud.go)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend. Run with `go run examples/turbowebhooks_crud.go` after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`. Override `TURBODOCX_RECEIVER_URL` to point at a real receiver (e.g. webhook.site, ngrok).

## Gotchas

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice returns `*ConflictError` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `CreateWebhook` and `RegenerateWebhookSecret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. Never unmarshal-then-remarshal first. Always `io.ReadAll(r.Body)` (or framework-equivalent) before calling `VerifyWebhookSignature`.
- **`VerifyWebhookSignature` is a free function**, not a method on `WebhooksClient` — it has no `APIKey`/`OrgID` dependency. Pass `nil` for `opts` to use the default 300-second tolerance.
- **Pointer-typed optional fields.** `UpdateWebhookRequest.IsActive` and `ListDeliveriesRequest.{Limit, Offset, IsDelivered, HTTPStatus}` are pointers so a zero value (`false` or `0`) can be told apart from "leave unchanged" / "no filter." Use `turbodocx.BoolPtr(false)` / `&n` to set them.
- **`TestWebhook` summary now includes per-URL errors.** Type-assert `result["summary"].(map[string]interface{})["errors"].([]interface{})` to see exactly which receiver failed and why.

## See Also

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks-javascript) — same API, JS idioms
- [TurboWebhooks Python SDK](/docs/SDKs/webhooks-python) — same API, Python idioms
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks-php) — same API, PHP idioms
- [TurboSign Go SDK](/docs/SDKs/go) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all five languages
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
