---
title: Document Generation Automation
sidebar_position: 3
description: Configure a Wrike automation to automatically generate documents from a template when a task status changes.
keywords:
  - wrike document generation
  - wrike generate document
  - wrike template automation
  - wrike automated documents
---

# Document Generation Automation

After [setting up your Wrike automation](./setting-up-automation.md) with a trigger status and folder, follow these steps to configure it to automatically generate documents from a template.

<br/>

## Configure Document Generation

### Step 1: Select Generate Document

Click the **Generate Document** action card in the automation step list to select it as the action to perform when the trigger fires.

![Select Generate Document](/img/wrike-integration/Step10-SelectGenerateDocument.png)

### Step 2: Advance to Template Selection

Click the **Next** button at the bottom-right of the Create Automation dialog to proceed to template selection.

![Advance to Next Step](/img/wrike-integration/Step11-AdvanceNextStep.png)

### Step 3: Browse Document Templates

Click the **Browse** button in the Document Template section to open the template selection interface.

![Browse Document Templates](/img/wrike-integration/Step12-BrowseTemplates.png)

### Step 4: Choose a Template

Click on the template card you want to use for automated document generation.

![Choose a Template](/img/wrike-integration/Step13-ChooseTemplate.png)

### Step 5: Confirm the Selected Template

Click the **Select Template** button at the bottom-right corner of the dialog to finalize your template selection.

![Confirm Selected Template](/img/wrike-integration/Step14-ConfirmTemplate.png)

### Step 6: Proceed to Final Configuration

Click the **Next** button to advance to the final configuration step.

![Proceed to Final Configuration](/img/wrike-integration/Step15-ProceedNextStep.png)

### Step 7: Name Your Automation

Click inside the **NAME YOUR AUTOMATION** text input field and enter a descriptive name for your automation (e.g., "Project Delivery - Generate Proposal").

![Name Your Automation](/img/wrike-integration/Step16-NameAutomation.png)

### Step 8: Create and Activate the Automation

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

- **[Static Field Mapping](./field-mapping.md)** to template variables for static data like revenue and dates
- **[Adding Signature Anchors](./signature-anchors.md)** to your template for digital signing
- **Create multiple automations** for different project types, templates, or trigger statuses
- If something isn't working, see [Troubleshooting and FAQ](./troubleshooting.md)
