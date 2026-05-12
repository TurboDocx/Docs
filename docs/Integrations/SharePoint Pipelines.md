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

:::note Why not Delegated?
Pipelines fire when a file lands in SharePoint — no human is in the loop. If we used Delegated permissions, the integration would only work while a specific user is signed in to TurboDocx, which defeats the purpose. Application permissions let the app act on its own behalf.
:::

:::note Files.ReadWrite.All — optional
`Files.ReadWrite.All` (Application, under **Microsoft Graph**) is a OneDrive-centric permission that overlaps significantly with `Sites.ReadWrite.All`. Adding both is fine but not required for SharePoint-only Pipelines. If you only ever plan to use SharePoint (not OneDrive for Business), `Sites.ReadWrite.All` alone is enough.
:::

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

### Pipelines created but no runs appear when files are dropped

The connection saved fine (probe passed) but Microsoft Graph isn't reaching TurboDocx with notifications. Most likely causes:

- **Permission scope is too narrow** — if you picked `Sites.Selected`, an admin needs to explicitly grant the app access to each SharePoint site participating in a pipeline. Switch to `Sites.ReadWrite.All` to test, or work with your admin to add the per-site grants.
- **Client secret expired** — check Azure → Certificates & secrets. The probe ran when you saved, but secrets expire on their own schedule and silently break the integration. Rotate per the section above.

## What's next

With the connection live, create your first pipeline through the wizard:

- Pick a SharePoint folder to watch
- Define what gets extracted from each PDF (regex over the document text)
- Set the signer and signature placement
- Pick a destination folder + filename template for the signed PDF

The wizard walks you through each step. You can pause, edit, or delete pipelines anytime through the Pipelines tab.
