---
title: "Python DOCX Generation Example (Word and PowerPoint from JSON)"
sidebar_position: 3
sidebar_label: Python
description: "Copy-paste Python example for the TurboDocx SDK: fill a Word or PowerPoint template from a JSON file with async/await, then save the DOCX or PPTX and a PDF."
keywords:
  - python docx generation
  - python pptx generation
  - generate docx python
  - python word document from json
  - python docx sdk
  - turbodocx python example
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python DOCX and PPTX Generation Example

This example uses the official Python SDK, `turbodocx-sdk`. It reads a JSON file, fills a Word (.docx) or PowerPoint (.pptx) template that you uploaded to TurboDocx, and writes the editable document and a PDF. Unlike libraries such as python-docx, you do not build the document element by element in code: the layout lives in the template, and your script only supplies the data.

The template keeps its fonts, styles and layout. TurboDocx does the rendering on its own servers, so you do not need Microsoft Office, LibreOffice or a document library on your machine.

## Before you start

- **A template.** Create the document in Word or PowerPoint and type a placeholder in curly braces wherever data should go, for example `{ClientName}`. Upload it under **Templates** in TurboDocx.
- **The template ID.** Turn on [Developer Mode](/docs/SDKs/developer-mode), open the template and click **Code**. The code panel shows the template ID and the template's real placeholder names.
- **An API key and your organization ID.** See [Get your credentials](/docs/SDKs#1-get-your-credentials).
- **Python 3.9 or later.**

:::note Plans
Every plan can generate documents and download the PDF. Downloading the editable DOCX or PPTX file, and using PowerPoint templates, need a paid plan. On the free plan, remove the source-file download from the script and keep the PDF.
:::

## 1. Install the SDK

<Tabs>
<TabItem value="pip" label="pip" default>

```bash
pip install turbodocx-sdk
```

</TabItem>
<TabItem value="poetry" label="poetry">

```bash
poetry add turbodocx-sdk
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

Save this as `generate.py`:

```python
# generate.py
import asyncio
import json
import os

from turbodocx_sdk import Deliverable

# Use "pptx" when your template is a PowerPoint file
SOURCE_EXT = "docx"
# Keys whose values are HTML (lists, tables, bold text)
HTML_KEYS = {"Scope"}


async def main():
    Deliverable.configure(
        api_key=os.environ["TURBODOCX_API_KEY"],
        org_id=os.environ["TURBODOCX_ORG_ID"],
    )

    with open("data.json", encoding="utf-8") as f:
        data = json.load(f)

    # One variable per key: "ClientName" fills {ClientName} in the template
    variables = [
        {
            "placeholder": "{" + key + "}",
            "text": str(value),
            "mimeType": "html" if key in HTML_KEYS else "text",
        }
        for key, value in data.items()
    ]

    result = await Deliverable.generate_deliverable(
        name=f"Proposal - {data['ClientName']}",
        template_id=os.environ["TURBODOCX_TEMPLATE_ID"],
        variables=variables,
    )
    deliverable_id = result["results"]["deliverable"]["id"]
    print("Generated deliverable", deliverable_id)

    # The editable file, in the same format as the template
    source = await Deliverable.download_source_file(deliverable_id)
    with open(f"proposal.{SOURCE_EXT}", "wb") as f:
        f.write(source)

    # The PDF that TurboDocx renders alongside it
    pdf = await Deliverable.download_pdf(deliverable_id)
    with open("proposal.pdf", "wb") as f:
        f.write(pdf)


asyncio.run(main())
```

The SDK is async, so the script runs inside `asyncio.run()`. In an async web framework such as FastAPI, `await` the same calls inside your request handler instead. Request keys inside each variable (`placeholder`, `text`, `mimeType`) are camelCase because they go to the API as written; the method arguments (`template_id`, `org_id`) are snake_case.

## 5. Run it

```bash
python generate.py
```

The script prints the new deliverable ID and writes `proposal.docx` (or `proposal.pptx`) and `proposal.pdf` to the current folder. The generated document also appears under **Deliverables** in TurboDocx.

`generate_deliverable` returns a dict; the new document is at `result["results"]["deliverable"]`. Both download methods return `bytes`, so open the output files in binary mode (`"wb"`).

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

- [Deliverable SDK reference](/docs/SDKs/deliverable?language=python): every method, option and error type, open on the Python tab.
- [Send the generated document for signature](/docs/SDKs/turbosign#3-turbodocx-deliverable-id): pass the deliverable ID to TurboSign with the same API key.
- [Deliverable API](/docs/API/Deliverable-API): the REST endpoints behind the SDK, with cURL examples.
- [Python SDK setup](/docs/SDKs/python): installation and configuration options.
- [Generate DOCX from JSON with Python](https://www.turbodocx.com/guides/generate-docx-from-json-with-python): a longer walkthrough on turbodocx.com, with answers to common questions.

The same example is also available in [JavaScript](./generate-docx-pptx-javascript.md), [TypeScript](./generate-docx-pptx-typescript.md), [PHP](./generate-docx-pptx-php.md), [Ruby](./generate-docx-pptx-ruby.md).
