## Overview

The Create Webhook endpoint registers a webhook that TurboDocx calls when TurboSign events happen in your organization, such as a document being signed or completed. Each webhook needs a unique `name` among your org's active webhooks; every TurboDocx SDK sends `"signature"`. A second create call with that name conflicts (409) only while an active webhook already has it; if you paused a webhook via [Update Webhook](/docs/API/update-webhook)'s `isActive: false` instead of deleting it, creating a new one with the same name succeeds and leaves two rows sharing that name, and by-name lookups on the other endpoints may then hit either one. Delete the old webhook (see [Delete Webhook](/docs/API/delete-webhook)) before reusing its name, rather than just pausing it.

## When to use it

Use this endpoint once, during integration setup, to start receiving signature lifecycle events instead of polling the API. To change the URLs or subscribed events later, use [Update Webhook](/docs/API/update-webhook) rather than creating a new one.

## Request notes

`urls` accepts up to 10 HTTPS endpoints (plain HTTP is rejected). Each must resolve to a public internet address: a URL whose host is private or internal (such as `localhost`, `10.x.x.x`, `192.168.x.x` or a cloud metadata address), or doesn't resolve at all, is refused with `400` and `"error": "WebhookUrlNotAllowed"`. `events` must be one or more of the values listed in [Get Webhook](/docs/API/get-webhook)'s `availableEvents`. Requires an API key with the administrator role.

## Related endpoints

- [Get Webhook](/docs/API/get-webhook) to view the webhook you created, its delivery stats, and available event types
- [Update Webhook](/docs/API/update-webhook) to change its URLs, events, or active state
- [Test Webhook](/docs/API/test-webhook) to send a sample event before going live
