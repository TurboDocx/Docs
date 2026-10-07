---
title: Set Up Your Organization for Embedded Signing
slug: /TurboSign/how-to-enable-embedded-signing
sidebar_label: Set up your organization
sidebar_position: 2
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

# Set Up Your Organization for Embedded Signing

Embedded signing lets your application take a signer straight to a TurboSign signing page instead of sending signing-link emails, and verify each signer with a one-time passcode. Before your integration can request signing URLs (see the [overview](./index.md)), an organization admin turns the feature on in your E-Signature settings. This guide walks through every setting.

You need an **admin** account for your organization.

## Step 1: Open your E-Signature settings

Click your name at the bottom of the left sidebar and choose **Settings**. In the settings menu, click **Features and integrations**. Under **Core Features**, find the **Signatures** card and click **Configure E-Signature**.

The full path, used throughout these docs: **Settings** > **Features and integrations** > **Signatures** card > **Configure E-Signature** > **Identity Verification**.

![The Features and integrations menu link and the Configure E-Signature button on the Signatures card highlighted](/img/how-to-enable-embedded-signing/01-configure-esignature.png)

## Step 2: Open the Identity Verification section

In the E-Signature Settings dialog, click **Identity Verification** in the left-hand section list. This section has two tabs: **One-time passcode** and **Identity & embedding**. Changes in this section save as you make them, except the SMS provider form, which needs **Save SMS provider**. This section has no Save or Close button; close the dialog when you're done.

![The E-Signature Settings dialog with the Identity Verification section highlighted](/img/how-to-enable-embedded-signing/02-identity-verification-tab.png)

## Step 3: Turn on embedded signing (Enable identity verification)

On the **One-time passcode** tab, turn on **Enable identity verification**. Despite its name, this switch turns on embedded signing for every verification mode: passcodes, external identity verification and the override. While it is off, every signing URL request fails with `EmbeddedSigningNotEnabled`.

Then, under **When to verify signers**, keep **Only when requested** (a passcode only for recipients that ask for one, for example through the API) or choose **On every signature request** (every signer enters a passcode).

![The One-time passcode tab with the Enable identity verification toggle and the selected Only when requested option highlighted](/img/how-to-enable-embedded-signing/03-identity-verification-settings.png)

Choosing the passcode channel (email or SMS), connecting an SMS provider, and setting up delivery-failure alerts are covered in a dedicated guide: [Email and SMS passcode](../identity-verification/one-time-passcode.md).

:::note
With **Only when requested**, verification is set per recipient and a recipient sent without it signs with no extra step. With **On every signature request**, the method you pick applies to signatures created in the app and to documents sent through the SDK or API. Automated sends such as Pipelines and bulk signature sending are exempt.
:::

## Step 4: Allow external identity verification or an override

Switch to the **Identity & embedding** tab. Two optional switches change how a signer can be verified:

- **Allow external identity verification** lets your identity verification vendor verify a signer. Your integration asserts the verification when it requests the signing link, instead of TurboSign sending a passcode. See [External Identity Verification (IdV) for Embedded Signing](../identity-verification/external-identity-verification.md) for the request shape and provider examples.
- **Allow identity verification override** lets a sender send a link that **skips** verification. This is for development and testing; every signature completed this way is marked as **not identity-verified** on the certificate and in the audit trail. While it is on, the settings show a persistent banner.

![The Identity & embedding tab with the Allow external identity verification and Allow identity verification override switches highlighted](/img/how-to-enable-embedded-signing/04-identity-embedding-toggles.png)

## Step 5: Allow the origins that may embed the signing page

Under **Allowed embedding domains**, list the origins that may put the signing page in an **iframe**. This is the clickjacking control: only origins on this list can frame the page.

![The Identity & embedding tab with the Allowed embedding domains input highlighted](/img/how-to-enable-embedded-signing/05-allowed-embedding-domains.png)

:::caution Deny by default
The list is **empty by default, which means no site can embed the signing page at all**: the iframe stays blank until you add your app's origin. Type a full `https://` origin (for example `https://app.yourcompany.com`) and press **Enter** to add it; repeat for each origin. An empty list is the safest setting; add an origin only when you actually embed.
:::

## Step 6: localhost is for local development only

For local development you can add an `http://localhost` (or `http://127.0.0.1`) origin so you can test the iframe on your machine. When you do, the settings show a bright warning:

![The NOT FOR PRODUCTION USE warning highlighted after an http://localhost origin is added to Allowed embedding domains](/img/how-to-enable-embedded-signing/06-localhost-http-warning.png)

:::caution Not for production
`http://` origins can be spoofed and weaken clickjacking protection, so they are for **local development and testing only**. Remove every `http://` origin and use `https://` before the configuration is used in production. Production origins must be `https`.
:::

## What's next

- **Next:** pick a build guide. [Your own iframe](./build/own-iframe.md), the [React widget](./build/react-widget.md), the [web component](./build/web-component.md), or [kiosk signing (two signers, one device)](./build/sequential-signers.md).
- [Email and SMS passcode](../identity-verification/one-time-passcode.md): choose email or SMS delivery, connect an SMS provider, set up delivery-failure alerts, and see what the signer sees.
- [External identity verification](../identity-verification/external-identity-verification.md): assert a signer's identity from your own identity verification provider instead of a passcode.
- [Sender override for testing](../identity-verification/sender-override.md): try the flow without verification in development.
- [API reference](./reference.md): every request field, event and error.
