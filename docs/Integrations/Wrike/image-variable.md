---
title: How to Add a Wrike Image
sidebar_position: 7
description: Turn a TurboDocx variable into images that the Wrike automation pulls from the triggering task or folder's attachments, with optional name filtering.
keywords:
  - wrike image
  - wrike image variable
  - wrike attachments
  - wrike attachment images
  - wrike document images
---

# How to Add a Wrike Image

A **Wrike Image** variable pulls image attachments from the triggering Wrike task or folder into your document. When the Wrike automation runs, TurboDocx attaches the matching images into that variable's place in the template. You can attach all images, or filter them by file name.

This is the image counterpart to the [Wrike Table](./table-variable.md) variable, and it reuses the same configuration flow.

## Prerequisites

- A template uploaded to TurboDocx with at least one variable that is on its own line (a rich-text variable, so injected images have room to render)
- A connected Wrike account (see [Setting Up a Wrike Automation](./setting-up-automation.md))

<br/>

## Configure the image variable

### Step 1: Open the variable menu

On your template's **Details** page, find the variable you want to turn into images, open its three-dot menu, and choose **Wrike Image**.

<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '600px', height: '400px', backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6', borderRadius: '8px', margin: '20px auto', fontSize: '24px', fontWeight: 'bold', color: '#6c757d'}}>
  Screenshots Coming Soon
</div>

### Step 2: Choose which images to attach

- **Attach all images**: every image attachment on the triggering task or folder is included.
- **Filter by name**: include only attachments whose file name contains one of your terms. Enter terms comma-separated; matching is case-insensitive and matches on substrings (for example `logo, header` matches `company-logo.png` and `Header_2024.jpg`).

### Step 3: Set optional limits

- **Max images**: cap how many images are attached (up to 20).
- **Empty state text**: text that renders when no matching images are found.

### Step 4: Save

Click **Save Changes** on the variable. The configuration is stored on the template.

<br/>

## What happens at generation time

Images are injected by the Wrike automation when a document is generated, so a Wrike Image variable is **read-only** on the generation page (it shows an informational banner instead of an input). To enter content manually instead, use **Switch to manual input** on the generation page.

## Notes and limits

- **Image cap**: a maximum of 20 images are attached per variable.
- **PowerPoint**: when generating a PowerPoint (PPTX) document, only PNG and JPEG attachments are injected.

## Related

- [How to Add a Wrike Table](./table-variable.md)
- [How to Setup Static Field Mapping](./field-mapping.md)
- [Setting Up a Wrike Automation](./setting-up-automation.md)
