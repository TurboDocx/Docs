---
title: Email Deliverability (DKIM / DMARC / SPF)
sidebar_position: 7
description: How to diagnose and resolve DKIM, DMARC, or SPF failures on TurboDocx and TurboSign emails, including the common case where a security gateway rewrites the message in transit.
keywords:
  - turbosign email deliverability
  - dkim failure
  - dmarc failure
  - spf softfail
  - body hash did not verify
  - email security gateway
  - dkim signature
  - arc seal
  - email troubleshooting
---

# Email Deliverability (DKIM / DMARC / SPF)

TurboDocx emails, including TurboSign signature requests and reminders, are sent from an authenticated domain with DKIM, SPF, and DMARC in place. If a message shows a DKIM, DMARC, or SPF failure, this page walks you through what to check and how to resolve it.

The most common cause is something modifying the email **in transit, after it was signed**, usually a security gateway between the sender and the inbox. The steps below help you confirm where it's happening and what to do about it.

## What's happening

A DKIM signature includes a cryptographic hash of the message body. The email is signed before it leaves our infrastructure. If anything along the delivery path changes the body, even slightly, the hash no longer matches and DKIM fails. Because DMARC passes only when SPF or DKIM is aligned, DMARC can fail as a result.

Email security products often modify messages as they inspect them:

- Rewriting links for click-time protection (the most common trigger)
- Adding external-sender banners, warnings, or disclaimers
- Sanitizing or re-encoding HTML and MIME
- Inspecting or re-packaging attachments
- Normalizing whitespace or line endings

Products that do this include secure email gateways and anti-phishing platforms such as Avanan (Check Point), Mimecast, Proofpoint, and Microsoft Safe Links. The behavior depends on each organization's configured policy, so the same message can pass for one recipient and fail for another.

## Symptoms you might see

- A message marked as failing DKIM or DMARC
- A message quarantined, delayed, or flagged as suspicious
- Headers containing `body hash did not verify`
- SPF passing on first arrival but failing after the message is relayed
- A message that delivers fine to one mailbox (for example Gmail) but fails at another

A failing DKIM result in the headers typically looks like this:

```
dkim=fail (body hash did not verify) header.d=sign.turbodocx.com
```

A message can carry more than one DKIM signature, and when the body is modified in transit they tend to fail together, so seeing two failures at once is expected and points to the same cause.

## Why SPF can also "softfail"

When a gateway inspects a message and then relays it onward, the receiving server runs SPF again. At that point the connecting IP belongs to the **gateway**, not the original sending infrastructure. Since that IP is not in the TurboDocx SPF record, SPF can report a soft failure:

```
spf=softfail smtp.mailfrom=e.sign.turbodocx.com sender IP=<gateway address>
```

This is a side effect of the relay, not a DNS problem on the sending side. Don't add the gateway's IP to the TurboDocx SPF record. It isn't a TurboDocx sender, and adding it won't fix the underlying body-hash mismatch.

## Troubleshooting steps

Work through these in order to pinpoint where the failure is introduced.

1. **Send the same email to a directly delivered mailbox.** Use a mailbox that receives mail without a gateway in front of it (a personal Gmail address works well). A healthy result looks like:

   ```
   dkim=pass header.d=sign.turbodocx.com
   spf=pass
   dmarc=pass
   ```

   If it passes here but fails at the affected mailbox, the difference is something in that mailbox's delivery path, typically a security gateway.

2. **Compare the authentication results before and after the gateway.** Many platforms record the original result in a header such as `Authentication-Results-Original` (or an ARC chain). If SPF, DKIM, and DMARC passed *before* the gateway processed the message, the message was authenticated correctly and was altered afterward.

3. **Test with the modifying policy temporarily off.** Ask the administrator of the affected environment to exclude a test mailbox (or the TurboDocx application URL) from URL rewriting and content modification, then resend with a unique subject. If DKIM and DMARC now pass, you've confirmed the policy as the cause.

## How to resolve it

If the failure only appears after a gateway modifies the message, the sending configuration is working and the change is made on the receiving side. The administrator of the affected email environment has a few options:

- **Rely on ARC.** ARC is designed to carry the original authentication results across an intermediary that modifies a message, so a receiver that trusts the gateway's ARC seal can still treat the message as authenticated. Confirm the receiving platform is configured to trust that seal.
- **Exclude the TurboDocx URLs from link rewriting.** For most gateways this means adding both `app.turbodocx.com` and `sign.turbodocx.com` to the link-rewriting exclusion list. TurboSign signature requests link to `sign.turbodocx.com`, so excluding only `app.turbodocx.com` won't stop those messages from being modified. This stops the body from being changed for those links. Because it also skips click-time inspection for them, treat it as a scoped exception rather than a blanket change.
- **Create a narrowly scoped exception for TurboDocx messages** instead of disabling protection broadly.
- **Contact the gateway vendor** if messages are being incorrectly quarantined or rejected despite a valid ARC chain.

## What not to do

- Don't loosen or disable DKIM and DMARC enforcement on the receiving side just to make the failure disappear. That hides the problem and weakens protection for all of your inbound mail, not just TurboDocx.
- Don't read the domain in an SPF result as the domain being authenticated. After a relay it reflects the gateway, not the original sender.

If the message passes at a directly delivered mailbox in step 1, the TurboDocx sending configuration (SPF and DKIM) is already correct. The fix for a gateway-modified message is on the receiving side, so there's no change to make on the TurboDocx side.

## What to share if you contact support

If you've worked through the steps and still need help, include as much of the following as you can. It lets us pinpoint the cause quickly:

- The complete message headers
- The email platform and any security product in the delivery path
- Whether link rewriting or external banners are enabled
- The final DKIM, SPF, DMARC, and ARC results
- The result of the same email sent to a directly delivered mailbox (step 1)
- The result with the modifying policy temporarily off (step 3)

If a TurboDocx email passes DKIM, SPF, and DMARC when delivered directly but fails only after a gateway modifies it, the cause is that in-transit change rather than the sending configuration, and the fix lives with the gateway or the receiving platform's handling of it.
