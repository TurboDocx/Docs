---
title: JavaScript / TypeScript SDK
sidebar_position: 2
sidebar_label: JavaScript / TypeScript
description: Official TurboDocx JavaScript and TypeScript SDK. Full TypeScript support with async/await patterns for document generation and digital signatures.
keywords:
  - turbodocx javascript
  - turbodocx typescript
  - turbosign javascript
  - node.js sdk
  - typescript sdk
  - npm turbodocx
  - document api javascript
  - esignature javascript
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JavaScript / TypeScript SDK

The official TurboDocx SDK for JavaScript and TypeScript applications.

[![npm version](https://img.shields.io/npm/v/@turbodocx/sdk?logo=npm&logoColor=white)](https://www.npmjs.com/package/@turbodocx/sdk)
[![GitHub](https://img.shields.io/github/stars/turbodocx/sdk?style=social)](https://github.com/TurboDocx/SDK)

## Installation

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @turbodocx/sdk
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @turbodocx/sdk
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @turbodocx/sdk
```

</TabItem>
</Tabs>

## Requirements

- Node.js 18+ or modern browser
- TypeScript 4.7+ (optional, for type checking)

---

## Configuration

```typescript
import { TurboSign } from '@turbodocx/sdk';

// Configure globally (recommended for server-side)
TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
```

---

## Quick Start

### Send a Document for Signature

```typescript
import { TurboSign } from '@turbodocx/sdk';

TurboSign.configure({ apiKey: process.env.TURBODOCX_API_KEY });

// Send document with coordinate-based fields
const result = await TurboSign.prepareForSigningSingle({
  fileLink: 'https://example.com/contract.pdf',
  documentName: 'Service Agreement',
  senderName: 'Acme Corp',
  senderEmail: 'contracts@acme.com',
  recipients: [
    { name: 'Alice Smith', email: 'alice@example.com', order: 1 },
    { name: 'Bob Johnson', email: 'bob@example.com', order: 2 }
  ],
  fields: [
    // Alice's signature
    { type: 'signature', page: 1, x: 100, y: 650, width: 200, height: 50, recipientOrder: 1 },
    { type: 'date', page: 1, x: 320, y: 650, width: 100, height: 30, recipientOrder: 1 },
    // Bob's signature
    { type: 'signature', page: 1, x: 100, y: 720, width: 200, height: 50, recipientOrder: 2 },
    { type: 'date', page: 1, x: 320, y: 720, width: 100, height: 30, recipientOrder: 2 }
  ]
});

console.log(`Document ID: ${result.documentId}`);
for (const recipient of result.recipients) {
  console.log(`${recipient.name}: ${recipient.signUrl}`);
}
```

### Using Template-Based Fields

```typescript
// Use text anchors instead of coordinates
const result = await TurboSign.prepareForSigningSingle({
  fileLink: 'https://example.com/contract-with-placeholders.pdf',
  recipients: [
    { name: 'Alice Smith', email: 'alice@example.com', order: 1 }
  ],
  fields: [
    { type: 'signature', anchor: '{SIGNATURE_ALICE}', width: 200, height: 50, recipientOrder: 1 },
    { type: 'date', anchor: '{DATE_ALICE}', width: 100, height: 30, recipientOrder: 1 }
  ]
});
```

---

## API Reference

### TurboSign.configure(options)

Configure the SDK with your API credentials.

```typescript
TurboSign.configure({
  apiKey: string;        // Required: Your TurboDocx API key
  baseUrl?: string;      // Optional: API base URL
  timeout?: number;      // Optional: Request timeout in ms (default: 30000)
});
```

### TurboSign.prepareForReview(options)

Upload a document for preview without sending signature request emails.

```typescript
const { documentId, previewUrl } = await TurboSign.prepareForReview({
  fileLink: 'https://example.com/document.pdf',
  // or upload directly:
  // file: Buffer | Blob,
  documentName: 'Contract Draft',
  recipients: [
    { name: 'John Doe', email: 'john@example.com', order: 1 }
  ],
  fields: [
    { type: 'signature', page: 1, x: 100, y: 500, width: 200, height: 50, recipientOrder: 1 }
  ]
});
```

### TurboSign.prepareForSigningSingle(options)

Upload a document and immediately send signature requests to all recipients.

```typescript
const { documentId, recipients } = await TurboSign.prepareForSigningSingle({
  fileLink: 'https://example.com/document.pdf',
  documentName: 'Service Agreement',
  senderName: 'Your Company',
  senderEmail: 'sender@company.com',
  recipients: [
    { name: 'Recipient Name', email: 'recipient@example.com', order: 1 }
  ],
  fields: [
    { type: 'signature', page: 1, x: 100, y: 500, width: 200, height: 50, recipientOrder: 1 }
  ]
});
```

### TurboSign.getStatus(documentId)

Check the status of a document and its recipients.

```typescript
const status = await TurboSign.getStatus('document-uuid');

console.log(status.status);  // 'pending' | 'completed' | 'voided'
console.log(status.completedAt);  // Date when all signatures completed

for (const recipient of status.recipients) {
  console.log(`${recipient.name}: ${recipient.status}`);  // 'pending' | 'signed'
  console.log(`Signed at: ${recipient.signedAt}`);
}
```

### TurboSign.download(documentId)

Download the completed signed document.

```typescript
const pdfBuffer = await TurboSign.download('document-uuid');

// Save to file (Node.js)
import { writeFileSync } from 'fs';
writeFileSync('signed-contract.pdf', pdfBuffer);

// Or upload to cloud storage
await s3.upload({ Body: pdfBuffer, Key: 'signed-contract.pdf' });
```

### TurboSign.void(documentId, reason?)

Cancel/void a signature request.

```typescript
await TurboSign.void('document-uuid', 'Contract terms changed');
```

### TurboSign.resend(documentId, recipientIds?)

Resend signature request emails to specific recipients.

```typescript
// Resend to all pending recipients
await TurboSign.resend('document-uuid');

// Resend to specific recipients
await TurboSign.resend('document-uuid', ['recipient-uuid-1', 'recipient-uuid-2']);
```

---

## Framework Examples

### Express.js

```typescript
import express from 'express';
import { TurboSign } from '@turbodocx/sdk';

const app = express();
app.use(express.json());

TurboSign.configure({ apiKey: process.env.TURBODOCX_API_KEY });

app.post('/api/send-contract', async (req, res) => {
  try {
    const { recipientName, recipientEmail, contractUrl } = req.body;

    const result = await TurboSign.prepareForSigningSingle({
      fileLink: contractUrl,
      recipients: [{ name: recipientName, email: recipientEmail, order: 1 }],
      fields: [
        { type: 'signature', page: 1, x: 100, y: 650, width: 200, height: 50, recipientOrder: 1 }
      ]
    });

    res.json({ documentId: result.documentId, signUrl: result.recipients[0].signUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/document/:id/status', async (req, res) => {
  try {
    const status = await TurboSign.getStatus(req.params.id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Next.js API Routes

```typescript
// pages/api/send-for-signature.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { TurboSign } from '@turbodocx/sdk';

TurboSign.configure({ apiKey: process.env.TURBODOCX_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipients, documentUrl, fields } = req.body;

  try {
    const result = await TurboSign.prepareForSigningSingle({
      fileLink: documentUrl,
      recipients,
      fields
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### NestJS Service

```typescript
import { Injectable } from '@nestjs/common';
import { TurboSign } from '@turbodocx/sdk';

@Injectable()
export class SignatureService {
  constructor() {
    TurboSign.configure({ apiKey: process.env.TURBODOCX_API_KEY });
  }

  async sendForSignature(documentUrl: string, recipientEmail: string, recipientName: string) {
    return TurboSign.prepareForSigningSingle({
      fileLink: documentUrl,
      recipients: [{ name: recipientName, email: recipientEmail, order: 1 }],
      fields: [
        { type: 'signature', page: 1, x: 100, y: 650, width: 200, height: 50, recipientOrder: 1 }
      ]
    });
  }

  async getDocumentStatus(documentId: string) {
    return TurboSign.getStatus(documentId);
  }

  async downloadSignedDocument(documentId: string) {
    return TurboSign.download(documentId);
  }
}
```

---

## Error Handling

```typescript
import { TurboSign, TurboDocxError, TurboDocxErrorCode } from '@turbodocx/sdk';

try {
  const result = await TurboSign.prepareForSigningSingle({ /* ... */ });
} catch (error) {
  if (error instanceof TurboDocxError) {
    switch (error.code) {
      case TurboDocxErrorCode.UNAUTHORIZED:
        console.error('Invalid API key');
        break;
      case TurboDocxErrorCode.INVALID_DOCUMENT:
        console.error('Could not process document:', error.message);
        break;
      case TurboDocxErrorCode.RATE_LIMITED:
        console.error('Rate limited, retry after:', error.retryAfter);
        break;
      default:
        console.error(`Error ${error.code}: ${error.message}`);
    }
  } else {
    // Network or unexpected error
    throw error;
  }
}
```

---

## TypeScript Types

The SDK exports all types for full TypeScript support:

```typescript
import type {
  SigningRequest,
  SigningResult,
  Recipient,
  Field,
  DocumentStatus,
  TurboDocxError
} from '@turbodocx/sdk';

// Type-safe field creation
const field: Field = {
  type: 'signature',
  page: 1,
  x: 100,
  y: 500,
  width: 200,
  height: 50,
  recipientOrder: 1
};

// Type-safe recipient
const recipient: Recipient = {
  name: 'John Doe',
  email: 'john@example.com',
  order: 1
};
```

---

## Field Types

| Type | Description | Required by Signer |
|:-----|:------------|:-------------------|
| `signature` | Electronic signature drawing/typing | Yes |
| `initials` | Initials field | Yes |
| `text` | Free-form text input | Configurable |
| `date` | Date stamp (auto-filled on signing) | Auto |
| `checkbox` | Checkbox for agreements | Configurable |
| `full_name` | Signer's full name | Auto |
| `email` | Signer's email address | Auto |
| `title` | Job title field | Optional |
| `company` | Company name field | Optional |

---

## Webhook Signature Verification

Verify that webhooks are genuinely from TurboDocx:

```typescript
import { verifyWebhookSignature } from '@turbodocx/sdk';
import express from 'express';

const app = express();

// Use raw body for signature verification
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-turbodocx-signature'] as string;
  const timestamp = req.headers['x-turbodocx-timestamp'] as string;
  const body = req.body;

  const isValid = verifyWebhookSignature({
    signature,
    timestamp,
    body,
    secret: process.env.TURBODOCX_WEBHOOK_SECRET
  });

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(body.toString());

  switch (event.event) {
    case 'signature.document.completed':
      console.log('Document completed:', event.data.document_id);
      break;
    case 'signature.document.voided':
      console.log('Document voided:', event.data.document_id);
      break;
  }

  res.status(200).json({ received: true });
});
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
- [npm Package](https://www.npmjs.com/package/@turbodocx/sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
