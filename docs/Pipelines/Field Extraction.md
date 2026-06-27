---
title: Field Extraction
sidebar_position: 3
description: Pull values out of every PDF using text patterns. Capture invoice codes, dates, emails, and amounts to drive filenames, signer lookup, and routing in your pipeline.
keywords:
  - field extraction
  - pdf data extraction
  - regex extraction
  - pattern fields
  - routing fields
  - extract invoice number
  - extract email from pdf
  - document data capture
  - text extraction pipeline
  - filename builder
  - signer lookup
  - document routing
---

# Field Extraction

Field extraction is how a pipeline reads each document. As every PDF arrives, the pipeline scans its text for the values you've defined and captures them — so they can be used to name files, look up signers, and route documents to the right place.

<br/>

## What It Is

You define **patterns** that describe the data you want. For each incoming document, the pipeline finds the matching text and pulls the value out. Because extraction works on the document's text, you can reliably capture things like:

- An invoice or customer code
- A date
- An email address
- A dollar amount

These captured values become reusable throughout the rest of the pipeline.

<br/>

## Two Kinds of Fields

### Pattern Fields

A **pattern field** uses a text pattern (a regular expression) to capture a value and store it in a **named variable**. That variable can then be used in:

- **Filenames** — name the signed PDF after a customer code or date.
- **Signer lookup** — use a captured email to determine who signs.
- **Routing** — feed a captured value into a routing decision.

### Routing Fields

A **routing field** matches text in the document and sends the document to a specific **destination folder**. Where a pattern field *captures and reuses* a value, a routing field *decides where the document goes*.

For example, a routing field might look for the word "Renewal" and file any matching document into a "Renewals" folder, while everything else falls through to the default destination.

<br/>

## Practical Examples

| Goal | What you define | Captures |
| --- | --- | --- |
| Customer code | A pattern like `Customer\s*#?\s*(\d{6})` | `482194` |
| Invoice date | A pattern matching `\d{2}/\d{2}/\d{4}` | `06/14/2026` |
| Signer email | A pattern matching an email address | `ap@acme.com` |
| Amount due | A pattern matching a currency value | `$4,250.00` |

You name each captured value, then reference it later — for instance, building a filename like `Invoice-{customerCode}-{invoiceDate}.pdf`.

:::tip Test against your sample
Because the wizard previews against the sample PDF you uploaded, you can confirm a pattern captures the right value before going live.
:::

<br/>

## Where Extracted Values Are Used

Once captured, values flow into three places:

- **Filename builder** — compose meaningful, searchable filenames for signed documents.
- **Signer resolution** — use an extracted value (such as an email) to determine the recipient per document.
- **Routing** — steer documents to the correct destination folder based on what's inside them.

<br/>

## A Note on Scanned Documents

Extraction is **text-based** — it reads the actual text inside the PDF. If a document is an **image-only scan** (a photo or flat scan with no embedded text), there's no text to read, so extraction can't capture values from it.

:::info Signing still works
A scanned, image-only PDF can still be signed by the pipeline. Only the *extraction-dependent* features — custom filenames, extracted-field signer lookup, and routing — fall back to their defaults when no text is available. The document still flows through and is filed in the default destination.
:::

<br/>

## What's Next?

- **[Field Placement](./Field%20Placement)** — position signature and form fields on the sample.
- **[Creating an E-Signature Pipeline](./Creating%20an%20E-Signature%20Pipeline)** — see where extraction fits in the wizard.
