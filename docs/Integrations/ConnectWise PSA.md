---
title: ConnectWise PSA Integration
sidebar_position: 6
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

- **📄 Statements of Work (SOWs)**: Pull in configurations, timelines, and tasks from project boards
- **📋 Ticket Summaries**: Turn tickets into polished summaries for clients
- **💼 Client Reports**: Generate reports using real company data and services
- **🧠 Technical Docs**: Document configurations, assets, or custom fields from ConnectWise
- **🛠 Implementation Guides**: Auto-generate guides from projects and recurring service tickets
- **📊 Executive Briefs**: Create management-facing updates using ConnectWise reporting fields

<br/>

## Before You Begin

:::tip Not a PSA Admin?
Don’t worry — this guide walks you through step-by-step. You don’t have to be a PSA wizard. If you can follow a recipe, you can follow this. 🍳
:::

You'll need:

- Admin access to your ConnectWise PSA account
- API Member credentials (public + private key)
- A ConnectWise API URL (e.g., `https://yourcompany.connectwisedev.com`)
- 10 minutes of time and a steady Wi-Fi signal 🚀

:::tip Quick PSA Primer
ConnectWise PSA uses “API Members” instead of private apps. You’ll create a special user with read-only API access for TurboDocx.
:::

<br/>

## Step 1: Creating an API Member in ConnectWise

1. **Log into ConnectWise PSA** (via browser)
2. Go to **System → Members** from the main navigation
3. Click **API Members** tab
4. Click **“+” (Add New Member)**

### Fill Out the API Member Form

- **Member ID**: `TurboDocx`
- **Role ID**: Use a role with read-only access (or create a custom role)
- **Level**: Select ‘Corporate’
- **Name & Email**: Just placeholders like `TurboDocx Connector` and `api@turbodocx.com`
- **Site**: Default is fine unless you have multiple offices

:::tip Best Practice
Create a dedicated security role for TurboDocx with read-only permissions across Companies, Tickets, Projects, and Configurations.
:::

<br/>

### Generate API Keys

1. Scroll to the **API Keys** section at the bottom
2. Click **“+” (Add New Key)**
3. Give it a name like `TurboDocx Key`
4. Copy both the **Public Key** and **Private Key**
   - Store these securely — you won’t see the Private Key again

<br/>

## Step 2: Configuring TurboDocx

1. Log into your TurboDocx dashboard
2. Go to **Settings → Organization Settings**
3. Look for **ConnectWise PSA Integration**
4. Click **Configure**

![ConnectWise Configure Modal](/img/connectwise-integration/connectwise-config-modal.png)

### Enter the Required Info

- **API URL**: Usually looks like `https://[yourcompany].connectwisedev.com`
- **Company ID**: Your ConnectWise company identifier
- **Public Key** and **Private Key** from earlier

Click **Save Configuration**. Then click **Refresh Fields** to test the connection and sync your ConnectWise schemas.

:::tip What “Refresh Fields” Does
It fetches your custom fields, ticket types, boards, statuses, configurations, and more — so you can use them in documents.
:::

<br/>

## Step 3: Generate Documents from ConnectWise Data

### From the Document Generator:

1. Go to **Document Generator**
2. Click **New Document**
3. Choose your template
4. Under **Change Source**, select **ConnectWise PSA**
5. Pick the CRM data type (Tickets, Projects, Companies, etc.)
6. Select records you want to include

![Choose Source](/img/connectwise-integration/select-records.png)

### Write Your Prompt

Examples:
- “Create an SOW for this project with timelines, configurations, and tasks.”
- “Generate a config documentation PDF for these selected assets.”
- “Make a client-facing ticket summary report.”

<br/>

## Troubleshooting

### “Invalid Credentials” Error
- Check if your Public/Private key and company ID are correct
- Make sure your API member has the right role and isn’t disabled

### “No Records Found”
- Click **Refresh Fields** again
- Ensure your account has real data (tickets, configs, companies)

### “Permission Denied”
- Make sure your API Member has permissions to read from the modules you want to access

:::tip Still Stuck?
Take a screenshot, note the error, and send it to our team. We’ll get you sorted!
:::

<br/>

## Security and Privacy

We take data protection seriously.

