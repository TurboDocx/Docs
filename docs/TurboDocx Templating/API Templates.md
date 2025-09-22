---
title: Template Generation API Integration
sidebar_position: 1
description: Complete guide for integrating Template Generation API to upload templates, browse existing templates, and generate deliverables. Learn the dual-path process with detailed examples and code samples.
keywords:
  - template generation api
  - document template api
  - template upload api
  - template browsing api
  - deliverable generation api
  - api integration
  - document generation workflow
  - turbodocx api
  - template api endpoints
  - api authentication
  - document processing api
  - api tutorial
  - template api examples
  - postman examples
  - curl examples
  - javascript api
  - python api
  - nodejs api
  - php api
  - template automation
  - document workflow api
  - template integration
  - api best practices
  - api troubleshooting
  - bearer token authentication
---

import ScriptLoader from '@site/src/components/ScriptLoader';

# Template Generation API Integration

This comprehensive guide walks you through the Template Generation API integration process. Learn how to programmatically upload new templates or select existing ones, then generate beautiful documents with variable substitution using our RESTful API.

![Template Generation API Integration Overview](/img/template-generation-api/banner.gif)

## Overview

The Template Generation API offers **two flexible paths** to document creation, because we believe in choice (and because forcing everyone down one path would be like making everyone eat vanilla ice cream forever):

### **Path A: Upload New Template**

1. **Upload & Create** - Upload your .docx/.pptx template and extract variables automatically
2. **Generate Document** - Fill variables and create your deliverable

### **Path B: Select Existing Template**

1. **Browse Templates** - Explore your template library with search and filtering
2. **Template Details** - Load template variables and preview PDF
3. **Generate Document** - Fill variables and create your deliverable

![Template Generation API Workflow](/img/template-generation-api/options.png)

### Key Features

- **RESTful API**: Standard HTTP methods with JSON and multipart payloads
- **Bearer Token Authentication**: Secure API access using JWT tokens
- **Dual Entry Points**: Start fresh with uploads OR use existing templates
- **Smart Variable Extraction**: Automatic detection of placeholders in uploaded documents
- **Rich Variable Types**: Support for text, subvariables, stacks, and AI-powered content
- **Template Library**: Full CRUD operations with search, filtering, and organization
- **Real-time Processing**: Track document generation status throughout the process

## TLDR; Complete Working Examples 🚀

Don't want to read the novel? Here's the executive summary:

### Available Variable Types

| Type            | Description                   | Example Placeholder    | Use Case                    |
| --------------- | ----------------------------- | ---------------------- | --------------------------- |
| `text`          | Simple text replacement       | `{CompanyName}`        | Basic text substitution     |
| `subvariables`  | Nested variable structures    | `{Employee.FirstName}` | Complex hierarchical data   |
| `variableStack` | Multiple instances of content | `{Projects[0].Name}`   | Repeating sections, lists   |
| `richText`      | HTML/formatted text content   | `{Description}`        | Formatted text with styling |

### Complete Dual-Path Workflow

<ScriptLoader
  scriptPath="templates/api/complete-workflows"
  id="complete-workflow-examples"
  label="Complete Workflow Implementation (Both Paths)"
/>

### Quick Variable Structure Example

Here's what a complex variable payload looks like:

```json
{
  "templateId": "abc123-def456-ghi789",
  "name": "Employee Contract Draft",
  "description": "Generated contract for new hire",
  "variables": [
    {
      "name": "Employee",
      "placeholder": "{Employee}",
      "text": "John Smith",
      "subvariables": [
        {
          "placeholder": "{Employee.Title}",
          "text": "Senior Developer"
        },
        {
          "placeholder": "{Employee.StartDate}",
          "text": "2024-01-15"
        }
      ]
    },
    {
      "name": "Projects",
      "placeholder": "{Projects}",
      "variableStack": {
        "0": {
          "text": "Project Alpha - Backend Development",
          "subvariables": [
            {
              "placeholder": "{Projects.Duration}",
              "text": "6 months"
            }
          ]
        },
        "1": {
          "text": "Project Beta - API Integration",
          "subvariables": [
            {
              "placeholder": "{Projects.Duration}",
              "text": "3 months"
            }
          ]
        }
      }
    }
  ]
}
```

