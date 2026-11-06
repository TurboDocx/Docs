## Overview

The Replay Webhook Delivery endpoint manually retries a specific past delivery, identified by its `deliveryId`. It creates a brand-new delivery row for the attempt (the original row is left as-is) and immediately re-sends the event to the URL the original delivery was made to (not every URL configured on the webhook, if it has more than one).

## When to use it

Use this endpoint to retry a delivery that permanently failed (exhausted its automatic retries) after you have fixed whatever was wrong with your receiving endpoint, instead of waiting for the same event to occur again.

## Request notes

Get `deliveryId` from [List Webhook Deliveries](/docs/API/list-webhook-deliveries).

## Related endpoints

- [List Webhook Deliveries](/docs/API/list-webhook-deliveries) to find failed deliveries to replay
- [Test Webhook](/docs/API/test-webhook) to send a fresh sample event instead of replaying a past one
- [Get Webhook Stats](/docs/API/get-webhook-stats) to see whether replays are improving your success rate
