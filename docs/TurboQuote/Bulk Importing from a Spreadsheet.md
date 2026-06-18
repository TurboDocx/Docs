---
title: Bulk Importing from a Spreadsheet
sidebar_position: 3
description: Import products, companies, contacts, bundles, price books, and categories into TurboQuote in bulk from a CSV or XLSX spreadsheet, with column mapping, validation, and a downloadable error report.
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

Instead of creating catalog and CRM records one at a time, you can import them in bulk from a CSV or XLSX spreadsheet. This is the fastest way to load an existing catalog exported from your CRM, ERP, or a previous tool.

## What You'll Accomplish

By the end of this guide, you will have:

- 📤 **Uploaded** a CSV or XLSX file to a TurboQuote import dialog
- 🔗 **Mapped** your spreadsheet columns to TurboQuote fields
- ✅ **Reviewed** validation results and imported your records
- 📥 **Downloaded an error report** for any rows that need fixing

:::tip Quick Start Promise
Already have your data in a spreadsheet? You can be importing in under a minute — start by downloading the template so your columns line up automatically. 🚀
:::

## What You Can Import

Bulk import is available for each of these record types, from its own list page:

| Record type | Where to find it |
| --- | --- |
| **Products** | TurboQuote → Products |
| **Companies** (with their contacts) | TurboQuote → Companies |
| **Contacts** | A company's Contacts page |
| **Bundles** | TurboQuote → Settings → Bundles |
| **Price Books** | TurboQuote → Settings → Price Books |
| **Categories** | TurboQuote → Settings → Categories |

Each page has a button to open the importer next to **New …** — labelled **Import From Spreadsheet** for products, companies, contacts, and bundles, and **Bulk Create** for price books and categories.

> 📸 _Screenshot placeholder: the Products page with the **Import From Spreadsheet** button highlighted._

## Step 1 — Upload Your File

1. Click **Import From Spreadsheet** (or **Bulk Create**, for price books and categories) to open the import dialog.
2. (Recommended) Click **Download Template** in the top-right of the **Columns** box to get a correctly-formatted CSV with the right column headers and an example row.
3. Drag and drop your **CSV** or **XLSX** file onto the upload area, or click to browse.

The dialog parses your file and shows the row and column counts plus a preview.

- 📦 **Maximum 500 rows** per import. Larger files are rejected up front — split them into batches.
- 📅 Date columns (for example, a price book's valid-from / valid-to) are read in `YYYY-MM-DD` format.

> 📸 _Screenshot placeholder: the Upload step showing the Columns box (REQUIRED / OPTIONAL / PER ITEM chips, with the Download Template button) and the drag-and-drop area._

## Step 2 — Map Your Columns

TurboQuote auto-detects common column names (for example, `product_name` → **Product Name**). On the **Map Columns** step you can confirm or change each mapping:

- **Required fields** are marked with an asterisk and must be mapped before you can continue.
- **Optional fields** can be left unmapped — sensible defaults are applied (for example, currency defaults to USD).

If you used the downloaded template, every column maps automatically.

> 📸 _Screenshot placeholder: the Map Columns step with required fields mapped._

## Step 3 — Review and Import

The **Review & Import** step checks every row **before anything is created**, then sorts your rows into three groups, shown as a colored bar and a summary headline (for example, **"18 of 20 rows will import"**):

- ✅ **Import as-is** — the row is clean and imports unchanged.
- ⚠️ **Import with changes** — the row still imports, but a bad **optional** value was cleared. For example, a non-numeric `cost`, an unrecognized `currency`, or an out-of-range minimum order quantity is dropped and the rest of the row is kept (currency falls back to the default, USD).
- ❌ **Won't import** — a **required** value is missing or invalid, so the whole row is skipped. For example, a product with no name or an invalid billing frequency, or a bundle row missing its unit price.

Expand any group to see the affected rows with their row number and the exact reason.

When you're happy with the split, click **Import _N_ rows** — the button shows how many will import. TurboQuote creates any missing categories or price-book types first, then imports the eligible rows.

> 📸 _Screenshot placeholder: the Review step showing the three groups (import as-is / with changes / won't import) and the **Import N rows** button._

### Adjustments and Error Reports

After importing, the headline updates to something like **"18 of 20 rows imported"**, keeping the same three groups. Two downloads help you follow up:

- **Download changes** — a report of every row that imported **with changes** (which value was cleared, and why), so you can fill them back in later.
- **Download errors** — a report of every row that **didn't import**. Fix those rows in your spreadsheet and re-upload just them.

:::tip Why your file rarely fails outright
A bad **optional** value never blocks a row — TurboQuote clears just that value and keeps the rest. Only a missing or invalid **required** value skips a row. So even a messy export gets most of your data in, and the change/error reports tell you exactly what to clean up.
:::

## Grouped Records (Companies, Bundles, Price Books)

Some records span **multiple rows** in your spreadsheet:

- A **company** with several contacts: repeat the company on one row per contact.
- A **bundle** with several items, or a **price book** with several product overrides: repeat the record on one row per item.

For these, all rows that share the same record name must repeat the same record-level values (company industry, bundle discount, price book type, and so on) — **only the per-item columns may differ between rows**. If two rows disagree on a record-level value, the import flags a conflict so nothing is created with the wrong value.

:::note Categories and types are created for you
When you import products, bundles, or price books, any category or price-book type that doesn't exist yet is created automatically before the records are imported. Company **industries**, however, must already exist — use a recognized industry name.
:::

## Referencing Products by SKU (Bundles and Price Books)

Bundle items and price-book overrides each point at a product. In the **`product_sku`** column you can use either:

- a product's **SKU** — the code shown on each product in your catalog (recommended, because it's easy to find), or
- a product's **UUID** — its internal ID.

TurboQuote resolves the reference for you:

- **One match** → that product is used.
- **Several products share the SKU** → the **earliest-created** one is used, and the row is flagged under **import with changes** so you can confirm it's the right product.
- **No match** → just that one item or override is dropped (also logged under **import with changes**); the rest of the bundle or price book still imports.

:::tip
Import your **products first**, then reference them by SKU in your bundle and price-book sheets. The downloaded template's product column is already named `product_sku`.
:::

## Tips and Limits

- 📦 **500 rows** per import — split larger files into batches.
- 🖼️ **Product images** aren't supported during bulk import; add them to individual products afterward.
- 🔖 **Bundles and price books reference products by SKU or product ID** in the `product_sku` column — see [Referencing Products by SKU](#referencing-products-by-sku-bundles-and-price-books). Import your products first.
- 🧾 Start from **Download Template** whenever possible — it guarantees your headers match and every column maps automatically.

## Related

- [Adding a New Product](./Adding%20a%20New%20Product.md)
- [Creating a New Quote](./Creating%20a%20New%20Quote.md)
