**TEMPORARY design/decision notes — not a doc page, do not publish. Fold the relevant parts into docs/TurboSign/Embedded Signing.md before this PR merges, then delete this file.**

# Embedded Identity: Design Decisions

## 1. Identity verification is optional and per-recipient

Identity verification is not required. It is configured per recipient. A recipient with no `identityVerification` or `otpChannel` set signs with no extra step: `resolveIdentityMode` returns `null`, and the step-up gate passes through without prompting for anything.

## 2. This is not "embedded-only"

Nothing marks a recipient as embedded. The identity/OTP step-up gate fires on the signing routes for any recipient with a resolved mode, regardless of whether they arrived through an emailed link or an embedded URL. Identity verification is opt-in per recipient. It is not tied to embedding.

## 3. Org-wide gates vs. per-recipient mode

There are two different kinds of settings here, and they behave differently.

**Org-wide gates** are set once per org and apply everywhere, including SDK/API sends:
- `enabled`
- `allowExternalIdv`
- `allowIdentityOverride`
- `allowedFrameAncestors`

These gates permit or block behavior. They never auto-select a mode for a recipient.

**Per-recipient mode** is a different thing: the org-wide default channel (`embeddedSigning.defaultChannel = email|sms`) auto-applies a mode to recipients, but only on the interactive UI path (draft editing / update-with-recipients). The SDK `sendSignature` call and the automated buffer path (Pipelines, MailMerge, TurboQuote) deliberately opt out of this default. That means SDK/API callers must set `identityVerification` (or `otpChannel`) per recipient themselves; the org default never reaches them.

Where the default does apply (the UI path), it applies to every recipient in that org, not only to embedded ones. So `defaultChannel` is effectively an org-wide "require identity verification on all signatures" policy, not an embedded-only setting.

This shape mirrors DocuSign: account-level permitted methods plus per-recipient selection.

## 4. `createSigningUrl` return shape: `?token=` vs. `?sut=`

Decision: keep the split between the two link types.

- **OTP and no-verification recipients** get the reusable `?token=` link: the recipient's durable access token, the same token used by the emailed signing link. The passcode (where present) is the security control, so the URL itself does not need to be single-use. It survives a page refresh or resume.
- **Override and external IDV modes** (the bypass modes, which have no passcode) get a single-use, short-TTL link (about 5 minutes) using `?sut=`. Here the URL itself is the credential, so it must be one-time: opening it redeems it once, through the `.../signing-url/redeem` endpoint, guarded by a compare-and-set on `signingUrlOpenedAt`. This matches DocuSign's `createRecipientView` and BoldSign's `GetEmbeddedSignLink`.

**Rejected alternative:** making every mode single-use. That would make the OTP flow fragile on refresh, and it would require persisting the redeemed grant client-side, which undermines the single-use guarantee for the modes that actually need it.

In all cases, the integrator calls `createSigningUrl` at click-time and never stores the URL.

## 5. SDK org configuration: read-only for now

Decision: add a read-only `getEmbeddedSigningSettings()` method so integrators can check what is enabled for their org.

No SDK write path for org gates. `allowIdentityOverride` is meant as a development/testing bypass, and org-level changes should go through the settings UI or the preferences API, where the change is recorded in the settings audit diff.

## 6. Doc corrections still pending (do not edit yet)

The Embedded Signing page is on hold until end-to-end testing is done. Do not edit `docs/TurboSign/Embedded Signing.md` now, just record what needs fixing later:

- It currently says "Every embedded signer is verified in one of three ways," which contradicts the optionality described in decision 1 above.
- It currently says "Require identity verification turns on the one-time passcode flow and sets the default method (email or SMS)," on a page written for SDK/API integrators, whose path does not honor `defaultChannel` per decision 3 above.

Both statements need to be reconciled with the decisions in this note before the page ships.
