---
title: TurboQuote Go SDK
sidebar_position: 22
sidebar_label: "TurboQuote: Go"
description: Official TurboDocx TurboQuote SDK for Go. Create and send quotes, manage line items, products, bundles, price books, companies, contacts, and quote templates programmatically with idiomatic Go and full context support.
keywords:
  - turboquote go
  - turboquote sdk golang
  - quote go
  - cpq go
  - proposal go
  - quote api go
  - turbodocx quote go
  - cpq sdk golang
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboQuote Go SDK

<QuickstartSkillNudge command="/turbodocx-sdk turboquote" product="TurboQuote" />

The official TurboDocx TurboQuote SDK for Go applications. Create quotes, attach line items and bundles, send proposals to customers, download PDFs, and manage your full product catalog — products, bundles, price books, companies, contacts, and quote templates — all with idiomatic Go patterns, context support, and typed errors. Available as `github.com/TurboDocx/SDK/packages/go-sdk`.

<br />

:::info What is TurboQuote?
TurboQuote is TurboDocx's CPQ (Configure, Price, Quote) module. It lets your application generate professional, branded quote documents and send them to customers for acceptance or rejection, with full lifecycle management (draft, sent, accepted, declined, voided).

For the dashboard UI, quote template configuration, and sending behavior, see the TurboQuote product documentation.
:::

## Installation

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

Then import:

```go
import turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
```

## Requirements

- Go 1.21 or higher
- A TurboDocx API key (`TDX-` prefix)
- All methods accept a `context.Context` — pass `context.Background()` for one-offs or your request context inside handlers

## Configuration

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

`NewQuoteClient` does **not** require `SenderEmail` — TurboQuote does not send signature emails, so the sender validation enforced by `NewClientWithConfig` (TurboSign) is skipped here. `OrgID` is required; both `APIKey` and `OrgID` fall back to `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID` environment variables when not set in config.

### Environment Variables

```bash
TURBODOCX_API_KEY=your_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
```

