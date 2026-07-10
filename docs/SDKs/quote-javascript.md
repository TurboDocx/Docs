---
title: TurboQuote JavaScript / TypeScript SDK
sidebar_position: 20
sidebar_label: "TurboQuote: JavaScript / TypeScript"
description: Official TurboDocx TurboQuote SDK for JavaScript and TypeScript. Create quotes and proposals, manage line items, products, bundles, price books, companies, and contacts — all with full TypeScript types and async/await patterns.
keywords:
  - turboquote javascript
  - turboquote typescript
  - turbodocx quote sdk
  - quote javascript
  - proposal sdk javascript
  - cpq javascript
  - turbodocx sdk npm
  - quote api typescript
  - turboquote node
  - turbodocx cpq
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboQuote JavaScript / TypeScript SDK

<QuickstartSkillNudge command="/turbodocx-sdk turboquote" product="TurboQuote" />

The official TurboDocx TurboQuote SDK for Node.js and browser applications. Build quoting and CPQ (configure-price-quote) workflows: create and send quotes, manage line items, maintain a product and bundle catalog, apply price books, and handle the full quote lifecycle — all with zero runtime dependencies and complete TypeScript types. Available on npm as `@turbodocx/sdk` (same package as TurboSign and TurboWebhooks).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's quoting and CPQ module. Quotes progress through a lifecycle: `draft` → `pending_approval` → `sent` → `accepted` / `declined` / `voided`. Each quote belongs to a company and contact, carries line items (individual products or bundles), and can optionally have a price book applied. Accepted quotes can be merged with a TurboDocx Deliverable (e.g. a contract generated from a template) and sent for e-signature through TurboSign via `sendQuoteWithDeliverable`.
:::

## Installation

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @turbodocx/sdk
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @turbodocx/sdk
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @turbodocx/sdk
```

</TabItem>
</Tabs>

## Requirements

- Node.js 18 or higher (native `fetch`)
- TypeScript 4.7+ (optional, for type checking — declaration files are included)
- Zero runtime dependencies — the SDK uses only Node built-ins

## Configuration

<Tabs groupId="js-variant">
<TabItem value="typescript" label="TypeScript" default>

```typescript
import { TurboQuote } from '@turbodocx/sdk';

TurboQuote.configure({
  apiKey: process.env.TURBODOCX_API_KEY!,
  orgId: process.env.TURBODOCX_ORG_ID,   // optional — falls back to env var
});
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
const { TurboQuote } = require('@turbodocx/sdk');

TurboQuote.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
});
```

</TabItem>
</Tabs>

:::tip No senderEmail required
Unlike TurboSign, `TurboQuote.configure()` does **not** require `senderEmail` or `senderName` — quotes are not sent as signature emails. Only `apiKey` is required; `orgId` is recommended but falls back to `TURBODOCX_ORG_ID`. If you skip `configure()` entirely, the SDK auto-initialises from environment variables on the first method call.
:::

### Environment Variables

```bash
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

## Quick Start

The most common flow: create a quote for a company and contact, add a product line item, then send it.

<Tabs groupId="js-variant">
<TabItem value="typescript" label="TypeScript" default>

