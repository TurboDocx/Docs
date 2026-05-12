---
title: SharePoint Pipelines Setup
sidebar_position: 8
description: Connect a SharePoint folder to TurboDocx so PDFs dropped there are automatically signed via TurboSign and written back to a routed destination folder. This setup guide walks through registering the Azure AD app, granting the right permissions, and pasting credentials into TurboDocx.
keywords:
  - sharepoint pipelines
  - sharepoint automation
  - sharepoint to turbosign
  - sharepoint signature workflow
  - azure ad app registration
  - microsoft graph application permissions
  - client credentials flow
  - sharepoint folder watcher
  - sharepoint integration setup
  - sharepoint signed pdf
  - sharepoint document automation
  - byo azure ad app
  - sharepoint webhook
  - graph subscriptions
---

# SharePoint Pipelines Setup

SharePoint Pipelines watch a SharePoint folder for new PDFs and automatically run them through a signing workflow: PDF dropped in folder → TurboDocx places a signature box → sent for signing via TurboSign → signed PDF + audit trail written back to a destination folder you pick.

This guide covers the **one-time setup** an Azure admin does to give TurboDocx the access it needs. Once setup is complete, anyone with admin permissions in your TurboDocx org can create pipelines through the UI.

:::note Separate from the SharePoint picker
Pipelines use a **different** Azure AD app than the existing SharePoint picker (the one users sign into to import templates and export documents). The picker uses delegated permissions (per-user, browser-based, PKCE). Pipelines use application permissions (unattended, server-to-server, client-credentials).

You can have either, both, or neither — they're completely independent. Setting up Pipelines does not change anything about the existing picker integration.
:::

## Prerequisites

- An Office 365 / Microsoft Entra tenant with SharePoint enabled
- An account with **Application Administrator** or **Global Administrator** role in Microsoft Entra (you need this to grant admin consent on application-permission scopes)
- TurboDocx admin access to the organization that will own the pipelines

## Step 1: Register the app in Microsoft Entra ID

