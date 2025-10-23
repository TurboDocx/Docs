---
title: Wrike Integration
sidebar_position: 7
description: Automate document generation from Wrike projects with TurboDocx. Generate SOWs, proposals, and reports directly from your Wrike tasks and folders using AI-powered automation.
keywords:
  - wrike integration
  - wrike document automation
  - wrike to proposal
  - wrike sow generation
  - wrike contract automation
  - wrike project documents
  - wrike ai automation
  - wrike document generation
  - wrike webhook integration
  - project management automation
  - wrike task documents
  - wrike folder automation
  - automated wrike proposals
  - wrike data to document
  - wrike workflow automation
  - wrike api integration
  - wrike project reports
  - wrike presentation automation
  - wrike ai document generation
---

# Automate Document Generation from Wrike Projects

TurboDocx integrates with Wrike to automatically generate professional documents, proposals, and presentations directly from your project management data. When you change a task status in Wrike, TurboDocx can automatically create and attach documents to your projects.

## What You Can Create

- **📄 Statements of Work (SOWs)**: Generate comprehensive SOWs from project folders with timelines and deliverables
- **💼 Project Proposals**: Create proposals from opportunity data in Wrike
- **📊 Status Reports**: Automatically generate project status reports from task data
- **📋 Meeting Summaries**: Turn Wrike tasks into professional meeting documentation
- **🚀 Client Deliverables**: Generate client-facing documents from project information
- **📈 Executive Summaries**: Create management reports from Wrike folder data

<br/>

## Before You Begin

:::tip Not a Wrike Admin?
This guide walks you through the entire setup process step-by-step. If you can create a task in Wrike, you can set this up! 🎯
:::

You'll need:

- Admin access to your Wrike workspace
- Admin access to your TurboDocx organization
- About 10-15 minutes
- A template ready in TurboDocx
- Postman or similar tool for initial Webhook Setup for API calls

<br/>

## How It Works

The Wrike integration uses a **status-triggered workflow**:

1. You set up a webhook in Wrike that monitors specific folders or projects
2. When a task status changes to a trigger status (like "Generate Document" or "Send for Signature"), Wrike notifies TurboDocx
3. TurboDocx automatically generates the document using your template and Wrike data
4. The finished document is attached back to the Wrike task

<br/>

## Step 1: Create and Configure Your Template

First, create a template in TurboDocx that will be used for document generation.

:::tip New to TurboDocx Templates?
See our [How to Create a Template](../TurboDocx%20Templating/How%20to%20Create%20a%20Template.md) guide for detailed instructions on creating templates.
:::

### A. Create Your Template

1. **Log into TurboDocx**
2. **Navigate to Templates**
3. **Create a new template** or select an existing one
4. **Add variables** that will be populated from Wrike data

:::tip Template Variables
Your template can include variables like `{CompanyName}`, `{ProjectTitle}`, `{TaskDescription}`, etc. The AI will automatically populate these from Wrike data.
:::

### B. Add Default Values (Optional)

1. **Open your template** in TurboDocx
2. **Click on "Default Values"**
3. **Add default values** for any variables that should have fallback content

<!-- TODO: Add screenshot showing the Default Values section in TurboDocx template editor -->
![Template Default Values](/img/wrike-integration/default-values.png)

### C. Configure AI Generation (Recommended)

1. **Enable AI variable generation** for your template
2. **Set up AI prompts** for complex variables that should be generated from Wrike context
3. **Test the AI generation** to ensure it works as expected

<!-- TODO: Add screenshot showing AI variable generation settings in TurboDocx template -->
![AI Variable Configuration](/img/wrike-integration/ai-config.png)

:::info Using TurboSign for Digital Signatures?

