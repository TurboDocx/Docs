---
title: SharePoint Pipelines Troubleshooting & FAQ
sidebar_position: 6
description: Fix common SharePoint Pipelines setup and connection errors, including the AADSTS500113 "no reply address is registered" redirect URI error.
keywords:
  - sharepoint pipelines
  - AADSTS500113
  - no reply address
  - redirect uri
  - azure ad app
  - turbodocx pipelines
  - pipelines troubleshooting
---

# SharePoint Pipelines — Troubleshooting & FAQ

Common issues when connecting a **SharePoint Pipeline** and setting up its bring-your-own (BYO) Azure AD app.

## Connection & sign-in

### "AADSTS500113: No reply address is registered for the application"

**Cause:** Your Azure AD app has no **Redirect URI** registered. This trips people up because the Pipelines *runtime* (the folder-watch, file download, and signed-PDF write-back) uses **app-only** auth (client credentials), which needs **no** redirect URI — but the **folder picker in the pipeline wizard** signs you in **interactively in the browser**, and that flow **does** require one. If you followed the app-only setup only, the picker sign-in fails with `AADSTS500113`.

**Solution:**

1. In the TurboDocx **Connect SharePoint** dialog, copy the **Redirect URI** it displays (it's your TurboDocx app origin, e.g. `https://app.turbodocx.com`). Use the **Copy** button so you get it exactly.
2. Open the [Azure portal](https://portal.azure.com) → **App registrations** → your Pipelines app → **Authentication**.
3. Click **Add a platform** → **Single-page application (SPA)** → paste the redirect URI → **Configure**.
4. Return to TurboDocx and retry — the picker sign-in now succeeds.

:::tip
Add the URI under **Single-page application (SPA)**, **not** "Web". The picker uses MSAL in the browser (PKCE), which requires the SPA platform type. A "Web" platform will still fail.
:::

### The picker still won't sign you in *after* adding the redirect URI

**Cause:** The app is missing the **delegated** permission the interactive sign-in needs. The redirect URI gets you past `AADSTS500113`, but the browser sign-in also requires a delegated identity scope — typically **`User.Read`** — and often the delegated SharePoint read scopes for browsing.

**Solution:** Add the delegated permissions in the [permissions list below](#required-api-permissions) (at minimum **`User.Read`** — Microsoft Graph, Delegated), then **Grant admin consent** and retry.

### "Connection failed" or a 403 when saving credentials or clicking Test connection

**Cause:** The app is missing a required Microsoft Graph **Application permission**, or **admin consent** hasn't been granted.

**Solution:**

1. Azure portal → your Pipelines app → **API permissions**.
2. Add the full set in [Required API permissions](#required-api-permissions) below — in particular the two people most often miss: **`Files.ReadWrite.All`** (Application) and **`User.Read`** (Delegated).
3. Click **Grant admin consent for &lt;your tenant&gt;** and confirm every row shows a green check.
4. Re-run **Test connection** in TurboDocx.

## Required API permissions

The Pipelines app needs **both** app-only (Application) permissions — for the unattended runtime — **and** delegated permissions — for the wizard's interactive folder picker. Add all of these, then **Grant admin consent**:

| API | Permission | Type | Used by |
|-----|-----------|------|---------|
| Microsoft Graph | `Sites.ReadWrite.All` *(or `Sites.Selected` + per-site grant)* | **Application** | Runtime — read/write SharePoint items |
| Microsoft Graph | `Files.ReadWrite.All` | **Application** | Runtime — download source PDFs, write signed PDFs |
| Microsoft Graph | `User.Read` | **Delegated** | Picker — interactive sign-in |
| Microsoft Graph | `Sites.ReadWrite.All` | **Delegated** | Picker — browse sites as the signed-in user |
| Office 365 SharePoint Online | `AllSites.Read` | **Delegated** | Picker — list site collections |
| Office 365 SharePoint Online | `MyFiles.Read` | **Delegated** | Picker — read user files |

:::note
`Files.ReadWrite.All` (Application) and `User.Read` (Delegated) are the two most commonly missed. Missing `Files.ReadWrite.All` breaks the pipeline run; missing `User.Read` breaks the picker sign-in even after the redirect URI is registered.
:::

### The SharePoint folder picker opens to a blank / gray screen

**Cause:** A stale MSAL session cached in the browser.

**Solution:** Clear the site's **localStorage and cookies** (or use a fresh incognito window), then reopen the picker and sign in again.

## Setup checklist (avoids the errors above)

When registering the BYO Azure AD app for SharePoint Pipelines, make sure you do **all** of these:

- **Authentication** → add a **Single-page application (SPA)** platform with the Redirect URI shown in the Connect dialog (prevents `AADSTS500113`).
- **API permissions** → add **all** of the [Required API permissions](#required-api-permissions) above — both the **Application** perms (`Sites.ReadWrite.All`, `Files.ReadWrite.All`) and the **Delegated** perms (`User.Read`, plus the SharePoint browse scopes) → **Grant admin consent** (prevents the 403 on save/test *and* the picker sign-in failure).
- **Certificates & secrets** → create a client secret and copy the **value** immediately.
- Paste **Application (client) ID**, **client secret value**, and **Directory (tenant) ID** into the TurboDocx Connect dialog.
