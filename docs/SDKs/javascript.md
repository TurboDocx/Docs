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

The official TurboDocx SDK for JavaScript and TypeScript applications. Build document generation and digital signature workflows with full TypeScript support, async/await patterns, and comprehensive error handling. Available on npm as `@turbodocx/sdk`.

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

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { TurboSign } = require("@turbodocx/sdk");

// Configure globally (recommended for server-side)
TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY, // Required : Your TurboDocx API key
  orgId: process.env.TURBODOCX_ORG_ID, // Required: Your organization ID
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { TurboSign } from "@turbodocx/sdk";

// Configure globally (recommended for server-side)
TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "", // Required : Your TurboDocx API key
  orgId: process.env.TURBODOCX_ORG_ID || "", // Required: Your organization ID
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
</Tabs>

:::tip Authentication
Authenticate using `apiKey`. API keys are recommended for server-side applications.
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

---

## Quick Start

### Send a Document for Signature

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { TurboSign } = require("@turbodocx/sdk");

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
});

// Send document with coordinate-based fields
const result = await TurboSign.sendSignature({
  fileLink: "https://example.com/contract.pdf",
  documentName: "Service Agreement",
  senderName: "Acme Corp",
  senderEmail: "contracts@acme.com",
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
    { name: "Bob Johnson", email: "bob@example.com", signingOrder: 2 },
  ],
  fields: [
    // Alice's signature
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "alice@example.com",
    },
    {
      type: "date",
      page: 1,
      x: 320,
      y: 650,
      width: 100,
      height: 30,
      recipientEmail: "alice@example.com",
    },
    // Bob's signature
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 720,
      width: 200,
      height: 50,
      recipientEmail: "bob@example.com",
    },
    {
      type: "date",
      page: 1,
      x: 320,
      y: 720,
      width: 100,
      height: 30,
      recipientEmail: "bob@example.com",
    },
  ],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { TurboSign } from "@turbodocx/sdk";

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
});

// Send document with coordinate-based fields
const result = await TurboSign.sendSignature({
  fileLink: "https://example.com/contract.pdf",
  documentName: "Service Agreement",
  senderName: "Acme Corp",
  senderEmail: "contracts@acme.com",
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
    { name: "Bob Johnson", email: "bob@example.com", signingOrder: 2 },
  ],
  fields: [
    // Alice's signature
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "alice@example.com",
    },
    {
      type: "date",
      page: 1,
      x: 320,
      y: 650,
      width: 100,
      height: 30,
      recipientEmail: "alice@example.com",
    },
    // Bob's signature
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 720,
      width: 200,
      height: 50,
      recipientEmail: "bob@example.com",
    },
    {
      type: "date",
      page: 1,
      x: 320,
      y: 720,
      width: 100,
      height: 30,
      recipientEmail: "bob@example.com",
    },
  ],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

### Using Template-Based Fields

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Use text anchors instead of coordinates
const result = await TurboSign.sendSignature({
  fileLink: "https://example.com/contract-with-placeholders.pdf",
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
    {
      type: "date",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{DATE_ALICE}",
        placement: "replace",
        size: { width: 100, height: 30 },
      },
    },
  ],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Use text anchors instead of coordinates
const result = await TurboSign.sendSignature({
  fileLink: "https://example.com/contract-with-placeholders.pdf",
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
    {
      type: "date",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{DATE_ALICE}",
        placement: "replace",
        size: { width: 100, height: 30 },
      },
    },
  ],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.

**Alternative:** Use a TurboDocx template with pre-configured anchors:

```typescript
const result = await TurboSign.sendSignature({
  templateId: "template-uuid-from-turbodocx", // Template already contains anchors
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
  ],
});
```

:::

---

## File Input Methods

TurboSign supports four different ways to provide document files:

### 1. File Upload (Buffer/Blob)

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { readFileSync } = require("fs");
const { TurboSign } = require("@turbodocx/sdk");

const fileBuffer = readFileSync("./contract.pdf");

