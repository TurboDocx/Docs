---
title: External Identity Verification (IdV) for Embedded Signing
slug: /TurboSign/external-identity-verification
sidebar_label: External identity verification
sidebar_position: 3
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

import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# External Identity Verification (IdV) for Embedded Signing

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" sampleAppHref="https://github.com/TurboDocx/SDK/tree/main/examples/embedded-web-app" />

External identity verification (`external_idv`) is for apps that already verify their users with an identity verification provider. Your app verifies the signer with that provider (for example a government ID scan plus a selfie). Your backend then tells TurboSign who verified the signer, when, and with which reference id. TurboSign checks that assertion, records it in the tamper-evident audit trail, and gives you a single-use signing URL. The signer goes straight to the document without a TurboSign passcode.

This page covers when to use it, how to turn it on, the exact request shape, and worked examples for common identity verification providers. For the rest of embedded signing (sending without emails, return URLs, iframes), see the [embedded signing overview](../embedded-signing/index.md) and the [API reference](../embedded-signing/reference.md).

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

Use a one-time passcode when you don't run your own identity verification. See [Email and SMS passcode](./one-time-passcode.md).

<!-- Legal language: requires counsel review before publishing -->
:::warning Your responsibilities
With external identity verification, your app and your identity verification provider verify the signer. You are responsible for the verification actually happening and for every value you assert being accurate.

TurboSign records your assertion. It does not contact your provider or independently confirm who the signer is. See [Responsibility and legal considerations](#responsibility-and-legal-considerations).
:::

## Step 1: Turn on external identity verification

An organization **admin** does this once.

1. Go to **Settings** > **Features and integrations** > **Signatures** card > **Configure E-Signature** > **Identity Verification**. (Settings is in the menu under your name at the bottom of the left sidebar.)
2. On the **One-time passcode** tab, turn on **Enable identity verification**. Despite its name, this is the master switch for embedded signing and every verification mode: while it is off, every signing URL request fails with `EmbeddedSigningNotEnabled`. Under **When to verify signers**, keep **Only when requested** if you don't want passcodes on other signature requests.

![The One-time passcode tab with the Enable identity verification switch highlighted](/img/external-identity-verification/01-enable-identity-verification.png)

3. Click the **Identity & embedding** tab and turn on **Allow external identity verification**. The description under it reads "Let your identity verification vendor verify a signer. Your integration asserts the verification when it requests the signing link."

![The Identity & embedding tab with the Allow external identity verification switch highlighted](/img/external-identity-verification/02-allow-external-identity-verification.png)

Changes in this section save as you make them; close the dialog when you're done. Your integration can confirm the setting with `TurboSign.getEmbeddedSigningSettings()`: `enabled` and `allowExternalIdv` should both be `true`.

:::tip Embedding in an iframe?
If you plan to show the signing page inside your app in an iframe, also add your app's origin under **Allowed embedding domains** on the same tab. See [Set up your organization](../embedded-signing/set-up-your-organization.md#step-5-allow-the-origins-that-may-embed-the-signing-page).
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

Run your provider's verification flow in your app as you normally would. Then wait for the **server-side** result. [External IdV provider mappings](./external-idv-provider-mappings.md) shows how the result from Persona, Stripe Identity, Onfido, Jumio, Veriff, CLEAR or ID.me maps onto the assertion.

:::caution Assert only a confirmed result
Identity verification providers deliver the final decision asynchronously, usually by webhook. Build the assertion from that webhook, or from a server-side fetch of the verification by its id. Do not assert off the browser's "finished" event: the user finishing the flow is not the same as the provider approving them.
:::

## Step 4: Request the signing URL with an identity assertion

When the signer clicks "Sign now" in your app, your backend calls `createSigningUrl` with an `identityAssertion`.

The one-call `createEmbeddedSignature` helper only sets up passcodes, so external IdV uses two calls: `sendSignature` with an `external_idv` recipient and `sendEmail: false` (Step 2), then `createSigningUrl` with the assertion (this step). Both calls in each SDK language:

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
import { readFile } from "node:fs/promises";
import { TurboSign } from "@turbodocx/sdk";
// TurboSign.configure(...) as in "Your own iframe".

// Step 2: send the document, no signing-link email.
const sent = await TurboSign.sendSignature({
  file: await readFile("contract.pdf"),
  fileName: "contract.pdf",
  documentName: "Account Agreement",
  sendEmail: false,
  recipients: [
    {
      name: "Jane Doe",
      email: "jane@example.com",
      signingOrder: 1,
      externalId: "your_customer_123",
      identityVerification: { mode: "external_idv", provider: "Persona" },
    },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "jane@example.com",
      template: { anchor: "{signature1}", placement: "replace", size: { width: 100, height: 30 } },
    },
  ],
});

