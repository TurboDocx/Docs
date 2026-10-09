---
title: How to Use a PDF as a Signature Template
sidebar_position: 1.5
description: Upload a PDF as a TurboSign template, add signers and signature fields once, and save that setup so every future send starts ready to sign.
keywords:
  - pdf signature template
  - reusable signature template
  - save signature setup
  - turbosign pdf template
  - e-signature template
  - signature fields
---

# How to Use a PDF as a Signature Template

Have a PDF you send for signature again and again, like an NDA? Upload it once as a template,
place the signers and signature fields, and save that setup. Every time you open the template
after that, the signers and fields are already in place.

A PDF template is **for signatures only**. It has no `{variables}` and can't be used to generate
a document. To fill in text automatically, use a Word or PowerPoint template instead — see
[How to Create a Template](/docs/TurboDocx-Templating/How-to-Create-a-Template).

## Step 1: Upload your PDF

1. Go to **Templates** in the left sidebar, then click **New Template** in the top right.

![Templates page with the New Template button highlighted](/img/pdf_signature_templates/01_new_template.png)

2. Click **Upload Template** and choose your PDF (or drag and drop it onto the card).

![Create Template page with the Upload Template card highlighted](/img/pdf_signature_templates/02_upload_template.png)

TurboDocx creates the template and opens it on the **Prepare & Sign** tab.

## Step 2: Add a signer

1. Click **Add Recipient**.

![Prepare & Sign tab with the Add Recipient button highlighted](/img/pdf_signature_templates/03_add_recipient.png)

2. Enter the signer's **Name** and **Email**, then click **Add**.

![Add Recipient dialog with a name and email filled in and the Add button highlighted](/img/pdf_signature_templates/04_recipient_details.png)

:::tip
Add a recipient for everyone who signs this document every time. You can still change the name
and email before each send.
:::

## Step 3: Place the signature fields

1. With the signer selected, drag **Signature** from the field list onto the PDF.

![Field list for the selected signer with the Signature field highlighted](/img/pdf_signature_templates/05_signature_field.png)

2. Drop it where the signer should sign. Drag it again to move it, or use its **×** to remove it.

![A Signature field placed on the signature line of the PDF, highlighted](/img/pdf_signature_templates/06_field_placed.png)

Add any other fields the signer needs the same way (Date, Initials, Full name, and so on).

## Step 4: Save the setup to the template

1. Click the **⋮** button in the top right corner.

![Top right of the page with the three-dot menu button highlighted](/img/pdf_signature_templates/07_more_menu.png)

2. Click **Save signature setup to template**.

![Menu open with Save signature setup to template highlighted](/img/pdf_signature_templates/08_save_setup.png)

A message confirms the setup was saved.

![Confirmation message: Signature setup saved to this template](/img/pdf_signature_templates/09_setup_saved.png)

:::note
Only **Administrators** and **Contributors** can save or delete a template's signature setup.
Anyone who can send documents can still use the saved setup.
:::

## Step 5: Reuse it next time

1. Go to **Templates** and click your PDF template.

![Templates list filtered to the Mutual NDA template, with its tile highlighted](/img/pdf_signature_templates/11_open_template.png)

2. The signers and fields you saved are already in place. Review them, then click
   **Get It Signed** to send.

![Template reopened with the saved signer already listed, highlighted](/img/pdf_signature_templates/12_setup_prefilled.png)

To finish sending, follow [How to Get a Document Signed with TurboSign](/docs/TurboSign/Setting-up-TurboSign).

## Change or remove the saved setup

- **To change it:** open the template, adjust the signers or fields, and click
  **⋮ → Save signature setup to template** again. The new setup replaces the old one.
- **To remove it:** click **⋮ → Delete signature setup from template**, then confirm.
  The template goes back to having no signers or fields.

![Menu open with Delete signature setup from template highlighted](/img/pdf_signature_templates/10_delete_setup.png)

## Related

- [How to Get a Document Signed with TurboSign](/docs/TurboSign/Setting-up-TurboSign)
- [PDF signature templates in the API](/docs/TurboDocx-Templating/API-Templates#pdf-signature-templates)
