---
title: Managing Bundles
sidebar_position: 4
description: Group products into TurboQuote bundles sold at one price, with item and bundle discounts, a price per billing type, and control over what customers see on the quote.
keywords:
  - turboquote
  - bundles
  - product bundle
  - bundle pricing
  - bundle discount
  - package pricing
  - TurboDocx
---

# Managing Bundles

A bundle is a set of products sold together at one price. When a rep adds a bundle to a quote, all of its items come with it.

## What You'll Accomplish

By the end of this guide, you will know how to:

- 📦 **Read the Bundles page**, with a price for each billing type
- ⚙️ **Set what customers see**: the bundle's items, and each item's price
- 💲 **Price a bundle** with item discounts and a bundle discount
- 🗂️ **Hide, duplicate or delete** a bundle

<br/>

## The Bundles Page

In the sidebar, open **TurboQuote** and click **Bundles**. Each bundle shows its category, SKU and description, how many items it has, and its price. A bundle that mixes billing types shows **one price per billing type**, for example a one-time amount and a monthly amount, rather than one total.

Click **New bundle** to create one, or click a bundle's name to edit it.

![The Bundles page in card view, with the New bundle button and a bundle priced one-time, monthly and yearly](/img/turboquote/bundles/01-bundles.png)

<br/>

## Step 1: Fill In the General Tab

**Instruction:**

1. Enter the **Name**, an optional **SKU** and a **Category** (type a name to create a new one).
2. Optionally add a **Description**, shown under the name in lists and on the bundle's quote line.
3. Choose what customers see:
   - **Show the items to customers**: off, the quote shows one line with the bundle's name. On, the bundle's items are listed under it.
   - **Show each item's price**: off, items are listed as **Included** and the bundle is priced as a whole.
4. **In the catalog**: hidden bundles can't be added to new quotes.
5. **Keep prices in sync with the products**: item list prices follow the catalog. A hidden product drops out of the price until it's shown again.

![The General tab of a bundle with its customer visibility and catalog switches](/img/turboquote/bundles/02-bundle-general.png)

:::note Hiding item prices on a mixed bundle
When a bundle's item prices are hidden, the quote still shows a total for each billing type. If the bundle mixes billing types, the customer can see how much of it is billed each way. The quote builder warns the rep when this happens.
:::

<br/>

## Step 2: Add Items and Set the Price

**Instruction:**

1. Open the **Items & pricing** tab.
2. Click **Add products** and pick the products to include.
3. For each item, set the **Quantity**, the **Billing**, and a **Discount / unit** as a percentage or an amount. The **Final / unit** and **Line total** update as you type.
4. Optionally enter a **Bundle discount** in the totals panel, as a percentage or an amount.
5. Click **Save changes**.

![The Add products button on the Items & pricing tab](/img/turboquote/bundles/04-bundle-add-products.png)

The price is built in three steps: the list price from the catalog, minus each item's discount, then the bundle discount comes off the total. When items bill differently, the bundle discount is shared across them the same way a quote does it. The **Bundle price** shows the result for each billing type, with how much the customer saves.

![The totals panel: list total, after item discounts, bundle discount and the bundle price per billing type](/img/turboquote/bundles/03-bundle-items.png)

:::tip Changing the currency
The **Currency** next to the item search sets the bundle's currency. Switching it clears an amount-based bundle discount, because that amount was in the old currency. A percentage carries over.
:::

<br/>

## Hide, Duplicate or Delete a Bundle

- The **In the catalog** switch on each bundle hides it from new quotes without deleting it. The **All**, **In catalog** and **Hidden** tabs filter the list.
- Click the **⋮** button on a bundle to **Edit**, **Duplicate** or **Delete** it. **Duplicate** asks for the name of the copy, which starts as **Copy of …**.

<br/>

## Summary

1. A bundle sells several products at **one price**, shown **per billing type**
2. Choose whether customers see the **items** and each **item's price**
3. The price is the **list price**, minus **item discounts**, minus the **bundle discount**
4. Use **In the catalog** to hide a bundle without deleting it

## Related

- [Adding a New Product](./Adding-a-New-Product.md)
- [Creating a New Quote](./Creating-a-New-Quote.md)
- [Bulk Importing from a Spreadsheet](./Bulk-Importing-from-a-Spreadsheet.md)
