## Overview

The Notify Webhook endpoint sends a one-off event delivery to every URL configured on your signature webhook. It calls the exact same backend logic as [Test Webhook](/docs/API/test-webhook): both accept the same body and return the same response shape. This endpoint exists for API surface symmetry with the "notify" naming some integrations expect; new integrations should call Test Webhook instead.

## When to use it

Use this endpoint (or Test Webhook) to confirm your receiving endpoint handles a TurboSign event correctly, without waiting for a real document to reach that state.

## Request notes

Both `eventType` and `payload` are optional; omit them to send a default sample payload for a default event type.

## Related endpoints

- [Test Webhook](/docs/API/test-webhook) for the same behavior under TurboDocx's documented name
- [List Webhook Deliveries](/docs/API/list-webhook-deliveries) to review past delivery attempts
- [Get Webhook](/docs/API/get-webhook) to check the webhook's configuration first
