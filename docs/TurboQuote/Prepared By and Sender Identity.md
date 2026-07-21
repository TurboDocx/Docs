---
title: 'Prepared By & Sender Identity'
sidebar_position: 5
description: 'How TurboQuote decides the "Prepared by" name and email shown on a quote, and how to set your organization''s sender identity for quotes created in the UI or through the API, SDKs, and n8n.'
keywords:
  - turboquote
  - prepared by
  - sender identity
  - quote template
  - sender email
  - sender name
  - api quote
  - preparedBy
  - TurboDocx
---

# "Prepared By" & Sender Identity

Every quote shows a **"Prepared by"** block — a name and email that tells your customer who the
quote is from. This page explains where those values come from, and how to make sure they are
correct for quotes created in the UI **and** through the API, SDKs, or n8n.

## Where "Prepared by" comes from

TurboQuote resolves the "Prepared by" name and email in this order:

1. **Your organization's quote template.** If the template has a **Sender Name** and **Sender
   Email** configured, those are used on every quote — this is the recommended setup, because it
   keeps every quote consistent regardless of who created it.
2. **The quote's creator.** If the template has no sender fields set, the quote falls back to the
   name and email of the person (or integration) that created the quote.

The name and email always come from the **same source**, so they can never disagree — the person
downloading or sending the quote never changes what the customer sees.

:::tip Set it once on your quote template
Configure a **Sender Name**, **Sender Email**, and optional **Sender Phone** on your organization's
quote template. These appear as the "Prepared by" block on every quote and give you one consistent,
branded sender identity across your whole team.
:::

## Quotes created through the API, SDKs, or n8n

When a quote is created by an **API key** — whether directly via the API, through one of the
[SDKs](../SDKs/index.md), or from an n8n workflow — there is an important difference: **an API key
has no mailbox of its own.**

- The **"Prepared by" name** for an API-created quote resolves to the **name of the API key**
  (e.g. "Acme Billing Integration"), so it is meaningful and never a generic placeholder such as
  "API Service User".
- The **"Prepared by" email** can only come from your **quote template**, because the API key has
  no email address to fall back to.

:::note There is no per-request sender field on a quote
Unlike TurboSign — where `senderEmail` is a **required field on every signature request body** —
the TurboQuote API has **no `senderEmail` field** on create, update, or send. The sender is always
resolved server-side from your organization's quote template (Quote Settings). This is the one
place to change it.
:::

Because of this, **an API-key call that needs a sender requires a sender email on your quote
template.** If the template has no sender email set, the request is rejected:

```
HTTP 400 — SenderEmailRequired
```

This applies to all four sender-resolving operations:

| Operation | Endpoint |
| :--- | :--- |
| Create a quote | `POST /v1/quotes` |
| Duplicate a quote | `POST /v1/quotes/:id/duplicate` |
| Send a quote | `POST /v1/quotes/:id/send` and `POST /v1/quotes/:id/send-with-deliverable` |
| Handle an expired sent quote | `POST /v1/quotes/:id/handle-expired-sent` |

A companion error, **`SenderNameRequired` (HTTP 400)**, is returned when no sender *name* can be
resolved — set a **Sender Name** on the quote template (or give the API key a name).

The error message tells you exactly how to fix it: set a sender email on your organization's quote
template. Once configured, every subsequent create, duplicate, send, and expiry-handling call
resolves cleanly.

:::info Duplicating attributes the copy to whoever duplicated it
When you duplicate a quote, the copy is attributed to **the caller who ran the duplicate**, not to
the original quote's creator. Duplicating with an API key therefore produces a quote whose
"Prepared by" resolves through that API key (and your template), not through the original author.
:::

:::info This only applies to API-key callers
Quotes you create in the **TurboDocx web app** are never blocked — your own name and email are the
fallback when the template has no sender fields. The requirement above exists only for API keys,
which have no mailbox to fall back to.
:::

## Reading the resolved identity in code

When you fetch a **single quote** — `GET /v1/quotes/:id` — the resolved "Prepared by" identity is
returned as a **`preparedBy`** object alongside the quote:

```json
{
  "data": {
    "result": { "id": "…", "name": "Acme Q3 Proposal", "…": "…" },
    "preparedBy": { "name": "Acme Billing Integration", "email": "billing@acme.com" }
  }
}
```

Each SDK's `getQuote` folds `preparedBy` onto the returned quote for you (see the
[SDK guides](../SDKs/index.md)). Both fields are optional — `email` may be absent for an
API-created quote whose template has no sender email — so render a placeholder for a missing value.

:::caution `preparedBy` is only on the single-quote fetch
`preparedBy` is returned by **`GET /v1/quotes/:id` only**. It is **not** included on
`POST /v1/quotes` (create), `POST /v1/quotes/:id/duplicate`, or `GET /v1/quotes` (list). If you
create a quote and need the resolved identity for display, fetch the quote by ID afterwards.
:::

**Prefer `preparedBy` over the quote's `creator` field for any customer-facing display.** The
`creator` is the raw authorship row for the quote, which for an API-created quote is the synthetic
service account backing the API key — `preparedBy` is the resolved, customer-safe identity.
