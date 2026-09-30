---
title: Embedded Signing and Identity Verification
sidebar_position: 5
description: Embed TurboSign in your own app and verify each signer with a one-time passcode, your own identity provider, or an explicit override. Request a short-lived signing URL at the moment a signer is ready.
keywords:
  - embedded signing
  - identity verification
  - createSigningUrl
  - one-time passcode
  - otp signing
  - external identity verification
  - iframe signing
  - turbosign api
  - single-use signing url
  - signer verification
---

# Embedded Signing and Identity Verification

Embedded signing lets your application take a signer straight from your own UI to a TurboSign signing page, without sending signing-link emails. When a signer is ready, your backend asks TurboSign for a short-lived signing URL and opens it (a new tab, a redirect, or an iframe). The signer keeps their real email as the signer of record, and the verification is recorded on the certificate of completion.

Identity verification is optional and set per recipient. A recipient with no verification signs with no extra step. When you do verify an embedded signer, it happens in one of three ways.

| Mode | Who verifies the signer | When |
|---|---|---|
| One-time passcode (`otp`) | TurboSign, by email or SMS | On the signing page, before the document is shown |
| External identity verification (`external_idv`) | Your identity verification vendor | Your backend asserts the verification when it requests the signing URL |
| Override (`override`) | Nobody. An explicit opt-out for development and testing | Recorded on the certificate and in the audit trail |

Verification is not tied to embedding: the same per-recipient step-up applies whether the signer arrives through an embedded URL or an emailed link.

## Before you start

An organization admin enables embedded signing in the E-Signature settings, on the **Identity & embedding** tab:

