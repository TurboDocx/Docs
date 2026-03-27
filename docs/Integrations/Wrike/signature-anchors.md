---
title: Adding Signature Anchors
sidebar_position: 4
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

- A template uploaded to TurboDocx with signature variables (e.g., `{SalesSignerName}`, `{SalesSignerSignature}`)
- TurboSign configured in your organization (see [Setting up TurboSign](../../TurboSign/Setting%20up%20TurboSign.md))

<br/>

## Add Signature Anchors

### Step 1: Select Your Template

Navigate to your templates and select the template you want to configure with signature anchors.

![Select Template](/img/wrike-integration/FieldMap01-SelectTemplate.jpeg)

### Step 2: Open Template Preferences

Click **Edit Template & Preferences** to open the template configuration view.

![Edit Template and Preferences](/img/wrike-integration/FieldMap02-EditTemplatePreferences.jpeg)

### Step 3: Open Variable Settings

Click the settings icon on the signature variable you want to configure as an anchor.

![Open Variable Settings](/img/wrike-integration/FieldMap03-OpenVariableSettings.jpeg)

### Step 4: Open the Field Type Menu

Click the field type selector to change the variable's data source.

![Open Field Type Menu](/img/wrike-integration/SigAnchor04-OpenFieldTypeMenu.jpeg)

### Step 5: Expand Field Options

Click the icon to expand the available field type options.

![Expand Field Options](/img/wrike-integration/SigAnchor05-ExpandFieldOptions.jpeg)

### Step 6: Select "Wrike Signature Field"

Choose **Wrike Signature Field** from the options. This marks the variable as a signature anchor that TurboSign will use to place signature elements in the generated document.

![Select Wrike Signature Field](/img/wrike-integration/SigAnchor06-SelectWrikeSignatureField.jpeg)

### Step 7: Save Changes

Click **Save Changes** to persist the signature anchor configuration.

![Save Changes](/img/wrike-integration/SigAnchor07-SaveChanges.jpeg)

Your signature anchor is now configured and ready for use.

![Signature Anchor Complete](/img/wrike-integration/SigAnchor08-Complete.jpeg)

:::tip
Repeat steps 3–7 for each signature variable in your template (e.g., `{SalesSignerName}`, `{SalesSignerSignature}`, `{ClientSignerName}`, etc.). See [Signature Workflow](./signature-workflow.md) for the full list of required anchor fields.
:::
