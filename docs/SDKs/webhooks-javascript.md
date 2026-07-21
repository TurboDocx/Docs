---
title: TurboWebhooks JavaScript / TypeScript SDK
sidebar_position: 16
sidebar_label: "TurboWebhooks: JavaScript"
description: Official TurboDocx Webhooks SDK for JavaScript and TypeScript. Subscribe to all seven TurboSign signature events with the typed WebhookEvents constants, verify inbound webhook signatures with HMAC-SHA256, and manage delivery history programmatically.
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
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboWebhooks JavaScript / TypeScript SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbowebhooks" product="TurboWebhooks" />

The official TurboDocx Webhooks SDK for Node.js applications (Express, Fastify, Next.js API routes, AWS Lambda, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Node 18+. Available on npm as `@turbodocx/sdk` (same package as TurboSign).

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications across the whole signature lifecycle — sent, viewed, each recipient signing, partial progress, completed, voided, and finalization failures — instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

For the full conceptual overview of how webhooks work in TurboSign (delivery retries, payload schema, dashboard UI), see [TurboSign → Webhooks](/docs/TurboSign/Webhooks).
:::

## Installation

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

## Requirements

- Node.js 18 or higher (native `fetch` + `crypto.timingSafeEqual`)
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)
- Zero runtime dependencies — the SDK only uses Node built-ins

## Configuration

```typescript
import { TurboWebhooks } from '@turbodocx/sdk';

TurboWebhooks.configure({
  apiKey: process.env.TURBODOCX_API_KEY!,
  orgId: process.env.TURBODOCX_ORG_ID!,
});
```

`skipSenderValidation: true` is hardcoded inside `TurboWebhooks.configure()` because webhooks don't send email — only TurboSign needs `senderEmail`. If you skip the explicit call, the SDK lazily configures itself from `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` on first method invocation.

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
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role will throw `AuthorizationError` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

## Webhook Events

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

### Event constants

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

## Quick Start

### 1. Create the signature webhook

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

### 2. Verify inbound webhook signatures

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
    // process event.eventType, event.data, ...

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

## Method Reference

All methods are static; configure once, then call on the `TurboWebhooks` class.

### createWebhook

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

### getWebhook

Get the org's signature webhook plus delivery statistics.

```typescript
const webhook = await TurboWebhooks.getWebhook();
// webhook.urls, webhook.events, webhook.isActive
// webhook.deliveryStats.{totalDeliveries, successfulDeliveries, failedDeliveries, pendingRetries}
// webhook.availableEvents
```

### updateWebhook

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

### deleteWebhook

Soft-delete the webhook and its delivery history.

```typescript
await TurboWebhooks.deleteWebhook();
```

### testWebhook

Fire a synthetic delivery to every URL configured on the webhook. Useful for CI smoke tests before flipping a new receiver into production.

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

### notifyWebhook

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

### regenerateWebhookSecret

Rotate the HMAC secret. The new secret is shown **once**; old signatures fail immediately after rotation.

```typescript
const rotated = await TurboWebhooks.regenerateWebhookSecret();
// rotated.secret
// rotated.regeneratedAt
```

### listWebhookDeliveries

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

### replayWebhookDelivery

Manually retry a past delivery by ID. Returns a freshly-created delivery row.

```typescript
const replay = await TurboWebhooks.replayWebhookDelivery('delivery-uuid-here');
// replay.id, replay.httpStatus, replay.attemptCount, ...
```

### getWebhookStats

Aggregate delivery stats over a sliding window.

```typescript
const stats = await TurboWebhooks.getWebhookStats({ days: 30 });
// stats.summary.successRate
// stats.summary.avgResponseTime  (milliseconds)
// stats.eventBreakdown  (per-event totals)
```

### verifyWebhookSignature (free function)

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

## Framework Examples

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
    switch (event.eventType) {
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
  // dispatch event.eventType ...

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

## Error Handling

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

### Common Error Codes

| Status | Class | When |
|---|---|---|
| 400 | `ValidationError` | Non-HTTPS URL, empty `urls`/`events` array, more than 10 URLs, invalid body |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without administrator role |
| 404 | `NotFoundError` | Operating on a non-existent webhook |
| 409 | `ConflictError` | Creating when the signature webhook already exists |
| 429 | `RateLimitError` | Rate limit exceeded — back off |

## Runnable End-to-End Example

A complete, validated CRUD walkthrough lives in the SDK repo:

**[`packages/js-sdk/examples/turbowebhooks-crud.ts`](https://github.com/TurboDocx/SDK/blob/main/packages/js-sdk/examples/turbowebhooks-crud.ts)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend. Run with `npx tsx examples/turbowebhooks-crud.ts` after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`. Override `TURBODOCX_RECEIVER_URL` to point at a real receiver (e.g. webhook.site, ngrok).

## Gotchas

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice returns `ConflictError` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `createWebhook` and `regenerateWebhookSecret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. Never `JSON.parse` first. In Express, use `express.raw({ type: 'application/json' })`; in Next.js, `await req.text()`; in Fastify, register a raw-body content-type parser.
- **`verifyWebhookSignature` is a free function**, not a method on `TurboWebhooks` — import it directly from `@turbodocx/sdk`. It has no `apiKey`/`orgId` dependency.
- **`replayWebhookDelivery` returns the full delivery row.** Earlier SDK versions documented a partial shape — current versions return the complete `WebhookDelivery` object.
- **`testWebhook` summary now includes per-URL errors.** Check `result.summary.errors` to see exactly which receiver failed and why.
- **An empty array is not "no change".** On `updateWebhook`, `urls: []` and `events: []` are 400s, not no-ops. Omit the key to leave the field alone.
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `WebhookEvents.COMPLETED` to detect a finished document. See [Webhook Events](#webhook-events).
- **`WEBHOOK_EVENTS` is `readonly`.** It's declared `as const`, so spread it (`events: [...WEBHOOK_EVENTS]`) rather than passing it directly into the mutable `events: WebhookEvent[]` field.

## See Also

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks-php) — same API, PHP idioms
- [TurboSign JavaScript SDK](/docs/SDKs/javascript) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [@turbodocx/sdk on npm](https://www.npmjs.com/package/@turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
