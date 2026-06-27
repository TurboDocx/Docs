---
title: Field Placement
sidebar_position: 4
description: Place signature and form fields on your sample PDF once, and the pipeline reprojects them onto every live document. Full TurboSign field-type parity, positioned per page and assigned to recipients.
keywords:
  - field placement
  - signature field placement
  - form fields
  - place signature fields
  - turbosign fields
  - signature initial date text
  - checkbox field
  - identity fields
  - field positioning
  - per page placement
  - recipient assignment
  - relative field placement
---

# Field Placement

Field placement is where you decide *where* signature and form fields appear on your documents. You position the fields once, on the sample PDF, and the pipeline reprojects that layout onto every live document it processes.

<br/>

## Placing Fields on the Sample

In the wizard's field placer, you work directly on the sample PDF you uploaded:

1. **Pick a field type** from the toolbar.
2. **Click to drop it** onto the page where it belongs.
3. **Position it** by dragging it into place.
4. **Choose the target page** — the first page, the last page, or a specific page number.
5. **Assign the recipient** who will complete that field.

You can place as many fields as you need, mixing types freely across the document.

> 📷 Screenshot: The field placer showing the toolbar of field types, a field being dropped on the sample PDF, the page selector, and the recipient assignment control.

<br/>

## Supported Field Types

The placer offers full **TurboSign parity** — the same field types you'd use when sending a document manually:

| Field | Description |
| --- | --- |
| **Signature** | The signer draws or applies their signature. |
| **Initial** | The signer initials a page or section. |
| **Date** | The date the document is signed. |
| **Text** | A free-text field the signer fills in. |
| **Checkbox** | A box the signer checks to confirm or agree. |
| **Full name** | The signer's complete name. |
| **First name** | The signer's given name. |
| **Last name** | The signer's family name. |
| **Title** | The signer's job title. |
| **Company** | The signer's organization. |
| **Email** | The signer's email address. |

**Signer-fillable fields** — signature, initial, date, text, and checkbox — are completed by the signer as they sign. **Identity fields** — full name, first name, last name, title, company, and email — capture details about the signer, which they confirm or complete during signing.

:::info All placed fields are required
Every field you place must be completed before a document can finish signing. Place only the fields you genuinely need.
:::

<br/>

## How Placement Travels to Every Document

When you position a field, its location is **stored relative to the page** rather than as a fixed pixel spot. That means the layout reprojects cleanly onto each live document at runtime — so a signature you placed at the bottom of the last page of your sample lands at the bottom of the last page of every invoice the pipeline processes, even as the content above it changes.

:::tip Place against a representative sample
Because placement is relative to the page, the closer your sample matches your real documents' layout, the more precisely fields will land on live runs.
:::

<br/>

## What's Next?

- **[Field Extraction](./Field%20Extraction)** — pull data out of each document with patterns.
- **[Creating an E-Signature Pipeline](./Creating%20an%20E-Signature%20Pipeline)** — see the full wizard from start to finish.
