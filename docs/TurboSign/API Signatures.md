---
title: TurboSign API Integration
sidebar_position: 3
description: Complete guide for integrating TurboSign API to upload documents, add recipients, and prepare documents for electronic signatures. Learn the 3-step process with detailed examples and code samples.
keywords:
  - turbosign api
  - document upload api
  - electronic signature api
  - recipients api
  - signature preparation
  - api integration
  - document signing workflow
  - turbodocx api
  - signature api endpoints
  - api authentication
  - document processing api
  - api tutorial
  - signature document api
  - api examples
  - postman examples
  - curl examples
  - javascript api
  - python api
  - nodejs api
  - php api
  - signature automation
  - document workflow api
  - electronic signature integration
  - api best practices
  - api troubleshooting
  - bearer token authentication
---

import ScriptLoader from '@site/src/components/ScriptLoader';

# TurboSign API Integration

This comprehensive guide walks you through the TurboSign API integration process. Learn how to programmatically upload documents, add recipients, and prepare documents for electronic signatures using our RESTful API.

![TurboSign API Integration Overview](/img/turbosign/api/api-illustration.png)

## Overview

The TurboSign API follows a simple 3-step process to prepare documents for electronic signatures:

1. **Upload Document** - Upload your PDF document to TurboSign
2. **Add Recipients** - Configure who needs to sign and their signing order
3. **Prepare for Signing** - Set up signature fields and send for signing

![TurboSign API Integration Overview](/img/turbosign/api/steps.png)

### Key Features

- **RESTful API**: Standard HTTP methods with JSON payloads
- **Bearer Token Authentication**: Secure API access using JWT tokens
- **Multiple Recipients**: Support for multiple signers with custom signing order
- **Flexible Field Placement**: Position signature fields using anchors or coordinates
- **Real-time Status Updates**: Track document status throughout the signing process
- **Webhook Integration**: Receive notifications when signing is complete

## TLDR; Complete Working Example 🚀

Don't want to read all the details? Here's what you need to know:

### Available Field Types

| Type        | Description                | Use Case                                          |
| ----------- | -------------------------- | ------------------------------------------------- |
| `signature` | Electronic signature field | Legal signatures                                  |
| `initial`   | Initial field              | Document initials, paragraph acknowledgments     |
| `date`      | Date picker field          | Signing date, agreement date                     |
| `full_name` | Full name field            | Automatically fills signer's complete name       |
| `first_name`| First name field           | Automatically fills signer's first name          |
| `last_name` | Last name field            | Automatically fills signer's last name           |
| `title`     | Title/job title field      | Professional title or position                   |
| `company`   | Company name field         | Organization or company name                     |
| `email`     | Email address field        | Signer's email address                           |
| `text`      | Generic text input field   | Custom text, notes, or any other text input      |

### Complete 3-Step Workflow

<ScriptLoader
  scriptPath="turbosign/api/complete-workflow"
  id="complete-workflow-examples"
  label="Complete Workflow Implementation"
/>

### Quick Coordinate Example

If you prefer using exact coordinates instead of text anchors:

```json
// Step 3 payload using coordinates instead of templates
[
  {
    "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
    "type": "signature",
    "page": 1,
    "x": 100,
    "y": 200,
    "width": 200,
    "height": 80,
    "pageWidth": 612,
    "pageHeight": 792
  },
  {
    "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
    "type": "date",
    "page": 1,
    "x": 350,
    "y": 300,
    "width": 150,
    "height": 30,
    "pageWidth": 612,
    "pageHeight": 792
  }
]
```

Now that you've seen the whole thing, let's dive into the details...

## Prerequisites

Before you begin, ensure you have:

- **API Access Token**: Bearer token for authentication
- **Organization ID**: Your organization identifier
- **PDF Document**: Document ready for signature collection

### Getting Your Credentials

