---
title: Embedded Signing and Identity Verification
slug: /TurboSign/embedded-signing
sidebar_label: Overview
sidebar_position: 1
description: Embed TurboSign in your own app and verify each signer with a one-time passcode, your own identity provider, or an explicit override. Request a short-lived signing URL at the moment a signer is ready, then pick a step-by-step guide.
keywords:
  - embedded signing
  - identity verification
  - createSigningUrl
  - createEmbeddedSignature
  - one-time passcode
  - otp signing
  - external identity verification
  - iframe signing
  - turbosign api
  - single-use signing url
  - signer verification
  - embed signing in your app
---

# Embedded Signing and Identity Verification

Embedded signing takes a signer straight from your own UI to a TurboSign signing page, without signing-link emails. Your backend asks TurboSign for a short-lived signing URL when the signer is ready, and your app opens it in an iframe, a new tab, or a redirect.

**At a glance:**

- **Your signer never leaves your app.** The signing page appears inside your product, and no signing-link email is needed.
- **Your API key stays on your server.** The browser only ever sees a per-signer URL.
- **Verification is per recipient and optional.** Use an email or SMS passcode, your own identity verification vendor, or (in development) no verification at all.
- **The signer's real email is the signer of record**, and the verification lands on the certificate of completion and in the audit trail.
- **You get a completion event** in the browser, and the `completed` webhook on your server.