```typescript
import { TurboQuote } from '@turbodocx/sdk';
import { writeFileSync } from 'node:fs';

TurboQuote.configure({
  apiKey: process.env.TURBODOCX_API_KEY!,
  orgId: process.env.TURBODOCX_ORG_ID,
});

// 1. Create a draft quote
const quote = await TurboQuote.createQuote({
  name: 'Acme Corp — Enterprise Plan',
  companyId: 'company-uuid',
  contactId: 'contact-uuid',
  currency: 'USD',
  termDays: 30,
});

// 2. Add a product line item
await TurboQuote.addLineItems(quote.id, {
  productId: 'product-uuid',
  productName: 'Enterprise Licence',
  unitPrice: 1200,
  billingFrequency: 'annual',
  quantity: 5,
});

// 3. Send the quote
const { quote: sentQuote, message } = await TurboQuote.sendQuote(quote.id, {
  validUntil: '2026-07-31',
});
console.log(message);           // "Quote sent successfully"
console.log(sentQuote.status);  // "sent"

// 4. Download the PDF
const pdf = await TurboQuote.downloadQuotePdf(sentQuote.id);
writeFileSync('quote.pdf', Buffer.from(pdf));
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
const { TurboQuote } = require('@turbodocx/sdk');
const { writeFileSync } = require('fs');

TurboQuote.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
});

// 1. Create a draft quote
const quote = await TurboQuote.createQuote({
  name: 'Acme Corp — Enterprise Plan',
  companyId: 'company-uuid',
  contactId: 'contact-uuid',
  currency: 'USD',
  termDays: 30,
});

// 2. Add a product line item
await TurboQuote.addLineItems(quote.id, {
  productId: 'product-uuid',
  productName: 'Enterprise Licence',
  unitPrice: 1200,
  billingFrequency: 'annual',
  quantity: 5,
});

// 3. Send the quote
const { quote: sentQuote, message } = await TurboQuote.sendQuote(quote.id, {
  validUntil: '2026-07-31',
});
console.log(message);           // "Quote sent successfully"
console.log(sentQuote.status);  // "sent"

// 4. Download the PDF
const pdf = await TurboQuote.downloadQuotePdf(sentQuote.id);
writeFileSync('quote.pdf', Buffer.from(pdf));
```

</TabItem>
</Tabs>

### Convenience: createAndSend

`createAndSend` combines quote creation, line item addition, and sending into a single call.

```typescript
const { quote } = await TurboQuote.createAndSend({
  name: 'Acme Corp — Starter',
  companyId: 'company-uuid',
  contactId: 'contact-uuid',
  currency: 'USD',
  termDays: 30,
  items: [
    { productId: null, productName: 'Setup Fee', unitPrice: 500, billingFrequency: 'one-time' },
    { productId: 'product-uuid', productName: 'Monthly Subscription', unitPrice: 99, billingFrequency: 'monthly', quantity: 10 },
  ],
  send: { validUntil: '2026-07-31' },
});
console.log(quote.status); // "sent"
```

---

## Method Reference

All methods are static on the `TurboQuote` class. Configure once, then call on the class directly.

### Quotes

#### listQuotes

List quotes with optional pagination and filters. Returns totals and pipeline stats alongside results.

```typescript
const { results, totalRecords, stats } = await TurboQuote.listQuotes({
  limit: 20,
  offset: 0,
  statuses: ['draft', 'sent'],   // string or string[]
  companyId: 'company-uuid',
  currency: 'USD',
});
// stats.total, stats.winRate, stats.monthlyRecurringRevenue, ...
```

#### createQuote

Create a new quote in `draft` status.

```typescript
// Fixed-term quote — termDays 1–3650, no renewalPeriod (0 = one-time, -1 = auto-renewal)
const quote = await TurboQuote.createQuote({
  name: 'Q3 Renewal',           // required
  companyId: 'company-uuid',    // required
  contactId: 'contact-uuid',    // required
  currency: 'USD',              // 'USD'|'EUR'|'GBP'|'CAD'|'AUD'|'INR'
  termDays: 30,                 // fixed term in days
  validUntil: '2026-09-30',
  taxRate: 8.5,
  priceBookId: 'pb-uuid',
});

// Auto-renewal quote — termDays: -1 REQUIRES renewalPeriod, and renewalPeriod is ONLY valid
// when termDays is -1. Pairing renewalPeriod with a fixed term (e.g. termDays: 30) returns a 400.
const subscription = await TurboQuote.createQuote({
  name: 'Annual Subscription',
  companyId: 'company-uuid',
  contactId: 'contact-uuid',
  currency: 'USD',
  termDays: -1,                 // -1 = auto-renewal
  renewalPeriod: 'annually',    // 'weekly'|'monthly'|'quarterly'|'annually'
});
```

#### getQuote

Fetch a single quote. The returned object includes a `statusInfo` field with transition flags (`canSend`, `canAccept`, `canDecline`, `canVoid`).

```typescript
const quote = await TurboQuote.getQuote('quote-uuid');
console.log(quote.statusInfo?.canSend);  // true when status is 'draft'
```

#### updateQuote

Patch any combination of quote fields. Pass `null` to clear nullable fields (`renewalPeriod`, `validUntil`, `taxRate`, `priceBookId`).