1. **Login to TurboDocx**: Visit [https://www.turbodocx.com](https://www.turbodocx.com)
2. **Navigate to Settings**: Access your organization settings
3. **API Keys Section**: Generate or retrieve your API access token
4. **Organization ID**: Copy your organization ID from the settings

![TurboSign API Integration Overview](/img/turbosign/api/api-key.png)
![TurboSign API Integration Overview](/img/turbosign/api/org-id.png)

## Authentication

All TurboSign API requests require authentication using a Bearer token in the Authorization header:

```http
Authorization: Bearer YOUR_API_TOKEN
```

Additional required headers for all requests:

```http
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
User-Agent: TurboDocx API Client
```

## Step 1: Upload Document

The first step is to upload your PDF document to TurboSign. This creates a new document record and returns a document ID that you'll use in subsequent steps.

### Endpoint

```http
POST https://www.turbodocx.com/turbosign/documents/upload
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
  "name": "Contract Agreement",
  "file": [PDF_FILE_BINARY],
  // Optional: triggerMeta for advanced configurations
  // "triggerMeta": "{\"url\": \"callback_url\"}"
}
```

### Response

```json
{
  "data": {
    "id": "4a20eca5-7944-430c-97d5-fcce4be24296",
    "name": "Contract Agreement",
    "description": "",
    "status": "draft",
    "createdOn": "2025-09-17T13:24:57.083Z"
  }
}
```

### Response Fields

| Field              | Type   | Description                                           |
| ------------------ | ------ | ----------------------------------------------------- |
| `data.id`          | string | Unique document identifier (save this for next steps) |
| `data.name`        | string | Document name as provided                             |
| `data.description` | string | Document description (empty by default)               |
| `data.status`      | string | Document status (`draft` after upload)                |
| `data.createdOn`   | string | ISO 8601 timestamp of document creation               |

<!-- ![Step 1: Document Upload Postman Example](/img/turbosign/step1-upload-postman.png) -->

### Code Examples

<ScriptLoader 
  scriptPath="turbosign/api/step1-upload" 
  id="step1-upload-examples"
  label="Step 1: Upload Document Examples"
/>

## Step 2: Add Recipients

After uploading your document, add the recipients who need to sign. You can specify multiple recipients with their signing order and customize their signature appearance.

### Endpoint

```http
POST https://www.turbodocx.com/turbosign/documents/{documentId}/update-with-recipients
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
  "document": {
    "name": "Contract Agreement - Updated",
    "description": "This document requires electronic signatures from both parties. Please review all content carefully before signing."
  },
  "recipients": [
    {
      "name": "John Smith",
      "email": "john.smith@company.com",
      "signingOrder": 1,
      "metadata": {
        "color": "hsl(200, 75%, 50%)",
        "lightColor": "hsl(200, 75%, 93%)"
      },
      "documentId": "4a20eca5-7944-430c-97d5-fcce4be24296"
    },
    {
      "name": "Jane Doe",
      "email": "jane.doe@partner.com",
      "signingOrder": 2,
      "metadata": {
        "color": "hsl(270, 75%, 50%)",
        "lightColor": "hsl(270, 75%, 93%)"
      },
      "documentId": "4a20eca5-7944-430c-97d5-fcce4be24296"
    }
  ]
}
```

### Response

```json
{
  "data": {
    "document": {
      "id": "4a20eca5-7944-430c-97d5-fcce4be24296",
      "name": "Contract Agreement - Updated",
      "description": "This document requires electronic signatures from both parties. Please review all content carefully before signing.",
      "status": "setup_complete",
      "updatedOn": "2025-09-17T13:26:10.000Z"
    },
    "recipients": [
      {
        "id": "5f673f37-9912-4e72-85aa-8f3649760f6b",
        "name": "John Smith",
        "email": "john.smith@company.com",
        "signingOrder": 1,
        "metadata": {
          "color": "hsl(200, 75%, 50%)",
          "lightColor": "hsl(200, 75%, 93%)"
        }
      },
      {
        "id": "a8b9c1d2-3456-7890-abcd-ef1234567890",
        "name": "Jane Doe",
        "email": "jane.doe@partner.com",
        "signingOrder": 2,
        "metadata": {
          "color": "hsl(270, 75%, 50%)",
          "lightColor": "hsl(270, 75%, 93%)"
        }
      }
    ]
  }
}
```

### Request Fields

| Field                              | Type   | Required | Description                                         |
| ---------------------------------- | ------ | -------- | --------------------------------------------------- |
| `document.name`                    | string | Yes      | Updated document name                               |
| `document.description`             | string | No       | Document description for recipients                 |
| `recipients[].name`                | string | Yes      | Full name of the signer                             |
| `recipients[].email`               | string | Yes      | Email address for signing notifications             |
| `recipients[].signingOrder`        | number | Yes      | Order in which recipients should sign (1, 2, 3...)  |
| `recipients[].metadata.color`      | string | No       | Primary color for this recipient's signature fields |
| `recipients[].metadata.lightColor` | string | No       | Light color variant for highlights                  |
| `recipients[].documentId`          | string | Yes      | Document ID from Step 1                             |

<!-- ![Step 2: Add Recipients Postman Example](/img/turbosign/step2-recipients-postman.png) -->

### Code Examples

<ScriptLoader 
  scriptPath="turbosign/api/step2-recipients" 
  id="step2-recipients-examples"
  label="Step 2: Add Recipients Examples"
/>

## Step 3: Prepare for Signing

The final step configures signature fields and sends the document to recipients for signing. You can position fields using text anchors or absolute coordinates.

### Endpoint

```http
POST https://www.turbodocx.com/turbosign/documents/{documentId}/prepare-for-signing
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
[
  {
    "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
    "type": "signature",
    "template": {
      "anchor": "{Signature1}",
      "placement": "replace",
      "size": { "width": 200, "height": 80 },
      "offset": { "x": 0, "y": 0 },
      "caseSensitive": true,
      "useRegex": false
    },
    "defaultValue": "",
    "required": true
  },
  {
    "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
    "type": "date",
    "template": {
      "anchor": "{Date1}",
      "placement": "replace",
      "size": { "width": 150, "height": 30 },
      "offset": { "x": 0, "y": 0 },
      "caseSensitive": true,
      "useRegex": false
    },
    "defaultValue": "",
    "required": true
  },
  {
    "recipientId": "a8b9c1d2-3456-7890-abcd-ef1234567890",
    "type": "signature",
    "template": {
      "anchor": "{Signature2}",
      "placement": "replace",
      "size": { "width": 200, "height": 80 },
      "offset": { "x": 0, "y": 0 },
      "caseSensitive": true,
      "useRegex": false
    },
    "defaultValue": "",
    "required": true
  },
  {
    "recipientId": "a8b9c1d2-3456-7890-abcd-ef1234567890",
    "type": "text",
    "template": {
      "anchor": "{Title2}",
      "placement": "replace",
      "size": { "width": 200, "height": 30 },
      "offset": { "x": 0, "y": 0 },
      "caseSensitive": true,
      "useRegex": false
    },
    "defaultValue": "Business Partner",
    "required": false
  }
]
```

### Response

```json
{
  "success": true
}
```

### Field Positioning Options

TurboSign supports two field positioning methods:

1. **Template-based positioning** (recommended) - Uses text anchors in your PDF
2. **Coordinate-based positioning** - Uses exact pixel coordinates

#### Template-based Field Configuration

| Field                    | Type    | Required | Description                                            |
| ------------------------ | ------- | -------- | ------------------------------------------------------ |
| `recipientId`            | string  | Yes      | Recipient ID from Step 2                               |
| `type`                   | string  | Yes      | Field type - see Available Field Types in TLDR section |
| `template.anchor`        | string  | Yes      | Text anchor to find in document (e.g., "{Signature1}") |
| `template.placement`     | string  | Yes      | How to place field ("replace", "before", "after")      |
| `template.size`          | object  | Yes      | Field dimensions (width, height in pixels)             |
| `template.offset`        | object  | No       | Position offset from anchor (x, y in pixels)           |
| `template.caseSensitive` | boolean | No       | Whether anchor search is case-sensitive                |
| `template.useRegex`      | boolean | No       | Whether to treat anchor as regex pattern               |
| `defaultValue`           | string  | No       | Pre-filled value for the field                         |
| `required`               | boolean | No       | Whether field must be completed                        |

#### Coordinate-based Field Configuration

For precise positioning when text anchors aren't suitable, use coordinate-based fields:

```json
[
  {
    "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
    "type": "signature",
    "page": 1,
    "x": 100,
    "y": 200,
    "width": 200,
    "height": 80,
    "pageWidth": 612,
    "pageHeight": 792
  },
  {
    "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
    "type": "date",
    "page": 1,
    "x": 350,
    "y": 200,
    "width": 150,
    "height": 30,
    "pageWidth": 612,
    "pageHeight": 792
  }
]
```

| Field        | Type   | Required | Description                                     |
| ------------ | ------ | -------- | ----------------------------------------------- |
| `recipientId`| string | Yes      | Recipient ID from Step 2                       |
| `type`       | string | Yes      | Field type - see Available Field Types section |
| `page`       | number | Yes      | Page number (starts at 1)                      |
| `x`          | number | Yes      | Horizontal position from left edge (pixels)    |
| `y`          | number | Yes      | Vertical position from top edge (pixels)       |
| `width`      | number | Yes      | Field width in pixels                           |
| `height`     | number | Yes      | Field height in pixels                          |
| `pageWidth`  | number | Yes      | Total page width in pixels                      |
| `pageHeight` | number | Yes      | Total page height in pixels                     |

**Coordinate System Notes:**
- Origin (0,0) is at the top-left corner of the page
- Standard US Letter page size is 612 x 792 pixels (8.5" x 11" at 72 DPI)
- Fields cannot extend beyond page boundaries: `x + width ≤ pageWidth` and `y + height ≤ pageHeight`
- All coordinate values must be non-negative numbers

**When to use coordinate-based positioning:**
- Precise pixel-perfect placement needed
- PDF doesn't contain suitable text anchors
- Programmatically generated field positions
- Converting from existing coordinate-based systems

<!-- ![Step 3: Prepare for Signing Postman Example](/img/turbosign/step3-prepare-postman.png) -->

### Code Examples

<ScriptLoader 
  scriptPath="turbosign/api/step3-prepare" 
  id="step3-prepare-examples"
  label="Step 3: Prepare for Signing Examples"
/>

## Best Practices

### Security

- **Never expose API tokens**: Store tokens securely in environment variables
- **Use HTTPS only**: All API calls must use HTTPS in production
- **Validate inputs**: Always validate recipient emails and document names
- **Implement rate limiting**: Respect API rate limits to avoid throttling

### Error Handling

- **Check HTTP status codes**: Always verify response status before processing
- **Handle timeouts**: Implement retry logic for network failures
- **Log API responses**: Keep detailed logs for debugging and monitoring
- **Validate responses**: Check response structure before accessing data

### Performance

- **Upload optimization**: Compress PDFs when possible to reduce upload time
- **Batch operations**: Group multiple recipients in single API calls
- **Async processing**: Use webhooks instead of polling for status updates
- **Connection pooling**: Reuse HTTP connections for multiple requests

### Document Preparation

- **Use text anchors**: Place anchor text like `{Signature1}` in your PDFs for precise field positioning
- **Consistent naming**: Use consistent anchor naming conventions across documents
- **Test coordinates**: Verify field positions with test documents before production
- **Document validation**: Ensure PDFs are not password-protected or corrupted

### Coordinate-based Positioning Tips

- **Measure accurately**: Use PDF viewers with coordinate display to find exact positions
- **Account for margins**: Consider document margins when calculating field positions
- **Test on different devices**: Verify coordinates work across different PDF viewers
- **Use standard page sizes**: Stick to common page dimensions (612x792 for US Letter)
- **Validate boundaries**: Ensure fields don't extend beyond page edges
- **Consider scaling**: Be aware that different DPI settings may affect coordinates

## Error Handling & Troubleshooting

### Common HTTP Status Codes

| Status Code | Description           | Solution                                      |
| ----------- | --------------------- | --------------------------------------------- |
| `200`       | Success               | Request completed successfully                |
| `400`       | Bad Request           | Check request body format and required fields |
| `401`       | Unauthorized          | Verify API token and headers                  |
| `403`       | Forbidden             | Check organization ID and permissions         |
| `404`       | Not Found             | Verify document ID and endpoint URLs          |
| `422`       | Unprocessable Entity  | Validate field values and constraints         |
| `429`       | Too Many Requests     | Implement rate limiting and retry logic       |
| `500`       | Internal Server Error | Contact support if persistent                 |

### Common Issues

#### Authentication Failures

**Symptoms**: 401 Unauthorized responses

**Solutions**:

- Verify API token is correct and not expired
- Check that `x-rapiddocx-org-id` header matches your organization
- Ensure Bearer token format: `Bearer YOUR_TOKEN`

#### Document Upload Failures

**Symptoms**: Upload returns error or times out

**Solutions**:

- Verify PDF file is not corrupted or password-protected
- Check file size is under the maximum limit (typically 10MB)
- Ensure file is actually a PDF (check MIME type)
- Verify network connection and try again

#### Recipient Configuration Issues

**Symptoms**: Recipients not receiving signing invitations

**Solutions**:

- Verify email addresses are valid and correctly formatted
- Check signing order numbers are sequential (1, 2, 3...)
- Ensure document ID from Step 1 is used correctly
- Verify recipient metadata format is correct

#### Field Positioning Problems

**Symptoms**: Signature fields appear in wrong locations

**Template-based Solutions**:
- Verify anchor text exists in the PDF document
- Check anchor text matches exactly (case-sensitive by default)
- Test with `caseSensitive: false` if having matching issues
- Use PDF coordinates as fallback if anchors don't work

**Coordinate-based Solutions**:
- Verify page dimensions match your PDF's actual size
- Check that x,y coordinates are within page boundaries
- Ensure coordinates account for any PDF margins or headers
- Test with different page numbers if multi-page document
- Validate that `x + width ≤ pageWidth` and `y + height ≤ pageHeight`

#### Webhook Integration Issues

**Symptoms**: Not receiving completion notifications

**Solutions**:

- Verify webhook URLs are accessible and return 200 OK
- Check webhook configuration in organization settings
- Review webhook delivery history for error details
- Test webhook endpoints with external tools

### Debugging Tips

1. **Enable request logging**: Log all API requests and responses
2. **Test step by step**: Isolate issues by testing each step individually
3. **Use Postman**: Import examples and test manually before coding
4. **Check network**: Verify connectivity to `turbodocx.com`
5. **Validate JSON**: Ensure request bodies are valid JSON format

<!-- ![API Debugging Workflow](/img/turbosign/api-debugging-flow.png) -->

## Next Steps

### Webhooks - The Next Logical Step

Now that you've integrated the basic signing flow, the next step is setting up webhooks to receive real-time notifications when documents are signed. This eliminates the need for polling and provides instant updates about document status changes.

📖 **[Learn how to configure Webhooks →](/docs/TurboSign/Webhooks)**

### Related Documentation

- [TurboSign Setup Guide](/docs/TurboSign/Setting-up-TurboSign)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
- [API Authentication](/docs/API/turbodocx-api-documentation)
- [Integration Examples](/docs/Integrations)

## Support

Need help with your integration?

- **Discord Community**: [Join our Discord server](https://discord.gg/NYKwz4BcpX) for real-time support and discussions
- **Documentation**: [https://docs.turbodocx.com](https://docs.turbodocx.com)

---

Ready to get started? Follow the step-by-step guide above to integrate TurboSign API into your application and start collecting electronic signatures programmatically!