// Step 4: after your provider approves the signer, mint a single-use URL.
const { url } = await TurboSign.createSigningUrl(sent.documentId, {
  externalId: "your_customer_123",
  identityAssertion: {
    provider: "Persona",
    verificationId: "inq_ABC123",
    verifiedAt: "2026-09-16T15:02:00Z",
    subjectEmail: "jane@example.com",
    method: "id_document_liveness",
  },
});
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
from turbodocx_sdk import TurboSign

# Inside an async function, after TurboSign.configure(...) as in "Your own iframe". pdf holds the PDF bytes.
# Step 2: send the document, no signing-link email.
sent = await TurboSign.send_signature(
    file=pdf,
    file_name="contract.pdf",
    document_name="Account Agreement",
    send_email=False,
    recipients=[
        {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "signingOrder": 1,
            "externalId": "your_customer_123",
            "identityVerification": {"mode": "external_idv", "provider": "Persona"},
        }
    ],
    fields=[
        {
            "type": "signature",
            "recipientEmail": "jane@example.com",
            "template": {"anchor": "{signature1}", "placement": "replace", "size": {"width": 100, "height": 30}},
        }
    ],
)

# Step 4: after your provider approves the signer, mint a single-use URL.
link = await TurboSign.create_signing_url(
    sent["documentId"],
    external_id="your_customer_123",
    identity_assertion={  # camelCase keys, as sent to the API
        "provider": "Persona",
        "verificationId": "inq_ABC123",
        "verifiedAt": "2026-09-16T15:02:00Z",
        "subjectEmail": "jane@example.com",
        "method": "id_document_liveness",
    },
)
url = link["url"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
use TurboDocx\TurboSign;
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\TemplateConfig;
use TurboDocx\Types\FieldPlacement;
use TurboDocx\Types\IdentityVerification;
use TurboDocx\Types\IdentityAssertion;
use TurboDocx\Types\Requests\SendSignatureRequest;
use TurboDocx\Types\Requests\CreateSigningUrlRequest;

// Step 2: send the document, no signing-link email.
$sent = TurboSign::sendSignature(new SendSignatureRequest(
    recipients: [
        new Recipient(
            name: 'Jane Doe',
            email: 'jane@example.com',
            signingOrder: 1,
            externalId: 'your_customer_123',
            identityVerification: IdentityVerification::externalIdv('Persona'),
        ),
    ],
    fields: [
        new Field(
            type: SignatureFieldType::SIGNATURE,
            recipientEmail: 'jane@example.com',
            template: new TemplateConfig(
                anchor: '{signature1}',
                placement: FieldPlacement::REPLACE,
                size: ['width' => 100, 'height' => 30]
            )
        ),
    ],
    file: file_get_contents(__DIR__ . '/contract.pdf'),
    documentName: 'Account Agreement',
    sendEmail: false
));

// Step 4: after your provider approves the signer, mint a single-use URL.
$link = TurboSign::createSigningUrl($sent->documentId, new CreateSigningUrlRequest(
    externalId: 'your_customer_123',
    identityAssertion: new IdentityAssertion(
        provider: 'Persona',
        verificationId: 'inq_ABC123',
        verifiedAt: '2026-09-16T15:02:00Z',
        subjectEmail: 'jane@example.com',
        method: 'id_document_liveness',
    ),
));
$url = $link->url;
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
// Inside a function that returns error, with client and ctx as in "Your own iframe". pdf holds the PDF bytes.
// Step 2: send the document, no signing-link email.
sendEmail := false
sent, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
	File:         pdf,
	FileName:     "contract.pdf",
	DocumentName: "Account Agreement",
	SendEmail:    &sendEmail,
	Recipients: []turbodocx.Recipient{
		{
			Name:                 "Jane Doe",
			Email:                "jane@example.com",
			SigningOrder:         1,
			ExternalID:           "your_customer_123",
			IdentityVerification: &turbodocx.IdentityVerification{Mode: "external_idv", Provider: "Persona"},
		},
	},
	Fields: []turbodocx.Field{
		{
			Type:           "signature",
			RecipientEmail: "jane@example.com",
			Template: &turbodocx.TemplateAnchor{
				Anchor:    "{signature1}",
				Placement: "replace",
				Size:      &turbodocx.Size{Width: 100, Height: 30},
			},
		},
	},
})
if err != nil {
	return err
}

