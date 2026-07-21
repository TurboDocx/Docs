---
title: TurboQuote Java SDK
sidebar_position: 21
sidebar_label: "TurboQuote: Java"
description: Official TurboDocx TurboQuote SDK for Java. Create and send quotes, manage line items, products, bundles, and price books programmatically with full CPQ lifecycle support.
keywords:
  - turboquote java
  - quote sdk java
  - cpq java
  - proposal java
  - quote api java
  - turbodocx quote java
  - maven turboquote
  - gradle turboquote
  - line items java
  - pricebook java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboQuote Java SDK

<QuickstartSkillNudge command="/turbodocx-sdk turboquote" product="TurboQuote" />

The official TurboDocx TurboQuote SDK for Java applications. Create and send sales quotes, manage line items, products, bundles, and price books — all from Java 11+. Distributed as `com.turbodocx:turbodocx-sdk` on Maven Central (same artifact as TurboSign and TurboWebhooks).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's CPQ (Configure, Price, Quote) module. Build a product catalog, assemble quotes with line items, apply price book discounts, and send branded proposals to contacts — with optional TurboSign e-signature delivery via `sendQuoteWithDeliverable`. The client config takes no `senderEmail`; the quote's **"Prepared by"** sender comes from your org quote template (see the note below `createQuote`).
:::

## Installation

<Tabs>
<TabItem value="maven" label="Maven">

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>turbodocx-sdk</artifactId>
    <version>0.4.0</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle">

```groovy
implementation 'com.turbodocx:turbodocx-sdk:0.4.0'
```

</TabItem>
<TabItem value="gradle-kts" label="Gradle (Kotlin DSL)">

```kotlin
implementation("com.turbodocx:turbodocx-sdk:0.4.0")
```

</TabItem>
</Tabs>

Then import:

```java
import com.turbodocx.TurboQuoteClient;
import com.turbodocx.TurboQuote;
import com.turbodocx.TurboDocxException;
import com.turbodocx.models.quote.*;
```

## Requirements

- Java 11 or higher
- OkHttp 4.x (included transitively)
- Gson 2.x (included transitively)
- A TurboDocx API key (`TDX-` prefix) — no administrator role required

## Configuration

```java
import com.turbodocx.TurboQuoteClient;
import com.turbodocx.TurboQuote;

TurboQuoteClient client = new TurboQuoteClient.Builder()
    .apiKey(System.getenv("TURBODOCX_API_KEY"))
    .orgId(System.getenv("TURBODOCX_ORG_ID"))
    .build();

TurboQuote tq = client.turboQuote();
```

`TurboQuoteClient.Builder` does **not** take `senderEmail` — a quote has no per-request sender field. Sender validation is **not** skipped, though: it moves to your org quote template (see below). `orgId` is required. Construct `TurboQuoteClient` once and reuse `tq`.

The quote's **"Prepared by"** sender comes from your **org quote template** instead. Because an API key has no mailbox of its own, every sender-resolving call — `createQuote`, `duplicateQuote`, `sendQuote` / `sendQuoteWithDeliverable`, and `handleExpiredQuote` — fails with a `ValidationException` (`400 SenderEmailRequired`) when the org's quote template has no sender email set. A companion `400 SenderNameRequired` is returned when no sender **name** resolves. Configure both **Sender Name** and **Sender Email** once (`updateTemplate`) and all of them resolve cleanly.

### Environment Variables

```bash
TURBODOCX_API_KEY=your_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

:::caution API Credentials Required
Both `apiKey` and `orgId` are required. To get your credentials, follow the [Get Your Credentials](/docs/SDKs#1-get-your-credentials) steps from the SDKs main page.
:::

## Quick Start

### 1. Create a company, quote, and add line items

```java
import com.turbodocx.TurboQuoteClient;
import com.turbodocx.TurboQuote;
import com.turbodocx.TurboDocxException;
import com.turbodocx.models.quote.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

public class QuoteLifecycle {
    public static void main(String[] args) throws Exception {
        TurboQuoteClient client = new TurboQuoteClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .build();

        TurboQuote tq = client.turboQuote();

        // Step 1: Create a company with an initial contact
        CreateCompanyContactInput contact = new CreateCompanyContactInput();
        contact.setName("Alice Buyer");
        contact.setEmail("alice@example.com");

        CreateCompanyRequest companyReq = new CreateCompanyRequest();
        companyReq.setName("Acme Corp");
        companyReq.setContacts(Arrays.asList(contact));

        Company company = tq.createCompany(companyReq);
        ContactListResponse contacts = tq.listCompanyContacts(company.getId());
        String contactId = contacts.getResults().get(0).getId();

        // Step 2: Create a quote
        CreateQuoteRequest quoteReq = new CreateQuoteRequest();
        quoteReq.setName("Q1 Software License");
        quoteReq.setCompanyId(company.getId());
        quoteReq.setContactId(contactId);
        quoteReq.setTermDays(30);
        quoteReq.setCurrency(Currency.USD);

        Quote quote = tq.createQuote(quoteReq);
        System.out.println("Quote: " + quote.getId() + " status=" + quote.getStatus());

        // Step 3: Add a line item.
        // productId, productName, unitPrice and billingFrequency are all required.
        // productId may be null (custom line item), but must always be set.
        AddLineItemRequest item = new AddLineItemRequest();
        item.setProductId("product-uuid");
        item.setProductName("Enterprise Software License");
        item.setUnitPrice(1200.00);
        item.setQuantity(3.0);
        item.setBillingFrequency("annual");
        item.setDiscountType(DiscountType.PERCENT);
        item.setDiscountPercent(10.0);

        List<LineItem> lineItems = tq.addLineItems(quote.getId(), item);
        System.out.println("Added " + lineItems.size() + " line item(s)");

        // Step 4: Send the quote
        SendQuoteResponse sent = tq.sendQuote(quote.getId());
        System.out.println("Sent. Status: " + sent.getQuote().getStatus());

        // Step 5: Download the PDF
        byte[] pdf = tq.downloadQuotePdf(quote.getId());
        Files.write(Paths.get("quote.pdf"), pdf);
        System.out.println("PDF saved (" + pdf.length + " bytes)");
    }
}
```

### 2. Create and send in one call

`createAndSend` is a convenience method that creates the quote, adds line items and bundle items, and sends it atomically.

```java
CreateAndSendRequest req = new CreateAndSendRequest();
req.setName("Partner Proposal");
req.setCompanyId(companyId);
req.setContactId(contactId);

