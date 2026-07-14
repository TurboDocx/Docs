---
title: TurboQuote PHP SDK
sidebar_position: 16
sidebar_label: "TurboQuote: PHP"
description: Official TurboDocx TurboQuote SDK for PHP. Create, manage, and send quotes/proposals with full CPQ capabilities — line items, products, bundles, price books, companies, contacts, and quote templates, all from PHP 8.1+.
keywords:
  - turboquote php
  - quote sdk php
  - proposal sdk php
  - cpq php
  - turbodocx quote php
  - laravel turboquote
  - symfony turboquote
  - composer turboquote
  - quote line items php
  - price book php
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboQuote PHP SDK

<QuickstartSkillNudge command="/turbodocx-sdk turboquote" product="TurboQuote" />

The official TurboDocx TurboQuote SDK for PHP applications. Build full CPQ (configure, price, quote) workflows: create quotes, add product and bundle line items, apply price books, send proposals to contacts, and download PDF exports — all from PHP 8.1+. Available on Packagist as `turbodocx/sdk` (same package as TurboSign, TurboWebhooks, and Deliverable).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's quoting and proposal engine. It covers the full quote lifecycle — draft, send, accept/decline/void — with a product catalog, bundle groupings, price books, company/contact CRM, and customizable quote templates. Quotes can be sent with an attached Deliverable document for a branded proposal experience.
:::

## Installation

```bash
composer require turbodocx/sdk
```

## Requirements

- PHP 8.1 or higher
- Composer 2.x
- ext-json
- A TurboDocx API key (`TDX-` prefix) — generate one in **Settings → API Keys**

## Configuration

<Tabs>
<TabItem value="manual" label="Manual Configuration" default>

```php
<?php
use TurboDocx\TurboQuote;
use TurboDocx\Config\QuoteClientConfig;

TurboQuote::configure(new QuoteClientConfig(
    apiKey: $_ENV['TURBODOCX_API_KEY'],
    orgId: $_ENV['TURBODOCX_ORG_ID'],   // optional, but required for most endpoints
));
```

</TabItem>
<TabItem value="env" label="From Environment">

```php
<?php
use TurboDocx\TurboQuote;
use TurboDocx\Config\QuoteClientConfig;

// Auto-configure from environment variables
TurboQuote::configure(QuoteClientConfig::fromEnvironment());

// Reads from: TURBODOCX_API_KEY, TURBODOCX_ORG_ID
// If not configured, the SDK auto-initializes from env on first use.
```

</TabItem>
</Tabs>

:::tip No senderEmail required
Unlike TurboSign, `TurboQuote` does **not** require `senderEmail` or `senderName`. Quotes are not signature emails — only `apiKey` and, optionally, `orgId` are needed.
:::

### Environment Variables

```bash
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

:::caution API Credentials Required
Both `apiKey` and `orgId` are needed for most API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Full quote lifecycle: create → add items → send → download PDF

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use TurboDocx\TurboQuote;
use TurboDocx\Config\QuoteClientConfig;
use TurboDocx\Types\Requests\Quote\CreateQuoteRequest;
use TurboDocx\Types\Requests\Quote\AddLineItemRequest;
use TurboDocx\Types\Requests\Quote\SendQuoteRequest;

TurboQuote::configure(QuoteClientConfig::fromEnvironment());

// 1. Create the quote
$quote = TurboQuote::createQuote(new CreateQuoteRequest(
    name: 'Enterprise License Q3',
    companyId: 'company-uuid',
    contactId: 'contact-uuid',
    validUntil: '2026-09-30',
));

echo "Quote created: {$quote->id}\n";

// 2. Add a product line item
$items = TurboQuote::addLineItems($quote->id, new AddLineItemRequest(
    productId: 'product-uuid',
    productName: 'Enterprise Seat',
    unitPrice: 199.00,
    billingFrequency: 'monthly',
    quantity: 5,
));

echo "Added {count($items)} item(s)\n";

// 3. Send the quote
$sent = TurboQuote::sendQuote($quote->id);
echo "Status: {$sent->quote->status}\n";   // 'sent'

// 4. Download the PDF
$pdfBytes = TurboQuote::downloadQuotePdf($quote->id);
file_put_contents('proposal.pdf', $pdfBytes);
echo "PDF saved.\n";
```

