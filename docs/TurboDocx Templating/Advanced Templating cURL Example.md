---
title: cURL Example
sidebar_position: 2.1
description: Complete cURL example demonstrating all advanced templating features with a comprehensive test document
keywords:
  - curl example
  - api request
  - advanced templating
  - complete example
  - test document
  - api integration
---

# cURL Example

This page provides a complete, working cURL example that demonstrates **all advanced templating features** in a single request. Use this as a reference for testing and implementing advanced templating in your applications.

:::info Note on Sample Data
All names, companies, and personal information in this example are fictional and randomly generated for demonstration purposes only.
:::

## Complete Test Template

The template below exercises every feature of the Advanced Templating Engine:

```
ADVANCED TEMPLATING ENGINE - COMPLETE TEST DOCUMENT
====================================================

SECTION 1: NESTED PROPERTY ACCESS
---------------------------------
1.1 Simple Nesting: Hello {user.firstName}, your email is {user.email}
1.2 Deep Nesting: Company Lead: {company.divisions.engineering.teamLead.name}, Phone: {company.divisions.engineering.teamLead.contact.phone}
1.3 Array Length: Total items in cart: {cart.items.length}
1.4 Array Index Access: First product: {products[0].name}, Second price: {products[1].price}, Third: {products[2].name}


SECTION 2: ARITHMETIC EXPRESSIONS
---------------------------------
2.1 Basic Addition: {price} + {tax} = {price + tax}
2.2 All Operators:
    - Addition: {a} + {b} = {a + b}
    - Subtraction: {a} - {b} = {a - b}
    - Multiplication: {a} * {b} = {a * b}
    - Division: {a} / {b} = {a / b}
    - Modulo: {a} % {b} = {a % b}
2.3 Complex Expression: ({basePrice} * {quantity}) + {shipping} - {discount} = {(basePrice * quantity) + shipping - discount}
2.4 Nested Property Math: {item.price} * {item.quantity} = {item.price * item.quantity}
2.5 Percentage: {originalPrice} - {discountPercent}% = {originalPrice - (originalPrice * discountPercent / 100)}


SECTION 3: CONDITIONAL LOGIC
----------------------------
3.1 Boolean Conditions:
{#isActive}[ACTIVE] Account is Active{/}
{#isPremium}[PREMIUM] Premium Member Benefits Applied{/}

3.2 Numeric Comparisons:
Score: {score}
{#score > 80}Result: Excellent Performance!{/}
{#score > 50}Result: Passed{/}
{#score <= 50}Result: Needs Improvement{/}

3.3 String Equality:
Status: {status}
{#status == "approved"}Decision: Your request has been APPROVED{/}
{#status == "pending"}Decision: Your request is PENDING review{/}
{#status == "rejected"}Decision: Your request was REJECTED{/}

3.4 Logical AND/OR:
Age: {age}, Has License: {hasLicense}
{#age >= 18 && hasLicense == true}Eligibility: You are eligible to drive{/}
{#age < 18 || hasLicense == false}Eligibility: You cannot drive yet{/}

3.5 Nested Conditionals:
User Type: {userType}, Department: {department}
{#userType == "employee"}
--- Employee Section ---
{#department == "engineering"}Department: Engineering Department Benefits{/}
{#department == "sales"}Department: Sales Department Benefits{/}
{/}
{#userType == "contractor"}
--- Contractor Section ---
{/}

3.6 Array Length Conditional:
{#cartItems.length > 0}Cart Status: You have {cartItems.length} items in your cart{/}
{#cartItems.length == 0}Cart Status: Your cart is empty{/}

3.7 Truthy/Falsy:
{#nickname}Nickname: {nickname}{/}
{#middleName}Middle Name: {middleName}{/}


SECTION 4: LOOPS
----------------
4.1 Simple Loop - Product List:
{#productList}
  - {name}: ${price}
{/productList}

4.2 Loop with Nested Properties - Team Members:
{#team}
  Name: {member.fullName}
  Email: {member.contact.email}
  Role: {member.role}
  ---
{/team}

4.3 Nested Loops - Departments & Employees:
{#departments}
DEPARTMENT: {deptName}
Employees:
{#employees}
    - {employeeName} ({title})
{/}
{/}

4.4 Loop with Conditionals:
{#orderItems}
  Product: {productName} - ${itemPrice}
  {#isOnSale}*** SALE ITEM ***{/}
  {#qty > 5}[Bulk discount applied]{/}
{/}

4.5 Loop with Arithmetic:
{#lineItems}
  {description}: {quantity} x ${unitPrice} = ${quantity * unitPrice}
{/}

SECTION 5: LOGICAL AND/OR
-------------------------
5.1 AND operator
{#cond1 && cond2}
Renders if both conditions are true
{/}
5.2 OR operator
{#cond3 || cond4}
Renders if any one condition is true
{/}
5.3 PARENTHESES
{#(cond1 && cond3) || cond4}
Complex logic with parentheses
{/}


SECTION 6: COMPLETE INVOICE (ALL FEATURES COMBINED)
---------------------------------------------------
INVOICE #{invoice.number}
Date: {invoice.date}
Due Date: {invoice.dueDate}

BILL TO:
{invCustomer.company}
{invCustomer.address.line1}
{invCustomer.address.line2}
{invCustomer.address.city}, {invCustomer.address.state} {invCustomer.address.zip}
Contact: {invCustomer.contact.name} | {invCustomer.contact.email}

LINE ITEMS:
{#invLineItems}
| {sku} | {lineDesc} | Qty: {lineQty} | ${linePrice} | Total: ${lineQty * linePrice} |
{#isTaxExempt}  [TAX EXEMPT]{/}
{/invLineItems}

SUMMARY:
Subtotal: ${invTotals.subtotal}
{#invTotals.hasDiscount}
Discount ({invTotals.discountCode}): -${invTotals.discountAmount}
{/}

TAX BREAKDOWN:
{#taxBreakdown}
  {taxName} ({rate}%): ${taxAmt}
{/}

-------------------------------------------
TOTAL DUE: ${invTotals.grandTotal}
-------------------------------------------

Payment Terms:
{#paymentTerms == "NET30"}Payment due within 30 days{/}
{#paymentTerms == "NET60"}Payment due within 60 days{/}
{#paymentTerms == "DUE_ON_RECEIPT"}Payment due upon receipt{/}

{#invIsPaid}
*** PAID - Thank you for your business! ***
{/}
{#invIsPaid == false}
*** PAYMENT DUE - Please remit payment by due date ***
{/}


SECTION 7: EMPLOYEE OFFER LETTER
--------------------------------
[COMPANY LETTERHEAD]

Date: {letter.date}

Dear {candidate.name},

We are pleased to offer you the position of {position.title} in our {position.department} department at {offerCompany.name}.

POSITION DETAILS:
Title: {position.title}
Department: {position.department}
Reports To: {position.manager.name}, {position.manager.title}
Start Date: {position.startDate}
Location: {position.location.office}
{#position.isHybrid}Work Arrangement: Hybrid ({position.hybridDays} days in office per week){/}
{#position.isRemote}Work Arrangement: Fully Remote{/}

COMPENSATION:
Base Salary: ${compensation.baseSalary} per year ({compensation.payFrequency})
{#compensation.hasBonus}
Signing Bonus: ${compensation.signingBonus}
Annual Bonus Target: {compensation.bonusTarget}% of base salary
{/}
{#compensation.hasEquity}
Equity: {compensation.equityShares} shares, vesting over {compensation.vestingYears} years
{/}

BENEFITS:
{#benefits}
- {benefitName}: {benefitDesc}
{/}

{#relocation.offered}
RELOCATION:
Allowance: ${relocation.allowance}
{#relocation.tempHousing}Temporary Housing: {relocation.tempHousingDays} days{/}
{/}

Please respond by: {letter.responseDeadline}

Sincerely,
{letter.signatory.name}
{letter.signatory.title}


SECTION 8: PERFORMANCE REVIEW
-----------------------------
ANNUAL PERFORMANCE REVIEW
Period: {reviewPeriod.start} - {reviewPeriod.end}

EMPLOYEE:
Name: {employee.name}
ID: {employee.id}
Title: {employee.title}
Department: {employee.department}
Manager: {employee.manager.name}
Tenure: {employee.tenure} years

OVERALL RATING: {overallRating}/5
{#overallRating >= 4.5}[EXCEPTIONAL PERFORMER]{/}
{#overallRating >= 4 && overallRating < 4.5}[EXCEEDS EXPECTATIONS]{/}
{#overallRating >= 3 && overallRating < 4}[MEETS EXPECTATIONS]{/}
{#overallRating < 3}[NEEDS IMPROVEMENT]{/}

COMPETENCIES:
{#competencies}
{compName}: {compRating}/5
{#compRating >= 4}  -> Strength{/}
{#compRating < 3}  -> Development Area{/}
Comments: {compComments}
{/}

GOALS:
{#goals}
{goalNumber}. {goalDesc}
   Weight: {weight}% | Status: {goalStatus}
   {#goalStatus == "completed"}Achievement: {achievement}%{/}
   {#goalStatus == "in_progress"}Progress: {progress}%{/}
{/}

Weighted Score: {goalsScore}%

KEY ACHIEVEMENTS:
{#achievements}
- {achievementDesc}
  Impact: {impact}
{/}

DEVELOPMENT AREAS:
{#developmentAreas}
- {area}
  Plan: {actionPlan}
  Target: {targetDate}
{/}

COMPENSATION:
{#compRecommendation.meritIncrease > 0}
Merit Increase: {compRecommendation.meritIncrease}%
New Salary: ${compRecommendation.newSalary}
Effective: {compRecommendation.effectiveDate}
{/}
{#compRecommendation.promotionRecommended}
*** PROMOTION RECOMMENDED: {compRecommendation.newTitle} ***
{/}


SECTION 9: SUBSCRIPTION BILLING
-------------------------------
BILLING STATEMENT

Account: {account.id}
Plan: {account.plan.name} ({account.plan.tier})
Period: {billingPeriod.start} - {billingPeriod.end}

BASE CHARGE: ${account.plan.basePrice}/month

USAGE:
{#usageCharges}
{serviceName}: {usage} {unit} @ ${ratePerUnit}/{unit} = ${usage * ratePerUnit}
{#usage > freeAllowance}  (Exceeded free tier by {usage - freeAllowance} {unit}){/}
{/}

{#credits.length > 0}
CREDITS:
{#credits}
{creditDesc}: -${creditAmount}
{/credits}
{/}

SUMMARY:
Current Charges: ${currentTotal}
{#account.credits > 0}Account Credits: -${account.credits}{/}
---
AMOUNT DUE: ${currentTotal - account.credits}

{#account.isAutoPay}
Auto-pay enabled. Card ending in {account.paymentMethod.lastFour} will be charged on {billingPeriod.chargeDate}.
{/}


SECTION 10: PURCHASE ORDER
-------------------------
PURCHASE ORDER #{po.number}
Date: {po.date}
Priority: {po.priority}

REQUESTOR: {po.requestor.name} ({po.requestor.department})

VENDOR:
{vendor.name}
{vendor.address}
Contact: {vendor.contact.name} | {vendor.contact.email}

ITEMS:
{#poItems}
{lineNumber}. {poDesc}
   Qty: {poQty} {poUnit} @ ${poUnitCost} = ${poQty * poUnitCost}
   {#isUrgent}[URGENT]{/}
   {#requiresApproval}[REQUIRES APPROVAL]{/}
{/}

ORDER TOTAL: ${orderTotal}

APPROVALS:
{#approvals}
{level}. {approverName} ({approverTitle})
   {#approvalStatus == "approved"}APPROVED - {approvalDate}{/}
   {#approvalStatus == "pending"}PENDING{/}
   {#approvalStatus == "rejected"}REJECTED: {reason}{/}
{/}

{#allApproved}*** ORDER APPROVED - Ready for Processing ***{/}
{#allApproved == false}*** AWAITING APPROVAL ***{/}


SECTION 11: BACKWARD COMPATIBILITY
----------------------------------
Simple Variables Test:
Hello {firstName} {lastName}!
Your email is {simpleEmail}.

====================================================
END OF TEST DOCUMENT
====================================================
```