AddLineItemRequest item = new AddLineItemRequest();
item.setProductId("product-uuid");     // required — null for a custom line item
item.setProductName("Starter Plan");
item.setUnitPrice(499.00);
item.setQuantity(1.0);
item.setBillingFrequency("monthly");   // required
req.setItems(Arrays.asList(item));

// req.setSend(...) to configure send options, or omit to use defaults

CreateAndSendResponse result = tq.createAndSend(req);
System.out.println("Quote created and sent: " + result.getQuote().getId());
```

### 3. Apply a price book, then send with a deliverable

```java
// Apply a price book to recalculate line item prices
ApplyPriceBookResponse applied = tq.applyPriceBook(quoteId, priceBookId);
System.out.println("Updated: " + applied.getUpdatedCount()
    + ", Skipped: " + applied.getSkippedCount());

// Send with a TurboDocx deliverable attached
SendQuoteWithDeliverableRequest sendReq = new SendQuoteWithDeliverableRequest();
sendReq.setDeliverableId("your-deliverable-id");
sendReq.setMergePosition("end");

SendQuoteWithDeliverableResponse sendResp = tq.sendQuoteWithDeliverable(quoteId, sendReq);
System.out.println("Document ID: " + sendResp.getDocumentId());
```

## Method Reference

All methods are instance methods on `com.turbodocx.TurboQuote`. Obtain the instance via `client.turboQuote()` from a constructed `TurboQuoteClient`. All methods throw `IOException` and `TurboDocxException` subclasses.

---

### Quotes — CRUD

#### `listQuotes`

```java
QuoteListResponse listQuotes()
QuoteListResponse listQuotes(ListQuotesOptions options)
```

List quotes with optional pagination and filters. Returns a paginated response including stats (totals, counts by status).

```java
ListQuotesOptions opts = new ListQuotesOptions();
opts.setLimit(20);
opts.setOffset(0);

QuoteListResponse list = tq.listQuotes(opts);
System.out.println("Total: " + list.getTotalRecords());
list.getResults().forEach(q ->
    System.out.println(q.getId() + " " + q.getStatus()));
```

#### `createQuote`

```java
Quote createQuote(CreateQuoteRequest request)
```

Create a new quote. Returns the created `Quote`.

```java
// Fixed-term quote — termDays is -1 or 0–3650; leave it unset to get the default of 60.
CreateQuoteRequest req = new CreateQuoteRequest();
req.setName("Enterprise Proposal");
req.setCompanyId(companyId);
req.setContactId(contactId);
req.setCurrency(Currency.USD);
req.setTermDays(30);        // fixed term — do NOT set renewalPeriod alongside this

Quote quote = tq.createQuote(req);

// Auto-renewal quote — termDays -1 REQUIRES renewalPeriod.
CreateQuoteRequest subReq = new CreateQuoteRequest();
subReq.setName("Annual Subscription");
subReq.setCompanyId(companyId);
subReq.setContactId(contactId);
subReq.setCurrency(Currency.USD);
subReq.setTermDays(-1);                            // -1 = auto-renewal
subReq.setRenewalPeriod(RenewalPeriod.ANNUALLY);   // WEEKLY | MONTHLY | QUARTERLY | ANNUALLY

Quote subscription = tq.createQuote(subReq);
```

:::caution `termDays` and `renewalPeriod` are coupled
`termDays` defaults to **60** when left unset. Valid values are `-1` (auto-renewal) or `0`–`3650` (`0` = one-time).

`renewalPeriod` is **required** when `termDays` is `-1`, and must be **null or unset** for every other `termDays` value — sending it alongside a fixed term returns a `400`. The same rule applies on `updateQuote`.
:::

#### `getQuote`

```java
Quote getQuote(String id)
```

Get a quote by ID. Returns the `Quote` with `statusInfo` (expiry dates, status transitions) and `preparedBy` (the resolved "Prepared by" identity shown on the quote PDF) merged in.

```java
Quote quote = tq.getQuote(quoteId);
System.out.println("Status: " + quote.getStatus());
// quote.getStatusInfo() — expiry/transition metadata
if (quote.getPreparedBy() != null) {
    System.out.println(quote.getPreparedBy().getName());  // e.g. "Acme Billing Integration"
    System.out.println(quote.getPreparedBy().getEmail()); // may be null — render a placeholder
}
```

`preparedBy` is resolved server-side (org template first, then the quote's creator). **Prefer it over `getCreator()`** for any customer-facing display — the creator may be the internal API service account. For an API-created quote the resolved name is the **API key's name** (never a generic "API Service User"), and the email comes from the org quote template. `preparedBy` is returned by the **single-quote fetch only** — it is not present on create, duplicate, or list responses.

#### `updateQuote`

```java
Quote updateQuote(String id, UpdateQuoteRequest request)
```

Update an existing quote. Only fields explicitly set on `UpdateQuoteRequest` are patched; unset fields are omitted from the request body. Fields explicitly set to `null` are cleared on the server (e.g., `setValidUntil(null)` clears the expiry date).

```java
UpdateQuoteRequest req = new UpdateQuoteRequest();
req.setName("Revised Proposal — Q2");
req.setTermDays(60);

