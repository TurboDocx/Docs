---
title: TurboPartner Java SDK
unlisted: true
sidebar_position: 13
sidebar_label: "TurboPartner: Java"
description: Official TurboDocx Partner SDK for Java. Manage organizations, users, API keys, and entitlements programmatically with the Builder pattern.
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
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboPartner Java SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbopartner" product="TurboPartner" />

:::tip Interested in TurboPartner?
TurboPartner is available for integrators and partners. [Contact us](https://www.turbodocx.com/demo) to get started.
:::

The official TurboDocx Partner SDK for Java applications. Build multi-tenant SaaS applications with programmatic organization management, user provisioning, API key management, and entitlement control. Available on Maven Central as `com.turbodocx:turbodocx-sdk`.

<br />

:::info What is TurboPartner?
TurboPartner is the partner management API for TurboDocx. It allows you to programmatically create and manage organizations, users, API keys, and feature entitlements — perfect for building white-label or multi-tenant applications on top of TurboDocx.
:::

## TLDR

```java
import com.turbodocx.TurboPartnerClient;
import com.google.gson.JsonObject;

import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) throws Exception {
        // 1. Configure
        TurboPartnerClient client = new TurboPartnerClient.Builder()
            .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY"))
            .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))
            .build();

        // 2. Create an organization with entitlements
        Map<String, Object> features = new LinkedHashMap<>();
        features.put("maxUsers", 25);              // Max users allowed
        features.put("maxStorage", 5368709120L);   // 5GB in bytes
        features.put("hasTDAI", true);             // Enable TurboDocx AI

        JsonObject org = client.turboPartner().createOrganization("Acme Corporation", null, features);
        String orgId = org.getAsJsonObject("data").get("id").getAsString();

        // 3. Add a user
        client.turboPartner().addUserToOrganization(orgId, "admin@acme.com", "admin");

        // 4. Create an API key
        JsonObject key = client.turboPartner().createOrganizationApiKey(orgId, "Production Key", "admin");
        System.out.println("API Key: " + key.getAsJsonObject("data").get("key").getAsString()); // Save this — only shown once!
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
    <version>0.5.0</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle (Kotlin)">

```kotlin
implementation("com.turbodocx:turbodocx-sdk:0.5.0")
```

</TabItem>
<TabItem value="gradle-groovy" label="Gradle (Groovy)">

```groovy
implementation 'com.turbodocx:turbodocx-sdk:0.5.0'
```

</TabItem>
</Tabs>

## Requirements

- Java 11+
- OkHttp 4.x (included)
- Gson 2.x (included)

---

## Configuration

```java
import com.turbodocx.TurboPartnerClient;

public class Main {
    public static void main(String[] args) {
        // Create the partner client with the Builder pattern
        TurboPartnerClient client = new TurboPartnerClient.Builder()
            .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY"))  // Required: must start with TDXP-
            .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))           // Required: your partner UUID
            .build();

        // Or with a custom base URL
        TurboPartnerClient custom = new TurboPartnerClient.Builder()
            .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY"))
            .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))
            .baseUrl("https://api.turbodocx.com")
            .build();
    }
}
```

### Builder Options

| Method                  | Type     | Required | Default                     | Description                       |
| ----------------------- | -------- | -------- | --------------------------- | --------------------------------- |
| `partnerApiKey(String)` | `String` | Yes      | -                           | Partner API key (starts with `TDXP-`) |
| `partnerId(String)`     | `String` | Yes      | -                           | Your partner UUID                 |
| `baseUrl(String)`       | `String` | No       | `https://api.turbodocx.com` | API base URL                      |

`build()` throws `TurboDocxException.AuthenticationException` if `partnerApiKey` or `partnerId` is missing. All partner operations live on `client.turboPartner()`.

:::caution Partner API Key Required
Partner API keys start with the `TDXP-` prefix. These are different from regular organization API keys and provide access to partner-level operations across all your organizations.
:::

### Environment Variables

```bash
export TURBODOCX_PARTNER_API_KEY=TDXP-your-partner-api-key
export TURBODOCX_PARTNER_ID=your-partner-uuid
```

:::info Responses are raw `JsonObject`
Every `TurboPartner` method returns a Gson `JsonObject` containing the raw API response — `success`, `data`, and sometimes `message`. Unlike the TurboSign and Deliverable modules, partner responses are **not** unwrapped into typed models, so read them with `getAsJsonObject("data")`, `getAsJsonArray("results")`, `getAsString()`, and friends. Iterating a results array needs `com.google.gson.JsonElement` alongside `com.google.gson.JsonObject`. Every method throws `IOException` on transport failure.
:::