// Step 4: after your provider approves the signer, mint a single-use URL.
link, err := client.TurboSign.CreateSigningURL(ctx, sent.DocumentID, &turbodocx.CreateSigningURLRequest{
	ExternalID: "your_customer_123",
	IdentityAssertion: &turbodocx.IdentityAssertion{
		Provider:       "Persona",
		VerificationID: "inq_ABC123",
		VerifiedAt:     "2026-09-16T15:02:00Z",
		SubjectEmail:   "jane@example.com",
		Method:         "id_document_liveness",
	},
})
if err != nil {
	return err
}
fmt.Println(link.URL) // open, redirect to, or frame this URL
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
// Inside a method that throws IOException, with client as in "Your own iframe".
// Step 2: send the document, no signing-link email.
SendSignatureResponse sent = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        .file(Files.readAllBytes(Paths.get("contract.pdf")))
        .fileName("contract.pdf")
        .documentName("Account Agreement")
        .sendEmail(false)
        .recipients(List.of(
            new Recipient.Builder()
                .name("Jane Doe")
                .email("jane@example.com")
                .signingOrder(1)
                .externalId("your_customer_123")
                .identityVerification(IdentityVerification.externalIdv("Persona"))
                .build()))
        .fields(List.of(
            new Field.Builder()
                .type("signature")
                .recipientEmail("jane@example.com")
                .template(new Field.TemplateAnchor.Builder()
                    .anchor("{signature1}")
                    .placement("replace")
                    .size(new Field.Size(100, 30))
                    .build())
                .build()))
        .build());

// Step 4: after your provider approves the signer, mint a single-use URL.
CreateSigningUrlResponse link = client.turboSign().createSigningUrl(
    sent.getDocumentId(),
    new CreateSigningUrlRequest.Builder()
        .externalId("your_customer_123")
        .identityAssertion(new IdentityAssertion.Builder()
            .provider("Persona")
            .verificationId("inq_ABC123")
            .verifiedAt("2026-09-16T15:02:00Z")
            .subjectEmail("jane@example.com")
            .method("id_document_liveness")
            .build())
        .build());
String url = link.getUrl();
```

</TabItem>
<TabItem value="ruby" label="Ruby" attributes={{className: 'tab-lang tab-lang--ruby'}}>

```ruby
# Continues the setup from "Your own iframe": require "turbodocx_sdk" and configure.
# Step 2: send the document, no signing-link email.
sent = TurboDocxSdk::TurboSign.send_signature(
  "file"         => StringIO.new(File.binread("contract.pdf")),
  "documentName" => "Account Agreement",
  "sendEmail"    => false,
  "recipients"   => [
    {
      "name"                 => "Jane Doe",
      "email"                => "jane@example.com",
      "signingOrder"         => 1,
      "externalId"           => "your_customer_123",
      "identityVerification" => { "mode" => "external_idv", "provider" => "Persona" }
    }
  ],
  "fields" => [
    {
      "type"           => "signature",
      "recipientEmail" => "jane@example.com",
      "template"       => { "anchor" => "{signature1}", "placement" => "replace", "size" => { "width" => 100, "height" => 30 } }
    }
  ]
)

