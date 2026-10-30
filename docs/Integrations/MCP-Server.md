---
title: Connect AI Apps to TurboDocx with MCP
sidebar_label: MCP Server (AI Apps)
sidebar_position: 1
slug: /Integrations/mcp-server
description: Connect Claude Code, Claude Desktop, Cursor, VS Code or any Model Context Protocol client to TurboDocx. Generate documents, send them for signature and build quotes from your AI app with an API key.
keywords:
  - turbodocx mcp
  - mcp server
  - model context protocol
  - claude code mcp
  - claude desktop mcp
  - cursor mcp
  - vs code mcp
  - ai agent document generation
  - ai agent e-signature
  - turbosign mcp
  - turboquote mcp
  - streamable http mcp
  - mcp api key
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Connect AI Apps to TurboDocx with MCP

TurboDocx runs a [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server, so an AI app such as Claude Code, Claude Desktop or Cursor can work in your TurboDocx organization directly. Once it is connected, you can ask your AI app in plain words to fill a template, send a document for signature, check who still has to sign, or build and send a quote, and it calls TurboDocx for you.

Your AI app brings its own model. The server gives it your organization's data and actions plus short written procedures for each area. It does not write content for you.

## What you need

- A TurboDocx account in the organization you want to connect.
- A TurboDocx **API key** for that organization. To create one, open TurboDocx, click your avatar, then **Settings**, then **API keys** (under **Developers**). The key works with the role it was given (administrator, contributor, user or viewer), so pick the role that matches what the AI app should be allowed to do. A viewer key can read but cannot send or change anything.
- An MCP client that supports the **Streamable HTTP** transport and lets you set a request header.

## Server address

```
https://api.turbodocx.com/mcp
```

The server speaks JSON-RPC 2.0 over Streamable HTTP with `POST` requests. It is stateless: it does not issue an `Mcp-Session-Id`, so every request carries its own `Authorization` header. If you open the address in a browser (a `GET`), you are redirected to the TurboDocx website. That is expected and doesn't mean the server is down.

## Authentication

The server accepts a Bearer token in the `Authorization` header. It does not read cookies.

### API key (recommended)

```http
Authorization: Bearer <YOUR_TURBODOCX_API_KEY>
```

**You don't choose the organization with an API key.** Every key belongs to exactly one organization, and the server always uses that organization. If you send an `x-rapiddocx-org-id` header with an API key, the server ignores it, so a prompt or a misconfigured header can't point the AI app at another organization. To work in a different organization, use a key created in that organization.

### OAuth discovery

The server also publishes OAuth 2.0 Protected Resource Metadata ([RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)), so MCP clients can find out where to sign in:

- Any `401` response includes `WWW-Authenticate: Bearer resource_metadata="<metadata URL>"`.
- The metadata document is public JSON:

```bash
curl https://api.turbodocx.com/mcp/.well-known/oauth-protected-resource
```

```json
{
  "resource": "https://mcp.turbodocx.com/mcp",
  "authorization_servers": ["<TurboDocx sign-in server>"],
  "bearer_methods_supported": ["header"]
}
```

A client that signs in this way sends the resulting access token as `Authorization: Bearer <access token>`. Unlike an API key, a signed-in user token doesn't pick an organization by itself: the request must also carry `x-rapiddocx-org-id: <YOUR_ORGANIZATION_ID>`, and the user must be an active member of that organization. You can copy your organization ID from **Settings**, then **Features and integrations**.

:::caution Clients that can only sign in
Some apps (for example, web-based connectors in ChatGPT or claude.ai) can sign in with OAuth but can't add a custom header. Without `x-rapiddocx-org-id`, the server rejects their requests with `401`. For now, use an API key in a client that lets you set headers, such as the ones below.
:::

## Connect your AI app

In every example, replace the placeholder with your API key, or better, keep the key in an environment variable. Never commit an API key to a repository.

<Tabs groupId="mcp-client">
<TabItem value="claude-code" label="Claude Code" default>

Add the server from your terminal:

```bash
export TURBODOCX_API_KEY="<YOUR_TURBODOCX_API_KEY>"

claude mcp add --transport http turbodocx https://api.turbodocx.com/mcp \
  --header "Authorization: Bearer $TURBODOCX_API_KEY"
```

Or commit a project `.mcp.json` that reads the key from the environment, so the key itself stays out of the file:

```json
{
  "mcpServers": {
    "turbodocx": {
      "type": "http",
      "url": "https://api.turbodocx.com/mcp",
      "headers": {
        "Authorization": "Bearer ${TURBODOCX_API_KEY}"
      }
    }
  }
}
```

Run `/mcp` inside Claude Code to check that `turbodocx` shows as connected.

</TabItem>
<TabItem value="claude-desktop" label="Claude Desktop">

Claude Desktop's config file starts local servers, so use the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridge (it needs Node.js) to reach the TurboDocx server with your API key. Open **Settings**, then **Developer**, then **Edit Config**, and add:

```json
{
  "mcpServers": {
    "turbodocx": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://api.turbodocx.com/mcp",
        "--header",
        "Authorization:${TURBODOCX_AUTH_HEADER}"
      ],
      "env": {
        "TURBODOCX_AUTH_HEADER": "Bearer <YOUR_TURBODOCX_API_KEY>"
      }
    }
  }
}
```

The header value is passed through `env` because some systems split command arguments on spaces. Restart Claude Desktop afterwards.

</TabItem>
<TabItem value="cursor" label="Cursor">

Add to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project):

