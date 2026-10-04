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

An organization admin enables embedded signing in the E-Signature settings (**Settings** > **Features and integrations** > **Signatures** > **Configure E-Signature** > **Identity Verification**). The first setting is on the **One-time passcode** tab; the rest are on the **Identity & embedding** tab:

- **Enable identity verification** (One-time passcode tab) turns on the one-time passcode flow. Under **When to verify signers**, the admin picks **Only when requested** (no passcode unless a sender or a request asks for one) or **On every signature request** (every signer gets a passcode by the chosen method, email or SMS). See [The organization default](#the-organization-default) for how this applies to API and SDK sends.
- **Allow external identity verification** lets your integration assert a signer's identity with your own provider.
- **Allow identity verification override** lets a sender send a link that skips verification. This is intended for development and testing. While it is on, the settings page shows a persistent banner.
- **Allowed embedding domains** lists the origins allowed to embed the signing page in an iframe. This is **deny by default**: while the list is empty, no site may embed the signing page. Add your app's origin (for example `https://app.yourcompany.com`) before you try to iframe it.

Your integration can read (but not change) these org settings with `TurboSign.getEmbeddedSigningSettings()` (REST: `GET /turbosign/embedded-signing-settings`), so it can check what is enabled before it sends a document or requests a signing URL. Changing them is done in the settings UI, where the change is recorded in the settings audit trail.

```json
{
  "data": {
    "results": {
      "enabled": true,
      "allowExternalIdv": true,
      "allowIdentityOverride": false,
      "defaultChannel": "email",
      "allowChannelOverride": false,
      "allowedFrameAncestors": ["https://app.yourcompany.com"]
    }
  }
}
```

| Field | Description |
|---|---|
| `enabled` | Embedded signing and passcode verification are turned on for the organization. |
| `allowExternalIdv` | Your integration may assert a signer's identity with its own provider (`external_idv`). |
| `allowIdentityOverride` | A sender may issue a link that skips verification (`override`). |
| `defaultChannel` | The organization default passcode channel: `none` (only when requested), `email`, or `sms`. |
| `allowChannelOverride` | Whether a request may give a recipient a channel other than `defaultChannel`. When `false`, the organization has locked the method: an explicit different channel is rejected with `OtpOverrideNotAllowed`, so omit the channel to take the default. Always `true` when `defaultChannel` is `none` or embedded signing is off. |
| `allowedFrameAncestors` | The origins allowed to embed the signing page in an iframe. An empty list denies all framing. |

## The organization default

The default from **When to verify signers** applies to every recipient that does not set its own channel, on signatures created in the TurboDocx app **and** on documents you send through the API or SDK.

- **Only when requested** (`defaultChannel: "none"`): no passcode unless the recipient asks for one. This default is never locked, so a request can always turn verification on for a recipient.
- **On every signature request** (`defaultChannel: "email"` or `"sms"`): a recipient with no channel gets a passcode by that method. Unless the admin turns on **Let senders change the method per recipient**, the method is locked (`allowChannelOverride: false`): a request that sets the same channel, or omits it, succeeds, and a request that sets a different channel fails with `OtpOverrideNotAllowed`.

Automated sends (Pipelines, bulk signature sending, TurboQuote, and the Wrike integration) are exempt from the organization default. Recipients they create are verified only when the request sets verification explicitly.

Recipients using `external_idv` or `override` skip the passcode, so the channel default does not apply to them.

### Verify only your embedded signers by SMS

A common setup: your team keeps sending ordinary signature requests (from the TurboDocx app and from Pipelines) with no passcode, while signers in your own app verify by text message. You do not need an SMS default for the whole organization to do this.

1. In E-Signature Settings > **Identity Verification**, on the **One-time passcode** tab, turn on **Enable identity verification**.
2. Under **When to verify signers**, keep **Only when requested** (the default). Signature requests sent from the app and from Pipelines keep signing with no passcode; in the app, each signer's **Identity verification** stays on **No verification** unless a sender changes it.
3. Under **Text message (SMS)**, turn on **Allow SMS as an alternative to email**, then connect your SMS provider and check the status reads **Connected to Twilio** (or RingCentral). See [How to Configure One-Time Passcode](./How%20to%20Configure%20One-Time%20Passcode.md).
4. In your integration, ask for SMS on each recipient you embed:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+15551234567",
  "identityVerification": { "mode": "otp", "channel": "sms" }
}
```

Your request does not choose an SMS provider. TurboSign sends the passcode through the provider your organization connected. Pick the channel in your own app (for example, a setting in your app's configuration). Do not copy it from `defaultChannel`: with **Only when requested** that value is `none`, which tells you nothing about the channel you want.

## The recipient

When you prepare a document, mark a recipient for embedded signing by giving it an `identityVerification` block. The signer's real `email` is always required.

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "signingOrder": 1,
  "phone": "+15551234567",
  "externalId": "your_customer_123",
  "identityVerification": { "mode": "otp", "channel": "email" }
}
```

