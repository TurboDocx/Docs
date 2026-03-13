---
title: Deliverable API
sidebar_position: 1
description: Complete guide for the TurboDocx Deliverable API. Create, manage, and download deliverables generated from templates using the v1 API endpoints.
keywords:
  - deliverable api
  - document generation api
  - create deliverable
  - template to document
  - v1 api
  - turbodocx api
  - document automation
  - api integration
  - deliverable management
  - file download api
  - pdf generation
  - deliverable items
  - bearer token authentication
  - api examples
  - variable substitution
  - document workflow api
  - api tutorial
  - postman examples
  - curl examples
  - javascript api
  - python api
  - nodejs api
  - php api
---

import ScriptLoader from '@site/src/components/ScriptLoader';

# Deliverable API

This guide covers the TurboDocx Deliverable API — everything you need to programmatically generate documents from templates, manage deliverables, and download files using the v1 API endpoints.

## Overview

A **deliverable** is a document generated from a template by substituting variables with actual content. The Deliverable API lets you automate the entire document lifecycle: creation, retrieval, updates, downloads, and organization.

### Key Features

- **Template-Based Generation**: Create documents by injecting variables into pre-configured templates
- **Variable Substitution**: Support for text, rich text, images, and markdown content types
- **Automatic PDF Generation**: PDFs are generated automatically when a deliverable is created
- **File Downloads**: Download source files (DOCX/PPTX) or generated PDFs
- **Tagging & Filtering**: Tag deliverables and filter by tags, search queries, and more
- **Pagination & Sorting**: Built-in pagination and column sorting for list endpoints

:::tip Prefer using an SDK?
We offer official SDKs that handle authentication, error handling, and type safety for you.

[View all SDKs →](/docs/SDKs)
:::

## TLDR; Quick Start

Here's the fastest way to create a deliverable and download it:

```bash
# 1. Create a deliverable from a template
curl -X POST "https://api.turbodocx.com/v1/deliverable" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "YOUR_TEMPLATE_ID",
    "name": "My Document",
    "variables": [
      {
        "placeholder": "{CompanyName}",
        "text": "Acme Corporation",
        "mimeType": "text"
      }
    ]
  }'

# 2. Download the source file (DOCX/PPTX)
curl -X GET "https://api.turbodocx.com/v1/deliverable/file/DELIVERABLE_ID" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  --output "my-document.docx"

# 3. Download the PDF
curl -X GET "https://api.turbodocx.com/v1/deliverable/file/pdf/DELIVERABLE_ID" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  --output "my-document.pdf"
```

### All Endpoints at a Glance

| Method   | Endpoint                                | Description                          |
| -------- | --------------------------------------- | ------------------------------------ |
| `GET`    | `/v1/deliverable`                       | List deliverables                    |
| `POST`   | `/v1/deliverable`                       | Create deliverable from template     |
| `GET`    | `/v1/deliverable/:id`                   | Get a single deliverable             |
| `PATCH`  | `/v1/deliverable/:id`                   | Update a deliverable                 |
| `DELETE` | `/v1/deliverable/:id`                   | Delete a deliverable (soft delete)   |
| `GET`    | `/v1/deliverable/file/:deliverableId`   | Download source file (DOCX/PPTX)    |
| `GET`    | `/v1/deliverable/file/pdf/:deliverableId` | Download PDF file                  |
| `GET`    | `/v1/deliverable-item`                  | List deliverable items               |
| `GET`    | `/v1/deliverable-item/:id`              | Get a single deliverable item        |

## Prerequisites

Before you begin, ensure you have:

- **API Access Token**: Bearer token for authentication
- **Organization ID**: Your organization identifier
- **A Template**: At least one uploaded template with extracted variables

### Getting Your Credentials