:::caution Always Handle Errors
The above example omits error handling for brevity. In production, wrap all TurboQuote calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

### Convenience: createAndSend

```php
<?php
use TurboDocx\Types\Requests\Quote\CreateAndSendRequest;
use TurboDocx\Types\Requests\Quote\AddLineItemRequest;
use TurboDocx\Types\Requests\Quote\SendQuoteRequest;

$result = TurboQuote::createAndSend(new CreateAndSendRequest(
    name: 'Starter Plan',
    companyId: 'company-uuid',
    contactId: 'contact-uuid',
    items: [
        new AddLineItemRequest(
            productId: 'product-uuid',
            productName: 'Starter Plan',
            unitPrice: 49.00,
            billingFrequency: 'monthly',
            quantity: 1,
        ),
    ],
    send: new SendQuoteRequest(),
));

echo "Quote sent: {$result->quote->id}\n";
```

---

## Method Reference

All methods are static. Configure once with `TurboQuote::configure(...)`, then call on the class directly.

### Quotes

#### listQuotes

```php
use TurboDocx\Types\Requests\Quote\ListQuotesRequest;

$page = TurboQuote::listQuotes(new ListQuotesRequest(
    limit: 10,
    offset: 0,
    query: 'Enterprise',
));

echo "Total: {$page->totalRecords}\n";
foreach ($page->results as $q) {
    echo "  [{$q->status}] {$q->name}\n";
}
```

#### createQuote

```php
use TurboDocx\Types\Requests\Quote\CreateQuoteRequest;

// Fixed-term quote — termDays is -1 or 0–3650; omit it to get the default of 60.
$quote = TurboQuote::createQuote(new CreateQuoteRequest(
    name: 'Q3 Proposal',
    companyId: 'company-uuid',
    contactId: 'contact-uuid',
    validUntil: '2026-09-30',
    currency: 'USD',
    termDays: 30,               // fixed term — do NOT pass renewalPeriod with this
));

// Auto-renewal quote — termDays -1 REQUIRES renewalPeriod.
$subscription = TurboQuote::createQuote(new CreateQuoteRequest(
    name: 'Annual Subscription',
    companyId: 'company-uuid',
    contactId: 'contact-uuid',
    currency: 'USD',
    termDays: -1,               // -1 = auto-renewal
    renewalPeriod: 'annually',  // 'weekly' | 'monthly' | 'quarterly' | 'annually'
));
```

:::caution `termDays` and `renewalPeriod` are coupled
`termDays` defaults to **60** when omitted. Valid values are `-1` (auto-renewal) or `0`–`3650` (`0` = one-time).

`renewalPeriod` is **required** when `termDays` is `-1`, and must be **null or absent** for every other `termDays` value — sending it alongside a fixed term returns a `400`. The same rule applies on `updateQuote`.
:::

#### getQuote

```php
$quote = TurboQuote::getQuote('quote-uuid');
// statusInfo is merged onto the returned Quote object when present
echo $quote->status;
```

#### updateQuote

```php
use TurboDocx\Types\Requests\Quote\UpdateQuoteRequest;

$quote = TurboQuote::updateQuote('quote-uuid', new UpdateQuoteRequest(
    name: 'Q3 Proposal — Revised',
    validUntil: '2026-10-15',
));
```

#### deleteQuote

```php
$result = TurboQuote::deleteQuote('quote-uuid');
echo $result->message;
```

#### duplicateQuote

```php
$copy = TurboQuote::duplicateQuote('quote-uuid');
echo "Copy id: {$copy->id}";
```

#### downloadQuotePdf

Returns raw PDF bytes. Save to disk or stream to the browser.

```php
$pdfBytes = TurboQuote::downloadQuotePdf('quote-uuid');
file_put_contents('quote.pdf', $pdfBytes);

// Or stream as HTTP response
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="quote.pdf"');
echo $pdfBytes;
```

