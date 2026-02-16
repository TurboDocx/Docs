---
title: TurboPartner JavaScript SDK
sidebar_position: 9
sidebar_label: "TurboPartner: JavaScript"
description: Official TurboDocx Partner SDK for JavaScript and TypeScript. Manage organizations, users, API keys, and entitlements programmatically.
keywords:
  - turbodocx partner
  - turbopartner javascript
  - turbopartner typescript
  - partner api javascript
  - multi-tenant javascript
  - organization management
  - javascript sdk partner
  - white label javascript
  - saas javascript sdk
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboPartner JavaScript SDK

:::tip Interested in TurboPartner?
TurboPartner is available for integrators and partners. [Contact us](https://www.turbodocx.com/demo) to get started.
:::

The official TurboDocx Partner SDK for JavaScript and TypeScript applications. Build multi-tenant SaaS applications with programmatic organization management, user provisioning, API key management, and entitlement control. Available on npm as `@turbodocx/sdk`.

<br />

:::info What is TurboPartner?
TurboPartner is the partner management API for TurboDocx. It allows you to programmatically create and manage organizations, users, API keys, and feature entitlements — perfect for building white-label or multi-tenant applications on top of TurboDocx.
:::

## TLDR

```typescript
import { TurboPartner } from '@turbodocx/sdk';

// 1. Configure
TurboPartner.configure({
  partnerApiKey: process.env.TURBODOCX_PARTNER_API_KEY!,
  partnerId: process.env.TURBODOCX_PARTNER_ID!,
});

// 2. Create an organization with entitlements
const org = await TurboPartner.createOrganization({
  name: 'Acme Corporation',
  features: {
    maxUsers: 25,              // Max users allowed
    maxStorage: 5368709120,    // 5GB in bytes
    hasTDAI: true,             // Enable TurboDocx AI
  },
});
const orgId = org.data.id;

// 3. Add a user
const user = await TurboPartner.addUserToOrganization(orgId, {
  email: 'admin@acme.com',
  role: 'admin',
});

// 4. Create an API key
const key = await TurboPartner.createOrganizationApiKey(orgId, {
  name: 'Production Key',
  role: 'admin',
});
console.log(`API Key: ${key.data.key}`); // Save this — only shown once!
```

---

## Installation

```bash
npm install @turbodocx/sdk
# or
yarn add @turbodocx/sdk
# or
pnpm add @turbodocx/sdk
```

## Requirements

- Node.js 18 or higher
- TypeScript 4.7+ (optional, types included)

:::tip Full TypeScript Support
This SDK includes complete TypeScript type definitions for all request/response types, enums, and configuration options — no additional `@types` packages needed.
:::

---

## Configuration

<Tabs>
<TabItem value="manual" label="Manual Configuration" default>

```typescript
import { TurboPartner } from '@turbodocx/sdk';

// Configure with your partner credentials
TurboPartner.configure({
  partnerApiKey: process.env.TURBODOCX_PARTNER_API_KEY,  // Required: Must start with TDXP-
  partnerId: process.env.TURBODOCX_PARTNER_ID,           // Required: Your partner UUID
});
```

</TabItem>
<TabItem value="env" label="From Environment">

```typescript
import { TurboPartner } from '@turbodocx/sdk';

// Auto-configure from environment variables
// Reads from: TURBODOCX_PARTNER_API_KEY, TURBODOCX_PARTNER_ID
TurboPartner.configure({
  partnerApiKey: process.env.TURBODOCX_PARTNER_API_KEY!,
  partnerId: process.env.TURBODOCX_PARTNER_ID!,
});
```

</TabItem>
</Tabs>

:::caution Partner API Key Required
Partner API keys start with `TDXP-` prefix. These are different from regular organization API keys and provide access to partner-level operations across all your organizations.
:::

### Environment Variables

```bash
# .env
TURBODOCX_PARTNER_API_KEY=TDXP-your-partner-api-key
TURBODOCX_PARTNER_ID=your-partner-uuid
```

---

## Quick Start

### Create Your First Organization

```typescript
import { TurboPartner } from '@turbodocx/sdk';

// Configure with your partner credentials
TurboPartner.configure({
  partnerApiKey: process.env.TURBODOCX_PARTNER_API_KEY!,
  partnerId: process.env.TURBODOCX_PARTNER_ID!,
});

// Create a new organization
const result = await TurboPartner.createOrganization({
  name: 'Acme Corporation',
});

console.log('Organization created!');
console.log(`  ID: ${result.data.id}`);
console.log(`  Name: ${result.data.name}`);
```

:::caution Always Handle Errors
The above examples omit error handling for brevity. In production, wrap all TurboPartner calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

---

## Organization Management

### `createOrganization()`

Create a new organization under your partner account.

```typescript
const result = await TurboPartner.createOrganization({
  name: 'Acme Corporation',
  features: { maxUsers: 50 },  // Optional entitlements override
});

console.log(`Organization ID: ${result.data.id}`);
```

### `listOrganizations()`

List all organizations with pagination and search.

```typescript
const result = await TurboPartner.listOrganizations({
  limit: 25,
  offset: 0,
  search: 'Acme',  // Optional search by name
});

console.log(`Total: ${result.data.totalRecords}`);
for (const org of result.data.results) {
  console.log(`- ${org.name} (ID: ${org.id})`);
}
```

### `getOrganizationDetails()`

Get full details including features and tracking for an organization.

```typescript
const result = await TurboPartner.getOrganizationDetails('org-uuid-here');

console.log(`Name: ${result.data.name}`);
console.log(`Active: ${result.data.isActive ? 'Yes' : 'No'}`);

if (result.data.features) {
  console.log(`Max Users: ${result.data.features.maxUsers}`);
  console.log(`Max Storage: ${result.data.features.maxStorage} bytes`);
}

if (result.data.tracking) {
  console.log(`Current Users: ${result.data.tracking.numUsers}`);
  console.log(`Storage Used: ${result.data.tracking.storageUsed} bytes`);
}
```

### `updateOrganizationInfo()`

Update an organization's name.

```typescript
const result = await TurboPartner.updateOrganizationInfo(
  'org-uuid-here',
  { name: 'Acme Corp (Updated)' }
);
```

### `updateOrganizationEntitlements()`

Update an organization's feature limits and capabilities.

```typescript
const result = await TurboPartner.updateOrganizationEntitlements(
  'org-uuid-here',
  {
    features: {
      maxUsers: 100,
      maxStorage: 10737418240,  // 10GB in bytes
      maxSignatures: 500,
      hasTDAI: true,
      hasFileDownload: true,
      hasBetaFeatures: false,
    },
  }
);

console.log('Entitlements updated!');
```

:::info Features vs Tracking
**Features** are limits and capabilities you can set (maxUsers, hasTDAI, etc.).
**Tracking** is read-only usage data (numUsers, storageUsed, etc.).
See [Entitlements Reference](#entitlements-reference) for all available fields.
:::

### `deleteOrganization()`

Delete an organization (soft delete).

```typescript
const result = await TurboPartner.deleteOrganization('org-uuid-here');
console.log(`Success: ${result.success}`);
```

:::danger Use With Caution
Deleting an organization is a destructive operation. All organization data, users, and API keys will be affected.
:::

---

## Organization User Management

### `addUserToOrganization()`

Add a user to an organization with a specific role.

```typescript
const result = await TurboPartner.addUserToOrganization(
  'org-uuid-here',
  {
    email: 'user@example.com',
    role: 'admin',  // 'admin' | 'contributor' | 'user' | 'viewer'
  }
);

console.log(`User ID: ${result.data.id}`);
console.log(`Invitation sent to: ${result.data.email}`);
```

### `listOrganizationUsers()`

List all users in an organization.

```typescript
const result = await TurboPartner.listOrganizationUsers(
  'org-uuid-here',
  { limit: 50, offset: 0 }
);

console.log(`Total Users: ${result.data.totalRecords}`);
for (const user of result.data.results) {
  console.log(`- ${user.email} (${user.role})`);
}
```

### `updateOrganizationUserRole()`

Change a user's role within an organization.

```typescript
const result = await TurboPartner.updateOrganizationUserRole(
  'org-uuid-here',
  'user-uuid-here',
  { role: 'contributor' }
);
```

### `resendOrganizationInvitationToUser()`

Resend the invitation email to a pending user.

```typescript
const result = await TurboPartner.resendOrganizationInvitationToUser(
  'org-uuid-here',
  'user-uuid-here'
);
```

### `removeUserFromOrganization()`

Remove a user from an organization.

```typescript
const result = await TurboPartner.removeUserFromOrganization(
  'org-uuid-here',
  'user-uuid-here'
);
```

---

## Organization API Key Management

### `createOrganizationApiKey()`

Create an API key for an organization.

```typescript
const result = await TurboPartner.createOrganizationApiKey(
  'org-uuid-here',
  {
    name: 'Production API Key',
    role: 'admin',  // 'admin' | 'contributor' | 'viewer'
  }
);

console.log(`Key ID: ${result.data.id}`);
console.log(`Full Key: ${result.data.key}`);  // Only shown once!
```

:::caution Save Your API Key
The full API key is only returned once during creation. Store it securely — you won't be able to retrieve it again.
:::

### `listOrganizationApiKeys()`

List all API keys for an organization.

```typescript
const result = await TurboPartner.listOrganizationApiKeys(
  'org-uuid-here',
  { limit: 50 }
);

for (const key of result.data.results) {
  console.log(`- ${key.name} (Role: ${key.role})`);
}
```

### `updateOrganizationApiKey()`

Update an organization API key's name or role.

```typescript
const result = await TurboPartner.updateOrganizationApiKey(
  'org-uuid-here',
  'api-key-uuid-here',
  {
    name: 'Updated Key Name',
    role: 'contributor',
  }
);
```

### `revokeOrganizationApiKey()`

Revoke (delete) an organization API key.

```typescript
const result = await TurboPartner.revokeOrganizationApiKey(
  'org-uuid-here',
  'api-key-uuid-here'
);
```

---

## Partner API Key Management

### `createPartnerApiKey()`

Create a new partner-level API key with specific scopes.

```typescript
const result = await TurboPartner.createPartnerApiKey({
  name: 'Integration API Key',
  scopes: [
    'org:create',
    'org:read',
    'org:update',
    'entitlements:update',
    'audit:read',
  ],
  description: 'For third-party integration',
});

console.log(`Key ID: ${result.data.id}`);
console.log(`Full Key: ${result.data.key}`);  // Only shown once!
```

### `listPartnerApiKeys()`

List all partner API keys.

```typescript
const result = await TurboPartner.listPartnerApiKeys({ limit: 50 });

for (const key of result.data.results) {
  console.log(`- ${key.name}`);
  console.log(`  Scopes: ${key.scopes?.join(', ')}`);
}
```

### `updatePartnerApiKey()`

Update a partner API key.

```typescript
const result = await TurboPartner.updatePartnerApiKey(
  'partner-key-uuid-here',
  {
    name: 'Updated Integration Key',
    description: 'Updated description',
  }
);
```

### `revokePartnerApiKey()`

Revoke a partner API key.

```typescript
const result = await TurboPartner.revokePartnerApiKey('partner-key-uuid-here');
```

---

## Partner User Management

### `addUserToPartnerPortal()`

Add a user to the partner portal with specific permissions.

```typescript
const result = await TurboPartner.addUserToPartnerPortal({
  email: 'admin@partner.com',
  role: 'admin',  // 'admin' | 'member' | 'viewer'
  permissions: {
    canManageOrgs: true,
    canManageOrgUsers: true,
    canManagePartnerUsers: false,
    canManageOrgAPIKeys: true,
    canManagePartnerAPIKeys: false,
    canUpdateEntitlements: true,
    canViewAuditLogs: true,
  },
});

console.log(`Partner User ID: ${result.data.id}`);
```

### `listPartnerPortalUsers()`

List all partner portal users.

```typescript
const result = await TurboPartner.listPartnerPortalUsers({ limit: 50 });

for (const user of result.data.results) {
  console.log(`- ${user.email} (Role: ${user.role})`);
}
```

### `updatePartnerUserPermissions()`

Update a partner user's role and permissions.

```typescript
const result = await TurboPartner.updatePartnerUserPermissions(
  'partner-user-uuid-here',
  {
    role: 'admin',
    permissions: {
      canManageOrgs: true,
      canManageOrgUsers: true,
      canManagePartnerUsers: true,
      canManageOrgAPIKeys: true,
      canManagePartnerAPIKeys: true,
      canUpdateEntitlements: true,
      canViewAuditLogs: true,
    },
  }
);
```

### `resendPartnerPortalInvitationToUser()`

Resend the invitation email to a pending partner user.

```typescript
const result = await TurboPartner.resendPartnerPortalInvitationToUser(
  'partner-user-uuid-here'
);
```

### `removeUserFromPartnerPortal()`

Remove a user from the partner portal.

```typescript
const result = await TurboPartner.removeUserFromPartnerPortal(
  'partner-user-uuid-here'
);
```

---

## Audit Logs

### `getPartnerAuditLogs()`

Get audit logs for all partner activities with filtering.

```typescript
const result = await TurboPartner.getPartnerAuditLogs({
  limit: 50,
  offset: 0,
  action: 'org.created',            // Optional filter by action
  resourceType: 'organization',     // Optional filter by resource type
  success: true,                    // Optional filter by success/failure
  startDate: '2024-01-01',          // Optional date range start
  endDate: '2024-12-31',            // Optional date range end
});

for (const entry of result.data.results) {
  let line = `${entry.createdOn} - ${entry.action}`;
  if (entry.resourceType) {
    line += ` (${entry.resourceType})`;
  }
  line += ` - ${entry.success ? 'Success' : 'Failed'}`;
  console.log(line);
}
```

---

## Entitlements Reference

### Features (Settable Limits)

These are limits and capabilities you can configure for each organization:

| Field | Type | Description |
|-------|------|-------------|
| `maxUsers` | number | Maximum users allowed (-1 = unlimited) |
| `maxProjectspaces` | number | Maximum projectspaces |
| `maxTemplates` | number | Maximum templates |
| `maxStorage` | number | Maximum storage in bytes |
| `maxGeneratedDeliverables` | number | Maximum generated documents |
| `maxSignatures` | number | Maximum e-signatures |
| `maxAICredits` | number | Maximum AI credits |
| `rdWatermark` | boolean | Enable RapidDocx watermark |
| `hasFileDownload` | boolean | Enable file download |
| `hasAdvancedDateFormats` | boolean | Enable advanced date formats |
| `hasGDrive` | boolean | Enable Google Drive integration |
| `hasSharepoint` | boolean | Enable SharePoint integration |
| `hasSharepointOnly` | boolean | SharePoint-only mode |
| `hasTDAI` | boolean | Enable TurboDocx AI features |
| `hasPptx` | boolean | Enable PowerPoint support |
| `hasTDWriter` | boolean | Enable TurboDocx Writer |
| `hasSalesforce` | boolean | Enable Salesforce integration |
| `hasWrike` | boolean | Enable Wrike integration |
| `hasVariableStack` | boolean | Enable variable stack |
| `hasSubvariables` | boolean | Enable subvariables |
| `hasZapier` | boolean | Enable Zapier integration |
| `hasBYOM` | boolean | Enable Bring Your Own Model |
| `hasBYOVS` | boolean | Enable Bring Your Own Vector Store |
| `hasBetaFeatures` | boolean | Enable beta features |
| `enableBulkSending` | boolean | Enable bulk document sending |

### Tracking (Read-Only Usage)

These are usage counters that are read-only:

| Field | Type | Description |
|-------|------|-------------|
| `numUsers` | number | Current number of users |
| `numProjectspaces` | number | Current number of projectspaces |
| `numTemplates` | number | Current number of templates |
| `storageUsed` | number | Current storage used in bytes |
| `numGeneratedDeliverables` | number | Total documents generated |
| `numSignaturesUsed` | number | Total signatures used |
| `currentAICredits` | number | Remaining AI credits |

---

## Types and Interfaces

### PartnerScope (22 Scopes)

```typescript
// Organization CRUD
'org:create'
'org:read'
'org:update'
'org:delete'

// Entitlements
'entitlements:update'

// Organization Users
'org-users:create'
'org-users:read'
'org-users:update'
'org-users:delete'

// Partner Users
'partner-users:create'
'partner-users:read'
'partner-users:update'
'partner-users:delete'

// Organization API Keys
'org-apikeys:create'
'org-apikeys:read'
'org-apikeys:update'
'org-apikeys:delete'

// Partner API Keys
'partner-apikeys:create'
'partner-apikeys:read'
'partner-apikeys:update'
'partner-apikeys:delete'

// Audit
'audit:read'
```

### OrgUserRole (Organization Users)

```typescript
type OrgUserRole = 'admin' | 'contributor' | 'user' | 'viewer';
```

| Role | Description |
|------|-------------|
| `'admin'` | Full organization access |
| `'contributor'` | Can create and edit content |
| `'user'` | Standard user access |
| `'viewer'` | Read-only access |

### PartnerUserRole (Partner Portal Users)

```typescript
type PartnerUserRole = 'admin' | 'member' | 'viewer';
```

| Role | Description |
|------|-------------|
| `'admin'` | Full partner portal access |
| `'member'` | Standard partner access (respects permissions) |
| `'viewer'` | Read-only access to partner portal |

### PartnerPermissions

```typescript
interface PartnerPermissions {
  canManageOrgs: boolean;           // Create, update, delete organizations
  canManageOrgUsers: boolean;       // Manage users within organizations
  canManagePartnerUsers: boolean;   // Manage other partner portal users
  canManageOrgAPIKeys: boolean;     // Manage organization API keys
  canManagePartnerAPIKeys: boolean; // Manage partner API keys
  canUpdateEntitlements: boolean;   // Update organization entitlements
  canViewAuditLogs: boolean;        // View audit logs
}
```

---

## Error Handling

The SDK provides typed error classes for different error scenarios:

```typescript
import {
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from '@turbodocx/sdk';

try {
  const result = await TurboPartner.createOrganization({ name: 'Acme Corp' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    // 401 - Invalid API key or partner ID
    console.error(`Authentication failed: ${error.message}`);
  } else if (error instanceof ValidationError) {
    // 400 - Invalid request data
    console.error(`Validation error: ${error.message}`);
  } else if (error instanceof NotFoundError) {
    // 404 - Organization or resource not found
    console.error(`Not found: ${error.message}`);
  } else if (error instanceof RateLimitError) {
    // 429 - Rate limit exceeded
    console.error(`Rate limit: ${error.message}`);
  } else if (error instanceof NetworkError) {
    // Network/connection error
    console.error(`Network error: ${error.message}`);
  } else if (error instanceof TurboDocxError) {
    // Other API error
    console.error(`Error ${error.code}: ${error.message}`);
  }
}
```

### Error Classes

| Error Class | Status Code | Description |
|-------------|-------------|-------------|
| `TurboDocxError` | varies | Base error for all SDK errors |
| `AuthenticationError` | 401 | Invalid or missing API credentials |
| `ValidationError` | 400 | Invalid request parameters |
| `NotFoundError` | 404 | Resource not found |
| `RateLimitError` | 429 | Too many requests |
| `NetworkError` | - | Network connectivity issues |

---

## Complete Example

Here's a complete example showing a typical partner workflow:

```typescript
import { TurboPartner, TurboDocxError } from '@turbodocx/sdk';

// Configure
TurboPartner.configure({
  partnerApiKey: process.env.TURBODOCX_PARTNER_API_KEY!,
  partnerId: process.env.TURBODOCX_PARTNER_ID!,
});

try {
  // 1. Create an organization for a new customer
  const org = await TurboPartner.createOrganization({
    name: 'New Customer Inc',
  });
  console.log(`Created organization: ${org.data.id}`);

  // 2. Set up their entitlements based on their plan
  await TurboPartner.updateOrganizationEntitlements(
    org.data.id,
    {
      features: {
        maxUsers: 25,
        maxStorage: 5368709120,  // 5GB
        hasTDAI: true,
        hasFileDownload: true,
      },
    }
  );
  console.log('Configured entitlements');

  // 3. Add their admin user
  const user = await TurboPartner.addUserToOrganization(
    org.data.id,
    {
      email: 'admin@newcustomer.com',
      role: 'admin',
    }
  );
  console.log(`Added admin user: ${user.data.email}`);

  // 4. Create an API key for their integration
  const apiKey = await TurboPartner.createOrganizationApiKey(
    org.data.id,
    {
      name: 'Production API Key',
      role: 'admin',
    }
  );
  console.log(`Created API key: ${apiKey.data.key}`);

  console.log('\nCustomer setup complete!');
} catch (error) {
  if (error instanceof TurboDocxError) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
- [npm Package](https://www.npmjs.com/package/@turbodocx/sdk)
- [TurboSign JavaScript SDK](/docs/SDKs/javascript) — For digital signature operations
- [API Reference](/docs/API/partner-api) — REST API documentation
