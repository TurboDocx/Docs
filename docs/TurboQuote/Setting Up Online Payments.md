---
title: Setting Up Online Payments
sidebar_position: 3
description: Connect a Stripe account to TurboQuote so your customers can pay quotes online by card, ACH, or recurring subscription. Funds are deposited directly to your account.
keywords:
  - turboquote
  - online payments
  - stripe connect
  - collect payment
  - pay quote online
  - card payment
  - ACH
  - recurring billing
  - subscription
  - disconnect stripe
  - payment activity log
  - payment troubleshooting
  - TurboDocx
---

# Setting Up Online Payments with Stripe

This guide walks you through connecting a Stripe account to TurboQuote so your customers can pay their quotes online. Once connected, every quote can carry a secure "Pay" link, payments are collected directly into **your** Stripe account, and TurboQuote keeps each quote's payment status up to date automatically.

## What You'll Accomplish

By the end of this guide you will have:

- Connected your organization's Stripe account to TurboQuote.
- Completed Stripe's onboarding so your account is enabled for charges and payouts.
- Confirmed your "Account Readiness" shows you're fully set up to collect payments.
- Understood how your customers pay a quote and how payment status is tracked.

:::tip Quick Start Promise
If you already have a Stripe account, connecting takes just a few minutes. You'll be redirected to Stripe to confirm a few business details, then returned to TurboQuote ready to get paid. Funds always go directly to your own Stripe account.
:::

## Before You Begin

You'll need:

- **Admin access** to your TurboDocx organization (only admins can connect a payment provider).
- A **Stripe account**, or the details to create one during onboarding (business name and address, a bank account for payouts, and an authorized representative's identity information).

:::note
Your customers never need a TurboDocx or Stripe account to pay — they pay on a secure, Stripe-hosted checkout page.
:::

## Step 1: Open Payment Settings in TurboQuote

From TurboQuote, navigate to **Settings → Payments**. This opens the **Payment Settings** page, where you can connect a payment provider so buyers can pay quotes online.

## Step 2: Review the Stripe Connect Option

On the Payment Settings page you'll see the **Stripe Connect** card. It lists what you'll be able to accept once connected, including:

- Credit & debit cards
- ACH bank transfers
- Automatic payouts
- Subscription (recurring) billing
- 3D Secure customer authentication

The card's status shows **Not Connected** until you finish setup. (You'll also see **Alternative Payments** and **FlexPoint** listed as "Coming soon" — additional payment options planned for the future.)

## Step 3: Start Connecting Your Stripe Account

Click **Connect Stripe Account**. TurboQuote prepares your connected account and redirects your browser to Stripe's secure onboarding flow.

## Step 4: Complete Stripe's Onboarding

On Stripe's hosted onboarding screens, confirm the details Stripe needs to enable payments for your account. Typically this includes:

- Your **business type** and details (name, address, website, industry).
- The **authorized representative's** identity information.
- A **bank account** for receiving payouts.
- Accepting Stripe's terms of service.

Work through each screen and submit. Stripe handles all verification — TurboDocx never sees or stores your bank details or identity documents.

## Step 5: Return to TurboQuote

When you finish (or exit) Stripe's onboarding, Stripe returns you to the TurboQuote **Payment Settings** page. TurboQuote re-reads your account's status and updates the **Account Readiness** meter.

## Step 6: Confirm Your Account Readiness

On the Payment Settings page, the Stripe Connect card now shows an **Account Readiness** meter with two checks:

- **Charges** — your account can accept payments.
- **Payouts** — your account can receive deposits.

Possible states:

- **Action Needed / Stripe is finishing your verification** — Stripe is still verifying your details, or a few onboarding items remain. Use **Finish Setup** to return to Stripe and complete any outstanding requirements. Verification can take a short while; check back shortly.
- **Active — fully set up to collect payments** — both Charges and Payouts are enabled. You're ready to get paid.

:::tip
You can return to **Settings → Payments** at any time to check your status or open your Stripe **Dashboard** to manage payouts, view balances, and see transaction history.
:::

## Step 7: How Your Customers Pay

Once your account is **Active**, a quote can be paid online:

1. Your customer opens the quote's secure **Pay** page.
2. They see a clear **payment timeline** — what's due today, and any recurring charges (with amounts and dates) for subscription-style quotes.
3. They click **Confirm & Pay** and complete payment on Stripe's secure, hosted checkout (card details are entered directly with Stripe — the seller never sees the card number).

## Your Customer Pays Exactly What's on the Quote They Signed

Payment happens **after** your customer signs the quote. To make sure no one is ever surprised at the payment step, TurboQuote **locks in the price the moment the quote is sent** — because that's when the PDF your customer reviews and signs is created.

In plain terms:

- When you **send** the quote, TurboQuote takes a **snapshot** of the totals on it — one-time amounts, recurring amounts, the tax rate, term, and currency. These are the exact figures printed on the PDF your customer signs.
- When they go to pay (even days later), they're charged **from that snapshot** — the prices on the document they signed.
- Quotes are locked from edits once they're sent, so the document, the snapshot, and the amount charged always match. Your customer is never billed different prices than the ones on the quote they signed.

