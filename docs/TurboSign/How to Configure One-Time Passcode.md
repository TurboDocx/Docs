---
title: How to Configure One-Time Passcode (OTP)
sidebar_position: 6.5
description: Configure one-time passcode identity verification for TurboSign. Require passcode, choose email or SMS delivery, and connect SMS providers.
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

OTP is configured on the **One-time passcode** tab of the **Identity Verification** section in your E-Signature settings. To reach that tab, first open **E-Signature Settings**, click **Identity Verification**, and stay on the **One-time passcode** tab (see [How to Enable Embedded Signing](./How%20to%20Enable%20Embedded%20Signing.md), Steps 1-2, for how to open these settings).

You need an **admin** account for your organization.

:::note What this controls
These settings set the **default** and the **available** verification channels for your organization. Identity verification is still optional per recipient: a recipient sent without verification signs with no extra step. When you send through the SDK or API, you set verification on each recipient yourself.
:::

## Step 1: Turn on Require identity verification

On the **One-time passcode** tab, turn on **Require identity verification**. The rest of the passcode settings stay hidden until this is on, so turn it on first.

![The One-time passcode tab with the Require identity verification toggle highlighted](/img/how-to-enable-embedded-signing/03-identity-verification-settings.png)

Once it is on, signers enter a one-time passcode before they can sign.

## Step 2: Choose the default method

Under **Default method**, choose how the passcode reaches signers by default:

- **None** - no passcode is required by default.
- **Email** - the passcode is sent to the signer's email address. Email is available on every plan.
- **SMS** - the passcode is texted to the signer's mobile number. SMS requires a connected provider and is available on Pro and Enterprise plans (see Steps 4-5). **SMS cannot be selected until you have connected and saved a working provider.**

The default method is used for every recipient unless you allow senders to change it.

<!-- RECAPTURE: screenshot of the Default method dropdown (open, showing None / Email / SMS) with the field highlighted. Shoot at 948 CSS px viewport width, DPR 1.5 (output 1422x676) to match the other screenshots. -->
![The Default method dropdown with None, Email, and SMS options](/img/how-to-configure-otp/otp-01-default-method.png)

To let senders pick a different channel per recipient, turn on **Let senders choose per recipient**. When it is off, every request uses the default method above; when it is on, senders can change the method for each recipient. This applies to the email channel too, so it is not tied to your SMS plan.

## Step 3: Use email (the simplest path)

Email passcodes work on every plan and need no setup. If **Email** is your default method, you are done - signers receive their passcode by email. Continue to [Step 6](#step-6-get-alerted-when-a-passcode-cannot-be-delivered) to set up delivery-failure alerts, or skip to [What the signer sees](#what-the-signer-sees).

## Step 4: Allow SMS as an alternative to email

To let signers verify by text message, turn on **Allow SMS as an alternative to email** under **Text message (SMS)**. Senders can then choose SMS instead of email for a recipient. Each signer verifies by one method, not both, and SMS may incur usage charges.

<!-- RECAPTURE: screenshot of the Text message (SMS) section with the "Allow SMS as an alternative to email" toggle highlighted. Shoot at 948 CSS px viewport width, DPR 1.5 (output 1422x676). -->
![The Text message SMS section with the Allow SMS as an alternative to email toggle highlighted](/img/how-to-configure-otp/otp-02-allow-sms.png)

:::note SMS is plan-gated
SMS verification is available on **Pro and Enterprise plans**. If your plan does not include it, this section shows an **Upgrade to unlock SMS verification** card instead of the toggle.
:::

SMS verification also needs a mobile number for each signer you verify this way. You enter it when you add the recipient to a signature request.

## Step 5: Connect your SMS provider

TurboSign sends SMS passcodes through **your own** SMS account, so passcodes are billed by your provider at your rates. Connect the provider under **Text message (SMS)** once the toggle from Step 4 is on:

1. Choose your **Provider** - **Twilio** or **RingCentral**.
2. Enter the **From number** in international format with the country code, for example `+13055551234`.
3. Enter your provider credentials:
   - **Twilio:** Account SID and Auth Token.
   - **RingCentral:** Server URL, Client ID, Client Secret, and JWT.
4. Click **Save SMS provider**.

<!-- RECAPTURE: screenshot of the SMS provider credential form (Provider = Twilio) with the Save SMS provider button highlighted. Shoot at 948 CSS px viewport width, DPR 1.5 (output 1422x676). -->
![The SMS provider form with the provider, from number, credential fields, and Save SMS provider button](/img/how-to-configure-otp/otp-03-sms-provider-form.png)

After you save credentials, click **Verify connection** to confirm your account can send messages (this is a free check and sends no text), then use **Send a test message** to send a real passcode-style text to a number you control and confirm end-to-end delivery.

<!-- RECAPTURE: screenshot of the "Send a test message" area with the Test number field and Send test message button highlighted. Shoot at 948 CSS px viewport width, DPR 1.5 (output 1422x676). -->
![The Send a test message field with the Send test message button highlighted](/img/how-to-configure-otp/otp-04-sms-test-message.png)

:::caution Use a production provider account
SMS passcodes use a custom message body, which **trial accounts** (for example a Twilio trial) block. Use a paid, production provider account. Sending to US numbers also requires **A2P 10DLC registration** on your provider account - TurboSign links to your provider's registration flow next to the credential fields.
:::

:::note SMS becomes selectable only once it works
The **SMS** default method (Step 2) stays disabled until SMS is turned on, your plan includes it, **and** you have saved working provider credentials. If you turn SMS off later, any `SMS` default automatically reverts to **None** so a passcode is never sent through a channel that cannot deliver it.
:::

## Step 6: Get alerted when a passcode cannot be delivered

Delivery-failure alerts email an admin when a one-time passcode cannot be delivered to a signer, so someone can step in for the blocked signer. These failures are rare.

**Alerts are on by default.** Turn off **Alert an admin when a passcode fails to send** if you do not want them. To choose who is notified, use **Send alerts to**:

- **All organization admins** - every admin receives the alert.
- **Specific addresses** - enter the exact addresses that should be alerted (for example `ops@example.com`), one chip per address.

<!-- RECAPTURE: screenshot of the Delivery failure alerts section with the "Send alerts to" selector highlighted. Shoot at 948 CSS px viewport width, DPR 1.5 (output 1422x676). -->
![The Delivery failure alerts section with the Send alerts to selector highlighted](/img/how-to-configure-otp/otp-05-delivery-failure-alerts.png)

## What the signer sees

When identity verification is on, the signer opens the signing page and is met by the passcode gate before the document loads. They click **Send Code**, receive the one-time code by email (or SMS), enter it, and then continue to the document.

<!-- RECAPTURE: this screenshot was shot in a wider browser window than the other step screenshots (2133x987 vs 1422x676). Reshoot at 948 CSS px viewport width, DPR 1.5 (output 1422x676) so it matches the rest of the set. -->
![The signer's Verify your identity gate with the Send Code button highlighted](/img/how-to-configure-otp/signer-otp-gate.png)

## What's next

- [How to Enable Embedded Signing](./How%20to%20Enable%20Embedded%20Signing.md) - turn on embedded signing, allow the origins that may embed the signing page, and understand the clickjacking and localhost rules.
- [Embedded Signing and Identity Verification](./Embedded%20Signing.md) - request a signing URL, the three verification modes, and the SDK calls your backend makes.
