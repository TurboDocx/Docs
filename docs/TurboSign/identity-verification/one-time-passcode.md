---
title: Email and SMS Passcode (One-Time Passcode)
slug: /TurboSign/how-to-configure-one-time-passcode
sidebar_label: Email and SMS passcode
sidebar_position: 2
description: Configure one-time passcode identity verification for TurboSign - require a passcode, choose email or SMS delivery, connect an SMS provider, and get alerted when a passcode fails to send.
keywords:
  - one-time passcode
  - otp configuration
  - identity verification
  - sms passcode
  - twilio otp
  - ringcentral otp
  - passcode delivery alerts
  - signer verification
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Email and SMS Passcode

A one-time passcode (OTP) verifies a signer's identity before they can open your document. The signer receives a short code by email or text message and enters it on the signing page. It works on signing links TurboSign emails and on signing pages you embed in your own app.

This guide covers requiring a passcode, choosing the default channel, connecting an SMS provider, and setting up delivery-failure alerts.

## Before you start

- **Who:** you need an **admin** account for your organization.
- **Where:** everything lives on the **One-time passcode** tab of the **Identity Verification** section in your E-Signature settings.
- **Saving:** changes on this tab save as you make them. The one exception is the SMS provider form, which needs **Save SMS provider**.

To reach the tab:

1. Go to **Settings** > **Features and integrations** > **Signatures** card > **Configure E-Signature** > **Identity Verification**. (Settings is in the menu under your name at the bottom of the left sidebar.)
2. Stay on the **One-time passcode** tab.

For screenshots of these first clicks, see [Set up your organization](../embedded-signing/set-up-your-organization.md), Steps 1-2.

:::note What this controls
These settings decide **when** signers are verified by default and **which** channels are available.

The default applies to signatures created in the app and to documents sent through the API or SDK. Automated sends (Pipelines, bulk signature sending, TurboQuote, and the Wrike integration) are exempt. They verify a recipient only when the request asks for it.
:::

### At a glance

