---
title: Example Signature Workflow With TurboSign
sidebar_position: 7
description: A complete end-to-end example of setting up automated document generation and e-signature from Wrike using TurboDocx and TurboSign.
keywords:
  - wrike signature workflow
  - wrike turbosign
  - wrike digital signature
  - wrike e-signature
  - wrike document signing
  - wrike end to end example
---

# Example Signature Workflow With TurboSign

This page walks through a complete end-to-end example: a Wrike task triggers document generation and sends the result for e-signature — all automatically.

## Scenario

Your sales team uses Wrike to manage project proposals. When a proposal is ready, a team member changes the task status and TurboDocx automatically:

1. Generates a proposal document from a template using Wrike task data
2. Sends it to the client and seller for digital signature via TurboSign
3. Attaches the signed document back to the Wrike task
4. Updates the task status to "Completed"

<br/>

## What You'll Need

| Requirement | Guide |
|-------------|-------|
| A Wrike account connected to TurboDocx | [Setting Up a Wrike Automation](./setting-up-automation.md) |
| A template with signature anchor variables configured | [Adding Signature Anchors](./signature-anchors.md) |
| An e-signature automation created | [E-Signature Automation](./signature-automation.md) |
| TurboSign enabled in your organization | [Setting up TurboSign](../../TurboSign/Setting%20up%20TurboSign.md) |

<br/>

## Step-by-Step Example

### 1. Prepare Your Template

Create a proposal template with your standard content variables (project name, description, pricing, etc.) plus signature anchor variables like `{SalesSigner}` and `{ClientSigner}`.

Configure each signature variable as a **Wrike Signature Field** using the [Adding Signature Anchors](./signature-anchors.md) guide.

### 2. Create the Automation

Follow [Setting Up a Wrike Automation](./setting-up-automation.md) to connect Wrike and configure a trigger status and folder. Then follow [E-Signature Automation](./signature-automation.md) to:

- Select **Send for e-signature** as the action
- Map the recipient email and name fields from your Wrike custom fields
- Map document fields to your template anchor tags
- Choose where the signed document gets attached
- Set the post-signature task status (e.g., "Completed")

### 3. Trigger It

1. Open a Wrike task in the monitored folder
2. Make sure the task has the relevant project data and recipient email fields filled in
3. Change the task status to your trigger status
4. TurboDocx generates the document, sends it for signature, and updates the task when complete

<br/>

## Tips

- **Test with a single task first** before rolling out to your team
- **Use descriptive task data** — the AI uses task titles, descriptions, and custom fields to populate the template
- **Check your anchor tags** — the tags in your [E-Signature Automation](./signature-automation.md) configuration must exactly match the variables in your template
- If something isn't working, see [Troubleshooting and FAQ](./troubleshooting.md)
