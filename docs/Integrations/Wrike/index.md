---
title: Wrike Integration
sidebar_position: 1
description: Automate document generation from Wrike projects with TurboDocx. Generate SOWs, proposals, and reports directly from your Wrike tasks and folders using AI-powered automation.
keywords:
  - wrike integration
  - wrike document automation
  - wrike to proposal
  - wrike sow generation
  - wrike contract automation
  - wrike project documents
  - wrike ai automation
  - wrike document generation
  - wrike workflow automation
  - wrike api integration
  - wrike project reports
  - wrike presentation automation
  - wrike ai document generation
---

# Automate Document Generation from Wrike Projects

TurboDocx integrates with Wrike to automatically generate professional documents, proposals, and presentations directly from your project management data. When a task status changes in Wrike, TurboDocx can automatically create and attach documents to your projects.

## What You Can Create

- **Statements of Work (SOWs)**: Generate comprehensive SOWs from project folders with timelines and deliverables
- **Project Proposals**: Create proposals from opportunity data in Wrike
- **Status Reports**: Automatically generate project status reports from task data
- **Meeting Summaries**: Turn Wrike tasks into professional meeting documentation
- **Client Deliverables**: Generate client-facing documents from project information
- **Executive Summaries**: Create management reports from Wrike folder data

<br/>

## Before You Begin

:::tip Not a Wrike Admin?
This guide walks you through the entire setup process step-by-step. If you can create a task in Wrike, you can set this up!
:::

You'll need:

- Admin access to your Wrike workspace
- Admin access to your TurboDocx organization
- A template ready in TurboDocx (see [How to Create a Template](../../TurboDocx%20Templating/How%20to%20Create%20a%20Template.md))
- About 5 minutes

<br/>

## How It Works

The Wrike integration uses a **status-triggered automation workflow** that you configure entirely through the TurboDocx UI:

1. **Connect Wrike** to TurboDocx using your Wrike API key
2. **Create an automation** that specifies which trigger status, folder, and template to use
3. When a task status changes to your trigger status, TurboDocx automatically generates the document
4. The finished document is attached back to the Wrike task

<br/>

## Guides

| Guide | Description |
|-------|-------------|
| [Setting Up a Wrike Automation](./setting-up-automation.md) | Connect Wrike and create an automation with a trigger status and folder |
| [Document Generation Automation](./document-generation-automation.md) | Configure an automation to generate documents from a template |
| [E-Signature Automation](./signature-automation.md) | Generate documents and send them for e-signature automatically |
| [Static Field Mapping](./field-mapping.md) | Map Wrike custom fields (revenue, dates, etc.) directly to template variables |
| [Adding Signature Anchors](./signature-anchors.md) | Configure signature anchor fields in your template for TurboSign |

| [Troubleshooting and FAQ](./troubleshooting.md) | Common issues, solutions, and frequently asked questions |

<br/>

## Workflow Ideas

**SOW Generation:**
1. Create a project folder in Wrike with all deliverables as tasks
2. Move the folder to "Generate SOW" status
3. TurboDocx generates a comprehensive SOW from all tasks
4. Review and send to client

**Proposal Automation:**
1. Create an opportunity in Wrike with project details and pricing
2. Change status to "Generate Proposal"
3. Review the AI-generated proposal
4. Change status to "Send for Signature" for digital signing

**Weekly Reporting:**
1. Create a "Weekly Report" task linked to relevant project tasks
2. Every Friday, change the status to "Generate Document"
3. Auto-generated report appears in attachments
