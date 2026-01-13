---
title: Simple vs Advanced Variables
sidebar_position: 3
description: Comprehensive comparison between Simple and Advanced Variables in TurboDocx. Learn when to use each approach, migration strategies, and see side-by-side examples.
keywords:
  - simple variables
  - advanced variables
  - variable comparison
  - migration guide
  - turbodocx variables
  - template variables
  - variable types
  - nested variables
  - json variables
---

# Simple vs Advanced Variables

Choose the right variable approach for your document automation needs. This guide compares Simple and Advanced variables side-by-side to help you make informed decisions.

## Quick Comparison

| Feature | Simple Variables | Advanced Variables |
|---------|-----------------|-------------------|
| **Setup Complexity** | ⭐ Easy | ⭐⭐ Moderate |
| **Payload Size** | Large (many variables) | Small (fewer, structured) |
| **Data Structure** | Flat | Nested/hierarchical |
| **Calculations** | ❌ No | ✅ Yes (arithmetic) |
| **Conditionals** | ❌ No | ✅ Yes (show/hide) |
| **Loops** | ❌ No | ✅ Yes (arrays) |
| **Preview Mode** | ✅ Full support | ⚠️ Limited support |
| **Best For** | Simple forms, static content | Complex documents, dynamic logic |

---

## When to Use Each Approach

### Use Simple Variables When:

- ✅ Building basic templates with static content
- ✅ Using UI-based template preview extensively
- ✅ Working with non-technical users
- ✅ Templates have < 20 variables
- ✅ No calculations or conditional logic needed
- ✅ Quick prototyping or proof-of-concept
- ✅ Simple mail merge style documents

### Use Advanced Variables When:

- ✅ Working with complex, structured data
- ✅ Need calculations or dynamic content
- ✅ Templates have > 20 related variables
- ✅ Data comes from APIs or databases
- ✅ Need conditional rendering
- ✅ Working with lists or repeating sections
- ✅ Building invoice, reports, or complex contracts

---

## Side-by-Side Examples

### Example 1: Contact Information

#### Simple Variables Approach

**Template:**
```
Contact: {firstName} {lastName}
Email: {email}
Phone: {phone}
Address: {street}
City: {city}
State: {state}
ZIP: {zip}
```

**Payload (7 variables):**
```json
{
  "variables": [
    {
      "placeholder": "{firstName}",
      "mimeType": "text",
      "value": "Jane"
    },
    {
      "placeholder": "{lastName}",
      "mimeType": "text",
      "value": "Smith"
    },
    {
      "placeholder": "{email}",
      "mimeType": "text",
      "value": "jane.smith@example.com"
    },
    {
      "placeholder": "{phone}",
      "mimeType": "text",
      "value": "+1-555-0123"
    },
    {
      "placeholder": "{street}",
      "mimeType": "text",
      "value": "123 Main St"
    },
    {
      "placeholder": "{city}",
      "mimeType": "text",
      "value": "San Francisco"
    },
    {
      "placeholder": "{state}",
      "mimeType": "text",
      "value": "CA"
    },
    {
      "placeholder": "{zip}",
      "mimeType": "text",
      "value": "94102"
    }
  ]
}
```

**Pros:**
- ✅ Simple to understand
- ✅ Easy to test in UI
- ✅ Works in preview mode

**Cons:**
- ❌ 8 separate variables to manage
- ❌ Large payload
- ❌ No logical grouping

---

#### Advanced Variables Approach

**Template:**
```
Contact: {contact.firstName} {contact.lastName}
Email: {contact.email}
Phone: {contact.phone}
Address: {contact.address.street}
City: {contact.address.city}
State: {contact.address.state}
ZIP: {contact.address.zip}
```

**Payload (1 variable):**
```json
{
  "variables": [
    {
      "placeholder": "{contact}",
      "mimeType": "json",
      "value": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        "phone": "+1-555-0123",
        "address": {
          "street": "123 Main St",
          "city": "San Francisco",
          "state": "CA",
          "zip": "94102"
        }
      }
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Pros:**
- ✅ Single structured object
- ✅ Mirrors your data model
- ✅ Easier to maintain
- ✅ Smaller payload

**Cons:**
- ❌ Can't preview in UI mode
- ❌ Requires JSON structure
- ❌ Slightly more complex setup

**Winner:** 🏆 Advanced Variables (for structured data)

---

### Example 2: Invoice with Line Items

#### Simple Variables Approach

**Not Feasible** ❌

Simple variables cannot handle repeating line items without pre-generating individual variables for each possible line item (e.g., `{item1Name}`, `{item2Name}`, etc.), which is impractical.

**Workaround (limited to fixed number of items):**
```
Template:
Item 1: {item1Name} - ${item1Price}
Item 2: {item2Name} - ${item2Price}
Item 3: {item3Name} - ${item3Price}
Total: {total}
```

**Issues:**
- ❌ Fixed number of items
- ❌ Empty items show blank lines
- ❌ Can't handle variable-length lists
- ❌ Requires many placeholder variables

---

#### Advanced Variables Approach

**Template:**
```
INVOICE

