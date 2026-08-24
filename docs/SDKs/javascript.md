---
title: TurboSign JavaScript / TypeScript SDK
sidebar_position: 2
sidebar_label: "TurboSign: JavaScript / TypeScript"
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
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboSign JavaScript / TypeScript SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" />

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
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL, // Required: reply-to address for signature request emails
  senderName: "Your Company Name", // Optional but recommended: appears as the sender name
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
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL || "", // Required: reply-to address for signature request emails
  senderName: "Your Company Name", // Optional but recommended: appears as the sender name
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
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL,
});

(async () => {
  // Send document with coordinate-based fields
  const result = await TurboSign.sendSignature({
    fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
})();
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { TurboSign } from "@turbodocx/sdk";

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL || "",
});

// Send document with coordinate-based fields
const result = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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

### 1. File Upload (Path, Buffer, or Browser File)

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { readFileSync } = require("fs");
const { TurboSign } = require("@turbodocx/sdk");

const fileBuffer = readFileSync("./contract.pdf");

(async () => {
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
})();
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

:::tip Pass a file path directly
`file` accepts `string | File | Buffer`. A `string` is treated as a local file path — the SDK reads it and uses the basename as the document filename, so `file: "./contract.pdf"` works without `readFileSync`. A raw `Blob` is not supported; use a `Buffer` (Node) or a `File` (browser).

When `file` is a `Buffer`, the filename defaults to `document.pdf` (extension detected from the content). Pass `fileName` to control it:

```javascript
await TurboSign.sendSignature({
  file: fileBuffer,
  fileName: "acme-msa.pdf",
  // ...
});
```

:::

### 2. File URL (fileLink)

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
  senderEmail: string;   // Required: reply-to address for signature request emails
  senderName?: string;   // Optional: sender name in emails (defaults to your API key's name)
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
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL, // Required for TurboSign
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
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL || "", // Required for TurboSign
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
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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

### Reminders & expiration schedule