Quote updated = tq.updateQuote(quoteId, req);
```

#### `deleteQuote`

```java
SuccessResponse deleteQuote(String id)
```

Delete a quote.

```java
SuccessResponse resp = tq.deleteQuote(quoteId);
System.out.println(resp.getMessage());
```

#### `duplicateQuote`

```java
Quote duplicateQuote(String id)
```

Duplicate a quote (creates a draft copy).

```java
Quote copy = tq.duplicateQuote(quoteId);
System.out.println("New quote: " + copy.getId());
```

The copy is attributed to **whoever ran the duplicate**, not to the original quote's creator — duplicating with an API key produces a quote whose "Prepared by" resolves through that API key and your org quote template.

#### `applyPriceBook`

```java
ApplyPriceBookResponse applyPriceBook(String quoteId, String priceBookId)
```

Apply a price book to a quote, recalculating line item prices. Returns `{quote, message, updatedCount, skippedCount}`.

```java
ApplyPriceBookResponse resp = tq.applyPriceBook(quoteId, priceBookId);
System.out.println("Updated " + resp.getUpdatedCount() + " items.");
```

#### `removePriceBook`

```java
Quote removePriceBook(String quoteId)
```

Remove the applied price book from a quote, restoring original line item pricing.

```java
Quote quote = tq.removePriceBook(quoteId);
```

#### `downloadQuotePdf`

```java
byte[] downloadQuotePdf(String id)
```

Download the quote as a PDF. Returns raw bytes.

```java
byte[] pdf = tq.downloadQuotePdf(quoteId);
Files.write(Paths.get("quote.pdf"), pdf);
```

---

### Quote Numbering Configuration

Customize the per-org quote number format: prefix, year/month tokens, separator, zero-padding, suffix, starting number, and reset cadence. Both methods are **admin only**; a non-admin API key receives a `403`.

#### `getQuoteNumberConfig`

```java
QuoteNumberConfig getQuoteNumberConfig()
```

Fetch the org's current quote numbering format and the current per-period issued floor.

```java
QuoteNumberConfig config = tq.getQuoteNumberConfig();
System.out.println(config.getFormat().getPrefix());  // e.g. "Q-"
System.out.println(config.getCurrentFloor());        // the current per-period issued floor
```

#### `updateQuoteNumberConfig`

```java
QuoteNumberConfig updateQuoteNumberConfig(QuoteNumberFormat format)
```

Update the numbering format. All eight fields are sent.

```java
QuoteNumberFormat format = new QuoteNumberFormat();
format.setPrefix("INV");
format.setYearToken(QuoteNumberYearToken.NONE);        // NONE | TWO | FOUR
format.setMonthToken(QuoteNumberMonthToken.OFF);       // OFF | TWO
format.setSeparator("-");
format.setPadWidth(4);                                 // 0–12
format.setSuffix("");
format.setStartNumber(1000);                           // >= 0
format.setResetCadence(QuoteNumberResetCadence.NEVER); // NEVER | YEARLY | MONTHLY

QuoteNumberConfig config = tq.updateQuoteNumberConfig(format);
System.out.println(config.getFormat().getStartNumber());  // 1000
```

#### Field reference, defaults & validation

All eight `QuoteNumberFormat` fields are sent on every update. The API enforces these caps and allowed values — a violation returns `400`:

| Field | Type | Allowed / range | Default |
|-------|------|-----------------|---------|
| `prefix` | String | ≤ 12 characters | `"Q"` |
| `yearToken` | enum | `NONE` \| `TWO` \| `FOUR` | `FOUR` |
| `monthToken` | enum | `OFF` \| `TWO` | `OFF` |
| `separator` | String | ≤ 4 characters | `"-"` |
| `padWidth` | int | `0`–`12` (`0` = no padding) | `5` |
| `suffix` | String | ≤ 12 characters | `""` |
| `startNumber` | int | `0`–`1000000000` | `1` |
| `resetCadence` | enum | `NEVER` \| `YEARLY` \| `MONTHLY` | `YEARLY` |

Tokens are the `QuoteNumberYearToken` / `QuoteNumberMonthToken` / `QuoteNumberResetCadence` enums (their wire values are the lowercase strings `none`/`two`/`four`, `off`/`two`, `never`/`yearly`/`monthly`). An org that has never configured numbering uses the **default format** above, which renders like `Q-2026-00001`.

Beyond the per-field caps, the API rejects self-inconsistent formats with a `400`:

- `ResetCadence.YEARLY` requires a year token (`yearToken` other than `NONE`) — otherwise numbers repeat across years.
- `ResetCadence.MONTHLY` requires **both** a year token and a month token (`MonthToken.TWO`).
- The rendered quote number must be ≤ 256 characters.

`currentFloor` (returned by both methods) is read-only — the sequence the next quote will use for the current period — and is never sent on update.

---

### Quotes — Status Transitions

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

#### `sendQuote`

```java
SendQuoteResponse sendQuote(String id)
SendQuoteResponse sendQuote(String id, SendQuoteRequest request)
```

Send a quote to the contact. Returns `{quote, message}`. Pass `SendQuoteRequest` to configure send options, or omit for defaults.

```java
SendQuoteResponse resp = tq.sendQuote(quoteId);
System.out.println("Status: " + resp.getQuote().getStatus());
```

#### `sendQuoteWithDeliverable`

```java
SendQuoteWithDeliverableResponse sendQuoteWithDeliverable(String id, SendQuoteWithDeliverableRequest request)
```

Send a quote with a TurboDocx deliverable attached. Returns `{quote, message, documentId}`.

```java
SendQuoteWithDeliverableRequest req = new SendQuoteWithDeliverableRequest();
req.setDeliverableId("your-deliverable-id");
req.setMergePosition("end"); // "start" | "end"