```typescript
const updated = await TurboQuote.updateQuote('quote-uuid', {
  name: 'Q3 Renewal — Revised',
  taxRate: null,       // clears the tax rate
});
```

#### deleteQuote

Soft-delete a quote.

```typescript
const { message } = await TurboQuote.deleteQuote('quote-uuid');
```

#### duplicateQuote

Copy a quote (and its line items) into a new draft.

```typescript
const copy = await TurboQuote.duplicateQuote('quote-uuid');
```

#### applyPriceBook

Apply a price book to all line items on a quote. Returns the updated quote plus counts of how many items were updated vs skipped.

```typescript
const { quote, updatedCount, skippedCount, message } = await TurboQuote.applyPriceBook(
  'quote-uuid',
  'pricebook-uuid',
);
```

#### removePriceBook

Detach the price book from a quote (line item prices are not reverted).

```typescript
const quote = await TurboQuote.removePriceBook('quote-uuid');
```

#### downloadQuotePdf

Download the quote as a PDF. Returns raw bytes as an `ArrayBuffer`.

```typescript
const pdf = await TurboQuote.downloadQuotePdf('quote-uuid');
writeFileSync('quote.pdf', Buffer.from(pdf));
```

---

### Quote Numbering Configuration

Customize the per-org quote number format: prefix, year/month tokens, separator, zero-padding, suffix, starting number, and reset cadence. Both methods are **admin only**; a non-admin API key receives a `403`.

#### getQuoteNumberConfig

Fetch the org's current quote numbering format and the current per-period issued floor.

```typescript
const config = await TurboQuote.getQuoteNumberConfig();
console.log(config.format.prefix);   // e.g. "Q-"
console.log(config.currentFloor);    // the current per-period issued floor
```

#### updateQuoteNumberConfig

Update the numbering format. Pass the full format object; all eight fields are required.

```typescript
const config = await TurboQuote.updateQuoteNumberConfig({
  prefix: 'INV',
  yearToken: 'none',      // 'none' | 'two' | 'four'
  monthToken: 'off',      // 'off' | 'two'
  separator: '-',
  padWidth: 4,            // 0–12
  suffix: '',
  startNumber: 1000,      // >= 0
  resetCadence: 'never',  // 'never' | 'yearly' | 'monthly'
});
console.log(config.format.startNumber);  // 1000
```

#### Field reference, defaults & validation

All eight `format` fields are sent on every update. The API enforces these caps and allowed values — a violation returns `400`:

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

#### sendQuote

Send a draft quote to the contact. Optionally include CC recipients or set a validity deadline.

```typescript
const { quote, message } = await TurboQuote.sendQuote('quote-uuid', {
  validUntil: '2026-07-31',
  ccEmails: ['manager@example.com'],
});
```

#### sendQuoteWithDeliverable

Send a quote paired with a TurboDocx deliverable (e.g., a contract generated from a template). The deliverable is merged before or after the quote PDF.

```typescript
const { quote, message, documentId } = await TurboQuote.sendQuoteWithDeliverable(
  'quote-uuid',
  {
    deliverableId: 'deliverable-uuid',
    mergePosition: 'end',   // 'beginning' | 'end'
    ccEmails: ['legal@example.com'],
  },
);
// documentId — TurboSign document created for the merged PDF
```

#### declineQuote

Mark a sent quote as declined (typically called on behalf of the recipient).

```typescript
const quote = await TurboQuote.declineQuote('quote-uuid', {
  reason: 'Budget constraints for this quarter',
});
```

#### voidQuote

Void a quote that should no longer be valid.

```typescript
const quote = await TurboQuote.voidQuote('quote-uuid', {
  reason: 'Superseded by revised quote #Q-102',
});
```

#### handleExpiredQuote

Handle a quote that has passed its `validUntil` date. Choose to `void` or `decline` it and optionally extend with a new validity date.

```typescript
const quote = await TurboQuote.handleExpiredQuote('quote-uuid', {
  action: 'void',               // 'void' | 'decline'
  reason: 'Expired — re-quoting',
  newValidUntil: '2026-08-31',
});
```

---

### Line Items

Line items attach products or bundles to a quote, each with a price, quantity, billing frequency, and optional discount.

#### listLineItems

