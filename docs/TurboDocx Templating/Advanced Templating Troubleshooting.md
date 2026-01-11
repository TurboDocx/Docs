---
title: Advanced Templating Troubleshooting
sidebar_position: 4
description: Comprehensive troubleshooting guide for TurboDocx Advanced Templating Engine. Solutions for common errors, debugging strategies, and best practices.
keywords:
  - troubleshooting
  - advanced templating errors
  - debugging
  - template issues
  - variable errors
  - expression errors
  - nested variables issues
  - loop errors
  - conditional errors
  - turbodocx debugging
---

# Advanced Templating Troubleshooting

Encountering issues with Advanced Templating? This comprehensive guide covers common problems, their causes, and solutions.

## Quick Diagnostic Checklist

Before diving into specific issues, run through this checklist:

- [ ] Is `mimeType` correct (`json` or `text` with `usesAdvancedTemplatingEngine: true`)?
- [ ] Is the JSON structure valid? (Test with [JSONLint](https://jsonlint.com/))
- [ ] Do nested paths exist in the data? (`user.email` requires `user` object with `email` property)

---

## Common Issues

### 1. Variable Remains as undefined in Output

#### Symptoms
```
Template: Hello {user.firstName}!
Output:   Hello undefined!
```

#### Causes & Solutions

**Cause 1: Variable not in payload**
```json
// ❌ Missing {user} variable
{
  "variables": []
}
```

**Solution:**
```json
// ✅ Add the variable
{
  "variables": [
    {
      "placeholder": "{user}",
      "mimeType": "json",
      "text": {"firstName": "John"}
    }
  ]
}
```

**Cause 2: Placeholder mismatch**
```
Template: {user.firstName}
Payload placeholder: "{userData}"  // ❌ Wrong name
```

**Solution:**
```
Template: {user.firstName}
Payload placeholder: "{user}"  // ✅ Matches
```

**Cause 3: Nested path doesn't exist**
```json
// Template: {user.profile.name}
{
  "text": {
    "user": {
      // ❌ Missing 'profile' property
      "name": "John"
    }
  }
}
```

**Solution:**
```json
{
  "text": {
    "user": {
      "profile": {  // ✅ Add missing path
        "name": "John"
      }
    }
  }
}
```

---

### 2. Expression Not Evaluated

#### Symptoms
```
Template: Total: ${price + tax}
Output:   Total: ${price + tax}
```

#### Causes & Solutions

**Cause 1: Missing `usesAdvancedTemplatingEngine` and `mimeType: "text"` flag or `mimeType: json` flag**
```json
// ❌ Flag not set
{
  "placeholder": "{price}",
  "mimeType": "text",
  "text": 100
}
```

**Solution:**
```json
// ✅ Add the flag
{
  "placeholder": "{price}",
  "mimeType": "text",
  "text": "100",
  "usesAdvancedTemplatingEngine": true
}
```

**Cause 2: One or more variables in expression missing**
```json
// Template: {price + tax}
// ❌ Only provided {price}
{
  "variables": [
    {"placeholder": "{price}", "text": "100", "usesAdvancedTemplatingEngine": true}
  ]
}
```

**Solution:**
```json
// ✅ Provide all variables
{
  "variables": [
    {"placeholder": "{price}", "text": "100", "usesAdvancedTemplatingEngine": true},
    {"placeholder": "{tax}", "text": "10", "usesAdvancedTemplatingEngine": true}
  ]
}
```

---

### 3. Loop Not Rendering / Empty Output

#### Symptoms
```
Template: {#items}{name}{/}
Output:   (nothing)
```

#### Causes & Solutions

**Cause 1: Wrong MIME type**
```json
// ❌ Using text instead of json
{
  "placeholder": "{items}",
  "mimeType": "text",
  "text": "[{\"name\":\"Item 1\"}]"
}
```

**Solution:**
```json
// ✅ Use json MIME type
{
  "placeholder": "{items}",
  "mimeType": "json",
  "text": [
    {"name": "Item 1"}
  ]
}
```

**Cause 2: Empty array**
```json
{
  "placeholder": "{items}",
  "mimeType": "json",
  "text": []  // ❌ No items to loop over
}
```

**Solution:** Check for empty arrays and provide feedback
```
Template:
{#items.length > 0}
{#items}{name}{/}
{/}

{#items.length == 0}
No items available.
{/}
```

**Cause 3: Array is nested incorrectly**
```json
// ❌ Array is too deeply nested
{
  "placeholder": "{data}",
  "mimeType": "json",
  "text": {
    "items": [
      {"name": "Item 1"}
    ]
  }
}
```

```
// Template should be:
{#data.items}{name}{/}  // Not {#items}
```

---

### 4. Conditional Block Not Showing

#### Symptoms
```
Template: {#isPremium}Premium User{/}
Output:   (nothing)
```

#### Causes & Solutions

**Cause 1: Value is string "false" instead of boolean**
```json
// ❌ String "false" is truthy!
{
  "placeholder": "{isPremium}",
  "mimeType": "text",
  "text": "false"
}
```

**Solution:** Use actual boolean or check string value
```json
// Option 1: Use boolean value (requires preprocessing)
{
  "placeholder": "{isPremium}",
  "mimeType": "json",
  "text": false
}

// Option 2: Compare string explicitly
```

```
Template: {#isPremium == "true"}Premium User{/}
```

**Cause 2: Comparison operator issue**
```
// ❌ Using = instead of ==
{#status = "active"}Content{/}
```

**Solution:**
```
// ✅ Use == for comparison
{#status == "active"}Content{/}
```

**Cause 3: Variable is undefined**
```json
// ❌ isPremium not provided
{
  "variables": []
}
```

**Solution:** Always provide conditional variables
```json
{
  "variables": [
    {
      "placeholder": "{isPremium}",
      "mimeType": "text",
      "text": "true",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

---

### 5. Nested Variable Access Not Working

#### Symptoms
```
Template: {customer.contact.email}
Output:   {customer.contact.email}
```

#### Causes & Solutions

**Cause 1: JSON string instead of object**
```json
// ❌ Stringified JSON
{
  "placeholder": "{customer}",
  "mimeType": "json",
  "text": "{\"contact\":{\"email\":\"...\"}}"  // String, not object
}
```

**Solution:**
```json
// ✅ Actual JSON object
{
  "placeholder": "{customer}",
  "mimeType": "json",
  "text": {"contact": {"email": "john@example.com"}}  // Object
}
```

**Cause 2: Path doesn't match structure**
```
Template: {customer.contact.email}

// ❌ Wrong structure
{
  "text": {
    "contact_email": "john@example.com"  // Flat, not nested
  }
}
```

**Solution:**
```json
// ✅ Match template structure
{
  "text": {
    "contact": {
      "email": "john@example.com"
    }
  }
}
```

---

### 6. Arithmetic Calculation Wrong or Not Working

#### Symptoms
```
Template: Total: ${price + tax}
Output:   Total: NaN
```
or
```
Output: Total: 10020 (concatenation instead of addition)
```

#### Causes & Solutions

**Cause 1: Values are strings and concatenating**
```json
// ❌ String concatenation: "100" + "20" = "10020"
{
  "placeholder": "{price}",
  "mimeType": "text",
  "text": "100"  // String
}
```

```json
// ✅ Will be converted to numbers
{
  "placeholder": "{price}",
  "mimeType": "text",
  "text": 100, 
  "usesAdvancedTemplatingEngine": true
}
```

**Cause 2: One variable is undefined**
```
// Template: {price + tax}
// Only {price} provided, {tax} is undefined
// undefined + 100 = NaN
```

**Solution:** Provide all variables in expression
```json
{
  "variables": [
    {"placeholder": "{price}", "text": 100, "usesAdvancedTemplatingEngine": true},
    {"placeholder": "{tax}", "text": 20, "usesAdvancedTemplatingEngine": true}
  ]
}
```

**Cause 3: Non-numeric value**
```json
{
  "placeholder": "{price}",
  "text": "N/A"  // ❌ Can't convert to number
}
```

**Solution:** Use conditional to handle non-numeric values
```
{#price != "N/A"}
Total: ${price + tax}
{/}

{#price == "N/A"}
Price not available
{/}
```

---

### 7. Array Length or Built-in Properties Not Working

#### Symptoms
```
Template: Found {items.length} items
Output:   Found {items.length} items
```

#### Causes & Solutions

**Cause 1: Array variable not provided**
```json
// ❌ items not in payload
{
  "variables": []
}
```

**Solution:**
```json
// ✅ Provide array variable
{
  "variables": [
    {
      "placeholder": "{items}",
      "mimeType": "json",
      "text": [
        {"name": "Item 1"},
        {"name": "Item 2"}
      ],
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Cause 2: Not an array**
```json
// ❌ Object, not array
{
  "placeholder": "{items}",
  "mimeType": "json",
  "text": {"count": 2}  // Object has no .length
}
```

---

## Additional Resources

- [Advanced Templating Engine](./Advanced%20Templating%20Engine.md) - Full feature guide
- [Simple vs Advanced Variables](./Simple%20vs%20Advanced%20Variables.md) - Comparison guide
- [Template Troubleshooting](./Template%20Troubleshooting.md) - General template issues
- [API Templates](./API%20Templates.md) - API integration guide

---

**Last Updated:** January 2026

:::tip Still Stuck?
Our support team is here to help! Don't hesitate to reach out at support@turbodocx.com with your specific issue.
:::
