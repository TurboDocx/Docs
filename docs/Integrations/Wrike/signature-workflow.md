---
title: Signature Workflow
sidebar_position: 5
description: Send generated Wrike documents for digital signature using TurboSign. Configure custom fields and signature anchors for automated signing workflows.
keywords:
  - wrike signature workflow
  - wrike turbosign
  - wrike digital signature
  - wrike e-signature
  - wrike document signing
---

# Signature Workflow with TurboSign

TurboDocx supports a signature workflow for Wrike tasks, allowing you to send generated documents for digital signing directly from Wrike.

## How It Works

1. **Change a task status** to `Send for Signature`
2. TurboDocx fetches the **most recent attachment** from the task
3. TurboDocx extracts **signature recipients** from Wrike custom fields
4. The document is sent through the **TurboSign workflow** for digital signatures

![Send for Signature in Wrike](/img/wrike-integration/SendForSignatureWrike.png)

<br/>

## Required Wrike Custom Fields

TurboSign looks for the following custom fields on your Wrike task or folder:

![Signature Fields in Wrike](/img/wrike-integration/SignatureFieldsInWrike.png)

| Custom Field Name | Required | Description |
|-------------------|----------|-------------|
| `Seller email` | **Yes** | Email address of the seller/vendor signer |
| `Customer email` | **Yes** | Email address of the customer/client signer |
| `Seller name` | No | Name of the seller/vendor signer (defaults to "Seller") |
| `Customer name` | No | Name of the customer/client signer (defaults to "Customer") |

:::caution Required Custom Fields
The signature workflow will fail if the required email fields are missing. Make sure to add these custom fields to your Wrike workflow and populate them before triggering the signature:
- `Seller email` (required)
- `Customer email` (required)
:::

<br/>

## Required Document Anchor Fields

Your document template must include the following anchor fields for TurboSign to place signature elements:

- `{SalesSignerName}` — Where the seller's name will appear
- `{SalesDate}` — Where the seller's signature date will appear
- `{SalesSignerSignature}` — Where the seller's signature field will be placed
- `{ClientSignerName}` — Where the customer's name will appear
- `{ClientDate}` — Where the customer's signature date will appear
- `{ClientSignerSignature}` — Where the customer's signature field will be placed

<br/>

## Template Configuration for Signatures

When using a template with the signature workflow, you need to ensure the anchor fields are preserved during document generation. In TurboDocx, set each anchor field's **default value** to map to itself:

| Variable | Default Value |
|----------|---------------|
| `{SalesSignerName}` | `{SalesSignerName}` |
| `{SalesDate}` | `{SalesDate}` |
| `{SalesSignerSignature}` | `{SalesSignerSignature}` |
| `{ClientSignerName}` | `{ClientSignerName}` |
| `{ClientDate}` | `{ClientDate}` |
| `{ClientSignerSignature}` | `{ClientSignerSignature}` |

![Template Default Values and AI Values](/img/wrike-integration/TurboDocxTemplateDefaultValuesAndAIValues.png)

This ensures the anchor fields remain as literal text in the generated document so TurboSign can locate and replace them with actual signature elements.

<br/>

## Prerequisites

- **TurboSign** must be configured in your TurboDocx organization (see [Setting up TurboSign](../../TurboSign/Setting%20up%20TurboSign.md))
- The Wrike task must have at least **one document attachment**
- The document must contain all **required signature anchor fields**
- The Wrike task/folder must have the **required custom fields populated**

<br/>

## Triggering the Signature Workflow

1. Generate a document using your Wrike automation (see [Setting Up a Wrike Automation](./setting-up-automation.md))
2. Verify the document was attached to the Wrike task
3. Ensure the custom fields (`Seller email`, `Customer email`) are populated on the task
4. Change the task status to **Send for Signature**
5. TurboSign will process the document and send signature requests to both parties