- **Require identity verification** turns on the one-time passcode flow and sets the default method (email or SMS). This default applies to signatures created in the TurboDocx UI. For SDK and API sends it is *not* applied automatically — you set `identityVerification` on each recipient yourself (see [The recipient](#the-recipient) below).
- **Allow external identity verification** lets your integration assert a signer's identity with your own provider.
- **Allow identity verification override** lets a sender send a link that skips verification. This is intended for development and testing. While it is on, the settings page shows a persistent banner.
- **Allowed embedding domains** lists the origins allowed to embed the signing page in an iframe. This is **deny by default**: while the list is empty, no site may embed the signing page. Add your app's origin (for example `https://app.yourcompany.com`) before you try to iframe it.

Your integration can read (but not change) these org gates with `TurboSign.getEmbeddedSigningSettings()`, so it can check what is enabled before requesting a signing URL. Changing the gates is done in the settings UI, where the change is recorded in the settings audit trail.

## The recipient

When you prepare a document, mark a recipient for embedded signing by giving it an `identityVerification` block. The signer's real `email` is always required.

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "signingOrder": 1,
  "phone": "+15551234567",
  "externalId": "your_customer_123",
  "identityVerification": { "mode": "otp", "channel": "email_or_sms" }
}
```

- `phone` is required when the passcode is delivered by SMS.
- `externalId` is your own identifier for the signer (for example an Airtable record id). It is unique within a document and lets you request a signing URL by your key instead of storing TurboDocx's recipient id.
- `identityVerification` is one of:
  - `{ "mode": "otp", "channel": "email" | "sms" }`
  - `{ "mode": "external_idv", "provider": "your-idv-vendor", "maxAgeMinutes": 1440 }`
  - `{ "mode": "override", "overrideIdentityVerification": true, "reason": "Sandbox testing" }`

## Requesting a signing URL

When your signer is ready, call `createSigningUrl`. Request one at the moment the signer clicks; never store it.

```typescript
import { TurboSign } from "@turbodocx/sdk"

// otp or override recipient — select by your externalId or the recipient id:
const { url, expiresAt, identityVerificationMode, pendingChecks } =
  await TurboSign.createSigningUrl(documentId, { externalId: "your_customer_123" })

// external_idv recipient — pass the assertion from your identity verification vendor:
const { url } = await TurboSign.createSigningUrl(documentId, {
  recipientId,
  identityAssertion: {
    provider: "your-idv-vendor",
    verificationId: "idv_verif_8f2a91",
    verifiedAt: "2026-09-16T15:02:00Z",
    subjectEmail: "jane@example.com",
    method: "id_document_liveness",
    assuranceLevel: "ial2_aal2",
  },
  returnUrl: "https://app.yourcompany.com/signed",
})
```

The equivalent REST call:

```
POST /turbosign/documents/{documentId}/signing-url
{
  "externalId": "your_customer_123"
}
```

The response:

```json
{
  "url": "https://app.turbodocx.com/e-signature/sign/{documentId}?sut=...",
  "expiresAt": "2026-09-16T15:07:00Z",
  "recipientId": "...",
  "externalId": "your_customer_123",
  "identityVerificationMode": "override",
  "pendingChecks": []
}
```

- For `external_idv` and `override`, `url` is **single-use** and expires in about five minutes. Opening it consumes it. `pendingChecks` is empty.
- For `otp`, `url` is the reusable signing link and `pendingChecks` lists the passcode step the signer must clear (`email_otp` or `sms_otp`). The passcode step happens on the signing page.

Open `url` for the signer. The signing page handles the rest: for `external_idv` and `override` it redeems the single-use token and shows the document; for `otp` it asks for the passcode first. When signing finishes, the signer is returned to your `returnUrl` if you supplied one.

## Example flow

1. Your backend prepares the document and sends it with an embedded recipient, then stores the returned `documentId` on the customer record.
2. Your app shows a "Sign now" button. Clicking it calls your backend, not a stored link.
3. Your backend confirms the signed-in user matches the customer record, calls `createSigningUrl`, and redirects to `url`.
4. The signing page verifies the signer (passcode, or the asserted external verification, or nothing for override) and shows the document.
5. The signer signs, and TurboSign returns them to your `returnUrl`.
6. The `completed` webhook updates your record. Download the signed PDF; the certificate shows the identity-verification line.

## External identity verification

When your identity verification vendor verifies the signer, pass the assertion in `createSigningUrl`. TurboSign checks that the provider matches the recipient, the asserted email matches the recipient's email (unless you set `overrideEmailMatching`, see below), the verification is recent (within `maxAgeMinutes`, default 24 hours) and not future-dated, and that the same verification has not already been used by another signer on the document. The provider and reference are recorded on the certificate:

> Identity verification: Verified by your identity verification vendor (reference idv_verif_8f2a91) on Sep 16, 2026 at 3:02 PM UTC.

### The assertion

The assertion has four required fields:

| Field | Description |
|---|---|
| `provider` | The identity verification vendor that performed the check. Must match the `provider` on the recipient's `identityVerification` block. |
| `verificationId` | The vendor's reference id for this verification. Recorded on the certificate and reused to detect a verification replayed across signers. |
| `verifiedAt` | ISO 8601 timestamp of when the vendor verified the signer. Must be recent (within `maxAgeMinutes`) and not future-dated. |
| `subjectEmail` | The email the vendor verified. By default it must equal the recipient's email. Always sent, even when you override the match. |

You can also send any of these optional fields. They are additive: each one is recorded on the tamper-evident audit trail as evidence, and the five below render on the audit trail alongside the provider and reference.

| Field | Description |
|---|---|
| `method` | How the vendor verified the signer. One of `id_document`, `id_document_liveness`, `kba`, `database`, `sso`, or `other`. |
| `methodDetail` | A free-text description of the technique. Required when `method` is `other`. |
| `assuranceLevel` | The vendor's proofing level, for example `ial2_aal2`, `eidas_substantial`, or `eidas_high`. |
| `verifiedName` | The legal name the vendor confirmed for the signer. |
| `evidenceUrl` | A link to the vendor's verification record. Must be an `https` URL. |

:::note Your responsibility
When you use external identity verification, you (the integrator) are responsible for verifying the signer's identity. TurboSign records the asserted verification (provider, reference, timestamp, and the fields above) into the tamper-evident audit trail, but it does not independently perform or guarantee the verification. This mirrors how embedded signing works across the major e-signature vendors.
:::

:::note When to assert
Assert the verification off your identity vendor's webhook-confirmed result, or a server-side status fetch keyed by the reference id. Do not assert off the client-side "finished" event. Identity vendors deliver the authoritative verdict asynchronously by webhook, so the client "finished" signal is not the approval.
:::

### Overriding the email match

By default the asserted `subjectEmail` MUST equal the recipient's email. If they differ, `createSigningUrl` rejects the assertion.

Setting `overrideEmailMatching: true` explicitly bypasses only that one check. Every other check still runs: the provider must match the recipient, `verifiedAt` must be recent and not future-dated, and the verification must not already have been used by another signer on the document. `subjectEmail` is still required; it is simply not compared to the recipient's email.

```typescript
const { url } = await TurboSign.createSigningUrl(documentId, {
  recipientId,
  identityAssertion: {
    provider: "your-idv-vendor",
    verificationId: "idv_verif_8f2a91",
    verifiedAt: "2026-09-16T15:02:00Z",
    subjectEmail: "verified-on-file@example.com",
    overrideEmailMatching: true,
  },
})
```

:::caution You take responsibility for the match
With `overrideEmailMatching: true`, TurboDocx no longer confirms that the verified identity belongs to the signer of record. You take responsibility for confirming that the identity your vendor verified is the recipient who signs. The override is recorded in the JSON audit trail, but it is not shown on the rendered audit PDF.
:::

## Override

> **Override is designed for development and testing.** It lets you try embedded signing without setting up a passcode or an identity provider. If your organization needs it in production, an admin can enable it in organization settings. Every signature completed this way is clearly noted as not identity-verified on the certificate of completion and in the audit trail.

## Good practice

- **Never store a signing URL.** Request one when the signer clicks. The single-use URLs expire quickly by design.
- **Verify the signer in your own app first.** Confirm the logged-in user is the recipient before you request a URL.
- **Use `externalId`** to reference a signer by your own record (an Airtable row, a CRM contact) instead of storing TurboDocx's recipient id.
- **Set allowed embedding domains** before you iframe the signing page. Embedding is denied by default, so until your app's origin is on the list the signing page will refuse to frame.
