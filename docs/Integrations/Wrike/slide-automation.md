---
title: How to Build a PowerPoint Status Deck from Wrike
sidebar_position: 9
description: Turn one PowerPoint template into a status deck that fills a summary table from your Wrike projects and repeats a slide for each project.
keywords:
  - wrike powerpoint
  - wrike slide automation
  - wrike status deck
  - wrike summary slide
  - wrike looping slide
  - wrike project status report
  - powerpoint automation wrike
---

# How to Build a PowerPoint Status Deck from Wrike

**Slide automation** turns a single PowerPoint template into a full status deck. When the Wrike automation runs, TurboDocx does two things:

- It fills a **summary slide** — one table row for each of your Wrike projects, grouped into tables you define.
- It repeats a **looping slide** — one copy for each project, filled with that project's own details.

So a two-slide template can produce a fifteen-slide deck, without anyone copying and pasting a slide per project.

This page covers the PowerPoint-specific setup. For the basics of connecting Wrike and creating an automation, start with [Setting Up a Wrike Automation](./setting-up-automation.md).

## Prerequisites

- A **PowerPoint (.pptx)** template uploaded to TurboDocx
- A connected Wrike account (see [Setting Up a Wrike Automation](./setting-up-automation.md))
- A Wrike folder that contains the projects you want in the deck
- Variables on your template mapped to Wrike fields (see [Static Field Mapping](./field-mapping.md))

:::note
Slide automation only applies to PowerPoint templates. Word templates use [document generation](./document-generation-automation.md) instead.
:::

<br/>

## Part 1: Tell TurboDocx which slides do what

TurboDocx needs to know which slide is your summary and which slide repeats. You mark this on the template itself, so it is remembered for every run.

### Step 1: Open the slide preview

Go to your template's **Details** page. On the right you'll see a page-by-page preview of your PowerPoint file. Each page here is one slide — page 3 in the preview is slide 3 in your deck.

Hover over the slide you want to mark, and click the small **tag button** in its top-right corner.

![Template details page with the mark slide button on a slide preview highlighted](/img/wrike_slide_automation/01_mark_slide_button.png)

### Step 2: Choose the slide's role

A short menu opens with the two roles you can give a slide.

![The slide role menu open, showing the Summary slide and Looping slide options](/img/wrike_slide_automation/02_slide_role_picker.png)

- **Summary slide** — the slide holding the tables you want filled with one row per project. Only one slide can be the summary slide, so if another slide already has this role the menu tells you which one.
- **Looping slide** — a slide that gets repeated once for every project. You can mark **several** slides as looping, and each one repeats in place.

Click the role you want. Your choice saves straight away, and the slide's preview shows a label so you can see at a glance what is marked.

:::tip
Mark your looping slide **before** you configure the automation. That way you can check the whole deck's shape in the preview first.
:::

<br/>

## Part 2: Turn on slide automation

With the slides marked, switch on slide automation in the Wrike automation itself.

### Step 3: Open your Wrike configuration

On the same **Details** page, click the **"..."** button next to **Edit**, then click **Configure Wrike**.

![The template actions menu with the Configure Wrike option highlighted](/img/wrike_slide_automation/03_configure_wrike.png)

### Step 4: Edit the automation

Your configured automations are listed here. Find the one that should build the deck, click its **"..."** button, and choose **Edit**.

![The Wrike Automations dialog showing a configured automation](/img/wrike_slide_automation/04_automation_card.png)

Click **Next** until you reach the **Configure action** step.

### Step 5: Switch on slide automation

Find the **Slide Automation** panel and turn its switch on.

![The Configure action step with the Slide Automation toggle highlighted](/img/wrike_slide_automation/05_enable_slide_automation.png)

Turning this on reveals the settings in the rest of this guide. Leave it off and the automation generates a normal document, ignoring any slide roles you marked.

### Step 5a: Decide what happens when a table outgrows its slide

A summary table can end up with more rows than fit on one slide — you have more projects than the table was drawn for. **Continue long tables on extra slides** decides what happens then. It is **on by default**, which means the rows that don't fit continue on new slides instead of being dropped.

![The Continue long tables on extra slides toggle highlighted, switched on](/img/wrike_slide_automation/11_continue_long_tables.png)

Leave it on and TurboDocx adds as many slides as the rows need. Each new slide is a copy of the summary slide carrying the next batch of rows, and it keeps the table's columns, widths and cell colours. The heading above a table — "Delivered", "In Flight" — is printed once, where that table starts, so a continued table reads as the same table rather than a new section.

Turn it off and each table shows only the rows that fit on its own slide; the rest are left out of the deck.

:::tip
The deck grows only as much as it needs to. If every project already fits, no extra slides are added and the deck looks exactly as it did before.
:::

<br/>

## Part 3: Choose which projects appear

### Step 6: (Optional) Filter projects with a checkbox field

By default, **every project** inside the triggering folder goes into the deck. If you'd rather choose them, pick a Wrike **Checkbox** custom field here — then only projects with that box ticked are included.

![The Project Inclusion Field picker highlighted, with no field selected](/img/wrike_slide_automation/06_project_inclusion_field.png)

**This field is optional.** Leave it blank to include everything, which is what most teams want to start with.

:::caution
If you *do* pick a field, it must be a **Checkbox** field. Picking another type — or picking a field that is later deleted in Wrike — stops the deck being generated, and TurboDocx posts a comment on the Wrike task explaining why.
:::

<br/>

## Part 4: Set up the summary tables

The summary slide can hold several tables — for example one for delivered work and one for work in flight. Each table collects projects by their Wrike status.

### Step 7: Tag a table and choose its statuses

