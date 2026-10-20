---
title: Creating a New Quote
sidebar_position: 1
description: Create a quote in TurboQuote from start to send. Pick the customer, set the quote details, add products, bundles and custom items, then preview and send it for signature.
keywords:
  - turboquote
  - quote creation
  - create quote
  - new quote
  - custom line item
  - send quote
  - quote builder
  - professional quote
  - TurboDocx
---

# Creating a New Quote

This guide walks you through a quote from start to finish: choosing who it is for, setting its details, adding what you are selling, and sending it for signature.

## What You'll Accomplish

By the end of this guide, you will have:

- 👤 **Picked the contact** who receives and signs the quote
- 🧾 **Set the quote details**: name, number, currency, quote type, term, valid-until date and tax
- 📦 **Added products, bundles and a custom item**, with quantities and discounts
- 👀 **Previewed** the quote as your customer will see it
- ✉️ **Sent it** with reminders, ready for signature
- ✅ **Know what happens next**, from Sent to Accepted

:::tip Quick Start Promise
A quote takes a few minutes, and everything saves as you go. You can stop at any point and pick it up again from the Quotes page. 🚀
:::

<br/>

## Step 1: Start a New Quote

**Instruction:**

- On the **Quotes** page, click **New quote** in the top-right corner.

You can also start a quote from the **Create a Quote** card on the TurboDocx home screen.

![The New quote button on the Quotes page](/img/turboquote/new-quote/01-new-quote-button.png)

<br/>

## Step 2: Pick Who the Quote Is For

The **Who is this quote for?** page lists your contacts, with your **Recent customers** first. Search by name, email or company, or switch to the table view if you prefer a list.

**Instruction:**

- Click the contact who will receive and sign the quote.

![The contact picker with Recent customers and All contacts. The contact Liam Patel is selected](/img/turboquote/new-quote/02-pick-contact.png)

### Quoting someone new?

If the customer isn't in TurboQuote yet, click **Add new** and choose **New company** or **New contact**. A new company needs at least one contact, so you can add both in one go. The new contact is then picked for the quote. See [Managing Companies and Contacts](./Managing-Companies-and-Contacts.md) for the fields.

![The Add new menu with New company and New contact](/img/turboquote/new-quote/03-add-new.png)

<br/>

## Step 3: Fill In the Quote Details

The **Quote details** dialog opens for the contact you picked.

**Instruction:**

1. Type a **Quote name**. Your customer sees it on the quote and on the signature request.
2. Check the **Currency**. Only products and bundles in this currency can be added, and it can't be changed once the quote is created.
3. Choose the **Quote type**:
   - **One-time**: hardware, projects or services, with no contract.
   - **Fixed term**: recurring services for a set period. Enter the **Contract length** in months or years (up to 10 years).
   - **Auto-renewing**: renews until the customer cancels.
4. Check **Valid until**. It defaults to 30 days from today; the customer can sign until then.
5. Turn on **Tax** if you charge it, and enter the rate (0 to 100, two decimals). It is applied to the subtotal.

![The Quote details dialog with the quote name filled in](/img/turboquote/new-quote/04-quote-details.png)

![The three quote types: One-time, Fixed term and Auto-renewing](/img/turboquote/new-quote/05-quote-type.png)

### The quote number

The **Quote number** shows the number this quote will get. It is assigned when you create the quote. To change the format, click **Edit numbering**: the **Quote numbering** dialog is the same as **Settings › Quote numbering** and shows the next numbers as you edit. Changes apply to quotes created from then on. See [How to Configure Quote Numbering](./How-to-Configure-Quote-Numbering.md).

![The Quote numbering dialog with a preview of the next quote number](/img/turboquote/new-quote/06-numbering.png)

**Instruction:**

- Click **Create quote**.

![The Create quote button](/img/turboquote/new-quote/07-create-quote.png)

<br/>

## Step 4: Add What You're Selling

The quote opens in the builder. The header shows the customer, valid-until date, term, tax and price book; the **Quote total** on the right updates with every change. There is no Save button: changes save automatically.

The **Line items** section has three ways to add items:

- **Add products**: from your product catalog.
- **Add bundles**: products sold together at one price.
- **Custom item**: a one-off item for this quote only.

![The empty quote builder with the Add products, Add bundles and Custom item buttons](/img/turboquote/new-quote/08-builder-empty.png)

### Add products

**Instruction:**

1. Click **Add products**.
2. Tick the products you want. You can set each one's quantity right in the list.
3. Click **Add N products**.

Prices come from the quote's **price book**, shown at the top of the dialog. The footer shows what you have selected and its total. If a product is missing, click **New product** to create it without leaving the quote.

![The Add products dialog with three products ticked and a quantity of 40 on Wireless Access Point](/img/turboquote/new-quote/09-add-products.png)

### Adjust quantities and discounts

Each line has a quantity, a unit price and a **discount per unit**. Choose **%** for a percentage or **$** for an amount off each unit. Items are grouped under their category, and you can drag a line or a whole category to reorder them.

![A line item with a quantity of 40 and a 10% discount per unit](/img/turboquote/new-quote/10-line-items.png)

The **Quote total** shows the total, how much of it recurs and for how long, and a line for each billing type. **Overall margin** shows your profit on the quote, worked out from the cost of each product. It is for you only and never appears on the quote.

![The Quote total with one-time and yearly lines, and the overall margin](/img/turboquote/new-quote/11-quote-total.png)

### Change the price book

Every new quote starts with your organization's **default** price book, shown under **Price book** in the header. To price this quote with a different book, for example partner or nonprofit pricing:

**Instruction:**

