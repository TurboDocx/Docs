---
title: Send a document for signature from Salesforce
slug: /Integrations/turbosign-for-salesforce/send-and-sign
sidebar_position: 5
description: How a sales rep sends a TurboDocx document for e-signature from a Salesforce Opportunity, what signers see, and where the signed PDF lands.
keywords:
  - send for signature salesforce
  - salesforce e-sign opportunity
  - turbosign salesforce rep
  - salesforce signed document
  - e-signature from crm record
---

# Send a document for signature from Salesforce

This guide shows a rep how to send a document from an Opportunity, what each signer sees, and where the signed copy ends up. Your admin must finish [Set up TurboSign for Salesforce](/docs/Integrations/turbosign-for-salesforce/setup) first.

## Step 1: Start the send

1. Open the Opportunity.
2. Click **Send for Signature** at the top right.

   ![Opportunity page with the Send for Signature button highlighted](/img/turbosign-salesforce/40-send-for-signature.png)

3. Under **Document**, pick the document you want to send.

   ![Document list with Service Agreement highlighted](/img/turbosign-salesforce/41-choose-document.png)

4. Click **Review**. TurboSign fills the document from the record. This can take a few seconds for long documents.

   ![Send dialog with the Review button highlighted](/img/turbosign-salesforce/42-review.png)

## Step 2: Check the values and signers

The review screen opens on the **Details** tab. It lists every value going into the document, with where it came from. You can correct any value here. Your change only affects this send, not the record.

Under **Signers**, check each person's name and email. You can correct these too.

![Review screen with the Signers section highlighted](/img/turbosign-salesforce/43-review-signers.png)

## Step 3: Check the document

Click the **Document** tab to see the document as it will go out, with any corrections you made. TurboSign renders it the first time you open the tab, which can take a minute or two. Nothing is sent yet.

![Review screen with the Document tab highlighted](/img/turbosign-salesforce/44a-document-tab.png)

The document opens right in the window, where you can scroll, zoom, and print it.

![Document tab showing the filled-in Service Agreement](/img/turbosign-salesforce/44b-document-preview.png)

- Signing fields of any kind (signature, initials, date, text, and so on) still show as their tokens, such as `{sig}` or `{date}`. Each signer gets a box in that spot when the document goes out.
- The render also checks the signing spots. **Details** lists every spot, and after the render it says **All signature spots found in the document**. If a spot is missing, it names the token and the signer instead. Ask your admin to fix the template or the setup before you send.
- If you change a value after it renders, the tab shows **Your edits aren't in this preview yet**. Click **Update preview** to see the new version. **Send** always uses your latest values, even if you didn't update the preview.

  ![Document tab with the Update preview button highlighted](/img/turbosign-salesforce/44c-update-preview.png)

- To view it full size, click **Open in a new tab**.
- In the Salesforce mobile app, the tab asks you to open the record on a computer instead. You can still send from your phone.

## Step 4: Send

Click **Send**.

![Review screen with the Send button highlighted](/img/turbosign-salesforce/44-send.png)

You see **Sent for signature** only after TurboDocx has accepted the document and emailed the first signer. If something is wrong, you see the reason instead, for example `Required value {MonthlyRent} is empty on this record`. Fix the record (or ask your admin) and send again.

:::caution If you see "Check before sending again"
This means the connection dropped after TurboDocx may already have sent the document. Before you click **Send** again, click **Refresh** in the **TurboSign Signatures** panel, or ask the signer whether they got an email, so the signers don't get two copies.
:::

## What signers see

Each signer gets an email with a link. Signers sign in order, so the second signer's email arrives after the first signer finishes.

1. If your organization requires identity verification, the signer clicks **Send Code** and gets a six-digit code by email. See [one-time passcodes](/docs/TurboSign/how-to-configure-one-time-passcode).

   ![Verify your identity screen with the Send Code button highlighted](/img/turbosign-salesforce/50-signer-send-code.png)

2. They type the code and click **Verify And Continue**.

   ![Code entry screen with Verify And Continue highlighted](/img/turbosign-salesforce/51-signer-enter-code.png)

3. They agree to sign electronically and click **Continue**.

   ![Consent screen with the Continue button highlighted](/img/turbosign-salesforce/52-signer-consent.png)

4. They click each **Signature** or **Initial** box. The first time, they type or draw their signature and click **Save**. The counter at the top shows how many spots are left.

   ![A Signature box highlighted in the document](/img/turbosign-salesforce/53-signer-signature-field.png)

   ![Signature dialog with the Save button highlighted](/img/turbosign-salesforce/54-signer-adopt-signature.png)

5. When every required spot is filled, they click **Submit Signature**.

   ![Top bar with the Submit Signature button highlighted](/img/turbosign-salesforce/55-signer-submit.png)

   ![Document Successfully Signed confirmation](/img/turbosign-salesforce/56-signer-done.png)

## Where the signed copy goes

When the last signer submits, TurboDocx saves two files to the record:

- the signed PDF, named like the document, and
- the **Audit Trail** PDF, which records who signed, when, and from where.

![Notes & Attachments list with the signed PDF and audit trail highlighted](/img/turbosign-salesforce/45-signed-files.png)

If your admin turned on **On Completion**, the record also moves forward, for example to **Closed Won**.

![Stage History showing the move to Closed Won](/img/turbosign-salesforce/46-stage-closed-won.png)

## Follow up on a sent document

The **TurboSign Signatures** panel on the record lists the documents sent from it. If you don't see the panel, ask your admin to add it. In the panel you can:

- click **Refresh** to pull the latest status and see how many people have signed,
- click **Remind** to email signers who haven't signed yet, or
- click **Void** to cancel the document. Void can't be undone.