```typescript
const { results, totalRecords } = await TurboQuote.listLineItems('quote-uuid', {
  limit: 50,
  billingFrequency: 'monthly',
});
```

#### addLineItems

Add one or more product line items. Pass a single object or an array.

```typescript
// Single item
await TurboQuote.addLineItems('quote-uuid', {
  productId: 'product-uuid',       // null for a custom (freeform) line item
  productName: 'Professional Services',
  unitPrice: 150,
  billingFrequency: 'one-time',
  quantity: 8,
  discountPercent: 10,
  discountType: 'percent',
});

// Multiple items at once
await TurboQuote.addLineItems('quote-uuid', [
  { productId: 'p1', productName: 'Licence A', unitPrice: 500, billingFrequency: 'annual' },
  { productId: 'p2', productName: 'Licence B', unitPrice: 300, billingFrequency: 'annual' },
]);
```

#### addBundleLineItems

Add one or more bundle line items.

```typescript
await TurboQuote.addBundleLineItems('quote-uuid', {
  bundleId: 'bundle-uuid',
  bundleName: 'Starter Bundle',
  quantity: 2,
  showItemsToEndUser: true,
});
```

#### updateLineItem

Update a single line item's price, quantity, discount, or billing frequency.

```typescript
const updated = await TurboQuote.updateLineItem('quote-uuid', 'item-uuid', {
  quantity: 12,
  discountPercent: 15,
  billingFrequency: 'monthly',
});
```

#### removeLineItem

Remove a line item from a quote.

```typescript
const { message } = await TurboQuote.removeLineItem('quote-uuid', 'item-uuid');
```

---

### Products

Manage your product catalog. Products can include images (uploaded as multipart form data — the SDK detects the MIME type from magic bytes automatically).

| Method | Signature | Returns |
|---|---|---|
| `listProducts` | `(opts?) → ProductListResponse` | Paginated list + catalog stats |
| `createProduct` | `(req) → Product` | Created product |
| `getProduct` | `(id) → Product` | Single product |
| `updateProduct` | `(id, req) → Product` | Updated product |
| `deleteProduct` | `(id) → SuccessResponse` | Message |
| `duplicateProduct` | `(id) → Product` | New duplicate |
| `getProductPrimaryImages` | `(productIds[]) → { [id]: ProductImage \| null }` | Primary image map |

```typescript
// Create a product with an image
const product = await TurboQuote.createProduct({
  name: 'Enterprise Licence',
  listPrice: 1200,
  billingFrequency: 'annual',
  categoryId: 'category-uuid',
  sku: 'ENT-001',
  showInCatalog: true,
  images: ['/path/to/product-image.png'],  // file path, Buffer, or File object
});

// List with filters
const { results, totalProducts } = await TurboQuote.listProducts({
  categoryIds: ['cat-1', 'cat-2'],
  billingFrequency: 'monthly',
  showInCatalog: true,
});

// Fetch primary images for multiple products at once
const images = await TurboQuote.getProductPrimaryImages(['p-uuid-1', 'p-uuid-2']);
// images['p-uuid-1'] → ProductImage | null
```

---

### Bundles

Bundles group multiple products into a single purchasable unit with optional bundle-level discounts.

| Method | Signature | Returns |
|---|---|---|
| `listBundles` | `(opts?) → BundleListResponse` | Paginated list + stats |
| `createBundle` | `(req) → Bundle` | Created bundle |
| `getBundle` | `(id) → Bundle` | Single bundle |
| `updateBundle` | `(id, req) → Bundle` | Updated bundle |
| `deleteBundle` | `(id) → SuccessResponse` | Message |
| `duplicateBundle` | `(id) → Bundle` | New duplicate |

```typescript
const bundle = await TurboQuote.createBundle({
  name: 'Starter Pack',
  categoryId: 'category-uuid',
  currency: 'USD',
  showInCatalog: true,
  syncWithProducts: true,
  items: [
    { productId: 'p1', unitPrice: 200, billingFrequency: 'monthly', quantity: 1 },
    { productId: 'p2', unitPrice: 50,  billingFrequency: 'monthly', quantity: 3 },
  ],
});
```

---

### Price Books

Price books let you define alternative pricing tiers. When a price book is applied to a quote, matching product line items are repriced automatically.

