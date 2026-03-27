---
title: Setting Up a Wrike Automation
sidebar_position: 2
description: Step-by-step guide to connecting Wrike and creating your first document generation automation in TurboDocx.
keywords:
  - wrike automation setup
  - wrike document generation setup
  - wrike integration configuration
  - wrike api key
  - wrike trigger status
  - wrike folder permalink
  - wrike template automation
---

# Setting Up a Wrike Automation

This guide walks you through connecting your Wrike account to TurboDocx and creating an automation that generates documents when a task status changes.

## Prerequisites

Before starting, make sure you have:

- A **Wrike API access token** (see [Get Your Wrike Access Token](#get-your-wrike-access-token) below)
- A **template** in TurboDocx ready for document generation (see [How to Create a Template](../../TurboDocx%20Templating/How%20to%20Create%20a%20Template.md))
- The **Wrike folder permalink** for the folder you want to monitor

<br/>

## Get Your Wrike Access Token

1. Log into **Wrike**
2. Go to **Settings > Apps & Integrations > API**
3. Create a new **permanent access token** or use an existing one
4. Copy the token — you'll paste it in the next section

For detailed instructions, see [Wrike's official API documentation](https://help.wrike.com/hc/en-us/articles/210409445-Wrike-API).

<br/>

## Connect Wrike to TurboDocx

### Step 1: Open Wrike Integration Configuration

Navigate to the **Integrations** page within TurboDocx. Locate the **Wrike Integration** card and click the **Configure Wrike** button to open the configuration panel.

![Open Wrike Integration Configuration](/img/wrike-integration/Step01-OpenWrikeConfig.png)

### Step 2: Enter Your Wrike API Key

In the Wrike Automations connection dialog, locate the **Enter your Wrike API key** text input field. Click inside the field and paste your Wrike API access token.

![Enter Wrike API Key](/img/wrike-integration/Step02-FocusApiKeyInput.png)

### Step 3: Connect Your Wrike Account

Click the **Connect Wrike** button to validate your API key and establish the connection between Wrike and TurboDocx.

![Connect Wrike Account](/img/wrike-integration/Step03-ConnectWrike.png)

<br/>

## Create Your First Automation

### Step 4: Start Creating an Automation

Click the **+ Create Your First Automation** button in the Wrike Automations popup to begin setting up a new automation workflow.

![Create First Automation](/img/wrike-integration/Step04-CreateFirstAutomation.png)

### Step 5: Select a Trigger Status

Click on the **Select one or more statuses...** input field inside the **Trigger Status** dropdown. Select one or more workflow statuses that should trigger the automation.

![Select Trigger Status](/img/wrike-integration/Step05-SelectTriggerStatus.png)

### Step 6: Choose the Specific Trigger Status

In the Trigger Status dropdown list, click the status option you want to use as the trigger (e.g., **Generate Document – Project Delivery**).

![Choose Trigger Status Option](/img/wrike-integration/Step06-ChooseTriggerOption.png)

### Step 7: Enter the Wrike Folder Permalink

Click on the **Wrike Folder Permalink** text box in the Folder Location section. Paste or type the Wrike folder URL that this automation should monitor.

:::tip Getting Your Folder Permalink
In Wrike, right-click on the folder or project you want to monitor and select **Copy Link**. The URL will look like: `https://www.wrike.com/open.htm?id=1234567890`
:::

![Enter Folder Permalink](/img/wrike-integration/Step07-EnterFolderPermalink.png)

### Step 8: Verify the Folder Permalink

Click the **Verify Permalink** button to validate that the provided Wrike folder URL is correct and accessible.

![Verify Folder Permalink](/img/wrike-integration/Step08-VerifyPermalink.png)

### Step 9: Proceed to the Next Step

Click the **Next** button at the bottom-right corner of the setup modal to continue to action configuration.

![Proceed to Next Step](/img/wrike-integration/Step09-ClickNext.png)

<br/>

## Configure Document Generation

### Step 10: Select Generate Document

Click the **Generate Document** action card in the automation step list to select it as the action to perform when the trigger fires.

![Select Generate Document](/img/wrike-integration/Step10-SelectGenerateDocument.png)

### Step 11: Advance to Template Selection

Click the **Next** button at the bottom-right of the Create Automation dialog to proceed to template selection.

![Advance to Next Step](/img/wrike-integration/Step11-AdvanceNextStep.png)

### Step 12: Browse Document Templates

Click the **Browse** button in the Document Template section to open the template selection interface.

![Browse Document Templates](/img/wrike-integration/Step12-BrowseTemplates.png)

### Step 13: Choose a Template

Click on the template card you want to use for automated document generation.

![Choose a Template](/img/wrike-integration/Step13-ChooseTemplate.png)

### Step 14: Confirm the Selected Template

Click the **Select Template** button at the bottom-right corner of the dialog to finalize your template selection.

![Confirm Selected Template](/img/wrike-integration/Step14-ConfirmTemplate.png)

### Step 15: Proceed to Final Configuration

Click the **Next** button to advance to the final configuration step.

![Proceed to Final Configuration](/img/wrike-integration/Step15-ProceedNextStep.png)

### Step 16: Name Your Automation

Click inside the **NAME YOUR AUTOMATION** text input field and enter a descriptive name for your automation (e.g., "Project Delivery - Generate Proposal").

![Name Your Automation](/img/wrike-integration/Step16-NameAutomation.png)

### Step 17: Create and Activate the Automation

Click the **Create Automation** button to save and activate your automation workflow.

![Create and Activate Automation](/img/wrike-integration/Step17-CreateAutomation.png)

<br/>

## Test the Integration

Now that your automation is active, test it end-to-end:

1. **Open the Wrike folder** you configured in the automation
2. **Create a new task** with some project details and a description (the AI will use this data to populate your template)
3. **Change the task status** to the trigger status you configured (e.g., "Generate Document")
4. **Wait 30 seconds to 2 minutes** depending on document complexity
5. **Check the task attachments** — your generated document should appear!

:::tip Testing Tips
- Use descriptive task titles and descriptions — the AI uses this data to generate better documents
- Fill in custom fields with relevant project information for richer output
- Start with a simple template to verify the connection works before using complex ones
:::

<br/>

## What's Next?

- **Create multiple automations** for different project types, templates, or trigger statuses
- **Set up a [Signature Workflow](./signature-workflow.md)** to send generated documents for digital signing
- **Train your team** on which statuses trigger which automations
- If something isn't working, see [Troubleshooting and FAQ](./troubleshooting.md)
