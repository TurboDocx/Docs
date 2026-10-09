---
title: Set up TurboSign for Salesforce
slug: /Integrations/turbosign-for-salesforce/setup
sidebar_position: 2
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
- **A TurboDocx template** with a text token wherever someone signs or initials, for example `{resident_sig}` and `{resident_initial}`.
- **System Administrator** access to your Salesforce org.
- **A supported Salesforce edition**, such as Enterprise, Unlimited, Performance, or Developer Edition. See [Which Salesforce orgs can use it](/docs/Integrations/turbosign-for-salesforce#which-salesforce-orgs-can-use-it).
- **The TurboSign for Salesforce package installed** in your org, from the install link your TurboDocx account team sends you, or deployed from source by a developer. See [How it gets installed](/docs/Integrations/turbosign-for-salesforce#how-it-gets-installed).

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

:::caution Use these exact names
The package looks for parameters named `ApiKey` and `OrgId`. If either is missing or spelled differently, every send fails with **Field TurboDocx_API.ApiKey does not exist** (or `OrgId`).
:::

To change the key later, edit the `ApiKey` value the same way. Nothing else needs to change.

## Step 2: Check where Salesforce sends requests

The **TurboDocx API** Named Credential holds the TurboDocx address. It is set to `https://api.turbodocx.com` when you install, so usually you only need to confirm it.

1. On the same page, under **Related Named Credentials**, click **TurboDocx API**.
2. Click **Edit**.

   ![Named Credential detail page with the Edit button highlighted](/img/turbosign-salesforce/10-named-credential-edit.png)

3. Check that **URL** is `https://api.turbodocx.com` (or the address your TurboDocx team gave you), then click **Save** or **Cancel**.

   ![Edit Named Credential dialog with the URL field highlighted](/img/turbosign-salesforce/11-named-credential-url.png)

## Step 3: Give people access

The package has two permission sets. Both include access to the TurboDocx credential.

| Permission set | Assign it to |
|---|---|
| **TurboSign Admin** | Admins who build document setups |
| **TurboSign User** | Reps who send documents |

1. In **Setup**, type `Permission Sets` in **Quick Find** and click **Permission Sets**.
2. The list can be long. Click the letter **T** above the list, then click **TurboSign User**, then **Manage Assignments**.

   ![TurboSign User permission set with Manage Assignments highlighted](/img/turbosign-salesforce/12-manage-assignments.png)

3. Click **Add Assignment**, select your reps, and click **Assign**.

   ![Current Assignments page with Add Assignment highlighted](/img/turbosign-salesforce/13-add-assignment.png)

4. Repeat for **TurboSign Admin** with your admins.

:::note Automations need access too
Requests run as whoever triggers them. If a Flow, a data load, or an integration user sends, reminds, or voids envelopes, assign **TurboSign User** to that user as well.
:::

## Step 4: Connect Salesforce in TurboDocx

TurboDocx saves the signed PDF back to Salesforce through the Salesforce connection in your TurboDocx settings. If you already use the TurboDocx Salesforce integration, skip this step.

Follow [Salesforce Integration, Steps 1 to 3](/docs/Integrations/SalesForce) to create the connected app and connect it in TurboDocx.

## Step 5: Build a document setup

A **document setup** tells TurboSign which template to use, which Salesforce fields fill it, who signs, and where.

### Start a new setup

1. Open the App Launcher (the nine dots, top left), search for **TurboSign Setup**, and open it.
2. Click **New configuration**.

   ![TurboSign Configuration Builder with New configuration highlighted](/img/turbosign-salesforce/21-new-configuration.png)

3. In **Config API Name**, type a name with letters, numbers, and underscores only, for example `Residential_Lease`. Add a friendly **Label**, such as `Residential Lease`. Reps pick setups by this label.

   ![Config API Name field highlighted](/img/turbosign-salesforce/22-config-name.png)

4. Leave **Source Object** as **Opportunity**.
5. Open **TurboDocx Template** and pick your template. The builder lists every data token in the template under **Template Tokens**.

   ![Template list with a lease template highlighted](/img/turbosign-salesforce/23-pick-template.png)

### Fill the data tokens

1. Click **Suggest fields**. The builder guesses a Salesforce field for each token.

   ![Template Tokens list with Suggest fields highlighted](/img/turbosign-salesforce/24-suggest-fields.png)

2. Check every suggestion. Suggestions are a starting point, and they are often wrong. To change one, pick the relationship in the first box (for example a related Contact) and the field in the second box.

   ![Source Field list with Full Name highlighted](/img/turbosign-salesforce/25-pick-source-field.png)

3. For a value that never comes from a field, leave the field empty and type it in **Default**, for example `1st`.
4. Use **Required** to decide what happens when a value is empty:
   - **Checked:** the send stops and tells the rep which value is missing. Use this for values the document cannot go out without, such as rent.
   - **Unchecked:** the spot is left blank in the document. Use this for values that only apply sometimes, such as a second resident.

   ![A token row with the Required checkbox highlighted](/img/turbosign-salesforce/26-required-checkbox.png)

### Add the signers

Each row under **Recipients** is one signer. They sign in the order shown.

1. For the first signer, pick the field that holds their **Signer name** and **Signer email**, for example the primary contact's full name.

   ![Signer name list with a Full Name field highlighted](/img/turbosign-salesforce/27-signer-name-field.png)

2. To add someone who is not on the record, such as your leasing office, click **Add recipient**.

   ![Add recipient button highlighted](/img/turbosign-salesforce/28-add-recipient.png)

3. Check **Fixed value** on that row and type their name and email.

   ![Recipient row with the Fixed value checkbox highlighted](/img/turbosign-salesforce/29-fixed-signer.png)

4. To change the order, use the up and down arrows next to the number, or drag the row.

   ![Move signer up button highlighted](/img/turbosign-salesforce/30-reorder-signers.png)

5. Uncheck **Required** on a signer who only signs sometimes. When their email is empty on the record, they are skipped.

### Place the signing spots

1. Click **Add token**.

   ![Add token button highlighted](/img/turbosign-salesforce/31-add-token.png)

2. Type the token exactly as it appears in your template, for example `{resident_sig}`.
3. In **Kind**, pick what goes there: **Signature**, **Initial**, **Date**, **Text**, and so on.

   ![Kind list with Signature highlighted](/img/turbosign-salesforce/32-token-kind-signature.png)

4. In **Recipient**, pick who fills it in.

   ![Recipient list with the first signer highlighted](/img/turbosign-salesforce/33-token-recipient.png)

5. Repeat for every signing spot in the template. **Signature** and **Initial** spots are always required. Other kinds, such as **Text**, can be optional.

:::tip Signature lines that don't apply
If your template has signature lines for roles you don't use (a guarantor, for example), add those tokens as **Data value** with nothing in them and **Required** unchecked. The line is left blank in the document instead of showing the raw token.
:::

6. Click **Check anchors against template**. Every token should say **found in the document**. Fix any that don't before you save.

   ![Anchor check results with a found-in-the-document line highlighted](/img/turbosign-salesforce/34-anchor-check-result.png)

### Name the document

Under **Document Name**, build the name each document gets, for example `Lease - Jane Resident - October 7, 2026`:

1. Click **Clear** to remove the template name.
2. Click **Text** and type `Lease - ` (with the spaces).
3. Click **Insert field** and pick the resident's name field.
4. Click **Text** and type ` - `.
5. Click **Date**.

The **Preview** line shows the result. The **Separator** menu adds a single character with no spaces, so use **Text** when you want spacing.

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

## Step 6: Put the Send button and status panel on the page

1. **Send for Signature button:** in **Setup**, open **Object Manager**, then **Opportunity**, then **Page Layouts**. Open your layout, select **Mobile & Lightning Actions** in the palette at the top, drag **Send for Signature** into the **Salesforce Mobile and Lightning Experience Actions** section, and click **Save**. If that section says it uses predefined actions, click the **override the predefined actions** link inside it first.
2. **TurboSign Signatures panel:** open any Opportunity, click the gear icon, then **Edit Page**. Drag the **TurboSign Signatures** component onto the page, click **Save**, and activate the page if Salesforce asks.

   ![Gear menu with Edit Page highlighted](/img/turbosign-salesforce/47-edit-page.png)

You're done. Next, [send your first document](/docs/Integrations/turbosign-for-salesforce/send-and-sign).
