## Overview

The Get Webhook Stats endpoint returns delivery statistics for this specific webhook over a time window you choose, broken down by event type. Unlike the `deliveryStats` on [Get Webhook](/docs/API/get-webhook) (which cover your whole organization's last 30 days), this endpoint is scoped to one webhook and lets you pick the window.

## When to use it

Use this endpoint to build a delivery health dashboard for a single webhook: overall success rate, average response time, and which event types are failing most, over a period you control.

## Request notes

`days` defaults to `30` and accepts 1 to 365.

## Related endpoints

- [Get Webhook](/docs/API/get-webhook) for the webhook's current configuration
- [List Webhook Deliveries](/docs/API/list-webhook-deliveries) to inspect individual delivery attempts behind these numbers
