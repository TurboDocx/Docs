---
title: Custom Email Domain (Bring Your Own Email)
sidebar_position: 9
description: Send TurboSign signature emails from your own domain through your Amazon SES or SendGrid account, with your branding, a custom signing link domain, and a compliance-preserving audit trail.
keywords:
  - custom email domain
  - bring your own email
  - byo email
  - white label signature emails
  - amazon ses
  - sendgrid
  - send from own domain
  - custom sender domain
  - dkim verified domain
  - custom signing domain
  - email branding
  - turbosign email
  - signature request emails
  - esignature white label
  - sender identity
---

# Custom Email Domain (Bring Your Own Email)

By default, TurboSign signature requests are sent from TurboDocx's domain. With **Custom Email Domain**, your organization connects its own email provider (Amazon SES or SendGrid) and signature emails go out from **your** domain instead: your From address, your display name, your branding, and optionally your own domain in the signing links.

This guide walks you through connecting a provider, choosing a sending domain, configuring the sender identity, and verifying everything works.

## What You'll Accomplish

By the end of this guide, you'll have:

- 🔌 **Connected** your Amazon SES or SendGrid account with least-privilege credentials
- 🌐 **Picked a sending domain** that is already DKIM-verified in your provider
- ✉️ **Set the sender identity** your signers see in their inbox
- 🔗 **Optionally pointed a signing domain** (like `sign.yourcompany.com`) at TurboDocx
- 🛡️ **Chosen what happens** if your provider ever fails
- ✅ **Verified delivery** with a test email to your own inbox

:::note Who can do this
Custom Email Domain is configured per organization by an **org admin**, and the card only appears if your license includes the feature. If you don't see it, contact your account manager.
:::

<br/>

## Before You Begin

You'll need:

- **Admin access** to your TurboDocx organization
- **An Amazon SES or SendGrid account** owned by your company
- **A domain already authenticated (DKIM-verified) in that provider.** TurboDocx does not run its own DNS verification. It lists the domains your provider has already verified, so complete domain authentication in SES or SendGrid first.
- For SES: the ability to create an **IAM user and access key**
- For SendGrid: the ability to create an **API key**

:::tip Domain not verified yet?
Set up domain authentication in your provider first. In SES this is "Verified identities" (verify a domain with Easy DKIM). In SendGrid it's Settings → Sender Authentication → Authenticate Your Domain. Once your provider shows the domain as verified, it will appear in TurboDocx's domain picker.
:::

<br/>

## Step 1: Open Custom Email Domain

Go to **Settings → Organization Settings** and find the **Custom Email Domain** card, then open it.

![Custom Email Domain card in Organization Settings](/img/turbosign-custom-email/docs-01-card.png)

<br/>

## Step 2: Connect Your Email Provider

In the **Connection** section, choose your provider and enter its credentials. TurboDocx verifies the credentials live against your provider before anything is saved, so a typo fails immediately instead of surfacing later as a bounced signature request.

:::note How credentials are stored
Credentials are **stored encrypted and never shown again** after connecting. The connected view shows only a masked key. To rotate credentials later, use **Replace credentials**; to stop using your provider entirely, use **Disconnect**, which reverts to TurboDocx sending instantly.
:::

### Option A: Amazon SES

Select **Amazon SES** and fill in:

- **Access Key ID** - an IAM access key limited to SES sending
- **Secret Access Key**
- **Region** - the AWS region where your SES identities live (for example `us-east-1`)

![Amazon SES connection form](/img/turbosign-custom-email/docs-05-connect-form.png)

#### Create a least-privilege IAM user

Don't reuse a broad admin key. Create a dedicated IAM user for TurboDocx with only the permissions it needs: sending, plus read-only access to list your verified domains and check DKIM status.