`sendSignature` (and `createSignatureReviewLink`) accept an optional **reminder and expiration schedule**. Both features are **off by default** — omit these fields and the send behaves exactly as before. The resolved schedule is **frozen onto the document when it is sent**, so later changes to your org defaults never touch a document already out for signature.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.sendSignature({
  // ...fileLink, recipients, fields, etc.

  // Reminders — nudge signers who haven't signed yet
  remindersEnabled: true,
  reminderDelay: { value: 3, unit: "days" },     // time to the FIRST reminder
  reminderInterval: { value: 3, unit: "days" },  // gap between later reminders
  maxReminders: 5,                               // cap per signer

  // Expiration — close the signing window
  expirationEnabled: true,
  expireAfter: { value: 30, unit: "days" },      // how long the document stays signable
  expirationWarning: { value: 3, unit: "days" }, // how far before expiry warnings start
  expirationWarningInterval: { value: 1, unit: "days" },
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.sendSignature({
  // ...fileLink, recipients, fields, etc.

  // Reminders — nudge signers who haven't signed yet
  remindersEnabled: true,
  reminderDelay: { value: 3, unit: "days" },     // time to the FIRST reminder
  reminderInterval: { value: 3, unit: "days" },  // gap between later reminders
  maxReminders: 5,                               // cap per signer

  // Expiration — close the signing window
  expirationEnabled: true,
  expireAfter: { value: 30, unit: "days" },      // how long the document stays signable
  expirationWarning: { value: 3, unit: "days" }, // how far before expiry warnings start
  expirationWarningInterval: { value: 1, unit: "days" },
});
```

</TabItem>
</Tabs>

Durations are `{ value, unit }` objects — `unit` is `"hours"` or `"days"`, and `value` is a whole number from **1 to a maximum of 999 days (23976 hours)**.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `remindersEnabled` | `boolean` | `false` | Send reminder emails at all |
| `reminderDelay` | `Duration` | 3 days | Time to the **first** reminder, measured from that signer's invitation |
| `reminderInterval` | `Duration` | 3 days | Gap between **subsequent** reminders |
| `maxReminders` | `number` | `5` | Cap per signer, range **-1..50** — `-1` unlimited, `0` none. Never caps expiry warnings |
| `expirationEnabled` | `boolean` | `false` | Expire the document at all |
| `expireAfter` | `Duration` | 120 days | How long the document stays signable, counted from **sending** |
| `expirationWarning` | `Duration` | 3 days | How far **before** expiry warnings start. `0` = never warn |
| `expirationWarningInterval` | `Duration` | 1 day | Gap between warnings once they start |

Reminders and expiry warnings run as **two independent clocks**, so a signer keeps getting reminders even after warnings begin; the two are coordinated so a reminder and a warning never land on the same tick. The API rejects a cadence that can't fit its window — for example a reminder interval that outlives `expireAfter` — with `400 InvalidSignatureSchedule`. See the [API validation rules](/docs/TurboSign/API%20Signatures#reminders--expiration) for the full list.

### Send reminder

Send a **standalone reminder** to whoever's turn it is to sign. Unlike the scheduled reminders above, it ignores the configured cadence, works even when reminders are disabled or the per-signer cap is already spent, and does **not** consume that cap. Only signers at the **current** signing order are eligible. It maps to `POST /turbosign/documents/{documentId}/send-reminder`.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Remind everyone whose turn it is — omit the recipient ids
const { results } = await TurboSign.sendReminder("document-uuid");

results.forEach((r) => {
  // Anyone not emailed comes back as a skipped_* status, so you can tell who was reached
  console.log(`${r.recipientId}: ${r.status}`); // e.g. "sent", "skipped_wrong_order"
});

// Or limit the reminder to specific recipients
await TurboSign.sendReminder("document-uuid", ["recipient-uuid-1"]);
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const { results } = await TurboSign.sendReminder("document-uuid");

results.forEach((r) => {
  console.log(`${r.recipientId}: ${r.status}`);
});

await TurboSign.sendReminder("document-uuid", ["recipient-uuid-1"]);
```

</TabItem>
</Tabs>

:::warning Omit — don't send an empty array
To remind everyone eligible, **omit** `recipientIds` entirely. Passing an empty array (`[]`) is rejected with a `400`.
:::

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

The response carries the document-level **`status`** (`under_review`, `completed`, `voided`, `expired`, …) and **`expiresAt`** — the ISO 8601 signing-window deadline, or `undefined`/`null` when expiration is off. Once that deadline passes the document moves to the terminal **`expired`** status and its signing links stop working. The same `document.expiresAt` is returned by `getRecipients()` alongside per-recipient detail.

### Download document

Download the completed signed document as a PDF Blob.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { writeFileSync } = require("fs");

(async () => {
  const result = await TurboSign.download("document-uuid");

  // Node.js: Save to file
  const buffer = Buffer.from(await result.arrayBuffer());
  writeFileSync("signed-contract.pdf", buffer);
})();
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

| Error Class           | Status Code | Code                   | Description                         |
| --------------------- | ----------- | ---------------------- | ----------------------------------- |
| `TurboDocxError`      | varies      | varies                 | Base error class for all SDK errors |
| `AuthenticationError` | 401         | `AUTHENTICATION_ERROR` | Invalid or missing API credentials  |
| `AuthorizationError`  | 403         | `AUTHORIZATION_ERROR`  | API key lacks required permissions  |
| `ValidationError`     | 400         | `VALIDATION_ERROR`     | Invalid request parameters          |
| `NotFoundError`       | 404         | `NOT_FOUND`            | Document or resource not found      |
| `ConflictError`       | 409         | `CONFLICT`             | Resource conflict                   |
| `RateLimitError`      | 429         | `RATE_LIMIT_EXCEEDED`  | Too many requests                   |
| `NetworkError`        | -           | `NETWORK_ERROR`        | Network connectivity issues         |

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

(async () => {
  try {
    const result = await TurboSign.sendSignature({
      fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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
})();
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
    fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
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

| Property     | Type                  | Description                      |
| ------------ | --------------------- | -------------------------------- |
| `message`    | `string`              | Human-readable error description |
| `statusCode` | `number \| undefined` | HTTP status code (if applicable) |
| `code`       | `string \| undefined` | Machine-readable error code      |

---

## TypeScript Types

The SDK exports TypeScript types for full type safety. Import them directly from the package.

### Importing Types

```typescript
import type {
  // Field types
  SignatureFieldType,
  Field,
  Recipient,
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

### Recipient

Recipient configuration for signature requests:

| Property       | Type     | Required | Description               |
| -------------- | -------- | -------- | ------------------------- |
| `name`         | `string` | Yes      | Recipient's full name     |
| `email`        | `string` | Yes      | Recipient's email address |
| `signingOrder` | `number` | Yes      | Signing order (1-indexed) |

### Field

Field configuration supporting both coordinate-based and template-based positioning:

| Property          | Type                 | Required | Description                                         |
| ----------------- | -------------------- | -------- | --------------------------------------------------- |
| `type`            | `SignatureFieldType` | Yes      | Field type                                          |
| `recipientEmail`  | `string`             | Yes      | Which recipient fills this field                    |
| `page`            | `number`             | No\*     | Page number (1-indexed)                             |
| `x`               | `number`             | No\*     | X coordinate in pixels                              |
| `y`               | `number`             | No\*     | Y coordinate in pixels                              |
| `width`           | `number`             | No\*     | Field width in pixels                               |
| `height`          | `number`             | No\*     | Field height in pixels                              |
| `defaultValue`    | `string`             | No       | Default value (for checkbox: `"true"` or `"false"`) |
| `isMultiline`     | `boolean`            | No       | Enable multiline text                               |
| `isReadonly`      | `boolean`            | No       | Make field read-only (pre-filled)                   |
| `required`        | `boolean`            | No       | Whether field is required                           |
| `backgroundColor` | `string`             | No       | Background color (hex, rgb, or named)               |
| `template`        | `object`             | No       | Template anchor configuration                       |

\*Required when not using template anchors

**Template Configuration:**

| Property        | Type      | Required | Description                                                      |
| --------------- | --------- | -------- | ---------------------------------------------------------------- |
| `anchor`        | `string`  | No†      | Text anchor pattern like `{TagName}`                             |
| `searchText`    | `string`  | No†      | Alternative to `anchor`: search for any text in the document     |
| `placement`     | `string`  | No       | `"replace"` \| `"before"` \| `"after"` \| `"above"` \| `"below"` |
| `size`          | `object`  | No       | `{ width: number; height: number }`                              |
| `offset`        | `object`  | No       | `{ x: number; y: number }`                                       |
| `caseSensitive` | `boolean` | No       | Case sensitive search (default: false)                           |
| `useRegex`      | `boolean` | No       | Use regex for anchor/searchText (default: false)                 |

†All template properties are optional in the type definition, but at least one of `anchor` or `searchText` must be provided for anchor-based positioning to work.

### CreateSignatureReviewLinkRequest / SendSignatureRequest

Request configuration for `createSignatureReviewLink` and `sendSignature` methods:

| Property              | Type          | Required    | Description                    |
| --------------------- | ------------- | ----------- | ------------------------------ |
| `file`                | `string \| File \| Buffer` | Conditional | Document as a local file path, `Buffer`, or browser `File` |
| `fileName`            | `string`      | No          | Original filename — used when `file` is a `Buffer` (defaults to `document.<ext>`) |
| `fileLink`            | `string`      | Conditional | URL to document file           |
| `deliverableId`       | `string`      | Conditional | TurboDocx deliverable ID       |
| `templateId`          | `string`      | Conditional | TurboDocx template ID          |
| `recipients`          | `Recipient[]` | Yes         | Recipients who will sign       |
| `fields`              | `Field[]`     | Yes         | Signature fields configuration |
| `documentName`        | `string`      | No          | Document name                  |
| `documentDescription` | `string`      | No          | Document description           |
| `senderName`          | `string`      | No          | Sender name — falls back to `senderName` in the SDK config, then your API key's name |
| `senderEmail`         | `string`      | Conditional | Sender email — **required on the request** unless supplied via `TurboSign.configure({ senderEmail })` or `TURBODOCX_SENDER_EMAIL` |
| `ccEmails`            | `string[]`    | No          | Array of CC email addresses    |
| `remindersEnabled`    | `boolean`     | No          | Send reminder emails to signers who haven't signed (default `false`) |
| `reminderDelay`       | `Duration`    | No          | `{ value, unit }` — time to the first reminder |
| `reminderInterval`    | `Duration`    | No          | `{ value, unit }` — gap between later reminders |
| `maxReminders`        | `number`      | No          | Cap per signer, range **-1..50** (`-1` unlimited, `0` none, default `5`) |
| `expirationEnabled`   | `boolean`     | No          | Close the signing window after `expireAfter` (default `false`) |
| `expireAfter`         | `Duration`    | No          | `{ value, unit }` — how long the document stays signable |
| `expirationWarning`   | `Duration`    | No          | `{ value, unit }` — how far before expiry warnings start (`0` = never warn) |
| `expirationWarningInterval` | `Duration` | No       | `{ value, unit }` — gap between warnings once they start |

:::info Durations
A `Duration` is `{ value: number, unit: "hours" | "days" }`. `value` is a whole number from **1 to 999 days (23976 hours)**.
:::

:::info File Source (Conditional)
Exactly one file source is required: `file`, `fileLink`, `deliverableId`, or `templateId`.
:::

:::caution Sender identity is always required for TurboSign
Unlike TurboQuote (where the sender comes from the org quote template and there is no per-request
field), TurboSign resolves the sender **from the request body**. If no sender email can be resolved
from the request, the SDK config, or the environment, the API returns `400 SenderEmailRequired`;
if no sender name can be resolved it returns `400 SenderNameRequired`.
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
