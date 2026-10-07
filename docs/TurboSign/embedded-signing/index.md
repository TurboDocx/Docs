---
title: Embedded Signing
slug: /TurboSign/embedded-signing
sidebar_label: Overview
sidebar_position: 1
description: Embed TurboSign in your own app and verify each signer with a one-time passcode, your own identity provider, or an explicit override. Request a signing URL at the moment a signer is ready, then pick a step-by-step guide.
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
  - embedded signing url
  - signer verification
  - embed signing in your app
---

import EmbeddedSigningFlow from '@site/src/components/EmbeddedSigningFlow';
import SampleAppCallout from './_sample-app-callout.mdx';

# Embedded Signing

Embedded signing takes a signer straight from your own UI to a TurboSign signing page, without signing-link emails. Your backend asks TurboSign for a signing URL when the signer is ready, and your app opens it in an iframe, a new tab, or a redirect.

**At a glance:**

- **Your signer never leaves your app.** The signing page appears inside your product, and no signing-link email is needed.
- **Your API key stays on your server.** The browser only ever sees a per-signer URL.
- **Each signer is verified your way.** Use an email or SMS passcode, or your own identity verification vendor. The sender override skips verification while you test.
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

1. **Your app asks your server for a signing session.** Your server creates the document and asks TurboDocx for a signing URL for one signer.
2. **The signing URL comes back to your app**, which shows it, usually in an iframe.
3. **The signing page verifies the signer** and collects the signature.
4. **The signing page tells your app it finished** with a `turbosign:completed` message, and your server confirms the result.

<EmbeddedSigningFlow />

## Choose how signers verify

Every embedded signer needs a verification method, unless you use the sender override while testing. Your app shows the signing page itself and TurboSign emails no link, so a check is what ties the person at the screen to the signer of record.

| Method | Who verifies the signer | Signing URL |
|---|---|---|
| [Email or SMS passcode](../identity-verification/one-time-passcode.md) | TurboSign sends a code before the document opens | Reusable for the life of the document |
| [External identity verification](../identity-verification/external-identity-verification.md) | Your identity provider; your backend asserts the result | Single-use, expires in about five minutes |
| [Sender override](../identity-verification/sender-override.md) | Nobody (testing only, marked not identity-verified) | Single-use, expires in about five minutes |

The [Identity verification](../identity-verification/index.md) section compares them in full, including which ones also work for signers you email.

## Choose your path

| You want to... | Signer verifies with | Front end | Guide |
|---|---|---|---|
| Keep full control of the iframe, in any framework | Email passcode | Your own `iframe` and message listener | [Your own iframe](./build/own-iframe.md) |
| Write the least code in a React app | Email passcode | The React `TurboSignForm` component | [React widget](./build/react-widget.md) |
| Use Vue, Angular, Svelte or plain HTML | Email passcode | The `turbosign-form` web component | [Web component](./build/web-component.md) |
| Have two or more people sign in order on one device | An email passcode each | Any | [Kiosk signing (two signers, one device)](./build/sequential-signers.md) |
| Verify signers by text message | SMS passcode | Any | [Passcodes in embedded signing](./passcodes.md#request-an-sms-passcode-from-your-code) |
| Reuse a check your identity vendor already ran | Your identity provider | Any | [External identity verification](../identity-verification/external-identity-verification.md) |
| Try the flow in development without verification | Nothing (marked not identity-verified) | Any | [Sender override for testing](../identity-verification/sender-override.md) |

:::tip Not sure? Start with the React widget or the web component
They check the message origin and surface the completion event for you. Choose your own iframe only when you need full control of the frame.
:::

<SampleAppCallout path="Widget, Single signer, External IdV or Sequential kiosk" />

## Before you start

You need these in place before any guide works:

1. **An admin has turned on embedded signing.** In **Settings** > **Features and integrations** > **Signatures** card > **Configure E-Signature** > **Identity Verification**, the **Enable identity verification** switch is on. Despite its name, it is the master switch for embedded signing and every verification mode.
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

- **Never store a signing URL.** Request one when the signer clicks. Passcode signers get a reusable link that lasts as long as the document; external identity verification and override signers get a single-use link that expires after about five minutes.
- **Verify the signer in your own app first.** Confirm the logged-in user is the recipient before you request a URL.
- **Use `externalId`** to reference a signer by your own record (an Airtable row, a CRM contact) instead of storing TurboDocx's recipient id.
- **Set allowed embedding domains** before you iframe the signing page.
- **Confirm completion on your server.** Treat the browser event as a hint, and rely on the document status or the `completed` webhook.

## Next

[Set up your organization](./set-up-your-organization.md), then pick a guide from [Choose your path](#choose-your-path).
