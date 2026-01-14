---
title: Advanced Templating Engine
sidebar_position: 2
description: Complete guide to TurboDocx's Advanced Templating Engine - support for nested properties, arithmetic expressions, conditional logic, and loops in your document templates.
keywords:
  - advanced templating
  - nested variables
  - dynamic templates
  - conditional logic
  - arithmetic expressions
  - template loops
  - angular expressions
  - json variables
  - complex templates
  - variable nesting
  - document automation
  - template engine
  - expression parser
  - turbodocx advanced features
---

# Advanced Templating Engine


## What's New?

The Advanced Templating Engine extends TurboDocx's capabilities with powerful features that enable sophisticated document automation:

<div className="feature-grid">

### 🎯 Nested Property Access
Access deeply nested object properties using dot notation
```
{customer.contact.email}
{order.shipping.address.city}
```

### 🧮 Arithmetic Expressions
Perform calculations directly in templates
```
{price * quantity}
{subtotal + tax + shipping}
```

### ⚡ Conditional Logic
Show/hide content based on conditions
```
{#price >= 1000}
This is expensive stuff
{/}
```

### 🔄 Loops & Iterations
Generate repeated content from arrays
```
{#products}
- {name}: ${price}
{/}
```

</div>

## Why Use Advanced Templating?

### Before: Simple Variables
❌ **More variables to manage**
```json
{
  "variables": [
    {"placeholder": "{firstName}", "value": "John"},
    {"placeholder": "{lastName}", "value": "Doe"},
    {"placeholder": "{email}", "value": "john@example.com"},
    {"placeholder": "{phone}", "value": "+1-555-0123"},
    {"placeholder": "{street}", "value": "123 Main St"},
    {"placeholder": "{city}", "value": "San Francisco"},
    {"placeholder": "{state}", "value": "CA"},
    {"placeholder": "{zip}", "value": "94102"}
  ]
}
```

### After: Advanced Templating
✅ **Clean, structured data**
```json
{
  "variables": [
    {
      "placeholder": "{customer}",
      "mimeType": "json",
      "value": {
        "firstName": "John",
        "lastName": "Doe",
        "contact": {
          "email": "john@example.com",
          "phone": "+1-555-0123"
        },
        "address": {
          "street": "123 Main St",
          "city": "San Francisco",
          "state": "CA",
          "zip": "94102"
        }
      }
    }
  ]
}
```

### Key Benefits

- **🎯 Less Mapping**: Reduce variable count by 60-80% using nested structures
- **💡 Smarter Templates**: Calculations, conditions, and logic in your documents
- **🚀 Faster Development**: Mirror your application's data structure
- **🔧 Easier Maintenance**: Update one object instead of many variables
- **📊 Better Organization**: Logical grouping of related data
- **🎨 More Flexibility**: Dynamic content without backend preprocessing

---

## Quick Start

Let's transform a simple template into an advanced one in 5 minutes.

### Step 1: Traditional Approach

**Template:**
```
Hello {firstName} {lastName}!

Your account balance is ${balance}.
Thank you for being a {membershipLevel} member.
```

**Payload (8 variables):**
```json
{
  "variables": [
    {"placeholder": "{firstName}", "mimeType": "text", "value": "Jane"},
    {"placeholder": "{lastName}", "mimeType": "text", "value": "Smith"},
    {"placeholder": "{balance}", "mimeType": "text", "value": "1500.00"},
    {"placeholder": "{membershipLevel}", "mimeType": "text", "value": "Premium"}
  ]
}
```

### Step 2: Advanced Approach

**Template:**
```
Hello {user.firstName} {user.lastName}!

Your account balance is ${user.account.balance}.
{#user.account.isPremium}
Thank you for being a Premium member! You've saved ${user.account.savings} this year.
{/}
```

**Payload (1 variable):**
```json
{
  "variables": [
    {
      "placeholder": "{user}",
      "mimeType": "json",
      "value": {
        "firstName": "Jane",
        "lastName": "Smith",
        "account": {
          "balance": 1500.00,
          "isPremium": true,
          "savings": 250.00
        }
      }
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Hello Jane Smith!

Your account balance is $1500.00.
Thank you for being a Premium member! You've saved $250.00 this year.
```

:::tip Key Takeaway
One structured JSON variable replaces 4+ simple text variables, and you get conditional rendering for free!
:::

---

## Core Concepts

### Expression Types

The Advanced Templating Engine automatically detects and evaluates different expression types:

| Type | Syntax | Example | Use Case |
|------|--------|---------|----------|
| **Simple** | `{variable}` | `{firstName}` | Basic text replacement |
| **Nested** | `{object.property}` | `{user.email}` | Accessing nested data |
| **Arithmetic** | `{a + b}` | `{price * qty}` | Mathematical calculations |
| **Conditional** | `{#condition}...{/}` | `{#isPremium}...{/}` | Show/hide content |
| **Loop** | `{#array}...{/}` | `{#items}...{/}` | Repeat content |

### Important Flags

:::info Required for Advanced Features
To enable advanced templating features, use **either or both**:

1. **`mimeType: "json"`** - Enables advanced features automatically for that variable
   - Required for: nested objects, arrays, loops
   - Also enables: arithmetic expressions, conditionals on that data

2. **`usesAdvancedTemplatingEngine: true`** - Explicitly enables advanced features
   - Required when: using `mimeType: "text"` with arithmetic expressions
   - Optional when: using `mimeType: "json"` (already enabled)

**You can use both together** - `mimeType: "json"` with `usesAdvancedTemplatingEngine: true`
:::

