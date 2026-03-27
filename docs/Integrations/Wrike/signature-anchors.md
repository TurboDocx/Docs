---
title: Adding Signature Anchors
sidebar_position: 6
description: Learn how to add TurboSign signature anchor fields to your TurboDocx template variables for automated document signing from Wrike.
keywords:
  - wrike signature anchors
  - wrike turbosign anchors
  - wrike document signing setup
  - wrike signature fields
  - turbosign template anchors
---

# Adding Signature Anchors

Signature anchors are special template variables that tell TurboSign where to place signature elements (name, date, signature) in your generated documents. This guide walks you through adding them to your template.

## Prerequisites

- A template uploaded to TurboDocx with signature variables (e.g., `{SalesSigner}`)
- TurboSign configured in your organization (see [Setting up TurboSign](../../TurboSign/Setting%20up%20TurboSign.md))

<br/>

## Add Signature Anchors

### Step 1: Select Your Template

Navigate to your templates and select the template you want to configure with signature anchors.

![Select Template](/img/wrike-integration/FieldMap01-SelectTemplate.jpeg)

### Step 2: Open Template Preferences

Click **Edit Template & Preferences** to open the template configuration view.

![Edit Template and Preferences](/img/wrike-integration/FieldMap02-EditTemplatePreferences.jpeg)

### Step 3: Edit the Signature Variable

Click the edit icon on the signature variable you want to configure as an anchor (e.g., **SalesSigner**).

![Edit Signature Variable](/img/wrike-integration/SigAnchor04-OpenFieldTypeMenu.jpeg)

### Step 4: Open the Field Type Menu

In the variable settings panel, click the **...** menu button next to the Default Value field to see the available field type options.

![Open Field Type Menu](/img/wrike-integration/SigAnchor05-ExpandFieldOptions.jpeg)

### Step 5: Select "Wrike Signature Field"

Choose **Wrike Signature Field** from the dropdown. This marks the variable as a TurboSign signature anchor that will be used to place signature elements in the generated document.

![Select Wrike Signature Field](/img/wrike-integration/SigAnchor06-SelectWrikeSignatureField.jpeg)

### Step 6: Save Changes

The field now shows **TurboSign Signature Anchor**. Click **Save Changes** to persist the configuration.

![Save Changes](/img/wrike-integration/SigAnchor07-SaveChanges.jpeg)

Your signature anchor is now configured. The variable will show a **Signature Anchor** tag to confirm it's set up correctly.

![Signature Anchor Complete](/img/wrike-integration/SigAnchor08-Complete.jpeg)

:::tip
Repeat steps 3–6 for each signature variable in your template (e.g., `{SalesSignerName}`, `{SalesSignerSignature}`, `{ClientSignerName}`, etc.). See [Example Signature Workflow With TurboSign](./signature-workflow.md) for the full list of required anchor fields.
:::
