---
title: TurboQuote Python SDK
sidebar_position: 20
sidebar_label: "TurboQuote: Python"
description: Official TurboDocx TurboQuote SDK for Python. Create, manage, and send quotes/proposals with full CPQ capabilities — line items, products, bundles, price books, companies, contacts, and quote templates, all via async Python 3.9+.
keywords:
  - turboquote python
  - quote sdk python
  - proposal sdk python
  - cpq python
  - turbodocx quote python
  - asyncio turboquote
  - pip turbodocx
  - quote line items python
  - price book python
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboQuote Python SDK

<QuickstartSkillNudge command="/turbodocx-sdk turboquote" product="TurboQuote" />

The official TurboDocx TurboQuote SDK for Python applications. Build full CPQ (configure, price, quote) workflows: create quotes, add product and bundle line items, apply price books, send proposals to contacts, and download PDF exports — all from async Python 3.9+. Distributed on PyPI as `turbodocx-sdk` (same package as TurboSign, TurboWebhooks, and Deliverable).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's quoting and proposal engine. It covers the full quote lifecycle — draft, send, accept/decline/void — with a product catalog, bundle groupings, price books, company/contact CRM, and customizable quote templates. Quotes can be sent with an attached Deliverable document for a branded proposal experience.
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
- `httpx` (installed automatically as a dependency)
- A TurboDocx API key (`TDX-` prefix) — generate one in **Settings → API Keys**
- All SDK methods are `async` — call them from an `async def` (or wrap with `asyncio.run(...)` in synchronous contexts)

## Configuration

```python
import os
from turbodocx_sdk import TurboQuote

TurboQuote.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"],  # optional — auto-reads env var
)
```

:::tip No sender email required
Unlike TurboSign, `TurboQuote.configure()` does **not** require `sender_email` or `sender_name`. Quotes are not signature emails. Only `api_key` and, optionally, `org_id` are needed.

If you skip the explicit call, the SDK lazily auto-configures itself from `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` on first method invocation.
:::

### Environment Variables

```bash
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

## Quick Start

### Create a quote, add line items, send, and download the PDF

```python
import asyncio
import os
from turbodocx_sdk import TurboQuote

TurboQuote.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"],
)


async def full_quote_lifecycle():
    # 1. Create a draft quote
    quote = await TurboQuote.create_quote({
        "name": "Acme Corp — Annual Plan Q3",
        "companyId": "company-uuid",
        "contactId": "contact-uuid",
        "validUntil": "2026-09-30",
        "currency": "USD",
    })
    quote_id = quote["id"]
    print(f"Created quote {quote_id}")

    # 2. Add product line items
    items = await TurboQuote.add_line_items(quote_id, [
        {
            "productId": "product-uuid-1",
            "productName": "Platform License",
            "quantity": 5,
            "unitPrice": "199.00",
            "billingFrequency": "annual",
        },
        {
            "productId": "product-uuid-2",
            "productName": "Onboarding Package",
            "quantity": 1,
            "unitPrice": "499.00",
            "billingFrequency": "one-time",
        },
    ])
    print(f"Added {len(items)} line items")

    # 3. Apply a price book (optional)
    result = await TurboQuote.apply_price_book(quote_id, "pricebook-uuid")
    print(f"Price book applied: {result['updatedCount']} items updated")

    # 4. Send the quote
    sent = await TurboQuote.send_quote(quote_id, {
        "ccEmails": ["manager@acme.com"],
        "validUntil": "2026-09-30",
    })
    print(f"Sent: {sent['message']}")

    # 5. Download the PDF
    pdf_bytes = await TurboQuote.download_quote_pdf(quote_id)
    with open("acme-quote.pdf", "wb") as f:
        f.write(pdf_bytes)
    print(f"PDF saved ({len(pdf_bytes)} bytes)")


