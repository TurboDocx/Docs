---
title: Renaming a Quote
sidebar_position: 7
description: Rename a draft quote from the quotes list or the quote page, and understand how a quote's name reaches the signer when you send it for signature.
keywords:
  - turboquote
  - rename quote
  - rename a quote
  - quote name
  - duplicate quote
  - copy of quote
  - turbosign
  - signature document name
  - TurboDocx
---

# Renaming a Quote

A quote's name is not just a label in your quotes list. When you send a quote for signature, that
name is **copied onto the signature document** — it is what your signer sees in the request email
and on the signed PDF. This guide shows you where to rename a quote, and when you can still do it.

## What You'll Accomplish

By the end of this guide, you will know how to:

- ✏️ **Rename a quote in place** from the quote page
- 📋 **Rename a quote from the quotes list**, without opening it
- 🧾 **Clean up a duplicated quote's name** before it reaches a client
- ⏱️ **Recognise when it is too late** to rename

:::caution Rename before you send
Renaming is only available while a quote is a **draft**. Once you send a quote, its name is locked
— the signature request has already gone out under that name. If you spot a wrong name after
sending, void the request and send a new one.
:::

<br/>

## Why the name matters

Two ordinary actions produce a name you probably don't want a client to read:

| How you got here | The name you end up with |
|---|---|
| You **duplicated** a quote to reuse its line items | `Copy of Acme Q3 Proposal` |
| You duplicated the copy again | `Copy of Copy of Acme Q3 Proposal` |

If you send either of those without renaming, `Copy of Acme Q3 Proposal` is the title on the
signature request your client receives. Renaming takes a couple of seconds and happens before the
send, so it never reaches them.

:::tip Renewals don't do this
Renewing an expired quote is different from duplicating one. A renewal is the **same deal
re-issued**, so it keeps the original quote's name — no `Copy of` prefix, no matter how many times
you renew it. Only an explicit duplicate adds the prefix.
:::

<br/>

## Option 1: Rename from the quote page

Use this when you already have the quote open — for example, right after duplicating it.

**Instruction:**

- Open the quote you want to rename.
- Click the **quote name** in the page header. It turns into an editable text field.
- Type the new name.
- Press **Enter**, or click anywhere outside the field, to save.

The name saves immediately — there is no separate Save button. If the save fails, the field stays
open with your text still in it so you can try again without retyping.

<br/>

## Option 2: Rename from the quotes list

Use this when you want to fix a name without opening the quote.

**Instruction:**

- Go to your **quotes list**.
- Find the quote you want to rename.
- Click the **⋮ (three dots)** action menu on that quote's card or row.
- Choose **Rename**.
- Type the new name in the dialog and click **Rename**.

<br/>

## Naming rules

A few rules apply wherever you rename:

| Rule | What happens |
|---|---|
| Blank names are not allowed | A name of only spaces is rejected — a quote must have a real name |
| Extra spaces are removed | `  Acme Q3  ` is saved as `Acme Q3` |
| Spaces inside the name are kept | `Acme  Corp` keeps both spaces — only the ends are trimmed |
| Maximum length is 255 characters | Longer names are rejected; the check runs after trimming |

<br/>

## When renaming is unavailable

The **Rename** option is visible but greyed out once a quote leaves draft status — after it has
been sent, accepted, declined, or voided. This is deliberate: the signature request has already
been delivered under the current name, and quietly changing the title of a document someone has
already received would be misleading.

If you need a different name on a quote you have already sent:

1. **Void** the existing signature request.
2. **Duplicate** the quote.
3. **Rename** the new draft.
4. **Send** the renamed draft.

<br/>

## Summary

Here's what to remember:

1. A quote's name becomes the **signature document's name** when you send it
2. Rename from the **quote page header** or the **⋮ menu** in the quotes list
3. Duplicates arrive as `Copy of …` — rename them before sending
4. Renewals keep the original name and never accumulate `Copy of` prefixes
5. Renaming is **draft-only**; after sending, void and re-send instead

Your quote now carries a name you're happy for a client to read.