Each row here is one table on your summary slide:

- **Table tag** — the table's name on the slide. Set this as the table's alt-text (or its shape name) in PowerPoint, so TurboDocx knows which table to fill.
- **Statuses** — the Wrike statuses that route a project into this table.

![A summary table row showing the Table tag and Statuses fields](/img/wrike_slide_automation/07_summary_table_row.png)

Click **Add table** for each additional table on the slide.

### Step 8: Pick the statuses

Click the **Statuses** box to open the list. Statuses are grouped by their Wrike workflow, so you can tell similarly-named ones apart.

![The status dropdown open, with statuses grouped by workflow](/img/wrike_slide_automation/08_status_dropdown.png)

The list **stays open** as you pick, so you can select several statuses in one go. Click anywhere outside it when you're finished.

:::note
A status can belong to **only one** table — otherwise a project could land in two tables at once. If a project's status isn't in any table, it is left out of the summary, and TurboDocx tells you how many were skipped in its Wrike comment.
:::

<br/>

## Part 5: Colour the cells by value (optional)

You can colour a table's cells based on what they say — for example green for completed work and red for cancelled.

### Step 9: Open Color Setup

On the table row, click **Color Setup** (it shows a count once you've added rules).

![The Color Setup button on a summary table row highlighted](/img/wrike_slide_automation/09_color_setup_button.png)

### Step 10: Map values to colours

Choose the **field** you want to colour by, then map each of its values to a colour.

![The Color Setup dialog mapping status values to fill and text colours](/img/wrike_slide_automation/10_color_setup_dialog.png)

For each row:

1. Pick a **value** from the dropdown. It offers the statuses you routed into this table, so the value always matches something real.
2. Click the **colour square** to set the cell's background, or type a hex code such as `#007016`.
3. Optionally set a **text colour** so the writing stays readable on a dark fill.

Click **Add Value** for each value you want to colour, then **Save**.

<br/>

## Step 11: Save the automation

Click **Next** through the remaining steps, then **Save Configuration**.

Your automation is live. The next time a project moves into the trigger status, TurboDocx builds the deck — summary tables filled, looping slides repeated per project — and attaches it to the Wrike item.

<br/>

## Part 6: Colour and hide shapes on the slide (optional)

Parts 4 and 5 cover tables. A slide often carries other marked-up pieces too — a status banner in the
corner, a "delay drivers" note — and those are configured from the **template** rather than the
automation wizard.

Mark a shape in PowerPoint by giving it a name or alt-text wrapped in braces, such as
`{risk_banner}`. Then open the template's **Details** page, where **Tagged Shapes** lists everything
the deck carries.

### Step 12: Open a tagged shape

Click the three-dot menu beside a shape and choose **Colours & visibility**.

### Step 13: Say what the shape does

Pick one:

- **Changes colour** — the shape stays on every slide and takes its colour from a Wrike field. A
  banner that turns red when a project is blocked and green when it is on track.
- **Appears and disappears** — the shape is dropped from a project's slide unless the field says
  otherwise. A warning note that only shows on the projects that have something to warn about.
- **Both** — a shape that does each, keyed on its own field.

Only the settings for your choice are shown.

For **Changes colour**, pick the field, then add a colour for each value. Each rule shows a preview
of the banner it produces, so you can see the result rather than reading hex codes. **A rule with no
values is the catch-all** — it covers every value the other rules don't name, which is how you set a
default colour.

For **Appears and disappears**, pick the field and either list the values that show the shape, or
switch on **Whenever the field has any value** for a note that appears whenever there is something
to say.

Leaving a shape unconfigured is fine: it simply appears on every slide, exactly as the template
draws it.

### Step 14: Colour one cell of a table by a value

A tagged **table** on the Details page also offers **Cell colour**, which paints a single column
rather than a whole row.

It asks two things, because they are usually different fields:

1. **Decide by** — the Wrike field whose value chooses the colour.
2. **Paint this column** — the column that actually changes.

That separation is the point. A gate table might show each gate's name, its challenges and its
mitigations, with no status column anywhere — yet the gate's *status* is what should turn its
**name** cell green. The column list comes from the table in your deck, so you pick a real column.

<br/>

## Troubleshooting

**The deck was not generated, and Wrike shows a comment about the inclusion field.**
The Checkbox field chosen in Step 6 no longer works — it may have been deleted in Wrike, or changed to another field type. Pick a valid Checkbox field, or clear the field to include every project.

**Some projects are missing from the summary.**
Their Wrike status isn't listed in any of your tables. Add it to the right table's **Statuses** in Step 8.

**Rows are missing from the end of a summary table.**
The table ran out of room on its slide and **Continue long tables on extra slides** (Step 5a) is switched off, so the rows that didn't fit were left out. Switch it on to carry them onto extra slides.

**A summary table stayed empty.**
The **Table tag** doesn't match the table on the slide. Check the table's alt-text (or shape name) in PowerPoint and make it match the tag exactly.

**A tagged banner is a block of colour with no words in it.**
The variable behind it lost its Wrike field mapping — most often because the template was edited and
re-uploaded. Open the template's Details page and check the placeholder is still mapped to a Wrike
field, then re-map it if not.

**A tagged shape never changes colour.**
Its rule lists values the chosen field never reports. Reopen **Colours & visibility** and check the
values match what the field actually contains — if you changed the field after writing the rules, the
old values no longer apply.

**The looping slide didn't repeat.**
Check the slide is still marked as a **Looping slide** in Part 1, and that **Slide Automation** is switched on in Step 5.

For anything else, see [Wrike Integration Troubleshooting & FAQ](./troubleshooting.md).
