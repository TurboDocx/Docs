---
title: SCIM User Provisioning
description: Set up SCIM 2.0 provisioning so your identity provider can create, update, and deactivate TurboDocx accounts automatically.
keywords:
  - scim provisioning
  - user provisioning
  - turbodocx scim
  - scim 2.0
  - azure ad provisioning
  - identity management
  - automated user management
---

# SCIM User Provisioning

TurboDocx supports SCIM 2.0 user provisioning, so your identity provider can automatically create, update, and deactivate TurboDocx accounts within your organization as employees join, change roles, or leave. SCIM manages accounts; pair it with [Single Sign-On](./Single-Sign%20On.md) if you also want your identity provider to handle authentication.

## Prerequisites

- A TurboDocx organization that already exists (SCIM manages users inside your organization, it doesn't create the organization itself).
- Admin access to a SCIM-capable app in your identity provider. TurboDocx's SCIM implementation has been exercised against Microsoft Entra ID (Azure AD) in production.
- A SCIM base URL and bearer token for your organization, issued by TurboDocx. There's no self-service page to generate this token today, so it comes from TurboDocx support.

## Setting up SCIM provisioning

1. Contact TurboDocx support to request SCIM provisioning for your organization. TurboDocx issues a SCIM base URL and a bearer token unique to your organization.
2. In your identity provider's provisioning app, enter the base URL as the SCIM endpoint and set the token as the Bearer/Authorization credential.
3. Map your identity provider's user attributes to the SCIM 2.0 User schema TurboDocx expects: `name.givenName`, `name.familyName`, `emails` (with a primary address), and `active`. Most SCIM apps do this mapping by default.
4. Turn on provisioning and run your identity provider's test or "provision a single user" action first, then confirm the account appears in TurboDocx before assigning the rest of your users.

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
No. SCIM only manages accounts, creation, updates, and deactivation. For sign-in, set up [Single Sign-On](./Single-Sign%20On.md) separately.

**Which identity providers work with TurboDocx's SCIM support?**
Any identity provider that implements the SCIM 2.0 User schema can connect. TurboDocx's implementation has been tested against Microsoft Entra ID.

**Does deactivating a SCIM user delete their documents?**
No. Deactivation removes the person's access and their membership in your organization, but does not delete the documents, templates, or signature records tied to that account.

**Can SCIM provision groups, not just users?**
TurboDocx's current SCIM support is focused on individual user accounts. If your identity provider syncs group membership, confirm with TurboDocx support before relying on it.