---
title: TurboWebhooks PHP SDK
sidebar_position: 15
sidebar_label: "TurboWebhooks: PHP"
description: Official TurboDocx Webhooks SDK for PHP. Subscribe to all seven TurboSign signature events with the WebhookEvent backed enum, verify inbound webhook signatures with HMAC-SHA256, and manage delivery history programmatically.
keywords:
  - turbodocx webhooks
  - turbowebhooks php
  - webhook php
  - hmac signature verification php
  - signature webhook php
  - webhook receiver php
  - laravel webhook
  - symfony webhook
  - webhook secret php
  - webhook events php
  - webhookevent enum php
  - signature lifecycle events
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboWebhooks PHP SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbowebhooks" product="TurboWebhooks" />

The official TurboDocx Webhooks SDK for PHP applications. Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from PHP 8.1+. Available on Packagist as `turbodocx/sdk` (same package as TurboSign).

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications across the whole signature lifecycle — sent, viewed, each recipient signing, partial progress, completed, voided, and finalization failures — instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

For the full conceptual overview of how webhooks work in TurboSign (delivery retries, payload schema, dashboard UI), see [TurboSign → Webhooks](/docs/TurboSign/Webhooks).
:::

## Installation

```bash
composer require turbodocx/sdk
```

## Requirements

- PHP 8.1 or higher
- Composer 2.x
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)

## Configuration

```php
<?php
use TurboDocx\TurboWebhooks;
use TurboDocx\Config\HttpClientConfig;

TurboWebhooks::configure(new HttpClientConfig(
    apiKey: $_ENV['TURBODOCX_API_KEY'],
    orgId: $_ENV['TURBODOCX_ORG_ID'],
    skipSenderValidation: true,  // webhooks don't send email
));
```

Or load from environment variables:

```php
TurboWebhooks::configure(HttpClientConfig::fromEnvironment());
```

### Environment Variables

```bash
TURBODOCX_API_KEY=your_admin_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
# store the secret returned by createWebhook so your receiver can verify signatures
TURBODOCX_WEBHOOK_SECRET=whsec_...
```

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role will throw `AuthorizationException` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

## Webhook Events

TurboSign dispatches **seven** events. Subscribe to any subset — `events` requires at least one.

| Event | Enum case | Fires when |
|---|---|---|
| `signature.document.sent` | `WebhookEvent::SENT` | The document is dispatched to recipients |
| `signature.document.viewed` | `WebhookEvent::VIEWED` | A recipient opens the document for the first time |
| `signature.document.recipient_signed` | `WebhookEvent::RECIPIENT_SIGNED` | Any individual signer completes their signature — fires **once per signer**, including the last |
| `signature.document.signed` | `WebhookEvent::SIGNED` | A signer signs and the document is **not yet complete** (document-level partial progress) |
| `signature.document.completed` | `WebhookEvent::COMPLETED` | All recipients have signed and the signed PDF is finalized |
| `signature.document.finalization_failed` | `WebhookEvent::FINALIZATION_FAILED` | The signed PDF fails to finalize (e.g. a KMS signing error); the document is **not** completed |
| `signature.document.voided` | `WebhookEvent::VOIDED` | The document is voided or cancelled |

:::danger `signed` does not mean "the document is done"
`recipient_signed` is the **per-person** event: it fires once for **every** signer (including the last) and carries the signer's identity plus `is_final_signer` and `remaining_signers`.

`signed` is a document-level **partial-progress** event. On each signature `recipient_signed` fires first, then exactly one of `signed` (signers still remain), `completed` (that was the final signature and finalization succeeded), or `finalization_failed` (final signature, finalization failed). Two consequences:

- **`signed` never fires on the final signature.**
- **A single-signer document never emits `signed` at all** — it emits `recipient_signed` (`is_final_signer: true`) then `completed`.

To detect "the whole document is done", use `completed` (or `recipient_signed` with `is_final_signer: true`) — never `signed`.

