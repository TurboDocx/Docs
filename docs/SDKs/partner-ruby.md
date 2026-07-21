---
title: TurboPartner Ruby SDK
unlisted: true
sidebar_position: 13
sidebar_label: "TurboPartner: Ruby"
description: Official TurboDocx Partner SDK for Ruby. Manage organizations, users, API keys, and entitlements programmatically from plain Ruby, Rails, or Sinatra.
keywords:
  - turbodocx partner
  - turbopartner ruby
  - partner api ruby
  - multi-tenant ruby
  - organization management
  - ruby sdk partner
  - white label ruby
  - saas ruby sdk
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboPartner Ruby SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbopartner" product="TurboPartner" />

:::tip Interested in TurboPartner?
TurboPartner is available for integrators and partners. [Contact us](https://www.turbodocx.com/demo) to get started.
:::

The official TurboDocx Partner SDK for Ruby applications. Build multi-tenant SaaS applications with programmatic organization management, user provisioning, API key management, and entitlement control — all from plain Ruby 2.7+. Distributed on RubyGems as `turbodocx-sdk` (same gem as TurboSign, TurboQuote, TurboWebhooks, and Deliverable).

<br />

:::info What is TurboPartner?
TurboPartner is the partner management API for TurboDocx. It allows you to programmatically create and manage organizations, users, API keys, and feature entitlements — perfect for building white-label or multi-tenant applications on top of TurboDocx.
:::

## TLDR

```ruby
require "turbodocx_sdk"

# 1. Configure
TurboDocxSdk::TurboPartner.configure(
  partner_api_key: ENV.fetch("TURBODOCX_PARTNER_API_KEY"),
  partner_id:      ENV.fetch("TURBODOCX_PARTNER_ID")
)

# 2. Create an organization with entitlements
org = TurboDocxSdk::TurboPartner.create_organization(
  "name"     => "Acme Corporation",
  "features" => {
    "maxUsers"   => 25,                    # Max users allowed
    "maxStorage" => 5 * 1024 * 1024 * 1024, # 5GB in bytes
    "hasTDAI"    => true                    # Enable TurboDocx AI
  }
)
org_id = org["data"]["id"]

# 3. Add a user
user = TurboDocxSdk::TurboPartner.add_user_to_organization(org_id,
  "email" => "admin@acme.com",
  "role"  => "admin"
)
puts "User: #{user['data']['email']}"

# 4. Create an API key
key = TurboDocxSdk::TurboPartner.create_organization_api_key(org_id,
  "name" => "Production Key",
  "role" => "admin"
)
puts "API Key: #{key['data']['key']}"   # Save this — only shown once!
```

---

## Installation

<Tabs>
<TabItem value="gem" label="gem" default>

```bash
gem install turbodocx-sdk
```

</TabItem>
<TabItem value="bundler" label="Bundler">

```ruby
# Gemfile
gem "turbodocx-sdk"
```

```bash
bundle install
```

</TabItem>
</Tabs>

## Requirements

- Ruby 2.7 or higher
- No runtime dependencies (uses the standard library's `net/http`)

---

## Configuration

<Tabs>
<TabItem value="manual" label="Manual Configuration" default>

```ruby
require "turbodocx_sdk"

# Configure with your partner credentials
TurboDocxSdk::TurboPartner.configure(
  partner_api_key: ENV.fetch("TURBODOCX_PARTNER_API_KEY"), # Required: must start with TDXP-
  partner_id:      ENV.fetch("TURBODOCX_PARTNER_ID")       # Required: your partner UUID
)
```

</TabItem>
<TabItem value="env" label="From Environment">

```ruby
require "turbodocx_sdk"

# Set TURBODOCX_PARTNER_API_KEY and TURBODOCX_PARTNER_ID in the environment
# and skip `configure` entirely — the first call auto-initializes from them.
orgs = TurboDocxSdk::TurboPartner.list_organizations
```

</TabItem>
</Tabs>

:::caution `configure` takes required keyword arguments
`configure(partner_api_key:, partner_id:, base_url: nil)` — both credentials are **required keywords**. There is no zero-argument form: calling `TurboDocxSdk::TurboPartner.configure` with no arguments raises `ArgumentError`. To configure from the environment, simply don't call `configure` at all — the first API call lazily reads `TURBODOCX_PARTNER_API_KEY` and `TURBODOCX_PARTNER_ID`. If neither is set, the call raises `TurboDocxSdk::ValidationError`.
:::

:::caution Partner API Key Required
Partner API keys start with the `TDXP-` prefix. These are different from regular organization API keys and provide access to partner-level operations across all your organizations.
:::

### Environment Variables

```bash
# .env or shell environment
export TURBODOCX_PARTNER_API_KEY=TDXP-your-partner-api-key
export TURBODOCX_PARTNER_ID=your-partner-uuid
```

---

## Method Shape

Every TurboPartner method follows the same Ruby convention:

- **Resource IDs are positional arguments** — `update_organization_info(organization_id, request)`.
- **Request bodies and query filters are a trailing Hash** whose keys are the **camelCase wire keys** the API expects — `"organizationId"`, `"resourceType"`, `"canManageOrgs"`. Method names are snake_case; body keys never are.
- **Responses are the raw API envelope.** Unlike TurboQuote, TurboPartner does not unwrap — read your data out of `result["data"]`, and paginated lists out of `result["data"]["results"]` / `result["data"]["totalRecords"]`.

---

## Quick Start

### Create Your First Organization

```ruby
require "turbodocx_sdk"

TurboDocxSdk::TurboPartner.configure(
  partner_api_key: ENV.fetch("TURBODOCX_PARTNER_API_KEY"),
  partner_id:      ENV.fetch("TURBODOCX_PARTNER_ID")
)

# Create a new organization
result = TurboDocxSdk::TurboPartner.create_organization("name" => "Acme Corporation")

puts "Organization created!"
puts "  ID: #{result['data']['id']}"
puts "  Name: #{result['data']['name']}"
```

:::caution Always Handle Errors
The examples below omit error handling for brevity. In production, always wrap calls in `begin`/`rescue`. See [Error Handling](#error-handling) for complete patterns.
:::

---

## Organization Management

### `create_organization(request)`

Create a new organization under your partner account.

```ruby
result = TurboDocxSdk::TurboPartner.create_organization(
  "name"     => "Acme Corporation",
  "features" => { "maxUsers" => 50 },      # Optional entitlements override
  "metadata" => { "plan" => "enterprise" } # Optional metadata key-value pairs
)

puts "Organization ID: #{result['data']['id']}"
```

### `list_organizations(request = nil)`

List all organizations with pagination and search.

```ruby
result = TurboDocxSdk::TurboPartner.list_organizations(
  "limit"  => 25,
  "offset" => 0,
  "search" => "Acme"   # Optional search by name
)

puts "Total: #{result['data']['totalRecords']}"
result["data"]["results"].each do |org|
  puts "- #{org['name']} (ID: #{org['id']})"
end
```

### `get_organization_details(organization_id)`

Get full details including features and tracking for an organization.

```ruby
result = TurboDocxSdk::TurboPartner.get_organization_details("org-uuid-here")

puts "Name: #{result['data']['name']}"
puts "Active: #{result['data']['isActive']}"

features = result["data"]["features"] || {}
puts "Max Users: #{features['maxUsers']}"     if features["maxUsers"]
puts "Max Storage: #{features['maxStorage']} bytes" if features["maxStorage"]

tracking = result["data"]["tracking"] || {}
puts "Current Users: #{tracking.fetch('numUsers', 0)}"
puts "Storage Used: #{tracking.fetch('storageUsed', 0)} bytes"
```

### `update_organization_info(organization_id, request)`

Update an organization's name.

```ruby
result = TurboDocxSdk::TurboPartner.update_organization_info("org-uuid-here",
  "name" => "Acme Corp (Updated)"
)
```

### `update_organization_entitlements(organization_id, request)`

Update an organization's feature limits and capabilities.

```ruby
result = TurboDocxSdk::TurboPartner.update_organization_entitlements("org-uuid-here",
  "features" => {
    "maxUsers"        => 100,
    "maxStorage"      => 10 * 1024 * 1024 * 1024, # 10GB
    "maxSignatures"   => 500,
    "hasTDAI"         => true,
    "hasFileDownload" => true,
    "hasBetaFeatures" => false
  },
  "tracking" => {                     # Optional: set usage counters
    "numUsers"         => 5,
    "storageUsed"      => 1_048_576,
    "currentAICredits" => -1          # -1 = unlimited
  }
)

puts "Entitlements updated!"
```

:::info Features vs Tracking
**Features** are the limits and capabilities you grant (`maxUsers`, `hasTDAI`, …).
**Tracking** is the current consumption against those limits (`numUsers`, `storageUsed`, …). It is normally maintained by TurboDocx, but this endpoint **does accept a `tracking` hash**, so you can seed or reconcile counters during a migration.
See [Entitlements Reference](#entitlements-reference) for all available fields.
:::

### `delete_organization(organization_id)`

Delete an organization (soft delete).

```ruby
result = TurboDocxSdk::TurboPartner.delete_organization("org-uuid-here")
puts "Success: #{result['success']}"
```

:::danger Use With Caution
Deleting an organization is a destructive operation. All organization data, users, and API keys will be affected.
:::

---

## Organization User Management

### `add_user_to_organization(organization_id, request)`

Add a user to an organization with a specific role.

```ruby
result = TurboDocxSdk::TurboPartner.add_user_to_organization("org-uuid-here",
  "email" => "user@example.com",
  "role"  => "admin"   # admin, contributor, user, or viewer
)

puts "User ID: #{result['data']['id']}"
puts "Invitation sent to: #{result['data']['email']}"
```

### `list_organization_users(organization_id, request = nil)`

List all users in an organization.

```ruby
result = TurboDocxSdk::TurboPartner.list_organization_users("org-uuid-here",
  "limit"  => 50,
  "offset" => 0,
  "search" => "admin"   # Optional search by email or name
)

puts "Total Users: #{result['data']['totalRecords']}"
result["data"]["results"].each do |user|
  puts "- #{user['email']} (#{user['role']})"
end
```

### `update_organization_user_role(organization_id, user_id, request)`

Change a user's role within an organization.

```ruby
result = TurboDocxSdk::TurboPartner.update_organization_user_role(
  "org-uuid-here",
  "user-uuid-here",
  "role" => "contributor"
)
```

### `resend_organization_invitation_to_user(organization_id, user_id)`

Resend the invitation email to a pending user.

```ruby
result = TurboDocxSdk::TurboPartner.resend_organization_invitation_to_user(
  "org-uuid-here",
  "user-uuid-here"
)
```

### `remove_user_from_organization(organization_id, user_id)`

Remove a user from an organization.

```ruby
result = TurboDocxSdk::TurboPartner.remove_user_from_organization(
  "org-uuid-here",
  "user-uuid-here"
)
```

---

## Organization API Key Management

### `create_organization_api_key(organization_id, request)`

Create an API key for an organization.

```ruby
result = TurboDocxSdk::TurboPartner.create_organization_api_key("org-uuid-here",
  "name" => "Production API Key",
  "role" => "admin"   # ORG role enum: admin, contributor, user, or viewer
)

puts "Key ID: #{result['data']['id']}"
puts "Full Key: #{result['data']['key']}"   # Only shown once!
```

:::caution Save Your API Key
The full API key is only returned once during creation. Store it securely — you won't be able to retrieve it again.
:::

### `list_organization_api_keys(organization_id, request = nil)`

List all API keys for an organization.

```ruby
result = TurboDocxSdk::TurboPartner.list_organization_api_keys("org-uuid-here",
  "limit"  => 50,
  "offset" => 0,      # Optional pagination offset
  "search" => "prod"  # Optional search by name
)

result["data"]["results"].each do |key|
  puts "- #{key['name']} (Role: #{key['role']})"
end
```

### `update_organization_api_key(organization_id, api_key_id, request)`

Update an organization API key's name or role.

```ruby
result = TurboDocxSdk::TurboPartner.update_organization_api_key(
  "org-uuid-here",
  "api-key-uuid-here",
  "name" => "Updated Key Name",
  "role" => "contributor"
)
```

### `revoke_organization_api_key(organization_id, api_key_id)`

Revoke (delete) an organization API key.

```ruby
result = TurboDocxSdk::TurboPartner.revoke_organization_api_key(
  "org-uuid-here",
  "api-key-uuid-here"
)
```

---

## Partner API Key Management

### `create_partner_api_key(request)`

Create a new partner-level API key with specific scopes.

```ruby
result = TurboDocxSdk::TurboPartner.create_partner_api_key(
  "name"   => "Integration API Key",
  "scopes" => [
    TurboDocxSdk::PartnerScope::ORG_CREATE,
    TurboDocxSdk::PartnerScope::ORG_READ,
    TurboDocxSdk::PartnerScope::ORG_UPDATE,
    TurboDocxSdk::PartnerScope::ENTITLEMENTS_UPDATE,
    TurboDocxSdk::PartnerScope::AUDIT_READ
  ],
  "description" => "For third-party integration"
)

puts "Key ID: #{result['data']['id']}"
puts "Full Key: #{result['data']['key']}"   # Only shown once!
```

### `list_partner_api_keys(request = nil)`

List all partner API keys.

```ruby
result = TurboDocxSdk::TurboPartner.list_partner_api_keys(
  "limit"  => 50,
  "offset" => 0
)

result["data"]["results"].each do |key|
  puts "- #{key['name']}"
  puts "  Scopes: #{key['scopes']}"
end
```

### `update_partner_api_key(key_id, request)`

Update a partner API key.

```ruby
result = TurboDocxSdk::TurboPartner.update_partner_api_key("partner-key-uuid-here",
  "name"        => "Updated Integration Key",
  "description" => "Updated description",
  "scopes"      => [
    TurboDocxSdk::PartnerScope::ORG_READ,
    TurboDocxSdk::PartnerScope::AUDIT_READ
  ]
)
```

### `revoke_partner_api_key(key_id)`

Revoke a partner API key.

```ruby
result = TurboDocxSdk::TurboPartner.revoke_partner_api_key("partner-key-uuid-here")
```

---

## Partner User Management

:::danger Partner users use a different role enum
Partner portal users take `"admin"`, `"member"`, or `"viewer"`. **Organization** users and organization API keys take `"admin"`, `"contributor"`, `"user"`, or `"viewer"`. The two enums do not overlap beyond `admin`/`viewer` — `"member"` is rejected on an org call, and `"contributor"`/`"user"` are rejected on a partner call. See [Role Enums](#organization-user-roles).
:::

:::caution `permissions` is all-or-nothing
The `"permissions"` hash itself is optional on both `add_user_to_partner_portal` and `update_partner_user_permissions`, and the Ruby SDK forwards your hash verbatim without client-side validation. But if you send `"permissions"`, **all seven keys are required** — there is no partial permissions update. Omitting even one key raises `TurboDocxSdk::ValidationError` (400). Always send the complete hash: read the current values first and re-send them with your change applied.
:::

### `add_user_to_partner_portal(request)`

Add a user to the partner portal with specific permissions.

```ruby
result = TurboDocxSdk::TurboPartner.add_user_to_partner_portal(
  "email" => "admin@partner.com",
  "role"  => "admin",   # PARTNER role enum: admin, member, or viewer
  # If you send "permissions" at all, all 7 keys must be present.
  "permissions" => {
    "canManageOrgs"           => true,
    "canManageOrgUsers"       => true,
    "canManagePartnerUsers"   => false,
    "canManageOrgAPIKeys"     => true,
    "canManagePartnerAPIKeys" => false,
    "canUpdateEntitlements"   => true,
    "canViewAuditLogs"        => true
  }
)

puts "Partner User ID: #{result['data']['id']}"
```

### `list_partner_portal_users(request = nil)`

List all partner portal users.

```ruby
result = TurboDocxSdk::TurboPartner.list_partner_portal_users(
  "limit"  => 50,
  "offset" => 0,       # Optional pagination offset
  "search" => "admin"  # Optional search by email or name
)

result["data"]["results"].each do |user|
  puts "- #{user['email']} (Role: #{user['role']})"
end
```

### `update_partner_user_permissions(user_id, request)`

Update a partner user's role and permissions. If you pass `"permissions"`, send **all seven keys** — a partial hash is a 400.

```ruby
result = TurboDocxSdk::TurboPartner.update_partner_user_permissions("partner-user-uuid-here",
  "role" => "admin",
  # Not a patch: every key below must be present.
  "permissions" => {
    "canManageOrgs"           => true,
    "canManageOrgUsers"       => true,
    "canManagePartnerUsers"   => true,
    "canManageOrgAPIKeys"     => true,
    "canManagePartnerAPIKeys" => true,
    "canUpdateEntitlements"   => true,
    "canViewAuditLogs"        => true
  }
)
```

### `resend_partner_portal_invitation_to_user(user_id)`

Resend the invitation email to a pending partner user.

```ruby
result = TurboDocxSdk::TurboPartner.resend_partner_portal_invitation_to_user(
  "partner-user-uuid-here"
)
```

### `remove_user_from_partner_portal(user_id)`

Remove a user from the partner portal.

```ruby
result = TurboDocxSdk::TurboPartner.remove_user_from_partner_portal(
  "partner-user-uuid-here"
)
```

---

## Audit Logs

### `get_partner_audit_logs(request = nil)`

Get audit logs for all partner activities with filtering.

```ruby
result = TurboDocxSdk::TurboPartner.get_partner_audit_logs(
  "limit"        => 50,
  "offset"       => 0,
  "action"       => "ORG_CREATED",   # Optional filter by action
  "resourceType" => "organization",  # Optional filter by resource type
  "success"      => true,            # Optional filter by success/failure
  "startDate"    => "2024-01-01",    # Optional date range start
  "endDate"      => "2024-12-31"     # Optional date range end
)

result["data"]["results"].each do |entry|
  status   = entry["success"] ? "Success" : "Failed"
  resource = entry["resourceType"] ? " (#{entry['resourceType']})" : ""
  puts "#{entry['createdOn']} - #{entry['action']}#{resource} - #{status}"
end
```

:::note Filter keys stay camelCase
Even though the method name is snake_case, the query keys go on the wire exactly as the API expects them: `resourceType`, `startDate`, `endDate`. Booleans are serialized as `"true"`/`"false"`, and array values are emitted as repeated query keys.
:::

---

## Entitlements Reference

### Features (Settable Limits)

These are limits and capabilities you can configure for each organization:

| Field | Type | Description |
|-------|------|-------------|
| `maxUsers` | Integer | Maximum users allowed (-1 = unlimited) |
| `maxProjectspaces` | Integer | Maximum projectspaces |
| `maxTemplates` | Integer | Maximum templates |
| `maxStorage` | Integer | Maximum storage in bytes |
| `maxGeneratedDeliverables` | Integer | Maximum generated documents |
| `maxSignatures` | Integer | Maximum e-signatures |
| `maxAICredits` | Integer | Maximum AI credits |
| `rdWatermark` | Boolean | Enable RapidDocx watermark |
| `hasFileDownload` | Boolean | Enable file download |
| `hasAdvancedDateFormats` | Boolean | Enable advanced date formats |
| `hasGDrive` | Boolean | Enable Google Drive integration |
| `hasSharepoint` | Boolean | Enable SharePoint integration |
| `hasSharepointOnly` | Boolean | SharePoint-only mode |
| `hasTDAI` | Boolean | Enable TurboDocx AI features |
| `hasPptx` | Boolean | Enable PowerPoint support |
| `hasTDWriter` | Boolean | Enable TurboDocx Writer |
| `hasSalesforce` | Boolean | Enable Salesforce integration |
| `hasWrike` | Boolean | Enable Wrike integration |
| `hasVariableStack` | Boolean | Enable variable stack |
| `hasSubvariables` | Boolean | Enable subvariables |
| `hasZapier` | Boolean | Enable Zapier integration |
| `hasBYOM` | Boolean | Enable Bring Your Own Model |
| `hasBYOVS` | Boolean | Enable Bring Your Own Vector Store |
| `hasBetaFeatures` | Boolean | Enable beta features |
| `enableBulkSending` | Boolean | Enable bulk document sending |

:::tip Hash-Based Configuration
Pass features as a plain Hash with camelCase string keys. The SDK sends them straight through:
```ruby
"features" => { "maxUsers" => 25, "hasTDAI" => true }
```
:::

### Tracking (Usage Counters)

Current consumption against the limits above. TurboDocx maintains these automatically, but `update_organization_entitlements` **accepts a `tracking` hash** — useful for seeding counters when migrating an existing customer:

| Field | Type | Description |
|-------|------|-------------|
| `numUsers` | Integer | Current number of users |
| `numProjectspaces` | Integer | Current number of projectspaces |
| `numTemplates` | Integer | Current number of templates |
| `storageUsed` | Integer | Current storage used in bytes |
| `numGeneratedDeliverables` | Integer | Total documents generated |
| `numSignaturesUsed` | Integer | Total signatures used |
| `numQuotesSent` | Integer | Total quotes sent |
| `currentAICredits` | Integer | Remaining AI credits (-1 = unlimited) |

Every counter except `currentAICredits` floors at `0`. Only `currentAICredits` accepts `-1`, meaning unlimited.

---

## Constants and Roles

### `PartnerScope` (22 Scopes)

```ruby
# Organization CRUD
TurboDocxSdk::PartnerScope::ORG_CREATE              # "org:create"
TurboDocxSdk::PartnerScope::ORG_READ                # "org:read"
TurboDocxSdk::PartnerScope::ORG_UPDATE              # "org:update"
TurboDocxSdk::PartnerScope::ORG_DELETE              # "org:delete"

# Entitlements
TurboDocxSdk::PartnerScope::ENTITLEMENTS_UPDATE     # "entitlements:update"

# Organization Users
TurboDocxSdk::PartnerScope::ORG_USERS_CREATE        # "org-users:create"
TurboDocxSdk::PartnerScope::ORG_USERS_READ          # "org-users:read"
TurboDocxSdk::PartnerScope::ORG_USERS_UPDATE        # "org-users:update"
TurboDocxSdk::PartnerScope::ORG_USERS_DELETE        # "org-users:delete"

# Partner Users
TurboDocxSdk::PartnerScope::PARTNER_USERS_CREATE    # "partner-users:create"
TurboDocxSdk::PartnerScope::PARTNER_USERS_READ      # "partner-users:read"
TurboDocxSdk::PartnerScope::PARTNER_USERS_UPDATE    # "partner-users:update"
TurboDocxSdk::PartnerScope::PARTNER_USERS_DELETE    # "partner-users:delete"

# Organization API Keys
TurboDocxSdk::PartnerScope::ORG_APIKEYS_CREATE      # "org-apikeys:create"
TurboDocxSdk::PartnerScope::ORG_APIKEYS_READ        # "org-apikeys:read"
TurboDocxSdk::PartnerScope::ORG_APIKEYS_UPDATE      # "org-apikeys:update"
TurboDocxSdk::PartnerScope::ORG_APIKEYS_DELETE      # "org-apikeys:delete"

# Partner API Keys
TurboDocxSdk::PartnerScope::PARTNER_APIKEYS_CREATE  # "partner-apikeys:create"
TurboDocxSdk::PartnerScope::PARTNER_APIKEYS_READ    # "partner-apikeys:read"
TurboDocxSdk::PartnerScope::PARTNER_APIKEYS_UPDATE  # "partner-apikeys:update"
TurboDocxSdk::PartnerScope::PARTNER_APIKEYS_DELETE  # "partner-apikeys:delete"

# Audit
TurboDocxSdk::PartnerScope::AUDIT_READ              # "audit:read"

# All 22 scopes as a frozen array
TurboDocxSdk::PartnerScope::ALL
```

:::note `PartnerScope::ALL` is frozen
It's the canonical list of all 22 scopes — `dup` it before mutating.
:::

### Organization User Roles

Used by `add_user_to_organization`, `update_organization_user_role`, `create_organization_api_key`, and `update_organization_api_key`.

| Role | Description |
|------|-------------|
| `"admin"` | Full organization access |
| `"contributor"` | Can create and edit content |
| `"user"` | Standard user access |
| `"viewer"` | Read-only access |

### Partner User Roles

Used by `add_user_to_partner_portal` and `update_partner_user_permissions` only.

| Role | Description |
|------|-------------|
| `"admin"` | Full partner portal access |
| `"member"` | Standard partner access (respects permissions) |
| `"viewer"` | Read-only access to partner portal |

:::danger Do not mix the two enums
`"member"` exists **only** in the partner role enum; sending it to an organization endpoint is a 400. `"contributor"` and `"user"` exist **only** in the organization role enum; sending either to a partner endpoint is a 400.
:::

### Partner Permissions

All seven keys are required whenever a `"permissions"` hash is sent. Partial hashes are rejected with a 400.

```ruby
permissions = {
  "canManageOrgs"           => true,  # Create, update, delete organizations
  "canManageOrgUsers"       => true,  # Manage users within organizations
  "canManagePartnerUsers"   => false, # Manage other partner portal users
  "canManageOrgAPIKeys"     => true,  # Manage organization API keys
  "canManagePartnerAPIKeys" => false, # Manage partner API keys
  "canUpdateEntitlements"   => true,  # Update organization entitlements
  "canViewAuditLogs"        => true   # View audit logs
}
```

---

## Error Handling

```ruby
begin
  result = TurboDocxSdk::TurboPartner.create_organization("name" => "Acme Corp")
rescue TurboDocxSdk::AuthenticationError => e
  # 401 — invalid partner API key or partner ID
  puts "Authentication failed: #{e.message} (HTTP #{e.status_code})"
rescue TurboDocxSdk::AuthorizationError => e
  # 403 — authenticated, but the key lacks the required partner scope
  puts "Not authorized: #{e.message} (HTTP #{e.status_code})"
rescue TurboDocxSdk::ValidationError => e
  # 400 — invalid request data, or TurboPartner was never configured
  puts "Validation error: #{e.message}"
rescue TurboDocxSdk::NotFoundError => e
  # 404 — organization, user, or API key does not exist
  puts "Not found: #{e.message}"
rescue TurboDocxSdk::ConflictError => e
  # 409 — conflicts with the current resource state
  puts "Conflict: #{e.message}"
rescue TurboDocxSdk::RateLimitError => e
  # 429 — back off and retry
  puts "Rate limited: #{e.message}"
rescue TurboDocxSdk::NetworkError => e
  # request never reached the server (DNS, refused, timeout)
  puts "Network error: #{e.message}"
rescue TurboDocxSdk::TurboDocxError => e
  # base class for any other typed SDK error
  puts "API error #{e.status_code} (#{e.code}): #{e.message}"
end
```

All errors inherit from `TurboDocxSdk::TurboDocxError` and carry `status_code` and `code` readers.

### Error Classes

| Error Class | Status | When |
|---|---|---|
| `TurboDocxSdk::TurboDocxError` | varies | Base class for all SDK errors |
| `TurboDocxSdk::AuthenticationError` | 401 | Invalid or missing partner credentials |
| `TurboDocxSdk::AuthorizationError` | 403 | Valid credentials without permission for this operation |
| `TurboDocxSdk::ValidationError` | 400 | Invalid request parameters, or TurboPartner not configured |
| `TurboDocxSdk::NotFoundError` | 404 | Resource not found |
| `TurboDocxSdk::ConflictError` | 409 | Request conflicts with current resource state |
| `TurboDocxSdk::RateLimitError` | 429 | Too many requests — back off |
| `TurboDocxSdk::NetworkError` | — | Network connectivity issues |

---

## Complete Example

A typical partner onboarding workflow, end to end:

```ruby
require "turbodocx_sdk"

# Configure
TurboDocxSdk::TurboPartner.configure(
  partner_api_key: ENV.fetch("TURBODOCX_PARTNER_API_KEY"),
  partner_id:      ENV.fetch("TURBODOCX_PARTNER_ID")
)

begin
  # 1. Create an organization for a new customer
  org = TurboDocxSdk::TurboPartner.create_organization("name" => "New Customer Inc")
  org_id = org["data"]["id"]
  puts "Created organization: #{org_id}"

  # 2. Set up their entitlements based on their plan
  TurboDocxSdk::TurboPartner.update_organization_entitlements(org_id,
    "features" => {
      "maxUsers"        => 25,
      "maxStorage"      => 5 * 1024 * 1024 * 1024, # 5GB
      "hasTDAI"         => true,
      "hasFileDownload" => true
    }
  )
  puts "Configured entitlements"

  # 3. Add their admin user
  user = TurboDocxSdk::TurboPartner.add_user_to_organization(org_id,
    "email" => "admin@newcustomer.com",
    "role"  => "admin"
  )
  puts "Added admin user: #{user['data']['email']}"

  # 4. Create an API key for their integration
  api_key = TurboDocxSdk::TurboPartner.create_organization_api_key(org_id,
    "name" => "Production API Key",
    "role" => "admin"
  )
  puts "Created API key: #{api_key['data']['key']}"

  puts "\nCustomer setup complete!"
rescue TurboDocxSdk::TurboDocxError => e
  warn "Partner provisioning failed (#{e.status_code}): #{e.message}"
  exit 1
end
```

## Runnable End-to-End Example

A complete, validated provisioning walkthrough lives in the SDK repo:

**[`packages/ruby-sdk/examples/turbopartner_basic.rb`](https://github.com/TurboDocx/SDK/blob/main/packages/ruby-sdk/examples/turbopartner_basic.rb)**

It creates an organization with entitlements, adds a user, mints an org API key, then lists organizations, organization details, and organization users.

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk)
- [RubyGems Package](https://rubygems.org/gems/turbodocx-sdk)
- [TurboSign Ruby SDK](/docs/SDKs/ruby) — For digital signature operations
- [TurboQuote Ruby SDK](/docs/SDKs/quote-ruby) — For quotes and proposals
- [SDKs Overview](/docs/SDKs/) — All TurboDocx SDKs