## cURL Request

Replace the placeholder values (`YOUR_API_KEY`, `YOUR_ORG_ID`) with your actual credentials:

```bash
curl -X POST https://api.turbodocx.com/v1/deliverables \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "x-rapiddocx-org-id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Example Deliverable",
  "description": "Example showing advance features",
  "templateId": "TemplateID",
  "variables": [
    {
      "placeholder": "{user}",
      "mimeType": "json",
      "value": {
        "firstName": "User001",
        "email": "user001@example.com"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{company}",
      "mimeType": "json",
      "value": {
        "divisions": {
          "engineering": {
            "teamLead": {
              "name": "Lead789",
              "contact": {
                "phone": "+1-555-0100"
              }
            }
          }
        }
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{cart}",
      "mimeType": "json",
      "value": {
        "items": [
          {"id": 1},
          {"id": 2},
          {"id": 3}
        ]
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{products}",
      "mimeType": "json",
      "value": [
        {"name": "Laptop", "price": 999.99},
        {"name": "Mouse", "price": 29.99},
        {"name": "Keyboard", "price": 79.99}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{price}",
      "mimeType": "text",
      "value": 100,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{tax}",
      "mimeType": "text",
      "value": 10,
      "usesAdvancedTemplatingEngine": true
    },
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
    },
    {
      "placeholder": "{basePrice}",
      "mimeType": "text",
      "value": 50,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{quantity}",
      "mimeType": "text",
      "value": 2,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{shipping}",
      "mimeType": "text",
      "value": 15,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{discount}",
      "mimeType": "text",
      "value": 10,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{item}",
      "mimeType": "json",
      "value": {
        "price": 25,
        "quantity": 4
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{originalPrice}",
      "mimeType": "text",
      "value": 200,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{discountPercent}",
      "mimeType": "text",
      "value": 20,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{isActive}",
      "mimeType": "text",
      "value": true,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{isPremium}",
      "mimeType": "text",
      "value": true,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{score}",
      "mimeType": "text",
      "value": 85,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{status}",
      "mimeType": "text",
      "value": "approved",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{age}",
      "mimeType": "text",
      "value": 25,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{hasLicense}",
      "mimeType": "text",
      "value": true,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{userType}",
      "mimeType": "text",
      "value": "employee",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{department}",
      "mimeType": "text",
      "value": "engineering",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{cartItems}",
      "mimeType": "json",
      "value": [
        {"id": 1},
        {"id": 2}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{nickname}",
      "mimeType": "text",
      "value": "Nickname123",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{middleName}",
      "mimeType": "text",
      "value": "",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{productList}",
      "mimeType": "json",
      "value": [
        {"name": "Product A", "price": 29.99},
        {"name": "Product B", "price": 49.99},
        {"name": "Product C", "price": 19.99}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{team}",
      "mimeType": "json",
      "value": [
        {
          "member": {
            "fullName": "Member456",
            "contact": {"email": "member456@company.example"},
            "role": "Senior Developer"
          }
        },
        {
          "member": {
            "fullName": "Member789",
            "contact": {"email": "member789@company.example"},
            "role": "Designer"
          }
        }
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{departments}",
      "mimeType": "json",
      "value": [
        {
          "deptName": "Engineering",
          "employees": [
            {"employeeName": "Employee123", "title": "Developer"},
            {"employeeName": "Manager456", "title": "Manager"}
          ]
        },
        {
          "deptName": "Sales",
          "employees": [
            {"employeeName": "Rep789", "title": "Sales Rep"}
          ]
        }
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{orderItems}",
      "mimeType": "json",
      "value": [
        {"productName": "Widget A", "itemPrice": 25.00, "isOnSale": true, "qty": 10},
        {"productName": "Widget B", "itemPrice": 50.00, "isOnSale": false, "qty": 3}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{lineItems}",
      "mimeType": "json",
      "value": [
        {"description": "Service Fee", "quantity": 1, "unitPrice": 100},
        {"description": "Consulting Hours", "quantity": 5, "unitPrice": 150}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{cond1}",
      "mimeType": "text",
      "value": true,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{cond2}",
      "mimeType": "text",
      "value": true,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{cond3}",
      "mimeType": "text",
      "value": false,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{cond4}",
      "mimeType": "text",
      "value": true,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{invoice}",
      "mimeType": "json",
      "value": {
        "number": "INV-2024-001",
        "date": "2024-01-15",
        "dueDate": "2024-02-15"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{invCustomer}",
      "mimeType": "json",
      "value": {
        "company": "Company XYZ",
        "address": {
          "line1": "123 Business St",
          "line2": "Suite 100",
          "city": "San Francisco",
          "state": "CA",
          "zip": "94105"
        },
        "contact": {
          "name": "Contact001",
          "email": "contact@company-xyz.example"
        }
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{invLineItems}",
      "mimeType": "json",
      "value": [
        {"sku": "PROD-001", "lineDesc": "Professional Services", "lineQty": 10, "linePrice": 150, "isTaxExempt": false},
        {"sku": "PROD-002", "lineDesc": "Software License", "lineQty": 5, "linePrice": 200, "isTaxExempt": true}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{invTotals}",
      "mimeType": "json",
      "value": {
        "subtotal": 2500,
        "hasDiscount": true,
        "discountCode": "SAVE10",
        "discountAmount": 250,
        "grandTotal": 2475
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{taxBreakdown}",
      "mimeType": "json",
      "value": [
        {"taxName": "State Tax", "rate": 8, "taxAmt": 180},
        {"taxName": "County Tax", "rate": 1.5, "taxAmt": 33.75}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{paymentTerms}",
      "mimeType": "text",
      "value": "NET30",
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{invIsPaid}",
      "mimeType": "text",
      "value": false,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{letter}",
      "mimeType": "json",
      "value": {
        "date": "January 15, 2024",
        "responseDeadline": "January 30, 2024",
        "signatory": {
          "name": "Signatory001",
          "title": "VP of Human Resources"
        }
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{candidate}",
      "mimeType": "json",
      "value": {
        "name": "Candidate789"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{position}",
      "mimeType": "json",
      "value": {
        "title": "Senior Software Engineer",
        "department": "Engineering",
        "manager": {
          "name": "Manager001",
          "title": "Engineering Manager"
        },
        "startDate": "February 1, 2024",
        "location": {
          "office": "San Francisco HQ"
        },
        "isHybrid": true,
        "hybridDays": 3,
        "isRemote": false
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{offerCompany}",
      "mimeType": "json",
      "value": {
        "name": "Organization ABC"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{compensation}",
      "mimeType": "json",
      "value": {
        "baseSalary": 150000,
        "payFrequency": "bi-weekly",
        "hasBonus": true,
        "signingBonus": 10000,
        "bonusTarget": 15,
        "hasEquity": true,
        "equityShares": 5000,
        "vestingYears": 4
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{benefits}",
      "mimeType": "json",
      "value": [
        {"benefitName": "Health Insurance", "benefitDesc": "Comprehensive medical, dental, vision"},
        {"benefitName": "401(k)", "benefitDesc": "6% company match"},
        {"benefitName": "PTO", "benefitDesc": "20 days vacation + 10 holidays"}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{relocation}",
      "mimeType": "json",
      "value": {
        "offered": true,
        "allowance": 15000,
        "tempHousing": true,
        "tempHousingDays": 30
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{reviewPeriod}",
      "mimeType": "json",
      "value": {
        "start": "2023-01-01",
        "end": "2023-12-31"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{employee}",
      "mimeType": "json",
      "value": {
        "name": "EMP456",
        "id": "EMP-12345",
        "title": "Senior Developer",
        "department": "Engineering",
        "manager": {
          "name": "Supervisor123"
        },
        "tenure": 3
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{overallRating}",
      "mimeType": "text",
      "value": 4.5,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{competencies}",
      "mimeType": "json",
      "value": [
        {"compName": "Technical Skills", "compRating": 5, "compComments": "Exceptional coding abilities"},
        {"compName": "Communication", "compRating": 4, "compComments": "Strong communicator"},
        {"compName": "Leadership", "compRating": 3, "compComments": "Room for growth"}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{goals}",
      "mimeType": "json",
      "value": [
        {"goalNumber": 1, "goalDesc": "Complete Project X", "weight": 40, "goalStatus": "completed", "achievement": 100},
        {"goalNumber": 2, "goalDesc": "Mentor 2 junior developers", "weight": 30, "goalStatus": "completed", "achievement": 100},
        {"goalNumber": 3, "goalDesc": "Learn new framework", "weight": 30, "goalStatus": "in_progress", "progress": 75}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{goalsScore}",
      "mimeType": "text",
      "value": 92.5,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{achievements}",
      "mimeType": "json",
      "value": [
        {"achievementDesc": "Led migration to microservices architecture", "impact": "Reduced deployment time by 50%"},
        {"achievementDesc": "Implemented automated testing suite", "impact": "Improved code quality metrics by 30%"}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{developmentAreas}",
      "mimeType": "json",
      "value": [
        {"area": "Public speaking", "actionPlan": "Attend public speaking workshop", "targetDate": "Q2 2024"},
        {"area": "Project management", "actionPlan": "Complete project management certification", "targetDate": "Q3 2024"}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{compRecommendation}",
      "mimeType": "json",
      "value": {
        "meritIncrease": 8,
        "newSalary": 162000,
        "effectiveDate": "2024-01-01",
        "promotionRecommended": true,
        "newTitle": "Staff Engineer"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{account}",
      "mimeType": "json",
      "value": {
        "id": "ACC-789456",
        "plan": {
          "name": "Professional",
          "tier": "Pro",
          "basePrice": 99
        },
        "credits": 25,
        "isAutoPay": true,
        "paymentMethod": {
          "lastFour": "1234"
        }
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{billingPeriod}",
      "mimeType": "json",
      "value": {
        "start": "2024-01-01",
        "end": "2024-01-31",
        "chargeDate": "2024-02-01"
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{usageCharges}",
      "mimeType": "json",
      "value": [
        {"serviceName": "API Calls", "usage": 150000, "unit": "calls", "ratePerUnit": 0.001, "freeAllowance": 100000},
        {"serviceName": "Storage", "usage": 500, "unit": "GB", "ratePerUnit": 0.10, "freeAllowance": 100}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{credits}",
      "mimeType": "json",
      "value": [
        {"creditDesc": "Referral bonus", "creditAmount": 10},
        {"creditDesc": "Service credit", "creditAmount": 15}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{currentTotal}",
      "mimeType": "text",
      "value": 249,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{po}",
      "mimeType": "json",
      "value": {
        "number": "PO-2024-0042",
        "date": "2024-01-15",
        "priority": "High",
        "requestor": {
          "name": "Requestor789",
          "department": "IT"
        }
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{vendor}",
      "mimeType": "json",
      "value": {
        "name": "Vendor XYZ Ltd",
        "address": "456 Supplier Blvd, Supply City, SC 12345",
        "contact": {
          "name": "VendorContact456",
          "email": "vendor@supplier-xyz.example"
        }
      },
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{poItems}",
      "mimeType": "json",
      "value": [
        {"lineNumber": 1, "poDesc": "Laptop computers", "poQty": 10, "poUnit": "units", "poUnitCost": 1200, "isUrgent": true, "requiresApproval": true},
        {"lineNumber": 2, "poDesc": "Office chairs", "poQty": 15, "poUnit": "units", "poUnitCost": 300, "isUrgent": false, "requiresApproval": false}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{orderTotal}",
      "mimeType": "text",
      "value": 16500,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{approvals}",
      "mimeType": "json",
      "value": [
        {"level": 1, "approverName": "Approver001", "approverTitle": "Department Manager", "approvalStatus": "approved", "approvalDate": "2024-01-16"},
        {"level": 2, "approverName": "Approver002", "approverTitle": "Finance Director", "approvalStatus": "approved", "approvalDate": "2024-01-17"},
        {"level": 3, "approverName": "Approver003", "approverTitle": "VP Operations", "approvalStatus": "approved", "approvalDate": "2024-01-18"}
      ],
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{allApproved}",
      "mimeType": "text",
      "value": true,
      "usesAdvancedTemplatingEngine": true
    },
    {
      "placeholder": "{firstName}",
      "mimeType": "text",
      "value": "TestUser"
    },
    {
      "placeholder": "{lastName}",
      "mimeType": "text",
      "value": "LastName"
    },
    {
      "placeholder": "{simpleEmail}",
      "mimeType": "text",
      "value": "testuser@example.com"
    }
  ]
}'
```