:::warning Rich Text Not Supported
Advanced templating features **do not support rich text data** at this time. If your variable values contain rich text formatting in html string, it will be rendered as html string and no conversion will be done.

**Limitation:** Variables with `usesAdvancedTemplatingEngine: true` or `mimeType: "json"` will render as plain text only.

**Workaround:** For rich text content, use simple variables without advanced templating features.
:::

#### `usesAdvancedTemplatingEngine`
Explicitly marks variables using advanced features.

**When to use:**
- **Required**: When using arithmetic with `mimeType: "text"`
  ```json
  {
    "placeholder": "{price}",
    "mimeType": "text",
    "value": 100,
    "usesAdvancedTemplatingEngine": true  // Required for arithmetic with text
  }
  ```

- **Optional**: When using `mimeType: "json"` (advanced features already enabled)
  ```json
  {
    "placeholder": "{customer}",
    "mimeType": "json",  // Advanced features enabled automatically
    "value": {"name": "John"},
    "usesAdvancedTemplatingEngine": true  // Optional, but recommended
  }
  ```

#### `mimeType: "json"`
Enables advanced templating features automatically for structured data.

**Automatically enables:**
- Nested object access: `{customer.contact.email}`
- Arithmetic expressions: `{order.items[0].price * 2}`
- Arrays/Loops: `{#items}...{/}`
- Conditionals: `{#isPremium}...{/}`

**Examples:**
```json
// Nested object with arithmetic
{
  "placeholder": "{order}",
  "mimeType": "json",  // Enables all advanced features
  "value": {
    "subtotal": 100,
    "tax": 10,
    "items": [
      {"name": "Product A", "price": 50, "quantity": 2}
    ]
  }
}

// Template can use: {order.subtotal + order.tax} and {#order.items}...{/}
```

### Operating Modes

#### Production Mode (Default)
✅ All advanced features work
✅ Expressions evaluated normally
✅ Full JSON object support
✅ Use for actual document generation

#### Preview Mode (`isPreview: true`)
⚠️ Only simple variables supported
⚠️ Advanced features show error messages
⚠️ Used for UI-based template preview

:::warning Preview Mode Limitations
Preview mode is designed for rendering variables in TurboDocx UI while populating them. Advanced features like nested objects, expressions, and loops require programmatic JSON data structures that can't be easily input through a UI form.
:::

---

## Feature Deep Dive

### 1. Nested Property Access

Access properties within nested objects using dot notation. Perfect for structured data from databases, APIs, or application state.

#### Use Cases

- Customer profiles with multiple sections
- Address information (street, city, state, zip)
- Product catalogs with specifications
- Organization hierarchies
- User settings and preferences
- Order details with line items

#### Basic Nested Access

**Template:**
```
Customer Information
-------------------
Name: {customer.firstName} {customer.lastName}
Email: {customer.contact.email}
Phone: {customer.contact.phone}

Shipping Address:
{customer.address.street}
{customer.address.city}, {customer.address.state} {customer.address.zip}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{customer}",
      "mimeType": "json",
      "value": {
        "firstName": "Jane",
        "lastName": "Smith",
        "contact": {
          "email": "jane.smith@example.com",
          "phone": "+1-555-0123"
        },
        "address": {
          "street": "123 Main Street",
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

**Output:**
```
Customer Information
-------------------
Name: Jane Smith
Email: jane.smith@example.com
Phone: +1-555-0123

Shipping Address:
123 Main Street
San Francisco, CA 94102
```

#### Deep Nesting

**Template:**
```
Organization: {company.name}
Department: {company.divisions.engineering.teams.backend.name}
Team Lead: {company.divisions.engineering.teams.backend.lead.name}
Contact: {company.divisions.engineering.teams.backend.lead.contact.email}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{company}",
      "mimeType": "json",
      "value": {
        "name": "Acme Corporation",
        "divisions": {
          "engineering": {
            "teams": {
              "backend": {
                "name": "Backend Infrastructure",
                "lead": {
                  "name": "Alex Johnson",
                  "contact": {
                    "email": "alex.johnson@acme.com",
                    "phone": "+1-555-0199"
                  }
                }
              }
            }
          }
        }
      }
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

#### Combining Nested Access with Arithmetic

**Template:**
```
Student Grade Report
-------------------
Name: {student.name.first} {student.name.last}
Student ID: {student.id}

Grades:
Physics: {student.grades.physics}
Chemistry: {student.grades.chemistry}
Mathematics: {student.grades.mathematics}

Average: {(student.grades.physics + student.grades.chemistry + student.grades.mathematics) / 3}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{student}",
      "mimeType": "json",
      "value": {
        "id": "STU-12345",
        "name": {
          "first": "Emma",
          "last": "Wilson"
        },
        "grades": {
          "physics": 92,
          "chemistry": 88,
          "mathematics": 95
        }
      }
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Student Grade Report
-------------------
Name: Emma Wilson
Student ID: STU-12345

Grades:
Physics: 92
Chemistry: 88
Mathematics: 95

Average: 91.67
```

#### Built-in Property Filtering

The templating engine automatically provides access to JavaScript built-in properties and methods. You only need to provide the data structure in your payload—built-in properties like `.length` work automatically without needing separate variables.

**Automatically Available Properties:**
- **Array:** `length`, `indexOf`, `includes`, `join`, `slice`, `concat`, `map`, `filter`, `reduce`, `find`, `sort`
- **String:** `length`, `charAt`, `substring`, `toUpperCase`, `toLowerCase`, `trim`, `split`, `replace`
- **Object:** `keys`, `values`, `entries`, `toString`, `hasOwnProperty`