### Quote Status Transitions

#### sendQuote

```php
use TurboDocx\Types\Requests\Quote\SendQuoteRequest;

$result = TurboQuote::sendQuote('quote-uuid', new SendQuoteRequest(
    // optional overrides; pass null to use quote defaults
));
// $result->quote  — updated Quote
// $result->message
```

#### sendQuoteWithDeliverable

Attach a Deliverable document (generated DOCX/PDF) alongside the quote.

```php
use TurboDocx\Types\Requests\Quote\SendQuoteWithDeliverableRequest;

$result = TurboQuote::sendQuoteWithDeliverable('quote-uuid', new SendQuoteWithDeliverableRequest(
    deliverableId: 'deliverable-uuid',
    mergePosition: 'end',
));
// $result->quote
// $result->message
// $result->documentId   — TurboSign document ID
```

#### declineQuote

```php
use TurboDocx\Types\Requests\Quote\DeclineQuoteRequest;

$quote = TurboQuote::declineQuote('quote-uuid', new DeclineQuoteRequest(
    reason: 'Price out of budget',
));
```

#### voidQuote

```php
use TurboDocx\Types\Requests\Quote\VoidQuoteRequest;

$quote = TurboQuote::voidQuote('quote-uuid', new VoidQuoteRequest(
    reason: 'Superseded by new proposal',
));
```

#### handleExpiredQuote

Handles a quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on `action` — and then **creates a duplicate carrying `newValidUntil`** as its new validity date. The returned quote is the new duplicate; the original stays terminal.

All three arguments are **required**: `action` (`'void'` or `'decline'`), `reason` (max 190 characters), and `newValidUntil` (ISO date).

```php
use TurboDocx\Types\Requests\Quote\HandleExpiredQuoteRequest;

$quote = TurboQuote::handleExpiredQuote('quote-uuid', new HandleExpiredQuoteRequest(
    action: 'void',                                  // required — 'void' or 'decline' only
    reason: 'Customer requested more time to review', // required — max 190 characters
    newValidUntil: '2026-12-31',                     // required — ISO date, carried onto the duplicate
));
```

:::warning There is no `extend` or `resend` action
`action` accepts **only** `'void'` and `'decline'`. `'extend'` and `'resend'` do not exist in the API and return a `400`. Extending is what the endpoint already does — pass `newValidUntil` and it lands on the duplicate it creates.
:::

:::note Terminal statuses
`accepted`, `declined`, and `voided` are **terminal** — a quote in one of these states cannot be transitioned out of it, and any further status call returns a `400`. Inspect the `statusInfo` merged onto the `Quote` before attempting a transition, and use `duplicateQuote` when you need to revive a closed-out quote.
:::

### Quote Numbering Configuration

Customize the per-org quote number format: prefix, year/month tokens, separator, zero-padding, suffix, starting number, and reset cadence. Both methods are **admin only**; a non-admin API key receives a `403`.

#### getQuoteNumberConfig

Fetch the org's current quote numbering format and the current per-period issued floor.

```php
$config = TurboQuote::getQuoteNumberConfig();
echo $config->format->prefix;    // e.g. "Q-"
echo $config->currentFloor;      // the current per-period issued floor
```

#### updateQuoteNumberConfig

Update the numbering format. All eight fields are sent.

```php
use TurboDocx\Types\Quote\QuoteNumberFormat;

$config = TurboQuote::updateQuoteNumberConfig(new QuoteNumberFormat(
    prefix: 'INV',
    yearToken: 'none',      // 'none' | 'two' | 'four'
    monthToken: 'off',      // 'off' | 'two'
    separator: '-',
    padWidth: 4,            // 0–12
    suffix: '',
    startNumber: 1000,      // >= 0
    resetCadence: 'never',  // 'never' | 'yearly' | 'monthly'
));
echo $config->format->startNumber;  // 1000
```

#### Field reference, defaults & validation

All eight `QuoteNumberFormat` fields are sent on every update. The API enforces these caps and allowed values — a violation returns `400`:

| Field | Type | Allowed / range | Default |
|-------|------|-----------------|---------|
| `prefix` | string | ≤ 12 characters | `"Q"` |
| `yearToken` | enum | `none` \| `two` \| `four` | `four` |
| `monthToken` | enum | `off` \| `two` | `off` |
| `separator` | string | ≤ 4 characters | `"-"` |
| `padWidth` | int | `0`–`12` (`0` = no padding) | `5` |
| `suffix` | string | ≤ 12 characters | `""` |
| `startNumber` | int | `0`–`1000000000` | `1` |
| `resetCadence` | enum | `never` \| `yearly` \| `monthly` | `yearly` |

The token sets also ship as native enums (`TurboDocx\Types\Enums\QuoteNumberYearToken`, `QuoteNumberMonthToken`, `QuoteNumberResetCadence`) — pass `QuoteNumberYearToken::FOUR->value` if you prefer named cases over raw strings. An org that has never configured numbering uses the **default format** above, which renders like `Q-2026-00001`.

Beyond the per-field caps, the API rejects self-inconsistent formats with a `400`:

- `resetCadence: 'yearly'` requires a year token (`yearToken` other than `none`) — otherwise numbers repeat across years.
- `resetCadence: 'monthly'` requires **both** a year token and a month token (`monthToken: 'two'`).
- The rendered quote number must be ≤ 256 characters.

`currentFloor` (returned by both methods) is read-only — the sequence the next quote will use for the current period — and is never sent on update.

### Price Books on Quotes

#### applyPriceBook

Apply a price book to a quote, updating matching line item prices.

```php
$result = TurboQuote::applyPriceBook('quote-uuid', 'pricebook-uuid');
// $result->quote
// $result->message
// $result->updatedCount   — number of items re-priced
// $result->skippedCount   — items with no matching pricebook entry
```

#### removePriceBook

```php
$quote = TurboQuote::removePriceBook('quote-uuid');
```

### Line Items

#### listLineItems

```php
use TurboDocx\Types\Requests\Quote\ListLineItemsRequest;

$page = TurboQuote::listLineItems('quote-uuid', new ListLineItemsRequest(
    limit: 50,
));
foreach ($page->results as $item) {
    echo "  {$item->productName}: {$item->unitPrice} x {$item->quantity}\n";
}
```

#### addLineItems

Pass a single `AddLineItemRequest` or an array of up to **50** of them.

`productId`, `productName`, `unitPrice`, and `billingFrequency` are all **required** on every item. `productId` is special: the key must be **present**, but its value may be `null` for a custom (freeform) line item. `quantity` is optional and defaults to `1`.

```php
use TurboDocx\Types\Requests\Quote\AddLineItemRequest;

$items = TurboQuote::addLineItems('quote-uuid', [
    new AddLineItemRequest(
        productId: 'product-uuid-1',   // required — null for a custom line item
        productName: 'Platform Subscription',
        unitPrice: 199.00,
        billingFrequency: 'monthly',
        quantity: 2,
    ),
    new AddLineItemRequest(
        productId: null,               // custom (freeform) line item — still required, sent as null
        productName: 'Implementation Credit',
        unitPrice: -250.00,
        billingFrequency: 'one-time',
        quantity: 1,
    ),
]);
```

:::note Array caps
`addLineItems` accepts a single request **or** an array of 1–**50** items. A reorder request accepts up to **200** items. Exceeding either cap returns a `400`.
:::

#### addBundleLineItems

Pass a single `AddBundleLineItemRequest` or an array of them.

```php
use TurboDocx\Types\Requests\Quote\AddBundleLineItemRequest;

$items = TurboQuote::addBundleLineItems('quote-uuid', [
    new AddBundleLineItemRequest(
        bundleId: 'bundle-uuid-1',
        bundleName: 'Starter Bundle',
        quantity: 1,
    ),
    new AddBundleLineItemRequest(
        bundleId: 'bundle-uuid-2',
        bundleName: 'Premium Add-ons',
        quantity: 2,
    ),
]);
```

#### updateLineItem

