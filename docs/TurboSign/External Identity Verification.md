---
title: External Identity Verification (IdV) for Embedded Signing
slug: external-identity-verification
sidebar_position: 5.5
description: Verify signers with your identity verification provider, such as Persona, Onfido, Jumio, Veriff or Stripe Identity, then assert the result to TurboSign.
keywords:
  - external identity verification
  - external idv
  - identity verification e-signature
  - bring your own identity verification
  - identityAssertion
  - createSigningUrl
  - embedded signing
  - persona e-signature
  - onfido e-signature
  - jumio e-signature
  - veriff e-signature
  - stripe identity e-signature
  - clear verified
  - id.me
  - kyc e-signature
  - signer identity verification
---

# External Identity Verification (IdV) for Embedded Signing

External identity verification (`external_idv`) is for apps that already verify their users with an identity verification provider. Your app verifies the signer with that provider (for example a government ID scan plus a selfie). Your backend then tells TurboSign who verified the signer, when, and with which reference id. TurboSign checks that assertion, records it in the tamper-evident audit trail, and gives you a single-use signing URL. The signer goes straight to the document without a TurboSign passcode.

This page covers when to use it, how to turn it on, the exact request shape, and worked examples for common identity verification providers. For the rest of embedded signing (sending without emails, return URLs, iframes), see [Embedded Signing and Identity Verification](./Embedded%20Signing.md).

