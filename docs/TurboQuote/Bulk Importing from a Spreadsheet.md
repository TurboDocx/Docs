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

Each page has an **Import From Spreadsheet** button next to **New …**.

> 📸 _Screenshot placeholder: the Products page with the **Import From Spreadsheet** button highlighted._

## Step 1 — Upload Your File

1. Click **Import From Spreadsheet** to open the import dialog.
2. (Recommended) Click **Download Template** in the top-right of the **Required fields** box to get a correctly-formatted CSV with the right column headers and an example row.
3. Drag and drop your **CSV** or **XLSX** file onto the upload area, or click to browse.

The dialog parses your file and shows the row and column counts plus a preview.

- 📦 **Maximum 500 rows** per import. Larger files are rejected up front — split them into batches.
- 📅 Date columns (for example, a price book's valid-from / valid-to) are read in `YYYY-MM-DD` format.

> 📸 _Screenshot placeholder: the Upload step showing the Required fields box (with the Download Template button) and the drag-and-drop area._

## Step 2 — Map Your Columns

TurboQuote auto-detects common column names (for example, `product_name` → **Product Name**). On the **Map Columns** step you can confirm or change each mapping:

- **Required fields** are marked with an asterisk and must be mapped before you can continue.
- **Optional fields** can be left unmapped — sensible defaults are applied (for example, currency defaults to USD).

If you used the downloaded template, every column maps automatically.

> 📸 _Screenshot placeholder: the Map Columns step with required fields mapped._

## Step 3 — Review and Import

The **Review & Import** step validates every row before anything is created. If there are problems, they're listed with the row number and the reason so you can fix them in your spreadsheet and re-upload:

- A required value is missing (for example, a product with no category).
- A value is out of range or the wrong type (for example, a non-numeric price).
- Rows that belong to the same record disagree on a shared value (see **Grouped records** below).

When everything is valid, click **Start Import**. TurboQuote creates any missing categories first, then imports your records and shows how many succeeded.

> 📸 _Screenshot placeholder: the Review step showing the record count and the **Start Import** button._

### Partial Success and the Error Report

If some rows import and others fail, you'll see a result like **"42 imported, 3 failed"**. The failed rows are listed with their row number and reason, and you can click **Download Errors (.txt)** to get a report — fix those rows and re-import just them.

> 📸 _Screenshot placeholder: the result panel showing imported / failed counts and the Download Errors button._

## Grouped Records (Companies, Bundles, Price Books)

Some records span **multiple rows** in your spreadsheet:

- A **company** with several contacts: repeat the company on one row per contact.
- A **bundle** with several items, or a **price book** with several product overrides: repeat the record on one row per item.

For these, all rows that share the same record name must repeat the same record-level values (company industry, bundle discount, price book type, and so on) — **only the per-item columns may differ between rows**. If two rows disagree on a record-level value, the import flags a conflict so nothing is created with the wrong value.

:::note Categories and types are created for you
When you import products, bundles, or price books, any category or price-book type that doesn't exist yet is created automatically before the records are imported. Company **industries**, however, must already exist — use a recognized industry name.
:::

## Tips and Limits

- 📦 **500 rows** per import — split larger files into batches.
- 🖼️ **Product images** aren't supported during bulk import; add them to individual products afterward.
- 🔢 **Bundles and price books reference products by their product ID** (UUID) in the item rows. Import your products first, then reference their IDs.
- 🧾 Start from **Download Template** whenever possible — it guarantees your headers match and every column maps automatically.

## Related

- [Adding a New Product](./Adding%20a%20New%20Product.md)
- [Creating a New Quote](./Creating%20a%20New%20Quote.md)
