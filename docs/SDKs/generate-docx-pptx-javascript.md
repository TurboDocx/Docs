---
title: "JavaScript PPTX SDK: Generate PPTX and DOCX"
sidebar_position: 1
sidebar_label: JavaScript
description: "Copy-paste Node.js example for the TurboDocx JavaScript SDK: fill a Word or PowerPoint template from JSON, then download the DOCX or PPTX and a PDF."
keywords:
  - javascript pptx sdk
  - javascript docx sdk
  - node.js docx generation
  - generate pptx javascript
  - generate docx from json javascript
  - turbodocx javascript example
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generate DOCX and PPTX Files in JavaScript

This example uses the official JavaScript SDK, `@turbodocx/sdk`, from a plain Node.js script. It reads a JSON file, fills a Word (.docx) or PowerPoint (.pptx) template that you uploaded to TurboDocx, and saves two files: the editable document and a PDF.

The template keeps its fonts, styles and layout. TurboDocx does the rendering on its own servers, so you do not need Microsoft Office, LibreOffice or a document library on your machine.

## Before you start

- **A template.** Create the document in Word or PowerPoint and type a placeholder in curly braces wherever data should go, for example `{ClientName}`. Upload it under **Templates** in TurboDocx.
- **The template ID.** Turn on [Developer Mode](/docs/SDKs/developer-mode), open the template and click **Code**. The code panel shows the template ID and the template's real placeholder names.
- **An API key and your organization ID.** See [Get your credentials](/docs/SDKs#1-get-your-credentials).
- **Node.js 18 or later.**

:::note Plans
Every plan can generate documents and download the PDF. Downloading the editable DOCX or PPTX file, and using PowerPoint templates, need a paid plan. On the free plan, remove the source-file download from the script and keep the PDF.
:::

## 1. Install the SDK

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @turbodocx/sdk
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @turbodocx/sdk
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @turbodocx/sdk
```

</TabItem>
</Tabs>

## 2. Set your credentials

Document generation needs only your API key, your organization ID and the template ID:

```bash
export TURBODOCX_API_KEY=your_api_key
export TURBODOCX_ORG_ID=your_org_id
export TURBODOCX_TEMPLATE_ID=your_template_id
```

## 3. Add your data

Save the data as `data.json` next to the script. Each top-level key matches a placeholder in the template, so `ClientName` fills `{ClientName}`.

```json
{
  "ClientName": "Northwind Health",
  "ProposalDate": "November 3, 2026",
  "TotalPrice": "$48,000",
  "ProjectLead": "Priya Shah",
  "Scope": "<ul><li>Discovery workshop</li><li>Template rollout</li><li>Staff training</li></ul>"
}
```

Each placeholder takes one value, so keep the JSON flat. Plain values are sent as `text`. `Scope` holds an HTML list, so the script sends it as `html` and TurboDocx renders it as a real bulleted list in the document.

## 4. Generate the document

Save this as `generate.js`:

```javascript
// generate.js
const fs = require("node:fs");
const { Deliverable } = require("@turbodocx/sdk");

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
});

// Use "pptx" when your template is a PowerPoint file
const SOURCE_EXT = "docx";
// Keys whose values are HTML (lists, tables, bold text)
const HTML_KEYS = new Set(["Scope"]);

async function main() {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

  // One variable per key: "ClientName" fills {ClientName} in the template
  const variables = Object.entries(data).map(([key, value]) => ({
    placeholder: `{${key}}`,
    text: String(value),
    mimeType: HTML_KEYS.has(key) ? "html" : "text",
  }));

  const result = await Deliverable.generateDeliverable({
    name: `Proposal - ${data.ClientName}`,
    templateId: process.env.TURBODOCX_TEMPLATE_ID,
    variables,
  });
  const deliverableId = result.results.deliverable.id;
  console.log("Generated deliverable", deliverableId);

  // The editable file, in the same format as the template
  const source = await Deliverable.downloadSourceFile(deliverableId);
  fs.writeFileSync(`proposal.${SOURCE_EXT}`, Buffer.from(source));

  // The PDF that TurboDocx renders alongside it
  const pdf = await Deliverable.downloadPDF(deliverableId);
  fs.writeFileSync("proposal.pdf", Buffer.from(pdf));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

The script uses CommonJS `require` so it runs as-is with `node`. In an ES module project, `import { Deliverable } from "@turbodocx/sdk"` works too. Using TypeScript? See the [TypeScript example](./generate-docx-pptx-typescript.md).

## 5. Run it

```bash
node generate.js
```

The script prints the new deliverable ID and writes `proposal.docx` (or `proposal.pptx`) and `proposal.pdf` to the current folder. The generated document also appears under **Deliverables** in TurboDocx.

`generateDeliverable` returns the new document under `result.results.deliverable`. Both download methods return an `ArrayBuffer`, which the script wraps in a `Buffer` before writing it to disk.

## Other kinds of values

The `mimeType` of each variable tells TurboDocx how to insert the value:

| `mimeType` | Use it for |
| :-- | :-- |
| `text` | Plain values such as names, dates and amounts |
| `html` | Formatted content such as lists, tables and bold text |
| `markdown` | Content you already have as Markdown |
| `image` | An image URL or base64 image data |

For repeating content, such as one table row per line item, use `variableStack` on a variable instead of flattening the rows yourself. See [Variable Types](/docs/SDKs/deliverable#variable-types) for examples of each.

## Next steps

- [Deliverable SDK reference](/docs/SDKs/deliverable?language=js): every method, option and error type, open on the JavaScript tab.
- [Send the generated document for signature](/docs/SDKs/turbosign#3-turbodocx-deliverable-id): pass the deliverable ID to TurboSign with the same API key.
- [Deliverable API](/docs/API/Deliverable-API): the REST endpoints behind the SDK, with cURL examples.
- [JavaScript SDK setup](/docs/SDKs/javascript): installation and configuration options.
- [Generate DOCX from JSON with JavaScript](https://www.turbodocx.com/guides/generate-docx-from-json-with-javascript): a longer walkthrough on turbodocx.com, with answers to common questions.

The same example is also available in [TypeScript](./generate-docx-pptx-typescript.md), [Python](./generate-docx-pptx-python.md), [PHP](./generate-docx-pptx-php.md), [Ruby](./generate-docx-pptx-ruby.md).