```json
{
  "mcpServers": {
    "turbodocx": {
      "url": "https://api.turbodocx.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:TURBODOCX_API_KEY}"
      }
    }
  }
}
```

</TabItem>
<TabItem value="vscode" label="VS Code">

Add to `.vscode/mcp.json`. VS Code asks for the key once and stores it securely:

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "turbodocx-api-key",
      "description": "TurboDocx API key",
      "password": true
    }
  ],
  "servers": {
    "turbodocx": {
      "type": "http",
      "url": "https://api.turbodocx.com/mcp",
      "headers": {
        "Authorization": "Bearer ${input:turbodocx-api-key}"
      }
    }
  }
}
```

</TabItem>
<TabItem value="generic" label="Any MCP client">

Use these settings in any client that supports remote servers:

| Setting   | Value                                         |
| --------- | --------------------------------------------- |
| Transport | Streamable HTTP                               |
| URL       | `https://api.turbodocx.com/mcp`               |
| Header    | `Authorization: Bearer <YOUR_TURBODOCX_API_KEY>` |

To connect from your own code, use the official TypeScript SDK (`npm install @modelcontextprotocol/sdk`):

```js
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const transport = new StreamableHTTPClientTransport(
  new URL("https://api.turbodocx.com/mcp"),
  { requestInit: { headers: { Authorization: `Bearer ${process.env.TURBODOCX_API_KEY}` } } }
);

const client = new Client({ name: "my-app", version: "1.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
console.log(tools.map((tool) => tool.name));

const templates = await client.callTool({ name: "turbodocx_list_templates", arguments: {} });
console.log(templates.structuredContent); // { total, count, offset, templates, has_more }

await client.close();
```

</TabItem>
<TabItem value="curl" label="curl (raw JSON-RPC)">

Requests must accept both JSON and server-sent events, or the server answers `406 Not Acceptable`:

```bash
curl -X POST https://api.turbodocx.com/mcp \
  -H "Authorization: Bearer $TURBODOCX_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"turbodocx_list_templates","arguments":{}}}'
```

The reply comes back as a server-sent event (`event: message` followed by a `data:` line holding the JSON-RPC result).

</TabItem>
</Tabs>

### Check the connection

Ask your AI app something read-only first, for example "List my TurboDocx templates" or "Which signature documents are still waiting on someone?". You should see it call `turbodocx_list_templates` or `turbosign_list_documents` and answer from your organization's data.

## What your AI app can do

When it connects, your AI app receives short instructions that tell it how TurboDocx works, and it can pull the full procedure for an area with the `turbodocx_guide` tool. The server also offers three prompts that start a task with the right procedure: `draft_document`, `prepare_for_signature` and `quote_from_notes`.

