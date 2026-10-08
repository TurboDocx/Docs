---
slug: "/"
title: "Welcome"
sidebar_position: 1
description: Get started with TurboDocx documentation. Learn document automation, template creation, digital signatures, integrations, and API usage.
keywords:
  - turbodocx
  - document automation
  - template creation
  - getting started
  - digital signatures
  - document generation
---


# Welcome to TurboDocx 

![TurboDocx welcome banner for document automation platform](/img/welcome_to_dev-docs/Welcome.png)

TurboDocx generates DOCX and PPTX documents from templates, collects legally binding e-signatures with TurboSign, and builds sales quotes and proposals with TurboQuote. Every product works from the TurboDocx app, a REST API, or an official SDK, so you can do this by hand or automate it from your own systems.

This page is a map of the documentation. Pick the path that matches what you're trying to do.

## What you need before you start

- A TurboDocx account and access to your organization's [Dashboard](./Dashboard.md).
- For API or SDK work: an API key and organization ID, generated from your organization settings in the app.
- For enterprise setup (SSO, SCIM, SharePoint): admin access to your TurboDocx organization and to your identity provider.

## Generate documents and presentations

TurboDocx Templating turns an existing Word or PowerPoint file into a reusable template with variables, then fills it in to produce a finished document.

- [How to Create a Template](./TurboDocx-Templating/How-to-Create-a-Template.md): turn an existing document into a reusable template.
- [How to Create a Document Template](./TurboDocx-Templating/How-to-Create-a-Document-Template.md) and [How to Create a Presentation Template](./TurboDocx-Templating/How-to-Create-a-Presentation-Template.md): format-specific walkthroughs for Word and PowerPoint.
- [How to Create a Deliverable](./TurboDocx-Templating/How-to-Create-a-Deliverable.md): generate a finished document from a template.
- [Advanced Templating](./Advanced-Configuration/Advanced-Templating.md): loops, conditionals, and expressions for complex templates.

## Get documents signed

TurboSign sends documents for e-signature, tracks who has signed, and keeps the completed audit trail.

- [Setting up TurboSign](./TurboSign/Setting-up-TurboSign.md): send your first document for signature.
- [Managing Your Signatures](./TurboSign/Managing-Your-Signatures.md): resend, remind, void, and download signed documents.
- [API Signatures](./TurboSign/API-Signatures.md): send and track signature requests from your own code.

## Build and send quotes

TurboQuote builds sales quotes and proposals from a product catalog, price books, and line items.

- [Creating a New Quote](./TurboQuote/Creating-a-New-Quote.md): build your first quote.
- [Adding a New Product](./TurboQuote/Adding-a-New-Product.md) and [Bulk Importing from a Spreadsheet](./TurboQuote/Bulk-Importing-from-a-Spreadsheet.md): populate your product catalog.

## Build on the API and SDKs

Every TurboDocx product is also a REST API. Official SDKs cover JavaScript/TypeScript, Python, PHP, Go, Java, and Ruby, so most teams never call the raw API by hand.

- [SDKs Overview](./SDKs/index.md): pick your language, install the client library, and find your API key.
- [Deliverable API](./API/Deliverable-API.md): the document-generation endpoints behind the Deliverable SDKs.

## Connect your other tools

- [Google Drive](./Integrations/Google-Drive.md) and [OneDrive and SharePoint](./Integrations/OneDrive-and-SharePoint.md): import templates from cloud storage and export deliverables back to it.
- [Salesforce](./Integrations/SalesForce.md), [HubSpot](./Integrations/Hubspot.md), [Zoom](./Integrations/Zoom.md), and [Wrike](./Integrations/Wrike/index.md): trigger document generation and signature workflows from the tools your team already uses.
- [TurboDocx Pipelines](./Pipelines/TurboDocx-Pipelines.md): automate document intake, field extraction, and signing end to end.

## Configure your organization

- [Single Sign-On (SSO)](./Advanced-Configuration/Single-Sign-On.md): let your organization authenticate through your own identity provider.
- [SCIM Provisioning](./Advanced-Configuration/SCIM-Provisioning.md): automate user account creation, updates, and deactivation from your identity provider.

## Troubleshooting

If a document, template, or integration isn't behaving as expected, check that specific product's page first, most end with their own troubleshooting section, for example [Template Troubleshooting](./TurboDocx-Templating/Template-Troubleshooting.md). If you can't find an answer there, contact TurboDocx support with the organization name and a description of what you tried.

## Frequently asked questions

**Do I need to write code to use TurboDocx?**
No. Templates, deliverables, quotes, and signature requests can all be created from the TurboDocx app. The API and SDKs exist for teams that want to automate the same actions from their own systems.

**Which document formats does TurboDocx generate?**
DOCX and PPTX from templates, and PDF from TurboSign and document conversion.

**Where do I find my API key and organization ID?**
In your organization settings inside the TurboDocx app. See "How to Get Your Credentials" in the [SDKs Overview](./SDKs/index.md) for the exact steps.

**Is TurboDocx multi-tenant?**
Yes. Access is organized by TurboDocx organization, and enterprise features like SSO and SCIM are configured per organization.