Attach this policy to the IAM user, then create an access key for it:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TurboDocxSesSend",
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Sid": "TurboDocxSesVerifyAndListDomains",
      "Effect": "Allow",
      "Action": [
        "ses:ListIdentities",
        "ses:GetIdentityVerificationAttributes",
        "ses:GetIdentityDkimAttributes",
        "ses:GetSendQuota"
      ],
      "Resource": "*"
    }
  ]
}
```

What each part is for:

- `ses:SendEmail` and `ses:SendRawEmail` send the actual signature emails
- `ses:ListIdentities`, `ses:GetIdentityVerificationAttributes`, and `ses:GetIdentityDkimAttributes` let TurboDocx list your verified domains and their DKIM status for the domain picker
- `ses:GetSendQuota` is used during connection verification

:::tip SES sandbox
If your SES account is still in the sandbox, it can only send to verified addresses. Request production access in SES before relying on it for real signature requests.
:::

### Option B: SendGrid

Select **SendGrid** and paste an **API key with the `mail.send` scope**.

Create it in SendGrid under Settings → API Keys → Create API Key. Choose **Restricted Access** and enable only **Mail Send**. TurboDocx reads your authenticated domains through the same key, so no additional scopes are required beyond what a restricted Mail Send key provides.

![SendGrid connection form](/img/turbosign-custom-email/docs-06-sendgrid.png)

### After connecting

Click **Connect**. Once the credentials verify, you'll see the connected view: the provider name, a masked key, and a health line that reads **Connection healthy** (or shows the last error if something is wrong).

![Connected view showing provider, masked key, and health status](/img/turbosign-custom-email/docs-02-connected.png)

<br/>

## Step 3: Choose Your Sending Domain

The **Sending domain** picker lists the domains that are **already authenticated (DKIM-verified) in your provider account**. Pick the one signature emails should send from.

![Sending domain picker listing verified domains](/img/turbosign-custom-email/docs-04-picker.png)

A few things you may see here:

- **Pending verification in your provider** - the domain exists in your SES or SendGrid account but isn't DKIM-verified yet, so it can't be selected. Finish verification in your provider and it becomes selectable.
- **A DMARC advisory chip** (for example `DMARC p=reject`) - shown when the domain enforces a strict DMARC policy. This is informational, not a blocker: mail authenticated through your provider's DKIM will pass DMARC. It's simply a reminder not to send from this domain outside your provider.

:::note TurboDocx never touches your DNS
Domain verification happens entirely in your provider. TurboDocx runs no DNS challenge of its own and never asks you to add TXT records for sending. (The optional signing domain in Step 5 uses a single CNAME, which is separate from email authentication.)
:::

<br/>

## Step 4: Set the Sender Identity

Under **Sender identity**, configure what signers see in their inbox:

- **Sender address** - the part before the `@`. Defaults to `sign`, so emails come from `sign@yourdomain.com`.
- **Sender name** - the display name. **Leave it blank to use each requester's name**, so a request sent by Jane shows "Jane Smith" as the sender. Set a fixed name (like your company name) if you prefer consistency over personalization.

A live preview below the fields shows the exact **From** line and, if you've set a signing domain, the link host your signers will see. What you see in the preview is what lands in the inbox.

<br/>

## Step 5: Add a Signing Domain (Optional)

By default, the links inside signature emails point at TurboDocx's signing domain. If you also want the **links** to live on your domain, set a **Signing domain** such as `sign.yourcompany.com`.

1. Enter the hostname in the **Signing domain** field (lowercase, no `https://` or paths).
2. In your DNS provider, create a **CNAME** record pointing that hostname at the target shown in the field's helper text.
3. Watch the status chip under the field. It's advisory and shows one of:
   - **CNAME verified** - the record resolves correctly
   - **CNAME misconfigured** - the record exists but points to the wrong place; update it with your DNS provider
   - **CNAME not checked** - the record hasn't been checked yet

Once the CNAME verifies, contact TurboDocx support to coordinate activating TLS on the hostname. After activation, links in signature emails use your domain.

:::tip Do I need this?
No. The custom sending domain (Steps 2 to 4) works on its own. The signing domain is an extra step for organizations that want the full white-label experience, where both the email sender and the links are on their domain.
:::

<br/>

## Step 6: Choose What Happens If Your Provider Fails

Signature requests are legal notices, so you decide up front what happens when your provider can't send. Under **If your provider fails**, pick one:

- **Fall back to TurboDocx sending (recommended)** - if your provider is unavailable, signers are still notified, from TurboDocx's domain. The audit trail records the actual sender, so it's always clear which path a notification took.
- **Pause sending (hard fail)** - nothing ever sends from another domain. Signature requests fail until your provider recovers, and each failure is recorded in the audit trail.

![Failure behavior and branding options](/img/turbosign-custom-email/docs-03-behavior.png)

Choose **Pause sending** only if your compliance requirements prohibit any email leaving from a domain other than yours. For most organizations, fallback is the right choice: a signer notified from TurboDocx's domain is better than a signer not notified at all.

<br/>

## Step 7: Apply Your Branding

