---
title: Embedded Signing API Reference
slug: /TurboSign/embedded-signing/reference
sidebar_label: API reference
sidebar_position: 5
description: Reference for TurboSign embedded signing. Organization settings, the recipient identityVerification block, createEmbeddedSignature, createSigningUrl, return URLs, the completion event, passcode lockout rules, and every error code.
keywords:
  - createSigningUrl
  - createEmbeddedSignature
  - getEmbeddedSigningSettings
  - identityVerification
  - signing-url endpoint
  - turbosign:completed
  - embedded signing errors
  - OtpOverrideNotAllowed
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Embedded Signing API Reference

This page lists every request field, response field, event and error for embedded signing. For a walkthrough, start with the [overview](./index.md) and pick a [build guide](./build/own-iframe.md).

## Organization settings

An organization admin sets these once in the E-Signature settings (see [Set up your organization](./set-up-your-organization.md)). Your integration can **read** them, but not change them. Changes are made in the settings UI, where they are recorded in the settings audit trail.

Read them before you send a document or request a signing URL, so you know what is enabled.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
const settings = await TurboSign.getEmbeddedSigningSettings();
if (!settings.enabled) throw new Error("Ask an admin to turn on embedded signing.");
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
settings = await TurboSign.get_embedded_signing_settings()
if not settings["enabled"]:
    raise RuntimeError("Ask an admin to turn on embedded signing.")
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$settings = TurboSign::getEmbeddedSigningSettings();
if (!$settings->enabled) {
    throw new RuntimeException('Ask an admin to turn on embedded signing.');
}
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
settings, err := client.TurboSign.GetEmbeddedSigningSettings(ctx)
if err != nil {
	return err
}
if !settings.Enabled {
	return errors.New("ask an admin to turn on embedded signing")
}
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
EmbeddedSigningSettings settings = client.turboSign().getEmbeddedSigningSettings();
if (!settings.isEnabled()) {
    throw new IllegalStateException("Ask an admin to turn on embedded signing.");
}
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
settings = TurboDocxSdk::TurboSign.get_embedded_signing_settings
raise "Ask an admin to turn on embedded signing." unless settings["enabled"]
```

</TabItem>
</Tabs>

The REST call is `GET /turbosign/embedded-signing-settings`:

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

The admin's choice under **When to verify signers** applies to every recipient that does not set its own channel. It applies to signatures created in the TurboDocx app **and** to documents you send through the API or SDK.

| Setting | `defaultChannel` | What a recipient with no channel gets |
|---|---|---|
| **Only when requested** | `none` | No passcode, unless the request asks for one. This default is never locked, so a request can always turn verification on. |
| **On every signature request** | `email` or `sms` | A passcode by that method. Unless the admin turns on **Let senders change the method per recipient**, the method is locked (`allowChannelOverride: false`). |

When the method is locked:

- a request that sets the **same** channel, or omits it, succeeds;
- a request that sets a **different** channel fails with `OtpOverrideNotAllowed`.

:::note Exemptions
Automated sends (Pipelines, bulk signature sending, TurboQuote, and the Wrike integration) are exempt from the organization default. Recipients they create are verified only when the request sets verification explicitly.

Recipients using `external_idv` or `override` skip the passcode, so the channel default does not apply to them.
:::

To verify only your embedded signers by text message while everyone else signs without a passcode, see [Verify only your embedded signers by SMS](./identity-verification/one-time-passcode.md#verify-only-your-embedded-signers-by-sms).

## The recipient

Mark a recipient for embedded signing by giving it an `identityVerification` block. The signer's real `email` is always required and stays the signer of record.

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

| Field | Description |
|---|---|
| `phone` | Required when the passcode is delivered by SMS, in international format (for example `+15551234567`). The number must be one that can exist: a well-formed but impossible number is rejected with `OtpPhoneInvalid`. |
| `externalId` | Your own identifier for the signer (for example an Airtable record id). Unique within a document. Lets you request a signing URL by your key instead of storing TurboDocx's recipient id. |
| `identityVerification` | One of the three blocks below. Omit it to take the [organization default](#the-organization-default). |

| Mode | Block |
|---|---|
| One-time passcode | `{ "mode": "otp", "channel": "email" \| "sms" }`. Omit `channel` to take the organization default. |
| External identity verification | `{ "mode": "external_idv", "provider": "your-idv-vendor", "maxAgeMinutes": 1440 }` |
| Override | `{ "mode": "override", "overrideIdentityVerification": true, "reason": "Sandbox testing" }` |

Verification is not tied to embedding. The same per-recipient step-up applies whether the signer arrives through an embedded URL or an emailed link.

:::note PHP and the organization default channel
The PHP SDK's `IdentityVerification::otp()` always sends a channel (it defaults to `email`), so it cannot take the organization default. To take the default from PHP, leave `identityVerification` off the recipient. The other SDKs omit the channel when you don't pass one.
:::

## Sending without signing-link emails

When every signer signs inside your app, send the document with `sendEmail: false` on `prepare-for-signing`. TurboSign then sends no signing-link emails for that document:

- not the initial request,
- not the "your turn" email to the next signer,
- and no scheduled reminders or expiry warnings.

The reply says so:

```json
{
  "message": "Document sent for signing. Signing-link emails were not sent (sendEmail: false); request a signing URL for each recipient."
}
```

Explicit sender actions still send. **Resend Email** and a manual **Remind now** email the signer. Passcode emails and the completed-document copy are unaffected.

`createEmbeddedSignature` sets `sendEmail: false` for you.

## createEmbeddedSignature (one call)

`createEmbeddedSignature` creates the document, adds each signer, and mints a signing URL for whoever signs first. It wraps `sendSignature` and `createSigningUrl`, so there is no separate endpoint.

Each recipient takes an `auth` shorthand for the passcode and a `fields` shorthand for anchor-based fields:

| Language | Email passcode | SMS passcode | Fields shorthand |
|---|---|---|---|
| JavaScript / TypeScript | `auth: { emailOtp: true }` | `auth: { sms: { phoneNumber: "+1..." } }` | `fields: { signature, date, initials, fullName }` |
| Python | `"auth": {"email_otp": True}` | `"auth": {"sms": {"phone_number": "+1..."}}` | `"fields": {"signature", "date", "initials", "full_name"}` |
| PHP | `new EmbeddedRecipientAuth(emailOtp: true)` | `new EmbeddedRecipientAuth(smsPhoneNumber: '+1...')` | `new EmbeddedRecipientFields(signature: ..., date: ...)` |
| Go | `&EmbeddedRecipientAuth{EmailOTP: true}` | `&EmbeddedRecipientAuth{SMS: &EmbeddedRecipientSMS{PhoneNumber: "+1..."}}` | `&EmbeddedRecipientFields{Signature: ..., Date: ...}` |
| Java | `EmbeddedRecipientAuth.emailOtp()` | `EmbeddedRecipientAuth.sms("+1...")` | `new EmbeddedRecipientFields.Builder().signature(...).date(...)` |
| Ruby | `auth: { emailOtp: true }` | `auth: { sms: { phoneNumber: "+1..." } }` | `fields: { signature:, date:, initials:, fullName: }` |

Leave `auth` off for no passcode (the organization default then applies). `signingOrder` defaults to each recipient's position plus one. A top-level `fields` array, when you pass one, replaces the shorthand.

The response has a `documentId` and one entry per recipient, in signing order:

| Field | Description |
|---|---|
| `recipientId` | TurboDocx's id for the recipient. Keep it to mint a later URL. |
| `embedUrl` | The URL to frame. Set only when `status` is `ready`; `null` otherwise (an empty string in Go). |
| `status` | `ready` (their turn, frame it now), `pending` (an earlier signer has not signed yet), or `completed` (already signed). |
| `identityVerificationMode` | For a `ready` signer, the mode TurboSign resolved for the URL. For `pending` or `completed`, the mode you requested through `auth` (`null` when you set none, even if the organization default applies). |

:::note What the one-call helper doesn't cover
The `auth` shorthand only produces passcodes, and its recipients take no `externalId`. For `external_idv` or `override` recipients, or to look recipients up by `externalId`, use `sendSignature` with `sendEmail: false` and then `createSigningUrl`. The [external identity verification](./identity-verification/external-identity-verification.md) and [sender override](./identity-verification/sender-override.md) guides show this.
:::

## Requesting a signing URL

When your signer is ready, call `createSigningUrl`. Request one at the moment the signer clicks; never store it.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
const { url, expiresAt, identityVerificationMode, pendingChecks } =
  await TurboSign.createSigningUrl(documentId, {
    externalId: "your_customer_123", // or recipientId, exactly one
    returnUrl: "https://app.yourcompany.com/signed",
  });
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
link = await TurboSign.create_signing_url(
    document_id,
    external_id="your_customer_123",  # or recipient_id, exactly one
    return_url="https://app.yourcompany.com/signed",
)
url, pending_checks = link["url"], link["pendingChecks"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
use TurboDocx\Types\Requests\CreateSigningUrlRequest;

$link = TurboSign::createSigningUrl($documentId, new CreateSigningUrlRequest(
    externalId: 'your_customer_123', // or recipientId, exactly one
    returnUrl: 'https://app.yourcompany.com/signed'
));
$url = $link->url;
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
link, err := client.TurboSign.CreateSigningURL(ctx, documentID, &turbodocx.CreateSigningURLRequest{
	ExternalID: "your_customer_123", // or RecipientID, exactly one
	ReturnURL:  "https://app.yourcompany.com/signed",
})
if err != nil {
	return err
}
url := link.URL
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
CreateSigningUrlResponse link = client.turboSign().createSigningUrl(
    documentId,
    new CreateSigningUrlRequest.Builder()
        .externalId("your_customer_123") // or recipientId, exactly one
        .returnUrl("https://app.yourcompany.com/signed")
        .build());
String url = link.getUrl();
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
link = TurboDocxSdk::TurboSign.create_signing_url(
  document_id,
  external_id: "your_customer_123", # or recipient_id:, exactly one
  return_url: "https://app.yourcompany.com/signed"
)
url = link["url"]
```

