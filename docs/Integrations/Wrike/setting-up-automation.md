---
title: Setting Up a Wrike Automation
sidebar_position: 2
description: Step-by-step guide to connecting your Wrike account to TurboDocx and creating an automation with trigger statuses and folder monitoring.
keywords:
  - wrike automation setup
  - wrike integration configuration
  - wrike api key
  - wrike trigger status
  - wrike folder permalink
  - wrike connect
---

# Setting Up a Wrike Automation

This guide walks you through connecting your Wrike account to TurboDocx and creating an automation with a trigger status and monitored folder. Once complete, you'll configure the automation's action in a follow-up guide.

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

## What's Next?

After completing the base automation setup above, choose which type of automation to configure:

- **[Document Generation Automation](./document-generation-automation.md)** — automatically generate documents from a template when the trigger fires
- **Signature Automation** — send documents for digital signature via TurboSign (coming soon)
