---
title: E-Signature Automation
sidebar_position: 4
description: Configure a Wrike automation to automatically generate documents and send them for e-signature using TurboSign.
keywords:
  - wrike e-signature automation
  - wrike turbosign automation
  - wrike automated signing
  - wrike signature workflow
  - wrike document signing
---

# E-Signature Automation

After [setting up your Wrike automation](./setting-up-automation.md) with a trigger status and folder, follow these steps to configure it to generate documents and automatically send them for e-signature.

<br/>

## Configure E-Signature Automation

### Step 1: Select Send for E-Signature

Click the **Send for e-signature** action card to select it as the automation action.

![Select E-Signature Action](/img/wrike-integration/SigAuto01-SelectESignature.jpeg)

### Step 2: Proceed to Signer Configuration

Click **Next** to continue to the signer configuration step.

![Click Next](/img/wrike-integration/SigAuto02-ClickNext.jpeg)

<br/>

## Configure Signers

### Step 3: Select the First Recipient's Email Field

Select the Wrike field that contains the first recipient's email address. This field will be read from the Wrike task to determine who receives the signature request.

![Select Recipient Email](/img/wrike-integration/SigAuto03-RecipientEmail.jpeg)

### Step 4: Select the Recipient's Name Field (Optional)

Optionally, choose the field that represents the name of the recipient. This will be used in the signature request email.

![Select Recipient Name](/img/wrike-integration/SigAuto04-RecipientName.jpeg)

### Step 5: Add Additional Signers (Optional)

Optionally, add additional signers if your document requires multiple signatures.

![Add Additional Signers](/img/wrike-integration/SigAuto05-AddSigners.jpeg)

<br/>

## Map Document Fields

### Step 6: Add a Document Field

Click **Add Field** to begin mapping document fields that the signer will need to fill out.

![Add Field](/img/wrike-integration/SigAuto06-AddField.jpeg)

### Step 7: Choose Document Fields

Click and choose the document field(s) that need to be completed by the signer.

![Choose Document Fields](/img/wrike-integration/SigAuto07-ChooseDocField.jpeg)

### Step 8: Select the Field Type

Select the specific field type for the document field (e.g., signature, date, text).

![Select Field Type](/img/wrike-integration/SigAuto08-ChooseDocField2.jpeg)

### Step 9: Set the Anchor Tag

Change the anchor tag to match the placeholder in your template (e.g., `{SalesSigner}`). This tells TurboSign where to place the field in the generated document.

![Set Anchor Tag](/img/wrike-integration/SigAuto09-ChangeAnchorTag.jpeg)

:::caution Anchor Tags Must Match Your Template
The anchor tag you set here **must exactly match** the corresponding variable in your document template. If they don't match, TurboSign won't be able to place the signature field. See [Adding Signature Anchors](./signature-anchors.md) for how to configure these in your template.
:::

### Step 10: Map Additional Document Fields (Optional)

Optionally, repeat the process to map more document fields for the signer.

![Map More Fields](/img/wrike-integration/SigAuto10-MapMoreFields.jpeg)

<br/>

## Post-Signature Settings

### Step 11: Choose Where the Signed Document Gets Attached

Select where the signed document should be attached after all signatures are complete.

![Attach Signed Document](/img/wrike-integration/SigAuto11-AttachSignedDoc.jpeg)

### Step 12: Choose a Post-Signature Task Status (Optional)

Optionally, choose which status the triggering Wrike task should be changed to after the signature is completed.

![Choose Post-Signature Status](/img/wrike-integration/SigAuto12-ChooseStatus.jpeg)

### Step 13: Select the Completed Status

Select the status to apply (e.g., **Completed**) so your Wrike workflow advances automatically after signing.

![Select Completed Status](/img/wrike-integration/SigAuto13-SelectCompleted.jpeg)

### Step 14: Configure Notifications (Optional)

Optionally, choose who gets tagged or notified after a signature is completed.

![Configure Notifications](/img/wrike-integration/SigAuto14-Notifications.jpeg)

<br/>

## Finalize the Automation

### Step 15: Proceed to Final Step

Click **Next** to advance to the automation creation step.

![Click Next](/img/wrike-integration/SigAuto15-ClickNext.jpeg)

### Step 16: Create the Automation

Click **Create Automation** to save and activate your e-signature automation workflow.

![Create Automation](/img/wrike-integration/SigAuto16-CreateAutomation.jpeg)

<br/>

## What's Next?

- **[Add signature anchors](./signature-anchors.md)** to your template if you haven't already
- **[Map Wrike fields](./field-mapping.md)** to template variables for static data
- If something isn't working, see [Troubleshooting and FAQ](./troubleshooting.md)
