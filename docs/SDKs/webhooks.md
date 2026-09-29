---
title: TurboWebhooks SDK
sidebar_position: 15
sidebar_label: TurboWebhooks
description: 'TurboWebhooks SDK for JavaScript, TypeScript, Python, PHP, Go and Java: subscribe to TurboSign events, verify HMAC signatures, replay deliveries.'
keywords:
- turbodocx webhooks
- turbowebhooks javascript
- turbowebhooks typescript
- webhook javascript
- hmac signature verification javascript
- signature webhook node
- webhook receiver express
- express raw body webhook
- webhook secret typescript
- webhook events node
- webhookevents constants
- signature lifecycle events
- turbowebhooks python
- webhook python
- hmac signature verification python
- signature webhook flask
- signature webhook fastapi
- webhook receiver flask
- webhook receiver fastapi
- webhook secret python
- webhook events python
- webhook event constants python
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
- turbowebhooks go
- webhook go
- hmac signature verification go
- signature webhook nethttp
- signature webhook gin
- webhook receiver net/http
- webhook receiver gin
- webhook secret go
- webhook events go
- webhookevent constants go
- turbowebhooks java
- webhook java
- hmac signature verification java
- signature webhook spring boot
- signature webhook servlet
- webhook receiver spring
- webhook receiver servlet
- webhook secret java
- webhook events java
- webhookevent enum java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboWebhooks SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbowebhooks" product="TurboWebhooks" />

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

