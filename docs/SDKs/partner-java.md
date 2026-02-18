---
title: TurboPartner Java SDK
sidebar_position: 13
sidebar_label: "TurboPartner: Java"
description: Official TurboDocx Partner SDK for Java. Manage organizations, users, API keys, and entitlements programmatically with Java 11+ and the Builder pattern.
keywords:
  - turbodocx partner
  - turbopartner java
  - partner api java
  - multi-tenant java
  - organization management
  - java sdk partner
  - white label java
  - saas java sdk
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboPartner Java SDK

:::tip Interested in TurboPartner?
TurboPartner is available for integrators and partners. [Contact us](https://www.turbodocx.com/demo) to get started.
:::

The official TurboDocx Partner SDK for Java applications. Build multi-tenant SaaS applications with programmatic organization management, user provisioning, API key management, and entitlement control. Uses the Builder pattern with type-safe APIs and comprehensive error handling.

<br />

:::info What is TurboPartner?
TurboPartner is the partner management API for TurboDocx. It allows you to programmatically create and manage organizations, users, API keys, and feature entitlements — perfect for building white-label or multi-tenant applications on top of TurboDocx.
:::

## TLDR

```java
import com.google.gson.JsonObject;
import com.turbodocx.TurboPartnerClient;
import com.turbodocx.PartnerScope;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) throws Exception {
        // 1. Configure
        TurboPartnerClient client = new TurboPartnerClient.Builder()
                .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY"))
                .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))
                .build();

        // 2. Create an organization with entitlements
        Map<String, Object> features = new HashMap<>();
        features.put("maxUsers", 25);              // Max users allowed
        features.put("maxStorage", 5368709120L);   // 5GB in bytes
        features.put("hasTDAI", true);             // Enable TurboDocx AI

        JsonObject org = client.turboPartner().createOrganization(
                "Acme Corporation", null, features);
        String orgId = org.getAsJsonObject("data").get("id").getAsString();

        // 3. Add a user
        JsonObject user = client.turboPartner().addUserToOrganization(
                orgId, "admin@acme.com", "admin");

        // 4. Create an API key
        JsonObject key = client.turboPartner().createOrganizationApiKey(
                orgId, "Production Key", "admin");
        String apiKey = key.getAsJsonObject("data").get("key").getAsString();
        System.out.println("API Key: " + apiKey); // Save this — only shown once!
    }
}
```

---

## Installation

<Tabs>
<TabItem value="maven" label="Maven" default>

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>turbodocx-sdk</artifactId>
    <version>0.1.6</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle (Kotlin)">

```kotlin
implementation("com.turbodocx:turbodocx-sdk:0.1.6")
```

</TabItem>
<TabItem value="gradle-groovy" label="Gradle (Groovy)">

```groovy
implementation 'com.turbodocx:turbodocx-sdk:0.1.6'
```

</TabItem>
</Tabs>

## Requirements

- Java 11+
- OkHttp 4.x (included)
- Gson 2.x (included)

:::tip Builder Pattern
The Java SDK uses the Builder pattern throughout for a fluent, type-safe developer experience. All configuration and request construction follows the same pattern.
:::

---

## Configuration

<Tabs>
<TabItem value="manual" label="Manual Configuration" default>

```java
import com.turbodocx.TurboPartnerClient;

// Configure with your partner credentials
TurboPartnerClient client = new TurboPartnerClient.Builder()
        .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY")) // Required: Must start with TDXP-
        .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))          // Required: Your partner UUID
        .build();
```

</TabItem>
<TabItem value="custom" label="Custom Base URL">

```java
import com.turbodocx.TurboPartnerClient;

// Configure with a custom base URL (e.g., staging)
TurboPartnerClient client = new TurboPartnerClient.Builder()
        .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY"))
        .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))
        .baseUrl("https://staging-api.turbodocx.com")  // Optional, defaults to https://api.turbodocx.com
        .build();
```

</TabItem>
</Tabs>

:::caution Partner API Key Required
Partner API keys start with `TDXP-` prefix. These are different from regular organization API keys and provide access to partner-level operations across all your organizations.
:::

### Environment Variables

```bash
export TURBODOCX_PARTNER_API_KEY=TDXP-your-partner-api-key
export TURBODOCX_PARTNER_ID=your-partner-uuid
```

---

## Quick Start

### Create Your First Organization

```java
import com.google.gson.JsonObject;
import com.turbodocx.TurboPartnerClient;

TurboPartnerClient client = new TurboPartnerClient.Builder()
        .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY"))
        .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))
        .build();

// Create a new organization
JsonObject result = client.turboPartner().createOrganization("Acme Corporation");

JsonObject data = result.getAsJsonObject("data");
System.out.println("Organization created!");
System.out.println("  ID: " + data.get("id").getAsString());
System.out.println("  Name: " + data.get("name").getAsString());
```

:::caution Always Handle Errors
The above examples omit error handling for brevity. In production, wrap all TurboPartner calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

---

## Organization Management

### `createOrganization()`

Create a new organization under your partner account.

```java
import java.util.HashMap;
import java.util.Map;

// Simple creation
JsonObject result = client.turboPartner().createOrganization("Acme Corporation");

// With entitlements
Map<String, Object> features = new HashMap<>();
features.put("maxUsers", 50);

JsonObject result = client.turboPartner().createOrganization(
        "Acme Corporation", null, features);

System.out.println("Organization ID: "
        + result.getAsJsonObject("data").get("id").getAsString());
```

### `listOrganizations()`

List all organizations with pagination and search.

```java
JsonObject result = client.turboPartner().listOrganizations(
        25,      // limit
        0,       // offset
        "Acme"   // search (optional, may be null)
);

JsonObject data = result.getAsJsonObject("data");
System.out.println("Total: " + data.get("totalRecords").getAsInt());

for (var org : data.getAsJsonArray("results")) {
    JsonObject o = org.getAsJsonObject();
    System.out.println("- " + o.get("name").getAsString()
            + " (ID: " + o.get("id").getAsString() + ")");
}
```

### `getOrganizationDetails()`

Get full details including features and tracking for an organization.

```java
JsonObject result = client.turboPartner().getOrganizationDetails("org-uuid-here");

JsonObject data = result.getAsJsonObject("data");
JsonObject org = data.getAsJsonObject("organization");
System.out.println("Name: " + org.get("name").getAsString());
System.out.println("Active: " + org.get("isActive").getAsBoolean());

if (data.has("features") && !data.get("features").isJsonNull()) {
    JsonObject features = data.getAsJsonObject("features");
    if (features.has("maxUsers")) {
        System.out.println("Max Users: " + features.get("maxUsers").getAsInt());
    }
    if (features.has("maxStorage")) {
        System.out.println("Max Storage: " + features.get("maxStorage").getAsLong() + " bytes");
    }
}

if (data.has("tracking") && !data.get("tracking").isJsonNull()) {
    JsonObject tracking = data.getAsJsonObject("tracking");
    System.out.println("Current Users: " + tracking.get("numUsers").getAsInt());
    System.out.println("Storage Used: " + tracking.get("storageUsed").getAsLong() + " bytes");
}
```

### `updateOrganizationInfo()`

Update an organization's name.

```java
JsonObject result = client.turboPartner().updateOrganizationInfo(
        "org-uuid-here", "Acme Corp (Updated)");
```

### `updateOrganizationEntitlements()`

Update an organization's feature limits and capabilities.

```java
Map<String, Object> features = new HashMap<>();
features.put("maxUsers", 100);
features.put("maxStorage", 10737418240L);  // 10GB in bytes
features.put("maxSignatures", 500);
features.put("hasTDAI", true);
features.put("hasFileDownload", true);
features.put("hasBetaFeatures", false);

JsonObject result = client.turboPartner().updateOrganizationEntitlements(
        "org-uuid-here", features, null);

System.out.println("Entitlements updated!");
```

:::info Features vs Tracking
**Features** are limits and capabilities you can set (maxUsers, hasTDAI, etc.).
**Tracking** is read-only usage data (numUsers, storageUsed, etc.).
See [Entitlements Reference](#entitlements-reference) for all available fields.
:::

### `deleteOrganization()`

Delete an organization (soft delete).

```java
JsonObject result = client.turboPartner().deleteOrganization("org-uuid-here");
System.out.println("Success: " + result.get("success").getAsBoolean());
```

:::danger Use With Caution
Deleting an organization is a destructive operation. All organization data, users, and API keys will be affected.
:::

---

## Organization User Management

### `addUserToOrganization()`

Add a user to an organization with a specific role.

```java
JsonObject result = client.turboPartner().addUserToOrganization(
        "org-uuid-here",
        "user@example.com",
        "admin"  // admin, contributor, user, or viewer
);

JsonObject data = result.getAsJsonObject("data");
System.out.println("User ID: " + data.get("id").getAsString());
System.out.println("Invitation sent to: " + data.get("email").getAsString());
```

### `listOrganizationUsers()`

List all users in an organization.

```java
JsonObject result = client.turboPartner().listOrganizationUsers(
        "org-uuid-here", 50, 0, null);

JsonObject data = result.getAsJsonObject("data");
System.out.println("Total Users: " + data.get("totalRecords").getAsInt());

for (var user : data.getAsJsonArray("results")) {
    JsonObject u = user.getAsJsonObject();
    System.out.println("- " + u.get("email").getAsString()
            + " (" + u.get("role").getAsString() + ")");
}
```

### `updateOrganizationUserRole()`

Change a user's role within an organization.

```java
JsonObject result = client.turboPartner().updateOrganizationUserRole(
        "org-uuid-here", "user-uuid-here", "contributor");
```

### `resendOrganizationInvitationToUser()`

Resend the invitation email to a pending user.

```java
JsonObject result = client.turboPartner().resendOrganizationInvitationToUser(
        "org-uuid-here", "user-uuid-here");
```

### `removeUserFromOrganization()`

Remove a user from an organization.

```java
JsonObject result = client.turboPartner().removeUserFromOrganization(
        "org-uuid-here", "user-uuid-here");
```

---

## Organization API Key Management

### `createOrganizationApiKey()`

Create an API key for an organization.

```java
JsonObject result = client.turboPartner().createOrganizationApiKey(
        "org-uuid-here",
        "Production API Key",
        "admin"  // admin, contributor, or viewer
);

JsonObject data = result.getAsJsonObject("data");
System.out.println("Key ID: " + data.get("id").getAsString());
System.out.println("Full Key: " + data.get("key").getAsString()); // Only shown once!
```

:::caution Save Your API Key
The full API key is only returned once during creation. Store it securely — you won't be able to retrieve it again.
:::

### `listOrganizationApiKeys()`

List all API keys for an organization.

```java
JsonObject result = client.turboPartner().listOrganizationApiKeys(
        "org-uuid-here", 50, null, null);

for (var key : result.getAsJsonObject("data").getAsJsonArray("results")) {
    JsonObject k = key.getAsJsonObject();
    System.out.println("- " + k.get("name").getAsString()
            + " (Role: " + k.get("role").getAsString() + ")");
}
```

### `updateOrganizationApiKey()`

Update an organization API key's name or role.

```java
JsonObject result = client.turboPartner().updateOrganizationApiKey(
        "org-uuid-here",
        "api-key-uuid-here",
        "Updated Key Name",
        "contributor"
);
```

### `revokeOrganizationApiKey()`

Revoke (delete) an organization API key.

```java
JsonObject result = client.turboPartner().revokeOrganizationApiKey(
        "org-uuid-here", "api-key-uuid-here");
```

---

## Partner API Key Management

### `createPartnerApiKey()`

Create a new partner-level API key with specific scopes.

```java
import com.turbodocx.PartnerScope;
import java.util.Arrays;

JsonObject result = client.turboPartner().createPartnerApiKey(
        "Integration API Key",
        Arrays.asList(
                PartnerScope.ORG_CREATE,
                PartnerScope.ORG_READ,
                PartnerScope.ORG_UPDATE,
                PartnerScope.ENTITLEMENTS_UPDATE,
                PartnerScope.AUDIT_READ
        ),
        "For third-party integration"
);

JsonObject data = result.getAsJsonObject("data");
System.out.println("Key ID: " + data.get("id").getAsString());
System.out.println("Full Key: " + data.get("key").getAsString()); // Only shown once!
```

### `listPartnerApiKeys()`

List all partner API keys.

```java
JsonObject result = client.turboPartner().listPartnerApiKeys(50, null, null);

for (var key : result.getAsJsonObject("data").getAsJsonArray("results")) {
    JsonObject k = key.getAsJsonObject();
    System.out.println("- " + k.get("name").getAsString());
    System.out.println("  Scopes: " + k.getAsJsonArray("scopes"));
}
```

### `updatePartnerApiKey()`

Update a partner API key.

```java
JsonObject result = client.turboPartner().updatePartnerApiKey(
        "partner-key-uuid-here",
        "Updated Integration Key",
        "Updated description",
        null  // scopes (null to keep current)
);
```

### `revokePartnerApiKey()`

Revoke a partner API key.

```java
JsonObject result = client.turboPartner().revokePartnerApiKey("partner-key-uuid-here");
```

---

## Partner User Management

### `addUserToPartnerPortal()`

Add a user to the partner portal with specific permissions.

```java
import java.util.LinkedHashMap;
import java.util.Map;

Map<String, Boolean> permissions = new LinkedHashMap<>();
permissions.put("canManageOrgs", true);
permissions.put("canManageOrgUsers", true);
permissions.put("canManagePartnerUsers", false);
permissions.put("canManageOrgAPIKeys", true);
permissions.put("canManagePartnerAPIKeys", false);
permissions.put("canUpdateEntitlements", true);
permissions.put("canViewAuditLogs", true);

JsonObject result = client.turboPartner().addUserToPartnerPortal(
        "admin@partner.com",
        "admin",  // admin, member, or viewer
        permissions
);

System.out.println("Partner User ID: "
        + result.getAsJsonObject("data").get("id").getAsString());
```

### `listPartnerPortalUsers()`

List all partner portal users.

```java
JsonObject result = client.turboPartner().listPartnerPortalUsers(50, null, null);

for (var user : result.getAsJsonObject("data").getAsJsonArray("results")) {
    JsonObject u = user.getAsJsonObject();
    System.out.println("- " + u.get("email").getAsString()
            + " (Role: " + u.get("role").getAsString() + ")");
}
```

### `updatePartnerUserPermissions()`

Update a partner user's role and permissions.

```java
Map<String, Boolean> permissions = new LinkedHashMap<>();
permissions.put("canManageOrgs", true);
permissions.put("canManageOrgUsers", true);
permissions.put("canManagePartnerUsers", true);
permissions.put("canManageOrgAPIKeys", true);
permissions.put("canManagePartnerAPIKeys", true);
permissions.put("canUpdateEntitlements", true);
permissions.put("canViewAuditLogs", true);

JsonObject result = client.turboPartner().updatePartnerUserPermissions(
        "partner-user-uuid-here", "admin", permissions);
```

### `resendPartnerPortalInvitationToUser()`

Resend the invitation email to a pending partner user.

```java
JsonObject result = client.turboPartner().resendPartnerPortalInvitationToUser(
        "partner-user-uuid-here");
```

### `removeUserFromPartnerPortal()`

Remove a user from the partner portal.

```java
JsonObject result = client.turboPartner().removeUserFromPartnerPortal(
        "partner-user-uuid-here");
```

---

## Audit Logs

### `getPartnerAuditLogs()`

Get audit logs for all partner activities with filtering.

```java
JsonObject result = client.turboPartner().getPartnerAuditLogs(
        50,               // limit
        0,                // offset
        null,             // search
        "ORG_CREATED",    // action (optional filter)
        "organization",   // resourceType (optional filter)
        null,             // resourceId
        true,             // success (optional filter)
        "2024-01-01",     // startDate (optional)
        "2024-12-31"      // endDate (optional)
);

for (var entry : result.getAsJsonObject("data").getAsJsonArray("results")) {
    JsonObject e = entry.getAsJsonObject();
    String line = e.get("createdOn").getAsString() + " - " + e.get("action").getAsString();
    if (e.has("resourceType") && !e.get("resourceType").isJsonNull()) {
        line += " (" + e.get("resourceType").getAsString() + ")";
    }
    line += " - " + (e.get("success").getAsBoolean() ? "Success" : "Failed");
    System.out.println(line);
}
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
| `maxStorage` | `long` | Maximum storage in bytes |
| `maxGeneratedDeliverables` | `int` | Maximum generated documents |
| `maxSignatures` | `int` | Maximum e-signatures |
| `maxAICredits` | `int` | Maximum AI credits |
| `rdWatermark` | `boolean` | Enable RapidDocx watermark |
| `hasFileDownload` | `boolean` | Enable file download |
| `hasAdvancedDateFormats` | `boolean` | Enable advanced date formats |
| `hasGDrive` | `boolean` | Enable Google Drive integration |
| `hasSharepoint` | `boolean` | Enable SharePoint integration |
| `hasSharepointOnly` | `boolean` | SharePoint-only mode |
| `hasTDAI` | `boolean` | Enable TurboDocx AI features |
| `hasPptx` | `boolean` | Enable PowerPoint support |
| `hasTDWriter` | `boolean` | Enable TurboDocx Writer |
| `hasSalesforce` | `boolean` | Enable Salesforce integration |
| `hasWrike` | `boolean` | Enable Wrike integration |
| `hasVariableStack` | `boolean` | Enable variable stack |
| `hasSubvariables` | `boolean` | Enable subvariables |
| `hasZapier` | `boolean` | Enable Zapier integration |
| `hasBYOM` | `boolean` | Enable Bring Your Own Model |
| `hasBYOVS` | `boolean` | Enable Bring Your Own Vector Store |
| `hasBetaFeatures` | `boolean` | Enable beta features |
| `enableBulkSending` | `boolean` | Enable bulk document sending |

:::tip Using Maps
The Java SDK uses `Map<String, Object>` for features. Use `HashMap` or `LinkedHashMap` to build your feature configuration:
```java
Map<String, Object> features = new HashMap<>();
features.put("maxUsers", 25);
features.put("maxStorage", 5368709120L);  // Use L suffix for long values
features.put("hasTDAI", true);
```
:::

### Tracking (Read-Only Usage)

These are usage counters that are read-only:

| Field | Type | Description |
|-------|------|-------------|
| `numUsers` | `int` | Current number of users |
| `numProjectspaces` | `int` | Current number of projectspaces |
| `numTemplates` | `int` | Current number of templates |
| `storageUsed` | `long` | Current storage used in bytes |
| `numGeneratedDeliverables` | `int` | Total documents generated |
| `numSignaturesUsed` | `int` | Total signatures used |
| `currentAICredits` | `int` | Remaining AI credits |

---

## Scope Constants

### PartnerScope (22 Scopes)

```java
import com.turbodocx.PartnerScope;

// Organization CRUD
PartnerScope.ORG_CREATE          // "org:create"
PartnerScope.ORG_READ            // "org:read"
PartnerScope.ORG_UPDATE          // "org:update"
PartnerScope.ORG_DELETE          // "org:delete"

// Entitlements
PartnerScope.ENTITLEMENTS_UPDATE // "entitlements:update"

// Organization Users
PartnerScope.ORG_USERS_CREATE    // "org-users:create"
PartnerScope.ORG_USERS_READ      // "org-users:read"
PartnerScope.ORG_USERS_UPDATE    // "org-users:update"
PartnerScope.ORG_USERS_DELETE    // "org-users:delete"

// Partner Users
PartnerScope.PARTNER_USERS_CREATE  // "partner-users:create"
PartnerScope.PARTNER_USERS_READ    // "partner-users:read"
PartnerScope.PARTNER_USERS_UPDATE  // "partner-users:update"
PartnerScope.PARTNER_USERS_DELETE  // "partner-users:delete"

// Organization API Keys
PartnerScope.ORG_APIKEYS_CREATE    // "org-apikeys:create"
PartnerScope.ORG_APIKEYS_READ      // "org-apikeys:read"
PartnerScope.ORG_APIKEYS_UPDATE    // "org-apikeys:update"
PartnerScope.ORG_APIKEYS_DELETE    // "org-apikeys:delete"

// Partner API Keys
PartnerScope.PARTNER_APIKEYS_CREATE  // "partner-apikeys:create"
PartnerScope.PARTNER_APIKEYS_READ    // "partner-apikeys:read"
PartnerScope.PARTNER_APIKEYS_UPDATE  // "partner-apikeys:update"
PartnerScope.PARTNER_APIKEYS_DELETE  // "partner-apikeys:delete"

// Audit
PartnerScope.AUDIT_READ             // "audit:read"
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

```java
Map<String, Boolean> permissions = new LinkedHashMap<>();
permissions.put("canManageOrgs", true);           // Create, update, delete organizations
permissions.put("canManageOrgUsers", true);        // Manage users within organizations
permissions.put("canManagePartnerUsers", false);   // Manage other partner portal users
permissions.put("canManageOrgAPIKeys", true);      // Manage organization API keys
permissions.put("canManagePartnerAPIKeys", false);  // Manage partner API keys
permissions.put("canUpdateEntitlements", true);     // Update organization entitlements
permissions.put("canViewAuditLogs", true);          // View audit logs
```

---

## Error Handling

The SDK provides typed exceptions for different error scenarios:

```java
import com.turbodocx.TurboDocxException;

try {
    JsonObject result = client.turboPartner().createOrganization("Acme Corp");
} catch (TurboDocxException.AuthenticationException e) {
    // 401 - Invalid API key or partner ID
    System.err.println("Authentication failed: " + e.getMessage());
} catch (TurboDocxException.ValidationException e) {
    // 400 - Invalid request data
    System.err.println("Validation error: " + e.getMessage());
} catch (TurboDocxException.NotFoundException e) {
    // 404 - Organization or resource not found
    System.err.println("Not found: " + e.getMessage());
} catch (TurboDocxException.RateLimitException e) {
    // 429 - Rate limit exceeded
    System.err.println("Rate limit: " + e.getMessage());
} catch (TurboDocxException.NetworkException e) {
    // Network/connection error
    System.err.println("Network error: " + e.getMessage());
} catch (TurboDocxException e) {
    // Base exception for other API errors
    System.err.println("API error [" + e.getStatusCode() + "]: " + e.getMessage());
}
```

### Error Types

| Error Type | Status Code | Description |
|------------|-------------|-------------|
| `TurboDocxException` | varies | Base exception for all SDK errors |
| `TurboDocxException.AuthenticationException` | 401 | Invalid or missing API credentials |
| `TurboDocxException.ValidationException` | 400 | Invalid request parameters |
| `TurboDocxException.NotFoundException` | 404 | Resource not found |
| `TurboDocxException.RateLimitException` | 429 | Too many requests |
| `TurboDocxException.NetworkException` | - | Network connectivity issues |

### Error Properties

| Property | Type | Description |
|----------|------|-------------|
| `getMessage()` | `String` | Human-readable error message |
| `getStatusCode()` | `int` | HTTP status code |
| `getCode()` | `String` | Error code (if available) |

---

## Complete Example

Here's a complete example showing a typical partner workflow:

```java
import com.google.gson.JsonObject;
import com.turbodocx.TurboDocxException;
import com.turbodocx.TurboPartnerClient;

import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        // Configure
        TurboPartnerClient client = new TurboPartnerClient.Builder()
                .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY"))
                .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))
                .build();

        try {
            // 1. Create an organization for a new customer
            JsonObject org = client.turboPartner().createOrganization("New Customer Inc");
            String orgId = org.getAsJsonObject("data").get("id").getAsString();
            System.out.println("Created organization: " + orgId);

            // 2. Set up their entitlements based on their plan
            Map<String, Object> features = new HashMap<>();
            features.put("maxUsers", 25);
            features.put("maxStorage", 5368709120L);  // 5GB
            features.put("hasTDAI", true);
            features.put("hasFileDownload", true);

            client.turboPartner().updateOrganizationEntitlements(orgId, features, null);
            System.out.println("Configured entitlements");

            // 3. Add their admin user
            JsonObject user = client.turboPartner().addUserToOrganization(
                    orgId, "admin@newcustomer.com", "admin");
            System.out.println("Added admin user: "
                    + user.getAsJsonObject("data").get("email").getAsString());

            // 4. Create an API key for their integration
            JsonObject apiKey = client.turboPartner().createOrganizationApiKey(
                    orgId, "Production API Key", "admin");
            System.out.println("Created API key: "
                    + apiKey.getAsJsonObject("data").get("key").getAsString());

            System.out.println("\nCustomer setup complete!");

        } catch (TurboDocxException e) {
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            System.exit(1);
        }
    }
}
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
- [Maven Central](https://search.maven.org/artifact/com.turbodocx/turbodocx-sdk)
- [TurboSign Java SDK](/docs/SDKs/java) — For digital signature operations
- [API Reference](/docs/API/partner-api) — REST API documentation
