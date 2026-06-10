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
resp, err := qc.CreateAndSend(ctx, &turbodocx.CreateAndSendRequest{
    Name:         "Acme Corp — Quick Proposal",
    CompanyID:    "company-uuid",
    ContactID:    "contact-uuid",
    CurrencyCode: &currency,
    Items: []turbodocx.AddLineItemRequest{
        {
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
quote, err := qc.CreateQuote(ctx, &turbodocx.CreateQuoteRequest{
    Name:      "New Proposal",
    CompanyID: "company-uuid",
    ContactID: "contact-uuid",
})
```

Required: `Name`, `CompanyID`, `ContactID`. Returns `*Quote`.

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

Handles a `sent` quote that has passed its `validUntil` date. `Action` is one of `"resend"`, `"extend"`, or `"void"`.

```go
quote, err := qc.HandleExpiredQuote(ctx, "quote-uuid", &turbodocx.HandleExpiredQuoteRequest{
    Action:        "extend",
    Reason:        "Customer requested more time",
    NewValidUntil: "2026-10-01",
})
```

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

Accepts one or more `AddLineItemRequest` values (variadic). Returns `[]LineItem`.

```go
qty := 3
disc := 10.0
items, err := qc.AddLineItems(ctx, "quote-uuid",
    turbodocx.AddLineItemRequest{
        ProductName:      "Support Plan",
        UnitPrice:        200.00,
        BillingFrequency: "monthly",
        Quantity:         &qty,
        DiscountPercent:  &disc,
    },
)
```

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
priceBook, err := qc.CreatePriceBook(ctx, &turbodocx.CreatePriceBookRequest{
    Name:            "Partner Pricing",
    PriceBookTypeID: "type-uuid",
    ValidFrom:       validFrom,
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

#### GetTemplate

Returns the active (default) quote template for the org. Use this for the most common case.

```go
tmpl, err := qc.GetTemplate(ctx)
fmt.Printf("Primary color: %s\n", tmpl.PrimaryColor)
```

#### GetTemplateByID

Retrieves a specific template by ID when you have multiple templates.

```go
tmpl, err := qc.GetTemplateByID(ctx, "template-uuid")
```

#### ListTemplates / CreateTemplate / UpdateTemplate / DeleteTemplate

```go
list, err := qc.ListTemplates(ctx, &turbodocx.PaginationParams{
    Limit: &[]int{5}[0],
})

logoURL := "https://cdn.example.com/logo.png"
tmpl, err := qc.CreateTemplate(ctx, &turbodocx.CreateQuoteTemplateRequest{
    LogoURL:      &logoURL,
    PrimaryColor: &[]string{"#0066CC"}[0],
    SenderName:   &[]string{"Sales Team"}[0],
})

tmpl, err = qc.UpdateTemplate(ctx, "template-uuid", &turbodocx.UpdateQuoteTemplateRequest{
    PrimaryColor: &[]string{"#003399"}[0],
})

result, err := qc.DeleteTemplate(ctx, "template-uuid")
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
- [SDKs Overview](/docs/SDKs) — all SDKs across all five languages
