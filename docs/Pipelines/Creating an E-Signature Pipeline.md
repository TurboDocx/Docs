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

This guide walks you through the pipeline wizard one step at a time. By the end, you'll have a hands-free automation that picks up PDFs from a folder, signs them, and files the results.

The wizard has five steps, shown in the progress rail on the left: **Sample**, **Source**, **Extract & Route**, **Sign**, and **Deliver**. This guide follows them in that order.

<br/>

:::info Enterprise feature
Pipelines are an **Enterprise** feature. If you don't see the option to create one, **[Contact us](https://www.turbodocx.com/contact)** to enable it for your organization.
:::

<br/>

## Before You Begin

You'll need:

- **SharePoint connected to TurboDocx.** An administrator must connect your SharePoint or OneDrive account before you can pick an intake library. If it isn't connected yet, open **Pipelines**, click the settings gear, and choose **Connect SharePoint**. This is a one-time setup that includes registering an Azure AD app. See **[Configuring SharePoint or OneDrive](../Advanced%20Configuration/Configuring%20Sharepoint%20or%20OneDrive)** and the **[SharePoint Pipelines Troubleshooting & FAQ](./SharePoint%20Pipelines%20Troubleshooting%20and%20FAQ)** for the full setup.
- A **SharePoint document library** to use as your intake folder.
- A **representative sample PDF**, meaning a real example of the kind of document this pipeline will process.
- The details of who should sign these documents.

<br/>

## Step 1: Upload a Sample

Start by uploading a representative sample PDF. The wizard uses this sample to preview every later step against real content, so the fields you define and place line up with the documents you'll actually process.

Choose a PDF that looks like the documents that will flow through this pipeline, with the same layout and the same kind of data.

![The Sample step with the PDF upload area highlighted](/img/creating-an-e-signature-pipeline/step1-sample.png)

<br/>

:::tip Pick a typical sample
Use a document that represents the *common* case. If most of your invoices follow one layout, upload that layout rather than an unusual one-off.
:::

<br/>

## Step 2: Source

Now name the pipeline and connect the source it will watch. **SharePoint** is the source available today, with more connectors on the way.

1. **Name the pipeline** something descriptive, for example "Vendor Invoice Signing" or "NDA Intake."
2. **Pick the SharePoint document library** to watch. This is your **dedicated intake library**, the folder where PDFs are dropped to kick off the pipeline. If the picker has nothing to choose, SharePoint isn't connected yet, see **Before You Begin** above.

Think of the intake library as the pipeline's inbox: anything that lands there gets processed automatically.

![The Source step with the SharePoint source picker highlighted, below the pipeline name field](/img/creating-an-e-signature-pipeline/step2-source.png)

<br/>

:::tip Use a dedicated library
Create a library used *only* for this pipeline's intake. That keeps unrelated files from being picked up and processed by mistake.
:::

<br/>

### Move Processed Files to a Sent Folder (Optional)

Turn on **Move files to a Sent folder once sent for signing** to keep your intake library tidy. As soon as a document is sent for signing, its original moves out of the intake library into a Sent folder you choose. From then on, the intake library only ever shows what still needs sending.

![The Source step with the Move files to a Sent folder toggle highlighted](/img/creating-an-e-signature-pipeline/step2-source-move-to-sent.png)

<br/>

:::caution Keep the Sent folder separate
The Sent folder must be a different folder from the intake library. If they were the same, moving a file back into the watched library would trigger the pipeline again.
:::

<br/>

## Step 3: Extract & Route

This step defines what the pipeline reads from each document and, optionally, where it sends matched documents.

1. **Define field extraction (optional)**, meaning the values to pull out of each PDF such as a customer code, a date, an email, or an amount. These extracted values can drive filenames, signer lookup, and routing. See **[Field Extraction](./Field%20Extraction)** for the full details and examples.
2. **Set routing rules (optional)** to send documents that match certain text to different destination folders. For example, route anything containing "West Region" to one folder and "East Region" to another. Anything that doesn't match a rule simply lands in the default destination folder you'll choose later.
3. **Place signature fields (required)**. This step also has a **Signature Placement** section. Click **Place Fields**, then click on the sample document to drop signature, date, initial, and other fields. You must place **at least one signature field** before you can continue to the next step. TurboDocx pins each field to the same spot on every document the pipeline processes. See **[Field Placement](./Field%20Placement)** for all the field types and details.

