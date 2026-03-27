---
title: JavaScript / TypeScript SDK
sidebar_position: 8
sidebar_label: "Deliverable: JavaScript / TypeScript"
description: Official TurboDocx Deliverable JavaScript and TypeScript SDK. Full TypeScript support with async/await patterns for document generation from templates.
keywords:
  - turbodocx deliverable javascript
  - turbodocx deliverable typescript
  - document generation javascript
  - template api javascript
  - deliverable sdk
  - npm turbodocx
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JavaScript / TypeScript SDK

The official TurboDocx Deliverable SDK for JavaScript and TypeScript applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically. Available on npm as `@turbodocx/sdk`.

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
const { Deliverable } = require("@turbodocx/sdk");

// Configure globally (recommended for server-side)
Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY, // Required: Your TurboDocx API key
  orgId: process.env.TURBODOCX_ORG_ID, // Required: Your organization ID
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { Deliverable } from "@turbodocx/sdk";

// Configure globally (recommended for server-side)
Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "", // Required: Your TurboDocx API key
  orgId: process.env.TURBODOCX_ORG_ID || "", // Required: Your organization ID
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
</Tabs>

:::tip No Sender Email Required
Unlike TurboSign, the Deliverable module only requires `apiKey` and `orgId` — no sender email or name is needed.
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

---

## Quick Start

### Generate a document from a template

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { Deliverable } = require("@turbodocx/sdk");

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
});