# Step 4: after your provider approves the signer, mint a single-use URL.
link = TurboDocxSdk::TurboSign.create_signing_url(
  sent["documentId"],
  external_id: "your_customer_123",
  identity_assertion: {
    "provider"       => "Persona",
    "verificationId" => "inq_ABC123",
    "verifiedAt"     => "2026-09-16T15:02:00Z",
    "subjectEmail"   => "jane@example.com",
    "method"         => "id_document_liveness"
  }
)
url = link["url"]
```

</TabItem>
</Tabs>

Open `url` right away: it is single-use and expires in about five minutes. To show it inside your app, frame it exactly as in the [build guides](../embedded-signing/build/own-iframe.md), or hand it to the [React widget](../embedded-signing/build/react-widget.md) or [web component](../embedded-signing/build/web-component.md).

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
5. `verifiedAt` is a valid date, no more than two minutes in the future (to allow for clock skew), and not older than `maxAgeMinutes`;
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

<!-- Legal language: requires counsel review before publishing -->
:::caution You take responsibility for the match
`overrideEmailMatching: true` turns off only the email check. You alone are responsible for confirming that the person your provider verified is the intended signer.

Use it only when you have confirmed that link in your own systems, and keep a record of how you confirmed it. The override is recorded in TurboSign's audit record, but it is not shown on the rendered audit trail PDF.
:::

## What the signer sees

These screenshots come from the sample app's **External IdV** tab (linked from the box at the top of this page). It **simulates** the identity verification provider and labels it as simulated; in your app this is your provider's real flow.

1. In your app, the signer starts the verification (here, **Verify identity to sign**).

   ![The External IdV form with the Verify identity to sign button highlighted](/img/embedded-signing/idv-01-start.png)

2. The signer completes your provider's flow, for example a photo ID and a selfie.

   ![The simulated identity check with Photo ID and selfie selected and the Continue button highlighted](/img/embedded-signing/idv-02-simulator.png)

3. Your provider reports the verified identity, and the signer continues to sign.

   ![The simulated Identity verified step with the Continue to sign button highlighted](/img/embedded-signing/idv-03-verified.png)

4. Your backend sends the assertion (provider, verification id, time, email, method) when it mints the signing URL. The signing page opens with **no passcode gate**: only the consent step, then the document.

   ![The simulated assertion sent to TurboSign highlighted, above a signing panel showing consent with no passcode step](/img/embedded-signing/idv-04-assertion.png)

5. The signer clicks the **Signature** field, signs, and clicks **Submit Signature**.

   ![The document inside the host app with the Signature field highlighted](/img/embedded-signing/idv-05-document.png)

6. Your page receives `turbosign:completed`. The certificate of completion and the audit trail show "Identity Verified via" your provider, with its reference id.

   ![The All set confirmation highlighted, noting the external identity verification on the certificate](/img/embedded-signing/idv-06-done.png)

## What lands in the audit trail

Each signing URL request and redemption adds entries to the document's tamper-evident, hash-chained audit trail, which is included with the completed document:

| Entry | When | What it records |
|---|---|---|
| **Signing Link Issued** | Your backend calls `createSigningUrl` | The identity mode and the link's expiry. |
| **Identity Verified** via `provider` (ref `verificationId`) | Same call, after the assertion passes every check | `provider`, `verificationId`, `verifiedAt`, `subjectEmail`, plus any of `method`, `methodDetail`, `assuranceLevel`, `verifiedName` and `evidenceUrl` you sent. |
| **Signing Link Opened** | The signer opens the single-use URL | The time the link was redeemed. |

For example, with the Persona assertion above, the entry reads "Identity Verified via Persona (ref inq_ABC123)". Entries also carry the name of the API key or user that requested the link and the request's IP address, like other audit trail entries.

## Provider examples

How a verification from Persona, Stripe Identity, Onfido, Jumio, Veriff, CLEAR, ID.me or your own in-house process maps onto a TurboSign assertion is on its own page: [External IdV provider mappings](./external-idv-provider-mappings.md).

## Errors

These errors come back from sending the document or from `createSigningUrl`. They use the same body as the other identity errors (`message`, `type`, `error` and `code`); see [Errors](../embedded-signing/reference.md#errors) for the full list.

| Status | `code` | When |
|---|---|---|
| 400 | `IdvProviderRequired` | The recipient's `external_idv` block has no `provider`. |
| 400 | `IdentityConfigInvalid` | `provider` is longer than 200 characters, or `maxAgeMinutes` is outside 5 to 10080. |
| 400 | `IdentityModeConflict` | The `external_idv` block carries override fields, or you sent an `identityAssertion` for a recipient that is not `external_idv`. |
| 400 | `IdentityAssertionRequired` | The recipient is `external_idv` but no `identityAssertion` was sent. |
| 400 | `IdentityProviderMismatch` | The assertion's `provider` doesn't exactly match the recipient's. |
| 400 | `IdentityEmailMismatch` | `subjectEmail` doesn't match the recipient's email and `overrideEmailMatching` isn't `true`. |
| 400 | `IdentityAssertionStale` | `verifiedAt` is older than the recipient's `maxAgeMinutes`. Verify the signer again. |
| 400 | `IdentityAssertionInvalid` | `verifiedAt` is not a valid date or is more than two minutes in the future, `method` is not an allowed value, `methodDetail` is missing for `other`, `evidenceUrl` is not `https`, or `provider` is too long. |
| 400 | `IdentityAssertionReused` | Another recipient on the same document already used this `verificationId`. |
| 403 | `ExternalIdvNotAllowed` | **Allow external identity verification** is off for your organization. |
| 403 | `EmbeddedSigningNotEnabled` | **Enable identity verification** is off for your organization. |
| 409 | `RecipientRequiresSingleUseUrl` | The deprecated `signing-link` endpoint was called for an `external_idv` recipient. Use `createSigningUrl`. |
| 410 | `SigningUrlNotRedeemable` | The single-use URL was already opened or has expired. Request a new one. |

A request body that fails the endpoint's schema (for example an unknown key, a `subjectEmail` that isn't an email, or a field over its length limit) is rejected with a 400 validation error before these checks run.

## Responsibility and legal considerations

<!-- Legal language: requires counsel review before publishing -->

**You are responsible for the verification.** You choose the provider, the method, the assurance level and the pass or fail rules. You are responsible for the verification actually happening and for every asserted value being accurate: `provider`, `verificationId`, `verifiedAt`, `subjectEmail`, and any `method`, `assuranceLevel`, `verifiedName` or `evidenceUrl` you send.

**TurboSign records your assertion. It does not verify it.** TurboSign does not contact your provider, review identity documents, or independently confirm that the signer is who the assertion says. It only checks format and consistency, as listed in [What TurboSign checks](#what-turbosign-checks). Passing these checks does not mean a verification happened or was done correctly. The assertion is recorded in the audit trail and on the certificate as information you reported.

**The audit trail is one part of the record.** It shows what your app asserted and what happened in the signing session, not the evidence your provider collected. Keep your verification records alongside it.

**Keep your own evidence.** Retain verification results, reference ids and evidence for as long as your legal, regulatory and contractual obligations require, in a way you can match to the TurboSign document and `verificationId`. If you send `evidenceUrl`, TurboSign stores the link only. You keep the content behind it available and access-controlled.

**Protect the signing URL.** The URL is single-use and issued to your application. Give it only to the person you verified, in their authenticated session, and don't log, store or email it unprotected. Anyone who opens it can act as that signer.

**What counts as enough verification is your decision.** It depends on the document type, your industry and the laws that apply (for example ESIGN, UETA, eIDAS, or rules for your sector). Validity and enforceability depend on your use case and implementation. TurboSign does not decide whether your verification meets any legal, regulatory or contractual requirement.

**Misuse is your responsibility.** This includes an assertion sent without a real verification, with inaccurate information, or with email matching overridden. Only assert after a verification that actually succeeded for the person who will sign.

:::note Not legal advice
This page is general product information, not legal advice. TurboSign is not a law firm. Consult your own counsel about the requirements that apply to your documents.
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

The assertion is passed to `createSigningUrl`, so external IdV is used with signing URLs your app requests and opens for the signer. For signers who arrive from a signing-link email, use a [one-time passcode](./one-time-passcode.md).

## What's next

- **Next:** [External IdV provider mappings](./external-idv-provider-mappings.md)
- [Sender override for testing](./sender-override.md), to try the flow in development without any verification.
- [Set up your organization](../embedded-signing/set-up-your-organization.md): every setting in the Identity Verification section, including allowed embedding domains.
- [Embedded signing API reference](../embedded-signing/reference.md): sending without emails, return URLs and the full error list.
- [TurboSign Webhooks](../Webhooks.md): get notified when the document is completed.
