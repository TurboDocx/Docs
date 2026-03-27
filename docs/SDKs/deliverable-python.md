---
title: Python SDK
sidebar_position: 9
sidebar_label: "Deliverable: Python"
description: Official TurboDocx Deliverable Python SDK. Async-first design with type hints for document generation from templates.
keywords:
  - turbodocx deliverable python
  - document generation python
  - template api python
  - deliverable sdk python
  - asyncio deliverable
  - pip turbodocx
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python SDK

The official TurboDocx Deliverable SDK for Python applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically with async/await patterns and comprehensive error handling. Available on PyPI as `turbodocx-sdk`.

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
from turbodocx_sdk import Deliverable
import os

# Configure globally (recommended)
Deliverable.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],  # Required: Your TurboDocx API key
    org_id=os.environ["TURBODOCX_ORG_ID"],    # Required: Your organization ID
    # base_url="https://api.turbodocx.com"    # Optional: Override base URL
)
```

:::tip No Sender Email Required
Unlike TurboSign, the Deliverable module only requires `api_key` and `org_id` — no sender email or name is needed.
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

:::caution API Credentials Required
Both `api_key` and `org_id` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Generate a document from a template

```python
import asyncio
from turbodocx_sdk import Deliverable
import os

Deliverable.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"]
)

async def generate_report():
    # Generate a document from a template with variables
    result = await Deliverable.generate_deliverable(
        name="Q1 Report",
        template_id="your-template-id",
        variables=[
            {"placeholder": "{CompanyName}", "text": "Acme Corporation", "mimeType": "text"},
            {"placeholder": "{Date}", "text": "2026-03-12", "mimeType": "text"},
        ],
        description="Quarterly business report",
        tags=["reports", "quarterly"],
    )

    print("Result:", json.dumps(result, indent=2))

asyncio.run(generate_report())
```

### Download and manage deliverables

```python
import asyncio
from turbodocx_sdk import Deliverable
import os

Deliverable.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"]
)

async def manage_deliverables():
    # List deliverables with pagination
    items = await Deliverable.list_deliverables(limit=10, show_tags=True)
    print(f"Total: {items['totalRecords']}")

    # Get deliverable details
    details = await Deliverable.get_deliverable_details("deliverable-uuid")
    print(f"Name: {details['name']}")

    # Download source file (DOCX/PPTX)
    source_bytes = await Deliverable.download_source_file("deliverable-uuid")
    with open("report.docx", "wb") as f:
        f.write(source_bytes)

    # Download PDF
    pdf_bytes = await Deliverable.download_pdf("deliverable-uuid")
    with open("report.pdf", "wb") as f:
        f.write(pdf_bytes)

    # Update deliverable
    await Deliverable.update_deliverable_info(
        "deliverable-uuid",
        name="Q1 Report - Final",
        description="Final quarterly business report",
    )

    # Delete deliverable
    await Deliverable.delete_deliverable("deliverable-uuid")

asyncio.run(manage_deliverables())
```

---

## Variable Types

The Deliverable module supports four variable types for template injection:

### 1. Text Variables

Inject plain text values into template placeholders:

```python
variables = [
    {"placeholder": "{CompanyName}", "text": "Acme Corporation", "mimeType": "text"},
    {"placeholder": "{Date}", "text": "2026-03-12", "mimeType": "text"},
]
```

### 2. HTML Variables

Inject rich HTML content with formatting:

```python
variables = [
    {
        "placeholder": "{Summary}",
        "text": "<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>",
        "mimeType": "html",
    },
]
```

### 3. Image Variables

Inject images by providing a URL or base64-encoded content:

```python
variables = [
    {
        "placeholder": "{Logo}",
        "text": "https://example.com/logo.png",
        "mimeType": "image",
    },
]
```

### 4. Markdown Variables

Inject markdown content that gets converted to formatted text:

```python
variables = [
    {
        "placeholder": "{Notes}",
        "text": "## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.",
        "mimeType": "markdown",
    },
]
```

:::info Variable Stack
For repeating content (e.g., table rows), use `variableStack` instead of `text` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

---

## API Reference

### Configure

Configure the SDK with your API credentials and organization settings.

```python
Deliverable.configure(
    api_key: str,                                    # Required: Your TurboDocx API key
    org_id: str,                                     # Required: Your organization ID
    base_url: str = "https://api.turbodocx.com"     # Optional: API base URL
)
```

:::caution API Credentials Required
Both `api_key` and `org_id` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

### Generate deliverable

Generate a new document from a template with variable substitution.

```python
result = await Deliverable.generate_deliverable(
    name="Q1 Report",
    template_id="your-template-id",
    variables=[
        {"placeholder": "{CompanyName}", "text": "Acme Corp", "mimeType": "text"},
        {"placeholder": "{Date}", "text": "2026-03-12", "mimeType": "text"},
    ],
    description="Quarterly business report",
    tags=["reports", "quarterly"],
)