---

## Quick Start

### Create Your First Organization

```java
import com.turbodocx.TurboPartnerClient;
import com.google.gson.JsonObject;

public class Main {
    public static void main(String[] args) throws Exception {
        TurboPartnerClient client = new TurboPartnerClient.Builder()
            .partnerApiKey(System.getenv("TURBODOCX_PARTNER_API_KEY"))
            .partnerId(System.getenv("TURBODOCX_PARTNER_ID"))
            .build();

        JsonObject result = client.turboPartner().createOrganization("Acme Corporation");
        JsonObject data = result.getAsJsonObject("data");

        System.out.println("Organization created!");
        System.out.println("  ID: " + data.get("id").getAsString());
        System.out.println("  Name: " + data.get("name").getAsString());
    }
}
```

:::caution Always Handle Errors
The above examples omit error handling for brevity. In production, wrap all TurboPartner calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

---

## Organization Management

### `createOrganization()`

Create a new organization under your partner account. There are two overloads: name only, or name plus optional `metadata` and `features` maps (either may be `null`).

```java
import java.util.LinkedHashMap;
import java.util.Map;

// Name only
JsonObject simple = client.turboPartner().createOrganization("Acme Corporation");

// With metadata and entitlements overrides
Map<String, Object> metadata = new LinkedHashMap<>();
metadata.put("crmAccountId", "ACC-1024");

Map<String, Object> features = new LinkedHashMap<>();
features.put("maxUsers", 50);

JsonObject result = client.turboPartner().createOrganization("Acme Corporation", metadata, features);

System.out.println("Organization ID: " + result.getAsJsonObject("data").get("id").getAsString());
```

### `listOrganizations()`

List all organizations with pagination and search. Pass `null` for any filter you don't need.

```java
JsonObject result = client.turboPartner().listOrganizations(25, 0, "Acme");
JsonObject data = result.getAsJsonObject("data");

System.out.println("Total: " + data.get("totalRecords").getAsInt());
for (JsonElement element : data.getAsJsonArray("results")) {
    JsonObject org = element.getAsJsonObject();
    System.out.println("- " + org.get("name").getAsString() + " (ID: " + org.get("id").getAsString() + ")");
}
```

### `getOrganizationDetails()`

Get full details including features and tracking for an organization.

```java
JsonObject result = client.turboPartner().getOrganizationDetails("org-uuid-here");
JsonObject data = result.getAsJsonObject("data");

System.out.println("Name: " + data.get("name").getAsString());
System.out.println("Active: " + (data.get("isActive").getAsBoolean() ? "Yes" : "No"));

if (data.has("features") && data.get("features").isJsonObject()) {
    JsonObject features = data.getAsJsonObject("features");
    System.out.println("Max Users: " + features.get("maxUsers").getAsInt());
    System.out.println("Max Storage: " + features.get("maxStorage").getAsLong() + " bytes");
}

if (data.has("tracking") && data.get("tracking").isJsonObject()) {
    JsonObject tracking = data.getAsJsonObject("tracking");
    System.out.println("Current Users: " + tracking.get("numUsers").getAsInt());
    System.out.println("Storage Used: " + tracking.get("storageUsed").getAsLong() + " bytes");
}
```

### `updateOrganizationInfo()`

Update an organization's name.

```java
JsonObject result = client.turboPartner().updateOrganizationInfo(
    "org-uuid-here",
    "Acme Corp (Updated)"
);
```

### `updateOrganizationEntitlements()`

Update an organization's feature limits and capabilities. Both `features` and `tracking` are optional — pass `null` for the one you are not changing.

```java
Map<String, Object> features = new LinkedHashMap<>();
features.put("maxUsers", 100);
features.put("maxStorage", 10737418240L);  // 10GB in bytes
features.put("maxSignatures", 500);
features.put("hasTDAI", true);
features.put("hasFileDownload", true);
features.put("hasBetaFeatures", false);

JsonObject result = client.turboPartner().updateOrganizationEntitlements(
    "org-uuid-here",
    features,
    null
);

System.out.println("Entitlements updated!");
```

You can also set the usage counters on the same call:

```java
Map<String, Object> tracking = new LinkedHashMap<>();
tracking.put("numUsers", 5);
tracking.put("storageUsed", 1048576L);
tracking.put("currentAICredits", -1);  // -1 = unlimited

client.turboPartner().updateOrganizationEntitlements("org-uuid-here", null, tracking);
```

:::info Features vs Tracking
**Features** are the limits and capabilities you grant (maxUsers, hasTDAI, …).
**Tracking** is the current consumption against those limits (numUsers, storageUsed, …). It is normally maintained by TurboDocx, but this endpoint **does accept a `tracking` map**, so you can seed or reconcile counters during a migration.
See [Entitlements Reference](#entitlements-reference) for all available fields.
:::

### `deleteOrganization()`

Delete an organization (soft delete).

```java
JsonObject result = client.turboPartner().deleteOrganization("org-uuid-here");
System.out.println("Success: " + (result.get("success").getAsBoolean() ? "Yes" : "No"));
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
    "admin"  // "admin", "contributor", "user", or "viewer"
);
JsonObject data = result.getAsJsonObject("data");

System.out.println("User ID: " + data.get("id").getAsString());
System.out.println("Invitation sent to: " + data.get("email").getAsString());
```

### `listOrganizationUsers()`

List all users in an organization. `limit`, `offset`, and `search` may each be `null`.

```java
JsonObject result = client.turboPartner().listOrganizationUsers("org-uuid-here", 50, 0, null);
JsonObject data = result.getAsJsonObject("data");

System.out.println("Total Users: " + data.get("totalRecords").getAsInt());
for (JsonElement element : data.getAsJsonArray("results")) {
    JsonObject user = element.getAsJsonObject();
    System.out.println("- " + user.get("email").getAsString() + " (" + user.get("role").getAsString() + ")");
}
```

### `updateOrganizationUserRole()`

Change a user's role within an organization.

```java
JsonObject result = client.turboPartner().updateOrganizationUserRole(
    "org-uuid-here",
    "user-uuid-here",
    "contributor"
);
```

### `resendOrganizationInvitationToUser()`

Resend the invitation email to a pending user.

```java
JsonObject result = client.turboPartner().resendOrganizationInvitationToUser(
    "org-uuid-here",
    "user-uuid-here"
);
```

### `removeUserFromOrganization()`

Remove a user from an organization.

```java
JsonObject result = client.turboPartner().removeUserFromOrganization(
    "org-uuid-here",
    "user-uuid-here"
);
```

---

## Organization API Key Management

### `createOrganizationApiKey()`

Create an API key for an organization.

```java
JsonObject result = client.turboPartner().createOrganizationApiKey(
    "org-uuid-here",
    "Production API Key",
    "admin"  // ORG role: "admin", "contributor", "user", or "viewer"
);
JsonObject data = result.getAsJsonObject("data");

System.out.println("Key ID: " + data.get("id").getAsString());
System.out.println("Full Key: " + data.get("key").getAsString());  // Only shown once!
```

:::caution Save Your API Key
The full API key is only returned once during creation. Store it securely — you won't be able to retrieve it again.
:::

### `listOrganizationApiKeys()`

List all API keys for an organization.

```java
JsonObject result = client.turboPartner().listOrganizationApiKeys("org-uuid-here", 50, null, null);

for (JsonElement element : result.getAsJsonObject("data").getAsJsonArray("results")) {
    JsonObject key = element.getAsJsonObject();
    System.out.println("- " + key.get("name").getAsString() + " (Role: " + key.get("role").getAsString() + ")");
}
```

### `updateOrganizationApiKey()`

Update an organization API key's name or role. Pass `null` for a field to keep its current value.

```java
JsonObject result = client.turboPartner().updateOrganizationApiKey(
    "org-uuid-here",
    "api-key-uuid-here",
    "Updated Key Name",
    "contributor"
);
```

The updated key is returned on the `apiKey` property rather than `data`:

```java
System.out.println(result.getAsJsonObject("apiKey").get("name").getAsString());
```

### `revokeOrganizationApiKey()`

Revoke (delete) an organization API key.

```java
JsonObject result = client.turboPartner().revokeOrganizationApiKey(
    "org-uuid-here",
    "api-key-uuid-here"
);
```

---

## Partner API Key Management

### `createPartnerApiKey()`

Create a new partner-level API key with specific scopes. `description` is optional (`null` to omit).

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
System.out.println("Full Key: " + data.get("key").getAsString());  // Only shown once!
```

### `listPartnerApiKeys()`

List all partner API keys.

```java
JsonObject result = client.turboPartner().listPartnerApiKeys(50, null, null);

for (JsonElement element : result.getAsJsonObject("data").getAsJsonArray("results")) {
    JsonObject key = element.getAsJsonObject();
    System.out.println("- " + key.get("name").getAsString());
    System.out.println("  Scopes: " + key.getAsJsonArray("scopes"));
}
```

### `updatePartnerApiKey()`

Update a partner API key. The argument order is `keyId, name, description, scopes` — pass `null` for anything you want to leave unchanged.

```java
JsonObject result = client.turboPartner().updatePartnerApiKey(
    "partner-key-uuid-here",
    "Updated Integration Key",
    "Updated description",
    null  // keep the existing scopes
);
```

### `revokePartnerApiKey()`

Revoke a partner API key.

```java
JsonObject result = client.turboPartner().revokePartnerApiKey("partner-key-uuid-here");
```

---

## Partner User Management

:::danger Partner users use different role values
Partner portal users take `"admin"`, `"member"`, or `"viewer"`. **Organization** users and organization API keys take `"admin"`, `"contributor"`, `"user"`, or `"viewer"`. The two sets do not overlap beyond `admin`/`viewer` — `"member"` is rejected on an org call, and `"contributor"`/`"user"` are rejected on a partner call. See [Role Values](#role-values).
:::

:::caution `permissions` is all-or-nothing
`addUserToPartnerPortal()` **requires** a permissions map containing all seven keys. On `updatePartnerUserPermissions()` the map is optional (`null` keeps the current values), but if you send it, **all seven keys are required**. There is no partial permissions update — the API rejects an incomplete map with `TurboDocxException.ValidationException` (400). Read the current values first and re-send them with your change applied.
:::

### `addUserToPartnerPortal()`

Add a user to the partner portal with specific permissions.

```java
import java.util.LinkedHashMap;
import java.util.Map;

// Required on add — all 7 keys must be present.
Map<String, Boolean> permissions = new LinkedHashMap<>();
permissions.put("canManageOrgs", true);            // Create, update, delete organizations
permissions.put("canManageOrgUsers", true);        // Manage users within organizations
permissions.put("canManagePartnerUsers", false);   // Manage other partner portal users
permissions.put("canManageOrgAPIKeys", true);      // Manage organization API keys
permissions.put("canManagePartnerAPIKeys", false); // Manage partner API keys
permissions.put("canUpdateEntitlements", true);    // Update organization entitlements
permissions.put("canViewAuditLogs", true);         // View audit logs

JsonObject result = client.turboPartner().addUserToPartnerPortal(
    "admin@partner.com",
    "admin",  // PARTNER role: "admin", "member", or "viewer"
    permissions
);

System.out.println("Partner User ID: " + result.getAsJsonObject("data").get("id").getAsString());
```

### `listPartnerPortalUsers()`

List all partner portal users.

```java
JsonObject result = client.turboPartner().listPartnerPortalUsers(50, null, null);

for (JsonElement element : result.getAsJsonObject("data").getAsJsonArray("results")) {
    JsonObject user = element.getAsJsonObject();
    System.out.println("- " + user.get("email").getAsString() + " (Role: " + user.get("role").getAsString() + ")");
}
```

### `updatePartnerUserPermissions()`

Update a partner user's role and/or permissions. Pass `null` for `role` or `permissions` to keep the current value — but if you pass `permissions`, supply **all seven keys**; a partial map is a 400.

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
    "partner-user-uuid-here",
    "admin",
    permissions
);
```

### `resendPartnerPortalInvitationToUser()`

Resend the invitation email to a pending partner user.

```java
JsonObject result = client.turboPartner().resendPartnerPortalInvitationToUser("partner-user-uuid-here");
```

### `removeUserFromPartnerPortal()`

Remove a user from the partner portal.

```java
JsonObject result = client.turboPartner().removeUserFromPartnerPortal("partner-user-uuid-here");
```

---

## Audit Logs

### `getPartnerAuditLogs()`

Get audit logs for all partner activities with filtering. All nine arguments are positional — pass `null` for any filter you don't want.

```java
JsonObject result = client.turboPartner().getPartnerAuditLogs(
    50,               // limit
    0,                // offset
    null,             // search
    "ORG_CREATED",    // action
    "organization",   // resourceType
    null,             // resourceId
    true,             // success
    "2024-01-01",     // startDate (ISO 8601)
    "2024-12-31"      // endDate (ISO 8601)
);

for (JsonElement element : result.getAsJsonObject("data").getAsJsonArray("results")) {
    JsonObject entry = element.getAsJsonObject();
    System.out.print(entry.get("createdOn").getAsString() + " - " + entry.get("action").getAsString());
    if (entry.has("resourceType") && !entry.get("resourceType").isJsonNull()) {
        System.out.print(" (" + entry.get("resourceType").getAsString() + ")");
    }
    System.out.println(" - " + (entry.get("success").getAsBoolean() ? "Success" : "Failed"));
}
```

| Argument       | Type      | Description                          |
| -------------- | --------- | ------------------------------------ |
| `limit`        | `Integer` | Maximum number of results            |
| `offset`       | `Integer` | Pagination offset                    |
| `search`       | `String`  | Search query string                  |
| `action`       | `String`  | Filter by action type                |
| `resourceType` | `String`  | Filter by resource type              |
| `resourceId`   | `String`  | Filter by resource ID                |
| `success`      | `Boolean` | Filter by success status             |
| `startDate`    | `String`  | Filter from date (ISO 8601)          |
| `endDate`      | `String`  | Filter to date (ISO 8601)            |

---

## Entitlements Reference

### Features (Settable Limits)

These are limits and capabilities you can configure for each organization:

| Field | Type | Description |
|-------|------|-------------|
| `maxUsers` | int | Maximum users allowed (-1 = unlimited) |
| `maxProjectspaces` | int | Maximum projectspaces |
| `maxTemplates` | int | Maximum templates |
| `maxStorage` | long | Maximum storage in bytes |
| `maxGeneratedDeliverables` | int | Maximum generated documents |
| `maxSignatures` | int | Maximum e-signatures |
| `maxAICredits` | int | Maximum AI credits |
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

:::info Map keys stay camelCase
The `features`, `tracking`, and `permissions` maps are serialized straight into the JSON request body, so the keys must match exactly as written above (`maxUsers`, `hasTDAI`, `canManageOrgAPIKeys`) — Java naming conventions do not apply to request-body keys.
:::

### Tracking (Usage Counters)

Current consumption against the limits above. TurboDocx maintains these automatically, but `updateOrganizationEntitlements()` **accepts a `tracking` map** — useful for seeding counters when migrating an existing customer:

| Field | Type | Description |
|-------|------|-------------|
| `numUsers` | int | Current number of users |
| `numProjectspaces` | int | Current number of projectspaces |
| `numTemplates` | int | Current number of templates |
| `storageUsed` | long | Current storage used in bytes |
| `numGeneratedDeliverables` | int | Total documents generated |
| `numSignaturesUsed` | int | Total signatures used |
| `numQuotesSent` | int | Total quotes sent |
| `currentAICredits` | int | Remaining AI credits (-1 = unlimited) |

Every counter except `currentAICredits` floors at `0`. Only `currentAICredits` accepts `-1`, meaning unlimited.

---

## Constants and Types

### PartnerScope (22 Scopes)

`com.turbodocx.PartnerScope` is a constants class of `String` values — there is no scope enum. Pass them as a `List<String>` to `createPartnerApiKey()` and `updatePartnerApiKey()`.

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
PartnerScope.AUDIT_READ            // "audit:read"
```

### Role Values

Roles are plain `String` values in the Java SDK — there is no role enum.

**Organization users and organization API keys** — used by `addUserToOrganization()`, `updateOrganizationUserRole()`, `createOrganizationApiKey()`, and `updateOrganizationApiKey()`:

| Value           | Description                  |
| --------------- | ---------------------------- |
| `"admin"`       | Full organization access     |
| `"contributor"` | Can create and edit content  |
| `"user"`        | Standard user access         |
| `"viewer"`      | Read-only access             |

**Partner portal users** — used by `addUserToPartnerPortal()` and `updatePartnerUserPermissions()` only:

| Value      | Description                                  |
| ---------- | -------------------------------------------- |
| `"admin"`  | Full partner portal access                   |
| `"member"` | Standard partner access (respects permissions) |
| `"viewer"` | Read-only access to partner portal           |

:::danger Do not mix the two sets
`"member"` is valid **only** for partner portal users; sending it to an organization endpoint is a 400. `"contributor"` and `"user"` are valid **only** for organization users; sending either to a partner endpoint is a 400.
:::

### Partner Permissions

All seven keys are required whenever a permissions map is sent. Partial maps are rejected with a 400.

| Key                       | Type      | Description                            |
| ------------------------- | --------- | -------------------------------------- |
| `canManageOrgs`           | `Boolean` | Create, update, delete organizations   |
| `canManageOrgUsers`       | `Boolean` | Manage users within organizations      |
| `canManagePartnerUsers`   | `Boolean` | Manage other partner portal users      |
| `canManageOrgAPIKeys`     | `Boolean` | Manage organization API keys           |
| `canManagePartnerAPIKeys` | `Boolean` | Manage partner API keys                |
| `canUpdateEntitlements`   | `Boolean` | Update organization entitlements       |
| `canViewAuditLogs`        | `Boolean` | View audit logs                        |

---

## Error Handling

The SDK provides typed exceptions for different error scenarios. They all extend `TurboDocxException`, which is a `RuntimeException`, so catch it after any checked `IOException` handling:

```java
import com.turbodocx.TurboDocxException;

import java.io.IOException;

try {
    JsonObject result = client.turboPartner().createOrganization("Acme Corp");
} catch (TurboDocxException.AuthenticationException e) {
    // 401 - Invalid partner API key or partner ID
    System.err.println("Authentication failed: " + e.getMessage());
} catch (TurboDocxException.AuthorizationException e) {
    // 403 - Partner API key lacks the required scope
    System.err.println("Forbidden: " + e.getMessage());
} catch (TurboDocxException.ValidationException e) {
    // 400 - Invalid request data
    System.err.println("Validation error: " + e.getMessage());
} catch (TurboDocxException.NotFoundException e) {
    // 404 - Organization or resource not found
    System.err.println("Not found: " + e.getMessage());
} catch (TurboDocxException.RateLimitException e) {
    // 429 - Rate limit exceeded
    System.err.println("Rate limit: " + e.getMessage());
} catch (TurboDocxException e) {
    // Any other API error, including 409 conflicts
    System.err.println("API error [" + e.getStatusCode() + "]: " + e.getMessage());
} catch (IOException e) {
    // Network/connection error
    System.err.println("Network error: " + e.getMessage());
}
```

### Error Types

| Error Type                                   | Status Code | Description                                        |
| -------------------------------------------- | ----------- | -------------------------------------------------- |
| `TurboDocxException`                         | varies      | Base exception for all API errors                  |
| `TurboDocxException.AuthenticationException` | 401         | Invalid or missing partner credentials             |
| `TurboDocxException.ValidationException`     | 400         | Invalid request parameters                         |
| `TurboDocxException.AuthorizationException`  | 403         | Partner API key lacks the required scope           |
| `TurboDocxException.NotFoundException`       | 404         | Resource not found                                 |
| `TurboDocxException.RateLimitException`      | 429         | Too many requests                                  |

Transport failures are **not** wrapped: the partner client propagates OkHttp's checked `IOException` directly, so catch `IOException` for connectivity problems rather than `TurboDocxException.NetworkException`.

:::caution 409 conflicts arrive as the base exception
`TurboDocxException.ConflictException` exists in the SDK, but the partner client does **not** raise it — a 409 (for example, a user that already exists) surfaces as the base `TurboDocxException` with `getStatusCode() == 409`. Handle it in the base `catch` block rather than adding a `ConflictException` catch, which would never fire on a partner call.
:::

### Error Properties

| Property          | Type     | Description                  |
| ----------------- | -------- | ---------------------------- |
| `getMessage()`    | `String` | Human-readable error message |
| `getStatusCode()` | `int`    | HTTP status code             |
| `getCode()`       | `String` | Error code (if available)    |

---

## Complete Example

Here's a complete example showing a typical partner workflow:

```java
import com.turbodocx.TurboPartnerClient;
import com.turbodocx.TurboDocxException;
import com.google.gson.JsonObject;

import java.util.LinkedHashMap;
import java.util.Map;

public class PartnerOnboarding {
    public static void main(String[] args) {
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
            Map<String, Object> features = new LinkedHashMap<>();
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
            System.err.println("Error [" + e.getStatusCode() + "]: " + e.getMessage());
            System.exit(1);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
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
