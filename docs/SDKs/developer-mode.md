---
title: How to Get Ready-to-Run Code with Developer Mode
sidebar_position: 1
sidebar_label: Developer Mode
description: Turn on Developer Mode in TurboDocx to get copy-and-paste SDK and cURL code for what you are doing in the app, with your template's variables and organization ID already filled in.
keywords:
  - developer mode
  - dev mode
  - code panel
  - code snippet
  - sdk example
  - api example
  - turbodocx sdk
  - turbosign api
  - api key
  - organization id
---

# How to Get Ready-to-Run Code with Developer Mode

Developer Mode adds a **Code** button to pages across TurboDocx. Click it and you get the exact code that does what that page does, in the programming language you choose, ready to copy into your project.

For example, on a template's page the code already contains that template's ID and its real variable names, so you only fill in the values.

:::tip What you need
- A TurboDocx account. Turning on Developer Mode only changes what **you** see; it doesn't affect anyone else in your organization.
- An API key to run the code. You can create one from inside the code panel (see [Step 7](#step-7-create-an-api-key-if-you-dont-have-one)).
:::

## Step 1: Turn on Developer Mode

1. Go to the **Home** page.
2. In the top-right corner, click the **Dev Mode** switch to turn it on.

![Home page with the Dev Mode switch highlighted in the top-right corner](/img/developer_mode/dev_mode_switch.png)

Developer Mode stays on until you turn it off. It is saved in this browser only, so you need to turn it on again on another computer or browser.

## Step 2: Open the code panel

1. Go to the page for what you want to do in code. In this guide we use a template: open **Templates** and click a template to open its generate page.
2. At the top of the page, click the **Code** button.

![Template generate page with the Code button highlighted next to Generate Deliverable](/img/developer_mode/code_button.png)

A panel opens on the right side of the screen.

:::note Where else you'll find the Code button
The **Code** button also appears on deliverables, e-signature documents, quotes, products, bundles, price books, companies, webhook settings, and the partner portal. Each one shows the code for the page you are on.
:::

## Step 3: Choose what you want to do

Some pages can do more than one thing. On those pages, the panel has an **Operation** dropdown.

1. Click the **Operation** dropdown.
2. Choose what you want the code to do. On a template's generate page you can choose **Generate document** or **Send for signature**.

![Code panel with the Operation dropdown highlighted](/img/developer_mode/operation_dropdown.png)

## Step 4: Add reminders and expiration (optional)

When you choose **Send for signature**, you can add reminder emails and an expiry date to the request.

1. Click the **Include reminders & expiration** switch to turn it on.

![Code panel with the Include reminders and expiration switch highlighted](/img/developer_mode/reminders_toggle.png)

The code updates to include the reminder and expiration settings. Leave the switch off to use your organization's default settings.

## Step 5: Pick your programming language

1. Click the tab for your language: **TypeScript**, **Python**, **Go**, **PHP**, **Java**, or **cURL**.

![Code panel with the language tabs highlighted](/img/developer_mode/language_tabs.png)

Only the languages that support the chosen operation are shown. For example, **Go** is hidden while reminders and expiration are switched on.

## Step 6: Copy the code

1. Click **Copy** at the top-right of the code.

![Code panel with the Copy button on the code highlighted](/img/developer_mode/copy_snippet.png)

2. Paste the code into your project.

Your organization ID is already written into the code. Your API key is **not**: the code reads it from an environment variable called `TURBODOCX_API_KEY`, so it never ends up in your source code. Set that variable before you run the code. Code that sends documents for signature also reads your sender email from `TURBODOCX_SENDER_EMAIL`.

:::tip New to the SDK?
The panel also shows a one-line command at the top (`npx skills add TurboDocx/quickstart`). Run it in your project and your AI coding agent installs and sets up the TurboDocx SDK for you. See [Install with AI Agents](./agent-skills).
:::

## Step 7: Create an API key if you don't have one

1. At the top of the panel, click **API Keys**.

![Code panel with the API Keys button highlighted](/img/developer_mode/api_keys_button.png)

2. In the window that opens, click **New** to create a key, then copy it into your `TURBODOCX_API_KEY` environment variable.

Only administrators can create API keys. If the button is grayed out, ask an administrator in your organization to create one for you.

## Step 8: Read the full documentation (optional)

1. At the bottom of the panel, click **Explore the … docs**. The link opens the SDK documentation for the product you are working with (for example, TurboSign).

![Code panel with the Explore the TurboSign docs link highlighted](/img/developer_mode/docs_link.png)

## Turn off Developer Mode

When you no longer want to see the **Code** buttons:

1. Open any code panel.
2. At the top of the panel, click **Turn Off Dev Mode**.

![Code panel with the Turn Off Dev Mode button highlighted](/img/developer_mode/turn_off_dev_mode.png)

The panel closes and the **Code** buttons disappear. You can turn Developer Mode back on at any time from the **Dev Mode** switch on the **Home** page.

:::note The panel remembers your choices
The next time you open a code panel, it opens in the language you used last, and each page reopens on the operation and switch settings you left it on. These choices are saved in this browser only.
:::
