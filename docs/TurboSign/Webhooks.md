---
title: TurboSign Webhooks
sidebar_position: 3
description: Configure real-time webhooks to receive instant notifications when TurboSign signature documents are completed or voided. Integrate TurboSign events with your existing systems through secure webhook endpoints.
keywords:
  - webhook configuration
  - signature webhooks
  - turbosign webhooks
  - webhook events
  - document completion webhook
  - document voided webhook
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

Webhooks enable your application to receive real-time notifications when important events occur in TurboSign. Instead of polling for changes, webhooks push event data to your specified endpoints immediately when signature documents are completed or voided.

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

<!-- TODO: Add screenshot of Organization Settings navigation -->
<!-- Screenshot placeholder: Organization settings menu with webhook option highlighted -->

1. **Navigate to Organization Settings**
   - Click on your organization name in the top navigation
   - Select "Organization Settings" from the dropdown

<!-- TODO: Add screenshot of Webhook Configuration button -->
<!-- Screenshot placeholder: TurboSign settings page showing "Configure Webhooks" button -->

2. **Open Webhook Configuration**
   - In the TurboSign section, click "Configure Webhooks"
   - The webhook configuration dialog will open

<!-- TODO: Add screenshot of Webhook Configuration Dialog -->
<!-- Screenshot placeholder: Empty webhook configuration dialog showing URL input and event selection -->

3. **Add Webhook URLs**
   - Enter your webhook endpoint URL(s)
   - You can add up to 5 different URLs
   - Each URL will receive all subscribed events
   - URLs must use HTTPS for production environments

<!-- TODO: Add screenshot of adding multiple webhook URLs -->
<!-- Screenshot placeholder: Dialog showing multiple webhook URL inputs with add/remove buttons -->

4. **Select Events to Subscribe**
   - Choose which events should trigger webhooks:
     - **Signature Document Completed**: Triggered when all signers have completed signing
     - **Signature Document Voided**: Triggered when a document is voided/cancelled

<!-- TODO: Add screenshot of event selection checkboxes -->
<!-- Screenshot placeholder: Event subscription checkboxes with both events selected -->

5. **Save Configuration**
   - Click "Save Configuration" to activate your webhooks
   - Your webhook secret key will be displayed (only shown once for new configurations)
   - **Important**: Copy and securely store your webhook secret - it won't be shown again

<!-- TODO: Add screenshot of successful configuration with secret key -->
<!-- Screenshot placeholder: Success message showing webhook secret key with copy button -->

### Managing Webhook Configuration

#### Viewing Delivery History

The Delivery History tab shows all webhook delivery attempts with detailed information:

<!-- TODO: Add screenshot of Delivery History tab -->
<!-- Screenshot placeholder: Delivery history table showing successful and failed deliveries -->

- **Event Type**: The type of event that triggered the webhook
- **HTTP Status**: Response status code from your endpoint
- **Attempts**: Number of delivery attempts made
- **Timestamps**: When the webhook was created and last updated
- **Actions**: View details or replay failed deliveries

#### Webhook Secret Management

Your webhook secret is used to verify that webhooks are genuinely from TurboDocx:

- **Initial Generation**: A secret is automatically generated when you create a webhook configuration
- **Security**: The secret is only shown in full immediately after generation or regeneration
- **Regeneration**: You can regenerate the secret at any time if compromised
- **Display**: After initial viewing, only a masked version (first 3 + *** + last 3 characters) is shown

<!-- TODO: Add screenshot of secret key management section -->
<!-- Screenshot placeholder: Webhook secret section showing masked secret with regenerate button -->

## Webhook Events

### Signature Document Completed

Triggered when all required signers have successfully signed a document.

**Event Name**: `signature.document.completed`

**Payload Example**:
```json
{
  "event": "signature.document.completed",
  "event_id": "evt_a1b2c3d4e5f6",
  "created_at": "2024-01-15T10:30:00.000Z",
  "version": "1.0",
  "data": {
    "document_id": "doc_abc123def456",
    "title": "Service Agreement - Acme Corp",
    "status": "completed",
    "status_enum": "SignatureDocumentStatus.COMPLETED",
    "completed_at": "2024-01-15T10:30:00.000Z",
    "signature": "b7e3a9c2f1d8e4a5b6c7d8e9f0a1b2c3"
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
  "event_id": "evt_f6e5d4c3b2a1",
  "created_at": "2024-01-15T11:45:00.000Z",
  "version": "1.0",
  "data": {
    "document_id": "doc_xyz789uvw123",
    "title": "Service Agreement - Beta Inc",
    "status": "voided",
    "status_enum": "SignatureDocumentStatus.VOIDED",
    "voided_at": "2024-01-15T11:45:00.000Z",
    "void_reason": "Contract terms changed - new version required",
    "signature": "c8f4b0d3e2a7f5b8c9d0e1f2a3b4c5d6"
  }
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | The type of event (e.g., `signature.document.completed`) |
| `event_id` | string | Unique identifier for this event instance |
| `created_at` | string | ISO 8601 timestamp when the event occurred |
| `version` | string | Webhook payload version (currently "1.0") |
| `data.document_id` | string | Unique identifier of the signature document |
| `data.title` | string | Document title/name |
| `data.status` | string | Human-readable status |
| `data.status_enum` | string | Programmatic status enum value |
| `data.signature` | string | Document content hash for integrity verification |
| `data.completed_at` | string | When the document was completed (completed event only) |
| `data.voided_at` | string | When the document was voided (voided event only) |
| `data.void_reason` | string | Reason for voiding (voided event only) |

## Signature Verification

Every webhook request includes an `X-TurboDocx-Signature` header that you should verify to ensure the webhook is genuinely from TurboDocx.

### How It Works

1. TurboDocx creates a signature using HMAC-SHA256
2. The signature is computed from: `timestamp + "." + request_body`
3. The signature is sent in the `X-TurboDocx-Signature` header
4. Your endpoint verifies this signature using your webhook secret

### Verification Headers

Each webhook request includes these headers:

| Header | Description |
|--------|-------------|
| `X-TurboDocx-Signature` | HMAC signature for verification (format: `sha256=<hex>`) |
| `X-TurboDocx-Timestamp` | Unix timestamp when the webhook was sent |
| `X-TurboDocx-Event` | The event type that triggered this webhook |
| `X-TurboDocx-Delivery-Id` | Unique ID for this delivery attempt (for idempotency) |

### Try it Now

<ScriptLoader 
  scriptPath="webhooks/verification" 
  id="webhook-verification-examples"
  label="Webhook Verification Examples"
/>

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
    "signature.document.completed",
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

## Migration Guide

If you're migrating from polling to webhooks:

1. **Set up webhooks** alongside your existing polling
2. **Run both in parallel** during migration
3. **Verify webhook reliability** over several days
4. **Gradually reduce polling frequency**
5. **Disable polling** once webhooks are proven reliable

## Changelog

### Version 1.0 (Current)
- Initial webhook implementation
- Support for signature document completed and voided events
- HMAC-SHA256 signature verification
- Automatic retry logic with exponential backoff
- Delivery history and manual replay functionality

---

## Next Steps

- [Learn about TurboSign](/docs/TurboSign/Setting-up-TurboSign)
- [Explore API Documentation](/docs/API/turbodocx-api-documentation)
- [View Integration Guides](/docs/Integrations)