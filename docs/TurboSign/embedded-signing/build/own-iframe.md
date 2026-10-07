---
title: Embed Signing with Your Own Iframe (Email Passcode)
slug: /TurboSign/embedded-signing/own-iframe
sidebar_label: Your own iframe
sidebar_position: 1
description: Step-by-step guide to embedding TurboSign in your app with a plain iframe and your own postMessage listener, with the signer verified by an email one-time passcode. Server code for JavaScript, Python, PHP, Go, Java and Ruby.
keywords:
  - embedded signing iframe
  - turbosign postmessage
  - turbosign:completed
  - email passcode signing
  - createEmbeddedSignature
  - embed e-signature iframe
---

import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';
import SetupAndVerify from './_setup-and-verify.mdx';
import CreateEmailOtpSigner from './_create-email-otp-signer.mdx';

# Embed Signing with Your Own Iframe (Email Passcode)

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" sampleAppHref="https://github.com/TurboDocx/SDK/tree/main/examples/embedded-web-app" sampleAppImage="/img/embedded-signing/sample-app-thumb.png" />

In this guide your app frames the TurboSign signing page in a plain `iframe` and listens for the completion message itself. TurboSign verifies the signer with a six-digit code sent to their email.

Choose this path when you want full control of the frame, or your framework is not React. If you would rather not write the listener, use the [React widget](./react-widget.md) or the [web component](./web-component.md) instead.

**What you'll build:**

- A server route that creates the document and returns a signing URL.
- A page that shows the signing page in an iframe.
- A message listener that reacts when the signer finishes, and checks where the message came from.

## Prerequisites

