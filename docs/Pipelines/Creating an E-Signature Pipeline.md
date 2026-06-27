---
title: Creating an E-Signature Pipeline
sidebar_position: 2
description: Step-by-step walkthrough of the pipeline wizard. Connect a source library, define field extraction and routing, choose signers, and pick a destination for signed documents.
keywords:
  - create e-signature pipeline
  - pipeline wizard
  - automated signing setup
  - sharepoint intake library
  - signer resolution
  - destination folder
  - document routing rules
  - filename pattern
  - audit trail upload
  - pipeline configuration
  - unattended signing setup
  - cloud connector signer
---

# Creating an E-Signature Pipeline

This guide walks you through the pipeline wizard one step at a time. By the end, you'll have an automation that picks up PDFs from a folder, signs them, and files the results — hands-free.

:::info Enterprise feature
Pipelines are an **Enterprise** feature. If you don't see the option to create one, **[Contact us](mailto:team@turbodocx.com)** to enable it for your organization.
:::

<br/>

## Before You Begin

You'll need:

- A **SharePoint document library** to use as your intake folder.
- A **representative sample PDF** — a real example of the kind of document this pipeline will process.
- The details of who should sign these documents.

<br/>

## Step 1: Upload a Sample

Start by uploading a representative sample PDF. The wizard uses this sample to preview every later step against real content, so the fields you define and place line up with the documents you'll actually process.

Choose a PDF that looks like the documents that will flow through this pipeline — same layout, same kind of data.

![The Sample step with the PDF upload area highlighted](/img/creating-an-e-signature-pipeline/step1-sample.png)

:::tip Pick a typical sample
Use a document that represents the *common* case. If most of your invoices follow one layout, upload that layout — not an unusual one-off.
:::

<br/>

## Step 2: Source

Now name the pipeline and connect the source it will watch.

1. **Name the pipeline** something descriptive — for example, "Vendor Invoice Signing" or "NDA Intake."
2. **Connect and pick the SharePoint document library** to watch. This is your **dedicated intake library** — the folder where PDFs are dropped to kick off the pipeline.

Think of the intake library as the pipeline's inbox: anything that lands there gets processed automatically.

![The Source step with the SharePoint source picker highlighted, below the pipeline name field](/img/creating-an-e-signature-pipeline/step2-source.png)

:::tip Use a dedicated library
Create a library used *only* for this pipeline's intake. That keeps unrelated files from being picked up and processed by mistake.
:::

<br/>

## Step 3: Extract & Route

This step defines what the pipeline reads from each document and, optionally, where it sends matched documents.

1. **Define field extraction** — the values to pull out of each PDF (a customer code, a date, an email, an amount). These extracted values can drive filenames, signer lookup, and routing. See **[Field Extraction](./Field%20Extraction)** for the full details and examples.
2. **Set routing rules (optional)** — send documents that match certain text to different destination folders. For example, route anything containing "West Region" to one folder and "East Region" to another. Anything that doesn't match a rule simply lands in the default destination folder you'll choose later.

![The Extract & Route step with the customerCode extraction field highlighted, above the routing rules list](/img/creating-an-e-signature-pipeline/step3-extract-route.png)

:::info Routing is optional
If every document should land in the same place, skip routing — everything goes to the default destination folder.
:::

<br/>

## Step 4: Signers

Tell the pipeline who should sign each document. Choose how the signer is resolved:

- **Static signer** — the same person signs every document that flows through this pipeline.
- **An extracted field** — use a value the pipeline read from the document itself (for example, an email address found in the PDF) to determine the signer per document.
- **A Cloud connector (Enterprise)** — look the signer up in one of your own systems, such as an internal database or API. See **[Cloud Connectors](./Cloud%20Connectors)** for how this works.

Then set the sender identity recipients will see on the signature email:

- **Sender name** — the name that appears as the sender of the signature request.
- **Reply-to email** — the address recipients reach if they reply to the signature email.

![The Signers step with the three signer-resolution options highlighted: fixed email, extracted field, and cloud connector](/img/creating-an-e-signature-pipeline/step4-signers.png)

:::tip Set a recognizable sender
Recipients are more likely to trust and act on an email when the sender name and reply-to address clearly identify your organization.
:::

<br/>

## Step 5: Destination & Review

The final step decides where finished documents go and lets you review everything before saving.

1. **Default destination folder** — where signed PDFs are filed when no routing rule sends them elsewhere.
2. **Filename pattern** — how each signed file is named. You can build the name from extracted values (for example, a customer code or date) so files are easy to find later.
3. **Audit-trail upload** — toggle on to file the signing audit trail alongside each signed PDF.
4. **Error-alert email** — the address that's notified if a document can't be processed, so issues never go unnoticed.
5. **Review and save** — confirm the source, extraction, signer, and destination settings, then save to activate the pipeline.

![The Destination & Review step with the filename pattern builder highlighted, alongside the destination folder, audit-trail toggle, error-alert email, and review summary](/img/creating-an-e-signature-pipeline/step5-destination-review.png)

<br/>

## You're Live 🎉

Once saved, the pipeline starts watching its intake library. From now on, every PDF dropped there is read, signed, and filed automatically — and you'll be alerted by email if anything needs attention.

<br/>

## What's Next?

- **[Field Extraction](./Field%20Extraction)** — pull data out of each document with patterns.
- **[Field Placement](./Field%20Placement)** — position signature and form fields on the sample.
- **[Cloud Connectors](./Cloud%20Connectors)** — resolve signers from your own internal systems.