SendQuoteWithDeliverableResponse resp = tq.sendQuoteWithDeliverable(quoteId, req);
System.out.println("Document ID: " + resp.getDocumentId());
```

#### `declineQuote`

```java
Quote declineQuote(String id, DeclineQuoteRequest request)
```

Mark a sent quote as declined.

```java
DeclineQuoteRequest req = new DeclineQuoteRequest();
req.setReason("Budget constraints");

Quote declined = tq.declineQuote(quoteId, req);
```

#### `voidQuote`

```java
Quote voidQuote(String id, VoidQuoteRequest request)
```

Void a quote (cannot be undone).

```java
VoidQuoteRequest req = new VoidQuoteRequest();
req.setReason("Replaced by new proposal");

Quote voided = tq.voidQuote(quoteId, req);
```

#### `handleExpiredQuote`

```java
Quote handleExpiredQuote(String id, HandleExpiredQuoteRequest request)
```

Handle a quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on the action — and then **creates a duplicate carrying `newValidUntil`** as its new validity date. The returned `Quote` is the new duplicate; the original stays terminal.

All three fields are **required**: `action` (`"void"` or `"decline"`), `reason` (max 190 characters), and `newValidUntil` (ISO date).

```java
HandleExpiredQuoteRequest req = new HandleExpiredQuoteRequest();
req.setAction("void");                    // required — "void" or "decline" only
req.setReason("Expired — re-quoting");    // required — max 190 characters
req.setNewValidUntil("2026-12-31");       // required — ISO date, carried onto the duplicate

Quote quote = tq.handleExpiredQuote(quoteId, req);
```

:::warning There is no `extend` or `resend` action
`action` accepts **only** `"void"` and `"decline"`. `"extend"` and `"resend"` do not exist in the API and return a `400`. Extending is what the endpoint already does — set `newValidUntil` and it lands on the duplicate it creates.
:::

:::note Terminal statuses
`accepted`, `declined`, and `voided` are **terminal** — a quote in one of these states cannot be transitioned out of it, and any further status call returns a `400`. Check `quote.getStatusInfo()` before attempting a transition, and use `duplicateQuote` when you need to revive a closed-out quote.
:::

---

### Line Items

#### `listLineItems`

```java
LineItemListResponse listLineItems(String quoteId)
LineItemListResponse listLineItems(String quoteId, ListLineItemsOptions options)
```

List line items for a quote.

```java
LineItemListResponse items = tq.listLineItems(quoteId);
items.getResults().forEach(i ->
    System.out.println(i.getProductName() + " x" + i.getQuantity()));
```

#### `addLineItems`

```java
List<LineItem> addLineItems(String quoteId, AddLineItemRequest item)
List<LineItem> addLineItems(String quoteId, List<AddLineItemRequest> items)
```

Add one or more product line items to a quote. A single `AddLineItemRequest` is automatically wrapped; a list is capped at **50** items.

`productId`, `productName`, `unitPrice`, and `billingFrequency` are all **required** on every item. `productId` is special: the key must be **present** on the wire, but its value may be `null` — call `setProductId(null)` for a custom (freeform) line item. `quantity` is optional and defaults to `1`.

```java
AddLineItemRequest item = new AddLineItemRequest();
item.setProductId(productId);              // required — null for a custom line item
item.setProductName("Enterprise License");
item.setUnitPrice(1200.00);
item.setQuantity(5.0);
item.setBillingFrequency("annual");

// Custom (freeform) line item — productId is still set, explicitly to null
AddLineItemRequest custom = new AddLineItemRequest();
custom.setProductId(null);
custom.setProductName("Implementation Credit");
custom.setUnitPrice(-250.00);
custom.setBillingFrequency("one-time");

List<LineItem> added = tq.addLineItems(quoteId, Arrays.asList(item, custom));
```

:::note List caps
`addLineItems` accepts a single request **or** a list of 1–**50** items. A reorder request accepts up to **200** items. Exceeding either cap returns a `400`.
:::

#### `addBundleLineItems`

```java
List<LineItem> addBundleLineItems(String quoteId, AddBundleLineItemRequest item)
List<LineItem> addBundleLineItems(String quoteId, List<AddBundleLineItemRequest> items)
```

Add one or more bundle line items to a quote. `bundleId` and `bundleName` are both **required**; the server expands the bundle's child products for you. A list is capped at **50** items.

```java
AddBundleLineItemRequest bundleItem = new AddBundleLineItemRequest();
bundleItem.setBundleId(bundleId);
bundleItem.setBundleName("Starter Bundle");   // required
bundleItem.setQuantity(2.0);