1. **Login to TurboDocx**: Visit [https://www.turbodocx.com](https://www.turbodocx.com)
2. **Navigate to Settings**: Access your organization settings
3. **API Keys Section**: Generate or retrieve your API access token
4. **Organization ID**: Copy your organization ID from the settings

## Authentication

All Deliverable API requests require authentication using a Bearer token and your organization ID.

### Required Headers

| Header                | Value                      | Required | Description                        |
| --------------------- | -------------------------- | -------- | ---------------------------------- |
| `Authorization`       | `Bearer YOUR_API_TOKEN`    | Yes      | Your API access token              |
| `x-rapiddocx-org-id`  | `YOUR_ORGANIZATION_ID`     | Yes      | Your organization identifier       |
| `Content-Type`        | `application/json`         | Yes*     | Required for POST and PATCH requests |
| `User-Agent`          | `TurboDocx API Client`     | No       | Recommended for identification     |

```http
Authorization: Bearer YOUR_API_TOKEN
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
Content-Type: application/json
```

:::caution Keep Your Tokens Secure
Never expose your API tokens in client-side code or public repositories. Always use environment variables or a secrets manager to store credentials.
:::

---

## Endpoint 1: List Deliverables

Retrieve a paginated list of deliverables in your organization, with optional filtering and sorting.

### Endpoint

```http
GET https://api.turbodocx.com/v1/deliverable
```

### Query Parameters

| Parameter       | Type            | Required | Default | Description                                    |
| --------------- | --------------- | -------- | ------- | ---------------------------------------------- |
| `limit`         | Integer         | No       | 6       | Number of results per page (1–100)             |
| `offset`        | Integer         | No       | 0       | Number of results to skip for pagination       |
| `query`         | String          | No       | —       | Search query to filter by name                 |
| `showTags`      | Boolean         | No       | false   | Include tags in the response                   |
| `column0`       | String          | No       | —       | Sort column: `createdOn`, `email`, `name`, `updatedOn` |
| `order0`        | String          | No       | —       | Sort direction: `asc` or `desc`                |

### Example Request

```bash
curl -X GET "https://api.turbodocx.com/v1/deliverable?limit=10&offset=0&showTags=true" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID"
```

### Response

```json
{
  "data": {
    "results": [
      {
        "id": "39697685-ca00-43b8-92b8-7722544c574f",
        "name": "Employee Contract - John Smith",
        "description": "Employment contract for senior developer",
        "templateId": "0b1099cf-d7b9-41a4-822b-51b68fd4885a",
        "createdBy": "user-uuid-123",
        "email": "admin@company.com",
        "fileSize": 287456,
        "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "defaultFont": "Arial",
        "fonts": [{ "name": "Arial", "usage": "body" }],
        "isActive": true,
        "createdOn": "2024-01-15T14:12:10.721Z",
        "updatedOn": "2024-01-15T14:13:45.724Z",
        "tags": [
          {
            "id": "tag-uuid-1",
            "name": "hr"
          },
          {
            "id": "tag-uuid-2",
            "name": "contract"
          }
        ]
      }
    ],
    "totalRecords": 42
  }
}
```

### Response Fields

| Field                    | Type      | Description                                      |
| ------------------------ | --------- | ------------------------------------------------ |
| `data.results`           | Array     | Array of deliverable objects                     |
| `data.totalRecords`      | Integer   | Total number of deliverables matching the query  |
| `results[].id`           | String    | Unique deliverable identifier (UUID)             |
| `results[].name`         | String    | Deliverable name                                 |
| `results[].description`  | String    | Deliverable description                          |
| `results[].templateId`   | String    | Template used for generation                     |
| `results[].createdBy`    | String    | User ID of the creator                           |
| `results[].email`        | String    | Email of the creator                             |
| `results[].fileSize`     | Integer   | File size in bytes                               |
| `results[].fileType`     | String    | MIME type of the generated file                  |
| `results[].defaultFont`  | String    | Default font used                                |
| `results[].fonts`        | JSON      | Array of font objects with `name` and `usage`    |
| `results[].isActive`     | Boolean   | Whether the deliverable is active (not deleted)  |
| `results[].createdOn`    | String    | ISO 8601 creation timestamp                      |
| `results[].updatedOn`    | String    | ISO 8601 last update timestamp                   |
| `results[].tags`         | Array     | Tags (only when `showTags=true`)                 |

---

## Endpoint 2: Create Deliverable

Generate a new deliverable document by injecting variables into a template. This is the primary endpoint for document generation.

### Endpoint

```http
POST https://api.turbodocx.com/v1/deliverable
```

:::important Authorization Required
This endpoint requires one of these roles: **administrator**, **contributor**, or **user**. It also checks your organization's deliverable and storage limits.
:::

### Request Body

| Field                | Type    | Required | Description                                          |
| -------------------- | ------- | -------- | ---------------------------------------------------- |
| `name`               | String  | **Yes**  | Deliverable name (3–255 characters)                  |
| `templateId`         | String  | **Yes**  | Template ID to generate from                         |
| `variables`          | Array   | **Yes**  | Array of variable objects for substitution            |
| `description`        | String  | No       | Description (up to 65,535 characters)                |
| `tags`               | Array   | No       | Array of tag strings to associate                    |

### Variable Object Structure

Each variable in the `variables` array represents a placeholder in the template to be substituted:

| Field                    | Type           | Required | Description                                      |
| ------------------------ | -------------- | -------- | ------------------------------------------------ |
| `placeholder`            | String         | Yes      | Template placeholder (e.g., `{CompanyName}`)     |
| `text`                   | String         | Yes*     | Value to inject (* not required if `variableStack` is provided or `isDisabled` is true) |
| `mimeType`               | String         | Yes      | Content type: `text`, `html`, `image`, or `markdown` |
| `isDisabled`             | Boolean        | No       | Skip this variable during generation             |
| `subvariables`           | Array          | No       | Nested sub-variables (for HTML content with dynamic placeholders) |
| `variableStack`          | Array or Object| No       | Multiple instances (for repeating content)       |
| `aiPrompt`               | String         | No       | AI prompt for content generation (max 16,000 chars) |

### Example Request

```json
{
  "templateId": "YOUR_TEMPLATE_ID",
  "name": "Employee Contract - John Smith",
  "description": "Employment contract for new senior developer",
  "variables": [
    {
      "placeholder": "{EmployeeName}",
      "text": "John Smith",
      "mimeType": "text"
    },
    {
      "placeholder": "{CompanyName}",
      "text": "TechCorp Solutions Inc.",
      "mimeType": "text"
    },
    {
      "placeholder": "{JobTitle}",
      "text": "Senior Software Engineer",
      "mimeType": "text"
    },
    {
      "mimeType": "html",
      "placeholder": "{ContactBlock}",
      "text": "<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>",
      "subvariables": [
        { "placeholder": "{contactName}", "text": "Jane Doe", "mimeType": "text" },
        { "placeholder": "{contactPhone}", "text": "(555) 123-4567", "mimeType": "text" }
      ]
    }
  ],
  "tags": ["hr", "contract", "employee"]
}
```

### Example with Variable Stacks (Repeating Content)

Variable stacks allow you to inject multiple instances of a variable — useful for tables, lists, or repeating sections:

```json
{
  "templateId": "YOUR_TEMPLATE_ID",
  "name": "Project Report",
  "variables": [
    {
      "placeholder": "{ProjectPhase}",
      "mimeType": "html",
      "variableStack": {
        "0": { "text": "<p><strong>Phase 1:</strong> Assess environment</p>", "mimeType": "html" },
        "1": { "text": "<p><strong>Phase 2:</strong> Remediate findings</p>", "mimeType": "html" },
        "2": { "text": "<p><strong>Phase 3:</strong> Continue monitoring</p>", "mimeType": "html" }
      }
    }
  ]
}
```

### Response

```json
{
  "data": {
    "results": {
      "deliverable": {
        "id": "39697685-ca00-43b8-92b8-7722544c574f",
        "name": "Employee Contract - John Smith",
        "description": "Employment contract for new senior developer",
        "templateId": "0b1099cf-d7b9-41a4-822b-51b68fd4885a",
        "createdBy": "user-uuid-123",
        "createdOn": "2024-01-15T14:12:10.721Z",
        "updatedOn": "2024-01-15T14:12:10.721Z",
        "isActive": true,
        "defaultFont": "",
        "fonts": null
      }
    }
  }
}
```

### Response Fields

| Field                          | Type    | Description                              |
| ------------------------------ | ------- | ---------------------------------------- |
| `data.results.deliverable`     | Object  | The created deliverable object           |
| `deliverable.id`               | String  | Unique deliverable identifier (UUID)     |
| `deliverable.name`             | String  | Deliverable name                         |
| `deliverable.description`      | String  | Deliverable description                  |
| `deliverable.templateId`       | String  | Template used for generation             |
| `deliverable.createdBy`        | String  | User ID of the creator                   |
| `deliverable.createdOn`        | String  | ISO 8601 creation timestamp              |
| `deliverable.updatedOn`        | String  | ISO 8601 last update timestamp           |
| `deliverable.isActive`         | Boolean | Active status (always `true` on creation)|
| `deliverable.defaultFont`      | String  | Default font (empty string if not specified) |
| `deliverable.fonts`            | JSON    | Font metadata array (null if not yet generated) |

:::info Request Cancellation
If the client disconnects during generation, the server will detect the cancellation, clean up any partially created resources, and return a `499` status code. This prevents orphaned deliverables from consuming storage.
:::

---

## Endpoint 3: Get Deliverable

Retrieve a single deliverable by ID, including its variables and optionally tags.

### Endpoint

```http
GET https://api.turbodocx.com/v1/deliverable/:id
```

### Path Parameters

| Parameter | Type          | Required | Description                          |
| --------- | ------------- | -------- | ------------------------------------ |
| `id`      | String (UUID) | Yes      | The unique identifier of the deliverable |

### Query Parameters

| Parameter  | Type    | Required | Description                 |
| ---------- | ------- | -------- | --------------------------- |
| `showTags` | Boolean | No       | Include tags in the response |

### Example Request

```bash
curl -X GET "https://api.turbodocx.com/v1/deliverable/39697685-ca00-43b8-92b8-7722544c574f?showTags=true" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID"
```

### Response

```json
{
  "data": {
    "results": {
      "id": "39697685-ca00-43b8-92b8-7722544c574f",
      "name": "Employee Contract - John Smith",
      "description": "Employment contract for new senior developer",
      "templateId": "0b1099cf-d7b9-41a4-822b-51b68fd4885a",
      "templateName": "Employment Contract Template",
      "templateNotDeleted": true,
      "defaultFont": "Arial",
      "fonts": [{ "name": "Arial", "usage": "body" }],
      "email": "admin@company.com",
      "fileSize": 287456,
      "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "isActive": true,
      "createdOn": "2024-01-15T14:12:10.721Z",
      "updatedOn": "2024-01-15T14:13:45.724Z",
      "variables": [
        {
          "placeholder": "{EmployeeName}",
          "text": "John Smith",
          "mimeType": "text"
        }
      ],
      "tags": [
        { "id": "tag-uuid-1", "name": "hr" },
        { "id": "tag-uuid-2", "name": "contract" }
      ]
    }
  }
}
```

### Response Fields

| Field                    | Type    | Description                                        |
| ------------------------ | ------- | -------------------------------------------------- |
| `results.id`             | String  | Unique deliverable identifier                      |
| `results.name`           | String  | Deliverable name                                   |
| `results.description`    | String  | Deliverable description                            |
| `results.templateId`     | String  | Template ID used for generation                    |
| `results.templateName`   | String  | Template name                                      |
| `results.templateNotDeleted` | Boolean | Whether the source template still exists       |
| `results.defaultFont`    | String  | Default font used                                  |
| `results.fonts`          | JSON    | Array of font objects with `name` and `usage`      |
| `results.email`          | String  | Creator's email                                    |
| `results.fileSize`       | Integer | File size in bytes                                 |
| `results.fileType`       | String  | MIME type of the generated file                    |
| `results.isActive`       | Boolean | Active status                                      |
| `results.createdOn`      | String  | ISO 8601 creation timestamp                        |
| `results.updatedOn`      | String  | ISO 8601 last update timestamp                     |
| `results.variables`      | Array   | Parsed variable objects with values                |
| `results.tags`           | Array   | Tags (only when `showTags=true`)                   |

---

## Endpoint 4: Update Deliverable

Update an existing deliverable's metadata or tags. All fields are optional — only include the fields you want to change.

### Endpoint

```http
PATCH https://api.turbodocx.com/v1/deliverable/:id
```

:::important Authorization Required
This endpoint requires one of these roles: **administrator**, **contributor**, or **user**.
:::

### Path Parameters

| Parameter | Type          | Required | Description                          |
| --------- | ------------- | -------- | ------------------------------------ |
| `id`      | String (UUID) | Yes      | The unique identifier of the deliverable |

### Request Body

| Field                | Type   | Required | Description                                          |
| -------------------- | ------ | -------- | ---------------------------------------------------- |
| `name`               | String | No       | Updated name (3–255 characters)                      |
| `description`        | String | No       | Updated description (up to 65,535 characters)        |
| `tags`               | Array  | No       | Replace all tags (existing tags are removed first)   |

:::caution Tag Replacement
When you provide `tags` in the update request, **all existing tags are replaced**. To add a tag, you must include the full list of desired tags. To remove all tags, pass an empty array.
:::

### Example Request

```bash
curl -X PATCH "https://api.turbodocx.com/v1/deliverable/39697685-ca00-43b8-92b8-7722544c574f" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee Contract - John Smith (Final)",
    "tags": ["hr", "contract", "finalized"]
  }'
```

### Response

```json
{
  "data": {
    "message": "Deliverable updated successfully",
    "deliverableId": "39697685-ca00-43b8-92b8-7722544c574f"
  }
}
```

### Response Fields

| Field               | Type   | Description                          |
| ------------------- | ------ | ------------------------------------ |
| `data.message`      | String | Success confirmation message         |
| `data.deliverableId`| String | ID of the updated deliverable        |

---

## Endpoint 5: Delete Deliverable

Soft-delete a deliverable. The deliverable is marked as inactive and will no longer appear in list results, but its data is retained.

### Endpoint

```http
DELETE https://api.turbodocx.com/v1/deliverable/:id
```

:::important Authorization Required
This endpoint requires one of these roles: **administrator**, **contributor**, or **user**.
:::

### Path Parameters

| Parameter | Type          | Required | Description                          |
| --------- | ------------- | -------- | ------------------------------------ |
| `id`      | String (UUID) | Yes      | The unique identifier of the deliverable |

### Example Request

```bash
curl -X DELETE "https://api.turbodocx.com/v1/deliverable/39697685-ca00-43b8-92b8-7722544c574f" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID"
```

### Response

```json
{
  "data": {
    "message": "Deliverable deleted successfully",
    "deliverableId": "39697685-ca00-43b8-92b8-7722544c574f"
  }
}
```

### Response Fields

| Field               | Type   | Description                          |
| ------------------- | ------ | ------------------------------------ |
| `data.message`      | String | Success confirmation message         |
| `data.deliverableId`| String | ID of the deleted deliverable        |

---

## Endpoint 6: Download Source File (DOCX/PPTX)

Download the original generated document file in its source format (DOCX or PPTX).

### Endpoint

```http
GET https://api.turbodocx.com/v1/deliverable/file/:deliverableId
```

:::important Feature & Authorization Required
This endpoint requires:
- **Role**: administrator, contributor, or user
- **License feature**: `hasFileDownload` must be enabled for your organization
:::

### Path Parameters

| Parameter       | Type          | Required | Description                          |
| --------------- | ------------- | -------- | ------------------------------------ |
| `deliverableId` | String (UUID) | Yes      | The unique identifier of the deliverable |

### Example Request

```bash
curl -X GET "https://api.turbodocx.com/v1/deliverable/file/39697685-ca00-43b8-92b8-7722544c574f" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  --output "employee-contract.docx"
```

### Response

Returns the binary content of the generated document with appropriate headers:

```http
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="Employee Contract - John Smith.docx"
```

For PowerPoint templates, the content type will be:

```http
Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation
```

---

## Endpoint 7: Download PDF File

Download the PDF version of a generated deliverable.

### Endpoint

```http
GET https://api.turbodocx.com/v1/deliverable/file/pdf/:deliverableId
```

:::important Authorization Required
This endpoint requires one of these roles: **administrator**, **contributor**, or **user**.
:::

### Path Parameters

| Parameter       | Type          | Required | Description                          |
| --------------- | ------------- | -------- | ------------------------------------ |
| `deliverableId` | String (UUID) | Yes      | The unique identifier of the deliverable |

### Example Request

```bash
curl -X GET "https://api.turbodocx.com/v1/deliverable/file/pdf/39697685-ca00-43b8-92b8-7722544c574f" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  --output "employee-contract.pdf"
```

### Response

Returns the binary PDF content:

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="Employee Contract - John Smith.pdf"
```

---

## Endpoint 8: List Deliverable Items

Deliverable Items provide a unified view of deliverables, allowing you to browse your deliverable library.

### Endpoint

```http
GET https://api.turbodocx.com/v1/deliverable-item
```

### Query Parameters

| Parameter       | Type            | Required | Default | Description                                    |
| --------------- | --------------- | -------- | ------- | ---------------------------------------------- |
| `limit`         | Integer         | No       | 6       | Number of results per page                     |
| `offset`        | Integer         | No       | 0       | Number of results to skip                      |
| `query`         | String          | No       | —       | Search query to filter by name                 |
| `showTags`      | Boolean         | No       | false   | Include tags in the response                   |
| `selectedTags`  | String or Array | No       | —       | Filter by tag IDs (all must match — AND logic) |
| `column0`       | String          | No       | —       | Sort column: `createdOn`, `email`, `name`, `updatedOn` |
| `order0`        | String          | No       | —       | Sort direction: `asc` or `desc`                |

### Example Request

```bash
curl -X GET "https://api.turbodocx.com/v1/deliverable-item?limit=10&showTags=true" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID"
```

### Response

```json
{
  "data": {
    "results": [
      {
        "id": "39697685-ca00-43b8-92b8-7722544c574f",
        "name": "Employee Contract - John Smith",
        "description": "Employment contract",
        "type": "deliverable",
        "createdOn": "2024-01-15T14:12:10.721Z",
        "updatedOn": "2024-01-15T14:13:45.724Z",
        "isActive": true,
        "createdBy": "user-uuid-123",
        "email": "admin@company.com",
        "fileSize": 287456,
        "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "deliverableCount": 0,
        "templateNotDeleted": true,
        "tags": [
          { "id": "tag-uuid-1", "name": "hr" }
        ]
      }
    ],
    "totalRecords": 25
  }
}
```

### Response Fields

| Field                        | Type    | Description                                          |
| ---------------------------- | ------- | ---------------------------------------------------- |
| `data.results`               | Array   | Array of deliverable item objects                    |
| `data.totalRecords`          | Integer | Total matching items                                 |
| `results[].id`               | String  | Item identifier (UUID)                               |
| `results[].name`             | String  | Item name                                            |
| `results[].description`      | String  | Item description                                     |
| `results[].type`             | String  | Item type (always `"deliverable"`)                   |
| `results[].createdOn`        | String  | ISO 8601 creation timestamp                          |
| `results[].updatedOn`        | String  | ISO 8601 last update timestamp                       |
| `results[].isActive`         | Boolean | Active status                                        |
| `results[].createdBy`        | String  | Creator user ID                                      |
| `results[].email`            | String  | Creator email                                        |
| `results[].fileSize`         | Integer | File size (deliverables only)                        |
| `results[].fileType`         | String  | MIME type (deliverables only)                        |
| `results[].deliverableCount` | Integer | Number of deliverables                               |
| `results[].templateNotDeleted` | Boolean | Source template exists (deliverables only)          |
| `results[].tags`             | Array   | Tags (only when `showTags=true`)                     |

---

## Endpoint 9: Get Deliverable Item

Retrieve a single deliverable item by ID.

### Endpoint

```http
GET https://api.turbodocx.com/v1/deliverable-item/:id
```

### Path Parameters

| Parameter | Type          | Required | Description                     |
| --------- | ------------- | -------- | ------------------------------- |
| `id`      | String (UUID) | Yes      | The item identifier             |

### Query Parameters

Same as [List Deliverable Items](#endpoint-8-list-deliverable-items).

### Example Request

```bash
curl -X GET "https://api.turbodocx.com/v1/deliverable-item/39697685-ca00-43b8-92b8-7722544c574f?showTags=true" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID"
```

### Response

```json
{
  "data": {
    "results": {
      "id": "39697685-ca00-43b8-92b8-7722544c574f",
      "name": "Employee Contract - John Smith",
      "description": "Employment contract",
      "type": "deliverable",
      "createdOn": "2024-01-15T14:12:10.721Z",
      "updatedOn": "2024-01-15T14:13:45.724Z",
      "isActive": true,
      "createdBy": "user-uuid-123",
      "email": "admin@company.com",
      "fileSize": 287456,
      "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "deliverableCount": 0,
      "tags": []
    },
    "type": "deliverable"
  }
}
```

### Response Fields

| Field               | Type    | Description                                        |
| ------------------- | ------- | -------------------------------------------------- |
| `data.results`      | Object  | The deliverable item object                        |
| `data.type`         | String  | Item type                                          |

All other fields match the [List Deliverable Items](#endpoint-8-list-deliverable-items) response.

---

## Complete Workflow Example

Here's a full workflow that creates a deliverable, retrieves it, and downloads both the source file and PDF:

<ScriptLoader
  scriptPath="templates/api/generate-deliverable"
  id="complete-workflow"
  label="Complete Workflow - Code Examples"
/>

---

## Best Practices

### Variable Preparation
- Always match `placeholder` values exactly with your template placeholders (e.g., `{CompanyName}`)
- Use `subvariables` for structured data within HTML content — the parent variable must have `mimeType: "html"` with HTML containing independent placeholder tokens, and each subvariable provides a value for one of those tokens
- Use `variableStack` for repeating content (tables, list items)
- Set `mimeType` to `html` when injecting formatted content

### Pagination
- Use `limit` and `offset` for efficient data retrieval
- The default `limit` is 6; set it up to 100 for larger result sets
- Use `totalRecords` from the response to calculate total pages

### Tag Filtering
- When passing `selectedTags`, all specified tags must match (AND logic)
- Tags can be passed as a single UUID string or an array of UUIDs

### Error Handling
- Always check the HTTP status code before parsing the response body
- Implement retry logic with exponential backoff for `5xx` errors
- Handle `499` (Client Closed Request) gracefully — the server has already cleaned up

---

## Error Handling

### HTTP Status Codes

| Status | Description                   | Common Cause                                     |
| ------ | ----------------------------- | ------------------------------------------------ |
| `200`  | Success                       | Request completed successfully                   |
| `400`  | Bad Request                   | Validation error — check required fields and types |
| `401`  | Unauthorized                  | Invalid or missing Bearer token                  |
| `403`  | Forbidden                     | Missing role permission or invalid org ID        |
| `404`  | Not Found                     | Deliverable or template ID does not exist        |
| `422`  | Unprocessable Entity          | Field constraint violation                       |
| `429`  | Too Many Requests             | Rate limit exceeded — use exponential backoff    |
| `499`  | Client Closed Request         | Request cancelled during deliverable generation  |
| `500`  | Internal Server Error         | Server-side error — contact support              |

### Error Response Format

```json
{
  "error": "ValidationError",
  "message": "\"name\" length must be at least 3 characters long"
}
```

### Common Issues

**Variable validation errors**
- Ensure `text` is provided for each variable (unless `variableStack` is present or `isDisabled` is true)
- Check that `mimeType` is one of: `text`, `html`, `image`, `markdown`
- When using `html` mimeType with subvariables, ensure the parent `text` contains the subvariable placeholder tokens

**Template not found**
- Verify the `templateId` exists and has been fully processed (placeholders extracted)
- Templates must be active (not deleted)

**License limit exceeded**
- Your organization may have reached its deliverable or storage quota
- Contact your administrator to upgrade your plan

**File download permission errors**
- Source file download (`/v1/deliverable/file/:id`) requires the `hasFileDownload` feature to be enabled on your organization's license
- Ensure your user role is administrator, contributor, or user (viewers cannot download)
