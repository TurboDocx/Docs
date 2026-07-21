---
title: TurboQuote Ruby SDK
sidebar_position: 23
sidebar_label: "TurboQuote: Ruby"
description: Official TurboDocx TurboQuote SDK for Ruby. Create, manage, and send quotes/proposals with full CPQ capabilities — line items, products, bundles, price books, companies, contacts, and quote templates, all from plain Ruby.
keywords:
  - turboquote ruby
  - quote sdk ruby
  - proposal sdk ruby
  - cpq ruby
  - turbodocx quote ruby
  - gem turbodocx
  - quote line items ruby
  - price book ruby
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboQuote Ruby SDK

<QuickstartSkillNudge command="/turbodocx-sdk turboquote" product="TurboQuote" />

The official TurboDocx TurboQuote SDK for Ruby applications. Build full CPQ (configure, price, quote) workflows: create quotes, add product and bundle line items, apply price books, send proposals to contacts, and download PDF exports — all from plain Ruby 2.7+. Distributed on RubyGems as `turbodocx-sdk` (same gem as TurboSign, TurboWebhooks, and Deliverable).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's quoting and proposal engine. It covers the full quote lifecycle — draft, send, accept/decline/void — with a product catalog, bundle groupings, price books, company/contact CRM, and customizable quote templates. Quotes can be sent with an attached Deliverable document for a branded proposal experience.
:::

## Installation

<Tabs>
<TabItem value="gem" label="gem">

```bash
gem install turbodocx-sdk
```

</TabItem>
<TabItem value="bundler" label="Bundler">

```ruby
# Gemfile
gem "turbodocx-sdk"
```

```bash
bundle install
```

</TabItem>
</Tabs>

## Requirements

