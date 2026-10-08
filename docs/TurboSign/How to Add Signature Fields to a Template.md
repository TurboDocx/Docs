---
title: How to Add Signature Fields to a Template
sidebar_position: 1.5
description: "Turn the placeholders in a Word or PowerPoint template into TurboSign signature fields, assign them to signers, add CC recipients, and pre-fill or lock values, so every document you create from the template is ready to send for signature."
keywords:
  - turbosign template signature fields
  - signature fields on a template
  - template signers
  - assign signature field to signer
  - pre-filled signature fields
  - locked signature field
  - cc recipients template
  - reusable signature setup
  - e-signature template
---

# How to Add Signature Fields to a Template

If you send the same kind of document for signature again and again (a contract, an offer letter, an order form), you can set up the signing once, on the template. You tell TurboDocx which placeholders are signature fields and who signs each one. Every document you then create from that template opens with the signers already added and the fields already placed where the placeholders are.

This guide shows you how to:

- Add the **signers** for a template, and any **CC** recipients who should get a copy
- Turn a placeholder such as `{client_signature}` into a **signature field** and assign it to a signer
- **Pre-fill** a field with a default value, and **lock** it so the signer can't change it
- Check that it all comes through when you create a document from the template

:::note Before you start
You need a template that already contains a placeholder for each place someone signs or fills something in, for example `{client_signature}`, `{client_name}` and `{client_date}`. If you haven't made one yet, see [How to Create a Template](/docs/TurboDocx%20Templating/How%20to%20Create%20a%20Template).

The example in this guide is a consulting agreement signed by the client and then by the provider.
:::

## Step 1: Open the Signers settings for your template

1. On the **Templates** page, find your template. You can type its name in the search box at the top.
2. Click the **•••** button on the template's card, then click **Edit Template & Preferences**. The template's **Details** page opens.

   ![Templates page with the ••• menu of a template card open and the Edit Template and Preferences item highlighted](/img/turbosign/template-signature-fields/00-open-template-details.png)

   :::note
   Clicking the card itself opens the page for creating a document from the template, not the **Details** page.
   :::

3. On the **Details** page, click the **...** button at the top right, next to **Edit**.
4. In the menu, click **Signers**.

![Template details page with the ... menu open and Signers highlighted](/img/turbosign/template-signature-fields/01-template-menu-signers.png)

## Step 2: Add your signers

The **Signers** window lists the people who sign documents made from this template, in signing order.

1. Click **Add Signer**.

   ![Signers window with no signers yet and the Add Signer button highlighted](/img/turbosign/template-signature-fields/02-add-signer.png)

2. A signer called **Signer 1** appears. Click the **pencil** button on its row, then type the signer's **Name** and **Email**.

   ![Signer 1 being edited with the Name and Email boxes highlighted](/img/turbosign/template-signature-fields/03-signer-name-email.png)

3. Click **Add Signer** again for each other person who signs, and fill in their name and email the same way.

Changes save as you type.

:::tip Signing order
Signers sign in the order shown, so signer **1** signs first. To change the order, drag a signer by the handle on the left of its row.
:::

:::note Names and emails can change later
The names and emails you enter here are only defaults. You can still change them, or add more signers, when you send a document. If you leave a signer's email as the placeholder address (it ends in `@example.invalid` and is marked **placeholder**), TurboSign won't send the document until you replace it with a real one.
:::

## Step 3: Add CC recipients (optional)

CC recipients get a copy of the completed document, but they don't sign.

1. In the **CC** section at the bottom of the **Signers** window, type an email address.
2. Click **Add CC**.

![CC section with an email address typed in and the Add CC button highlighted](/img/turbosign/template-signature-fields/04-add-cc.png)

You can add up to 15 CC recipients. A signer can't also be a CC recipient.

When your signers and CC recipients are set, click **Done**.

![Signers window with two signers and one CC recipient, and the Done button highlighted](/img/turbosign/template-signature-fields/05-signers-done.png)

## Step 4: Turn a placeholder into a signature field

On the **Details** page, each placeholder in your template has its own card under **Template Variables**.

