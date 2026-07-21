---
title: TurboWebhooks Python SDK
sidebar_position: 17
sidebar_label: "TurboWebhooks: Python"
description: Official TurboDocx Webhooks SDK for Python. Subscribe to all seven TurboSign signature events with the WEBHOOK_EVENT_* constants, verify inbound webhook signatures with HMAC-SHA256, and manage delivery history programmatically.
keywords:
  - turbodocx webhooks
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
  - signature lifecycle events
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboWebhooks Python SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbowebhooks" product="TurboWebhooks" />

The official TurboDocx Webhooks SDK for Python applications (Flask, FastAPI, Django, AWS Lambda, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Python 3.9+. Distributed on PyPI as `turbodocx-sdk` (same package as TurboSign).

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications across the whole signature lifecycle — sent, viewed, each recipient signing, partial progress, completed, voided, and finalization failures — instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

For the full conceptual overview of how webhooks work in TurboSign (delivery retries, payload schema, dashboard UI), see [TurboSign → Webhooks](/docs/TurboSign/Webhooks).
:::

## Installation

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

## Requirements

- Python 3.9 or higher
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)
- All SDK methods are `async` — call them from an `async def` (or wrap with `asyncio.run(...)` in synchronous contexts)

## Configuration

```python
import os
from turbodocx_sdk import TurboWebhooks

TurboWebhooks.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"],
)
```

`skip_sender_validation=True` is hardcoded inside `TurboWebhooks.configure()` because webhooks don't send email — only TurboSign needs `sender_email`. If you skip the explicit call, the SDK lazily configures itself from `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` on first method invocation.

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
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role will raise `AuthorizationError` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

## Webhook Events

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

### Event constants

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

## Quick Start

### 1. Create the signature webhook

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

### 2. Verify inbound webhook signatures

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
    # process event["eventType"], event["data"], ...
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
    # process event["eventType"], event["data"], ...
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

## Method Reference

All methods are `@classmethod`s on `TurboWebhooks`; configure once, then call on the class.

### create_webhook

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

### get_webhook

Get the org's signature webhook plus delivery statistics.

```python
webhook = await TurboWebhooks.get_webhook()
# webhook["urls"], webhook["events"], webhook["isActive"]
# webhook["deliveryStats"]: {"totalDeliveries", "successfulDeliveries", "failedDeliveries", "pendingRetries"}
# webhook["availableEvents"]
```

### update_webhook

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

### delete_webhook

Soft-delete the webhook and its delivery history.

```python
await TurboWebhooks.delete_webhook()
```

### test_webhook

Fire a synthetic delivery to every URL configured on the webhook. Useful for CI smoke tests before flipping a new receiver into production.

```python
result = await TurboWebhooks.test_webhook(
    event_type="signature.document.completed",
    payload={"documentId": "...", "documentName": "..."},
)

print(f"{result['summary']['successful']}/{result['summary']['total']} succeeded")
for err in result["summary"].get("errors", []):
    print(f"  failure: {err}")  # per-URL failure messages
```

### notify_webhook

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

### regenerate_webhook_secret

Rotate the HMAC secret. The new secret is shown **once**; old signatures fail immediately after rotation.

```python
rotated = await TurboWebhooks.regenerate_webhook_secret()
# rotated["secret"]
# rotated["regeneratedAt"]
```

### list_webhook_deliveries

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

### replay_webhook_delivery

Manually retry a past delivery by ID. Returns a freshly-created delivery row.

```python
replay = await TurboWebhooks.replay_webhook_delivery("delivery-uuid-here")
# replay["id"], replay["httpStatus"], replay["attemptCount"], ...
```

### get_webhook_stats

Aggregate delivery stats over a sliding window.

```python
stats = await TurboWebhooks.get_webhook_stats(days=30)
# stats["summary"]["successRate"]
# stats["summary"]["avgResponseTime"]  (milliseconds)
# stats["eventBreakdown"]  (per-event totals)
```

### verify_webhook_signature (free function)

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

## Framework Examples

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
    event_type = event["eventType"]
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
    event_type = event["eventType"]
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
    # dispatch event["eventType"] ...
    return HttpResponse("ok")
```

</TabItem>
</Tabs>

## Error Handling

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

### Common Error Codes

| Status | Class | When |
|---|---|---|
| 400 | `ValidationError` | Non-HTTPS URL, empty `urls`/`events` list, more than 10 URLs, invalid body |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without administrator role |
| 404 | `NotFoundError` | Operating on a non-existent webhook |
| 409 | `ConflictError` | Creating when the signature webhook already exists |
| 429 | `RateLimitError` | Rate limit exceeded — back off |

## Runnable End-to-End Example

A complete, validated CRUD walkthrough lives in the SDK repo:

**[`packages/py-sdk/examples/turbowebhooks_crud.py`](https://github.com/TurboDocx/SDK/blob/main/packages/py-sdk/examples/turbowebhooks_crud.py)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend. Run with `python examples/turbowebhooks_crud.py` after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`. Override `TURBODOCX_RECEIVER_URL` to point at a real receiver (e.g. webhook.site, ngrok).

## Gotchas

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice raises `ConflictError` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `create_webhook` and `regenerate_webhook_secret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. Never `json.loads(...)` first. In Flask, use `request.get_data()`; in FastAPI, `await request.body()`; in Django, `request.body`.
- **`verify_webhook_signature` is a free function**, not a method on `TurboWebhooks` — import it directly from `turbodocx_sdk`. It has no `api_key`/`org_id` dependency.
- **All methods are async.** Call them from inside an `async def`, or wrap with `asyncio.run(...)` from a synchronous context (e.g. a sync Flask view). Mixing `asyncio.run` per-request inside a hot path will reinitialize the event loop on every call — prefer FastAPI or an async Flask variant for production receivers that also need to make SDK calls.
- **`test_webhook` summary now includes per-URL errors.** Check `result["summary"]["errors"]` to see exactly which receiver failed and why.
- **An empty list is not "no change".** On `update_webhook`, `urls=[]` and `events=[]` are 400s, not no-ops. Omit the argument to leave the field alone.
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `WEBHOOK_EVENT_COMPLETED` to detect a finished document. See [Webhook Events](#webhook-events).
- **The event constants are singular, the collection is plural.** `WEBHOOK_EVENT_COMPLETED` (one event) vs `WEBHOOK_EVENTS` (a **tuple** of all 7) — easy to typo. Wrap it with `list(...)` when passing it as `events`.

## See Also

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks-javascript) — same API, JS idioms
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks-php) — same API, PHP idioms
- [TurboSign Python SDK](/docs/SDKs/python) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [turbodocx-sdk on PyPI](https://pypi.org/project/turbodocx-sdk/)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
