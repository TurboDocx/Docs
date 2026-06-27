---
title: TurboDocx Pipelines
sidebar_position: 1
description: Automate document intake, data extraction, signature placement, and e-signature delivery end-to-end. Drop a PDF in a watched folder and TurboDocx Pipelines handles the rest, fully unattended.
keywords:
  - turbodocx pipelines
  - document automation
  - e-signature automation
  - unattended document signing
  - sharepoint document automation
  - automated invoice signing
  - contract intake automation
  - document workflow automation
  - signature pipeline
  - automated document filing
  - audit trail automation
  - cloud connectors
  - enterprise document automation
  - hands-free signing
  - document routing
---

# TurboDocx Pipelines

TurboDocx Pipelines turn a folder into a fully automated signing assembly line. Drop a PDF into a watched location, and the pipeline reads it, places the right signature and form fields, sends it for signature through TurboSign, and files the signed result — all without anyone clicking a button.

:::info Enterprise feature
Pipelines and Cloud Connectors are **Enterprise** features. **[Contact us](mailto:team@turbodocx.com)** to enable them for your organization.
:::

<br/>

## What Is a Pipeline?

A **pipeline** is an automation that watches a source location for new documents and processes each one from start to finish without manual steps. For every PDF that arrives, the pipeline:

1. **Reads the document** and extracts the data you care about (an invoice number, a customer code, a date, an email address).
2. **Places signature and form fields** in the right spots, based on a layout you defined once.
3. **Sends it for signature** through TurboSign to the correct signer.
4. **Files the signed PDF** — plus its audit trail — into a destination folder you choose.

Once it's set up, you never touch it. New documents are picked up, signed, and filed automatically.

<br/>

## The Source → Manipulation → Destination Model

Every pipeline follows the same three-part shape:

### Source

The place the pipeline watches. Today this is a **SharePoint document library** — a "dedicated intake library" where you (or an upstream system) drop PDFs that need signing.

### Manipulation

What happens to each document in flight: **field extraction** pulls values out of the PDF text, **field placement** decides where signature and form fields land, **routing** can send different documents to different destinations, and the document is sent for signature through TurboSign.

### Destination

Where finished work lands. Signed PDFs — and their audit trails — are filed into a destination folder, with a filename pattern you control.

<br/>

## Who It's For

Pipelines are built for teams that handle a steady, repeatable flow of documents that all need the same treatment. Common uses include:

- **Invoice signing** — incoming invoices are signed off and filed automatically.
- **Contract intake** — agreements dropped into a folder are routed to the right signer and archived once complete.
- **Order forms, approvals, and renewals** — any high-volume document that follows a predictable layout.

If your team is manually downloading, signing, and re-filing the same kind of document over and over, a pipeline removes that work entirely.

<br/>

## How It Fits Together

| Stage | What you configure | What happens at runtime |
| --- | --- | --- |
| **Source** | Pick a SharePoint library to watch | New PDFs are picked up automatically |
| **Extract & Route** | Define fields to pull + optional routing rules | Values are read from each document; matches steer the destination |
| **Signers** | Choose how the signer is resolved | The right recipient is determined per document |
| **Field placement** | Drop fields on a sample once | Fields reproject onto each live document |
| **Destination** | Pick a folder, filename pattern, alerts | Signed PDF + audit trail are filed away |

<br/>

## Get Started

Ready to set one up? See **[Creating an E-Signature Pipeline](./Creating%20an%20E-Signature%20Pipeline)** for the step-by-step walkthrough.

<br/>

## Contact Sales

Pipelines and Cloud Connectors are part of TurboDocx's Enterprise offering and are configured with help from our team.

- **Email**: [team@turbodocx.com](mailto:team@turbodocx.com)
- **Schedule a Demo**: See a pipeline process a real document end-to-end.
- **Custom Setup**: We'll help map your intake process to a pipeline tailored to your business.
