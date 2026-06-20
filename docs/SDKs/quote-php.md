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

$quote = TurboQuote::createQuote(new CreateQuoteRequest(
    name: 'Q3 Proposal',
    companyId: 'company-uuid',
    contactId: 'contact-uuid',
    validUntil: '2026-09-30',
    currency: 'USD',
));
```

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

```php
use TurboDocx\Types\Requests\Quote\HandleExpiredQuoteRequest;

$quote = TurboQuote::handleExpiredQuote('quote-uuid', new HandleExpiredQuoteRequest(
    action: 'extend',
    reason: 'Customer requested more time to review',
    newValidUntil: '2026-12-31',
));
```

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
use TurboDocx\Types\Requests\Quote\QuoteNumberFormat;

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

Pass a single `AddLineItemRequest` or an array of them.

```php
use TurboDocx\Types\Requests\Quote\AddLineItemRequest;

$items = TurboQuote::addLineItems('quote-uuid', [
    new AddLineItemRequest(
        productId: 'product-uuid-1',
        productName: 'Platform Subscription',
        unitPrice: 199.00,
        billingFrequency: 'monthly',
        quantity: 2,
    ),
    new AddLineItemRequest(
        productId: 'product-uuid-2',
        productName: 'Onboarding',
        unitPrice: 499.00,
        billingFrequency: 'one-time',
        quantity: 1,
    ),
]);
```

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

```php
use TurboDocx\Types\Requests\Quote\CreateBundleRequest;

$bundle = TurboQuote::createBundle(new CreateBundleRequest(
    name: 'Starter Kit',
    categoryId: 'category-uuid',
    items: [
        ['productId' => 'product-uuid-1', 'quantity' => 1],
        ['productId' => 'product-uuid-2', 'quantity' => 2],
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
| `getTemplate` | `()` | `QuoteTemplate` |
| `getTemplateById` | `(string $id)` | `QuoteTemplate` |
| `createTemplate` | `(CreateQuoteTemplateRequest)` | `QuoteTemplate` |
| `updateTemplate` | `(string $id, UpdateQuoteTemplateRequest)` | `QuoteTemplate` |
| `deleteTemplate` | `(string $id)` | `MessageResponse` |

:::note getTemplate vs getTemplateById
`getTemplate()` (no argument) hits `GET /v1/quote-template` (singular) and returns the org's currently active template. `getTemplateById($id)` hits `GET /v1/quote-templates/:id` and returns any specific template by ID.
:::

```php
// Get the active org template
$active = TurboQuote::getTemplate();
echo $active->name;

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
- [SDKs Overview](/docs/SDKs) — all SDKs across all five languages
- [TurboDocx SDK on Packagist](https://packagist.org/packages/turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
