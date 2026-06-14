---
title: Linking Products to Your Payment Account
sidebar_position: 4
description: Link your TurboQuote catalog products to the products in your connected payment account (Stripe), or import existing payment-account products into your catalog — so checkout reuses the same products and prices instead of creating new ones every time.
keywords:
  - turboquote
  - link product
  - import product
  - stripe product
  - stripe price
  - product catalog
  - payment account
  - catalog sync
  - reuse price
  - online payments
  - TurboDocx
---

# Linking Products to Your Payment Account

Once you've [connected a payment account](./Setting%20Up%20Online%20Payments.md) to TurboQuote, you can connect your TurboQuote catalog products to the products that already live in that account. This keeps a single, tidy product list on both sides: when a customer pays a quote, checkout **reuses** the matching product and price in your payment account instead of creating a brand-new one each time.

## What You'll Accomplish

By the end of this guide you will be able to:

- See, at a glance, which of your catalog products are linked to your payment account.
- **Link** a TurboQuote product to an existing product in your payment account.
- **Import** products you already have in your payment account into your TurboQuote catalog.
- Understand what happens when you change a product or price directly in your payment account.

:::info Before you start
You need a connected payment account that is enabled for charges. If you haven't set that up yet, follow [Setting Up Online Payments](./Setting%20Up%20Online%20Payments.md) first. Until a payment account is connected, the product catalog shows a gentle prompt to connect one — the linking tools appear only after you're connected.
:::

## Why Link Products?

When you collect payment on a quote, TurboQuote needs a product and a price in your payment account to charge against. If a catalog product isn't linked, TurboQuote creates a new product and price in your account on the fly. That works, but over time it can clutter your payment account with duplicates.

**Linking** tells TurboQuote "this catalog product *is* that product in my payment account." From then on, checkout reuses it — no duplicates, and your payment-account reports stay clean and consolidated.

## Reading the Link Status

On the **Products** page (TurboQuote → Settings → Products), each product card shows a small status chip once your payment account is connected:

| Chip | Meaning |
|------|---------|
| **Link to Stripe** (grey) | Not linked yet. Charging this product will create a new product/price in your payment account. Click to link it to an existing one. |
| **Linked: _name_** (green) | Linked to a product in your payment account. Checkout reuses it. |
| **Sync issue** (amber) | The linked product was changed or removed in your payment account. Click to re-link it. |

Click any chip to open the link dialog.

## Linking a Product

1. Go to **TurboQuote → Settings → Products**.
2. Find the product you want to link and click its **Link to Stripe** chip.
3. In the dialog, search your payment-account products and pick the one that matches.
   - Products already linked to a *different* catalog product are shown greyed out — each payment-account product can be linked to only one catalog product.
4. Click **Link**. The chip turns green and shows the linked product's name.

To **change or remove** a link, click the green **Linked** chip:

- **Change** opens the picker again so you can point the catalog product at a different payment-account product.
- **Unlink** disconnects them. Your payment-account product is left untouched — only TurboQuote's link is removed. After unlinking, charging this product will again create a new product/price.

## Importing Products from Your Payment Account

If you already have a catalog of products in your payment account, you can pull them into TurboQuote instead of re-typing them.

1. On the **Products** page, click **Import from Stripe** (top right; visible once your payment account is connected).
2. Choose the **category** the imported products should be filed under.
3. Check the products you want to import. Products already in your TurboQuote catalog are hidden — you only see ones you don't have yet.
4. Click **Import**. TurboQuote creates a catalog product for each one — copying the name, description, price, and billing frequency — and links it automatically.

:::tip Multiple prices
A payment-account product can have more than one price. TurboQuote seeds the new catalog product's price from the product's **default price** (or the first usable one) and links every compatible price so checkout can reuse them. If a product has an unusual billing cadence TurboQuote doesn't support (for example, weekly), that price is skipped — you can set a price on the product afterward.
:::

## What Happens If I Change a Product or Price in My Payment Account?

TurboQuote keeps your links honest automatically:

- **You rename a product** in your payment account → nothing breaks. TurboQuote always shows the current name when you open the picker.
- **You archive or delete a linked product** → TurboQuote notices (via a secure webhook) and marks the catalog product with a **Sync issue** chip. The next time you collect payment on it, TurboQuote creates a fresh product so the sale never fails. Re-link it to a current product whenever you like.
- **You change a price** → because prices can't be edited in place, your payment provider creates a *new* price and retires the old one. TurboQuote handles this transparently: it always charges against a live price, creating one if the old one was retired.

In short: you never have to babysit the link. Sales keep working, and a **Sync issue** chip is just a friendly nudge to re-link when convenient.

## Frequently Asked Questions

**Does linking change anything in my payment account?**
No. Linking and unlinking only affect TurboQuote's internal mapping. Your payment-account products and prices are never modified or deleted by TurboQuote.

**Can I link one payment-account product to several catalog products?**
No — each payment-account product links to a single catalog product, so reporting stays unambiguous. You'll see already-linked products greyed out in the picker.

**Do I have to link my products?**
No. Linking is optional and purely for keeping your payment account tidy. Unlinked products still charge correctly — TurboQuote just creates the product/price for them at checkout.

**Is this Stripe-only?**
The linking and import tools are built to work with any payment vendor TurboQuote supports. Stripe is the first; the same flow will apply as more vendors are added.

## Related Articles

- [Setting Up Online Payments](./Setting%20Up%20Online%20Payments.md)
- [Adding a New Product](./Adding%20a%20New%20Product.md)
- [Creating a New Quote](./Creating%20a%20New%20Quote.md)
