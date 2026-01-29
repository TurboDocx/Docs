---
title: Python SDK
sidebar_position: 3
sidebar_label: "TurboSign: Python"
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

The official TurboDocx SDK for Python applications. Build document generation and digital signature workflows with async/await patterns and comprehensive error handling. Available on PyPI as `turbodocx-sdk`.

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
from turbodocx_sdk import TurboSign
import os

# Configure globally (recommended)
TurboSign.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],  # Required: Your TurboDocx API key
    org_id=os.environ["TURBODOCX_ORG_ID"],    # Required: Your organization ID
    # base_url="https://api.turbodocx.com"    # Optional: Override base URL
)
```

:::tip Authentication
Authenticate using `api_key`. API keys are recommended for server-side applications.
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

:::warning API Credentials Required
Both `api_key` and `org_id` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Send a Document for Signature

```python
import asyncio
from turbodocx_sdk import TurboSign
import os

TurboSign.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"]
)

async def send_contract():
    result = await TurboSign.send_signature(
        recipients=[
            {"name": "Alice Smith", "email": "alice@example.com", "signingOrder": 1},
            {"name": "Bob Johnson", "email": "bob@example.com", "signingOrder": 2}
        ],
        fields=[
            # Alice's signature
            {"type": "signature", "page": 1, "x": 100, "y": 650, "width": 200, "height": 50, "recipientEmail": "alice@example.com"},
            {"type": "date", "page": 1, "x": 320, "y": 650, "width": 100, "height": 30, "recipientEmail": "alice@example.com"},
            # Bob's signature
            {"type": "signature", "page": 1, "x": 100, "y": 720, "width": 200, "height": 50, "recipientEmail": "bob@example.com"},
            {"type": "date", "page": 1, "x": 320, "y": 720, "width": 100, "height": 30, "recipientEmail": "bob@example.com"}
        ],
        file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
        document_name="Service Agreement",
        sender_name="Acme Corp",
        sender_email="contracts@acme.com",
    )

    print("Result:", json.dumps(result, indent=2))

asyncio.run(send_contract())
```

### Using Template-Based Fields

```python
result = await TurboSign.send_signature(
    recipients=[{"name": "Alice Smith", "email": "alice@example.com", "signingOrder": 1}],
    fields=[
        {
            "type": "signature",
            "recipientEmail": "alice@example.com",
            "template": {
                "anchor": "{SIGNATURE_ALICE}",
                "placement": "replace",
                "size": {"width": 200, "height": 50},
            },
        },
        {
            "type": "date",
            "recipientEmail": "alice@example.com",
            "template": {
                "anchor": "{DATE_ALICE}",
                "placement": "replace",
                "size": {"width": 100, "height": 30},
            },
        },
    ],
    file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
)

print("Result:", json.dumps(result, indent=2))
```

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.
:::

---

## File Input Methods

TurboSign supports four different ways to provide document files:

### 1. File Upload (bytes)

```python
with open("./contract.pdf", "rb") as f:
    pdf_buffer = f.read()

result = await TurboSign.send_signature(
    file=pdf_buffer,
    recipients=[
        {"name": "John Doe", "email": "john@example.com", "signingOrder": 1},
    ],
    fields=[
        {
            "type": "signature",
            "page": 1,
            "x": 100,
            "y": 650,
            "width": 200,
            "height": 50,
            "recipientEmail": "john@example.com",
        },
    ],
)
```

### 2. File URL (file_link)

```python
result = await TurboSign.send_signature(
    file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
    recipients=[
        {"name": "John Doe", "email": "john@example.com", "signingOrder": 1},
    ],
    fields=[
        {
            "type": "signature",
            "page": 1,
            "x": 100,
            "y": 650,
            "width": 200,
            "height": 50,
            "recipientEmail": "john@example.com",
        },
    ],
)
```

:::tip When to use file_link
Use `file_link` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

### 3. TurboDocx Deliverable ID

```python
# Use a previously generated TurboDocx document
result = await TurboSign.send_signature(
    deliverable_id="deliverable-uuid-from-turbodocx",
    recipients=[
        {"name": "John Doe", "email": "john@example.com", "signingOrder": 1},
    ],
    fields=[
        {
            "type": "signature",
            "page": 1,
            "x": 100,
            "y": 650,
            "width": 200,
            "height": 50,
            "recipientEmail": "john@example.com",
        },
    ],
)
```

:::info Integration with TurboDocx
`deliverable_id` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

### 4. TurboDocx Template ID

```python
# Use a pre-configured TurboSign template
result = await TurboSign.send_signature(
    template_id="template-uuid-from-turbodocx",  # Template already contains anchors
    recipients=[
        {"name": "Alice Smith", "email": "alice@example.com", "signingOrder": 1},
    ],
    fields=[
        {
            "type": "signature",
            "recipientEmail": "alice@example.com",
            "template": {
                "anchor": "{SIGNATURE_ALICE}",
                "placement": "replace",
                "size": {"width": 200, "height": 50},
            },
        },
    ],
)
```

:::info Integration with TurboDocx
`template_id` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

---

## API Reference

### Configure

Configure the SDK with your API credentials and organization settings.

```python
TurboSign.configure(
    api_key: str,                                    # Required: Your TurboDocx API key
    org_id: str,                                     # Required: Your organization ID
    base_url: str = "https://api.turbodocx.com"     # Optional: API base URL
)
```

### Prepare for review

Upload a document for preview without sending signature request emails.

```python
result = await TurboSign.create_signature_review_link(
    recipients=[{"name": "John Doe", "email": "john@example.com", "signingOrder": 1}],
    fields=[{"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipientEmail": "john@example.com"}],
    file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
    document_name="Contract Draft",
)