See it working: the External IdV path in the [embedded signing sample app](https://github.com/TurboDocx/SDK/tree/main/examples/embedded-web-app) simulates a verification provider end to end.

## When to use external IdV instead of a passcode

TurboSign can verify an embedded signer in two ways. Pick the one that matches what your app already does.

| | One-time passcode (`otp`) | External identity verification (`external_idv`) |
|---|---|---|
| Who verifies the signer | TurboSign, by sending a code by email or SMS | Your identity verification provider, before the signer reaches TurboSign |
| What it proves | The signer controls that inbox or phone | Whatever your provider checked: an ID document, a selfie match, a database record, a trusted login |
| Extra step for the signer | Enter a six-digit code on the signing page | None on the signing page |
| Signing URL | Reusable signing link | Single-use link that expires in about five minutes |
| Best for | Apps with no identity provider, or where inbox or phone control is enough | Apps that already run KYC, onboarding, or step-up verification with a provider |

Use external IdV when:

- your app already verifies users with a provider and you don't want to make them verify a second time;
- you need stronger evidence than control of an inbox or phone, such as a document check with liveness;
- you want the provider's reference id and evidence link on the signature's audit trail.

Use a one-time passcode when you don't run your own identity verification. See [How to Configure One-Time Passcode (OTP)](./How%20to%20Configure%20One-Time%20Passcode.md).

:::warning Your responsibilities
With external identity verification, your app and your identity verification provider verify the signer, not TurboSign. You are responsible for the accuracy of that verification and for everything you assert.

TurboSign checks the assertion's format, freshness and email match, and records it in the audit trail. It does not contact your provider or independently verify the signer's identity. See [Responsibility and legal considerations](#responsibility-and-legal-considerations).
:::

## Step 1: Turn on external identity verification

An organization **admin** does this once.

1. Go to **Settings** and click **Features and integrations** in the left-hand menu. On the **Signatures** card, click **Configure E-Signature**.
2. In the E-Signature Settings dialog, click **Identity Verification** in the left-hand section list.
3. On the **One-time passcode** tab, turn on **Enable identity verification**. This switch turns on embedded signing for your organization, and TurboSign refuses to issue any signing URL while it is off. Under **When to verify signers**, keep **Only when requested** if you don't want passcodes on other signature requests.

<!-- RECAPTURE: One-time passcode tab with the Enable identity verification switch on. Red box target: the "Enable identity verification" switch. Capture at 948 CSS px width, DPR 1.5. Save as static/img/external-identity-verification/01-enable-identity-verification.png -->
<!-- ![The One-time passcode tab with the Enable identity verification switch highlighted](/img/external-identity-verification/01-enable-identity-verification.png) -->

4. Click the **Identity & embedding** tab and turn on **Allow external identity verification**. The description under it reads "Let your identity verification vendor verify a signer. Your integration asserts the verification when it requests the signing link."

<!-- RECAPTURE: Identity & embedding tab with Allow external identity verification turned on. Red box target: the "Allow external identity verification" switch only (not the override switch below it). Capture at 948 CSS px width, DPR 1.5. Save as static/img/external-identity-verification/02-allow-external-identity-verification.png -->
<!-- ![The Identity & embedding tab with the Allow external identity verification switch highlighted](/img/external-identity-verification/02-allow-external-identity-verification.png) -->

Changes in this section save as you make them. Your integration can confirm the setting with `TurboSign.getEmbeddedSigningSettings()`: `enabled` and `allowExternalIdv` should both be `true`.

:::tip Embedding in an iframe?
If you plan to show the signing page inside your app in an iframe, also add your app's origin under **Allowed embedding domains** on the same tab. See [How to Enable Embedded Signing](./How%20to%20Enable%20Embedded%20Signing.md#step-5-allow-the-origins-that-may-embed-the-signing-page).
:::

## Step 2: Mark the recipient for external IdV

When you send the document, give the recipient an `identityVerification` block with `mode: "external_idv"`. Send with `sendEmail: false` so TurboSign doesn't email a signing link your signer doesn't need.

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "signingOrder": 1,
  "externalId": "your_customer_123",
  "identityVerification": {
    "mode": "external_idv",
    "provider": "Persona",
    "maxAgeMinutes": 1440
  }
}
```

| Field | Required | Description |
|---|---|---|
| `mode` | Yes | `"external_idv"`. |
| `provider` | Yes | A name for your identity verification provider, up to 200 characters. The assertion you send later must use **exactly the same string** (the match is case-sensitive). It is printed in the audit trail, so use a readable name such as `"Persona"`. |
| `maxAgeMinutes` | No | How old the verification may be when you request the signing URL. Between `5` and `10080` (7 days). Defaults to `1440` (24 hours). |

An `external_idv` block can't carry the override fields (`overrideIdentityVerification`, `reason`). If your organization hasn't turned on **Allow external identity verification**, the send fails with `ExternalIdvNotAllowed`.

## Step 3: Verify the signer with your provider

Run your provider's verification flow in your app as you normally would. Then wait for the **server-side** result.

:::caution Assert only a confirmed result
Identity verification providers deliver the final decision asynchronously, usually by webhook. Build the assertion from that webhook, or from a server-side fetch of the verification by its id. Do not assert off the browser's "finished" event: the user finishing the flow is not the same as the provider approving them.
:::

## Step 4: Request the signing URL with an identity assertion

When the signer clicks "Sign now" in your app, your backend calls `createSigningUrl` with an `identityAssertion`.

```typescript
import { TurboSign } from "@turbodocx/sdk"

const { url, expiresAt } = await TurboSign.createSigningUrl(documentId, {
  externalId: "your_customer_123",
  identityAssertion: {
    provider: "Persona",                 // must equal the recipient's provider
    verificationId: "inq_ABC123",        // your provider's id for this verification
    verifiedAt: "2026-09-16T15:02:00Z",  // when the provider verified the signer
    subjectEmail: "jane@example.com",    // the email the provider verified
    method: "id_document_liveness",
    verifiedName: "Jane Doe",
  },
  returnUrl: "https://app.yourcompany.com/signed",
})
// Redirect the signer to `url`, open it in a new tab, or load it in your iframe.
```

The REST equivalent is `POST /turbosign/documents/{documentId}/signing-url` with the same body (`externalId` or `recipientId`, `identityAssertion`, optional `returnUrl`). Unknown keys are rejected.

### Required assertion fields

| Field | Description |
|---|---|
| `provider` | Must equal the `provider` on the recipient's `identityVerification` block. Up to 200 characters. |
| `verificationId` | Your provider's reference id for this verification, up to 256 characters. Recorded in the audit trail and used to stop one verification being used by two signers. |
| `verifiedAt` | ISO 8601 timestamp of when the provider verified the signer. Must be within the recipient's `maxAgeMinutes`, and no more than two minutes in the future (to allow for clock skew). |
| `subjectEmail` | The email address your provider verified. Must be a valid email and, by default, must equal the recipient's email (case and surrounding spaces are ignored). |

### Optional assertion fields

Each optional field adds evidence to the audit trail.

| Field | Description |
|---|---|
| `method` | How your provider verified the signer. One of: `id_document` (a government ID document check), `id_document_liveness` (an ID document plus a selfie or liveness match), `kba` (knowledge-based questions), `database` (checked against an authoritative data source), `sso` (a trusted single sign-on or federated identity), or `other`. |
| `methodDetail` | A free-text description of the technique, up to 200 characters. **Required when `method` is `other`.** |
| `assuranceLevel` | A free-text label for the assurance level your provider attests to, up to 40 characters. For example `ial2_aal2` (NIST SP 800-63), `eidas_substantial` or `eidas_high`. Only send a level your provider and your configuration actually meet. |
| `verifiedName` | The signer's legal name as your provider confirmed it, up to 200 characters. |
| `evidenceUrl` | A link to the verification record in your provider's dashboard, so an auditor can trace the assertion back to its source. Must be an `https` URL, up to 2048 characters. |
| `overrideEmailMatching` | `true` skips the email match check. See [When the verified email differs](#when-the-verified-email-differs). Defaults to `false`. |

### What TurboSign checks

Before it issues the URL, TurboSign confirms that:

1. embedded signing (**Enable identity verification**) and **Allow external identity verification** are still on for your organization. The second switch is checked again here, so turning it off stops new URLs for documents already sent;
2. the recipient is an `external_idv` recipient and an assertion was sent;
3. `provider` matches the recipient exactly;
4. `subjectEmail` matches the recipient's email, unless you set `overrideEmailMatching`;
5. `verifiedAt` is a valid date, not in the future, and not older than `maxAgeMinutes`;
6. the optional fields are valid (`method` from the list, `methodDetail` present for `other`, `evidenceUrl` is `https`);
7. no **other** recipient on the same document already used this `verificationId`.

### The response

```json
{
  "data": {
    "results": {
      "url": "https://app.turbodocx.com/e-signature/embed/{documentId}?sut=...",
      "expiresAt": "2026-09-16T15:07:00Z",
      "recipientId": "...",
      "externalId": "your_customer_123",
      "identityVerificationMode": "external_idv",
      "pendingChecks": []
    }
  }
}
```

The SDKs return the inner `results` object.

- **The URL is single-use.** Opening it consumes it, and it expires about five minutes after you request it. Request it when the signer clicks, and never store it.
- **Requesting a new URL revokes the previous one.** If the signer's link expired, request a new one with the same assertion. That works as long as `verifiedAt` is still within `maxAgeMinutes`, because the reuse check only looks at other recipients.
- **`pendingChecks` is always empty** for `external_idv`. The signing page opens the document without a passcode.

### When the verified email differs

Sometimes the signer verified with your provider under one email (say, a personal address) but signs at another (a work address). By default that request fails with `IdentityEmailMismatch`. If you have confirmed in your own app that the verified person is the signer of record, set `overrideEmailMatching: true`:

```typescript
const { url } = await TurboSign.createSigningUrl(documentId, {
  recipientId,
  identityAssertion: {
    provider: "Persona",
    verificationId: "inq_ABC123",
    verifiedAt: "2026-09-16T15:02:00Z",
    subjectEmail: "jane.personal@example.com",
    overrideEmailMatching: true,
  },
})
```

Only the email comparison is skipped. Every other check still runs, and `subjectEmail` is still required and recorded.

:::caution You take responsibility for the match
With `overrideEmailMatching: true`, TurboSign no longer confirms that the verified identity belongs to the signer of record. The override is kept in the JSON audit trail, but it is not shown on the rendered audit trail PDF.
:::

## What lands in the audit trail

Each signing URL request and redemption adds entries to the document's tamper-evident, hash-chained audit trail, which is included with the completed document:

| Entry | When | What it records |
|---|---|---|
| **Signing Link Issued** | Your backend calls `createSigningUrl` | The identity mode and the link's expiry. |
| **Identity Verified** via `provider` (ref `verificationId`) | Same call, after the assertion passes every check | `provider`, `verificationId`, `verifiedAt`, `subjectEmail`, plus any of `method`, `methodDetail`, `assuranceLevel`, `verifiedName` and `evidenceUrl` you sent. |
| **Signing Link Opened** | The signer opens the single-use URL | The time the link was redeemed. |

For example, with the Persona assertion above, the entry reads "Identity Verified via Persona (ref inq_ABC123)". Entries also carry the name of the API key or user that requested the link and the request's IP address, like other audit trail entries.

## Provider examples

The examples below show how a verification from some well-known identity verification providers maps onto a TurboSign assertion. They are examples only: TurboSign works with any provider (or your own in-house process), and listing a provider here does not imply a partnership or certification. Check your provider's current documentation for the exact field names in its webhook or API response.

In every case:

- `provider` is any readable name you choose, used identically on the recipient and in the assertion.
- `verificationId` is your provider's id for the verification.
- `verifiedAt` is when the provider reached its approved decision.
- `subjectEmail` is the email you have on file for the verified user.
- `evidenceUrl` is the `https` link to that record in your provider's dashboard, if you want auditors to be able to open it.
- `method` should describe what your configuration actually checked. If your flow includes a selfie or liveness step, use `id_document_liveness`; if it checks the ID only, use `id_document`.

### Persona

For example, if you verify signers with Persona, each verification is an **inquiry**, with an id that starts with `inq_`. Persona reports the outcome on the inquiry's status and sends webhook events such as `inquiry.approved`.

| Assertion field | Value |
|---|---|
| `provider` | `"Persona"` |
| `verificationId` | The inquiry id (`inq_...`) |
| `verifiedAt` | The time the inquiry was approved |
| `method` | `id_document_liveness` when your inquiry template includes a government ID and a selfie; `id_document` for ID only |
| `evidenceUrl` | The inquiry's link in your Persona dashboard |

```typescript
// In your handler for Persona's inquiry.approved webhook, after verifying the webhook signature,
// store the inquiry id and approval time on the user. Later, when the user clicks "Sign now":
const { url } = await TurboSign.createSigningUrl(user.documentId, {
  externalId: user.id,
  identityAssertion: {
    provider: "Persona",
    verificationId: user.personaInquiryId,       // "inq_..."
    verifiedAt: user.personaApprovedAt,          // ISO 8601
    subjectEmail: user.email,
    method: "id_document_liveness",
    verifiedName: user.verifiedLegalName,
    evidenceUrl: user.personaInquiryDashboardUrl, // https link to the inquiry
  },
  returnUrl: "https://app.yourcompany.com/signed",
})
```

### Stripe Identity

For example, if you verify signers with Stripe Identity, each verification is a **VerificationSession**, with an id that starts with `vs_`. Stripe sends the `identity.verification_session.verified` webhook event when every check in the session has passed.

| Assertion field | Value |
|---|---|
| `provider` | `"Stripe Identity"` |
| `verificationId` | The VerificationSession id (`vs_...`) |
| `verifiedAt` | The time of the `identity.verification_session.verified` event |
| `method` | `id_document_liveness` when the session requires a matching selfie; `id_document` otherwise |
| `evidenceUrl` | The session's link in your Stripe Dashboard |

```python
from turbodocx_sdk import TurboSign

# The recipient was sent with:
# "identityVerification": {"mode": "external_idv", "provider": "Stripe Identity"}

link = await TurboSign.create_signing_url(
    document_id,
    external_id=user_id,
    identity_assertion={
        "provider": "Stripe Identity",
        "verificationId": verification_session_id,  # "vs_..."
        "verifiedAt": verified_at_iso,               # from the verified event
        "subjectEmail": user_email,
        "method": "id_document_liveness",
        "evidenceUrl": stripe_dashboard_session_url,
    },
    return_url="https://app.yourcompany.com/signed",
)
signing_url = link["url"]  # single-use, about five minutes
```

The Python SDK passes `identity_assertion` through as-is, so its keys stay camelCase.

### Onfido (Entrust)

For example, if you verify signers with Onfido (now part of Entrust), the verification is a **workflow run** (or, in older integrations, a **check** made of reports). A workflow run reaches the status `approved`; a check's result is `clear` when every report passes.

| Assertion field | Value |
|---|---|
| `provider` | `"Onfido"` |
| `verificationId` | The workflow run id (or check id) |
| `verifiedAt` | The time the workflow run was approved, or the check completed as `clear` |
| `method` | `id_document_liveness` for a document report plus a facial similarity report; `id_document` for a document report only |

### Jumio

For example, if you verify signers with Jumio, each verification is a **workflow execution** (a transaction) on a Jumio account. Jumio posts a callback when the workflow finishes, with a decision such as `PASSED`.

| Assertion field | Value |
|---|---|
| `provider` | `"Jumio"` |
| `verificationId` | The workflow execution id |
| `verifiedAt` | The time the workflow execution finished with a passing decision |
| `method` | `id_document_liveness` for an ID plus selfie workflow; `id_document` for an ID-only workflow |

### Veriff

For example, if you verify signers with Veriff, each verification is a **session**. Veriff's decision webhook reports the session's decision, and a successful one has the status `approved`.

| Assertion field | Value |
|---|---|
| `provider` | `"Veriff"` |
| `verificationId` | The Veriff session id |
| `verifiedAt` | The decision time from the decision webhook |
| `method` | `id_document_liveness` for a document plus selfie flow; `id_document` for document only |

### CLEAR

For example, if you verify signers with CLEAR (CLEAR Verified), your backend creates a **verification session** and learns the outcome through CLEAR's webhooks or by polling the session.

| Assertion field | Value |
|---|---|
| `provider` | `"CLEAR"` |
| `verificationId` | The CLEAR verification session id |
| `verifiedAt` | The time the session completed successfully |
| `method` | The value that matches how CLEAR verified the person in your integration. If none of the fixed values fits, use `other` with a `methodDetail` such as `"CLEAR Verified session"` |

### ID.me

For example, if your signers sign in with ID.me (over OpenID Connect or SAML) as part of your app's login or step-up flow, the verification is that authenticated ID.me login.

| Assertion field | Value |
|---|---|
| `provider` | `"ID.me"` |
| `verificationId` | A unique id for that verification event, for example the id of the login or token exchange your app recorded |
| `verifiedAt` | The time of that login |
| `method` | `sso` |
| `assuranceLevel` | `ial2_aal2` only if your ID.me integration actually requested and received an IAL2/AAL2 verification |

### Your own in-house verification

You don't need a third-party provider. If your team verifies customers itself (for example a branch visit or a video call with an agent), use your own system's name as `provider`, your own case id as `verificationId`, and `method: "other"` with a `methodDetail` that says what was checked.

## Errors

These errors come back from sending the document or from `createSigningUrl`. They use the same body as the other identity errors (`message`, `type`, `error` and `code`); see [Errors](./Embedded%20Signing.md#errors) for the full list.

| Status | `code` | When |
|---|---|---|
| 400 | `IdvProviderRequired` | The recipient's `external_idv` block has no `provider`. |
| 400 | `IdentityConfigInvalid` | `provider` is longer than 200 characters, or `maxAgeMinutes` is outside 5 to 10080. |
| 400 | `IdentityModeConflict` | The `external_idv` block carries override fields, or you sent an `identityAssertion` for a recipient that is not `external_idv`. |
| 400 | `IdentityAssertionRequired` | The recipient is `external_idv` but no `identityAssertion` was sent. |
| 400 | `IdentityProviderMismatch` | The assertion's `provider` doesn't exactly match the recipient's. |
| 400 | `IdentityEmailMismatch` | `subjectEmail` doesn't match the recipient's email and `overrideEmailMatching` isn't `true`. |
| 400 | `IdentityAssertionStale` | `verifiedAt` is older than the recipient's `maxAgeMinutes`. Verify the signer again. |
| 400 | `IdentityAssertionInvalid` | `verifiedAt` is not a valid date or is in the future, `method` is not an allowed value, `methodDetail` is missing for `other`, `evidenceUrl` is not `https`, or `provider` is too long. |
| 400 | `IdentityAssertionReused` | Another recipient on the same document already used this `verificationId`. |
| 403 | `ExternalIdvNotAllowed` | **Allow external identity verification** is off for your organization. |
| 403 | `EmbeddedSigningNotEnabled` | **Enable identity verification** is off for your organization. |
| 409 | `RecipientRequiresSingleUseUrl` | The deprecated `signing-link` endpoint was called for an `external_idv` recipient. Use `createSigningUrl`. |
| 410 | `SigningUrlNotRedeemable` | The single-use URL was already opened or has expired. Request a new one. |

A request body that fails the endpoint's schema (for example an unknown key, a `subjectEmail` that isn't an email, or a field over its length limit) is rejected with a 400 validation error before these checks run.

## Responsibility and legal considerations

When you use external identity verification, you take on the identity check that a passcode would otherwise cover.

- **You verify the signer.** Your app and your identity verification provider perform the verification. You are responsible for its accuracy and for what you assert to TurboSign.
- **TurboSign records, it does not verify.** TurboSign checks the assertion's format, that it is recent enough (`maxAgeMinutes`), that the email matches the recipient and that no other signer on the document used the same `verificationId`. It then records the assertion in the audit trail. TurboSign does not contact your provider, review the underlying evidence, or independently confirm who the signer is.
- **Keep your own records.** Keep the verification records and evidence from your provider for as long as you may need them. The audit trail stores what you asserted, not the evidence behind it.
- **Choose a level that fits your use case.** The verification method and assurance level you need depend on the document, your industry and the jurisdictions involved.
- **Misuse is your responsibility.** Sending an assertion without a real verification behind it, reusing a verification for a different person, or setting `overrideEmailMatching` without confirming the match are your responsibility.

:::note Not legal advice
This page describes how the feature works. It is not legal advice. Consult your legal counsel about the verification and signature requirements that apply to your documents.
:::

## Frequently asked questions

### Can I use my own identity verification provider with e-signatures?

Yes. With external identity verification, TurboSign accepts the result from any identity verification provider you already use, such as Persona, Onfido, Jumio, Veriff, Stripe Identity, CLEAR or ID.me, or from your own in-house process. Your backend sends the provider name, its reference id, the verification time and the verified email when it requests the signing URL.

### Does the signer have to verify twice?

No. If your provider already verified the signer within the recipient's `maxAgeMinutes` (24 hours by default, up to 7 days), the signer opens the document directly. TurboSign doesn't send them a passcode.

### Is an external IdV assertion legally binding?

Electronic signature laws such as the US ESIGN Act and UETA, and eIDAS in the EU, generally recognize electronic signatures. Identity evidence helps show who signed. An external IdV assertion adds your provider's verification details to a tamper-evident audit trail, which strengthens that evidence. It does not by itself make a signature a specific legal type (for example an eIDAS advanced or qualified electronic signature), and the weight of the evidence depends on the quality of the verification your provider performed. For requirements that apply to your documents and jurisdiction, consult your legal counsel.

### Does TurboSign verify the signer's ID itself?

No. In this mode your provider performs the verification and you are responsible for it. TurboSign checks that the assertion is consistent (provider, email, age, no reuse across signers) and records it. See [Responsibility and legal considerations](#responsibility-and-legal-considerations).

### What if the signing link expires before the signer opens it?

Request a new one. A new request revokes the old link and returns a fresh single-use URL. You can reuse the same assertion while `verifiedAt` is still within `maxAgeMinutes`.

### Can I use external IdV with documents sent by email?

The assertion is passed to `createSigningUrl`, so external IdV is used with signing URLs your app requests and opens for the signer. For signers who arrive from a signing-link email, use a [one-time passcode](./How%20to%20Configure%20One-Time%20Passcode.md).

## What's next

- [Embedded Signing and Identity Verification](./Embedded%20Signing.md): sending without emails, return URLs, the other verification modes, and the full error list.
- [How to Enable Embedded Signing](./How%20to%20Enable%20Embedded%20Signing.md): every setting in the Identity Verification section, including allowed embedding domains.
- [TurboSign Webhooks](./Webhooks.md): get notified when the document is completed.
