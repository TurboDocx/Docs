---
title: Embed Signing with the Web Component (No React)
slug: /TurboSign/embedded-signing/web-component
sidebar_label: Web component
sidebar_position: 3
description: Step-by-step guide to embedding TurboSign in any web app (Vue, Angular, Svelte or plain HTML) with the turbosign-form web component from @turbodocx/embed, with the signer verified by an email one-time passcode.
keywords:
  - turbosign web component
  - turbosign-form
  - custom element e-signature
  - embedded signing vue
  - embedded signing angular
  - embedded signing html
  - "@turbodocx/embed"
---

import SampleAppCallout from '../_sample-app-callout.mdx';
import SetupAndVerify from './_setup-and-verify.mdx';
import CreateEmailOtpSigner from './_create-email-otp-signer.mdx';

# Embed Signing with the Web Component (No React)

In this guide you drop the `turbosign-form` custom element into any page. It works in Vue, Angular, Svelte, server-rendered templates, or plain HTML, with no React and no build step required.

The element renders the iframe, checks where each message comes from, and fires a `turbosign:completed` DOM event when the signer finishes. TurboSign verifies the signer with a six-digit code sent to their email.

**What you'll build:**

- A server route that creates the document and returns a signing URL.
- A page with the `turbosign-form` element and an event listener.

## Prerequisites

- The setup in [Before you start](../index.md#before-you-start): embedded signing on, your origin allowed, and an **Administrator** or **Contributor** API key.
- A PDF with `{signature1}` and `{date1}` text anchors.

## Step 1: Check your setup and choose how signers verify

<SetupAndVerify />

## Step 2: Load the element

Pick one of these. The element registers itself as `turbosign-form` when the module loads.

**With a bundler** (Vite, webpack, Angular CLI):

```bash
npm install @turbodocx/embed
```

```javascript
import "@turbodocx/embed"; // registers <turbosign-form>
```

**Without a build step**, load the published ES module from a CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@turbodocx/embed@0.2.1/dist/index.js"></script>
```

:::tip Pin the version
Pin an exact version in the CDN URL, as above, so a new release can't change your page without you knowing.
:::

## Step 3: Create the document and signing URL on your server

Add a route to your server, for example `POST /api/signing-session`. It calls `createEmbeddedSignature` and returns the signer's `embedUrl`. Your API key never reaches the browser.

<CreateEmailOtpSigner />

## Step 4: Add the element and listen for completion

```html
<turbosign-form
  id="signing"
  origin="https://app.turbodocx.com"
  height="720"
  title="Sign your agreement"
></turbosign-form>

<script type="module">
  const form = document.getElementById("signing");

  const res = await fetch("/api/signing-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Jane Doe", email: "jane@example.com" }),
  });
  const { embedUrl } = await res.json();
  form.setAttribute("embed-url", embedUrl);

  form.addEventListener("turbosign:completed", (event) => {
    const { documentId, event: kind } = event.detail;
    // kind is "signing_complete", or "already_signed" when the signer reopened a finished link.
    // Confirm on your server (status or `completed` webhook) before you mark the deal as signed.
    form.replaceWith(Object.assign(document.createElement("p"), { textContent: "All set. You're signed." }));
  });
</script>
```

### Attributes

| Attribute | Required | Description |
|---|---|---|
| `embed-url` | Yes | The per-recipient URL from your server. |
| `origin` | Yes, in practice | The exact TurboSign origin, `https://app.turbodocx.com`. You can also derive it from the URL you frame: `new URL(embedUrl).origin`. Without it, every message is ignored. |
| `height` | No | A CSS length or a number of pixels. Defaults to `720px`. |
| `title` | No | The iframe's accessible name. Defaults to `TurboSign signing`. |
| `allow-any-origin` | No | Development only. Accepts messages from any origin. Never ship it. |

The element re-emits `turbosign:completed` as a bubbling `CustomEvent`, so a listener on a parent element works too. It also defines `turbosign:declined` and `turbosign:error`, which the signing page does not send yet.

:::warning Don't leave origin empty
The element fails closed. If `origin` is missing, it ignores every message and `turbosign:completed` never fires. `allow-any-origin` turns that off for local debugging only.
:::

## What the signer sees

<SampleAppCallout path="Single signer" />

The signing panel inside `turbosign-form` is the same one the other build guides show. The screenshots below come from the sample app's **Single signer** tab, because it has no web component tab.

1. Your page shows the TurboSign signing panel. The signer clicks **Send Code**, and TurboSign emails a six-digit code to the signer's address.

   ![The Verify your identity panel with the Send Code button highlighted](/img/embedded-signing/iframe-02-send-code.png)

2. The signer types the code and clicks **Verify And Continue**.

   ![The code entry panel with the Verify And Continue button highlighted](/img/embedded-signing/iframe-03-enter-code.png)

3. The signer ticks **I have read and agree to the TurboSign consent terms** and clicks **Continue**.

   ![The TurboSign Consent panel with the consent statement highlighted; the checkbox is just to its left, and Continue is below](/img/embedded-signing/iframe-04-consent.png)

4. The document opens. The signer clicks the **Signature** field, types or draws a signature, and clicks **Save**.

   ![The document with the Signature field highlighted](/img/embedded-signing/iframe-05-document.png)

5. The signer clicks **Submit Signature**. The element fires `turbosign:completed`.

   ![The signed document with the Submit Signature button highlighted](/img/embedded-signing/iframe-06-submit.png)

## What the completion event contains

`event.detail` has the fields of the `turbosign:completed` message: `documentId`, `status` (`completed`), `event` (`signing_complete` or `already_signed`) and `scope` (`recipient`). See the [API reference](../reference.md#completion-event).

## Common errors

| Symptom | Cause | Fix |
|---|---|---|
| The element is blank | Your origin is not under **Allowed embedding domains**. | Add the exact origin, including the port in development. |
| Signing finishes but no completion message arrives (often in Firefox) | The signing page posts only to an origin it can identify, and your page or iframe sends no referrer. | Don't use `referrerpolicy="no-referrer"` on the iframe or a `no-referrer` page policy; keep the default `strict-origin-when-cross-origin`. |
| `turbosign:completed` never fires | `origin` is missing or wrong, or the listener is attached to the wrong element. | Set `origin="https://app.turbodocx.com"` and listen on the element (or a parent). |
| Nothing renders at all | The module never loaded, so the tag is an unknown element. | Check the network tab for the script, and that it is loaded with `type="module"`. |
| HTTP `403` when your server creates the URL | The API key belongs to a **User**, or **Enable identity verification** is off. | Use an **Administrator** or **Contributor** key, and ask an admin to check Step 1. |
| HTTP `403` `OtpOverrideNotAllowed` | Your organization verifies every request and locked the method to a different channel. | Ask an admin to let senders change the method, or [request an SMS passcode](../../identity-verification/one-time-passcode.md#request-an-sms-passcode-from-your-code). |

## What's next

- **Next:** [Two signers in order on one device](./sequential-signers.md).
- [External identity verification](../../identity-verification/external-identity-verification.md), to skip the passcode when your identity vendor already verified the signer.
- [API reference](../reference.md): every field, event and error.
