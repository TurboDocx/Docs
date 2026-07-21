---
title: TurboWebhooks Ruby SDK
sidebar_position: 20
sidebar_label: "TurboWebhooks: Ruby"
description: Official TurboDocx Webhooks SDK for Ruby. Subscribe to all seven TurboSign signature events with the WebhookEvent constants, verify inbound webhook signatures with HMAC-SHA256, and manage delivery history programmatically.
keywords:
  - turbodocx webhooks
  - turbowebhooks ruby
  - webhook ruby
  - hmac signature verification ruby
  - signature webhook ruby
  - webhook receiver rails
  - rails webhook
  - sinatra webhook
  - webhook secret ruby
  - webhook events ruby
  - webhookevent constants ruby
  - signature lifecycle events
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboWebhooks Ruby SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbowebhooks" product="TurboWebhooks" />

The official TurboDocx Webhooks SDK for Ruby applications. Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Ruby 2.7+. Available on RubyGems as `turbodocx-sdk` (same gem as TurboSign).

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications across the whole signature lifecycle — sent, viewed, each recipient signing, partial progress, completed, voided, and finalization failures — instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

For the full conceptual overview of how webhooks work in TurboSign (delivery retries, payload schema, dashboard UI), see [TurboSign → Webhooks](/docs/TurboSign/Webhooks).
:::

## Installation

```bash
gem install turbodocx-sdk
```

Or add it to your `Gemfile`:

```ruby
gem "turbodocx-sdk"
```

```bash
bundle install
```

## Requirements

- Ruby 2.7 or higher
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)

## Configuration

```ruby
require "turbodocx_sdk"

TurboDocxSdk::TurboWebhooks.configure(
  api_key: ENV["TURBODOCX_API_KEY"],
  org_id:  ENV["TURBODOCX_ORG_ID"]
)
```

`configure` hardcodes `skip_sender_validation: true` internally — webhook management never sends signature emails, so no `sender_email` is required.

If you skip `configure`, the first call falls back to the `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` environment variables; if either is missing it raises a descriptive `TurboDocxSdk::TurboDocxError`.

### Environment Variables

```bash
TURBODOCX_API_KEY=your_admin_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
# store the secret returned by create_webhook so your receiver can verify signatures
TURBODOCX_WEBHOOK_SECRET=whsec_...
```

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role raises `TurboDocxSdk::AuthorizationError` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

## Webhook Events

TurboSign dispatches **seven** events. Subscribe to any subset — `events` requires at least one.

| Event | Constant | Fires when |
|---|---|---|
| `signature.document.sent` | `TurboDocxSdk::WebhookEvent::SENT` | The document is dispatched to recipients |
| `signature.document.viewed` | `TurboDocxSdk::WebhookEvent::VIEWED` | A recipient opens the document for the first time |
| `signature.document.recipient_signed` | `TurboDocxSdk::WebhookEvent::RECIPIENT_SIGNED` | Any individual signer completes their signature — fires **once per signer**, including the last |
| `signature.document.signed` | `TurboDocxSdk::WebhookEvent::SIGNED` | A signer signs and the document is **not yet complete** (document-level partial progress) |
| `signature.document.completed` | `TurboDocxSdk::WebhookEvent::COMPLETED` | All recipients have signed and the signed PDF is finalized |
| `signature.document.finalization_failed` | `TurboDocxSdk::WebhookEvent::FINALIZATION_FAILED` | The signed PDF fails to finalize (e.g. a KMS signing error); the document is **not** completed |
| `signature.document.voided` | `TurboDocxSdk::WebhookEvent::VOIDED` | The document is voided or cancelled |

:::danger `signed` does not mean "the document is done"
`recipient_signed` is the **per-person** event: it fires once for **every** signer (including the last) and carries the signer's identity plus `is_final_signer` and `remaining_signers`.

`signed` is a document-level **partial-progress** event. On each signature `recipient_signed` fires first, then exactly one of `signed` (signers still remain), `completed` (that was the final signature and finalization succeeded), or `finalization_failed` (final signature, finalization failed). Two consequences:

- **`signed` never fires on the final signature.**
- **A single-signer document never emits `signed` at all** — it emits `recipient_signed` (`is_final_signer: true`) then `completed`.

