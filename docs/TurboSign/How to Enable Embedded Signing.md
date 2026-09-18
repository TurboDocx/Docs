---
title: How to Enable Embedded Signing
sidebar_position: 6
description: Turn on embedded signing and signer identity verification for your organization, so you can embed the TurboSign signing page in your own app with an email or SMS one-time passcode.
keywords:
  - enable embedded signing
  - identity verification settings
  - one-time passcode
  - otp signing
  - e-signature settings
  - allowed embedding domains
---

# How to Enable Embedded Signing

Embedded signing lets your application take a signer straight to a TurboSign signing page instead of sending signing-link emails, and verify each signer with a one-time passcode. Before your integration can request signing URLs (see [Embedded Signing and Identity Verification](./Embedded%20Signing.md)), an organization admin turns the feature on in your E-Signature settings. This guide walks through it.

You need an **admin** account for your organization.

## Step 1: Open your E-Signature settings

From the app, go to **Settings**, open the **Organization Settings** tab, and find the **Signatures** card under **Core Features**. Click **Configure E-Signature**.

![The Organization Settings tab with the Configure E-Signature button highlighted](/img/how-to-enable-embedded-signing/01-configure-esignature.png)

## Step 2: Open the Identity Verification section

In the E-Signature Settings dialog, click **Identity Verification** in the left-hand section list.

![The E-Signature Settings dialog with the Identity Verification section highlighted](/img/how-to-enable-embedded-signing/02-identity-verification-tab.png)

## Step 3: Turn on signer identity verification and choose a channel

Under **Signer identity verification**, turn on identity verification and choose how the one-time passcode reaches the signer:

- **Email** sends the passcode to the signer's email address.
- **Text message (SMS)** sends it by text; this needs an SMS provider (for example Twilio) connected, and each SMS signer needs a mobile number.

![The Identity Verification settings with the passcode channel highlighted](/img/how-to-enable-embedded-signing/03-identity-verification-settings.png)

:::note
Identity verification is optional and set per recipient. A recipient sent without it signs with no extra step. The channel you pick here is the default for signatures created in the app; when you send through the SDK or API, you set the verification on each recipient yourself.
:::

## Step 4: Allow your app's embedding domains

If you plan to embed the signing page in an **iframe**, add your app's origin (for example `https://app.yourcompany.com`) to the **allowed embedding domains** list in these settings.

:::caution
Embedding is **deny by default**. While the list is empty, no site may frame the signing page, so the iframe stays blank until you add your origin. Use `https://` origins in production; `http://localhost` is accepted only for local development.
:::

## What's next

- [Embedded Signing and Identity Verification](./Embedded%20Signing.md) — request a signing URL, the three verification modes, and the SDK calls your backend makes.
