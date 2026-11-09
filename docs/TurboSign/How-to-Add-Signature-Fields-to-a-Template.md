---
title: How to Add TurboSign Fields to a Template
sidebar_position: 1.5
description: "Turn the variables in a Word or PowerPoint template into TurboSign fields, such as a signature, date or full name. Each field is anchored to its tag, so it lands wherever the tag appears in every document you create and send from the template."
keywords:
  - turbosign fields
  - turbosign field on a template
  - use as turbosign field
  - turbosign template signature fields
  - signature fields on a template
  - template variable signature field
  - anchor signature field to variable
  - use as signature field
  - signature anchor tag
  - reusable signature setup
  - e-signature template
---

# How to Add TurboSign Fields to a Template

If you send the same kind of document for signature again and again (a contract, an offer letter, an order form), you can tell TurboDocx which variables in the template are really filled in by the signer. Those variables become **TurboSign fields**. A TurboSign field can be a signature, a date, the signer's full name, their company and more.

A variable such as `{ClientSignature}` then becomes an **anchored field**: when the document is sent, a field for the right signer goes wherever that tag appears. You don't place it by hand, and if the text moves, the field moves with it.

This guide shows you how to:

- Turn a variable into a TurboSign field from the template's page
- Anchor a field to a variable with its own size and offset, from **Edit Setup**
- Check, change or undo anchored fields

This works for **Word** and **PowerPoint** templates. To place fields at fixed spots on the page instead (and for PDF templates), see [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md). You can mix both: a signer can have anchored fields and placed fields in the same setup.

:::note Before you start
- Your template needs a variable in each place the signer fills in, for example `{ClientSignature}`. If you haven't made one yet, see [How to Create a Template](/docs/TurboDocx-Templating/How-to-Create-a-Template).
- You need permission to edit the template, and the template can't be locked.
- The template doesn't need any signers yet. If it has none, your first TurboSign field adds one called **Signer 1**.
:::

## How anchored fields work

- **Every place the tag appears gets its own field.** If `{ClientDate}` is in the first paragraph and again next to the signature, the signer fills in both.
- **One field per tag.** A tag that already has a field can't get a second one, and a tag can't belong to two signers.
- **The tag stays in the document until it's signed.** An anchored variable isn't something you fill in when you create the document. Its tag stays in the generated document, and the field covers it.
- **Documents you already made don't change.** A document generated before its tag became a TurboSign field doesn't contain the tag, so it gets no field from it.
- **A missing tag is skipped.** If someone edits the template and a tag is gone, that field is left out of the send. The send only stops if a signer would be left with no TurboSign field at all.

## Step 1: Open the template's page

1. Go to **Templates** and find your template.
2. Click the **•••** button at the bottom right of the template's card.

   ![Template card on the Templates page with its ••• button highlighted](/img/turbosign/template-signature-fields/00a-template-card-menu.png)

3. Click **Edit Template & Preferences**. The template's page opens on its **Variables** tab.

   ![Template card menu with Edit Template & Preferences highlighted](/img/turbosign/template-signature-fields/02-edit-template-preferences.png)

## Step 2: Turn a variable into a TurboSign field