To detect "the whole document is done", use `completed` (or `recipient_signed` with `is_final_signer: true`) — never `signed`.

See [TurboSign → Webhooks](/docs/TurboSign/Webhooks) for the full payload schemas and the lifecycle diagram.
:::

### Event constants

The events ship as frozen string constants under `TurboDocxSdk::WebhookEvent`, so a typo raises a `NameError` at load time instead of becoming a webhook that silently never fires.

```ruby
require "turbodocx_sdk"

# Subscribe to a chosen subset
TurboDocxSdk::TurboWebhooks.create_webhook(
  urls:   ["https://your-server.example.com/webhooks/turbodocx"],
  events: [
    TurboDocxSdk::WebhookEvent::SENT,
    TurboDocxSdk::WebhookEvent::VIEWED,
    TurboDocxSdk::WebhookEvent::RECIPIENT_SIGNED,
    TurboDocxSdk::WebhookEvent::COMPLETED,
    TurboDocxSdk::WebhookEvent::FINALIZATION_FAILED,
    TurboDocxSdk::WebhookEvent::VOIDED
  ]
)

# ...or to everything TurboSign emits — ALL is the frozen list of all 7,
# in lifecycle order.
TurboDocxSdk::TurboWebhooks.create_webhook(
  urls:   ["https://your-server.example.com/webhooks/turbodocx"],
  events: TurboDocxSdk::WebhookEvent::ALL
)
```

:::note Raw strings still work
Nothing was narrowed. `events` still accepts plain strings (`"signature.document.completed"`), so existing code keeps running and the backend can add new events without an SDK release. The constants exist for discoverability. `get_webhook` also returns `availableEvents` — the list the backend advertises at runtime.
:::

## Quick Start

### 1. Create the signature webhook

```ruby
require "turbodocx_sdk"

TurboDocxSdk::TurboWebhooks.configure(
  api_key: ENV["TURBODOCX_API_KEY"],
  org_id:  ENV["TURBODOCX_ORG_ID"]
)

begin
  created = TurboDocxSdk::TurboWebhooks.create_webhook(
    urls:   ["https://your-server.example.com/webhooks/turbodocx"],
    events: [
      TurboDocxSdk::WebhookEvent::SENT,
      TurboDocxSdk::WebhookEvent::VIEWED,
      TurboDocxSdk::WebhookEvent::RECIPIENT_SIGNED,
      TurboDocxSdk::WebhookEvent::COMPLETED,
      TurboDocxSdk::WebhookEvent::FINALIZATION_FAILED,
      TurboDocxSdk::WebhookEvent::VOIDED
    ]
  )

  # SAVE THIS SECRET — it is shown ONCE and cannot be retrieved later.
  File.write(".secret", created["secret"])
  puts "Created webhook id=#{created['id']}"
rescue TurboDocxSdk::ConflictError
  # 409 — the signature webhook already exists for this org.
  # Use TurboDocxSdk::TurboWebhooks.update_webhook(...) or .delete_webhook instead.
  puts "Webhook already exists. Use update_webhook or delete_webhook."
rescue TurboDocxSdk::ValidationError => e
  # 400 — most commonly a non-HTTPS URL or empty events array.
  puts "Validation failed: #{e.message}"
end
```