Now let's dive into the template wizardry...

## Prerequisites

Before you begin your journey into template automation nirvana, ensure you have:

- **API Access Token**: Bearer token for authentication
- **Organization ID**: Your organization identifier
- **Template Files**: .docx or .pptx files with placeholder variables (for uploads)

### Getting Your Credentials

1. **Login to TurboDocx**: Visit [https://www.turbodocx.com](https://www.turbodocx.com)
2. **Navigate to Settings**: Access your organization settings
3. **API Keys Section**: Generate or retrieve your API access token
4. **Organization ID**: Copy your organization ID from the settings

![Template API Credentials](/img/turbosign/api/api-key.png)
![Organization ID Location](/img/turbosign/api/org-id.png)

## Authentication

All Template Generation API requests require authentication using a Bearer token in the Authorization header:

```http
Authorization: Bearer YOUR_API_TOKEN
```

Additional required headers for all requests:

```http
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
User-Agent: TurboDocx API Client
```

## Path A: Upload New Template

Start fresh by uploading a new template document. This path is perfect when you've crafted a beautiful new template and want to jump straight into document generation.

### Endpoint

```http
POST https://api.turbodocx.com/template/upload-and-create
```

### Headers

```http
Content-Type: multipart/form-data
Authorization: Bearer YOUR_API_TOKEN
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
User-Agent: TurboDocx API Client
```

### Request Body (Form Data)

```javascript
{
  "templateFile": [DOCX_OR_PPTX_FILE_BINARY],
  "name": "Employee Contract Template",
  "description": "Standard employee contract with variable placeholders",
}
```

### Response

```json
{
  "data": {
    "results": {
      "template": {
        "name": "Employee Contract Template",
        "description": "Standard employee contract with variable placeholders",
        "fonts": [
          {
            "name": "Arial",
            "usage": 269
          },
          {
            "name": "Calibri",
            "usage": 45
          }
        ],
        "defaultFont": "Arial",
        "orgId": "2d66ecf0-a749-475d-9403-9956d0f67884",
        "createdBy": "9d829e80-1135-4a97-93ea-cc2a1eecc9da",
        "createdOn": "2025-09-19T15:45:47.000Z",
        "updatedOn": "2025-09-19T15:45:47.000Z",
        "isActive": 1,
        "id": "31cc4cce-4ed7-4f3b-aa80-0b9a4f995412",
        "variables": null,
        "projectspaceId": null,
        "templateFolderId": null,
        "metadata": null
      },
      "redirectUrl": "/templates/31cc4cce-4ed7-4f3b-aa80-0b9a4f995412/generate"
    }
  }
}
```

### Response Fields

| Field                                    | Type         | Description                                     |
| ---------------------------------------- | ------------ | ----------------------------------------------- |
| `data.results.template.id`               | string       | Unique template identifier (use for generation) |
| `data.results.template.name`             | string       | Template name as provided                       |
| `data.results.template.description`      | string       | Template description                            |
| `data.results.template.fonts`            | array        | Array of font objects with name and usage       |
| `data.results.template.defaultFont`      | string       | Default font name for the template              |
| `data.results.template.orgId`            | string       | Organization ID                                 |
| `data.results.template.createdBy`        | string       | User ID who created the template                |
| `data.results.template.createdOn`        | string       | ISO timestamp of template creation              |
| `data.results.template.updatedOn`        | string       | ISO timestamp of last template update           |
| `data.results.template.isActive`         | number       | Active status (1 = active, 0 = inactive)        |
| `data.results.template.variables`        | array\|null  | Auto-extracted variables (null if none found)   |
| `data.results.template.projectspaceId`   | string\|null | Project space ID (null if not assigned)         |
| `data.results.template.templateFolderId` | string\|null | Folder ID (null if not in folder)               |
| `data.results.template.metadata`         | object\|null | Additional metadata (null if not set)           |
| `data.results.redirectUrl`               | string       | Frontend URL to redirect for variable filling   |

### Deliverable Response Fields

| Field                                 | Type    | Description                      |
| ------------------------------------- | ------- | -------------------------------- |
| `data.results.deliverable.id`         | string  | Unique deliverable identifier    |
| `data.results.deliverable.name`       | string  | Deliverable name as provided     |
| `data.results.deliverable.createdBy`  | string  | Email of the user who created it |
| `data.results.deliverable.createdOn`  | string  | ISO timestamp of creation        |
| `data.results.deliverable.orgId`      | string  | Organization ID                  |
| `data.results.deliverable.isActive`   | boolean | Whether deliverable is active    |
| `data.results.deliverable.templateId` | string  | Original template ID used        |

### Code Examples

<ScriptLoader
  scriptPath="templates/api/upload-template"
  id="upload-template-examples"
  label="Path A: Upload Template Examples"
/>

## Path B: Select Existing Template

Browse your template library to find the perfect starting point. This path lets you leverage templates you've already created and organized.

### Step 1: Browse Templates

List all available templates and folders in your organization.

#### Endpoint

```http
GET https://api.turbodocx.com/template-item
```

#### Headers

```http
Authorization: Bearer YOUR_API_TOKEN
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
User-Agent: TurboDocx API Client
```

#### Query Parameters

```http
?limit=25&offset=0&query=contract&showTags=true&selectedTags[]=tag-123
```

| Parameter      | Type    | Description                         |
| -------------- | ------- | ----------------------------------- |
| `limit`        | number  | Items per page (default: 6)         |
| `offset`       | number  | Pagination offset (default: 0)      |
| `query`        | string  | Search term for template names      |
| `showTags`     | boolean | Include tag information in response |
| `selectedTags` | array   | Filter by specific tag IDs          |

#### Response

```json
{
  "data": {
    "results": [
      {
        "id": "0b1099cf-d7b9-41a4-822b-51b68fd4885a",
        "name": "Employee / Contractor IP Agreement Example",
        "description": "A Statement of Work template provided by TurboDocx",
        "createdOn": "2025-05-29T19:07:16.000Z",
        "updatedOn": "2025-09-08T11:44:11.000Z",
        "isActive": 1,
        "type": "template",
        "createdBy": "9d829e80-1135-4a97-93ea-cc2a1eecc9da",
        "email": "kahlerasse@gmail.com",
        "templateFolderId": null,
        "deliverableCount": 4,
        "fileSize": 24942,
        "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "templateCount": 0,
        "tags": []
      },
      {
        "id": "604d1e63-6cdc-4849-9e71-548409bfec69",
        "name": "Legal",
        "description": null,
        "createdOn": "2025-05-29T19:07:16.000Z",
        "updatedOn": "2025-05-29T19:07:16.000Z",
        "isActive": 1,
        "type": "folder",
        "createdBy": "9d829e80-1135-4a97-93ea-cc2a1eecc9da",
        "email": "kahlerasse@gmail.com",
        "templateFolderId": null,
        "deliverableCount": 0,
        "fileSize": null,
        "fileType": null,
        "templateCount": 0,
        "tags": []
      }
    ],
    "totalRecords": 26
  }
}
```

#### Browse Response Fields

| Field                             | Type         | Description                                     |
| --------------------------------- | ------------ | ----------------------------------------------- |
| `data.results[]`                  | array        | Array of templates and folders                  |
| `data.results[].id`               | string       | Unique identifier for template or folder        |
| `data.results[].name`             | string       | Name of the template or folder                  |
| `data.results[].description`      | string\|null | Description (null for some items)               |
| `data.results[].createdOn`        | string       | ISO timestamp of creation                       |
| `data.results[].updatedOn`        | string       | ISO timestamp of last update                    |
| `data.results[].isActive`         | number       | Active status (1 = active, 0 = inactive)        |
| `data.results[].type`             | string       | Item type ("template" or "folder")              |
| `data.results[].createdBy`        | string       | User ID who created the item                    |
| `data.results[].email`            | string       | Email of the creator                            |
| `data.results[].templateFolderId` | string\|null | Parent folder ID (null if at root level)        |
| `data.results[].deliverableCount` | number       | Number of deliverables generated from template  |
| `data.results[].fileSize`         | number\|null | File size in bytes (null for folders)           |
| `data.results[].fileType`         | string\|null | MIME type of template file (null for folders)   |
| `data.results[].templateCount`    | number       | Number of templates in folder (0 for templates) |
| `data.results[].tags`             | array        | Array of tag objects                            |
| `data.totalRecords`               | number       | Total number of items available                 |

### Step 2: Get Template Details

Load specific template information including variables and metadata.

#### Endpoint

```http
GET https://api.turbodocx.com/template/{templateId}
```

#### Response

```json
{
  "data": {
    "results": {
      "id": "0b1099cf-d7b9-41a4-822b-51b68fd4885a",
      "name": "Employee Contract Template",
      "description": "Standard employment agreement template",
      "templateFileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "templateFolderId": "folder-def456",
      "variables": [
        {
          "id": "var-123",
          "name": "Employee Name",
          "placeholder": "{EmployeeName}",
          "text": "",
          "mimeType": "text",
          "allowRichTextInjection": false,
          "order": 1,
          "subvariables": []
        },
        {
          "id": "var-456",
          "name": "Department",
          "placeholder": "{Department}",
          "text": "",
          "mimeType": "text",
          "allowRichTextInjection": true,
          "order": 2,
          "subvariables": [
            {
              "placeholder": "{Department.Manager}",
              "text": ""
            }
          ]
        }
      ],
      "fonts": [
        {
          "name": "Arial",
          "usage": 269
        }
      ],
      "defaultFont": "Arial"
    }
  }
}
```

### Step 3: Get PDF Preview (Optional)

Generate a preview PDF of the template for visual confirmation.

#### Endpoint

```http
GET https://api.turbodocx.com/template/{templateId}/previewpdflink
```

#### Response

```json
{
  "results": "https://api.turbodocx.com/template/pdf/preview-abc123.pdf"
}
```

### Code Examples

<ScriptLoader
  scriptPath="templates/api/browse-templates"
  id="browse-templates-examples"
  label="Path B: Browse Templates Examples"
/>

## Final Step: Generate Deliverable

Both paths converge here - time to fill those variables and create your masterpiece! This is where the magic happens and placeholders become real content.

### Step 1: Generate Deliverable

### Endpoint

```http
POST https://api.turbodocx.com/deliverable
```

### Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
User-Agent: TurboDocx API Client
```

### Request Body

```json
{
  "templateId": "0b1099cf-d7b9-41a4-822b-51b68fd4885a",
  "name": "Contract - John Smith",
  "description": "Simple contract example",
  "variables": [
    {
      "name": "Company Name",
      "placeholder": "{CompanyName}",
      "text": "Acme Corporation"
    },
    {
      "name": "Employee Name",
      "placeholder": "{EmployeeName}",
      "text": "John Smith"
    },
    {
      "name": "Date",
      "placeholder": "{Date}",
      "text": "January 15, 2024"
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
        "createdBy": "api-user@company.com",
        "createdOn": "2024-12-19T21:22:10.000Z",
        "orgId": "your-organization-id",
        "isActive": true,
        "templateId": "0b1099cf-d7b9-41a4-822b-51b68fd4885a"
      }
    }
  }
}
```

### Variable Structure Deep Dive

Understanding the variable structure is key to successful document generation:

#### Basic Variable

```json
{
  "name": "Company Name",
  "placeholder": "{CompanyName}",
  "text": "Acme Corporation",
  "mimeType": "text",
  "allowRichTextInjection": false,
  "order": 1
}
```

#### Variable with Subvariables

```json
{
  "name": "Employee",
  "placeholder": "{Employee}",
  "text": "John Smith",
  "subvariables": [
    {
      "placeholder": "{Employee.Title}",
      "text": "Senior Developer"
    },
    {
      "placeholder": "{Employee.Email}",
      "text": "john.smith@company.com"
    }
  ]
}
```

#### Variable Stack (Repeating Content)

```json
{
  "name": "Projects",
  "placeholder": "{Projects}",
  "variableStack": {
    "0": {
      "text": "Project Alpha",
      "subvariables": [
        {
          "placeholder": "{Projects.Status}",
          "text": "In Progress"
        }
      ]
    },
    "1": {
      "text": "Project Beta",
      "subvariables": [
        {
          "placeholder": "{Projects.Status}",
          "text": "Completed"
        }
      ]
    }
  }
}
```

### Request Fields

| Field                                | Type    | Required | Description                                    |
| ------------------------------------ | ------- | -------- | ---------------------------------------------- |
| `templateId`                         | string  | Yes      | Template ID from upload or selection           |
| `name`                               | string  | Yes      | Name for the generated deliverable             |
| `description`                        | string  | No       | Description of the deliverable                 |
| `variables[]`                        | array   | Yes      | Array of variable definitions and values       |
| `variables[].name`                   | string  | Yes      | Variable display name                          |
| `variables[].placeholder`            | string  | Yes      | Placeholder text in template (e.g., "{Name}")  |
| `variables[].text`                   | string  | Yes      | Actual value to replace placeholder            |
| `variables[].mimeType`               | string  | Yes      | Content type ("text", "html", etc.)            |
| `variables[].allowRichTextInjection` | number  | No       | Allow HTML/rich text (0 or 1)                  |
| `variables[].subvariables`           | array   | No       | Nested variables within this variable          |
| `variables[].variableStack`          | object  | No       | Multiple instances for repeating content       |
| `variables[].aiPrompt`               | string  | No       | AI prompt for content generation               |
| `variables[].metadata`               | object  | No       | Custom metadata for the variable               |
| `tags`                               | array   | No       | Tags for categorization                        |
| `fonts`                              | string  | No       | JSON string of font usage statistics           |
| `defaultFont`                        | string  | No       | Default font for the document                  |
| `replaceFonts`                       | boolean | No       | Whether to replace fonts during generation     |
| `metadata`                           | object  | No       | Additional metadata (sessions, tracking, etc.) |

### Step 2: Download Generated File

After generating a deliverable, you'll need to download the actual file.

#### Endpoint

```http
GET https://api.turbodocx.com/deliverable/file/{deliverableId}
```

#### Headers

```http
Authorization: Bearer YOUR_API_TOKEN
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
User-Agent: TurboDocx API Client
```

#### Example Request

```bash
curl -X GET "https://api.turbodocx.com/deliverable/file/39697685-ca00-43b8-92b8-7722544c574f" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  -H "User-Agent: TurboDocx API Client" \
  --output "employee-contract-john-smith.docx"
