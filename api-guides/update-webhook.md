## Overview

The Update Webhook endpoint changes a webhook's URLs, subscribed events, name, or active state. Every field is optional; send only what you want to change, and the rest is left untouched.

## When to use it

Use this endpoint to rotate delivery URLs, add or remove subscribed event types, or temporarily pause delivery by setting `isActive` to `false` without deleting the webhook and losing its secret and delivery history.

## Request notes

`urls` and `events` each replace the webhook's full list, they do not merge with the existing values. If you include `name`, it must still be unique among your organization's active webhooks.

## Related endpoints

- [Get Webhook](/docs/API/get-webhook) to view the current configuration before editing
- [Regenerate Webhook Secret](/docs/API/regenerate-webhook-secret) to rotate the signing secret without changing anything else
- [Delete Webhook](/docs/API/delete-webhook) to remove the webhook entirely