## Expected Output

When the above template is processed with the provided payload, you will receive a response similar to:

```json
{
  "id": "deliverable-uuid-here",
  "name": "Value Testing with 0",
  "description": "Testing ALL advanced templating features",
  "status": "processing",
  "templateId": "TemplateID",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

The generated document will contain output similar to:

```
ADVANCED TEMPLATING ENGINE - COMPLETE TEST DOCUMENT
====================================================

SECTION 1: NESTED PROPERTY ACCESS
---------------------------------
1.1 Simple Nesting: Hello User001, your email is user001@example.com
1.2 Deep Nesting: Company Lead: Lead789, Phone: +1-555-0100
1.3 Array Length: Total items in cart: 3
1.4 Array Index Access: First product: Laptop, Second price: 29.99, Third: Keyboard


SECTION 2: ARITHMETIC EXPRESSIONS
---------------------------------
2.1 Basic Addition: 100 + 10 = 110
2.2 All Operators:
    - Addition: 10 + 3 = 13
    - Subtraction: 10 - 3 = 7
    - Multiplication: 10 * 3 = 30
    - Division: 10 / 3 = 3.333333333333333
    - Modulo: 10 % 3 = 1
2.3 Complex Expression: (50 * 2) + 15 - 10 = 105
2.4 Nested Property Math: 25 * 4 = 100
2.5 Percentage: 200 - 20% = 160