The official TurboDocx Webhooks SDK for Node.js applications (Express, Fastify, Next.js API routes, AWS Lambda, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Node 18+. Available on npm as `@turbodocx/sdk` (same package as TurboSign).

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

The official TurboDocx Webhooks SDK for Python applications (Flask, FastAPI, Django, AWS Lambda, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Python 3.9+. Distributed on PyPI as `turbodocx-sdk` (same package as TurboSign).

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

The official TurboDocx Webhooks SDK for PHP applications. Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from PHP 8.1+. Available on Packagist as `turbodocx/sdk` (same package as TurboSign).

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

The official TurboDocx Webhooks SDK for Go applications (net/http, Gin, Echo, Chi, AWS Lambda, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Go 1.21+. Distributed as `github.com/TurboDocx/SDK/packages/go-sdk` (same module as TurboSign).

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

The official TurboDocx Webhooks SDK for Java applications (Spring Boot, Servlet, Jakarta EE, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Java 11+. Distributed as `com.turbodocx:turbodocx-sdk` on Maven Central (same artifact as TurboSign).

</TabItem>
</Tabs>

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications across the whole signature lifecycle — sent, viewed, each recipient signing, partial progress, completed, voided, and finalization failures — instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

For the full conceptual overview of how webhooks work in TurboSign (delivery retries, payload schema, dashboard UI), see [TurboSign → Webhooks](/docs/TurboSign/Webhooks).
:::

## Installation {#installation}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs>
<TabItem value="npm" label="npm">

```bash
npm install @turbodocx/sdk
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @turbodocx/sdk
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @turbodocx/sdk
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

<Tabs>
<TabItem value="pip" label="pip">

```bash
pip install turbodocx-sdk
```

</TabItem>
<TabItem value="poetry" label="poetry">

```bash
poetry add turbodocx-sdk
```

</TabItem>
<TabItem value="pipenv" label="pipenv">

```bash
pipenv install turbodocx-sdk
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```bash
composer require turbodocx/sdk
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

Then import:

```go
import turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

<Tabs>
<TabItem value="maven" label="Maven">

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>turbodocx-sdk</artifactId>
    <version>0.7.0</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle">

```groovy
implementation 'com.turbodocx:turbodocx-sdk:0.7.0'
```

</TabItem>
<TabItem value="gradle-kts" label="Gradle (Kotlin DSL)">

```kotlin
implementation("com.turbodocx:turbodocx-sdk:0.7.0")
```

</TabItem>
</Tabs>

Then import:

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.TurboWebhooks;
import com.turbodocx.TurboDocxException;
import com.turbodocx.WebhookSignatureVerifier;
```

</TabItem>
</Tabs>

## Requirements {#requirements}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

- Node.js 18 or higher (native `fetch` + `crypto.timingSafeEqual`)
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)
- Zero runtime dependencies — the SDK only uses Node built-ins

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

- Python 3.9 or higher
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)
- All SDK methods are `async` — call them from an `async def` (or wrap with `asyncio.run(...)` in synchronous contexts)

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

- PHP 8.1 or higher
- Composer 2.x
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

- Go 1.21 or higher
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)
- All client methods accept a `context.Context` — pass `context.Background()` for one-offs or the request context inside handlers

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

- Java 11 or higher
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)
- All TurboWebhooks methods return `com.google.gson.JsonObject` for forward compatibility — new server fields surface without an SDK upgrade

</TabItem>
</Tabs>

## Configuration {#configuration}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
import { TurboWebhooks } from '@turbodocx/sdk';

TurboWebhooks.configure({
  apiKey: process.env.TURBODOCX_API_KEY!,
  orgId: process.env.TURBODOCX_ORG_ID!,
});
```

`skipSenderValidation: true` is hardcoded inside `TurboWebhooks.configure()` because webhooks don't send email — only TurboSign needs `senderEmail`. If you skip the explicit call, the SDK lazily configures itself from `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` on first method invocation.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
import os
from turbodocx_sdk import TurboWebhooks

TurboWebhooks.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"],
)
```

`skip_sender_validation=True` is hardcoded inside `TurboWebhooks.configure()` because webhooks don't send email — only TurboSign needs `sender_email`. If you skip the explicit call, the SDK lazily configures itself from `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` on first method invocation.

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
<?php
use TurboDocx\TurboWebhooks;

TurboWebhooks::configureFromCredentials(
    apiKey: $_ENV['TURBODOCX_API_KEY'],
    orgId: $_ENV['TURBODOCX_ORG_ID'],
);
```

`configureFromCredentials()` is the preferred entry point for webhooks — it builds the `HttpClientConfig` for you with `skipSenderValidation: true`.

Or skip configuration entirely and let the SDK auto-initialize from the environment variables below on the first call:

```php
// No configure() call needed — TURBODOCX_API_KEY and TURBODOCX_ORG_ID are read
// on first use. Missing either one raises a RuntimeException naming both.
$webhook = TurboWebhooks::getWebhook();
```

If you need to build the config yourself, pass `skipSenderValidation: true` — webhooks never send email, and `HttpClientConfig` otherwise throws `ValidationException` demanding a `senderEmail`:

```php
use TurboDocx\Config\HttpClientConfig;

TurboWebhooks::configure(new HttpClientConfig(
    apiKey: $_ENV['TURBODOCX_API_KEY'],
    orgId: $_ENV['TURBODOCX_ORG_ID'],
    skipSenderValidation: true,  // webhooks don't send email
));
```

:::warning `HttpClientConfig::fromEnvironment()` needs a sender email
`fromEnvironment()` does **not** set `skipSenderValidation`, so it throws `ValidationException` unless `TURBODOCX_SENDER_EMAIL` is also exported. For webhooks, use `configureFromCredentials()` or the auto-initialization path above instead.
:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.TurboWebhooks;

TurboWebhooks webhooks = new TurboDocxClient.Builder()
    .apiKey(System.getenv("TURBODOCX_API_KEY"))
    .orgId(System.getenv("TURBODOCX_ORG_ID"))
    .buildWebhooksClient();
```

`buildWebhooksClient()` does **not** require `senderEmail` — webhook routes don't send email, so the sender validation that `build()` enforces for TurboSign is skipped here. The returned `TurboWebhooks` is an admin-scoped client; construct once and reuse.

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role throws `TurboDocxException.AuthorizationException` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

</TabItem>
</Tabs>

### Environment Variables {#environment-variables}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```bash
TURBODOCX_API_KEY=your_admin_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
# store the secret returned by createWebhook so your receiver can verify signatures
TURBODOCX_WEBHOOK_SECRET=whsec_...
```

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role will throw `AuthorizationError` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```bash
TURBODOCX_API_KEY=your_admin_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
# store the secret returned by create_webhook so your receiver can verify signatures
TURBODOCX_WEBHOOK_SECRET=whsec_...
```

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role will raise `AuthorizationError` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```bash
TURBODOCX_API_KEY=your_admin_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
# store the secret returned by createWebhook so your receiver can verify signatures
TURBODOCX_WEBHOOK_SECRET=whsec_...
```

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role throws `TurboDocxException.AuthorizationException` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

</TabItem>
</Tabs>

## Webhook Events {#webhook-events}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

TurboSign dispatches **seven** events. Subscribe to any subset — `events` requires at least one.

| Event | Constant | Fires when |
|---|---|---|
| `signature.document.sent` | `WebhookEvents.SENT` | The document is dispatched to recipients |
| `signature.document.viewed` | `WebhookEvents.VIEWED` | A recipient opens the document for the first time |
| `signature.document.recipient_signed` | `WebhookEvents.RECIPIENT_SIGNED` | Any individual signer completes their signature — fires **once per signer**, including the last |
| `signature.document.signed` | `WebhookEvents.SIGNED` | A signer signs and the document is **not yet complete** (document-level partial progress) |
| `signature.document.completed` | `WebhookEvents.COMPLETED` | All recipients have signed and the signed PDF is finalized |
| `signature.document.finalization_failed` | `WebhookEvents.FINALIZATION_FAILED` | The signed PDF fails to finalize (e.g. a KMS signing error); the document is **not** completed |
| `signature.document.voided` | `WebhookEvents.VOIDED` | The document is voided or cancelled |

:::danger `signed` does not mean "the document is done"
`recipient_signed` is the **per-person** event: it fires once for **every** signer (including the last) and carries the signer's identity plus `is_final_signer` and `remaining_signers`.

`signed` is a document-level **partial-progress** event. On each signature `recipient_signed` fires first, then exactly one of `signed` (signers still remain), `completed` (that was the final signature and finalization succeeded), or `finalization_failed` (final signature, finalization failed). Two consequences:

- **`signed` never fires on the final signature.**
- **A single-signer document never emits `signed` at all** — it emits `recipient_signed` (`is_final_signer: true`) then `completed`.

To detect "the whole document is done", use `completed` (or `recipient_signed` with `is_final_signer: true`) — never `signed`.

See [TurboSign → Webhooks](/docs/TurboSign/Webhooks) for the full payload schemas and the lifecycle diagram.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

TurboSign dispatches **seven** events. Subscribe to any subset — `events` requires at least one.

| Event | Constant | Fires when |
|---|---|---|
| `signature.document.sent` | `WEBHOOK_EVENT_SENT` | The document is dispatched to recipients |
| `signature.document.viewed` | `WEBHOOK_EVENT_VIEWED` | A recipient opens the document for the first time |
| `signature.document.recipient_signed` | `WEBHOOK_EVENT_RECIPIENT_SIGNED` | Any individual signer completes their signature — fires **once per signer**, including the last |
| `signature.document.signed` | `WEBHOOK_EVENT_SIGNED` | A signer signs and the document is **not yet complete** (document-level partial progress) |
| `signature.document.completed` | `WEBHOOK_EVENT_COMPLETED` | All recipients have signed and the signed PDF is finalized |
| `signature.document.finalization_failed` | `WEBHOOK_EVENT_FINALIZATION_FAILED` | The signed PDF fails to finalize (e.g. a KMS signing error); the document is **not** completed |
| `signature.document.voided` | `WEBHOOK_EVENT_VOIDED` | The document is voided or cancelled |

:::danger `signed` does not mean "the document is done"
`recipient_signed` is the **per-person** event: it fires once for **every** signer (including the last) and carries the signer's identity plus `is_final_signer` and `remaining_signers`.

`signed` is a document-level **partial-progress** event. On each signature `recipient_signed` fires first, then exactly one of `signed` (signers still remain), `completed` (that was the final signature and finalization succeeded), or `finalization_failed` (final signature, finalization failed). Two consequences:

- **`signed` never fires on the final signature.**
- **A single-signer document never emits `signed` at all** — it emits `recipient_signed` (`is_final_signer: True`) then `completed`.

To detect "the whole document is done", use `completed` (or `recipient_signed` with `is_final_signer: True`) — never `signed`.

See [TurboSign → Webhooks](/docs/TurboSign/Webhooks) for the full payload schemas and the lifecycle diagram.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

TurboSign dispatches **seven** events. Subscribe to any subset — `Events` requires at least one.

| Event | Constant | Fires when |
|---|---|---|
| `signature.document.sent` | `turbodocx.WebhookEventSent` | The document is dispatched to recipients |
| `signature.document.viewed` | `turbodocx.WebhookEventViewed` | A recipient opens the document for the first time |
| `signature.document.recipient_signed` | `turbodocx.WebhookEventRecipientSigned` | Any individual signer completes their signature — fires **once per signer**, including the last |
| `signature.document.signed` | `turbodocx.WebhookEventSigned` | A signer signs and the document is **not yet complete** (document-level partial progress) |
| `signature.document.completed` | `turbodocx.WebhookEventCompleted` | All recipients have signed and the signed PDF is finalized |
| `signature.document.finalization_failed` | `turbodocx.WebhookEventFinalizationFailed` | The signed PDF fails to finalize (e.g. a KMS signing error); the document is **not** completed |
| `signature.document.voided` | `turbodocx.WebhookEventVoided` | The document is voided or cancelled |

:::danger `signed` does not mean "the document is done"
`recipient_signed` is the **per-person** event: it fires once for **every** signer (including the last) and carries the signer's identity plus `is_final_signer` and `remaining_signers`.

`signed` is a document-level **partial-progress** event. On each signature `recipient_signed` fires first, then exactly one of `signed` (signers still remain), `completed` (that was the final signature and finalization succeeded), or `finalization_failed` (final signature, finalization failed). Two consequences:

- **`signed` never fires on the final signature.**
- **A single-signer document never emits `signed` at all** — it emits `recipient_signed` (`is_final_signer: true`) then `completed`.

To detect "the whole document is done", use `completed` (or `recipient_signed` with `is_final_signer: true`) — never `signed`.

See [TurboSign → Webhooks](/docs/TurboSign/Webhooks) for the full payload schemas and the lifecycle diagram.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

TurboSign dispatches **seven** events. Subscribe to any subset — the events list requires at least one.

| Event | Enum constant | Fires when |
|---|---|---|
| `signature.document.sent` | `WebhookEvent.SENT` | The document is dispatched to recipients |
| `signature.document.viewed` | `WebhookEvent.VIEWED` | A recipient opens the document for the first time |
| `signature.document.recipient_signed` | `WebhookEvent.RECIPIENT_SIGNED` | Any individual signer completes their signature — fires **once per signer**, including the last |
| `signature.document.signed` | `WebhookEvent.SIGNED` | A signer signs and the document is **not yet complete** (document-level partial progress) |
| `signature.document.completed` | `WebhookEvent.COMPLETED` | All recipients have signed and the signed PDF is finalized |
| `signature.document.finalization_failed` | `WebhookEvent.FINALIZATION_FAILED` | The signed PDF fails to finalize (e.g. a KMS signing error); the document is **not** completed |
| `signature.document.voided` | `WebhookEvent.VOIDED` | The document is voided or cancelled |

:::danger `signed` does not mean "the document is done"
`recipient_signed` is the **per-person** event: it fires once for **every** signer (including the last) and carries the signer's identity plus `is_final_signer` and `remaining_signers`.

`signed` is a document-level **partial-progress** event. On each signature `recipient_signed` fires first, then exactly one of `signed` (signers still remain), `completed` (that was the final signature and finalization succeeded), or `finalization_failed` (final signature, finalization failed). Two consequences:

- **`signed` never fires on the final signature.**
- **A single-signer document never emits `signed` at all** — it emits `recipient_signed` (`is_final_signer: true`) then `completed`.

To detect "the whole document is done", use `completed` (or `recipient_signed` with `is_final_signer: true`) — never `signed`.

See [TurboSign → Webhooks](/docs/TurboSign/Webhooks) for the full payload schemas and the lifecycle diagram.
:::

</TabItem>
</Tabs>

### Event constants {#event-constants}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

The SDK exports the events as first-class symbols, so a typo is a compile error rather than a webhook that silently never fires.

```typescript
import {
  TurboWebhooks,
  WebhookEvents,      // const object — WebhookEvents.COMPLETED, .VOIDED, ...
  WEBHOOK_EVENTS,     // readonly array of all 7, in lifecycle order
  type WebhookEvent,  // the event type
} from '@turbodocx/sdk';

// Subscribe to a chosen subset
await TurboWebhooks.createWebhook({
  urls: ['https://your-server.example.com/webhooks/turbodocx'],
  events: [
    WebhookEvents.SENT,
    WebhookEvents.VIEWED,
    WebhookEvents.RECIPIENT_SIGNED,
    WebhookEvents.COMPLETED,
    WebhookEvents.FINALIZATION_FAILED,
    WebhookEvents.VOIDED,
  ],
});

// ...or to everything TurboSign emits (spread — WEBHOOK_EVENTS is readonly)
await TurboWebhooks.createWebhook({
  urls: ['https://your-server.example.com/webhooks/turbodocx'],
  events: [...WEBHOOK_EVENTS],
});

// Raw strings still work — WebhookEvent is `KnownWebhookEvent | (string & {})`,
// so you get autocomplete on the 7 known events without the union being closed.
const event: WebhookEvent = 'signature.document.completed';
```

:::note Raw strings still work
Nothing was narrowed. `events` still accepts plain strings, so existing code keeps compiling and the backend can add new events without an SDK release. The constants exist for discoverability and type safety. `getWebhook()` also returns `availableEvents` — the list the backend advertises at runtime.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

The SDK exports the events as module-level constants, so a typo is caught at import time (and by your type checker) rather than becoming a webhook that silently never fires.

```python
from turbodocx_sdk import (
    TurboWebhooks,
    WEBHOOK_EVENTS,                      # tuple of all 7, in lifecycle order
    WEBHOOK_EVENT_SENT,
    WEBHOOK_EVENT_VIEWED,
    WEBHOOK_EVENT_RECIPIENT_SIGNED,
    WEBHOOK_EVENT_SIGNED,
    WEBHOOK_EVENT_COMPLETED,
    WEBHOOK_EVENT_FINALIZATION_FAILED,
    WEBHOOK_EVENT_VOIDED,
    WebhookEvent,                        # Literal type of the 7 known events
)

# Subscribe to a chosen subset
await TurboWebhooks.create_webhook(
    urls=["https://your-server.example.com/webhooks/turbodocx"],
    events=[
        WEBHOOK_EVENT_SENT,
        WEBHOOK_EVENT_VIEWED,
        WEBHOOK_EVENT_RECIPIENT_SIGNED,
        WEBHOOK_EVENT_COMPLETED,
        WEBHOOK_EVENT_FINALIZATION_FAILED,
        WEBHOOK_EVENT_VOIDED,
    ],
)

# ...or to everything TurboSign emits
await TurboWebhooks.create_webhook(
    urls=["https://your-server.example.com/webhooks/turbodocx"],
    events=list(WEBHOOK_EVENTS),
)

# WebhookEvent is a Literal — useful for annotating your own dispatch code.
event: WebhookEvent = WEBHOOK_EVENT_COMPLETED
```

:::note Raw strings still work
Nothing was narrowed. `events` still accepts plain strings (`"signature.document.completed"`), so existing code keeps running and the backend can add new events without an SDK release. The constants exist for discoverability and type safety. `get_webhook()` also returns `availableEvents` — the list the backend advertises at runtime.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

The SDK exports the events as a typed `turbodocx.WebhookEvent` string type, plus `turbodocx.AllWebhookEvents` (a `[]WebhookEvent` holding all 7 in lifecycle order).

:::warning `WebhookEvent` is not a `string` — convert it
`CreateWebhookRequest.Events` and `UpdateWebhookRequest.Events` are `[]string`, and Go will **not** implicitly assign `[]WebhookEvent` (or a `WebhookEvent`) into them — that's a compile error. Convert with `turbodocx.WebhookEventStrings(...)`, or `string(event)` for a single value.
:::

```go
import turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"

// Subscribe to a chosen subset — WebhookEventStrings turns typed events into []string.
created, err := wh.CreateWebhook(ctx, turbodocx.CreateWebhookRequest{
    URLs: []string{"https://your-server.example.com/webhooks/turbodocx"},
    Events: turbodocx.WebhookEventStrings(
        turbodocx.WebhookEventSent,
        turbodocx.WebhookEventViewed,
        turbodocx.WebhookEventRecipientSigned,
        turbodocx.WebhookEventCompleted,
        turbodocx.WebhookEventFinalizationFailed,
        turbodocx.WebhookEventVoided,
    ),
})

// ...or to everything TurboSign emits — spread AllWebhookEvents.
created, err = wh.CreateWebhook(ctx, turbodocx.CreateWebhookRequest{
    URLs:   []string{"https://your-server.example.com/webhooks/turbodocx"},
    Events: turbodocx.WebhookEventStrings(turbodocx.AllWebhookEvents...),
})

// Single value: use String() (or a string(...) conversion) — e.g. for TestWebhook.
result, err := wh.TestWebhook(ctx, turbodocx.TestWebhookRequest{
    EventType: turbodocx.WebhookEventCompleted.String(),
    Payload:   map[string]interface{}{"documentId": "..."},
})
```

:::note Raw strings still work
Nothing was narrowed. `Events` is still `[]string`, so existing code that passes `[]string{"signature.document.completed"}` keeps compiling and the backend can add new events without an SDK release. The constants exist for discoverability and type safety. `GetWebhook()` also returns `availableEvents` — the list the backend advertises at runtime.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

The events ship as the `com.turbodocx.WebhookEvent` enum. `createWebhook` takes a `List<String>` of wire strings, so pass `getValue()` (or `allValues()`).

```java
import com.turbodocx.WebhookEvent;
import com.google.gson.JsonObject;
import java.util.Arrays;
import java.util.List;

// Subscribe to a chosen subset — getValue() gives the wire string.
JsonObject created = webhooks.createWebhook(
    Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),
    Arrays.asList(
        WebhookEvent.SENT.getValue(),
        WebhookEvent.VIEWED.getValue(),
        WebhookEvent.RECIPIENT_SIGNED.getValue(),
        WebhookEvent.COMPLETED.getValue(),
        WebhookEvent.FINALIZATION_FAILED.getValue(),
        WebhookEvent.VOIDED.getValue()
    )
);

// ...or to everything TurboSign emits.
JsonObject all = webhooks.createWebhook(
    Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),
    WebhookEvent.allValues()   // List<String> — all 7 wire strings, lifecycle order
);

// Single value, e.g. for testWebhook / listWebhookDeliveries:
webhooks.testWebhook(WebhookEvent.COMPLETED.getValue(), payload);
```

:::note Raw strings still work
Nothing was narrowed. The events list is still `List<String>`, so existing code keeps compiling and the backend can add new events without an SDK release. The enum exists for discoverability and type safety. `getWebhook()` also returns `availableEvents` — the list the backend advertises at runtime.
:::

</TabItem>
</Tabs>

### Delivered payload shape {#delivered-payload-shape}

Every delivery posts this envelope:

```json
{
  "event": "signature.document.completed",
  "event_id": "evt_a1b2c3…",
  "created_at": "2026-01-15T10:30:00.000Z",
  "version": "1.0",
  "data": { "documentId": "…", "documentName": "…" }
}
```

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

:::warning Dispatch on `event`, not `eventType`

The event name travels in the top-level **`event`** field. There is no `eventType` key on the
wire — a receiver written against it reads `undefined` and silently dispatches nothing, which
looks exactly like "the webhook never fired".

`eventType` **is** correct in two other places, which is where the confusion comes from: it is
the request parameter name for `testWebhook` and `listWebhookDeliveries`, and it is the column name on
the stored delivery-history rows those return. Those are not the delivered envelope.

:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

:::warning Dispatch on `event`, not `eventType`

The event name travels in the top-level **`event`** field. There is no `eventType` key on the
wire — a receiver written against it reads a `KeyError` and silently dispatches nothing, which
looks exactly like "the webhook never fired".

`eventType` **is** correct in two other places, which is where the confusion comes from: it is
the request parameter name for `test_webhook` and `list_webhook_deliveries`, and it is the column name on
the stored delivery-history rows those return. Those are not the delivered envelope.

:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

:::warning Dispatch on `event`, not `eventType`

The event name travels in the top-level **`event`** field. There is no `eventType` key on the
wire — a receiver written against it reads `null` and silently dispatches nothing, which
looks exactly like "the webhook never fired".

`eventType` **is** correct in two other places, which is where the confusion comes from: it is
the request parameter name for `testWebhook` and `listWebhookDeliveries`, and it is the column name on
the stored delivery-history rows those return. Those are not the delivered envelope.

:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

:::warning Dispatch on `event`, not `eventType`

The event name travels in the top-level **`event`** field. There is no `eventType` key on the
wire — a receiver written against it reads the zero value and silently dispatches nothing, which
looks exactly like "the webhook never fired".

`eventType` **is** correct in two other places, which is where the confusion comes from: it is
the request parameter name for `TestWebhook` and `ListWebhookDeliveries`, and it is the column name on
the stored delivery-history rows those return. Those are not the delivered envelope.

:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

:::warning Dispatch on `event`, not `eventType`

The event name travels in the top-level **`event`** field. There is no `eventType` key on the
wire — a receiver written against it reads `null` and silently dispatches nothing, which
looks exactly like "the webhook never fired".

`eventType` **is** correct in two other places, which is where the confusion comes from: it is
the request parameter name for `testWebhook` and `listWebhookDeliveries`, and it is the column name on
the stored delivery-history rows those return. Those are not the delivered envelope.

:::

</TabItem>
</Tabs>

## Quick Start {#quick-start}

### 1. Create the signature webhook {#1-create-the-signature-webhook}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
import {
  TurboWebhooks,
  WebhookEvents,
  ConflictError,
  ValidationError,
} from '@turbodocx/sdk';
import { writeFileSync } from 'node:fs';

TurboWebhooks.configure({
  apiKey: process.env.TURBODOCX_API_KEY!,
  orgId: process.env.TURBODOCX_ORG_ID!,
});

try {
  const created = await TurboWebhooks.createWebhook({
    urls: ['https://your-server.example.com/webhooks/turbodocx'],
    events: [
      WebhookEvents.SENT,
      WebhookEvents.VIEWED,
      WebhookEvents.RECIPIENT_SIGNED,
      WebhookEvents.COMPLETED,
      WebhookEvents.FINALIZATION_FAILED,
      WebhookEvents.VOIDED,
    ],
  });

  // SAVE THIS SECRET — it is shown ONCE and cannot be retrieved later.
  writeFileSync('.secret', created.secret, { mode: 0o600 });
  console.log(`Created webhook id=${created.id}`);
} catch (e) {
  if (e instanceof ConflictError) {
    // 409 — the signature webhook already exists for this org.
    // Use TurboWebhooks.updateWebhook(...) or .deleteWebhook() instead.
    console.log('Webhook already exists. Use updateWebhook or deleteWebhook.');
  } else if (e instanceof ValidationError) {
    // 400 — most commonly a non-HTTPS URL or empty events array.
    console.log(`Validation failed: ${e.message}`);
  } else {
    throw e;
  }
}
```

:::warning HTTPS only
TurboDocx rejects non-HTTPS webhook URLs with HTTP 400. For local development, expose your receiver via an HTTPS tunnel ([ngrok](https://ngrok.com), [cloudflared](https://github.com/cloudflare/cloudflared), or [webhook.site](https://webhook.site)) and pass the tunnel URL to `createWebhook`.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
import asyncio
import os
from turbodocx_sdk import (
    TurboWebhooks,
    ConflictError,
    ValidationError,
    WEBHOOK_EVENT_SENT,
    WEBHOOK_EVENT_VIEWED,
    WEBHOOK_EVENT_RECIPIENT_SIGNED,
    WEBHOOK_EVENT_COMPLETED,
    WEBHOOK_EVENT_FINALIZATION_FAILED,
    WEBHOOK_EVENT_VOIDED,
)


async def setup_webhook():
    TurboWebhooks.configure(
        api_key=os.environ["TURBODOCX_API_KEY"],
        org_id=os.environ["TURBODOCX_ORG_ID"],
    )

    try:
        created = await TurboWebhooks.create_webhook(
            urls=["https://your-server.example.com/webhooks/turbodocx"],
            events=[
                WEBHOOK_EVENT_SENT,
                WEBHOOK_EVENT_VIEWED,
                WEBHOOK_EVENT_RECIPIENT_SIGNED,
                WEBHOOK_EVENT_COMPLETED,
                WEBHOOK_EVENT_FINALIZATION_FAILED,
                WEBHOOK_EVENT_VOIDED,
            ],
        )
        # SAVE THIS SECRET — it is shown ONCE and cannot be retrieved later.
        with open(".secret", "w") as f:
            f.write(created["secret"])
        os.chmod(".secret", 0o600)
        print(f"Created webhook id={created['id']}")
    except ConflictError:
        # 409 — the signature webhook already exists for this org.
        # Use TurboWebhooks.update_webhook(...) or .delete_webhook() instead.
        print("Webhook already exists. Use update_webhook or delete_webhook.")
    except ValidationError as e:
        # 400 — most commonly a non-HTTPS URL or empty events array.
        print(f"Validation failed: {e}")


asyncio.run(setup_webhook())
```

:::warning HTTPS only
TurboDocx rejects non-HTTPS webhook URLs with HTTP 400. For local development, expose your receiver via an HTTPS tunnel ([ngrok](https://ngrok.com), [cloudflared](https://github.com/cloudflare/cloudflared), or [webhook.site](https://webhook.site)) and pass the tunnel URL to `create_webhook`.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use TurboDocx\TurboWebhooks;
use TurboDocx\Exceptions\ConflictException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Types\Enums\WebhookEvent;

TurboWebhooks::configureFromCredentials(
    apiKey: $_ENV['TURBODOCX_API_KEY'],
    orgId: $_ENV['TURBODOCX_ORG_ID'],
);

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

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
        URLs: []string{"https://your-server.example.com/webhooks/turbodocx"},
        // Events is []string — WebhookEventStrings converts the typed constants.
        Events: turbodocx.WebhookEventStrings(
            turbodocx.WebhookEventSent,
            turbodocx.WebhookEventViewed,
            turbodocx.WebhookEventRecipientSigned,
            turbodocx.WebhookEventCompleted,
            turbodocx.WebhookEventFinalizationFailed,
            turbodocx.WebhookEventVoided,
        ),
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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.TurboDocxException;
import com.turbodocx.TurboWebhooks;
import com.turbodocx.WebhookEvent;
import com.google.gson.JsonObject;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

public class CreateSignatureWebhook {
    public static void main(String[] args) throws Exception {
        TurboWebhooks webhooks = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .buildWebhooksClient();

        try {
            JsonObject created = webhooks.createWebhook(
                Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),
                Arrays.asList(
                    WebhookEvent.SENT.getValue(),
                    WebhookEvent.VIEWED.getValue(),
                    WebhookEvent.RECIPIENT_SIGNED.getValue(),
                    WebhookEvent.COMPLETED.getValue(),
                    WebhookEvent.FINALIZATION_FAILED.getValue(),
                    WebhookEvent.VOIDED.getValue()
                )
            );

            // SAVE THIS SECRET — it is shown ONCE and cannot be retrieved later.
            Files.writeString(Paths.get(".secret"), created.get("secret").getAsString());
            System.out.println("Created webhook id=" + created.get("id").getAsString());

        } catch (TurboDocxException.ConflictException e) {
            // 409 — the signature webhook already exists for this org.
            // Use updateWebhook or deleteWebhook instead.
            System.out.println("Webhook already exists. Use updateWebhook or deleteWebhook.");
        } catch (TurboDocxException.ValidationException e) {
            // 400 — most commonly a non-HTTPS URL or empty events list.
            System.err.println("Validation failed: " + e.getMessage());
        }
    }
}
```

:::warning HTTPS only
TurboDocx rejects non-HTTPS webhook URLs with HTTP 400. For local development, expose your receiver via an HTTPS tunnel ([ngrok](https://ngrok.com), [cloudflared](https://github.com/cloudflare/cloudflared), or [webhook.site](https://webhook.site)) and pass the tunnel URL to `createWebhook`.
:::

</TabItem>
</Tabs>

### 2. Verify inbound webhook signatures {#2-verify-inbound-webhook-signatures}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

When TurboDocx POSTs to your receiver, every request carries an `X-TurboDocx-Signature` header. Verify it before trusting the payload — the helper enforces a 300-second timestamp tolerance and uses `crypto.timingSafeEqual` for constant-time comparison.

```typescript
import express from 'express';
import { verifyWebhookSignature } from '@turbodocx/sdk';

const app = express();

// IMPORTANT: use express.raw — the signature is computed over raw bytes.
// express.json() will mangle whitespace and break verification.
app.post(
  '/webhooks/turbodocx',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const signature = req.header('x-turbodocx-signature') ?? '';
    const timestamp = req.header('x-turbodocx-timestamp') ?? '';
    const secret = process.env.TURBODOCX_WEBHOOK_SECRET!;

    if (!verifyWebhookSignature(req.body, signature, timestamp, secret)) {
      return res.status(401).send('Invalid signature');
    }

    const event = JSON.parse((req.body as Buffer).toString('utf8'));
    // process event.event, event.data, ... (NOT event.eventType — not on the wire)

    res.status(200).send('ok');
  },
);
```

:::danger Use the raw request body
The HMAC is computed over the **exact bytes** that left the TurboDocx server. Never `JSON.parse` and re-stringify before verifying — re-encoded JSON will not byte-match and verification will fail. Use `express.raw()`, Fastify's `rawBody` option, or Next.js Edge's `await request.text()`.
:::

The signature contract:

| Field | Value |
|---|---|
| Header | `X-TurboDocx-Signature: sha256=<hex>` |
| Timestamp header | `X-TurboDocx-Timestamp: <unix-seconds>` |
| Signed string | `${timestamp}.${rawBody}` |
| Algorithm | HMAC-SHA256 |
| Tolerance | 300 seconds (configurable) |
| Comparison | `crypto.timingSafeEqual` (constant-time) |

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

When TurboDocx POSTs to your receiver, every request carries an `X-TurboDocx-Signature` header. Verify it before trusting the payload — the helper enforces a 300-second timestamp tolerance and uses `hmac.compare_digest` for constant-time comparison.

<Tabs>
<TabItem value="flask" label="Flask">

```python
import json
import os
from flask import Flask, request, abort
from turbodocx_sdk import verify_webhook_signature

app = Flask(__name__)

@app.post("/webhooks/turbodocx")
def turbodocx_webhook():
    # IMPORTANT: read raw bytes — the signature is computed over them.
    # request.get_json() will mangle whitespace and break verification.
    raw_body = request.get_data()
    signature = request.headers.get("X-TurboDocx-Signature", "")
    timestamp = request.headers.get("X-TurboDocx-Timestamp", "")
    secret = os.environ["TURBODOCX_WEBHOOK_SECRET"]

    if not verify_webhook_signature(raw_body, signature, timestamp, secret):
        abort(401, "Invalid signature")

    event = json.loads(raw_body)
    # process event["event"], event["data"], ... (NOT "eventType" — not on the wire)
    return ("ok", 200)
```

</TabItem>
<TabItem value="fastapi" label="FastAPI">

```python
import json
import os
from fastapi import FastAPI, Request, HTTPException
from turbodocx_sdk import verify_webhook_signature

app = FastAPI()

@app.post("/webhooks/turbodocx")
async def turbodocx_webhook(request: Request):
    # IMPORTANT: read raw bytes — the signature is computed over them.
    # await request.json() will mangle whitespace and break verification.
    raw_body = await request.body()
    signature = request.headers.get("x-turbodocx-signature", "")
    timestamp = request.headers.get("x-turbodocx-timestamp", "")
    secret = os.environ["TURBODOCX_WEBHOOK_SECRET"]

    if not verify_webhook_signature(raw_body, signature, timestamp, secret):
        raise HTTPException(status_code=401, detail="Invalid signature")

    event = json.loads(raw_body)
    # process event["event"], event["data"], ... (NOT "eventType" — not on the wire)
    return {"ok": True}
```

</TabItem>
</Tabs>

:::danger Use the raw request body
The HMAC is computed over the **exact bytes** that left the TurboDocx server. Never call `json.loads(...)` and re-serialize before verifying — re-encoded JSON will not byte-match and verification will fail. Use Flask's `request.get_data()`, FastAPI's `await request.body()`, or Django's `request.body`.
:::

The signature contract:

| Field | Value |
|---|---|
| Header | `X-TurboDocx-Signature: sha256=<hex>` |
| Timestamp header | `X-TurboDocx-Timestamp: <unix-seconds>` |
| Signed string | `f"{timestamp}.{raw_body}"` |
| Algorithm | HMAC-SHA256 |
| Tolerance | 300 seconds (configurable) |
| Comparison | `hmac.compare_digest` (constant-time) |

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
// process $event['event'], $event['data'], ... (NOT 'eventType' — not on the wire)

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

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

    // Now safe to json.Unmarshal(rawBody, &event) and dispatch on the top-level
    // `event` field (tag it `json:"event"`) — NOT `eventType`, which is not on the wire.
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

        // dispatch event["event"] ... (NOT "eventType" — not on the wire)
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

        // dispatch event["event"] ... (NOT "eventType" — not on the wire)
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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

When TurboDocx POSTs to your receiver, every request carries an `X-TurboDocx-Signature` header. Verify it before trusting the payload — the helper enforces a 300-second timestamp tolerance and uses `MessageDigest.isEqual` for constant-time comparison.

Java has no free functions, so the helper is exposed as `WebhookSignatureVerifier.verify(...)` — a static method on a final utility class. Semantically equivalent to the free-function form in JS / Py / Go / PHP.

<Tabs>
<TabItem value="spring-boot" label="Spring Boot">

```java
package com.example.webhooks;

import com.turbodocx.WebhookSignatureVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TurboDocxWebhookController {

    @Value("${turbodocx.webhook.secret}")
    private String secret;

    // IMPORTANT: bind to byte[], not a parsed DTO. The signature is computed
    // over raw bytes — Jackson would re-serialize and whitespace mismatch
    // breaks HMAC verification.
    @PostMapping(value = "/webhooks/turbodocx", consumes = "application/json")
    public ResponseEntity<Void> receive(
            @RequestBody byte[] rawBody,
            @RequestHeader("X-TurboDocx-Signature") String signature,
            @RequestHeader("X-TurboDocx-Timestamp") String timestamp) {

        if (!WebhookSignatureVerifier.verify(rawBody, signature, timestamp, secret)) {
            return ResponseEntity.status(401).build();
        }

        // Now safe to parse rawBody as JSON and dispatch on the top-level "event"
        // field — NOT "eventType", which is not on the wire.
        return ResponseEntity.ok().build();
    }
}
```

</TabItem>
<TabItem value="servlet" label="Servlet">

```java
package com.example.webhooks;

import com.turbodocx.WebhookSignatureVerifier;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/webhooks/turbodocx")
public class TurboDocxWebhookServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // IMPORTANT: read raw bytes — never call getReader() or getParameter*,
        // those decode and re-encode the payload and break HMAC verification.
        byte[] rawBody = req.getInputStream().readAllBytes();

        String signature = req.getHeader("X-TurboDocx-Signature");
        String timestamp = req.getHeader("X-TurboDocx-Timestamp");
        String secret = System.getenv("TURBODOCX_WEBHOOK_SECRET");

        if (!WebhookSignatureVerifier.verify(rawBody, signature, timestamp, secret)) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "invalid signature");
            return;
        }

        // dispatch on the top-level "event" field ... (NOT "eventType")
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
```

</TabItem>
<TabItem value="jakarta" label="Jakarta EE">

```java
package com.example.webhooks;

import com.turbodocx.WebhookSignatureVerifier;

import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/webhooks/turbodocx")
public class TurboDocxWebhookResource {

    // JAX-RS deserializes byte[] entities as the raw request body — exactly
    // what HMAC verification needs.
    @POST
    public Response receive(
            byte[] rawBody,
            @HeaderParam("X-TurboDocx-Signature") String signature,
            @HeaderParam("X-TurboDocx-Timestamp") String timestamp) {

        String secret = System.getenv("TURBODOCX_WEBHOOK_SECRET");

        if (!WebhookSignatureVerifier.verify(rawBody, signature, timestamp, secret)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        // dispatch on the top-level "event" field ... (NOT "eventType")
        return Response.ok().build();
    }
}
```

</TabItem>
</Tabs>

:::danger Use the raw request body
The HMAC is computed over the **exact bytes** that left the TurboDocx server. Never decode JSON into a DTO and re-serialize before verifying — re-encoded JSON will not byte-match and verification will fail. In Spring, bind to `@RequestBody byte[]`. In a Servlet, use `request.getInputStream().readAllBytes()`. In JAX-RS, declare a `byte[]` entity parameter.
:::

The signature contract:

| Field | Value |
|---|---|
| Header | `X-TurboDocx-Signature: sha256=<hex>` |
| Timestamp header | `X-TurboDocx-Timestamp: <unix-seconds>` |
| Signed string | `timestamp + "." + rawBody` |
| Algorithm | HMAC-SHA256 |
| Tolerance | 300 seconds (configurable via the 6-arg `verify` overload) |
| Comparison | `MessageDigest.isEqual` (constant-time) |

</TabItem>
</Tabs>

## Method Reference {#method-reference}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

All methods are static; configure once, then call on the `TurboWebhooks` class.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

All methods are `@classmethod`s on `TurboWebhooks`; configure once, then call on the class.

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

All methods are static; configure once, then call on the `TurboWebhooks` class.

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

All methods are instance methods on `*turbodocx.WebhooksClient`. Construct once, then reuse.

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

All methods are instance methods on `com.turbodocx.TurboWebhooks`. Construct once via `new TurboDocxClient.Builder()...buildWebhooksClient()` and reuse.

</TabItem>
</Tabs>

<a id="create_webhook"></a>

### createWebhook / create_webhook / CreateWebhook {#createwebhook}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Subscribe the org to events. Returns `{id, secret}` — the **secret is shown once**.

```typescript
import { WebhookEvents, WEBHOOK_EVENTS } from '@turbodocx/sdk';

const created = await TurboWebhooks.createWebhook({
  urls: ['https://your-server.example.com/webhooks/turbodocx'],
  events: [
    WebhookEvents.RECIPIENT_SIGNED,
    WebhookEvents.COMPLETED,
    WebhookEvents.FINALIZATION_FAILED,
    WebhookEvents.VOIDED,
  ],
  // or subscribe to all 7: events: [...WEBHOOK_EVENTS]
});
```

`urls` accepts **1 to 10** HTTPS URLs. `events` requires **at least 1** of the [seven events](#webhook-events) — raw strings and `WebhookEvents.*` constants are interchangeable. Both fields are required on create.

| Throws | Why |
|---|---|
| `ConflictError` (409) | The signature webhook already exists for this org. |
| `ValidationError` (400) | A URL is not HTTPS, `urls` is empty or has more than 10 entries, or `events` is empty. |
| `AuthorizationError` (403) | API key lacks the administrator role. |

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Subscribe the org to events. Returns a dict with `id` and `secret` — the **secret is shown once**.

```python
from turbodocx_sdk import (
    WEBHOOK_EVENTS,
    WEBHOOK_EVENT_RECIPIENT_SIGNED,
    WEBHOOK_EVENT_COMPLETED,
    WEBHOOK_EVENT_FINALIZATION_FAILED,
    WEBHOOK_EVENT_VOIDED,
)

created = await TurboWebhooks.create_webhook(
    urls=["https://your-server.example.com/webhooks/turbodocx"],
    events=[
        WEBHOOK_EVENT_RECIPIENT_SIGNED,
        WEBHOOK_EVENT_COMPLETED,
        WEBHOOK_EVENT_FINALIZATION_FAILED,
        WEBHOOK_EVENT_VOIDED,
    ],
    # or subscribe to all 7: events=list(WEBHOOK_EVENTS)
)
```

`urls` accepts **1 to 10** HTTPS URLs. `events` requires **at least 1** of the [seven events](#webhook-events) — raw strings and `WEBHOOK_EVENT_*` constants are interchangeable. Both are required on create.

| Raises | Why |
|---|---|
| `ConflictError` (409) | The signature webhook already exists for this org. |
| `ValidationError` (400) | A URL is not HTTPS, `urls` is empty or has more than 10 entries, or `events` is empty. |
| `AuthorizationError` (403) | API key lacks the administrator role. |

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Subscribe the org to events. Returns `*CreateWebhookResponse` with `ID` and `Secret` — the **secret is shown once**.

```go
created, err := wh.CreateWebhook(ctx, turbodocx.CreateWebhookRequest{
    URLs: []string{"https://your-server.example.com/webhooks/turbodocx"},
    Events: turbodocx.WebhookEventStrings(
        turbodocx.WebhookEventRecipientSigned,
        turbodocx.WebhookEventCompleted,
        turbodocx.WebhookEventFinalizationFailed,
        turbodocx.WebhookEventVoided,
    ),
    // or subscribe to all 7:
    // Events: turbodocx.WebhookEventStrings(turbodocx.AllWebhookEvents...),
})
```

`URLs` accepts **1 to 10** HTTPS URLs. `Events` requires **at least 1** of the [seven events](#webhook-events). `Events` is `[]string`, so raw strings still work — but a typed `turbodocx.WebhookEvent` must go through `WebhookEventStrings` (or `string(...)`) or it won't compile. Both fields are required on create.

| Error type | Why |
|---|---|
| `*ConflictError` (409) | The signature webhook already exists for this org. |
| `*ValidationError` (400) | A URL is not HTTPS, `URLs` is empty or has more than 10 entries, or `Events` is empty. |
| `*AuthorizationError` (403) | API key lacks the administrator role. |

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Subscribe the org to events. Returns a `JsonObject` with `id` and `secret` — the **secret is shown once**.

```java
import com.turbodocx.WebhookEvent;

JsonObject created = webhooks.createWebhook(
    Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),
    Arrays.asList(
        WebhookEvent.RECIPIENT_SIGNED.getValue(),
        WebhookEvent.COMPLETED.getValue(),
        WebhookEvent.FINALIZATION_FAILED.getValue(),
        WebhookEvent.VOIDED.getValue()
    )
);

// or subscribe to all 7:
// JsonObject created = webhooks.createWebhook(urls, WebhookEvent.allValues());
```

The URL list accepts **1 to 10** HTTPS URLs. The events list requires **at least 1** of the [seven events](#webhook-events), as wire strings — raw strings and `WebhookEvent.*.getValue()` are interchangeable. Both are required on create.

| Exception | Why |
|---|---|
| `TurboDocxException.ConflictException` (409) | The signature webhook already exists for this org. |
| `TurboDocxException.ValidationException` (400) | A URL is not HTTPS, the URL list is empty or has more than 10 entries, or the events list is empty. |
| `TurboDocxException.AuthorizationException` (403) | API key lacks the administrator role. |

</TabItem>
</Tabs>

<a id="get_webhook"></a>

### getWebhook / get_webhook / GetWebhook {#getwebhook}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Get the org's signature webhook plus delivery statistics.

```typescript
const webhook = await TurboWebhooks.getWebhook();
// webhook.urls, webhook.events, webhook.isActive
// webhook.deliveryStats.{totalDeliveries, successfulDeliveries, failedDeliveries, pendingRetries}
// webhook.availableEvents
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Get the org's signature webhook plus delivery statistics.

```python
webhook = await TurboWebhooks.get_webhook()
# webhook["urls"], webhook["events"], webhook["isActive"]
# webhook["deliveryStats"]: {"totalDeliveries", "successfulDeliveries", "failedDeliveries", "pendingRetries"}
# webhook["availableEvents"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Get the org's signature webhook plus delivery statistics. Returns `map[string]interface{}` so new fields surface without an SDK upgrade.

```go
webhook, err := wh.GetWebhook(ctx)
// webhook["urls"], webhook["events"], webhook["isActive"]
// webhook["deliveryStats"]: { totalDeliveries, successfulDeliveries, failedDeliveries, pendingRetries }
// webhook["availableEvents"]
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Get the org's signature webhook plus delivery statistics.

```java
JsonObject webhook = webhooks.getWebhook();
// webhook.get("urls"), webhook.get("events"), webhook.get("isActive")
// webhook.getAsJsonObject("deliveryStats"):
//   { totalDeliveries, successfulDeliveries, failedDeliveries, pendingRetries }
// webhook.get("availableEvents")
```

</TabItem>
</Tabs>

<a id="update_webhook"></a>

### updateWebhook / update_webhook / UpdateWebhook {#updatewebhook}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Patch one or more fields. All fields are optional — pass only what changes.

```typescript
await TurboWebhooks.updateWebhook({
  urls: ['https://your-server.example.com/webhooks/turbodocx'],
  events: ['signature.document.completed'],
  isActive: true,
});

// Leaving urls and events alone: OMIT the keys entirely.
await TurboWebhooks.updateWebhook({ isActive: false });
```

:::danger Never send an empty array
`urls` and `events` are optional on update, but optional does **not** relax their minimum length. `urls: []` or `events: []` is a **400** — the same as sending an empty array on create. To leave a field unchanged, **omit the key entirely**. `urls` still caps at 10 entries on update.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Patch one or more fields. All fields are keyword-only and optional — pass only what changes.

```python
await TurboWebhooks.update_webhook(
    urls=["https://your-server.example.com/webhooks/turbodocx"],
    events=["signature.document.completed"],
    is_active=True,
)

# Leaving urls and events alone: just don't pass them.
await TurboWebhooks.update_webhook(is_active=False)
```

:::danger Never send an empty list
`urls` and `events` are optional on update, but optional does **not** relax their minimum length. `urls=[]` or `events=[]` is a **400** — the same as sending an empty list on create. To leave a field unchanged, **omit the argument entirely**. `urls` still caps at 10 entries on update.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Patch one or more fields. Leave any field at its zero value to skip it. Use `turbodocx.BoolPtr(false)` to toggle `IsActive`.

```go
updated, err := wh.UpdateWebhook(ctx, turbodocx.UpdateWebhookRequest{
    URLs: []string{"https://your-server.example.com/webhooks/turbodocx"},
    Events: turbodocx.WebhookEventStrings(
        turbodocx.WebhookEventRecipientSigned,
        turbodocx.WebhookEventCompleted,
    ),
    IsActive: turbodocx.BoolPtr(true),
})

// Leaving URLs and Events alone: leave them nil so the SDK omits the keys.
updated, err = wh.UpdateWebhook(ctx, turbodocx.UpdateWebhookRequest{
    IsActive: turbodocx.BoolPtr(false),
})
```

:::danger You cannot clear `URLs` or `Events`
`URLs` and `Events` are optional on update, but optional does **not** relax their minimum length: a list you do send must be non-empty, and `URLs` still caps at 10 entries. Both fields are tagged `omitempty`, so an empty `[]string{}` is dropped from the request body exactly like `nil`, leaving the existing list untouched rather than clearing it. There is no way to empty a webhook's URL or event list through the SDK. Delete the webhook and recreate it instead.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Patch one or more fields. Pass `null` for any argument you don't want to change. Renaming is not supported.

```java
JsonObject updated = webhooks.updateWebhook(
    Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),  // urls
    Arrays.asList(                                                         // events
        WebhookEvent.RECIPIENT_SIGNED.getValue(),
        WebhookEvent.COMPLETED.getValue()
    ),
    Boolean.TRUE                                                            // isActive
);

// Leaving urls and events alone: pass null, NOT an empty list.
JsonObject deactivated = webhooks.updateWebhook(null, null, Boolean.FALSE);
```

:::danger Never pass an empty list
`urls` and `events` are optional on update, but optional does **not** relax their minimum length. An empty list serializes to `urls: []` / `events: []`, which the API rejects with a **400** — exactly as it would on create. To leave a field unchanged, pass `null` so the key is omitted; never pass `Collections.emptyList()`. The URL list still caps at 10 entries on update.
:::

</TabItem>
</Tabs>

<a id="delete_webhook"></a>

### deleteWebhook / delete_webhook / DeleteWebhook {#deletewebhook}

Soft-delete the webhook and its delivery history.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
await TurboWebhooks.deleteWebhook();
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
await TurboWebhooks.delete_webhook()
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
TurboWebhooks::deleteWebhook();
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
_, err := wh.DeleteWebhook(ctx)
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
JsonObject deleted = webhooks.deleteWebhook();
```

</TabItem>
</Tabs>

<a id="test_webhook"></a>

### testWebhook / test_webhook / TestWebhook {#testwebhook}

Fire a synthetic delivery to every URL configured on the webhook. Useful for CI smoke tests before flipping a new receiver into production.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
const result = await TurboWebhooks.testWebhook({
  eventType: 'signature.document.completed',
  payload: { documentId: '...', documentName: '...' },
});

console.log(`${result.summary.successful}/${result.summary.total} succeeded`);
for (const err of result.summary.errors) {
  console.log(`  failure: ${err}`);  // per-URL failure messages
}
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
result = await TurboWebhooks.test_webhook(
    event_type="signature.document.completed",
    payload={"documentId": "...", "documentName": "..."},
)

print(f"{result['summary']['successful']}/{result['summary']['total']} succeeded")
for err in result["summary"].get("errors", []):
    print(f"  failure: {err}")  # per-URL failure messages
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
result, err := wh.TestWebhook(ctx, turbodocx.TestWebhookRequest{
    // EventType is a string — convert the typed constant with .String().
    EventType: turbodocx.WebhookEventCompleted.String(),
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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
import java.util.LinkedHashMap;
import java.util.Map;

Map<String, Object> payload = new LinkedHashMap<>();
payload.put("documentId",   "...");
payload.put("documentName", "...");

JsonObject result = webhooks.testWebhook(WebhookEvent.COMPLETED.getValue(), payload);

JsonObject summary = result.getAsJsonObject("summary");
System.out.println(summary.get("successful") + "/" + summary.get("total") + " succeeded");
if (summary.has("errors") && summary.get("errors").isJsonArray()) {
    summary.getAsJsonArray("errors").forEach(err ->
        System.out.println("  failure: " + err));   // per-URL failure messages
}
```

`notifyWebhook` is also exposed for symmetry with the backend surface — it routes through the same handler and returns the same shape. Prefer `testWebhook` in new code.

</TabItem>
</Tabs>

<a id="notify_webhook"></a>

### notifyWebhook / notify_webhook {#notifywebhook}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Manually send a notification to all URLs configured on the webhook. Routes through the same backend handler as `testWebhook` and returns an identical response shape. Exposed for symmetry with the backend surface; prefer `testWebhook` in new code.

```typescript
const result = await TurboWebhooks.notifyWebhook({
  eventType: 'signature.document.completed',
  payload: { documentId: '...', documentName: '...' },
});

console.log(`${result.summary.successful}/${result.summary.total} succeeded`);
for (const err of result.summary.errors) {
  console.log(`  failure: ${err}`);  // per-URL failure messages
}
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Manually send a notification to every URL configured on the webhook. Routes through the same backend handler as `test_webhook` and returns an identical response shape. Exposed for symmetry with the backend surface; prefer `test_webhook` in new code.

```python
result = await TurboWebhooks.notify_webhook(
    event_type="signature.document.completed",
    payload={"documentId": "...", "documentName": "..."},
)

print(f"{result['summary']['successful']}/{result['summary']['total']} succeeded")
for err in result["summary"].get("errors", []):
    print(f"  failure: {err}")  # per-URL failure messages
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Send a manual notification. Routes through the same backend handler as `testWebhook` and returns the same shape — the only wire-level difference is the response message string.

```php
$result = TurboWebhooks::notifyWebhook(
    eventType: 'signature.document.completed',
    payload: ['documentId' => '...', 'documentName' => '...'],
);
```

:::tip Prefer `testWebhook`
`notifyWebhook` exists for cross-SDK parity. For smoke-testing a receiver, use [`testWebhook`](#testwebhook) — same behaviour, clearer intent.
:::

</TabItem>
</Tabs>

<a id="regenerate_webhook_secret"></a>

### regenerateWebhookSecret / regenerate_webhook_secret / RegenerateWebhookSecret {#regeneratewebhooksecret}

Rotate the HMAC secret. The new secret is shown **once**; old signatures fail immediately after rotation.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
const rotated = await TurboWebhooks.regenerateWebhookSecret();
// rotated.secret
// rotated.regeneratedAt
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
rotated = await TurboWebhooks.regenerate_webhook_secret()
# rotated["secret"]
# rotated["regeneratedAt"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$rotated = TurboWebhooks::regenerateWebhookSecret();
// $rotated['secret']
// $rotated['regeneratedAt']
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
rotated, err := wh.RegenerateWebhookSecret(ctx)
newSecret := rotated["secret"]
// rotated["regeneratedAt"]
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
JsonObject rotated = webhooks.regenerateWebhookSecret();
String newSecret = rotated.get("secret").getAsString();
// rotated.get("regeneratedAt")
```

</TabItem>
</Tabs>

<a id="list_webhook_deliveries"></a>

### listWebhookDeliveries / list_webhook_deliveries / ListWebhookDeliveries {#listwebhookdeliveries}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Page through historical delivery attempts with filters.

```typescript
const page = await TurboWebhooks.listWebhookDeliveries({
  limit: 20,
  offset: 0,
  eventType: 'signature.document.completed',
  isDelivered: false,
  httpStatus: 500,
});
// page.results: WebhookDelivery[]
// page.totalRecords
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Page through historical delivery attempts with filters.

```python
page = await TurboWebhooks.list_webhook_deliveries(
    limit=20,
    offset=0,
    event_type="signature.document.completed",
    is_delivered=False,
    http_status=500,
)
# page["results"]: list of WebhookDelivery
# page["totalRecords"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Page through historical delivery attempts with filters. `Limit`, `Offset`, `IsDelivered`, and `HTTPStatus` are pointers, so leave them nil to skip. `EventType` is a plain `string`; leave it empty to skip.

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
// page["results"]: []interface{} (each element is a map[string]interface{} delivery row)
// page["totalRecords"]
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Page through historical delivery attempts with filters. Pass `null` for any filter to skip it; the no-arg overload skips all filters.

```java
JsonObject page = webhooks.listWebhookDeliveries(
    20,                              // limit
    null,                            // offset
    "signature.document.completed",  // eventType
    Boolean.FALSE,                   // isDelivered
    500                              // httpStatus
);
// page.getAsJsonArray("results")
// page.get("totalRecords")
```

</TabItem>
</Tabs>

<a id="replay_webhook_delivery"></a>

### replayWebhookDelivery / replay_webhook_delivery / ReplayWebhookDelivery {#replaywebhookdelivery}

Manually retry a past delivery by ID. Returns a freshly-created delivery row.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
const replay = await TurboWebhooks.replayWebhookDelivery('delivery-uuid-here');
// replay.id, replay.httpStatus, replay.attemptCount, ...
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
replay = await TurboWebhooks.replay_webhook_delivery("delivery-uuid-here")
# replay["id"], replay["httpStatus"], replay["attemptCount"], ...
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$replay = TurboWebhooks::replayWebhookDelivery('delivery-uuid-here');
// $replay['id'], $replay['httpStatus'], $replay['attemptCount'], ...
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
replayed, err := wh.ReplayWebhookDelivery(ctx, "delivery-uuid-here")
// replayed["id"], replayed["httpStatus"], replayed["attemptCount"], ...
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
JsonObject replayed = webhooks.replayWebhookDelivery("delivery-uuid-here");
// replayed.get("id"), replayed.get("httpStatus"), replayed.get("attemptCount"), ...
```

</TabItem>
</Tabs>

<a id="get_webhook_stats"></a>

### getWebhookStats / get_webhook_stats / GetWebhookStats {#getwebhookstats}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Aggregate delivery stats over a sliding window.

```typescript
const stats = await TurboWebhooks.getWebhookStats({ days: 30 });
// stats.summary.successRate
// stats.summary.avgResponseTime  (milliseconds)
// stats.eventBreakdown  (per-event totals)
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Aggregate delivery stats over a sliding window.

```python
stats = await TurboWebhooks.get_webhook_stats(days=30)
# stats["summary"]["successRate"]
# stats["summary"]["avgResponseTime"]  (milliseconds)
# stats["eventBreakdown"]  (per-event totals)
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Aggregate delivery stats over a sliding window.

```php
$stats = TurboWebhooks::getWebhookStats(days: 30);
// $stats['summary']['successRate']
// $stats['summary']['avgResponseTime']  (milliseconds)
// $stats['eventBreakdown']  (per-event totals)
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Aggregate delivery stats over a sliding window. Pass `0` for the backend default (30 days).

```go
stats, err := wh.GetWebhookStats(ctx, 30)
// stats["summary"]["successRate"]
// stats["summary"]["avgResponseTime"]  (milliseconds)
// stats["eventBreakdown"]  (per-event totals)
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Aggregate delivery stats over a sliding window. Pass `null` for the backend default (30 days).

```java
JsonObject stats = webhooks.getWebhookStats(30);
// stats.getAsJsonObject("summary").get("successRate")
// stats.getAsJsonObject("summary").get("avgResponseTime")  (milliseconds)
// stats.get("eventBreakdown")  (per-event totals)
```

</TabItem>
</Tabs>

<a id="verify_webhook_signature-free-function"></a>
<a id="webhooksignatureverifierverify-static-utility"></a>

### verifyWebhookSignature (free function) / verify_webhook_signature (free function) / VerifyWebhookSignature (free function) / WebhookSignatureVerifier.verify (static utility) {#verifywebhooksignature-free-function}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Verify the `X-TurboDocx-Signature` header on an incoming request. Exported directly from `@turbodocx/sdk` and does **not** require `TurboWebhooks.configure()` — receivers commonly run in a different process (or different deploy) than the management code.

```typescript
import { verifyWebhookSignature } from '@turbodocx/sdk';

const ok = verifyWebhookSignature(
  rawBody,              // string | Buffer — raw bytes as received
  signatureHeader,      // value of X-TurboDocx-Signature
  timestampHeader,      // value of X-TurboDocx-Timestamp
  webhookSecret,        // the secret from createWebhook
  { toleranceSeconds: 300 },  // default; pass 0 to disable timestamp check (NOT recommended)
);
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Verify the `X-TurboDocx-Signature` header on an incoming request. Exported directly from `turbodocx_sdk` and does **not** require `TurboWebhooks.configure()` — receivers commonly run in a different process (or different deploy) than the management code.

```python
from turbodocx_sdk import verify_webhook_signature

ok = verify_webhook_signature(
    raw_body,             # str | bytes — raw bytes as received
    signature_header,     # value of X-TurboDocx-Signature
    timestamp_header,     # value of X-TurboDocx-Timestamp
    webhook_secret,       # the secret from create_webhook
    tolerance_seconds=300,  # default; pass 0 to disable timestamp check (NOT recommended)
)
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Verify the `X-TurboDocx-Signature` header on an incoming request. Exposed as a static method on a final utility class — Java has no free functions, but the helper has no `apiKey` / `orgId` dependency, so it can be called from a receiver that runs in a completely different process (or deploy) than the management code.

```java
boolean ok = WebhookSignatureVerifier.verify(
    rawBody,         // byte[] — raw bytes as received
    signatureHeader, // value of X-TurboDocx-Signature
    timestampHeader, // value of X-TurboDocx-Timestamp
    webhookSecret    // the secret from createWebhook
);
```

A `String` body overload is provided for convenience (`verify(String rawBody, ...)`), and a 6-arg overload accepts a custom `toleranceSeconds` plus an optional `LongSupplier now` for testing. Pass `toleranceSeconds = 0` to disable the timestamp check entirely (NOT recommended in production).

</TabItem>
</Tabs>

## Laravel Integration Example {#laravel-integration-example}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
        match (WebhookEvent::tryFrom($event['event'])) {
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

</TabItem>
</Tabs>

## Framework Examples {#framework-examples}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs>
<TabItem value="express" label="Express">

```typescript
// server.ts
import express from 'express';
import { TurboWebhooks, WebhookEvents, verifyWebhookSignature } from '@turbodocx/sdk';

TurboWebhooks.configure({
  apiKey: process.env.TURBODOCX_API_KEY!,
  orgId: process.env.TURBODOCX_ORG_ID!,
});

const app = express();

// Receiver — MUST use express.raw, not express.json
app.post(
  '/webhooks/turbodocx',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const ok = verifyWebhookSignature(
      req.body,
      req.header('x-turbodocx-signature') ?? '',
      req.header('x-turbodocx-timestamp') ?? '',
      process.env.TURBODOCX_WEBHOOK_SECRET!,
    );
    if (!ok) return res.status(401).send('Invalid signature');

    const event = JSON.parse((req.body as Buffer).toString('utf8'));
    switch (event.event) {
      case WebhookEvents.SENT:                 /* ... */ break;
      case WebhookEvents.VIEWED:               /* ... */ break;
      // fires once per signer — event.data.is_final_signer marks the last one
      case WebhookEvents.RECIPIENT_SIGNED:     /* ... */ break;
      // partial progress only — NEVER fires on the final signature
      case WebhookEvents.SIGNED:               /* ... */ break;
      // the document is done
      case WebhookEvents.COMPLETED:            /* ... */ break;
      case WebhookEvents.FINALIZATION_FAILED:  /* ... */ break;
      case WebhookEvents.VOIDED:               /* ... */ break;
    }
    res.status(200).send('ok');
  },
);

app.listen(3000);
```

</TabItem>
<TabItem value="nextjs" label="Next.js (App Router)">

```typescript
// app/api/webhooks/turbodocx/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@turbodocx/sdk';

export async function POST(req: NextRequest) {
  // Read raw bytes BEFORE parsing — required for HMAC verification.
  const rawBody = await req.text();

  const ok = verifyWebhookSignature(
    rawBody,
    req.headers.get('x-turbodocx-signature') ?? '',
    req.headers.get('x-turbodocx-timestamp') ?? '',
    process.env.TURBODOCX_WEBHOOK_SECRET!,
  );
  if (!ok) return new NextResponse('Invalid signature', { status: 401 });

  const event = JSON.parse(rawBody);
  // dispatch event.event ... (NOT event.eventType — not on the wire)

  return NextResponse.json({ ok: true });
}
```

</TabItem>
<TabItem value="fastify" label="Fastify">

```typescript
// server.ts
import Fastify from 'fastify';
import { verifyWebhookSignature } from '@turbodocx/sdk';

const app = Fastify();

// Capture raw body for signature verification
app.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  (_req, body, done) => done(null, body),
);

app.post('/webhooks/turbodocx', (req, reply) => {
  const rawBody = req.body as Buffer;
  const ok = verifyWebhookSignature(
    rawBody,
    (req.headers['x-turbodocx-signature'] as string) ?? '',
    (req.headers['x-turbodocx-timestamp'] as string) ?? '',
    process.env.TURBODOCX_WEBHOOK_SECRET!,
  );
  if (!ok) return reply.code(401).send('Invalid signature');

  const event = JSON.parse(rawBody.toString('utf8'));
  // dispatch ...
  reply.code(200).send('ok');
});

app.listen({ port: 3000 });
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

<Tabs>
<TabItem value="flask" label="Flask">

```python
# server.py
import asyncio
import json
import os
from flask import Flask, request, abort
from turbodocx_sdk import (
    TurboWebhooks,
    verify_webhook_signature,
    WEBHOOK_EVENT_RECIPIENT_SIGNED,
    WEBHOOK_EVENT_SIGNED,
    WEBHOOK_EVENT_COMPLETED,
    WEBHOOK_EVENT_VOIDED,
)

TurboWebhooks.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"],
)

app = Flask(__name__)

@app.post("/webhooks/turbodocx")
def receive_webhook():
    raw_body = request.get_data()  # raw bytes — required for HMAC verification
    ok = verify_webhook_signature(
        raw_body,
        request.headers.get("X-TurboDocx-Signature", ""),
        request.headers.get("X-TurboDocx-Timestamp", ""),
        os.environ["TURBODOCX_WEBHOOK_SECRET"],
    )
    if not ok:
        abort(401, "Invalid signature")

    event = json.loads(raw_body)
    event_type = event["event"]
    if event_type == WEBHOOK_EVENT_RECIPIENT_SIGNED:
        # fires once per signer — event["data"]["is_final_signer"] marks the last
        pass  # ...
    elif event_type == WEBHOOK_EVENT_SIGNED:
        # partial progress only — NEVER fires on the final signature
        pass  # ...
    elif event_type == WEBHOOK_EVENT_COMPLETED:
        # the document is done
        pass  # ...
    elif event_type == WEBHOOK_EVENT_VOIDED:
        pass  # ...
    return ("ok", 200)


if __name__ == "__main__":
    app.run(port=3000)
```

</TabItem>
<TabItem value="fastapi" label="FastAPI">

```python
# server.py
import json
import os
from fastapi import FastAPI, Request, HTTPException
from turbodocx_sdk import (
    TurboWebhooks,
    verify_webhook_signature,
    WEBHOOK_EVENT_RECIPIENT_SIGNED,
    WEBHOOK_EVENT_SIGNED,
    WEBHOOK_EVENT_COMPLETED,
    WEBHOOK_EVENT_VOIDED,
)

TurboWebhooks.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"],
)

app = FastAPI()

@app.post("/webhooks/turbodocx")
async def receive_webhook(request: Request):
    raw_body = await request.body()  # raw bytes — required for HMAC verification
    ok = verify_webhook_signature(
        raw_body,
        request.headers.get("x-turbodocx-signature", ""),
        request.headers.get("x-turbodocx-timestamp", ""),
        os.environ["TURBODOCX_WEBHOOK_SECRET"],
    )
    if not ok:
        raise HTTPException(status_code=401, detail="Invalid signature")

    event = json.loads(raw_body)
    event_type = event["event"]
    if event_type == WEBHOOK_EVENT_RECIPIENT_SIGNED:
        # fires once per signer — event["data"]["is_final_signer"] marks the last
        pass  # ...
    elif event_type == WEBHOOK_EVENT_SIGNED:
        # partial progress only — NEVER fires on the final signature
        pass  # ...
    elif event_type == WEBHOOK_EVENT_COMPLETED:
        # the document is done
        pass  # ...
    elif event_type == WEBHOOK_EVENT_VOIDED:
        pass  # ...
    return {"ok": True}
```

</TabItem>
<TabItem value="django" label="Django">

```python
# views.py
import json
import os
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from turbodocx_sdk import verify_webhook_signature


@csrf_exempt
@require_POST
def turbodocx_webhook(request):
    raw_body = request.body  # raw bytes — required for HMAC verification
    ok = verify_webhook_signature(
        raw_body,
        request.headers.get("X-TurboDocx-Signature", ""),
        request.headers.get("X-TurboDocx-Timestamp", ""),
        os.environ["TURBODOCX_WEBHOOK_SECRET"],
    )
    if not ok:
        return HttpResponseBadRequest("Invalid signature")

    event = json.loads(raw_body)
    # dispatch event["event"] ... (NOT "eventType" — not on the wire)
    return HttpResponse("ok")
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Error Handling {#error-handling}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
import {
  TurboDocxError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  ConflictError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from '@turbodocx/sdk';

try {
  await TurboWebhooks.createWebhook({ urls, events });
} catch (e) {
  if (e instanceof ConflictError) {
    // 409 — signature webhook already exists; update or delete it instead
  } else if (e instanceof ValidationError) {
    // 400 — non-HTTPS URL, empty events array, etc.
  } else if (e instanceof AuthorizationError) {
    // 403 — API key lacks the administrator role
  } else if (e instanceof AuthenticationError) {
    // 401 — bad or revoked API key
  } else if (e instanceof NotFoundError) {
    // 404 — operating on a non-existent webhook
  } else if (e instanceof RateLimitError) {
    // 429 — back off and retry
  } else if (e instanceof NetworkError) {
    // request never reached the server (DNS, refused, timeout)
  } else if (e instanceof TurboDocxError) {
    // catch-all for any other typed SDK error (raw 5xx, etc.)
    console.error(`Error ${e.statusCode}: ${e.message}`);
  } else {
    throw e;
  }
}
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
from turbodocx_sdk import (
    TurboDocxError,
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    ConflictError,
    NotFoundError,
    RateLimitError,
    NetworkError,
)

try:
    await TurboWebhooks.create_webhook(urls=urls, events=events)
except ConflictError:
    # 409 — signature webhook already exists; update or delete it instead
    pass
except ValidationError:
    # 400 — non-HTTPS URL, empty events array, etc.
    pass
except AuthorizationError:
    # 403 — API key lacks the administrator role
    pass
except AuthenticationError:
    # 401 — bad or revoked API key
    pass
except NotFoundError:
    # 404 — operating on a non-existent webhook
    pass
except RateLimitError:
    # 429 — back off and retry
    pass
except NetworkError:
    # request never reached the server (DNS, refused, timeout)
    pass
except TurboDocxError as e:
    # catch-all for any other typed SDK error (raw 5xx, etc.)
    print(f"Error {getattr(e, 'status_code', '?')}: {e}")
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
import com.turbodocx.TurboDocxException;

try {
    webhooks.createWebhook(urls, events);
} catch (TurboDocxException.ConflictException e) {
    // 409 — signature webhook already exists; update or delete it instead
} catch (TurboDocxException.ValidationException e) {
    // 400 — non-HTTPS URL, empty events list, etc.
} catch (TurboDocxException.AuthorizationException e) {
    // 403 — API key lacks the administrator role
} catch (TurboDocxException.AuthenticationException e) {
    // 401 — bad or revoked API key
} catch (TurboDocxException.NotFoundException e) {
    // 404 — operating on a non-existent webhook
} catch (TurboDocxException.RateLimitException e) {
    // 429 — back off and retry
} catch (TurboDocxException.NetworkException e) {
    // request never reached the server (DNS, refused, timeout)
} catch (TurboDocxException e) {
    // catch-all for any other typed SDK error (raw 5xx, etc.)
    System.err.println("Error " + e.getStatusCode() + ": " + e.getMessage());
}
```

</TabItem>
</Tabs>

### Common Error Codes {#common-error-codes}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

| Status | Class | When |
|---|---|---|
| 400 | `ValidationError` | Non-HTTPS URL, empty `urls`/`events` array, more than 10 URLs, invalid body |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without administrator role |
| 404 | `NotFoundError` | Operating on a non-existent webhook |
| 409 | `ConflictError` | Creating when the signature webhook already exists |
| 429 | `RateLimitError` | Rate limit exceeded — back off |

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

| Status | Class | When |
|---|---|---|
| 400 | `ValidationError` | Non-HTTPS URL, empty `urls`/`events` list, more than 10 URLs, invalid body |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without administrator role |
| 404 | `NotFoundError` | Operating on a non-existent webhook |
| 409 | `ConflictError` | Creating when the signature webhook already exists |
| 429 | `RateLimitError` | Rate limit exceeded — back off |

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

| Status | Exception | When |
|---|---|---|
| 400 | `ValidationException` | Non-HTTPS URL, empty `urls`/`events` array, more than 10 URLs, invalid body |
| 401 | `AuthenticationException` | Missing or invalid API key |
| 403 | `AuthorizationException` | Valid key without administrator role |
| 404 | `NotFoundException` | Operating on a non-existent webhook |
| 409 | `ConflictException` | Creating when the signature webhook already exists |
| 429 | `RateLimitException` | Rate limit exceeded — back off |

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

| Status | Type | When |
|---|---|---|
| 400 | `*ValidationError` | Non-HTTPS URL, empty `urls`/`events` array, more than 10 URLs, invalid body |
| 401 | `*AuthenticationError` | Missing or invalid API key |
| 403 | `*AuthorizationError` | Valid key without administrator role |
| 404 | `*NotFoundError` | Operating on a non-existent webhook |
| 409 | `*ConflictError` | Creating when the signature webhook already exists |
| 429 | `*RateLimitError` | Rate limit exceeded — back off |

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

| Status | Type | When |
|---|---|---|
| 400 | `TurboDocxException.ValidationException` | Non-HTTPS URL, empty `urls`/`events` list, more than 10 URLs, invalid body |
| 401 | `TurboDocxException.AuthenticationException` | Missing or invalid API key |
| 403 | `TurboDocxException.AuthorizationException` | Valid key without administrator role |
| 404 | `TurboDocxException.NotFoundException` | Operating on a non-existent webhook |
| 409 | `TurboDocxException.ConflictException` | Creating when the signature webhook already exists |
| 429 | `TurboDocxException.RateLimitException` | Rate limit exceeded — back off |

</TabItem>
</Tabs>

## Runnable End-to-End Example {#runnable-end-to-end-example}

A complete, validated CRUD walkthrough lives in the SDK repo:

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

**[`packages/js-sdk/examples/turbowebhooks-crud.ts`](https://github.com/TurboDocx/SDK/blob/main/packages/js-sdk/examples/turbowebhooks-crud.ts)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend. Run with `npx tsx examples/turbowebhooks-crud.ts` after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`. Override `TURBODOCX_RECEIVER_URL` to point at a real receiver (e.g. webhook.site, ngrok).

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

**[`packages/py-sdk/examples/turbowebhooks_crud.py`](https://github.com/TurboDocx/SDK/blob/main/packages/py-sdk/examples/turbowebhooks_crud.py)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend. Run with `python examples/turbowebhooks_crud.py` after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`. Override `TURBODOCX_RECEIVER_URL` to point at a real receiver (e.g. webhook.site, ngrok).

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

**[`packages/php-sdk/examples/turbowebhooks-crud.php`](https://github.com/TurboDocx/SDK/blob/main/packages/php-sdk/examples/turbowebhooks-crud.php)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend.

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

**[`packages/go-sdk/examples/turbowebhooks_crud.go`](https://github.com/TurboDocx/SDK/blob/main/packages/go-sdk/examples/turbowebhooks_crud.go)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend. Run with `go run examples/turbowebhooks_crud.go` after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`. Override `TURBODOCX_RECEIVER_URL` to point at a real receiver (e.g. webhook.site, ngrok).

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

**[`packages/java-sdk/examples/TurboWebhooksCrud.java`](https://github.com/TurboDocx/SDK/blob/main/packages/java-sdk/examples/TurboWebhooksCrud.java)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend. Run it after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`; override `TURBODOCX_RECEIVER_URL` to point at a real receiver (e.g. webhook.site, ngrok).

</TabItem>
</Tabs>

## Gotchas {#gotchas}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice returns `ConflictError` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `createWebhook` and `regenerateWebhookSecret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. Never `JSON.parse` first. In Express, use `express.raw({ type: 'application/json' })`; in Next.js, `await req.text()`; in Fastify, register a raw-body content-type parser.
- **`verifyWebhookSignature` is a free function**, not a method on `TurboWebhooks` — import it directly from `@turbodocx/sdk`. It has no `apiKey`/`orgId` dependency.
- **`replayWebhookDelivery` returns the full delivery row.** Earlier SDK versions documented a partial shape — current versions return the complete `WebhookDelivery` object.
- **`testWebhook` summary now includes per-URL errors.** Check `result.summary.errors` to see exactly which receiver failed and why.
- **An empty array is not "no change".** On `updateWebhook`, `urls: []` and `events: []` are 400s, not no-ops. Omit the key to leave the field alone.
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `WebhookEvents.COMPLETED` to detect a finished document. See [Webhook Events](#webhook-events).
- **`WEBHOOK_EVENTS` is `readonly`.** It's declared `as const`, so spread it (`events: [...WEBHOOK_EVENTS]`) rather than passing it directly into the mutable `events: WebhookEvent[]` field.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice raises `ConflictError` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `create_webhook` and `regenerate_webhook_secret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. Never `json.loads(...)` first. In Flask, use `request.get_data()`; in FastAPI, `await request.body()`; in Django, `request.body`.
- **`verify_webhook_signature` is a free function**, not a method on `TurboWebhooks` — import it directly from `turbodocx_sdk`. It has no `api_key`/`org_id` dependency.
- **All methods are async.** Call them from inside an `async def`, or wrap with `asyncio.run(...)` from a synchronous context (e.g. a sync Flask view). Mixing `asyncio.run` per-request inside a hot path will reinitialize the event loop on every call — prefer FastAPI or an async Flask variant for production receivers that also need to make SDK calls.
- **`test_webhook` summary now includes per-URL errors.** Check `result["summary"]["errors"]` to see exactly which receiver failed and why.
- **An empty list is not "no change".** On `update_webhook`, `urls=[]` and `events=[]` are 400s, not no-ops. Omit the argument to leave the field alone.
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `WEBHOOK_EVENT_COMPLETED` to detect a finished document. See [Webhook Events](#webhook-events).
- **The event constants are singular, the collection is plural.** `WEBHOOK_EVENT_COMPLETED` (one event) vs `WEBHOOK_EVENTS` (a **tuple** of all 7) — easy to typo. Wrap it with `list(...)` when passing it as `events`.

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice returns `*ConflictError` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `CreateWebhook` and `RegenerateWebhookSecret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. Never unmarshal-then-remarshal first. Always `io.ReadAll(r.Body)` (or framework-equivalent) before calling `VerifyWebhookSignature`.
- **`VerifyWebhookSignature` is a free function**, not a method on `WebhooksClient` — it has no `APIKey`/`OrgID` dependency. Pass `nil` for `opts` to use the default 300-second tolerance.
- **Pointer-typed optional fields.** `UpdateWebhookRequest.IsActive` and `ListDeliveriesRequest.{Limit, Offset, IsDelivered, HTTPStatus}` are pointers so a zero value (`false` or `0`) can be told apart from "leave unchanged" / "no filter." Use `turbodocx.BoolPtr(false)` / `&n` to set them.
- **`TestWebhook` summary now includes per-URL errors.** Type-assert `result["summary"].(map[string]interface{})["errors"].([]interface{})` to see exactly which receiver failed and why.
- **An empty slice does not clear a list.** `URLs` and `Events` are `omitempty`, so `[]string{}` is omitted from the body just like `nil` and the existing list survives the patch. If an intentional "clear" appears to do nothing, this is why. Delete and recreate the webhook instead.
- **`WebhookEvent` is a distinct type — it will not assign into `Events []string`.** `Events: []turbodocx.WebhookEvent{...}` and `Events: turbodocx.AllWebhookEvents` are both **compile errors**. Always wrap with `turbodocx.WebhookEventStrings(...)` (variadic — spread the slice: `WebhookEventStrings(turbodocx.AllWebhookEvents...)`), or use `.String()` / `string(...)` for a single value like `TestWebhookRequest.EventType`.
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `turbodocx.WebhookEventCompleted` to detect a finished document. See [Webhook Events](#webhook-events).

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice throws `TurboDocxException.ConflictException` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `createWebhook` and `regenerateWebhookSecret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **`WebhookSignatureVerifier` is a static utility** — Java has no free functions, so call it as `WebhookSignatureVerifier.verify(...)`. Final class with a private constructor; do not subclass.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. In Spring, bind to `@RequestBody byte[] rawBody` — never `Map`/DTO; Jackson re-serialization breaks verification. In Servlets, use `request.getInputStream().readAllBytes()`. In JAX-RS, declare a `byte[]` entity parameter.
- **Administrator role required.** The webhook routes are gated on `requireOrgRole(administrator)`. Valid TDX- keys without the role throw `TurboDocxException.AuthorizationException` (403).
- **`null` skips fields on `updateWebhook` and `listWebhookDeliveries`.** Pass `null` for any argument you don't want to change/filter.
- **An empty list is not "no change".** On `updateWebhook`, an empty `urls`/`events` list serializes to `[]` and is a **400**, not a no-op. Pass `null` — never `Collections.emptyList()`.
- **`testWebhook` summary includes per-URL errors.** Read `result.getAsJsonObject("summary").getAsJsonArray("errors")` to see exactly which receiver failed and why.
- **All TurboWebhooks methods return `JsonObject`.** New server fields surface without an SDK upgrade — use `.has(key)` / `.get(key)` to navigate.
- **`createWebhook` takes wire strings, not enum constants.** Pass `WebhookEvent.COMPLETED.getValue()` — the events parameter is `List<String>`. `WebhookEvent.allValues()` returns all 7 wire strings in one call (as an unmodifiable list; copy it if you need to mutate).
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `WebhookEvent.COMPLETED` to detect a finished document. See [Webhook Events](#webhook-events).

</TabItem>
</Tabs>

## See Also {#see-also}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks?language=php) — same API, PHP idioms
- [TurboSign JavaScript SDK](/docs/SDKs/javascript) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [@turbodocx/sdk on npm](https://www.npmjs.com/package/@turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks?language=js) — same API, JS idioms
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks?language=php) — same API, PHP idioms
- [TurboSign Python SDK](/docs/SDKs/python) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [turbodocx-sdk on PyPI](https://pypi.org/project/turbodocx-sdk/)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboSign PHP SDK](/docs/SDKs/php) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [TurboDocx SDK on Packagist](https://packagist.org/packages/turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks?language=js) — same API, JS idioms
- [TurboWebhooks Python SDK](/docs/SDKs/webhooks?language=python) — same API, Python idioms
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks?language=php) — same API, PHP idioms
- [TurboSign Go SDK](/docs/SDKs/go) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks?language=js) — same API, JS idioms
- [TurboWebhooks Python SDK](/docs/SDKs/webhooks?language=python) — same API, Python idioms
- [TurboWebhooks Go SDK](/docs/SDKs/webhooks?language=go) — same API, Go idioms
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks?language=php) — same API, PHP idioms
- [TurboSign Java SDK](/docs/SDKs/java) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)

</TabItem>
</Tabs>
