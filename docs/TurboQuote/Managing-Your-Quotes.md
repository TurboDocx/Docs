---
title: Managing Your Quotes
sidebar_position: 2
description: Find, filter, sort and act on quotes from the TurboQuote Quotes page, read the summary cards, and renew, void, decline or delete a quote.
keywords:
  - turboquote
  - quotes list
  - quote pipeline
  - filter quotes
  - sort quotes
  - expired quote
  - renew quote
  - void quote
  - delete quote
  - TurboDocx
---

# Managing Your Quotes

The **Quotes** page is where every quote you have made lives. It shows what your open pipeline is worth, lets you find any quote in a few keystrokes, and gives each quote a menu with the actions that make sense for its status.

## What You'll Accomplish

By the end of this guide, you will know how to:

- 📊 **Read the summary cards** at the top of the page
- 🗂️ **Switch between status tabs**, including the **Expired** tab
- 🔎 **Search, filter and sort** the list
- 🃏 **Switch between table and card view**
- ⚙️ **Use the quote menu** to edit, rename, duplicate, renew, void, decline or delete a quote

<br/>

## Opening the Quotes Page

TurboQuote has its own section in the left sidebar. Hover over the sidebar to expand it, then click **Quotes**. The same section holds **Companies**, **Products**, **Bundles**, **Price Books** and **Manage Categories**.

![The TurboQuote section of the sidebar with Quotes, Companies, Products, Bundles, Price Books and Manage Categories](/img/turboquote/quotes/00-turboquote-menu.png)

<br/>

## The Summary Cards

The row of cards at the top sums up the quotes on the page. They follow your search and filters, so you can see what a single company or rep's pipeline is worth. They don't change with the status tab, since they already split quotes by status.

| Card | What it counts |
|---|---|
| **Open pipeline** | The value of draft and sent quotes that have not expired |
| **Active quotes** | How many draft and sent quotes have not expired |
| **Won** | Accepted quotes, with the number declined beside it |
| **Monthly recurring** | Monthly-billed items on accepted quotes |
| **Win rate** | Quotes accepted, out of all quotes accepted or declined in the last 90 days |
| **Quotes this month** | Quotes created this calendar month |

**Open pipeline** and **Monthly recurring** add up one currency at a time; the other cards count every quote, whatever its currency. Pick the currency in **Amounts in** above the cards: it lists every currency your organization quotes in, with your preferred currency picked first. With a **Currency** filter it offers only the currencies you filtered, and nothing to pick when you filter one.

![The summary cards: Open pipeline, Active quotes, Won, Monthly recurring, Win rate and Quotes this month](/img/turboquote/quotes/01-summary-cards.png)

<br/>

## Status Tabs

The tabs under the cards split your quotes by status, each with a count: **All**, **Drafts**, **Sent**, **Accepted**, **Declined**, **Voided** and **Expired**.

![The status tabs with a count beside each one](/img/turboquote/quotes/02-status-tabs.png)

:::info What "Expired" means
A quote is **expired** when it is a draft or a sent quote and its **Valid until** date has passed, or its signature request expired. An expired quote keeps its own status too, so a sent quote that ran out shows both a **Sent** and an **Expired** tag. Expired quotes are left out of the Open pipeline and Active quotes cards.
:::

<br/>

## Searching the List

Type in the search box to find a quote by its **quote number**, **name**, **company** or **contact**. The list and the summary cards update as you type.

