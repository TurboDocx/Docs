---
title: Bulk Importing from a Spreadsheet
sidebar_position: 8
description: Bulk import products, companies, contacts, bundles, price books and categories into TurboQuote from CSV or Excel, with column matching, validation and error reports.
keywords:
  - turboquote
  - bulk import
  - spreadsheet import
  - csv import
  - xlsx import
  - import products
  - import companies
  - import contacts
  - product catalog
  - price book
  - TurboDocx
---

# Bulk Importing from a Spreadsheet

Instead of creating catalog and CRM records one at a time, you can import them in bulk from a CSV or Excel spreadsheet. This is the fastest way to load an existing catalog exported from your CRM, ERP, or a previous tool.

## What You'll Accomplish

By the end of this guide, you will have:

- 📤 **Uploaded** a CSV or Excel file to a TurboQuote import dialog
- 🔗 **Matched** your spreadsheet columns to TurboQuote fields
- ✅ **Reviewed** validation results and imported your records
- 📥 **Downloaded an error report** for any rows that need fixing

:::tip Quick Start Promise
Already have your data in a spreadsheet? You can be importing in under a minute. Start by downloading the template so your columns line up automatically. 🚀
:::

## How Records Link Together

Related records connect using the names and codes you already use, so you can build your spreadsheet straight from data you already have:

- **Products** point at a category by its **name**. If the category doesn't exist yet, TurboQuote creates it for you.
- **Bundles** and **price books** point at products by their **SKU**.
- **Companies** carry their **contacts inline**, on the same rows.
- **Contacts** are added to the company whose page you opened the importer from, so there is **no company column** to fill in.

## What You Can Import

Bulk import is available for each of these record types. On each page, click the **Import** button next to the **New …** button:

| Record type | Where to find it |
| --- | --- |
| **Products** | TurboQuote → Products |
| **Companies** (with their contacts) | TurboQuote → Companies |
| **Contacts** | A company's Contacts page |
| **Bundles** | TurboQuote → Bundles |
| **Price Books** | TurboQuote → Price Books |
| **Categories** | TurboQuote → Manage Categories, on the tab for the kind of category |

![The Products page with the Import button highlighted](/img/turboquote_bulk_import/00-import-button.png)

## Step 1: Upload Your File