List<LineItem> added = tq.addBundleLineItems(quoteId, bundleItem);
```

#### `updateLineItem`

```java
LineItem updateLineItem(String quoteId, String itemId, UpdateLineItemRequest request)
```

Update a line item on a quote. Only explicitly set fields are patched.

```java
UpdateLineItemRequest req = new UpdateLineItemRequest();
req.setQuantity(10.0);
req.setDiscountPercent(15.0);

LineItem updated = tq.updateLineItem(quoteId, itemId, req);
```

#### `removeLineItem`

```java
SuccessResponse removeLineItem(String quoteId, String itemId)
```

Remove a line item from a quote.

```java
tq.removeLineItem(quoteId, itemId);
```

---

### Products

| Method | Signature | Returns |
|---|---|---|
| `listProducts` | `listProducts()` / `listProducts(ListProductsOptions)` | `ProductListResponse` |
| `createProduct` | `createProduct(CreateProductRequest)` | `Product` |
| `getProduct` | `getProduct(String id)` | `Product` |
| `updateProduct` | `updateProduct(String id, UpdateProductRequest)` | `Product` |
| `deleteProduct` | `deleteProduct(String id)` | `SuccessResponse` |
| `duplicateProduct` | `duplicateProduct(String id)` | `Product` |
| `getProductPrimaryImages` | `getProductPrimaryImages(List<String> productIds)` | `Map<String, ProductImage>` |

:::caution `categoryId` is required on create
`createProduct` **requires** `name`, `categoryId`, `listPrice`, and `billingFrequency`. `categoryId` must be the **UUID** of an existing type (`CategoryType.PRODUCT_CATEGORY`) — resolve or create it first with `listTypes` / `createType`. It is optional on `updateProduct`, so you only need to pass it when creating.
:::

```java
// Resolve the product category first — createProduct needs its UUID.
ListTypesOptions typeOpts = new ListTypesOptions();
typeOpts.setCategoryType(CategoryType.PRODUCT_CATEGORY);

QuoteType category = tq.listTypes(typeOpts).getResults().stream()
    .filter(t -> "Software".equals(t.getName()))
    .findFirst()
    .orElse(null);

if (category == null) {
    CreateQuoteTypeRequest typeReq = new CreateQuoteTypeRequest();
    typeReq.setName("Software");
    typeReq.setCategoryType(CategoryType.PRODUCT_CATEGORY);
    category = tq.createType(typeReq);
}

// Create a product
CreateProductRequest req = new CreateProductRequest();
req.setName("Pro Platform");
req.setCategoryId(category.getId());   // required
req.setSku("PRO-001");
req.setListPrice(500.00);
req.setBillingFrequency("monthly");

Product product = tq.createProduct(req);

// Upload with images — pass byte[][] via setImages()
req.setImages(new byte[][] { imageBytes });
Product productWithImages = tq.createProduct(req);

// Get primary images for a set of products
Map<String, ProductImage> images = tq.getProductPrimaryImages(
    Arrays.asList(product.getId(), anotherProductId));
// images.get(productId) — ProductImage or null
```

:::note Multipart Upload
When `CreateProductRequest.getImages()` is non-empty, the SDK automatically switches to multipart form upload with magic-byte MIME type detection (PNG, JPEG, GIF, WebP supported).
:::

---

### Price Books

| Method | Signature | Returns |
|---|---|---|
| `listPriceBooks` | `listPriceBooks()` / `listPriceBooks(ListPriceBooksOptions)` | `PriceBookListResponse` |
| `createPriceBook` | `createPriceBook(CreatePriceBookRequest)` | `PriceBook` |
| `getPriceBook` | `getPriceBook(String id)` | `PriceBook` |
| `updatePriceBook` | `updatePriceBook(String id, UpdatePriceBookRequest)` | `PriceBook` |
| `deletePriceBook` | `deletePriceBook(String id)` | `SuccessResponse` |
| `duplicatePriceBook` | `duplicatePriceBook(String id)` | `PriceBook` |
| `listPriceBookProducts` | `listPriceBookProducts(String id)` / `listPriceBookProducts(String id, ListPriceBookProductsOptions)` | `PriceBookProductListResponse` |

```java
// Create a price book with per-product pricing overrides
PriceBookProductPricingInput pricing = new PriceBookProductPricingInput();
pricing.setProductId(productId);
pricing.setDiscountType(DiscountType.PERCENT);
pricing.setDiscountPercent(20.0);

CreatePriceBookRequest req = new CreatePriceBookRequest();
req.setName("Partner Discount");          // required
req.setPriceBookTypeId(typeId);            // required — from a createType(categoryType=PRICEBOOK_TYPE)
req.setValidFrom("2025-01-01");            // required
req.setDiscountPercent(15.0);              // required
req.setProductPricing(Arrays.asList(pricing));
req.setShowInQuoteBuilder(true);

PriceBook pb = tq.createPriceBook(req);