:::caution API Credentials Required
Both `APIKey` and `OrgID` are required. To get your credentials, follow the [Get Your Credentials](/docs/SDKs#1-get-your-credentials) steps from the SDKs main page.
:::

## Quick Start

### Full lifecycle: create → add items → send → download PDF

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

### Convenience: CreateAndSend

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

## Method Reference

All methods are instance methods on `*turbodocx.QuoteClient`. Construct once, then reuse across goroutines — the client is safe for concurrent use.

---

### Quotes

#### ListQuotes

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

#### CreateQuote

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

#### GetQuote

Fetches a quote by ID. The `StatusInfo` field (merged onto the returned `Quote`) describes what transitions are available: `CanSend`, `CanAccept`, `CanDecline`, `CanVoid`, `IsTerminal`.

```go
quote, err := qc.GetQuote(ctx, "quote-uuid")
if quote.StatusInfo != nil {
    fmt.Printf("Can send: %v\n", quote.StatusInfo.CanSend)
}
```

#### UpdateQuote

PATCH semantics — only provided fields are sent. Use the `Clear*` helpers to explicitly null a field:

```go
req := &turbodocx.UpdateQuoteRequest{}
req.ClearPriceBookID()  // sends "priceBookId": null
req.ClearValidUntil()   // sends "validUntil": null

quote, err := qc.UpdateQuote(ctx, "quote-uuid", req)
```

Available null-clear helpers: `ClearPriceBookID`, `ClearValidUntil`, `ClearTaxRate`, `ClearRenewalPeriod`.

#### DeleteQuote

```go
result, err := qc.DeleteQuote(ctx, "quote-uuid")
// result.Message string
```

#### DuplicateQuote

Creates a new draft quote as a copy of the specified quote.

```go
copy, err := qc.DuplicateQuote(ctx, "quote-uuid")
```

#### ApplyPriceBook

Applies a price book to a quote, adjusting line item prices to match book pricing.

```go
resp, err := qc.ApplyPriceBook(ctx, "quote-uuid", "pricebook-uuid")
// resp.UpdatedCount int — items updated
// resp.SkippedCount int — items not in price book
// resp.QuoteResult  Quote
```

#### RemovePriceBook

Removes the applied price book, reverting line items to catalog prices.

```go
quote, err := qc.RemovePriceBook(ctx, "quote-uuid")
```

---

### Quote Numbering Configuration

Customize the per-org quote number format: prefix, year/month tokens, separator, zero-padding, suffix, starting number, and reset cadence. Both methods are **admin only**; a non-admin API key receives a `403`.

#### GetQuoteNumberConfig

Fetches the org's current quote numbering format and the current per-period issued floor.

```go
config, err := qc.GetQuoteNumberConfig(ctx)
if err != nil {
    log.Fatal(err)
}
fmt.Println(config.Format.Prefix)   // e.g. "Q-"
fmt.Println(config.CurrentFloor)    // the current per-period issued floor
```

#### UpdateQuoteNumberConfig

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

#### Field reference, defaults & validation

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

### Quote Status Transitions

#### SendQuote

Moves the quote from `draft` to `sent` and emails the proposal to the contact.

```go
sent, err := qc.SendQuote(ctx, "quote-uuid", &turbodocx.SendQuoteRequest{
    CCEmails:   []string{"cc@example.com"},
    ValidUntil: &[]string{"2026-09-01"}[0],
})
// sent.QuoteResult Quote
// sent.Message     string
```

#### SendQuoteWithDeliverable

Sends the quote with a TurboDocx-generated document (e.g., a proposal PDF) attached as a signature document.

```go
resp, err := qc.SendQuoteWithDeliverable(ctx, "quote-uuid", &turbodocx.SendQuoteWithDeliverableRequest{
    DeliverableID: "deliverable-uuid",
    MergePosition: "after", // "before" | "after"
    CCEmails:      []string{"cc@example.com"},
})
// resp.DocumentID string — TurboSign document ID for tracking
```

#### DeclineQuote

```go
quote, err := qc.DeclineQuote(ctx, "quote-uuid", &turbodocx.DeclineQuoteRequest{
    Reason: "Budget constraints for this quarter",
})
```

#### VoidQuote

```go
quote, err := qc.VoidQuote(ctx, "quote-uuid", &turbodocx.VoidQuoteRequest{
    Reason: "Replaced by updated proposal",
})
```

#### HandleExpiredQuote

Handles a `sent` quote that has passed its `validUntil` date. The endpoint **closes out the original quote** — voiding or declining it depending on `Action` — and then **creates a duplicate carrying `NewValidUntil`** as its new validity date. The returned quote is the new duplicate; the original stays terminal.

`Action` is `"void"` or `"decline"`. All three fields are **required**: `Action`, `Reason` (max 190 characters), and `NewValidUntil` (ISO date).

```go
quote, err := qc.HandleExpiredQuote(ctx, "quote-uuid", &turbodocx.HandleExpiredQuoteRequest{
    Action:        "void",                          // required — "void" or "decline" only
    Reason:        "Customer requested more time",  // required — max 190 characters
    NewValidUntil: "2026-10-01",                    // required — ISO date, carried onto the duplicate
})
```

:::warning There is no `extend` or `resend` action
`Action` accepts **only** `"void"` and `"decline"`. `"extend"` and `"resend"` do not exist in the API and return a `400`. Extending is what the endpoint already does — pass `NewValidUntil` and it lands on the duplicate it creates.
:::

#### DownloadQuotePdf

Returns the raw PDF bytes. Write directly to a file or stream to a response.

```go
pdfBytes, err := qc.DownloadQuotePdf(ctx, "quote-uuid")
if err != nil {
    log.Fatal(err)
}
os.WriteFile("proposal.pdf", pdfBytes, 0644)
```

---

### Line Items

Line items belong to a quote. Products are added individually; bundles use a separate endpoint.

#### ListLineItems

```go
lineItemType := "product"
list, err := qc.ListLineItems(ctx, "quote-uuid", &turbodocx.ListLineItemsOptions{
    LineItemType: &lineItemType,
})
// list.Results      []LineItem
// list.TotalRecords int
```

#### AddLineItems

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

#### AddBundleLineItems

```go
items, err := qc.AddBundleLineItems(ctx, "quote-uuid",
    turbodocx.AddBundleLineItemRequest{
        BundleID:   "bundle-uuid",
        BundleName: "Starter Bundle",
    },
)
```

#### UpdateLineItem

PATCH semantics. Use `Clear*` helpers for explicit nulls: `ClearCost`, `ClearCategoryID`, `ClearCategoryName`, `ClearProductSku`, `ClearProductDescription`, `ClearDisplayOrder`.

```go
newPrice := 180.00
item, err := qc.UpdateLineItem(ctx, "quote-uuid", "item-uuid", &turbodocx.UpdateLineItemRequest{
    UnitPrice: &newPrice,
})
```

#### RemoveLineItem

```go
result, err := qc.RemoveLineItem(ctx, "quote-uuid", "item-uuid")
```

---

### Products

The product catalog powers line item selection in quotes.

#### ListProducts

```go
list, err := qc.ListProducts(ctx, &turbodocx.ListProductsOptions{
    Query: &[]string{"license"}[0],
})
// list.Results        []Product
// list.TotalProducts  int
// list.CatalogValue   float64
```

#### CreateProduct

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

#### GetProduct / DeleteProduct / DuplicateProduct

```go
product, err := qc.GetProduct(ctx, "product-uuid")
result,  err := qc.DeleteProduct(ctx, "product-uuid")
copy,    err := qc.DuplicateProduct(ctx, "product-uuid")
```

#### UpdateProduct

PATCH semantics with `Clear*` helpers: `ClearCost`, `ClearSku`, `ClearDescription`, `ClearDetailedSpecification`, `ClearInternalNotes`. Supports image uploads via `Images`.

```go
newPrice := 109.99
product, err := qc.UpdateProduct(ctx, "product-uuid", &turbodocx.UpdateProductRequest{
    ListPrice: &newPrice,
})
```

#### GetProductPrimaryImages

Returns a `ProductPrimaryImagesResponse` (`map[string]*ProductImage`) keyed by product ID.

```go
images, err := qc.GetProductPrimaryImages(ctx, []string{"product-uuid-1", "product-uuid-2"})
if img, ok := images["product-uuid-1"]; ok && img != nil {
    fmt.Println(img.FileName)
}
```

---

### Bundles

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

### Price Books

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

### Companies

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

### Contacts

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

### Quote Templates

Quote templates control the branding and layout of sent quote emails and the customer-facing quote page (logo, colors, footer text, terms, sender info).

:::warning Templates are auto-provisioned — use GetTemplate → UpdateTemplate
`GetTemplate` **self-heals**: if the org has no template, the API creates one from your org branding and returns it. Every established org therefore already has a template, which means:

- `CreateTemplate` returns **400 `TEMPLATE_ALREADY_EXISTS`** and is effectively unreachable. Do not build a get-then-create flow.
- `DeleteTemplate` is really "reset to org branding defaults" — it soft-deletes, and the next `GetTemplate` regenerates a fresh one.

The correct flow is **`GetTemplate` → `UpdateTemplate`**.
:::

#### GetTemplate

Returns the active (default) quote template for the org, creating one from org branding if none exists. Use this for the most common case.

```go
tmpl, err := qc.GetTemplate(ctx)
fmt.Printf("Primary color: %s\n", tmpl.PrimaryColor)
```

#### GetTemplateByID

Retrieves a specific template by ID when you have multiple templates.

```go
tmpl, err := qc.GetTemplateByID(ctx, "template-uuid")
```

#### ListTemplates / UpdateTemplate / DeleteTemplate

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

### Types (Categories)

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

### Bulk Imports

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

## Enums and Constants

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

## Null-Clear Semantics (PATCH)

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

## Error Handling

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

### Error Types

| Status | Type | When |
|---|---|---|
| 400 | `*ValidationError` | Bad request body, missing required field, invalid enum |
| 401 | `*AuthenticationError` | Missing or invalid API key |
| 403 | `*AuthorizationError` | Key valid but lacks required permissions |
| 404 | `*NotFoundError` | Quote, product, bundle, company, etc. not found |
| 429 | `*RateLimitError` | Rate limit exceeded |
| — | `*NetworkError` | DNS failure, refused connection, timeout |

---

## See Also

- [TurboQuote JavaScript / TypeScript SDK](/docs/SDKs/quote-javascript) — same API, JS/TS idioms
- [TurboQuote Python SDK](/docs/SDKs/quote-python) — same API, Python idioms
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [TurboSign Go SDK](/docs/SDKs/go) — sending documents for e-signature
- [Deliverable Go SDK](/docs/SDKs/deliverable-go) — generating documents from templates
- [TurboWebhooks Go SDK](/docs/SDKs/webhooks-go) — real-time event delivery
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
