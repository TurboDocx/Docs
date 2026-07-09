---
title: TurboSign Webhooks
sidebar_position: 6
description: Configure real-time webhooks to receive instant notifications across the full TurboSign signature lifecycle — sent, viewed, per-recipient signed, partial progress, completed, voided, and finalization failures. Integrate TurboSign events with your existing systems through secure webhook endpoints.
keywords:
  - webhook configuration
  - signature webhooks
  - turbosign webhooks
  - webhook events
  - signature lifecycle events
  - document sent webhook
  - document viewed webhook
  - recipient signed webhook
  - document signed webhook
  - document completion webhook
  - document voided webhook
  - finalization failed webhook
  - webhook security
  - webhook signature verification
  - hmac signature
  - webhook integration
  - real-time notifications
  - event notifications
  - webhook endpoints
  - webhook payload
  - webhook authentication
  - webhook retry logic
  - webhook delivery history
  - turbodocx api webhooks
  - signature document events
  - webhook best practices
  - webhook troubleshooting
  - webhook secret key
---

# Webhooks

Webhooks enable your application to receive real-time notifications when important events occur in TurboSign. Instead of polling for changes, webhooks push event data to your specified endpoints immediately across the whole signature lifecycle — when a document is sent, viewed, signed by each recipient, completed, voided, or fails to finalize.

![Get It Signed button on TurboDocx homepage](/img/webhooks/webhook-schema.png)

## Overview

TurboSign webhooks provide a robust and secure way to integrate document signature events into your existing workflows. When configured, webhooks will automatically send HTTP POST requests to your specified URLs whenever subscribed events occur.

### Key Features

- **Real-time Notifications**: Receive instant updates when documents are signed or voided
- **Multiple URLs**: Configure up to 5 webhook URLs per configuration
- **Secure Authentication**: HMAC-SHA256 signature verification ensures webhook authenticity
- **Reliable Delivery**: Automatic retry logic with up to 3 attempts per webhook
- **Delivery History**: Track and replay webhook deliveries with detailed logs
- **Event Filtering**: Subscribe only to the events you need

## Configuration

### Setting Up Webhooks

Webhooks can be configured through the TurboSign interface in your organization settings.

1. **Go to the Turbodocx Home Page and click on settings**
   - click on the settings on the sidemenu

![Get It Signed button on TurboDocx homepage](/img/webhooks/home-page.png)

2. **Navigate to Organization Settings**
   - Select "Organization Settings" from the tabs

![Get It Signed button on TurboDocx homepage](/img/webhooks/organization-setting.png)

3. **Open E-Signature Settings and go to the Webhooks tab**

   - Scroll down to the **Core Features** section, find the **Signatures** card, and click **"Configure E-Signature"**

![Organization Settings Core Features section with the Configure E-Signature button on the Signatures card highlighted](/img/webhooks/core-features-section.png)

   - In the **E-Signature Settings** dialog that opens, select the **"Webhooks"** tab

4. **Add Webhook URLs**
   - Enter your webhook endpoint URL(s)
   - You can add up to 5 different URLs
   - Each URL will receive all subscribed events
   - URLs must use HTTPS for production environments

![E-Signature Settings Webhooks tab showing the Webhook URLs field and the Add Another URL button](/img/webhooks/signature-webhook-config.png)

5. **Select Events to Subscribe**
   - Choose which events should trigger webhooks:
     - **Document Sent**: Triggered when a document is sent out for signature (after recipients are notified)
     - **Document Viewed**: Triggered the first time each recipient opens and consents to view the document
     - **Document Progress (Partial)**: Triggered when a signer completes their part but the document is not yet fully signed
     - **Recipient Signed**: Triggered for every individual signer (including the final one) — use this for per-person notifications
     - **Signature Completed**: Triggered when all recipients have signed and the signed PDF is finalized
     - **Finalization Failed**: Triggered when the signed PDF fails to finalize (e.g. KMS signing error); the document is not marked Completed
     - **Signature Voided**: Triggered when a document is voided or cancelled

![Subscribe to Events section with all seven signature webhook events highlighted](/img/webhooks/signature-webhook-config.png)

6. **Save Configuration**
   - Click "Save Configuration" to activate your webhooks
   - Your webhook secret key will be displayed (only shown once for new configurations)
   - **Important**: Copy and securely store your webhook secret - it won't be shown again

