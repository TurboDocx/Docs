---
title: External IdV Provider Mappings
slug: /TurboSign/external-idv-provider-mappings
sidebar_label: Provider mappings
sidebar_position: 4
description: How a verification from Persona, Stripe Identity, Onfido, Jumio, Veriff, CLEAR, ID.me, Incode or an in-house manual review maps onto a TurboSign external identity verification assertion.
keywords:
  - persona e-signature
  - stripe identity e-signature
  - onfido e-signature
  - jumio e-signature
  - veriff e-signature
  - clear verified
  - id.me
  - incode e-signature
  - manual identity review e-signature
  - identityAssertion mapping
---

# External IdV Provider Mappings

This page shows how to build the `identityAssertion` for [external identity verification](./external-identity-verification.md) from common identity verification providers. Use it at Step 3 of that guide, once your provider has approved the signer.

The examples below show how a verification from some well-known identity verification providers maps onto a TurboSign assertion. They are examples only: TurboSign works with any provider (or your own in-house process), and listing a provider here does not imply a partnership or certification. Check your provider's current documentation for the exact field names in its webhook or API response.

In every case:

- `provider` is any readable name you choose, used identically on the recipient and in the assertion.
- `verificationId` is your provider's id for the verification.
- `verifiedAt` is when the provider reached its approved decision.
- `subjectEmail` is the email you have on file for the verified user.
- `evidenceUrl` is the `https` link to that record in your provider's dashboard, if you want auditors to be able to open it.
- `method` should describe what your configuration actually checked. If your flow includes a selfie or liveness step, use `id_document_liveness`; if it checks the ID only, use `id_document`.

## Persona

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

## Stripe Identity

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

## Onfido (Entrust)

For example, if you verify signers with Onfido (now part of Entrust), the verification is a **workflow run** (or, in older integrations, a **check** made of reports). A workflow run reaches the status `approved`; a check's result is `clear` when every report passes.

| Assertion field | Value |
|---|---|
| `provider` | `"Onfido"` |
| `verificationId` | The workflow run id (or check id) |
| `verifiedAt` | The time the workflow run was approved, or the check completed as `clear` |
| `method` | `id_document_liveness` for a document report plus a facial similarity report; `id_document` for a document report only |

## Jumio

For example, if you verify signers with Jumio, each verification is a **workflow execution** (a transaction) on a Jumio account. Jumio posts a callback when the workflow finishes, with a decision such as `PASSED`.

| Assertion field | Value |
|---|---|
| `provider` | `"Jumio"` |
| `verificationId` | The workflow execution id |
| `verifiedAt` | The time the workflow execution finished with a passing decision |
| `method` | `id_document_liveness` for an ID plus selfie workflow; `id_document` for an ID-only workflow |

## Veriff

For example, if you verify signers with Veriff, each verification is a **session**. Veriff's decision webhook reports the session's decision, and a successful one has the status `approved`.

| Assertion field | Value |
|---|---|
| `provider` | `"Veriff"` |
| `verificationId` | The Veriff session id |
| `verifiedAt` | The decision time from the decision webhook |
| `method` | `id_document_liveness` for a document plus selfie flow; `id_document` for document only |

## CLEAR

For example, if you verify signers with CLEAR (CLEAR Verified), your backend creates a **verification session** and learns the outcome through CLEAR's webhooks or by polling the session.

| Assertion field | Value |
|---|---|
| `provider` | `"CLEAR"` |
| `verificationId` | The CLEAR verification session id |
| `verifiedAt` | The time the session completed successfully |
| `method` | The value that matches how CLEAR verified the person in your integration. If none of the fixed values fits, use `other` with a `methodDetail` such as `"CLEAR Verified session"` |

## ID.me

For example, if your signers sign in with ID.me (over OpenID Connect or SAML) as part of your app's login or step-up flow, the verification is that authenticated ID.me login.

| Assertion field | Value |
|---|---|
| `provider` | `"ID.me"` |
| `verificationId` | A unique id for that verification event, for example the id of the login or token exchange your app recorded |
| `verifiedAt` | The time of that login |
| `method` | `sso` |
| `assuranceLevel` | `ial2_aal2` only if your ID.me integration actually requested and received an IAL2/AAL2 verification |