See [TurboSign → Webhooks](/docs/TurboSign/Webhooks) for the full payload schemas and the lifecycle diagram.
:::

### Event constants

The events ship as a native PHP 8.1 **backed enum**, `TurboDocx\Types\Enums\WebhookEvent`. `createWebhook` takes wire strings, so pass `->value` (or one of the helpers below).

```php
<?php
use TurboDocx\TurboWebhooks;
use TurboDocx\Types\Enums\WebhookEvent;

// Subscribe to a chosen subset — ->value gives the wire string.
TurboWebhooks::createWebhook(
    urls: ['https://your-server.example.com/webhooks/turbodocx'],
    events: [
        WebhookEvent::SENT->value,
        WebhookEvent::VIEWED->value,
        WebhookEvent::RECIPIENT_SIGNED->value,
        WebhookEvent::COMPLETED->value,
        WebhookEvent::FINALIZATION_FAILED->value,
        WebhookEvent::VOIDED->value,
    ],
);

// ...or to everything TurboSign emits.
TurboWebhooks::createWebhook(
    urls: ['https://your-server.example.com/webhooks/turbodocx'],
    events: WebhookEvent::all(),   // array<int, string> — all 7 wire strings
);

// Helpers:
WebhookEvent::all();                              // all 7 wire strings, lifecycle order
WebhookEvent::values();                           // alias of all()
WebhookEvent::cases();                            // native — the 7 enum cases
WebhookEvent::from('signature.document.voided');  // native — string -> case (throws on unknown)
```

:::note Raw strings still work
Nothing was narrowed. `createWebhook(events: [...])` still takes plain strings, so existing code keeps running and the backend can add new events without an SDK release. The enum exists for discoverability and type safety. `getWebhook()` also returns `availableEvents` — the list the backend advertises at runtime.
:::

## Quick Start

### 1. Create the signature webhook

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use TurboDocx\TurboWebhooks;
use TurboDocx\Config\HttpClientConfig;
use TurboDocx\Exceptions\ConflictException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Types\Enums\WebhookEvent;

TurboWebhooks::configure(HttpClientConfig::fromEnvironment());

try {
    $created = TurboWebhooks::createWebhook(
        urls: ['https://your-server.example.com/webhooks/turbodocx'],
        events: [
            WebhookEvent::SENT->value,
            WebhookEvent::VIEWED->value,
            WebhookEvent::RECIPIENT_SIGNED->value,
            WebhookEvent::COMPLETED->value,
            WebhookEvent::FINALIZATION_FAILED->value,
            WebhookEvent::VOIDED->value,
        ],
    );

    // SAVE THIS SECRET — it is shown ONCE and cannot be retrieved later.
    file_put_contents('.secret', $created['secret']);
    echo "Created webhook id={$created['id']}\n";
} catch (ConflictException $e) {
    // 409 — the signature webhook already exists for this org.
    // Use TurboWebhooks::updateWebhook(...) or ::deleteWebhook() instead.
    echo "Webhook already exists. Use updateWebhook or deleteWebhook.\n";
} catch (ValidationException $e) {
    // 400 — most commonly a non-HTTPS URL or empty events array.
    echo "Validation failed: {$e->getMessage()}\n";
}
```

:::warning HTTPS only
TurboDocx rejects non-HTTPS webhook URLs with HTTP 400. For local development, expose your receiver via an HTTPS tunnel ([ngrok](https://ngrok.com), [cloudflared](https://github.com/cloudflare/cloudflared), etc.) and pass the tunnel URL to `createWebhook`.
:::

### 2. Verify inbound webhook signatures

When TurboDocx POSTs to your receiver, every request carries an `X-TurboDocx-Signature` header. Verify it before trusting the payload — the helper enforces a 300-second timestamp tolerance and uses constant-time comparison.

```php
<?php
use function TurboDocx\Utils\verifyWebhookSignature;

