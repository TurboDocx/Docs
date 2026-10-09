---
title: Set up TurboSign for Salesforce
slug: /Integrations/turbosign-for-salesforce/setup
sidebar_position: 4
description: Step-by-step admin guide to connect TurboSign for Salesforce to TurboDocx, give your team access, and build your first document setup for e-signature.
keywords:
  - turbosign salesforce setup
  - salesforce external credential api key
  - salesforce named credential turbodocx
  - salesforce e-signature configuration
  - turbosign setup tab
  - salesforce permission set e-signature
  - salesforce signature anchors
---

# Set up TurboSign for Salesforce

This guide walks a Salesforce admin through the whole setup, from storing your TurboDocx credentials to saving your first document setup. It takes about 20 minutes. When you finish, your reps can send documents for signature from an Opportunity.

:::tip Prefer the command line?
Every credential and access step below can also be scripted. See [Scripted setup for admins](/docs/Integrations/turbosign-for-salesforce/scripted-setup).
:::

## Before you begin

Have these ready:

- **Your TurboDocx API key and Organization ID.** In TurboDocx, open **Settings**, then **API keys** for the key and **Features and integrations** for the Organization ID. See [Getting your credentials](/docs/TurboSign/API-Signatures#getting-your-credentials).
- **A TurboDocx template** with a text token wherever someone signs or dates, for example `{sig}` and `{date}`.
- **System Administrator** access to your Salesforce org.
- **A supported Salesforce edition**, such as Enterprise, Unlimited, Performance, or Developer Edition. See [Which Salesforce orgs can use it](/docs/Integrations/turbosign-for-salesforce#which-salesforce-orgs-can-use-it).
- **The TurboSign for Salesforce package installed** in your org. See [Install TurboSign for Salesforce](/docs/Integrations/turbosign-for-salesforce/install).

## Step 1: Store your API key and Organization ID

The package includes an External Credential called **TurboDocx API**. You add your key and Organization ID to it. Salesforce encrypts both, and nobody can view them again after you save.

1. Open **Setup** (the gear icon, top right, then **Setup**).
2. In the **Quick Find** box on the left, type `Named Credentials`, then click **Named Credentials**.

   ![Setup Quick Find with Named Credentials highlighted](/img/turbosign-salesforce/01-setup-named-credentials.png)

3. Click the **External Credentials** tab.

   ![Named Credentials page with the External Credentials tab highlighted](/img/turbosign-salesforce/02-external-credentials-tab.png)

4. Click **TurboDocx API**.

   ![External Credentials list with TurboDocx API highlighted](/img/turbosign-salesforce/03-turbodocx-api-credential.png)

5. In the **Principals** section, click the arrow at the end of the **TurboDocxPrincipal** row.

   ![Principals list with the row actions arrow highlighted](/img/turbosign-salesforce/04-principal-row-actions.png)

6. Click **Edit**.

   ![Row actions menu with Edit highlighted](/img/turbosign-salesforce/05-principal-edit.png)

7. Under **Authentication Parameters**, click **Add**.

   ![Edit Principal dialog with the Add button highlighted](/img/turbosign-salesforce/06-add-authentication-parameter.png)

8. In **Name**, type `ApiKey` exactly as shown (the capital letters matter). In **Value**, paste your TurboDocx API key.
9. Click **Add** again. In **Name**, type `OrgId`. In **Value**, paste your Organization ID.

   ![A parameter Name field highlighted in the Edit Principal dialog](/img/turbosign-salesforce/07-parameter-name-apikey.png)

10. Click **Save**.

    ![Edit Principal dialog with the Save button highlighted](/img/turbosign-salesforce/08-principal-save.png)

After you save, the **TurboDocxPrincipal** row shows **2** under **Authentication Parameters**. An **Authentication Status** of **Unknown** is normal for this kind of credential. Salesforce doesn't test it until the first request. The template list in [Step 5](#step-5-build-a-document-setup) is your first real check.

![TurboDocxPrincipal row with Authentication Parameters 2 and Authentication Status Unknown highlighted](/img/turbosign-salesforce/09-principal-saved.png)

:::caution Use these exact names
The package looks for parameters named `ApiKey` and `OrgId`. If either is missing or spelled differently, every send fails with **Field TurboDocx_API.ApiKey does not exist** (or `OrgId`).
:::

To change the key later, edit the `ApiKey` value the same way. Nothing else needs to change.

## Step 2: Check where Salesforce sends requests

The **TurboDocx API** Named Credential holds the TurboDocx address. It is set to `https://api.turbodocx.com` when you install, so usually you only need to look at it.

1. On the same External Credential page, scroll to **Related Named Credentials**.
2. Read the **URL** in the **TurboDocx API** row. It should be `https://api.turbodocx.com`, or the address your TurboDocx team gave you. If it is, go on to Step 3.

![Related Named Credentials list with the TurboDocx API URL highlighted](/img/turbosign-salesforce/09b-related-named-credential-url.png)

To change the URL:

1. In the **Related Named Credentials** row, click **TurboDocx API**.
2. Click **Edit**.

   ![Named Credential detail page with the Edit button highlighted](/img/turbosign-salesforce/10-named-credential-edit.png)

3. Change **URL**.

   ![Edit Named Credential dialog with the URL field highlighted](/img/turbosign-salesforce/11-named-credential-url.png)

4. Click **Save**.

:::caution Re-check the URL after every upgrade
Installing a newer version of the package, or deploying it again from source, puts the packaged URL back on **TurboDocx API**. If you changed it, check it again after each upgrade or deploy.
:::

## Step 3: Give people access

The package has two permission sets. Both include access to the TurboDocx credential.

| Permission set | Assign it to |
|---|---|
| **TurboSign Admin** | Admins who build document setups |
| **TurboSign User** | Reps who send documents |

1. In **Setup**, type `Permission Sets` in **Quick Find** and click **Permission Sets**.
2. The list can be long. Click the letter **T** above the list.
3. Click **TurboSign User**.
4. Click **Manage Assignments**.

   ![TurboSign User permission set with Manage Assignments highlighted](/img/turbosign-salesforce/12-manage-assignments.png)

5. Click **Add Assignment**.

   ![Current Assignments page with Add Assignment highlighted](/img/turbosign-salesforce/13-add-assignment.png)

6. Select your reps, then click **Assign**.
7. Repeat for **TurboSign Admin** with your admins.

:::note Automations need access too
Requests run as whoever triggers them. If a Flow, a data load, or an integration user sends, reminds, or voids envelopes, assign **TurboSign User** to that user as well.
:::

## Step 4: Connect Salesforce in TurboDocx

TurboDocx saves the signed PDF back to Salesforce through the Salesforce connection in your TurboDocx settings. If you don't have that connection yet, follow [Salesforce Integration, Steps 1 to 3](/docs/Integrations/SalesForce) to create the External Client App in Salesforce and connect it in TurboDocx. If you already use the TurboDocx Salesforce integration, check that it meets everything below.

- **Connect the same Salesforce org the package is installed in.** The package sends its Salesforce org ID with each document. When the document is signed, TurboDocx saves the files through the connection to that same org. Only active connections of active TurboDocx users count. If no connection matches the org, nothing is saved, and TurboDocx records the failure. Saving signed files back needs TurboSign for Salesforce 1.1.0 or later, which sends the org ID. Earlier versions still send and sign, but the signed files are not saved back.
- **Connect with the right Salesforce user.** That user must be able to create files and edit the records you send from, including the field you pick under **On Completion**. A dedicated integration user works best, so the connection doesn't break when a person leaves or changes their password.
- **You can connect more than one Salesforce org.** For example, connect both a sandbox and production. Each send uses the connection to the org it was sent from.
- **Check the app's scopes and refresh token policy.** The connection needs the **api** scope, the **refresh_token** (offline access) scope, and the **openid** scope, because TurboDocx checks which Salesforce org each connection belongs to. It also needs a refresh token policy of **Refresh token is valid until revoked**. See [Configure API Settings](/docs/Integrations/SalesForce#configure-api-settings) and [Edit Policies](/docs/Integrations/SalesForce#edit-policies). If you added **openid** to an existing app, reconnect Salesforce in TurboDocx.
- **Reconnecting is safe.** Your current connection keeps working until the new one succeeds.

:::note Sandboxes
Saving signed files back to a sandbox works. Connect that sandbox in TurboDocx: in the Salesforce settings, choose **Sandbox** as the environment, so the connection signs in at `test.salesforce.com`. If your sandbox uses a My Domain login, click **Use Custom Domain** on that page and enter it.
:::

## Step 5: Build a document setup

A **document setup** tells TurboSign which template to use, which Salesforce fields fill it, who signs, and where. The steps below build a **Service Agreement** sent from an Opportunity.

### Start a new setup

1. Open the App Launcher (the nine dots, top left), search for **TurboSign Setup**, and open it. The builder opens with a blank form.

   If the form already holds another setup, click **New configuration** to clear it.

   ![TurboSign Configuration Builder with New configuration highlighted](/img/turbosign-salesforce/21-new-configuration.png)

2. Type the **Label** first, for example `Service Agreement`. Reps pick setups by this label.
3. Check **Config API Name**. It fills in from the Label, for example `Service_Agreement`. You can change it before you save, using letters, numbers, and underscores only.

   ![Config API Name field highlighted](/img/turbosign-salesforce/22-config-name.png)

4. Leave **Source Object** as **Opportunity**.
5. Open **TurboDocx Template** and pick your template. The builder lists every token in the template under **Template Tokens**, including signing tokens such as `{sig}`.

   ![Template list with a template highlighted](/img/turbosign-salesforce/23-pick-template.png)

### Name the document

Under **Document Name**, build the name each document gets, for example `Service Agreement - Acme Corp - October 9, 2026`:

1. Click **Clear** to remove the template name.
2. Click **Text** and type `Service Agreement - ` (with the spaces).
3. Click **Insert field** and pick the account name field.
4. Click **Text** and type ` - `.
5. Click **Date**.

The **Preview** line shows the result. The **Separator** menu adds a single character with no spaces, so use **Text** when you want spacing.

**Date Format** is optional. It sets how dates look in the document and in its name, using a pattern such as `MMMM d, yyyy` (for `October 9, 2026`). Leave it blank to use the default: dates from the record follow the sending user's Salesforce locale, and the date in the name looks like `October 9, 2026`.

### Fill the data tokens

1. Click **Suggest fields**. The builder guesses a Salesforce field for each data token.

   ![Template Tokens list with Suggest fields highlighted](/img/turbosign-salesforce/24-suggest-fields.png)

2. Check every suggestion. Suggestions are a starting point, and they are often wrong. To change one, pick the relationship in the first box (for example **Account**) and the field in the second box (for example **Account Name**).

   ![Source Field list with a field highlighted](/img/turbosign-salesforce/25-pick-source-field.png)

3. For a value that never comes from a field, leave the field empty and type it in **Default**.
4. Use **Required** to decide what happens when a value is empty:
   - **Checked:** the send stops and tells the rep which value is missing. Use this for values the document cannot go out without, such as the client name.
   - **Unchecked:** the spot is left blank in the document. Use this for values that only apply sometimes.

   ![A token row with the Required checkbox highlighted](/img/turbosign-salesforce/26-required-checkbox.png)

Leave the signing tokens, such as `{sig}` and `{date}`, for [Place the signing spots](#place-the-signing-spots).

### Add the signers

Each row under **Recipients** is one signer. They sign in the order shown.

1. For the first signer, pick the field that holds their **Signer name** and **Signer email**, for example the Opportunity owner's name and email.

   ![Signer name list with a name field highlighted](/img/turbosign-salesforce/27-signer-name-field.png)

2. To add someone who is not on the record, such as a person on your team who countersigns, click **Add recipient**.

   ![Add recipient button highlighted](/img/turbosign-salesforce/28-add-recipient.png)

3. Check **Fixed value** on that row and type their name and email.

   ![Recipient row with the Fixed value checkbox highlighted](/img/turbosign-salesforce/29-fixed-signer.png)

4. To change the order, use the up and down arrows next to the number, or drag the row.

   ![Move signer up button highlighted](/img/turbosign-salesforce/30-reorder-signers.png)

5. Uncheck **Required** on a signer who only signs sometimes. When their email is empty on the record, they are skipped.

### Place the signing spots

The builder already lists every token in the template, including signing tokens such as `{sig}` and `{date}`. It adds each one as a **Data value** row with **Required** checked. Turn each signing token into a signing spot:

1. On the signing token's row, open **Kind**.

   ![Kind menu open on an existing token row](/img/turbosign-salesforce/31-add-token.png)

2. Pick what goes there: **Signature**, **Initial**, **Date**, **Text**, and so on.

   ![Kind list with Signature highlighted](/img/turbosign-salesforce/32-token-kind-signature.png)

3. In **Recipient**, pick who fills it in.

   ![Recipient list with the first signer highlighted](/img/turbosign-salesforce/33-token-recipient.png)

4. Set **Required**. **Signature** and **Initial** spots are always required. Other kinds, such as **Date** or **Text**, can be optional.
5. Repeat for every signing token.

If a signing token isn't in the list, click **Add token**, type it exactly as it appears in your template, for example `{sig}`, and then set its **Kind** and **Recipient**. Use **Add token** only for a token the builder didn't find.

:::tip Signature lines that don't apply
If your template has signature lines for roles you don't use (a guarantor, for example), leave those tokens as **Data value** with nothing in them and uncheck **Required**. The line is left blank in the document instead of showing the raw token.
:::

When every signing token is set, click **Check anchors against template**. Every token should say **found in the document**. Fix any that don't before you save.

![Anchor check results with a found-in-the-document line highlighted](/img/turbosign-salesforce/34-anchor-check-result.png)

### Move the record forward when everyone signs (optional)

1. Under **On Completion**, open **Set field** and pick the field to change, for example **Stage**.

   ![Set field list with Stage highlighted](/img/turbosign-salesforce/35-on-completion-field.png)

2. Pick the value in **To value**, for example **Closed Won**.

   ![To value list with Closed Won highlighted](/img/turbosign-salesforce/36-on-completion-value.png)

### Test and save

1. Under **Test with a record**, search for a real record and pick it.
2. Click **Preview values** to see what every token resolves to on that record.

   ![Preview values button highlighted](/img/turbosign-salesforce/37-test-with-record.png)

   ![Preview table with resolved values](/img/turbosign-salesforce/38-preview-values.png)

3. Click **Save Configuration**. A message confirms that the setup is live.

   ![Save Configuration button highlighted](/img/turbosign-salesforce/39-save-configuration.png)

### Change an existing setup

1. Open **TurboSign Setup**.
2. Pick the setup in **Edit an existing configuration**. The form loads it.
3. Make your changes.
4. Click **Save Configuration**.

When you remove a token or a signer and save, the builder switches that row off instead of deleting it. Sends ignore it from then on.

To start a new setup from an existing one, load it and click **Duplicate**. Type a **New API name for the copy**, then click **Create copy**.

To stop reps from using a setup, load it and click **Deactivate**, then click **Deactivate** again to confirm. The setup disappears from the document list reps see and from **Edit an existing configuration**. Its records stay in your org, switched off. To bring it back, an admin redeploys its records with **Active** set to true (see [Scripted setup](/docs/Integrations/turbosign-for-salesforce/scripted-setup#deploy-document-setups-as-metadata)).

## Step 6: Put the Send button and status panel on the page

### Add the Send for Signature button

Opportunity record pages show their buttons in one of two ways. To find out which one yours uses:

1. Open any Opportunity.
2. Click the gear icon, then **Edit Page**.
3. Click the **Highlights Panel** at the top of the page.

If the properties pane on the right lists actions with an **Add Action** button, the page uses **Dynamic Actions**. If it offers **Upgrade Now** instead, the page still takes its buttons from the page layout, so use **page layout actions**.

![Lightning App Builder with the Highlights Panel selected and the Upgrade Now button highlighted](/img/turbosign-salesforce/48-highlights-panel-actions.png)

**If the page uses Dynamic Actions**, stay in the Lightning App Builder:

1. With the **Highlights Panel** selected, click **Add Action**.
2. Search for `Send for Signature` and select it.
3. Click **Done**.
4. Click **Save**.
5. If Salesforce asks, click **Activate** and assign the page.

![Add Action dialog with Send for Signature highlighted](/img/turbosign-salesforce/49-add-action-send-for-signature.png)

**If the page uses page layout actions:**

1. In **Setup**, open **Object Manager**.
2. Click **Opportunity**.
3. Click **Page Layouts**.
4. Click the layout your reps use.
5. In the palette at the top, click **Mobile & Lightning Actions**.
6. If the **Salesforce Mobile and Lightning Experience Actions** section says it uses predefined actions, click the **override the predefined actions** link inside it.
7. Drag **Send for Signature** into the **Salesforce Mobile and Lightning Experience Actions** section.
8. Click **Save**.

Repeat for every page or layout your reps use.

### Add the TurboSign Signatures panel (optional)

The panel shows each sent document's status on the record and lets reps refresh, remind, or void. Sending works without it.

1. Open any Opportunity.
2. Click the gear icon, then **Edit Page**.

   ![Gear menu with Edit Page highlighted](/img/turbosign-salesforce/47-edit-page.png)

3. Drag the **TurboSign Signatures** component from the **Components** list onto the page.
4. Click **Save**.
5. If Salesforce asks, click **Activate** and assign the page.

You're done. Next, [send your first document](/docs/Integrations/turbosign-for-salesforce/send-and-sign).
