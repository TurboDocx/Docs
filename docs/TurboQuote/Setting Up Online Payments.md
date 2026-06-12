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

## Step 8: Track Payment Status Automatically

After a customer pays, TurboQuote updates the quote's payment status automatically — no manual reconciliation. A successful payment marks the quote as **paid**; failed or overdue payments are reflected too, so you always know where each quote stands. Funds settle into your connected Stripe account on your normal payout schedule.

## Summary

You connected your Stripe account to TurboQuote, completed Stripe's onboarding, and confirmed your account is **Active** for charges and payouts. Your customers can now pay quotes online by card, ACH, or recurring subscription, with funds deposited directly to your account and payment status tracked automatically.

**Next steps:**

- Create or open a quote and share its **Pay** link with your customer.
- Visit your Stripe **Dashboard** (from Settings → Payments) to view balances and payouts.
- Manage or revisit your connection any time under **Settings → Payments**.
