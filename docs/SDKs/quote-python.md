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
# Fixed-term quote — termDays is -1 or 0–3650; omit it to get the default of 60.
quote = await TurboQuote.create_quote({
    "name": "Q3 Proposal",
    "companyId": "company-uuid",   # required
    "contactId": "contact-uuid",   # required
    "currency": "USD",
    "termDays": 30,                # fixed term — do NOT send renewalPeriod with this
    "validUntil": "2026-09-30",
    "notes": "Includes implementation services",
    "taxRate": "8.5",
})
# returns Quote dict

# Auto-renewal quote — termDays -1 REQUIRES renewalPeriod.
subscription = await TurboQuote.create_quote({
    "name": "Annual Subscription",
    "companyId": "company-uuid",
    "contactId": "contact-uuid",
    "currency": "USD",
    "termDays": -1,                # -1 = auto-renewal
    "renewalPeriod": "annually",   # "weekly" | "monthly" | "quarterly" | "annually"
})
```

:::caution `termDays` and `renewalPeriod` are coupled
`termDays` defaults to **60** when omitted. Valid values are `-1` (auto-renewal) or `0`–`3650` (`0` = one-time).

`renewalPeriod` is **required** when `termDays` is `-1`, and must be **`None` or absent** for every other `termDays` value — sending it alongside a fixed term returns a `400`. The same rule applies on `update_quote`.
:::

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

#### Field reference, defaults & validation

All eight `format` keys are sent on every update. The API enforces these caps and allowed values — a violation returns `400`:

| Field | Type | Allowed / range | Default |
|-------|------|-----------------|---------|
| `prefix` | string | ≤ 12 characters | `"Q"` |
| `yearToken` | enum | `none` \| `two` \| `four` | `four` |
| `monthToken` | enum | `off` \| `two` | `off` |
| `separator` | string | ≤ 4 characters | `"-"` |
| `padWidth` | integer | `0`–`12` (`0` = no padding) | `5` |
| `suffix` | string | ≤ 12 characters | `""` |
| `startNumber` | integer | `0`–`1000000000` | `1` |
| `resetCadence` | enum | `never` \| `yearly` \| `monthly` | `yearly` |

An org that has never configured numbering uses the **default format** above, which renders like `Q-2026-00001`.

Beyond the per-field caps, the API rejects self-inconsistent formats with a `400`:

- `resetCadence: "yearly"` requires a year token (`yearToken` other than `none`) — otherwise numbers repeat across years.
- `resetCadence: "monthly"` requires **both** a year token and a month token (`monthToken: "two"`).
- The rendered quote number must be ≤ 256 characters.

`currentFloor` (returned by both methods) is read-only — the sequence the next quote will use for the current period — and is never sent on update.

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

Handles a quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on `action` — and then **creates a duplicate carrying `newValidUntil`** as its new validity date. The returned quote is the new duplicate; the original stays terminal.

All three keys are **required**: `action` (`"void"` or `"decline"`), `reason` (max 190 characters), and `newValidUntil` (ISO date).

```python
quote = await TurboQuote.handle_expired_quote("quote-uuid", {
    "action": "void",               # required — "void" or "decline" only
    "reason": "Quote expired",      # required — max 190 characters
    "newValidUntil": "2026-12-31",  # required — ISO date carried onto the duplicate
})
```

:::warning There is no `extend` or `resend` action
`action` accepts **only** `"void"` and `"decline"`. `"extend"` and `"resend"` do not exist in the API and return a `400`. Extending is what the endpoint already does — pass `newValidUntil` and it lands on the duplicate it creates.
:::

:::note Terminal statuses
`accepted`, `declined`, and `voided` are **terminal** — a quote in one of these states cannot be transitioned out of it, and any further status call returns a `400`. Check `quote["statusInfo"]` before attempting a transition, and use `duplicate_quote` when you need to revive a closed-out quote.
:::

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

Accepts a single item dict **or** a list of up to **50** items. Returns a list of created `LineItem` dicts.

`productId`, `productName`, `unitPrice`, and `billingFrequency` are all **required** on every row. `productId` is special: the key must be **present**, but its value may be `None` for a custom (freeform) line item — omitting the key entirely returns a `400`. `quantity` is optional and defaults to `1`.

```python
items = await TurboQuote.add_line_items("quote-uuid", [
    {
        "productId": "product-uuid",     # required key — None for a custom line item
        "productName": "Platform License",
        "quantity": 2,
        "unitPrice": "199.00",
        "billingFrequency": "annual",
        "discountPercent": "10.0",
    },
    {
        "productId": None,               # custom (freeform) line item — key still required
        "productName": "Implementation Credit",
        "unitPrice": "-250.00",
        "billingFrequency": "one-time",
    },
])
```

:::note List caps
`add_line_items` accepts a single dict **or** a list of 1–**50** items. A reorder request accepts up to **200** items. Exceeding either cap returns a `400`.
:::

#### `add_bundle_line_items`

`bundleId` and `bundleName` are both **required**; the server expands the bundle's child products for you. Accepts a single dict or a list of up to **50** items.

```python
items = await TurboQuote.add_bundle_line_items("quote-uuid", [
    {
        "bundleId": "bundle-uuid",
        "bundleName": "Starter Bundle",  # required
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

:::caution `categoryId` is required on create
`create_product` **requires** `name`, `categoryId`, `listPrice`, and `billingFrequency`. `categoryId` must be the **UUID** of an existing type (`categoryType: "product_category"`) — resolve or create it first with `list_types` / `create_type`. It is optional on `update_product`, so you only need to pass it when creating.
:::

```python
# Resolve the product category first — create_product needs its UUID.
page = await TurboQuote.list_types({"categoryType": "product_category"})
category = next((t for t in page["results"] if t["name"] == "Software"), None)
if category is None:
    category = await TurboQuote.create_type({
        "name": "Software",
        "categoryType": "product_category",
    })

# Create a product with images (multipart upload auto-detected)
product = await TurboQuote.create_product({
    "name": "Enterprise License",
    "categoryId": category["id"],  # required
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

Each entry in `items` **requires** `productId`, `unitPrice`, and `billingFrequency`. `quantity` is optional and defaults to `1`.

```python
bundle = await TurboQuote.create_bundle({
    "name": "Starter Pack",
    "items": [
        {
            "productId": "product-uuid-1",
            "unitPrice": "199.00",
            "billingFrequency": "monthly",
            "quantity": 1,
        },
        {
            "productId": "product-uuid-2",
            "unitPrice": "49.00",
            "billingFrequency": "monthly",
            "quantity": 2,
        },
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
| `get_template` | `()` | singleton `QuoteTemplate` (auto-created if none exists) |
| `get_template_by_id` | `(id)` | `QuoteTemplate` |
| `create_template` | `(request)` | `QuoteTemplate` — `400` if one already exists |
| `update_template` | `(id, request)` | `QuoteTemplate` |
| `delete_template` | `(id)` | `{"message": ...}` — resets to org branding defaults |

:::warning Templates are auto-provisioned — use `get_template()` → `update_template()`
`get_template()` **self-heals**: if the org has no template, the API creates one from your org branding and returns it. Every established org therefore already has a template, which means:

- `create_template()` returns **400 `TEMPLATE_ALREADY_EXISTS`** and is effectively unreachable. Do not build a get-then-create flow.
- `delete_template()` is really "reset to org branding defaults" — it soft-deletes, and the next `get_template()` regenerates a fresh one.

The correct flow is **`get_template()` → `update_template()`**.
:::

```python
# 1. Get the org's quote template (created from org branding on first read)
template = await TurboQuote.get_template()

# 2. Brand it by updating the template you just fetched
branded = await TurboQuote.update_template(template["id"], {
    "logoUrl": "https://cdn.example.com/logo.png",
    "primaryColor": "#0057b8",
    "senderName": "TurboDocx Sales",
})

# Fetch a specific named template by ID
other = await TurboQuote.get_template_by_id("template-uuid")
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

### Bulk Imports

Every create-family entity has a matching `bulk_create_*` method for seeding a catalog or migrating CRM data in one call. Each method sends `POST {resource}/bulk` with a list of row dicts using the **same shape as that entity's single-create request** — keys stay camelCase, even in Python. Company rows require a `contacts` list with at least one contact; contact rows require a `companyId`.

Rows process sequentially with **partial success** — a failed row does not raise and does not roll back earlier rows. Every bulk method returns a `BulkImportResult` dict:

- `imported` — count of rows created
- `failed` — list of `{"row": ..., "reason": ...}` for rows that did not import; `row` is the **1-indexed** position in your request list
- `adjusted` — list of `{"row": ..., "reason": ...}` for rows that imported *with* a server-side adjustment (e.g. a bundle item whose product wasn't found was dropped)

Requests are capped at **500 rows** — anything above the cap returns a `400`. Available to admin and contributor API keys.

:::caution Product rows require a real `categoryId`
Every `bulk_create_products` row **requires** `name`, `categoryId`, `listPrice`, and `billingFrequency`. `categoryId` must be the **UUID** of an existing type (`categoryType: "product_category"`) — there is no `categoryName` key on the bulk row schema, and the API rejects unknown keys, so passing one returns a `400`. Resolve or create the category first with `list_types` / `create_type`, then pass its `id`.
:::

```python
# 1. Resolve the product category first — bulk rows need its UUID, not its name.
page = await TurboQuote.list_types({"categoryType": "product_category"})
category = next((t for t in page["results"] if t["name"] == "Software"), None)
if category is None:
    category = await TurboQuote.create_type({
        "name": "Software",
        "categoryType": "product_category",
    })

# 2. Import, passing the resolved UUID on every row.
result = await TurboQuote.bulk_create_products([
    {"name": "Enterprise License", "categoryId": category["id"], "listPrice": "499.00", "billingFrequency": "annual"},
    {"name": "Onboarding Package", "categoryId": category["id"], "listPrice": "999.00", "billingFrequency": "one-time"},
])

print(f"Imported {result['imported']} of 2 rows")
for failure in result["failed"]:
    print(f"Row {failure['row']} failed: {failure['reason']}")
for adjustment in result["adjusted"]:
    print(f"Row {adjustment['row']} imported with adjustment: {adjustment['reason']}")
```

The other five bulk methods follow the exact same pattern:

| Method | Rows |
|---|---|
| `bulk_create_price_books` | list of `create_price_book` dicts |
| `bulk_create_bundles` | list of `create_bundle` dicts |
| `bulk_create_companies` | list of `create_company` dicts — each needs `contacts` (min. 1) |
| `bulk_create_contacts` | list of `create_contact` dicts — each needs `companyId` |
| `bulk_create_types` | list of `create_type` dicts |

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
