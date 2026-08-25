---
title: Conditional (IF/THEN) Fields
sidebar_position: 4.5
description: Build IF/THEN logic into TurboSign documents. A controlling checkbox can show or unlock dependent fields, so signers only see the fields that apply to them. Set it up in the app or through the API and SDKs.
keywords:
  - turbosign conditional fields
  - if then fields
  - conditional signature fields
  - dynamic signature form
  - show field on checkbox
  - unlock field on checkbox
  - conditional fields ui
  - controllingFieldKey
  - fieldKey
  - conditional rule
  - conditional logic esignature
---

# Conditional (IF/THEN) Fields

Conditional fields let a document react to what the signer does. A **controlling checkbox**
decides whether one or more **dependent fields** are shown or unlocked, so signers only fill in
the fields that actually apply to them.

A classic example: a reviewer ticks **"Request changes"**, and only then does a text box appear
asking them to explain what to change. If they leave the box unticked, the text box never gets in
the way.

## Two ways a field can react

Every conditional field starts in one of two states and changes when the condition is met:

| Behavior | Starting state of the dependent field | When the condition is met |
| -------- | ------------------------------------- | ------------------------- |
| **Show** | **Hidden** (left out of the signed PDF entirely) | The field appears        |
| **Unlock** | **Visible but read-only**           | The field becomes fillable |

