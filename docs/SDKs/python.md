---
title: Python SDK
sidebar_position: 3
sidebar_label: Python
description: Official TurboDocx Python SDK. Async-first design with sync wrappers for document generation and digital signatures.
keywords:
  - turbodocx python
  - turbosign python
  - python sdk
  - pip turbodocx
  - asyncio sdk
  - fastapi turbodocx
  - django turbodocx
  - document api python
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python SDK

The official TurboDocx SDK for Python applications. Async-first design with synchronous wrappers for flexibility.

[![PyPI version](https://img.shields.io/pypi/v/turbodocx-sdk?logo=python&logoColor=white)](https://pypi.org/project/turbodocx-sdk/)
[![GitHub](https://img.shields.io/github/stars/turbodocx/sdk?style=social)](https://github.com/TurboDocx/SDK)

## Installation

<Tabs>
<TabItem value="pip" label="pip" default>

```bash
pip install turbodocx-sdk
```

</TabItem>
<TabItem value="poetry" label="Poetry">

```bash
poetry add turbodocx-sdk
```

</TabItem>
<TabItem value="pipenv" label="Pipenv">

```bash
pipenv install turbodocx-sdk
```

</TabItem>
</Tabs>

## Requirements

- Python 3.8+
- `httpx` (installed automatically)
- `pydantic` (installed automatically)

---

## Configuration

```python
from turbodocx import TurboSign
import os

# Configure globally
TurboSign.configure(api_key=os.environ["TURBODOCX_API_KEY"])

# Or create an instance with configuration
client = TurboSign(api_key=os.environ["TURBODOCX_API_KEY"])
```

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
```

---

## Quick Start

### Async Usage (Recommended)

```python
import asyncio
from turbodocx import TurboSign
import os

TurboSign.configure(api_key=os.environ["TURBODOCX_API_KEY"])

async def send_contract():
    result = await TurboSign.prepare_for_signing_single(
        file_link="https://example.com/contract.pdf",
        document_name="Service Agreement",
        sender_name="Acme Corp",
        sender_email="contracts@acme.com",
        recipients=[
            {"name": "Alice Smith", "email": "alice@example.com", "order": 1},
            {"name": "Bob Johnson", "email": "bob@example.com", "order": 2}
        ],
        fields=[
            # Alice's signature
            {"type": "signature", "page": 1, "x": 100, "y": 650, "width": 200, "height": 50, "recipient_order": 1},
            {"type": "date", "page": 1, "x": 320, "y": 650, "width": 100, "height": 30, "recipient_order": 1},
            # Bob's signature
            {"type": "signature", "page": 1, "x": 100, "y": 720, "width": 200, "height": 50, "recipient_order": 2},
            {"type": "date", "page": 1, "x": 320, "y": 720, "width": 100, "height": 30, "recipient_order": 2}
        ]
    )

    print(f"Document ID: {result.document_id}")
    for recipient in result.recipients:
        print(f"{recipient.name}: {recipient.sign_url}")

asyncio.run(send_contract())
```

### Synchronous Usage

```python
from turbodocx import TurboSign
import os

TurboSign.configure(api_key=os.environ["TURBODOCX_API_KEY"])

# Use sync_ prefix for synchronous methods
result = TurboSign.sync_prepare_for_signing_single(
    file_link="https://example.com/contract.pdf",
    recipients=[{"name": "John Doe", "email": "john@example.com", "order": 1}],
    fields=[
        {"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipient_order": 1}
    ]
)

print(f"Sign URL: {result.recipients[0].sign_url}")
```

### Using Template-Based Fields

```python
result = await TurboSign.prepare_for_signing_single(
    file_link="https://example.com/contract-with-placeholders.pdf",
    recipients=[{"name": "Alice Smith", "email": "alice@example.com", "order": 1}],
    fields=[
        {"type": "signature", "anchor": "{SIGNATURE_ALICE}", "width": 200, "height": 50, "recipient_order": 1},
        {"type": "date", "anchor": "{DATE_ALICE}", "width": 100, "height": 30, "recipient_order": 1}
    ]
)
```

---

## API Reference

### TurboSign.configure()

Configure the SDK with your API credentials.

```python
TurboSign.configure(
    api_key: str,           # Required: Your TurboDocx API key
    base_url: str = None,   # Optional: API base URL
    timeout: int = 30       # Optional: Request timeout in seconds
)
```

### prepare_for_review()

Upload a document for preview without sending signature request emails.

```python
result = await TurboSign.prepare_for_review(
    file_link="https://example.com/document.pdf",
    # or upload directly:
    # file=open("document.pdf", "rb"),
    document_name="Contract Draft",
    recipients=[{"name": "John Doe", "email": "john@example.com", "order": 1}],
    fields=[{"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipient_order": 1}]
)

print(result.document_id)
print(result.preview_url)
```

### prepare_for_signing_single()

Upload a document and immediately send signature requests.

```python
result = await TurboSign.prepare_for_signing_single(
    file_link="https://example.com/document.pdf",
    document_name="Service Agreement",
    sender_name="Your Company",
    sender_email="sender@company.com",
    recipients=[{"name": "Recipient Name", "email": "recipient@example.com", "order": 1}],
    fields=[{"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipient_order": 1}]
)
```

### get_status()

Check the status of a document and its recipients.

```python
status = await TurboSign.get_status("document-uuid")

print(status.status)  # 'pending', 'completed', or 'voided'
print(status.completed_at)

for recipient in status.recipients:
    print(f"{recipient.name}: {recipient.status}")
    print(f"Signed at: {recipient.signed_at}")
```

### download()

Download the completed signed document.

```python
pdf_bytes = await TurboSign.download("document-uuid")

# Save to file
with open("signed-contract.pdf", "wb") as f:
    f.write(pdf_bytes)

# Or upload to S3
import boto3
s3 = boto3.client("s3")
s3.put_object(Bucket="my-bucket", Key="signed-contract.pdf", Body=pdf_bytes)
```

### void()

Cancel/void a signature request.

```python
await TurboSign.void("document-uuid", reason="Contract terms changed")
```

### resend()

Resend signature request emails.

```python
# Resend to all pending recipients
await TurboSign.resend("document-uuid")

# Resend to specific recipients
await TurboSign.resend("document-uuid", recipient_ids=["recipient-uuid-1", "recipient-uuid-2"])
```

---

## Framework Examples

### FastAPI

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from turbodocx import TurboSign
import os

app = FastAPI()
TurboSign.configure(api_key=os.environ["TURBODOCX_API_KEY"])

class SendContractRequest(BaseModel):
    recipient_name: str
    recipient_email: str
    contract_url: str

class SendContractResponse(BaseModel):
    document_id: str
    sign_url: str

@app.post("/api/send-contract", response_model=SendContractResponse)
async def send_contract(request: SendContractRequest):
    try:
        result = await TurboSign.prepare_for_signing_single(
            file_link=request.contract_url,
            recipients=[{"name": request.recipient_name, "email": request.recipient_email, "order": 1}],
            fields=[{"type": "signature", "page": 1, "x": 100, "y": 650, "width": 200, "height": 50, "recipient_order": 1}]
        )
        return SendContractResponse(
            document_id=result.document_id,
            sign_url=result.recipients[0].sign_url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/document/{document_id}/status")
async def get_document_status(document_id: str):
    try:
        return await TurboSign.get_status(document_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Django

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from turbodocx import TurboSign
import json
import os

TurboSign.configure(api_key=os.environ["TURBODOCX_API_KEY"])

@csrf_exempt
@require_http_methods(["POST"])
def send_contract(request):
    data = json.loads(request.body)

    # Use sync version in Django (unless using async views)
    result = TurboSign.sync_prepare_for_signing_single(
        file_link=data["contract_url"],
        recipients=[{"name": data["recipient_name"], "email": data["recipient_email"], "order": 1}],
        fields=[{"type": "signature", "page": 1, "x": 100, "y": 650, "width": 200, "height": 50, "recipient_order": 1}]
    )

    return JsonResponse({
        "document_id": result.document_id,
        "sign_url": result.recipients[0].sign_url
    })

@require_http_methods(["GET"])
def document_status(request, document_id):
    status = TurboSign.sync_get_status(document_id)
    return JsonResponse({
        "status": status.status,
        "recipients": [
            {"name": r.name, "status": r.status}
            for r in status.recipients
        ]
    })
```

### Flask

```python
from flask import Flask, request, jsonify
from turbodocx import TurboSign
import os

app = Flask(__name__)
TurboSign.configure(api_key=os.environ["TURBODOCX_API_KEY"])

@app.route("/api/send-contract", methods=["POST"])
def send_contract():
    data = request.json

    result = TurboSign.sync_prepare_for_signing_single(
        file_link=data["contract_url"],
        recipients=[{"name": data["recipient_name"], "email": data["recipient_email"], "order": 1}],
        fields=[{"type": "signature", "page": 1, "x": 100, "y": 650, "width": 200, "height": 50, "recipient_order": 1}]
    )

    return jsonify({
        "document_id": result.document_id,
        "sign_url": result.recipients[0].sign_url
    })

@app.route("/api/document/<document_id>/status")
def document_status(document_id):
    status = TurboSign.sync_get_status(document_id)
    return jsonify(status.dict())

if __name__ == "__main__":
    app.run(debug=True)
```

---

## Error Handling

```python
from turbodocx import TurboSign
from turbodocx.exceptions import (
    TurboDocxError,
    UnauthorizedError,
    InvalidDocumentError,
    RateLimitedError,
    NotFoundError
)

try:
    result = await TurboSign.prepare_for_signing_single(...)
except UnauthorizedError:
    print("Invalid API key")
except InvalidDocumentError as e:
    print(f"Could not process document: {e.message}")
except RateLimitedError as e:
    print(f"Rate limited, retry after: {e.retry_after} seconds")
except NotFoundError:
    print("Document not found")
except TurboDocxError as e:
    print(f"Error {e.code}: {e.message}")
```

---

## Type Hints

The SDK includes full type annotations:

```python
from turbodocx.types import (
    SigningRequest,
    SigningResult,
    Recipient,
    Field,
    DocumentStatus,
    FieldType
)

# Type-safe field creation
field: Field = {
    "type": FieldType.SIGNATURE,
    "page": 1,
    "x": 100,
    "y": 500,
    "width": 200,
    "height": 50,
    "recipient_order": 1
}

# Type-safe recipient
recipient: Recipient = {
    "name": "John Doe",
    "email": "john@example.com",
    "order": 1
}
```

---

## Webhook Signature Verification

Verify that webhooks are genuinely from TurboDocx:

```python
from turbodocx import verify_webhook_signature
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.post("/webhook")
async def handle_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("x-turbodocx-signature")
    timestamp = request.headers.get("x-turbodocx-timestamp")

    is_valid = verify_webhook_signature(
        signature=signature,
        timestamp=timestamp,
        body=body,
        secret=os.environ["TURBODOCX_WEBHOOK_SECRET"]
    )

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid signature")

    event = json.loads(body)

    if event["event"] == "signature.document.completed":
        print(f"Document completed: {event['data']['document_id']}")
    elif event["event"] == "signature.document.voided":
        print(f"Document voided: {event['data']['document_id']}")

    return {"received": True}
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
- [PyPI Package](https://pypi.org/project/turbodocx-sdk/)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