1. On the **Variables** tab, find the variable, for example `{ClientSignature}`.
2. Click the **•••** button inside its **Default Value** box, then click **TurboSign field**.

   ![Variable menu on the template's Variables tab with TurboSign field highlighted](/img/turbosign/template-signature-fields/03-details-signature-field.png)

3. In the window that opens:
   - Choose the **Field type**, for example **Signature**, **Date** or **Full name**.
   - Under **Who signs here**, choose the signer. On a template with no signers yet, the list offers **1 · Signer 1**, which adds that signer for you. You can rename the signer later.
4. Click **Make TurboSign Field**.

   ![Use the tag as a TurboSign field window with the Make TurboSign Field button highlighted](/img/turbosign/template-signature-fields/04-make-signature-field.png)

The field is saved to the template's signature setup right away. The variable's card now shows a **TurboSign field** badge and the field type and signer, for example **Signature, Signer 1**. The **Signature setup** tab counts the new signer.

![ClientSignature variable card showing it is a TurboSign field for Signer 1](/img/turbosign/template-signature-fields/05-details-variable-is-signature-field.png)

Repeat for each variable a signer fills in. This way always uses the default size, which fits the tag. To set a size or an offset, use Step 3.

:::tip From the generate page
You can do the same on the page where you create a document: open the variable's **•••** menu on the **Template Variables** tab and click **Use as TurboSign field**.

![Variable menu on the generate page with Use as TurboSign field highlighted](/img/turbosign/template-signature-fields/01-use-as-signature-field.png)

The same window opens. After you click **Make TurboSign Field**, a message confirms it, for example **`{FullName}` is now a TurboSign field for Signer 1.** Click **Undo** in that message to take it back.

![Generate page with the confirmation message and its Undo button highlighted](/img/turbosign/template-signature-fields/15-made-signature-field-toast.png)

On the generate page, **Who signs here** only lists signers the template already has. If it only shows **Add a signer…**, go back to the template's page and start there, because signers you add on the generate page are for that one document only.
:::

## Step 3: Set a field's size or offset

Use **Edit Setup** when you want to set a field's size or offset, add a default value, change the signer, or anchor a tag that isn't in the variable list.

1. On the template's page, click the **Signature setup** tab, then click **Edit Setup**.

   ![Signature setup tab on the template's page with the Edit Setup button highlighted](/img/turbosign/template-signature-fields/06-signature-setup-tab.png)

2. The generate page opens on its **Signatures** tab, with the banner **Editing the template's signers.** Nothing is sent from here.
3. Under **Select a role to assign fields**, choose the signer.
4. Click **Anchor to variable**.

   ![Signatures tab in Edit setup with the Anchor to variable button highlighted](/img/turbosign/template-signature-fields/07-anchor-to-variable.png)

5. In the form that opens:
   - Choose the **Field type**, for example **Date**.
   - Under **Template variable**, choose the variable. A tag that can't be chosen says why: **Has a field**, or the name of the signer it belongs to. To type a tag that isn't listed, choose **Custom tag…** and enter it.
   - Depending on the field type, you can set a **Default value**. For a **Date** field, leave it empty to fill in the date they sign. For a **Checkbox**, choose **Ticked** or **Unticked**. Text-type fields with a default value can also be **Locked**, so signers see the value but can't change it.
   - Under **Size**, keep **Fit to tag (default)**, or choose **Custom** and enter **Width (pt)** and **Height (pt)**. **Offset right (pt)** and **Offset down (pt)** move the field away from the tag.
6. Click **Add Field**.

   ![Anchor to variable form for a Date field with a custom size and the Add Field button highlighted](/img/turbosign/template-signature-fields/08-anchor-form.png)

The field is added to the list under **Anchor to variable**, with its type and tag. A custom size shows on the row, for example **150 × 30 custom**. When the field fits the tag, no size is shown. Use the pencil button on a row to change the field (including its signer), or the trash button to remove it.

![List of anchored fields with the Date row and its custom size highlighted](/img/turbosign/template-signature-fields/09-anchored-fields-list.png)

### Work with the boxes on the preview

Each anchored field shows on the document preview as a box at every place its tag appears. The box is labelled with the signer and field type, for example **Signer 1: Signature**, and has an anchor icon in its top left corner.

- **Move a field:** drag its box. While you drag, a label shows the offset, for example **Offset from `{ClientDate}`: 22 pt right, 18 pt down**. The offset applies to every place the tag appears.
- **Resize a field:** drag the blue corner at the bottom right of the box.
- **Remove a field:** click the red **x** at the top right of the box. This removes the field from every place the tag appears.

![Dragging an anchored Date box, with the offset from the tag shown above it](/img/turbosign/template-signature-fields/10-drag-offset.png)

![Anchored Date box with its red x highlighted](/img/turbosign/template-signature-fields/10b-red-x.png)

The note under the list reminds you that anchored fields follow the text when the document is sent, so the boxes on the preview are approximate. The same boxes also show on the **Template Variables** tab and on the template's **Signature setup** tab.

To add more fields by hand, drag a field from the list below the note onto the document. Anchored fields show an anchor icon; fields you drag on are placed at a fixed spot.

### Save the setup

1. Click **Save To Template** at the top right.

   ![Edit setup with the Save To Template button highlighted](/img/turbosign/template-signature-fields/11-save-to-template.png)

2. If the template already has a saved setup, TurboDocx asks **Replace the saved signers and fields?** Click **Replace**. The template's CC, email message and reminders stay as they are.

The template's page opens again with your changes saved. To leave without saving, click **Cancel** instead.

## Check the setup on the template's page

On the template's page, click the **Signature setup** tab. The **Fields** table lists every field with its **Field**, **Signer**, **Where** and **Size**:

- An anchored field shows its tag and **every place it appears**.
- A placed field shows its page, for example **Page 1, placed**.
- **Size** shows a custom size, for example **150 × 30 custom**, and is empty when the field fits the tag.
- If a tag can no longer be found in the template (for example, someone renamed `{ClientSignature}`), the row shows **Not found in this template**. Rename the tag back in the template, or change the field in **Edit Setup**.

![Fields table on the template's Signature setup tab](/img/turbosign/template-signature-fields/12-details-fields-table.png)

## Change or undo a TurboSign field

To change a field for good, use **Edit Setup** on the template's page (Step 3) and save.

To make a TurboSign field a normal variable again:

- On the template's page, on the **Variables** tab, click the **⋮** button on the variable's TurboSign field and choose **Make it a normal variable again**.
- On the generate page, on the **Template Variables** tab, open the **•••** menu of the variable under **TurboSign fields** and choose **Make it a normal variable again**.

Both save to the template right away. The variable goes back to the list of variables you fill in.

![TurboSign fields menu on the generate page](/img/turbosign/template-signature-fields/13-signature-field-menu.png)

:::caution Changes on the generate page's Signatures tab are for that document only
On the generate page, **Edit on the Signatures tab** opens the document's **Signatures** tab. Changes you make there, such as removing a field, apply to the document you're about to send, not to the template. To save them to the template, use **Edit Setup** instead, or **⋮ → Save signature setup to template** as described in [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md).
:::

If you can't edit the template, the **TurboSign fields** list shows a **Change in the Signatures tab** link instead of the menu.

## Send a document

Fill in the template's other variables and click **Generate And Sign**, as described in [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md#use-the-saved-setup). Each anchored field is added wherever its tag appears in the generated document, assigned to its signer, alongside any fields you placed by hand.

## Related

- [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md)
- [How to Get a Document Signed with TurboSign](./Setting-up-TurboSign.md)
- [Managing Your Signatures](./Managing-Your-Signatures.md)
