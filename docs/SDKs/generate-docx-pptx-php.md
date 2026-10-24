---
title: "PHP DOCX SDK Example: Word and PowerPoint"
sidebar_position: 4
sidebar_label: PHP
description: "Copy-paste PHP example for the TurboDocx SDK: fill a Word or PowerPoint template from JSON with Composer, then save the DOCX or PPTX and a PDF."
keywords:
  - php docx sdk
  - php pptx sdk
  - php generate word document
  - php docx generation
  - generate docx from json php
  - turbodocx php example
---

# PHP DOCX and PPTX SDK Example

This example uses the official PHP SDK, `turbodocx/sdk`, from a command-line script. It reads a JSON file, fills a Word (.docx) or PowerPoint (.pptx) template that you uploaded to TurboDocx, and writes the editable document and a PDF. The same calls work inside a Laravel or Symfony controller.

The template keeps its fonts, styles and layout. TurboDocx does the rendering on its own servers, so you do not need Microsoft Office, LibreOffice or a document library on your machine.

## Before you start

- **A template.** Create the document in Word or PowerPoint and type a placeholder in curly braces wherever data should go, for example `{ClientName}`. Upload it under **Templates** in TurboDocx.
- **The template ID.** Turn on [Developer Mode](/docs/SDKs/developer-mode), open the template and click **Code**. The code panel shows the template ID and the template's real placeholder names.
- **An API key and your organization ID.** See [Get your credentials](/docs/SDKs#1-get-your-credentials).
- **PHP 8.1 or later with the `json` and `fileinfo` extensions, and Composer.**

:::note Plans
Every plan can generate documents and download the PDF. Downloading the editable DOCX or PPTX file, and using PowerPoint templates, need a paid plan. On the free plan, remove the source-file download from the script and keep the PDF.
:::

## 1. Install the SDK

```bash
composer require turbodocx/sdk
```

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

Save this as `generate.php`:

```php
<?php
// generate.php
require __DIR__ . '/vendor/autoload.php';

use TurboDocx\Deliverable;
use TurboDocx\Config\DeliverableConfig;

// Reads TURBODOCX_API_KEY and TURBODOCX_ORG_ID
Deliverable::configure(DeliverableConfig::fromEnvironment());

// Use 'pptx' when your template is a PowerPoint file
const SOURCE_EXT = 'docx';
// Keys whose values are HTML (lists, tables, bold text)
const HTML_KEYS = ['Scope'];

$data = json_decode(file_get_contents('data.json'), true, 512, JSON_THROW_ON_ERROR);

// One variable per key: "ClientName" fills {ClientName} in the template
$variables = [];
foreach ($data as $key => $value) {
    $variables[] = [
        'placeholder' => '{' . $key . '}',
        'text' => (string) $value,
        'mimeType' => in_array($key, HTML_KEYS, true) ? 'html' : 'text',
    ];
}

$result = Deliverable::generateDeliverable([
    'name' => 'Proposal - ' . $data['ClientName'],
    'templateId' => getenv('TURBODOCX_TEMPLATE_ID'),
    'variables' => $variables,
]);
$deliverableId = $result['results']['deliverable']['id'];
echo "Generated deliverable {$deliverableId}\n";

// The editable file, in the same format as the template
file_put_contents('proposal.' . SOURCE_EXT, Deliverable::downloadSourceFile($deliverableId));

// The PDF that TurboDocx renders alongside it
file_put_contents('proposal.pdf', Deliverable::downloadPDF($deliverableId));
```

`DeliverableConfig::fromEnvironment()` reads `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`. In a framework, you can build the config from your own settings instead: `new DeliverableConfig(apiKey: ..., orgId: ...)`.

## 5. Run it

```bash
php generate.php
```

The script prints the new deliverable ID and writes `proposal.docx` (or `proposal.pptx`) and `proposal.pdf` to the current folder. The generated document also appears under **Deliverables** in TurboDocx.

`generateDeliverable` returns an array; the new document is at `$result['results']['deliverable']`. Both download methods return the raw file contents as a string, ready for `file_put_contents`.

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

- [Deliverable SDK reference](/docs/SDKs/deliverable?language=php): every method, option and error type, open on the PHP tab.
- [Send the generated document for signature](/docs/SDKs/turbosign#3-turbodocx-deliverable-id): pass the deliverable ID to TurboSign with the same API key.
- [Deliverable API](/docs/API/Deliverable-API): the REST endpoints behind the SDK, with cURL examples.
- [PHP SDK setup](/docs/SDKs/php): installation and configuration options.

The same example is also available in [JavaScript](./generate-docx-pptx-javascript.md), [TypeScript](./generate-docx-pptx-typescript.md), [Python](./generate-docx-pptx-python.md), [Ruby](./generate-docx-pptx-ruby.md).