1. Sign into the **[Azure portal](https://portal.azure.com)** and open **Microsoft Entra ID** (formerly Azure Active Directory).
2. Left nav → **App registrations** → **+ New registration**.
3. Fill in:
   - **Name**: something like `TurboDocx Pipelines` (this name is only shown to you)
   - **Supported account types**: **Accounts in this organizational directory only** (single tenant) — Pipelines run in your tenant only
   - **Redirect URI**: **leave blank**. Pipelines use the client credentials flow, which has no browser redirect.
4. Click **Register**.

On the **Overview** page, copy and save these two values somewhere safe:

- **Application (client) ID**
- **Directory (tenant) ID**

You'll paste both into TurboDocx in Step 4.

## Step 2: Grant the right API permissions

Pipelines run **unattended** — no user is signed in when TurboDocx reads from or writes to your SharePoint folders. That means the app needs **Application permissions** (not Delegated).

:::danger Pick **Microsoft Graph**, not **SharePoint**
Azure shows two separate APIs in the "Request API permissions" picker that both have a `Sites.ReadWrite.All` permission with **identical names**: one under **Microsoft Graph**, one under **SharePoint**.

**TurboDocx Pipelines uses Microsoft Graph exclusively.** Every call our runtime makes goes to `graph.microsoft.com`. The permission listed under the legacy **SharePoint** API only authorizes calls to `{tenant}.sharepoint.com/_api/*` (the legacy REST API), so granting it does nothing for us — the connection probe will still 403 even with a green checkmark next to it.

When you click **+ Add a permission**, on the **Request API permissions** page choose **Microsoft Graph** (top-left tile in the "Microsoft APIs" tab). If you see the permission appear under a section labeled `SharePoint (1)` in your app's API permissions list, you picked the wrong API — remove it and re-add from Microsoft Graph.
:::

1. Left nav → **API permissions** → **+ Add a permission** → **Microsoft Graph** → **Application permissions** (the right-hand tile, not Delegated).

   ![Choose Microsoft Graph, not SharePoint, when adding the permission](/img/sharepoint-pipelines/02-choose-microsoft-graph.png)

2. Add **one** of the following:

| Permission | When to pick it |
|---|---|
| `Sites.ReadWrite.All` | **Recommended for most setups.** Grants the app read/write access to all SharePoint sites in your tenant. Sufficient for everything Pipelines needs (subscribe to folder changes, download incoming files, upload signed PDFs back). |
| `Sites.Selected` | **Recommended if you want to scope the app to specific sites only.** With this permission, the app has zero site access by default — an admin then explicitly grants the app access to each SharePoint site that will participate in a pipeline, via a separate Graph call. More secure, more setup. Pick this if your org's security posture requires least-privilege scoping. |

3. After adding the permission, click the **Grant admin consent for {your tenant}** button at the top of the permissions list. The Status column should show a green checkmark.

   ![API permissions list with Microsoft Graph Sites.ReadWrite.All granted](/img/sharepoint-pipelines/03-graph-permission-granted.png)

   Your final list under **Configured permissions** should look like:

   ```
   Microsoft Graph (1+)
     Sites.ReadWrite.All    Application    ✅ Granted for {tenant}
   ```

   If it instead looks like the example below, the permission landed under the wrong API. Remove the SharePoint entry, repeat step 1 picking **Microsoft Graph** this time.

   ```
   SharePoint (1)
     Sites.ReadWrite.All    Application    ✅ Granted for {tenant}   ← wrong API
   ```

### Add the same permission under Delegated, for the wizard's folder picker

The Application permission you just added is for the server-side **runtime** — when Microsoft Graph fires a notification, TurboDocx authenticates as the app itself (no user in the loop) and reads/writes the watched folder.

The wizard's **folder picker** (the "Browse SharePoint" button when you create a pipeline) is different — it runs in your browser as **you**, and Microsoft's native file picker only accepts user-context tokens. So the same app needs a **Delegated** permission of the same name.

4. Still on **API permissions**, click **+ Add a permission** again → **Microsoft Graph** → this time pick **Delegated permissions** (the left-hand tile).
5. Add `Sites.ReadWrite.All` (Delegated).
6. Click **Grant admin consent for {your tenant}** again.

### Add SharePoint (legacy API) Delegated permissions for picker browse

The wizard's folder picker is Microsoft's own embeddable component (the **PnP File Picker**). Even though everything *we* call goes through Microsoft Graph, the picker itself talks to the **legacy SharePoint REST API** (`{tenant}.sharepoint.com/_api/*`) to enumerate files and folders for the browse popup. That means the same app also needs two permissions under the **SharePoint** API.

If you skip these, the picker will open and sign you in successfully — then show an empty file/folder list because it can't enumerate anything.

7. Still on **API permissions**, click **+ Add a permission** → this time pick **SharePoint** (it's lower down in the "Microsoft APIs" tab, separate from Microsoft Graph) → **Delegated permissions**.
8. Add both of:
   - `AllSites.Read` — lets the picker browse SharePoint sites you have access to.
   - `MyFiles.Read` — lets the picker show the **OneDrive** and **Recent** tabs in its sidebar. Required as long as the picker UI surfaces those tabs.
9. Click **Grant admin consent for {your tenant}** one more time.

Your final list under **Configured permissions** should look like:

   ```
   Microsoft Graph (2)
     Sites.ReadWrite.All    Application    ✅ Granted for {tenant}
     Sites.ReadWrite.All    Delegated      ✅ Granted for {tenant}
   SharePoint (2)
     AllSites.Read          Delegated      ✅ Granted for {tenant}
     MyFiles.Read           Delegated      ✅ Granted for {tenant}
   ```

Azure also auto-adds `User.Read` (Microsoft Graph, Delegated) to every new app registration. It's harmless and unused by TurboDocx — leave it alone.

:::tip One Azure app, two permission types — why
The Pipelines runtime uses **Application** permissions on Microsoft Graph (so it can act when no human is signed in — that's how a file dropped at 3am still gets processed). The wizard's folder picker uses **Delegated** permissions on both Microsoft Graph (for the drive-name lookup) and the legacy SharePoint API (for the actual browse popup). All on the same app to keep your setup to one registration, one client secret, one admin-consent ceremony — instead of two of each.
:::

:::note Files.ReadWrite.All — also recommended
`Files.ReadWrite.All` (under **Microsoft Graph**, Application) is a OneDrive-adjacent permission that overlaps with `Sites.ReadWrite.All` for SharePoint-only flows. Adding it doesn't expand the runtime's capabilities for the current Pipelines feature (`Sites.ReadWrite.All` alone covers reading from and writing to SharePoint folders), but most customers add it anyway for future-proofing — e.g. if Pipelines later supports OneDrive-for-Business folders or you stand up other TurboDocx integrations on the same app. Leaving it in causes no harm.
:::

## Step 2.5: Add a redirect URI for the folder picker

The wizard's folder picker pops open a Microsoft sign-in window so you can authenticate. Microsoft will refuse to redirect back to TurboDocx unless your URL is explicitly registered on the app under **Authentication**.

1. Left nav → **Authentication** → **+ Add a platform** → pick **Single-page application**.
2. In the **Redirect URIs** field, paste the URL TurboDocx shows you. You can find this in the TurboDocx Pipelines settings dialog under the **Redirect URI** info block — there's a Copy button next to it. (For most customers this is `https://app.turbodocx.com`.)
3. Leave the other settings at their defaults. Click **Configure**.
4. Hit **Save** at the top of the page.

:::caution The redirect URI must match exactly
Microsoft does an exact-string match. `https://app.turbodocx.com` ≠ `https://app.turbodocx.com/` (trailing slash). Use the value the dialog provides as-is — don't add or remove anything.
:::

If you skip this step or get the value wrong, the picker will pop open and immediately show a Microsoft error like **AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application.**

## Step 3: Create a client secret

1. Left nav → **Certificates & secrets** → **Client secrets** tab → **+ New client secret**.
2. Give it a description (`TurboDocx Pipelines` is fine) and pick an expiration. A 24-month expiration is reasonable for most setups; shorter requires more frequent rotation, longer carries more blast radius if it ever leaks.
3. Click **Add**.

**Copy the `Value` column immediately.** Azure only shows the secret value once — if you navigate away before copying it, you'll have to create another one.

:::caution The Secret ID is not what you want
The Certificates & secrets page shows two columns: **Value** and **Secret ID**. TurboDocx needs the **Value** (a long random string). The Secret ID is an internal Azure reference and won't work.
:::

You now have three values to paste into TurboDocx:

- **Application (client) ID** (from Step 1)
- **Directory (tenant) ID** (from Step 1)
- **Client secret value** (from Step 3)

## Step 4: Paste credentials into TurboDocx

1. Sign into TurboDocx and open the **Pipelines** tab.
2. You'll see a yellow "SharePoint Pipelines isn't connected yet" banner. Click **Connect SharePoint** (or the settings gear icon next to "E-Signature Pipelines").
3. In the dialog, paste:
   - **Application (client) ID** → from Step 1
   - **Client secret** → from Step 3 (the `Value`, not the `Secret ID`)
   - **Directory (tenant) ID** → from Step 1
   - **Tenant display name** (optional) → a friendly label like `Contoso Production`. Shown in the dialog so anyone can tell at a glance which tenant is connected.
4. Click **Connect SharePoint**.

The status chip next to "E-Signature Pipelines" should flip from "Not connected" (amber) to "Connected" (green). The **New Pipeline** button is now enabled.

:::tip Same credentials power the runtime AND the wizard picker
The clientId / clientSecret / tenantId you just pasted are used by both halves of Pipelines — the server-side runtime (Application permission, via the secret) and the wizard's "Browse SharePoint" folder picker (Delegated permission, via your browser sign-in). One set of credentials, one app, both flows.
:::

## You're done with setup

Anyone with admin permissions in your TurboDocx org can now create pipelines through the wizard. The connection persists per organization — you only do this setup once per tenant.

## Verifying the connection

Once you've connected, you can re-verify the credentials at any time without re-pasting your secret:

1. Open the Pipelines tab → click the settings gear → the dialog opens with the green "Connected to tenant…" alert.
2. Click **Test connection** (just under the alert).

TurboDocx runs the same two-step probe Microsoft sees during a save — asks for a token using the stored credentials, then makes one read-only Graph call to confirm consent is still granted. The button shows a spinner while testing, then either:

- A green **Verified HH:MM** badge appears next to the button — credentials work.
- The same reason-mapped red alert from the save flow appears at the top of the dialog (e.g. "The app exists but admin consent isn't granted") — explaining exactly what to fix.

When to test:

- **Before a planned secret rotation** — confirm the existing secret still works before generating a new one in Azure, so you can tell whether a post-rotation failure is from the new secret or something unrelated.
- **When investigating "pipelines stopped running"** — narrows the problem to "connection is broken" vs. "connection is fine, something else is wrong" without you needing to drop a test file in SharePoint.
- **After someone changes Azure** — if an admin revokes consent, deletes the app, rotates the secret in Azure without updating TurboDocx, or moves the app to a different tenant, **Test connection** surfaces it immediately.

The test is read-only — it makes one Graph call against `sites?$top=1` and looks at the response code. It doesn't change anything in your tenant.

## Maintenance

### Rotating the client secret

Client secrets expire on whatever timeline you picked in Step 3. Before expiry:

1. In Azure: **App registrations** → your app → **Certificates & secrets** → create a new secret, copy its `Value`.
2. In TurboDocx: Pipelines tab → settings gear → paste the new `Value` over the existing one → Save.

After rotation, you can safely delete the old secret in Azure.

:::note Rotation rewrites — no "leave unchanged"
TurboDocx never echoes the existing secret back to the UI (it's only shown the placeholder dots). To prevent silent rotation mistakes, the dialog always requires you to paste a fresh secret value when saving. There's no "update everything but the secret" mode by design.
:::

### Disconnecting

Pipelines tab → settings gear → **Disconnect** (bottom-left of the dialog) → confirm.

Disconnecting:

- Removes the stored credentials from TurboDocx
- Stops processing any new SharePoint notifications for this org
- Does **not** delete pipelines you've already created — they're paused. Reconnect with valid credentials to resume them.

## Troubleshooting

When you press **Connect SharePoint**, TurboDocx runs a quick probe against Microsoft *before* saving anything: it asks Microsoft for a token using the credentials you pasted, then makes one read-only Graph call to confirm admin consent was granted. If either step fails, the dialog stays open and shows an inline red alert that names the specific problem and what to do about it. **No credentials are saved when the probe fails** — fix the issue, press Save again.

The alert covers four cases:

| What the alert says | What it means | What to fix |
|---|---|---|
| "Microsoft rejected the client ID or secret" | Wrong Client ID or wrong client secret value (e.g. you pasted the **Secret ID** column instead of the **Value** column). | Re-copy the **Value** from Azure → Certificates & secrets, or re-copy the Application (client) ID from Overview. |
| "Microsoft couldn't find the app in this tenant" | Wrong Directory (tenant) ID, or the app is registered in a different tenant than the one you specified. | Re-copy the **Directory (tenant) ID** from Microsoft Entra → Overview. |
| "The app exists but admin consent isn't granted" | The app's API permissions are added, but nobody clicked the **Grant admin consent for {tenant}** button. | Back to Azure → API permissions → click Grant admin consent. Wait for the green checkmark in Status. Retry the save. |
| "Couldn't reach Microsoft" | Network / DNS issue between TurboDocx and `login.microsoftonline.com`. | Retry in a moment. If it persists, contact support. |

Each alert also shows a `Details:` line with the raw upstream error message. That's useful for support tickets but not usually needed to fix the issue.

### Folder picker won't sign in — "AADSTS50011" or a Microsoft redirect-mismatch error

You click **Browse SharePoint** in the wizard, a Microsoft sign-in window pops open, then closes immediately or shows an error like _"The reply URL specified in the request does not match the reply URLs configured for the application."_

The picker uses different permissions than the runtime — it needs **Delegated** permissions AND a registered **Redirect URI** on the same Azure app. Confirm:

- **Delegated `Sites.ReadWrite.All` is added under Microsoft Graph** — open the app in Azure → API permissions. Look for `Sites.ReadWrite.All` with **Type: Delegated** alongside the Application one. If missing, add it and grant admin consent again. See [Step 2](#step-2-grant-the-right-api-permissions) for the walkthrough.
- **A Redirect URI matching your TurboDocx URL is registered** — Azure → Authentication → Single-page application platform. The URL must match TurboDocx's exactly (no trailing slash, same scheme). TurboDocx shows the value in the Pipelines settings dialog with a Copy button so you can paste it as-is. See [Step 2.5](#step-25-add-a-redirect-uri-for-the-folder-picker).

### Folder picker opens but the file/folder list is empty

You sign in successfully, the picker pops to the right tenant, but every tab (SharePoint, OneDrive, Recent) shows an empty list — no folders, no files, no error message.

This is a **SharePoint API permission gap**. The picker enumerates folders via the legacy SharePoint REST API (not Microsoft Graph), so it needs its own Delegated permissions on the **SharePoint** API. Open the app in Azure → API permissions and confirm both of these are present and admin-consented:

- `AllSites.Read` (under **SharePoint**, Type: Delegated)
- `MyFiles.Read` (under **SharePoint**, Type: Delegated)

If they're missing, add them per [the SharePoint Delegated section in Step 2](#add-sharepoint-legacy-api-delegated-permissions-for-picker-browse), grant admin consent, then reopen the picker.

### Pipelines created but no runs appear when files are dropped

The connection saved fine (probe passed) but Microsoft Graph isn't reaching TurboDocx with notifications. Most likely causes:

- **Permission scope is too narrow** — if you picked `Sites.Selected`, an admin needs to explicitly grant the app access to each SharePoint site participating in a pipeline. Switch to `Sites.ReadWrite.All` to test, or work with your admin to add the per-site grants.
- **Client secret expired** — check Azure → Certificates & secrets. The probe ran when you saved, but secrets expire on their own schedule and silently break the integration. Rotate per the section above.

## Appending Terms & Conditions or addendums

In the wizard's **E-Signature → Append Documents** section, drop in a PDF (Terms & Conditions, MSA addendum, payment-terms page — whatever your process needs). Each appendix can have its own signature, date, and initial fields placed visually on its pages.

At runtime, every PDF that lands in the watched SharePoint folder gets the source + every appendix you've configured stitched into a single PDF before it goes out for signature. The signed PDF that lands back in the destination folder contains the invoice AND the appendix pages — fully executed, audit-trail intact.

A few things worth knowing:

- **Upload happens on Save.** While you're configuring the wizard, the appendix sits in your browser only — that's why you'll see "in-session preview" if you refresh mid-edit. Once you click Save, the PDFs upload to TurboDocx storage and persist with the pipeline.
- **10 MB cap per appendix.** Terms & Conditions docs are typically well under 1 MB; the cap exists to prevent slow runs on scan-quality 200 MB monsters.
- **PDFs only.** Other formats won't upload. Convert to PDF first if you need a different source format.
- **Remove cleanly.** Delete an appendix in the wizard and click Save — the file is purged from TurboDocx storage within 24h. Deleting the whole pipeline cascades the cleanup automatically.
- **Order matters.** Appendices append in the order you arrange them in the wizard, after the source invoice. If your signature anchor is `Last page of merged document`, the signature lands on the final appendix page; if it's `Last page of invoice`, it stays on the original invoice page even when appendices follow.

## What's next

With the connection live, create your first pipeline through the wizard:

- Pick a SharePoint folder to watch
- Define what gets extracted from each PDF (regex over the document text)
- Set the signer and signature placement (and add appendices if you have any)
- Pick a destination folder + filename template for the signed PDF

The wizard walks you through each step. You can pause, edit, or delete pipelines anytime through the Pipelines tab.