Every tool is scoped to the organization of your API key, and the organization is never a tool argument. Tools marked **Read-only** never change anything. Tools marked **Destructive** cancel, archive or remove something. Some actions that aren't marked destructive still have real effects (sending email or spending a credit), so see [Actions that have real effects](#actions-that-have-real-effects).

### Getting started

| Tool | What it does |
| --- | --- |
| `turbodocx_guide` | Read-only. Returns the step-by-step procedure for `overview`, `documents`, `signatures`, `quotes` or `templates`. |
| `turbodocx_status` | Read-only. One snapshot of what's in flight across signatures, quotes and documents. |

### Signatures (TurboSign)

| Tool | What it does |
| --- | --- |
| `turbosign_list_documents` | Read-only. Lists signature documents, with filters and pagination. |
| `turbosign_get_status` | Read-only. Shows a document's status and who has signed. |
| `turbosign_get_audit_trail` | Read-only. Returns the document's audit trail. |
| `turbosign_download_document` | Read-only. Returns a time-limited download link for the signed PDF of a completed document. |
| `turbosign_create_review_link` | Prepares a document for review without emailing anyone. Uses a signature credit. |
| `turbosign_send_prepared_document` | Destructive. Sends a document you already prepared for review, exactly as prepared. |
| `turbosign_send_signature` | Sends a document to recipients for signature. Emails them. |
| `turbosign_resend_email` | Resends the signature request email to recipients who haven't signed yet. |
| `turbosign_send_reminder` | Sends a reminder to everyone who hasn't signed yet. |
| `turbosign_void_document` | Destructive. Voids a signature document so it can no longer be signed. |

### Documents from templates

| Tool | What it does |
| --- | --- |
| `turbodocx_list_templates` | Read-only. Lists your organization's active templates. |
| `turbodocx_get_template_schema` | Read-only. Lists the variables (placeholders) a template expects. |
| `turbodocx_usual_values` | Read-only. Shows what your organization usually puts in each field of a template. |
| `turbodocx_generate_deliverable` | Generates a new document from a template and variable values. |
| `turbodocx_list_deliverables` | Read-only. Lists documents generated earlier. |
| `turbodocx_get_deliverable` | Read-only. Returns a document's details, with an optional download link. |
| `turbodocx_update_deliverable` | Changes a document's name, description, folder or tags. |

### Your own files and templates

| Tool | What it does |
| --- | --- |
| `turbodocx_request_upload` | Returns a single-use link (valid 15 minutes) to upload a `.docx` or PDF of up to 25 MB. |
| `turbodocx_read_document` | Read-only. Reads an uploaded document or a generated one, paragraph by paragraph. |
| `turbodocx_templatize_document` | Turns an uploaded Word document into a TurboDocx template. |
| `turbodocx_edit_document` | Edits an uploaded Word document and saves the result in TurboDocx. |
| `turbodocx_create_template_from_html` | Creates a template from HTML. |

To give the server a file, your AI app calls `turbodocx_request_upload`, uploads the file with a multipart `POST` to the returned `upload_url` (form field `file`, no other credentials needed), then passes the returned `upload_id` to the next tool.

### Reviews and returned copies

| Tool | What it does |
| --- | --- |
| `turbodocx_review_returned_document` | Read-only. Compares an edited copy of a generated document with the original and lists the changes. |
| `turbodocx_apply_redline` | Applies the changes you accepted from a returned copy. |
| `turbodocx_write_review` | Writes a review into a copy of a document as Word comments and tracked changes. |

### Knowledge base

| Tool | What it does |
| --- | --- |
| `turbodocx_kb_list` | Read-only. Searches or lists your organization's approved, reusable content. |
| `turbodocx_kb_create_entry` | Saves sections as new knowledge base entries. |
| `turbodocx_kb_drift` | Read-only. Shows which templates use an entry and which keep their own copy of its clause. |
| `turbodocx_kb_swap_drift` | Replaces a template's own copy of a clause with the knowledge base entry, so it follows the entry. |