SECTION 3: CONDITIONAL LOGIC
----------------------------
3.1 Boolean Conditions:
[ACTIVE] Account is Active
[PREMIUM] Premium Member Benefits Applied

3.2 Numeric Comparisons:
Score: 85
Result: Excellent Performance!
Result: Passed

3.3 String Equality:
Status: approved
Decision: Your request has been APPROVED

3.4 Logical AND/OR:
Age: 25, Has License: true
Eligibility: You are eligible to drive

3.5 Nested Conditionals:
User Type: employee, Department: engineering
--- Employee Section ---
Department: Engineering Department Benefits

3.6 Array Length Conditional:
Cart Status: You have 2 items in your cart

3.7 Truthy/Falsy:
Nickname: Nickname123


SECTION 4: LOOPS
----------------
4.1 Simple Loop - Product List:
  - Product A: $29.99
  - Product B: $49.99
  - Product C: $19.99

4.2 Loop with Nested Properties - Team Members:
  Name: Member456
  Email: member456@company.example
  Role: Senior Developer
  ---
  Name: Member789
  Email: member789@company.example
  Role: Designer
  ---

4.3 Nested Loops - Departments & Employees:
DEPARTMENT: Engineering
Employees:
    - Employee123 (Developer)
    - Manager456 (Manager)
