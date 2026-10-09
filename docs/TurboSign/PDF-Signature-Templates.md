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
[How to Create a Template](/docs/TurboDocx-Templating/How-to-Create-a-Template). Word and
PowerPoint templates can save a signature setup too: see
[How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md).

## Step 1: Upload your PDF

1. Go to **Templates** in the left sidebar, then click **New Template** in the top right.

![Templates page with the New Template button highlighted](/img/pdf_signature_templates/01_new_template.png)

2. Click **Upload Template** and choose your PDF (or drag and drop it onto the card).

![Create Template page with the Upload Template card highlighted](/img/pdf_signature_templates/02_upload_template.png)

TurboDocx creates the template and opens it on the **Prepare & Sign** tab. In the **Templates**
list, a PDF template has a red pen icon.

:::note What happens to your PDF on upload
TurboDocx prepares the PDF the same way as a PDF you upload for signature:

- **Password-protected PDFs can't be uploaded.** Remove the password and upload it again.
- **A damaged PDF is repaired** when possible. If it can't be read, you'll be asked to export it
  again.
- **Fillable form fields are flattened.** Anything typed into the PDF's own form fields becomes
  part of the page, and the form fields themselves are removed. Add TurboSign fields for anything
  the signer needs to fill in.

**Download File** on the template's page gives you this PDF.
:::

## Step 2: Add a signer

1. Click **Add Recipient**.

![Prepare & Sign tab with the Add Recipient button highlighted](/img/pdf_signature_templates/03_add_recipient.png)

2. Enter the signer's **Name** and **Email**, then click **Add**. In the same window you can
   choose the signer's identity verification, or set **Recipient Type** to **Receives a Copy**
   for someone who only gets a copy.

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

Add any other fields the signer needs the same way (Date, Initials, Full name, and so on). Click
a field to change its settings, such as whether the signer must fill it in or the value it starts
with. See [Adjust each field's settings](./Signature-Setups-on-Templates.md#step-4-adjust-each-fields-settings).

:::tip Name, message and reminders
Click **⋮ → Document Settings** to open **Signature Settings**. There you can set the **Document
Name** signers see, the **Signature Email Description** (the message in their email), and
**Reminders & expiration**. These are saved with the setup too.
:::

## Step 4: Save the setup to the template

1. Click the **⋮** button in the top right corner.

![Top right of the page with the three-dot menu button highlighted](/img/pdf_signature_templates/07_more_menu.png)

2. Click **Save signature setup to template**.

![Menu open with Save signature setup to template highlighted](/img/pdf_signature_templates/08_save_setup.png)

A message confirms the setup was saved. The setup includes the signers, every field and its
settings, CC recipients, the document name, the email message, and any reminder or expiration
settings you changed.

![Confirmation message: Signature setup saved to this template](/img/pdf_signature_templates/09_setup_saved.png)

:::note
Only **Administrators** and **Contributors** can save or delete a template's signature setup.
Anyone who can send documents can still use the saved setup.
:::

## Step 5: Reuse it next time

1. Go to **Templates** and click your PDF template.

![Templates list filtered to the Mutual NDA template, with its tile highlighted](/img/pdf_signature_templates/11_open_template.png)

2. The signers and fields you saved are already in place. Review them and change anything you
   need for this send, then click **Get It Signed** and **Confirm**.

![Template reopened with the saved signer already listed, highlighted](/img/pdf_signature_templates/12_setup_prefilled.png)

Changes you make while sending apply only to that send. The saved setup stays the same until you
save it again.

You can also start from TurboSign: click **New Signature**, pick the template on the **Templates**
tab under **Or Start with an Existing Document**, and click **Continue**. The request opens with
the saved setup filled in.

## Change or remove the saved setup

- **To change it:** open the template, adjust the signers or fields, and click
  **⋮ → Save signature setup to template** again. The new setup replaces the old one.
- **To remove it:** click **⋮ → Delete signature setup from template**, then confirm.
  The template goes back to having no signers or fields. Documents you already sent aren't
  affected.

![Menu open with Delete signature setup from template highlighted](/img/pdf_signature_templates/10_delete_setup.png)

To review the saved setup without changing it, click **⋮ → Edit Template**. The template's page
lists the signers, every field and its settings, the email, and reminders, and draws the fields on
the PDF. See [See the setup on the template's page](./Signature-Setups-on-Templates.md#see-the-setup-on-the-templates-page).

## Good to know

- **A PDF template can't generate a document.** It has no variables, so there is nothing to fill
  in. It's always sent for signature as it is.
- **The setup is used in the TurboDocx app only.** Sending the template through the
  [TurboSign API](./API-Signatures.md) uses the recipients and fields in the API request.

## Related

- [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md)
- [How to Get a Document Signed with TurboSign](/docs/TurboSign/Setting-up-TurboSign)
- [PDF signature templates in the API](/docs/TurboDocx-Templating/API-Templates#pdf-signature-templates)