**Template:**
```
User Management Dashboard
========================

Total Active Users: {users.length}
First User Email: {users[0].email}
Last User Name: {users[users.length - 1].name}

Team Name: {teamName}
Team Code: {teamName.toUpperCase()}
Name Length: {teamName.length} characters
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{users}",
      "mimeType": "json",
      "value": [
        {"name": "Alice Johnson", "email": "alice@example.com"},
        {"name": "Bob Smith", "email": "bob@example.com"},
        {"name": "Carol White", "email": "carol@example.com"}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{teamName}",
      "mimeType": "text",
      "value": "Engineering",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
User Management Dashboard
========================

Total Active Users: 3
First User Email: alice@example.com
Last User Name: Carol White

Team Name: Engineering
Team Code: ENGINEERING
Name Length: 11 characters
```

:::tip Key Insight
You **do not** need to create separate variables like `{userCount}` or `{teamNameUpper}`. The engine automatically provides `.length` on arrays and strings, `.toUpperCase()` on strings, and array indexing like `[0]` or `[users.length - 1]`.
:::

### 2. Arithmetic Expressions

Perform mathematical calculations directly in your templates without preprocessing data.

:::warning String vs Number Values
When performing arithmetic operations, always use **numeric values** (not strings) in your payload. Using string values instead of numbers may produce unexpected or incorrect results.

**Example:**
- ✅ `"value": 10` (number) - Works correctly
- ❌ `"value": "10"` (string) - May produce wrong results

