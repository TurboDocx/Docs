---
title: TurboPartner Go SDK
sidebar_position: 12
sidebar_label: "TurboPartner: Go"
description: Official TurboDocx Partner SDK for Go. Manage organizations, users, API keys, and entitlements programmatically with Go 1.21+.
keywords:
  - turbodocx partner
  - turbopartner go
  - partner api go
  - multi-tenant go
  - organization management
  - go sdk partner
  - white label go
  - saas go sdk
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboPartner Go SDK

:::tip Interested in TurboPartner?
TurboPartner is available for integrators and partners. [Contact us](https://www.turbodocx.com/demo) to get started.
:::

The official TurboDocx Partner SDK for Go applications. Build multi-tenant SaaS applications with programmatic organization management, user provisioning, API key management, and entitlement control. Zero dependencies — standard library only.

<br />

:::info What is TurboPartner?
TurboPartner is the partner management API for TurboDocx. It allows you to programmatically create and manage organizations, users, API keys, and feature entitlements — perfect for building white-label or multi-tenant applications on top of TurboDocx.
:::

## TLDR

```go
package main

import (
    "context"
    "fmt"
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    // 1. Configure
    partner, _ := turbodocx.NewPartnerClient(turbodocx.PartnerConfig{
        PartnerAPIKey: os.Getenv("TURBODOCX_PARTNER_API_KEY"),
        PartnerID:     os.Getenv("TURBODOCX_PARTNER_ID"),
    })

    ctx := context.Background()

    // 2. Create an organization with entitlements
    org, _ := partner.CreateOrganization(ctx, &turbodocx.CreateOrganizationRequest{
        Name: "Acme Corporation",
        Features: &turbodocx.Features{
            MaxUsers:   turbodocx.IntPtr(25),                        // Max users allowed
            MaxStorage: turbodocx.Int64Ptr(5 * 1024 * 1024 * 1024), // 5GB in bytes
            HasTDAI:    turbodocx.BoolPtr(true),                     // Enable TurboDocx AI
        },
    })
    orgID := org.Data.ID

    // 3. Add a user
    user, _ := partner.AddUserToOrganization(ctx, orgID, &turbodocx.AddOrgUserRequest{
        Email: "admin@acme.com",
        Role:  "admin",
    })
    fmt.Printf("User: %s\n", user.Data.Email)

    // 4. Create an API key
    key, _ := partner.CreateOrganizationApiKey(ctx, orgID, &turbodocx.CreateOrgApiKeyRequest{
        Name: "Production Key",
        Role: "admin",
    })
    fmt.Printf("API Key: %s\n", key.Data.Key) // Save this — only shown once!
}
```

---

## Installation

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

## Requirements

- Go 1.21 or higher
- No external dependencies (standard library only)

:::tip Zero Dependencies
The Go SDK uses only the standard library — no third-party packages required. This makes it easy to integrate into any Go project.
:::

---

## Configuration

<Tabs>
<TabItem value="manual" label="Manual Configuration" default>

```go
import turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"

// Configure with your partner credentials
partner, err := turbodocx.NewPartnerClient(turbodocx.PartnerConfig{
    PartnerAPIKey: os.Getenv("TURBODOCX_PARTNER_API_KEY"), // Required: Must start with TDXP-
    PartnerID:     os.Getenv("TURBODOCX_PARTNER_ID"),      // Required: Your partner UUID
})
if err != nil {
    log.Fatal(err)
}
```

</TabItem>
<TabItem value="env" label="From Environment">

```go
import turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"

// Auto-configure from environment variables
// Leave fields empty to read from TURBODOCX_PARTNER_API_KEY and TURBODOCX_PARTNER_ID
partner, err := turbodocx.NewPartnerClient(turbodocx.PartnerConfig{})
if err != nil {
    log.Fatal(err)
}
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

```go
import turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"

partner, err := turbodocx.NewPartnerClient(turbodocx.PartnerConfig{})
if err != nil {
    log.Fatal(err)
}

ctx := context.Background()

// Create a new organization
result, err := partner.CreateOrganization(ctx, &turbodocx.CreateOrganizationRequest{
    Name: "Acme Corporation",
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Organization created!\n")
fmt.Printf("  ID: %s\n", result.Data.ID)
fmt.Printf("  Name: %s\n", result.Data.Name)
```

:::caution Always Handle Errors
The above examples omit error handling for brevity. In production, always check the `err` return value. See [Error Handling](#error-handling) for complete patterns.
:::

---

## Organization Management

### `CreateOrganization()`

Create a new organization under your partner account.

```go
result, err := partner.CreateOrganization(ctx, &turbodocx.CreateOrganizationRequest{
    Name: "Acme Corporation",
    Features: &turbodocx.Features{
        MaxUsers: turbodocx.IntPtr(50), // Optional entitlements override
    },
})

fmt.Printf("Organization ID: %s\n", result.Data.ID)
```

### `ListOrganizations()`

List all organizations with pagination and search.

```go
result, err := partner.ListOrganizations(ctx, &turbodocx.ListOrganizationsRequest{
    Limit:  turbodocx.IntPtr(25),
    Offset: turbodocx.IntPtr(0),
    Search: "Acme", // Optional search by name
})

fmt.Printf("Total: %d\n", result.Data.TotalRecords)
for _, org := range result.Data.Results {
    fmt.Printf("- %s (ID: %s)\n", org.Name, org.ID)
}
```

### `GetOrganizationDetails()`

Get full details including features and tracking for an organization.

```go
result, err := partner.GetOrganizationDetails(ctx, "org-uuid-here")

fmt.Printf("Name: %s\n", result.Data.Name)
fmt.Printf("Active: %t\n", result.Data.IsActive)

if result.Data.Features != nil {
    if result.Data.Features.MaxUsers != nil {
        fmt.Printf("Max Users: %d\n", *result.Data.Features.MaxUsers)
    }
    if result.Data.Features.MaxStorage != nil {
        fmt.Printf("Max Storage: %d bytes\n", *result.Data.Features.MaxStorage)
    }
}

if result.Data.Tracking != nil {
    fmt.Printf("Current Users: %d\n", result.Data.Tracking.NumUsers)
    fmt.Printf("Storage Used: %d bytes\n", result.Data.Tracking.StorageUsed)
}
```

### `UpdateOrganizationInfo()`

Update an organization's name.

```go
result, err := partner.UpdateOrganizationInfo(ctx, "org-uuid-here",
    &turbodocx.UpdateOrganizationRequest{
        Name: "Acme Corp (Updated)",
    },
)
```

### `UpdateOrganizationEntitlements()`

Update an organization's feature limits and capabilities.

```go
result, err := partner.UpdateOrganizationEntitlements(ctx, "org-uuid-here",
    &turbodocx.UpdateEntitlementsRequest{
        Features: &turbodocx.Features{
            MaxUsers:        turbodocx.IntPtr(100),
            MaxStorage:      turbodocx.Int64Ptr(10 * 1024 * 1024 * 1024), // 10GB
            MaxSignatures:   turbodocx.IntPtr(500),
            HasTDAI:         turbodocx.BoolPtr(true),
            HasFileDownload: turbodocx.BoolPtr(true),
            HasBetaFeatures: turbodocx.BoolPtr(false),
        },
    },
)

fmt.Println("Entitlements updated!")
```

:::info Features vs Tracking
**Features** are limits and capabilities you can set (MaxUsers, HasTDAI, etc.).
**Tracking** is read-only usage data (NumUsers, StorageUsed, etc.).
See [Entitlements Reference](#entitlements-reference) for all available fields.
:::

### `DeleteOrganization()`

Delete an organization (soft delete).

```go
result, err := partner.DeleteOrganization(ctx, "org-uuid-here")
fmt.Printf("Success: %t\n", result.Success)
```

:::danger Use With Caution
Deleting an organization is a destructive operation. All organization data, users, and API keys will be affected.
:::

---

## Organization User Management

### `AddUserToOrganization()`

Add a user to an organization with a specific role.

```go
result, err := partner.AddUserToOrganization(ctx, "org-uuid-here",
    &turbodocx.AddOrgUserRequest{
        Email: "user@example.com",
        Role:  "admin", // admin, contributor, user, or viewer
    },
)

fmt.Printf("User ID: %s\n", result.Data.ID)
fmt.Printf("Invitation sent to: %s\n", result.Data.Email)
```

### `ListOrganizationUsers()`

List all users in an organization.

```go
result, err := partner.ListOrganizationUsers(ctx, "org-uuid-here",
    &turbodocx.ListOrgUsersRequest{
        Limit:  turbodocx.IntPtr(50),
        Offset: turbodocx.IntPtr(0),
    },
)

fmt.Printf("Total Users: %d\n", result.Data.TotalRecords)
for _, user := range result.Data.Results {
    fmt.Printf("- %s (%s)\n", user.Email, user.Role)
}
```

### `UpdateOrganizationUserRole()`

Change a user's role within an organization.

```go
result, err := partner.UpdateOrganizationUserRole(ctx,
    "org-uuid-here",
    "user-uuid-here",
    &turbodocx.UpdateOrgUserRequest{Role: "contributor"},
)
```

### `ResendOrganizationInvitationToUser()`

Resend the invitation email to a pending user.

```go
result, err := partner.ResendOrganizationInvitationToUser(ctx,
    "org-uuid-here",
    "user-uuid-here",
)
```

### `RemoveUserFromOrganization()`

Remove a user from an organization.

```go
result, err := partner.RemoveUserFromOrganization(ctx,
    "org-uuid-here",
    "user-uuid-here",
)
```

---

## Organization API Key Management

### `CreateOrganizationApiKey()`

Create an API key for an organization.

```go
result, err := partner.CreateOrganizationApiKey(ctx, "org-uuid-here",
    &turbodocx.CreateOrgApiKeyRequest{
        Name: "Production API Key",
        Role: "admin", // admin, contributor, or viewer
    },
)

fmt.Printf("Key ID: %s\n", result.Data.ID)
fmt.Printf("Full Key: %s\n", result.Data.Key) // Only shown once!
```

:::caution Save Your API Key
The full API key is only returned once during creation. Store it securely — you won't be able to retrieve it again.
:::

### `ListOrganizationApiKeys()`

List all API keys for an organization.

```go
result, err := partner.ListOrganizationApiKeys(ctx, "org-uuid-here",
    &turbodocx.ListOrgApiKeysRequest{Limit: turbodocx.IntPtr(50)},
)

for _, key := range result.Data.Results {
    fmt.Printf("- %s (Role: %s)\n", key.Name, key.Role)
}
```

### `UpdateOrganizationApiKey()`

Update an organization API key's name or role.

```go
result, err := partner.UpdateOrganizationApiKey(ctx,
    "org-uuid-here",
    "api-key-uuid-here",
    &turbodocx.UpdateOrgApiKeyRequest{
        Name: "Updated Key Name",
        Role: "contributor",
    },
)
```

### `RevokeOrganizationApiKey()`

Revoke (delete) an organization API key.

```go
result, err := partner.RevokeOrganizationApiKey(ctx,
    "org-uuid-here",
    "api-key-uuid-here",
)
```

---

## Partner API Key Management

### `CreatePartnerApiKey()`

Create a new partner-level API key with specific scopes.

```go
result, err := partner.CreatePartnerApiKey(ctx,
    &turbodocx.CreatePartnerApiKeyRequest{
        Name: "Integration API Key",
        Scopes: []string{
            turbodocx.ScopeOrgCreate,
            turbodocx.ScopeOrgRead,
            turbodocx.ScopeOrgUpdate,
            turbodocx.ScopeEntitlementsUpdate,
            turbodocx.ScopeAuditRead,
        },
        Description: "For third-party integration",
    },
)

fmt.Printf("Key ID: %s\n", result.Data.ID)
fmt.Printf("Full Key: %s\n", result.Data.Key) // Only shown once!
```

### `ListPartnerApiKeys()`

List all partner API keys.

```go
result, err := partner.ListPartnerApiKeys(ctx,
    &turbodocx.ListPartnerApiKeysRequest{Limit: turbodocx.IntPtr(50)},
)

for _, key := range result.Data.Results {
    fmt.Printf("- %s\n", key.Name)
    fmt.Printf("  Scopes: %v\n", key.Scopes)
}
```

### `UpdatePartnerApiKey()`

Update a partner API key.

```go
result, err := partner.UpdatePartnerApiKey(ctx, "partner-key-uuid-here",
    &turbodocx.UpdatePartnerApiKeyRequest{
        Name:        "Updated Integration Key",
        Description: "Updated description",
    },
)
```

### `RevokePartnerApiKey()`

Revoke a partner API key.

```go
result, err := partner.RevokePartnerApiKey(ctx, "partner-key-uuid-here")
```

---

## Partner User Management

### `AddUserToPartnerPortal()`

Add a user to the partner portal with specific permissions.

```go
result, err := partner.AddUserToPartnerPortal(ctx,
    &turbodocx.AddPartnerUserRequest{
        Email: "admin@partner.com",
        Role:  "admin", // admin, member, or viewer
        Permissions: turbodocx.PartnerPermissions{
            CanManageOrgs:          true,
            CanManageOrgUsers:      true,
            CanManagePartnerUsers:  false,
            CanManageOrgAPIKeys:    true,
            CanManagePartnerAPIKeys: false,
            CanUpdateEntitlements:  true,
            CanViewAuditLogs:       true,
        },
    },
)

fmt.Printf("Partner User ID: %s\n", result.Data.ID)
```

### `ListPartnerPortalUsers()`

List all partner portal users.

```go
result, err := partner.ListPartnerPortalUsers(ctx,
    &turbodocx.ListPartnerUsersRequest{Limit: turbodocx.IntPtr(50)},
)

for _, user := range result.Data.Results {
    fmt.Printf("- %s (Role: %s)\n", user.Email, user.Role)
}
```

### `UpdatePartnerUserPermissions()`

Update a partner user's role and permissions.

```go
result, err := partner.UpdatePartnerUserPermissions(ctx, "partner-user-uuid-here",
    &turbodocx.UpdatePartnerUserRequest{
        Role: "admin",
        Permissions: &turbodocx.PartnerPermissions{
            CanManageOrgs:          true,
            CanManageOrgUsers:      true,
            CanManagePartnerUsers:  true,
            CanManageOrgAPIKeys:    true,
            CanManagePartnerAPIKeys: true,
            CanUpdateEntitlements:  true,
            CanViewAuditLogs:       true,
        },
    },
)
```

### `ResendPartnerPortalInvitationToUser()`

Resend the invitation email to a pending partner user.

```go
result, err := partner.ResendPartnerPortalInvitationToUser(ctx, "partner-user-uuid-here")
```

### `RemoveUserFromPartnerPortal()`

Remove a user from the partner portal.

```go
result, err := partner.RemoveUserFromPartnerPortal(ctx, "partner-user-uuid-here")
```

---

## Audit Logs

### `GetPartnerAuditLogs()`

Get audit logs for all partner activities with filtering.

```go
result, err := partner.GetPartnerAuditLogs(ctx,
    &turbodocx.ListAuditLogsRequest{
        Limit:        turbodocx.IntPtr(50),
        Offset:       turbodocx.IntPtr(0),
        Action:       "org.create",          // Optional filter by action
        ResourceType: "organization",       // Optional filter by resource type
        Success:      turbodocx.BoolPtr(true), // Optional filter by success/failure
        StartDate:    "2024-01-01",         // Optional date range start
        EndDate:      "2024-12-31",         // Optional date range end
    },
)

for _, entry := range result.Data.Results {
    fmt.Printf("%s - %s", entry.CreatedOn, entry.Action)
    if entry.ResourceType != "" {
        fmt.Printf(" (%s)", entry.ResourceType)
    }
    if entry.Success {
        fmt.Println(" - Success")
    } else {
        fmt.Println(" - Failed")
    }
}
```

---

## Entitlements Reference

### Features (Settable Limits)

These are limits and capabilities you can configure for each organization:

| Field | Type | Description |
|-------|------|-------------|
| `MaxUsers` | `*int` | Maximum users allowed (-1 = unlimited) |
| `MaxProjectspaces` | `*int` | Maximum projectspaces |
| `MaxTemplates` | `*int` | Maximum templates |
| `MaxStorage` | `*int64` | Maximum storage in bytes |
| `MaxGeneratedDeliverables` | `*int` | Maximum generated documents |
| `MaxSignatures` | `*int` | Maximum e-signatures |
| `MaxAICredits` | `*int` | Maximum AI credits |
| `RdWatermark` | `*bool` | Enable RapidDocx watermark |
| `HasFileDownload` | `*bool` | Enable file download |
| `HasAdvancedDateFormats` | `*bool` | Enable advanced date formats |
| `HasGDrive` | `*bool` | Enable Google Drive integration |
| `HasSharepoint` | `*bool` | Enable SharePoint integration |
| `HasSharepointOnly` | `*bool` | SharePoint-only mode |
| `HasTDAI` | `*bool` | Enable TurboDocx AI features |
| `HasPptx` | `*bool` | Enable PowerPoint support |
| `HasTDWriter` | `*bool` | Enable TurboDocx Writer |
| `HasSalesforce` | `*bool` | Enable Salesforce integration |
| `HasWrike` | `*bool` | Enable Wrike integration |
| `HasVariableStack` | `*bool` | Enable variable stack |
| `HasSubvariables` | `*bool` | Enable subvariables |
| `HasZapier` | `*bool` | Enable Zapier integration |
| `HasBYOM` | `*bool` | Enable Bring Your Own Model |
| `HasBYOVS` | `*bool` | Enable Bring Your Own Vector Store |
| `HasBetaFeatures` | `*bool` | Enable beta features |
| `EnableBulkSending` | `*bool` | Enable bulk document sending |

:::tip Pointer Helpers
Use the provided helper functions for setting optional fields:
- `turbodocx.IntPtr(25)` — for `*int` fields
- `turbodocx.Int64Ptr(5368709120)` — for `*int64` fields (storage)
- `turbodocx.BoolPtr(true)` — for `*bool` fields
:::

### Tracking (Read-Only Usage)

These are usage counters that are read-only:

| Field | Type | Description |
|-------|------|-------------|
| `NumUsers` | `int` | Current number of users |
| `NumProjectspaces` | `int` | Current number of projectspaces |
| `NumTemplates` | `int` | Current number of templates |
| `StorageUsed` | `int64` | Current storage used in bytes |
| `NumGeneratedDeliverables` | `int` | Total documents generated |
| `NumSignaturesUsed` | `int` | Total signatures used |
| `CurrentAICredits` | `int` | Remaining AI credits |

---

## Scope Constants

### Partner Scopes (22 Scopes)

```go
// Organization CRUD
turbodocx.ScopeOrgCreate          // "org:create"
turbodocx.ScopeOrgRead            // "org:read"
turbodocx.ScopeOrgUpdate          // "org:update"
turbodocx.ScopeOrgDelete          // "org:delete"

// Entitlements
turbodocx.ScopeEntitlementsUpdate // "entitlements:update"

// Organization Users
turbodocx.ScopeOrgUsersCreate     // "org-users:create"
turbodocx.ScopeOrgUsersRead       // "org-users:read"
turbodocx.ScopeOrgUsersUpdate     // "org-users:update"
turbodocx.ScopeOrgUsersDelete     // "org-users:delete"

// Partner Users
turbodocx.ScopePartnerUsersCreate  // "partner-users:create"
turbodocx.ScopePartnerUsersRead    // "partner-users:read"
turbodocx.ScopePartnerUsersUpdate  // "partner-users:update"
turbodocx.ScopePartnerUsersDelete  // "partner-users:delete"

// Organization API Keys
turbodocx.ScopeOrgApikeysCreate    // "org-apikeys:create"
turbodocx.ScopeOrgApikeysRead      // "org-apikeys:read"
turbodocx.ScopeOrgApikeysUpdate    // "org-apikeys:update"
turbodocx.ScopeOrgApikeysDelete    // "org-apikeys:delete"

// Partner API Keys
turbodocx.ScopePartnerApikeysCreate  // "partner-apikeys:create"
turbodocx.ScopePartnerApikeysRead    // "partner-apikeys:read"
turbodocx.ScopePartnerApikeysUpdate  // "partner-apikeys:update"
turbodocx.ScopePartnerApikeysDelete  // "partner-apikeys:delete"

// Audit
turbodocx.ScopeAuditRead            // "audit:read"
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

### PartnerPermissions

```go
permissions := turbodocx.PartnerPermissions{
    CanManageOrgs:          true,  // Create, update, delete organizations
    CanManageOrgUsers:      true,  // Manage users within organizations
    CanManagePartnerUsers:  false, // Manage other partner portal users
    CanManageOrgAPIKeys:    true,  // Manage organization API keys
    CanManagePartnerAPIKeys: false, // Manage partner API keys
    CanUpdateEntitlements:  true,  // Update organization entitlements
    CanViewAuditLogs:       true,  // View audit logs
}
```

---

## Error Handling

The SDK provides typed errors for different error scenarios:

```go
import "errors"

result, err := partner.CreateOrganization(ctx, request)
if err != nil {
    var authErr *turbodocx.AuthenticationError
    var validErr *turbodocx.ValidationError
    var notFoundErr *turbodocx.NotFoundError
    var rateLimitErr *turbodocx.RateLimitError
    var networkErr *turbodocx.NetworkError

    switch {
    case errors.As(err, &authErr):
        // 401 - Invalid API key or partner ID
        fmt.Printf("Authentication failed: %s\n", authErr.Message)
    case errors.As(err, &validErr):
        // 400 - Invalid request data
        fmt.Printf("Validation error: %s\n", validErr.Message)
    case errors.As(err, &notFoundErr):
        // 404 - Organization or resource not found
        fmt.Printf("Not found: %s\n", notFoundErr.Message)
    case errors.As(err, &rateLimitErr):
        // 429 - Rate limit exceeded
        fmt.Printf("Rate limit: %s\n", rateLimitErr.Message)
    case errors.As(err, &networkErr):
        // Network/connection error
        fmt.Printf("Network error: %s\n", networkErr.Message)
    default:
        fmt.Printf("Error: %v\n", err)
    }
}
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

```go
package main

import (
    "context"
    "fmt"
    "log"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    // Configure
    partner, err := turbodocx.NewPartnerClient(turbodocx.PartnerConfig{})
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    // 1. Create an organization for a new customer
    org, err := partner.CreateOrganization(ctx, &turbodocx.CreateOrganizationRequest{
        Name: "New Customer Inc",
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Created organization: %s\n", org.Data.ID)

    // 2. Set up their entitlements based on their plan
    _, err = partner.UpdateOrganizationEntitlements(ctx, org.Data.ID,
        &turbodocx.UpdateEntitlementsRequest{
            Features: &turbodocx.Features{
                MaxUsers:        turbodocx.IntPtr(25),
                MaxStorage:      turbodocx.Int64Ptr(5 * 1024 * 1024 * 1024), // 5GB
                HasTDAI:         turbodocx.BoolPtr(true),
                HasFileDownload: turbodocx.BoolPtr(true),
            },
        },
    )
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Configured entitlements")

    // 3. Add their admin user
    user, err := partner.AddUserToOrganization(ctx, org.Data.ID,
        &turbodocx.AddOrgUserRequest{
            Email: "admin@newcustomer.com",
            Role:  "admin",
        },
    )
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Added admin user: %s\n", user.Data.Email)

    // 4. Create an API key for their integration
    apiKey, err := partner.CreateOrganizationApiKey(ctx, org.Data.ID,
        &turbodocx.CreateOrgApiKeyRequest{
            Name: "Production API Key",
            Role: "admin",
        },
    )
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Created API key: %s\n", apiKey.Data.Key)

    fmt.Println("\nCustomer setup complete!")
}
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [Go Package Reference](https://pkg.go.dev/github.com/TurboDocx/SDK/packages/go-sdk)
- [TurboSign Go SDK](/docs/SDKs/go) — For digital signature operations
- [API Reference](/docs/API/partner-api) — REST API documentation