:::tip Let your AI coding agent write the integration
The [TurboDocx quickstart skill](https://github.com/TurboDocx/quickstart) (`turbodocx-sdk`) installs the [TurboDocx SDK](https://github.com/TurboDocx/SDK) and writes the integration code, including embedded signing, in JavaScript/TypeScript, Python, Go, PHP, Java or Ruby. Install it without any prompts:

```bash
npx skills add TurboDocx/quickstart --skill turbodocx-sdk -y
```

Then paste a prompt like this into Claude Code, Cursor, Copilot, Codex or any agent that supports [Agent Skills](https://agentskills.io):

```text
Add TurboSign embedded signing with SMS verification to my app
```

More install options: [Install with AI Agents](../../SDKs/agent-skills.md).
:::

## How it works

Every embedded signing integration makes the same four moves:

1. **Your server creates the document** and asks TurboSign for a signing URL for one signer.
2. **Your browser code shows that URL**, usually in an iframe.
3. **The signing page verifies the signer** and collects the signature.
4. **The signing page tells your app it finished** with a `turbosign:completed` message, and your server confirms the result.

```text
Browser (your app)  --POST /api/signing-session-->  Your server (holds the API key)  -->  TurboDocx
        ^                                                    |
        |                     embedUrl                       |
        +----------------------------------------------------+
        |
   <iframe src=embedUrl>  --postMessage "turbosign:completed"-->  your app
```

## Three ways to verify the signer

Identity verification is optional and set per recipient. A recipient with no verification signs with no extra step. When you do verify an embedded signer, it happens in one of three ways.

| Mode | Who verifies the signer | When | Guide |
|---|---|---|---|
| One-time passcode (`otp`) | TurboSign, by email or SMS | On the signing page, before the document is shown | [Email and SMS passcode](./identity-verification/one-time-passcode.md) |
| External identity verification (`external_idv`) | Your identity verification vendor | Your backend asserts the verification when it requests the signing URL | [External identity verification](./identity-verification/external-identity-verification.md) |
| Override (`override`) | Nobody. An explicit opt-out for development and testing | Recorded on the certificate and in the audit trail | [Sender override for testing](./identity-verification/sender-override.md) |

Verification is not tied to embedding: the same per-recipient step-up applies whether the signer arrives through an embedded URL or an emailed link.

## Choose your path

| You want to... | Signer verifies with | Front end | Guide |
|---|---|---|---|
| Keep full control of the iframe, in any framework | Email passcode | Your own `iframe` and message listener | [Your own iframe](./build/own-iframe.md) |
| Write the least code in a React app | Email passcode | The React `TurboSignForm` component | [React widget](./build/react-widget.md) |
| Use Vue, Angular, Svelte or plain HTML | Email passcode | The `turbosign-form` web component | [Web component](./build/web-component.md) |
| Have two or more people sign in order on one device | An email passcode each | Any | [Two signers on one device](./build/sequential-signers.md) |
| Verify signers by text message | SMS passcode | Any | [Email and SMS passcode](./identity-verification/one-time-passcode.md#request-an-sms-passcode-from-your-code) |
| Reuse a check your identity vendor already ran | Your identity provider | Any | [External identity verification](./identity-verification/external-identity-verification.md) |
| Try the flow in development without verification | Nothing (marked not identity-verified) | Any | [Sender override for testing](./identity-verification/sender-override.md) |

:::tip Not sure? Start with the React widget or the web component
They check the message origin and surface the completion event for you. Choose your own iframe only when you need full control of the frame.
:::

To see the result first, run the [embedded signing sample app](https://github.com/TurboDocx/SDK/tree/main/examples/embedded-web-app). It is a Vite + React host app that embeds TurboSign four ways (single signer, external identity verification, sequential kiosk, and the drop-in widget) while the API key stays on its small server.

## Before you start

You need these in place before any guide works:

1. **An admin has turned on embedded signing.** In **Settings** > **Features and integrations** > **Signatures** > **Configure E-Signature** > **Identity Verification**, the **Enable identity verification** switch is on.
2. **Your app's origin is allowed.** On the **Identity & embedding** tab, your origin (for example `https://app.yourcompany.com`) is under **Allowed embedding domains**.
3. **You have an API key with the right role:** an **Administrator** or **Contributor** key.
4. **Your PDF has text anchors** where fields go, for example `{signature1}` and `{date1}`.
5. **The TurboDocx SDK is installed on your server.** See the [TurboSign SDK](../../SDKs/turbosign.md) for your language.

[Set up your organization](./set-up-your-organization.md) walks an admin through steps 1 and 2 with screenshots.

:::warning The signing page will not appear until your origin is allowed
Embedding is denied by default. Until an admin adds your app's origin under **Allowed embedding domains**, the iframe stays blank. That is the clickjacking protection working, not a bug.
:::

:::caution User-role API keys are rejected
Requesting a signing URL needs an **Administrator** or **Contributor** key. A **User**-role key can create the document, but the signing URL request fails with HTTP `403`.
:::

:::caution localhost is for development only
You can allow `http://localhost` origins to test on your machine. Remove every `http://` origin before you go live; production origins must be `https://`.
:::

:::note Ruby
The Ruby tabs in these guides show the Ruby SDK API. The `turbodocx-sdk` gem is not on RubyGems yet; until it is, install it from the [TurboDocx SDK repository](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk).
:::

## The flow, end to end

1. Your backend prepares the document with an embedded recipient and `sendEmail: false`, then stores the returned `documentId` on the customer record.
2. Your app shows a "Sign now" button. Clicking it calls your backend, not a stored link.
3. Your backend confirms the signed-in user matches the customer record, calls `createSigningUrl`, and returns the URL.
4. The signing page verifies the signer (a passcode, the asserted external verification, or nothing for override) and shows the document.
5. The signer signs. The page posts `turbosign:completed`, and TurboSign returns the signer to your `returnUrl` if you set one.
6. The `completed` webhook updates your record. Download the signed PDF; the certificate shows the identity-verification line.

The [API reference](./reference.md) has every request and response field.

## Common errors {#errors}

| HTTP | `code` | What to do |
|---|---|---|
| (blank iframe) | none | Add your exact origin under **Allowed embedding domains**. |
| 403 | none (a plain `403 Forbidden`) | The API key belongs to a **User**. Use an **Administrator** or **Contributor** key. |
| 403 | `EmbeddedSigningNotEnabled` | Ask an admin to turn on **Enable identity verification**. |
| 403 | `OtpOverrideNotAllowed` | Your organization locked the passcode method. Omit the channel, or ask an admin to let senders change it. |
| 409 | `RecipientNotInTurn`, `NotSignersTurn` | An earlier signer has not finished. Mint this signer's URL when it is their turn. |
| 410 | `SigningUrlNotRedeemable` | A single-use URL was used or expired. Request a new one. |

Every error code is in the [API reference](./reference.md#errors).

## Good practice

- **Never store a signing URL.** Request one when the signer clicks. The single-use URLs expire quickly by design.
- **Verify the signer in your own app first.** Confirm the logged-in user is the recipient before you request a URL.
- **Use `externalId`** to reference a signer by your own record (an Airtable row, a CRM contact) instead of storing TurboDocx's recipient id.
- **Set allowed embedding domains** before you iframe the signing page.
- **Confirm completion on your server.** Treat the browser event as a hint, and rely on the document status or the `completed` webhook.

## Next

[Set up your organization](./set-up-your-organization.md), then pick a guide from [Choose your path](#choose-your-path).