// List products in a price book
PriceBookProductListResponse pbProducts = tq.listPriceBookProducts(pb.getId());
System.out.println("Products: " + pbProducts.getTotalRecords());
```

---

### Bundles

| Method | Signature | Returns |
|---|---|---|
| `listBundles` | `listBundles()` / `listBundles(ListBundlesOptions)` | `BundleListResponse` |
| `createBundle` | `createBundle(CreateBundleRequest)` | `Bundle` |
| `getBundle` | `getBundle(String id)` | `Bundle` |
| `updateBundle` | `updateBundle(String id, UpdateBundleRequest)` | `Bundle` |
| `deleteBundle` | `deleteBundle(String id)` | `SuccessResponse` |
| `duplicateBundle` | `duplicateBundle(String id)` | `Bundle` |

`name` and `categoryId` are **required** on the bundle itself. Each `BundleItemInput` **requires** `productId`, `unitPrice`, and `billingFrequency`; `quantity` is optional and defaults to `1`.

:::caution `categoryId` is required
`createBundle` needs the **UUID** of an existing type with `CategoryType.BUNDLE_CATEGORY` — resolve or create it first with `listTypes` / `createType`, exactly as you would for a product category.
:::

```java
// 1. Resolve the bundle category — createBundle needs its UUID.
ListTypesOptions typeOpts = new ListTypesOptions();
typeOpts.setCategoryType(CategoryType.BUNDLE_CATEGORY);

QuoteType category = tq.listTypes(typeOpts).getResults().stream()
    .filter(t -> "Starter Kits".equals(t.getName()))
    .findFirst()
    .orElse(null);

if (category == null) {
    CreateQuoteTypeRequest typeReq = new CreateQuoteTypeRequest();
    typeReq.setName("Starter Kits");
    typeReq.setCategoryType(CategoryType.BUNDLE_CATEGORY);
    category = tq.createType(typeReq);
}

// 2. Build the bundle items — productId, unitPrice and billingFrequency are all required.
BundleItemInput platform = new BundleItemInput();
platform.setProductId("product-uuid-1");
platform.setUnitPrice(199.00);
platform.setBillingFrequency("monthly");
platform.setQuantity(1.0);

BundleItemInput support = new BundleItemInput();
support.setProductId("product-uuid-2");
support.setUnitPrice(49.00);
support.setBillingFrequency("monthly");
support.setQuantity(2.0);

// 3. Create the bundle.
CreateBundleRequest req = new CreateBundleRequest();
req.setName("Starter Bundle");                       // required
req.setCategoryId(category.getId());                 // required
req.setItems(Arrays.asList(platform, support));
req.setBundleDiscountType(DiscountType.PERCENT);
req.setBundleDiscountPercent(5.0);
req.setShowInCatalog(true);

Bundle bundle = tq.createBundle(req);
```

---

### Companies

| Method | Signature | Returns |
|---|---|---|
| `listCompanies` | `listCompanies()` / `listCompanies(ListCompaniesOptions)` | `CompanyListResponse` |
| `createCompany` | `createCompany(CreateCompanyRequest)` | `Company` |
| `getCompany` | `getCompany(String id)` | `Company` |
| `updateCompany` | `updateCompany(String id, UpdateCompanyRequest)` | `Company` |
| `deleteCompany` | `deleteCompany(String id)` | `SuccessResponse` |
| `listCompanyContacts` | `listCompanyContacts(String companyId)` / `listCompanyContacts(String companyId, PaginationParams)` | `ContactListResponse` |

```java
// Create a company — contacts list is required (minimum one contact)
CreateCompanyContactInput contact = new CreateCompanyContactInput();
contact.setName("Alice Buyer");
contact.setEmail("alice@example.com");

CreateCompanyRequest req = new CreateCompanyRequest();
req.setName("Acme Corp");
req.setCity("New York");
req.setContacts(Arrays.asList(contact));

Company company = tq.createCompany(req);

// List contacts for that company
ContactListResponse contacts = tq.listCompanyContacts(company.getId());
String contactId = contacts.getResults().get(0).getId();
```

---

### Contacts

| Method | Signature | Returns |
|---|---|---|
| `listContacts` | `listContacts()` / `listContacts(ListContactsOptions)` | `ContactListResponse` |
| `createContact` | `createContact(CreateContactRequest)` | `Contact` |
| `updateContact` | `updateContact(String id, UpdateContactRequest)` | `Contact` |
| `deleteContact` | `deleteContact(String id)` | `SuccessResponse` |

:::note No `getContact`
There is no `getContact(id)` method — the backend has no `GET /v1/contacts/:id` endpoint. Use `listContacts` with a query filter, or `listCompanyContacts` to retrieve contacts for a known company.
:::

```java
CreateContactRequest req = new CreateContactRequest();
req.setName("Bob Partner");
req.setEmail("bob@partner.example.com");

Contact contact = tq.createContact(req);
```

---

### Quote Templates

| Method | Signature | Returns |
|---|---|---|
| `listTemplates` | `listTemplates()` / `listTemplates(PaginationParams)` | `QuoteTemplateListResponse` |
| `getTemplate` | `getTemplate()` | `QuoteTemplate` — auto-created if none exists |
| `getTemplateById` | `getTemplateById(String id)` | `QuoteTemplate` |
| `createTemplate` | `createTemplate(CreateQuoteTemplateRequest)` | `QuoteTemplate` — `400` if one already exists |
| `updateTemplate` | `updateTemplate(String id, UpdateQuoteTemplateRequest)` | `QuoteTemplate` |
| `deleteTemplate` | `deleteTemplate(String id)` | `SuccessResponse` — resets to org branding defaults |

:::warning Templates are auto-provisioned — use `getTemplate()` → `updateTemplate()`
`getTemplate()` **self-heals**: if the org has no template, the API creates one from your org branding and returns it. Every established org therefore already has a template, which means:

- `createTemplate()` returns **400 `TEMPLATE_ALREADY_EXISTS`** and is effectively unreachable. Do not build a get-then-create flow.
- `deleteTemplate()` is really "reset to org branding defaults" — it soft-deletes, and the next `getTemplate()` regenerates a fresh one.

The correct flow is **`getTemplate()` → `updateTemplate()`**.
:::

```java
// 1. Get the org's template (created from org branding on first read)
QuoteTemplate defaultTemplate = tq.getTemplate();