DEPARTMENT: Sales
Employees:
    - Rep789 (Sales Rep)

4.4 Loop with Conditionals:
  Product: Widget A - $25.00
  *** SALE ITEM ***
  [Bulk discount applied]
  Product: Widget B - $50.00

4.5 Loop with Arithmetic:
  Service Fee: 1 x $100 = $100
  Consulting Hours: 5 x $150 = $750

SECTION 5: LOGICAL AND/OR
-------------------------
5.1 AND operator
Renders if both conditions are true

5.2 OR operator
Renders if any one condition is true

5.3 PARENTHESES
Complex logic with parentheses


SECTION 6: COMPLETE INVOICE (ALL FEATURES COMBINED)
---------------------------------------------------
INVOICE #INV-2024-001
Date: 2024-01-15
Due Date: 2024-02-15

BILL TO:
Company XYZ
123 Business St
Suite 100
San Francisco, CA 94105
Contact: Contact001 | contact@company-xyz.example

LINE ITEMS:
| PROD-001 | Professional Services | Qty: 10 | $150 | Total: $1500 |
| PROD-002 | Software License | Qty: 5 | $200 | Total: $1000 |
  [TAX EXEMPT]

SUMMARY:
Subtotal: $2500
Discount (SAVE10): -$250

TAX BREAKDOWN:
  State Tax (8%): $180
  County Tax (1.5%): $33.75

