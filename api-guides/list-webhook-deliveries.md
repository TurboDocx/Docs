## Overview

The List Webhook Deliveries endpoint returns the individual delivery attempts made to your signature webhook's URLs, newest first, with each attempt's status, HTTP response code, and retry count.

## When to use it

Use this endpoint to build a delivery log for debugging: find which attempts failed, filter to a specific event type, or locate a delivery's `id` to pass to [Replay Webhook Delivery](/docs/API/replay-webhook-delivery).

## Request notes

Supported filters: `eventType`, `isDelivered` (`true`/`false`), and `httpStatus` (an exact status code). `limit` defaults to `20`, `offset` to `0`.

> **Known limitation:** `isDelivered=true` and `httpStatus` do not currently filter results correctly due to a backend issue: `isDelivered=true` returns the same (undelivered-only) results as `isDelivered=false`, and `httpStatus` is ignored entirely regardless of value. Only `isDelivered=false` behaves as documented today.

## Related endpoints

- [Replay Webhook Delivery](/docs/API/replay-webhook-delivery) to manually retry a delivery from this list
- [Get Webhook Stats](/docs/API/get-webhook-stats) for aggregate numbers instead of individual deliveries
- [Test Webhook](/docs/API/test-webhook) to generate a fresh delivery on demand