1. Find the card for the placeholder you want to turn into a signature field, for example `{client_signature}`.
2. Click the **•••** button at the right of its **Default Value** box.
3. In the menu, click **Signature Field**.

   ![Variable menu for client_signature with Signature Field highlighted](/img/turbosign/template-signature-fields/06-signature-field-menu.png)

4. In the **Signature field** window, choose the **Field type** (for example **Signature**) and the **Signer** who fills it in.

   ![Signature field window with the Field type and Signer menus highlighted](/img/turbosign/template-signature-fields/07-assign-dialog.png)

5. Click **Assign**.

The card now shows the **TurboSign** label, the field type and the signer's name.

![client_signature card now showing it is a Signature field assigned to Jordan Lee](/img/turbosign/template-signature-fields/08-signature-field-card.png)

Repeat these steps for every placeholder that should be filled in at signing time. In the example, the client gets a **Signature**, **Full Name**, **Title** and **Date** field, and the provider gets a **Signature**, **Full Name** and **Date** field.

Field types you can choose:

| Field type | What the signer does |
| ---------- | -------------------- |
| **Signature**, **Initial** | Draws or types their signature or initials |
| **Date** | Filled in with the date they sign |
| **Full Name**, **First Name**, **Last Name**, **Title**, **Company**, **Email**, **Text** | Types a value, or accepts the default you set in Step 5 |

:::tip Change or undo a signature field
Once a placeholder is a signature field, its card has a **⋮** button instead of **•••**. Click it and choose **Signature Field** to change the field type or signer, or **Revert to a normal field** to turn it back into an ordinary placeholder.
:::

## Step 5: Pre-fill a value and lock it (optional)

For the fields a signer types into (such as **Title** or **Company**), you can set a value in advance. The signer then only has to check it.

1. On the field's card, type the value in the **Default for signers** box. It saves automatically.
2. Under **Signer access**, choose:
   - **Editable** — the signer sees your value and can change it.
   - **Locked** — the signer sees your value but can't change it.

![client_title card with Chief Executive Officer typed as the default and the Locked option highlighted](/img/turbosign/template-signature-fields/10-default-and-locked.png)

A locked field shows its value to the signer, so it needs a value first. Until you type one, **Locked** is greyed out, and pointing at it tells you to add a default value. If you clear the value of a locked field, it goes back to **Editable**.

![Locked option greyed out with the message: Add a default value first. A locked field shows this value to the signer, who cannot change it.](/img/turbosign/template-signature-fields/09-locked-needs-default.png)

**Signature**, **Initial** and **Date** fields are always filled in when the person signs, so they don't have a default value.

## Step 6: Check the result on a new document

1. On the template's **Details** page, click **Create Deliverable**.

   ![Template details page with the Create Deliverable button highlighted](/img/turbosign/template-signature-fields/11-create-deliverable.png)

2. On the page that opens, click the **Signatures** tab.

   ![Generate page with the Signatures tab highlighted](/img/turbosign/template-signature-fields/12-signatures-tab.png)

Your signers, in signing order, and your CC recipients are already listed, and every signature field is placed over its placeholder in the document. Each signer's fields use that signer's colour. A locked field is marked **RO** (read-only).

![Signatures tab with Jordan Lee and Sam Rivera as recipients, legal@example.com as CC, and the signature fields placed over the signature block](/img/turbosign/template-signature-fields/13-signatures-prefilled.png)

From here, everything works like any other signature request. You can move or resize fields, change a signer's name or email, or add more fields for this document only. Fill in the template's other variables, then click **Generate And Sign** to send it.

:::tip The placeholders don't show on the signed document
Each field covers its placeholder, so text such as `{client_signature}` never shows on the document your signers see.
:::

## Finished

Your template now carries its own signing setup. Every document you create from it starts with the right signers, CC recipients and signature fields, so you don't have to place fields by hand each time.

To learn more about sending and tracking signature requests, see [Setting up TurboSign](/docs/TurboSign/Setting%20up%20TurboSign) and [Managing Your Signatures](/docs/TurboSign/Managing%20Your%20Signatures).