// 2. Brand it by updating the template you just fetched
UpdateQuoteTemplateRequest brandReq = new UpdateQuoteTemplateRequest();
brandReq.setLogoUrl("https://cdn.example.com/logo.png");
brandReq.setPrimaryColor("#0057b8");
brandReq.setSenderName("TurboDocx Sales");

QuoteTemplate branded = tq.updateTemplate(defaultTemplate.getId(), brandReq);

// Get a specific template by ID
QuoteTemplate template = tq.getTemplateById(templateId);

// List all templates
QuoteTemplateListResponse templates = tq.listTemplates();
```

:::note `getTemplate()` vs `getTemplateById(id)`
`getTemplate()` hits `GET /v1/quote-template` (singular) and returns the organization's default template. `getTemplateById(id)` hits `GET /v1/quote-templates/:id` (plural) and returns a specific template by ID.
:::

---

### Types / Categories

| Method | Signature | Returns |
|---|---|---|
| `listTypes` | `listTypes()` / `listTypes(ListTypesOptions)` | `QuoteTypeListResponse` |
| `createType` | `createType(CreateQuoteTypeRequest)` | `QuoteType` |
| `updateType` | `updateType(String id, UpdateQuoteTypeRequest)` | `QuoteType` |
| `deleteType` | `deleteType(String id)` | `SuccessResponse` |

Types are used for categorization. `CategoryType` has four values — `PRODUCT_CATEGORY`, `PRICEBOOK_TYPE`, `COMPANY_INDUSTRY`, and `BUNDLE_CATEGORY` — and a type's `id` is the UUID you pass as `categoryId` when creating a product (`PRODUCT_CATEGORY`) or a bundle (`BUNDLE_CATEGORY`), or as `priceBookTypeId` when creating a price book (`PRICEBOOK_TYPE`).

```java
CreateQuoteTypeRequest req = new CreateQuoteTypeRequest();
req.setName("Partner Pricing");
req.setCategoryType(CategoryType.PRICEBOOK_TYPE);

QuoteType type = tq.createType(req);
```

:::note No `getType`
There is no `getType(id)` method — the backend has no `GET /v1/types/:id` endpoint by design. Use `listTypes` to retrieve all types.
:::

---

### Bulk Imports

Every create-family entity has a matching `bulkCreate*` method for seeding a catalog or migrating CRM data in one call. Each method sends `POST {resource}/bulk` with a list of the **same request objects as that entity's single-create method** (e.g. `bulkCreateProducts` takes `List<CreateProductRequest>`). Company rows require a `contacts` list with at least one contact; contact rows require a `companyId`.

Rows process sequentially with **partial success** — a failed row does not throw and does not roll back earlier rows. Every bulk method returns a `BulkImportResult`:

- `getImported()` — count of rows created
- `getFailed()` — list of `BulkImportRowIssue` (`getRow()` + `getReason()`) for rows that did not import; the row number is the **1-indexed** position in your request list
- `getAdjusted()` — list of `BulkImportRowIssue` for rows that imported *with* a server-side adjustment (e.g. a bundle item whose product wasn't found was dropped)

Requests are capped at **500 rows** — anything above the cap returns a `400`. Available to admin and contributor API keys.

#### `bulkCreateProducts`

```java
BulkImportResult bulkCreateProducts(List<CreateProductRequest> rows)
```

:::caution Product rows require a real `categoryId`
Every `bulkCreateProducts` row **requires** `name`, `categoryId`, `listPrice`, and `billingFrequency`. `categoryId` must be the **UUID** of an existing type (`CategoryType.PRODUCT_CATEGORY`) — there is no `categoryName` field on the bulk row schema, and the API rejects unknown keys, so sending one returns a `400`. Resolve or create the category first with `listTypes` / `createType`, then pass its ID.
:::

```java
// 1. Resolve the product category first — bulk rows need its UUID, not its name.
ListTypesOptions typeOpts = new ListTypesOptions();
typeOpts.setCategoryType(CategoryType.PRODUCT_CATEGORY);

