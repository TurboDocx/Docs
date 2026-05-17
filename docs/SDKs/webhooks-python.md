---
title: TurboWebhooks Python SDK
sidebar_position: 17
sidebar_label: "TurboWebhooks: Python"
description: Official TurboDocx Webhooks SDK for Python. Subscribe to signature.document.completed and signature.document.voided events, verify inbound webhook signatures with HMAC-SHA256, and manage delivery history programmatically.
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
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboWebhooks Python SDK

The official TurboDocx Webhooks SDK for Python applications (Flask, FastAPI, Django, AWS Lambda, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Python 3.9+. Distributed on PyPI as `turbodocx-sdk` (same package as TurboSign).

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications when signature documents complete or get voided, instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

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

## Quick Start

### 1. Create the signature webhook

```python
import asyncio
import os
from turbodocx_sdk import (
    TurboWebhooks,
    ConflictError,
    ValidationError,
)


async def setup_webhook():
    TurboWebhooks.configure(
        api_key=os.environ["TURBODOCX_API_KEY"],
        org_id=os.environ["TURBODOCX_ORG_ID"],
    )

    try:
        created = await TurboWebhooks.create_webhook(
            urls=["https://your-server.example.com/webhooks/turbodocx"],
            events=["signature.document.completed", "signature.document.voided"],
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
created = await TurboWebhooks.create_webhook(
    urls=["https://your-server.example.com/webhooks/turbodocx"],
    events=["signature.document.completed", "signature.document.voided"],
)
```

| Raises | Why |
|---|---|
| `ConflictError` (409) | The signature webhook already exists for this org. |
| `ValidationError` (400) | A URL is not HTTPS, or `events` is empty. |
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
```

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
from turbodocx_sdk import TurboWebhooks, verify_webhook_signature

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
    if event["eventType"] == "signature.document.completed":
        pass  # ...
    elif event["eventType"] == "signature.document.voided":
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
from turbodocx_sdk import TurboWebhooks, verify_webhook_signature

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
    if event["eventType"] == "signature.document.completed":
        pass  # ...
    elif event["eventType"] == "signature.document.voided":
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
| 400 | `ValidationError` | Non-HTTPS URL, empty events, invalid body |
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

## See Also

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks-javascript) — same API, JS idioms
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks-php) — same API, PHP idioms
- [TurboSign Python SDK](/docs/SDKs/python) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all five languages
- [turbodocx-sdk on PyPI](https://pypi.org/project/turbodocx-sdk/)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