-------------------------------------------
TOTAL DUE: $2475
-------------------------------------------

Payment Terms:
Payment due within 30 days

*** PAYMENT DUE - Please remit payment by due date ***


SECTION 7: EMPLOYEE OFFER LETTER
--------------------------------
[COMPANY LETTERHEAD]

Date: January 15, 2024

Dear Candidate789,

We are pleased to offer you the position of Senior Software Engineer in our Engineering department at Organization ABC.

POSITION DETAILS:
Title: Senior Software Engineer
Department: Engineering
Reports To: Manager001, Engineering Manager
Start Date: February 1, 2024
Location: San Francisco HQ
Work Arrangement: Hybrid (3 days in office per week)

COMPENSATION:
Base Salary: $150000 per year (bi-weekly)
Signing Bonus: $10000
Annual Bonus Target: 15% of base salary
Equity: 5000 shares, vesting over 4 years

BENEFITS:
- Health Insurance: Comprehensive medical, dental, vision
- 401(k): 6% company match
- PTO: 20 days vacation + 10 holidays

RELOCATION:
Allowance: $15000
Temporary Housing: 30 days

Please respond by: January 30, 2024

Sincerely,
Signatory001
VP of Human Resources


[... Additional sections continue with populated data ...]


SECTION 11: BACKWARD COMPATIBILITY
----------------------------------
Simple Variables Test:
Hello TestUser LastName!
Your email is testuser@example.com.

====================================================
END OF TEST DOCUMENT
====================================================
```

## Key Points

- **Authorization**: Use `Bearer YOUR_API_KEY` in the Authorization header
- **Organization ID**: Include your organization ID in the `x-rapiddocx-org-id` header
- **Template ID**: Replace `TemplateID` with your actual template ID
- **All Variables**: Must have `usesAdvancedTemplatingEngine: true` with `mimeType: "text"` or `mimeType: "json"` for advanced features.
- **Numeric Values**: Use numbers, not strings, for arithmetic operations


## Related Documentation

- [Advanced Templating Engine](./Advanced%20Templating%20Engine.md)
- [Create a Deliverable](./How%20to%20Create%20a%20Deliverable.md)
- [API Templates](./API%20Templates.md)

---

**Need Help?**
- 📧 Email: support@turbodocx.com
- 💬 Discord Community: https://discord.gg/turbodocx
- 📚 Knowledge Base: https://docs.turbodocx.com