String categoryId = tq.listTypes(typeOpts).getResults().stream()
    .filter(t -> "Software".equals(t.getName()))
    .map(QuoteType::getId)
    .findFirst()
    .orElseGet(() -> {
        CreateQuoteTypeRequest typeReq = new CreateQuoteTypeRequest();
        typeReq.setName("Software");
        typeReq.setCategoryType(CategoryType.PRODUCT_CATEGORY);
        try {
            return tq.createType(typeReq).getId();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    });

// 2. Import, passing the resolved UUID on every row.
CreateProductRequest row1 = new CreateProductRequest();
row1.setName("Enterprise License");
row1.setCategoryId(categoryId);
row1.setListPrice(1200.00);
row1.setBillingFrequency("annual");

CreateProductRequest row2 = new CreateProductRequest();
row2.setName("Onboarding Package");
row2.setCategoryId(categoryId);
row2.setListPrice(499.00);
row2.setBillingFrequency("one-time");

BulkImportResult result = tq.bulkCreateProducts(Arrays.asList(row1, row2));

System.out.println("Imported " + result.getImported() + " of 2 rows");
for (BulkImportRowIssue failure : result.getFailed()) {
    System.err.println("Row " + failure.getRow() + " failed: " + failure.getReason());
}
for (BulkImportRowIssue adjustment : result.getAdjusted()) {
    System.out.println("Row " + adjustment.getRow()
        + " imported with adjustment: " + adjustment.getReason());
}
```

The other five bulk methods follow the exact same pattern:

| Method | Rows | Returns |
|---|---|---|
| `bulkCreatePriceBooks` | `List<CreatePriceBookRequest>` | `BulkImportResult` |
| `bulkCreateBundles` | `List<CreateBundleRequest>` | `BulkImportResult` |
| `bulkCreateCompanies` | `List<CreateCompanyRequest>` — each row needs `contacts` (min. 1) | `BulkImportResult` |
| `bulkCreateContacts` | `List<CreateContactRequest>` — each row needs `companyId` | `BulkImportResult` |
| `bulkCreateTypes` | `List<CreateQuoteTypeRequest>` | `BulkImportResult` |

---

### Convenience

#### `createAndSend`

```java
CreateAndSendResponse createAndSend(CreateAndSendRequest request)
```

Create a quote, add line items and bundle items, and send it — all in one method call. Useful for programmatic quote generation pipelines.

```java
AddLineItemRequest item = new AddLineItemRequest();
item.setProductId("product-uuid");     // required — null for a custom line item
item.setProductName("Starter License");
item.setUnitPrice(999.00);
item.setQuantity(1.0);
item.setBillingFrequency("annual");    // required

CreateAndSendRequest req = new CreateAndSendRequest();
req.setName("Quick Proposal");
req.setCompanyId(companyId);
req.setContactId(contactId);
req.setItems(Arrays.asList(item));
// req.setSend(sendOptions) — optional

CreateAndSendResponse result = tq.createAndSend(req);
System.out.println("Quote: " + result.getQuote().getId());
```

---

## Error Handling

```java
import com.turbodocx.TurboDocxException;

try {
    Quote quote = tq.createQuote(req);
} catch (TurboDocxException.ValidationException e) {
    // 400 — invalid request body (missing required field, bad enum value, etc.)
    System.err.println("Validation: " + e.getMessage());
} catch (TurboDocxException.AuthenticationException e) {
    // 401 — bad or revoked API key
    System.err.println("Auth: " + e.getMessage());
} catch (TurboDocxException.AuthorizationException e) {
    // 403 — key lacks required role
    System.err.println("Forbidden: " + e.getMessage());
} catch (TurboDocxException.NotFoundException e) {
    // 404 — quote, product, company, etc. not found
    System.err.println("Not found: " + e.getMessage());
} catch (TurboDocxException.RateLimitException e) {
    // 429 — back off and retry
    System.err.println("Rate limited: " + e.getMessage());
} catch (TurboDocxException.NetworkException e) {
    // request never reached the server (DNS, refused, timeout)
    System.err.println("Network error: " + e.getMessage());
} catch (TurboDocxException e) {
    // catch-all for any other typed SDK error
    System.err.println("Error " + e.getStatusCode() + ": " + e.getMessage());
}
```

### Common Error Codes

| Status | Type | When |
|---|---|---|
| 400 | `TurboDocxException.ValidationException` | Invalid request body, missing required field |
| 401 | `TurboDocxException.AuthenticationException` | Missing or invalid API key |
| 403 | `TurboDocxException.AuthorizationException` | Valid key without required role |
| 404 | `TurboDocxException.NotFoundException` | Quote, product, company, contact, etc. not found |
| 429 | `TurboDocxException.RateLimitException` | Rate limit exceeded — back off and retry |

## Runnable End-to-End Examples

Three fully runnable examples live in the SDK repo:

- **[`TurboQuoteBasic.java`](https://github.com/TurboDocx/SDK/blob/main/packages/java-sdk/examples/TurboQuoteBasic.java)** — full quote lifecycle: create company, create quote, add line items, send, download PDF, clean up.
- **[`TurboQuoteProducts.java`](https://github.com/TurboDocx/SDK/blob/main/packages/java-sdk/examples/TurboQuoteProducts.java)** — product and bundle catalog management.
- **[`TurboQuotePricebooks.java`](https://github.com/TurboDocx/SDK/blob/main/packages/java-sdk/examples/TurboQuotePricebooks.java)** — price book CRUD, `applyPriceBook`, and optional `sendQuoteWithDeliverable` (set `TURBODOCX_DELIVERABLE_ID` env var).

Run any example after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`.

## See Also

- [TurboQuote JavaScript / TypeScript SDK](/docs/SDKs/quote-javascript) — same API, JS idioms
- [TurboQuote Python SDK](/docs/SDKs/quote-python) — same API, Python idioms
- [TurboQuote PHP SDK](/docs/SDKs/quote-php) — same API, PHP idioms
- [TurboSign Java SDK](/docs/SDKs/java) — sending documents for e-signature
- [TurboWebhooks Java SDK](/docs/SDKs/webhooks-java) — receiving signature events
- [SDKs Overview](/docs/SDKs) — all SDKs across all languages
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
