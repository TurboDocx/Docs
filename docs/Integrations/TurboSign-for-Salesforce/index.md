---
title: TurboSign for Salesforce
slug: /Integrations/turbosign-for-salesforce
sidebar_position: 1
description: Send TurboDocx documents for e-signature from any Salesforce record and get the signed PDF, audit trail, and stage update back on the record automatically.
keywords:
  - turbosign salesforce
  - salesforce e-signature
  - salesforce esignature app
  - send for signature salesforce
  - salesforce document signing
  - salesforce signed pdf
  - opportunity e-signature
  - salesforce lease signing
---

# TurboSign for Salesforce

TurboSign for Salesforce lets your team send a TurboDocx document for e-signature straight from a Salesforce record. The document fills itself from the record's fields, the signers come from the record, and when everyone has signed, the signed PDF and its audit trail are saved back to the record. The record can also move to a new stage automatically, for example **Closed Won**.

## How it works

1. An admin builds a **document setup** once: which TurboDocx template to use, which Salesforce fields fill it, who signs, and where each person signs.
2. A sales rep opens a record, clicks **Send for Signature**, reviews the filled-in values and the finished document, and clicks **Send**.
3. Each signer gets an email, verifies their identity if your organization requires it, and signs in the browser.
4. When the last signer finishes, TurboDocx writes the signed PDF and the audit trail to the record's files and updates the stage you chose.

Your TurboDocx API key never sits in a Salesforce field. It is stored encrypted in a Salesforce **External Credential** and added to each request by Salesforce itself, so nobody can read it back from Setup.

## Guides

| If you want to… | Read |
|---|---|
| Set everything up in Salesforce Setup, click by click | [Set up TurboSign for Salesforce](/docs/Integrations/turbosign-for-salesforce/setup) |
| Send a document and see what signers experience | [Send a document for signature](/docs/Integrations/turbosign-for-salesforce/send-and-sign) |
| Script the setup with the Salesforce CLI | [Scripted setup for admins](/docs/Integrations/turbosign-for-salesforce/scripted-setup) |
| Fix an error message | [Troubleshooting](/docs/Integrations/turbosign-for-salesforce/troubleshooting) |

## What you need

- A Salesforce org where you are a System Administrator, on an edition that can run it. See [Which Salesforce orgs can use it](#which-salesforce-orgs-can-use-it).
- A TurboDocx account with TurboSign, plus an **API key** and your **Organization ID**. See [Getting your credentials](/docs/TurboSign/API%20Signatures#getting-your-credentials).
- A TurboDocx template. Every spot where someone signs must already be in the template as a text token, for example `{resident_sig}`.
- The [Salesforce integration](/docs/Integrations/SalesForce) connected in TurboDocx. TurboDocx uses that connection to save the signed PDF back to the record.

## Which Salesforce orgs can use it

Your Salesforce **edition** decides whether TurboSign for Salesforce can run in your org. The **install method** decides who puts it there.

TurboSign for Salesforce includes custom Apex code, so it needs an edition that runs custom Apex.

| Salesforce edition | Can use TurboSign for Salesforce |
|---|---|
| Enterprise | Yes |
| Unlimited | Yes |
| Performance | Yes |
| Developer Edition | Yes |
| Sandboxes of the editions above | Yes |
| Professional | No |
| Group | No |
| Starter, Pro Suite, Essentials | Not supported |

Professional and Group editions block custom Apex unless it ships in a managed package that passed the Salesforce AppExchange security review. TurboSign for Salesforce is not offered that way today. If you are on Starter, Pro Suite, or Essentials, or you are not sure which edition you have, check with your Salesforce account rep.

### How it gets installed

| Method | Who can do it | Upgrades and removal |
|---|---|---|
| **Install link** (coming soon) | Any Salesforce admin in your org, by clicking a link | A new version installs over the old one. Uninstall in one click. |
| **Deploy from source** with the Salesforce CLI | A developer, using `sf project deploy start` | Manual. Deploying to production runs your org's Apex tests, which must reach 75% code coverage. |

The method doesn't change which orgs can run TurboSign for Salesforce. It changes whether your own admin can install it, or whether someone has to deploy it for you. Either way, the person installing needs permission to install packages, which the **System Administrator** profile has.