{#lineItems}
{lineItems.name}
Qty: {lineItems.quantity} × ${lineItems.price} = ${lineItems.quantity * lineItems.price}
---
{/}

Subtotal: ${subtotal}
Tax (10%): ${subtotal * 0.10}
TOTAL: ${subtotal + (subtotal * 0.10)}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{lineItems}",
      "mimeType": "json",
      "value": [
        {"name": "Widget A", "quantity": 5, "price": 25.00},
        {"name": "Widget B", "quantity": 3, "price": 40.00},
        {"name": "Widget C", "quantity": 2, "price": 15.00}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{subtotal}",
      "mimeType": "text",
      "value": "275.00",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
INVOICE

Widget A
Qty: 5 × $25.00 = $125.00
---
Widget B
Qty: 3 × $40.00 = $120.00
---
Widget C
Qty: 2 × $15.00 = $30.00
---

Subtotal: $275.00
Tax (10%): $27.50
TOTAL: $302.50
```

**Winner:** 🏆 Advanced Variables (only viable option)

---

### Example 3: Conditional Content

#### Simple Variables Approach

**Template (requires multiple versions):**
```
Status: {status}

(Must create separate templates for each status or show all content)
```

**Issues:**
- ❌ No way to show/hide sections
- ❌ Must pre-process content
- ❌ Requires template versioning
- ❌ All content always visible

---

#### Advanced Variables Approach

**Template (single version handles all cases):**
```
Status: {status}

{#status == "approved"}
✓ Your application has been APPROVED
Next steps: Complete onboarding
{/}

{#status == "pending"}
⏳ Your application is UNDER REVIEW
Estimated time: 2-3 business days
{/}

{#status == "rejected"}
✗ Your application was NOT APPROVED
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{status}",
      "mimeType": "text",
      "value": "approved",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Winner:** 🏆 Advanced Variables (only viable option)

---

### Example 4: Price Calculations

#### Simple Variables Approach

**Template:**
```
Base Price: ${basePrice}
Tax: ${tax}
Shipping: ${shipping}
Total: ${total}
```

**Payload (pre-calculated backend):**
```json
{
  "variables": [
    {"placeholder": "{basePrice}", "mimeType": "text", "value": "100.00"},
    {"placeholder": "{tax}", "mimeType": "text", "value": "10.00"},
    {"placeholder": "{shipping}", "mimeType": "text", "value": "15.00"},
    {"placeholder": "{total}", "mimeType": "text", "value": "125.00"}
  ]
}
```

**Issues:**
- ⚠️ Need to provide value for each data
- ⚠️ Risk of calculation error and wrong data

---

#### Advanced Variables Approach

**Template:**
```
Base Price: ${basePrice}
Tax (10%): ${basePrice * 0.10}
Shipping: ${shipping}
Total: ${basePrice + (basePrice * 0.10) + shipping}
```

**Payload (raw values):**
```json
{
  "variables": [
    {
      "placeholder": "{basePrice}",
      "mimeType": "text",
      "value": 100.00,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{shipping}",
      "mimeType": "text",
      "value": 15.00,
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Winner:** 🏆 Advanced Variables (calculations in template)

---

## Migration Path

### When to Migrate

Consider migrating from Simple to Advanced variables when:

- ✅ Template complexity increasing
- ✅ Managing 20+ variables per template
- ✅ Need calculations or conditional logic
- ✅ Data comes from structured sources (APIs, databases)
- ✅ Multiple related fields (addresses, contact info, etc.)
- ✅ Need repeating sections

### When NOT to Migrate

:::warning Do Not Migrate for Rich Text Content
**Do NOT migrate to advanced variables** if your nested variables need to render **rich text content** (bold, italic, colors, formatting, etc.).

**Why:** Advanced templating features do not support rich text data - all formatting will be lost and content will render as plain text only.

**Solution:** Keep using separate simple variables for each piece of rich text content instead of grouping them into nested structures.

**Example:**
```
❌ Don't use: {user.bio}  // Rich text will lose formatting
✅ Use instead: {userBio}  // Keeps rich text formatting
```
:::

### Migration Strategy

#### Step 1: Identify Candidate Variables

Look for related variables that can be grouped:

```
Before:
{firstName}, {lastName}, {email}, {phone}

After:
{user.firstName}, {user.lastName}, {user.email}, {user.phone}
```

#### Step 2: Update Template

Update placeholders to use dot notation:

```diff
- Hello {firstName} {lastName}!
+ Hello {user.firstName} {user.lastName}!

- Contact: {email}
+ Contact: {user.email}
```

#### Step 3: Restructure Payload

Convert flat variables to nested structure:

**Before:**
```json
{
  "variables": [
    {"placeholder": "{firstName}", "value": "John"},
    {"placeholder": "{lastName}", "value": "Doe"},
    {"placeholder": "{email}", "value": "john@example.com"}
  ]
}
```

**After:**
```json
{
  "variables": [
    {
      "placeholder": "{user}",
      "mimeType": "json",
      "value": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

### Gradual Migration

You can mix both approaches during migration:

**Hybrid Template:**
```
// Keep simple for now
Name: {firstName} {lastName}

// Migrated to advanced
Address: {customer.address.street}
         {customer.address.city}, {customer.address.state}

// Calculate total
Total: ${price + tax}
```

**Hybrid Payload:**
```json
{
  "variables": [
    {"placeholder": "{firstName}", "mimeType": "text", "value": "John"},
    {"placeholder": "{lastName}", "mimeType": "text", "value": "Doe"},
    {
      "placeholder": "{customer}",
      "mimeType": "json",
      "value": {
        "address": {
          "street": "123 Main St",
          "city": "San Francisco",
          "state": "CA"
        }
      },
      "usesAdvancedTemplatingEngine": true
    },
    {"placeholder": "{price}", "mimeType": "text", "value": 100, "usesAdvancedTemplatingEngine": true},
    {"placeholder": "{tax}", "mimeType": "text", "value": 10, "usesAdvancedTemplatingEngine": true}
  ]
}
```

---

## Decision Matrix

Use this matrix to decide which approach to use for your use case:

| Your Scenario | Recommended Approach | Reason |
|---------------|---------------------|--------|
| Simple form letter with < 10 fields | **Simple Variables** | Easier to set up and test |
| Customer profiles with multiple sections | **Advanced Variables** | Natural grouping of related data |
| Invoice with line items | **Advanced Variables** | Requires loops |
| Certificate with name and date only | **Simple Variables** | Overkill for 2 variables |
| Contract with conditional clauses | **Advanced Variables** | Needs conditional logic |
| Report with calculations | **Advanced Variables** | Needs arithmetic |
| Mail merge from spreadsheet | **Simple Variables** | Direct mapping from columns |
| Integration with REST API | **Advanced Variables** | Mirrors JSON response |
| UI-driven template builder | **Simple Variables** | Preview mode compatibility |
| Programmatic document generation | **Advanced Variables** | More efficient |

---

## Common Patterns

### Pattern 1: Customer Data

**Use:** Advanced Variables

```json
{
  "placeholder": "{customer}",
  "mimeType": "json",
  "value": {
    "name": {"first": "Jane", "last": "Smith"},
    "contact": {"email": "...", "phone": "..."},
    "address": {"street": "...", "city": "...", ...}
  }
}
```

### Pattern 2: Simple Certificate

**Use:** Simple Variables

```json
{
  "variables": [
    {"placeholder": "{recipientName}", "value": "John Doe"},
    {"placeholder": "{courseName}", "value": "Advanced JavaScript"},
    {"placeholder": "{completionDate}", "value": "January 15, 2024"}
  ]
}
```

### Pattern 3: Invoice with Items

**Use:** Advanced Variables (required)

```json
{
  "placeholder": "{lineItems}",
  "mimeType": "json",
  "value": [
    {"name": "Item 1", "qty": 5, "price": 25.00},
    {"name": "Item 2", "qty": 3, "price": 40.00}
  ]
}
```

### Pattern 4: Form Letter

**Use:** Simple Variables

```json
{
  "variables": [
    {"placeholder": "{date}", "value": "January 15, 2024"},
    {"placeholder": "{recipientName}", "value": "John Doe"},
    {"placeholder": "{senderName}", "value": "Jane Smith"}
  ]
}
```

---

## Frequently Asked Questions

### Can I mix Simple and Advanced variables in one template?

Yes! You can use both approaches in the same template during migration or based on specific needs.

### Will Simple variables become deprecated?

No. Simple variables are fully supported and will continue to work. Choose based on your needs.

### Which approach is more performant?

Both perform similarly for small templates. Advanced variables are more efficient for large, complex templates with many related variables.

### Can I convert Advanced variables back to Simple?

Yes, you can "flatten" nested structures back to simple variables, though you'll lose the benefits of nesting, calculations, and logic.

### Do Advanced variables cost more?

No. Pricing is based on document generation, not variable complexity.

### Which approach works with the API?

Both work with all TurboDocx APIs. The payload structure is the only difference.

---

## Summary

| Aspect | Simple Variables | Advanced Variables |
|--------|-----------------|-------------------|
| **Complexity** | Low | Medium |
| **Flexibility** | Limited | High |
| **Rich Text Support** | Full | None |
| **Preview Support** | Full | Limited |
| **Calculations** | None | Built-in |
| **Conditionals** | None | Built-in |
| **Loops** | None | Built-in |
| **Payload Size** | Larger | Smaller |
| **Best For** | Simple templates | Complex templates |

**Bottom Line:** Start with Simple variables for basic needs, graduate to Advanced variables as your templates grow in complexity.

---

## Additional Resources

- [Advanced Templating Engine](./Advanced%20Templating%20Engine.md) - Full advanced features guide
- [How to Create a Template](./How%20to%20Create%20a%20Template.md) - Template basics
- [Template Troubleshooting](./Template%20Troubleshooting.md) - Common issues and fixes

---

**Still unsure which to use?** Contact our support team at support@turbodocx.com and we'll help you choose the best approach for your use case.