const result = await TurboSign.sendSignature({
  file: fileBuffer,
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { readFileSync } from "fs";
import { TurboSign } from "@turbodocx/sdk";

const fileBuffer = readFileSync("./contract.pdf");

const result = await TurboSign.sendSignature({
  file: fileBuffer,
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

### 2. File URL (fileLink)

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.sendSignature({
  fileLink: "https://storage.example.com/contracts/agreement.pdf",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.sendSignature({
  fileLink: "https://storage.example.com/contracts/agreement.pdf",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

:::tip When to use fileLink
Use `fileLink` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

### 3. TurboDocx Deliverable ID

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Use a previously generated TurboDocx document
const result = await TurboSign.sendSignature({
  deliverableId: "deliverable-uuid-from-turbodocx",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Use a previously generated TurboDocx document
const result = await TurboSign.sendSignature({
  deliverableId: "deliverable-uuid-from-turbodocx",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

:::info Integration with TurboDocx
`deliverableId` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

### 4. TurboDocx Template ID

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Use a pre-configured TurboSign template
const result = await TurboSign.sendSignature({
  templateId: "template-uuid-from-turbodocx", // Template already contains anchors
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Use a pre-configured TurboSign template
const result = await TurboSign.sendSignature({
  templateId: "template-uuid-from-turbodocx", // Template already contains anchors
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
  ],
});
```

</TabItem>
</Tabs>

:::info Integration with TurboDocx
`templateId` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

---

## API Reference

### Configure

Configure the SDK with your API credentials and organization settings.

```typescript
TurboSign.configure({
  apiKey: string;        // Required : Your TurboDocx API key
  orgId: string;         // Required: Your organization ID
  baseUrl?: string;      // Optional: API base URL (default: 'https://api.turbodocx.com')
});
```

**Example:**

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { TurboSign } = require("@turbodocx/sdk");

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
  // Optional: override for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { TurboSign } from "@turbodocx/sdk";

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
  // Optional: override for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
</Tabs>

:::warning API Credentials Required
Both `apiKey` and `orgId` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

### Prepare for review

Upload a document for preview without sending signature request emails.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { documentId, previewUrl } = await TurboSign.createSignatureReviewLink({
  fileLink: "https://example.com/document.pdf",
  documentName: "Contract Draft",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const { documentId, previewUrl } = await TurboSign.createSignatureReviewLink({
  fileLink: "https://example.com/document.pdf",
  documentName: "Contract Draft",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

### Prepare for signing

Upload a document and immediately send signature requests to all recipients.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { documentId } = await TurboSign.sendSignature({
  fileLink: "https://example.com/document.pdf",
  documentName: "Service Agreement",
  senderName: "Your Company",
  senderEmail: "sender@company.com",
  recipients: [
    { name: "Recipient Name", email: "recipient@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 50,
      recipientEmail: "recipient@example.com",
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const { documentId } = await TurboSign.sendSignature({
  fileLink: "https://example.com/document.pdf",
  documentName: "Service Agreement",
  senderName: "Your Company",
  senderEmail: "sender@company.com",
  recipients: [
    { name: "Recipient Name", email: "recipient@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 50,
      recipientEmail: "recipient@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

### Get status

Retrieve the current status of a document.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.getStatus("document-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.getStatus("document-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

### Download document

Download the completed signed document as a PDF Blob.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.download("document-uuid");

// Node.js: Save to file
const { writeFileSync } = require("fs");
const buffer = Buffer.from(await result.arrayBuffer());
writeFileSync("signed-contract.pdf", buffer);
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.download("document-uuid");

// Node.js: Save to file
import { writeFileSync } from "fs";
const buffer = Buffer.from(await result.arrayBuffer());
writeFileSync("signed-contract.pdf", buffer);
```

</TabItem>
</Tabs>

### Void

Cancel/void a signature request.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
await TurboSign.void("document-uuid", "Contract terms changed");
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
await TurboSign.void("document-uuid", "Contract terms changed");
```

</TabItem>
</Tabs>

### Resend

Resend signature request emails to specific recipients.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Resend to specific recipients
await TurboSign.resend("document-uuid", [
  "recipient-uuid-1",
  "recipient-uuid-2",
]);
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Resend to specific recipients
await TurboSign.resend("document-uuid", [
  "recipient-uuid-1",
  "recipient-uuid-2",
]);
```

</TabItem>
</Tabs>

### Get audit trail

Retrieve the complete audit trail for a document, including all events and actions.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.getAuditTrail("document-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.getAuditTrail("document-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

---

## Error Handling

The SDK provides typed error classes for different failure scenarios. All errors extend the base `TurboDocxError` class.

### Error Classes

| Error Class | Status Code | Code | Description |
|-------------|-------------|------|-------------|
| `TurboDocxError` | varies | varies | Base error class for all SDK errors |
| `AuthenticationError` | 401 | `AUTHENTICATION_ERROR` | Invalid or missing API credentials |
| `ValidationError` | 400 | `VALIDATION_ERROR` | Invalid request parameters |
| `NotFoundError` | 404 | `NOT_FOUND` | Document or resource not found |
| `RateLimitError` | 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| `NetworkError` | - | `NETWORK_ERROR` | Network connectivity issues |

### Handling Errors

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const {
  TurboSign,
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} = require("@turbodocx/sdk");

try {
  const result = await TurboSign.sendSignature({
    fileLink: "https://example.com/contract.pdf",
    recipients: [
      { name: "John Doe", email: "john@example.com", signingOrder: 1 },
    ],
    fields: [
      {
        type: "signature",
        page: 1,
        x: 100,
        y: 650,
        width: 200,
        height: 50,
        recipientEmail: "john@example.com",
      },
    ],
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Authentication failed:", error.message);
    // Check your API key and org ID
  } else if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
    // Check request parameters
  } else if (error instanceof NotFoundError) {
    console.error("Resource not found:", error.message);
    // Document or recipient doesn't exist
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited:", error.message);
    // Wait and retry
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
    // Check connectivity
  } else if (error instanceof TurboDocxError) {
    console.error("SDK error:", error.message, error.statusCode, error.code);
  }
}
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import {
  TurboSign,
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from "@turbodocx/sdk";

try {
  const result = await TurboSign.sendSignature({
    fileLink: "https://example.com/contract.pdf",
    recipients: [
      { name: "John Doe", email: "john@example.com", signingOrder: 1 },
    ],
    fields: [
      {
        type: "signature",
        page: 1,
        x: 100,
        y: 650,
        width: 200,
        height: 50,
        recipientEmail: "john@example.com",
      },
    ],
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Authentication failed:", error.message);
    // Check your API key and org ID
  } else if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
    // Check request parameters
  } else if (error instanceof NotFoundError) {
    console.error("Resource not found:", error.message);
    // Document or recipient doesn't exist
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited:", error.message);
    // Wait and retry
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
    // Check connectivity
  } else if (error instanceof TurboDocxError) {
    console.error("SDK error:", error.message, error.statusCode, error.code);
  }
}
```

</TabItem>
</Tabs>

### Error Properties

All errors include these properties:

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error description |
| `statusCode` | `number \| undefined` | HTTP status code (if applicable) |
| `code` | `string \| undefined` | Machine-readable error code |

---

## TypeScript Types

The SDK exports TypeScript types for full type safety. Import them directly from the package.

### Importing Types

```typescript
import type {
  // Field types
  SignatureFieldType,
  N8nField,
  N8nRecipient,
  // Request types
  CreateSignatureReviewLinkRequest,
  SendSignatureRequest,
} from "@turbodocx/sdk";
```

### SignatureFieldType

Union type for all available field types:

```typescript
type SignatureFieldType =
  | "signature"
  | "initial"
  | "date"
  | "text"
  | "full_name"
  | "title"
  | "company"
  | "first_name"
  | "last_name"
  | "email"
  | "checkbox";
```

### N8nRecipient

Recipient configuration for signature requests:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Recipient's full name |
| `email` | `string` | Yes | Recipient's email address |
| `signingOrder` | `number` | Yes | Signing order (1-indexed) |

### N8nField

Field configuration supporting both coordinate-based and template-based positioning:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `SignatureFieldType` | Yes | Field type |
| `recipientEmail` | `string` | Yes | Which recipient fills this field |
| `page` | `number` | No\* | Page number (1-indexed) |
| `x` | `number` | No\* | X coordinate in pixels |
| `y` | `number` | No\* | Y coordinate in pixels |
| `width` | `number` | No* | Field width in pixels |
| `height` | `number` | No* | Field height in pixels |
| `defaultValue` | `string` | No | Default value (for checkbox: `"true"` or `"false"`) |
| `isMultiline` | `boolean` | No | Enable multiline text |
| `isReadonly` | `boolean` | No | Make field read-only (pre-filled) |
| `required` | `boolean` | No | Whether field is required |
| `backgroundColor` | `string` | No | Background color (hex, rgb, or named) |
| `template` | `object` | No | Template anchor configuration |

\*Required when not using template anchors

**Template Configuration:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `anchor` | `string` | Yes | Text anchor pattern like `{TagName}` |
| `placement` | `string` | Yes | `"replace"` \| `"before"` \| `"after"` \| `"above"` \| `"below"` |
| `size` | `object` | Yes | `{ width: number; height: number }` |
| `offset` | `object` | No | `{ x: number; y: number }` |
| `caseSensitive` | `boolean` | No | Case sensitive search (default: false) |
| `useRegex` | `boolean` | No | Use regex for anchor/searchText (default: false) |

### CreateSignatureReviewLinkRequest / SendSignatureRequest

Request configuration for `createSignatureReviewLink` and `sendSignature` methods:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `file` | `Buffer` | Conditional | PDF file as Buffer |
| `fileLink` | `string` | Conditional | URL to document file |
| `deliverableId` | `string` | Conditional | TurboDocx deliverable ID |
| `templateId` | `string` | Conditional | TurboDocx template ID |
| `recipients` | `N8nRecipient[]` | Yes | Recipients who will sign |
| `fields` | `N8nField[]` | Yes | Signature fields configuration |
| `documentName` | `string` | No | Document name |
| `documentDescription` | `string` | No | Document description |
| `senderName` | `string` | No | Sender name |
| `senderEmail` | `string` | No | Sender email |
| `ccEmails` | `string[]` | No | Array of CC email addresses |

:::info File Source (Conditional)
Exactly one file source is required: `file`, `fileLink`, `deliverableId`, or `templateId`.
:::

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[Request Body Reference](/docs/TurboSign/API%20Signatures#request-body-multipartform-data)** - Complete request body parameters, file sources, and multipart/form-data structure
- **[Recipients Reference](/docs/TurboSign/API%20Signatures#recipients-reference)** - Recipient properties, signing order, metadata, and configuration options
- **[Field Types Reference](/docs/TurboSign/API%20Signatures#field-types-reference)** - All available field types (signature, date, text, checkbox, etc.) with properties and behaviors
- **[Field Positioning Methods](/docs/TurboSign/API%20Signatures#field-positioning-methods)** - Template-based vs coordinate-based positioning, anchor configuration, and best practices

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
- [npm Package](https://www.npmjs.com/package/@turbodocx/sdk)
- [API Reference](/docs/TurboSign/API%20Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