```php
use TurboDocx\Types\Requests\Quote\UpdateLineItemRequest;

$item = TurboQuote::updateLineItem('quote-uuid', 'item-uuid', new UpdateLineItemRequest(
    quantity: 3,
    unitPrice: 189.00,
));
```

#### removeLineItem

```php
$result = TurboQuote::removeLineItem('quote-uuid', 'item-uuid');
echo $result->message;
```

### Products

| Method | Signature | Returns |
|---|---|---|
| `listProducts` | `(?ListProductsRequest)` | `ProductListResponse` |
| `createProduct` | `(CreateProductRequest)` | `Product` |
| `getProduct` | `(string $id)` | `Product` |
| `updateProduct` | `(string $id, UpdateProductRequest)` | `Product` |
| `deleteProduct` | `(string $id)` | `MessageResponse` |
| `duplicateProduct` | `(string $id)` | `Product` |
| `getProductPrimaryImages` | `(string[] $productIds)` | `array<string, mixed\|null>` |

```php
use TurboDocx\Types\Requests\Quote\CreateProductRequest;
use TurboDocx\Types\Requests\Quote\ListProductsRequest;

// List products
$page = TurboQuote::listProducts(new ListProductsRequest(limit: 20, query: 'license'));

// Create a product
$product = TurboQuote::createProduct(new CreateProductRequest(
    name: 'Enterprise Seat',
    listPrice: 299.00,
    billingFrequency: 'monthly',
    categoryId: 'category-uuid',
    sku: 'ENT-001',
));

// Fetch primary images for a set of product IDs
$images = TurboQuote::getProductPrimaryImages(['product-uuid-1', 'product-uuid-2']);
// $images['product-uuid-1'] => image array or null
```

:::note Product images
When `CreateProductRequest` or `UpdateProductRequest` includes an `images` key (array of file paths or raw bytes), the SDK automatically switches to multipart form upload. The MIME type is detected from magic bytes on the server side.
:::

### Bundles

| Method | Signature | Returns |
|---|---|---|
| `listBundles` | `(?ListBundlesRequest)` | `BundleListResponse` |
| `createBundle` | `(CreateBundleRequest)` | `Bundle` |
| `getBundle` | `(string $id)` | `Bundle` |
| `updateBundle` | `(string $id, UpdateBundleRequest)` | `Bundle` |
| `deleteBundle` | `(string $id)` | `MessageResponse` |
| `duplicateBundle` | `(string $id)` | `Bundle` |

Each entry in `items` **requires** `productId`, `unitPrice`, and `billingFrequency`. `quantity` is optional and defaults to `1`.

```php
use TurboDocx\Types\Requests\Quote\CreateBundleRequest;

$bundle = TurboQuote::createBundle(new CreateBundleRequest(
    name: 'Starter Kit',
    categoryId: 'category-uuid',
    items: [
        [
            'productId' => 'product-uuid-1',
            'unitPrice' => 199.00,
            'billingFrequency' => 'monthly',
            'quantity' => 1,
        ],
        [
            'productId' => 'product-uuid-2',
            'unitPrice' => 49.00,
            'billingFrequency' => 'monthly',
            'quantity' => 2,
        ],
    ],
));

$copy = TurboQuote::duplicateBundle($bundle->id);
```

### Price Books

| Method | Signature | Returns |
|---|---|---|
| `listPriceBooks` | `(?ListPriceBooksRequest)` | `PriceBookListResponse` |
| `createPriceBook` | `(CreatePriceBookRequest)` | `PriceBook` |
| `getPriceBook` | `(string $id)` | `PriceBook` |
| `updatePriceBook` | `(string $id, UpdatePriceBookRequest)` | `PriceBook` |
| `deletePriceBook` | `(string $id)` | `MessageResponse` |
| `duplicatePriceBook` | `(string $id)` | `PriceBook` |
| `listPriceBookProducts` | `(string $id, ?ListPriceBookProductsRequest)` | `PriceBookProductListResponse` |

