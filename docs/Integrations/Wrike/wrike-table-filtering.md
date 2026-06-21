---
title: How to Filter a Wrike Table (AND/OR)
sidebar_position: 7
description: Use multi-condition filtering on a Wrike Table variable to include only the sub-items you want, combining conditions with Match all (AND) or Match any (OR).
keywords:
  - wrike table filter
  - wrike table conditions
  - wrike and or filter
  - match all match any
  - wrike multi-condition filter
  - wrike sub-item filter
---

# How to Filter a Wrike Table (AND/OR)

A Wrike Table builds a table from the sub-items of the triggering Wrike entity. With multi-condition filtering you can narrow that table down to only the sub-items you care about, stacking several conditions and combining them with **Match all (AND)** or **Match any (OR)**.

For example, you can show only sub-items where the Item Type is "Billing Milestone" **and** the Due Date is within the last 200 days.

## Prerequisites

- A connected Wrike account (see [Setting Up a Wrike Automation](./setting-up-automation.md))
- A template with a rich-text variable configured as a **Wrike Table** (the variable shows the **Wrike Table** type on the template details page)

<br/>

## Add and Combine Filter Conditions

### Step 1: Open the Wrike Table Variable Menu

Open your template's details page and find the variable configured as a Wrike Table. On that variable's input row, click the **three-dot menu** (labeled "variable menu", the "..." button on the right).

![Wrike Table variable input row with the three-dot menu button highlighted](/img/wrike_table_filtering/01_variable_menu.png)

### Step 2: Choose Wrike Table

In the menu that opens, click **Wrike Table**. This opens the Wrike Table builder, where you set up the columns and the filter.

![Variable menu open with the Wrike Table option highlighted](/img/wrike_table_filtering/02_select_wrike_table.png)

### Step 3: Find the Filter Section

The builder opens on the table's columns (**FIELDS**) and layout (**OPTIONS**, such as Layout and Max depth). Scroll past those to the **Filter** section.

Each condition has a **Field**, a **comparison**, and a **value**. The value control changes with the comparison you pick (for example, a picker of options, or a number of days). Pick a field to turn on the first condition.

![Filter section with the Match all (AND) combine selector highlighted](/img/wrike_table_filtering/03_match_all_any.png)

### Step 4: Choose Match all (AND) or Match any (OR)

The **Match** selector controls how multiple conditions combine. Click it and pick **all (AND)** to require every condition, or **any (OR)** to match when at least one condition is met.

![Match selector open showing all (AND) and any (OR) options](/img/wrike_table_filtering/04_and_or_options.png)

:::note

The **Match all (AND) / any (OR)** selector only appears once you have **two or more** conditions with a field selected. A single condition does not need a combinator. One combinator applies to the whole filter, so you cannot mix AND and OR in the same Wrike Table.

:::

### Step 5: Add More Conditions

Click **+ Add Condition** to add another row, then pick its field, condition, and value. You can add up to 10 conditions.

![Add Condition button highlighted below the existing filter conditions](/img/wrike_table_filtering/05_add_condition.png)

### Step 6: Decide Whether to Keep Parents and Sub-trees

Below the conditions are two switches, both **on by default**:

- **Include sub-items** — when a row matches, its entire nested sub-tree is included, **even sub-items that do not match your filter**. Turn this off if you want *only* the rows that match.
- **Keep parent rows** — shows the rows above a match so the table stays readable in its hierarchy. Turn this off for a flat list of matches only.

If your generated table contains rows you expected the filter to remove, check these two switches first.

When you are done, click **Save** to store the filter.

:::tip

- Built-in item types (Task, Folder, Project) work on any Wrike plan. Filtering by a **custom** item type requires a Wrike plan that includes custom item types, otherwise that condition is skipped.
- The builder's preview shows the table layout, not the filtered result. Your filters are applied when the document is generated, so the generated table may contain a different set of rows.

:::