This walkthrough uses **Companies** as the example, because a company can span several rows (one per contact). Products, contacts, bundles, price books and categories follow the same three steps; only the columns differ (see the [Column Reference](#column-reference)).

1. Click **Import** to open the import dialog.
2. Check **What the file needs**. It lists the **required** and **optional** columns. For companies there are two groups: the company's own columns, and the columns for each contact.
3. (Recommended) Click **Download template** to get a CSV with the right column headers and an example row.
4. Drag and drop your **CSV** or **Excel** file onto the upload area, or click it to choose one.
5. Click **Continue**.

- 📦 **Maximum 500 rows** per import. A larger file is rejected before anything is created. Split the file into batches and import each one.
- 📅 Date columns (for example, a price book's valid-from and valid-to) are read in `YYYY-MM-DD` format.

![The Upload file step. What the file needs lists the required and optional columns for companies and for each contact](/img/turboquote_bulk_import/01-upload.png)

For products, **What the file needs** also explains the billing values and that new categories are created for you:

![The products import: Name, Billing Frequency, List Price and Category are required](/img/turboquote_bulk_import/05-products-upload.png)

## Step 2: Match Your Columns

TurboQuote matches your columns by name. Matching ignores case, spaces and underscores, so `Company Name`, `company_name` and `COMPANYNAME` are all recognised, and a few common alternates work too (for example, `Company` for the company name). On the **Match columns** step, each field shows the column it was matched to and a status:

- **Matched**: the field will be filled from that column.
- **Skipped**: no column was matched, or you chose **Don't import**. Only optional fields can be skipped.

Change any match with the dropdown next to the field. Required fields are marked with an asterisk and must be matched before you can continue. If you used the downloaded template, every column matches automatically.

![The Match columns step for the company fields, each matched to a column of the file](/img/turboquote_bulk_import/02-match-columns.png)

For companies, the **Contact Fields** come next. Rows with the same company name are grouped into one company, and each row adds one contact.

![The Contact Fields: Contact Name and Contact Email are required, and Contact Phone is skipped](/img/turboquote_bulk_import/03-contact-columns.png)

## Step 3: Review and Import

The **Review & import** step checks every row **before anything is created**, then sorts your rows into three groups, shown as a colored bar and a summary headline (for example, **"2 of 3 rows will import"**):

- ✅ **Import as-is.** The row is clean and imports unchanged.
- ⚠️ **Import with changes.** The row still imports, but a bad **optional** value was cleared. For example, a non-numeric `cost`, an unrecognized `currency`, an out-of-range minimum order quantity, or a company industry that doesn't exist is dropped and the rest of the row is kept (currency falls back to the default, USD).
- ❌ **Won't import.** A **required** value is missing or invalid, so the whole row is skipped. For example, a product with no name, or a contact with no email.

Expand any group to see the affected rows with their row number and the exact reason.

For companies, rows are grouped by company before counting, so the headline counts **companies**, not spreadsheet rows. In this example, four rows (two contacts for Alpine Ski House, one each for Woodgrove Bank and Fabrikam) are **three companies**: Woodgrove Bank imports without its industry, which doesn't exist yet, and Fabrikam won't import because its contact has no email.

![The Review & import step: 2 of 3 rows will import. Woodgrove Bank imports without its industry, and Fabrikam won't import because its contact has no email](/img/turboquote_bulk_import/04-review.png)

When you're happy with the split, click **Import _N_** (for example, **Import 2 companies**). The button shows how many will import. TurboQuote creates any missing categories first, then imports the eligible rows.

### Adjustments and Error Reports

After importing, the headline updates to something like **"2 of 3 rows imported"**, keeping the same groups. Two downloads help you follow up:

- **Download changes.** A report of every row that imported **with changes** (which value was cleared, and why), so you can fill them back in later.
- **Download errors.** A report of every row that **didn't import**. Fix those rows in your spreadsheet and upload just them again.

:::tip Why your file rarely fails outright
A bad **optional** value never blocks a row. TurboQuote clears just that value and keeps the rest. Only a missing or invalid **required** value skips a row. So even a messy export gets most of your data in, and the change and error reports tell you exactly what to clean up.
:::

## Column Reference

You only need this section if you're building a spreadsheet by hand. If you started from **Download template**, your headers already match and every column maps automatically, so you can skip ahead to [Tips and Limits](#tips-and-limits).

The columns below match what **Download template** produces, so the safest path is always to start from the template. Header names are matched flexibly (case, spaces, and underscores are ignored), and a few common alternates are noted. Anything marked optional can be left out entirely.

### Products (TurboQuote → Products)

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `product_name` | **Required** | Example Product | Also accepts `product`, `name`. |
| `billing_frequency` | **Required** | monthly | One of `monthly`, `quarterly`, `annual`, `one-time`. |
| `list_price` | **Required** | 99.00 | Number, 0 or greater. |
| `category` | **Required** | Software Licenses | Category name. Created automatically if it does not exist. |
| `sku` | Optional | SKU-001 | |
| `description` | Optional | Product description | |
| `internal_notes` | Optional | Internal note | Not shown to customers. |
| `cost` | Optional | 50.00 | Number, 0 or greater. Cleared if invalid. |
| `min_order_qty` | Optional | 1 | Whole number, 1 or greater. Defaults to 1. |
| `currency` | Optional | USD | One of `USD`, `EUR`, `GBP`, `CAD`, `INR`, `AUD`. Defaults to USD. |
| `show_in_catalog` | Optional | true | `true` or `false`. Defaults to true. |

### Bundles (TurboQuote → Bundles)

Bundle-level columns (repeat the same values on every row of the bundle):

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `bundle_name` | **Required** | Starter Pack | Also accepts `bundle`, `name`. Groups the rows of one bundle. |
| `category` | **Required** | Bundles | Created automatically if it does not exist. |
| `description` | Optional | Everything to get started | |
| `bundle_sku` | Optional | BNDL-01 | |
| `bundle_discount_type` | Optional | percent | `percent` or `amount`. |
| `bundle_discount_percent` | Optional | 10 | Used when the type is `percent`. |
| `bundle_discount_amount` | Optional | 50 | Used when the type is `amount`. |
| `currency` | Optional | USD | One of `USD`, `EUR`, `GBP`, `CAD`, `INR`, `AUD`. Defaults to USD. |
| `show_items_to_end_user` | Optional | false | Defaults to false. |
| `show_in_catalog` | Optional | true | Defaults to true. |
| `sync_with_products` | Optional | false | Defaults to false. |

Per-item columns (one row per bundle item):

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `product_sku` | **Required** | SKU-001 | SKU of an existing product. Also accepts `product`. |
| `item_unit_price` | **Required** | 99.00 | Number, 0 or greater. |
| `item_billing_frequency` | **Required** | monthly | One of `monthly`, `quarterly`, `annual`, `one-time`. |
| `item_quantity` | Optional | 1 | Whole number. Defaults to 1. |
| `item_discount_type` | Optional | percent | `percent` or `amount`. |
| `item_discount_percent` | Optional | 5 | |
| `item_discount_amount` | Optional | 10 | |
| `item_cost` | Optional | 40.00 | |

### Price Books (TurboQuote → Price Books)

Price-book-level columns (repeat the same values on every row of the price book):

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `price_book_name` | **Required** | Q1 Enterprise | Also accepts `price_book`, `name`. Groups the rows of one price book. |
| `category` | **Required** | Enterprise | Price book category. Also accepts `type`. Created automatically if it does not exist. |
| `valid_from` | **Required** | 2026-01-01 | `YYYY-MM-DD`. |
| `description` | Optional | First quarter rates | |
| `discount_percent` | Optional | 10 | 0 to 100. Defaults to 0. |
| `valid_to` | Optional | 2026-12-31 | `YYYY-MM-DD`. Must be after `valid_from`. |
| `is_default` | Optional | false | Defaults to false. |
| `offer_on_quotes` | Optional | true | Whether reps can pick the book on quotes. Also accepts `show_in_quote_builder`. Defaults to true. |

Per-product override columns (one row per product):

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `product_sku` | **Required** | SKU-001 | SKU of an existing product. Also accepts `product`. |
| `product_discount_type` | Optional | percent | `percent` or `amount`. |
| `product_discount_percent` | Optional | 15 | |
| `product_discount_amount` | Optional | 20 | |

### Categories (TurboQuote → Categories)

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `category_name` | **Required** | Software Licenses | Also accepts `name`, `category`. |

The kind of category (product, bundle, price book or industry) comes from the tab you are on when you click **Import** on the Categories page, not from a column. Open the tab you want first, and every row is created as that kind.

### Companies (TurboQuote → Companies)

Company-level columns (repeat the same values on every row of the company):

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `company_name` | **Required** | Acme Corp | Also accepts `company`, `name`. Groups the rows of one company. |
| `company_email` | Optional | hello@acme.com | The company's own email address. A malformed one stops the company from importing. |
| `industry` | Optional | Technology | An existing industry name; one that doesn't exist is cleared and the company imports without it. See the note below. Also accepts `sector`, `vertical`. |
| `phone` | Optional | +1 555-123-4567 | |
| `city` | Optional | New York | |
| `state` | Optional | NY | Also accepts `province`. |
| `country` | Optional | United States | |

Per-contact columns (one row per contact; each company needs at least one):

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `contact_name` | **Required** | Jane Smith | |
| `contact_email` | **Required** | jane.smith@acme.com | |
| `contact_phone` | Optional | +1 555-987-6543 | |
| `contact_title` | Optional | VP of Sales | Also accepts `role`, `position`. |

### Contacts (a company's Contacts page)

| Column | Required? | Example | Notes |
| --- | --- | --- | --- |
| `contact_name` | **Required** | Jane Smith | Also accepts `name`. |
| `contact_email` | **Required** | jane.smith@example.com | |
| `contact_phone` | Optional | +1 555-123-4567 | Also accepts `tel`. |
| `contact_title` | Optional | VP of Sales | Also accepts `role`, `position`. |

:::note No company column for contacts
The contact importer opens from one company's Contacts page, and every row is added to **that** company. Do not include a company name or ID column. TurboQuote supplies the company for you.
:::

## Grouped Records (Companies, Bundles, Price Books)

Some records span **multiple rows** in your spreadsheet:

- A **company** with several contacts: repeat the company on one row per contact.
- A **bundle** with several items, or a **price book** with several product overrides: repeat the record on one row per item.

For these, all rows that share the same record name must repeat the same record-level values (company industry, bundle discount, price book type, and so on). **Only the per-item columns may differ between rows.** If two rows disagree on a record-level value, the import flags a conflict so nothing is created with the wrong value.

:::note Categories and types are created for you
When you import products, bundles, or price books, any category or price-book type that doesn't exist yet is created automatically before the records are imported. Company **industries** are the exception: they are never created by an import. An industry that doesn't exist is cleared, and the company imports without one. To keep it, add the industry first, one at a time or in bulk, on the **Industries** tab of the Categories page.
:::

## Referencing Products by SKU (Bundles and Price Books)

Bundle items and price-book overrides each point at a product by its **SKU**, the code shown on each product in your catalog. Put that SKU in the `product_sku` column.

TurboQuote resolves the reference for you:

- **One match.** That product is used.
- **Several products share the SKU.** The **earliest-created** one is used, and the row is flagged under **import with changes** so you can confirm it's the right product.
- **No match.** Just that one item or override is dropped (also logged under **import with changes**); the rest of the bundle or price book still imports.

:::tip
Import your **products first**, then reference them by SKU in your bundle and price-book sheets. The downloaded template's product column is already named `product_sku`.
:::

## Tips and Limits

- 📦 **500 rows** per import. Split a larger file into batches.
- 🖼️ **Product images** aren't supported during bulk import. Add them to individual products afterward.
- 🔖 **Bundles and price books reference products by SKU** in the `product_sku` column. See [Referencing Products by SKU](#referencing-products-by-sku-bundles-and-price-books). Import your products first.
- 🧾 Start from **Download template** whenever possible. It guarantees your headers match and every column maps automatically.

## Related

- [Adding a New Product](./Adding-a-New-Product.md)
- [Managing Companies and Contacts](./Managing-Companies-and-Contacts.md)
- [Managing Bundles](./Managing-Bundles.md)
- [Managing Price Books](./Managing-Price-Books.md)
- [Managing Categories](./Managing-Categories.md)