You don't have to do anything to turn this on — it happens automatically the moment a quote is sent.

## How Tax Is Collected

If your quote has a tax rate, TurboQuote collects that tax at checkout so the amount your customer pays matches the total on the quote — not just the pre-tax subtotal.

- Your quote's **tax rate** (set on the quote) is applied at payment time. Your customer sees a clear **"Tax"** line on the secure checkout page, on top of the subtotal.
- For **subscription** quotes, the same tax rate carries onto every future renewal invoice automatically — recurring charges stay taxed, not just the first payment.
- Tax is collected into **your** account along with the sale (you're the merchant of record), so you remit it the same way you handle tax everywhere else.

:::note On exact amounts
The **prices** your customer signs are locked exactly (see above). The **tax** is the quoted rate applied at the moment of payment. On quotes with **more than one billing line**, the tax total can differ by **a cent or two** from the figure printed on the PDF — each line is taxed and rounded to the cent on its own, then added up, which can land a penny away from rounding the whole subtotal once. (For example, three $33.33 lines at 8.5% total $8.49 in tax line-by-line, versus $8.50 on the rounded-once subtotal.) The **subtotal** your customer signs is always charged exactly, and single-line quotes never drift.
:::

:::tip Where does the tax rate come from?
TurboQuote uses the flat tax rate on the quote itself — there's no separate tax setup to configure. (Address-based automatic tax calculation is planned for a future release; when a quote uses it, the quote will say _"taxes are calculated during payment for applicable jurisdictions"_ instead of showing a fixed amount.)
:::

## Step 8: Track Payment Status Automatically

After a customer pays, TurboQuote updates the quote's payment status automatically — no manual reconciliation. A successful payment marks the quote as **paid**; failed or overdue payments are reflected too, so you always know where each quote stands. Funds settle into your connected Stripe account on your normal payout schedule.

## Step 9: Review Your Payment Activity

Once connected, the Stripe Connect card includes a **Payment activity** log — a running, newest-first timeline of the key moments between TurboQuote and Stripe for your organization. Each entry shows what happened, the outcome, and when. You'll see events such as:

- **Connected** — your payment account was connected.
- **Checkout created** — a pay link was generated for a quote you sent.
- **Payment succeeded** / **Payment failed** — the outcome of a customer's payment, as reported by Stripe.
- **Subscription canceled** — a recurring payment lapsed or was canceled.
- **Disconnected** — your payment account was disconnected.

Use the **refresh** icon on the Payment activity panel to pull the latest entries. This log is your at-a-glance record of payment activity without leaving TurboQuote — a quick way to confirm a payment came through or to see when a pay link was created.

## Troubleshooting Payments

If payments aren't behaving as expected, the Payment Settings page gives you everything you need to self-diagnose before contacting support.

- **Your connected account ID** is shown on the Stripe Connect card (for example, `acct_…`), with a copy button. This is the exact identifier Stripe support and the TurboDocx team use to look up your account — have it ready if you reach out.
- Expand **Having trouble collecting payments?** to see a quick diagnostics panel:
  - **Charges enabled** and **Payouts enabled** — whether your account can take payments and receive deposits.
  - **Requirements due** — anything Stripe still needs from you (complete these in Stripe to enable payments).
  - **Last checked** — when TurboQuote last read your status, plus a **Refresh status** button to re-check on demand. If you just finished verification in Stripe, click **Refresh status** to confirm your account is now active without reloading the page.
- The **Payment activity** log (above) shows whether recent payments succeeded or failed.

:::tip
Most "I can't collect payments" issues are an incomplete Stripe onboarding — check **Requirements due** first, finish them in Stripe, then **Refresh status**.
:::

## Disconnecting Your Payment Account

You can disconnect your payment provider at any time — for example, to switch accounts or pause online payments.

1. On the Stripe Connect card, scroll to the bottom and click **Disconnect account**.
2. A confirmation dialog explains what happens and shows the account you're disconnecting. Review it, then click **Disconnect**.

**What disconnecting does:**

- You **won't be able to collect online payment on new quotes** until you reconnect.
- **Pay links you've already sent stay active** — customers can still complete those payments.
- **Payments already collected are unaffected**, and funds already settled remain in your Stripe account.

To start collecting again, return to **Settings → Payments** and connect an account as in Step 3. Reconnecting your original Stripe account links it right back.

:::note
Disconnecting only removes the connection between TurboQuote and your provider — it does not close or delete your Stripe account.
:::

## Summary

You connected your Stripe account to TurboQuote, completed Stripe's onboarding, and confirmed your account is **Active** for charges and payouts. Your customers can now pay quotes online by card, ACH, or recurring subscription, with funds deposited directly to your account and payment status tracked automatically.

You also know how to review your **Payment activity** log, troubleshoot with the connected account ID + **Refresh status**, and **disconnect** your account when needed.

**Next steps:**

- Create or open a quote and share its **Pay** link with your customer.
- Visit your Stripe **Dashboard** (from Settings → Payments) to view balances and payouts.
- Check the **Payment activity** log under Settings → Payments to confirm payments and track activity.
- Manage, disconnect, or revisit your connection any time under **Settings → Payments**.