![E-Signature Settings Webhooks tab with the Save Configuration button highlighted](/img/webhooks/dill-signature-webhook-config.png)
![Webhook secret key displayed after saving the configuration](/img/webhooks/copy-webhook-secret.png)

### Managing Webhook Configuration

#### Viewing Delivery History

The Delivery History tab shows all webhook delivery attempts with detailed information:

- **Event Type**: The type of event that triggered the webhook
- **HTTP Status**: Response status code from your endpoint
- **Attempts**: Number of delivery attempts made
- **Timestamps**: When the webhook was created and last updated
- **Actions**: View details or replay failed deliveries

![Get It Signed button on TurboDocx homepage](/img/webhooks/delivery-history.png)

#### Webhook Secret Management

Your webhook secret is used to verify that webhooks are genuinely from TurboDocx:

- **Initial Generation**: A secret is automatically generated when you create a webhook configuration
- **Security**: The secret is only shown in full immediately after generation or regeneration
- **Regeneration**: You can regenerate the secret at any time if compromised
- **Display**: After initial viewing, only a masked version (first 3 + \*\*\* + last 3 characters) is shown

![Get It Signed button on TurboDocx homepage](/img/webhooks/regenerate-secret.png)

## Webhook Events

TurboSign emits **seven** subscribable events across the signature lifecycle. Every event shares the same envelope (`event`, `event_id`, `created_at`, `version`, `data`); only the `data` object differs per event.

| Event | Fires when |
| ----- | ---------- |
| `signature.document.sent` | The document is dispatched to recipients |
| `signature.document.viewed` | A recipient opens the document for the first time |
| `signature.document.recipient_signed` | Any individual signer completes their signature (fires once **per signer**) |
| `signature.document.signed` | A signer signs but the document is **not yet complete** (document-level partial progress) |
| `signature.document.completed` | All recipients have signed and the signed PDF is finalized |
| `signature.document.finalization_failed` | The signed PDF fails to finalize (e.g. KMS signing error); the document is **not** completed |
| `signature.document.voided` | The document is voided or cancelled |

### How the signing events fit together

`recipient_signed`, `signed`, and `completed` are easy to confuse. The key distinction:

- **`recipient_signed`** is the **per-person** event. It fires **once for every individual signer**, including the last one, and carries the signer's identity (`recipient_id`, `recipient_email`, `recipient_name`) plus **`is_final_signer`** (true only on the last signature) and `remaining_signers`.
- **`signed`** is a **document-level partial-progress** event. It fires **only when a signer signs and the document is not yet complete** — it carries no `is_final_signer` and does not identify a specific recipient's final state the way `recipient_signed` does.

On each signature, `recipient_signed` **always** fires first. Then exactly one of the following fires:

- **`completed`** — if that was the final signature and finalization succeeded (or **`finalization_failed`** if finalization failed), **or**
- **`signed`** — if signers still remain.

Two consequences worth internalizing:

- **`signed` never fires on the final signature.** Use `completed` (or `recipient_signed` with `is_final_signer: true`) to detect "the whole document is done" — not `signed`.
- **A single-signer document never emits `signed` at all.** It emits `recipient_signed` (`is_final_signer: true`) followed immediately by `completed`.

```text
Recipient signs
   │
   ├─ signature.document.recipient_signed   (always — one per signer)
   │
   └─ more signers remaining?
        ├─ yes → signature.document.signed              (partial progress)
        └─ no  → signature.document.completed           (finalized OK)
                 or signature.document.finalization_failed  (finalization failed)
```

### Signature Document Sent

Triggered once the document is dispatched to recipients (after signature-request emails go out).

**Event Name**: `signature.document.sent`

**Payload Example**:

```json
{
  "event": "signature.document.sent",
  "event_id": "evt_2f8b1c0a4d5e4f6a8b9c0d1e2f3a4b5c",
  "created_at": "2025-08-26T11:30:00.100Z",
  "version": "1.0",
  "data": {
    "document_id": "2dea093d-c38f-4898-b440-43dd9a14cd9d",
    "title": "Statement of Work Example",
    "status": "under_review",
    "sent_at": "2025-08-26T11:30:00.090Z"
  }
}
```

### Signature Document Viewed

Triggered the first time a recipient opens and consents to view the document.

**Event Name**: `signature.document.viewed`

**Payload Example**:

```json
{
  "event": "signature.document.viewed",
  "event_id": "evt_3a9c2d1b5e6f7a8b9c0d1e2f3a4b5c6d",
  "created_at": "2025-08-26T11:35:12.500Z",
  "version": "1.0",
  "data": {
    "document_id": "2dea093d-c38f-4898-b440-43dd9a14cd9d",
    "title": "Statement of Work Example",
    "recipient_id": "b1e2c3d4-5678-4abc-9def-0123456789ab",
    "recipient_email": "signer@example.com",
    "viewed_at": "2025-08-26T11:35:12.480Z"
  }
}
```

### Signature Document Recipient Signed

Triggered for **every individual signer** (including the final one). This is the per-person event — use it for per-recipient notifications. Inspect `is_final_signer` to tell whether this was the last signature.

**Event Name**: `signature.document.recipient_signed`

**Payload Example**:

```json
{
  "event": "signature.document.recipient_signed",
  "event_id": "evt_4b0d3e2c6f7a8b9c0d1e2f3a4b5c6d7e",
  "created_at": "2025-08-26T11:40:05.200Z",
  "version": "1.0",
  "data": {
    "document_id": "2dea093d-c38f-4898-b440-43dd9a14cd9d",
    "title": "Statement of Work Example",
    "recipient_id": "b1e2c3d4-5678-4abc-9def-0123456789ab",
    "recipient_email": "signer@example.com",
    "recipient_name": "Jordan Signer",
    "signed_at": "2025-08-26T11:40:05.180Z",
    "remaining_signers": 1,
    "is_final_signer": false
  }
}
```

### Signature Document Signed (Partial Progress)

