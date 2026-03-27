---
title: Advanced Templating
sidebar_position: 4
draft: true
description: Learn how to use advanced templating features like loops, conditionals, and expressions to generate dynamic documents with structured JSON data via the API.
keywords:
  - advanced templating
  - loops
  - conditionals
  - expressions
  - json variables
  - dynamic documents
  - template engine
  - api variables
  - dot notation
  - template syntax
---

# Advanced Templating

Advanced templating lets you create dynamic documents with loops, conditionals, dot notation, and expressions. Instead of filling in variables one at a time through the UI, you provide structured JSON data via the API, and the template engine renders the final document for you.

## When to Use Advanced Templating

Use advanced templating when your document needs:

- **Repeating sections** — such as line items in an invoice, rows in a table, or a list of team members
- **Conditional content** — sections that should only appear when certain conditions are met
- **Nested data** — accessing properties within structured objects using dot notation
- **Computed values** — simple expressions evaluated at generation time

## Template Syntax

### Variables

Standard variables use curly braces:

```
{companyName}
```

With dot notation, you can access nested properties:

```
{client.name}
{client.address.city}
```

### Loops

Use `{#arrayName}` to start a loop and `{/arrayName}` to end it. Inside the loop, you can reference properties of each item directly:

```
{#items}
{name} - {price}
{/items}
```

For example, given this data:

```json
{
  "items": [
    { "name": "Widget A", "price": "$10.00" },
    { "name": "Widget B", "price": "$25.00" }
  ]
}
```

The output would be:

```
Widget A - $10.00
Widget B - $25.00
```

### Conditionals

Use `{#condition}` and `{/condition}` to show content only when a value is truthy:

```
{#showDiscount}
Discount applied: {discountAmount}
{/showDiscount}
```

To show content when a value is falsy, use `{^condition}`:

```
{^showDiscount}
No discount available.
{/showDiscount}
```

### Expressions

You can use simple expressions within your templates for computed values:

```
{totalItems + 1}
{price * quantity}
```

## Populating Advanced Variables via the API

Advanced variables cannot be filled in through the TurboDocx UI. They are designed to be populated programmatically using the API. When you view an advanced variable in the UI, it will appear as read-only with an information banner explaining that it must be set via the API.

### The `value` and `text` Fields

When sending variable data to the API, you can use either `value` or `text` to set the variable content. Both fields are interchangeable — the API accepts either one:

```json
{
  "placeholder": "items",
  "value": "[{\"name\": \"Widget A\", \"price\": \"$10.00\"}]"
}
```

is equivalent to:

```json
{
  "placeholder": "items",
  "text": "[{\"name\": \"Widget A\", \"price\": \"$10.00\"}]"
}
```

For advanced variables, the value should be a JSON string representing the structured data that the template engine will use to render the document.

### Example: Generating a Document with Advanced Variables

Here is a complete example of generating a deliverable with advanced template variables. Suppose your template contains:

```
Invoice for {client.name}

Items:
{#lineItems}
  {description} — {quantity} x {unitPrice} = {total}
{/lineItems}

{#notes}
Notes: {notes}
{/notes}
```

You would call the generation API with the following payload:

```json
{
  "variables": [
    {
      "placeholder": "client",
      "value": "{\"name\": \"Acme Corp\"}"
    },
    {
      "placeholder": "lineItems",
      "value": "[{\"description\": \"Consulting\", \"quantity\": \"10\", \"unitPrice\": \"$150\", \"total\": \"$1,500\"}, {\"description\": \"Development\", \"quantity\": \"20\", \"unitPrice\": \"$200\", \"total\": \"$4,000\"}]"
    },
    {
      "placeholder": "notes",
      "value": "Payment due within 30 days."
    }
  ]
}
```

The generated document would contain:

```
Invoice for Acme Corp

Items:
  Consulting — 10 x $150 = $1,500
  Development — 20 x $200 = $4,000

Notes: Payment due within 30 days.
```

### Example: Table with Loops

Advanced templating works well with tables in Word documents. Place the loop tags in a table row, and the engine will repeat that row for each item in the array:

| Item | Qty | Price |
|------|-----|-------|
| `{#products}{name}` | `{qty}` | `{price}{/products}` |

API payload:

```json
{
  "variables": [
    {
      "placeholder": "products",
      "value": "[{\"name\": \"Laptop\", \"qty\": \"5\", \"price\": \"$999\"}, {\"name\": \"Monitor\", \"qty\": \"10\", \"price\": \"$349\"}]"
    }
  ]
}
```

## Limitations

- **UI filling is not supported.** Advanced variables are read-only in the TurboDocx interface. You must use the API to populate them.
- **AI generation is not available** for advanced variables.
- **Variable stacks and subvariables** cannot be combined with advanced templating on the same variable.
- Variables nested inside an advanced template block (marked with `nestedInAdvancedTemplatingEngine`) are also read-only in the UI.

## Summary

| Feature | Syntax | Example |
|---------|--------|---------|
| Variable | `{name}` | `{companyName}` |
| Dot notation | `{object.property}` | `{client.address.city}` |
| Loop | `{#array}...{/array}` | `{#items}{name}{/items}` |
| Conditional (truthy) | `{#condition}...{/condition}` | `{#showNotes}...{/showNotes}` |
| Conditional (falsy) | `{^condition}...{/condition}` | `{^hasDiscount}...{/hasDiscount}` |
| Expression | `{expr}` | `{price * qty}` |
