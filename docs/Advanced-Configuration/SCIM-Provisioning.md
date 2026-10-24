---
title: SCIM Provisioning for TurboDocx
sidebar_label: SCIM User Provisioning
description: Set up SCIM provisioning (SCIM 2.0) so your identity provider creates, updates, and deactivates TurboDocx user accounts automatically.
keywords:
  - scim provisioning
  - user provisioning
  - turbodocx scim
  - scim 2.0
  - azure ad provisioning
  - identity management
  - automated user management
---

# SCIM Provisioning

SCIM provisioning lets your identity provider create, update, and deactivate TurboDocx accounts in your organization automatically as employees join, change roles, or leave. TurboDocx supports the SCIM 2.0 User schema. SCIM manages accounts; pair it with [Single Sign-On](./Single-Sign-On.md) if you also want your identity provider to handle authentication.

**In short:** TurboDocx support issues your organization a SCIM base URL and bearer token, you enter both in your identity provider's provisioning app, and from then on account changes in your identity provider flow into TurboDocx without manual user management. Removing someone in your identity provider takes away their TurboDocx access but keeps their documents.

## Prerequisites

- A TurboDocx organization that already exists (SCIM manages users inside your organization, it doesn't create the organization itself).
- Admin access to a SCIM-capable app in your identity provider. TurboDocx's SCIM implementation has been exercised against Microsoft Entra ID (Azure AD) in production.
- A SCIM base URL and bearer token for your organization, issued by TurboDocx. There's no self-service page to generate this token today, so it comes from TurboDocx support.

## Setting up SCIM provisioning

1. Contact TurboDocx support to request SCIM provisioning for your organization. TurboDocx issues a SCIM base URL and a bearer token unique to your organization.
2. In your identity provider's provisioning app, enter the base URL as the SCIM endpoint and set the token as the Bearer/Authorization credential.
3. Map your identity provider's user attributes to the SCIM 2.0 User schema TurboDocx expects: `name.givenName`, `name.familyName`, `emails` (with a primary address), and `active`. Most SCIM apps do this mapping by default.
4. Turn on provisioning and run your identity provider's test or "provision a single user" action first, then confirm the account appears in TurboDocx before assigning the rest of your users.

### Example: the request your identity provider sends

You don't write this request yourself; your identity provider sends it when you assign a user. It is shown here so you can check your attribute mapping. A new user arrives as a standard SCIM 2.0 `POST` to the `/Users` endpoint under your base URL:

```http
POST {your SCIM base URL}/Users
Authorization: Bearer {your SCIM token}
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "externalId": "00u1a2b3c4d5e6f7g8h9",
  "userName": "jane.doe@example.com",
  "name": { "givenName": "Jane", "familyName": "Doe" },
  "emails": [{ "value": "jane.doe@example.com", "type": "work", "primary": true }],
  "active": true
}
```

TurboDocx uses the primary email (or the first email if none is marked primary) as the account's email address and answers `201 Created` with the provisioned user.

## What SCIM provisioning does

- **Create:** a new user assigned in your identity provider creates a matching TurboDocx account in your organization. If an inactive TurboDocx account with the same email already exists, SCIM reactivates it instead of creating a duplicate.
- **Read:** your identity provider can look up TurboDocx users by SCIM filter and page through results, the same way it would query any other SCIM-compliant application.
- **Update:** attribute changes your identity provider pushes with a SCIM `replace` operation, name, email, and active status, update the matching TurboDocx account.
- **Deactivate:** removing or disabling a user in your identity provider deactivates their TurboDocx account and removes them from your organization. It does not delete the underlying account record or their documents.

## Troubleshooting

**New employees aren't appearing in TurboDocx.**
Confirm provisioning is actually turned on for the TurboDocx app in your identity provider, assigning a user to the app isn't always the same setting as enabling provisioning. Also check that the bearer token configured in your identity provider still matches the one TurboDocx issued; a rotated or mistyped token causes every provisioning request to fail.

**A field update from my identity provider isn't showing up in TurboDocx.**
TurboDocx's SCIM implementation applies `replace` operations. Some identity providers, including Microsoft Entra ID for the `displayName` field, send `add` instead of `replace` for certain attributes; those requests are accepted without an error but the field isn't updated. If an attribute update isn't taking effect, check whether your identity provider can be configured to send `replace` for that field.

**A user I removed from my identity provider still shows as active in TurboDocx.**
Confirm your identity provider is configured to actually deprovision (not just unassign) the user when they're removed. Some identity providers only stop syncing a removed user rather than sending a deactivation request.

## FAQ

**Does SCIM also let users sign in?**
No. SCIM only manages accounts, creation, updates, and deactivation. For sign-in, set up [Single Sign-On](./Single-Sign-On.md) separately.

**Which identity providers work with TurboDocx's SCIM support?**
Any identity provider that implements the SCIM 2.0 User schema can connect. TurboDocx's implementation has been tested against Microsoft Entra ID.

**Does deactivating a SCIM user delete their documents?**
No. Deactivation removes the person's access and their membership in your organization, but does not delete the documents, templates, or signature records tied to that account.

**Can SCIM provision groups, not just users?**
TurboDocx's current SCIM support is focused on individual user accounts. If your identity provider syncs group membership, confirm with TurboDocx support before relying on it.