Use **Show** when the field is irrelevant unless the box is set (a reason box that only matters if
changes are requested). Use **Unlock** when the field should always be visible for context but must
not be edited until the signer opts in (an amount field that stays greyed out until "Override
default amount" is ticked).

:::tip Which section do you need?
- **Setting this up by hand in the TurboSign app?** → [In the app](#in-the-app)
- **Building it through the API or an SDK?** → [With the API and SDKs](#with-the-api-and-sdks)

Both produce the same result — [the app's controls map directly onto the API fields](#how-the-app-maps-to-the-api).
:::

## In the app

Set up conditional fields while you place fields on a document, on the **Assign Fields** step of
the signature flow. This example rebuilds the reviewer scenario: a checkbox that reveals a
"please explain" text box.

### Step 1: Open the field editor

Start a new signature request, upload your document, add your recipient, and continue to the
**Assign Fields** step. The field palette is on the right; the document is in the middle.

![The TurboSign Assign Fields editor with the field palette on the right](/img/turbosign/conditional-fields/01-field-editor.png)

### Step 2: Add the checkbox and the field it controls

From the palette, drag a **Checkbox** field onto the document — this is the controlling box. Then
drag the field it will control (here, a **Text** field) onto the document.

![The field palette with the Checkbox and Text fields highlighted](/img/turbosign/conditional-fields/02-add-fields.png)

### Step 3: Turn on the rule

Click the dependent field (the text box) to open its settings, then open **Only show this field
sometimes** and set the rule:

- **Which checkbox?** — pick the controlling checkbox you just added.
- **Show it when the box is** — choose **Ticked** or **Not ticked**.
- **Until then, this field is** — choose **Hidden** (the field is left out until the condition is
  met) or **Visible, but not fillable** (the field shows but can't be typed in yet).

A plain-English summary underneath confirms the rule, for example *"This field stays hidden until
Checkbox 1 is ticked."*

![The "Only show this field sometimes" rule builder with the checkbox, condition, and starting-state controls highlighted](/img/turbosign/conditional-fields/03-rule-builder.png)

### Step 4: Send

Finish placing any other fields and send the document. The signer sees the dependent field appear
(or unlock) only when they set the controlling checkbox the way your rule specifies.

:::note Keep the checkbox and its dependent fields with the same signer
The controlling checkbox and the fields it controls should belong to the **same recipient**, so the
person ticking the box is the same person who fills in the revealed field.
:::

## With the API and SDKs

Conditional logic is expressed entirely through the optional `metadata` object on a field, so it
works anywhere fields are accepted — the single-step
[Prepare for Signing and Prepare for Review](/docs/TurboSign/API%20Signatures) routes and the
[Bulk API](/docs/TurboSign/API%20Bulk%20Signatures).

### How it works

A conditional relationship always has two halves:

1. **A controlling checkbox** — a field of `type: "checkbox"` that carries a stable identifier,
   `metadata.fieldKey`.
2. **One or more dependent fields** — each carries a `metadata.conditional` rule whose
   `controllingFieldKey` matches the checkbox's `fieldKey`. The rule names the condition
   (`operator`) and what happens when it is met (`action`).

One checkbox can control any number of dependent fields — give them all the same
`controllingFieldKey`.

### The metadata contract

```jsonc
metadata: {
  // On a CONTROLLING checkbox (type: "checkbox"):
  fieldKey: "request_changes",

  // On a DEPENDENT field:
  conditional: {
    controllingFieldKey: "request_changes", // = the checkbox's fieldKey
    operator: "is_checked",                 // "is_checked" | "is_not_checked"
    action: "show"                          // "show" | "unlock"
  }
}
```

| Property                            | Values                          | Meaning                                                                 |
| ----------------------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `fieldKey`                          | any non-empty string            | Stable id on the controlling checkbox. Dependent fields point at this.  |
| `conditional.controllingFieldKey`   | a checkbox's `fieldKey`         | Which checkbox this field depends on. Required and must be non-empty.   |
| `conditional.operator`              | `is_checked`, `is_not_checked`  | The condition evaluated against that checkbox.                          |
| `conditional.action`                | `show`, `unlock`                | What happens to this field when the condition is met.                   |

The `action` values map onto the two behaviors above: `show` starts the field hidden, `unlock`
starts it visible but read-only.

### Worked example: a checkbox reveals a text field

The reviewer sees a **"Request changes"** checkbox. Only if they check it does the **"Please
explain"** text field appear.

```javascript
const fields = JSON.stringify([
  // 1) Controlling checkbox — gets a stable fieldKey
  {
    recipientEmail: "reviewer@acme.com",
    type: "checkbox",
    page: 1,
    x: 100,
    y: 400,
    width: 20,
    height: 20,
    required: false,
    metadata: {
      fieldKey: "request_changes",
    },
  },
  // 2) Dependent text field — HIDDEN until "request_changes" is checked
  {
    recipientEmail: "reviewer@acme.com",
    type: "text",
    page: 1,
    x: 130,
    y: 400,
    width: 300,
    height: 60,
    required: false,
    defaultValue: "",
    metadata: {
      conditional: {
        controllingFieldKey: "request_changes",
        operator: "is_checked",
        action: "show",
      },
    },
  },
]);
formData.append("fields", fields);
```

When the reviewer checks the box, the text field appears. Uncheck it and the field disappears
again.

### Worked example: a checkbox unlocks a locked field

Here the amount field is always visible so the signer can see the default, but it stays read-only
until they check **"Override default amount"**.

```javascript
const fields = JSON.stringify([
  // Controlling checkbox
  {
    recipientEmail: "signer@acme.com",
    type: "checkbox",
    page: 1,
    x: 100,
    y: 500,
    width: 20,
    height: 20,
    required: false,
    metadata: {
      fieldKey: "override_amount",
    },
  },
  // Dependent amount field — VISIBLE but LOCKED until the box is checked
  {
    recipientEmail: "signer@acme.com",
    type: "text",
    page: 1,
    x: 130,
    y: 500,
    width: 150,
    height: 30,
    required: false,
    defaultValue: "1000.00",
    metadata: {
      conditional: {
        controllingFieldKey: "override_amount",
        operator: "is_checked",
        action: "unlock",
      },
    },
  },
]);
formData.append("fields", fields);
```

### Reveal a field when a box is cleared

Set `operator: "is_not_checked"` to invert the logic. For example, an **"I do not consent"**
checkbox can reveal a text field asking the signer to explain, only when consent is *not* given:

```javascript
{
  metadata: {
    conditional: {
      controllingFieldKey: "consent",
      operator: "is_not_checked",
      action: "show",
    },
  },
}
```

### Validation and fail-open behavior

The API **validates the shape** of every `conditional` rule before creating the document. A
malformed rule is rejected with HTTP **400** and the `type` **`InvalidConditionalRule`**. A rule is
malformed when:

- `operator` is anything other than `"is_checked"` or `"is_not_checked"`, or
- `action` is anything other than `"show"` or `"unlock"`, or
- `controllingFieldKey` is missing or empty.

The response body names the offending field and the exact problem:

```json
{
  "message": "Field 2: metadata.conditional.operator must be one of: is_checked, is_not_checked",
  "type": "InvalidConditionalRule"
}
```

:::warning A well-formed rule with a wrong key fails open
The API does **not** verify that a rule's `controllingFieldKey` actually matches a checkbox in
the request. If it doesn't match any checkbox's `fieldKey`, the rule **fails open**: the
dependent field stays fully visible and editable, exactly as if it had no rule, and **no error is
returned**. A typo in `controllingFieldKey` therefore silently disables the condition instead of
blocking the send. Always confirm each dependent field's `controllingFieldKey` exactly matches an
existing checkbox's `fieldKey`.
:::

### Tips

- The controlling field must be a **checkbox** (`type: "checkbox"`). Only checkboxes can hold a
  controlling `fieldKey`.
- Keep `fieldKey` values short, stable, and unique within a document (`request_changes`,
  `override_amount`, `consent`).
- A dependent field that is `required: true` but hidden via `action: "show"` is only enforced
  once it becomes visible — don't rely on a hidden required field to block completion.
- The controlling checkbox and its dependent fields should generally belong to the **same
  recipient** so the same signer both toggles the box and fills the revealed field.

## How the app maps to the API

The app's rule builder and the API `metadata.conditional` object are the same thing in two forms:

| In the app                          | In the API                                              |
| ----------------------------------- | ------------------------------------------------------- |
| **Which checkbox?**                 | `controllingFieldKey` (the checkbox's `fieldKey`)       |
| **Show it when the box is → Ticked** | `operator: "is_checked"`                               |
| **Show it when the box is → Not ticked** | `operator: "is_not_checked"`                       |
| **Until then, this field is → Hidden** | `action: "show"`                                     |
| **Until then, this field is → Visible, but not fillable** | `action: "unlock"`                |

## Related

- **[TurboSign API Integration](/docs/TurboSign/API%20Signatures#conditional-if-then-fields)** — the full field reference, including the `metadata` object.
- **[Bulk API Integration](/docs/TurboSign/API%20Bulk%20Signatures)** — conditional metadata works in bulk batches too.