asyncio.run(full_quote_lifecycle())
```

### Convenience: create, add items, and send in one call

```python
result = await TurboQuote.create_and_send({
    "name": "Acme Corp — Quick Proposal",
    "companyId": "company-uuid",
    "contactId": "contact-uuid",
    "currency": "USD",
    "items": [
        {"productId": "product-uuid-1", "productName": "Platform License", "quantity": 3, "unitPrice": "299.00", "billingFrequency": "monthly"},
    ],
    "bundleItems": [
        {"bundleId": "bundle-uuid-1", "bundleName": "Starter Pack", "quantity": 1},
    ],
    "send": {
        "ccEmails": ["cc@example.com"],
        "validUntil": "2026-09-30",
    },
})
print(f"Quote sent: {result['quote']['id']}")
```

---

## Method Reference

All methods are `@classmethod`s on `TurboQuote`; configure once, then call on the class.

### Quotes

#### `list_quotes`

```python
page = await TurboQuote.list_quotes({
    "limit": 20,
    "offset": 0,
    "query": "acme",
    "statuses": ["draft", "sent"],  # repeated-key filter
})
# page["results"], page["totalRecords"], page["stats"]
```

#### `create_quote`

```python
quote = await TurboQuote.create_quote({
    "name": "Q3 Proposal",
    "companyId": "company-uuid",   # required
    "contactId": "contact-uuid",   # required
    "currency": "USD",
    "validUntil": "2026-09-30",
    "notes": "Includes implementation services",
    "taxRate": "8.5",
})
# returns Quote dict
```

#### `get_quote`

Returns the quote with `statusInfo` merged in when the quote is in a terminal state.

```python
quote = await TurboQuote.get_quote("quote-uuid")
# quote["status"], quote["grandTotal"], quote.get("statusInfo")
```

#### `update_quote`

All fields are optional — pass only what changes. Send an explicit `None` to clear a nullable field.

```python
updated = await TurboQuote.update_quote("quote-uuid", {
    "name": "Q3 Proposal — Revised",
    "validUntil": "2026-10-15",
    "taxRate": None,  # clears the field
})
```

#### `delete_quote`

```python
result = await TurboQuote.delete_quote("quote-uuid")
# result["message"]
```

#### `duplicate_quote`

```python
new_quote = await TurboQuote.duplicate_quote("quote-uuid")
# returns new Quote in draft status
```

#### `download_quote_pdf`

Returns raw PDF bytes.

```python
pdf_bytes = await TurboQuote.download_quote_pdf("quote-uuid")
with open("quote.pdf", "wb") as f:
    f.write(pdf_bytes)
```

---

### Quote Numbering Configuration

Customize the per-org quote number format: prefix, year/month tokens, separator, zero-padding, suffix, starting number, and reset cadence. Both methods are **admin only**; a non-admin API key receives a `403`.

#### `get_quote_number_config`

Fetch the org's current quote numbering format and the current per-period issued floor.

```python
config = await TurboQuote.get_quote_number_config()
print(config["format"]["prefix"])   # e.g. "Q-"
print(config["currentFloor"])       # the current per-period issued floor
```

#### `update_quote_number_config`

Update the numbering format. Pass the full format object; all eight fields are required. Keys stay camelCase.

```python
config = await TurboQuote.update_quote_number_config({
    "prefix": "INV",
    "yearToken": "none",       # "none" | "two" | "four"
    "monthToken": "off",       # "off" | "two"
    "separator": "-",
    "padWidth": 4,             # 0–12
    "suffix": "",
    "startNumber": 1000,       # >= 0
    "resetCadence": "never",   # "never" | "yearly" | "monthly"
})
print(config["format"]["startNumber"])  # 1000
```

---

### Quote Status Transitions

#### `send_quote`

```python
sent = await TurboQuote.send_quote("quote-uuid", {
    "ccEmails": ["manager@example.com"],
    "validUntil": "2026-09-30",
})
# sent["quote"], sent["message"]
```

#### `send_quote_with_deliverable`

Attach a TurboDocx-generated document to the sent quote.

```python
result = await TurboQuote.send_quote_with_deliverable("quote-uuid", {
    "deliverableId": "deliverable-uuid",
    "ccEmails": ["manager@example.com"],
})
# result["quote"], result["message"], result["documentId"]
```

#### `decline_quote`

```python
quote = await TurboQuote.decline_quote("quote-uuid", {
    "reason": "Customer selected a competitor",
})
```

#### `void_quote`

```python
quote = await TurboQuote.void_quote("quote-uuid", {
    "reason": "Terms expired before acceptance",
})
```

#### `handle_expired_quote`

```python
quote = await TurboQuote.handle_expired_quote("quote-uuid", {
    "action": "void",             # "void" or "decline"
    "reason": "Quote expired",
    "newValidUntil": "2026-12-31",  # optional — extend before re-sending
})
```

---

### Price Books (on a Quote)

#### `apply_price_book`

Apply a price book to an existing quote; updates matching line item prices.

```python
result = await TurboQuote.apply_price_book("quote-uuid", "pricebook-uuid")
# result["quote"]        — updated Quote
# result["updatedCount"] — int, items that were re-priced
# result["skippedCount"] — int, items that had no pricebook match
# result["message"]
```

#### `remove_price_book`

```python
quote = await TurboQuote.remove_price_book("quote-uuid")
```

---

### Line Items

#### `list_line_items`

```python
page = await TurboQuote.list_line_items("quote-uuid", {"limit": 50})
# page["results"], page["totalRecords"]
```

#### `add_line_items`

Accepts a single item dict or a list. Returns a list of created `LineItem` dicts.

```python
items = await TurboQuote.add_line_items("quote-uuid", [
    {
        "productId": "product-uuid",
        "productName": "Platform License",
        "quantity": 2,
        "unitPrice": "199.00",
        "billingFrequency": "annual",
        "discountPercent": "10.0",
    }
])
```

#### `add_bundle_line_items`

```python
items = await TurboQuote.add_bundle_line_items("quote-uuid", [
    {
        "bundleId": "bundle-uuid",
        "quantity": 1,
    }
])
```

#### `update_line_item`

```python
item = await TurboQuote.update_line_item("quote-uuid", "item-uuid", {
    "quantity": 5,
    "unitPrice": "179.00",
})
```

#### `remove_line_item`

```python
result = await TurboQuote.remove_line_item("quote-uuid", "item-uuid")
# result["message"]
```

---

### Products

| Method | Signature | Returns |
|---|---|---|
| `list_products` | `(options?)` | paginated list |
| `create_product` | `(request)` | `Product` |
| `get_product` | `(id)` | `Product` |
| `update_product` | `(id, request)` | `Product` |
| `delete_product` | `(id)` | `{"message": ...}` |
| `duplicate_product` | `(id)` | `Product` |
| `get_product_primary_images` | `(product_ids)` | `{id: image \| None}` |

```python
# Create a product with images (multipart upload auto-detected)
product = await TurboQuote.create_product({
    "name": "Enterprise License",
    "listPrice": "499.00",
    "cost": "200.00",
    "billingFrequency": "annual",
    "showInCatalog": True,
    "images": ["/path/to/product-photo.png"],  # file path(s) or bytes
})

