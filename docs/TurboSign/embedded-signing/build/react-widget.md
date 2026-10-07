---
title: Embed Signing with the React Widget (Email Passcode)
slug: /TurboSign/embedded-signing/react-widget
sidebar_label: React widget
sidebar_position: 2
description: Step-by-step guide to embedding TurboSign in a React app with the TurboSignForm component from @turbodocx/embed, with the signer verified by an email one-time passcode. Server code for JavaScript, Python, PHP, Go, Java and Ruby.
keywords:
  - turbosign react
  - TurboSignForm
  - "@turbodocx/embed"
  - react e-signature component
  - embedded signing react
  - email passcode signing
---

import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';
import SetupAndVerify from './_setup-and-verify.mdx';
import CreateEmailOtpSigner from './_create-email-otp-signer.mdx';

# Embed Signing with the React Widget (Email Passcode)

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" sampleAppHref="https://github.com/TurboDocx/SDK/tree/main/examples/embedded-web-app" />

In this guide your React app drops in the `TurboSignForm` component from `@turbodocx/embed`. The component renders the iframe, checks where each message comes from, and calls your `onCompleted` callback when the signer finishes.

TurboSign verifies the signer with a six-digit code sent to their email.

**What you'll build:**

- A server route that creates the document and returns a signing URL.
- A React component that shows the signing page and reacts when the signer finishes.

## Prerequisites

- The setup in [Before you start](../index.md#before-you-start): embedded signing on, your origin allowed, and an **Administrator** or **Contributor** API key.
- React 18 or later.
- A PDF with `{signature1}` and `{date1}` text anchors.

## Step 1: Check your setup and choose how signers verify

<SetupAndVerify />

## Step 2: Install the package

```bash
npm install @turbodocx/embed
```

React is a peer dependency and is never bundled. The React component lives at the `@turbodocx/embed/react` subpath, so the package root never imports React.

## Step 3: Create the document and signing URL on your server

Add a route to your server, for example `POST /api/signing-session`. It calls `createEmbeddedSignature` and returns the signer's `embedUrl`. Your API key never reaches the browser.

<CreateEmailOtpSigner />

## Step 4: Render the widget

Fetch the URL from your server and pass it to `TurboSignForm`. Set `origin` to the TurboSign origin so the component accepts messages only from the signing page.

```tsx
import { useState } from "react";
import { TurboSignForm } from "@turbodocx/embed/react";

export function SignStep({ name, email }: { name: string; email: string }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);

  async function start() {
    const res = await fetch("/api/signing-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    setEmbedUrl(data.embedUrl);
  }

  if (signed) return <p>All set. Your agreement is signed.</p>;
  if (!embedUrl) return <button onClick={start}>Sign now</button>;

  return (
    <TurboSignForm
      embedUrl={embedUrl}
      origin="https://app.turbodocx.com"
      height={720}
      title="Sign your agreement"
      onCompleted={({ documentId, event }) => {
        // event is "signing_complete", or "already_signed" when the signer reopened a finished link.
        // Confirm on your server (status or `completed` webhook) before you mark the deal as signed.
        setSigned(true);
      }}
    />
  );
}
```

### Props

| Prop | Required | Description |
|---|---|---|
| `embedUrl` | Yes | The per-recipient URL from your server. Use it exactly as the SDK returns it. |
| `origin` | Yes, in practice | The exact TurboSign origin, `https://app.turbodocx.com`. You can also derive it from the URL you frame: `new URL(embedUrl).origin`. Without it, every message is ignored and `onCompleted` never fires. |
| `onCompleted` | Yes | Called when the signer finishes. Receives `documentId`, `status`, `event` and `scope`. |
| `height` | No | A CSS length, or a number of pixels. Defaults to `720px`. |
| `title` | No | The iframe's accessible name. Defaults to `TurboSign signing`. |
| `className`, `style` | No | Styling for the iframe. |
| `onDeclined`, `onError` | No | Reserved. The signing page does not send these events yet. |
| `allowAnyOrigin` | No | Development only. Accepts messages from any origin. Never ship it. |

:::warning Don't leave origin empty
The widget fails closed. If `origin` is missing, it ignores every message, logs a one-time warning in the console, and `onCompleted` never fires. `allowAnyOrigin` turns that off for local debugging, but then any frame on your page could fake a completion.
:::

## What the signer sees

Your app's page around the signing panel will look different; the panel itself is the same.

1. Your signer clicks your own button (here, **Start signing**). Your server returns the signing URL, and you render `TurboSignForm` with it.

   ![The widget page form with the Start signing button highlighted](/img/embedded-signing/widget-01-start.png)

2. Your page shows the TurboSign signing panel. The signer clicks **Send Code**, and TurboSign emails a six-digit code to the signer's address.

   ![The Verify your identity panel inside the host app, with the Send Code button highlighted](/img/embedded-signing/widget-02-send-code.png)

3. The signer types the code and clicks **Verify And Continue**.

   ![The code entry panel with the Verify And Continue button highlighted](/img/embedded-signing/iframe-03-enter-code.png)

4. The signer ticks **I have read and agree to the TurboSign consent terms** and clicks **Continue**.

   ![The TurboSign Consent panel with the consent statement highlighted; the checkbox is just to its left, and Continue is below](/img/embedded-signing/iframe-04-consent.png)

5. The document opens. The signer clicks the **Signature** field, types or draws a signature, and clicks **Save**. Date fields fill in automatically.

   ![The document with the Signature field highlighted](/img/embedded-signing/iframe-05-document.png)

6. When every required field is done, the signer clicks **Submit Signature**.

   ![The signed document with the Submit Signature button highlighted](/img/embedded-signing/iframe-06-submit.png)

7. The widget calls `onCompleted`, and your app shows its own confirmation.

   ![The host app's Signed via the widget confirmation highlighted](/img/embedded-signing/widget-03-done.png)

## What the completion event contains

`onCompleted` receives the fields of the `turbosign:completed` message:

| Field | Value |
|---|---|
| `documentId` | The document's id. |
| `status` | `completed`. |
| `event` | `signing_complete`, or `already_signed` when the signer reopened a link they had already completed. |
| `scope` | `recipient`. This signer finished; others on the document may still be pending. |

## Common errors

| Symptom | Cause | Fix |
|---|---|---|
| The widget area is blank | Your origin is not under **Allowed embedding domains**. | Add the exact origin, including the port in development. |
| Signing finishes but no completion message arrives (often in Firefox) | The signing page posts only to an origin it can identify, and your page or iframe sends no referrer. | Don't use `referrerpolicy="no-referrer"` on the iframe or a `no-referrer` page policy; keep the default `strict-origin-when-cross-origin`. |
| `onCompleted` never fires, and the console warns about a missing origin | `origin` is empty or wrong. | Set `origin="https://app.turbodocx.com"`. |
| HTTP `403` when your server creates the URL | The API key belongs to a **User**, or **Enable identity verification** is off (`EmbeddedSigningNotEnabled`). | Use an **Administrator** or **Contributor** key, and ask an admin to check Step 1. |
| HTTP `403` `OtpOverrideNotAllowed` | Your organization verifies every request and locked the method to a different channel. | Ask an admin to let senders change the method, or [request an SMS passcode](../passcodes.md#request-an-sms-passcode-from-your-code). |

## What's next

- **Next:** [Web component](./web-component.md), for the same widget outside React.
- [Kiosk signing (two signers, one device)](./sequential-signers.md).
- [API reference](../reference.md): every field, event and error.
