## Overview

The Regenerate Webhook Secret endpoint issues a new HMAC secret for your signature webhook and immediately replaces the old one. Use the returned secret to verify the `X-TurboDocx-Signature` header on incoming webhook calls.

## When to use it

Use this endpoint if the current secret may have leaked, or as part of a routine credential rotation. Because the change takes effect immediately, update your webhook receiver's stored secret before or right after calling this endpoint; deliveries signed with the old secret will fail verification on your side as soon as it rotates.

## Related endpoints

- [Get Webhook](/docs/API/get-webhook) to confirm the secret was rotated (`maskedSecret` changes)
- [Update Webhook](/docs/API/update-webhook) to change URLs or events without rotating the secret
- [Test Webhook](/docs/API/test-webhook) to confirm your receiver validates the new secret correctly