print("Result:", json.dumps(result, indent=2))
```

### List deliverables

List deliverables with pagination, search, and filtering.

```python
items = await Deliverable.list_deliverables(
    limit=10,
    offset=0,
    query="report",
    show_tags=True,
)

print("Result:", json.dumps(items, indent=2))
```

### Get deliverable details

Retrieve the full details of a single deliverable, including variables and fonts.

```python
details = await Deliverable.get_deliverable_details("deliverable-uuid", show_tags=True)

print("Result:", json.dumps(details, indent=2))
```

### Update deliverable info

Update a deliverable's name, description, or tags.

```python
result = await Deliverable.update_deliverable_info(
    "deliverable-uuid",
    name="Q1 Report - Final",
    description="Final quarterly business report",
    tags=["reports", "final"],
)

print("Result:", json.dumps(result, indent=2))
```

### Delete deliverable

Soft-delete a deliverable.

```python
result = await Deliverable.delete_deliverable("deliverable-uuid")

print("Result:", json.dumps(result, indent=2))
```

### Download source file

Download the original source file (DOCX or PPTX).

```python
source_bytes = await Deliverable.download_source_file("deliverable-uuid")

# Save to file
with open("report.docx", "wb") as f:
    f.write(source_bytes)
```

### Download PDF

Download the PDF version of a deliverable.

```python
pdf_bytes = await Deliverable.download_pdf("deliverable-uuid")

# Save to file
with open("report.pdf", "wb") as f:
    f.write(pdf_bytes)
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
| `NotFoundError`       | 404         | Deliverable or template not found   |
| `RateLimitError`      | 429         | Too many requests                   |
| `NetworkError`        | -           | Network connectivity issues         |

### Handling Errors

