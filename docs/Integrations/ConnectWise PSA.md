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
* Your ConnectWise tenant endpoint URL (e.g., `https://yourcompany.connectwise.com`)
* 5 minutes of time and a steady Wi-Fi signal 🚀

After completing the setup, you'll have:
* **Tenant Endpoint**: Your ConnectWise server URL (e.g., `https://yourcompany.connectwise.com`)
* **Company Name**: Your ConnectWise company identifier (Site or Company ID)
* **Public Key**: API public key
* **Private Key**: API private key
* **Client ID**: ConnectWise client application ID (you can get this from [https://developer.connectwise.com/ClientID](https://developer.connectwise.com/ClientID))

:::tip Quick PSA Primer
ConnectWise PSA uses "API Members". You'll create a special user with read-only API access for TurboDocx.
:::

<br/>

## Step 1: Create a Security Role and API Member

### A. Create a Read-Only Security Role

1. Log into the ConnectWise PSA dashboard
2. Navigate to **System** in the left navigation
3. Click on **Security Roles**

![Creating Security Role](/img/connectwise_integration/SecurityRoleCreation.png)

4. Press the **"+" (plus)** button in the top-left corner to create a new role
5. Set the **Role ID** to `TurboDocxIntegration`
6. Configure the following permissions with **Inquire Level** access:

#### Company
   * **Company Maintenance** – Inquire All
   * **Company/Contact Group Maintenance** – Inquire All
   * **Configurations** – Inquire All
   * **Contacts** – Inquire All
   * **CRM/Sales Activities** – Inquire All
   * **Manage Attachments** – Inquire All
   * **Notes** – Inquire All
   * **Reports** – Inquire All
   * **Team Members** – Inquire All

#### Finance
   * **Agreement Invoicing** – Inquire All
   * **Agreement Sales** – Inquire All
   * **Agreements** – Inquire All
   * **Billing View Time** – Inquire All
   * **Invoicing** – Inquire All
   * **Reports** – Inquire All

#### Projects
   * **All Permissions** – Inquire All

#### Sales
   * **Closed Opportunity** – Inquire All
   * **Opportunity** – Inquire All
   * **Sales Orders** – Inquire All
   * **Sales Orders Finance** – Inquire All

#### Service Desk
   * **Change Approvals** – Inquire All
   * **Close Service Tickets** – Inquire All
   * **Merge Tickets** – Inquire All
   * **Reports** – Inquire All
   * **Resource Scheduling** – Inquire All
   * **Service Tickets** – Inquire All
   * **Service Tickets – Finance** – Inquire All

#### System
   * **Member Maintenance** – Inquire All
   * **My Company** – Inquire All

#### Time and Expense
   * **Time Entry** – Inquire

<!-- Screenshot: Security Role Permissions -->

7. Save the new role

:::tip Best Practice
The TurboDocx integration uses **read-only access** (Inquire level) to retrieve data from ConnectWise without making any modifications to your system.
:::

### B. Add API Member


1. Go to **System → Members**
![Navigate to ConnectWise Members](/img/connectwise_integration/NavigateToCWMembers.png)
2. Click the **API Members** tab
![Click API Members Tab](/img/connectwise_integration/ClickAPIMembers.png)

3. Click **"+" (Add New Member)**
![Click Plus to Add New API Member](/img/connectwise_integration/ClickPlusOnAPIMembers.png)

4. Fill out the form:
![Fill Out API Member Form](/img/connectwise_integration/FillOutAPIMember.png)

   * **Member ID**: `TurboDocx`
   * **Role ID**: `TurboDocxIntegration`
   * **Level**: Corporate
   * **Name/Email**: `Your CW Admin`, `CWAdmin@yourcompany.com`
   * **Location & Business Unit**: Required fields


### C. Generate API Keys

1. Scroll to **API Keys** at the bottom
![Click API Keys Section](/img/connectwise_integration/ClickAPIKeys.png)

2. Click **"+"**, name it `TurboDocx Key`
3. Save and securely store the **Public** and **Private** API keys


<br/>

## Step 2: Configure TurboDocx

1. Log into your TurboDocx dashboard
2. Go to **Settings → Organization Settings**
3. Find **ConnectWise PSA Integration** and click **Configure**

![TurboDocx ConnectWise Configuration Fields](/img/connectwise_integration/TurboDocxFields.png)

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

## Step 3: Generate Documents from ConnectWise

1. Open the **Document Generator** in TurboDocx
2. Click **New Document**
3. Choose a template
4. Under **Change Source**, select **ConnectWise PSA**

![Click on ConnectWise PSA Agent in App Library](/img/connectwise_integration/ClickonConnectWisePSAAgentInAppLibrary.png)

5. Choose the object type: Tickets, Projects, Companies, etc.
6. Select records you want to use

![Access to Records in TurboDocx](/img/connectwise_integration/AccessToRecordsCWInTurbo.png)

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

**Company Maintenance**
- **Inquire All** - Without this, TurboDocx can't query what companies exist for document generation

**Company/Contact Group Maintenance**
- **Inquire All** - Provides access to company and contact grouping data for organizational document generation

**Configurations**
- **Inquire All** - Enables access to company configuration data for technical documentation and reports

**Contacts**
- **Inquire All** - Essential for retrieving contact data to populate documents with recipient information

**CRM/Sales Activities**
- **Inquire All** - Without this, TurboDocx can't access sales activity data for inclusion in reports and proposals

**Manage Attachments**
- **Inquire All** - Required to access existing attachments for document templating

**Notes**
- **Inquire All** - Allows TurboDocx to review company and contact notes for inclusion in generated documents

**Reports**
- **Inquire All** - Provides access to existing report data for comprehensive document generation

**Team Members**
- **Inquire All** - Required to identify team members for assignment and attribution in generated documents

### Finance Permissions

**Agreement Invoicing**
- **Inquire All** - Provides access to agreement invoicing data for generating billing documents and financial reports

**Agreement Sales**
- **Inquire All** - Enables access to agreement sales data for creating sales reports and contract documentation

**Agreements**
- **Inquire All** - Provides access to agreement data for generating contracts, SOWs, and billing documents

**Billing View Time**
- **Inquire All** - Allows access to time tracking data for creating detailed billing reports and invoices

**Invoicing**
- **Inquire All** - Enables access to invoicing data for generating financial reports and billing summaries

**Reports**
- **Inquire All** - Provides access to financial reporting data for comprehensive document generation

### Project Management Permissions

**All Permissions**
- **Inquire All** - Comprehensive access to all project data enables generation of project documentation, status reports, and project summaries

### Sales Permissions

**Closed Opportunity**
- **Inquire All** - Provides access to closed opportunity data for won/lost analysis and historical sales reporting

**Opportunity**
- **Inquire All** - Essential for accessing active opportunity data to generate proposals, quotes, and sales reports

**Sales Orders**
- **Inquire All** - Enables access to sales order data for order documentation and fulfillment tracking

**Sales Orders Finance**
- **Inquire All** - Provides access to financial aspects of sales orders for billing and revenue reporting

### Service Desk Permissions

**Change Approvals**
- **Inquire All** - Provides access to change approval data for compliance and change management reporting

**Close Service Tickets**
- **Inquire All** - Allows access to completed ticket data for historical reporting and closure documentation

**Merge Tickets**
- **Inquire All** - Enables access to merged ticket data for comprehensive service history tracking

**Reports**
- **Inquire All** - Provides access to service desk reporting data for comprehensive document generation

**Resource Scheduling**
- **Inquire All** - Provides access to scheduling data for resource allocation reports and planning documents

**Service Tickets**
- **Inquire All** - Essential for accessing ticket data to generate service reports and client summaries

**Service Tickets – Finance**
- **Inquire All** - Enables access to ticket financial data for billing reports and cost analysis

### System Permissions

**Member Maintenance**
- **Inquire All** - Required to identify team members for assignment and attribution in generated documents

**My Company**
- **Inquire All** - Provides access to company configuration and branding information for document customization

### Time and Expense Permissions

**Time Entry**
- **Inquire** - Enables access to time tracking data for billing reports and project summaries

:::note Security Note
All permissions are set at the **Inquire** level to ensure TurboDocx operates with read-only access, maintaining data security while enabling document generation functionality.
:::

---

*May your configs be documented, your projects delivered, and your SOWs write themselves — automatically.*
