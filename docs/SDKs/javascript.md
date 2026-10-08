---
title: TurboDocx JavaScript / TypeScript SDK
sidebar_position: 2
sidebar_label: JavaScript / TypeScript
description: Install and configure the TurboDocx JavaScript / TypeScript SDK, then open the TurboSign, Deliverable, TurboWebhooks or TurboQuote guide.
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

# TurboDocx JavaScript / TypeScript SDK

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

## Product guides

Each product guide opens on the JavaScript / TypeScript tab:

- [TurboSign](/docs/SDKs/turbosign?language=js): send documents for signature, track status, download signed PDFs and audit trails
- [Deliverable](/docs/SDKs/deliverable?language=js): generate documents from templates
- [TurboWebhooks](/docs/SDKs/webhooks?language=js): receive real-time signature events
- [TurboQuote](/docs/SDKs/quote?language=js): create, send and download quotes

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
- [npm Package](https://www.npmjs.com/package/@turbodocx/sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