See the [String vs Number Example](#string-vs-number-behavior) below for a detailed comparison.
:::

#### Supported Operators

- **Addition:** `+`
- **Subtraction:** `-`
- **Multiplication:** `*`
- **Division:** `/`
- **Parentheses:** `()` for order of operations
- **Modulo:** `%` (remainder)

#### Invoice Example

**Template:**
```
INVOICE #INV-{invoiceNumber}
========================

Item                    Qty     Price      Total
--------------------------------------------------
{#lineItems}
{description}           {qty}   ${price}   ${qty * price}
{/}
--------------------------------------------------

Subtotal:                              ${subtotal}
Tax (10%):                             ${subtotal * 0.10}
Shipping:                              ${shipping}
--------------------------------------------------
TOTAL:                                 ${subtotal + (subtotal * 0.10) + shipping}

{#discount > 0}
Discount Applied:                      -${discount}
FINAL AMOUNT:                          ${subtotal + (subtotal * 0.10) + shipping - discount}
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{invoiceNumber}",
      "mimeType": "text",
      "value": "2024-001"
    },
    {
      "placeholder": "{lineItems}",
      "mimeType": "json",
      "value": [
        {"description": "Widget A", "qty": 5, "price": 25.00},
        {"description": "Widget B", "qty": 3, "price": 40.00},
        {"description": "Widget C", "qty": 2, "price": 15.00}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{subtotal}",
      "mimeType": "text",
      "value": 275.00,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{shipping}",
      "mimeType": "text",
      "value": 15.00,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{discount}",
      "mimeType": "text",
      "value": 25.00,
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
INVOICE #INV-2024-001
========================

Item                    Qty     Price      Total
--------------------------------------------------
Widget A                5       $25.00     $125.00
Widget B                3       $40.00     $120.00
Widget C                2       $15.00     $30.00
--------------------------------------------------

Subtotal:                              $275.00
Tax (10%):                             $27.50
Shipping:                              $15.00
--------------------------------------------------
TOTAL:                                 $317.50

Discount Applied:                      -$25.00
FINAL AMOUNT:                          $292.50
```

#### Pricing Calculator

**Template:**
```
Subscription Pricing
-------------------
Base Price: ${basePrice}/month
Users: {userCount} × ${pricePerUser} = ${userCount * pricePerUser}
Storage: {storageGB}GB × ${pricePerGB} = ${storageGB * pricePerGB}

Subtotal: ${basePrice + (userCount * pricePerUser) + (storageGB * pricePerGB)}

{#annualBilling}
Annual Discount (20%): -${(basePrice + (userCount * pricePerUser) + (storageGB * pricePerGB)) * 0.20}
Annual Total: ${(basePrice + (userCount * pricePerUser) + (storageGB * pricePerGB)) * 0.80 * 12}
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{basePrice}",
      "mimeType": "text",
      "value": 29.99,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{userCount}",
      "mimeType": "text",
      "value": 10,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{pricePerUser}",
      "mimeType": "text",
      "value": 5.00,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{storageGB}",
      "mimeType": "text",
      "value": 100,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{pricePerGB}",
      "mimeType": "text",
      "value": 0.10,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{annualBilling}",
      "mimeType": "text",
      "value": "true",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Subscription Pricing
-------------------
Base Price: $29.99/month
Users: 10 × $5.00 = $50.00
Storage: 100GB × $0.10 = $10.00

Subtotal: $89.99

Annual Discount (20%): -$17.998
Annual Total: $863.904
```

#### Complex Calculations

**Template:**
```
Mortgage Calculator
------------------
Loan Amount: ${loanAmount}
Interest Rate: {interestRate}%
Loan Term: {years} years

Monthly Interest Rate: {interestRate / 100 / 12}
Number of Payments: {years * 12}

Monthly Payment: ${(loanAmount * (interestRate / 100 / 12)) / (1 - (1 + (interestRate / 100 / 12)) ** (-(years * 12)))}
Total Payment: ${((loanAmount * (interestRate / 100 / 12)) / (1 - (1 + (interestRate / 100 / 12)) ** (-(years * 12)))) * (years * 12)}
Total Interest: ${(((loanAmount * (interestRate / 100 / 12)) / (1 - (1 + (interestRate / 100 / 12)) ** (-(years * 12)))) * (years * 12)) - loanAmount}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{loanAmount}",
      "mimeType": "text",
      "value": 300000,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{interestRate}",
      "mimeType": "text",
      "value": 4.5,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{years}",
      "mimeType": "text",
      "value": 30,
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Mortgage Calculator
------------------
Loan Amount: $300000
Interest Rate: 4.5%
Loan Term: 30 years

Monthly Interest Rate: 0.00375
Number of Payments: 360

Monthly Payment: $1520.06
Total Payment: $547221.60
Total Interest: $247221.60
```

#### String vs Number Behavior

This example demonstrates why you should always use numeric values instead of strings for arithmetic operations.

**Template:**
```
All Operators:
    - Addition: {a} + {b} = {a + b}
    - Subtraction: {a} - {b} = {a - b}
    - Multiplication: {a} * {b} = {a * b}
    - Division: {a} / {b} = {a / b}
    - Modulo: {a} % {b} = {a % b}
```

**Payload with Numbers (Correct):**
```json
{
  "variables": [
    {
      "placeholder": "{a}",
      "mimeType": "text",
      "value": 10,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{b}",
      "mimeType": "text",
      "value": 3,
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output with Numbers:**
```
All Operators:
    - Addition: 10 + 3 = 13
    - Subtraction: 10 - 3 = 7
    - Multiplication: 10 * 3 = 30
    - Division: 10 / 3 = 3.333333333333333
    - Modulo: 10 % 3 = 1
```

**Payload with Strings (Incorrect):**
```json
{
  "variables": [
    {
      "placeholder": "{a}",
      "mimeType": "text",
      "value": "10",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{b}",
      "mimeType": "text",
      "value": "3",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output with Strings (Wrong Results):**
```
All Operators:
    - Addition: 10 + 3 = 103
    - Subtraction: 10 - 3 = 7
    - Multiplication: 10 * 3 = 30
    - Division: 10 / 3 = 3.333333333333333
    - Modulo: 10 % 3 = 1
```

:::caution Key Takeaway
Notice how **addition with strings** produces `"103"` (string concatenation) instead of `13` (mathematical addition). While other operators may still work due to JavaScript's type coercion, this behavior is unreliable and can lead to bugs. Always use numeric values for arithmetic operations.
:::

#### Division and Modulo by Zero

Special care must be taken when dividing or using modulo operations with zero values.

**Template:**
```
Division and Modulo with Zero:
    - 10 / 0 = {a / 0}
    - 10 % 0 = {a % 0}
    - 0 * 5 = {0 * b}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{a}",
      "mimeType": "text",
      "value": 10,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{b}",
      "mimeType": "text",
      "value": 5,
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Division and Modulo with Zero:
    - 10 / 0 = Infinity
    - 10 % 0 = NaN
    - 0 * 5 = 0
```

:::danger Zero Division Warnings
- **Division by zero** (`x / 0`) returns `Infinity`
- **Modulo by zero** (`x % 0`) returns `NaN` (Not a Number)
- **Multiplication by zero** (`x * 0` or `0 * x`) returns `0` (works normally)

**Best Practice:** Use conditional logic to check for zero before performing division or modulo operations:
```
{#divisor != 0}
Result: {dividend / divisor}
{/}
{#divisor == 0}
Error: Cannot divide by zero
{/}
```
:::

:::warning Important Notes
- Division by zero returns `Infinity` - handle with conditionals if needed
- Modulo by zero returns `NaN` - validate divisor before using modulo
- Use parentheses to control order of operations
- **Always use numeric values** (not strings) for arithmetic operations to avoid incorrect results
:::

---

### 3. Conditional Logic

Show or hide content sections based on conditions. Perfect for personalized documents, access control, and dynamic content display.

#### Supported Operators

- **Equality:** `==`, `!=`
- **Comparison:** `>`, `<`, `>=`, `<=`
- **Logical:** `&&` (and), `||` (or), `!` (not)
- **Existence:** Check if variable is truthy/falsy

#### Simple Boolean Conditionals

**Template:**
```
Account Status: {#isActive}✓ ACTIVE{/}{#!isActive}✗ INACTIVE{/}

{#isPremium}
PREMIUM MEMBER BENEFITS:
✓ Free shipping on all orders
✓ 24/7 Priority support
✓ Early access to new features
✓ 20% discount on all purchases
{/}

{#!isPremium}
Upgrade to Premium to unlock exclusive benefits!
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{isActive}",
      "mimeType": "text",
      "value": "true",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{isPremium}",
      "mimeType": "text",
      "value": "true",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Account Status: ✓ ACTIVE

PREMIUM MEMBER BENEFITS:
✓ Free shipping on all orders
✓ 24/7 Priority support
✓ Early access to new features
✓ 20% discount on all purchases
```

#### Numeric Comparisons

**Template:**
```
Membership Tier Assessment
-------------------------

{#score >= 1000}
✓ PLATINUM MEMBER
Access to all premium features and exclusive events
{/}

{#score >= 500 && score < 1000}
⭐ GOLD MEMBER
Access to premium features and priority support
{/}

{#score < 500}
SILVER MEMBER
Access to standard features
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{score}",
      "mimeType": "text",
      "value": 1250,
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Membership Tier Assessment
-------------------------

✓ PLATINUM MEMBER
Access to all premium features and exclusive events
```

#### String Comparisons

**Template:**
```
{#status == "approved"}
✓ Your application has been APPROVED
Next steps: Complete onboarding process
{/}

{#status == "pending"}
⏳ Your application is UNDER REVIEW
Estimated time: 2-3 business days
{/}

{#status == "rejected"}
✗ Your application was NOT APPROVED
Reason: {rejectionReason}
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

**Output:**
```
✓ Your application has been APPROVED
Next steps: Complete onboarding process
```

#### Complex Logical Conditions

**Template:**
```
Loan Eligibility Assessment
---------------------------

{#creditScore >= 700 && annualIncome >= 50000 && employmentYears >= 2}
✓ PRE-APPROVED for loan up to ${loanAmount}
Excellent credit profile
{/}

{#(creditScore >= 650 && creditScore < 700) && annualIncome >= 40000}
⚠ CONDITIONAL APPROVAL
Additional documentation required
{/}

{#creditScore < 650 || annualIncome < 40000 || employmentYears < 1}
✗ APPLICATION DECLINED
Current eligibility criteria not met
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{creditScore}",
      "mimeType": "text",
      "value": 720,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{annualIncome}",
      "mimeType": "text",
      "value": 75000,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{employmentYears}",
      "mimeType": "text",
      "value": 5,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{loanAmount}",
      "mimeType": "text",
      "value": "250000"
    }
  ]
}
```

**Output:**
```
Loan Eligibility Assessment
---------------------------

✓ PRE-APPROVED for loan up to $250000
Excellent credit profile
```

#### Nested Conditionals

**Template:**
```
{#isLoggedIn}
Welcome back, {username}!

{#hasActiveSubscription}
  {#subscriptionType == "enterprise"}
  Enterprise Features:
  - Unlimited users
  - Custom branding
  - Dedicated support
  - SSO integration
  {/}

  {#subscriptionType == "professional"}
  Professional Features:
  - Up to 50 users
  - Advanced analytics
  - Priority support
  {/}
{/}

{#!hasActiveSubscription}
Your subscription has expired. Renew now to continue access.
{/}
{/}

{#!isLoggedIn}
Please log in to access your account.
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{isLoggedIn}",
      "mimeType": "text",
      "value": "true",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{username}",
      "mimeType": "text",
      "value": "John Doe",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{hasActiveSubscription}",
      "mimeType": "text",
      "value": "true",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{subscriptionType}",
      "mimeType": "text",
      "value": "enterprise",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Welcome back, John Doe!

  Enterprise Features:
  - Unlimited users
  - Custom branding
  - Dedicated support
  - SSO integration
```

#### Edge Case: Array Length Conditionals

**Template:**
```
Shopping Cart
------------

{#items.length > 0}
You have {items.length} items in your cart.

{#items.length > 5}
🎁 Bonus: You qualify for bulk discount!
{/}

{#items.length >= 3 && items.length <= 5}
💡 Add {6 - items.length} more items for bulk discount!
{/}
{/}

{#items.length == 0}
Your cart is empty. Start shopping!
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{items}",
      "mimeType": "json",
      "value": [
        {"name": "Product 1"},
        {"name": "Product 2"},
        {"name": "Product 3"},
        {"name": "Product 4"}
      ],
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Shopping Cart
------------

You have 4 items in your cart.

💡 Add 2 more items for bulk discount!
```

---

### 4. Loops & Iterations

Iterate over arrays and collections to generate repeated content. Essential for invoices, product lists, reports, tables, and any repeating data.

#### Simple Array Loop

**Template:**
```
SHOPPING CART
=============

{#items}
• {name}
  Price: ${price}
  Quantity: {quantity}
  Total: ${price * quantity}
  ---
{/}

Cart Total: ${cartTotal}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{items}",
      "mimeType": "json",
      "value": [
        {"name": "Wireless Mouse", "price": 29.99, "quantity": 2},
        {"name": "USB-C Cable", "price": 12.99, "quantity": 3},
        {"name": "Laptop Stand", "price": 45.00, "quantity": 1}
      ]
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{cartTotal}",
      "mimeType": "text",
      "value": "143.95"
    }
  ]
}
```

**Output:**
```
SHOPPING CART
=============

• Wireless Mouse
  Price: $29.99
  Quantity: 2
  Total: $59.98
  ---
• USB-C Cable
  Price: $12.99
  Quantity: 3
  Total: $38.97
  ---
• Laptop Stand
  Price: $45.00
  Quantity: 1
  Total: $45.00
  ---

Cart Total: $143.95
```

#### Nested Loops

**Template:**
```
DEPARTMENTS AND EMPLOYEES
========================

{#departments}
Department: {name}
Manager: {manager}
Budget: ${budget}

Team Members:
{#employees}
  - {employees.name} ({employees.role})
    Email: {employees.email}
    Salary: ${employees.salary}
{/}
---
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{departments}",
      "mimeType": "json",
      "value": [
        {
          "name": "Engineering",
          "manager": "Sarah Johnson",
          "budget": 500000,
          "employees": [
            {
              "name": "John Smith",
              "role": "Senior Developer",
              "email": "john@company.com",
              "salary": 120000
            },
            {
              "name": "Emily Chen",
              "role": "DevOps Engineer",
              "email": "emily@company.com",
              "salary": 110000
            }
          ]
        },
        {
          "name": "Marketing",
          "manager": "Michael Brown",
          "budget": 300000,
          "employees": [
            {
              "name": "Lisa Anderson",
              "role": "Marketing Manager",
              "email": "lisa@company.com",
              "salary": 95000
            }
          ]
        }
      ]
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
DEPARTMENTS AND EMPLOYEES
========================

Department: Engineering
Manager: Sarah Johnson
Budget: $500000

Team Members:
  - John Smith (Senior Developer)
    Email: john@company.com
    Salary: $120000
  - Emily Chen (DevOps Engineer)
    Email: emily@company.com
    Salary: $110000
---
Department: Marketing
Manager: Michael Brown
Budget: $300000

Team Members:
  - Lisa Anderson (Marketing Manager)
    Email: lisa@company.com
    Salary: $95000
---
```

#### Loops with Conditionals

**Template:**
```
ORDER PROCESSING REPORT
======================

{#orders}
Order #{id} - {date}
Customer: {customer.name}
Status: {status}

Items:
{#items}
  • {items.product} - Qty: {items.quantity} - ${items.price}
{/}

Order Total: ${total}

{#isPaid}
✓ Payment received on {paymentDate}
{/}

{#!isPaid}
⚠ PAYMENT PENDING - Follow up required
{/}

{#total > 1000}
🎁 Qualifies for free premium shipping!
{/}

Shipping: FREE (if total > 100)
---
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{orders}",
      "mimeType": "json",
      "value": [
        {
          "id": "ORD-001",
          "date": "2024-01-15",
          "customer": {"name": "Jane Smith"},
          "status": "Completed",
          "isPaid": true,
          "paymentDate": "2024-01-15",
          "total": 1250.00,
          "items": [
            {"product": "Product A", "quantity": 5, "price": 150.00},
            {"product": "Product B", "quantity": 2, "price": 275.00}
          ]
        },
        {
          "id": "ORD-002",
          "date": "2024-01-16",
          "customer": {"name": "Bob Johnson"},
          "status": "Pending",
          "isPaid": false,
          "total": 85.00,
          "items": [
            {"product": "Product C", "quantity": 1, "price": 85.00}
          ]
        }
      ]
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
ORDER PROCESSING REPORT
======================

Order #ORD-001 - 2024-01-15
Customer: Jane Smith
Status: Completed

Items:
  • Product A - Qty: 5 - $150.00
  • Product B - Qty: 2 - $275.00

Order Total: $1250.00

✓ Payment received on 2024-01-15

🎁 Qualifies for free premium shipping!

Shipping: FREE (if total > 100)
---
Order #ORD-002 - 2024-01-16
Customer: Bob Johnson
Status: Pending

Items:
  • Product C - Qty: 1 - $85.00

Order Total: $85.00

⚠ PAYMENT PENDING - Follow up required

Shipping: FREE (if total > 100)
---
```

#### Empty Array Handling

**Template:**
```
Notifications
------------

{#notifications.length > 0}
You have {notifications.length} new notifications:

{#notifications}
  [{notifications.type}] {notifications.message}
  {notifications.timestamp}
{/}
{/}

{#notifications.length == 0}
No new notifications. You're all caught up!
{/}
```

**Payload (empty array):**
```json
{
  "variables": [
    {
      "placeholder": "{notifications}",
      "mimeType": "json",
      "value": []
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Notifications
------------

No new notifications. You're all caught up!
```

:::tip Loop Best Practices
1. **Check array length** before looping to handle empty arrays
2. **Limit large arrays** - Performance degrades with 1000+ items
3. **Use conditionals inside loops** for dynamic content
4. **Access nested properties** with dot notation
5. **Combine with arithmetic** for calculations within loops
6. **Test with edge cases** - empty arrays, single items, large datasets
:::

---

## Complete Payload Reference

### Variable Object Structure

```typescript
interface IVariable {
  // Required fields
  placeholder: string;              // Variable placeholder, e.g., "{user}"
  mimeType: "text" | "html" | "json" | "image";

  // Content
  value: string | number | boolean | object | any[];  // For text, html, json types

  // Advanced templating flags
  usesAdvancedTemplatingEngine?: boolean;  // Uses advanced features

  // Optional metadata
  name?: string;                     // Variable name without braces
}
```
<!-- 
TODO: Nicolas to confirm if this should be included right now or now.
It is required in preview mode
// metadata?: {
//   nestedVariables?: NestedVariableData[];
//   originalExpression?: string;
// }; -->

<!-- ### Nested Variable Data Structure

```typescript
interface NestedVariableData {
  name: string;                      // Variable name
  placeholder: string;               // Full placeholder with braces
  path?: string;                     // Dot-notation path for loops
  fullPath?: string;                 // Complete access path
  parentPlaceholder?: string;        // Immediate parent
  nestedVariables?: NestedVariableData[];  // Recursive nesting
}
``` -->

### MIME Types Explained

| MIME Type | Usage | Example |
|-----------|-------|---------|
| `text` | Plain text values | Simple variables, numbers |
| `html` | Rich text with HTML | Formatted descriptions |
| `json` | Objects or arrays | Nested data, loops |
| `image` | Image data | Base64 or URLs |

---

## Edge Cases & Variations

### 1. Mixed Data Types in Loops

**Scenario:** Loop array contains different value types

**Template:**
```
{#items}
{#items.nestedloop}
- {items.nestedloop.title}
{/}
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{items}",
      "mimeType": "json",
      "value": [
        {
          "nestedloop": [
            {"title": "Item 1.1"},
            {"title": "Item 1.2"}
          ]
        },
        {
          "nestedloop": true,
          "title": "Item 2 (boolean true)"
        },
        {
          "nestedloop": {"title": "Item 3 (single object)"}
        },
        {
          "nestedloop": false
        },
        {}
      ],
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
- Item 1.1
- Item 1.2
- Item 2 (boolean true)
- Item 3 (single object)
```

### 2. Deeply Nested Access

**Template:**
```
{company.divisions.departments.teams.members.contact.primaryEmail}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{company}",
      "mimeType": "json",
      "value": {
        "divisions": {
          "departments": {
            "teams": {
              "members": {
                "contact": {
                  "primaryEmail": "deep@example.com"
                }
              }
            }
          }
        }
      },
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
deep@example.com
```

### 3. Null/Undefined Handling

**Template:**
```
Name: {user.name}
Email: {user.email}
Optional: {user.optional}
```

**Payload (missing properties):**
```json
{
  "variables": [
    {
      "placeholder": "{user}",
      "mimeType": "json",
      "value": {
        "name": null
      },
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
Name:
Email:
Optional:
```

### 5. Array Index Access

**Template:**
```
First item: {items[0].name}
Second item: {items[1].name}
Last item: {items[items.length - 1].name}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{items}",
      "mimeType": "json",
      "value": [
        {"name": "First"},
        {"name": "Second"},
        {"name": "Third"},
        {"name": "Last"}
      ],
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
First item: First
Second item: Second
Last item: Last
```

### 6. Boolean String Conversion

**Template:**
```
{#stringBoolean == "true"}
String is "true"
{/}

{#booleanValue}
Boolean is true
{/}
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{stringBoolean}",
      "mimeType": "text",
      "value": "true",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{booleanValue}",
      "mimeType": "text",
      "value": "true",
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

**Output:**
```
String is "true"

Boolean is true
```

### 7. Empty String vs Null vs Undefined

**Template:**
```
Empty string: "{emptyString}"
Undefined: "{undefinedValue}"
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{emptyString}",
      "mimeType": "text",
      "value": ""
    }
  ]
}
```

**Output:**
```
Empty string: 
Undefined: undefined
```

---

## Error Handling & Debugging

### Common Errors

#### 1. Missing Variable

**Error:** Variable comes as undefined in output

**Cause:** Variable not provided in payload

**Solution:** Check placeholder spelling and ensure variable is in payload

#### 2. Type Mismatch

**Error:** Unexpected rendering or empty content

**Cause:** Not providing `usesAdvancedTemplatingEngine:true` with `mimeType: "text"` or `mimeType: "json" ` is not given.

**Solution:** Use `mimeType: "json"`, or `mimeType: "text"` and `usesAdvancedTemplatingEngine: true`

#### 3. Preview Mode Error

**Error:** `"{expression} is not supported in the TurboDocx UI"`

**Cause:** Using advanced features in preview mode in TurboDocx UI

### Debugging Strategies

#### 1. Start Simple
```json
// Test with minimal payload first
{
  "variables": [
    {
      "placeholder": "{test}",
      "mimeType": "text",
      "value": "Hello World"
    }
  ]
}
```

#### 2. Validate JSON Structure
```javascript
// Use JSON validator before sending
const isValid = JSON.stringify(payload);
```

#### 3. Test Expressions Individually
```
Template: {price}
Then: {price * 2}
Then: {price * quantity}
```

#### 4. Check Nested Paths
```json
// Verify each level exists
{
  "user": {
    "profile": {
      "name": "test"  // Accessible as {user.profile.name}
    }
  }
}
```

## Best Practices

### 1. Payload Structure

✅ **DO:**
```json
{
  "variables": [
    {
      "placeholder": "{customer}",
      "mimeType": "json",
      "value": {
        "name": "John",
        "email": "john@example.com"
      }
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

❌ **DON'T:**
```json
{
  "variables": [
    {
      "placeholder": "{customer}",
      "mimeType": "text",  // Wrong type for nested data
      "value": "John"  // Should be false for JSON
    }
  ]
}
```

### 2. Template Design

- **Use meaningful variable names:** `{customer.email}` not `{ce}`
- **Group related data:** Keep address fields together in one object
- **Use appropriate MIME types** to get best results
- **Check data payload** to ensure desired outputs.

## Migration Guide

### From Simple to Advanced Variables

#### Step 1: Identify Related Variables

**Before:**
```
{firstName}
{lastName}
{email}
{phone}
{street}
{city}
{state}
{zip}
```

#### Step 2: Group into Logical Structure

**After:**
```
{customer.firstName}
{customer.lastName}
{customer.contact.email}
{customer.contact.phone}
{customer.address.street}
{customer.address.city}
{customer.address.state}
{customer.address.zip}
```

#### Step 3: Update Payload

**Before (8 variables):**
```json
{
  "variables": [
    {"placeholder": "{firstName}", "mimeType": "text", "value": "John"},
    {"placeholder": "{lastName}", "mimeType": "text", "value": "Doe"},
    // ... 6 more variables
  ]
}
```

**After (1 variable):**
```json
{
  "variables": [
    {
      "placeholder": "{customer}",
      "mimeType": "json",
      "value": {
        "firstName": "John",
        "lastName": "Doe",
        "contact": {
          "email": "john@example.com",
          "phone": "+1-555-0123"
        },
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

### Backward Compatibility

- ✅ **Simple variables continue to work** - No breaking changes
- ✅ **Mix simple and advanced** - Use both approaches in same template
- ✅ **Gradual migration** - Update templates one at a time
- ✅ **No API changes** - Same endpoints, just enhanced payloads

---

## Real-World Examples

### Example 1: Employee Contract

<details>
<summary>Click to expand full example</summary>

**Template:**
```
EMPLOYMENT CONTRACT

This Employment Agreement is entered into on {contract.date} between:

Employer: {company.name}
Address: {company.address.street}, {company.address.city}, {company.address.state} {company.address.zip}

Employee: {employee.name.first} {employee.name.last}
Address: {employee.address.street}, {employee.address.city}, {employee.address.state} {employee.address.zip}
Email: {employee.contact.email}
Phone: {employee.contact.phone}

POSITION AND DUTIES
The Employee is hired for the position of {employee.position} in the {employee.department} department.

COMPENSATION
Base Salary: ${employee.compensation.baseSalary} per year
Payment Schedule: {employee.compensation.paymentSchedule}

{#employee.compensation.bonus > 0}
Performance Bonus: Up to ${employee.compensation.bonus} annually
{/}

BENEFITS
{#benefits}
- {benefits.name}: {benefits.description}
{/}

{#employee.isRemote}
REMOTE WORK
This is a remote position. The Employee may work from their home office.
Equipment Budget: ${employee.equipmentBudget}
{/}

{#!employee.isRemote}
OFFICE LOCATION
The Employee will work at: {company.address.street}, {company.address.city}, {company.address.state}
{/}

START DATE
Employment begins on {employee.startDate}

_________________________________
{company.signatory.name}
{company.signatory.title}

_________________________________
{employee.name.first} {employee.name.last}
Employee
```

**Payload:**
```json
{
  "variables": [
    {
      "placeholder": "{contract}",
      "mimeType": "json",
      "value": {
        "date": "January 15, 2024"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{company}",
      "mimeType": "json",
      "value": {
        "name": "Acme Corporation",
        "address": {
          "street": "100 Technology Drive",
          "city": "San Francisco",
          "state": "CA",
          "zip": "94105"
        },
        "signatory": {
          "name": "Sarah Johnson",
          "title": "Chief People Officer"
        }
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{employee}",
      "mimeType": "json",
      "value": {
        "name": {
          "first": "Alex",
          "last": "Chen"
        },
        "address": {
          "street": "456 Residential St",
          "city": "Oakland",
          "state": "CA",
          "zip": "94612"
        },
        "contact": {
          "email": "alex.chen@email.com",
          "phone": "+1-555-0199"
        },
        "position": "Senior Software Engineer",
        "department": "Engineering",
        "compensation": {
          "baseSalary": 150000,
          "paymentSchedule": "Bi-weekly",
          "bonus": 20000
        },
        "isRemote": true,
        "equipmentBudget": 2000,
        "startDate": "February 1, 2024"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{benefits}",
      "mimeType": "json",
      "value": [
        {
          "name": "Health Insurance",
          "description": "Comprehensive medical, dental, and vision coverage"
        },
        {
          "name": "401(k) Matching",
          "description": "Company matches up to 6% of salary"
        },
        {
          "name": "Paid Time Off",
          "description": "20 days PTO plus 10 holidays"
        },
        {
          "name": "Professional Development",
          "description": "$5,000 annual budget for courses and conferences"
        }
      ],
      "usesAdvancedTemplatingEngine": true
    }
  ]
}
```

</details>

### Example 2: Monthly Sales Report

<details>
<summary>Click to expand full example</summary>

**Template:**
```
MONTHLY SALES REPORT
{report.month} {report.year}
Generated: {report.generatedDate}

EXECUTIVE SUMMARY
Total Revenue: ${report.totalRevenue}
Total Orders: {report.totalOrders}
Average Order Value: ${report.totalRevenue / report.totalOrders}
Growth vs Last Month: {report.growthPercent}%

{#report.growthPercent > 0}
📈 Revenue increased by {report.growthPercent}% compared to last month!
{/}

{#report.growthPercent < 0}
📉 Revenue decreased by {report.growthPercent * -1}% compared to last month.
{/}

TOP PERFORMING PRODUCTS
{#topProducts}
  {topProducts.name}
   Units Sold: {topProducts.unitsSold}
   Revenue: ${topProducts.revenue}
{/}

SALES BY REGION
{#regions}
{regions.name}:
  Revenue: ${regions.revenue}
  Orders: {regions.orders}
  Market Share: {(regions.revenue / report.totalRevenue) * 100}%

  Top Sales Rep: {regions.topRep.name}
  Rep Sales: ${regions.topRep.sales}

{/}

PERFORMANCE ALERTS
{#regions}
{#regions.revenue < regions.target}
⚠ {regions.name} is below target
  Target: ${regions.target}
  Actual: ${regions.revenue}
  Gap: ${regions.target - regions.revenue}
{/}
{/}
```

**Payload:** See [complete payload in documentation repo]

</details>

---

## API Integration Example

For a **complete, working cURL example** that demonstrates all advanced templating features in a single comprehensive test document, see:

👉 **[cURL Example](./Advanced%20Templating%20cURL%20Example.md)**

This example includes:
- Complete test template covering all features
- Full cURL request with proper headers
- Complete payload with all variable types
- Expected output documentation

---

## Additional Resources

### Documentation
- [Create a Deliverable](./How%20to%20Create%20a%20Deliverable.md)
- [Template Generation API](./API%20Templates.md)
- [Variable System Guide](./Additional%20Information.md)
- [Template Troubleshooting](./Template%20Troubleshooting.md)

### External Resources
- [Angular Expressions Documentation](https://www.npmjs.com/package/angular-expressions)
- [Docxtemplater Official Docs](https://docxtemplater.com/)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)

### Support
- 📧 Email: support@turbodocx.com
- 💬 Discord Community: https://discord.gg/turbodocx
- 📚 Knowledge Base: https://docs.turbodocx.com

---

**Last Updated:** January 2026
**Version:** 1.0.0
**Maintained by:** TurboDocx Engineering Team

:::tip Found this helpful?
Share your use cases and feedback with our team. We're constantly improving the Advanced Templating Engine based on customer needs!
:::
