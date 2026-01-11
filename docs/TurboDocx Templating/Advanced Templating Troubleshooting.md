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

- [ ] Is `usesAdvancedTemplatingEngine: true` set on the variable?
- [ ] Is `mimeType` correct (`json` for objects/arrays, `text` for simple values)?
- [ ] Is the JSON structure valid? (Test with [JSONLint](https://jsonlint.com/))
- [ ] Do nested paths exist in the data? (`user.email` requires `user` object with `email` property)
- [ ] Are you in Preview Mode? (Advanced features don't work in preview)

---

## Common Issues

### 1. Variable Remains as `{placeholder}` in Output

#### Symptoms
```
Template: Hello {user.firstName}!
Output:   Hello {user.firstName}!
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

**Cause 3: Case sensitivity issue**
```json
// Template uses {User.firstName}
// Payload uses {user}  // ❌ Different case
```

**Solution:** Match the case exactly
```json
{
  "placeholder": "{User}",  // ✅ Match template case
  "mimeType": "json",
  "text": {"firstName": "John"}
}
```

**Cause 4: Nested path doesn't exist**
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

**Cause 1: Missing `usesAdvancedTemplatingEngine` flag**
```json
// ❌ Flag not set
{
  "placeholder": "{price}",
  "mimeType": "text",
  "text": "100"
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

**Cause 3: Preview mode enabled**
```javascript
// ❌ Preview mode blocks expressions
const result = await generateDocument({
  templateId: "...",
  variables: [...],
  isPreview: true  // ❌ Remove this
});
```

**Solution:**
```javascript
// ✅ Remove isPreview for production
const result = await generateDocument({
  templateId: "...",
  variables: [...]
  // isPreview not set (defaults to false)
});
```

---

### 3. Loop Not Rendering / Empty Output

#### Symptoms
```
Template: {#items}{name}{/items}
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
{#items}{name}{/items}
{/items.length > 0}

{#items.length == 0}
No items available.
{/items.length == 0}
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
{#data.items}{name}{/data.items}  // Not {#items}
```

---

### 4. Conditional Block Not Showing

#### Symptoms
```
Template: {#isPremium}Premium User{/isPremium}
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
Template: {#isPremium == "true"}Premium User{/isPremium == "true"}
```

**Cause 2: Comparison operator issue**
```
// ❌ Using = instead of ==
{#status = "active"}Content{/status = "active"}
```

**Solution:**
```
// ✅ Use == for comparison
{#status == "active"}Content{/status == "active"}
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

**Cause 1: Using `value` instead of `text` for JSON**
```json
// ❌ Wrong field name
{
  "placeholder": "{customer}",
  "mimeType": "json",
  "value": {"contact": {"email": "..."}}  // Wrong field
}
```

**Solution:**
```json
// ✅ Use 'text' for json mimeType
{
  "placeholder": "{customer}",
  "mimeType": "json",
  "text": {"contact": {"email": "john@example.com"}}
}
```

**Cause 2: JSON string instead of object**
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

**Cause 3: Path doesn't match structure**
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

**Solution:** Values are automatically converted, but ensure they're valid numbers
```json
// ✅ Will be converted to numbers
{
  "placeholder": "{price}",
  "mimeType": "text",
  "text": "100",  // String of number works
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
    {"placeholder": "{price}", "text": "100", "usesAdvancedTemplatingEngine": true},
    {"placeholder": "{tax}", "text": "20", "usesAdvancedTemplatingEngine": true}
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
{/price != "N/A"}

{#price == "N/A"}
Price not available
{/price == "N/A"}
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

### 8. Preview Mode Errors

#### Symptoms
```
Error: "{expression} is not supported in the TurboDocx UI"
```

#### Cause
Using advanced features in preview mode

#### Solutions

**Solution 1: Remove preview mode**
```javascript
// ❌ Preview mode enabled
const result = await generateDocument({
  templateId: "...",
  variables: [...],
  isPreview: true
});

// ✅ Production mode
const result = await generateDocument({
  templateId: "...",
  variables: [...]
});
```

**Solution 2: Use simple variables for preview**
```
If you need preview functionality, switch to simple variables
for that template or create a preview-specific version
```

---

## Debugging Strategies

### Strategy 1: Simplify and Test

Start with the simplest possible case and build up:

```json
// Step 1: Test basic variable
{
  "variables": [
    {"placeholder": "{test}", "mimeType": "text", "text": "Works!"}
  ]
}

// Step 2: Add nesting
{
  "variables": [
    {
      "placeholder": "{data}",
      "mimeType": "json",
      "text": {"test": "Works!"}
    }
  ]
}

// Step 3: Add your actual structure
{
  "variables": [
    {
      "placeholder": "{data}",
      "mimeType": "json",
      "text": {
        "customer": {
          "name": "John"
        }
      }
    }
  ]
}
```

### Strategy 2: Validate JSON

Use online validators:
- [JSONLint](https://jsonlint.com/)
- [JSON Formatter](https://jsonformatter.org/)

```javascript
// Programmatic validation
try {
  const validated = JSON.parse(JSON.stringify(payload));
  console.log('✅ Valid JSON');
} catch (error) {
  console.error('❌ Invalid JSON:', error.message);
}
```

### Strategy 3: Log Everything

```javascript
// Before sending
console.log('Template ID:', templateId);
console.log('Variables:', JSON.stringify(variables, null, 2));
console.log('Variable count:', variables.length);

// Check each variable
variables.forEach((v, i) => {
  console.log(`Variable ${i}:`, {
    placeholder: v.placeholder,
    mimeType: v.mimeType,
    hasText: !!v.text,
    usesAdvanced: v.usesAdvancedTemplatingEngine
  });
});
```

### Strategy 4: Test Expressions Individually

```
// Start simple
Template: {price}
Expected: 100

// Add operation
Template: {price * 2}
Expected: 200

// Add second variable
Template: {price + tax}
Expected: 120

// Add complexity
Template: {price + (tax * 0.10)}
Expected: 110
```

### Strategy 5: Check Data Types

```javascript
// Verify data types before sending
const price = payload.variables.find(v => v.placeholder === '{price}');
console.log('Price value:', price.text);
console.log('Price type:', typeof price.text);
console.log('Is number string:', /^\d+(\.\d+)?$/.test(price.text));
```

### Strategy 6: Use Conditionals for Debugging

```
Template:
Price exists: {#price}YES{/price}{#!price}NO{/!price}
Tax exists: {#tax}YES{/tax}{#!tax}NO{/!tax}
Price value: {price}
Tax value: {tax}
Calculation: {price + tax}
```

---

## Error Messages Explained

### "Variable not found"
**Meaning:** Template references a variable not in payload
**Fix:** Add variable to payload or remove from template

### "Invalid JSON structure"
**Meaning:** JSON in `text` field is malformed
**Fix:** Validate JSON with linter

### "Expression evaluation failed"
**Meaning:** Syntax error in arithmetic expression
**Fix:** Check operators, parentheses, variable names

### "Circular reference detected"
**Meaning:** Object references itself
**Fix:** Remove circular references from data

### "Type mismatch"
**Meaning:** Wrong mimeType for data (e.g., text for array)
**Fix:** Use json mimeType for objects/arrays

### "Preview mode not supported"
**Meaning:** Using advanced features with `isPreview: true`
**Fix:** Remove isPreview or use simple variables

---

## Performance Issues

### Issue: Slow Document Generation

**Symptoms:**
- Generation takes > 10 seconds
- Timeout errors

**Causes & Solutions:**

**Cause 1: Very large loops**
```json
// ❌ 5000 items in loop
{
  "text": [/* 5000 items */]
}
```

**Solution:** Limit loop size or paginate
```json
// ✅ Reasonable size
{
  "text": [/* 100-500 items */]
}
```

**Cause 2: Deeply nested loops (3+ levels)**
```
{#level1}
  {#level2}
    {#level3}
      {#level4}
      {/level4}
    {/level3}
  {/level2}
{/level1}
```

**Solution:** Flatten structure or pre-process data

**Cause 3: Complex arithmetic in loops**
```
{#items}
{(price * quantity * (1 + taxRate)) + ((price * quantity * (1 + taxRate)) * discountRate)}
{/items}
```

**Solution:** Pre-calculate complex values

---

## Best Practices for Error Prevention

### 1. Validate Before Sending

```javascript
function validatePayload(payload) {
  // Check required fields
  if (!payload.templateId) {
    throw new Error('templateId is required');
  }

  if (!Array.isArray(payload.variables)) {
    throw new Error('variables must be an array');
  }

  // Validate each variable
  payload.variables.forEach((v, i) => {
    if (!v.placeholder) {
      throw new Error(`Variable ${i} missing placeholder`);
    }

    if (!v.mimeType) {
      throw new Error(`Variable ${i} missing mimeType`);
    }

    if (v.mimeType === 'json' && typeof v.text !== 'object') {
      throw new Error(`Variable ${i} mimeType is json but text is not an object`);
    }  });

  return true;
}
```

### 2. Type-Safe Payloads (TypeScript)

```typescript
interface Variable {
  placeholder: string;
  mimeType: 'text' | 'html' | 'json' | 'image';
  text: string | object | any[];
  value?: any;
  usesAdvancedTemplatingEngine?: boolean;
}

interface Payload {
  templateId: string;
  variables: Variable[];
}

const payload: Payload = {
  templateId: '...',
  variables: [
    {
      placeholder: '{customer}',
      mimeType: 'json',
      text: {
        name: 'John'
      }
      usesAdvancedTemplatingEngine: true
    }
  ]
};
```

### 3. Comprehensive Testing

```javascript
describe('Advanced Templating', () => {
  test('nested property access', async () => {
    const result = await generateDocument({
      templateId: 'test-template',
      variables: [
        {
          placeholder: '{user}',
          mimeType: 'json',
          text: {name: {first: 'John'}},
          usesAdvancedTemplatingEngine: true
        }
      ]
    });

    expect(result).toContain('John');
  });

  test('arithmetic expression', async () => {
    const result = await generateDocument({
      templateId: 'test-template',
      variables: [
        {placeholder: '{price}', text: '100', usesAdvancedTemplatingEngine: true},
        {placeholder: '{tax}', text: '10', usesAdvancedTemplatingEngine: true}
      ]
    });

    expect(result).toContain('110');
  });

  // More tests...
});
```

### 4. Error Handling

```javascript
async function generateDocumentSafely(payload) {
  try {
    // Validate first
    validatePayload(payload);

    // Generate
    const result = await generateDocument(payload);

    return {success: true, data: result};
  } catch (error) {
    // Log for debugging
    console.error('Generation failed:', {
      error: error.message,
      payload: JSON.stringify(payload, null, 2)
    });

    // Return user-friendly error
    return {
      success: false,
      error: 'Failed to generate document. Please check your template and data.'
    };
  }
}
```

### 5. Documentation

Document your templates and expected payload structure:

```javascript
/**
 * Customer Contract Template
 *
 * Required Variables:
 * - {customer}: JSON object with structure:
 *   {
 *     firstName: string,
 *     lastName: string,
 *     email: string,
 *     address: {
 *       street: string,
 *       city: string,
 *       state: string,
 *       zip: string
 *     }
 *   }
 *
 * - {contractDate}: text, format: "YYYY-MM-DD"
 * - {terms}: JSON array of term objects
 */
const TEMPLATE_ID = '...';
```

---

## Getting Help

If you've tried everything and still having issues:

### 1. Gather Information

Collect this information before contacting support:
- Template ID
- Exact error message
- Full payload (redact sensitive data)
- Expected vs actual output
- Steps you've tried

### 2. Create Minimal Reproduction

Simplify to the smallest example that shows the problem:

```json
{
  "templateId": "...",
  "variables": [
    {
      "placeholder": "{test}",
      "mimeType": "json",
      "text": {"name": "value"},
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

### 3. Contact Support

- **Email:** support@turbodocx.com
- **Chat:** Available in dashboard
- **Documentation:** https://docs.turbodocx.com

Include:
- Your reproduction case
- What you expected
- What actually happened
- Any error messages

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