print(result["documentId"])
print(result["previewUrl"])
```

### Prepare for signing

Upload a document and immediately send signature requests to all recipients.

```python
result = await TurboSign.send_signature(
    recipients=[{"name": "Recipient Name", "email": "recipient@example.com", "signingOrder": 1}],
    fields=[{"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipientEmail": "recipient@example.com"}],
    file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
    document_name="Service Agreement",
    sender_name="Your Company",
    sender_email="sender@company.com",
)

print(result["documentId"])
```

### Get status

Retrieve the current status of a document.

```python
result = await TurboSign.get_status("document-uuid")

print("Result:", json.dumps(result, indent=2))
```

### Download document

Download the completed signed document as PDF bytes.

```python
pdf_bytes = await TurboSign.download("document-uuid")

# Save to file
with open("signed-contract.pdf", "wb") as f:
    f.write(pdf_bytes)
```

### Void

Cancel/void a signature request.

```python
result = await TurboSign.void_document("document-uuid", reason="Contract terms changed")
```

### Resend

Resend signature request emails to specific recipients.

```python
result = await TurboSign.resend_email("document-uuid", recipient_ids=["recipient-uuid-1", "recipient-uuid-2"])
```

### Get audit trail

Retrieve the complete audit trail for a document, including all events and actions.

```python
result = await TurboSign.get_audit_trail("document-uuid")

print("Result:", json.dumps(result, indent=2))
```

---

## Error Handling

The SDK provides typed error classes for different failure scenarios. All errors extend the base `TurboDocxError` class.

### Error Classes

| Error Class           | Status Code | Description                         |
| --------------------- | ----------- | ----------------------------------- |
| `TurboDocxError`      | varies      | Base error class for all SDK errors |
| `AuthenticationError` | 401         | Invalid or missing API credentials  |
| `ValidationError`     | 400         | Invalid request parameters          |
| `NotFoundError`       | 404         | Document or resource not found      |
| `RateLimitError`      | 429         | Too many requests                   |
| `NetworkError`        | -           | Network connectivity issues         |

### Handling Errors

```python
from turbodocx_sdk import (
    TurboSign,
    TurboDocxError,
    AuthenticationError,
    ValidationError,
    NotFoundError,
    RateLimitError,
    NetworkError,
)

try:
    result = await TurboSign.send_signature(
        recipients=[{"name": "John Doe", "email": "john@example.com", "signingOrder": 1}],
        fields=[{
            "type": "signature",
            "page": 1,
            "x": 100,
            "y": 650,
            "width": 200,
            "height": 50,
            "recipientEmail": "john@example.com",
        }],
        file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
    )
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
    # Check your API key and org ID
except ValidationError as e:
    print(f"Validation error: {e}")
    # Check request parameters
except NotFoundError as e:
    print(f"Resource not found: {e}")
    # Document or recipient doesn't exist
except RateLimitError as e:
    print(f"Rate limited: {e}")
    # Wait and retry
except NetworkError as e:
    print(f"Network error: {e}")
    # Check connectivity
except TurboDocxError as e:
    print(f"SDK error: {e}, status_code={e.status_code}, code={e.code}")
