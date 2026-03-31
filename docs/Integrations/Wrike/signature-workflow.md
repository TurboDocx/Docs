---
title: Example Signature Workflow With TurboSign
sidebar_position: 8
description: A complete end-to-end example of setting up automated document generation and e-signature from Wrike using TurboDocx and TurboSign.
keywords:
  - wrike signature workflow
  - wrike turbosign
  - wrike digital signature
  - wrike e-signature
  - wrike document signing
  - wrike end to end example
---

# Example Signature Workflow With TurboSign

This page walks through a complete end-to-end example: a Wrike task triggers document generation and sends the result for e-signature — all automatically.

## Scenario

Your sales team uses Wrike to manage project proposals. When a proposal is ready, a team member changes the task status and TurboDocx automatically:

1. Generates a proposal document from a template using Wrike task data
2. Sends it to the client and seller for digital signature via TurboSign
3. Attaches the signed document back to the Wrike task
4. Updates the task status to "Completed"

![Send for Signature in Wrike](/img/wrike-integration/SendForSignatureWrike.png)

<br/>

## What You'll Need

| Requirement | Guide |
|-------------|-------|
| A Wrike account connected to TurboDocx | [Setting Up a Wrike Automation](./setting-up-automation.md) |
| A template with signature anchor variables configured | [Adding Signature Anchors](./signature-anchors.md) |
| An e-signature automation created | [E-Signature Automation](./signature-automation.md) |

<br/>

## Step 1: Prepare Your Template

### Select and Open Your Template

Navigate to your templates and select the template you want to use, then click **Edit Template & Preferences**.

![Select Template](/img/wrike-integration/FieldMap01-SelectTemplate.jpeg)

![Edit Template and Preferences](/img/wrike-integration/FieldMap02-EditTemplatePreferences.jpeg)

### Configure Signature Anchor Variables

For each signature variable in your template (e.g., `{SalesSignerName}`, `{SalesSignerSignature}`, `{ClientSignerName}`), configure it as a **Wrike Signature Field**:

1. Click the edit icon on the signature variable

![Edit Signature Variable](/img/wrike-integration/SigAnchor04-OpenFieldTypeMenu.jpeg)

2. Click the **...** menu button to see field type options

![Open Field Type Menu](/img/wrike-integration/SigAnchor05-ExpandFieldOptions.jpeg)

3. Select **Wrike Signature Field**

![Select Wrike Signature Field](/img/wrike-integration/SigAnchor06-SelectWrikeSignatureField.jpeg)

4. Click **Save Changes** — the variable will show a **Signature Anchor** tag

![Save Changes](/img/wrike-integration/SigAnchor07-SaveChanges.jpeg)

![Signature Anchor Complete](/img/wrike-integration/SigAnchor08-Complete.jpeg)

Repeat for every signature variable in your template. For the full walkthrough, see [Adding Signature Anchors](./signature-anchors.md).

![Template Default Values and AI Values](/img/wrike-integration/TurboDocxTemplateDefaultValuesAndAIValues.png)

:::caution Anchor Names Must Match
The signature anchor variable names in your template **must exactly match** the anchor tags you configure in [Step 2: E-Signature Automation](#step-2-create-the-e-signature-automation). For example, if your template has `{SalesSignerSignature}`, the anchor tag in the automation must also be `SalesSignerSignature`. If they don't match, TurboSign won't be able to place the signature fields.
:::

<br/>

## Step 2: Create the E-Signature Automation

### Set Up the Wrike Connection and Trigger

Follow [Setting Up a Wrike Automation](./setting-up-automation.md) to connect your Wrike account, choose a trigger status, and select the folder to monitor.

![Create Automation](/img/wrike-integration/Step04-CreateFirstAutomation.png)

### Select E-Signature as the Action

Choose **Send for e-signature** as the automation action.

![Select E-Signature Action](/img/wrike-integration/SigAuto01-SelectESignature.jpeg)

![Click Next](/img/wrike-integration/SigAuto02-ClickNext.jpeg)

### Configure Signers

Map the Wrike fields that contain each signer's email and name.

![Select Recipient Email](/img/wrike-integration/SigAuto03-RecipientEmail.jpeg)

![Select Recipient Name](/img/wrike-integration/SigAuto04-RecipientName.jpeg)

![Signature Fields in Wrike](/img/wrike-integration/SignatureFieldsInWrike.png)

Add additional signers if your document requires multiple signatures.

![Add Additional Signers](/img/wrike-integration/SigAuto05-AddSigners.jpeg)

### Map Document Fields to Anchor Tags

Add each document field and set the anchor tag to match the corresponding signature variable in your template.

![Add Field](/img/wrike-integration/SigAuto06-AddField.jpeg)

![Choose Document Fields](/img/wrike-integration/SigAuto07-ChooseDocField.jpeg)

![Select Field Type](/img/wrike-integration/SigAuto08-ChooseDocField2.jpeg)

![Set Anchor Tag](/img/wrike-integration/SigAuto09-ChangeAnchorTag.jpeg)

:::caution Anchor Tags Must Match Your Template
The anchor tag you set here **must exactly match** the corresponding signature anchor variable in your template from [Step 1](#step-1-prepare-your-template). If your template has `{SalesSignerSignature}`, the anchor tag here must be `SalesSignerSignature`. See [Adding Signature Anchors](./signature-anchors.md) for how to configure these in your template.
:::

Map additional fields as needed.

![Map More Fields](/img/wrike-integration/SigAuto10-MapMoreFields.jpeg)

### Configure Post-Signature Settings

Choose where the signed document gets attached, and optionally set a post-signature task status.

![Attach Signed Document](/img/wrike-integration/SigAuto11-AttachSignedDoc.jpeg)

![Choose Post-Signature Status](/img/wrike-integration/SigAuto12-ChooseStatus.jpeg)

![Select Completed Status](/img/wrike-integration/SigAuto13-SelectCompleted.jpeg)

![Configure Notifications](/img/wrike-integration/SigAuto14-Notifications.jpeg)

### Create the Automation

Click **Next**, then **Create Automation** to save and activate.

![Click Next](/img/wrike-integration/SigAuto15-ClickNext.jpeg)

![Create Automation](/img/wrike-integration/SigAuto16-CreateAutomation.jpeg)

For the full e-signature automation walkthrough, see [E-Signature Automation](./signature-automation.md).

<br/>

## Step 3: Trigger It

1. Open a Wrike task in the monitored folder
2. Make sure the task has the relevant project data and recipient email fields filled in
3. Change the task status to your trigger status
4. TurboDocx generates the document, sends it for signature, and updates the task when complete

![Generated Document Comment](/img/wrike-integration/WrikeSOWGeneratedComment.png)

<br/>

## Tips

- **Test with a single task first** before rolling out to your team
- **Use descriptive task data** — the AI uses task titles, descriptions, and custom fields to populate the template
- **Check your anchor tags** — the tags in your [E-Signature Automation](./signature-automation.md) must exactly match the variables in your template ([Adding Signature Anchors](./signature-anchors.md))
- If something isn't working, see [Troubleshooting and FAQ](./troubleshooting.md)