Triggered when a signer signs but the document is **not yet complete**. This is a document-level progress event — it does **not** fire on the final signature (that path emits `completed` instead). See [How the signing events fit together](#how-the-signing-events-fit-together).

**Event Name**: `signature.document.signed`

**Payload Example**:

```json
{
  "event": "signature.document.signed",
  "event_id": "evt_5c1e4f3d7a8b9c0d1e2f3a4b5c6d7e8f",
  "created_at": "2025-08-26T11:40:05.400Z",
  "version": "1.0",
  "data": {
    "document_id": "2dea093d-c38f-4898-b440-43dd9a14cd9d",
    "title": "Statement of Work Example",
    "recipient_id": "b1e2c3d4-5678-4abc-9def-0123456789ab",
    "recipient_email": "signer@example.com",
    "signed_at": "2025-08-26T11:40:05.180Z",
    "remaining_signers": 1
  }
}
```

### Signature Document Completed

Triggered when all required signers have successfully signed a document and the signed PDF has been finalized.

**Event Name**: `signature.document.completed`

**Payload Example**:

```json
{
  "event": "signature.document.completed",
  "event_id": "evt_01daa4ba531c42938f861c5a9ce9a5f2",
  "created_at": "2025-08-26T11:44:30.305Z",
  "version": "1.0",
  "data": {
    "document_id": "2dea093d-c38f-4898-b440-43dd9a14cd9d",
    "title": "Document Name",
    "status": "completed",
    "status_enum": "SignatureDocumentStatus.COMPLETED",
    "completed_at": "2025-08-26T11:44:30.299Z",
    "document_hash": "f516c4b9de36a5c9a999ba87abbc93078fdd0c9f6b855590d883d8bfb143308f"
  }
}
```

### Signature Document Finalization Failed

Triggered when all signers have signed but the signed PDF fails to finalize (for example, a KMS/certificate signing error). The document is **not** marked Completed — treat this as a failure path that needs attention.

**Event Name**: `signature.document.finalization_failed`

**Payload Example**:

```json
{
  "event": "signature.document.finalization_failed",
  "event_id": "evt_6d2f5a4e8b9c0d1e2f3a4b5c6d7e8f90",
  "created_at": "2025-08-26T11:44:31.000Z",
  "version": "1.0",
  "data": {
    "document_id": "2dea093d-c38f-4898-b440-43dd9a14cd9d",
    "title": "Statement of Work Example",
    "status": "finalization_failed",
    "failed_at": "2025-08-26T11:44:30.980Z",
    "failure_step": "document_finalization"
  }
}
```

### Signature Document Voided

Triggered when a document is voided or cancelled.

**Event Name**: `signature.document.voided`

**Payload Example**:

```json
{
  "event": "signature.document.voided",
  "event_id": "evt_c825f202658b41ea932871ba13cc52a5",
  "created_at": "2025-08-26T11:42:03.622Z",
  "version": "1.0",
  "data": {
    "document_id": "9eee553b-28b6-4b43-b52b-4ef9957cc503",
    "title": "Statement of Work Example Draft",
    "status": "voided",
    "status_enum": "SignatureDocumentStatus.VOIDED",
    "voided_at": "2025-08-26T11:42:03.582Z",
    "void_reason": "signature not required",
    "document_hash": "b19151b93aed4f8cbcf060030a338dd414c249914eb8d2591c72390a0fa1b754"
  }
}
```

### Payload Fields

Every event shares the top-level envelope fields. The `data` fields present depend on the event — the last column lists which events include each field.

| Field                | Type   | Description                                              | Present on |
| -------------------- | ------ | -------------------------------------------------------- | ---------- |
| `event`              | string | The type of event (e.g., `signature.document.completed`) | All |
| `event_id`           | string | Unique identifier for this event instance                | All |
| `created_at`         | string | ISO 8601 timestamp when the event occurred               | All |
| `version`            | string | Webhook payload version (currently "1.0")                | All |
| `data.document_id`   | string | Unique identifier of the signature document              | All |
| `data.title`         | string | Document title/name                                      | All |
| `data.status`        | string | Human-readable status                                    | sent, completed, finalization_failed, voided |
| `data.status_enum`   | string | Programmatic status enum value                           | completed, voided |
| `data.sent_at`       | string | When the document was dispatched to recipients           | sent |
| `data.recipient_id`  | string | Unique identifier of the recipient                       | viewed, recipient_signed, signed |
| `data.recipient_email` | string | Recipient's email address                              | viewed, recipient_signed, signed |
| `data.recipient_name`  | string | Recipient's display name                               | recipient_signed |
| `data.viewed_at`     | string | When the recipient first viewed the document             | viewed |
| `data.signed_at`     | string | When the signature was applied                           | recipient_signed, signed |
| `data.remaining_signers` | number | Count of signers who have not yet completed            | recipient_signed, signed |
| `data.is_final_signer` | boolean | `true` only when this was the last required signature   | recipient_signed |
| `data.completed_at`  | string | When the document was completed                          | completed |
| `data.document_hash` | string | Document content hash for integrity verification         | completed, voided |
| `data.failed_at`     | string | When finalization failed                                 | finalization_failed |
| `data.failure_step`  | string | Which step failed (e.g. `document_finalization`)         | finalization_failed |
| `data.voided_at`     | string | When the document was voided                             | voided |
| `data.void_reason`   | string | Reason for voiding                                       | voided |

## Signature Verification

Every webhook request includes an `x-turbodocx-signature` header that you should verify to ensure the webhook is genuinely from TurboDocx.

### How It Works

1. TurboDocx creates a signature using HMAC-SHA256
2. The signature is computed from: `timestamp + "." + request_body`
3. The signature is sent in the `x-turbodocx-signature` header
4. Your endpoint verifies this signature using your webhook secret

### Verification Headers

Each webhook request includes these headers:

| Header                    | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `X-TurboDocx-Signature`   | HMAC signature for verification (format: `sha256=<hex>`) |
| `X-TurboDocx-Timestamp`   | Unix timestamp when the webhook was sent                 |
| `X-TurboDocx-Event`       | The event type that triggered this webhook               |
| `X-TurboDocx-Delivery-Id` | Unique ID for this delivery attempt (for idempotency)    |

### Try it Now

<ScriptLoader
  scriptPath="webhooks/verification"
  id="webhook-verification-examples"
  label="Webhook Verification Examples"
/>

### SDK Verification Examples

Our SDKs include built-in webhook verification. The snippets below show the minimum receiver code; for the full SDK reference (createWebhook, updateWebhook, testWebhook, listWebhookDeliveries, replayWebhookDelivery, rotateSecret, framework integration patterns, and gotchas), see the dedicated TurboWebhooks SDK pages:

- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks-javascript)
- [TurboWebhooks Python SDK](/docs/SDKs/webhooks-python)
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks-php)
- [TurboWebhooks Go SDK](/docs/SDKs/webhooks-go)
- [TurboWebhooks Java SDK](/docs/SDKs/webhooks-java)

Here are examples for each language:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="language">
<TabItem value="js" label="JavaScript" default>

