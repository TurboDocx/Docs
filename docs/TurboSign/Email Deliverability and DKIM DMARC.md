---
title: Email Deliverability (DKIM / DMARC / SPF)
sidebar_position: 7
description: Why TurboSign and TurboDocx emails can show DKIM, DMARC, or SPF failures when a recipient's security gateway (Avanan, Microsoft Safe Links, or similar) rewrites the message, and how to confirm and resolve it.
keywords:
  - turbosign email deliverability
  - dkim failure
  - dmarc failure
  - spf softfail
  - body hash did not verify
  - avanan
  - email security gateway
  - amazon ses dkim
  - arc seal
  - safe links
---

# Email Deliverability (DKIM / DMARC / SPF)

TurboDocx sends email (including TurboSign signature requests and reminders) through Amazon SES. Occasionally a recipient reports that our messages fail DKIM or DMARC. In nearly every case the cause is a **recipient-side email security gateway that modifies the message after SES has signed it** — not a problem with TurboDocx, SES, or DNS.

This page explains how to recognize, confirm, and resolve that situation.

## Why does a TurboDocx email fail DKIM or DMARC?

A DKIM signature includes a cryptographic hash of the message body. Amazon SES signs the email *before* it leaves our infrastructure. If anything downstream changes the signed body, the hash no longer matches and DKIM fails. Because DMARC relies on an aligned SPF **or** DKIM pass, DMARC can fail too.

Security platforms commonly modify messages in transit by:

- Rewriting URLs for click-time protection (the most common cause)
- Inserting external-sender banners, warnings, or disclaimers
- Sanitizing or re-encoding HTML / MIME
- Inspecting or altering attachments
- Normalizing whitespace or line endings

[Avanan](https://www.avanan.com/) (Check Point) routes mail through its own infrastructure and rewrites links depending on the recipient organization's policy. The same behavior occurs with other secure email gateways, anti-phishing products, and Microsoft Safe Links configurations.

## What do the failures look like?

A recipient may report any of these:

- Message marked as failing DKIM or DMARC
- Message quarantined, delayed, or flagged suspicious
- Headers showing `body hash did not verify`
- SPF passing on first arrival at Microsoft 365 but failing after a relay
- Message delivers fine to Gmail but fails through Avanan
- Both the TurboDocx and the Amazon SES DKIM signatures failing at once

Typical headers:

```
dkim=fail (body hash did not verify) header.d=sign.turbodocx.com
dkim=fail (body hash did not verify) header.d=amazonses.com
```

## Why does SPF also "softfail" sometimes?

When the gateway relays the message back to Microsoft 365, Microsoft runs SPF again. At that point the source IP belongs to the **security gateway**, not Amazon SES. Since the gateway is not an authorized TurboDocx sender, SPF can show a soft failure:

```
spf=softfail smtp.mailfrom=e.sign.turbodocx.com sender IP=<security gateway IP>
```

This does not mean the recipient's domain caused the failure, and **the gateway IP should not be added to TurboDocx's SPF record.**

## How do I confirm it's the recipient's gateway?

1. **Compare against a direct mailbox.** Send the same type of message to Gmail or another mailbox that receives mail directly. A healthy result looks like:

   ```
   dkim=pass header.d=sign.turbodocx.com
   dkim=pass header.d=amazonses.com
   spf=pass
   dmarc=pass
   ```

   If it passes when delivered directly but fails only after the recipient's security platform processes it, the downstream platform is the cause.

2. **Read the pre-gateway result.** Look for an `Authentication-Results-Original` header (or similar). If SPF, DKIM, and DMARC passed *before* the gateway processed the message, TurboDocx and SES authenticated correctly.

3. **Temporarily bypass the policy.** Have the recipient's email admin exclude a test mailbox (or the TurboDocx app URL) from URL-rewriting / content-modification, then send a new message with a unique subject. If DKIM and DMARC pass, the policy modification is confirmed as the cause.

## How is it resolved?

**No TurboDocx or Amazon SES change is normally required.** The fix is on the recipient side. Their email administrator can choose to:

- Leave the policy as-is and rely on **ARC** or the platform's trusted-authentication handling. (ARC is designed to preserve original authentication results across an intermediary that modifies the message, though interoperability between platforms can be finicky.)
- Exclude the TurboDocx application URL from click-time URL rewriting — for Avanan, this typically means excluding `app.turbodocx.com` from link rewriting.
- Create a narrowly scoped exception for TurboDocx messages.
- Confirm Microsoft 365 trusts the gateway's ARC seal.
- Contact the security-platform vendor if messages are being incorrectly quarantined.

Any URL-rewriting exclusion reduces click-time inspection for those links, so the recipient's security administrator should evaluate it.

## What should we *not* do?

- ❌ Add the recipient's gateway IP to TurboDocx's SPF record
- ❌ Replace working Amazon SES DKIM records
- ❌ Disable DKIM or DMARC
- ❌ Exclude an entire organization from email protection without a documented reason
- ❌ Assume the domain shown in an SPF result is the domain being authenticated

## What information should I collect for escalation?

If you need to escalate, request from the recipient:

- Complete message headers
- Recipient email platform (e.g. Microsoft 365)
- Email security product in use (e.g. Avanan)
- Whether URL rewriting is enabled
- Whether external banners / disclaimers are inserted
- Final DKIM, SPF, DMARC, ARC, and composite-authentication results
- Results of a comparison message sent to Gmail
- Results of a temporary policy-bypass test

## Bottom line

If TurboDocx messages pass SPF, DKIM, and DMARC when delivered directly but fail after a recipient-side security service modifies the message, the cause is downstream message mutation — not the TurboDocx or Amazon SES configuration. This is especially common in MSP-managed Microsoft 365 environments.