# List products with filters
page = await TurboQuote.list_products({
    "limit": 20,
    "query": "enterprise",
    "showInCatalog": True,
})

# Bulk fetch primary images for a set of product IDs
images = await TurboQuote.get_product_primary_images(["id-1", "id-2", "id-3"])
# images["id-1"] → ProductImage dict, or None
```

---

### Bundles

| Method | Signature | Returns |
|---|---|---|
| `list_bundles` | `(options?)` | paginated list |
| `create_bundle` | `(request)` | `Bundle` |
| `get_bundle` | `(id)` | `Bundle` |
| `update_bundle` | `(id, request)` | `Bundle` |
| `delete_bundle` | `(id)` | `{"message": ...}` |
| `duplicate_bundle` | `(id)` | `Bundle` |

```python
bundle = await TurboQuote.create_bundle({
    "name": "Starter Pack",
    "items": [
        {"productId": "product-uuid-1", "quantity": 1},
        {"productId": "product-uuid-2", "quantity": 2},
    ],
    "discountPercent": "5.0",
})
```

---

### Price Books

| Method | Signature | Returns |
|---|---|---|
| `list_price_books` | `(options?)` | paginated list |
| `create_price_book` | `(request)` | `PriceBook` |
| `get_price_book` | `(id)` | `PriceBook` |
| `update_price_book` | `(id, request)` | `PriceBook` |
| `delete_price_book` | `(id)` | `{"message": ...}` |
| `duplicate_price_book` | `(id)` | `PriceBook` |
| `list_price_book_products` | `(id, options?)` | paginated list |

```python
# name, priceBookTypeId, and validFrom are REQUIRED.
# discountPercent is optional and defaults to 0 if not provided.
# priceBookTypeId comes from a create_type with categoryType "pricebook_type".
pricebook = await TurboQuote.create_price_book({
    "name": "Partner Tier A",
    "priceBookTypeId": "pricebook-type-uuid",
    "validFrom": "2026-01-01",
    "discountPercent": 15,
    "isDefault": False,
    "productPricing": [
        {"productId": "product-uuid-1", "discountType": "percent", "discountPercent": 25},
        {"productId": "product-uuid-2", "discountType": "percent", "discountPercent": 30},
    ],
})

# List products attached to a price book
page = await TurboQuote.list_price_book_products("pricebook-uuid", {"limit": 50})
```

---

### Companies

| Method | Signature | Returns |
|---|---|---|
| `list_companies` | `(options?)` | paginated list |
| `create_company` | `(request)` | `Company` |
| `get_company` | `(id)` | `Company` |
| `update_company` | `(id, request)` | `Company` |
| `delete_company` | `(id)` | `{"message": ...}` |
| `list_company_contacts` | `(company_id, options?)` | paginated list |

```python
company = await TurboQuote.create_company({
    "name": "Acme Corporation",
    "domain": "acme.com",
    "contacts": [  # at least one contact required
        {
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "jane@acme.com",
        }
    ],
})