- `phone` is required when the passcode is delivered by SMS, in international format (for example `+15551234567`). The number must be one that can exist: a well-formed but impossible number is rejected with `OtpPhoneInvalid`.
- `externalId` is your own identifier for the signer (for example an Airtable record id). It is unique within a document and lets you request a signing URL by your key instead of storing TurboDocx's recipient id.
- `identityVerification` is one of:
  - `{ "mode": "otp", "channel": "email" | "sms" }`. Omit `channel` to take the [organization default](#the-organization-default).
  - `{ "mode": "external_idv", "provider": "your-idv-vendor", "maxAgeMinutes": 1440 }`
  - `{ "mode": "override", "overrideIdentityVerification": true, "reason": "Sandbox testing" }`

### Sending without signing-link emails

When every signer signs inside your app, send the document with `sendEmail: false` on `prepare-for-signing`. TurboSign then sends no signing-link emails for that document: not the initial request, not the "your turn" email to the next signer, and no scheduled reminders or expiry warnings. The reply says so:

```json
{
  "message": "Document sent for signing. Signing-link emails were not sent (sendEmail: false); request a signing URL for each recipient."
}
```

Explicit sender actions still send: **Resend Email** and a manual **Remind now** email the signer, and passcode emails and the completed-document copy are unaffected.

## Requesting a signing URL

When your signer is ready, call `createSigningUrl`. Request one at the moment the signer clicks; never store it.

```typescript
import { TurboSign } from "@turbodocx/sdk"

// otp or override recipient: select by your externalId or the recipient id:
const { url, expiresAt, identityVerificationMode, pendingChecks } =
  await TurboSign.createSigningUrl(documentId, { externalId: "your_customer_123" })

// external_idv recipient: pass the assertion from your identity verification vendor:
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

The REST response wraps the result in `data.results` (the SDKs return the inner object):

```json
{
  "data": {
    "results": {
      "url": "https://app.turbodocx.com/e-signature/embed/{documentId}?sut=...",
      "expiresAt": "2026-09-16T15:07:00Z",
      "recipientId": "...",
      "externalId": "your_customer_123",
      "identityVerificationMode": "override",
      "pendingChecks": []
    }
  }
}
```

The request body accepts `recipientId` or `externalId` (to pick the recipient), an optional `returnUrl`, and an optional `identityAssertion` (for `external_idv`). Unknown keys are rejected.

- For `external_idv` and `override`, `url` is **single-use** and expires in about five minutes. Opening it consumes it. `pendingChecks` is empty.
- For `otp`, `url` is the reusable signing link and `pendingChecks` lists the passcode step the signer must clear (`email_otp` or `sms_otp`). The passcode step happens on the signing page.

Open `url` for the signer. The signing page handles the rest: for `external_idv` and `override` it redeems the single-use token and shows the document; for `otp` it asks for the passcode first. When signing finishes, the signer is returned to your `returnUrl` if you supplied one.

### Return URL

`returnUrl` must be an `https` URL. TurboSign stores it on the recipient when you request the signing URL; it is never carried in the signing URL itself, so a signer cannot edit it into a redirect to another site. The signing page reads it back when it loads and redirects there after the signer finishes. It is set per request: requesting a new signing URL without `returnUrl` clears the one stored earlier.

:::caution Deprecated: GET signing-link
`GET /turbosign/documents/{documentId}/recipients/{recipientId}/signing-link` is deprecated. It still works, and now goes through the same checks and audit trail as `createSigningUrl`, but its responses carry a `Deprecation: true` header and a `Link` header pointing to the successor, `POST /turbosign/documents/{documentId}/signing-url`. Move to the `POST` endpoint, which handles every identity mode.
:::

## Example flow

1. Your backend prepares the document and sends it with an embedded recipient and `sendEmail: false`, then stores the returned `documentId` on the customer record.
2. Your app shows a "Sign now" button. Clicking it calls your backend, not a stored link.
3. Your backend confirms the signed-in user matches the customer record, calls `createSigningUrl`, and redirects to `url`.
4. The signing page verifies the signer (passcode, or the asserted external verification, or nothing for override) and shows the document.
5. The signer signs, and TurboSign returns them to your `returnUrl`.
6. The `completed` webhook updates your record. Download the signed PDF; the certificate shows the identity-verification line.

## External identity verification

If your app already verifies signers with an identity verification provider (for example Persona, Onfido, Jumio, Veriff or Stripe Identity), give the recipient `{ "mode": "external_idv", "provider": "..." }` and pass an `identityAssertion` to `createSigningUrl`. The assertion's four required fields are `provider`, `verificationId`, `verifiedAt` and `subjectEmail`, and you can add `method`, `methodDetail`, `assuranceLevel`, `verifiedName`, `evidenceUrl` and `overrideEmailMatching`. TurboSign checks that the provider and email match the recipient, that the verification is recent and not reused by another signer, records it in the audit trail, and returns a single-use signing URL.

The full guide covers the request shape, every check, the email-match override, what lands in the audit trail, worked examples for common providers, and the errors: [External Identity Verification (IdV) for Embedded Signing](./External%20Identity%20Verification.md).

## Passcode attempts and lockout

A passcode is six digits and expires after 10 minutes. A signer can request a new code at most every 30 seconds and five times per hour, and each code allows five wrong entries before the signer must request a new one.

Wrong entries also count across resends. After **20 wrong codes** in total, the signer is locked: the signing page shows the lock, and both sending and verifying a code return HTTP `423` until the sender resends the signing request. Only the sender can lift the lock, with **Resend Email** in the app or `POST /turbosign/documents/{documentId}/resend-email`. That resend emails the signer, even on a document sent with `sendEmail: false`.

The document's sender gets an email alert twice per signer: once at 5 wrong codes ("having trouble verifying"), so you can check the signer's email or phone number before the lock, and once when the signer is locked out at 20. The alerts go to the sender's email address. A document with no sender email (for example an API-key send without `senderEmail`) gets no alert.

## Errors

Identity and passcode errors from sending a document and from `createSigningUrl` use one response body. `message` and `error` carry the same human-readable text, and `type` and `code` carry the same machine-readable value, so you can read whichever pair your client already uses:

```json
{
  "message": "This organization does not allow changing the identity-verification method. Omit otpChannel or set it to 'email'.",
  "type": "OtpOverrideNotAllowed",
  "error": "This organization does not allow changing the identity-verification method. Omit otpChannel or set it to 'email'.",
  "code": "OtpOverrideNotAllowed"
}
```

| Status | `code` | Meaning |
|---|---|---|
| 400 | `OtpPhoneRequired` | The recipient resolves to SMS but has no `phone`. |
| 400 | `OtpPhoneInvalid` | The SMS number is well-formed but cannot exist. |
| 400 | `IdentityConfigInvalid`, `IdvProviderRequired`, `OverrideNotAcknowledged`, `IdentityModeConflict` | The recipient's `identityVerification` block is invalid or incomplete. |
| 400 | `DuplicateExternalId` | Two recipients on the document share an `externalId`. |
| 400 | `RecipientSelectorInvalid` | `createSigningUrl` needs exactly one of `recipientId` or `externalId`. |
| 400 | `InvalidReturnUrl` | `returnUrl` is not an `https` URL. |
| 400 | `IdentityAssertionRequired`, `IdentityAssertionInvalid`, `IdentityProviderMismatch`, `IdentityEmailMismatch`, `IdentityAssertionStale`, `IdentityAssertionReused` | The `external_idv` assertion is missing or fails a check (see [External identity verification](#external-identity-verification)). |
| 402 | `OtpNotEntitled`, `SmsOtpLimitExceeded` | The plan does not include this verification, or the SMS allowance is used up. |
| 403 | `OtpOverrideNotAllowed` | The organization locked the passcode method and the request set a different channel. Omit the channel or match `defaultChannel`. |
| 403 | `EmbeddedSigningNotEnabled`, `SmsOtpNotEnabled`, `ExternalIdvNotAllowed`, `IdentityOverrideNotAllowed` | The organization has not turned on the feature or mode the request uses. |
| 404 | `RecipientNotFound` | No recipient on the document matches the selector. |
| 409 | `SmsProviderNotConfigured` | The recipient resolves to SMS but the organization has no SMS provider saved. |
| 409 | `RecipientRequiresSingleUseUrl` | The deprecated `signing-link` endpoint was called for an `external_idv` or `override` recipient. Use `createSigningUrl`. |
| 409 | `DocumentNotSignable`, `RecipientAlreadySigned`, `RecipientNotInTurn`, `NotSignersTurn` | The document or recipient is not in a signable state. |
| 410 | `SigningUrlNotRedeemable` | A single-use signing URL was already used or has expired. Request a new one. |

A missing document returns `404` with the older `{ "message", "type": "DocumentNotFound" }` body. The signer-facing passcode endpoints that the signing page calls use their own `{ "error", "code" }` body with lowercase codes, for example `locked` with HTTP `423`.

## Override

> **Override is designed for development and testing.** It lets you try embedded signing without setting up a passcode or an identity provider. If your organization needs it in production, an admin can enable it in organization settings. Every signature completed this way is clearly noted as not identity-verified on the certificate of completion and in the audit trail.

## Good practice

- **Never store a signing URL.** Request one when the signer clicks. The single-use URLs expire quickly by design.
- **Verify the signer in your own app first.** Confirm the logged-in user is the recipient before you request a URL.
- **Use `externalId`** to reference a signer by your own record (an Airtable row, a CRM contact) instead of storing TurboDocx's recipient id.
- **Set allowed embedding domains** before you iframe the signing page. Embedding is denied by default, so until your app's origin is on the list the signing page will refuse to frame.
