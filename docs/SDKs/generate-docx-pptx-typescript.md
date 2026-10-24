---
title: "TypeScript DOCX Integration Example"
sidebar_position: 2
sidebar_label: TypeScript
description: "TypeScript example for the TurboDocx SDK: map JSON to template variables, generate a Word or PowerPoint file, and download the DOCX or PPTX and a PDF."
keywords:
  - typescript docx integration
  - typescript pptx sdk
  - typescript docx generation
  - generate docx typescript
  - node.js typescript document generation
  - turbodocx typescript example
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TypeScript DOCX and PPTX Integration Example

The TurboDocx SDK ships its own TypeScript types, so you get autocomplete and compile-time checks for every request. This example defines an interface for your JSON, turns it into typed `DeliverableVariable` objects, fills a Word (.docx) or PowerPoint (.pptx) template, and saves the editable document and a PDF.

The template keeps its fonts, styles and layout. TurboDocx does the rendering on its own servers, so you do not need Microsoft Office, LibreOffice or a document library on your machine.

## Before you start

- **A template.** Create the document in Word or PowerPoint and type a placeholder in curly braces wherever data should go, for example `{ClientName}`. Upload it under **Templates** in TurboDocx.
- **The template ID.** Turn on [Developer Mode](/docs/SDKs/developer-mode), open the template and click **Code**. The code panel shows the template ID and the template's real placeholder names.
- **An API key and your organization ID.** See [Get your credentials](/docs/SDKs#1-get-your-credentials).
- **Node.js 18 or later and TypeScript 4.7 or later.**

:::note Plans
Every plan can generate documents and download the PDF. Downloading the editable DOCX or PPTX file, and using PowerPoint templates, need a paid plan. On the free plan, remove the source-file download from the script and keep the PDF.
:::

## 1. Install the SDK

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @turbodocx/sdk
npm install --save-dev typescript @types/node
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @turbodocx/sdk
yarn add --dev typescript @types/node
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @turbodocx/sdk
pnpm add --save-dev typescript @types/node
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

Save this as `generate.ts`:

```typescript
// generate.ts
import { readFile, writeFile } from "node:fs/promises";
import { Deliverable } from "@turbodocx/sdk";
import type { DeliverableVariable } from "@turbodocx/sdk";

// The shape of your JSON. Each key matches a {placeholder} in the template.
interface ProposalData {
  ClientName: string;
  ProposalDate: string;
  TotalPrice: string;
  ProjectLead: string;
  Scope: string; // HTML
}

// Use "pptx" when your template is a PowerPoint file
const SOURCE_EXT: "docx" | "pptx" = "docx";
const HTML_KEYS = new Set<keyof ProposalData>(["Scope"]);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set the ${name} environment variable`);
  return value;
}

function toVariables(data: ProposalData): DeliverableVariable[] {
  return (Object.keys(data) as (keyof ProposalData)[]).map((key) => ({
    placeholder: `{${key}}`,
    text: data[key],
    mimeType: HTML_KEYS.has(key) ? "html" : "text",
  }));
}

async function main(): Promise<void> {
  Deliverable.configure({
    apiKey: requireEnv("TURBODOCX_API_KEY"),
    orgId: requireEnv("TURBODOCX_ORG_ID"),
  });

  const data = JSON.parse(await readFile("data.json", "utf8")) as ProposalData;

  const result = await Deliverable.generateDeliverable({
    name: `Proposal - ${data.ClientName}`,
    templateId: requireEnv("TURBODOCX_TEMPLATE_ID"),
    variables: toVariables(data),
  });
  const deliverableId = result.results.deliverable.id;
  console.log("Generated deliverable", deliverableId);

  const source = await Deliverable.downloadSourceFile(deliverableId);
  await writeFile(`proposal.${SOURCE_EXT}`, Buffer.from(source));

  const pdf = await Deliverable.downloadPDF(deliverableId);
  await writeFile("proposal.pdf", Buffer.from(pdf));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

`requireEnv` fails fast with a clear message when a variable is missing, and it also satisfies the compiler: `templateId` is a required `string`, so `process.env.TURBODOCX_TEMPLATE_ID` on its own (typed `string | undefined`) does not compile under `strict`. If your project already has a `tsconfig.json`, run the file with your usual build instead of the one-off `tsc` command.

## 5. Run it

```bash
npx tsc generate.ts --target es2022 --module commonjs --strict --types node
node generate.js
```

The script prints the new deliverable ID and writes `proposal.docx` (or `proposal.pptx`) and `proposal.pdf` to the current folder. The generated document also appears under **Deliverables** in TurboDocx.

`generateDeliverable` returns a `CreateDeliverableResponse`; the new document is at `result.results.deliverable`. Both download methods return an `ArrayBuffer`.

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

- [Deliverable SDK reference](/docs/SDKs/deliverable?language=js): every method, option and error type, open on the TypeScript tab.
- [Send the generated document for signature](/docs/SDKs/turbosign#3-turbodocx-deliverable-id): pass the deliverable ID to TurboSign with the same API key.
- [Deliverable API](/docs/API/Deliverable-API): the REST endpoints behind the SDK, with cURL examples.
- [JavaScript / TypeScript SDK setup](/docs/SDKs/javascript): installation and configuration options.
- [Generate DOCX from JSON with TypeScript](https://www.turbodocx.com/guides/generate-docx-from-json-with-typescript): a longer walkthrough on turbodocx.com, with answers to common questions.

The same example is also available in [JavaScript](./generate-docx-pptx-javascript.md), [Python](./generate-docx-pptx-python.md), [PHP](./generate-docx-pptx-php.md), [Ruby](./generate-docx-pptx-ruby.md).
