---
title: Troubleshooting and FAQ
sidebar_position: 8
description: Troubleshooting common Wrike integration issues and frequently asked questions about TurboDocx document generation from Wrike.
keywords:
  - wrike troubleshooting
  - wrike integration issues
  - wrike document generation errors
  - wrike faq
---

# Troubleshooting and FAQ

## Common Issues

### Document Generation Takes Too Long

**Cause:** Complex templates or AI generation can take 1-2 minutes.

**Solution:**
- Wait at least 2 minutes before assuming failure
- Simplify your template or reduce the number of AI-generated variables
- Check that your Wrike task has sufficient data for the AI to work with

### Document Not Attached to Wrike Task

**Cause:** Generation succeeded but attachment failed.

**Solution:**
1. Check that your Wrike API token has permission to add attachments
2. Verify the Wrike folder/task still exists
3. Re-check your automation configuration in TurboDocx

### Status Not Triggering the Automation

**Cause:** The task status changed to a status that doesn't match your automation's trigger.

**Solution:**
- Open TurboDocx and check which trigger statuses are configured on your automation
- Ensure the Wrike status name matches exactly what you selected during setup
- Verify the task is in a folder that the automation is monitoring

### Folder Permalink Verification Failed

**Cause:** The Wrike folder URL is incorrect or inaccessible.

**Solution:**
1. In Wrike, right-click the folder and select **Copy Link** to get a fresh permalink
2. Verify your Wrike API token has access to the folder
3. Paste the permalink into the automation configuration and try verifying again

### Signature Workflow Not Working

**Cause:** Missing custom fields or document anchors.

**Solution:**
- Ensure `Seller email` and `Customer email` custom fields exist and are populated on the Wrike task
- Verify the document template contains all required signature anchor fields
- Check that TurboSign is configured in your organization
- See the [End-to-End Example](./signature-workflow.md) for full requirements

<br/>

## Security Best Practices

- **Rotate API keys regularly**: Update your Wrike API token periodically
- **Monitor automation activity**: Review your automations in TurboDocx settings
- **Use least-privilege access**: Only grant the minimum Wrike permissions needed
- **Secure your API tokens**: Never share or commit API keys to version control

<br/>

## FAQ

### Can I use multiple templates with the same Wrike folder?

Yes! You can create multiple automations for the same folder, each with a different template and trigger status. Use different trigger statuses to control which automation fires.

### Can I use this with Wrike tasks or only folders?

Both! The automation monitors a specific folder, but the status changes happen on tasks within that folder. You can also monitor entire spaces or projects.

### How do I know if document generation failed?

If document generation fails, the document won't appear as an attachment on your Wrike task. Check your automation configuration and ensure the Wrike task has sufficient data for the template.

### Can the AI use data from multiple Wrike tasks?

Yes! If you trigger from a folder, the AI can access all tasks within that folder. If you trigger from a task, it can access parent/child tasks as well.

### How do I edit or delete an automation?

Open the Wrike integration configuration in TurboDocx (Settings > Integrations > Wrike). You can manage all your automations from the configuration panel.

### Can I create automations for different workflows?

Yes. Each automation is independent — you can set up different trigger statuses, folders, and templates for each one. For example, one automation for proposals and another for SOWs.

<br/>

:::tip Need Help?
Join our [Discord community](https://discord.gg/turbodocx) for support! Our team and community members are ready to help you troubleshoot any issues.
:::
