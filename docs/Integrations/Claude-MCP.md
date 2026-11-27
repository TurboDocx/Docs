---
title: Connect TurboDocx to Claude with MCP
sidebar_label: Claude (MCP)
description: Connect TurboDocx to Claude.ai and Claude Code through the TurboDocx MCP server with an API key, then draft documents, send for signature and build quotes from chat.
keywords:
  - turbodocx mcp
  - turbodocx mcp server
  - claude connector
  - claude custom connector
  - claude code mcp
  - model context protocol
  - turbodocx claude
  - turbosign claude
  - turboquote claude
---

# Connect TurboDocx to Claude with MCP

The TurboDocx MCP server lets Claude work with your TurboDocx organization. Once connected, you can ask Claude to draft documents from your templates, send documents for signature with TurboSign, and build quotes with TurboQuote.

This page covers Claude.ai (web and desktop) and Claude Code.

## What do I need before I start?

- **The MCP server URL:** `https://mcp.turbodocx.com/mcp` (streamable HTTP).
- **A TurboDocx API key.** Follow [How to get your credentials](../SDKs/index.md#how-to-get-your-credentials) to create one in **Settings** under **Developers** > **API keys**. Only administrators can create API keys; if you are not an administrator, ask one in your organization to create a key for you.
- **For Claude.ai:** a Claude plan that allows custom connectors.

The connector signs in with your API key only. OAuth sign-in is not available yet, so always choose **No sign-in** and send the key as a request header, as shown below.

## How do I connect TurboDocx to Claude.ai?

These steps work in Claude on the web and in the Claude desktop app.

1. In Claude, open **Settings**, then **Connectors**.
2. Click **Add**.

   ![The Add button on the Connectors page](/img/mcp_connectors/claude_01_plugins_add.png)

3. Click **Add custom connector**.

   ![The Add menu with Add custom connector highlighted](/img/mcp_connectors/claude_02_add_menu_custom_connector.png)

4. In **Name**, type `TurboDocx`.

   ![The Name field in the Add custom connector dialog](/img/mcp_connectors/claude_03_name_field.png)

5. In **MCP server URL**, type `https://mcp.turbodocx.com/mcp`.

   ![The MCP server URL field in the Add custom connector dialog](/img/mcp_connectors/claude_04_url_field.png)

6. Click **Continue**.

   ![The completed name and URL with the Continue button highlighted](/img/mcp_connectors/claude_05_filled_continue.png)

7. Under **Authentication**, select **No sign-in**.
8. Under **Request headers**, click **Add header**.
9. In the header name, type `Authorization`.
10. In the header value, type `Bearer ` followed by your API key, for example `Bearer YOUR_API_KEY`. Keep the space after `Bearer`.
11. Leave **Advanced** as it is. The transport is set from the URL.
12. Click **Add**.

    ![The Add button at the bottom of the Add custom connector dialog](/img/mcp_connectors/claude_08_add_button.png)

TurboDocx now appears in your connectors list. Start a new chat and ask Claude something like "What TurboDocx templates do I have?" to check that it works.

:::note
Claude stores header values securely and does not show them again. To change the key later, remove the connector and add it again with the new key.
:::

## How do I connect TurboDocx to Claude Code?

1. In your terminal, run this command, replacing `YOUR_API_KEY` with your API key:

   ```bash
   claude mcp add --transport http turbodocx https://mcp.turbodocx.com/mcp --header "Authorization: Bearer YOUR_API_KEY"
   ```

2. Start Claude Code and type `/mcp` to check that the `turbodocx` server shows as connected.

By default the server is added for the current project on your machine only. To use it in every project, add `--scope user` to the command. Do not use `--scope project`: it writes the server, including your API key, to a `.mcp.json` file that teams usually commit to source control.

## Can I connect TurboDocx to ChatGPT?

Not yet. ChatGPT connectors require OAuth sign-in, which the TurboDocx MCP server does not offer yet.

## What can Claude do with TurboDocx?

Once connected, Claude can:

- Draft documents from your organization's templates.
- Send documents for signature with TurboSign.
- Build quotes with TurboQuote.
- Read your templates and fill in their variables.

Claude sends, voids or spends only when you ask for it in plain words. Claude has no approval card to confirm these actions, so say exactly what to send and to whom.

Example prompts:

- "Draft a statement of work for ACME Corp from my SOW template and show me the variables before you generate it."
- "Send the ACME Corp services agreement to jane@example.com for signature."
- "Build a quote for ACME Corp with 10 licenses of our Standard package and show it to me before you send anything."

## How do I keep my API key safe?

- Treat your API key like a password. Do not paste it into chats, shared documents or source control.
- Anyone who can use the connector acts as the user who owns the key, with that user's access to templates, documents and signatures.
- If a key leaks, revoke it right away in **Settings** under **Developers** > **API keys**, then create a new key and update your connector.