```typescript
import { verifyWebhookSignature } from '@turbodocx/sdk';
import express from 'express';

const app = express();

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const isValid = verifyWebhookSignature({
    signature: req.headers['x-turbodocx-signature'],
    timestamp: req.headers['x-turbodocx-timestamp'],
    body: req.body,
    secret: process.env.TURBODOCX_WEBHOOK_SECRET
  });

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body.toString());
  // Process event...
  res.status(200).json({ received: true });
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
from turbodocx import verify_webhook_signature
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.post("/webhook")
async def handle_webhook(request: Request):
    body = await request.body()

    is_valid = verify_webhook_signature(
        signature=request.headers.get("x-turbodocx-signature"),
        timestamp=request.headers.get("x-turbodocx-timestamp"),
        body=body,
        secret=os.environ["TURBODOCX_WEBHOOK_SECRET"]
    )

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid signature")

    event = json.loads(body)
    # Process event...
    return {"received": True}
```

</TabItem>
<TabItem value="go" label="Go">

```go
func webhookHandler(w http.ResponseWriter, r *http.Request) {
    body, _ := io.ReadAll(r.Body)

    isValid := sdk.VerifyWebhookSignature(
        r.Header.Get("X-TurboDocx-Signature"),
        r.Header.Get("X-TurboDocx-Timestamp"),
        body,
        os.Getenv("TURBODOCX_WEBHOOK_SECRET"),
    )

    if !isValid {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }

    var event sdk.WebhookEvent
    json.Unmarshal(body, &event)
    // Process event...
    w.WriteHeader(http.StatusOK)
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
[HttpPost]
public async Task<IActionResult> HandleWebhook()
{
    using var reader = new StreamReader(Request.Body);
    var body = await reader.ReadToEndAsync();

    var isValid = WebhookVerifier.VerifySignature(
        Request.Headers["X-TurboDocx-Signature"],
        Request.Headers["X-TurboDocx-Timestamp"],
        body,
        _configuration["TurboDocx:WebhookSecret"]
    );

    if (!isValid)
        return Unauthorized("Invalid signature");

    var webhookEvent = JsonSerializer.Deserialize<WebhookEvent>(body);
    // Process event...
    return Ok(new { Received = true });
}
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
def turbodocx_webhook
  body = request.raw_post

  is_valid = TurboDocx::WebhookVerifier.verify(
    signature: request.headers['X-TurboDocx-Signature'],
    timestamp: request.headers['X-TurboDocx-Timestamp'],
    body: body,
    secret: ENV['TURBODOCX_WEBHOOK_SECRET']
  )

  unless is_valid
    return render json: { error: 'Invalid signature' }, status: :unauthorized
  end

  event = JSON.parse(body)
  # Process event...
  render json: { received: true }
end
```

</TabItem>
</Tabs>