<br/>

:::info Routing and extraction are optional, but signature placement is not
If every document should land in the same place, skip routing and everything goes to the default destination folder. You must still place at least one signature field before you can continue.
:::

<br/>

## Step 4: Signers (the "Sign" step)

Tell the pipeline who should sign each document. Choose how the signer is resolved:

- **Static signer**: the same person signs every document that flows through this pipeline.
- **An extracted field**: use a value the pipeline read from the document itself (for example, an email address found in the PDF) to determine the signer per document.
- **A Cloud connector (Enterprise)**: look the signer up in one of your own systems, such as an internal database or API. See **[Cloud Connectors](./Cloud%20Connectors)** for how this works.

Then set the sender identity recipients will see on the signature email:

- **Sender name**: the name that appears as the sender of the signature request.
- **Reply-to email**: the address recipients reach if they reply to the signature email.

<br/>

:::tip Set a recognizable sender
Recipients are more likely to trust and act on an email when the sender name and reply-to address clearly identify your organization.
:::

<br/>

### What Signers See (Optional)

Two optional fields control how the signature request appears to each signer:

- **Document name shown to signers**: the name signers see for the document in the request email. Leave it blank to use the delivered file name. This is useful when the source file name is a code or an ID that wouldn't mean anything to the signer.
- **Message to signers**: a short note shown in the body of each signer's request email. Leave it blank for no message.

Both fields accept **insert-field** chips, so you can drop in values like the document name or the pipeline name and have them fill in for each document.

![The Signers step with the Document name shown to signers field highlighted, above the Message to signers field](/img/creating-an-e-signature-pipeline/step4-signer-document-name.png)

<br/>

## Step 5: Destination & Review (the "Deliver" step)

The final step decides where finished documents go and lets you review everything before saving. When everything looks right, click **Create Pipeline** to save and activate it.

1. **Default destination folder**: the fallback folder where signed PDFs are filed. Each Step 2 routing rule can send matches to its own folder; anything that matches no rule lands here.
2. **Filename pattern**: how each signed file is named. You can build the name from extracted values (for example, a customer code or date) so files are easy to find later.
3. **Audit-trail upload**: toggle on to file the signing audit trail alongside each signed PDF.
4. **Deliver as a single ZIP file**: toggle on to bundle the signed PDF (and the audit trail, if enabled) into one `.zip` in the destination folder, instead of filing them as separate files.
5. **Notifications**: set who is emailed when a document is signed and delivered, and who is alerted when one fails. A failure recipient is required, so problems never go unnoticed. See **[Pipeline Notifications](./Pipeline%20Notifications)** for default recipients, per-store overrides, and how to customize the completion email.
6. **Review and save**: confirm the source, extraction, signer, and destination settings, then save to activate the pipeline.

To file everything as one archive instead of separate files, turn on **Deliver as a single ZIP file**.

![The Destination step with the Deliver as a single ZIP file toggle highlighted](/img/creating-an-e-signature-pipeline/step5-deliver-as-zip.png)

<br/>

## You're Live 🎉

Once saved, the pipeline starts watching its intake library. From now on, every PDF dropped there is read, signed, and filed automatically, and you'll be alerted by email if anything needs attention.

<br/>

## What's Next?

- **[Pipeline Notifications](./Pipeline%20Notifications)**: choose who is alerted on success and failure, and customize the completion email.
- **[Field Extraction](./Field%20Extraction)**: pull data out of each document with patterns.
- **[Field Placement](./Field%20Placement)**: position signature and form fields on the sample.
- **[Cloud Connectors](./Cloud%20Connectors)**: resolve signers from your own internal systems.
