---
title: "Ruby DOCX and PPTX Example (TurboDocx Ruby SDK)"
sidebar_position: 5
sidebar_label: Ruby
description: "Copy-paste Ruby example for the TurboDocx Ruby SDK: fill a Word or PowerPoint template from JSON, then save the DOCX or PPTX and a PDF. Works in plain Ruby or Rails."
keywords:
  - ruby docx example
  - ruby pptx sdk
  - ruby generate word document
  - rails docx generation
  - generate docx from json ruby
  - turbodocx ruby example
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ruby DOCX and PPTX Example

This example uses the official Ruby gem, `turbodocx-sdk`. It reads a JSON file, fills a Word (.docx) or PowerPoint (.pptx) template that you uploaded to TurboDocx, and writes the editable document and a PDF. In a Rails app, the same calls fit in a job or a service object.

The template keeps its fonts, styles and layout. TurboDocx does the rendering on its own servers, so you do not need Microsoft Office, LibreOffice or a document library on your machine.

## Before you start

- **A template.** Create the document in Word or PowerPoint and type a placeholder in curly braces wherever data should go, for example `{ClientName}`. Upload it under **Templates** in TurboDocx.
- **The template ID.** Turn on [Developer Mode](/docs/SDKs/developer-mode), open the template and click **Code**. The code panel shows the template ID and the template's real placeholder names.
- **An API key and your organization ID.** See [Get your credentials](/docs/SDKs#1-get-your-credentials).
- **Ruby 2.7 or later (the gem has no runtime dependencies).**

:::note Plans
Every plan can generate documents and download the PDF. Downloading the editable DOCX or PPTX file, and using PowerPoint templates, need a paid plan. On the free plan, remove the source-file download from the script and keep the PDF.
:::

## 1. Install the SDK

<Tabs>
<TabItem value="gem" label="gem" default>

```bash
gem install turbodocx-sdk
```

</TabItem>
<TabItem value="bundler" label="bundler">

```bash
bundle add turbodocx-sdk
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

Save this as `generate.rb`:

```ruby
# generate.rb
require "json"
require "turbodocx_sdk"

TurboDocxSdk::Deliverable.configure(
  api_key: ENV.fetch("TURBODOCX_API_KEY"),
  org_id:  ENV.fetch("TURBODOCX_ORG_ID")
)

# Use "pptx" when your template is a PowerPoint file
SOURCE_EXT = "docx"
# Keys whose values are HTML (lists, tables, bold text)
HTML_KEYS = ["Scope"].freeze

data = JSON.parse(File.read("data.json"))

# One variable per key: "ClientName" fills {ClientName} in the template.
# Request keys are camelCase strings; the SDK sends them to the API as written.
variables = data.map do |key, value|
  {
    "placeholder" => "{#{key}}",
    "text"        => value.to_s,
    "mimeType"    => HTML_KEYS.include?(key) ? "html" : "text"
  }
end

result = TurboDocxSdk::Deliverable.generate_deliverable(
  "name"       => "Proposal - #{data['ClientName']}",
  "templateId" => ENV.fetch("TURBODOCX_TEMPLATE_ID"),
  "variables"  => variables
)
deliverable_id = result["results"]["deliverable"]["id"]
puts "Generated deliverable #{deliverable_id}"

# The editable file, in the same format as the template
File.binwrite("proposal.#{SOURCE_EXT}", TurboDocxSdk::Deliverable.download_source_file(deliverable_id))

# The PDF that TurboDocx renders alongside it
File.binwrite("proposal.pdf", TurboDocxSdk::Deliverable.download_pdf(deliverable_id))
```

The gem is synchronous and uses only the standard library's `net/http`. Request hashes use camelCase string keys (`"templateId"`, `"mimeType"`) because the gem sends them to the API as written; only the `configure` keyword arguments are snake_case.

## 5. Run it

```bash
ruby generate.rb
```

The script prints the new deliverable ID and writes `proposal.docx` (or `proposal.pptx`) and `proposal.pdf` to the current folder. The generated document also appears under **Deliverables** in TurboDocx.

`generate_deliverable` returns a hash; the new document is at `result["results"]["deliverable"]`. Both download methods return the raw bytes, so write them with `File.binwrite`.

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

- [Deliverable SDK reference](/docs/SDKs/deliverable?language=ruby): every method, option and error type, open on the Ruby tab.
- [Send the generated document for signature](/docs/SDKs/turbosign#3-turbodocx-deliverable-id): pass the deliverable ID to TurboSign with the same API key.
- [Deliverable API](/docs/API/Deliverable-API): the REST endpoints behind the SDK, with cURL examples.
- [Ruby SDK setup](/docs/SDKs/ruby): installation and configuration options.
- [Generate DOCX from JSON with Ruby](https://www.turbodocx.com/guides/generate-docx-from-json-with-ruby): a longer walkthrough on turbodocx.com, with answers to common questions.

The same example is also available in [JavaScript](./generate-docx-pptx-javascript.md), [TypeScript](./generate-docx-pptx-typescript.md), [Python](./generate-docx-pptx-python.md), [PHP](./generate-docx-pptx-php.md).
