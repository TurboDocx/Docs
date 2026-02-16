---
title: TurboPartner PHP SDK
sidebar_position: 10
sidebar_label: "TurboPartner: PHP"
description: Official TurboDocx Partner SDK for PHP. Manage organizations, users, API keys, and entitlements programmatically with PHP 8.1+.
keywords:
  - turbodocx partner
  - turbopartner php
  - partner api php
  - multi-tenant php
  - organization management
  - php sdk partner
  - white label php
  - saas php sdk
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboPartner PHP SDK

:::tip Interested in TurboPartner?
TurboPartner is available for integrators and partners. [Contact us](https://www.turbodocx.com/demo) to get started.
:::

The official TurboDocx Partner SDK for PHP applications. Build multi-tenant SaaS applications with programmatic organization management, user provisioning, API key management, and entitlement control. Available on Packagist as `turbodocx/sdk`.

<br />

:::info What is TurboPartner?
TurboPartner is the partner management API for TurboDocx. It allows you to programmatically create and manage organizations, users, API keys, and feature entitlements — perfect for building white-label or multi-tenant applications on top of TurboDocx.
:::

## TLDR

```php
<?php

require 'vendor/autoload.php';

use TurboDocx\TurboPartner;
use TurboDocx\Config\PartnerClientConfig;
use TurboDocx\Types\Requests\Partner\CreateOrganizationRequest;
use TurboDocx\Types\Requests\Partner\AddOrgUserRequest;
use TurboDocx\Types\Requests\Partner\CreateOrgApiKeyRequest;
use TurboDocx\Types\Enums\OrgUserRole;

// 1. Configure
TurboPartner::configure(new PartnerClientConfig(
    partnerApiKey: $_ENV['TURBODOCX_PARTNER_API_KEY'],
    partnerId: $_ENV['TURBODOCX_PARTNER_ID'],
));

// 2. Create an organization with entitlements
$org = TurboPartner::createOrganization(
    new CreateOrganizationRequest(
        name: 'Acme Corporation',
        features: [
            'maxUsers' => 25,              // Max users allowed
            'maxStorage' => 5368709120,    // 5GB in bytes
            'hasTDAI' => true,             // Enable TurboDocx AI
        ]
    )
);
$orgId = $org->data->id;

// 3. Add a user
$user = TurboPartner::addUserToOrganization($orgId,
    new AddOrgUserRequest(email: 'admin@acme.com', role: OrgUserRole::ADMIN)
);

// 4. Create an API key
$key = TurboPartner::createOrganizationApiKey($orgId,
    new CreateOrgApiKeyRequest(name: 'Production Key', role: 'admin')
);
echo "API Key: {$key->data->key}\n"; // Save this — only shown once!
```

---

## Installation

```bash
composer require turbodocx/sdk
```

## Requirements

- PHP 8.1 or higher
- Composer
- ext-json
- ext-curl

:::tip Modern PHP Features
This SDK leverages PHP 8.1+ features including enums, named parameters, readonly classes, and match expressions for a superior developer experience.
:::

---

## Configuration

<Tabs>
<TabItem value="manual" label="Manual Configuration" default>

```php
<?php

use TurboDocx\TurboPartner;
use TurboDocx\Config\PartnerClientConfig;

// Configure with your partner credentials
TurboPartner::configure(new PartnerClientConfig(
    partnerApiKey: $_ENV['TURBODOCX_PARTNER_API_KEY'],  // Required: Must start with TDXP-
    partnerId: $_ENV['TURBODOCX_PARTNER_ID'],           // Required: Your partner UUID
));
```

</TabItem>
<TabItem value="env" label="From Environment">

```php
<?php

use TurboDocx\TurboPartner;
use TurboDocx\Config\PartnerClientConfig;

// Auto-configure from environment variables
TurboPartner::configure(PartnerClientConfig::fromEnvironment());

// Reads from: TURBODOCX_PARTNER_API_KEY, TURBODOCX_PARTNER_ID
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

```php
<?php

use TurboDocx\TurboPartner;
use TurboDocx\Config\PartnerClientConfig;
use TurboDocx\Types\Requests\Partner\CreateOrganizationRequest;

// Configure with your partner credentials
TurboPartner::configure(PartnerClientConfig::fromEnvironment());

// Create a new organization
$result = TurboPartner::createOrganization(
    new CreateOrganizationRequest(
        name: 'Acme Corporation'
    )
);

echo "Organization created!\n";
echo "  ID: {$result->data->id}\n";
echo "  Name: {$result->data->name}\n";
```

:::caution Always Handle Errors
The above examples omit error handling for brevity. In production, wrap all TurboPartner calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

---

## Organization Management

### `createOrganization()`

Create a new organization under your partner account.

```php
use TurboDocx\Types\Requests\Partner\CreateOrganizationRequest;

$result = TurboPartner::createOrganization(
    new CreateOrganizationRequest(
        name: 'Acme Corporation',
        features: ['maxUsers' => 50]  // Optional entitlements override
    )
);

echo "Organization ID: {$result->data->id}\n";
```

### `listOrganizations()`

List all organizations with pagination and search.

```php
use TurboDocx\Types\Requests\Partner\ListOrganizationsRequest;

$result = TurboPartner::listOrganizations(
    new ListOrganizationsRequest(
        limit: 25,
        offset: 0,
        search: 'Acme'  // Optional search by name
    )
);

echo "Total: {$result->totalRecords}\n";
foreach ($result->results as $org) {
    echo "- {$org->name} (ID: {$org->id})\n";
}
```

### `getOrganizationDetails()`

Get full details including features and tracking for an organization.

```php
$result = TurboPartner::getOrganizationDetails('org-uuid-here');

echo "Name: {$result->organization->name}\n";
echo "Active: " . ($result->organization->isActive ? 'Yes' : 'No') . "\n";

if ($result->features) {
    echo "Max Users: {$result->features->maxUsers}\n";
    echo "Max Storage: {$result->features->maxStorage} bytes\n";
}

if ($result->tracking) {
    echo "Current Users: {$result->tracking->numUsers}\n";
    echo "Storage Used: {$result->tracking->storageUsed} bytes\n";
}
```

### `updateOrganizationInfo()`

Update an organization's name.

```php
use TurboDocx\Types\Requests\Partner\UpdateOrganizationRequest;

$result = TurboPartner::updateOrganizationInfo(
    'org-uuid-here',
    new UpdateOrganizationRequest(
        name: 'Acme Corp (Updated)'
    )
);
```

### `updateOrganizationEntitlements()`

Update an organization's feature limits and capabilities.

```php
use TurboDocx\Types\Requests\Partner\UpdateEntitlementsRequest;

$result = TurboPartner::updateOrganizationEntitlements(
    'org-uuid-here',
    new UpdateEntitlementsRequest(
        features: [
            'maxUsers' => 100,
            'maxStorage' => 10737418240,  // 10GB in bytes
            'maxSignatures' => 500,
            'hasTDAI' => true,
            'hasFileDownload' => true,
            'hasBetaFeatures' => false,
        ]
    )
);

echo "Entitlements updated!\n";
```

:::info Features vs Tracking
**Features** are limits and capabilities you can set (maxUsers, hasTDAI, etc.).
**Tracking** is read-only usage data (numUsers, storageUsed, etc.).
See [Entitlements Reference](#entitlements-reference) for all available fields.
:::

### `deleteOrganization()`

Delete an organization (soft delete).

```php
$result = TurboPartner::deleteOrganization('org-uuid-here');
echo "Success: " . ($result->success ? 'Yes' : 'No') . "\n";
```

:::danger Use With Caution
Deleting an organization is a destructive operation. All organization data, users, and API keys will be affected.
:::

---

## Organization User Management

### `addUserToOrganization()`

Add a user to an organization with a specific role.

```php
use TurboDocx\Types\Requests\Partner\AddOrgUserRequest;
use TurboDocx\Types\Enums\OrgUserRole;

$result = TurboPartner::addUserToOrganization(
    'org-uuid-here',
    new AddOrgUserRequest(
        email: 'user@example.com',
        role: OrgUserRole::ADMIN  // ADMIN, CONTRIBUTOR, USER, or VIEWER
    )
);

echo "User ID: {$result->data->id}\n";
echo "Invitation sent to: {$result->data->email}\n";
```

### `listOrganizationUsers()`

List all users in an organization.

```php
use TurboDocx\Types\Requests\Partner\ListOrgUsersRequest;

$result = TurboPartner::listOrganizationUsers(
    'org-uuid-here',
    new ListOrgUsersRequest(limit: 50, offset: 0)
);

echo "Total Users: {$result->totalRecords}\n";
foreach ($result->results as $user) {
    echo "- {$user->email} ({$user->role})\n";
}
```

### `updateOrganizationUserRole()`

Change a user's role within an organization.

```php
use TurboDocx\Types\Requests\Partner\UpdateOrgUserRequest;
use TurboDocx\Types\Enums\OrgUserRole;

$result = TurboPartner::updateOrganizationUserRole(
    'org-uuid-here',
    'user-uuid-here',
    new UpdateOrgUserRequest(role: OrgUserRole::CONTRIBUTOR)
);
```

### `resendOrganizationInvitationToUser()`

Resend the invitation email to a pending user.

```php
$result = TurboPartner::resendOrganizationInvitationToUser(
    'org-uuid-here',
    'user-uuid-here'
);
```

### `removeUserFromOrganization()`

Remove a user from an organization.

```php
$result = TurboPartner::removeUserFromOrganization(
    'org-uuid-here',
    'user-uuid-here'
);
```

---

## Organization API Key Management

### `createOrganizationApiKey()`

Create an API key for an organization.

```php
use TurboDocx\Types\Requests\Partner\CreateOrgApiKeyRequest;

$result = TurboPartner::createOrganizationApiKey(
    'org-uuid-here',
    new CreateOrgApiKeyRequest(
        name: 'Production API Key',
        role: 'admin'  // admin, contributor, or viewer
    )
);

echo "Key ID: {$result->data->id}\n";
echo "Full Key: {$result->data->key}\n";  // Only shown once!
```

:::caution Save Your API Key
The full API key is only returned once during creation. Store it securely — you won't be able to retrieve it again.
:::

### `listOrganizationApiKeys()`

List all API keys for an organization.

```php
use TurboDocx\Types\Requests\Partner\ListOrgApiKeysRequest;

$result = TurboPartner::listOrganizationApiKeys(
    'org-uuid-here',
    new ListOrgApiKeysRequest(limit: 50)
);

foreach ($result->results as $key) {
    echo "- {$key->name} (Role: {$key->role})\n";
}
```

### `updateOrganizationApiKey()`

Update an organization API key's name or role.

```php
use TurboDocx\Types\Requests\Partner\UpdateOrgApiKeyRequest;

$result = TurboPartner::updateOrganizationApiKey(
    'org-uuid-here',
    'api-key-uuid-here',
    new UpdateOrgApiKeyRequest(
        name: 'Updated Key Name',
        role: 'contributor'
    )
);
```

### `revokeOrganizationApiKey()`

Revoke (delete) an organization API key.

```php
$result = TurboPartner::revokeOrganizationApiKey(
    'org-uuid-here',
    'api-key-uuid-here'
);
```

---

## Partner API Key Management

### `createPartnerApiKey()`

Create a new partner-level API key with specific scopes.

```php
use TurboDocx\Types\Requests\Partner\CreatePartnerApiKeyRequest;
use TurboDocx\Types\Enums\PartnerScope;

$result = TurboPartner::createPartnerApiKey(
    new CreatePartnerApiKeyRequest(
        name: 'Integration API Key',
        scopes: [
            PartnerScope::ORG_CREATE,
            PartnerScope::ORG_READ,
            PartnerScope::ORG_UPDATE,
            PartnerScope::ENTITLEMENTS_UPDATE,
            PartnerScope::AUDIT_READ,
        ],
        description: 'For third-party integration'
    )
);

echo "Key ID: {$result->data->id}\n";
echo "Full Key: {$result->data->key}\n";  // Only shown once!
```

### `listPartnerApiKeys()`

List all partner API keys.

```php
use TurboDocx\Types\Requests\Partner\ListPartnerApiKeysRequest;

$result = TurboPartner::listPartnerApiKeys(
    new ListPartnerApiKeysRequest(limit: 50)
);

foreach ($result->results as $key) {
    echo "- {$key->name}\n";
    echo "  Scopes: " . implode(', ', $key->scopes ?? []) . "\n";
}
```

### `updatePartnerApiKey()`

Update a partner API key.

```php
use TurboDocx\Types\Requests\Partner\UpdatePartnerApiKeyRequest;

$result = TurboPartner::updatePartnerApiKey(
    'partner-key-uuid-here',
    new UpdatePartnerApiKeyRequest(
        name: 'Updated Integration Key',
        description: 'Updated description'
    )
);
```

### `revokePartnerApiKey()`

Revoke a partner API key.

```php
$result = TurboPartner::revokePartnerApiKey('partner-key-uuid-here');
```

---

## Partner User Management

### `addUserToPartnerPortal()`

Add a user to the partner portal with specific permissions.

```php
use TurboDocx\Types\Requests\Partner\AddPartnerUserRequest;
use TurboDocx\Types\Partner\PartnerPermissions;

$result = TurboPartner::addUserToPartnerPortal(
    new AddPartnerUserRequest(
        email: 'admin@partner.com',
        role: 'admin',  // admin, member, or viewer
        permissions: new PartnerPermissions(
            canManageOrgs: true,
            canManageOrgUsers: true,
            canManagePartnerUsers: false,
            canManageOrgAPIKeys: true,
            canManagePartnerAPIKeys: false,
            canUpdateEntitlements: true,
            canViewAuditLogs: true
        )
    )
);

echo "Partner User ID: {$result->data->id}\n";
```

### `listPartnerPortalUsers()`

List all partner portal users.

```php
use TurboDocx\Types\Requests\Partner\ListPartnerUsersRequest;

$result = TurboPartner::listPartnerPortalUsers(
    new ListPartnerUsersRequest(limit: 50)
);

foreach ($result->results as $user) {
    echo "- {$user->email} (Role: {$user->role})\n";
}
```

### `updatePartnerUserPermissions()`

Update a partner user's role and permissions.

```php
use TurboDocx\Types\Requests\Partner\UpdatePartnerUserRequest;
use TurboDocx\Types\Partner\PartnerPermissions;

$result = TurboPartner::updatePartnerUserPermissions(
    'partner-user-uuid-here',
    new UpdatePartnerUserRequest(
        role: 'admin',
        permissions: new PartnerPermissions(
            canManageOrgs: true,
            canManageOrgUsers: true,
            canManagePartnerUsers: true,
            canManageOrgAPIKeys: true,
            canManagePartnerAPIKeys: true,
            canUpdateEntitlements: true,
            canViewAuditLogs: true
        )
    )
);
```

### `resendPartnerPortalInvitationToUser()`

Resend the invitation email to a pending partner user.

```php
$result = TurboPartner::resendPartnerPortalInvitationToUser('partner-user-uuid-here');
```

### `removeUserFromPartnerPortal()`

Remove a user from the partner portal.

```php
$result = TurboPartner::removeUserFromPartnerPortal('partner-user-uuid-here');
```

---

## Audit Logs

### `getPartnerAuditLogs()`

Get audit logs for all partner activities with filtering.

```php
use TurboDocx\Types\Requests\Partner\ListAuditLogsRequest;

$result = TurboPartner::getPartnerAuditLogs(
    new ListAuditLogsRequest(
        limit: 50,
        offset: 0,
        action: 'ORG_CREATED',           // Optional filter by action
        resourceType: 'organization',    // Optional filter by resource type
        success: true,                   // Optional filter by success/failure
        startDate: '2024-01-01',        // Optional date range start
        endDate: '2024-12-31'           // Optional date range end
    )
);

foreach ($result->results as $entry) {
    echo "{$entry->createdOn} - {$entry->action}";
    if ($entry->resourceType) {
        echo " ({$entry->resourceType})";
    }
    echo " - " . ($entry->success ? 'Success' : 'Failed') . "\n";
}
```

---

## Entitlements Reference

### Features (Settable Limits)

These are limits and capabilities you can configure for each organization:

| Field | Type | Description |
|-------|------|-------------|
| `maxUsers` | int | Maximum users allowed (-1 = unlimited) |
| `maxProjectspaces` | int | Maximum projectspaces |
| `maxTemplates` | int | Maximum templates |
| `maxStorage` | int | Maximum storage in bytes |
| `maxGeneratedDeliverables` | int | Maximum generated documents |
| `maxSignatures` | int | Maximum e-signatures |
| `maxAICredits` | int | Maximum AI credits |
| `rdWatermark` | bool | Enable RapidDocx watermark |
| `hasFileDownload` | bool | Enable file download |
| `hasAdvancedDateFormats` | bool | Enable advanced date formats |
| `hasGDrive` | bool | Enable Google Drive integration |
| `hasSharepoint` | bool | Enable SharePoint integration |
| `hasSharepointOnly` | bool | SharePoint-only mode |
| `hasTDAI` | bool | Enable TurboDocx AI features |
| `hasPptx` | bool | Enable PowerPoint support |
| `hasTDWriter` | bool | Enable TurboDocx Writer |
| `hasSalesforce` | bool | Enable Salesforce integration |
| `hasWrike` | bool | Enable Wrike integration |
| `hasVariableStack` | bool | Enable variable stack |
| `hasSubvariables` | bool | Enable subvariables |
| `hasZapier` | bool | Enable Zapier integration |
| `hasBYOM` | bool | Enable Bring Your Own Model |
| `hasBYOVS` | bool | Enable Bring Your Own Vector Store |
| `hasBetaFeatures` | bool | Enable beta features |
| `enableBulkSending` | bool | Enable bulk document sending |

### Tracking (Read-Only Usage)

These are usage counters that are read-only:

| Field | Type | Description |
|-------|------|-------------|
| `numUsers` | int | Current number of users |
| `numProjectspaces` | int | Current number of projectspaces |
| `numTemplates` | int | Current number of templates |
| `storageUsed` | int | Current storage used in bytes |
| `numGeneratedDeliverables` | int | Total documents generated |
| `numSignaturesUsed` | int | Total signatures used |
| `currentAICredits` | int | Remaining AI credits |

---

## Enums and Types

### PartnerScope (22 Scopes)

```php
use TurboDocx\Types\Enums\PartnerScope;

// Organization CRUD
PartnerScope::ORG_CREATE         // 'org:create'
PartnerScope::ORG_READ           // 'org:read'
PartnerScope::ORG_UPDATE         // 'org:update'
PartnerScope::ORG_DELETE         // 'org:delete'

// Entitlements
PartnerScope::ENTITLEMENTS_UPDATE  // 'entitlements:update'

// Organization Users
PartnerScope::ORG_USERS_CREATE   // 'org-users:create'
PartnerScope::ORG_USERS_READ     // 'org-users:read'
PartnerScope::ORG_USERS_UPDATE   // 'org-users:update'
PartnerScope::ORG_USERS_DELETE   // 'org-users:delete'

// Partner Users
PartnerScope::PARTNER_USERS_CREATE  // 'partner-users:create'
PartnerScope::PARTNER_USERS_READ    // 'partner-users:read'
PartnerScope::PARTNER_USERS_UPDATE  // 'partner-users:update'
PartnerScope::PARTNER_USERS_DELETE  // 'partner-users:delete'

// Organization API Keys
PartnerScope::ORG_APIKEYS_CREATE    // 'org-apikeys:create'
PartnerScope::ORG_APIKEYS_READ      // 'org-apikeys:read'
PartnerScope::ORG_APIKEYS_UPDATE    // 'org-apikeys:update'
PartnerScope::ORG_APIKEYS_DELETE    // 'org-apikeys:delete'

// Partner API Keys
PartnerScope::PARTNER_APIKEYS_CREATE  // 'partner-apikeys:create'
PartnerScope::PARTNER_APIKEYS_READ    // 'partner-apikeys:read'
PartnerScope::PARTNER_APIKEYS_UPDATE  // 'partner-apikeys:update'
PartnerScope::PARTNER_APIKEYS_DELETE  // 'partner-apikeys:delete'

// Audit
PartnerScope::AUDIT_READ          // 'audit:read'
```

### OrgUserRole (Organization Users)

```php
use TurboDocx\Types\Enums\OrgUserRole;

OrgUserRole::ADMIN        // Full organization access
OrgUserRole::CONTRIBUTOR  // Can create and edit content
OrgUserRole::USER         // Standard user access
OrgUserRole::VIEWER       // Read-only access
```

### PartnerUserRole (Partner Portal Users)

```php
use TurboDocx\Types\Enums\PartnerUserRole;

PartnerUserRole::ADMIN   // Full partner portal access
PartnerUserRole::MEMBER  // Standard partner access (respects permissions)
PartnerUserRole::VIEWER  // Read-only access to partner portal
```

### PartnerPermissions

```php
use TurboDocx\Types\Partner\PartnerPermissions;

$permissions = new PartnerPermissions(
    canManageOrgs: true,           // Create, update, delete organizations
    canManageOrgUsers: true,       // Manage users within organizations
    canManagePartnerUsers: false,  // Manage other partner portal users
    canManageOrgAPIKeys: true,     // Manage organization API keys
    canManagePartnerAPIKeys: false, // Manage partner API keys
    canUpdateEntitlements: true,   // Update organization entitlements
    canViewAuditLogs: true         // View audit logs
);
```

---

## Error Handling

The SDK provides typed exceptions for different error scenarios:

```php
use TurboDocx\Exceptions\AuthenticationException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Exceptions\NotFoundException;
use TurboDocx\Exceptions\RateLimitException;
use TurboDocx\Exceptions\NetworkException;

try {
    $result = TurboPartner::createOrganization(/* ... */);
} catch (AuthenticationException $e) {
    // 401 - Invalid API key or partner ID
    echo "Authentication failed: {$e->getMessage()}\n";
} catch (ValidationException $e) {
    // 400 - Invalid request data
    echo "Validation error: {$e->getMessage()}\n";
} catch (NotFoundException $e) {
    // 404 - Organization or resource not found
    echo "Not found: {$e->getMessage()}\n";
} catch (RateLimitException $e) {
    // 429 - Rate limit exceeded
    echo "Rate limit: {$e->getMessage()}\n";
} catch (NetworkException $e) {
    // Network/connection error
    echo "Network error: {$e->getMessage()}\n";
}
```

### Error Classes

| Error Class | Status Code | Description |
|-------------|-------------|-------------|
| `TurboDocxException` | varies | Base exception for all SDK errors |
| `AuthenticationException` | 401 | Invalid or missing API credentials |
| `ValidationException` | 400 | Invalid request parameters |
| `NotFoundException` | 404 | Resource not found |
| `RateLimitException` | 429 | Too many requests |
| `NetworkException` | - | Network connectivity issues |

---

## Complete Example

Here's a complete example showing a typical partner workflow:

```php
<?php

require 'vendor/autoload.php';

use TurboDocx\TurboPartner;
use TurboDocx\Config\PartnerClientConfig;
use TurboDocx\Types\Requests\Partner\CreateOrganizationRequest;
use TurboDocx\Types\Requests\Partner\AddOrgUserRequest;
use TurboDocx\Types\Requests\Partner\CreateOrgApiKeyRequest;
use TurboDocx\Types\Requests\Partner\UpdateEntitlementsRequest;
use TurboDocx\Types\Enums\OrgUserRole;
use TurboDocx\Exceptions\TurboDocxException;

// Configure
TurboPartner::configure(PartnerClientConfig::fromEnvironment());

try {
    // 1. Create an organization for a new customer
    $org = TurboPartner::createOrganization(
        new CreateOrganizationRequest(
            name: 'New Customer Inc'
        )
    );
    echo "Created organization: {$org->data->id}\n";

    // 2. Set up their entitlements based on their plan
    TurboPartner::updateOrganizationEntitlements(
        $org->data->id,
        new UpdateEntitlementsRequest(
            features: [
                'maxUsers' => 25,
                'maxStorage' => 5368709120,  // 5GB
                'hasTDAI' => true,
                'hasFileDownload' => true,
            ]
        )
    );
    echo "Configured entitlements\n";

    // 3. Add their admin user
    $user = TurboPartner::addUserToOrganization(
        $org->data->id,
        new AddOrgUserRequest(
            email: 'admin@newcustomer.com',
            role: OrgUserRole::ADMIN
        )
    );
    echo "Added admin user: {$user->data->email}\n";

    // 4. Create an API key for their integration
    $apiKey = TurboPartner::createOrganizationApiKey(
        $org->data->id,
        new CreateOrgApiKeyRequest(
            name: 'Production API Key',
            role: 'admin'
        )
    );
    echo "Created API key: {$apiKey->data->key}\n";

    echo "\nCustomer setup complete!\n";

} catch (TurboDocxException $e) {
    echo "Error: {$e->getMessage()}\n";
    exit(1);
}
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
- [Packagist Package](https://packagist.org/packages/turbodocx/sdk)
- [TurboSign PHP SDK](/docs/SDKs/php) — For digital signature operations
- [API Reference](/docs/API/partner-api) — REST API documentation
