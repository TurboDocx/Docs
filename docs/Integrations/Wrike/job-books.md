---
title: How to Set Up Job Books (Combined PDF)
sidebar_position: 9
description: Configure a Wrike automation that merges every attachment on a task or project into a single combined PDF (a Job Book) and attaches it back to Wrike when a status changes.
keywords:
  - wrike job book
  - wrike combined pdf
  - wrike merge attachments
  - wrike pdf merge
  - wrike job site book
  - wrike attachment merge
  - merge wrike attachments to pdf
---

# How to Set Up Job Books (Combined PDF)

A **Job Book** is a single combined PDF made from every attachment on a Wrike task or project. When a task or project changes to your trigger status, TurboDocx gathers its attachments, converts each one to PDF, merges them into one file (oldest first), and attaches the finished Job Book back into Wrike.

This is the **Merge to Job Book** automation action. Use it to roll loose deliverables, photos, and supporting documents into one tidy hand-off file.

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

![Template Details page with the Configure Wrike menu item highlighted](/img/job_books/01_configure_wrike_menu.png)

### Step 2: Start a new automation

The **Wrike Automations** window opens and lists your existing automations. Click the **Create Automation** button near the top right.

![Wrike Automations window with the Create Automation button highlighted](/img/job_books/02_create_automation.png)

### Step 3: Choose a trigger status

On the **When to trigger** step, click the **Trigger Status** field and pick the workflow status that should start the automation. Then choose the automation scope (Folder Level or Account Level) and click **Next**.

![When to trigger step with the Trigger Status field highlighted](/img/job_books/03_trigger_status.png)

:::note Works on tasks and projects
The Job Book is built from whatever item hits the trigger status. When a **task** triggers, its attachments are merged; when a **project** triggers, the project's attachments are merged.
:::

<br/>

## Configure the Job Book

### Step 4: Select the Merge to Job Book action

On the **What to do** step, click the **Merge to Job Book** card. Its description reads "Combine all attachments into one merged PDF." Then click **Next**.

![Action selection step with the Merge to Job Book card highlighted](/img/job_books/04_select_merge_to_job_book.png)

### Step 5: Choose which file types to include

The **Configure Job Book** step opens with a **How it works** summary at the top. Under **File Types to Include**, tick the attachment types you want merged into the book:

- **PDF**
- **Word (DOCX)**
- **PowerPoint (PPTX)**
- **Images (JPG/PNG)**

Leave a type unchecked to skip those attachments. At least one type must be selected.

![File Types to Include section with all four checkboxes highlighted](/img/job_books/05_file_types.png)

### Step 6: Name the output file (optional)

In the **Output File Name** field, type a name for the combined PDF. Leave it blank to use the default name, **Job Book.pdf**.

![Output File Name field highlighted](/img/job_books/06_output_file_name.png)

### Step 7: Choose where the Job Book is attached

Under **Attachment Destination**, click the **Attach Job Book To** dropdown and choose where the finished file lands:

![Attach Job Book To dropdown highlighted](/img/job_books/07_attach_destination.png)

- **Wrike Task** — attach to the task that triggered the automation.
- **Parent Folder** — attach to the folder that contains the task.

![Attach Job Book To dropdown open showing Wrike Task and Parent Folder options](/img/job_books/08_destination_options.png)

Pick an option, then click **Next**.

### Step 8: Name and create the automation

On the **Review & activate** step, the **Automation Blueprint** summarizes the trigger, scope, action, file types, output file name, and attachment destination. Type a name for the automation in the **Name Your Automation** field, then click **Create Automation** to activate it.

![Review step with the Create Automation button highlighted](/img/job_books/09_review_create.png)

<br/>

## How it works at run time

When a task or project changes to your trigger status, TurboDocx:

1. Gathers the attachments on the triggering task or project
2. Converts each included file to PDF and merges them oldest-first
3. Attaches the merged Job Book back into Wrike

:::tip Re-running replaces the book in place
If the automation runs again on the same item, the new Job Book **replaces the previous one in place** instead of creating a duplicate. Add or update attachments and re-trigger to refresh the combined file.
:::

<br/>

## Related

- [Setting Up a Wrike Automation](./setting-up-automation.md)
- [How to Convert Documents to PDF (Task, Project & Folder Triggers)](./convert-to-pdf.md)
- [Troubleshooting and FAQ](./troubleshooting.md)