// In your webhook receiver (Laravel controller, Symfony controller, plain PHP, etc.)
$rawBody         = file_get_contents('php://input');               // raw bytes — do NOT json_decode first
$signatureHeader = $_SERVER['HTTP_X_TURBODOCX_SIGNATURE'] ?? '';
$timestampHeader = $_SERVER['HTTP_X_TURBODOCX_TIMESTAMP'] ?? '';
$secret          = $_ENV['TURBODOCX_WEBHOOK_SECRET'];

if (!verifyWebhookSignature($rawBody, $signatureHeader, $timestampHeader, $secret)) {
    http_response_code(401);
    exit;
}

$event = json_decode($rawBody, true);
// process $event['eventType'], $event['data'], ...

http_response_code(200);
```

:::danger Use the raw request body
The HMAC is computed over the **exact bytes** that left the TurboDocx server. Never `json_decode` and re-encode before verifying — re-encoded JSON will not byte-match and verification will fail.
:::

The signature contract:

| Field | Value |
|---|---|
| Header | `X-TurboDocx-Signature: sha256=<hex>` |
| Timestamp header | `X-TurboDocx-Timestamp: <unix-seconds>` |
| Signed string | `${timestamp}.${rawBody}` |
| Algorithm | HMAC-SHA256 |
| Tolerance | 300 seconds (configurable) |
| Comparison | `hash_equals` (constant-time) |

## Method Reference

All methods are static; configure once, then call on the `TurboWebhooks` class.

### createWebhook

Subscribe the org to events. Returns `{id, secret}` — the **secret is shown once**.

```php
use TurboDocx\Types\Enums\WebhookEvent;

$created = TurboWebhooks::createWebhook(
    urls: ['https://your-server.example.com/webhooks/turbodocx'],
    events: [
        WebhookEvent::RECIPIENT_SIGNED->value,
        WebhookEvent::COMPLETED->value,
        WebhookEvent::FINALIZATION_FAILED->value,
        WebhookEvent::VOIDED->value,
    ],
    // or subscribe to all 7: events: WebhookEvent::all()
);
```

`urls` accepts **1 to 10** HTTPS URLs. `events` requires **at least 1** of the [seven events](#webhook-events), as wire strings — raw strings and `WebhookEvent::*->value` are interchangeable. Both are required on create.

| Throws | Why |
|---|---|
| `ConflictException` (409) | The signature webhook already exists for this org. |
| `ValidationException` (400) | A URL is not HTTPS, `urls` is empty or has more than 10 entries, or `events` is empty. |
| `AuthorizationException` (403) | API key lacks the administrator role. |

### getWebhook

Get the org's signature webhook plus delivery statistics.

```php
$webhook = TurboWebhooks::getWebhook();
// $webhook['urls'], $webhook['events'], $webhook['isActive']
// $webhook['deliveryStats']['totalDeliveries']
// $webhook['deliveryStats']['successfulDeliveries']
// $webhook['deliveryStats']['failedDeliveries']
// $webhook['deliveryStats']['pendingRetries']
// $webhook['availableEvents']
```

### updateWebhook

Patch one or more fields. All parameters are optional — pass only what changes.

```php
TurboWebhooks::updateWebhook(
    urls: ['https://your-server.example.com/webhooks/turbodocx'],
    events: ['signature.document.completed'],
    isActive: true,
);

// Leaving urls and events alone: just don't pass those named arguments.
TurboWebhooks::updateWebhook(isActive: false);
```

:::danger Never send an empty array
`urls` and `events` are optional on update, but optional does **not** relax their minimum length. `urls: []` or `events: []` is a **400** — the same as sending an empty array on create. To leave a field unchanged, **omit the argument entirely**. `urls` still caps at 10 entries on update.
:::

### deleteWebhook

Soft-delete the webhook and its delivery history.

```php
TurboWebhooks::deleteWebhook();
```

### testWebhook

Fire a synthetic delivery to every URL configured on the webhook. Useful for CI smoke tests before flipping a new receiver into production.

```php
$result = TurboWebhooks::testWebhook(
    eventType: 'signature.document.completed',
    payload: ['documentId' => '...', 'documentName' => '...'],
);