If you plan to use the [TurboSign signature workflow](#signature-workflow) with this template, you need to include signature anchor fields in both your document template AND in the default values:

**Required Signature Anchor Fields:**
- `{SalesSignerName}`, `{SalesDate}`, `{SalesSignerSignature}`
- `{ClientSignerName}`, `{ClientDate}`, `{ClientSignerSignature}`

**Setup Instructions:**

1. **In your document template**, add these fields where you want the signature elements to appear (usually at the end of your document)
2. **In TurboDocx Default Values**, set each anchor field to map to itself:
   - Variable: `{SalesSignerName}` → Default Value: `{SalesSignerName}`
   - Variable: `{SalesDate}` → Default Value: `{SalesDate}`
   - Variable: `{SalesSignerSignature}` → Default Value: `{SalesSignerSignature}`
   - Variable: `{ClientSignerName}` → Default Value: `{ClientSignerName}`
   - Variable: `{ClientDate}` → Default Value: `{ClientDate}`
   - Variable: `{ClientSignerSignature}` → Default Value: `{ClientSignerSignature}`

**Why this is needed:** When TurboDocx generates the document from Wrike, it needs to preserve these anchor fields as literal text (not replace them with data from Wrike). By setting the default value to the same field name, the anchor remains in the generated document for TurboSign to locate and replace with actual signature elements.

See the [TurboSign Documentation](../TurboSign/overview.md) for more details on signature workflows.
:::

### D. Note Your Template ID

1. **Open your template** in TurboDocx
2. **Look at the URL** - it will contain your template ID
3. **Copy the template ID** (you'll need this for Step 3)

Example URL: `https://app.turbodocx.com/templates/bad30fa3-cf34-440f-8029-3410d2ff52e6`
Template ID: `bad30fa3-cf34-440f-8029-3410d2ff52e6`

<br/>

## Step 2: Configure Wrike Integration in TurboDocx

You need to set up both your Wrike access token and create a special API key for webhook verification.

### A. Get Your Wrike Access Token

1. **Log into Wrike**
2. **Go to Settings → Apps & Integrations → API**
3. **Create a new permanent access token** or use an existing one
4. **Copy the token** - you'll need it in the next step

For detailed instructions on creating a Wrike API token, see [Wrike's official API documentation](https://help.wrike.com/hc/en-us/articles/210409445-Wrike-API).

### B. Configure Wrike in TurboDocx

![Setup Wrike API Key in TurboDocx](/img/wrike-integration/SetupWrikeAPIKeyInTurboDocx.png)

1. **Log into TurboDocx**
2. **Go to Settings → Organization Settings → Integrations**
3. **Select "Wrike"** from the integrations list
4. **Paste your Wrike access token** from Step 2A
5. **Save the configuration**

This stores your Wrike access token so TurboDocx can communicate with the Wrike API.

### C. Create the Webhook API Key

![Wrike API Key Contributor](/img/wrike-integration/WrikeAPIKeyContributor.png)

1. **Go to Settings → Organization Settings**
2. **Click on "API Keys"** in the left sidebar
3. **Click "Create New API Key"**
4. **Set the name to** `wrikewebhook` (this exact name is required - no dash, all one word!)
5. **Select a role**:
   - **Contributor**: Can create and modify documents (recommended)
   - **User**: Can create documents but not modify templates
6. **Click "Create"**

:::caution Important: Exact Name Required
The API key MUST be named exactly `wrikewebhook` (lowercase, no spaces, no dash, all one word). The integration won't work with any other name.
:::

### D. Save Your API Key

![Capture Organization ID](/img/wrike-integration/CaptureOrgId.png)

1. **Copy the API key** that appears (you'll only see this once!)
2. **Store it securely** - you'll need it for Step 3
3. **Note your Organization ID** from the settings page

<br/>

## Step 3: Get Your Wrike Folder ID

You need to identify which Wrike folder, space, or project to monitor for status changes.

### A. Get the Folder Permalink

1. **Open Wrike** in your browser
2. **Navigate to the folder or project** you want to monitor
3. **Right-click on the folder name** and select **"Copy Link"** (or click the share icon)
4. **Paste the link** somewhere - it will look like:
   ```
   https://www.wrike.com/open.htm?id=1490378047
   ```

### B. Get the Folder ID via API

![Get Folder by Permalink](/img/wrike-integration/get-folder-by-permalink.png)

Use the Wrike API to convert the permalink to a folder ID:

1. **Open Postman** (or your browser)
2. **Create a GET request** to:
   ```
   https://www.wrike.com/api/v4/folders?permalink=YOUR_PERMALINK_HERE
   ```
3. **Set up authentication**:
   - Type: Bearer Token
   - Token: Your Wrike API token from Step 2A
4. **Replace `YOUR_PERMALINK_HERE`** with your copied permalink

**Example Request:**
```
https://www.wrike.com/api/v4/folders?permalink=https://www.wrike.com/open.htm?id=1490378047
```

5. **Send the request** and look for the folder ID in the response:
   ```json
   {
     "data": [
       {
         "id": "IEAAAAAAI4567890",
         "title": "Your Folder Name",
         ...
       }
     ]
   }
   ```

6. **Copy the folder ID** (e.g., `IEAAAAAAI4567890`) - you'll need this for Step 4

:::tip Pro Tip
You can create different webhooks for different folders and templates. For example, one webhook for sales proposals and another for project SOWs.
:::

<br/>

## Step 4: Create a Wrike Webhook

Currently, you need to use Postman (or similar API tool) to create the webhook. We're working on adding this to the TurboDocx UI.

### A. Create Webhook via Postman

![Postman Webhook Creation](/img/wrike-integration/create-webhook.png)

1. **Open Postman** (or download it from [postman.com](https://www.postman.com/downloads/))
2. **Create a new POST request** to:
   ```
   https://www.wrike.com/api/v4/folders/{WRIKE_FOLDER_ID}/webhooks
   ```

3. **Set up authentication**:
   - Type: Bearer Token
   - Token: Your Wrike API token from Step 2A

4. **Configure the Query Parameters**:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | `events` | `[ProjectStatusChanged,TaskStatusChanged]` | The Wrike events to monitor. TurboDocx listens for status changes. |
   | `recursive` | `true` | Monitor all tasks within the folder and its subfolders. |
   | `hookUrl` | `https://api.turbodocx.com/integrations/wrike/webhook/StatusTriggeredWorkflow/{YOUR_ORG_ID}/{YOUR_TEMPLATE_ID}` | The TurboDocx webhook endpoint URL. |
   | `secret` | `{YOUR_WRIKE_WEBHOOK_API_KEY}` | Your `wrikewebhook` API key from Step 2D for secure verification. |

5. **Replace the placeholders**:
   - `{WRIKE_FOLDER_ID}`: The Wrike folder/space to monitor (from Step 3)
   - `{YOUR_ORG_ID}`: Your TurboDocx organization ID (from Step 2D)
   - `{YOUR_TEMPLATE_ID}`: Your template ID (from Step 1D)
   - `{YOUR_WRIKE_WEBHOOK_API_KEY}`: The `wrikewebhook` API key (from Step 2D)

### B. Example Request

Full URL with all parameters:

```
https://www.wrike.com/api/v4/folders/IEAAAAAI4567890/webhooks?events=[ProjectStatusChanged,TaskStatusChanged]&recursive=true&hookUrl=https://api.turbodocx.com/integrations/wrike/webhook/StatusTriggeredWorkflow/abc123-org-id/def456-template-id&secret=TDX-12345
```

:::tip Parameter Details
- **events**: Include both `ProjectStatusChanged` and `TaskStatusChanged` to ensure the webhook triggers for all relevant status updates
- **recursive**: Setting this to `true` ensures all tasks in subfolders are monitored, not just the top-level folder
- **hookUrl**: This tells Wrike where to send webhook notifications when events occur
- **secret**: This is used to cryptographically verify webhook requests are authentic
:::

### C. Send the Request

1. **Click "Send"** in Postman
2. **Check the response** - you should see a webhook ID
3. **Save the webhook ID** for future reference

:::tip Success Check
If the request succeeds, you'll get a 200 response with a webhook object containing your webhook ID. If you get an error, double-check your Wrike API token and request body.
:::

<br/>

## Step 5: Configure Wrike Custom Statuses

For the webhook to trigger document generation, you need to set up custom statuses in Wrike.

### A. Create Custom Workflow Statuses

1. **In Wrike, go to Settings → Workflows**
2. **Select the workflow** for your project type
3. **Add custom statuses** for document automation:
   - `Generate Document` - Triggers document generation
   - `Generate SOW` - Alternative trigger for SOW generation
   - `Send for Signature` - Triggers signature workflow

For detailed instructions on creating custom workflow statuses in Wrike, see [Workflows in Wrike](https://help.wrike.com/hc/en-us/articles/210322785-Workflows-in-Wrike).

### B. Allowed Status Triggers

TurboDocx listens for these status changes (case-insensitive):

**Document Generation Statuses:**
- `generate document`
- `generate sow`

**Signature Workflow Status:**
- `send for signature`

When a task changes to any of these statuses, TurboDocx will automatically trigger.

:::info Event Types
The webhook also filters for specific Wrike event types:
- `taskstatuschanged` - When task status changes
- `taskcommentadded` - When a comment is added to a task
:::

<br/>

## Step 6: Test the Integration (Magic Time! ✨)

Now let's test the entire workflow to see the magic happen!

### A. Create a Test Task in Wrike

1. **Open the Wrike folder** you configured in the webhook
2. **Create a new task** with some project details
3. **Add a description** with relevant information (the AI will use this!)

### B. Trigger Document Generation

![Select Generate SOW Status](/img/wrike-integration/SelectGenerateSoWStatus.png)

1. **Change the task status** to one of the trigger statuses:
   - "Generate Document" or
   - "Generate SOW"
2. **Wait 30 seconds to 2 minutes** (depending on document complexity)
3. **Check the task attachments** - your generated document should appear!

![Wrike SOW Generated Comment](/img/wrike-integration/WrikeSOWGeneratedComment.png)

### C. What Happens Behind the Scenes

1. ✅ Wrike detects the status change
2. ✅ Wrike sends webhook notification to TurboDocx
3. ✅ TurboDocx validates the webhook signature
4. ✅ TurboDocx fetches task/folder data from Wrike
5. ✅ TurboDocx generates the document using your template and AI
6. ✅ TurboDocx attaches the finished document to the Wrike task
7. ✅ Wrike updates the task status to a custom "Generated" status

:::tip Success Indicators
- The document appears as an attachment on the Wrike task
- The task status may automatically update to show generation completed
- You can download and review the generated document
:::

<br/>

## Signature Workflow

TurboDocx also supports a signature workflow for Wrike tasks.

### How It Works

1. **Change a task status to** `Send for Signature`
2. **TurboDocx fetches the most recent attachment** from the task
3. **TurboDocx extracts signature recipients** from Wrike custom fields
4. **TurboDocx sends it through the TurboSign workflow** for digital signatures
5. **The signed document is returned** to the Wrike task

### Required Wrike Custom Fields

TurboSign for Wrike is configured by default to look for the following custom fields on your Wrike task or folder:

| Custom Field Name | Required | Description |
|-------------------|----------|-------------|
| `🔏 Seller email` | **Yes** | Email address of the seller/vendor signer |
| `🔏 Customer email` | **Yes** | Email address of the customer/client signer |
| `🔏 Seller name` | No | Name of the seller/vendor signer (defaults to "Seller") |
| `🔏 Customer name` | No | Name of the customer/client signer (defaults to "Customer") |

:::caution Required Custom Fields
The signature workflow will fail if the required custom fields are missing. Make sure to add these custom fields to your Wrike workflow and populate them before triggering the signature workflow:
- `🔏 Seller email` or `Seller email` (required)
- `🔏 Customer email` or `Customer email` (required)

The 🔏 (lock) emoji is optional but recommended to help identify signature-related fields in Wrike.
:::

:::tip Field Name Flexibility
The system accepts field names with or without the 🔏 emoji prefix. Both `🔏 Seller email` and `Seller email` will work, but using the 🔏 emoji helps identify signature-related fields in Wrike.
:::

### Required Document Fields

Your document template must include the following anchor fields for TurboSign to place signature elements:

- `{SalesSignerName}` - Where the seller's name will appear
- `{SalesDate}` - Where the seller's signature date will appear
- `{SalesSignerSignature}` - Where the seller's signature field will be placed
- `{ClientSignerName}` - Where the customer's name will appear
- `{ClientDate}` - Where the customer's signature date will appear
- `{ClientSignerSignature}` - Where the customer's signature field will be placed

:::info Prerequisites for Signature Workflow
- TurboSign must be configured in your TurboDocx organization
- The Wrike task must have at least one document attachment
- The document must contain all required signature anchor fields
- The Wrike task/folder must have the required custom fields populated
:::

<br/>

## Troubleshooting

### Wrike API Key Not Found

**Cause:** The `wrikewebhook` API key doesn't exist in your TurboDocx organization.

**Solution:**
1. Go to TurboDocx Settings → Organization Settings → API Keys
2. Verify an API key named exactly `wrikewebhook` (no dash, all one word) exists
3. If not, create one following Step 2C
4. **Common mistake:** Make sure the key is named `wrikewebhook` not `wrike-webhook` (no dash!)

### Invalid Webhook Signature

**Cause:** The webhook secret doesn't match the API key.

**Solution:**
1. Verify the `secret` in your webhook matches the `wrikewebhook` API key exactly
2. Delete the webhook in Wrike and recreate it with the correct secret
3. Make sure you copied the full API key without extra spaces

### Invalid Webhook Payload

**Cause:** Wrike sent an unexpected payload format.

**Solution:**
- This is usually a Wrike configuration issue
- Verify your webhook is set up for the correct event types
- Check the Wrike webhook logs in Wrike Settings → Webhooks

### Status Not Supported

**Cause:** The task status changed to a status that TurboDocx doesn't monitor.

**Solution:**
- This is normal behavior - the webhook only triggers for specific statuses
- Make sure you're using one of the allowed statuses: `generate document`, `generate sow`, or `send for signature`
- Check your Wrike workflow configuration

### Document Generation Takes Too Long

**Cause:** Complex templates or AI generation can take 1-2 minutes.

**Solution:**
- Wait at least 2 minutes before assuming failure
- Check TurboDocx logs in your organization settings
- Simplify your template or reduce the number of AI-generated variables

### Document Not Attached to Wrike Task

**Cause:** Generation succeeded but attachment failed.

**Solution:**
1. Check that your Wrike API token has permission to add attachments
2. Verify the Wrike folder/task still exists
3. Check TurboDocx logs for attachment errors

:::tip Still Stuck?
Contact TurboDocx support with:
- Your organization ID
- Your template ID
- The Wrike task ID or folder ID
- A screenshot of any error messages
We're here to help! 🚀
:::

<br/>

## Security and Privacy

### How Your Data is Protected

- 🔐 **HMAC Signature Verification**: All webhook requests are cryptographically verified
- 🔒 **API Key Authentication**: Webhook-specific API keys prevent unauthorized access
- 📦 **Encrypted Data Transfer**: All communication uses HTTPS/TLS encryption
- 🔍 **Read-Only Wrike Access**: TurboDocx only reads Wrike data (except to attach generated documents)

### Best Practices

- **Rotate API Keys Regularly**: Update your `wrikewebhook` API key every 90 days
- **Use Contributor Role**: Only grant the minimum permissions needed
- **Monitor Webhook Activity**: Review webhook logs in Wrike settings
- **Secure Your Secrets**: Never commit API keys or secrets to version control

<br/>

## Tips for Success

### Getting the Best Documents

**Keep Wrike Data Clean:**
- Use descriptive task titles and descriptions
- Fill in custom fields with relevant project information
- Add context in task comments (AI uses this!)

**Optimize Your Templates:**
- Create specific templates for different document types
- Use AI variable generation for complex sections
- Test templates before setting up webhooks

**Use Descriptive Status Names:**
- Make custom statuses clear: "Generate Client Proposal" vs. "Generate Document"
- Document your workflow for team members
- Consider different statuses for different document types

### Workflow Ideas

**SOW Generation Workflow:**
1. Create project folder in Wrike
2. Add all deliverables as tasks
3. Move folder to "Generate SOW" status
4. TurboDocx generates comprehensive SOW from all tasks
5. Review and send to client

**Proposal Automation:**
1. Create opportunity in Wrike
2. Add project details and pricing
3. Change status to "Generate Proposal"
4. Review AI-generated proposal
5. Change status to "Send for Signature"
6. Client receives signed proposal

**Weekly Reporting:**
1. Create "Weekly Report" task
2. Link to relevant project tasks
3. Every Friday, change status to "Generate Document"
4. Auto-generated report appears in attachments

<br/>

## What's Next? 🎯

Congratulations! You've successfully set up the Wrike integration. Now you can:

✅ Automatically generate documents from Wrike status changes
✅ Create SOWs, proposals, and reports without manual data entry
✅ Send documents for signature directly from Wrike
✅ Save hours every week on document generation

### Next Steps:

1. **Create multiple webhooks** for different project types or templates
2. **Train your team** on using the trigger statuses
3. **Build a template library** for common document types
4. **Set up custom workflows** in Wrike to streamline your processes

:::tip UI Integration Coming Soon
We're actively working on adding webhook management to the TurboDocx UI. Soon you'll be able to create and manage Wrike webhooks without using Postman! 🚀
:::

---

## FAQ

### Can I use multiple templates with the same Wrike folder?

No, each webhook is tied to one template. However, you can create multiple webhooks for the same folder with different templates, and use different trigger statuses to determine which webhook fires.

### What happens if I delete the API key?

All webhooks using that API key will stop working and return 404 errors. Create a new `wrikewebhook` key to restore functionality.

### Can I use this with Wrike tasks or only folders?

Both! The webhook monitors a specific folder, but the status changes happen on tasks within that folder. You can also monitor entire spaces or projects.

### How do I know if document generation failed?

Check the TurboDocx logs in your organization settings. Failed generations will show error details. You can also monitor your Wrike webhook logs.

### Can the AI use data from multiple Wrike tasks?

Yes! If you trigger from a folder, the AI can access all tasks within that folder. If you trigger from a task, it can access parent/child tasks as well.

---

*May your documents generate themselves, your workflows automate effortlessly, and your Wrike projects always stay on track! 🚀✨*
