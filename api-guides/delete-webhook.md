## Overview

The Delete Webhook endpoint permanently removes a webhook and all of its delivery history. Unlike [Delete Template](/docs/API/delete-template), this is a hard delete: the webhook row and its delivery records are removed from the database, not deactivated. There is no un-delete.

## When to use it

Use this endpoint when you are decommissioning an integration and no longer want TurboDocx to call your endpoint. If you only want to pause delivery temporarily, use [Update Webhook](/docs/API/update-webhook) with `isActive: false` instead, so you keep the secret and delivery history.

## Related endpoints

- [Get Webhook](/docs/API/get-webhook) to confirm the webhook's configuration before deleting it
- [Update Webhook](/docs/API/update-webhook) to pause delivery instead of deleting
- [Create Webhook](/docs/API/create-webhook) to register a new webhook afterward