echo "{$result['summary']['successful']}/{$result['summary']['total']} succeeded\n";
foreach ($result['summary']['errors'] as $err) {
    echo "  failure: {$err}\n";   // per-URL failure messages
}
```

### regenerateWebhookSecret

Rotate the HMAC secret. The new secret is shown **once**; old signatures fail immediately after rotation.

```php
$rotated = TurboWebhooks::regenerateWebhookSecret();
// $rotated['secret']
// $rotated['regeneratedAt']
```

### listWebhookDeliveries

Page through historical delivery attempts with filters.

```php
$page = TurboWebhooks::listWebhookDeliveries(
    limit: 20,
    offset: 0,
    eventType: 'signature.document.completed',
    isDelivered: false,
    httpStatus: 500,
);
// $page['results']: WebhookDelivery[]
// $page['totalRecords']
```

### replayWebhookDelivery

Manually retry a past delivery by ID. Returns a freshly-created delivery row.

```php
$replay = TurboWebhooks::replayWebhookDelivery('delivery-uuid-here');
// $replay['id'], $replay['httpStatus'], $replay['attemptCount'], ...
```

### getWebhookStats

Aggregate delivery stats over a sliding window.

```php
$stats = TurboWebhooks::getWebhookStats(days: 30);
// $stats['summary']['successRate']
// $stats['summary']['avgResponseTime']  (milliseconds)
// $stats['eventBreakdown']  (per-event totals)
```

### verifyWebhookSignature (free function)

Verify the `X-TurboDocx-Signature` header on an incoming request. Lives in the `TurboDocx\Utils` namespace and does **not** require `TurboWebhooks::configure()` — receivers commonly run in a different process than the management code.

```php
use function TurboDocx\Utils\verifyWebhookSignature;

$ok = verifyWebhookSignature(
    rawBody: $rawBody,
    signatureHeader: $signatureHeader,
    timestampHeader: $timestampHeader,
    secret: $webhookSecret,
    toleranceSeconds: 300,   // default; pass 0 to disable timestamp check (NOT recommended)
);
```

## Laravel Integration Example

Set up TurboWebhooks once in a service provider and add a controller for the receiver.

```php
// app/Providers/TurboDocxServiceProvider.php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use TurboDocx\TurboWebhooks;
use TurboDocx\Config\HttpClientConfig;

class TurboDocxServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        TurboWebhooks::configure(new HttpClientConfig(
            apiKey: config('services.turbodocx.api_key'),
            orgId: config('services.turbodocx.org_id'),
            skipSenderValidation: true,
        ));
    }
}
```

```php
// app/Http/Controllers/WebhookController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use TurboDocx\Types\Enums\WebhookEvent;
use function TurboDocx\Utils\verifyWebhookSignature;

class WebhookController extends Controller
{
    public function handle(Request $request): Response
    {
        $rawBody         = $request->getContent();
        $signatureHeader = $request->header('X-TurboDocx-Signature', '');
        $timestampHeader = $request->header('X-TurboDocx-Timestamp', '');
        $secret          = config('services.turbodocx.webhook_secret');

        if (!verifyWebhookSignature($rawBody, $signatureHeader, $timestampHeader, $secret)) {
            return response('', 401);
        }

        $event = json_decode($rawBody, true);

        // tryFrom() returns null for an event the SDK doesn't know yet (forward-compatible).
        match (WebhookEvent::tryFrom($event['eventType'])) {
            // fires once per signer — $event['data']['is_final_signer'] marks the last
            WebhookEvent::RECIPIENT_SIGNED    => $this->onRecipientSigned($event['data']),
            // partial progress only — NEVER fires on the final signature
            WebhookEvent::SIGNED              => $this->onPartialProgress($event['data']),
            // the document is done
            WebhookEvent::COMPLETED           => $this->onCompleted($event['data']),
            WebhookEvent::FINALIZATION_FAILED => $this->onFinalizationFailed($event['data']),
            WebhookEvent::VOIDED              => $this->onVoided($event['data']),
            default                           => null,
        };

        return response('', 200);
    }
}
```

```php
// routes/web.php (or routes/api.php)
Route::post('/webhooks/turbodocx', [WebhookController::class, 'handle']);
```

## Error Handling

```php
use TurboDocx\Exceptions\TurboDocxException;
use TurboDocx\Exceptions\AuthenticationException;
use TurboDocx\Exceptions\AuthorizationException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Exceptions\ConflictException;
use TurboDocx\Exceptions\NotFoundException;
use TurboDocx\Exceptions\RateLimitException;
use TurboDocx\Exceptions\NetworkException;