```php
use TurboDocx\Types\Requests\Quote\CreatePriceBookRequest;

$pb = TurboQuote::createPriceBook(new CreatePriceBookRequest(
    name: 'Partner Discount',
    priceBookTypeId: 'pricebook-type-uuid',
    validFrom: '2026-01-01',
    discountPercent: 15.0,
));

// List products enrolled in the price book
$products = TurboQuote::listPriceBookProducts($pb->id);
```

### Companies

| Method | Signature | Returns |
|---|---|---|
| `listCompanies` | `(?ListCompaniesRequest)` | `CompanyListResponse` |
| `createCompany` | `(CreateCompanyRequest)` | `Company` |
| `getCompany` | `(string $id)` | `Company` |
| `updateCompany` | `(string $id, UpdateCompanyRequest)` | `Company` |
| `deleteCompany` | `(string $id)` | `MessageResponse` |
| `listCompanyContacts` | `(string $companyId, ?ListContactsRequest)` | `ContactListResponse` |

```php
use TurboDocx\Types\Requests\Quote\CreateCompanyRequest;

// A company requires at least one contact on creation
$company = TurboQuote::createCompany(new CreateCompanyRequest(
    name: 'Acme Corp',
    contacts: [
        ['name' => 'Jane Doe', 'email' => 'jane@acme.com'],
    ],
));

$contacts = TurboQuote::listCompanyContacts($company->id);
```

### Contacts

| Method | Signature | Returns |
|---|---|---|
| `listContacts` | `(?ListContactsRequest)` | `ContactListResponse` |
| `createContact` | `(CreateContactRequest)` | `Contact` |
| `updateContact` | `(string $id, UpdateContactRequest)` | `Contact` |
| `deleteContact` | `(string $id)` | `MessageResponse` |

:::note No getContact
There is no `getContact($id)` — the backend does not expose a `GET /v1/contacts/:id` endpoint. Use `listContacts` with a search query or `listCompanyContacts` instead.
:::

```php
use TurboDocx\Types\Requests\Quote\CreateContactRequest;

$contact = TurboQuote::createContact(new CreateContactRequest(
    name: 'John Smith',
    companyId: 'company-uuid',
    email: 'john@acme.com',
));
```

### Quote Templates

| Method | Signature | Returns |
|---|---|---|
| `listTemplates` | `(?ListTemplatesRequest)` | `QuoteTemplateListResponse` |
| `getTemplate` | `()` | `QuoteTemplate` — auto-created if none exists |
| `getTemplateById` | `(string $id)` | `QuoteTemplate` |
| `createTemplate` | `(CreateQuoteTemplateRequest)` | `QuoteTemplate` — `400` if one already exists |
| `updateTemplate` | `(string $id, UpdateQuoteTemplateRequest)` | `QuoteTemplate` |
| `deleteTemplate` | `(string $id)` | `MessageResponse` — resets to org branding defaults |

:::note getTemplate vs getTemplateById
`getTemplate()` (no argument) hits `GET /v1/quote-template` (singular) and returns the org's currently active template. `getTemplateById($id)` hits `GET /v1/quote-templates/:id` and returns any specific template by ID.
:::

:::warning Templates are auto-provisioned — use getTemplate() → updateTemplate()
`getTemplate()` **self-heals**: if the org has no template, the API creates one from your org branding and returns it. Every established org therefore already has a template, which means:

- `createTemplate()` returns **400 `TEMPLATE_ALREADY_EXISTS`** and is effectively unreachable. Do not build a get-then-create flow.
- `deleteTemplate()` is really "reset to org branding defaults" — it soft-deletes, and the next `getTemplate()` regenerates a fresh one.

The correct flow is **`getTemplate()` → `updateTemplate()`**.
:::

```php
use TurboDocx\Types\Requests\Quote\UpdateQuoteTemplateRequest;

// 1. Get the active org template (created from org branding on first read)
$active = TurboQuote::getTemplate();
echo $active->name;

// 2. Brand it by updating the template you just fetched
$branded = TurboQuote::updateTemplate($active->id, new UpdateQuoteTemplateRequest(
    logoUrl: 'https://cdn.example.com/logo.png',
    primaryColor: '#0057b8',
    senderName: 'TurboDocx Sales',
));

// List all templates
$templates = TurboQuote::listTemplates();
```