```

#### Response

Returns the binary content of the generated document with appropriate content-type headers:

```http
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="employee-contract-john-smith.docx"
Content-Length: 287456
```

### Code Examples

<ScriptLoader
  scriptPath="templates/api/generate-deliverable"
  id="generate-deliverable-examples"
  label="Final Step: Generate Deliverable Examples"
/>

## Best Practices

### Security

- **Never expose API tokens**: Store tokens securely in environment variables
- **Use HTTPS only**: All API calls must use HTTPS in production
- **Validate file uploads**: Check file types and sizes before upload
- **Sanitize variables**: Validate variable content to prevent injection attacks

### Error Handling

- **Check HTTP status codes**: Always verify response status before processing
- **Handle file upload failures**: Implement retry logic for large file uploads
- **Validate template variables**: Ensure all required variables are provided
- **Log API responses**: Keep detailed logs for debugging and monitoring

### Performance

- **Optimize file uploads**: Compress .docx/.pptx files when possible
- **Cache template details**: Store frequently used template information
- **Batch variable processing**: Group related variables together
- **Async processing**: Use webhooks for long-running document generation

### Template Preparation

- **Use clear placeholders**: Name variables descriptively (e.g., `{CompanyName}` not `{CN}`)
- **Consistent formatting**: Use consistent placeholder formats throughout templates
- **Test variable extraction**: Verify automatic variable detection works correctly
- **Document structure**: Organize templates logically with folders and tags

### Variable Management

- **Hierarchical organization**: Use subvariables for related data
- **Stack for repetition**: Use variableStack for lists and repeating sections
- **Rich text sparingly**: Only enable rich text injection when formatting is needed
- **AI prompts**: Provide clear, specific prompts for AI-generated content

## Error Handling & Troubleshooting

### Common HTTP Status Codes

| Status Code | Description           | Solution                                      |
| ----------- | --------------------- | --------------------------------------------- |
| `200`       | Success               | Request completed successfully                |
| `400`       | Bad Request           | Check request body format and required fields |
| `401`       | Unauthorized          | Verify API token and headers                  |
| `403`       | Forbidden             | Check organization ID and permissions         |
| `404`       | Not Found             | Verify template ID and endpoint URLs          |
| `413`       | Payload Too Large     | Reduce file size or compress template         |
| `422`       | Unprocessable Entity  | Validate field values and constraints         |
| `429`       | Too Many Requests     | Implement rate limiting and retry logic       |
| `500`       | Internal Server Error | Contact support if persistent                 |

### Common Issues

#### Template Upload Failures

**Symptoms**: Upload returns error or times out

**Solutions**:

- Verify file is .docx or .pptx format
- Check file size is under the maximum limit (typically 25MB)
- Ensure file is not corrupted or password-protected
- Verify network connection and try again

#### Variable Extraction Issues

**Symptoms**: Variables not detected automatically

**Solutions**:

- Use consistent placeholder format: `{VariableName}`
- Avoid special characters in placeholder names
- Ensure placeholders are in main document content (not headers/footers)
- Check that placeholders are properly formatted text (not images)

#### Template Selection Problems

**Symptoms**: Templates not appearing in browse results

**Solutions**:

- Verify organization ID matches your account
- Check that templates are active and not archived
- Use correct API endpoint for browsing vs. folder contents
- Verify search parameters and filters

#### Document Generation Failures

**Symptoms**: Deliverable generation fails or produces incorrect output

**Solutions**:

- Validate all required variables have values
- Check variable names match template placeholders exactly
- Ensure subvariable structure matches template expectations
- Verify file permissions and storage availability

#### Font and Formatting Issues

**Symptoms**: Generated documents have incorrect fonts or formatting

**Solutions**:

- Use `replaceFonts: true` to normalize font usage
- Specify `defaultFont` for consistent appearance
- Check that rich text injection is enabled only when needed
- Validate HTML content in rich text variables

### Debugging Tips

1. **Test with simple templates**: Start with basic templates before adding complexity
2. **Validate JSON payloads**: Use JSON validators before sending requests
3. **Check file encoding**: Ensure .docx/.pptx files are not corrupted
4. **Monitor API quotas**: Track usage to avoid rate limiting
5. **Use development endpoints**: Test with development environment first

## Next Steps

### Advanced Features to Explore

Now that you've mastered the basics, consider exploring these advanced capabilities:

📖 **[AI-Powered Content Generation →](/docs/TurboDocx%20Templating/ai-variable-generation)**
📖 **[Webhook Integration for Status Updates →](/docs/Webhooks/webhook-configuration)**
📖 **[Bulk Document Generation →](/docs/Templates/bulk-generation)**
📖 **[Template Version Management →](/docs/Templates/version-control)**

### Related Documentation

- [Template Management Guide](/docs/Templates/template-management)
- [Variable Types and Formatting](/docs/Templates/variable-types)
- [API Authentication](/docs/API/turbodocx-api-documentation)
- [Integration Examples](/docs/Integrations)

## Support

Need help with your template integration? We've got you covered:

- **Discord Community**: [Join our Discord server](https://discord.gg/NYKwz4BcpX) for real-time support and template wizardry discussions
- **Documentation**: [https://docs.turbodocx.com](https://docs.turbodocx.com)
- **Template Gallery**: Browse example templates for inspiration

---

Ready to become a template automation wizard? Choose your path (upload new or select existing) and start generating beautiful documents programmatically! 🎯