| Method | Signature | Returns |
|---|---|---|
| `listPriceBooks` | `(opts?) → PriceBookListResponse` | Paginated list + stats |
| `createPriceBook` | `(req) → PriceBook` | Created price book |
| `getPriceBook` | `(id) → PriceBook` | Single price book |
| `updatePriceBook` | `(id, req) → PriceBook` | Updated price book |
| `deletePriceBook` | `(id) → SuccessResponse` | Message |
| `duplicatePriceBook` | `(id) → PriceBook` | New duplicate |
| `listPriceBookProducts` | `(id, opts?) → PaginatedResponse<PriceBookProductPricing>` | Per-product pricing |

```typescript
const pb = await TurboQuote.createPriceBook({
  name: 'Partner Tier',
  priceBookTypeId: 'type-uuid',
  validFrom: '2026-01-01',
  validTo: '2026-12-31',
  discountPercent: 20,
  isDefault: false,
  showInQuoteBuilder: true,
  productPricing: [
    { productId: 'p1', discountPercent: 25, finalPrice: 900 },
  ],
});

// Apply to a quote
const { updatedCount, skippedCount } = await TurboQuote.applyPriceBook(
  'quote-uuid',
  pb.id,
);
```

---

### Companies

Companies represent the buyer organisations your quotes are addressed to. Each company must have at least one contact.

| Method | Signature | Returns |
|---|---|---|
| `listCompanies` | `(opts?) → CompanyListResponse` | Paginated list |
| `createCompany` | `(req) → Company` | Created company |
| `getCompany` | `(id) → Company` | Single company |
| `updateCompany` | `(id, req) → Company` | Updated company |
| `deleteCompany` | `(id) → SuccessResponse` | Message |
| `listCompanyContacts` | `(companyId, opts?) → ContactListResponse` | Company's contacts |

```typescript
const company = await TurboQuote.createCompany({
  name: 'Acme Corporation',
  phone: '+1-555-0100',
  city: 'San Francisco',
  state: 'CA',
  country: 'US',
  contacts: [
    { name: 'Alice Smith', email: 'alice@acme.example', title: 'VP of Engineering' },
  ],
});

const { results: contacts } = await TurboQuote.listCompanyContacts(company.id);
```

---

### Contacts

Contacts belong to a company and are the individuals a quote is addressed to.

:::note No getContact endpoint
There is no `getContact(id)` method — the backend does not expose a `GET /v1/contacts/:id` route. Retrieve an individual contact via `listContacts` with a search query, or fetch all contacts for a company with `listCompanyContacts`.
:::

| Method | Signature | Returns |
|---|---|---|
| `listContacts` | `(opts?) → ContactListResponse` | Paginated list |
| `createContact` | `(req) → Contact` | Created contact |
| `updateContact` | `(id, req) → Contact` | Updated contact |
| `deleteContact` | `(id) → SuccessResponse` | Message |

```typescript
const contact = await TurboQuote.createContact({
  name: 'Bob Jones',
  companyId: 'company-uuid',
  email: 'bob@acme.example',
  title: 'Procurement Manager',
});

const { results } = await TurboQuote.listContacts({ companyId: 'company-uuid' });
```

---

### Quote Templates

Quote templates control the visual presentation of the sent quote (logo, brand colours, disclaimer, terms, sender info). There is one active template per org, accessible via `getTemplate()`. You can also manage named templates.

:::note Singleton vs. list
`getTemplate()` returns the org's single active template via `GET /v1/quote-template` (singular path). `listTemplates()` returns all named templates via `GET /v1/quote-templates` (plural path).
:::

| Method | Signature | Returns |
|---|---|---|
| `getTemplate` | `() → QuoteTemplate` | Active org template |
| `listTemplates` | `(opts?) → QuoteTemplateListResponse` | All named templates |
| `getTemplateById` | `(id) → QuoteTemplate` | Named template by ID |
| `createTemplate` | `(req) → QuoteTemplate` | Created template |
| `updateTemplate` | `(id, req) → QuoteTemplate` | Updated template |
| `deleteTemplate` | `(id) → SuccessResponse` | Message |

