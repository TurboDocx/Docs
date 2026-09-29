---
title: TurboQuote SDK
sidebar_position: 16
sidebar_label: TurboQuote
description: 'TurboQuote SDK for JavaScript, TypeScript, Python, PHP, Go and Java: create quotes, add line items, apply price books, send and download PDFs.'
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
- turboquote python
- quote sdk python
- proposal sdk python
- cpq python
- turbodocx quote python
- asyncio turboquote
- pip turbodocx
- quote line items python
- price book python
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
- turboquote go
- turboquote sdk golang
- quote go
- cpq go
- proposal go
- quote api go
- turbodocx quote go
- cpq sdk golang
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

# TurboQuote SDK

<QuickstartSkillNudge command="/turbodocx-sdk turboquote" product="TurboQuote" />

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

The official TurboDocx TurboQuote SDK for Node.js and browser applications. Build quoting and CPQ (configure-price-quote) workflows: create and send quotes, manage line items, maintain a product and bundle catalog, apply price books, and handle the full quote lifecycle — all with zero runtime dependencies and complete TypeScript types. Available on npm as `@turbodocx/sdk` (same package as TurboSign and TurboWebhooks).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's quoting and CPQ module. Quotes progress through a lifecycle: `draft` → `pending_approval` → `sent` → `accepted` / `declined` / `voided`. A `draft` can also be marked `declined` directly, for a deal that dies before the quote is ever sent. Each quote belongs to a company and contact, carries line items (individual products or bundles), and can optionally have a price book applied. Accepted quotes can be merged with a TurboDocx Deliverable (e.g. a contract generated from a template) and sent for e-signature through TurboSign via `sendQuoteWithDeliverable`.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

The official TurboDocx TurboQuote SDK for Python applications. Build full CPQ (configure, price, quote) workflows: create quotes, add product and bundle line items, apply price books, send proposals to contacts, and download PDF exports — all from async Python 3.9+. Distributed on PyPI as `turbodocx-sdk` (same package as TurboSign, TurboWebhooks, and Deliverable).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's quoting and proposal engine. It covers the full quote lifecycle — draft, send, accept/decline/void — with a product catalog, bundle groupings, price books, company/contact CRM, and customizable quote templates. A draft can also be marked declined directly, for a deal that dies before the quote is ever sent. Quotes can be sent with an attached Deliverable document for a branded proposal experience.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

The official TurboDocx TurboQuote SDK for PHP applications. Build full CPQ (configure, price, quote) workflows: create quotes, add product and bundle line items, apply price books, send proposals to contacts, and download PDF exports — all from PHP 8.1+. Available on Packagist as `turbodocx/sdk` (same package as TurboSign, TurboWebhooks, and Deliverable).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's quoting and proposal engine. It covers the full quote lifecycle — draft, send, accept/decline/void — with a product catalog, bundle groupings, price books, company/contact CRM, and customizable quote templates. A draft can also be marked declined directly, for a deal that dies before the quote is ever sent. Quotes can be sent with an attached Deliverable document for a branded proposal experience.
:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

The official TurboDocx TurboQuote SDK for Go applications. Create quotes, attach line items and bundles, send proposals to customers, download PDFs, and manage your full product catalog — products, bundles, price books, companies, contacts, and quote templates — all with idiomatic Go patterns, context support, and typed errors. Available as `github.com/TurboDocx/SDK/packages/go-sdk`.

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's CPQ (Configure, Price, Quote) module. It lets your application generate professional, branded quote documents and send them to customers for acceptance or rejection, with full lifecycle management (draft, sent, accepted, declined, voided). A draft can also be marked declined directly, for a deal that dies before the quote is ever sent.

For the dashboard UI, quote template configuration, and sending behavior, see the TurboQuote product documentation.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

The official TurboDocx TurboQuote SDK for Java applications. Create and send sales quotes, manage line items, products, bundles, and price books — all from Java 11+. Distributed as `com.turbodocx:turbodocx-sdk` on Maven Central (same artifact as TurboSign and TurboWebhooks).

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's CPQ (Configure, Price, Quote) module. Build a product catalog, assemble quotes with line items, apply price book discounts, and send branded proposals to contacts — with optional TurboSign e-signature delivery via `sendQuoteWithDeliverable`. A `draft` can also be marked `declined` directly, for a deal that dies before the quote is ever sent. The client config takes no `senderEmail`; the quote's **"Prepared by"** sender comes from your org quote template (see the note below `createQuote`).
:::

</TabItem>
</Tabs>

## Installation {#installation}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```bash
composer require turbodocx/sdk
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

Then import:

```go
import turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

<Tabs>
<TabItem value="maven" label="Maven">

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>turbodocx-sdk</artifactId>
    <version>0.7.0</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle">

```groovy
implementation 'com.turbodocx:turbodocx-sdk:0.7.0'
```

</TabItem>
<TabItem value="gradle-kts" label="Gradle (Kotlin DSL)">

```kotlin
implementation("com.turbodocx:turbodocx-sdk:0.7.0")
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

</TabItem>
</Tabs>

## Requirements {#requirements}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

- Node.js 18 or higher (native `fetch`)
- TypeScript 4.7+ (optional, for type checking — declaration files are included)
- Zero runtime dependencies — the SDK uses only Node built-ins

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

- Python 3.9 or higher
- `httpx` (installed automatically as a dependency)
- A TurboDocx API key (`TDX-` prefix) — generate one in **Settings → API Keys**
- All SDK methods are `async` — call them from an `async def` (or wrap with `asyncio.run(...)` in synchronous contexts)

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

- PHP 8.1 or higher
- Composer 2.x
- ext-json
- A TurboDocx API key (`TDX-` prefix) — generate one in **Settings → API Keys**

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

- Go 1.21 or higher
- A TurboDocx API key (`TDX-` prefix)
- All methods accept a `context.Context` — pass `context.Background()` for one-offs or your request context inside handlers

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

- Java 11 or higher
- OkHttp 4.x (included transitively)
- Gson 2.x (included transitively)
- A TurboDocx API key (`TDX-` prefix) — no administrator role required

</TabItem>
</Tabs>

## Configuration {#configuration}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="typescript" label="TypeScript" default>

```typescript
import { TurboQuote } from '@turbodocx/sdk';

TurboQuote.configure({
  apiKey: process.env.TURBODOCX_API_KEY!,
  orgId: process.env.TURBODOCX_ORG_ID,   // optional — falls back to env var
  // accessToken: process.env.TURBODOCX_ACCESS_TOKEN,  // optional — OAuth token instead of apiKey
});
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
const { TurboQuote } = require('@turbodocx/sdk');

TurboQuote.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
  // accessToken: process.env.TURBODOCX_ACCESS_TOKEN,  // optional — OAuth token instead of apiKey
});
```

</TabItem>
</Tabs>

:::tip No senderEmail on the client — but set one on your quote template
Unlike TurboSign, `TurboQuote.configure()` does **not** require `senderEmail` or `senderName` — quotes are not sent as signature emails. Only a credential is required — either `apiKey` or an OAuth `accessToken` (`accessToken` wins when both are set); `orgId` is recommended but falls back to `TURBODOCX_ORG_ID`. If you skip `configure()` entirely, the SDK auto-initialises from environment variables on the first method call.

The quote's **"Prepared by"** sender comes from your **org quote template** instead. Because an API key has no mailbox of its own, if the org's quote template has no sender email set, `createQuote`, `duplicateQuote`, `sendQuote` / `sendQuoteWithDeliverable`, and `handleExpiredQuote` still succeed: they fall back to a generic TurboDocx sender (`no-reply@turbodocx.com`) rather than rejecting the call. Configure both **Sender Name** and **Sender Email** once (`const tmpl = await TurboQuote.getTemplate(); await TurboQuote.updateTemplate(tmpl.id, { senderEmail, senderName });`) so quotes show your own sender identity instead of the generic fallback.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
import os
from turbodocx_sdk import TurboQuote

TurboQuote.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"],  # optional — auto-reads env var
)
```

:::tip No sender email on the client — but set one on your quote template
`TurboQuote.configure()` does **not** take `sender_email` or `sender_name`. Quotes are not signature emails. Only `api_key` and, optionally, `org_id` are needed. If you skip the explicit call, the SDK lazily auto-configures from `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` on first use.

The quote's **"Prepared by"** sender comes from your **org quote template** instead. Because an API key has no mailbox of its own, every sender-resolving call — `create_quote`, `duplicate_quote`, `send_quote` / `send_quote_with_deliverable`, and `handle_expired_quote` — fails with a `ValidationError` (`400 SenderEmailRequired`) when the org's quote template has no sender email set. A companion `400 SenderNameRequired` is returned when no sender **name** resolves. Configure both **Sender Name** and **Sender Email** once (`TurboQuote.update_template(id, {"senderEmail": ..., "senderName": ...})`) and all of them resolve cleanly.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

:::tip No senderEmail on the client — but set one on your quote template
`TurboQuote` does **not** take `senderEmail` or `senderName` — quotes are not signature emails; only `apiKey` and, optionally, `orgId` are needed.

The quote's **"Prepared by"** sender comes from your **org quote template** instead. Because an API key has no mailbox of its own, every sender-resolving call — `createQuote()`, `duplicateQuote()`, `sendQuote()` / `sendQuoteWithDeliverable()`, and `handleExpiredQuote()` — fails with a `ValidationException` (`400 SenderEmailRequired`) when the org's quote template has no sender email set. A companion `400 SenderNameRequired` is returned when no sender **name** resolves. Configure both **Sender Name** and **Sender Email** once (`TurboQuote::updateTemplate(...)`) and all of them resolve cleanly.
:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
import (
    "os"
    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

qc, err := turbodocx.NewQuoteClient(turbodocx.QuoteClientConfig{
    APIKey: os.Getenv("TURBODOCX_API_KEY"),
    OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
})
if err != nil {
    log.Fatal(err)
}
```

`NewQuoteClient` does **not** take `SenderEmail` — a quote has no per-request sender field. Sender validation is **not** skipped, though: it moves to your org quote template (see below). `OrgID` is required; both `APIKey` and `OrgID` fall back to `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` when not set in config.

The quote's **"Prepared by"** sender comes from your **org quote template** instead. Because an API key has no mailbox of its own, every sender-resolving call — `CreateQuote`, `DuplicateQuote`, `SendQuote` / `SendQuoteWithDeliverable`, and `HandleExpiredQuote` — fails with a `ValidationError` (`400 SenderEmailRequired`) when the org's quote template has no sender email set. A companion `400 SenderNameRequired` is returned when no sender **name** resolves. Configure both **Sender Name** and **Sender Email** once (`UpdateTemplate`) and all of them resolve cleanly.

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### Environment Variables {#environment-variables}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```bash
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```bash
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```bash
TURBODOCX_API_KEY=your_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

