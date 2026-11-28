---
title: Connect TurboDocx to Claude and n8n with MCP
sidebar_label: MCP server (Claude, n8n)
description: Connect TurboDocx to Claude.ai, Claude Code and n8n AI agents through the TurboDocx MCP server with an API key, then draft documents, send for signature and build quotes.
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
  - n8n mcp client
  - n8n ai agent turbodocx
---

# Connect TurboDocx to Claude and n8n with MCP

The TurboDocx MCP server lets an AI assistant work with your TurboDocx organization. Once connected, you can ask it to draft documents from your templates, send documents for signature with TurboSign, and build quotes with TurboQuote.

This page covers Claude.ai (web and desktop), Claude Code and n8n.

Every client connects the same way: it sends your API key in an `Authorization` header with the value `Bearer YOUR_API_KEY`.

## What do I need before I start?

- **The MCP server URL:** `https://mcp.turbodocx.com/mcp` (streamable HTTP).
- **A TurboDocx API key.** Follow [How to get your credentials](../SDKs/index.md#how-to-get-your-credentials) to create one in **Settings** under **Developers** > **API keys**. Only administrators can create API keys; if you are not an administrator, ask one in your organization to create a key for you.
- **For Claude.ai:** a Claude plan that allows custom connectors.

The connector signs in with your API key only. OAuth sign-in is not available yet, so always choose **No sign-in** and send the key as a request header, as shown below.

## How do I connect TurboDocx to Claude.ai?

These steps work in Claude on the web and in the Claude desktop app.

1. In Claude's left sidebar, click **Plugins**.

   ![The Plugins item in Claude's left sidebar](/img/mcp_connectors/claude_00_navigation.png)

2. At the top right of the Plugins page, click **Add**.

   ![The Add button on the Plugins page](/img/mcp_connectors/claude_01_plugins_add.png)

3. Click **Add custom connector**.

   ![The Add menu with Add custom connector highlighted](/img/mcp_connectors/claude_02_add_menu_custom_connector.png)

4. In **Name**, type `TurboDocx`.

   ![The Name field in the Add custom connector dialog](/img/mcp_connectors/claude_03_name_field.png)

5. In **MCP server URL**, type `https://mcp.turbodocx.com/mcp`.

   ![The MCP server URL field in the Add custom connector dialog](/img/mcp_connectors/claude_04_url_field.png)

6. Click **Continue**.

   ![The completed name and URL with the Continue button highlighted](/img/mcp_connectors/claude_05_filled_continue.png)

7. Under **Authentication**, select **No sign-in**.

   Claude shows a notice that the server asked for sign-in and that the connector may fail without it. That is expected: you sign in with your API key in the next step instead.

   ![No sign-in selected under Authentication](/img/mcp_connectors/claude_06_no_sign_in.png)

8. Under **Request headers**, click **+ Add header**.

   ![The Add header button under Request headers](/img/mcp_connectors/claude_07_add_header.png)

9. Fill in the header row:
   - **Header name:** leave it on `authorization`. Claude shows it in lowercase, which is fine: header names are not case-sensitive.
   - **Value:** type `Bearer ` followed by your API key, for example `Bearer YOUR_API_KEY`. Keep the space after `Bearer`. Claude sends the value exactly as you type it.
   - Keep **Required** checked.

   ![The header row filled with authorization and Bearer YOUR_API_KEY](/img/mcp_connectors/claude_07b_header_filled.png)

10. Leave **Advanced** as it is. **Transport** should stay on **Streamable HTTP**.

    ![The Advanced section with Streamable HTTP selected](/img/mcp_connectors/claude_07c_advanced.png)

11. Click **Add**.

    ![The Add button at the bottom of the Add custom connector dialog](/img/mcp_connectors/claude_08_add_button.png)

TurboDocx now appears in your plugins list. Start a new chat and ask Claude something like "What TurboDocx templates do I have?" to check that it works.

:::note
Claude stores header values securely and does not show them again. To change the key later, remove the connector and add it again with the new key.
:::

## How do I connect TurboDocx to Claude Code?

1. In your terminal, run this command, replacing `YOUR_API_KEY` with your API key:

   ```bash
   claude mcp add --transport http turbodocx https://mcp.turbodocx.com/mcp --header "Authorization: Bearer YOUR_API_KEY"
   ```

2. Start Claude Code and type `/mcp` to check that the `turbodocx` server shows as connected.

By default the server is added for the current project on your machine only. To use it in every project, add `--scope user` to the command. Do not use `--scope project` with this command: it writes the server, including your API key, to a `.mcp.json` file that teams usually commit to source control.

### How do I share the connection with my team without sharing the key?

Add the server to the project's `.mcp.json` file and read the key from an environment variable, so the file holds no secret:

```json
{
  "mcpServers": {
    "turbodocx": {
      "type": "http",
      "url": "https://mcp.turbodocx.com/mcp",
      "headers": {
        "Authorization": "Bearer ${TURBODOCX_API_KEY}"
      }
    }
  }
}
```

Each person sets `TURBODOCX_API_KEY` to their own API key before starting Claude Code, for example:

```bash
export TURBODOCX_API_KEY=YOUR_API_KEY
```

Claude Code fills in `${TURBODOCX_API_KEY}` when it connects. If the variable is not set, the server rejects the connection and `/mcp` shows it as failed.

## How do I connect TurboDocx to an n8n AI agent?

n8n's built-in **MCP Client Tool** node lets an n8n **AI Agent** use TurboDocx. You don't need the TurboDocx community node for this.

1. In your workflow, open the **AI Agent** node and add a tool.
2. Choose **MCP Client Tool**.
3. Set the endpoint to `https://mcp.turbodocx.com/mcp`. If the node asks for a transport, choose **HTTP Streamable**.
4. Under **Authentication**, choose **Bearer Auth**.
5. Create a new credential and paste your API key as the bearer token. Paste the key only, without the word `Bearer`: n8n adds it for you.
6. Under **Tools to Include**, choose **All**, or pick only the tools your agent needs.
7. Save the node and run the workflow. Ask the agent something like "List my TurboDocx templates" to check that it works.

To call one TurboDocx tool directly in a workflow step without an agent, use n8n's **MCP Client** node with the same endpoint and bearer credential, then select the tool.

:::tip
An agent can send emails, documents and quotes through these tools. Use **Tools to Include** to give it only the tools it needs, for example leave out the send and void tools if the agent should only draft.
:::

## Can I connect TurboDocx to ChatGPT?

Not yet. ChatGPT connectors require OAuth sign-in, which the TurboDocx MCP server does not offer yet.

## What can an assistant do with TurboDocx?

Once connected, Claude or your n8n agent can:

- Draft documents from your organization's templates.
- Send documents for signature with TurboSign.
- Build quotes with TurboQuote.
- Read your templates and fill in their variables.

The assistant sends, voids or spends only when you ask for it in plain words. There is no approval card to confirm these actions, so say exactly what to send and to whom.

Example prompts:

- "Draft a statement of work for ACME Corp from my SOW template and show me the variables before you generate it."
- "Send the ACME Corp services agreement to jane@example.com for signature."
- "Build a quote for ACME Corp with 10 licenses of our Standard package and show it to me before you send anything."

## How do I keep my API key safe?

- Treat your API key like a password. Do not paste it into chats, shared documents or source control.
- Anyone who can use the connector acts as the user who owns the key, with that user's access to templates, documents and signatures.
- If a key leaks, revoke it right away in **Settings** under **Developers** > **API keys**, then create a new key and update your connector.