- Ruby 2.7 or higher
- No runtime dependencies (uses the standard library's `net/http`)
- A TurboDocx API key (`TDX-` prefix) — generate one in **Settings → API Keys**
- All SDK methods are synchronous — no async wrapper needed

## Configuration

```ruby
require "turbodocx_sdk"

TurboDocxSdk::TurboQuote.configure(
  api_key: ENV["TURBODOCX_API_KEY"],
  org_id:  ENV["TURBODOCX_ORG_ID"]  # optional — auto-reads env var
)
```

:::tip No sender email on the client — but set one on your quote template
`TurboQuote.configure` does **not** take `sender_email` or `sender_name`. Quotes are not signature emails. Only `api_key` and, optionally, `org_id` are needed. If you skip the explicit call, the SDK lazily auto-configures from `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` on first use.

The quote's **"Prepared by"** sender comes from your **org quote template** instead. Because an API key has no mailbox of its own, every sender-resolving call — `create_quote`, `duplicate_quote`, `send_quote` / `send_quote_with_deliverable`, and `handle_expired_quote` — fails with a `ValidationError` (`400 SenderEmailRequired`) when the org's quote template has no sender email set. A companion `400 SenderNameRequired` is returned when no sender **name** resolves. Configure both **Sender Name** and **Sender Email** once (`TurboQuote.update_template`) and all of them resolve cleanly.
:::

:::note camelCase request keys
Method names are snake_case, but the keys **inside** every request hash (`companyId`, `validUntil`, `unitPrice`, …) are **camelCase** — the SDK forwards them to the API verbatim and does not convert snake_case hash keys.
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

```ruby
require "turbodocx_sdk"

TurboDocxSdk::TurboQuote.configure(
  api_key: ENV["TURBODOCX_API_KEY"],
  org_id:  ENV["TURBODOCX_ORG_ID"]
)

# 1. Create a draft quote
quote = TurboDocxSdk::TurboQuote.create_quote(
  "name"       => "Acme Corp — Annual Plan Q3",
  "companyId"  => "company-uuid",
  "contactId"  => "contact-uuid",
  "validUntil" => "2026-09-30",
  "currency"   => "USD"
)
quote_id = quote["id"]
puts "Created quote #{quote_id}"

# 2. Add product line items
items = TurboDocxSdk::TurboQuote.add_line_items(quote_id, [
  {
    "productId"        => "product-uuid-1",
    "productName"      => "Platform License",
    "quantity"         => 5,
    "unitPrice"        => "199.00",
    "billingFrequency" => "annual"
  },
  {
    "productId"        => "product-uuid-2",
    "productName"      => "Onboarding Package",
    "quantity"         => 1,
    "unitPrice"        => "499.00",
    "billingFrequency" => "one-time"
  }
])
puts "Added #{items.length} line items"

# 3. Apply a price book (optional)
result = TurboDocxSdk::TurboQuote.apply_price_book(quote_id, "pricebook-uuid")
puts "Price book applied: #{result['updatedCount']} items updated"

# 4. Send the quote
sent = TurboDocxSdk::TurboQuote.send_quote(quote_id,
  "ccEmails"   => ["manager@acme.com"],
  "validUntil" => "2026-09-30"
)
puts "Sent: #{sent['message']}"

# 5. Download the PDF
pdf_bytes = TurboDocxSdk::TurboQuote.download_quote_pdf(quote_id)
File.binwrite("acme-quote.pdf", pdf_bytes)
puts "PDF saved (#{pdf_bytes.bytesize} bytes)"
```

### Convenience: create, add items, and send in one call

```ruby
result = TurboDocxSdk::TurboQuote.create_and_send(
  "name"      => "Acme Corp — Quick Proposal",
  "companyId" => "company-uuid",
  "contactId" => "contact-uuid",
  "currency"  => "USD",
  "items" => [
    { "productId" => "product-uuid-1", "productName" => "Platform License", "quantity" => 3, "unitPrice" => "299.00", "billingFrequency" => "monthly" }
  ],
  "bundleItems" => [
    { "bundleId" => "bundle-uuid-1", "bundleName" => "Starter Pack", "quantity" => 1 }
  ],
  "send" => {
    "ccEmails"   => ["cc@example.com"],
    "validUntil" => "2026-09-30"
  }
)
puts "Quote sent: #{result['quote']['id']}"
```

---

## Method Reference

All methods are class-level on `TurboDocxSdk::TurboQuote`; configure once, then call on the class. Responses are plain Ruby `Hash`es with string keys.

### Quotes

#### `list_quotes`

```ruby
page = TurboDocxSdk::TurboQuote.list_quotes(
  "limit"    => 20,
  "offset"   => 0,
  "query"    => "acme",
  "statuses" => ["draft", "sent"]  # repeated-key filter
)
# page["results"], page["totalRecords"], page["stats"]

page["results"].each do |q|
  puts "#{q["name"]} — #{q["status"]}"
end
```

#### `create_quote`

```ruby
# Fixed-term quote — termDays is -1 or 0–3650; omit it to get the default of 60.
quote = TurboDocxSdk::TurboQuote.create_quote(
  "name"       => "Q3 Proposal",
  "companyId"  => "company-uuid",   # required
  "contactId"  => "contact-uuid",   # required
  "currency"   => "USD",
  "termDays"   => 30,               # fixed term — do NOT send renewalPeriod with this
  "validUntil" => "2026-09-30",
  "notes"      => "Includes implementation services",
  "taxRate"    => "8.5"
)
# returns Quote hash

# Auto-renewal quote — termDays -1 REQUIRES renewalPeriod.
subscription = TurboDocxSdk::TurboQuote.create_quote(
  "name"          => "Annual Subscription",
  "companyId"     => "company-uuid",
  "contactId"     => "contact-uuid",
  "currency"      => "USD",
  "termDays"      => -1,           # -1 = auto-renewal
  "renewalPeriod" => "annually"    # "weekly" | "monthly" | "quarterly" | "annually"
)
```

:::caution `termDays` and `renewalPeriod` are coupled
`termDays` defaults to **60** when omitted. Valid values are `-1` (auto-renewal) or `0`–`3650` (`0` = one-time).

`renewalPeriod` is **required** when `termDays` is `-1`, and must be **`nil` or absent** for every other `termDays` value — sending it alongside a fixed term returns a `400`. The same rule applies on `update_quote`.
:::

#### `get_quote`

Returns the quote with `statusInfo` and `preparedBy` merged in when present. `preparedBy` is the resolved "Prepared by" identity shown on the quote PDF.

```ruby
quote = TurboDocxSdk::TurboQuote.get_quote("quote-uuid")
# quote["status"], quote["grandTotal"], quote["statusInfo"]
prepared = quote["preparedBy"] || {}
puts prepared["name"]   # e.g. "Acme Billing Integration" or the template sender
puts prepared["email"]  # may be nil for an API-created quote — render a placeholder
```

`preparedBy` is resolved server-side (org template first, then the quote's creator). **Prefer it over `creator`** for any customer-facing display — `creator` may be the internal API service account. For an API-created quote the resolved name is the **API key's name** (never a generic "API Service User"), and the email comes from the org quote template. `preparedBy` is returned by the **single-quote fetch only** — it is not present on create, duplicate, or list responses.

#### `update_quote`

All fields are optional — pass only what changes. Send an explicit `nil` to clear a nullable field.

```ruby
updated = TurboDocxSdk::TurboQuote.update_quote("quote-uuid",
  "name"       => "Q3 Proposal — Revised",
  "validUntil" => "2026-10-15",
  "taxRate"    => nil  # clears the field
)
```

#### `delete_quote`

```ruby
result = TurboDocxSdk::TurboQuote.delete_quote("quote-uuid")
# result["message"]
```

#### `duplicate_quote`

```ruby
new_quote = TurboDocxSdk::TurboQuote.duplicate_quote("quote-uuid")
# returns new Quote in draft status
```

The copy is attributed to **whoever ran the duplicate**, not to the original quote's creator — duplicating with an API key produces a quote whose "Prepared by" resolves through that API key and your org quote template.

#### `download_quote_pdf`

Returns raw PDF bytes.

```ruby
pdf_bytes = TurboDocxSdk::TurboQuote.download_quote_pdf("quote-uuid")
File.binwrite("quote.pdf", pdf_bytes)
```

---

### Quote Numbering Configuration

Customize the per-org quote number format: prefix, year/month tokens, separator, zero-padding, suffix, starting number, and reset cadence. Both methods are **admin only**; a non-admin API key receives a `403`.

#### `get_quote_number_config`

Fetch the org's current quote numbering format and the current per-period issued floor.

```ruby
config = TurboDocxSdk::TurboQuote.get_quote_number_config
puts config["format"]["prefix"]   # e.g. "Q-"
puts config["currentFloor"]       # the current per-period issued floor
```

#### `update_quote_number_config`

Update the numbering format. Pass the full format hash; all eight fields are required. Keys stay camelCase.

```ruby
config = TurboDocxSdk::TurboQuote.update_quote_number_config(
  "prefix"       => "INV",
  "yearToken"    => "none",     # "none" | "two" | "four"
  "monthToken"   => "off",      # "off" | "two"
  "separator"    => "-",
  "padWidth"     => 4,          # 0–12
  "suffix"       => "",
  "startNumber"  => 1000,       # >= 0
  "resetCadence" => "never"     # "never" | "yearly" | "monthly"
)
puts config["format"]["startNumber"]  # 1000
```

The SDK also exposes constants for the enum values: `TurboDocxSdk::QuoteNumberYearToken`, `TurboDocxSdk::QuoteNumberMonthToken`, and `TurboDocxSdk::QuoteNumberResetCadence`.

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

:::caution Send preconditions

Both send methods share the same server-side checks. Each is rejected with **HTTP 400** and a
specific error `code` before anything is created or emailed:

| Condition | Code |
| :--- | :--- |
| Quote is not a draft | `QuoteNotSendable` |
| No `validUntil` date set | `QuoteValidUntilRequired` |
| `validUntil` is in the past | `QuoteExpired` |
| No line items | `QuoteHasNoLineItems` |
| Contact missing a name or email | `QuoteContactRequired` |
| Company or contact deleted/deactivated | `QuoteCustomerInactive` |
| No sender email resolvable (API-key callers) | `SenderEmailRequired` |

A quote with **no line items cannot be sent** — add at least one product, bundle, or custom
line item first. Likewise an **expired quote is rejected**; update `validUntil`, or use the
handle-expired flow to void it and create a fresh draft.

:::

#### `send_quote`

```ruby
sent = TurboDocxSdk::TurboQuote.send_quote("quote-uuid",
  "ccEmails"   => ["manager@example.com"],
  "validUntil" => "2026-09-30"
)
# sent["quote"], sent["message"]
```

#### `send_quote_with_deliverable`

Attach a TurboDocx-generated document to the sent quote.

```ruby
result = TurboDocxSdk::TurboQuote.send_quote_with_deliverable("quote-uuid",
  "deliverableId" => "deliverable-uuid",
  "ccEmails"      => ["manager@example.com"]
)
# result["quote"], result["message"], result["documentId"]
```

#### `decline_quote`

```ruby
quote = TurboDocxSdk::TurboQuote.decline_quote("quote-uuid",
  "reason" => "Customer selected a competitor"
)
```

#### `void_quote`

```ruby
quote = TurboDocxSdk::TurboQuote.void_quote("quote-uuid",
  "reason" => "Terms expired before acceptance"
)
```

#### `handle_expired_quote`

Handles a quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on `action` — and then **creates a duplicate carrying `newValidUntil`** as its new validity date. The returned quote is the new duplicate; the original stays terminal.

All three keys are **required**: `action` (`"void"` or `"decline"`), `reason` (max 190 characters), and `newValidUntil` (ISO date).

```ruby
quote = TurboDocxSdk::TurboQuote.handle_expired_quote("quote-uuid",
  "action"        => "void",          # required — "void" or "decline" only
  "reason"        => "Quote expired", # required — max 190 characters
  "newValidUntil" => "2026-12-31"     # required — ISO date, carried onto the duplicate
)
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

```ruby
result = TurboDocxSdk::TurboQuote.apply_price_book("quote-uuid", "pricebook-uuid")
# result["quote"]        — updated Quote
# result["updatedCount"] — Integer, items that were re-priced
# result["skippedCount"] — Integer, items that had no pricebook match
# result["message"]
```

#### `remove_price_book`

```ruby
quote = TurboDocxSdk::TurboQuote.remove_price_book("quote-uuid")
```

---

### Line Items

#### `list_line_items`

```ruby
page = TurboDocxSdk::TurboQuote.list_line_items("quote-uuid", "limit" => 50)
# page["results"], page["totalRecords"]
```

#### `add_line_items`

Accepts a single item hash **or** an array of up to **50** items. Returns an array of created line item hashes.

`productId`, `productName`, `unitPrice`, and `billingFrequency` are all **required** on every row. `productId` is special: the key must be **present**, but its value may be `nil` for a custom (freeform) line item — omitting the key entirely returns a `400`. `quantity` is optional and defaults to `1`.

```ruby
items = TurboDocxSdk::TurboQuote.add_line_items("quote-uuid", [
  {
    "productId"        => "product-uuid",   # required key — nil for a custom line item
    "productName"      => "Platform License",
    "quantity"         => 2,
    "unitPrice"        => "199.00",
    "billingFrequency" => "annual",
    "discountPercent"  => "10.0"
  },
  {
    "productId"        => nil,               # custom (freeform) line item — key still required
    "productName"      => "Implementation Credit",
    "unitPrice"        => "-250.00",
    "billingFrequency" => "one-time"
  }
])
```

:::note Array caps
`add_line_items` accepts a single hash **or** an array of 1–**50** items. A reorder request accepts up to **200** items. Exceeding either cap returns a `400`.
:::

#### `add_bundle_line_items`

`bundleId` and `bundleName` are both **required**; the server expands the bundle's child products for you. Accepts a single hash or an array of up to **50** items.

```ruby
items = TurboDocxSdk::TurboQuote.add_bundle_line_items("quote-uuid", [
  {
    "bundleId"   => "bundle-uuid",
    "bundleName" => "Starter Bundle",   # required
    "quantity"   => 1
  }
])
```

#### `update_line_item`

```ruby
item = TurboDocxSdk::TurboQuote.update_line_item("quote-uuid", "item-uuid",
  "quantity"  => 5,
  "unitPrice" => "179.00"
)
```

#### `remove_line_item`

```ruby
result = TurboDocxSdk::TurboQuote.remove_line_item("quote-uuid", "item-uuid")
# result["message"]
```

---

### Products

| Method | Signature | Returns |
|---|---|---|
| `list_products` | `(options = nil)` | paginated list |
| `create_product` | `(request)` | `Product` |
| `bulk_create_products` | `(rows)` | [bulk report](#bulk-create) |
| `get_product` | `(id)` | `Product` |
| `update_product` | `(id, request)` | `Product` |
| `delete_product` | `(id)` | `{"message" => ...}` |
| `duplicate_product` | `(id)` | `Product` |
| `get_product_primary_images` | `(product_ids)` | `{id => image or nil}` |

:::caution `categoryId` is required on create
`create_product` **requires** `name`, `categoryId`, `listPrice`, and `billingFrequency`. `categoryId` must be the **UUID** of an existing type (`categoryType` `"product_category"`) — resolve or create it first with `list_types` / `create_type`. It is optional on `update_product`, so you only need to pass it when creating.
:::

```ruby
# Resolve the product category first — create_product needs its UUID.
page = TurboDocxSdk::TurboQuote.list_types("categoryType" => "product_category")
category = page["results"].find { |t| t["name"] == "Software" }
category ||= TurboDocxSdk::TurboQuote.create_type(
  "name"         => "Software",
  "categoryType" => "product_category"
)

# Create a product with images (multipart upload auto-detected)
product = TurboDocxSdk::TurboQuote.create_product(
  "name"             => "Enterprise License",
  "categoryId"       => category["id"],   # required
  "listPrice"        => "499.00",
  "cost"             => "200.00",
  "billingFrequency" => "annual",
  "showInCatalog"    => true,
  "images"           => ["/path/to/product-photo.png"]  # file path(s) or IO objects
)

# List products with filters
page = TurboDocxSdk::TurboQuote.list_products(
  "limit"         => 20,
  "query"         => "enterprise",
  "showInCatalog" => true
)

# Bulk fetch primary images for a set of product IDs
images = TurboDocxSdk::TurboQuote.get_product_primary_images(["id-1", "id-2", "id-3"])
# images["id-1"] → ProductImage hash, or nil
```

---

### Bundles

| Method | Signature | Returns |
|---|---|---|
| `list_bundles` | `(options = nil)` | paginated list |
| `create_bundle` | `(request)` | `Bundle` |
| `bulk_create_bundles` | `(rows)` | [bulk report](#bulk-create) |
| `get_bundle` | `(id)` | `Bundle` |
| `update_bundle` | `(id, request)` | `Bundle` |
| `delete_bundle` | `(id)` | `{"message" => ...}` |
| `duplicate_bundle` | `(id)` | `Bundle` |

Each entry in `items` **requires** `productId`, `unitPrice`, and `billingFrequency`. `quantity` is optional and defaults to `1`.

```ruby
bundle = TurboDocxSdk::TurboQuote.create_bundle(
  "name"       => "Starter Pack",
  "categoryId" => "bundle-category-uuid",  # required
  "items" => [
    {
      "productId"        => "product-uuid-1",
      "unitPrice"        => "199.00",
      "billingFrequency" => "monthly",
      "quantity"         => 1
    },
    {
      "productId"        => "product-uuid-2",
      "unitPrice"        => "49.00",
      "billingFrequency" => "monthly",
      "quantity"         => 2
    }
  ],
  "bundleDiscountType"   => "percent",
  "bundleDiscountAmount" => 5
)
```

---

### Price Books

| Method | Signature | Returns |
|---|---|---|
| `list_price_books` | `(options = nil)` | paginated list |
| `create_price_book` | `(request)` | `PriceBook` |
| `bulk_create_price_books` | `(rows)` | [bulk report](#bulk-create) |
| `get_price_book` | `(id)` | `PriceBook` |
| `update_price_book` | `(id, request)` | `PriceBook` |
| `delete_price_book` | `(id)` | `{"message" => ...}` |
| `duplicate_price_book` | `(id)` | `PriceBook` |
| `list_price_book_products` | `(id, options = nil)` | paginated list |

```ruby
# name, priceBookTypeId, and validFrom are REQUIRED.
# discountPercent is optional and defaults to 0 if not provided.
# priceBookTypeId comes from a create_type with categoryType "pricebook_type".
pricebook = TurboDocxSdk::TurboQuote.create_price_book(
  "name"            => "Partner Tier A",
  "priceBookTypeId" => "pricebook-type-uuid",
  "validFrom"       => "2026-01-01",
  "discountPercent" => 15,
  "isDefault"       => false,
  "productPricing" => [
    { "productId" => "product-uuid-1", "discountType" => "percent", "discountPercent" => 25 },
    { "productId" => "product-uuid-2", "discountType" => "percent", "discountPercent" => 30 }
  ]
)

# List products attached to a price book
page = TurboDocxSdk::TurboQuote.list_price_book_products("pricebook-uuid", "limit" => 50)
```

---

### Companies

| Method | Signature | Returns |
|---|---|---|
| `list_companies` | `(options = nil)` | paginated list |
| `create_company` | `(request)` | `Company` |
| `bulk_create_companies` | `(rows)` | [bulk report](#bulk-create) |
| `get_company` | `(id)` | `Company` |
| `update_company` | `(id, request)` | `Company` |
| `delete_company` | `(id)` | `{"message" => ...}` |
| `list_company_contacts` | `(company_id, options = nil)` | paginated list |

```ruby
company = TurboDocxSdk::TurboQuote.create_company(
  "name"   => "Acme Corporation",
  "domain" => "acme.com",
  "contacts" => [  # at least one contact required
    {
      "firstName" => "Jane",
      "lastName"  => "Doe",
      "email"     => "jane@acme.com"
    }
  ]
)

# List contacts for a company
contacts = TurboDocxSdk::TurboQuote.list_company_contacts(company["id"])
```

---

### Contacts

| Method | Signature | Returns |
|---|---|---|
| `list_contacts` | `(options = nil)` | paginated list |
| `create_contact` | `(request)` | `Contact` |
| `bulk_create_contacts` | `(rows)` | [bulk report](#bulk-create) |
| `update_contact` | `(id, request)` | `Contact` |
| `delete_contact` | `(id)` | `{"message" => ...}` |

:::note No `get_contact` by design
The backend has no `GET /v1/contacts/:id` endpoint. Fetch individual contacts via `list_company_contacts` or `list_contacts` with a query filter.
:::

```ruby
contact = TurboDocxSdk::TurboQuote.create_contact(
  "firstName" => "John",
  "lastName"  => "Smith",
  "email"     => "john@acme.com",
  "companyId" => "company-uuid"
)
```

---

### Quote Templates

| Method | Signature | Returns |
|---|---|---|
| `list_templates` | `(options = nil)` | paginated list |
| `get_template` | `()` | singleton `QuoteTemplate` — auto-created if none exists |
| `get_template_by_id` | `(id)` | `QuoteTemplate` |
| `create_template` | `(request)` | `QuoteTemplate` — `400` if one already exists |
| `update_template` | `(id, request)` | `QuoteTemplate` |
| `delete_template` | `(id)` | `{"message" => ...}` — resets to org branding defaults |

:::warning Templates are auto-provisioned — use `get_template` → `update_template`
`get_template` **self-heals**: if the org has no template, the API creates one from your org branding and returns it. Every established org therefore already has a template, which means:

- `create_template` returns **400 `TEMPLATE_ALREADY_EXISTS`** and is effectively unreachable. Do not build a get-then-create flow.
- `delete_template` is really "reset to org branding defaults" — it soft-deletes, and the next `get_template` regenerates a fresh one.

The correct flow is **`get_template` → `update_template`**.
:::

```ruby
# 1. Get the org's quote template (created from org branding on first read)
template = TurboDocxSdk::TurboQuote.get_template

# 2. Brand it by updating the template you just fetched
branded = TurboDocxSdk::TurboQuote.update_template(template["id"],
  "logoUrl"      => "https://cdn.example.com/logo.png",
  "primaryColor" => "#0057b8",
  "senderName"   => "TurboDocx Sales"
)

# Get a specific named template by ID
other = TurboDocxSdk::TurboQuote.get_template_by_id("template-uuid")
```

---

### Types / Categories

| Method | Signature | Returns |
|---|---|---|
| `list_types` | `(options = nil)` | paginated list |
| `create_type` | `(request)` | `QuoteType` |
| `bulk_create_types` | `(rows)` | [bulk report](#bulk-create) |
| `update_type` | `(id, request)` | `QuoteType` |
| `delete_type` | `(id)` | `{"message" => ...}` |

:::note No `get_type` by design
The backend has no `GET /v1/types/:id` endpoint. Use `list_types` to retrieve individual type records.
:::

```ruby
quote_type = TurboDocxSdk::TurboQuote.create_type("name" => "New Business")

TurboDocxSdk::TurboQuote.update_type(quote_type["id"], "name" => "New Logo Business")
```

---

### Bulk Create

Six methods import many records in one request — ideal for CSV-style migrations:

| Method | Endpoint | Row shape |
|---|---|---|
| `bulk_create_products` | `POST /v1/products/bulk` | same fields as `create_product` |
| `bulk_create_price_books` | `POST /v1/pricebooks/bulk` | same fields as `create_price_book` |
| `bulk_create_bundles` | `POST /v1/bundles/bulk` | same fields as `create_bundle` |
| `bulk_create_companies` | `POST /v1/companies/bulk` | same fields as `create_company` — each row **requires a `contacts` array with at least one contact** |
| `bulk_create_contacts` | `POST /v1/contacts/bulk` | same fields as `create_contact` — each row **requires a `companyId`** |
| `bulk_create_types` | `POST /v1/types/bulk` | same fields as `create_type` |

Each method takes an array of row hashes; the SDK wraps them in the `{ "rows" => [...] }` envelope the endpoint expects. Rows use the exact request shape of the corresponding single-create method (camelCase keys).

:::caution Product rows require a real `categoryId`
Every `bulk_create_products` row **requires** `name`, `categoryId`, `listPrice`, and `billingFrequency`. `categoryId` must be the **UUID** of an existing type (`categoryType` `"product_category"`) — there is no `categoryName` key on the bulk row schema, and the API rejects unknown keys, so passing one returns a `400`. Resolve or create the category first with `list_types` / `create_type`, then pass its `"id"`.
:::

```ruby
# 1. Resolve the product category first — bulk rows need its UUID, not its name.
page = TurboDocxSdk::TurboQuote.list_types("categoryType" => "product_category")
category = page["results"].find { |t| t["name"] == "Software" }
category ||= TurboDocxSdk::TurboQuote.create_type(
  "name"         => "Software",
  "categoryType" => "product_category"
)
category_id = category["id"]

# 2. Import, passing the resolved UUID on every row.
report = TurboDocxSdk::TurboQuote.bulk_create_products([
  { "name" => "Starter License",    "categoryId" => category_id, "listPrice" => "99.00",  "billingFrequency" => "monthly" },
  { "name" => "Pro License",        "categoryId" => category_id, "listPrice" => "299.00", "billingFrequency" => "monthly" },
  { "name" => "Enterprise License", "categoryId" => category_id, "listPrice" => "499.00", "billingFrequency" => "annual" }
])

puts "Imported #{report['imported']} rows"
report["failed"].each do |failure|
  puts "Row #{failure['row']} failed: #{failure['reason']}"   # "row" is 1-indexed
end
report["adjusted"].each do |adjustment|
  puts "Row #{adjustment['row']} adjusted: #{adjustment['reason']}"
end
```

**Partial-success semantics** — every bulk method returns the same report hash instead of raising for bad rows:

| Key | Type | Meaning |
|---|---|---|
| `imported` | Integer | Rows created successfully |
| `failed` | Array of `{"row", "reason"}` | Rows the server rejected — `row` is the **1-indexed** position in your input array |
| `adjusted` | Array of `{"row", "reason"}` | Rows the server imported after modifying them (e.g. a bundle item whose product wasn't found was dropped) |

Rules and limits:

- **A failed row does not raise** and does not roll back earlier rows — always check `report["failed"]` after the call.
- **Max 500 rows per request.** Exceeding the cap fails the whole request with a `400` (`TurboDocxSdk::ValidationError`); an invalid envelope (e.g. non-array input) also raises `ValidationError`.
- **Roles:** available to **administrator and contributor** API keys.
- The SDK performs no client-side row validation — errors come back per-row in the report.

```ruby
# Companies need >= 1 contact per row; contacts need a companyId per row
TurboDocxSdk::TurboQuote.bulk_create_companies([
  {
    "name"     => "Acme Corporation",
    "contacts" => [{ "firstName" => "Jane", "lastName" => "Doe", "email" => "jane@acme.com" }]
  }
])

TurboDocxSdk::TurboQuote.bulk_create_contacts([
  { "firstName" => "John", "lastName" => "Smith", "email" => "john@acme.com", "companyId" => "company-uuid" }
])
```

---

### Convenience

#### `create_and_send`

Orchestrates multiple API calls: create quote → add product items → add bundle items → send. Returns `{ "quote" => <sent Quote> }`.

```ruby
result = TurboDocxSdk::TurboQuote.create_and_send(
  # CreateQuote fields
  "name"      => "Year-End Renewal",
  "companyId" => "company-uuid",
  "contactId" => "contact-uuid",
  "currency"  => "USD",
  # optional line items added before send
  "items" => [
    { "productId" => "product-uuid-1", "productName" => "Platform License", "quantity" => 10, "unitPrice" => "99.00", "billingFrequency" => "monthly" }
  ],
  # optional bundle items added before send
  "bundleItems" => [
    { "bundleId" => "bundle-uuid-1", "bundleName" => "Starter Pack", "quantity" => 1 }
  ],
  # send options (ccEmails, validUntil)
  "send" => {
    "ccEmails"   => ["finance@example.com"],
    "validUntil" => "2026-12-31"
  }
)
puts result["quote"]["id"]
```

---

## Constants

The gem exposes constants so you can avoid hard-coding string literals:

```ruby
TurboDocxSdk::QuoteStatus::DRAFT              # "draft"
TurboDocxSdk::QuoteStatus::SENT               # "sent"
TurboDocxSdk::BillingFrequency::MONTHLY       # "monthly"
TurboDocxSdk::BillingFrequency::ANNUAL        # "annual"
TurboDocxSdk::DiscountType::PERCENT           # "percent"
TurboDocxSdk::DiscountType::AMOUNT            # "amount"
TurboDocxSdk::Currency::USD                   # "USD"
TurboDocxSdk::LineItemType::PRODUCT           # "product"
TurboDocxSdk::CategoryType::PRICEBOOK_TYPE    # "pricebook_type"
```

---

## Error Handling

```ruby
require "turbodocx_sdk"

begin
  quote = TurboDocxSdk::TurboQuote.create_quote(
    "name"      => "Q3 Proposal",
    "companyId" => "company-uuid",
    "contactId" => "contact-uuid"
  )
rescue TurboDocxSdk::ValidationError => e
  # 400 — missing required fields, invalid enum value, etc.
  puts "Validation failed: #{e.message}"
rescue TurboDocxSdk::AuthenticationError
  # 401 — bad or revoked API key
rescue TurboDocxSdk::AuthorizationError
  # 403 — key valid but lacks permission for this org/action
rescue TurboDocxSdk::NotFoundError => e
  # 404 — company, contact, or product not found
  puts "Not found: #{e.message}"
rescue TurboDocxSdk::RateLimitError
  # 429 — back off and retry
rescue TurboDocxSdk::NetworkError
  # request never reached the server (DNS, refused, timeout)
rescue TurboDocxSdk::TurboDocxError => e
  # catch-all for any other typed SDK error (raw 5xx, etc.)
  puts "Error #{e.status_code}: #{e.message}"
end
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
- [TurboQuote Python SDK](/docs/SDKs/quote-python) — same API, Python idioms
- [TurboSign Ruby SDK](/docs/SDKs/ruby) — send documents for e-signature
- [TurboWebhooks Ruby SDK](/docs/SDKs/webhooks-ruby) — receive real-time signature events
- [Deliverable Ruby SDK](/docs/SDKs/deliverable-ruby) — generate documents from templates
- [SDKs Overview](/docs/SDKs) — all SDKs across all languages
- [turbodocx-sdk on RubyGems](https://rubygems.org/gems/turbodocx-sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk)