try {
    TurboWebhooks::createWebhook(urls: $urls, events: $events);
} catch (ConflictException $e) {
    // 409 — signature webhook already exists; update or delete it instead
} catch (ValidationException $e) {
    // 400 — non-HTTPS URL, empty events array, etc.
} catch (AuthorizationException $e) {
    // 403 — API key lacks the administrator role
} catch (AuthenticationException $e) {
    // 401 — bad or revoked API key
} catch (NotFoundException $e) {
    // 404 — read/update/delete against a webhook that doesn't exist
} catch (RateLimitException $e) {
    // 429 — back off and retry
} catch (NetworkException $e) {
    // request never reached the server (DNS, refused, timeout)
} catch (TurboDocxException $e) {
    // catch-all for any other typed SDK error (raw 5xx, etc.)
    echo "Error {$e->statusCode}: {$e->getMessage()}\n";
}
```

### Common Error Codes

| Status | Exception | When |
|---|---|---|
| 400 | `ValidationException` | Non-HTTPS URL, empty `urls`/`events` array, more than 10 URLs, invalid body |
| 401 | `AuthenticationException` | Missing or invalid API key |
| 403 | `AuthorizationException` | Valid key without administrator role |
| 404 | `NotFoundException` | Operating on a non-existent webhook |
| 409 | `ConflictException` | Creating when the signature webhook already exists |
| 429 | `RateLimitException` | Rate limit exceeded — back off |

## Runnable End-to-End Example

A complete, validated CRUD walkthrough lives in the SDK repo:

**[`packages/php-sdk/examples/turbowebhooks-crud.php`](https://github.com/TurboDocx/SDK/blob/main/packages/php-sdk/examples/turbowebhooks-crud.php)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend.

## Gotchas

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice returns `ConflictException` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `createWebhook` and `regenerateWebhookSecret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. Never `json_decode` first.
- **`replayWebhookDelivery` returns the full delivery row.** Earlier SDK versions documented a partial shape (`{id, httpStatus, message}`) — current versions return the complete `WebhookDelivery` object.
- **`testWebhook` summary now includes per-URL errors.** Check `$result['summary']['errors']` to see exactly which receiver failed and why.
- **`createWebhook` and `regenerateWebhookSecret` return data without a `message` field.** The success message lives at the response envelope and is extracted away by the SDK.
- **An empty array is not "no change".** On `updateWebhook`, `urls: []` and `events: []` are 400s, not no-ops. Omit the argument to leave the field alone.
- **`createWebhook` takes wire strings, not enum cases.** Pass `WebhookEvent::COMPLETED->value` — a bare `WebhookEvent::COMPLETED` case will not serialize to the right JSON. Use `WebhookEvent::all()` (or its alias `values()`) to get all 7 as strings in one call.
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `WebhookEvent::COMPLETED` to detect a finished document. See [Webhook Events](#webhook-events).
- **Use `WebhookEvent::tryFrom()` in receivers, not `from()`.** `from()` throws a `ValueError` on an event string the enum doesn't know — a new backend event would crash your receiver. `tryFrom()` returns `null` instead.

## See Also

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboSign PHP SDK](/docs/SDKs/php) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [TurboDocx SDK on Packagist](https://packagist.org/packages/turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
