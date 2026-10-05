---
title: How to Configure One-Time Passcode (OTP)
sidebar_position: 6.5
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

# How to Configure One-Time Passcode (OTP)

A one-time passcode (OTP) verifies a signer's identity before they can open your document: the signer receives a short code by email or text message and enters it on the signing page. This guide walks through configuring OTP delivery for your organization - requiring a passcode, choosing the default channel, connecting an SMS provider, and setting up delivery-failure alerts.

OTP is configured on the **One-time passcode** tab of the **Identity Verification** section in your E-Signature settings. To reach that tab, first open **E-Signature Settings**, click **Identity Verification**, and stay on the **One-time passcode** tab (in short: **Settings** > **Features and integrations** > **Signatures** card > **Configure E-Signature**; see [How to Enable Embedded Signing](./How%20to%20Enable%20Embedded%20Signing.md), Steps 1-2). Changes on this tab save as you make them, except the SMS provider form, which needs **Save SMS provider**.

You need an **admin** account for your organization.

:::note What this controls
These settings decide **when** signers are verified by default and **which** channels are available. The default applies to signatures created in the app and to documents sent through the API or SDK. Automated sends (Pipelines, bulk signature sending, TurboQuote, and the Wrike integration) are exempt and verify a recipient only when the request asks for it.
:::

## Step 1: Turn on Enable identity verification

On the **One-time passcode** tab, turn on **Enable identity verification**. The rest of the passcode settings stay hidden until this is on, so turn it on first.

![The One-time passcode tab with the Enable identity verification toggle and the selected Only when requested option highlighted](/img/how-to-enable-embedded-signing/03-identity-verification-settings.png)

Turning it on makes passcode verification available. Whether every signer gets a passcode depends on the choice in Step 2.

## Step 2: Choose when to verify signers

Under **When to verify signers**, choose one:

- **Only when requested** (the default) - no passcode by default. A sender can turn it on for a recipient, and a request made through the API or SDK (for example, embedded signing) can ask for it. This option is never locked, so a request can always turn verification on.
- **On every signature request** - every signer enters a passcode before signing, including on documents sent through the API or SDK.

When you choose **On every signature request**, two more settings appear:

- **Method** - how the passcode reaches signers:
  - **Email** - the passcode is sent to the signer's email address. Email is available on every plan.
  - **SMS** - the passcode is texted to the signer's mobile number. SMS requires a connected provider and is available on Pro and Enterprise plans (see Steps 4-5). **SMS cannot be selected until SMS is turned on and provider credentials are saved (Steps 4-5).** Check that the provider status reads **Connected to Twilio** (or RingCentral) before you rely on it.
- **Let senders change the method per recipient** - off by default, which locks the method: every request uses the method above, and an API or SDK request that sets a different channel for a recipient is rejected with `OtpOverrideNotAllowed`. When it is on, a sender can pick another method, or no verification, for a recipient. This applies to the email channel too, so it is not tied to your SMS plan.