# List contacts for a company
contacts = await TurboQuote.list_company_contacts(company["id"])
```

---

### Contacts

| Method | Signature | Returns |
|---|---|---|
| `list_contacts` | `(options?)` | paginated list |
| `create_contact` | `(request)` | `Contact` |
| `update_contact` | `(id, request)` | `Contact` |
| `delete_contact` | `(id)` | `{"message": ...}` |

:::note No `get_contact` by design
The backend has no `GET /v1/contacts/:id` endpoint. Fetch individual contacts via `list_company_contacts` or `list_contacts` with a query filter.
:::

```python
contact = await TurboQuote.create_contact({
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@acme.com",
    "companyId": "company-uuid",
})
```

---

### Quote Templates

| Method | Signature | Returns |
|---|---|---|
| `list_templates` | `(options?)` | paginated list |
| `get_template` | `()` | singleton `QuoteTemplate` |
| `get_template_by_id` | `(id)` | `QuoteTemplate` |
| `create_template` | `(request)` | `QuoteTemplate` |
| `update_template` | `(id, request)` | `QuoteTemplate` |
| `delete_template` | `(id)` | `{"message": ...}` |

```python
# Get the org's default quote template (singleton endpoint)
default_template = await TurboQuote.get_template()

# Get a specific template
template = await TurboQuote.get_template_by_id("template-uuid")
```

---

### Types / Categories

| Method | Signature | Returns |
|---|---|---|
| `list_types` | `(options?)` | paginated list |
| `create_type` | `(request)` | `QuoteType` |
| `update_type` | `(id, request)` | `QuoteType` |
| `delete_type` | `(id)` | `{"message": ...}` |

:::note No `get_type` by design
The backend has no `GET /v1/types/:id` endpoint. Use `list_types` to retrieve individual type records.
:::

```python
quote_type = await TurboQuote.create_type({"name": "New Business"})

await TurboQuote.update_type(quote_type["id"], {"name": "New Logo Business"})
```

---

### Convenience

#### `create_and_send`

Orchestrates multiple API calls: create quote → add product items → add bundle items → send. Returns `{"quote": <sent Quote>}`.

```python
result = await TurboQuote.create_and_send({
    # CreateQuote fields
    "name": "Year-End Renewal",
    "companyId": "company-uuid",
    "contactId": "contact-uuid",
    "currency": "USD",
    # optional line items added before send
    "items": [
        {"productId": "product-uuid-1", "productName": "Platform License", "quantity": 10, "unitPrice": "99.00", "billingFrequency": "monthly"},
    ],
    # optional bundle items added before send
    "bundleItems": [
        {"bundleId": "bundle-uuid-1", "bundleName": "Starter Pack", "quantity": 1},
    ],
    # send options (ccEmails, validUntil)
    "send": {
        "ccEmails": ["finance@example.com"],
        "validUntil": "2026-12-31",
    },
})
print(result["quote"]["id"])
```

---

## Error Handling

```python
from turbodocx_sdk import (
    TurboDocxError,
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    NetworkError,
)

try:
    quote = await TurboQuote.create_quote({
        "name": "Q3 Proposal",
        "companyId": "company-uuid",
        "contactId": "contact-uuid",
    })
except ValidationError as e:
    # 400 — missing required fields, invalid enum value, etc.
    print(f"Validation failed: {e}")
except AuthenticationError:
    # 401 — bad or revoked API key
    pass
except AuthorizationError:
    # 403 — key valid but lacks permission for this org/action
    pass
except NotFoundError as e:
    # 404 — company, contact, or product not found
    print(f"Not found: {e}")
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

### Error Code Reference

| Status | Class | When |
|---|---|---|
| 400 | `ValidationError` | Invalid fields, missing required keys, bad enum value |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without permission for this operation |
| 404 | `NotFoundError` | Quote, product, company, or other resource not found |
| 409 | `ConflictError` | Duplicate resource (e.g., company domain conflict) |
| 429 | `RateLimitError` | Rate limit exceeded — back off |

---

## See Also

- [TurboQuote JavaScript / TypeScript SDK](/docs/SDKs/quote-javascript) — same API, JS idioms
- [TurboSign Python SDK](/docs/SDKs/python) — send documents for e-signature
- [TurboWebhooks Python SDK](/docs/SDKs/webhooks-python) — receive real-time signature events
- [Deliverable Python SDK](/docs/SDKs/deliverable-python) — generate documents from templates
- [SDKs Overview](/docs/SDKs) — all SDKs across all languages
- [turbodocx-sdk on PyPI](https://pypi.org/project/turbodocx-sdk/)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