Turn on **Apply my organization branding to signature emails and the signing page** to use your organization's logo and colors on both the emails and the public signing page. The logo and colors come from your **Brand Identity settings** in Organization Settings.

:::note Legal text is never altered
Branding changes the look only. Consent and legal text in signature emails and on the signing page is never modified, regardless of branding settings.
:::

<br/>

## Step 8: Send a Test Email

Under **Verify delivery**, click **Send test email**. TurboDocx sends a real email through your provider to your own inbox (the admin performing the setup).

Check that:

- The email arrives (look in spam if it doesn't appear within a minute or two)
- The **From** line matches the preview from Step 4
- If you set a signing domain and it's active, links use your domain

Then click **Save Changes**. From this point on, signature emails for your organization send through your provider.

<br/>

## How Compliance Is Preserved

Sending from your own domain doesn't weaken the evidentiary value of your signature requests:

- The **tamper-evident audit trail records the true sending path** for every notification: which provider sent it, the From address used, and the link host. This holds for normal sends, fallback sends, and failed sends alike.
- **Consent and legal text is never altered** by branding.
- If you chose fallback and your provider was down, the audit trail shows exactly which notifications went out via TurboDocx instead of your provider.

A side benefit of bringing your own provider: **bounce and complaint handling lives in your own SES or SendGrid account**. Your deliverability team can monitor bounces, complaints, and reputation in the dashboards they already use, instead of asking TurboDocx for sending logs.

For general email authentication issues (DKIM, DMARC, SPF, and security gateways that rewrite messages in transit), see [Email Deliverability (DKIM / DMARC / SPF)](./Email%20Deliverability%20and%20DKIM%20DMARC.md).

<br/>

## Troubleshooting

### The connection shows "Issue detected" instead of "Connection healthy"

The health line includes the last error from your provider. Common causes:

- The access key or API key was revoked or deactivated in your provider
- The IAM policy or API key scope was tightened and no longer allows sending
- Your SES account was moved, suspended, or hit a sending limit

Fix the issue in your provider, or click **Replace credentials** to connect a new key.

### My domain disappeared from the picker, or sends started failing

If a domain is removed or falls out of verified status **in your provider**, TurboDocx can no longer send from it. Sends then follow your chosen failure behavior: fallback sends notify signers from TurboDocx's domain, while pause mode fails the requests. Re-verify the domain in your provider's domain settings, then reselect it in the picker.

### I rotated credentials and my sending domain was cleared

When you replace credentials, TurboDocx re-checks the selected domain against the **new** account. If the new key belongs to an account that can't send from that domain (for example, a different SES account or region), the domain selection is cleared and you'll need to pick a domain the new account can actually send from.

### The domain shows "Pending verification in your provider"

TurboDocx sees the domain in your account, but your provider hasn't confirmed DKIM yet. Complete domain authentication in SES or SendGrid; DNS changes can take a while to propagate. The domain becomes selectable as soon as your provider reports it verified.

### The signing domain chip says "CNAME misconfigured"

The hostname doesn't resolve to the expected target. Update the CNAME record with your DNS provider and allow time for DNS propagation. The chip is advisory, so email sending is unaffected while you fix it.

### The test email didn't arrive

- Check spam and quarantine folders
- Check the health line on the Connection section for a provider error
- SES sandbox accounts can only send to verified recipients; request production access
- Confirm the sending domain is still verified in your provider

### Emails land in spam or fail DKIM/DMARC at some recipients

If the domain is verified in your provider and the test send works, per-recipient failures are usually caused by something on the receiving side modifying the message in transit. Work through [Email Deliverability (DKIM / DMARC / SPF)](./Email%20Deliverability%20and%20DKIM%20DMARC.md).

<br/>

## FAQ

**Does TurboDocx see or store my provider credentials in plain text?**
Credentials are verified live at connect time, stored encrypted, and never displayed again. The UI shows only a masked key after connecting.

**Can I switch providers later?**
Yes. Use **Replace credentials** to connect a different key or provider. You may need to reselect your sending domain if the new account differs.

**What happens if I disconnect?**
Disconnecting reverts your organization to TurboDocx sending instantly. Signature emails continue to work; they simply send from TurboDocx's domain again.

**Do my signers need to do anything?**
No. The change is entirely on the sending side. Signers just see emails from your domain instead of TurboDocx's.

**Does this affect documents already out for signature?**
Notifications sent after the change (reminders, completion emails) use the current configuration. The audit trail records the actual sender for each notification, so the record stays accurate across the transition.