:::tip Passcodes only for signers in your own app
If only the signers in your own app should verify, keep **Only when requested**. Turn on SMS and connect a provider (Steps 4-5), then have your integration request SMS on each recipient it embeds. Other signature requests, including Pipelines, stay passcode-free. See [Verify only your embedded signers by SMS](./Embedded%20Signing.md#verify-only-your-embedded-signers-by-sms).
:::

Your integration can check the result with `GET /turbosign/embedded-signing-settings`: `defaultChannel` is `none`, `email`, or `sms`, and `allowChannelOverride` tells it whether a different channel is accepted (see [Embedded Signing and Identity Verification](./Embedded%20Signing.md#the-organization-default)).

![The When to verify signers options with Only when requested selected and highlighted](/img/how-to-configure-otp/otp-01-when-to-verify.png)

## Step 3: Use email (the simplest path)

Email passcodes work on every plan and need no setup. If **Email** is your method, you are done - signers receive their passcode by email. Continue to [Step 6](#step-6-get-alerted-when-a-passcode-cannot-be-delivered) to set up delivery-failure alerts, or skip to [What the signer sees](#what-the-signer-sees).

## Step 4: Allow SMS as an alternative to email

To let signers verify by text message, turn on **Allow SMS as an alternative to email** under **Text message (SMS)**. Senders can then choose SMS instead of email for a recipient. Each signer verifies by one method, not both, and SMS may incur usage charges.

![The Text message (SMS) section with the Allow SMS as an alternative to email toggle highlighted](/img/how-to-configure-otp/otp-02-allow-sms.png)

:::note SMS is plan-gated
SMS verification is available on **Pro and Enterprise plans**. If your plan does not include it, the toggle is disabled and an **Upgrade to unlock SMS verification** card appears.
:::

SMS verification also needs a mobile number for each signer you verify this way. You enter it when you add the recipient to a signature request. The number must include the country code and be one that can exist: a well-formed number that cannot exist is rejected when the request is created (`OtpPhoneInvalid`), not later when the signer asks for a code.

## Step 5: Connect your SMS provider

TurboSign sends SMS passcodes through **your own** SMS account, so passcodes are billed by your provider at your rates. Connect the provider under **Text message (SMS)** once the toggle from Step 4 is on:

1. Choose your **Provider** - **Twilio** or **RingCentral**.
2. Enter the **From number** in international format with the country code, for example `+13055551234`.
3. Enter your provider credentials:
   - **Twilio:** Account SID and Auth Token.
   - **RingCentral:** Server URL, Client ID, Client Secret, and JWT. RingCentral needs some setup on its side first, so follow [Set up RingCentral](#set-up-ringcentral) below.
4. Click **Save SMS provider**.

![The SMS provider form with the provider, from number, credential fields, and Save SMS provider button highlighted](/img/how-to-configure-otp/otp-03-sms-provider-form.png)

When you click **Save SMS provider**, TurboSign checks the account straight away (free, no text is sent). The status at the top of the box should read **Connected to Twilio**. If it reads **Twilio rejected these credentials**, the alert below the fields gives the provider's reason. Then use **Send a test message** to text a number you control and confirm delivery end to end. **Verify connection** re-runs the check at any time.

The status at the top of the box is one of:

- **SMS provider not connected** - no credentials are saved yet.
- **Twilio credentials saved** - credentials are saved but have not been checked in this session.
- **Connected to Twilio** - the provider accepted the credentials. This is the state you want.
- **Twilio rejected these credentials** - fix the credentials and save again.

With RingCentral, the status names RingCentral instead.

![The Send a test message area with the Test number field and Send test message button highlighted](/img/how-to-configure-otp/otp-04-sms-test-message.png)

:::caution Use a production provider account
SMS passcodes use a custom message body, which **trial accounts** (for example a Twilio trial) block. Use a paid, production provider account. Sending to US numbers also requires **A2P 10DLC registration** on your provider account - TurboSign links to your provider's registration flow next to the credential fields.
:::

:::note When SMS becomes selectable
The **SMS** method (Step 2) stays disabled until SMS is turned on, your plan includes it, **and** provider credentials are saved. Saving does not prove the credentials work, so check that the status reads **Connected to Twilio** (or RingCentral). If you later remove the provider credentials while **SMS** is the method, the method switches to **Email**, so signers are still verified on every request through a channel that can deliver.
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

A number that only has the **A2PSmsSender** feature (RingCentral's high-volume SMS API) cannot send through TurboSign.

#### 4. Enter the details in TurboSign

1. In the SMS provider form, choose **RingCentral** as the **Provider**.
2. Enter the **From number** from the previous step.
3. Enter the **Server URL** for the environment where you created the app and the JWT:
   - Production: `https://platform.ringcentral.com`
   - Sandbox: `https://platform.devtest.ringcentral.com`

   Any other address is rejected when you save.
4. Enter the **Client ID**, **Client Secret**, and **JWT**.
5. Click **Save SMS provider**. TurboSign checks the account straight away, without sending a text. The status at the top of the box should read **Connected to RingCentral**.
6. Use **Send a test message** to text a number you control and confirm delivery.

#### Check when your JWT expires

Each time you open the form, TurboSign shows when the saved JWT expires, under the **JWT** field. The JWT itself is never shown. You see one of these:

- **JWT expires on** *date*, with a small calendar tile showing the date. Texts stop on that date until you save a new JWT.
- An orange warning, **JWT expires on** *date* **(in** *N* **days)**, when the date is 30 days away or less. Create a new JWT in RingCentral and save it in TurboSign before then.
- A red **This JWT expired on** *date*. Text messages cannot be sent until you create a new JWT in RingCentral and save it in TurboSign.
- **No expiration set on this JWT.** It keeps working until it is revoked in RingCentral.
- **Couldn't read an expiration date from this JWT.** Check it in the RingCentral Developer Console.

When you save a JWT that has an expiration date, the confirmation also tells you, for example **SMS provider saved. Expiration detected on this JWT: JWT expires on** *date*.

![The RingCentral SMS provider form with the JWT expiration date and calendar tile under the JWT field highlighted](/img/how-to-configure-otp/otp-06-ringcentral-jwt-expiry.png)

To replace a JWT, create a new one in the Developer Console, paste it into the **JWT** field, and click **Save SMS provider**. Leave the other secret fields blank to keep their saved values.

#### Troubleshooting RingCentral

- **RingCentral rejects the credentials or reports "RingCentral auth failed".** Check that the **Server URL** matches where the app and JWT were created (sandbox or production), that the app uses the **JWT auth flow**, and that the JWT is allowed for this app's Client ID.
- **The test message fails with a 403 error or MSG-242.** The From number is missing the **SmsSender** feature, is not on an approved 10DLC campaign, or does not belong to the user who created the JWT. To check a number's features, call `GET /restapi/v1.0/account/~/extension/~/phone-number` with the RingCentral API (this needs the **Read Accounts** permission).

## Step 6: Get alerted when a passcode cannot be delivered

Delivery-failure alerts email an admin when a one-time passcode cannot be delivered to a signer, so someone can step in for the blocked signer. These failures are rare.

**Alerts are on by default.** Turn off **Alert an admin when a passcode fails to send** if you do not want them. To choose who is notified, use **Send alerts to**:

- **All organization admins** - every admin receives the alert.
- **Specific addresses** - enter the exact addresses that should be alerted (for example `ops@example.com`), one chip per address.

![The Delivery failure alerts section with the Send alerts to selector highlighted](/img/how-to-configure-otp/otp-05-delivery-failure-alerts.png)

## Step 7: Know what happens when a signer keeps entering the wrong code

Each passcode expires after 10 minutes and allows five wrong entries before the signer must request a new one. Wrong entries also add up across new codes:

- At **5 wrong codes**, the document's sender gets a "having trouble verifying" email, so they can check the signer's email address or phone number early.
- At **20 wrong codes**, the signer is locked out and the sender gets a "locked out" email. The signer cannot request or enter a code until the sender resends the signing request (**Resend Email** in the document's menu, see [Managing Your Signatures](./Managing%20Your%20Signatures.md)). Resending emails the signer a fresh link and clears the lock.

These alerts go to the sender of the document, not to the admins on the delivery-failure list.

## What the signer sees

When a recipient requires a passcode, the signer opens the signing page and is met by the passcode gate before the document loads. They click **Send Code**, receive the one-time code by email (or SMS), enter it, and then continue to the document.

![The signer's Verify your identity gate with the Send Code button highlighted](/img/how-to-configure-otp/signer-otp-gate.png)

## What's next

- [How to Enable Embedded Signing](./How%20to%20Enable%20Embedded%20Signing.md) - turn on embedded signing, allow the origins that may embed the signing page, and understand the clickjacking and localhost rules.
- [Embedded Signing and Identity Verification](./Embedded%20Signing.md) - request a signing URL, the three verification modes, and the SDK calls your backend makes.
