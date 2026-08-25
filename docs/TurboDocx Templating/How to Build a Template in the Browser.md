---
title: How to Build a Template in the Browser
sidebar_position: 4
description: Build a TurboDocx template without Word or Google Docs. Write your document in the browser, insert variables with the @ key, and generate documents from it.
keywords:
  - build template in browser
  - block editor
  - browser template editor
  - insert variable
  - turbodocx template
  - document automation
  - no word needed
---

Most TurboDocx templates start life in Word or Google Docs. You do not have to work that way. You can write a template directly in your browser, insert variables as you type, and save it as a template — no other application involved.

This guide walks you through building one from scratch.

:::note When to use this
Building in the browser suits short, text-based documents: statements of work, cover letters, engagement summaries, simple agreements.

If you already have a polished `.docx` or `.pptx` file — or your document depends on complex Word formatting — upload it instead. See [How to Create a Template](./How%20to%20Create%20a%20Template.md).
:::

## Step 1: Start a New Template

1. Open the **Templates** page from the left sidebar.
2. Click the **New Template** button in the top-right corner.

![Templates page with the New Template button highlighted in the top-right corner](/img/block_template_editor/step_1_new_template.png)

## Step 2: Choose "Build in browser"

A short menu appears under the button with two choices.

1. Click **Build in browser**.

![New Template menu open, showing Build in browser above Upload a file, with Build in browser highlighted](/img/block_template_editor/step_2_build_in_browser.png)

The editor opens with an empty page. Type your document into it exactly as you would in any word processor.

## Step 3: Insert a Variable with `@`

A variable is a placeholder that gets filled in each time you generate a document — a client's name, a date, a price.

1. Type the sentence you want, and stop where the variable belongs. For example: `Prepared for `
2. Press the **@** key.
3. A list of your organization's variables appears. Start typing to narrow it down.
4. Click the variable you want, or press **Enter** to choose the highlighted one.

![Block editor with the @ menu open, showing a list of available variables such as companyName and BillRate](/img/block_template_editor/step_3_variable_menu.png)

The variable is inserted as a labelled chip showing its name and current value, so you can see at a glance where every placeholder sits in the document.

:::tip
The hint bar above the page is a reminder of both shortcuts: **/** for formatting and **@** for variables.
:::

## Step 4: Format with `/`

1. Start a new line.
2. Press the **/** key.
3. Pick the block you want.

![Block editor with the / menu open, showing Headings, Numbered List, Bullet List, Paragraph, Table, and Image options](/img/block_template_editor/step_4_slash_menu.png)

The menu offers what a business document needs:

| Group | Blocks |
|---|---|
| Headings | Heading 1, Heading 2, Heading 3 |
| Basic blocks | Numbered List, Bullet List, Paragraph |
| Advanced | Table |
| Media | Image |

You can also use the keyboard shortcuts shown beside each entry — **Ctrl-Alt-1** for Heading 1, **Ctrl-Shift-8** for a bullet list, and so on.

## Step 5: Add Blocks with the + Button

If you would rather use the mouse than the keyboard, every line has a **+** button.

1. Move your pointer over the line where you want the new block. A **+** appears to its left.
2. Click the **+**.

![Block editor with the pointer over an empty line, showing the + add-block button highlighted to the left of the line](/img/block_template_editor/step_5_add_block_button.png)

The same menu opens. This is the identical list you get from `/` — use whichever you prefer.

### Add a heading

1. Click **Heading 2** in the menu.
2. Type the heading text, for example `Pricing`.

![Add block menu open with Heading 2 highlighted](/img/block_template_editor/step_6_choose_heading.png)

### Add a table

1. Press **Enter** to start a new line below your heading.
2. Click the **+** button again.
3. Click **Table** under **Advanced**.

![Add block menu open with Table highlighted under the Advanced group](/img/block_template_editor/step_7_choose_table.png)

A table appears in your document. Click any cell and type to fill it in, and press **Tab** to move to the next cell.

![Document showing a Pricing heading above a completed table of services and rates, with the table highlighted](/img/block_template_editor/step_8_heading_and_table.png)

:::tip
You can put variables inside table cells too — press **@** while your cursor is in a cell.
:::

## Step 6: Name and Create the Template

1. Click **Untitled** at the top of the page and type a name for your template.
2. Click **Create Template** in the top-right corner.

![Block editor containing a Statement of Work heading and a companyName variable, with the Create Template button highlighted](/img/block_template_editor/step_9_create_template.png)

## Step 7: Generate a Document

Your new template opens ready to use.

1. Fill in each variable in the **Template Variables** panel on the right. The document preview updates to show your values.
2. Click **Generate Deliverable** in the top-right corner.

![Generate page showing the finished document with the variable filled in and the Generate Deliverable button highlighted](/img/block_template_editor/step_10_generate_deliverable.png)

Your document is created and appears under **Deliverables**, where you can download it as a Word file or PDF, or send it for signature.

:::tip Editing the template later
Open the template and click **Edit Template** to reopen it in the browser editor. Changes there apply to documents you create from that point on — documents you have already generated are not affected.
:::

## What's Next

- [How to Create a Deliverable](./How%20to%20Create%20a%20Deliverable.md) — generating documents from any template
- [How to Create a Knowledgebase Entry](./How%20to%20Create%20a%20Knowledgebase%20Entry.md) — reusable default values for your variables
