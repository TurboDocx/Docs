---
title: TurboPartner Python SDK
sidebar_position: 11
sidebar_label: "TurboPartner: Python"
description: Official TurboDocx Partner SDK for Python. Manage organizations, users, API keys, and entitlements programmatically with async/await support.
keywords:
  - turbodocx partner
  - turbopartner python
  - partner api python
  - multi-tenant python
  - organization management
  - python sdk partner
  - white label python
  - saas python sdk
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboPartner Python SDK

:::tip Interested in TurboPartner?
TurboPartner is available for integrators and partners. [Contact us](https://www.turbodocx.com/demo) to get started.
:::

The official TurboDocx Partner SDK for Python applications. Build multi-tenant SaaS applications with programmatic organization management, user provisioning, API key management, and entitlement control. Fully async with `httpx`.

<br />

:::info What is TurboPartner?
TurboPartner is the partner management API for TurboDocx. It allows you to programmatically create and manage organizations, users, API keys, and feature entitlements — perfect for building white-label or multi-tenant applications on top of TurboDocx.
:::

## TLDR

```python
import asyncio
import os
from turbodocx_sdk import TurboPartner

async def main():
    # 1. Configure
    TurboPartner.configure(
        partner_api_key=os.environ["TURBODOCX_PARTNER_API_KEY"],
        partner_id=os.environ["TURBODOCX_PARTNER_ID"],
    )

    # 2. Create an organization with entitlements
    org = await TurboPartner.create_organization(
        "Acme Corporation",
        features={
            "maxUsers": 25,                         # Max users allowed
            "maxStorage": 5 * 1024 * 1024 * 1024,  # 5GB in bytes
            "hasTDAI": True,                        # Enable TurboDocx AI
        },
    )
    org_id = org["data"]["id"]

    # 3. Add a user
    user = await TurboPartner.add_user_to_organization(
        org_id, email="admin@acme.com", role="admin"
    )
    print(f"User: {user['data']['email']}")

    # 4. Create an API key
    key = await TurboPartner.create_organization_api_key(
        org_id, name="Production Key", role="admin"
    )
    print(f"API Key: {key['data']['key']}")  # Save this — only shown once!

asyncio.run(main())
```

---

## Installation

```bash
pip install turbodocx-sdk
# or
poetry add turbodocx-sdk
```

## Requirements

- Python 3.9 or higher
- `httpx` (installed automatically)

---

## Configuration

<Tabs>
<TabItem value="manual" label="Manual Configuration" default>

```python
from turbodocx_sdk import TurboPartner

# Configure with your partner credentials
TurboPartner.configure(
    partner_api_key=os.environ["TURBODOCX_PARTNER_API_KEY"],  # Required: Must start with TDXP-
    partner_id=os.environ["TURBODOCX_PARTNER_ID"],            # Required: Your partner UUID
)
```

</TabItem>
<TabItem value="env" label="From Environment">

```python
from turbodocx_sdk import TurboPartner

# Auto-configure from environment variables
# Reads from TURBODOCX_PARTNER_API_KEY and TURBODOCX_PARTNER_ID
TurboPartner.configure()
```

</TabItem>
</Tabs>

:::caution Partner API Key Required
Partner API keys start with `TDXP-` prefix. These are different from regular organization API keys and provide access to partner-level operations across all your organizations.
:::

### Environment Variables

```bash
# .env or shell environment
export TURBODOCX_PARTNER_API_KEY=TDXP-your-partner-api-key
export TURBODOCX_PARTNER_ID=your-partner-uuid
```

---

## Quick Start

### Create Your First Organization

```python
from turbodocx_sdk import TurboPartner

TurboPartner.configure(
    partner_api_key=os.environ["TURBODOCX_PARTNER_API_KEY"],
    partner_id=os.environ["TURBODOCX_PARTNER_ID"],
)

# Create a new organization
result = await TurboPartner.create_organization("Acme Corporation")

print(f"Organization created!")
print(f"  ID: {result['data']['id']}")
print(f"  Name: {result['data']['name']}")
```

:::caution Always Handle Errors
The above examples omit error handling for brevity. In production, always wrap calls in try/except. See [Error Handling](#error-handling) for complete patterns.
:::

---

## Organization Management

### `create_organization()`

Create a new organization under your partner account.

```python
result = await TurboPartner.create_organization(
    "Acme Corporation",
    features={"maxUsers": 50},      # Optional entitlements override
    metadata={"plan": "enterprise"}, # Optional metadata key-value pairs
)

print(f"Organization ID: {result['data']['id']}")
```

### `list_organizations()`

List all organizations with pagination and search.

```python
result = await TurboPartner.list_organizations(
    limit=25,
    offset=0,
    search="Acme",  # Optional search by name
)

print(f"Total: {result['data']['totalRecords']}")
for org in result["data"]["results"]:
    print(f"- {org['name']} (ID: {org['id']})")
```

### `get_organization_details()`

Get full details including features and tracking for an organization.

```python
result = await TurboPartner.get_organization_details("org-uuid-here")

print(f"Name: {result['data']['name']}")
print(f"Active: {result['data']['isActive']}")

features = result["data"].get("features", {})
if features.get("maxUsers") is not None:
    print(f"Max Users: {features['maxUsers']}")
if features.get("maxStorage") is not None:
    print(f"Max Storage: {features['maxStorage']} bytes")

tracking = result["data"].get("tracking", {})
print(f"Current Users: {tracking.get('numUsers', 0)}")
print(f"Storage Used: {tracking.get('storageUsed', 0)} bytes")
```

### `update_organization_info()`

Update an organization's name.

```python
result = await TurboPartner.update_organization_info(
    "org-uuid-here",
    name="Acme Corp (Updated)",
)
```

### `update_organization_entitlements()`

Update an organization's feature limits and capabilities.

```python
result = await TurboPartner.update_organization_entitlements(
    "org-uuid-here",
    features={
        "maxUsers": 100,
        "maxStorage": 10 * 1024 * 1024 * 1024,  # 10GB
        "maxSignatures": 500,
        "hasTDAI": True,
        "hasFileDownload": True,
        "hasBetaFeatures": False,
    },
    tracking={"numUsers": 5},  # Optional: set tracking counters
)

print("Entitlements updated!")
```

:::info Features vs Tracking
**Features** are limits and capabilities you can set (maxUsers, hasTDAI, etc.).
**Tracking** is read-only usage data (numUsers, storageUsed, etc.).
See [Entitlements Reference](#entitlements-reference) for all available fields.
:::

### `delete_organization()`

Delete an organization (soft delete).

```python
result = await TurboPartner.delete_organization("org-uuid-here")
print(f"Success: {result['success']}")
```

:::danger Use With Caution
Deleting an organization is a destructive operation. All organization data, users, and API keys will be affected.
:::

---

## Organization User Management

### `add_user_to_organization()`

Add a user to an organization with a specific role.

```python
result = await TurboPartner.add_user_to_organization(
    "org-uuid-here",
    email="user@example.com",
    role="admin",  # admin, contributor, user, or viewer
)

print(f"User ID: {result['data']['id']}")
print(f"Invitation sent to: {result['data']['email']}")
```

### `list_organization_users()`

List all users in an organization.

```python
result = await TurboPartner.list_organization_users(
    "org-uuid-here",
    limit=50,
    offset=0,
    search="admin",  # Optional search by email or name
)

print(f"Total Users: {result['data']['totalRecords']}")
for user in result["data"]["results"]:
    print(f"- {user['email']} ({user['role']})")
```

### `update_organization_user_role()`

Change a user's role within an organization.

```python
result = await TurboPartner.update_organization_user_role(
    "org-uuid-here",
    "user-uuid-here",
    role="contributor",
)
```

### `resend_organization_invitation_to_user()`

Resend the invitation email to a pending user.

```python
result = await TurboPartner.resend_organization_invitation_to_user(
    "org-uuid-here",
    "user-uuid-here",
)
```

### `remove_user_from_organization()`

Remove a user from an organization.

```python
result = await TurboPartner.remove_user_from_organization(
    "org-uuid-here",
    "user-uuid-here",
)
```

---

## Organization API Key Management

### `create_organization_api_key()`

Create an API key for an organization.

```python
result = await TurboPartner.create_organization_api_key(
    "org-uuid-here",
    name="Production API Key",
    role="admin",  # admin, contributor, or viewer
)

print(f"Key ID: {result['data']['id']}")
print(f"Full Key: {result['data']['key']}")  # Only shown once!
```

:::caution Save Your API Key
The full API key is only returned once during creation. Store it securely — you won't be able to retrieve it again.
:::

### `list_organization_api_keys()`

List all API keys for an organization.

```python
result = await TurboPartner.list_organization_api_keys(
    "org-uuid-here",
    limit=50,
    offset=0,       # Optional pagination offset
    search="prod",  # Optional search by name
)

for key in result["data"]["results"]:
    print(f"- {key['name']} (Role: {key['role']})")
```

### `update_organization_api_key()`

Update an organization API key's name or role.

```python
result = await TurboPartner.update_organization_api_key(
    "org-uuid-here",
    "api-key-uuid-here",
    name="Updated Key Name",
    role="contributor",
)
```

### `revoke_organization_api_key()`

Revoke (delete) an organization API key.

```python
result = await TurboPartner.revoke_organization_api_key(
    "org-uuid-here",
    "api-key-uuid-here",
)
```

---

## Partner API Key Management

### `create_partner_api_key()`

Create a new partner-level API key with specific scopes.

```python
from turbodocx_sdk import (
    SCOPE_ORG_CREATE,
    SCOPE_ORG_READ,
    SCOPE_ORG_UPDATE,
    SCOPE_ENTITLEMENTS_UPDATE,
    SCOPE_AUDIT_READ,
)

result = await TurboPartner.create_partner_api_key(
    name="Integration API Key",
    scopes=[
        SCOPE_ORG_CREATE,
        SCOPE_ORG_READ,
        SCOPE_ORG_UPDATE,
        SCOPE_ENTITLEMENTS_UPDATE,
        SCOPE_AUDIT_READ,
    ],
    description="For third-party integration",
)

print(f"Key ID: {result['data']['id']}")
print(f"Full Key: {result['data']['key']}")  # Only shown once!
```

### `list_partner_api_keys()`

List all partner API keys.

```python
result = await TurboPartner.list_partner_api_keys(
    limit=50,
    offset=0,       # Optional pagination offset
    search="integ",  # Optional search by name
)

for key in result["data"]["results"]:
    print(f"- {key['name']}")
    print(f"  Scopes: {key['scopes']}")
```

### `update_partner_api_key()`

Update a partner API key.

```python
result = await TurboPartner.update_partner_api_key(
    "partner-key-uuid-here",
    name="Updated Integration Key",
    description="Updated description",
    scopes=[SCOPE_ORG_READ, SCOPE_AUDIT_READ],  # Optional: update scopes
)
```

### `revoke_partner_api_key()`

Revoke a partner API key.

```python
result = await TurboPartner.revoke_partner_api_key("partner-key-uuid-here")
```

---

## Partner User Management

### `add_user_to_partner_portal()`

Add a user to the partner portal with specific permissions.

```python
result = await TurboPartner.add_user_to_partner_portal(
    email="admin@partner.com",
    role="admin",  # admin, member, or viewer
    permissions={
        "canManageOrgs": True,
        "canManageOrgUsers": True,
        "canManagePartnerUsers": False,
        "canManageOrgAPIKeys": True,
        "canManagePartnerAPIKeys": False,
        "canUpdateEntitlements": True,
        "canViewAuditLogs": True,
    },
)

print(f"Partner User ID: {result['data']['id']}")
```

### `list_partner_portal_users()`

List all partner portal users.

```python
result = await TurboPartner.list_partner_portal_users(
    limit=50,
    offset=0,        # Optional pagination offset
    search="admin",  # Optional search by email or name
)

for user in result["data"]["results"]:
    print(f"- {user['email']} (Role: {user['role']})")
```

### `update_partner_user_permissions()`

Update a partner user's role and permissions.

```python
result = await TurboPartner.update_partner_user_permissions(
    "partner-user-uuid-here",
    role="admin",
    permissions={
        "canManageOrgs": True,
        "canManageOrgUsers": True,
        "canManagePartnerUsers": True,
        "canManageOrgAPIKeys": True,
        "canManagePartnerAPIKeys": True,
        "canUpdateEntitlements": True,
        "canViewAuditLogs": True,
    },
)
```

### `resend_partner_portal_invitation_to_user()`

Resend the invitation email to a pending partner user.

```python
result = await TurboPartner.resend_partner_portal_invitation_to_user(
    "partner-user-uuid-here"
)
```

### `remove_user_from_partner_portal()`

Remove a user from the partner portal.

```python
result = await TurboPartner.remove_user_from_partner_portal(
    "partner-user-uuid-here"
)
```

---

## Audit Logs

### `get_partner_audit_logs()`

Get audit logs for all partner activities with filtering.

```python
result = await TurboPartner.get_partner_audit_logs(
    limit=50,
    offset=0,
    search="acme",                 # Optional search query
    action="ORG_CREATED",          # Optional filter by action
    resource_type="organization",  # Optional filter by resource type
    resource_id="org-uuid-here",   # Optional filter by resource ID
    success=True,                  # Optional filter by success/failure
    start_date="2024-01-01",       # Optional date range start
    end_date="2024-12-31",         # Optional date range end
)

for entry in result["data"]["results"]:
    status = "Success" if entry["success"] else "Failed"
    resource = f" ({entry['resourceType']})" if entry.get("resourceType") else ""
    print(f"{entry['createdOn']} - {entry['action']}{resource} - {status}")
```

---

## Entitlements Reference

### Features (Settable Limits)

These are limits and capabilities you can configure for each organization:

| Field | Type | Description |
|-------|------|-------------|
| `maxUsers` | `int` | Maximum users allowed (-1 = unlimited) |
| `maxProjectspaces` | `int` | Maximum projectspaces |
| `maxTemplates` | `int` | Maximum templates |
| `maxStorage` | `int` | Maximum storage in bytes |
| `maxGeneratedDeliverables` | `int` | Maximum generated documents |
| `maxSignatures` | `int` | Maximum e-signatures |
| `maxAICredits` | `int` | Maximum AI credits |
| `rdWatermark` | `bool` | Enable RapidDocx watermark |
| `hasFileDownload` | `bool` | Enable file download |
| `hasAdvancedDateFormats` | `bool` | Enable advanced date formats |
| `hasGDrive` | `bool` | Enable Google Drive integration |
| `hasSharepoint` | `bool` | Enable SharePoint integration |
| `hasSharepointOnly` | `bool` | SharePoint-only mode |
| `hasTDAI` | `bool` | Enable TurboDocx AI features |
| `hasPptx` | `bool` | Enable PowerPoint support |
| `hasTDWriter` | `bool` | Enable TurboDocx Writer |
| `hasSalesforce` | `bool` | Enable Salesforce integration |
| `hasWrike` | `bool` | Enable Wrike integration |
| `hasVariableStack` | `bool` | Enable variable stack |
| `hasSubvariables` | `bool` | Enable subvariables |
| `hasZapier` | `bool` | Enable Zapier integration |
| `hasBYOM` | `bool` | Enable Bring Your Own Model |
| `hasBYOVS` | `bool` | Enable Bring Your Own Vector Store |
| `hasBetaFeatures` | `bool` | Enable beta features |
| `enableBulkSending` | `bool` | Enable bulk document sending |

:::tip Dictionary-Based Configuration
Pass features as a plain dictionary with camelCase keys. The SDK sends them directly to the API:
```python
features={"maxUsers": 25, "hasTDAI": True}
```
:::

### Tracking (Read-Only Usage)

These are usage counters that are read-only:

| Field | Type | Description |
|-------|------|-------------|
| `numUsers` | `int` | Current number of users |
| `numProjectspaces` | `int` | Current number of projectspaces |
| `numTemplates` | `int` | Current number of templates |
| `storageUsed` | `int` | Current storage used in bytes |
| `numGeneratedDeliverables` | `int` | Total documents generated |
| `numSignaturesUsed` | `int` | Total signatures used |
| `currentAICredits` | `int` | Remaining AI credits |

---

## Scope Constants

### Partner Scopes (22 Scopes)

```python
from turbodocx_sdk import (
    # Organization CRUD
    SCOPE_ORG_CREATE,           # "org:create"
    SCOPE_ORG_READ,             # "org:read"
    SCOPE_ORG_UPDATE,           # "org:update"
    SCOPE_ORG_DELETE,           # "org:delete"

    # Entitlements
    SCOPE_ENTITLEMENTS_UPDATE,  # "entitlements:update"

    # Organization Users
    SCOPE_ORG_USERS_CREATE,     # "org-users:create"
    SCOPE_ORG_USERS_READ,       # "org-users:read"
    SCOPE_ORG_USERS_UPDATE,     # "org-users:update"
    SCOPE_ORG_USERS_DELETE,     # "org-users:delete"

    # Partner Users
    SCOPE_PARTNER_USERS_CREATE,   # "partner-users:create"
    SCOPE_PARTNER_USERS_READ,     # "partner-users:read"
    SCOPE_PARTNER_USERS_UPDATE,   # "partner-users:update"
    SCOPE_PARTNER_USERS_DELETE,   # "partner-users:delete"

    # Organization API Keys
    SCOPE_ORG_APIKEYS_CREATE,     # "org-apikeys:create"
    SCOPE_ORG_APIKEYS_READ,       # "org-apikeys:read"
    SCOPE_ORG_APIKEYS_UPDATE,     # "org-apikeys:update"
    SCOPE_ORG_APIKEYS_DELETE,     # "org-apikeys:delete"

    # Partner API Keys
    SCOPE_PARTNER_APIKEYS_CREATE,  # "partner-apikeys:create"
    SCOPE_PARTNER_APIKEYS_READ,    # "partner-apikeys:read"
    SCOPE_PARTNER_APIKEYS_UPDATE,  # "partner-apikeys:update"
    SCOPE_PARTNER_APIKEYS_DELETE,  # "partner-apikeys:delete"

    # Audit
    SCOPE_AUDIT_READ,              # "audit:read"
)
```

### Organization User Roles

| Role | Description |
|------|-------------|
| `"admin"` | Full organization access |
| `"contributor"` | Can create and edit content |
| `"user"` | Standard user access |
| `"viewer"` | Read-only access |

### Partner User Roles

| Role | Description |
|------|-------------|
| `"admin"` | Full partner portal access |
| `"member"` | Standard partner access (respects permissions) |
| `"viewer"` | Read-only access to partner portal |

### Partner Permissions

```python
permissions = {
    "canManageOrgs": True,           # Create, update, delete organizations
    "canManageOrgUsers": True,       # Manage users within organizations
    "canManagePartnerUsers": False,  # Manage other partner portal users
    "canManageOrgAPIKeys": True,     # Manage organization API keys
    "canManagePartnerAPIKeys": False, # Manage partner API keys
    "canUpdateEntitlements": True,   # Update organization entitlements
    "canViewAuditLogs": True,        # View audit logs
}
```

---

## Error Handling

The SDK provides typed exceptions for different error scenarios:

```python
from turbodocx_sdk import (
    TurboPartner, TurboDocxError,
    AuthenticationError, ValidationError,
    NotFoundError, RateLimitError, NetworkError,
)

try:
    result = await TurboPartner.create_organization("Acme Corp")
except AuthenticationError as e:
    # 401 - Invalid API key or partner ID
    print(f"Authentication failed: {e}")
    print(f"  HTTP Status: {e.status_code}")
except ValidationError as e:
    # 400 - Invalid request data
    print(f"Validation error: {e}")
    print(f"  HTTP Status: {e.status_code}")
except NotFoundError as e:
    # 404 - Resource not found
    print(f"Not found: {e}")
except RateLimitError as e:
    # 429 - Too many requests
    print(f"Rate limited: {e}")
except NetworkError as e:
    # Network connectivity issues
    print(f"Network error: {e}")
except TurboDocxError as e:
    # Any other API error
    print(f"API error: {e}")
    if hasattr(e, "status_code"):
        print(f"  HTTP Status: {e.status_code}")
    if hasattr(e, "code") and e.code:
        print(f"  Error Code: {e.code}")
```

### Error Types

| Error Type | Status Code | Description |
|------------|-------------|-------------|
| `TurboDocxError` | varies | Base error for all SDK errors |
| `AuthenticationError` | 401 | Invalid or missing API credentials |
| `ValidationError` | 400 | Invalid request parameters |
| `NotFoundError` | 404 | Resource not found |
| `RateLimitError` | 429 | Too many requests |
| `NetworkError` | - | Network connectivity issues |

---

## Complete Example

Here's a complete example showing a typical partner workflow:

```python
import asyncio
import os
from turbodocx_sdk import TurboPartner, TurboDocxError

async def main():
    # Configure
    TurboPartner.configure(
        partner_api_key=os.environ["TURBODOCX_PARTNER_API_KEY"],
        partner_id=os.environ["TURBODOCX_PARTNER_ID"],
    )

    # 1. Create an organization for a new customer
    org = await TurboPartner.create_organization("New Customer Inc")
    org_id = org["data"]["id"]
    print(f"Created organization: {org_id}")

    # 2. Set up their entitlements based on their plan
    await TurboPartner.update_organization_entitlements(
        org_id,
        features={
            "maxUsers": 25,
            "maxStorage": 5 * 1024 * 1024 * 1024,  # 5GB
            "hasTDAI": True,
            "hasFileDownload": True,
        },
    )
    print("Configured entitlements")

    # 3. Add their admin user
    user = await TurboPartner.add_user_to_organization(
        org_id, email="admin@newcustomer.com", role="admin"
    )
    print(f"Added admin user: {user['data']['email']}")

    # 4. Create an API key for their integration
    api_key = await TurboPartner.create_organization_api_key(
        org_id, name="Production API Key", role="admin"
    )
    print(f"Created API key: {api_key['data']['key']}")

    print("\nCustomer setup complete!")

asyncio.run(main())
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
- [PyPI Package](https://pypi.org/project/turbodocx-sdk/)
- [TurboSign Python SDK](/docs/SDKs/python) — For digital signature operations
- [SDKs Overview](/docs/SDKs/) — All TurboDocx SDKs