```

### Error Properties

All errors include these properties:

| Property      | Type          | Description                                         |
| ------------- | ------------- | --------------------------------------------------- |
| `message`     | `str`         | Human-readable error description (via `str(error)`) |
| `status_code` | `int \| None` | HTTP status code (if applicable)                    |
| `code`        | `str \| None` | Machine-readable error code                         |

---

## Python Types

The SDK uses Python type hints with `Dict[str, Any]` for flexible JSON-like structures.

### Importing Types

```python
from typing import Dict, List, Any, Optional
```

### SignatureFieldType

String literal values for field types:

```python
# Available field type values
field_types = [
    "signature",
    "initial",
    "date",
    "text",
    "full_name",
    "title",
    "company",
    "first_name",
    "last_name",
    "email",
    "checkbox",
]
```

### Recipient

Recipient configuration for signature requests:

&nbsp;

| Property       | Type  | Required | Description               |
| -------------- | ----- | -------- | ------------------------- |
| `name`         | `str` | Yes      | Recipient's full name     |
| `email`        | `str` | Yes      | Recipient's email address |
| `signingOrder` | `int` | Yes      | Signing order (1-indexed) |

```python
recipient: Dict[str, Any] = {
    "name": "John Doe",
    "email": "john@example.com",
    "signingOrder": 1
}
```

### Field

Field configuration supporting both coordinate-based and template-based positioning:

&nbsp;

| Property          | Type   | Required | Description                                         |
| ----------------- | ------ | -------- | --------------------------------------------------- |
| `type`            | `str`  | Yes      | Field type (see SignatureFieldType)                 |
| `recipientEmail`  | `str`  | Yes      | Which recipient fills this field                    |
| `page`            | `int`  | No\*     | Page number (1-indexed)                             |
| `x`               | `int`  | No\*     | X coordinate in pixels                              |
| `y`               | `int`  | No\*     | Y coordinate in pixels                              |
| `width`           | `int`  | No\*     | Field width in pixels                               |
| `height`          | `int`  | No\*     | Field height in pixels                              |
| `defaultValue`    | `str`  | No       | Default value (for checkbox: `"true"` or `"false"`) |
| `isMultiline`     | `bool` | No       | Enable multiline text                               |
| `isReadonly`      | `bool` | No       | Make field read-only (pre-filled)                   |
| `required`        | `bool` | No       | Whether field is required                           |
| `backgroundColor` | `str`  | No       | Background color (hex, rgb, or named)               |
| `template`        | `Dict` | No       | Template anchor configuration                       |

\*Required when not using template anchors

**Template Configuration:**

| Property        | Type   | Required | Description                                                      |
| --------------- | ------ | -------- | ---------------------------------------------------------------- |
| `anchor`        | `str`  | Yes      | Text anchor pattern like `{TagName}`                             |
| `placement`     | `str`  | Yes      | `"replace"` \| `"before"` \| `"after"` \| `"above"` \| `"below"` |
| `size`          | `Dict` | Yes      | `{ "width": int, "height": int }`                                |
| `offset`        | `Dict` | No       | `{ "x": int, "y": int }`                                         |
| `caseSensitive` | `bool` | No       | Case sensitive search (default: False)                           |
| `useRegex`      | `bool` | No       | Use regex for anchor/searchText (default: False)                 |

```python
field: Dict[str, Any] = {
    "type": "signature",
    "page": 1,
    "x": 100,
    "y": 500,
    "width": 200,
    "height": 50,
    "recipientEmail": "john@example.com"
}
```

### Request Parameters

Request configuration for `create_signature_review_link` and `send_signature` methods:

&nbsp;

| Parameter              | Type         | Required    | Description                    |
| ---------------------- | ------------ | ----------- | ------------------------------ |
| `recipients`           | `List[Dict]` | Yes         | Recipients who will sign       |
| `fields`               | `List[Dict]` | Yes         | Signature fields configuration |
| `file`                 | `bytes`      | Conditional | PDF file content as bytes      |
| `file_link`            | `str`        | Conditional | URL to document file           |
| `deliverable_id`       | `str`        | Conditional | TurboDocx deliverable ID       |
| `template_id`          | `str`        | Conditional | TurboDocx template ID          |
| `document_name`        | `str`        | No          | Document name                  |
| `document_description` | `str`        | No          | Document description           |
| `sender_name`          | `str`        | No          | Sender name                    |
| `sender_email`         | `str`        | No          | Sender email                   |
| `cc_emails`            | `List[str]`  | No          | Array of CC email addresses    |

:::info File Source (Conditional)
Exactly one file source is required: `file`, `file_link`, `deliverable_id`, or `template_id`.
:::

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[Request Body Reference](/docs/TurboSign/API%20Signatures#request-body-multipartform-data)** - Complete request body parameters, file sources, and multipart/form-data structure
- **[Recipients Reference](/docs/TurboSign/API%20Signatures#recipients-reference)** - Recipient properties, signing order, metadata, and configuration options
- **[Field Types Reference](/docs/TurboSign/API%20Signatures#field-types-reference)** - All available field types (signature, date, text, checkbox, etc.) with properties and behaviors
- **[Field Positioning Methods](/docs/TurboSign/API%20Signatures#field-positioning-methods)** - Template-based vs coordinate-based positioning, anchor configuration, and best practices

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
- [PyPI Package](https://pypi.org/project/turbodocx-sdk/)
- [API Reference](/docs/TurboSign/API%20Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
