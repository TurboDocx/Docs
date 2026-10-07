---
title: Sender Override for Development and Testing
slug: /TurboSign/embedded-signing/sender-override
sidebar_label: Sender override (testing only)
sidebar_position: 4
description: Try TurboSign embedded signing in development without a passcode or an identity provider. Turn on the identity verification override, mark a recipient for override, and request a single-use signing URL. Every such signature is marked as not identity-verified.
keywords:
  - identity verification override
  - embedded signing testing
  - skip identity verification
  - override mode
  - sandbox e-signature
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Sender Override for Development and Testing

The override lets you try embedded signing end to end without setting up a passcode or an identity provider. The signer goes straight to the document with no verification step.

:::warning Development and testing only
Every signature completed this way is clearly marked as **not identity-verified** on the certificate of completion and in the audit trail. While the override is allowed, the settings show a persistent banner. Turn it off before you go live.

If your organization needs it in production, an admin can leave it on, but the marking still applies to every override signature.
:::

**What you'll build:**

- An organization with the override switched on.
- A test document whose recipient skips verification.
- A single-use signing URL you can open or frame.

## Prerequisites

- An **admin** account, to turn the override on.
- An **Administrator** or **Contributor** API key for your server.
- If you will frame the page: your origin under **Allowed embedding domains** (see [Set up your organization](../set-up-your-organization.md#step-5-allow-the-origins-that-may-embed-the-signing-page)).

## Step 1: Allow the override (admin)

1. Go to **Settings** > **Features and integrations**, and click **Configure E-Signature** on the **Signatures** card.
2. Click **Identity Verification**, then the **Identity & embedding** tab.
3. Turn on **Allow identity verification override**. The change saves right away, and a banner appears: "Identity verification override is enabled for this organization. Signers can be sent links that skip verification."

![The Allow identity verification override switch turned on, with the persistent override banner below it, highlighted](/img/embedded-signing/override-on-banner.png)

Your integration can confirm it with the organization settings: `allowIdentityOverride` is `true`.

## Step 2: Send a test document with an override recipient

The one-call `createEmbeddedSignature` helper only sets up passcodes, so the override uses `sendSignature` with `sendEmail: false`, then `createSigningUrl`. The `override` block needs `overrideIdentityVerification: true` and a `reason`, which is recorded.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
const sent = await TurboSign.sendSignature({
  file: await readFile("contract.pdf"),
  fileName: "contract.pdf",
  documentName: "Override test",
  sendEmail: false,
  recipients: [
    {
      name: "Test Signer",
      email: "test.signer@example.com",
      signingOrder: 1,
      externalId: "test_123",
      identityVerification: {
        mode: "override",
        overrideIdentityVerification: true,
        reason: "Sandbox testing",
      },
    },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "test.signer@example.com",
      template: { anchor: "{signature1}", placement: "replace", size: { width: 100, height: 30 } },
    },
  ],
});

const { url } = await TurboSign.createSigningUrl(sent.documentId, { externalId: "test_123" });
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
sent = await TurboSign.send_signature(
    file=pdf,
    file_name="contract.pdf",
    document_name="Override test",
    send_email=False,
    recipients=[
        {
            "name": "Test Signer",
            "email": "test.signer@example.com",
            "signingOrder": 1,
            "externalId": "test_123",
            "identityVerification": {
                "mode": "override",
                "overrideIdentityVerification": True,
                "reason": "Sandbox testing",
            },
        }
    ],
    fields=[
        {
            "type": "signature",
            "recipientEmail": "test.signer@example.com",
            "template": {"anchor": "{signature1}", "placement": "replace", "size": {"width": 100, "height": 30}},
        }
    ],
)

link = await TurboSign.create_signing_url(sent["documentId"], external_id="test_123")
url = link["url"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
$sent = TurboSign::sendSignature(new SendSignatureRequest(
    recipients: [
        new Recipient(
            name: 'Test Signer',
            email: 'test.signer@example.com',
            signingOrder: 1,
            externalId: 'test_123',
            identityVerification: IdentityVerification::override('Sandbox testing'),
        ),
    ],
    fields: [
        new Field(
            type: SignatureFieldType::SIGNATURE,
            recipientEmail: 'test.signer@example.com',
            template: new TemplateConfig(
                anchor: '{signature1}',
                placement: FieldPlacement::REPLACE,
                size: ['width' => 100, 'height' => 30]
            )
        ),
    ],
    file: file_get_contents(__DIR__ . '/contract.pdf'),
    documentName: 'Override test',
    sendEmail: false
));

$link = TurboSign::createSigningUrl($sent->documentId, new CreateSigningUrlRequest(externalId: 'test_123'));
$url = $link->url;
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
sendEmail := false
sent, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
	File:         pdf,
	FileName:     "contract.pdf",
	DocumentName: "Override test",
	SendEmail:    &sendEmail,
	Recipients: []turbodocx.Recipient{
		{
			Name:         "Test Signer",
			Email:        "test.signer@example.com",
			SigningOrder: 1,
			ExternalID:   "test_123",
			IdentityVerification: &turbodocx.IdentityVerification{
				Mode:                         "override",
				OverrideIdentityVerification: true,
				Reason:                       "Sandbox testing",
			},
		},
	},
	Fields: []turbodocx.Field{
		{
			Type:           "signature",
			RecipientEmail: "test.signer@example.com",
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

link, err := client.TurboSign.CreateSigningURL(ctx, sent.DocumentID, &turbodocx.CreateSigningURLRequest{ExternalID: "test_123"})
if err != nil {
	return err
}
url := link.URL
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
SendSignatureResponse sent = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        .file(Files.readAllBytes(Paths.get("contract.pdf")))
        .fileName("contract.pdf")
        .documentName("Override test")
        .sendEmail(false)
        .recipients(List.of(
            new Recipient.Builder()
                .name("Test Signer")
                .email("test.signer@example.com")
                .signingOrder(1)
                .externalId("test_123")
                .identityVerification(IdentityVerification.override("Sandbox testing"))
                .build()))
        .fields(List.of(
            new Field.Builder()
                .type("signature")
                .recipientEmail("test.signer@example.com")
                .template(new Field.TemplateAnchor.Builder()
                    .anchor("{signature1}")
                    .placement("replace")
                    .size(new Field.Size(100, 30))
                    .build())
                .build()))
        .build());

String url = client.turboSign().createSigningUrl(
    sent.getDocumentId(),
    new CreateSigningUrlRequest.Builder().externalId("test_123").build()).getUrl();
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
sent = TurboDocxSdk::TurboSign.send_signature(
  "file"         => StringIO.new(File.binread("contract.pdf")),
  "documentName" => "Override test",
  "sendEmail"    => false,
  "recipients"   => [
    {
      "name"                 => "Test Signer",
      "email"                => "test.signer@example.com",
      "signingOrder"         => 1,
      "externalId"           => "test_123",
      "identityVerification" => {
        "mode"                         => "override",
        "overrideIdentityVerification" => true,
        "reason"                       => "Sandbox testing"
      }
    }
  ],
  "fields" => [
    {
      "type"           => "signature",
      "recipientEmail" => "test.signer@example.com",
      "template"       => { "anchor" => "{signature1}", "placement" => "replace", "size" => { "width" => 100, "height" => 30 } }
    }
  ]
)

url = TurboDocxSdk::TurboSign.create_signing_url(sent["documentId"], external_id: "test_123")["url"]
```

</TabItem>
</Tabs>

## Step 3: Open the URL

The override URL is **single-use** and expires in about five minutes. Opening it consumes it, so request a fresh one each time.

Open it in a new tab, or frame it exactly as in the [build guides](../build/own-iframe.md) (your own iframe, the [React widget](../build/react-widget.md), or the [web component](../build/web-component.md)). The signing page opens straight to the document, with no passcode.

## What the signer sees

1. The document opens immediately, with no verification step.
2. The signer signs, and your page receives `turbosign:completed`.
3. The certificate of completion and the audit trail mark the signature as **not identity-verified**.

## Common errors

| HTTP | `code` | Cause | Fix |
|---|---|---|---|
| 403 | `IdentityOverrideNotAllowed` | **Allow identity verification override** is off. | Turn it on (Step 1). |
| 400 | `OverrideNotAcknowledged` | The block is missing `overrideIdentityVerification: true` or a `reason`. | Send both. |
| 400 | `IdentityModeConflict` | The `identityVerification` block is invalid, for example it mixes fields from two modes. | Send only the override fields. |
| 410 | `SigningUrlNotRedeemable` | The single-use URL was already opened or expired. | Request a new URL. |
| 403 | none (a plain `403 Forbidden`) | The API key belongs to a **User**. | Use an **Administrator** or **Contributor** key. |

## What's next

- **Next:** [API reference](../reference.md), for every field, event and error.
- Before going live, switch to a real check: [Email and SMS passcode](./one-time-passcode.md) or [External identity verification](./external-identity-verification.md).