### Quotes (TurboQuote)

| Tool | What it does |
| --- | --- |
| `turboquote_list_quotes` | Read-only. Lists quotes, with filters on status, company, contact and currency. |
| `turboquote_get_quote` | Read-only. Returns a quote with its line items, company and contact. |
| `turboquote_get_quote_pdf` | Read-only. Renders the quote as a PDF and returns a one-hour download link. |
| `turboquote_create_quote_with_items` | Creates a quote with its line items in one call. |
| `turboquote_create_quote` | Creates a quote header without line items. |
| `turboquote_update_quote` | Changes a draft quote's header (customer, price book, name, tax and so on). |
| `turboquote_duplicate_quote` | Copies a quote and its line items into a new draft. |
| `turboquote_add_line_items` | Adds line items to an existing draft quote. |
| `turboquote_update_line_item` | Changes one line item on a draft quote. |
| `turboquote_remove_line_item` | Destructive. Removes one line item from a draft quote. |
| `turboquote_send_quote` | Sends the quote for signature. Generates the PDF and emails the recipient. |
| `turboquote_send_with_deliverable` | Sends the quote together with one of your documents (for example a statement of work) for signature. |
| `turboquote_void_quote` | Destructive. Voids a quote, and its signature request if it was already sent. |

### Quote catalog (products, price books, bundles, categories)

| Tool | What it does |
| --- | --- |
| `turboquote_list_products` | Read-only. Lists catalog products, with a name search. |
| `turboquote_get_product` | Read-only. Returns one product in full. |
| `turboquote_create_product` | Adds a product to the catalog and to every active price book. |
| `turboquote_update_product` | Changes a product. |
| `turboquote_archive_product` | Destructive. Archives a product (hidden, not erased). |
| `turboquote_list_pricebooks` | Read-only. Lists price books. |
| `turboquote_get_pricebook` | Read-only. Returns one price book with its product prices. |
| `turboquote_create_pricebook` | Creates a price book. |
| `turboquote_update_pricebook` | Changes a price book or a product's price in it. |
| `turboquote_archive_pricebook` | Destructive. Archives a price book. Existing quotes keep their prices. |
| `turboquote_list_bundles` | Read-only. Lists product bundles. |
| `turboquote_get_bundle` | Read-only. Returns one bundle with its items. |
| `turboquote_create_bundle` | Creates a bundle of catalog products. |
| `turboquote_update_bundle` | Changes a bundle. |
| `turboquote_archive_bundle` | Destructive. Archives a bundle. Existing quotes are not changed. |
| `turboquote_list_types` | Read-only. Lists categories: product categories, price book types, company industries and bundle categories. |
| `turboquote_create_type` | Adds an entry to one of those category lists. |
| `turboquote_update_type` | Renames a category entry (administrators only). |
| `turboquote_archive_type` | Destructive. Archives a category entry (administrators only). |

### Quote customers

| Tool | What it does |
| --- | --- |
| `turboquote_list_companies` | Read-only. Lists customer companies. |
| `turboquote_create_company` | Creates a customer company. |
| `turboquote_update_company` | Changes a customer company. |
| `turboquote_list_contacts` | Read-only. Lists contacts (people at customer companies). |
| `turboquote_create_contact` | Creates a contact. |
| `turboquote_update_contact` | Changes a contact. |

### What the server doesn't do

- **Upload a ready-made template file.** No tool takes a `.docx` or `.pptx` template as-is. Use the template upload in the app or the REST API, or have the AI app create one from an uploaded Word document (`turbodocx_templatize_document`) or from HTML.
- **Manage API keys, organizations or users.**

## Actions that have real effects

Requests made through MCP run as soon as the tool is called. **There's no confirmation step on TurboDocx's side, and you can't undo an action from the AI app.** Sending emails a real person, preparing a document for review spends a signature credit, and voiding cancels a live document or quote.