| Step | What you do | Needed for |
|---|---|---|
| [1](#step-1-turn-on-enable-identity-verification) | Turn on **Enable identity verification** | Everyone |
| [2](#step-2-choose-when-to-verify-signers) | Choose when to verify signers | Everyone |
| [3](#step-3-use-email-the-simplest-path) | Use email | Email only (no setup) |
| [4](#step-4-allow-sms-as-an-alternative-to-email) | Allow SMS | SMS only |
| [5](#step-5-connect-your-sms-provider) | Connect your SMS provider | SMS only |
| [6](#step-6-get-alerted-when-a-passcode-cannot-be-delivered) | Set up delivery-failure alerts | Optional (on by default) |
| [7](#step-7-know-what-happens-when-a-signer-keeps-entering-the-wrong-code) | Understand wrong-code alerts and lockout | Reference |

## Step 1: Turn on Enable identity verification

On the **One-time passcode** tab, turn on **Enable identity verification**.

The rest of the passcode settings stay hidden until this is on, so turn it on first.

![The One-time passcode tab with the Enable identity verification toggle and the selected Only when requested option highlighted](/img/how-to-enable-embedded-signing/03-identity-verification-settings.png)

Turning it on makes passcode verification available. Whether every signer gets a passcode depends on the choice in Step 2.

:::note This is also the embedded signing switch
Despite its name, **Enable identity verification** turns on embedded signing and every verification mode, including external identity verification and the override. While it is off, every signing URL request fails with `EmbeddedSigningNotEnabled`.
:::

## Step 2: Choose when to verify signers

Under **When to verify signers**, choose one:

| Option | What happens |
|---|---|
| **Only when requested** (the default) | No passcode by default. A sender can turn it on for a recipient, and a request made through the API or SDK (for example, embedded signing) can ask for it. This option is never locked, so a request can always turn verification on. |
| **On every signature request** | Every signer enters a passcode before signing, including on documents sent through the API or SDK. |

![The When to verify signers options with Only when requested selected and highlighted](/img/how-to-configure-otp/otp-01-when-to-verify.png)

### If you choose On every signature request

Two more settings appear.

**Method** sets how the passcode reaches signers:

- **Email** sends the passcode to the signer's email address. Email is available on every plan.
- **SMS** texts the passcode to the signer's mobile number. SMS requires a connected provider and is available on Pro and Enterprise plans (see Steps 4-5).

:::warning SMS needs a connected provider first
**SMS cannot be selected until SMS is turned on and provider credentials are saved (Steps 4-5).** Check that the provider status reads **Connected to Twilio** (or RingCentral) before you rely on it.
:::

**Let senders change the method per recipient** is off by default.

- **Off** locks the method. Every request uses the method above, and an API or SDK request that sets a different channel for a recipient is rejected with `OtpOverrideNotAllowed`.
- **On** lets a sender pick another method, or no verification, for a recipient.

This setting applies to the email channel too, so it is not tied to your SMS plan.

:::tip Passcodes only for signers in your own app
If only the signers in your own app should verify, keep **Only when requested**. Turn on SMS and connect a provider (Steps 4-5), then have your integration request SMS on each recipient it embeds.

Other signature requests, including Pipelines, stay passcode-free. See [Verify only your embedded signers by SMS](#verify-only-your-embedded-signers-by-sms).
:::

### Check the result from your integration

Your integration can read the result with `GET /turbosign/embedded-signing-settings`:

- `defaultChannel` is `none`, `email`, or `sms`.
- `allowChannelOverride` tells it whether a different channel is accepted.

See [The organization default](../embedded-signing/reference.md#the-organization-default) for details.

## Step 3: Use email (the simplest path)

Email passcodes work on every plan and need no setup. If **Email** is your method, you are done: signers receive their passcode by email.

Next, continue to [Step 6](#step-6-get-alerted-when-a-passcode-cannot-be-delivered) to set up delivery-failure alerts, or skip to [What the signer sees](#what-the-signer-sees).

## Step 4: Allow SMS as an alternative to email

To let signers verify by text message, turn on **Allow SMS as an alternative to email** under **Text message (SMS)**.

Senders can then choose SMS instead of email for a recipient. Each signer verifies by one method, not both, and SMS may incur usage charges.

![The Text message (SMS) section with the Allow SMS as an alternative to email toggle highlighted](/img/how-to-configure-otp/otp-02-allow-sms.png)

:::note SMS is plan-gated
SMS verification is available on **Pro and Enterprise plans**. If your plan does not include it, the toggle is disabled and an **Upgrade to unlock SMS verification** card appears.
:::

### Signer mobile numbers

SMS verification needs a mobile number for each signer you verify this way. You enter it when you add the recipient to a signature request.

- The number must include the country code.
- The number must be one that can exist. A well-formed number that cannot exist is rejected when the request is created (`OtpPhoneInvalid`), not later when the signer asks for a code.

## Step 5: Connect your SMS provider

TurboSign sends SMS passcodes through **your own** SMS account, so your provider bills passcodes at your rates. Connect the provider under **Text message (SMS)** once the toggle from Step 4 is on.

1. Choose your **Provider**: **Twilio** or **RingCentral**.
2. Enter the **From number** in international format with the country code, for example `+13055551234`.
3. Enter your provider credentials:
   - **Twilio:** Account SID and Auth Token.
   - **RingCentral:** Server URL, Client ID, Client Secret, and JWT. RingCentral needs some setup on its side first, so follow [Set up RingCentral](#set-up-ringcentral) below.
4. Click **Save SMS provider**.

![The SMS provider form with the provider, from number, credential fields, and Save SMS provider button highlighted](/img/how-to-configure-otp/otp-03-sms-provider-form.png)

### Confirm the connection

When you click **Save SMS provider**, TurboSign checks the account straight away. The check is free and no text is sent.

1. Check the status at the top of the box. It should read **Connected to Twilio**.
2. If it reads **Twilio rejected these credentials**, read the alert below the fields for the provider's reason.
3. Use **Send a test message** to text a number you control and confirm delivery end to end.

**Verify connection** re-runs the check at any time.

![The Send a test message area with the Test number field and Send test message button highlighted](/img/how-to-configure-otp/otp-04-sms-test-message.png)

### Provider status

The status at the top of the box is one of these. With RingCentral, the status names RingCentral instead of Twilio.

| Status (Twilio) | Status (RingCentral) | Meaning |
|---|---|---|
| **SMS provider not connected** | **SMS provider not connected** | No credentials are saved yet. |
| **Twilio credentials saved** | **RingCentral credentials saved** | Credentials are saved but have not been checked in this session. |
| **Connected to Twilio** | **Connected to RingCentral** | The provider accepted the credentials. This is the state you want. |
| **Twilio rejected these credentials** | **RingCentral rejected these credentials** | Fix the credentials and save again. |

:::caution Use a production provider account
SMS passcodes use a custom message body, which **trial accounts** (for example a Twilio trial) block. Use a paid, production provider account.

Sending to US numbers also requires **A2P 10DLC registration** on your provider account. TurboSign links to your provider's registration flow next to the credential fields.
:::

:::note When SMS becomes selectable
The **SMS** method (Step 2) stays disabled until SMS is turned on, your plan includes it, **and** provider credentials are saved.

Saving does not prove the credentials work, so check that the status reads **Connected to Twilio** (or RingCentral). If you later remove the provider credentials while **SMS** is the method, the method switches to **Email**, so signers are still verified on every request through a channel that can deliver.
:::

### Set up RingCentral

With RingCentral, you bring your own RingCentral app and a JWT credential. Do these steps in the [RingCentral Developer Console](https://developers.ringcentral.com/console) first, then enter the details in TurboSign.

#### 1. Create a RingCentral app

1. In the Developer Console, create a **REST API** app.
2. In the app's **Auth** section, choose the **JWT auth flow**.
3. Add the **SMS** permission to the app.
4. Copy the app's **Client ID** and **Client Secret**. You enter both in TurboSign.

#### 2. Create a JWT credential

1. Sign in to the Developer Console as the **RingCentral user who owns the number you will send from**. The JWT acts as this user, and texts are sent from this user's numbers.
2. Go to **Credentials** and create a **JWT credential**. We recommend restricting it to the Client ID of the app from the previous step.
3. Choose an expiration date, or none. RingCentral JWTs never expire unless you set a date. If you set one, TurboSign shows it in the form (see [Check when your JWT expires](#check-when-your-jwt-expires)).
4. Copy the JWT. You enter it in TurboSign.

#### 3. Choose the From number

The **From number** must be:

- In international (E.164) format with the country code, for example `+13055551234`.
- A number that belongs to the user from the previous step and has the **SmsSender** feature in RingCentral.
- For US and Canada local numbers, registered to an approved **10DLC (TCR) brand and campaign** before it can send. This applies to developer (sandbox) accounts too, and texts sent from a sandbox account carry a test watermark.

:::warning
A number that only has the **A2PSmsSender** feature (RingCentral's high-volume SMS API) cannot send through TurboSign.
:::

#### 4. Enter the details in TurboSign

1. In the SMS provider form, choose **RingCentral** as the **Provider**.
2. Enter the **From number** from the previous step.
3. Enter the **Server URL** for the environment where you created the app and the JWT. Any other address is rejected when you save.

   | Environment | Server URL |
   |---|---|
   | Production | `https://platform.ringcentral.com` |
   | Sandbox | `https://platform.devtest.ringcentral.com` |

4. Enter the **Client ID**, **Client Secret**, and **JWT**.
5. Click **Save SMS provider**. TurboSign checks the account straight away, without sending a text. The status at the top of the box should read **Connected to RingCentral**.
6. Use **Send a test message** to text a number you control and confirm delivery.

#### Check when your JWT expires

Each time you open the form, TurboSign shows when the saved JWT expires, under the **JWT** field. The JWT itself is never shown.

You see one of these:

| What you see | What it means |
|---|---|
| **JWT expires on** *date*, with a small calendar tile showing the date | Texts stop on that date until you save a new JWT. |
| An orange warning, **JWT expires on** *date* **(in** *N* **days)** | The date is 30 days away or less. Create a new JWT in RingCentral and save it in TurboSign before then. |
| A red **This JWT expired on** *date* | Text messages cannot be sent until you create a new JWT in RingCentral and save it in TurboSign. |
| **No expiration set on this JWT.** | It keeps working until it is revoked in RingCentral. |
| **Couldn't read an expiration date from this JWT.** | Check it in the RingCentral Developer Console. |

When you save a JWT that has an expiration date, the confirmation also tells you, for example **SMS provider saved. Expiration detected on this JWT: JWT expires on** *date*.

![The RingCentral SMS provider form with the JWT expiration date and calendar tile under the JWT field highlighted](/img/how-to-configure-otp/otp-06-ringcentral-jwt-expiry.png)

:::tip Replacing a JWT
Create a new JWT in the Developer Console, paste it into the **JWT** field, and click **Save SMS provider**. Leave the other secret fields blank to keep their saved values.
:::

#### Troubleshooting RingCentral

**RingCentral rejects the credentials or reports "RingCentral auth failed".** Check that:

- The **Server URL** matches where the app and JWT were created (sandbox or production).
- The app uses the **JWT auth flow**.
- The JWT is allowed for this app's Client ID.

**The test message fails with a 403 error or MSG-242.** The From number has one of these problems:

- It is missing the **SmsSender** feature.
- It is not on an approved 10DLC campaign.
- It does not belong to the user who created the JWT.

To check a number's features, call `GET /restapi/v1.0/account/~/extension/~/phone-number` with the RingCentral API (this needs the **Read Accounts** permission).

## Step 6: Get alerted when a passcode cannot be delivered

Delivery-failure alerts email an admin when a one-time passcode cannot be delivered to a signer, so someone can step in for the blocked signer. These failures are rare.

**Alerts are on by default.** Turn off **Alert an admin when a passcode fails to send** if you do not want them.

To choose who is notified, use **Send alerts to**:

- **All organization admins:** every admin receives the alert.
- **Specific addresses:** enter the exact addresses that should be alerted (for example `ops@example.com`), one chip per address.

![The Delivery failure alerts section with the Send alerts to selector highlighted](/img/how-to-configure-otp/otp-05-delivery-failure-alerts.png)

## Step 7: Know what happens when a signer keeps entering the wrong code

Each passcode expires after 10 minutes and allows five wrong entries before the signer must request a new one. Wrong entries also add up across new codes:

| Wrong codes in total | What happens |
|---|---|
| **5** | The document's sender gets a "having trouble verifying" email, so they can check the signer's email address or phone number early. |
| **20** | The signer is locked out and the sender gets a "locked out" email. The signer cannot request or enter a code until the sender resends the signing request. |

To clear a lockout, the sender uses **Resend Email** in the document's menu (see [Managing Your Signatures](../Managing%20Your%20Signatures.md)). Resending emails the signer a fresh link and clears the lock.

:::note
These alerts go to the sender of the document, not to the admins on the delivery-failure list.
:::

## Request a passcode from your code

Admins turn passcodes on; your integration asks for them on each embedded signer. The [build guides](../embedded-signing/build/own-iframe.md) all use an email passcode. This section shows SMS.

### Request an SMS passcode from your code

Before you start, check these:

1. Your plan includes SMS passcodes (**Pro** or **Enterprise**).
2. An admin turned on **Allow SMS as an alternative to email** ([Step 4](#step-4-allow-sms-as-an-alternative-to-email)).
3. An admin connected an SMS provider, and its status reads **Connected** ([Step 5](#step-5-connect-your-sms-provider)). Your request does not choose a provider; TurboSign uses the one your organization connected.
4. You have the signer's mobile number in international format, for example `+15551234567`.

Then give the recipient an SMS `auth` block instead of `emailOtp`. `createEmbeddedSignature` sets the recipient's phone from it.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
// Continues the setup from "Your own iframe": imports and TurboSign.configure(...).
const { documentId, recipients } = await TurboSign.createEmbeddedSignature({
  file: await readFile("contract.pdf"),
  fileName: "contract.pdf",
  documentName: "Service Agreement",
  recipients: [
    {
      name: "Jane Doe",
      email: "jane@example.com",
      auth: { sms: { phoneNumber: "+15551234567" } }, // text the passcode
      fields: { signature: "{signature1}", date: "{date1}" },
    },
  ],
});
const embedUrl = recipients[0].embedUrl;
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
# Inside an async function, after TurboSign.configure(...) as in "Your own iframe". pdf holds the PDF bytes.
result = await TurboSign.create_embedded_signature(
    file=pdf,
    file_name="contract.pdf",
    document_name="Service Agreement",
    recipients=[
        {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "auth": {"sms": {"phone_number": "+15551234567"}},  # text the passcode
            "fields": {"signature": "{signature1}", "date": "{date1}"},
        }
    ],
)
embed_url = result["recipients"][0]["embedUrl"]
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
// Continues the setup from "Your own iframe": TurboSign::configure(...) and the use lines.
$result = TurboSign::createEmbeddedSignature(new CreateEmbeddedSignatureRequest(
    recipients: [
        new EmbeddedSignatureRecipient(
            name: 'Jane Doe',
            email: 'jane@example.com',
            auth: new EmbeddedRecipientAuth(smsPhoneNumber: '+15551234567'), // text the passcode
            fields: new EmbeddedRecipientFields(signature: '{signature1}', date: '{date1}'),
        ),
    ],
    file: file_get_contents(__DIR__ . '/contract.pdf'),
    fileName: 'contract.pdf',
    documentName: 'Service Agreement',
));
$embedUrl = $result->recipients[0]->embedUrl;
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
// Inside a function that returns error, with client and ctx as in "Your own iframe". pdf holds the PDF bytes.
result, err := client.TurboSign.CreateEmbeddedSignature(ctx, &turbodocx.CreateEmbeddedSignatureRequest{
	File:         pdf,
	FileName:     "contract.pdf",
	DocumentName: "Service Agreement",
	Recipients: []turbodocx.EmbeddedSignatureRecipient{
		{
			Name:  "Jane Doe",
			Email: "jane@example.com",
			Auth: &turbodocx.EmbeddedRecipientAuth{ // text the passcode
				SMS: &turbodocx.EmbeddedRecipientSMS{PhoneNumber: "+15551234567"},
			},
			Fields: &turbodocx.EmbeddedRecipientFields{Signature: "{signature1}", Date: "{date1}"},
		},
	},
})
if err != nil {
	return err
}
fmt.Println(result.Recipients[0].EmbedURL) // frame this URL
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
// Inside a method that throws IOException, with client as in "Your own iframe".
CreateEmbeddedSignatureResponse result = client.turboSign().createEmbeddedSignature(
    new CreateEmbeddedSignatureRequest.Builder()
        .file(Files.readAllBytes(Paths.get("contract.pdf")))
        .fileName("contract.pdf")
        .documentName("Service Agreement")
        .recipients(List.of(
            new EmbeddedSignatureRecipient.Builder()
                .name("Jane Doe")
                .email("jane@example.com")
                .auth(EmbeddedRecipientAuth.sms("+15551234567")) // text the passcode
                .fields(new EmbeddedRecipientFields.Builder()
                    .signature("{signature1}")
                    .date("{date1}")
                    .build())
                .build()))
        .build());
String embedUrl = result.getRecipients().get(0).getEmbedUrl();
```

</TabItem>
<TabItem value="ruby" label="Ruby" attributes={{className: 'tab-lang tab-lang--ruby'}}>

```ruby
# Continues the setup from "Your own iframe": require "turbodocx_sdk" and configure.
result = TurboDocxSdk::TurboSign.create_embedded_signature(
  file:         StringIO.new(File.binread("contract.pdf")),
  fileName:     "contract.pdf",
  documentName: "Service Agreement",
  recipients:   [
    {
      name:   "Jane Doe",
      email:  "jane@example.com",
      auth:   { sms: { phoneNumber: "+15551234567" } }, # text the passcode
      fields: { signature: "{signature1}", date: "{date1}" }
    }
  ]
)
embed_url = result["recipients"].first["embedUrl"]
```

</TabItem>
</Tabs>

Frame `embedUrl` exactly as in the [build guides](../embedded-signing/build/own-iframe.md). The signer sees the same gate as for email, and the code arrives by text message.

If you send with `sendSignature` instead, set `phone` on the recipient and `identityVerification: { "mode": "otp", "channel": "sms" }`.

| Error | Cause |
|---|---|
| `OtpPhoneRequired` (400), or `PhoneRequiredForSmsOtp` from the JS, Python, Go, Java or Ruby SDK before the request is sent | The recipient asks for SMS but has no phone number. The PHP SDK doesn't check first, so PHP callers get `OtpPhoneRequired` from the API. With the `createEmbeddedSignature` SMS shorthand, the phone comes from `phoneNumber`, so this only happens when that is empty. |
| `OtpPhoneInvalid` (400) | The number is well-formed but cannot exist. |
| `OtpNotEntitled`, `SmsOtpLimitExceeded` (402) | The plan does not include SMS passcodes, or the SMS allowance is used up. |
| `SmsOtpNotEnabled` (403) | **Allow SMS as an alternative to email** is off. |
| `OtpOverrideNotAllowed` (403) | The organization verifies every request and locked the method to a different channel. Ask an admin to turn on **Let senders change the method per recipient**. |
| `SmsProviderNotConfigured` (409) | No SMS provider is saved for the organization. |

### Verify only your embedded signers by SMS

A common setup: your team keeps sending ordinary signature requests (from the TurboDocx app and from Pipelines) with no passcode, while signers in your own app verify by text message. You do not need an SMS default for the whole organization to do this.

1. On the **One-time passcode** tab, turn on **Enable identity verification**.
2. Under **When to verify signers**, keep **Only when requested** (the default). Signature requests sent from the app and from Pipelines keep signing with no passcode; in the app, each signer's **Identity verification** stays on **No verification** unless a sender changes it.
3. Under **Text message (SMS)**, turn on **Allow SMS as an alternative to email**, then connect your SMS provider and check the status reads **Connected to Twilio** (or RingCentral).
4. In your integration, ask for SMS on each recipient you embed, as in the code above. With `sendSignature`, the recipient looks like this:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+15551234567",
  "identityVerification": { "mode": "otp", "channel": "sms" }
}
```

:::tip Pick the channel in your app, not from defaultChannel
Choose SMS in your own app's configuration. Do not copy it from `defaultChannel`: with **Only when requested** that value is `none`, which tells you nothing about the channel you want.
:::

## What the signer sees

When a recipient requires a passcode, the signer meets the passcode gate on the signing page before the document loads.

1. The signer clicks **Send Code**.
2. They receive the one-time code by email (or SMS).
3. They enter it and continue to the document.

![The signer's Verify your identity gate with the Send Code button highlighted](/img/how-to-configure-otp/signer-otp-gate.png)

## What's next

- **Next:** [External identity verification](./external-identity-verification.md), if your app already verifies users with an identity verification vendor.
- [Set up your organization](../embedded-signing/set-up-your-organization.md): turn on embedded signing, allow the origins that may embed the signing page, and understand the clickjacking and localhost rules.
- [Build guides](../embedded-signing/build/own-iframe.md): frame the signing page in your app.
- [API reference](../embedded-signing/reference.md): the recipient block, the organization default, and every error.