:::warning HTTPS only
TurboDocx rejects non-HTTPS webhook URLs with HTTP 400. For local development, expose your receiver via an HTTPS tunnel ([ngrok](https://ngrok.com), [cloudflared](https://github.com/cloudflare/cloudflared), etc.) and pass the tunnel URL to `create_webhook`.
:::

### 2. Verify inbound webhook signatures

When TurboDocx POSTs to your receiver, every request carries an `X-TurboDocx-Signature` header. Verify it before trusting the payload — the helper enforces a 300-second timestamp tolerance and uses constant-time comparison.

```ruby
require "turbodocx_sdk"

# In your Rack/Rails/Sinatra webhook handler:
raw_body  = request.body.read                                    # raw bytes — do NOT JSON.parse first
signature = request.get_header("HTTP_X_TURBODOCX_SIGNATURE") || ""
timestamp = request.get_header("HTTP_X_TURBODOCX_TIMESTAMP") || ""
secret    = ENV["TURBODOCX_WEBHOOK_SECRET"]

unless TurboDocxSdk.verify_webhook_signature(
  payload: raw_body,
  signature_header: signature,
  timestamp_header: timestamp,
  secret: secret
)
  return [401, {}, ["invalid signature"]]
end

event = JSON.parse(raw_body)
# process event["eventType"], event["data"], ...

[200, {}, ["ok"]]
```

:::danger Use the raw request body
The HMAC is computed over the **exact bytes** that left the TurboDocx server. Never `JSON.parse` and re-serialize before verifying — re-encoded JSON will not byte-match and verification will fail.
:::

The signature contract:

| Field | Value |
|---|---|
| Header | `X-TurboDocx-Signature: sha256=<hex>` |
| Timestamp header | `X-TurboDocx-Timestamp: <unix-seconds>` |
| Signed string | `<timestamp>.<raw_body>` |
| Algorithm | HMAC-SHA256 |
| Tolerance | 300 seconds (configurable) |
| Comparison | constant-time |

## Method Reference

All methods are class-level; call `TurboDocxSdk::TurboWebhooks.configure` once, then invoke any method directly on the class.

### create_webhook

Subscribe the org to events. Returns `{ "id" => ..., "secret" => ... }` — the **secret is shown once**.

```ruby
created = TurboDocxSdk::TurboWebhooks.create_webhook(
  urls:   ["https://your-server.example.com/webhooks/turbodocx"],
  events: [
    TurboDocxSdk::WebhookEvent::RECIPIENT_SIGNED,
    TurboDocxSdk::WebhookEvent::COMPLETED,
    TurboDocxSdk::WebhookEvent::FINALIZATION_FAILED,
    TurboDocxSdk::WebhookEvent::VOIDED
  ]
  # or subscribe to all 7: events: TurboDocxSdk::WebhookEvent::ALL
)
```

`urls` accepts **1 to 10** HTTPS URLs. `events` requires **at least 1** of the [seven events](#webhook-events) — raw strings and `TurboDocxSdk::WebhookEvent::*` constants are interchangeable (the constants *are* strings). Both are required on create.

| Raises | Why |
|---|---|
| `TurboDocxSdk::ConflictError` (409) | The signature webhook already exists for this org. |
| `TurboDocxSdk::ValidationError` (400) | A URL is not HTTPS, `urls` is empty or has more than 10 entries, or `events` is empty. |
| `TurboDocxSdk::AuthorizationError` (403) | API key lacks the administrator role. |

### get_webhook

Get the org's signature webhook plus delivery statistics.

```ruby
webhook = TurboDocxSdk::TurboWebhooks.get_webhook
# webhook["urls"], webhook["events"], webhook["isActive"]
# webhook["deliveryStats"]["totalDeliveries"]
# webhook["deliveryStats"]["successfulDeliveries"]
# webhook["deliveryStats"]["failedDeliveries"]
# webhook["deliveryStats"]["pendingRetries"]
# webhook["availableEvents"]
```

### update_webhook

Patch one or more fields. All parameters are optional — pass only what changes; untouched fields are omitted from the request.

```ruby
TurboDocxSdk::TurboWebhooks.update_webhook(
  urls:      ["https://your-server.example.com/webhooks/turbodocx"],
  events:    ["signature.document.completed"],
  is_active: true
)

# Leaving urls and events alone: just don't pass those keyword arguments.
TurboDocxSdk::TurboWebhooks.update_webhook(is_active: false)
```

:::danger Never send an empty array
`urls` and `events` are optional on update, but optional does **not** relax their minimum length. `urls: []` or `events: []` is a **400** — the same as sending an empty array on create. To leave a field unchanged, **omit the keyword argument entirely**. `urls` still caps at 10 entries on update.
:::

### delete_webhook

Soft-delete the webhook and its delivery history.

```ruby
TurboDocxSdk::TurboWebhooks.delete_webhook
```

### test_webhook

Fire a synthetic delivery to every URL configured on the webhook. Useful for CI smoke tests before flipping a new receiver into production.

```ruby
result = TurboDocxSdk::TurboWebhooks.test_webhook(
  event_type: "signature.document.completed",
  payload:    { "documentId" => "...", "documentName" => "..." }
)

puts "#{result['summary']['successful']}/#{result['summary']['total']} succeeded"
result["summary"]["errors"].each do |err|
  puts "  failure: #{err}"   # per-URL failure messages
end
```

### notify_webhook

Send a manual notification to every configured URL. Routes through the same backend handler as `test_webhook` and returns the same shape; prefer `test_webhook` in new code.

```ruby
TurboDocxSdk::TurboWebhooks.notify_webhook(
  event_type: "signature.document.voided",
  payload:    { "documentId" => "..." }
)
```

### regenerate_webhook_secret

Rotate the HMAC secret. The new secret is shown **once**; old signatures fail immediately after rotation.

```ruby
rotated = TurboDocxSdk::TurboWebhooks.regenerate_webhook_secret
# rotated["secret"]
# rotated["regeneratedAt"]
```

### list_webhook_deliveries

Page through historical delivery attempts with filters.

```ruby
page = TurboDocxSdk::TurboWebhooks.list_webhook_deliveries(
  limit:        20,
  offset:       0,
  event_type:   "signature.document.completed",
  is_delivered: false,
  http_status:  500
)
# page["results"]: array of delivery rows
# page["totalRecords"]
```

### replay_webhook_delivery

Manually retry a past delivery by ID. Returns a freshly-created delivery row.

```ruby
replay = TurboDocxSdk::TurboWebhooks.replay_webhook_delivery("delivery-uuid-here")
# replay["id"], replay["httpStatus"], replay["attemptCount"], ...
```

### get_webhook_stats

Aggregate delivery stats over a sliding window.

```ruby
stats = TurboDocxSdk::TurboWebhooks.get_webhook_stats(days: 30)
# stats["summary"]["successRate"]
# stats["summary"]["avgResponseTime"]  (milliseconds)
# stats["eventBreakdown"]  (per-event totals)
```

### verify_webhook_signature (free function)

Verify the `X-TurboDocx-Signature` header on an incoming request. It is a module-level function (`TurboDocxSdk.verify_webhook_signature`) and does **not** require `TurboWebhooks.configure` — receivers commonly run in a different process than the management code. It never raises on bad input; it always returns a boolean.

```ruby
ok = TurboDocxSdk.verify_webhook_signature(
  payload:          raw_body,
  signature_header: signature_header,
  timestamp_header: timestamp_header,
  secret:           webhook_secret,
  tolerance_seconds: 300   # default; pass 0 to disable the timestamp check (NOT recommended)
)
```

A negative `tolerance_seconds` **fails closed** (rejects every signature) rather than silently disabling the replay-window check.

## Rails Integration Example

Configure TurboWebhooks once in an initializer, then add a controller for the receiver.

```ruby
# config/initializers/turbodocx.rb
require "turbodocx_sdk"

TurboDocxSdk::TurboWebhooks.configure(
  api_key: Rails.application.credentials.dig(:turbodocx, :api_key),
  org_id:  Rails.application.credentials.dig(:turbodocx, :org_id)
)
```

```ruby
# app/controllers/webhooks_controller.rb
class WebhooksController < ApplicationController
  # Webhook receivers are server-to-server — skip CSRF.
  skip_before_action :verify_authenticity_token

  def turbodocx
    raw_body  = request.body.read
    signature = request.headers["X-TurboDocx-Signature"].to_s
    timestamp = request.headers["X-TurboDocx-Timestamp"].to_s
    secret    = Rails.application.credentials.dig(:turbodocx, :webhook_secret)

    unless TurboDocxSdk.verify_webhook_signature(
      payload: raw_body, signature_header: signature, timestamp_header: timestamp, secret: secret
    )
      return head :unauthorized
    end

    event = JSON.parse(raw_body)
    case event["eventType"]
    # fires once per signer — event.dig("data", "is_final_signer") marks the last
    when TurboDocxSdk::WebhookEvent::RECIPIENT_SIGNED    then on_recipient_signed(event["data"])
    # partial progress only — NEVER fires on the final signature
    when TurboDocxSdk::WebhookEvent::SIGNED              then on_partial_progress(event["data"])
    # the document is done
    when TurboDocxSdk::WebhookEvent::COMPLETED           then on_completed(event["data"])
    when TurboDocxSdk::WebhookEvent::FINALIZATION_FAILED then on_finalization_failed(event["data"])
    when TurboDocxSdk::WebhookEvent::VOIDED              then on_voided(event["data"])
    end

    head :ok
  end
end
```

```ruby
# config/routes.rb
post "/webhooks/turbodocx", to: "webhooks#turbodocx"
```

## Sinatra / Rack Integration Example

```ruby
require "sinatra"
require "turbodocx_sdk"

post "/webhooks/turbodocx" do
  raw_body  = request.body.read
  signature = request.env["HTTP_X_TURBODOCX_SIGNATURE"].to_s
  timestamp = request.env["HTTP_X_TURBODOCX_TIMESTAMP"].to_s

  halt 401 unless TurboDocxSdk.verify_webhook_signature(
    payload: raw_body,
    signature_header: signature,
    timestamp_header: timestamp,
    secret: ENV["TURBODOCX_WEBHOOK_SECRET"]
  )

  event = JSON.parse(raw_body)
  # process event["eventType"], event["data"], ...
  status 200
  "ok"
end
```

## Error Handling

```ruby
begin
  TurboDocxSdk::TurboWebhooks.create_webhook(urls: urls, events: events)
rescue TurboDocxSdk::ConflictError
  # 409 — signature webhook already exists; update or delete it instead
rescue TurboDocxSdk::ValidationError
  # 400 — non-HTTPS URL, empty events array, etc.
rescue TurboDocxSdk::AuthorizationError
  # 403 — API key lacks the administrator role
rescue TurboDocxSdk::AuthenticationError
  # 401 — bad or revoked API key
rescue TurboDocxSdk::NotFoundError
  # 404 — read/update/delete against a webhook that doesn't exist
rescue TurboDocxSdk::RateLimitError
  # 429 — back off and retry
rescue TurboDocxSdk::NetworkError
  # request never reached the server (DNS, refused, timeout)
rescue TurboDocxSdk::TurboDocxError => e
  # base class for any other typed SDK error (raw 5xx, etc.)
  puts "Error #{e.status_code}: #{e.message}"
end
```

All errors inherit from `TurboDocxSdk::TurboDocxError` and carry `status_code` and `code` readers.

### Common Error Codes

| Status | Error | When |
|---|---|---|
| 400 | `ValidationError` | Non-HTTPS URL, empty `urls`/`events` array, more than 10 URLs, invalid body |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without administrator role |
| 404 | `NotFoundError` | Operating on a non-existent webhook |
| 409 | `ConflictError` | Creating when the signature webhook already exists |
| 429 | `RateLimitError` | Rate limit exceeded — back off |

## Runnable End-to-End Example

A complete, validated CRUD walkthrough lives in the SDK repo:

**[`packages/ruby-sdk/examples/turbowebhooks_crud.rb`](https://github.com/TurboDocx/SDK/blob/main/packages/ruby-sdk/examples/turbowebhooks_crud.rb)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend.

## Gotchas

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice raises `ConflictError` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `create_webhook` and `regenerate_webhook_secret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. Never `JSON.parse` first.
- **`verify_webhook_signature` uses keyword arguments** (`payload:`, `signature_header:`, `timestamp_header:`, `secret:`) — not positional args.
- **`verify_webhook_signature` never raises.** Non-String headers, a missing secret, or a malformed timestamp all return `false` rather than raising; a negative `tolerance_seconds` fails closed.
- **`update_webhook` only sends what you pass.** Omitted keyword arguments are excluded from the PATCH body, so you can flip `is_active` without resending `urls`/`events`.
- **An empty array is not "no change".** `urls: []` and `events: []` are 400s on update, not no-ops — omitting the keyword is the only way to leave a field alone.
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `TurboDocxSdk::WebhookEvent::COMPLETED` to detect a finished document. See [Webhook Events](#webhook-events).
- **`WebhookEvent::ALL` is frozen.** It's the canonical list of all 7 events — `dup` it before mutating.

## See Also

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks-javascript) — same API, JS idioms
- [TurboWebhooks Python SDK](/docs/SDKs/webhooks-python) — same API, Python idioms
- [TurboSign Ruby SDK](/docs/SDKs/ruby) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all supported languages
- [TurboDocx SDK on RubyGems](https://rubygems.org/gems/turbodocx-sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk)