**Go deeper:** the [TurboWebhooks SDK pages](/docs/SDKs#turbowebhooks-sdks) cover the full management surface (create/update/delete the webhook, test-fire it, rotate the secret, list and replay delivery history) and per-framework receiver patterns (Express, FastAPI, Spring Boot, net/http, Gin, Laravel, …).

### Security Best Practices

1. **Always verify signatures**: Never process webhooks without verifying the signature
2. **Use HTTPS**: Always use HTTPS endpoints in production
3. **Store secrets securely**: Keep webhook secrets in environment variables or secure vaults
4. **Implement timestamp validation**: Reject webhooks with timestamps older than 5 minutes
5. **Use timing-safe comparison**: Prevent timing attacks when comparing signatures
6. **Handle retries idempotently**: Use the `X-TurboDocx-Delivery-Id` to prevent duplicate processing
7. **Respond quickly**: Return 200 OK immediately and process webhooks asynchronously
8. **Log failures**: Keep logs of signature verification failures for security monitoring

## Delivery & Retries

### Delivery Behavior

- **Timeout**: Each delivery attempt has a 10-second timeout
- **Success Criteria**: Only HTTP 2xx status codes are considered successful
- **Retry Logic**: Failed deliveries are automatically retried up to 3 times
- **Retry Schedule**: Exponential backoff between retry attempts
- **Delivery Order**: Webhooks are delivered to all configured URLs in parallel

### Handling Failures

When a webhook delivery fails:

1. **Automatic Retries**: The system will automatically retry failed deliveries
2. **Delivery History**: All attempts are logged in the delivery history
3. **Manual Replay**: You can manually replay failed deliveries from the UI
4. **Error Details**: Response status codes and error messages are captured

<!-- TODO: Add screenshot of delivery details dialog -->
<!-- Screenshot placeholder: Delivery details showing error message and response -->

### Best Practices for Your Endpoint

1. **Return 200 OK quickly**: Process webhooks asynchronously to avoid timeouts
2. **Implement idempotency**: Handle duplicate deliveries gracefully
3. **Queue for processing**: Use a message queue for reliable processing
4. **Monitor your endpoint**: Set up alerting for webhook processing failures
5. **Handle all event types**: Be prepared for new event types in the future

## Testing Webhooks

### Using the Test Feature

You can test your webhook configuration before going live:

1. **Configure your webhook** with your test endpoint URL
2. **Save the configuration** to activate it
3. **Create a test signature document** and complete the signing process
4. **Check the Delivery History** to verify successful delivery
5. **Verify your endpoint** received and processed the webhook correctly

### Development Tools

For local development, consider using:

- **ngrok**: Expose your local server to receive webhooks
- **Webhook.site**: Test webhook payloads without writing code
- **RequestBin**: Inspect webhook requests in real-time
- **Postman**: Simulate webhook requests for testing

### Testing Checklist

- [ ] Webhook endpoint returns 200 OK status
- [ ] Signature verification is working correctly
- [ ] Timestamp validation is implemented
- [ ] All event types are handled
- [ ] Error handling is in place
- [ ] Retry logic is handled idempotently
- [ ] Logs capture webhook processing details
- [ ] Performance under load has been tested

## Troubleshooting

### Common Issues

#### Webhook Not Receiving Events

**Symptoms**: Events occur but webhooks aren't triggered

**Solutions**:

- Verify webhook configuration is saved and active
- Check that you've subscribed to the correct events
- Ensure your endpoint URL is correct and accessible
- Review the Delivery History for error messages

#### Signature Verification Failing

**Symptoms**: 401 Unauthorized responses from your endpoint

**Solutions**:

- Ensure you're using the raw request body (not parsed JSON)
- Verify the webhook secret matches exactly
- Check that header names are lowercase in your code
- Confirm timestamp validation isn't too strict

#### Timeouts

**Symptoms**: Webhook deliveries show timeout errors

**Solutions**:

- Return 200 OK immediately, process asynchronously
- Optimize endpoint performance
- Check network connectivity and firewall rules
- Consider increasing server resources

#### Duplicate Deliveries

**Symptoms**: Same event processed multiple times

**Solutions**:

- Implement idempotency using `X-TurboDocx-Delivery-Id`
- Store processed event IDs temporarily
- Use database constraints to prevent duplicates

### Getting Help

If you encounter issues not covered here:

1. **Check the Delivery History** for detailed error messages
2. **Review your endpoint logs** for processing errors
3. **Test with a simple endpoint** to isolate issues
4. **Contact Support** with your webhook configuration details and error messages

## API Reference

### Webhook Object

```json
{
  "id": "webhook_abc123",
  "orgId": "org_xyz789",
  "name": "signature",
  "urls": [
    "https://api.example.com/webhooks/turbosign",
    "https://backup.example.com/webhooks"
  ],
  "events": [
    "signature.document.sent",
    "signature.document.viewed",
    "signature.document.recipient_signed",
    "signature.document.signed",
    "signature.document.completed",
    "signature.document.finalization_failed",
    "signature.document.voided"
  ],
  "secretExists": true,
  "maskedSecret": "whs***f6a",
  "isActive": true,
  "createdOn": "2024-01-15T09:00:00.000Z",
  "updatedOn": "2024-01-15T09:00:00.000Z"
}
```

### Delivery Object

```json
{
  "id": "delivery_def456",
  "webhookId": "webhook_abc123",
  "eventType": "signature.document.completed",
  "url": "https://api.example.com/webhooks/turbosign",
  "httpStatus": 200,
  "attemptCount": 1,
  "maxAttempts": 3,
  "isDelivered": true,
  "deliveredAt": "2024-01-15T10:30:05.000Z",
  "createdOn": "2024-01-15T10:30:00.000Z",
  "updatedOn": "2024-01-15T10:30:05.000Z"
}
```


---

## Next Steps

- [Learn about TurboSign](/docs/TurboSign/Setting%20up%20TurboSign)
- [Explore API Documentation](/docs/API/turbodocx-api-documentation)
- [View Integration Guides](/docs/Integrations)