### Types / Categories

| Method | Signature | Returns |
|---|---|---|
| `listTypes` | `(?ListTypesRequest)` | `QuoteTypeListResponse` |
| `createType` | `(CreateQuoteTypeRequest)` | `QuoteType` |
| `updateType` | `(string $id, UpdateQuoteTypeRequest)` | `QuoteType` |
| `deleteType` | `(string $id)` | `MessageResponse` |

:::note No getType
There is no `getType($id)` — the backend does not expose a `GET /v1/types/:id` endpoint. Use `listTypes` instead.
:::

```php
use TurboDocx\Types\Requests\Quote\CreateQuoteTypeRequest;

$type = TurboQuote::createType(new CreateQuoteTypeRequest(name: 'Renewal'));
```

### Bulk Imports

Every create-family entity has a matching `bulkCreate*` method for seeding a catalog or migrating CRM data in one call. Each method sends `POST {resource}/bulk` with an array of the **same typed request objects as that entity's single-create method** (e.g. `bulkCreateProducts` takes an array of `CreateProductRequest`). Company rows require a `contacts` array with at least one contact; contact rows require a `companyId`.

Rows process sequentially with **partial success** — a failed row does not throw and does not roll back earlier rows. Every bulk method returns a typed `BulkImportResult`:

- `$result->imported` — count of rows created
- `$result->failed` — array of `BulkImportRowIssue` (`row` + `reason`) for rows that did not import; `row` is the **1-indexed** position in your request array
- `$result->adjusted` — array of `BulkImportRowIssue` for rows that imported *with* a server-side adjustment (e.g. a bundle item whose product wasn't found was dropped)

Requests are capped at **500 rows** — anything above the cap returns a `400`. Available to admin and contributor API keys.

:::caution Product rows require a real `categoryId`
Every `bulkCreateProducts` row **requires** `name`, `categoryId`, `listPrice`, and `billingFrequency`. `categoryId` must be the **UUID** of an existing type (`categoryType: 'product_category'`) — there is no `categoryName` field on the bulk row schema, and the API rejects unknown keys, so passing one returns a `400`. Resolve or create the category first with `listTypes` / `createType`, then pass its `id`.
:::

```php
use TurboDocx\Types\Requests\Quote\CreateProductRequest;
use TurboDocx\Types\Requests\Quote\CreateQuoteTypeRequest;
use TurboDocx\Types\Requests\Quote\ListTypesRequest;

// 1. Resolve the product category first — bulk rows need its UUID, not its name.
$types = TurboQuote::listTypes(new ListTypesRequest(categoryType: 'product_category'));

$categoryId = null;
foreach ($types->results as $type) {
    if ($type->name === 'Software') {
        $categoryId = $type->id;
        break;
    }
}
if ($categoryId === null) {
    $categoryId = TurboQuote::createType(new CreateQuoteTypeRequest(
        name: 'Software',
        categoryType: 'product_category',
    ))->id;
}

// 2. Import, passing the resolved UUID on every row.
$result = TurboQuote::bulkCreateProducts([
    new CreateProductRequest(
        name: 'Enterprise Seat',
        categoryId: $categoryId,
        listPrice: 299.00,
        billingFrequency: 'monthly',
    ),
    new CreateProductRequest(
        name: 'Onboarding Package',
        categoryId: $categoryId,
        listPrice: 499.00,
        billingFrequency: 'one-time',
    ),
]);

echo "Imported {$result->imported} of 2 rows\n";
foreach ($result->failed as $failure) {
    echo "Row {$failure->row} failed: {$failure->reason}\n";
}
foreach ($result->adjusted as $adjustment) {
    echo "Row {$adjustment->row} imported with adjustment: {$adjustment->reason}\n";
}
```

The other five bulk methods follow the exact same pattern:

| Method | Rows | Returns |
|---|---|---|
| `bulkCreatePriceBooks` | `CreatePriceBookRequest[]` | `BulkImportResult` |
| `bulkCreateBundles` | `CreateBundleRequest[]` | `BulkImportResult` |
| `bulkCreateCompanies` | `CreateCompanyRequest[]` — each row needs `contacts` (min. 1) | `BulkImportResult` |
| `bulkCreateContacts` | `CreateContactRequest[]` — each row needs `companyId` | `BulkImportResult` |
| `bulkCreateTypes` | `CreateQuoteTypeRequest[]` | `BulkImportResult` |

### Convenience Method

#### createAndSend

Creates a quote, optionally adds line items and bundle items, then sends it — all in a single call.

```php
use TurboDocx\Types\Requests\Quote\CreateAndSendRequest;
use TurboDocx\Types\Requests\Quote\AddLineItemRequest;
use TurboDocx\Types\Requests\Quote\AddBundleLineItemRequest;
use TurboDocx\Types\Requests\Quote\SendQuoteRequest;

$result = TurboQuote::createAndSend(new CreateAndSendRequest(
    name: 'Annual Plan',
    companyId: 'company-uuid',
    contactId: 'contact-uuid',
    validUntil: '2026-12-31',
    items: [
        new AddLineItemRequest(
            productId: 'product-uuid',
            productName: 'Annual License',
            unitPrice: 999.00,
            billingFrequency: 'annual',
            quantity: 10,
        ),
    ],
    bundleItems: [
        new AddBundleLineItemRequest(
            bundleId: 'bundle-uuid',
            bundleName: 'Annual Bundle',
            quantity: 1,
        ),
    ],
    send: new SendQuoteRequest(),
));

echo "Sent quote: {$result->quote->id}\n";
```

---

## Error Handling

```php
use TurboDocx\Exceptions\TurboDocxException;
use TurboDocx\Exceptions\AuthenticationException;
use TurboDocx\Exceptions\AuthorizationException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Exceptions\NotFoundException;
use TurboDocx\Exceptions\RateLimitException;
use TurboDocx\Exceptions\NetworkException;

try {
    $quote = TurboQuote::createQuote(new CreateQuoteRequest(
        name: 'Q3 Proposal',
        companyId: 'company-uuid',
        contactId: 'contact-uuid',
    ));
} catch (ValidationException $e) {
    // 400 — missing required fields, invalid values
    echo "Validation error: {$e->getMessage()}\n";
} catch (AuthenticationException $e) {
    // 401 — missing or revoked API key
    echo "Auth failed: {$e->getMessage()}\n";
} catch (AuthorizationException $e) {
    // 403 — key exists but lacks permission
    echo "Forbidden: {$e->getMessage()}\n";
} catch (NotFoundException $e) {
    // 404 — quote, company, product, etc. not found
    echo "Not found: {$e->getMessage()}\n";
} catch (RateLimitException $e) {
    // 429 — back off and retry
    echo "Rate limited: {$e->getMessage()}\n";
} catch (NetworkException $e) {
    // request never reached the server
    echo "Network error: {$e->getMessage()}\n";
} catch (TurboDocxException $e) {
    // catch-all for any other typed SDK error
    echo "Error {$e->statusCode}: {$e->getMessage()}\n";
}
```

### Common Error Codes

| Status | Exception | When |
|---|---|---|
| 400 | `ValidationException` | Missing required fields, invalid enum value, malformed body |
| 401 | `AuthenticationException` | Missing or invalid API key |
| 403 | `AuthorizationException` | Valid key without sufficient permissions |
| 404 | `NotFoundException` | Quote, product, company, etc. does not exist |
| 409 | `TurboDocxException` | Conflict (e.g., duplicate SKU) |
| 429 | `RateLimitException` | Rate limit exceeded — back off |

---

## See Also

- [TurboQuote Python SDK](/docs/SDKs/quote-python) — same surface in Python
- [TurboSign PHP SDK](/docs/SDKs/php) — sending documents for signature from PHP
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks-php) — receiving signature events in PHP
- [Deliverable PHP SDK](/docs/SDKs/deliverable-php) — document generation from PHP
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [TurboDocx SDK on Packagist](https://packagist.org/packages/turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