// Generate a document from a template with variables
const result = await Deliverable.generateDeliverable({
  name: "Q1 Report",
  templateId: "your-template-id",
  variables: [
    { placeholder: "{CompanyName}", text: "Acme Corporation", mimeType: "text" },
    { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
  ],
  description: "Quarterly business report",
  tags: ["reports", "quarterly"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { Deliverable } from "@turbodocx/sdk";
import type { CreateDeliverableRequest } from "@turbodocx/sdk";

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
});

// Generate a document from a template with variables
const request: CreateDeliverableRequest = {
  name: "Q1 Report",
  templateId: "your-template-id",
  variables: [
    { placeholder: "{CompanyName}", text: "Acme Corporation", mimeType: "text" },
    { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
  ],
  description: "Quarterly business report",
  tags: ["reports", "quarterly"],
};

const result = await Deliverable.generateDeliverable(request);
console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

### Download and manage deliverables

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { Deliverable } = require("@turbodocx/sdk");
const { writeFileSync } = require("fs");

// List deliverables with pagination
const list = await Deliverable.listDeliverables({ limit: 10, showTags: true });
console.log(`Total: ${list.totalRecords}`);

// Get deliverable details
const details = await Deliverable.getDeliverableDetails("deliverable-uuid");
console.log(`Name: ${details.name}`);

// Download source file (DOCX/PPTX)
const buffer = await Deliverable.downloadSourceFile("deliverable-uuid");
writeFileSync("report.docx", Buffer.from(buffer));

// Download PDF
const pdfBuffer = await Deliverable.downloadPDF("deliverable-uuid");
writeFileSync("report.pdf", Buffer.from(pdfBuffer));

// Update deliverable
await Deliverable.updateDeliverableInfo("deliverable-uuid", {
  name: "Q1 Report - Final",
  description: "Final quarterly business report",
});

// Delete deliverable
await Deliverable.deleteDeliverable("deliverable-uuid");
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { Deliverable } from "@turbodocx/sdk";
import { writeFileSync } from "fs";

// List deliverables with pagination
const list = await Deliverable.listDeliverables({ limit: 10, showTags: true });
console.log(`Total: ${list.totalRecords}`);

// Get deliverable details
const details = await Deliverable.getDeliverableDetails("deliverable-uuid");
console.log(`Name: ${details.name}`);

// Download source file (DOCX/PPTX)
const buffer = await Deliverable.downloadSourceFile("deliverable-uuid");
writeFileSync("report.docx", Buffer.from(buffer));

// Download PDF
const pdfBuffer = await Deliverable.downloadPDF("deliverable-uuid");
writeFileSync("report.pdf", Buffer.from(pdfBuffer));

// Update deliverable
await Deliverable.updateDeliverableInfo("deliverable-uuid", {
  name: "Q1 Report - Final",
  description: "Final quarterly business report",
});

// Delete deliverable
await Deliverable.deleteDeliverable("deliverable-uuid");
```

</TabItem>
</Tabs>

---

## Variable Types

The Deliverable module supports four variable types for template injection:

### 1. Text Variables

Inject plain text values into template placeholders:

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const variables = [
  { placeholder: "{CompanyName}", text: "Acme Corporation", mimeType: "text" },
  { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
];
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const variables: DeliverableVariable[] = [
  { placeholder: "{CompanyName}", text: "Acme Corporation", mimeType: "text" },
  { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
];
```

</TabItem>
</Tabs>

### 2. HTML Variables

Inject rich HTML content with formatting:

```javascript
const variables = [
  {
    placeholder: "{Summary}",
    text: "<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>",
    mimeType: "html",
  },
];
```

### 3. Image Variables

Inject images by providing a URL or base64-encoded content:

```javascript
const variables = [
  {
    placeholder: "{Logo}",
    text: "https://example.com/logo.png",
    mimeType: "image",
  },
];
```

### 4. Markdown Variables

Inject markdown content that gets converted to formatted text:

```javascript
const variables = [
  {
    placeholder: "{Notes}",
    text: "## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.",
    mimeType: "markdown",
  },
];
```

:::info Variable Stack
For repeating content (e.g., table rows), use `variableStack` instead of `text` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

---

## API Reference

### Configure

Configure the SDK with your API credentials and organization settings.

**Example:**

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { Deliverable } = require("@turbodocx/sdk");

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
  // Optional: override for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { Deliverable } from "@turbodocx/sdk";

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
  // Optional: override for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
</Tabs>

:::caution API Credentials Required
Both `apiKey` and `orgId` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

### Generate deliverable

Generate a new document from a template with variable substitution.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await Deliverable.generateDeliverable({
  name: "Q1 Report",
  templateId: "your-template-id",
  variables: [
    { placeholder: "{CompanyName}", text: "Acme Corp", mimeType: "text" },
    { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
  ],
  description: "Quarterly business report",
  tags: ["reports", "quarterly"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await Deliverable.generateDeliverable({
  name: "Q1 Report",
  templateId: "your-template-id",
  variables: [
    { placeholder: "{CompanyName}", text: "Acme Corp", mimeType: "text" },
    { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
  ],
  description: "Quarterly business report",
  tags: ["reports", "quarterly"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

### List deliverables

List deliverables with pagination, search, and filtering.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const list = await Deliverable.listDeliverables({
  limit: 10,
  offset: 0,
  query: "report",
  showTags: true,
});

console.log(JSON.stringify(list, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const list = await Deliverable.listDeliverables({
  limit: 10,
  offset: 0,
  query: "report",
  showTags: true,
});

console.log(JSON.stringify(list, null, 2));
```

</TabItem>
</Tabs>

### Get deliverable details

Retrieve the full details of a single deliverable, including variables and fonts.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const details = await Deliverable.getDeliverableDetails("deliverable-uuid", {
  showTags: true,
});

console.log(JSON.stringify(details, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const details = await Deliverable.getDeliverableDetails("deliverable-uuid", {
  showTags: true,
});

console.log(JSON.stringify(details, null, 2));
```

</TabItem>
</Tabs>

### Update deliverable info

Update a deliverable's name, description, or tags.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await Deliverable.updateDeliverableInfo("deliverable-uuid", {
  name: "Q1 Report - Final",
  description: "Final quarterly business report",
  tags: ["reports", "final"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await Deliverable.updateDeliverableInfo("deliverable-uuid", {
  name: "Q1 Report - Final",
  description: "Final quarterly business report",
  tags: ["reports", "final"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

### Delete deliverable

Soft-delete a deliverable.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await Deliverable.deleteDeliverable("deliverable-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await Deliverable.deleteDeliverable("deliverable-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

### Download source file

Download the original source file (DOCX or PPTX).

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const buffer = await Deliverable.downloadSourceFile("deliverable-uuid");

// Node.js: Save to file
const { writeFileSync } = require("fs");
writeFileSync("report.docx", Buffer.from(buffer));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const buffer = await Deliverable.downloadSourceFile("deliverable-uuid");

// Node.js: Save to file
import { writeFileSync } from "fs";
writeFileSync("report.docx", Buffer.from(buffer));
```

</TabItem>
</Tabs>

### Download PDF

Download the PDF version of a deliverable.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const buffer = await Deliverable.downloadPDF("deliverable-uuid");

// Node.js: Save to file
const { writeFileSync } = require("fs");
writeFileSync("report.pdf", Buffer.from(buffer));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const buffer = await Deliverable.downloadPDF("deliverable-uuid");

// Node.js: Save to file
import { writeFileSync } from "fs";
writeFileSync("report.pdf", Buffer.from(buffer));
```

</TabItem>
</Tabs>

---

## Error Handling

The SDK provides typed error classes for different failure scenarios. All errors extend the base `TurboDocxError` class.

### Error Classes

| Error Class           | Status Code | Code                   | Description                              |
| --------------------- | ----------- | ---------------------- | ---------------------------------------- |
| `TurboDocxError`      | varies      | varies                 | Base error class for all SDK errors      |
| `AuthenticationError` | 401         | `AUTHENTICATION_ERROR` | Invalid or missing API credentials       |
| `ValidationError`     | 400         | `VALIDATION_ERROR`     | Invalid request parameters               |
| `NotFoundError`       | 404         | `NOT_FOUND`            | Deliverable or template not found        |
| `RateLimitError`      | 429         | `RATE_LIMIT_EXCEEDED`  | Too many requests                        |
| `NetworkError`        | -           | `NETWORK_ERROR`        | Network connectivity issues              |

### Handling Errors

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const {
  Deliverable,
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} = require("@turbodocx/sdk");

try {
  const result = await Deliverable.generateDeliverable({
    name: "Q1 Report",
    templateId: "your-template-id",
    variables: [
      { placeholder: "{CompanyName}", text: "Acme Corp", mimeType: "text" },
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
    // Template or deliverable doesn't exist
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
  Deliverable,
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from "@turbodocx/sdk";

try {
  const result = await Deliverable.generateDeliverable({
    name: "Q1 Report",
    templateId: "your-template-id",
    variables: [
      { placeholder: "{CompanyName}", text: "Acme Corp", mimeType: "text" },
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
    // Template or deliverable doesn't exist
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
  // Variable types
  DeliverableVariable,
  VariableMimeType,
  // Request types
  DeliverableConfig,
  CreateDeliverableRequest,
  UpdateDeliverableRequest,
  ListDeliverablesOptions,
  // Response types
  CreateDeliverableResponse,
  UpdateDeliverableResponse,
  DeleteDeliverableResponse,
  DeliverableListResponse,
  // Record types
  DeliverableRecord,
  Tag,
  Font,
} from "@turbodocx/sdk";
```

### VariableMimeType

Union type for variable content types:

```typescript
type VariableMimeType = "text" | "html" | "image" | "markdown";
```

### DeliverableVariable

Variable configuration for template injection:

| Property                 | Type                    | Required | Description                                          |
| ------------------------ | ----------------------- | -------- | ---------------------------------------------------- |
| `placeholder`            | `string`                | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `text`                   | `string`                | No\*     | Value to inject                                      |
| `mimeType`               | `VariableMimeType`      | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `isDisabled`             | `boolean`               | No       | Skip this variable during generation                 |
| `subvariables`           | `DeliverableVariable[]` | No       | Nested sub-variables for HTML content                |
| `variableStack`          | `object \| array`       | No       | Multiple instances for repeating content             |
| `aiPrompt`               | `string`                | No       | AI prompt for content generation (max 16,000 chars)  |

\*Required unless `variableStack` is provided or `isDisabled` is true.

### CreateDeliverableRequest

Request configuration for `generateDeliverable`:

| Property       | Type                    | Required | Description                                |
| -------------- | ----------------------- | -------- | ------------------------------------------ |
| `name`         | `string`                | Yes      | Deliverable name (3-255 characters)        |
| `templateId`   | `string`                | Yes      | Template ID to generate from               |
| `variables`    | `DeliverableVariable[]` | Yes      | Variables for template substitution        |
| `description`  | `string`                | No       | Description (up to 65,535 characters)      |
| `tags`         | `string[]`              | No       | Tag strings to associate                   |

### UpdateDeliverableRequest

Request configuration for `updateDeliverableInfo`:

| Property      | Type       | Required | Description                              |
| ------------- | ---------- | -------- | ---------------------------------------- |
| `name`        | `string`   | No       | Updated name (3-255 characters)          |
| `description` | `string`   | No       | Updated description                      |
| `tags`        | `string[]` | No       | Replace all tags (empty array to remove) |

### ListDeliverablesOptions

Options for `listDeliverables`:

&nbsp;

| Property       | Type       | Required | Description                          |
| -------------- | ---------- | -------- | ------------------------------------ |
| `limit`        | `number`   | No       | Results per page (1-100, default 6)  |
| `offset`       | `number`   | No       | Results to skip (default 0)          |
| `query`        | `string`   | No       | Search query to filter by name       |
| `showTags`     | `boolean`  | No       | Include tags in the response         |

### DeliverableRecord

The deliverable object returned by `listDeliverables`:

&nbsp;

| Property          | Type       | Description                           |
| ----------------- | ---------- | ------------------------------------- |
| `id`              | `string`   | Unique deliverable ID (UUID)          |
| `name`            | `string`   | Deliverable name                      |
| `description`     | `string`   | Description text                      |
| `templateId`      | `string`   | Source template ID                    |
| `createdBy`       | `string`   | User ID of the creator                |
| `email`           | `string`   | Creator's email address               |
| `fileSize`        | `number`   | File size in bytes                    |
| `fileType`        | `string`   | MIME type of the generated file       |
| `defaultFont`     | `string`   | Default font used                     |
| `fonts`           | `Font[]`   | Fonts used in the document            |
| `isActive`        | `boolean`  | Whether the deliverable is active     |
| `createdOn`       | `string`   | ISO 8601 creation timestamp           |
| `updatedOn`       | `string`   | ISO 8601 last update timestamp        |
| `tags`            | `Tag[]`    | Associated tags (when `showTags=true`)|

### DeliverableDetailRecord

The deliverable object returned by `getDeliverableDetails`. Includes all fields from [DeliverableRecord](#deliverablerecord) **except `fileSize`**, plus:

&nbsp;

| Property             | Type                    | Description                              |
| -------------------- | ----------------------- | ---------------------------------------- |
| `templateName`       | `string`                | Source template name                     |
| `templateNotDeleted` | `boolean`               | Whether the source template still exists |
| `variables`          | `DeliverableVariable[]` | Parsed variable objects with values      |

### Tag

Tag object included when `showTags` is enabled:

&nbsp;

| Property    | Type      | Description                          |
| ----------- | --------- | ------------------------------------ |
| `id`        | `string`  | Tag unique identifier (UUID)         |
| `label`     | `string`  | Tag display name                     |
| `isActive`  | `boolean` | Whether the tag is active            |
| `updatedOn` | `string`  | ISO 8601 last update timestamp       |
| `createdOn` | `string`  | ISO 8601 creation timestamp          |
| `createdBy` | `string`  | User ID of the tag creator           |
| `orgId`     | `string`  | Organization ID                      |

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[TurboDocx Templating](/docs/TurboDocx%20Templating/How%20to%20Create%20a%20Template)** - How to create and configure document templates
- **[Variable Reference](/docs/API/Deliverable%20API#variable-object-structure)** - Complete guide to variable types, formatting, and advanced injection options
- **[API Reference](/docs/API/Deliverable%20API)** - Full REST API documentation for Deliverable endpoints

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
- [npm Package](https://www.npmjs.com/package/@turbodocx/sdk)
- [API Reference](/docs/API/Deliverable%20API)
