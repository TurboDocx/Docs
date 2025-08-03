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
* Your ConnectWise tenant endpoint URL (e.g., `https://yourcompany.connectwise.com`)
* Your ConnectWise Client ID
* 5 minutes of time and a steady Wi-Fi signal 🚀

:::tip Quick PSA Primer
ConnectWise PSA uses “API Members”. You’ll create a special user with read-only API access for TurboDocx.
:::

<br/>

## Step 1: Gather ConnectWise Credentials

You'll need the following information from your ConnectWise PSA instance:

* **Tenant Endpoint**: Your ConnectWise server URL (e.g., `https://yourcompany.connectwise.com`)
* **Company Name**: Your ConnectWise company identifier (Site or Company ID)
* **Public Key**: API public key
* **Private Key**: API private key
* **Client ID**: ConnectWise client application ID

<!-- Screenshot: ConnectWise Credentials Requirements -->

## Step 2: Create a Security Role and API Member

### A. Create a Read-Only Security Role

1. Log into the ConnectWise PSA dashboard
2. Navigate to **System** in the left navigation
3. Click on **Security Roles**
4. Press the **"+" (plus)** button in the top-left corner to create a new role
5. Set the **Role ID** to `TurboDocxIntegration`

<!-- Screenshot: Creating Security Role -->

6. Configure the following permissions with **Inquire Level** access:

#### Company
   * **Company Maintenance Contacts** – Inquire
   * **CRM Sales Activities** – Inquire
   * **Manage Attachments** – Inquire
   * **Notes** – Inquire
   * **Agreements** – Inquire
   * **Billing View Time** – Inquire

#### Finance
   * **Agreements** – Add/Inquire All
   * **Billing View Time** – Inquire All

#### Projects
   * **Project Headers** – Inquire
   * **Project Tickets** – Inquire

#### Sales
   * **All Permissions** – Inquire for everything

#### Service Desk
   * **Service Tickets** – Inquire
   * **Resource Scheduling** – Inquire
   * **Close Service Tickets** - Inquire

#### System
   * **Member Maintenance** – Inquire
   * **My Company** – Inquire

#### Time and Expense
   * **Time Entry** – Inquire

<!-- Screenshot: Security Role Permissions -->

7. Save the new role

:::tip Best Practice
The TurboDocx integration uses **read-only access** (Inquire level) to retrieve data from ConnectWise without making any modifications to your system.
:::

### B. Add API Member

1. Go to **System → Members**
2. Click the **API Members** tab
3. Click **"+" (Add New Member)**
4. Fill out the form:

   * **Member ID**: `TurboDocx`
   * **Role ID**: `TurboDocxIntegration`
   * **Level**: Corporate
   * **Name/Email**: `Your CW Admin`, `CWAdmin@yourcompany.com`
   * **Location & Business Unit**: Required fields

<!-- Screenshot: Adding API Member -->

### C. Generate API Keys

1. Scroll to **API Keys** at the bottom
2. Click **"+"**, name it `TurboDocx Key`
3. Save and securely store the **Public** and **Private** API keys

<!-- Screenshot: Generating API Keys -->

<br/>

## Step 3: Configure TurboDocx

1. Log into your TurboDocx dashboard
2. Go to **Settings → Organization Settings**
3. Find **ConnectWise PSA Integration** and click **Configure**

<!-- Screenshot: TurboDocx Settings -->

### Enter Required Information

* **Tenant Endpoint**: e.g. `https://yourcompany.connectwise.com` (or select from regional options)
* **Company Name**: Your ConnectWise Site or Company ID
* **Public Key**: The public API key generated in Step 2
* **Private Key**: The private API key generated in Step 2  
* **Client ID**: Your ConnectWise client application ID

<!-- Screenshot: ConnectWise Configuration Form -->

Click **Save Settings**, then **Test Connection** to validate access.

:::tip What Testing the Connection Does
It validates your credentials and pulls your ticket types, boards, statuses, configurations, and custom fields for use in documents.
:::

<br/>

## Step 4: Generate Documents from ConnectWise

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

### "Invalid Credentials" Error

* Check API keys, Company Name (Site/Company ID), and Tenant Endpoint
* Confirm role permissions and member status
* Verify Client ID is correct

### "Connection Failed" Error

* Click **Test Connection** to verify settings
* Ensure your PSA instance has data to access
* Check that your tenant endpoint URL is correct

<!-- Screenshot: Troubleshooting Connection Issues -->

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

## Appendix: Permission Requirements Explained

Understanding why TurboDocx requires specific Inquire permissions helps ensure proper setup and security compliance.

### Company Permissions

**Company Maintenance Contacts**
- **Inquire** - Without this, TurboDocx can't query what companies exist for document generation

**CRM/Sales Activities**
- **Inquire** - Without this, TurboDocx can't access sales activity data for inclusion in reports and proposals

**Manage Attachments**
- **Inquire** - Required to access existing attachments for document templating

**Notes**
- **Inquire** - Allows TurboDocx to review company and contact notes for inclusion in generated documents

### Finance Permissions

**Agreements**
- **Inquire** - Provides access to agreement data for generating contracts, SOWs, and billing documents

**Billing View Time**
- **Inquire** - Allows access to time tracking data for creating detailed billing reports and invoices

### Project Management Permissions

**Project Headers**
- **Inquire** - Enables retrieval of project information for generating project documentation and status reports

**Project Tickets**
- **Inquire** - Provides access to project-related tickets for comprehensive project reporting

### Sales Permissions

**All Permissions**
- **Inquire** - Comprehensive access to sales data enables generation of proposals, quotes, and sales reports

### Service Desk Permissions

**Service Tickets**
- **Inquire** - Essential for accessing ticket data to generate service reports and client summaries

**Resource Scheduling**
- **Inquire** - Provides access to scheduling data for resource allocation reports

**Close Service Tickets**
- **Inquire** - Allows access to completed ticket data for historical reporting

### System Permissions

**Member Maintenance**
- **Inquire** - Required to identify team members for assignment in generated documents

**My Company**
- **Inquire** - Provides access to company configuration and branding information for document customization

### Time and Expense Permissions

**Time Entry**
- **Inquire** - Enables access to time tracking data for billing reports and project summaries

:::note Security Note
All permissions are set at the **Inquire** level to ensure TurboDocx operates with read-only access, maintaining data security while enabling document generation functionality.
:::

---

*May your configs be documented, your projects delivered, and your SOWs write themselves — automatically.*
