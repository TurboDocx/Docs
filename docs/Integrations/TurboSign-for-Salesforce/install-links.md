---
title: TurboSign for Salesforce one-click install links
sidebar_label: One-click install links
slug: /Integrations/turbosign-for-salesforce/install-links
sidebar_position: 3
description: One-click install links for the TurboSign for Salesforce package, for production, Developer Edition, and sandbox orgs, plus how to find newer versions and check which version you have.
keywords:
  - turbosign salesforce install link
  - turbosign salesforce package
  - salesforce unlocked package install url
  - install turbosign in salesforce sandbox
  - turbosign salesforce version
---

# One-click install links

These links install the TurboSign for Salesforce package that TurboDocx publishes. Pick the link for the kind of org you're installing into, then follow [Install with a one-click link](/docs/Integrations/turbosign-for-salesforce/install#install-with-a-one-click-link).

## Version 1.0.0

| Install into | Link |
|---|---|
| Production or Developer Edition org | [Install in production or Developer Edition](https://login.salesforce.com/packaging/installPackage.apexp?p0=04tbm000000mtqDAAQ) |
| Sandbox | [Install in a sandbox](https://test.salesforce.com/packaging/installPackage.apexp?p0=04tbm000000mtqDAAQ) |

The two links install the same package. Production and Developer Edition orgs sign in at `login.salesforce.com`, and sandboxes sign in at `test.salesforce.com`, so each link opens the right login page.

:::tip Install in a sandbox first
If you have a sandbox, install there first, finish the [setup](/docs/Integrations/turbosign-for-salesforce/setup), and send a test document before you install in production.
:::

:::note Logged in to a different org?
The link opens in whichever org your browser is already logged in to. If that's the wrong one, log out first, or open the link in a private browser window.
:::

## Newer versions

Each new version is listed with its own install links on the [TurboSign for Salesforce releases page](https://github.com/TurboDocx/turbosign-salesforce/releases). To upgrade, open the newer version's link in the org that already has the package. See [Upgrade to a newer version](/docs/Integrations/turbosign-for-salesforce/install#upgrade-to-a-newer-version).

## Check which version is installed

1. Open **Setup**.
2. In **Quick Find**, type `Installed Packages`, then click **Installed Packages**.
3. Find **TurboSign for Salesforce** in the list. The **Version Number** column shows the version you have. Version 1.0.0 shows a number that starts with `1.0.0`.

<!-- Screenshot: install-05-installed-packages.png, Installed Packages list with the TurboSign for Salesforce row and its Version Number highlighted -->
