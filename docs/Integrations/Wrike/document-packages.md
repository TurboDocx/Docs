---
title: How to Combine Documents in Wrike
sidebar_position: 9
description: Configure a Wrike automation that merges every attachment on a task or project into a single combined PDF (a Document Package) and attaches it back to Wrike when a status changes.
keywords:
  - wrike document package
  - wrike combined pdf
  - wrike merge attachments
  - wrike pdf merge
  - wrike attachment merge
  - merge wrike attachments to pdf
---

# How to Set Up Document Packages (Combined PDF)

A **Document Package** is a single combined PDF made from every attachment on a Wrike task or project. When a task or project changes to your trigger status, TurboDocx gathers its attachments, converts each one to PDF, merges them into one file (oldest first), and attaches the finished Document Package back into Wrike.

This is the **Create Document Package** automation action. Use it to roll loose deliverables, photos, and supporting documents into one tidy hand-off file.

## Prerequisites

- A connected Wrike account (see [Setting Up a Wrike Automation](./setting-up-automation.md))
- A Wrike workflow status you want to use as the trigger, and the folder or project you want to monitor

:::tip Start with the base setup
This guide picks up at the automation's action step. If you have not connected Wrike or chosen a trigger status and folder yet, follow [Setting Up a Wrike Automation](./setting-up-automation.md) first.
:::

<br/>

## Open the Wrike automation builder

### Step 1: Open the Wrike configuration

On your template's **Details** page, click the **"..." (three-dot) button** in the top toolbar, then click **Configure Wrike** in the menu that opens.

![Template Details page with the Configure Wrike menu item highlighted](/img/document_packages/01_configure_wrike_menu.png)

### Step 2: Start a new automation

The **Wrike Automations** window opens and lists your existing automations. Click the **Create Automation** button near the top right.

![Wrike Automations window with the Create Automation button highlighted](/img/document_packages/02_create_automation.png)

### Step 3: Choose a trigger status

On the **When to trigger** step, click the **Trigger Status** field and pick the workflow status that should start the automation. Then choose the automation scope (Folder Level or Account Level) and click **Next**.

![When to trigger step with the Trigger Status field highlighted](/img/document_packages/03_trigger_status.png)

:::note Works on tasks and projects
The Document Package is built from whatever item hits the trigger status. When a **task** triggers, its attachments are merged; when a **project** triggers, the project's attachments are merged.
:::

<br/>

## Configure the Document Package

### Step 4: Select the Create Document Package action

On the **What to do** step, click the **Create Document Package** card. Its description reads "Combine all attachments into one merged PDF." Then click **Next**.

![Action selection step with the Create Document Package card highlighted](/img/document_packages/04_select_create_document_package.png)

### Step 5: Choose which file types to include

The **Configure Document Package** step opens with a **How it works** summary at the top. Under **File Types to Include**, tick the attachment types you want merged into the package:

- **PDF**
- **Word (DOCX)**
- **PowerPoint (PPTX)**
- **Images (JPG/PNG)**

Leave a type unchecked to skip those attachments. At least one type must be selected.

![File Types to Include section with all four checkboxes highlighted](/img/document_packages/05_file_types.png)

### Step 6: Name the output file (optional)

In the **Output File Name** field, type a name for the combined PDF. Leave it blank to use the default name, **Document Package.pdf**.

![Output File Name field highlighted](/img/document_packages/06_output_file_name.png)

### Step 7: Choose where the Document Package is attached

Under **Attachment Destination**, click the **Attach Document Package To** dropdown and choose where the finished file lands:

![Attach Document Package To dropdown highlighted](/img/document_packages/07_attach_destination.png)

- **Wrike Task** — attach to the task that triggered the automation.
- **Parent Folder** — attach to the folder that contains the task.

![Attach Document Package To dropdown open showing Wrike Task and Parent Folder options](/img/document_packages/08_destination_options.png)

Pick an option, then click **Next**.

### Step 8: Name and create the automation

On the **Review & activate** step, the **Automation Blueprint** summarizes the trigger, scope, action, file types, output file name, and attachment destination. Type a name for the automation in the **Name Your Automation** field, then click **Create Automation** to activate it.

![Review step with the Create Automation button highlighted](/img/document_packages/09_review_create.png)

<br/>

## How it works at run time

When a task or project changes to your trigger status, TurboDocx:

1. Gathers the attachments on the triggering task or project
2. Converts each included file to PDF and merges them oldest-first
3. Attaches the Document Package back into Wrike

:::tip Re-running replaces the package in place
If the automation runs again on the same item, the new Document Package **replaces the previous one in place** instead of creating a duplicate. Add or update attachments and re-trigger to refresh the combined file.
:::

<br/>

## Related

- [Setting Up a Wrike Automation](./setting-up-automation.md)
- [How to Convert Documents to PDF (Task, Project & Folder Triggers)](./convert-to-pdf.md)
- [Troubleshooting and FAQ](./troubleshooting.md)