1. Click **Price book** in the header.
2. Pick the book you want. Each book shows its discount and the dates it is valid. Only books that are offered on quotes appear.
3. Click **Apply price book**.

Every catalog product on the quote is repriced from the new book, and any discount you set on those lines is reset. Bundles and custom items keep their prices. If a book changes after you applied it, the dialog says so; click **Apply again** to pick up the new prices. To stop using a price book, click **Remove price book**: the quote keeps its current prices.

See [Managing Price Books](./Managing-Price-Books.md) to set up the books themselves.

<br/>

## Step 5: Add a Custom Item (Optional)

Use a custom item for something you sell once, such as a site survey. It lives on this quote only and is not added to your catalog.

**Instruction:**

1. Click **Custom item**.
2. On the **General** tab, enter the **Name**, an optional **SKU**, the **Category** and the **Billing**, and an optional **Description**.
3. On the **Pricing** tab, enter the **Unit price** and, optionally, **Your cost** to see the margin. A custom item always uses the quote's currency.
4. On the **Images** tab, add up to **3 images** (JPEG or PNG, up to 2 MB each). Drag them by their grip to change the order; the quote shows them side by side in that order.
5. Click **Add to quote**.

![The General tab of a new custom item](/img/turboquote/new-quote/12-custom-item.png)

![The Pricing tab with the unit price, your cost and the margin](/img/turboquote/new-quote/13-custom-item-pricing.png)

![The Images tab with one image and a preview of how it looks on a quote](/img/turboquote/new-quote/14-custom-item-images.png)

The item is added at quantity 1 with no discount, and carries a **Custom** tag. Set its quantity and discount in the table like any other line. To change its name, price or images later, click its **⋮** button and choose **Edit**.

![The custom item in the line items, tagged Custom](/img/turboquote/new-quote/15-custom-item-row.png)

![The custom item's menu with Edit and Remove](/img/turboquote/new-quote/16-custom-item-menu.png)

<br/>

## Step 6: Add Bundles (Optional)

**Instruction:**

1. Click **Add bundles**.
2. Tick the bundles you want and set their quantity.
3. Click **Add N bundles**.

Each bundle shows its price for each billing type, so you can see what the customer pays once and what recurs.

![The Add bundles dialog with Remote Team Kit ticked](/img/turboquote/new-quote/17-add-bundles.png)

<br/>

## Step 7: Change the Details Later (Optional)

Click **Edit details** in the header to change the quote type, contract length, **Valid until** or **tax**. To rename the quote, click its name at the top of the page. The currency is fixed once a quote is created.

![The Edit quote details dialog with the Tax switch](/img/turboquote/new-quote/18-edit-details.png)

<br/>

## Step 8: Preview the Quote

**Instruction:**

- Click **Preview & send** in the top-right corner.

![The Preview & send button](/img/turboquote/new-quote/19-preview-send-button.png)

The preview shows the quote exactly as your customer will see it, including images on custom items. From the bar at the bottom you can go back with **Edit quote**, **Download PDF**, or **Send quote**.

![The quote preview with Download PDF and Send quote](/img/turboquote/new-quote/20-preview.png)

<br/>

## Step 9: Send the Quote

**Instruction:**

1. Click **Send quote**.
2. Check the recipient under **To**. They receive an email with a link to review and sign the quote.
3. Optionally, add **CC** addresses (up to 15). CC'd people get a copy when the quote is signed; they can't sign.
4. Open **Reminders & expiration** to change the defaults for this quote:
   - **Send reminder emails**: when the first reminder goes out, how often after that, and how many reminders each signer gets (or **No limit**).
   - **Expire the signature request**: makes the signing link stop working on the quote's **Valid until** date. Reminders stop on that date either way.
5. Click **Send quote**.

![The Send quote dialog](/img/turboquote/new-quote/21-send-dialog.png)

![Reminders & expiration, with reminder emails turned on](/img/turboquote/new-quote/22-reminders.png)

These settings apply to this quote only. To change your team's defaults, go to **E-signature settings**.

<br/>

## What Happens After You Send

Sending a quote creates a **TurboSign** signature request with the quote attached and emails it to the recipient. From there:

1. **The quote moves to Sent.** You'll find it on the **Sent** tab of the Quotes page. It can no longer be edited or renamed.
2. **The customer reviews and signs.** The email links to the quote, where the recipient reads it and signs to accept it. Any reminders you set go out on schedule until they sign or the quote's **Valid until** date passes.
3. **Signing accepts the quote.** As soon as the signature is complete, the quote moves to **Accepted** and counts towards your **Won**, **Monthly recurring** and **Win rate** cards. CC'd people get a copy of the signed quote.

If things don't go to plan:

- **The customer says no.** Choose **Mark as declined** from the quote's **⋮** menu.
- **You need to withdraw it.** Choose **Void quote**. Voiding the signature request in TurboSign voids the quote too.
- **The Valid until date passes first.** The quote moves to the **Expired** tab. Choose **Renew** to close it and make a new draft. See [Managing Your Quotes](./Managing-Your-Quotes.md#renewing-an-expired-quote).

<br/>

## Summary

You've created and sent a quote in TurboQuote! Here's a recap:

1. Started a quote with **New quote** and picked the **contact** who signs it
2. Set the **quote details**: name, currency, quote type, term, valid-until date and tax
3. Added **products**, **bundles** and a **custom item**, with quantities, discounts and the right **price book**
4. **Previewed** the quote and **sent** it with reminders

Track it from the [Quotes page](./Managing-Your-Quotes.md): it moves to **Sent**, then to **Accepted** once your customer signs.