- 🔒 Read-only access only
- 📦 All data transfers are encrypted
- 🔐 Your keys are never stored — just used at runtime
- 👁 You can revoke access anytime from ConnectWise

<br/>

## Final Thoughts

Congrats! 🎉

You've just connected your ConnectWise PSA data to TurboDocx. You can now:

- Generate project docs with zero formatting drama
- Build proposals based on real tickets or configs
- Document assets automatically with AI
- Save hours on repetitive document work

:::tip Last Tip
Clean data = clean documents. Keep your tickets, configurations, and custom fields up-to-date for the best results!
:::

---

*May your tickets be clean, your configs be structured, and your documents generate themselves! ⚡*


TurboDocx integrates with ConnectWise PSA (Professional Services Automation) to provide seamless access to your business data for document generation and AI-powered insights.

## Overview

The ConnectWise PSA integration allows you to:

- Access company information and contact details
- Retrieve sales opportunities and activities
- Pull sales order information
- Get team member and department data
- Generate documents using live ConnectWise data

## Available AI Agents

### Company Data Agent
Retrieves detailed company information including:
- Company details by ID or name
- Company notes and communications
- Associated contacts
- Advanced company search capabilities

### Sales Agent
Handles sales-related data including:
- Sales opportunities with advanced filtering
- Sales activities and interactions
- Sales stages and statuses
- Sales order management

### System Lookup Agent
Provides system reference data:
- Team member information
- Department listings
- System lookup data
- Sales stages and statuses

## Configuration

To set up ConnectWise PSA integration with TurboDocx:

### Prerequisites
- Active ConnectWise PSA subscription
- ConnectWise API access credentials
- Administrative permissions in ConnectWise

### Setup Steps

#### Step 1: Gather ConnectWise Credentials
You'll need the following information from your ConnectWise PSA instance:

- **Company ID**: Your ConnectWise company identifier
- **Company URL**: Your ConnectWise server URL
- **Public Key**: API public key
- **Private Key**: API private key
- **Client ID**: ConnectWise client application ID

#### Step 2: Configure in TurboDocx
*[Configuration steps will be added here]*

<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '600px', height: '400px', backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6', borderRadius: '8px', margin: '20px auto', fontSize: '24px', fontWeight: 'bold', color: '#6c757d'}}>
  Screenshots Coming Soon
</div>

#### Step 3: Test Connection
*[Testing steps will be added here]*

<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '600px', height: '400px', backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6', borderRadius: '8px', margin: '20px auto', fontSize: '24px', fontWeight: 'bold', color: '#6c757d'}}>
  Screenshots Coming Soon
</div>

#### Step 4: Set Permissions
*[Permission configuration will be added here]*

<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '600px', height: '400px', backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6', borderRadius: '8px', margin: '20px auto', fontSize: '24px', fontWeight: 'bold', color: '#6c757d'}}>
  Screenshots Coming Soon
</div>

## Available Data Sources

### Company Information
- Company profiles and details
- Contact information
- Company notes and communications
- Location and address data

### Sales Data
- Sales opportunities and pipeline
- Sales activities and interactions
- Sales orders and quotes
- Sales stages and probability

### System Data
- Team member directory
- Department structure
- System lookup values
- User roles and permissions

## Usage Examples

### Accessing Company Data
The ConnectWise integration can retrieve company information for use in your documents:

```
Example: Get company details for "Acme Corporation"
AI Agent: Company Data Agent
Result: Company profile, contacts, and recent activities
```

### Sales Opportunity Reports
Generate reports based on current sales pipeline:

```
Example: "Show me top 5 largest open opportunities in Tampa"
AI Agent: Sales Agent
Result: Filtered opportunity list with details
```

### Team Member Information
Access team member data for contact information:

```
Example: "Who are the sales reps for Future Messages?"
AI Agent: System Lookup Agent
Result: Team member contact details and roles
```

## Supported Operations

### Currently Available
- ✅ Company search and details
- ✅ Contact management
- ✅ Sales opportunity tracking
- ✅ Sales activity monitoring
- ✅ Sales order management
- ✅ Team member lookup
- ✅ Department information

---

*The ConnectWise PSA integration is designed to streamline your document generation workflow by providing direct access to your business data.*