:::caution API Credentials Required
Both `APIKey` and `OrgID` are required. To get your credentials, follow the [Get Your Credentials](/docs/SDKs#1-get-your-credentials) steps from the SDKs main page.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```bash
TURBODOCX_API_KEY=your_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

:::caution API Credentials Required
Both `apiKey` and `orgId` are required. To get your credentials, follow the [Get Your Credentials](/docs/SDKs#1-get-your-credentials) steps from the SDKs main page.
:::

</TabItem>
</Tabs>

## Quick Start {#quick-start}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
</Tabs>

### 1. Create a company, quote, and add line items {#1-create-a-company-quote-and-add-line-items}

<Tabs groupId="language" queryString>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### 2. Create and send in one call {#2-create-and-send-in-one-call}

<Tabs groupId="language" queryString>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### 3. Apply a price book, then send with a deliverable {#3-apply-a-price-book-then-send-with-a-deliverable}

<Tabs groupId="language" queryString>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="full-quote-lifecycle-create--add-items--send--download-pdf"></a>
<a id="full-lifecycle-create--add-items--send--download-pdf"></a>

### Create a quote, add line items, send, and download the PDF / Full quote lifecycle: create → add items → send → download PDF / Full lifecycle: create → add items → send → download PDF {#create-a-quote-add-line-items-send-and-download-the-pdf}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

echo 'Added ' . count($items) . " item(s)\n";

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    ctx := context.Background()

    qc, err := turbodocx.NewQuoteClient(turbodocx.QuoteClientConfig{
        APIKey: os.Getenv("TURBODOCX_API_KEY"),
        OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
    })
    if err != nil {
        log.Fatal(err)
    }

    // 1. Create a draft quote
    currency := "USD"
    termDays := 30
    quote, err := qc.CreateQuote(ctx, &turbodocx.CreateQuoteRequest{
        Name:         "Acme Corp — Q3 Proposal",
        CompanyID:    "company-uuid",
        ContactID:    "contact-uuid",
        CurrencyCode: &currency,
        TermDays:     &termDays,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Created quote %s (%s)\n", quote.QuoteNumber, quote.ID)

    // 2. Add a product line item
    qty := 5
    lineItems, err := qc.AddLineItems(ctx, quote.ID, turbodocx.AddLineItemRequest{
        ProductID:        &[]string{"product-uuid"}[0],
        ProductName:      "Enterprise License",
        UnitPrice:        500.00,
        BillingFrequency: "annual",
        Quantity:         &qty,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Added %d line item(s)\n", len(lineItems))

    // 3. Send the quote to the customer
    sent, err := qc.SendQuote(ctx, quote.ID, &turbodocx.SendQuoteRequest{
        CCEmails: []string{"manager@acmecorp.com"},
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Sent: %s\n", sent.Message)

    // 4. Download PDF
    pdfBytes, err := qc.DownloadQuotePdf(ctx, quote.ID)
    if err != nil {
        log.Fatal(err)
    }
    os.WriteFile("quote.pdf", pdfBytes, 0644)
    fmt.Printf("PDF saved (%d bytes)\n", len(pdfBytes))
}
```

</TabItem>
</Tabs>

<a id="convenience-create-add-items-and-send-in-one-call"></a>

### Convenience: createAndSend / Convenience: create, add items, and send in one call / Convenience: CreateAndSend {#convenience-createandsend}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

`CreateAndSend` performs the create + add items + send flow in a single call (3-4 sequential API requests under the hood):

```go
currency := "USD"
productID := "product-uuid"
resp, err := qc.CreateAndSend(ctx, &turbodocx.CreateAndSendRequest{
    Name:         "Acme Corp — Quick Proposal",
    CompanyID:    "company-uuid",
    ContactID:    "contact-uuid",
    CurrencyCode: &currency,
    Items: []turbodocx.AddLineItemRequest{
        {
            // ProductID, ProductName, UnitPrice and BillingFrequency are all required.
            // ProductID may be nil (custom line item), but the key is always sent.
            ProductID:        &productID,
            ProductName:      "Enterprise License",
            UnitPrice:        500.00,
            BillingFrequency: "annual",
        },
    },
    Send: &turbodocx.SendQuoteRequest{},
})
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Quote %s sent\n", resp.Quote.QuoteNumber)
```

</TabItem>
</Tabs>

## Method Reference {#method-reference}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

All methods are static on the `TurboQuote` class. Configure once, then call on the class directly.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

All methods are `@classmethod`s on `TurboQuote`; configure once, then call on the class.

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

All methods are static. Configure once with `TurboQuote::configure(...)`, then call on the class directly.

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

All methods are instance methods on `*turbodocx.QuoteClient`. Construct once, then reuse across goroutines — the client is safe for concurrent use.

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

All methods are instance methods on `com.turbodocx.TurboQuote`. Obtain the instance via `client.turboQuote()` from a constructed `TurboQuoteClient`. All methods throw `IOException` and `TurboDocxException` subclasses.

---

</TabItem>
</Tabs>

<a id="quotes--crud"></a>

### Quotes / Quotes — CRUD {#quotes}

<a id="list_quotes"></a>

#### `listQuotes` / `list_quotes` / ListQuotes {#listquotes}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

for (const q of results) {
  console.log(q.name, q.status);
}
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
page = await TurboQuote.list_quotes({
    "limit": 20,
    "offset": 0,
    "query": "acme",
    "statuses": ["draft", "sent"],  # repeated-key filter
})
# page["results"], page["totalRecords"], page["stats"]

for q in page["results"]:
    print(q["name"], q["status"])
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Retrieve a paginated list of quotes with optional filters. Returns `*QuoteListResponse` which includes `Results`, `TotalRecords`, and aggregate `Stats` (pipeline totals, win rate, MRR, etc.).

```go
limit := 10
statuses := []string{"draft", "sent"}
list, err := qc.ListQuotes(ctx, &turbodocx.ListQuotesOptions{
    Limit:    &limit,
    Statuses: statuses,
})
// list.Results []Quote
// list.TotalRecords int
// list.Stats.WinRate float64

for _, q := range list.Results {
    fmt.Println(q.Name, q.Status)
}
```

| Field | Type | Description |
|---|---|---|
| `Limit` | `*int` | Results per page |
| `Offset` | `*int` | Results to skip |
| `Query` | `*string` | Search by name or quote number |
| `Statuses` | `[]string` | Filter by status (e.g., `"draft"`, `"sent"`, `"accepted"`) |
| `CompanyID` | `*string` | Filter by company |
| `ContactID` | `*string` | Filter by contact |
| `CurrencyCode` | `*string` | Filter by currency |

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="create_quote"></a>

#### `createQuote` / `create_quote` / CreateQuote {#createquote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Create a new quote in `draft` status.

```typescript
// Fixed-term quote — termDays 0–3650, no renewalPeriod (0 = one-time, -1 = auto-renewal)
const quote = await TurboQuote.createQuote({
  name: 'Q3 Renewal',           // required
  companyId: 'company-uuid',    // required
  contactId: 'contact-uuid',    // required
  currency: 'USD',              // 'USD'|'EUR'|'GBP'|'CAD'|'AUD'|'INR'
  termDays: 30,                 // fixed term in days — omit to get the default of 60
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

:::caution termDays and renewalPeriod are coupled
`termDays` defaults to **60** when omitted. Valid values are `-1` (auto-renewal) or `0`–`3650` (`0` = one-time).

`renewalPeriod` is **required** when `termDays` is `-1`, and must be **null or absent** for every other `termDays` value — sending it alongside a fixed term returns a `400`. The same rule applies on `updateQuote`.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
// Fixed-term quote — TermDays is -1 or 0–3650; omit it to get the default of 60.
termDays := 30
quote, err := qc.CreateQuote(ctx, &turbodocx.CreateQuoteRequest{
    Name:      "New Proposal",
    CompanyID: "company-uuid",
    ContactID: "contact-uuid",
    TermDays:  &termDays, // fixed term — do NOT set RenewalPeriod alongside this
})

// Auto-renewal quote — TermDays -1 REQUIRES RenewalPeriod.
autoRenew := -1
renewalPeriod := "annually" // "weekly" | "monthly" | "quarterly" | "annually"
subscription, err := qc.CreateQuote(ctx, &turbodocx.CreateQuoteRequest{
    Name:          "Annual Subscription",
    CompanyID:     "company-uuid",
    ContactID:     "contact-uuid",
    TermDays:      &autoRenew,
    RenewalPeriod: &renewalPeriod,
})
```

Required: `Name`, `CompanyID`, `ContactID`. Returns `*Quote`.

:::caution TermDays and RenewalPeriod are coupled
`TermDays` defaults to **60** when omitted. Valid values are `-1` (auto-renewal) or `0`–`3650` (`0` = one-time).

`RenewalPeriod` is **required** when `TermDays` is `-1`, and must be **nil/absent** for every other `TermDays` value — sending it alongside a fixed term returns a `400`. The same rule applies on `UpdateQuote`; use `ClearRenewalPeriod()` when moving a quote off auto-renewal.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="get_quote"></a>

#### `getQuote` / `get_quote` / GetQuote {#getquote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Fetch a single quote. The returned object includes a `statusInfo` field with transition flags (`canSend`, `canAccept`, `canDecline`, `canVoid`) and a `preparedBy` object — the resolved "Prepared by" identity shown on the quote PDF.

```typescript
const quote = await TurboQuote.getQuote('quote-uuid');
console.log(quote.statusInfo?.canSend);     // true when status is 'draft'
console.log(quote.statusInfo?.canDecline);  // also true when status is 'draft'
console.log(quote.preparedBy?.name);     // e.g. "Acme Billing Integration" or the template sender
console.log(quote.preparedBy?.email);    // may be undefined for an API-created quote — render a placeholder
```

`preparedBy` is resolved server-side (org template first, then the quote's creator). **Prefer it over `creator`** for any customer-facing display — `creator` may be the internal API service account. For an API-created quote the resolved name is the **API key's name** (never a generic "API Service User"), and the email comes from the org quote template. `preparedBy` is returned by the **single-quote fetch only** — it is not present on create, duplicate, or list responses.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Returns the quote with `statusInfo` and `preparedBy` merged in when present. `preparedBy` is the resolved "Prepared by" identity shown on the quote PDF.

```python
quote = await TurboQuote.get_quote("quote-uuid")
# quote["status"], quote["grandTotal"], quote.get("statusInfo")
prepared = quote.get("preparedBy") or {}
print(prepared.get("name"))   # e.g. "Acme Billing Integration" or the template sender
print(prepared.get("email"))  # may be absent for an API-created quote — render a placeholder
```

`preparedBy` is resolved server-side (org template first, then the quote's creator). **Prefer it over `creator`** for any customer-facing display — `creator` may be the internal API service account. For an API-created quote the resolved name is the **API key's name** (never a generic "API Service User"), and the email comes from the org quote template. `preparedBy` is returned by the **single-quote fetch only** — it is not present on create, duplicate, or list responses.

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$quote = TurboQuote::getQuote('quote-uuid');
// statusInfo and preparedBy are merged onto the returned Quote object when present
echo $quote->status;

$prepared = $quote->preparedBy ?? [];
echo $prepared['name'] ?? '';   // e.g. "Acme Billing Integration" or the template sender
echo $prepared['email'] ?? '';  // may be absent for an API-created quote — render a placeholder
```

`preparedBy` is the resolved "Prepared by" identity (org template first, then the quote's creator). **Prefer it over `creator`** for any customer-facing display — `creator` may be the internal API service account. For an API-created quote the resolved name is the **API key's name** (never a generic "API Service User"), and the email comes from the org quote template. `preparedBy` is returned by the **single-quote fetch only** — it is not present on create, duplicate, or list responses.

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Fetches a quote by ID. The `StatusInfo` field (merged onto the returned `Quote`) describes what transitions are available: `CanSend`, `CanAccept`, `CanDecline`, `CanVoid`, `IsTerminal`. The `PreparedBy` field carries the resolved "Prepared by" identity shown on the quote PDF.

```go
quote, err := qc.GetQuote(ctx, "quote-uuid")
if quote.StatusInfo != nil {
    fmt.Printf("Can send: %v\n", quote.StatusInfo.CanSend)
}
if quote.PreparedBy != nil && quote.PreparedBy.Name != nil {
    fmt.Println(*quote.PreparedBy.Name) // e.g. "Acme Billing Integration"; Email may be nil
}
```

`PreparedBy` is resolved server-side (org template first, then the quote's creator). **Prefer it over `Creator`** for any customer-facing display — `Creator` may be the internal API service account. For an API-created quote the resolved name is the **API key's name** (never a generic "API Service User"), and the email comes from the org quote template. `preparedBy` is returned by the **single-quote fetch only** — it is not present on create, duplicate, or list responses.

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="update_quote"></a>

#### `updateQuote` / `update_quote` / UpdateQuote {#updatequote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Patch any combination of quote fields. Pass `null` to clear nullable fields (`renewalPeriod`, `validUntil`, `taxRate`, `priceBookId`).

```typescript
const updated = await TurboQuote.updateQuote('quote-uuid', {
  name: 'Q3 Renewal — Revised',
  taxRate: null,       // clears the tax rate
});
```

:::info `name` is trimmed, and renaming is draft-only
`name` is trimmed on both `createQuote` and `updateQuote` — `'  Acme  '` is stored as `'Acme'` — and a name that is empty once trimmed returns a `400`. A quote can only be renamed while it is a **draft**; on any other status the update is rejected with `Cannot update quote that is not in draft status` (`templateId` is the only field exempt from that rule). Rename before you send, because **sending snapshots the quote's current name onto the TurboSign document** — that is the name signers see in the request email and on the signed PDF.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

All fields are optional — pass only what changes. Send an explicit `None` to clear a nullable field.

```python
updated = await TurboQuote.update_quote("quote-uuid", {
    "name": "Q3 Proposal — Revised",
    "validUntil": "2026-10-15",
    "taxRate": None,  # clears the field
})
```

:::info `name` is trimmed, and renaming is draft-only
`name` is trimmed on both `create_quote` and `update_quote` — `"  Acme  "` is stored as `"Acme"` — and a name that is empty once trimmed returns a `400`. A quote can only be renamed while it is a **draft**; on any other status the update is rejected with `Cannot update quote that is not in draft status` (`templateId` is the only field exempt from that rule). Rename before you send, because **sending snapshots the quote's current name onto the TurboSign document** — that is the name signers see in the request email and on the signed PDF.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
use TurboDocx\Types\Requests\Quote\UpdateQuoteRequest;

$quote = TurboQuote::updateQuote('quote-uuid', new UpdateQuoteRequest(
    name: 'Q3 Proposal — Revised',
    validUntil: '2026-10-15',
));
```

:::info `name` is trimmed, and renaming is draft-only
`name` is trimmed on both `createQuote` and `updateQuote` — `'  Acme  '` is stored as `'Acme'` — and a name that is empty once trimmed returns a `400`. A quote can only be renamed while it is a **draft**; on any other status the update is rejected with `Cannot update quote that is not in draft status` (`templateId` is the only field exempt from that rule). Rename before you send, because **sending snapshots the quote's current name onto the TurboSign document** — that is the name signers see in the request email and on the signed PDF.
:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

PATCH semantics — only provided fields are sent. Use the `Clear*` helpers to explicitly null a field:

```go
req := &turbodocx.UpdateQuoteRequest{}
req.ClearPriceBookID()  // sends "priceBookId": null
req.ClearValidUntil()   // sends "validUntil": null

quote, err := qc.UpdateQuote(ctx, "quote-uuid", req)
```

Available null-clear helpers: `ClearPriceBookID`, `ClearValidUntil`, `ClearTaxRate`, `ClearRenewalPeriod`.

:::info `Name` is trimmed, and renaming is draft-only
`Name` is trimmed on both `CreateQuote` and `UpdateQuote` — `"  Acme  "` is stored as `"Acme"` — and a name that is empty once trimmed returns a `400`. A quote can only be renamed while it is a **draft**; on any other status the update is rejected with `Cannot update quote that is not in draft status` (`TemplateID` is the only field exempt from that rule). Rename before you send, because **sending snapshots the quote's current name onto the TurboSign document** — that is the name signers see in the request email and on the signed PDF.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

:::info `name` is trimmed, and renaming is draft-only
`name` is trimmed on both `createQuote` and `updateQuote` — `"  Acme  "` is stored as `"Acme"` — and a name that is empty once trimmed returns a `400`. A quote can only be renamed while it is a **draft**; on any other status the update is rejected with `Cannot update quote that is not in draft status` (`templateId` is the only field exempt from that rule). Rename before you send, because **sending snapshots the quote's current name onto the TurboSign document** — that is the name signers see in the request email and on the signed PDF.
:::

</TabItem>
</Tabs>

<a id="delete_quote"></a>

#### `deleteQuote` / `delete_quote` / DeleteQuote {#deletequote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Soft-delete a quote.

```typescript
const { message } = await TurboQuote.deleteQuote('quote-uuid');
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
result = await TurboQuote.delete_quote("quote-uuid")
# result["message"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$result = TurboQuote::deleteQuote('quote-uuid');
echo $result->message;
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
result, err := qc.DeleteQuote(ctx, "quote-uuid")
// result.Message string
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
SuccessResponse deleteQuote(String id)
```

Delete a quote.

```java
SuccessResponse resp = tq.deleteQuote(quoteId);
System.out.println(resp.getMessage());
```

</TabItem>
</Tabs>

<a id="duplicate_quote"></a>

#### `duplicateQuote` / `duplicate_quote` / DuplicateQuote {#duplicatequote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Copy a quote (and its line items) into a new draft.

```typescript
const copy = await TurboQuote.duplicateQuote('quote-uuid');
```

The copy is named **`Copy of <original name>`**, truncated to the name column's 255-character limit. Rename it with `updateQuote` before sending if that is not what you want signers to see.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
new_quote = await TurboQuote.duplicate_quote("quote-uuid")
# returns new Quote in draft status
```

The copy is named **`Copy of <original name>`**, truncated to the name column's 255-character limit. Rename it with `update_quote` before sending if that is not what you want signers to see.

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$copy = TurboQuote::duplicateQuote('quote-uuid');
echo "Copy id: {$copy->id}";
```

The copy is named **`Copy of <original name>`**, truncated to the name column's 255-character limit. Rename it with `updateQuote` before sending if that is not what you want signers to see.

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Creates a new draft quote as a copy of the specified quote.

```go
copy, err := qc.DuplicateQuote(ctx, "quote-uuid")
```

The copy is named **`Copy of <original name>`**, truncated to the name column's 255-character limit. Rename it with `UpdateQuote` before sending if that is not what you want signers to see.

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
Quote duplicateQuote(String id)
```

Duplicate a quote (creates a draft copy).

```java
Quote copy = tq.duplicateQuote(quoteId);
System.out.println("New quote: " + copy.getId());
```

The copy is named **`Copy of <original name>`**, truncated to the name column's 255-character limit. Rename it with `updateQuote` before sending if that is not what you want signers to see.

</TabItem>
</Tabs>

The copy is attributed to **whoever ran the duplicate**, not to the original quote's creator — duplicating with an API key produces a quote whose "Prepared by" resolves through that API key and your org quote template.

<a id="apply_price_book"></a>

#### `applyPriceBook` / `apply_price_book` / ApplyPriceBook {#applypricebook}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Apply a price book to all line items on a quote. Returns the updated quote plus counts of how many items were updated vs skipped.

```typescript
const { quote, updatedCount, skippedCount, message } = await TurboQuote.applyPriceBook(
  'quote-uuid',
  'pricebook-uuid',
);
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Apply a price book to an existing quote; updates matching line item prices.

```python
result = await TurboQuote.apply_price_book("quote-uuid", "pricebook-uuid")
# result["quote"]        — updated Quote
# result["updatedCount"] — int, items that were re-priced
# result["skippedCount"] — int, items that had no pricebook match
# result["message"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Apply a price book to a quote, updating matching line item prices.

```php
$result = TurboQuote::applyPriceBook('quote-uuid', 'pricebook-uuid');
// $result->quote
// $result->message
// $result->updatedCount   — number of items re-priced
// $result->skippedCount   — items with no matching pricebook entry
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Applies a price book to a quote, adjusting line item prices to match book pricing.

```go
resp, err := qc.ApplyPriceBook(ctx, "quote-uuid", "pricebook-uuid")
// resp.UpdatedCount int — items updated
// resp.SkippedCount int — items not in price book
// resp.QuoteResult  Quote
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
ApplyPriceBookResponse applyPriceBook(String quoteId, String priceBookId)
```

Apply a price book to a quote, recalculating line item prices. Returns `{quote, message, updatedCount, skippedCount}`.

```java
ApplyPriceBookResponse resp = tq.applyPriceBook(quoteId, priceBookId);
System.out.println("Updated " + resp.getUpdatedCount() + " items.");
```

</TabItem>
</Tabs>

<a id="remove_price_book"></a>

#### `removePriceBook` / `remove_price_book` / RemovePriceBook {#removepricebook}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Detach the price book from a quote (line item prices are not reverted).

```typescript
const quote = await TurboQuote.removePriceBook('quote-uuid');
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
quote = await TurboQuote.remove_price_book("quote-uuid")
```

---

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$quote = TurboQuote::removePriceBook('quote-uuid');
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Removes the applied price book, reverting line items to catalog prices.

```go
quote, err := qc.RemovePriceBook(ctx, "quote-uuid")
```

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
Quote removePriceBook(String quoteId)
```

Remove the applied price book from a quote, restoring original line item pricing.

```java
Quote quote = tq.removePriceBook(quoteId);
```

</TabItem>
</Tabs>

<a id="download_quote_pdf"></a>

#### `downloadQuotePdf` / `download_quote_pdf` / DownloadQuotePdf {#downloadquotepdf}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Download the quote as a PDF. Returns raw bytes as an `ArrayBuffer`.

```typescript
const pdf = await TurboQuote.downloadQuotePdf('quote-uuid');
writeFileSync('quote.pdf', Buffer.from(pdf));
```

---

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Returns raw PDF bytes.

```python
pdf_bytes = await TurboQuote.download_quote_pdf("quote-uuid")
with open("quote.pdf", "wb") as f:
    f.write(pdf_bytes)
```

---

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Returns raw PDF bytes. Save to disk or stream to the browser.

```php
$pdfBytes = TurboQuote::downloadQuotePdf('quote-uuid');
file_put_contents('quote.pdf', $pdfBytes);

// Or stream as HTTP response
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="quote.pdf"');
echo $pdfBytes;
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Returns the raw PDF bytes. Write directly to a file or stream to a response.

```go
pdfBytes, err := qc.DownloadQuotePdf(ctx, "quote-uuid")
if err != nil {
    log.Fatal(err)
}
os.WriteFile("proposal.pdf", pdfBytes, 0644)
```

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
byte[] downloadQuotePdf(String id)
```

Download the quote as a PDF. Returns raw bytes.

```java
byte[] pdf = tq.downloadQuotePdf(quoteId);
Files.write(Paths.get("quote.pdf"), pdf);
```

---

</TabItem>
</Tabs>

### Quote Numbering Configuration {#quote-numbering-configuration}

Customize the per-org quote number format: prefix, year/month tokens, separator, zero-padding, suffix, starting number, and reset cadence. Both methods are **admin only**; a non-admin API key receives a `403`.

<a id="get_quote_number_config"></a>

#### `getQuoteNumberConfig` / `get_quote_number_config` / GetQuoteNumberConfig {#getquotenumberconfig}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Fetch the org's current quote numbering format and the current per-period issued floor.

```typescript
const config = await TurboQuote.getQuoteNumberConfig();
console.log(config.format.prefix);   // e.g. "Q-"
console.log(config.currentFloor);    // the current per-period issued floor
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Fetch the org's current quote numbering format and the current per-period issued floor.

```python
config = await TurboQuote.get_quote_number_config()
print(config["format"]["prefix"])   # e.g. "Q-"
print(config["currentFloor"])       # the current per-period issued floor
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Fetch the org's current quote numbering format and the current per-period issued floor.

```php
$config = TurboQuote::getQuoteNumberConfig();
echo $config->format->prefix;    // e.g. "Q-"
echo $config->currentFloor;      // the current per-period issued floor
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Fetches the org's current quote numbering format and the current per-period issued floor.

```go
config, err := qc.GetQuoteNumberConfig(ctx)
if err != nil {
    log.Fatal(err)
}
fmt.Println(config.Format.Prefix)   // e.g. "Q-"
fmt.Println(config.CurrentFloor)    // the current per-period issued floor
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
QuoteNumberConfig getQuoteNumberConfig()
```

Fetch the org's current quote numbering format and the current per-period issued floor.

```java
QuoteNumberConfig config = tq.getQuoteNumberConfig();
System.out.println(config.getFormat().getPrefix());  // e.g. "Q-"
System.out.println(config.getCurrentFloor());        // the current per-period issued floor
```

</TabItem>
</Tabs>

<a id="update_quote_number_config"></a>

#### `updateQuoteNumberConfig` / `update_quote_number_config` / UpdateQuoteNumberConfig {#updatequotenumberconfig}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Updates the numbering format. Pass the full format; all eight fields are sent.

```go
config, err := qc.UpdateQuoteNumberConfig(ctx, &turbodocx.QuoteNumberFormat{
    Prefix:       "INV",
    YearToken:    "none",  // "none" | "two" | "four"
    MonthToken:   "off",   // "off" | "two"
    Separator:    "-",
    PadWidth:     4,        // 0–12
    Suffix:       "",
    StartNumber:  1000,     // >= 0
    ResetCadence: "never",  // "never" | "yearly" | "monthly"
})
if err != nil {
    log.Fatal(err)
}
fmt.Println(config.Format.StartNumber)  // 1000
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

#### Field reference, defaults & validation {#field-reference-defaults--validation}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

All eight `QuoteNumberFormat` fields are sent on every update. The API enforces these caps and allowed values — a violation returns `400`:

| Field | Type | Allowed / range | Default |
|-------|------|-----------------|---------|
| `Prefix` | string | ≤ 12 characters | `"Q"` |
| `YearToken` | enum | `none` \| `two` \| `four` | `four` |
| `MonthToken` | enum | `off` \| `two` | `off` |
| `Separator` | string | ≤ 4 characters | `"-"` |
| `PadWidth` | int | `0`–`12` (`0` = no padding) | `5` |
| `Suffix` | string | ≤ 12 characters | `""` |
| `StartNumber` | int | `0`–`1000000000` | `1` |
| `ResetCadence` | enum | `never` \| `yearly` \| `monthly` | `yearly` |

An org that has never configured numbering uses the **default format** above, which renders like `Q-2026-00001`. The token values are also available as typed constants (`turbodocx.QuoteNumberYearTokenFour`, etc.).

Beyond the per-field caps, the API rejects self-inconsistent formats with a `400`:

- `ResetCadence: "yearly"` requires a year token (`YearToken` other than `none`) — otherwise numbers repeat across years.
- `ResetCadence: "monthly"` requires **both** a year token and a month token (`MonthToken: "two"`).
- The rendered quote number must be ≤ 256 characters.

`CurrentFloor` (returned by both methods) is read-only — the sequence the next quote will use for the current period — and is never sent on update.

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="quotes--status-transitions"></a>

### Quote Status Transitions / Quotes — Status Transitions {#quote-status-transitions}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

A quote with **no line items cannot be sent** — add at least one product, bundle, or custom
line item first. Likewise an **expired quote is rejected**; update `validUntil`, or use the
handle-expired flow to void it and create a fresh draft.

:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="send_quote"></a>

#### `sendQuote` / `send_quote` / SendQuote {#sendquote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Send a draft quote to the contact. Optionally include CC recipients, set a validity deadline, or attach a **reminder & expiration schedule**.

```typescript
const { quote, message } = await TurboQuote.sendQuote('quote-uuid', {
  validUntil: '2026-07-31',
  ccEmails: ['manager@example.com'],

  // Optional reminder & expiration schedule (same shape as TurboSign sendSignature)
  remindersEnabled: true,
  reminderDelay: { value: 3, unit: 'days' },     // { value, unit } — 'hours' | 'days'
  reminderInterval: { value: 3, unit: 'days' },
  maxReminders: 5,                               // -1 unlimited, 0 none, max 50
  expirationEnabled: true,                       // toggles expiry on/off
  expirationWarning: { value: 3, unit: 'days' },
  expirationWarningInterval: { value: 1, unit: 'days' },
});
```

:::info Quote expiry is pinned to `validUntil`
For a quote, the signing deadline is **hard-pinned to the quote's `validUntil` date** — you do **not** set `expireAfter`. `expirationEnabled` still toggles whether the signing window closes at all, but when it's on, the deadline is `validUntil` (any `expireAfter` you pass is ignored). The reminder and expiration-warning cadence still applies, and it must **fit inside** the `validUntil` window — a cadence that would outlive the quote's validity is rejected with a `400`.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
sent = await TurboQuote.send_quote("quote-uuid", {
    "ccEmails": ["manager@example.com"],
    "validUntil": "2026-09-30",
})
# sent["quote"], sent["message"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
use TurboDocx\Types\Requests\Quote\SendQuoteRequest;

$result = TurboQuote::sendQuote('quote-uuid', new SendQuoteRequest(
    // optional overrides; pass null to use quote defaults
));
// $result->quote  — updated Quote
// $result->message
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Moves the quote from `draft` to `sent` and emails the proposal to the contact.

```go
sent, err := qc.SendQuote(ctx, "quote-uuid", &turbodocx.SendQuoteRequest{
    CCEmails:   []string{"cc@example.com"},
    ValidUntil: &[]string{"2026-09-01"}[0],
})
// sent.QuoteResult Quote
// sent.Message     string
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
SendQuoteResponse sendQuote(String id)
SendQuoteResponse sendQuote(String id, SendQuoteRequest request)
```

Send a quote to the contact. Returns `{quote, message}`. Pass `SendQuoteRequest` to configure send options, or omit for defaults.

```java
SendQuoteResponse resp = tq.sendQuote(quoteId);
System.out.println("Status: " + resp.getQuote().getStatus());
```

</TabItem>
</Tabs>

<a id="send_quote_with_deliverable"></a>

#### `sendQuoteWithDeliverable` / `send_quote_with_deliverable` / SendQuoteWithDeliverable {#sendquotewithdeliverable}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Send a quote paired with a TurboDocx deliverable (e.g., a contract generated from a template). The deliverable is merged before or after the quote PDF. It accepts the **same reminder & expiration schedule** as `sendQuote` (expiry pinned to `validUntil`, per the note above).

```typescript
const { quote, message, documentId } = await TurboQuote.sendQuoteWithDeliverable(
  'quote-uuid',
  {
    deliverableId: 'deliverable-uuid',
    mergePosition: 'end',   // 'beginning' | 'end'
    ccEmails: ['legal@example.com'],

    // Optional — same schedule fields as sendQuote
    remindersEnabled: true,
    reminderDelay: { value: 3, unit: 'days' },
    expirationEnabled: true,
  },
);
// documentId — TurboSign document created for the merged PDF
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Attach a TurboDocx-generated document to the sent quote.

```python
result = await TurboQuote.send_quote_with_deliverable("quote-uuid", {
    "deliverableId": "deliverable-uuid",
    "ccEmails": ["manager@example.com"],
})
# result["quote"], result["message"], result["documentId"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Sends the quote with a TurboDocx-generated document (e.g., a proposal PDF) attached as a signature document.

```go
resp, err := qc.SendQuoteWithDeliverable(ctx, "quote-uuid", &turbodocx.SendQuoteWithDeliverableRequest{
    DeliverableID: "deliverable-uuid",
    MergePosition: "after", // "before" | "after"
    CCEmails:      []string{"cc@example.com"},
})
// resp.DocumentID string — TurboSign document ID for tracking
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="reminders-and-expiration-on-quote-sends"></a>
<a id="reminders-and-expiration-on-send"></a>
<a id="reminders-and-expiration-on-a-quote-send"></a>

#### Reminders and expiration when sending a quote / Reminders and expiration on quote sends / Reminders and expiration on send / Reminders and expiration on a quote send {#reminders-and-expiration-when-sending-a-quote}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Both `send_quote` and `send_quote_with_deliverable` accept the same reminder/expiration schedule
as TurboSign. Because these are quote request-body fields, the keys are **camelCase** (like
`ccEmails` / `validUntil` above), even though the method names are snake_case:

```python
sent = await TurboQuote.send_quote("quote-uuid", {
    "validUntil": "2026-09-30",
    "remindersEnabled": True,
    "reminderDelay": {"value": 3, "unit": "days"},     # {value, unit}: "days" or "hours"
    "reminderInterval": {"value": 3, "unit": "days"},
    "maxReminders": 5,                                  # -1 unlimited, 0 none, max 50
    "expirationEnabled": True,
    "expirationWarning": {"value": 1, "unit": "days"},  # 0 = never warn
    "expirationWarningInterval": {"value": 1, "unit": "days"},
})
```

:::warning Quote expiry is pinned to `validUntil`
For a quote, the signing deadline is **hard-pinned to the quote's `validUntil` date**. Any
`expireAfter` you pass is **ignored** — `expirationEnabled` still toggles expiry on or off, but
when on, the document expires exactly at `validUntil`. The reminder and expiration-warning
cadence still applies and **must fit inside the `validUntil` window**; a cadence that would
outlive the quote is rejected with `400`. Duration values are `{value, unit}` (`"days"` or
`"hours"`), min `1`, max **999 days / 23976 hours**.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Both `sendQuote` and `sendQuoteWithDeliverable` accept the same TurboSign schedule fields as
`TurboSign::sendSignature` — `remindersEnabled` / `reminderDelay` / `reminderInterval` /
`maxReminders` and `expirationEnabled` / `expirationWarning` / `expirationWarningInterval`, each a
`['value' => N, 'unit' => 'hours'|'days']` duration where applicable.

```php
$result = TurboQuote::sendQuoteWithDeliverable('quote-uuid', new SendQuoteWithDeliverableRequest(
    deliverableId: 'deliverable-uuid',
    mergePosition: 'end',
    remindersEnabled: true,
    reminderDelay: ['value' => 3, 'unit' => 'days'],
    reminderInterval: ['value' => 3, 'unit' => 'days'],
    maxReminders: 5,                                       // -1 unlimited, 0 none, max 50
    expirationEnabled: true,                               // toggles expiry on the signature request
    expirationWarning: ['value' => 3, 'unit' => 'days'],  // 0 = never warn
));
```

:::warning Quote expiry is pinned to `validUntil`
For a quote send, **the signing deadline is hard-pinned to the quote's `validUntil` date** —
`expireAfter` is **ignored**. `expirationEnabled` still toggles whether the signature request
expires at all, but when on, the deadline is always `validUntil` (never a relative `expireAfter`
window). The reminder and expiration-warning cadence still applies and **must fit inside
`validUntil`**; a cadence that would outlive the quote's validity is rejected with a `400`. Set a
`validUntil` far enough out to contain the reminders you schedule.
:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Both `SendQuoteRequest` and `SendQuoteWithDeliverableRequest` embed a `SignatureSchedule` — the same eight reminder/expiration override fields used by TurboSign's [`SendSignature`](./go.md#schedule-reminders-and-expiration), with `Duration{Value, Unit}` durations (`Unit` is `"hours"` or `"days"`). This drives the reminder and expiry-warning cadence on the quote's signature request.

```go
sent, err := qc.SendQuote(ctx, "quote-uuid", &turbodocx.SendQuoteRequest{
    ValidUntil: &[]string{"2026-09-01"}[0],
    SignatureSchedule: turbodocx.SignatureSchedule{
        RemindersEnabled:  turbodocx.BoolPtr(true),
        ReminderDelay:     &turbodocx.Duration{Value: 3, Unit: "days"},
        ReminderInterval:  &turbodocx.Duration{Value: 7, Unit: "days"},
        ExpirationEnabled: turbodocx.BoolPtr(true),
        // ExpireAfter is intentionally omitted — see below.
    },
})
```

:::caution Quote expiry is pinned to `validUntil`
For a quote, the signing deadline is **hard-pinned to the quote's `ValidUntil`** — it always equals `validUntil`, so `ExpireAfter` is **ignored** on the quote send paths. `ExpirationEnabled` still toggles expiry on or off. The reminder and expiry-warning cadence still applies, but every scheduled reminder/warning must fall **inside** the `validUntil` window; a cadence that would outlive the quote's validity is rejected with **HTTP 400**.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

`sendQuote` and `sendQuoteWithDeliverable` accept the same `SignatureSchedule` as TurboSign (`remindersEnabled` / `reminderDelay` / `reminderInterval` / `maxReminders` and `expirationEnabled` / `expireAfter` / `expirationWarning` / `expirationWarningInterval`), with **one quote-specific difference**: the signing deadline is **hard-pinned to the quote's `validUntil` date**. When `expirationEnabled` is `true` the document expires exactly at `validUntil` — **any `expireAfter` you pass is ignored** — while `expirationEnabled` still toggles whether expiry is enforced at all. The reminder and warning cadence still applies, but every reminder and warning must fall **inside** the `validUntil` window; a cadence that would outlive it is rejected with `400`.

```java
SignatureSchedule schedule = SignatureSchedule.builder()
    .remindersEnabled(true)
    .reminderDelay(new SignatureSchedule.Duration(3, "days"))        // must fit inside validUntil
    .maxReminders(5)                                                 // -1..50 (-1 unlimited, 0 none)
    .expirationEnabled(true)                                         // expire at validUntil (expireAfter ignored)
    .expirationWarning(new SignatureSchedule.Duration(2, "days"))    // 0 = never warn
    .build();

SendQuoteWithDeliverableRequest scheduledReq = new SendQuoteWithDeliverableRequest();
scheduledReq.setDeliverableId("your-deliverable-id");
scheduledReq.setSchedule(schedule);

tq.sendQuoteWithDeliverable(quoteId, scheduledReq);
```

Each `Duration` is a `{value, unit}` pair (`unit` is `"hours"` or `"days"`, `value` a whole number from 1 up to 999 days / 23976 hours).

</TabItem>
</Tabs>

<a id="decline_quote"></a>

#### `declineQuote` / `decline_quote` / DeclineQuote {#declinequote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Mark a quote as declined — either a **sent** quote (typically on behalf of the recipient) or a **draft** whose deal died before it was ever sent.

`reason` (max 190 characters) is **required once a quote has been sent** — declining a sent quote without one returns `400 CANNOT_DECLINE_QUOTE`. A **draft is declined without a reason**: the reason is stored on the quote's linked signature document, and a draft has none, so any reason passed for a draft is accepted by the API and **not recorded**.

```typescript
const quote = await TurboQuote.declineQuote('quote-uuid', {
  reason: 'Budget constraints for this quarter',
});

// A draft is declined with no reason — one passed here would not be recorded.
const closedOut = await TurboQuote.declineQuote('draft-quote-uuid', {});
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Declines a **sent** quote or a **draft**. `reason` (max 190 characters) is required once a quote has been sent. A draft is declined **without** a reason — a draft never reached the customer, and because the reason is stored on the linked signature document, a draft has nowhere to keep one, so anything passed is ignored.

```python
quote = await TurboQuote.decline_quote("quote-uuid", {
    "reason": "Customer selected a competitor",
})

# A draft is declined with no reason — one passed here would not be recorded.
closed_out = await TurboQuote.decline_quote("draft-quote-uuid", {})
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Declines a **sent** quote or a **draft**. `reason` (max 190 characters) is required once a quote has been sent. A draft is declined **without** a reason — a draft never reached the customer, and because the reason is stored on the linked signature document, a draft has nowhere to keep one, so anything passed is ignored.

```php
use TurboDocx\Types\Requests\Quote\DeclineQuoteRequest;

$quote = TurboQuote::declineQuote('quote-uuid', new DeclineQuoteRequest(
    reason: 'Price out of budget',
));

// A draft is declined with no reason — one passed here would not be recorded.
$closedOut = TurboQuote::declineQuote('draft-quote-uuid', new DeclineQuoteRequest());
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Declines a **sent** quote or a **draft**. `Reason` (max 190 characters) is required once a quote has been sent. A draft is declined **without** a reason — a draft never reached the customer, and because the reason is stored on the linked signature document, a draft has nowhere to keep one, so anything passed is ignored — an unset `Reason` is omitted from the request.

```go
quote, err := qc.DeclineQuote(ctx, "quote-uuid", &turbodocx.DeclineQuoteRequest{
    Reason: "Budget constraints for this quarter",
})

// A draft is declined with no reason — one passed here would not be recorded.
closedOut, err := qc.DeclineQuote(ctx, "draft-quote-uuid", &turbodocx.DeclineQuoteRequest{})
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
Quote declineQuote(String id, DeclineQuoteRequest request)
```

Mark a quote as declined — either a **sent** quote or a **draft** whose deal died before it was ever sent.

`reason` (max 190 characters) is **required once a quote has been sent** — declining a sent quote without one returns `400 CANNOT_DECLINE_QUOTE`. A **draft is declined without a reason**: the reason is stored on the quote's linked signature document, and a draft has none, so any reason passed for a draft is accepted by the API and **not recorded**.

```java
DeclineQuoteRequest req = new DeclineQuoteRequest();
req.setReason("Budget constraints");

Quote declined = tq.declineQuote(quoteId, req);

// A draft is declined with no reason — one passed here would not be recorded.
Quote closedOut = tq.declineQuote(draftQuoteId, new DeclineQuoteRequest());
```

</TabItem>
</Tabs>

<a id="void_quote"></a>

#### `voidQuote` / `void_quote` / VoidQuote {#voidquote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Void a **sent** quote that should no longer be valid; a **draft cannot be voided**, since voiding an unsent quote is meaningless.

```typescript
const quote = await TurboQuote.voidQuote('quote-uuid', {
  reason: 'Superseded by revised quote #Q-102',
});
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Voids a **sent** quote; a **draft cannot be voided**, since voiding an unsent quote is meaningless.

```python
quote = await TurboQuote.void_quote("quote-uuid", {
    "reason": "Terms expired before acceptance",
})
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Voids a **sent** quote; a **draft cannot be voided**, since voiding an unsent quote is meaningless.

```php
use TurboDocx\Types\Requests\Quote\VoidQuoteRequest;

$quote = TurboQuote::voidQuote('quote-uuid', new VoidQuoteRequest(
    reason: 'Superseded by new proposal',
));
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Voids a **sent** quote; a **draft cannot be voided**, since voiding an unsent quote is meaningless.

```go
quote, err := qc.VoidQuote(ctx, "quote-uuid", &turbodocx.VoidQuoteRequest{
    Reason: "Replaced by updated proposal",
})
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
Quote voidQuote(String id, VoidQuoteRequest request)
```

Void a **sent** quote (cannot be undone); a **draft cannot be voided**, since voiding an unsent quote is meaningless.

```java
VoidQuoteRequest req = new VoidQuoteRequest();
req.setReason("Replaced by new proposal");

Quote voided = tq.voidQuote(quoteId, req);
```

</TabItem>
</Tabs>

<a id="handle_expired_quote"></a>

#### `handleExpiredQuote` / `handle_expired_quote` / HandleExpiredQuote {#handleexpiredquote}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Handle a quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on `action` — and then **creates a duplicate draft carrying `newValidUntil`** as its new validity date. The returned quote is the new duplicate; the original stays terminal.

`action` (`'void'`, `'decline'` or `'renew'`) and `newValidUntil` (ISO date) are **required**. `reason` (≤ 190 characters) is required for `'void'` and `'decline'`, and optional for `'renew'` — a renewal closes nothing out, so there is nothing to give a reason for. Use `'renew'` when the quote's signature request has already expired on its own; use `'void'` or `'decline'` when the quote is merely past its `validUntil` and you are closing it yourself.

```typescript
const quote = await TurboQuote.handleExpiredQuote('quote-uuid', {
  action: 'void',                 // 'void' | 'decline' | 'renew'
  reason: 'Expired — re-quoting',  // required for void/decline, optional for renew
  newValidUntil: '2026-08-31',    // required, ISO date carried onto the duplicate
});
```

:::warning There is no `extend` or `resend` action
`action` accepts **only** `"void"`, `"decline"` and `"renew"`. `"extend"` and `"resend"` do not exist in the API and return a `400`. Extending is what the endpoint already does for you — pass `newValidUntil` and it lands on the duplicate it creates.
:::

:::info The replacement draft keeps the original name
Unlike `duplicateQuote`, the draft this endpoint creates is **not** prefixed with `Copy of ` — re-issuing the same deal keeps the original quote's name, so repeated renewals cannot compound into `Copy of Copy of …`. That matters because the next send snapshots the name onto the TurboSign document.
:::

---

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Handles a quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on `action` — and then **creates a duplicate carrying `newValidUntil`** as its new validity date. The returned quote is the new duplicate; the original stays terminal.

`action` (`"void"`, `"decline"` or `"renew"`) and `newValidUntil` (ISO date) are **required**. `reason` (max 190 characters) is required for `"void"` and `"decline"`, and optional for `"renew"` — a renewal closes nothing out, so there is nothing to give a reason for. Use `"renew"` when the quote's signature request has already expired on its own; use `"void"` or `"decline"` when the quote is merely past its `validUntil` and you are closing it yourself.

```python
quote = await TurboQuote.handle_expired_quote("quote-uuid", {
    "action": "void",               # required — "void", "decline" or "renew"
    "reason": "Quote expired",      # required for void/decline, optional for renew
    "newValidUntil": "2026-12-31",  # required — ISO date carried onto the duplicate
})
```

:::warning There is no `extend` or `resend` action
`action` accepts **only** `"void"`, `"decline"` and `"renew"`. `"extend"` and `"resend"` do not exist in the API and return a `400`. Extending is what the endpoint already does — pass `newValidUntil` and it lands on the duplicate it creates.
:::

:::info The replacement draft keeps the original name
Unlike `duplicate_quote`, the draft this endpoint creates is **not** prefixed with `Copy of ` — re-issuing the same deal keeps the original quote's name, so repeated renewals cannot compound into `Copy of Copy of …`. That matters because the next send snapshots the name onto the TurboSign document.
:::

:::note Terminal statuses
`accepted`, `declined`, and `voided` are **terminal** — a quote in one of these states cannot be transitioned out of it, and any further status call returns a `400`. Check `quote["statusInfo"]` before attempting a transition, and use `duplicate_quote` when you need to revive a closed-out quote.
:::

---

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Handles a quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on `action` — and then **creates a duplicate carrying `newValidUntil`** as its new validity date. The returned quote is the new duplicate; the original stays terminal.

`action` (`'void'`, `'decline'` or `'renew'`) and `newValidUntil` (ISO date) are **required**. `reason` (max 190 characters) is required for `'void'` and `'decline'`, and optional for `'renew'` — a renewal closes nothing out, so there is nothing to give a reason for. Use `'renew'` when the quote's signature request has already expired on its own; use `'void'` or `'decline'` when the quote is merely past its `validUntil` and you are closing it yourself.

```php
use TurboDocx\Types\Requests\Quote\HandleExpiredQuoteRequest;

$quote = TurboQuote::handleExpiredQuote('quote-uuid', new HandleExpiredQuoteRequest(
    action: 'void',                                  // required — 'void', 'decline' or 'renew'
    reason: 'Customer requested more time to review', // required for void/decline, optional for renew
    newValidUntil: '2026-12-31',                     // required — ISO date, carried onto the duplicate
));
```

:::warning There is no `extend` or `resend` action
`action` accepts **only** `'void'`, `'decline'` and `'renew'`. `'extend'` and `'resend'` do not exist in the API and return a `400`. Extending is what the endpoint already does — pass `newValidUntil` and it lands on the duplicate it creates.
:::

:::info The replacement draft keeps the original name
Unlike `duplicateQuote`, the draft this endpoint creates is **not** prefixed with `Copy of ` — re-issuing the same deal keeps the original quote's name, so repeated renewals cannot compound into `Copy of Copy of …`. That matters because the next send snapshots the name onto the TurboSign document.
:::

:::note Terminal statuses
`accepted`, `declined`, and `voided` are **terminal** — a quote in one of these states cannot be transitioned out of it, and any further status call returns a `400`. Inspect the `statusInfo` merged onto the `Quote` before attempting a transition, and use `duplicateQuote` when you need to revive a closed-out quote.
:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Handles a `sent` quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on `Action` — and then **creates a duplicate carrying `NewValidUntil`** as its new validity date. The returned quote is the new duplicate; the original stays terminal.

`Action` (`"void"`, `"decline"` or `"renew"`) and `NewValidUntil` (ISO date) are **required**. `Reason` (max 190 characters) is required for `"void"` and `"decline"`, and optional for `"renew"` — a renewal closes nothing out, so there is nothing to give a reason for. Use `"renew"` when the quote's signature request has already expired on its own; use `"void"` or `"decline"` when the quote is merely past its `ValidUntil` and you are closing it yourself.

```go
quote, err := qc.HandleExpiredQuote(ctx, "quote-uuid", &turbodocx.HandleExpiredQuoteRequest{
    Action:        "void",                          // required — "void", "decline" or "renew"
    Reason:        "Customer requested more time",  // required for void/decline, optional for renew
    NewValidUntil: "2026-10-01",                    // required — ISO date, carried onto the duplicate
})
```

:::warning There is no `extend` or `resend` action
`Action` accepts **only** `"void"`, `"decline"` and `"renew"`. `"extend"` and `"resend"` do not exist in the API and return a `400`. Extending is what the endpoint already does — pass `NewValidUntil` and it lands on the duplicate it creates.
:::

:::info The replacement draft keeps the original name
Unlike `DuplicateQuote`, the draft this endpoint creates is **not** prefixed with `Copy of ` — re-issuing the same deal keeps the original quote's name, so repeated renewals cannot compound into `Copy of Copy of …`. That matters because the next send snapshots the name onto the TurboSign document.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
Quote handleExpiredQuote(String id, HandleExpiredQuoteRequest request)
```

Handle a quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on the action — and then **creates a duplicate carrying `newValidUntil`** as its new validity date. The returned `Quote` is the new duplicate; the original stays terminal.

`action` (`"void"`, `"decline"` or `"renew"`) and `newValidUntil` (ISO date) are **required**. `reason` (max 190 characters) is required for `"void"` and `"decline"`, and optional for `"renew"` — a renewal closes nothing out, so there is nothing to give a reason for. Use `"renew"` when the quote's signature request has already expired on its own; use `"void"` or `"decline"` when the quote is merely past its `validUntil` and you are closing it yourself.

```java
HandleExpiredQuoteRequest req = new HandleExpiredQuoteRequest();
req.setAction("void");                    // required — "void", "decline" or "renew"
req.setReason("Expired — re-quoting");    // required for void/decline, optional for renew
req.setNewValidUntil("2026-12-31");       // required — ISO date, carried onto the duplicate

Quote quote = tq.handleExpiredQuote(quoteId, req);
```

:::warning There is no `extend` or `resend` action
`action` accepts **only** `"void"`, `"decline"` and `"renew"`. `"extend"` and `"resend"` do not exist in the API and return a `400`. Extending is what the endpoint already does — set `newValidUntil` and it lands on the duplicate it creates.
:::

:::info The replacement draft keeps the original name
Unlike `duplicateQuote`, the draft this endpoint creates is **not** prefixed with `Copy of ` — re-issuing the same deal keeps the original quote's name, so repeated renewals cannot compound into `Copy of Copy of …`. That matters because the next send snapshots the name onto the TurboSign document.
:::

:::note Terminal statuses
`accepted`, `declined`, and `voided` are **terminal** — a quote in one of these states cannot be transitioned out of it, and any further status call returns a `400`. Check `quote.getStatusInfo()` before attempting a transition, and use `duplicateQuote` when you need to revive a closed-out quote.
:::

---

</TabItem>
</Tabs>

<a id="price-books-on-quotes"></a>

### Price Books (on a Quote) / Price Books on Quotes {#price-books-on-a-quote}

### Line Items {#line-items}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Line items attach products or bundles to a quote, each with a price, quantity, billing frequency, and optional discount.

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Line items belong to a quote. Products are added individually; bundles use a separate endpoint.

</TabItem>
</Tabs>

<a id="list_line_items"></a>

#### `listLineItems` / `list_line_items` / ListLineItems {#listlineitems}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
const { results, totalRecords } = await TurboQuote.listLineItems('quote-uuid', {
  limit: 50,
  billingFrequency: 'monthly',
});
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
page = await TurboQuote.list_line_items("quote-uuid", {"limit": 50})
# page["results"], page["totalRecords"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
use TurboDocx\Types\Requests\Quote\ListLineItemsRequest;

$page = TurboQuote::listLineItems('quote-uuid', new ListLineItemsRequest(
    limit: 50,
));
foreach ($page->results as $item) {
    echo "  {$item->productName}: {$item->unitPrice} x {$item->quantity}\n";
}
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
lineItemType := "product"
list, err := qc.ListLineItems(ctx, "quote-uuid", &turbodocx.ListLineItemsOptions{
    LineItemType: &lineItemType,
})
// list.Results      []LineItem
// list.TotalRecords int
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="add_line_items"></a>

#### `addLineItems` / `add_line_items` / AddLineItems {#addlineitems}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Add one or more product line items. Pass a single object or an array of up to **50** items.

`productId`, `productName`, `unitPrice`, and `billingFrequency` are all **required** on every item. `productId` is special: the key must be **present**, but its value may be `null` for a custom (freeform) line item. Omitting the key entirely returns a `400`. `quantity` is optional and defaults to `1`.

```typescript
// Single item
await TurboQuote.addLineItems('quote-uuid', {
  productId: 'product-uuid',       // required key — pass null for a custom (freeform) line item
  productName: 'Professional Services',
  unitPrice: 150,
  billingFrequency: 'one-time',
  quantity: 8,
  discountPercent: 10,
  discountType: 'percent',
});

// Multiple items at once — array is capped at 50 items
await TurboQuote.addLineItems('quote-uuid', [
  { productId: 'p1', productName: 'Licence A', unitPrice: 500, billingFrequency: 'annual' },
  { productId: 'p2', productName: 'Licence B', unitPrice: 300, billingFrequency: 'annual' },
  { productId: null, productName: 'Custom Discount Credit', unitPrice: -100, billingFrequency: 'one-time' },
]);
```

:::note Array caps
`addLineItems` accepts a single object **or** an array of 1–**50** items. A reorder request accepts up to **200** items. Exceeding either cap returns a `400`.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Accepts one or more `AddLineItemRequest` values (variadic), up to **50** per call. Returns `[]LineItem`.

`ProductID`, `ProductName`, `UnitPrice`, and `BillingFrequency` are all **required** on every item. `ProductID` is a `*string`: the `productId` key must be **present** on the wire, but its value may be `null` — set it to `nil` for a custom (freeform) line item. `Quantity` is optional and defaults to `1`.

```go
qty := 3
disc := 10.0
productID := "product-uuid"
items, err := qc.AddLineItems(ctx, "quote-uuid",
    turbodocx.AddLineItemRequest{
        ProductID:        &productID, // required — nil sends productId: null (custom line item)
        ProductName:      "Support Plan",
        UnitPrice:        200.00,
        BillingFrequency: "monthly",
        Quantity:         &qty,
        DiscountPercent:  &disc,
    },
    turbodocx.AddLineItemRequest{
        ProductID:        nil, // custom (freeform) line item
        ProductName:      "Implementation Credit",
        UnitPrice:        -250.00,
        BillingFrequency: "one-time",
    },
)
```

:::note Slice caps
`AddLineItems` accepts 1–**50** items per call. A reorder request accepts up to **200** items. Exceeding either cap returns a `400`.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="add_bundle_line_items"></a>

#### `addBundleLineItems` / `add_bundle_line_items` / AddBundleLineItems {#addbundlelineitems}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Add one or more bundle line items.

```typescript
await TurboQuote.addBundleLineItems('quote-uuid', {
  bundleId: 'bundle-uuid',
  bundleName: 'Starter Bundle',
  quantity: 2,
  showItemsToEndUser: true,
});
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
items, err := qc.AddBundleLineItems(ctx, "quote-uuid",
    turbodocx.AddBundleLineItemRequest{
        BundleID:   "bundle-uuid",
        BundleName: "Starter Bundle",
    },
)
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="update_line_item"></a>

#### `updateLineItem` / `update_line_item` / UpdateLineItem {#updatelineitem}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Update a single line item's price, quantity, discount, or billing frequency.

```typescript
const updated = await TurboQuote.updateLineItem('quote-uuid', 'item-uuid', {
  quantity: 12,
  discountPercent: 15,
  billingFrequency: 'monthly',
});
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
item = await TurboQuote.update_line_item("quote-uuid", "item-uuid", {
    "quantity": 5,
    "unitPrice": "179.00",
})
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
use TurboDocx\Types\Requests\Quote\UpdateLineItemRequest;

$item = TurboQuote::updateLineItem('quote-uuid', 'item-uuid', new UpdateLineItemRequest(
    quantity: 3,
    unitPrice: 189.00,
));
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

PATCH semantics. Use `Clear*` helpers for explicit nulls: `ClearCost`, `ClearCategoryID`, `ClearCategoryName`, `ClearProductSku`, `ClearProductDescription`, `ClearDisplayOrder`.

```go
newPrice := 180.00
item, err := qc.UpdateLineItem(ctx, "quote-uuid", "item-uuid", &turbodocx.UpdateLineItemRequest{
    UnitPrice: &newPrice,
})
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="remove_line_item"></a>

#### `removeLineItem` / `remove_line_item` / RemoveLineItem {#removelineitem}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Remove a line item from a quote.

```typescript
const { message } = await TurboQuote.removeLineItem('quote-uuid', 'item-uuid');
```

---

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
result = await TurboQuote.remove_line_item("quote-uuid", "item-uuid")
# result["message"]
```

---

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$result = TurboQuote::removeLineItem('quote-uuid', 'item-uuid');
echo $result->message;
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
result, err := qc.RemoveLineItem(ctx, "quote-uuid", "item-uuid")
```

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
SuccessResponse removeLineItem(String quoteId, String itemId)
```

Remove a line item from a quote.

```java
tq.removeLineItem(quoteId, itemId);
```

---

</TabItem>
</Tabs>

### Products {#products}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

The product catalog powers line item selection in quotes.

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

#### ListProducts {#listproducts}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
list, err := qc.ListProducts(ctx, &turbodocx.ListProductsOptions{
    Query: &[]string{"license"}[0],
})
// list.Results        []Product
// list.TotalProducts  int
// list.CatalogValue   float64
```

</TabItem>
</Tabs>

#### CreateProduct {#createproduct}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
price := 99.99
product, err := qc.CreateProduct(ctx, &turbodocx.CreateProductRequest{
    Name:             "Starter License",
    ListPrice:        price,
    BillingFrequency: "monthly",
    CategoryID:       "category-uuid",
})
```

For products with images, set `Images []ProductImageInput` (supports `FilePath` or `Data` bytes) — the SDK automatically uses multipart upload:

```go
product, err := qc.CreateProduct(ctx, &turbodocx.CreateProductRequest{
    Name:             "Starter License",
    ListPrice:        99.99,
    BillingFrequency: "monthly",
    CategoryID:       "category-uuid",
    Images: []turbodocx.ProductImageInput{
        {FilePath: "/path/to/logo.png"},
    },
})
```

</TabItem>
</Tabs>

#### GetProduct / DeleteProduct / DuplicateProduct {#getproduct--deleteproduct--duplicateproduct}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
product, err := qc.GetProduct(ctx, "product-uuid")
result,  err := qc.DeleteProduct(ctx, "product-uuid")
copy,    err := qc.DuplicateProduct(ctx, "product-uuid")
```

</TabItem>
</Tabs>

#### UpdateProduct {#updateproduct}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

PATCH semantics with `Clear*` helpers: `ClearCost`, `ClearSku`, `ClearDescription`, `ClearDetailedSpecification`, `ClearInternalNotes`. Supports image uploads via `Images`.

```go
newPrice := 109.99
product, err := qc.UpdateProduct(ctx, "product-uuid", &turbodocx.UpdateProductRequest{
    ListPrice: &newPrice,
})
```

</TabItem>
</Tabs>

#### GetProductPrimaryImages {#getproductprimaryimages}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Returns a `ProductPrimaryImagesResponse` (`map[string]*ProductImage`) keyed by product ID.

```go
images, err := qc.GetProductPrimaryImages(ctx, []string{"product-uuid-1", "product-uuid-2"})
if img, ok := images["product-uuid-1"]; ok && img != nil {
    fmt.Println(img.FileName)
}
```

---

</TabItem>
</Tabs>

### Bundles {#bundles}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Bundles group products into a single sellable unit.

<Tabs>
<TabItem value="crud" label="CRUD">

```go
// Create
bundle, err := qc.CreateBundle(ctx, &turbodocx.CreateBundleRequest{
    Name:       "Starter Pack",
    CategoryID: "category-uuid",
    Items: []turbodocx.BundleItemInput{
        {
            ProductID:        "product-uuid",
            UnitPrice:        100.00,
            BillingFrequency: "monthly",
        },
    },
})

// Get
bundle, err = qc.GetBundle(ctx, "bundle-uuid")

// Update
bundle, err = qc.UpdateBundle(ctx, "bundle-uuid", &turbodocx.UpdateBundleRequest{
    Name: &[]string{"Updated Pack"}[0],
})

// Delete
result, err := qc.DeleteBundle(ctx, "bundle-uuid")

// Duplicate
copy, err := qc.DuplicateBundle(ctx, "bundle-uuid")
```

</TabItem>
<TabItem value="list" label="List">

```go
list, err := qc.ListBundles(ctx, &turbodocx.ListBundlesOptions{
    ShowInCatalog: &[]bool{true}[0],
})
// list.Results      []Bundle
// list.TotalBundles int
// list.CatalogValue float64
```

</TabItem>
</Tabs>

`UpdateBundle` has `Clear*` helpers for nullable fields: `ClearDescription`, `ClearSku`, `ClearCategoryID`.

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### Price Books {#price-books}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Price books apply per-product discounts or fixed prices to quotes in bulk.

<Tabs>
<TabItem value="crud" label="CRUD">

```go
validFrom := "2026-01-01"
discountPercent := 15.0
priceBook, err := qc.CreatePriceBook(ctx, &turbodocx.CreatePriceBookRequest{
    Name:            "Partner Pricing",
    PriceBookTypeID: "type-uuid",
    ValidFrom:       validFrom,
    DiscountPercent: &discountPercent,
    ProductPricing: []turbodocx.PriceBookProductPricingInput{
        {
            ProductID:       "product-uuid",
            DiscountPercent: &[]float64{15.0}[0],
        },
    },
})

priceBook, err = qc.GetPriceBook(ctx, "pricebook-uuid")
priceBook, err = qc.UpdatePriceBook(ctx, "pricebook-uuid", &turbodocx.UpdatePriceBookRequest{
    Name: &[]string{"Updated Partner Pricing"}[0],
})
result, err := qc.DeletePriceBook(ctx, "pricebook-uuid")
copy,   err := qc.DuplicatePriceBook(ctx, "pricebook-uuid")
```

</TabItem>
<TabItem value="list" label="List + Products">

```go
// List price books
list, err := qc.ListPriceBooks(ctx, &turbodocx.ListPriceBooksOptions{
    ShowInQuoteBuilder: &[]bool{true}[0],
})
// list.Results          []PriceBook
// list.DefaultPriceBookName *string

// List products within a price book
products, err := qc.ListPriceBookProducts(ctx, "pricebook-uuid", &turbodocx.ListPriceBookProductsOptions{
    Limit: &[]int{20}[0],
})
// products.Results []PriceBookProductPricing — each entry has DiscountPercent + FinalPrice
```

</TabItem>
</Tabs>

`UpdatePriceBook` has `Clear*` helpers: `ClearDescription`, `ClearValidTo`.

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### Companies {#companies}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Companies are organizations you send quotes to. Each company must have at least one contact.

<Tabs>
<TabItem value="crud" label="CRUD">

```go
phone := "+1-555-0100"
company, err := qc.CreateCompany(ctx, &turbodocx.CreateCompanyRequest{
    Name:  "Acme Corporation",
    Phone: &phone,
    Contacts: []turbodocx.CreateCompanyContactInput{
        {Name: "Jane Smith", Email: "jane@acmecorp.com"},
    },
})

company, err = qc.GetCompany(ctx, "company-uuid")
company, err = qc.UpdateCompany(ctx, "company-uuid", &turbodocx.UpdateCompanyRequest{
    Name: &[]string{"Acme Corp (Updated)"}[0],
})
result, err := qc.DeleteCompany(ctx, "company-uuid")
```

</TabItem>
<TabItem value="list" label="List + Contacts">

```go
// List companies
list, err := qc.ListCompanies(ctx, &turbodocx.ListCompaniesOptions{
    Query: &[]string{"acme"}[0],
})

// List contacts under a company
contacts, err := qc.ListCompanyContacts(ctx, "company-uuid", &turbodocx.PaginationParams{
    Limit: &[]int{10}[0],
})
// contacts.Results []Contact
```

</TabItem>
</Tabs>

`UpdateCompany` has `Clear*` helpers: `ClearPhone`, `ClearCity`, `ClearState`, `ClearCountry`, `ClearIndustryID`.

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### Contacts {#contacts}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Contacts are individuals at a company. A quote is addressed to a specific contact.

```go
// Create
contact, err := qc.CreateContact(ctx, &turbodocx.CreateContactRequest{
    Name:      "Jane Smith",
    CompanyID: "company-uuid",
    Email:     &[]string{"jane@acmecorp.com"}[0],
})

// Update
contact, err = qc.UpdateContact(ctx, "contact-uuid", &turbodocx.UpdateContactRequest{
    Name: &[]string{"Jane M. Smith"}[0],
})

// Delete
result, err := qc.DeleteContact(ctx, "contact-uuid")

// List (with optional companyId filter)
list, err := qc.ListContacts(ctx, &turbodocx.ListContactsOptions{
    CompanyID: &[]string{"company-uuid"}[0],
})
```

:::note No GetContact
There is no `GetContact(id)` — the backend has no `GET /v1/contacts/:id` endpoint. Use `ListContacts` with a `CompanyID` filter to find contacts for a company, or use `ListCompanyContacts`.
:::

`UpdateContact` has `Clear*` helpers: `ClearEmail`, `ClearPhone`, `ClearTitle`.

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### Quote Templates {#quote-templates}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Quote templates control the visual presentation of the sent quote (logo, brand colours, disclaimer, terms, sender info). There is one active template per org, accessible via `getTemplate()`. You can also manage named templates.

:::note Singleton vs. list
`getTemplate()` returns the org's single active template via `GET /v1/quote-template` (singular path). `listTemplates()` returns all named templates via `GET /v1/quote-templates` (plural path).
:::

:::warning Templates are auto-provisioned — use getTemplate() → updateTemplate()
`getTemplate()` **self-heals**: if the org has no template, the API creates one from your org branding and returns it. Every established org therefore already has a template, which means:

- `createTemplate()` returns **400 `TEMPLATE_ALREADY_EXISTS`** and is effectively unreachable. Do not build a get-then-create flow.
- `deleteTemplate()` is really "reset to org branding defaults" — it soft-deletes, and the next `getTemplate()` regenerates a fresh one.

The correct flow is **`getTemplate()` → `updateTemplate(tmpl.id, …)`**.
:::

| Method | Signature | Returns |
|---|---|---|
| `getTemplate` | `() → QuoteTemplate` | Active org template (auto-created if none exists) |
| `listTemplates` | `(opts?) → QuoteTemplateListResponse` | All named templates |
| `getTemplateById` | `(id) → QuoteTemplate` | Named template by ID |
| `createTemplate` | `(req) → QuoteTemplate` | Created template — `400` if one already exists |
| `updateTemplate` | `(id, req) → QuoteTemplate` | Updated template |
| `deleteTemplate` | `(id) → SuccessResponse` | Resets to org branding defaults |

```typescript
// 1. Fetch the active template — created from org branding on first read
const tmpl = await TurboQuote.getTemplate();
console.log(tmpl.primaryColor);  // e.g. "#1a73e8"

// 2. Brand it by updating the template you just fetched
const branded = await TurboQuote.updateTemplate(tmpl.id, {
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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Quote templates control the branding and layout of sent quote emails and the customer-facing quote page (logo, colors, footer text, terms, sender info).

:::warning Templates are auto-provisioned — use GetTemplate → UpdateTemplate
`GetTemplate` **self-heals**: if the org has no template, the API creates one from your org branding and returns it. Every established org therefore already has a template, which means:

- `CreateTemplate` returns **400 `TEMPLATE_ALREADY_EXISTS`** and is effectively unreachable. Do not build a get-then-create flow.
- `DeleteTemplate` is really "reset to org branding defaults" — it soft-deletes, and the next `GetTemplate` regenerates a fresh one.

The correct flow is **`GetTemplate` → `UpdateTemplate`**.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

#### GetTemplate {#gettemplate}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Returns the active (default) quote template for the org, creating one from org branding if none exists. Use this for the most common case.

```go
tmpl, err := qc.GetTemplate(ctx)
fmt.Printf("Primary color: %s\n", tmpl.PrimaryColor)
```

</TabItem>
</Tabs>

#### GetTemplateByID {#gettemplatebyid}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Retrieves a specific template by ID when you have multiple templates.

```go
tmpl, err := qc.GetTemplateByID(ctx, "template-uuid")
```

</TabItem>
</Tabs>

#### ListTemplates / UpdateTemplate / DeleteTemplate {#listtemplates--updatetemplate--deletetemplate}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Brand the org's template by fetching it and updating it in place — never by creating one.

```go
list, err := qc.ListTemplates(ctx, &turbodocx.PaginationParams{
    Limit: &[]int{5}[0],
})

// Get the auto-provisioned template, then update it.
tmpl, err := qc.GetTemplate(ctx)

logoURL := "https://cdn.example.com/logo.png"
tmpl, err = qc.UpdateTemplate(ctx, tmpl.ID, &turbodocx.UpdateQuoteTemplateRequest{
    LogoURL:      &logoURL,
    PrimaryColor: &[]string{"#0066CC"}[0],
    SenderName:   &[]string{"Sales Team"}[0],
})

// DeleteTemplate resets the org back to its branding defaults —
// the next GetTemplate call regenerates a fresh template.
result, err := qc.DeleteTemplate(ctx, tmpl.ID)
```

`UpdateQuoteTemplateRequest` has `Clear*` helpers: `ClearLogoURL`, `ClearDisclaimer`, `ClearTermsAndConditions`, `ClearClosingMessage`, `ClearSenderName`, `ClearSenderPhone`, `ClearContactEmail`.

---

</TabItem>
</Tabs>

<a id="types--categories"></a>

### Types (Categories) / Types / Categories {#types-categories}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

| Method | Signature | Returns |
|---|---|---|
| `listTypes` | `(?ListTypesRequest)` | `QuoteTypeListResponse` |
| `createType` | `(CreateQuoteTypeRequest)` | `QuoteType` |
| `updateType` | `(string $id, UpdateQuoteTypeRequest)` | `QuoteType` |
| `deleteType` | `(string $id)` | `MessageResponse` |

:::note No getType
There is no `getType($id)` — the backend does not expose a `GET /v1/types/:id` endpoint. Use `listTypes` instead.
:::

`CreateQuoteTypeRequest` requires **both** `name` and `categoryType` — there is no default. `categoryType` is one of `product_category`, `pricebook_type`, `company_industry`, or `bundle_category`.

```php
use TurboDocx\Types\Requests\Quote\CreateQuoteTypeRequest;

$type = TurboQuote::createType(new CreateQuoteTypeRequest(
    name: 'Renewal',
    categoryType: 'product_category',
));
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Types are shared category records used by products, bundles, price books, and companies. A single `CategoryType` field distinguishes their role.

| `CategoryType` | Used for |
|---|---|
| `product_category` | Product and line item categories |
| `pricebook_type` | Price book type classification |
| `company_industry` | Company industry tags |
| `bundle_category` | Bundle categories |

```go
catType := turbodocx.CategoryTypeProductCategory
qType, err := qc.CreateType(ctx, &turbodocx.CreateQuoteTypeRequest{
    Name:         "Software",
    CategoryType: catType,
})

qType, err = qc.UpdateType(ctx, "type-uuid", &turbodocx.UpdateQuoteTypeRequest{
    Name: &[]string{"Software & SaaS"}[0],
})

result, err := qc.DeleteType(ctx, "type-uuid")

// List with usage info
includeUsage := true
list, err := qc.ListTypes(ctx, &turbodocx.ListTypesOptions{
    CategoryType: &[]string{"product_category"}[0],
    IncludeUsage: &includeUsage,
})
// list.Results[i].Usage.UsageCount int
```

:::note No GetType
There is no `GetType(id)` — the backend has no `GET /v1/types/:id` endpoint. Use `ListTypes` with a `CategoryType` filter.
:::

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### Bulk Imports {#bulk-imports}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Every create-family entity has a matching `bulkCreate*` method for seeding a catalog or migrating CRM data in one call. Each method sends `POST {resource}/bulk` with an array of rows using the **same shape as that entity's single-create request** (e.g. `bulkCreateProducts` takes `CreateProductRequest[]`). Company rows require a `contacts` array with at least one contact; contact rows require a `companyId`.

Rows process sequentially with **partial success** — a failed row does not throw and does not roll back earlier rows. Every bulk method resolves to a `BulkImportResult`:

- `imported` — count of rows created
- `failed` — array of `{ row, reason }` for rows that did not import; `row` is the **1-indexed** position in your request array
- `adjusted` — array of `{ row, reason }` for rows that imported *with* a server-side adjustment (e.g. a bundle item whose product wasn't found was dropped)

Requests are capped at **500 rows** — anything above the cap returns a `400`. Available to admin and contributor API keys.

:::caution Product rows require a real `categoryId`
Every `bulkCreateProducts` row **requires** `name`, `categoryId`, `listPrice`, and `billingFrequency`. `categoryId` must be the **UUID** of an existing type (`categoryType: 'product_category'`) — there is no `categoryName` field on the bulk row, and the API rejects unknown keys, so passing one returns a `400`. Resolve or create the category first with `listTypes` / `createType`, then pass its `id`.
:::

```typescript
// 1. Resolve the product category first — bulk rows need its UUID, not its name.
const { results: categories } = await TurboQuote.listTypes({ categoryType: 'product_category' });
const category =
  categories.find((t) => t.name === 'Software') ??
  (await TurboQuote.createType({ name: 'Software', categoryType: 'product_category' }));

// 2. Import, passing the resolved UUID on every row.
const result = await TurboQuote.bulkCreateProducts([
  { name: 'Enterprise Licence', categoryId: category.id, listPrice: 1200, billingFrequency: 'annual' },
  { name: 'Onboarding Package', categoryId: category.id, listPrice: 499, billingFrequency: 'one-time' },
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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Every create-family entity has a matching `BulkCreate*` method for seeding a catalog or migrating CRM data in one call. Each method sends `POST {resource}/bulk` with a slice of rows using the **same request type as that entity's single-create method** (e.g. `BulkCreateProducts` takes `[]CreateProductRequest`). Company rows require a `Contacts` slice with at least one contact; contact rows require a `CompanyID`.

Rows process sequentially with **partial success** — a failed row does not produce an error and does not roll back earlier rows. Every bulk method returns `*BulkImportResult`:

- `Imported` — count of rows created
- `Failed` — `[]BulkImportRowIssue` (`Row` + `Reason`) for rows that did not import; `Row` is the **1-indexed** position in your request slice
- `Adjusted` — `[]BulkImportRowIssue` for rows that imported *with* a server-side adjustment (e.g. a bundle item whose product wasn't found was dropped)

Requests are capped at **500 rows** — anything above the cap returns a `400`. Available to admin and contributor API keys.

:::caution Product rows require a real CategoryID
Every `BulkCreateProducts` row **requires** `Name`, `CategoryID`, `ListPrice`, and `BillingFrequency`. `CategoryID` must be the **UUID** of an existing type (`CategoryType: "product_category"`) — there is no `CategoryName` field on the bulk row schema, and the API rejects unknown keys, so sending one returns a `400`. Resolve or create the category first with `ListTypes` / `CreateType`, then pass its `ID`.
:::

```go
// 1. Resolve the product category first — bulk rows need its UUID, not its name.
types, err := qc.ListTypes(ctx, &turbodocx.ListTypesOptions{
    CategoryType: &[]string{"product_category"}[0],
})
if err != nil {
    log.Fatal(err)
}

var categoryID string
for _, t := range types.Results {
    if t.Name == "Software" {
        categoryID = t.ID
        break
    }
}
if categoryID == "" {
    created, err := qc.CreateType(ctx, &turbodocx.CreateQuoteTypeRequest{
        Name:         "Software",
        CategoryType: turbodocx.CategoryTypeProductCategory,
    })
    if err != nil {
        log.Fatal(err)
    }
    categoryID = created.ID
}

// 2. Import, passing the resolved UUID on every row.
result, err := qc.BulkCreateProducts(ctx, []turbodocx.CreateProductRequest{
    {
        Name:             "Enterprise License",
        CategoryID:       categoryID,
        ListPrice:        1200.00,
        BillingFrequency: "annual",
    },
    {
        Name:             "Onboarding Package",
        CategoryID:       categoryID,
        ListPrice:        499.00,
        BillingFrequency: "one-time",
    },
})
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Imported %d of 2 rows\n", result.Imported)
for _, failure := range result.Failed {
    fmt.Printf("Row %d failed: %s\n", failure.Row, failure.Reason)
}
for _, adjustment := range result.Adjusted {
    fmt.Printf("Row %d imported with adjustment: %s\n", adjustment.Row, adjustment.Reason)
}
```

The other five bulk methods follow the exact same pattern — `(ctx, rows)` in, `(*BulkImportResult, error)` out:

| Method | Rows |
|---|---|
| `BulkCreatePriceBooks` | `[]CreatePriceBookRequest` |
| `BulkCreateBundles` | `[]CreateBundleRequest` |
| `BulkCreateCompanies` | `[]CreateCompanyRequest` — each row needs `Contacts` (min. 1) |
| `BulkCreateContacts` | `[]CreateContactRequest` — each row needs `CompanyID` |
| `BulkCreateTypes` | `[]CreateQuoteTypeRequest` |

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Every create-family entity has a matching `bulkCreate*` method for seeding a catalog or migrating CRM data in one call. Each method sends `POST {resource}/bulk` with a list of the **same request objects as that entity's single-create method** (e.g. `bulkCreateProducts` takes `List<CreateProductRequest>`). Company rows require a `contacts` list with at least one contact; contact rows require a `companyId`.

Rows process sequentially with **partial success** — a failed row does not throw and does not roll back earlier rows. Every bulk method returns a `BulkImportResult`:

- `getImported()` — count of rows created
- `getFailed()` — list of `BulkImportRowIssue` (`getRow()` + `getReason()`) for rows that did not import; the row number is the **1-indexed** position in your request list
- `getAdjusted()` — list of `BulkImportRowIssue` for rows that imported *with* a server-side adjustment (e.g. a bundle item whose product wasn't found was dropped)

Requests are capped at **500 rows** — anything above the cap returns a `400`. Available to admin and contributor API keys.

</TabItem>
</Tabs>

#### `bulkCreateProducts` {#bulkcreateproducts}

<Tabs groupId="language" queryString>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

## Enums and Constants {#enums-and-constants}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

| Type | Values |
|---|---|
| `QuoteStatus` | `draft`, `pending_approval`, `sent`, `accepted`, `declined`, `voided` |
| `BillingFrequency` | `monthly`, `quarterly`, `annual`, `one-time` |
| `LineItemType` | `product`, `bundle` |
| `RenewalPeriod` | `weekly`, `monthly`, `quarterly`, `annually` |
| `Currency` | `USD`, `EUR`, `GBP`, `CAD`, `AUD`, `INR` |
| `CategoryType` | `product_category`, `pricebook_type`, `company_industry`, `bundle_category` |
| `BundleItemStatus` | `active`, `product_deleted`, `product_unavailable`, `currency_mismatch` |
| `DiscountType` | `percent`, `amount` |

:::note Terminal statuses
`accepted`, `declined`, and `voided` are **terminal** — a quote in one of these states cannot be transitioned out of it, and any further status call returns a `400`. Check `quote.StatusInfo.IsTerminal` (and the `Can*` flags) before attempting a transition, and use `DuplicateQuote` when you need to revive a closed-out quote.
:::

---

</TabItem>
</Tabs>

## Null-Clear Semantics (PATCH) {#null-clear-semantics-patch}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Go's zero value is indistinguishable from "not set" at the JSON level, so `UpdateQuoteRequest` and related PATCH request types use a private `nullFields` map to track fields the caller explicitly wants to set to `null`. Call the `Clear*` method on the request before passing it:

```go
req := &turbodocx.UpdateQuoteRequest{}
req.ClearTaxRate()          // sends "taxRate": null  (removes tax from quote)
req.ClearRenewalPeriod()    // sends "renewalPeriod": null
// Name left unset — omitted from payload entirely
quote, err := qc.UpdateQuote(ctx, "quote-uuid", req)
```

Types with `Clear*` helpers:

| Type | Clearable fields |
|---|---|
| `UpdateQuoteRequest` | `PriceBookID`, `ValidUntil`, `TaxRate`, `RenewalPeriod` |
| `UpdateLineItemRequest` | `Cost`, `CategoryID`, `CategoryName`, `ProductSku`, `ProductDescription`, `DisplayOrder` |
| `UpdateProductRequest` | `Cost`, `Sku`, `Description`, `DetailedSpecification`, `InternalNotes` |
| `UpdatePriceBookRequest` | `Description`, `ValidTo` |
| `UpdateBundleRequest` | `Description`, `Sku`, `CategoryID` |
| `UpdateCompanyRequest` | `Phone`, `City`, `State`, `Country`, `IndustryID` |
| `UpdateContactRequest` | `Email`, `Phone`, `Title` |
| `UpdateQuoteTemplateRequest` | `LogoURL`, `Disclaimer`, `TermsAndConditions`, `ClosingMessage`, `SenderName`, `SenderPhone`, `ContactEmail` |

---

</TabItem>
</Tabs>

<a id="convenience-method"></a>

### Convenience / Convenience Method {#convenience}

<a id="createandsend"></a>

#### `create_and_send` / `createAndSend` {#create_and_send}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

## TypeScript Types {#typescript-types}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
</Tabs>

### Key Enum Values {#key-enum-values}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

| Type | Values |
|---|---|
| `QuoteStatus` | `'draft'` `'pending_approval'` `'sent'` `'accepted'` `'declined'` `'voided'` |
| `BillingFrequency` | `'monthly'` `'quarterly'` `'annual'` `'one-time'` |
| `Currency` | `'USD'` `'EUR'` `'GBP'` `'CAD'` `'AUD'` `'INR'` |
| `RenewalPeriod` | `'weekly'` `'monthly'` `'quarterly'` `'annually'` |
| `DiscountType` | `'percent'` `'amount'` |
| `CategoryType` | `'product_category'` `'pricebook_type'` `'company_industry'` `'bundle_category'` |

:::note Terminal statuses
`accepted`, `declined`, and `voided` are **terminal** — a quote in one of these states cannot be transitioned out of it, and any further status call returns a `400`. Check `quote.statusInfo` (`canSend`, `canAccept`, `canDecline`, `canVoid`) before attempting a transition, and `duplicateQuote` when you need to revive a closed-out quote.
:::

---

</TabItem>
</Tabs>

## Error Handling {#error-handling}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
import "errors"

_, err := qc.CreateQuote(ctx, req)
if err != nil {
    var valErr  *turbodocx.ValidationError
    var auth    *turbodocx.AuthenticationError
    var authz   *turbodocx.AuthorizationError
    var nf      *turbodocx.NotFoundError
    var rate    *turbodocx.RateLimitError
    var netErr  *turbodocx.NetworkError
    var tdx     *turbodocx.TurboDocxError

    switch {
    case errors.As(err, &valErr):
        // 400 — invalid request body (missing required field, bad enum value, etc.)
        log.Printf("Validation: %s", valErr.Message)
    case errors.As(err, &auth):
        // 401 — missing or invalid API key
    case errors.As(err, &authz):
        // 403 — key valid but lacks required permissions
    case errors.As(err, &nf):
        // 404 — quote, product, bundle, etc. not found
    case errors.As(err, &rate):
        // 429 — back off and retry
    case errors.As(err, &netErr):
        // request never reached the server
    case errors.As(err, &tdx):
        log.Printf("API error %d: %s", tdx.StatusCode, tdx.Message)
    default:
        log.Fatal(err)
    }
}
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="error-code-reference"></a>
<a id="error-types"></a>

### Common Error Codes / Error Code Reference / Error Types {#common-error-codes}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

| Status | Class | When |
|---|---|---|
| 400 | `ValidationError` | Invalid request body, wrong quote status for transition |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without permission for this resource |
| 404 | `NotFoundError` | Quote, company, product, or contact not found |
| 429 | `RateLimitError` | Rate limit exceeded — back off and retry |

---

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

| Status | Class | When |
|---|---|---|
| 400 | `ValidationError` | Invalid fields, missing required keys, bad enum value |
| 401 | `AuthenticationError` | Missing or invalid API key |
| 403 | `AuthorizationError` | Valid key without permission for this operation |
| 404 | `NotFoundError` | Quote, product, company, or other resource not found |
| 409 | `ConflictError` | Duplicate resource (e.g., company domain conflict) |
| 429 | `RateLimitError` | Rate limit exceeded — back off |

---

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

| Status | Exception | When |
|---|---|---|
| 400 | `ValidationException` | Missing required fields, invalid enum value, malformed body |
| 401 | `AuthenticationException` | Missing or invalid API key |
| 403 | `AuthorizationException` | Valid key without sufficient permissions |
| 404 | `NotFoundException` | Quote, product, company, etc. does not exist |
| 409 | `TurboDocxException` | Conflict (e.g., duplicate SKU) |
| 429 | `RateLimitException` | Rate limit exceeded — back off |

---

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

| Status | Type | When |
|---|---|---|
| 400 | `*ValidationError` | Bad request body, missing required field, invalid enum |
| 401 | `*AuthenticationError` | Missing or invalid API key |
| 403 | `*AuthorizationError` | Key valid but lacks required permissions |
| 404 | `*NotFoundError` | Quote, product, bundle, company, etc. not found |
| 429 | `*RateLimitError` | Rate limit exceeded |
| — | `*NetworkError` | DNS failure, refused connection, timeout |

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

| Status | Type | When |
|---|---|---|
| 400 | `TurboDocxException.ValidationException` | Invalid request body, missing required field |
| 401 | `TurboDocxException.AuthenticationException` | Missing or invalid API key |
| 403 | `TurboDocxException.AuthorizationException` | Valid key without required role |
| 404 | `TurboDocxException.NotFoundException` | Quote, product, company, contact, etc. not found |
| 429 | `TurboDocxException.RateLimitException` | Rate limit exceeded — back off and retry |

</TabItem>
</Tabs>

<a id="runnable-end-to-end-examples"></a>

## Runnable Examples / Runnable End-to-End Examples {#runnable-examples}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Three fully runnable examples live in the SDK repo:

- **[`TurboQuoteBasic.java`](https://github.com/TurboDocx/SDK/blob/main/packages/java-sdk/examples/TurboQuoteBasic.java)** — full quote lifecycle: create company, create quote, add line items, send, download PDF, clean up.
- **[`TurboQuoteProducts.java`](https://github.com/TurboDocx/SDK/blob/main/packages/java-sdk/examples/TurboQuoteProducts.java)** — product and bundle catalog management.
- **[`TurboQuotePricebooks.java`](https://github.com/TurboDocx/SDK/blob/main/packages/java-sdk/examples/TurboQuotePricebooks.java)** — price book CRUD, `applyPriceBook`, and optional `sendQuoteWithDeliverable` (set `TURBODOCX_DELIVERABLE_ID` env var).

Run any example after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`.

</TabItem>
</Tabs>

## See Also {#see-also}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

- [TurboSign JavaScript SDK](/docs/SDKs/javascript) — send documents for e-signature
- [TurboWebhooks JavaScript SDK](/docs/SDKs/webhooks?language=js) — receive real-time signature events
- [Deliverable JavaScript SDK](/docs/SDKs/deliverable?language=js) — generate documents from templates
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [@turbodocx/sdk on npm](https://www.npmjs.com/package/@turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

- [TurboQuote JavaScript / TypeScript SDK](/docs/SDKs/quote?language=js) — same API, JS idioms
- [TurboSign Python SDK](/docs/SDKs/python) — send documents for e-signature
- [TurboWebhooks Python SDK](/docs/SDKs/webhooks?language=python) — receive real-time signature events
- [Deliverable Python SDK](/docs/SDKs/deliverable?language=python) — generate documents from templates
- [SDKs Overview](/docs/SDKs) — all SDKs across all languages
- [turbodocx-sdk on PyPI](https://pypi.org/project/turbodocx-sdk/)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

- [TurboQuote Python SDK](/docs/SDKs/quote?language=python) — same surface in Python
- [TurboSign PHP SDK](/docs/SDKs/php) — sending documents for signature from PHP
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks?language=php) — receiving signature events in PHP
- [Deliverable PHP SDK](/docs/SDKs/deliverable?language=php) — document generation from PHP
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [TurboDocx SDK on Packagist](https://packagist.org/packages/turbodocx/sdk)
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

- [TurboQuote JavaScript / TypeScript SDK](/docs/SDKs/quote?language=js) — same API, JS/TS idioms
- [TurboQuote Python SDK](/docs/SDKs/quote?language=python) — same API, Python idioms
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [TurboSign Go SDK](/docs/SDKs/go) — sending documents for e-signature
- [Deliverable Go SDK](/docs/SDKs/deliverable?language=go) — generating documents from templates
- [TurboWebhooks Go SDK](/docs/SDKs/webhooks?language=go) — real-time event delivery
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

- [TurboQuote JavaScript / TypeScript SDK](/docs/SDKs/quote?language=js) — same API, JS idioms
- [TurboQuote Python SDK](/docs/SDKs/quote?language=python) — same API, Python idioms
- [TurboQuote PHP SDK](/docs/SDKs/quote?language=php) — same API, PHP idioms
- [TurboSign Java SDK](/docs/SDKs/java) — sending documents for e-signature
- [TurboWebhooks Java SDK](/docs/SDKs/webhooks?language=java) — receiving signature events
- [SDKs Overview](/docs/SDKs) — all SDKs across all languages
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)

</TabItem>
</Tabs>
