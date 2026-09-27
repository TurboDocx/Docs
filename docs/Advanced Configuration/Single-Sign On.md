---
title: Single Sign-On (SSO) Configuration
description: Set up SAML 2.0 or OpenID Connect single sign-on for your TurboDocx organization, including Microsoft Entra ID (Azure AD).
keywords:
  - single sign-on
  - sso configuration
  - saml integration
  - openid connect
  - azure ad sso
  - entra id sso
  - turbodocx authentication
---

# Single Sign-On (SSO) Configuration

TurboDocx supports enterprise single sign-on over SAML 2.0 and OpenID Connect (OIDC), so your organization's members authenticate through your own identity provider instead of a separate TurboDocx password. SSO is an Enterprise-plan feature that the TurboDocx team enables per organization.

## Prerequisites

- A TurboDocx Enterprise plan.
- An identity provider that speaks SAML 2.0 or OIDC. TurboDocx's SSO has been used in production with Microsoft Entra ID (Azure AD); other SAML 2.0 or OIDC-compliant providers can also be connected.
- Admin access to that identity provider, to create and configure a TurboDocx application or connection.
- Ownership of the email domain(s) your users sign in with. TurboDocx verifies your domain before trusting sign-ins from your identity provider, so an unverified domain can't be used to claim an existing account.

## Setting up SSO

There's no self-service toggle for SSO today. TurboDocx configures the connection with you:

1. Contact TurboDocx support to request SSO for your organization, and let them know whether your identity provider uses SAML 2.0 or OIDC.
2. Provide your identity provider's connection details: SAML metadata (a metadata URL or XML file) for SAML, or the client ID and issuer URL for OIDC, along with the email domain(s) your organization signs in with.
3. TurboDocx configures the connection on its side and verifies ownership of your domain.
4. Test the connection with one user before rolling it out. Have that user sign in from the TurboDocx login page; they should be redirected to your identity provider, authenticate there, and land back in TurboDocx as a member of your organization.

Once testing succeeds, ask your identity provider admin to assign the TurboDocx application to the rest of your users.

## Troubleshooting

**A user signed in through SSO but didn't get linked to their existing TurboDocx account.**
TurboDocx only auto-links an SSO sign-in to an existing account when your identity provider reports the user's email as verified. An unverified email creates a new account instead of linking to the old one; this is intentional, it stops one person from claiming another person's account by asserting their address. Confirm your identity provider marks the email attribute as verified.

**Sign-in redirects to your identity provider but the user ends up in the wrong TurboDocx organization, or isn't added to one.**
Check that the signing-in user's email domain is one of the domains verified for your organization. A user whose email is on a different domain won't be matched to your organization automatically.

**A user with a personal address (for example, a Gmail account) can't sign in through your organization's SSO.**
That's expected: your SSO connection is scoped to your verified domain(s). Invite that person as a regular TurboDocx member instead.

## FAQ

**Which protocols does TurboDocx support?**
SAML 2.0 and OpenID Connect (OIDC).

**Does SSO replace TurboDocx passwords?**
Once SSO is configured, your organization's members sign in through your identity provider rather than a TurboDocx password.

**Is SSO included in my plan?**
SSO is included with the TurboDocx Enterprise plan.

**Can I combine SSO with automated user provisioning?**
Yes. Pair SSO with [SCIM Provisioning](./SCIM%20Provisioning.md) so accounts are created, updated, and deactivated automatically as your identity provider changes, on top of SSO handling how those users sign in.
