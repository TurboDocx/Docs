---
title: How to Configure Signature Appearance
sidebar_position: 8
description: Control how signed fields look on the finished PDF in TurboSign — turn the signature outline and label or the verification hash on or off — and how locked fields appear to signers in the signing portal, for your whole organization.
keywords:
  - turbosign signature appearance
  - signature outline
  - verification hash
  - signed pdf appearance
  - e-signature settings
  - signature field styling
  - locked fields
  - signing portal appearance
---

# How to Configure Signature Appearance

TurboSign stamps each signed field onto the finished PDF with a thin outline, a small label, and a verification hash. It also decides how **locked fields** — read-only values imported onto a document that the signer can't change — appear while someone is signing. You can control all of this for your whole organization from one settings screen.

This guide shows you how to find and change the **Signature Appearance** and **Locked Fields Rendering** options.

:::note What these options do
**Signature Appearance** — how each signed field looks on the finished PDF:
- **Show signature outline and label** — the thin border and caption drawn around each signed field on the PDF.
- **Show verification hash** — the short verification code printed beneath a signature.

**Locked Fields Rendering** — how locked (read-only) fields look to the signer in the signing portal:
- **Show locked fields with grey background** — draw each locked field as a grey box, or, when turned off, render its value as plain document text (and hide blank locked fields entirely) for a cleaner page.

All three are **on** by default, so your documents look the same until you change them. These settings apply to every new signature request in your organization.
:::

## Step 1: Open the account menu

In the left sidebar, click your **account avatar** at the bottom.

![Left sidebar with the account avatar at the bottom highlighted](/img/signature-appearance/01-user-avatar.png)

## Step 2: Open Settings

In the menu that appears, click **Settings**.

![Account menu with the Settings item highlighted](/img/signature-appearance/02-settings-menu-item.png)

## Step 3: Go to Organization Settings

At the top of the Settings page, click the **Organization Settings** tab.

![Settings page with the Organization Settings tab highlighted](/img/signature-appearance/03-organization-settings-tab.png)

## Step 4: Open E-Signature settings

Scroll to the **Signatures** card under **Core Features** and click **Configure E-Signature**.

![Signatures card with the Configure E-Signature button highlighted](/img/signature-appearance/04-configure-esignature.png)

## Step 5: Set the signature appearance options

In the **E-Signature Settings** dialog, find the **Signature Appearance** section. Use the two switches to turn each option on or off:

- **Show signature outline and label**
- **Show verification hash**

![E-Signature Settings dialog with the Signature Appearance toggles highlighted](/img/signature-appearance/05-signature-appearance-toggles.png)

Your choice is saved for the organization and applies to future signature requests.

## Step 6: Choose how locked fields appear

In the same **E-Signature Settings** dialog, find the **Locked Fields Rendering** section below the appearance options.

- Leave **Show locked fields with grey background** **on** (the default) to keep drawing each locked field as a grey box.
- Turn it **off** to render locked values as plain document text instead. Blank locked fields are then hidden completely, which keeps the page clean and stops an empty box from sitting over the text beneath it.

This setting changes what signers see in the **signing portal**; it does not change the signature stamp on the finished PDF.

<!-- TODO(guidewright): capture /img/signature-appearance/06-locked-fields-rendering.png — the E-Signature Settings dialog with the "Show locked fields with grey background" checkbox highlighted. Needs a working app build; tracked in the PR. This step ships without a screenshot until then. -->


:::tip
Turning the two **Signature Appearance** options off gives a cleaner, minimal signature stamp — useful when you want the signature to blend into a formal document layout. Turning **Show locked fields with grey background** off similarly declutters the signing page for the recipient. Signed PDFs still carry their full audit trail either way.
:::
