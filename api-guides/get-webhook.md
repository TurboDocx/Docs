## Overview

The Get Webhook endpoint returns a webhook's current configuration (URLs, subscribed events, active state), its secret status, delivery statistics for your organization, and the full list of event types you can subscribe to.

## When to use it

Use this endpoint to display a webhook's settings in your own dashboard, to check whether it is active before troubleshooting missing events, or to read `availableEvents` so you can build an event-picker UI without hardcoding the list.

## Request notes

`signature` is the webhook's `name`, not its `id`; every TurboDocx SDK-created webhook uses that name.

## Related endpoints

- [Update Webhook](/docs/API/update-webhook) to change its URLs, events, or active state
- [Get Webhook Stats](/docs/API/get-webhook-stats) for delivery stats scoped to this webhook over a custom period
- [List Webhook Deliveries](/docs/API/list-webhook-deliveries) to inspect individual delivery attempts
