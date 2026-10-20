---
title: How to Add Signature Fields to a Template
sidebar_position: 1.5
description: "Turn the variables in a Word or PowerPoint template into TurboSign signature fields. Each field is anchored to its tag, so it lands wherever the tag appears in every document you create and send from the template."
keywords:
  - turbosign template signature fields
  - signature fields on a template
  - template variable signature field
  - anchor signature field to variable
  - use as signature field
  - signature anchor tag
  - reusable signature setup
  - e-signature template
---

# How to Add Signature Fields to a Template

If you send the same kind of document for signature again and again (a contract, an offer letter, an order form), you can tell TurboDocx which variables in the template are really signature fields. A variable such as `{ClientSignature}` then becomes an **anchored field**: when the document is sent, a field for the right signer goes wherever that tag appears. You don't place it by hand, and if the text moves, the field moves with it.

This guide shows you how to:

- Turn a variable into a signature field from the **Template Variables** tab
- Anchor a field to a variable from the **Signatures** tab, with its size and offset
- Check, change or undo anchored fields

This works for **Word** and **PowerPoint** templates. To place fields at fixed spots on the page instead (and for PDF templates), see [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md). You can mix both: a signer can have anchored fields and placed fields in the same setup.

:::note Where this differs from Signature Setups on Templates
[How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md) saves a setup with **⋮ → Save signature setup to template** on the generate page. When you open the setup with **Edit setup** from the template's page, as in Option 2 below, you save with **Save to template** instead. Fields made with Option 1 are saved to the template straight away.
:::

:::note Before you start
- Your template needs a variable in each place someone signs, for example `{ClientSignature}` and `{SalesSignature}`. If you haven't made one yet, see [How to Create a Template](/docs/TurboDocx-Templating/How-to-Create-a-Template).
- The template needs a saved signature setup with its signers. Add the signers and save the setup as described in [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md#step-2-add-the-signers). You can add fields later.
- You need permission to edit the template, and the template can't be locked.
:::

## How anchored fields work

- **Every place the tag appears gets its own field.** If `{ClientSignature}` is on page 1 and page 2, the client signs in both places.
- **One signer per tag.** A tag that already belongs to one signer can't be anchored to another.
- **The tag stays in the document until it's signed.** An anchored variable isn't something you fill in when you create the document. Its tag stays in the generated document, and the field covers it.
- **A missing tag is skipped.** If someone edits the template and a tag is gone, that field is left out of the send. The send only stops if a signer would be left with no signature field at all.

## Option 1: Turn a variable into a signature field (Template Variables tab)

This is the quickest way when the field only needs the default size.

1. Go to **Templates** and click your template. Its generate page opens on the **Template Variables** tab.
2. Find the variable, for example `{ClientSignature}`, and open its **variable menu**.
3. Click **Use as signature field**.
4. In the **Use {ClientSignature} as a signature field** window:
   - Choose the **Field type**, for example **Signature**.
   - Under **Who signs here**, choose the signer. If the signer isn't listed yet, choose **Add a signer…** to go to the **Signatures** tab and add them there.
5. Click **Make signature field**.

The field is saved to the template's signature setup right away. A message confirms it, for example **{ClientSignature} is now a signature field for Client.** Click **Undo** in that message to take it back.

The variable then moves out of the list of variables you fill in and into **Signature fields**, grouped by signer. The note there reads **Signers fill these in when they sign. The tag stays in the document until then.**

:::tip Change the size or signer later
Option 1 always uses the default size. You can change the size, the offset or the signer afterwards on the **Signatures** tab (Option 2).
:::

## Option 2: Anchor a field from the Signatures tab

Use this way when you want to set the field's size or offset, add a default value, or anchor a tag that isn't in the variable list.

1. Open the template's page: from the **Templates** list, open the template's menu and choose **Edit Template & Preferences**.
2. Switch to **Signature setup** and click **Edit setup**. The generate page opens on its **Signatures** tab, ready to edit the template's setup.
3. Under **Select a recipient to assign fields**, choose the signer.
4. Click **Anchor to variable**. (**Drag onto document** next to it closes the form so you can drag a field from the palette and place it by hand.)
5. In the **Anchor to variable** form:
   - Choose the **Field type**.
   - Under **Template variable**, choose the variable. A tag that already belongs to another signer is listed but can't be chosen. To type a tag that isn't in the list, choose **Custom tag…** and enter it, for example `{ClientSignature}`.
   - Optionally set a **Default value**. For a **Date** field, leave it empty to fill in the date they sign. For a **Checkbox**, choose **Ticked** or **Unticked**. Text-type fields can also be **Locked**, so signers see the value but can't change it.
   - Under **Size**, keep **Fit to tag (default)**, or choose **Custom** and enter **Width (pt)** and **Height (pt)**. **Offset right (pt)** and **Offset down (pt)** nudge the field away from the tag.
6. Click **Add field**.
7. Repeat for each field, then click **Save to template**.

The signer's anchored fields are listed under the form, each with its tag and size. Point at a row's buttons to see **Change** and **Remove**. A note explains: **Anchored fields go wherever the tag appears when the document is sent, so they follow the text if it moves. Boxes on the preview are approximate.**

On the document preview, each anchored field shows as a dashed box labelled with the field type, the signer and **approximate**. You can drag a box to move it, or drag its corner to resize it. The exact values are on the field.

## Check the setup on the template's page

On the template's page, switch to **Signature setup**. The **Fields** table lists every field with its **Field**, **Signer**, **Where** and **Size**:

- A placed field shows its page, for example **Page 2, placed**.
- An anchored field shows its tag and **every place it appears**.
- If a tag can no longer be found in the template (for example, someone renamed `{SalesSignature}`), the row shows **Not found in this template**. Rename the tag back in the template, or change the field on the **Signatures** tab.

## Change or undo a signature field

On the generate page's **Template Variables** tab, open the menu of a variable under **Signature fields**:

- **Edit on the Signatures tab** opens the field on the **Signatures** tab, where you can change its type, size, offset or signer.
- **Make it a normal variable again** removes the anchored field. The variable goes back to the list of variables you fill in.

If you can't edit the template, the menu shows **Change in the Signatures tab** instead.

## Send a document

Fill in the template's other variables and click **Generate And Sign**, as described in [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md#use-the-saved-setup). Each anchored field is added wherever its tag appears in the generated document, assigned to its signer, alongside any fields you placed by hand.

## Related

- [How to Save a Signature Setup on a Template](./Signature-Setups-on-Templates.md)
- [How to Get a Document Signed with TurboSign](./Setting-up-TurboSign.md)
- [Managing Your Signatures](./Managing-Your-Signatures.md)
