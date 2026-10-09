---
title: Troubleshooting TurboSign for Salesforce
slug: /Integrations/turbosign-for-salesforce/troubleshooting
sidebar_position: 7
description: Fixes for common TurboSign for Salesforce errors, from missing credentials to empty required values and signed documents that don't appear on the record.
keywords:
  - turbosign salesforce error
  - salesforce e-signature troubleshooting
  - field turbodocx_api apikey does not exist
  - salesforce credential access error
  - signed pdf not on record
---

# Troubleshooting TurboSign for Salesforce

Find the message you see, then follow the fix.

## "Field TurboDocx_API.ApiKey does not exist" (or OrgId)

The External Credential is missing the `ApiKey` or `OrgId` parameter, or the name is spelled differently. The names are case sensitive.

**Fix:** In **Setup**, go to **Named Credentials**, then **External Credentials**, then **TurboDocx API**, and edit **TurboDocxPrincipal**. Add the missing parameter with the exact name. See [Step 1 of the setup guide](/docs/Integrations/turbosign-for-salesforce/setup#step-1-store-your-api-key-and-organization-id).

## "401" or "Could not load templates from TurboDocx: 401"

TurboDocx rejected the key or the Organization ID. The key may have been revoked, or the Organization ID may belong to a different TurboDocx organization.

**Fix:** Create a new API key in TurboDocx, check the Organization ID, and update both values on the principal. Then open **TurboSign Setup**: if the template list loads, the connection works.

## "We couldn't access the credential(s)"

The user who clicked (or the user a Flow runs as) doesn't have access to the TurboDocx credential.

**Fix:** Assign the **TurboSign User** permission set (or **TurboSign Admin** for admins) to that user.

## "Required value `{SomeToken}` is empty on this record"

A data token marked **Required** has no value on this record and no default.

**Fix:** Fill in the field on the record and send again. If the value only applies sometimes, ask your admin to uncheck **Required** for that token in **TurboSign Setup**, so the spot is left blank instead.

## "Signer 2 has no email on this record"

A required signer's email field is empty.

**Fix:** Add the email to the record, or type it in the **Signers** section of the review screen before you click **Send**. If that signer only signs sometimes, ask your admin to uncheck **Required** on that signer.

## "Check before sending again"

The connection dropped after TurboDocx may already have sent the document.

**Fix:** Before you click **Send** again, click **Refresh** in the **TurboSign Signatures** panel, or ask the signer whether they got an email. If the document went out, don't send it again. If you don't see the panel, ask your admin to add it.

## A signing token shows as plain text in the signed document

A token in the template, such as `{guarantor_sig}`, isn't listed in the document setup.

**Fix:** In **TurboSign Setup**, add the token. Make it a signing spot for the right signer, or a **Data value** with nothing in it and **Required** unchecked to leave the line blank. Click **Check anchors against template** before saving.

## The signed PDF never appears on the record

TurboDocx saves the signed files through the Salesforce connection in your TurboDocx settings. If that connection expired or was revoked (for example after a password reset), the signing still completes, but the files can't be saved.

**Fix:** In TurboDocx, open **Settings**, then **Features and integrations**, and reconnect Salesforce. See [Salesforce Integration](/docs/Integrations/SalesForce).

## The Send for Signature button is missing

The button hasn't been added to the Opportunity page your reps see. Where it goes depends on the page:

- **Pages that use Dynamic Actions:** add **Send for Signature** to the **Highlights Panel** actions in the Lightning App Builder. Adding it to the page layout does nothing on these pages.
- **Pages that use page layout actions:** add it to the **Salesforce Mobile and Lightning Experience Actions** section of every page layout your reps use.

Also check that the rep has the **TurboSign User** permission set.

**Fix:** Follow [Add the Send for Signature button](/docs/Integrations/turbosign-for-salesforce/setup#add-the-send-for-signature-button).

## The TurboSign Signatures panel is missing

The panel is optional, so it only appears after an admin adds it to the Opportunity page.

**Fix:** Ask your admin to follow [Add the TurboSign Signatures panel](/docs/Integrations/turbosign-for-salesforce/setup#add-the-turbosign-signatures-panel-optional).

## Sends from a Flow don't go out

Flow sends run in the background, so errors don't appear on screen. They're saved as **TurboSign Log** records.

**Fix:** Look at the newest TurboSign Log records (query `TurboSign_Log__c`, or build a report) for the error, and check that the Flow's running user has **TurboSign User**.