```typescript
// Fetch the active template
const tmpl = await TurboQuote.getTemplate();
console.log(tmpl.primaryColor);  // e.g. "#1a73e8"

// Create a named template
const branded = await TurboQuote.createTemplate({
  logoUrl: 'https://cdn.example.com/logo.png',
  primaryColor: '#0057b8',
  primaryTextColor: '#ffffff',
  disclaimer: 'Prices valid for 30 days.',
  termsAndConditions: 'See attached terms...',
  senderName: 'TurboDocx Sales',
  senderEmail: 'sales@example.com',
});
```

---

### Types (Categories)

Types are reusable category/classification values used across products, bundles, price books, and companies (e.g., industry tags, price book types).

:::note No getType endpoint
There is no `getType(id)` method — the backend does not expose `GET /v1/types/:id`. Use `listTypes` to retrieve individual types.
:::

| Method | Signature | Returns |
|---|---|---|
| `listTypes` | `(opts?) → QuoteTypeListResponse` | Paginated list |
| `createType` | `(req) → QuoteType` | Created type |
| `updateType` | `(id, req) → QuoteType` | Updated type |
| `deleteType` | `(id) → SuccessResponse` | Message |

```typescript
const type = await TurboQuote.createType({
  name: 'Software',
  categoryType: 'product_category',  // 'product_category'|'pricebook_type'|'company_industry'|'bundle_category'
});

const { results } = await TurboQuote.listTypes({
  categoryType: 'company_industry',
  includeUsage: true,
});
```

---

### Bulk Imports

Every create-family entity has a matching `bulkCreate*` method for seeding a catalog or migrating CRM data in one call. Each method sends `POST {resource}/bulk` with an array of rows using the **same shape as that entity's single-create request** (e.g. `bulkCreateProducts` takes `CreateProductRequest[]`). Company rows require a `contacts` array with at least one contact; contact rows require a `companyId`.

Rows process sequentially with **partial success** — a failed row does not throw and does not roll back earlier rows. Every bulk method resolves to a `BulkImportResult`:

- `imported` — count of rows created
- `failed` — array of `{ row, reason }` for rows that did not import; `row` is the **1-indexed** position in your request array
- `adjusted` — array of `{ row, reason }` for rows that imported *with* a server-side adjustment (e.g. a bundle item whose product wasn't found was dropped)

Requests are capped at **500 rows** — anything above the cap returns a `400`. Available to admin and contributor API keys.

```typescript
const result = await TurboQuote.bulkCreateProducts([
  { name: 'Enterprise Licence', listPrice: 1200, billingFrequency: 'annual' },
  { name: 'Onboarding Package', listPrice: 499, billingFrequency: 'one-time' },
]);

console.log(`Imported ${result.imported} of 2 rows`);
for (const failure of result.failed) {
  console.error(`Row ${failure.row} failed: ${failure.reason}`);
}
for (const adjustment of result.adjusted) {
  console.warn(`Row ${adjustment.row} imported with adjustment: ${adjustment.reason}`);
}
```

The other five bulk methods follow the exact same pattern:

| Method | Argument | Returns |
|---|---|---|
| `bulkCreatePriceBooks` | `CreatePriceBookRequest[]` | `BulkImportResult` |
| `bulkCreateBundles` | `CreateBundleRequest[]` | `BulkImportResult` |
| `bulkCreateCompanies` | `CreateCompanyRequest[]` — each row needs `contacts` (min. 1) | `BulkImportResult` |
| `bulkCreateContacts` | `CreateContactRequest[]` — each row needs `companyId` | `BulkImportResult` |
| `bulkCreateTypes` | `CreateQuoteTypeRequest[]` | `BulkImportResult` |

---

## TypeScript Types

Key types exported from `@turbodocx/sdk`:

```typescript
import type {
  // Core quote
  Quote,
  QuoteStatusInfo,
  CreateQuoteRequest,
  UpdateQuoteRequest,
  ListQuotesOptions,
  QuoteListResponse,
  SendQuoteRequest,
  SendQuoteWithDeliverableRequest,
  DeclineQuoteRequest,
  VoidQuoteRequest,
  HandleExpiredQuoteRequest,
  ApplyPriceBookResponse,
  CreateAndSendRequest,
  // Line items
  LineItem,
  AddLineItemRequest,
  AddBundleLineItemRequest,
  UpdateLineItemRequest,
  ListLineItemsOptions,
  // Products
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ListProductsOptions,
  // Bundles
  Bundle,
  CreateBundleRequest,
  UpdateBundleRequest,
  // Price books
  PriceBook,
  CreatePriceBookRequest,
  // Companies & contacts
  Company,
  CreateCompanyRequest,
  Contact,
  CreateContactRequest,
  // Templates & types
  QuoteTemplate,
  QuoteType,
  // Enums
  QuoteStatus,
  BillingFrequency,
  Currency,
  RenewalPeriod,
  LineItemType,
  DiscountType,
  CategoryType,
  // Shared
  SuccessResponse,
} from '@turbodocx/sdk';
```

### Key Enum Values

| Type | Values |
|---|---|
| `QuoteStatus` | `'draft'` `'pending_approval'` `'sent'` `'accepted'` `'declined'` `'voided'` |
| `BillingFrequency` | `'monthly'` `'quarterly'` `'annual'` `'one-time'` |
| `Currency` | `'USD'` `'EUR'` `'GBP'` `'CAD'` `'AUD'` `'INR'` |
| `RenewalPeriod` | `'weekly'` `'monthly'` `'quarterly'` `'annually'` |
| `DiscountType` | `'percent'` `'amount'` |
| `CategoryType` | `'product_category'` `'pricebook_type'` `'company_industry'` `'bundle_category'` |

---

## Error Handling

```typescript
import {
  TurboQuote,
  TurboDocxError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from '@turbodocx/sdk';

try {
  await TurboQuote.sendQuote('quote-uuid');
} catch (e) {
  if (e instanceof ValidationError) {
    // 400 — e.g. quote is not in draft status, missing required fields
    console.error('Validation failed:', e.message);
  } else if (e instanceof NotFoundError) {
    // 404 — quote, company, contact, or product does not exist
    console.error('Not found:', e.message);
  } else if (e instanceof AuthenticationError) {
    // 401 — bad or revoked API key
    console.error('Auth failed:', e.message);
  } else if (e instanceof AuthorizationError) {
    // 403 — API key does not have permission for this org
    console.error('Forbidden:', e.message);
  } else if (e instanceof RateLimitError) {
    // 429 — back off and retry
    console.error('Rate limited — retry after a moment');
  } else if (e instanceof NetworkError) {
    // request never reached the server
    console.error('Network error:', e.message);
  } else if (e instanceof TurboDocxError) {
    // catch-all for any other typed SDK error
    console.error(`Error ${e.statusCode}: ${e.message}`);
  } else {
    throw e;
  }
}
```

### Common Error Codes

| Status | Class | When |
|---|---|---|
| 400 | `ValidationError` | Invalid request body, wrong quote status for transition |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without permission for this resource |
| 404 | `NotFoundError` | Quote, company, product, or contact not found |
| 429 | `RateLimitError` | Rate limit exceeded — back off and retry |

---

## Runnable Examples

Validated end-to-end examples live in the SDK repo:

- **[`turboquote-basic.ts`](https://github.com/TurboDocx/SDK/blob/main/packages/js-sdk/examples/turboquote-basic.ts)** — full quote lifecycle (create → add line items → send → download PDF → delete)
- **[`turboquote-products.ts`](https://github.com/TurboDocx/SDK/blob/main/packages/js-sdk/examples/turboquote-products.ts)** — product and bundle catalog management
- **[`turboquote-pricebooks.ts`](https://github.com/TurboDocx/SDK/blob/main/packages/js-sdk/examples/turboquote-pricebooks.ts)** — price book CRUD and `applyPriceBook`

Run any example with:

```bash
export TURBODOCX_API_KEY=your_key
export TURBODOCX_ORG_ID=your_org_id
npx tsx examples/turboquote-basic.ts
```

---

## See Also

- [TurboSign JavaScript SDK](/docs/SDKs/javascript) — send documents for e-signature
- [TurboWebhooks JavaScript SDK](/docs/SDKs/webhooks-javascript) — receive real-time signature events
- [Deliverable JavaScript SDK](/docs/SDKs/deliverable-javascript) — generate documents from templates
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [@turbodocx/sdk on npm](https://www.npmjs.com/package/@turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
