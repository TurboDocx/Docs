---
title: Install TurboSign for Salesforce
slug: /Integrations/turbosign-for-salesforce/install
sidebar_position: 2
description: Install TurboSign for Salesforce in your org with a one-click install link or by deploying from source with the Salesforce CLI, then upgrade or uninstall it.
keywords:
  - install turbosign salesforce
  - turbosign salesforce unlocked package
  - salesforce e-signature package install
  - deploy turbosign salesforce cli
  - upgrade turbosign salesforce
  - uninstall turbosign salesforce
---

# Install TurboSign for Salesforce

There are two ways to install TurboSign for Salesforce in your org. Most admins use the one-click install link.

| Method | Best for | Who does it |
|---|---|---|
| [One-click install link](#install-with-a-one-click-link) | Most orgs | A Salesforce admin, in the browser |
| [Deploy from source](#deploy-from-source-with-the-salesforce-cli) | Teams that review and deploy code themselves | A developer, with the Salesforce CLI |

After either one, you configure the app in Salesforce Setup. To configure it after installing from the Salesforce CLI instead, see [Scripted setup for admins](/docs/Integrations/turbosign-for-salesforce/scripted-setup).

Saving signed files back to your Salesforce records depends on TurboDocx's Salesforce write-back feature, which is part of TurboDocx. You turn it on by connecting Salesforce in TurboDocx, in [Step 4 of the setup guide](/docs/Integrations/turbosign-for-salesforce/setup#step-4-connect-salesforce-in-turbodocx).

## Before you install

- **You need the System Administrator profile** (or a user with permission to install packages) in the org.
- **Your org must run custom Apex.** Enterprise, Unlimited, Performance, and Developer Edition orgs work, and so do their sandboxes. Professional and Group editions don't. See [Which Salesforce orgs can use it](/docs/Integrations/turbosign-for-salesforce#which-salesforce-orgs-can-use-it).
- **Try a sandbox first** if you have one. Install, set up, and send a test document there before production. To see the signed files saved back to the sandbox record, install version 1.1.0 or later and connect that sandbox in TurboDocx, as described in [Step 4 of the setup guide](/docs/Integrations/turbosign-for-salesforce/setup#step-4-connect-salesforce-in-turbodocx).

## Install with a one-click link

The install link installs TurboSign for Salesforce as an unlocked package. It takes a few minutes.

1. Open [One-click install links](/docs/Integrations/turbosign-for-salesforce/install-links) and click the link for your org: production or Developer Edition, or sandbox.
2. Log in to the org as a System Administrator, if Salesforce asks.
3. Check that the install page shows **TurboSign for Salesforce** and the version you expect.

   ![Package install page with the app name and version number highlighted](/img/turbosign-salesforce/install-01-install-page.png)

4. Select **Install for Admins Only**.

   ![Install options with Install for Admins Only highlighted](/img/turbosign-salesforce/install-02-admins-only.png)

   This gives the package's access only to admins for now. You give your reps access with the TurboSign permission sets in the next part, which is all they need.

5. If the page asks you to confirm that you're installing a non-Salesforce application, check the box.
6. Click **Install**.

   ![Install button highlighted](/img/turbosign-salesforce/install-03-install-button.png)

7. Wait for the install to finish, then click **Done**. If Salesforce says **This app is taking a long time to install**, click **Done**. The install keeps running, and Salesforce emails you when it finishes.

   ![Install page saying the app is taking a long time to install, with the Done button highlighted](/img/turbosign-salesforce/install-04-success.png)

To confirm the install, open **Setup**, type `Installed Packages` in **Quick Find**, and click **Installed Packages**. **TurboSign for Salesforce** is in the list. See [Check which version is installed](/docs/Integrations/turbosign-for-salesforce/install-links#check-which-version-is-installed).

### Right after installing

The package is installed but not connected yet. Finish these steps in [Set up TurboSign for Salesforce](/docs/Integrations/turbosign-for-salesforce/setup):

1. [Store your API key and Organization ID](/docs/Integrations/turbosign-for-salesforce/setup#step-1-store-your-api-key-and-organization-id) in the **TurboDocx API** External Credential.
2. [Check the Named Credential URL](/docs/Integrations/turbosign-for-salesforce/setup#step-2-check-where-salesforce-sends-requests).
3. [Assign the permission sets](/docs/Integrations/turbosign-for-salesforce/setup#step-3-give-people-access): **TurboSign Admin** to admins, **TurboSign User** to reps and to any automation user.
4. [Connect Salesforce in TurboDocx](/docs/Integrations/turbosign-for-salesforce/setup#step-4-connect-salesforce-in-turbodocx) so signed files are saved back to your records (version 1.1.0 or later). The connection needs the **api**, **refresh_token**, and **openid** scopes.
5. [Build a document setup](/docs/Integrations/turbosign-for-salesforce/setup#step-5-build-a-document-setup).
6. [Add the Send for Signature button](/docs/Integrations/turbosign-for-salesforce/setup#add-the-send-for-signature-button) to your Opportunity pages.

### Upgrade to a newer version

1. Find the newer version on the [releases page](/docs/Integrations/turbosign-for-salesforce/install-links#newer-versions).
2. Open its install link in the org that already has TurboSign for Salesforce. Salesforce shows it as an upgrade.
3. Select **Install for Admins Only**.
4. Click **Upgrade** (or **Install**).
5. Wait for the upgrade to finish, then click **Done**.

You install a newer version over the old one. You don't uninstall first. You can't install an older version over a newer one.

An upgrade puts the packaged URL back on the **TurboDocx API** Named Credential, so if you changed it, set it again. See [Step 2 of the setup guide](/docs/Integrations/turbosign-for-salesforce/setup#step-2-check-where-salesforce-sends-requests).

After an upgrade, open **TurboSign Setup**. If your templates load in **TurboDocx Template**, the connection still works.

### Uninstall

:::danger Uninstalling removes your TurboSign data
Uninstalling deletes everything the package added: your document setups, the signature status and log records, and the stored API key and Organization ID. Signed PDFs and audit trails already saved to your records are ordinary Salesforce files, so they stay. If you need the setups later, [retrieve them](/docs/Integrations/turbosign-for-salesforce/scripted-setup#start-from-the-builder) first.
:::

1. Open **Setup**.
2. In **Quick Find**, type `Installed Packages`, then click **Installed Packages**.
3. Click **Uninstall** next to **TurboSign for Salesforce**.
4. Read the list of what will be removed, check the box to confirm, and click **Uninstall**.

If Salesforce won't uninstall because some components are still in use, it lists them. Remove those references first, for example the **Send for Signature** button on page layouts or in the **Highlights Panel**, the **TurboSign Signatures** panel on Lightning pages, and any Flow that uses a TurboSign action. Then uninstall again.

## Deploy from source with the Salesforce CLI

Use this method if your team reviews the code and deploys it like your own. You get the same app as the install link, but upgrades and removal are up to you.

You need:

- [Git](https://git-scm.com) and the [Salesforce CLI](https://developer.salesforce.com/tools/salesforcecli) (`sf`).
- System Administrator access to the target org.

1. Get the source code:

   ```bash
   git clone https://github.com/TurboDocx/turbosign-salesforce.git
   cd turbosign-salesforce
   ```

   To deploy a specific release, check out its tag (for example `git checkout v1.1.0`). Use 1.1.0 or later: earlier tags do not include the example setup the tests need or saving signed files back. Releases are listed on the [releases page](https://github.com/TurboDocx/turbosign-salesforce/releases).

2. Log in to the org and give it an alias. These examples use `myorg`:

   ```bash
   # Production or Developer Edition
   sf org login web --alias myorg

   # Sandbox
   sf org login web --alias myorg --instance-url https://test.salesforce.com
   ```

3. Deploy the app. Deploy both folders: `force-app` holds the app, and `unpackaged` holds an example setup called **Example Agreement** that the app's Apex tests use. Without it, the tests fail.

   ```bash
   sf project deploy start --source-dir force-app --source-dir unpackaged --target-org myorg
   ```

4. Run the Apex tests. `RunLocalTests` runs every Apex test in your org, not only the app's:

   ```bash
   sf apex run test --test-level RunLocalTests --code-coverage \
     --result-format human --wait 30 --target-org myorg
   ```

:::note Deploying to production
Production deploys always run Apex tests, and every deploy must keep at least 75% code coverage across your org's Apex. Your org's own tests run too, so a failing test anywhere blocks the deploy. To check first without changing anything, validate the deploy:

```bash
sf project deploy validate --source-dir force-app --source-dir unpackaged \
  --test-level RunLocalTests --target-org myorg
```
:::

Then follow the same [steps as after an install](#right-after-installing). The **Example Agreement** setup shows up in the document list on Opportunities. To hide it from reps, open **TurboSign Setup**, pick **Example Agreement** in **Edit an existing configuration**, and click **Deactivate**. Each later deploy from source switches it back on, because the tests need it, so deactivate it again after each deploy.

To upgrade, pull the newer release and deploy again. Like a package upgrade, a deploy puts the source URL back on the **TurboDocx API** Named Credential, so [check it](/docs/Integrations/turbosign-for-salesforce/setup#step-2-check-where-salesforce-sends-requests) afterwards. To remove a source deploy, your developer deletes the components with a destructive deploy. There is no one-click uninstall.

## Configure from the command line

After the app is installed, you can do the setup from the Salesforce CLI instead of clicking through Setup: store the credentials, assign permission sets, check the connection, and deploy document setups as metadata. This is useful when you set up several orgs (sandboxes, staging, production) the same way. See [Scripted setup for admins](/docs/Integrations/turbosign-for-salesforce/scripted-setup).