```python
from turbodocx_sdk import (
    Deliverable,
    TurboDocxError,
    AuthenticationError,
    ValidationError,
    NotFoundError,
    RateLimitError,
    NetworkError,
)

try:
    result = await Deliverable.generate_deliverable(
        name="Q1 Report",
        template_id="your-template-id",
        variables=[
            {"placeholder": "{CompanyName}", "text": "Acme Corp", "mimeType": "text"},
        ],
    )
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
    # Check your API key and org ID
except ValidationError as e:
    print(f"Validation error: {e}")
    # Check request parameters
except NotFoundError as e:
    print(f"Resource not found: {e}")
    # Template or deliverable doesn't exist
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

### DeliverableVariable

Variable configuration for template injection:

&nbsp;

| Property                 | Type              | Required | Description                                          |
| ------------------------ | ----------------- | -------- | ---------------------------------------------------- |
| `placeholder`            | `str`             | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `text`                   | `str`             | No\*     | Value to inject                                      |
| `mimeType`               | `str`             | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `isDisabled`             | `bool`            | No       | Skip this variable during generation                 |
| `subvariables`           | `list[dict]`      | No       | Nested sub-variables for HTML content                |
| `variableStack`          | `dict \| list`    | No       | Multiple instances for repeating content             |
| `aiPrompt`               | `str`             | No       | AI prompt for content generation (max 16,000 chars)  |

\*Required unless `variableStack` is provided or `isDisabled` is true.

### CreateDeliverableRequest

Request configuration for `generate_deliverable`:

&nbsp;

| Property        | Type         | Required | Description                                |
| --------------- | ------------ | -------- | ------------------------------------------ |
| `name`          | `str`        | Yes      | Deliverable name (3-255 characters)        |
| `template_id`   | `str`        | Yes      | Template ID to generate from               |
| `variables`     | `list[dict]` | Yes      | Variables for template substitution        |
| `description`   | `str`        | No       | Description (up to 65,535 characters)      |
| `tags`          | `list[str]`  | No       | Tag strings to associate                   |

### UpdateDeliverableRequest

Request configuration for `update_deliverable_info`:

&nbsp;

| Property      | Type        | Required | Description                              |
| ------------- | ----------- | -------- | ---------------------------------------- |
| `name`        | `str`       | No       | Updated name (3-255 characters)          |
| `description` | `str`       | No       | Updated description                      |
| `tags`        | `list[str]` | No       | Replace all tags (empty list to remove)  |

### ListDeliverablesOptions

Options for `list_deliverables`:

&nbsp;

| Property        | Type    | Required | Description                          |
| --------------- | ------- | -------- | ------------------------------------ |
| `limit`         | `int`   | No       | Results per page (1-100, default 6)  |
| `offset`        | `int`   | No       | Results to skip (default 0)          |
| `query`         | `str`   | No       | Search query to filter by name       |
| `show_tags`     | `bool`  | No       | Include tags in the response         |

### DeliverableRecord

The deliverable object returned by `list_deliverables`:

&nbsp;

| Property          | Type     | Description                           |
| ----------------- | -------- | ------------------------------------- |
| `id`              | `str`    | Unique deliverable ID (UUID)          |
| `name`            | `str`    | Deliverable name                      |
| `description`     | `str`    | Description text                      |
| `templateId`      | `str`    | Source template ID                    |
| `createdBy`       | `str`    | User ID of the creator                |
| `email`           | `str`    | Creator's email address               |
| `fileSize`        | `int`    | File size in bytes                    |
| `fileType`        | `str`    | MIME type of the generated file       |
| `defaultFont`     | `str`    | Default font used                     |
| `fonts`           | `list`   | Fonts used in the document            |
| `isActive`        | `bool`   | Whether the deliverable is active     |
| `createdOn`       | `str`    | ISO 8601 creation timestamp           |
| `updatedOn`       | `str`    | ISO 8601 last update timestamp        |
| `tags`            | `list`   | Associated tags (when `show_tags=True`)|

### DeliverableDetailRecord

The deliverable object returned by `get_deliverable_details`. Includes all fields from [DeliverableRecord](#deliverablerecord) **except `fileSize`**, plus:

&nbsp;

| Property             | Type         | Description                              |
| -------------------- | ------------ | ---------------------------------------- |
| `templateName`       | `str`        | Source template name                     |
| `templateNotDeleted` | `bool`       | Whether the source template still exists |
| `variables`          | `list[dict]` | Parsed variable objects with values      |

### Tag

Tag object included when `show_tags` is enabled. Each tag is a `dict` with:

| Key         | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| `id`        | `str`  | Tag unique identifier (UUID)         |
| `label`     | `str`  | Tag display name                     |
| `isActive`  | `bool` | Whether the tag is active            |
| `updatedOn` | `str`  | ISO 8601 last update timestamp       |
| `createdOn` | `str`  | ISO 8601 creation timestamp          |
| `createdBy` | `str`  | User ID of the tag creator           |
| `orgId`     | `str`  | Organization ID                      |

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[TurboDocx Templating](/docs/TurboDocx%20Templating/How%20to%20Create%20a%20Template)** - How to create and configure document templates
- **[Variable Reference](/docs/API/Deliverable%20API#variable-object-structure)** - Complete guide to variable types, formatting, and advanced injection options
- **[API Reference](/docs/API/Deliverable%20API)** - Full REST API documentation for Deliverable endpoints

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
- [PyPI Package](https://pypi.org/project/turbodocx-sdk/)
- [API Reference](/docs/API/Deliverable%20API)
