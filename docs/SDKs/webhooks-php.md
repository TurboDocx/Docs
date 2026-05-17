---
title: TurboWebhooks PHP SDK
sidebar_position: 15
sidebar_label: "TurboWebhooks: PHP"
description: Official TurboDocx Webhooks SDK for PHP. Subscribe to signature.document.completed and signature.document.voided events, verify inbound webhook signatures with HMAC-SHA256, and manage delivery history programmatically.
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
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboWebhooks PHP SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbowebhooks" product="TurboWebhooks" />

The official TurboDocx Webhooks SDK for PHP applications. Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from PHP 8.1+. Available on Packagist as `turbodocx/sdk` (same package as TurboSign).

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications when signature documents complete or get voided, instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

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

## Quick Start

### 1. Create the signature webhook

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use TurboDocx\TurboWebhooks;
use TurboDocx\Config\HttpClientConfig;
use TurboDocx\Exceptions\ConflictException;
use TurboDocx\Exceptions\ValidationException;

TurboWebhooks::configure(HttpClientConfig::fromEnvironment());

try {
    $created = TurboWebhooks::createWebhook(
        urls: ['https://your-server.example.com/webhooks/turbodocx'],
        events: ['signature.document.completed', 'signature.document.voided'],
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
$created = TurboWebhooks::createWebhook(
    urls: ['https://your-server.example.com/webhooks/turbodocx'],
    events: ['signature.document.completed', 'signature.document.voided'],
);
```

| Throws | Why |
|---|---|
| `ConflictException` (409) | The signature webhook already exists for this org. |
| `ValidationException` (400) | A URL is not HTTPS, or `events` is empty. |
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
```

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

        match ($event['eventType']) {
            'signature.document.completed' => $this->onCompleted($event['data']),
            'signature.document.voided'    => $this->onVoided($event['data']),
            default                        => null,
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
| 400 | `ValidationException` | Non-HTTPS URL, empty events, invalid body |
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

## See Also

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboSign PHP SDK](/docs/SDKs/php) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all five languages
- [TurboDocx SDK on Packagist](https://packagist.org/packages/turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
