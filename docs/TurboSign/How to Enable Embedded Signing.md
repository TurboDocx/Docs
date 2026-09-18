---
title: How to Enable Embedded Signing
sidebar_position: 6
description: Turn on embedded signing and signer identity verification for your organization, choose the passcode channel, allow the origins that may iframe the signing page, and understand the clickjacking and localhost rules.
keywords:
  - enable embedded signing
  - identity verification settings
  - one-time passcode
  - otp signing
  - allowed embedding domains
  - clickjacking
  - frame-ancestors
---

# How to Enable Embedded Signing

Embedded signing lets your application take a signer straight to a TurboSign signing page instead of sending signing-link emails, and verify each signer with a one-time passcode. Before your integration can request signing URLs (see [Embedded Signing and Identity Verification](./Embedded%20Signing.md)), an organization admin turns the feature on in your E-Signature settings. This guide walks through every setting.

You need an **admin** account for your organization.

## Step 1: Open your E-Signature settings

Go to **Settings**, open the **Organization Settings** tab, find the **Signatures** card under **Core Features**, and click **Configure E-Signature**.

![The Organization Settings tab with the Configure E-Signature button highlighted](/img/how-to-enable-embedded-signing/01-configure-esignature.png)

## Step 2: Open the Identity Verification section

In the E-Signature Settings dialog, click **Identity Verification** in the left-hand section list. This section has two tabs: **One-time passcode** and **Identity & embedding**.

![The E-Signature Settings dialog with the Identity Verification section highlighted](/img/how-to-enable-embedded-signing/02-identity-verification-tab.png)

## Step 3: Require a passcode and choose the channel

On the **One-time passcode** tab, turn on **Require identity verification** and choose how the passcode reaches the signer:

- **Email** sends the passcode to the signer's email address.
- **SMS** texts it. SMS needs a connected provider and a mobile number on each SMS signer, and it is offered only if your plan includes it.

![The One-time passcode tab with Require identity verification highlighted](/img/how-to-enable-embedded-signing/03-identity-verification-settings.png)

:::note
Identity verification is optional and set per recipient. A recipient sent without it signs with no extra step. The channel you pick here is the default for signatures created in the app; when you send through the SDK or API, you set verification on each recipient yourself.
:::

## Step 4: Allow external identity verification or an override

Switch to the **Identity & embedding** tab. Two optional switches change how a signer can be verified:

- **Allow external identity verification** lets an outside identity provider (for example CAPA) verify a signer. Your integration asserts the verification when it requests the signing link, instead of TurboSign sending a passcode.
- **Allow identity verification override** lets a sender send a link that **skips** verification. This is for development and testing; every signature completed this way is marked as **not identity-verified** on the certificate and in the audit trail. While it is on, the settings show a persistent banner.

![The Identity & embedding tab with the external verification and override switches highlighted](/img/how-to-enable-embedded-signing/04-identity-embedding-toggles.png)

## Step 5: Allow the origins that may embed the signing page

Under **Allowed embedding domains**, list the origins that may put the signing page in an **iframe**. This is the clickjacking control: only origins on this list can frame the page.

![The Allowed embedding domains input highlighted](/img/how-to-enable-embedded-signing/05-allowed-embedding-domains.png)

:::caution Deny by default
The list is **empty by default, which means no site can embed the signing page at all** — the iframe stays blank until you add your app's origin. Enter full `https://` origins, one per line (for example `https://app.yourcompany.com`). An empty list is the safest setting; add an origin only when you actually embed.
:::

## Step 6: localhost is for local development only

For local development you can add an `http://localhost` (or `http://127.0.0.1`) origin so you can test the iframe on your machine. When you do, the settings show a bright warning:

![The NOT FOR PRODUCTION warning shown when an http localhost origin is added](/img/how-to-enable-embedded-signing/06-localhost-http-warning.png)

:::caution Not for production
`http://` origins can be spoofed and weaken clickjacking protection, so they are for **local development and testing only**. Remove every `http://` origin and use `https://` before the configuration is used in production. Production origins must be `https`.
:::

## What your signer sees

When identity verification is on, the signer opens the embedded page and is met by the passcode gate before the document loads. They click **Send Code**, receive the one-time code by email (or SMS), enter it, and then continue to the document.

![The signer's Verify your identity gate with the Send Code button highlighted](/img/how-to-enable-embedded-signing/07-signer-otp-gate.png)

## What's next

- [Embedded Signing and Identity Verification](./Embedded%20Signing.md) — request a signing URL, the three verification modes, and the SDK calls your backend makes.