</TabItem>
</Tabs>

The equivalent REST call:

```
POST /turbosign/documents/{documentId}/signing-url
{
  "externalId": "your_customer_123"
}
```

### Request body

| Field | Description |
|---|---|
| `recipientId` or `externalId` | Picks the recipient. Send exactly one. |
| `returnUrl` | Optional. Where the signer goes after signing. Must be `https`. See [Return URL](#return-url). |
| `identityAssertion` | Required for `external_idv` recipients. See [External identity verification](./identity-verification/external-identity-verification.md). |

Unknown keys are rejected.

### Response

The REST response wraps the result in `data.results`. The SDKs return the inner object.

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

What `url` is depends on the recipient's mode:

| Mode | `url` | `expiresAt` | `pendingChecks` |
|---|---|---|---|
| `otp` or no verification | The reusable signing link | The document's own expiry, or `null` when it doesn't expire | The passcode step the signer must clear (`email_otp` or `sms_otp`); empty with no verification |
| `external_idv` or `override` | A **single-use** link. Opening it consumes it. | About five minutes after issue | Empty |

Open `url` for the signer: a new tab, a redirect, or an iframe. The signing page handles the rest. For `external_idv` and `override` it redeems the single-use token and shows the document; for `otp` it asks for the passcode first.

### Return URL

`returnUrl` must be an `https` URL. When signing finishes, the signer is returned there.

- TurboSign stores it on the recipient when you request the signing URL. It is never carried in the signing URL itself, so a signer cannot edit it into a redirect to another site.
- The signing page reads it back when it loads and redirects there after the signer finishes.
- It is set per request. Requesting a new signing URL without `returnUrl` clears the one stored earlier.

:::caution Deprecated: GET signing-link
`GET /turbosign/documents/{documentId}/recipients/{recipientId}/signing-link` is deprecated. It still works, and goes through the same checks and audit trail as `createSigningUrl`. Its responses carry a `Deprecation: true` header and a `Link` header pointing to the successor, `POST /turbosign/documents/{documentId}/signing-url`. Move to the `POST` endpoint, which handles every identity mode.
:::

## Completion event

When a signer finishes, the signing page posts this message to the page that frames it:

```json
{
  "type": "turbosign:completed",
  "documentId": "4f1c...",
  "status": "completed",
  "event": "signing_complete",
  "scope": "recipient"
}
```

| Field | Description |
|---|---|
| `type` | Always `turbosign:completed`. |
| `documentId` | The signing document's id. |
| `status` | `completed`. |
| `event` | `signing_complete` when the signer just finished, or `already_signed` when they reopened a link they had already completed. Use it to skip one-time "thanks for signing" side effects. |
| `scope` | `recipient`: **this** signer's step finished. On a document with several signers, others may still be pending. Read the document's status on your server, or watch the `completed` [webhook](../Webhooks.md), for the whole document. |

Verify `event.origin` (and, with your own iframe, `event.source`) before you trust the message. The `@turbodocx/embed` package also defines `turbosign:declined` and `turbosign:error` handlers, but the signing page does not send those events yet.

## Passcode attempts and lockout

| Rule | Limit |
|---|---|
| Code length and lifetime | Six digits, expires after 10 minutes |
| Requesting a new code | At most every 30 seconds, and five times per hour |
| Wrong entries per code | Five, then the signer must request a new code |
| Wrong entries in total | **20**, across resends, then the signer is locked |

When a signer is locked, the signing page shows the lock, and both sending and verifying a code return HTTP `423` until the sender resends the signing request. Only the sender can lift the lock, with **Resend Email** in the app or `POST /turbosign/documents/{documentId}/resend-email`. That resend emails the signer, even on a document sent with `sendEmail: false`.

The document's sender gets an email alert twice per signer:

1. at 5 wrong codes ("having trouble verifying"), so you can check the signer's email or phone number before the lock;
2. when the signer is locked out at 20.

The alerts go to the sender's email address. A document with no sender email (for example an API-key send without `senderEmail`) gets no alert.

## Errors

Identity and passcode errors from sending a document and from `createSigningUrl` use one response body. `message` and `error` carry the same human-readable text, and `type` and `code` carry the same machine-readable value, so read whichever pair your client already uses:

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
| 400 | `IdentityAssertionRequired`, `IdentityAssertionInvalid`, `IdentityProviderMismatch`, `IdentityEmailMismatch`, `IdentityAssertionStale`, `IdentityAssertionReused` | The `external_idv` assertion is missing or fails a check (see [External identity verification](./identity-verification/external-identity-verification.md#errors)). |
| 402 | `OtpNotEntitled`, `SmsOtpLimitExceeded` | The plan does not include this verification, or the SMS allowance is used up. |
| 403 | none (a plain `403 Forbidden`) | The API key belongs to a **User**. Requesting a signing URL needs an **Administrator** or **Contributor** key. |
| 403 | `OtpOverrideNotAllowed` | The organization locked the passcode method and the request set a different channel. Omit the channel or match `defaultChannel`. |
| 403 | `EmbeddedSigningNotEnabled`, `SmsOtpNotEnabled`, `ExternalIdvNotAllowed`, `IdentityOverrideNotAllowed` | The organization has not turned on the feature or mode the request uses. |
| 404 | `RecipientNotFound` | No recipient on the document matches the selector. |
| 409 | `SmsProviderNotConfigured` | The recipient resolves to SMS but the organization has no SMS provider saved. |
| 409 | `RecipientRequiresSingleUseUrl` | The deprecated `signing-link` endpoint was called for an `external_idv` or `override` recipient. Use `createSigningUrl`. |
| 409 | `DocumentNotSignable`, `RecipientAlreadySigned`, `RecipientNotInTurn`, `NotSignersTurn` | The document or recipient is not in a signable state. |
| 410 | `SigningUrlNotRedeemable` | A single-use signing URL was already used or has expired. Request a new one. |
| 423 | `locked` | The signer entered 20 wrong codes. See [Passcode attempts and lockout](#passcode-attempts-and-lockout). |

A missing document returns `404` with the older `{ "message", "type": "DocumentNotFound" }` body. The signer-facing passcode endpoints that the signing page calls use their own `{ "error", "code" }` body with lowercase codes, for example `locked` with HTTP `423`.

:::warning A blank iframe is not an API error
When your origin is not under **Allowed embedding domains**, the API calls all succeed but the browser refuses to render the frame (a `frame-ancestors` error in the console). Add your origin in [Set up your organization](./set-up-your-organization.md#step-5-allow-the-origins-that-may-embed-the-signing-page).
:::