## Incode

For example, if you verify signers with Incode (Incode Omni), each verification is an **onboarding session**, identified by its **interview id** (`interviewId`, also called the session id). When the user finishes, Incode sends the Onboarding Status webhook with the `ONBOARDING_FINISHED` event. Your backend then fetches the session's scores (`/omni/get/score`) and treats the session as passed only when the overall status (`overall.status`) is `OK`. `WARN` and `FAIL` are not a pass.

| Assertion field | Value |
|---|---|
| `provider` | `"Incode"` |
| `verificationId` | The session's `interviewId` |
| `verifiedAt` | The time your backend confirmed `overall.status` is `OK` (Incode's score response doesn't document a decision timestamp, so record your own) |
| `subjectEmail` | The email you have on file for the user. Incode's scores and ID data don't necessarily include an email; check your Incode configuration |
| `verifiedName` | Optional: `name.fullName` from the session's OCR data (Fetch OCR Data) |
| `method` | `id_document_liveness` when your Incode flow includes a selfie or face match; `id_document` for ID only |

```typescript
// Incode docs: Fetch scores (developer.incode.com/integrate-by-platform/fetch-scores/),
// Fetch OCR data (developer.incode.com/docs/fetch-extracted-ocr), Onboarding Status webhook (ONBOARDING_FINISHED).
// After ONBOARDING_FINISHED, your backend fetched the scores and saw overall.status === "OK":
const { url } = await TurboSign.createSigningUrl(user.documentId, {
  externalId: user.id,
  identityAssertion: {
    provider: "Incode",
    verificationId: user.incodeInterviewId,
    verifiedAt: user.incodeApprovedAt,   // when you confirmed overall.status "OK"
    subjectEmail: user.email,
    method: "id_document_liveness",
    verifiedName: user.incodeFullName,   // name.fullName from the OCR data, optional
  },
})
```

## In-house or manual review

You don't need a third-party provider. Many teams verify customers themselves: an operations reviewer approves the customer in your own portal or back office, for example after checking an ID document, a branch visit or a KYC call. Then your app hands off to TurboSign.

| Assertion field | Value |
|---|---|
| `provider` | Your own system's name, for example `"internal-review"`. Use the same string on the recipient (`identityVerification.provider`) |
| `verificationId` | Your approval or case record id |
| `verifiedAt` | When the reviewer approved the customer |
| `subjectEmail` | The customer's email on file |
| `method` | The value that matches what the reviewer checked: `id_document`, `id_document_liveness`, `kba`, `database`, `sso`, or `other`. For a manual review that fits none of them, use `other` with a `methodDetail` such as `"Manual ID review by operations"`; `methodDetail` is required when `method` is `other` |
| `verifiedName` | Optional: the legal name the reviewer confirmed |
| `evidenceUrl` | Optional: an `https` link to the approval record in your back office |

```typescript
const { url } = await TurboSign.createSigningUrl(customer.documentId, {
  externalId: customer.id,
  identityAssertion: {
    provider: "internal-review",
    verificationId: approval.caseId,
    verifiedAt: approval.approvedAt,   // ISO 8601
    subjectEmail: customer.email,
    method: "other",
    methodDetail: "Manual ID review by operations",
    evidenceUrl: approval.recordUrl,   // optional, https only
  },
})
```

- **Approval age:** the approval must be newer than the recipient's `maxAgeMinutes` (5 to 10080 minutes, default 1440, so 24 hours) and no more than two minutes in the future. If a reviewer approved days ago, set a longer `maxAgeMinutes` on the recipient or re-confirm the customer.
- **Keep the approval record.** The audit trail points to your `provider` and `verificationId`, so retain that record for as long as you keep the signed documents.
- **Low-code:** from an automation tool, call `POST /turbosign/documents/{documentId}/signing-url` in an HTTP step on the server side, with an **Administrator** or **Contributor** API key. Never call it from the browser.

## Next

- **Back to:** [External identity verification](./external-identity-verification.md#step-4-request-the-signing-url-with-an-identity-assertion), Step 4.
- **Next:** [Sender override for testing](./sender-override.md)
