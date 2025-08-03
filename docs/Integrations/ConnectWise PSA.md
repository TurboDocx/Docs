---

title: ConnectWise PSA Integration
sidebar\_position: 6
description: Automatically generate proposals, contracts, service reports, and presentations from ConnectWise PSA data. Turn companies, contacts, and opportunities into professional documents with AI-powered automation.
keywords:

- connectwise psa document automation
- connectwise to proposal
- connectwise contract generation
- connectwise service report automation
- connectwise ai presentation generation
- connectwise ai powerpoint generation
- psa document automation
- connectwise integration documents
- automated connectwise proposals
- connectwise data to document
- psa quote automation
- connectwise opportunity to proposal
- connectwise company documents
- automated psa documents
- connectwise ai document generation
- psa proposal automation
- connectwise contract automation
- connectwise service ticket reports
- connectwise project documentation
- connectwise sales automation
- psa integration documents
- connectwise presentation automation
- connectwise document generation
- connectwise ai reports
- psa ai automation
- professional service automation

---

# Automate Documents from ConnectWise PSA Data

TurboDocx integrates directly with your ConnectWise PSA environment to eliminate manual copy-paste and transform your real data into documents, proposals, and presentations. Pull in data from companies, tickets, configurations, and more — and generate polished deliverables instantly.

## What You Can Create

* **📄 Statements of Work (SOWs)**: Pull in configurations, timelines, and tasks from project boards
* **🗌 Ticket Summaries**: Turn tickets into polished summaries for clients
* **💼 Client Reports**: Generate reports using real company data and services
* **🧠 Technical Docs**: Document configurations, assets, or custom fields from ConnectWise
* **🚰 Implementation Guides**: Auto-generate guides from projects and recurring service tickets
* **📊 Executive Briefs**: Create management-facing updates using ConnectWise reporting fields

<br/>

## Before You Begin

:::tip Not a PSA Admin?
Don’t worry — this guide walks you through step-by-step. You don’t have to be a PSA wizard. If you can follow a recipe, you can follow this. 🍻
:::

You'll need:

* Admin access to your ConnectWise PSA account
* API Member credentials (public + private key)
* A ConnectWise API URL (e.g., `https://yourcompany.connectwise.com`)
* 5 minutes of time and a steady Wi-Fi signal 🚀

:::tip Quick PSA Primer
ConnectWise PSA uses “API Members”. You’ll create a special user with read-only API access for TurboDocx.
:::

<br/>

## Step 1: Create a Security Role and API Member

### A. Create a Read-Only Security Role

1. Log into the ConnectWise PSA dashboard
2. Navigate to **System → Security Roles**
3. Click **"Add"**, enter `TurboDocx API` for Role ID, and click **Save**
4. Expand and configure the following modules with **Inquire Level = All**:

   * Companies → Company Maintenance
   * Companies → Configurations
   * Contacts
   * Opportunities
   * Service Desk → Service Tickets
   * Projects
   * Finance → Agreements
   * Finance → Invoices
   * Time & Expense → Time Entry
   * System → Table Setup *(for schema and metadata)*

:::tip Best Practice
Create a dedicated security role for TurboDocx with **read-only access** to the following modules:

* Companies
* Contacts
* Opportunities
* Tickets
* Agreements
* Projects
* Configurations
* Invoices
* Time Entries
* System (for schema discovery only)
  :::

### B. Add API Member

1. Go to **System → Members**
2. Click the **API Members** tab
3. Click **"+" (Add New Member)**
4. Fill out the form:

   * **Member ID**: `TurboDocx`
   * **Role ID**: `TurboDocx API`
   * **Level**: Corporate
   * **Name/Email**: `Your CW Admin`, `CWAdmin@yourcompany.com`
   * **Location & Business Unit**: Required fields

### C. Generate API Keys

1. Scroll to **API Keys** at the bottom
2. Click **“+”**, name it `TurboDocx Key`
3. Save and securely store the **Public** and **Private** API keys

<br/>

## Step 2: Configure TurboDocx

1. Log into your TurboDocx dashboard
2. Go to **Settings → Organization Settings**
3. Find **ConnectWise PSA Integration** and click **Configure**

### Enter Required Info

* **API URL**: e.g. `https://yourcompany.connectwisedev.com`
* **Company ID**
* **Public Key**
* **Private Key**

Click **Save Configuration**, then **Refresh Fields** to sync schemas and validate access.

:::tip What “Refresh Fields” Does
It pulls your ticket types, boards, statuses, configurations, and custom fields for use in documents.
:::

<br/>

## Step 3: Generate Documents from ConnectWise

1. Open the **Document Generator** in TurboDocx
2. Click **New Document**
3. Choose a template
4. Under **Change Source**, select **ConnectWise PSA**
5. Choose the object type: Tickets, Projects, Companies, etc.
6. Select records you want to use

### Example Prompts

* “Create an SOW for this project with timelines, configurations, and tasks.”
* “Generate a config documentation PDF for selected assets.”
* “Summarize all open tickets for this company.”

<br/>

## Troubleshooting

### “Invalid Credentials” Error

* Check API keys, Company ID, and URL
* Confirm role permissions and member status

### “No Records Found”

* Click **Refresh Fields**
* Ensure your PSA instance has data to access

### “Permission Denied”

* Review the API member’s security role permissions

:::tip Still Stuck?
Take a screenshot, note the step, and send it to our support team.
:::

<br/>

## Security and Privacy

* 🔐 Read-only access only
* 📦 Encrypted data transfers
* 🔒 API keys are not stored permanently
* 🔍 Access can be revoked at any time in ConnectWise

<br/>

## Final Thoughts

You're ready to:

* Generate project documents with no formatting headaches
* Turn tickets and configs into polished deliverables
* Automate technical documentation and reporting

:::tip Last Tip
Clean ConnectWise data = clean, impressive documents. Keep your CRM tidy!
:::

---

*May your configs be documented, your projects delivered, and your SOWs write themselves — automatically.*