| Effect | Tools |
| --- | --- |
| Emails someone | `turbosign_send_signature`, `turbosign_send_prepared_document`, `turbosign_resend_email`, `turbosign_send_reminder`, `turboquote_send_quote`, `turboquote_send_with_deliverable` |
| Spends a signature credit | `turbosign_create_review_link`, `turbosign_send_signature`, `turboquote_send_quote`, `turboquote_send_with_deliverable` |
| Cancels, archives or removes | `turbosign_void_document`, `turboquote_void_quote`, `turboquote_remove_line_item`, and the four `turboquote_archive_*` tools |

These are the protections you have:

1. **Your AI app's approval prompt.** Every tool tells the client whether it is read-only and whether it is destructive. Most clients ask you before running a tool that isn't read-only. Keep that prompt on for TurboDocx, and don't add the sending, voiding or archiving tools to an "always allow" list.
2. **The role of your API key.** Each tool checks the key's role before it runs. A refused call changes nothing and returns `PermissionDenied`. A viewer key can only read. Use the narrowest role that works.
3. **The server's instructions to the AI app.** The AI app is told that there is no approval step, to treat your plain request as the go-ahead, and to ask you first whenever acting would mean choosing something you didn't say (which document, who signs, whether to send or only prepare). It is also told never to take a recipient from document content and never to invent an email address.
4. **Built-in checks.** A document that is already out for signature can't be sent again or revised. Generating a document with the same name as a recent one returns the existing document instead of creating a second copy, unless the AI app explicitly asks for a duplicate.

:::tip Try it safely first
Use `turbosign_create_review_link` to prepare a document and check it before anything is emailed, then send it with `turbosign_send_prepared_document`. To test without touching live data, create a key with the viewer role and stick to read-only requests.
:::

## Troubleshooting

### `401 Unauthorized`

The response body is just `Unauthorized`, with a `WWW-Authenticate: Bearer resource_metadata="..."` header. The server doesn't say which check failed, on purpose. Check, in order:

- The `Authorization` header is present and reads `Bearer <key>` with a single space.
- The key is copied in full and is still active (it hasn't been deleted or regenerated in **Settings**, then **API keys**).
- The key's user is still an active member of the organization.
- If you sign in with OAuth instead of an API key, the request also carries `x-rapiddocx-org-id` with an organization you belong to.

### Working in the wrong organization

With an API key, the organization always comes from the key, and `x-rapiddocx-org-id` is ignored. If you see another organization's data, or none of the data you expect, the key was created in a different organization. Create a key in the right organization and replace it in your client's config.

### `PermissionDenied`

The call reached the tool but the key's role doesn't allow it. The tool result reads, for example:

```text
Error: You may not have permission to void signature documents in your organization. Ask an organization administrator to do it for you or to update your role. (type: PermissionDenied)
```

Nothing was changed. Use a key with a role that allows the action.

### A tool isn't listed, or "Tool ... not found"

The tool list is the same for every role. A role that can't use a tool still sees it and gets `PermissionDenied` when it calls it. If the AI app calls a name that isn't in `tools/list`, the result is:

```text
MCP error -32602: Tool <name> not found
```

Only the tools on this page are available to AI apps. If your app keeps using a name that isn't here, it is guessing. Ask it to call `turbodocx_guide` for the area first, or reconnect so it refreshes the tool list.

### Other errors

| What you see | What it means |
| --- | --- |
| `406 Not Acceptable: Client must accept both application/json and text/event-stream` | Your client (or curl) didn't send `Accept: application/json, text/event-stream`. |
| A redirect to the TurboDocx website | The request was a `GET`. MCP requests are `POST`s. |
| `Error: Document not found (type: DocumentNotFound)` | The ID doesn't exist in your organization. AI apps sometimes pass a document's name where an ID belongs; ask it to list first and use the returned ID. |
| `Error: ... (type: <Type>)` | A business rule refused the call, for example a plan limit. The message says why. |
| `Internal error processing the request. Please retry; if the problem persists, contact support.` | An unexpected server error. Retry, then contact support with the time of the request. |

## Related

- [SDKs](/docs/SDKs) to call TurboDocx from your own code without an AI app.
- [Install with AI Agents](/docs/SDKs/agent-skills) to have a coding agent install and wire up the TurboDocx SDK in your project.
