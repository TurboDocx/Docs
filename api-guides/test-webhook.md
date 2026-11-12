## Overview

The Test Webhook endpoint sends a sample event delivery to every URL configured on your signature webhook and returns a per-URL summary of the result. It creates a real delivery record, identical to a delivery triggered by an actual TurboSign event, so it also shows up in [List Webhook Deliveries](/docs/API/list-webhook-deliveries).

## When to use it

Use this endpoint right after creating or updating a webhook to confirm your receiving endpoint is reachable and returns a 2xx response, before relying on it for real signature events.

## Request notes

Both `eventType` and `payload` are optional; omit them to send a default sample payload for a default event type.

## Related endpoints

- [Get Webhook](/docs/API/get-webhook) to confirm the webhook's URLs and events before testing
- [List Webhook Deliveries](/docs/API/list-webhook-deliveries) to review this and past delivery attempts
- [Replay Webhook Delivery](/docs/API/replay-webhook-delivery) to retry a specific failed delivery