![Searching for Contoso shows only Contoso's quotes, and the cards update to match](/img/turboquote/quotes/03-search.png)

<br/>

## Filtering the List

Click **Filter** to narrow the list. You can combine any of these:

- **Company**: one or more companies. A search box at the top finds companies and people quickly.
- **Currency**: one or more currencies.
- **Created by**: the people in your team who made the quotes, and **API keys** for quotes made through the API, the SDKs or an integration.
- **Valid until**: **This week**, **This month** or **Already passed**.

Click **Done** to apply the filters. Each active filter shows as a chip above the list; remove a chip to drop that filter, or click **Clear** in the Filter menu to remove them all.

![The Filter menu with its Company list](/img/turboquote/quotes/04-filter.png)

![Further down the Filter menu: Created by, including API keys, and Valid until](/img/turboquote/quotes/05-filter-valid-until.png)

<br/>

## Sorting the List

Click **Sort** and pick one of **Last updated**, **Date created**, **Total value**, **Valid until** or **Quote number**, then click **Done**. With **No sorting**, the newest quotes come first.

![The Sort menu with No sorting, Last updated, Date created, Total value, Valid until and Quote number](/img/turboquote/quotes/06-sort.png)

<br/>

## Table and Card View

The two buttons at the end of the toolbar switch between a **table** and **cards**. Your choice is remembered the next time you open the page.

![The quotes shown as cards](/img/turboquote/quotes/07-card-view.png)

<br/>

## The Quote Menu

Click the **⋮** button at the end of a row (or on a card) to open its menu. Only the actions that make sense for the quote's status appear. An action that can't be used right now stays in the menu, greyed out, with an **ⓘ** icon; hover it to see why.

| Action | What it does | When it's available |
|---|---|---|
| **View & send** | Opens the quote preview, where you can download the PDF or send it | Always |
| **Edit** | Opens the quote in the builder | Always |
| **Rename** | Changes the quote's name | Drafts only. See [Renaming a Quote](./Renaming-a-Quote.md) |
| **Duplicate** | Makes a new draft with the same customer and line items. You name the copy; it starts as **Copy of …** | Always |
| **Renew** | Closes an expired quote and makes a new draft with a new **Valid until** date | Sent quotes that have expired |
| **Void quote** | Withdraws a sent quote | Sent quotes |
| **Mark as declined** | Records that the customer said no | Drafts and sent quotes |
| **Delete** | Deletes the quote | Drafts, declined and voided quotes |

![The quote menu of a sent quote. Delete is greyed out with the reason "Sent quotes must be voided or declined first."](/img/turboquote/quotes/08-row-actions.png)

:::caution Sent and accepted quotes can't be deleted
A **sent** quote must be voided or declined before you can delete it, and an **accepted** quote can't be deleted at all, because a customer has signed it. The same rule applies through the API, the SDKs and n8n, which return a `409` error for these quotes.
:::

<br/>

## Renewing an Expired Quote

When a sent quote runs past its **Valid until** date, it moves to the **Expired** tab. To send the customer a fresh quote:

**Instruction:**

1. Open the **Expired** tab.
2. Click the **⋮** button on the quote and choose **Renew**.

![The Expired tab with three expired sent quotes](/img/turboquote/quotes/09-expired-tab.png)

![The Renew action in the menu of an expired quote](/img/turboquote/quotes/10-renew.png)

The **This quote has expired** dialog asks:

- **New valid until**: the date the new draft is valid until.
- **What happened to the original?**: **Void it** (it ran out without an answer; it doesn't affect your win rate) or **Mark as declined** (the customer said no; it counts in your win rate), with a reason. The customer is emailed the reason.

Click **Void and create new draft** (or **Decline and create new draft**). TurboQuote closes the original and opens a new draft with the same name, customer and line items, ready to review and send.

If the quote's **signature request** has already expired, the original can no longer be signed, so the dialog only asks for the new date and the button reads **Create new draft**.

:::tip Renewals keep the name
A renewal is the same deal re-issued, so it keeps the original quote's name. Only **Duplicate** names the new quote **Copy of …**.
:::

<br/>

## Summary

1. The **summary cards** add up the quotes you are looking at
2. **Status tabs** split quotes by status; **Expired** collects quotes past their Valid until date
3. **Search**, **Filter** and **Sort** find any quote quickly
4. The **⋮ menu** offers only the actions that fit the quote's status
5. **Renew** turns an expired quote into a new draft in one step

## Related

- [Creating a New Quote](./Creating-a-New-Quote.md)
- [Renaming a Quote](./Renaming-a-Quote.md)
- [TurboQuote SDK reference](../SDKs/quote.md), for listing, filtering and sorting quotes from code