- The setup in [Before you start](../index.md#before-you-start): embedded signing on, your origin allowed, and an **Administrator** or **Contributor** API key.
- A PDF with `{signature1}` and `{date1}` text anchors.

## Step 1: Check your setup and choose how signers verify

<SetupAndVerify />

## Step 2: Create the document and signing URL on your server

Add a route to your server, for example `POST /api/signing-session`. It calls `createEmbeddedSignature`, which uploads the PDF, adds the signer with an email passcode, and returns an `embedUrl` in one call. Signing-link emails are off by default in this call (`sendEmail: false`), so the signer is not emailed a link they don't need.

<CreateEmailOtpSigner />

Before you call it, confirm that the signed-in user really is the person who should sign. Then return `embedUrl` to the browser. Never store it; request a new one each time the signer opens the page.

## Step 3: Show the signing page in an iframe

In your page, ask your server for a URL and set it as the iframe's `src`. Give the iframe `allow="clipboard-write"` and enough height for the document.

```html
<iframe
  id="turbosign"
  title="Sign your agreement"
  allow="clipboard-write"
  style="width: 100%; height: 720px; border: 0"
></iframe>

<script type="module">
  const res = await fetch("/api/signing-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Jane Doe", email: "jane@example.com" }),
  });
  const { embedUrl } = await res.json();
  document.getElementById("turbosign").src = embedUrl;
</script>
```

The browser code is the same whichever language your server uses.

## Step 4: Listen for the completion message

When the signer finishes, the signing page posts a `turbosign:completed` message to your page. Accept it only when it comes from the TurboSign origin **and** from your own iframe.

```javascript
const TURBOSIGN_ORIGIN = "https://app.turbodocx.com";
const iframe = document.getElementById("turbosign");

window.addEventListener("message", async (event) => {
  if (event.origin !== TURBOSIGN_ORIGIN) return;          // origin pinning
  if (event.source !== iframe.contentWindow) return;      // source pinning
  if (event.data?.type !== "turbosign:completed") return;

  const { documentId, event: kind } = event.data;
  if (kind === "already_signed") {
    // The signer reopened a link they had already completed. Skip one-time side effects.
  }

  iframe.remove();
  // Confirm on your server (document status or the `completed` webhook) before you
  // mark the agreement as signed. Then show your own "All set" screen.
  await fetch(`/api/agreements/${documentId}/refresh`, { method: "POST" });
});
```

:::warning Check both origin and source
Any window can post a message to your page. Checking `event.origin` rejects messages from other sites; checking `event.source` rejects messages from other frames, including ones on the TurboSign origin. If you'd rather not maintain this, `handleTurboSignMessage` from [`@turbodocx/embed`](https://www.npmjs.com/package/@turbodocx/embed) does both checks when you pass `expectedOrigin` and `expectedSource: iframe.contentWindow`.
:::

## What the signer sees

Your app's page around the signing panel will look different; the panel itself is the same.

1. Your signer clicks your own button (here, **Start signing**). Your server creates the document and returns the signing URL, and your page sets it as the iframe's `src`.

   ![The host app form with the Start signing button highlighted](/img/embedded-signing/iframe-01-start.png)

2. Your page shows the TurboSign signing panel. The signer clicks **Send Code**, and TurboSign emails a six-digit code to the signer's address.

   ![The Verify your identity panel inside the host app, with the Send Code button highlighted](/img/embedded-signing/iframe-02-send-code.png)

3. The signer types the code and clicks **Verify And Continue**.

   ![The code entry panel with the Verify And Continue button highlighted](/img/embedded-signing/iframe-03-enter-code.png)

4. The signer ticks **I have read and agree to the TurboSign consent terms** and clicks **Continue**.

   ![The TurboSign Consent panel with the consent statement highlighted; the checkbox is just to its left, and Continue is below](/img/embedded-signing/iframe-04-consent.png)

5. The document opens. The signer clicks the **Signature** field, types or draws a signature, and clicks **Save**. Date fields fill in automatically.

   ![The document with the Signature field highlighted](/img/embedded-signing/iframe-05-document.png)

6. When every required field is done, the signer clicks **Submit Signature**.

   ![The signed document with the Submit Signature button highlighted](/img/embedded-signing/iframe-06-submit.png)

7. The signing page posts `turbosign:completed`. Your listener removes the iframe and shows your own confirmation.

   ![The host app's All set confirmation highlighted after signing](/img/embedded-signing/iframe-07-done.png)

A code expires after 10 minutes, and five wrong entries require a new code. See [Passcode attempts and lockout](../reference.md#passcode-attempts-and-lockout).

## What the completion event contains

```json
{ "type": "turbosign:completed", "documentId": "4f1c...", "status": "completed", "event": "signing_complete", "scope": "recipient" }
```

`scope: "recipient"` means this signer finished. For the whole document, read the status on your server or wait for the `completed` webhook. Field-by-field details are in the [API reference](../reference.md#completion-event).

## Common errors

| Symptom | Cause | Fix |
|---|---|---|
| The iframe is blank, and the browser console mentions `frame-ancestors` | Your origin is not under **Allowed embedding domains**. | Add the exact origin, including the port in development. |
| HTTP `403` when the signing URL is created | The API key belongs to a **User**. | Use an **Administrator** or **Contributor** key. |
| HTTP `403` `EmbeddedSigningNotEnabled` | **Enable identity verification** is off. | Ask an admin to turn it on (Step 1). |
| HTTP `403` `OtpOverrideNotAllowed` | Your organization verifies every request and locked the method to a different channel. | Ask an admin to allow changing the method per recipient, or follow the [SMS guide](../passcodes.md#request-an-sms-passcode-from-your-code). |
| Signing finishes but no completion message arrives (often in Firefox) | The signing page posts only to an origin it can identify, and your page or iframe sends no referrer. | Don't use `referrerpolicy="no-referrer"` on the iframe or a `no-referrer` page policy; keep the default `strict-origin-when-cross-origin`. |
| Your listener never fires | The origin check uses the wrong origin, or the message came from a different frame. | Log `event.origin` once and compare it with `TURBOSIGN_ORIGIN`. |

## What's next

- **Next:** [React widget](./react-widget.md): the same flow without writing the listener.
- [Kiosk signing (two signers, one device)](./sequential-signers.md): extend this flow to several signers.
- [API reference](../reference.md): every field, event and error.
