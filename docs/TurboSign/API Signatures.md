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
origin: https://www.turbodocx.com
accept: application/json, text/plain, */*
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
origin: https://www.turbodocx.com
referer: https://www.turbodocx.com
accept: application/json, text/plain, */*
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

#### cURL

```bash
curl -X POST "https://www.turbodocx.com/turbosign/documents/upload" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  -H "origin: https://www.turbodocx.com" \
  -H "referer: https://www.turbodocx.com" \
  -H "accept: application/json, text/plain, */*" \
  -F "name=Contract Agreement" \
  -F "file=@/path/to/your/document.pdf"
```

#### JavaScript (Fetch)

```javascript
const formData = new FormData();
formData.append("name", "Contract Agreement");
formData.append("file", pdfFile); // File object

const response = await fetch(
  "https://www.turbodocx.com/turbosign/documents/upload",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer YOUR_API_TOKEN",
      "x-rapiddocx-org-id": "YOUR_ORGANIZATION_ID",
      origin: "https://www.turbodocx.com",
      referer: "https://www.turbodocx.com",
      accept: "application/json, text/plain, */*",
    },
    body: formData,
  }
);

const result = await response.json();
const documentId = result.data.id; // Save for next step
```

#### Python (requests)

```python
import requests

url = "https://www.turbodocx.com/turbosign/documents/upload"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "x-rapiddocx-org-id": "YOUR_ORGANIZATION_ID",
    "origin": "https://www.turbodocx.com",
    "referer": "https://www.turbodocx.com",
    "accept": "application/json, text/plain, */*"
}

files = {
    "name": (None, "Contract Agreement"),
    "file": ("document.pdf", open("path/to/document.pdf", "rb"), "application/pdf")
}

response = requests.post(url, headers=headers, files=files)
result = response.json()
document_id = result["data"]["id"]  # Save for next step
```

#### Node.js (axios)

```javascript
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const form = new FormData();
form.append("name", "Contract Agreement");
form.append("file", fs.createReadStream("path/to/document.pdf"));

const response = await axios.post(
  "https://www.turbodocx.com/turbosign/documents/upload",
  form,
  {
    headers: {
      ...form.getHeaders(),
      Authorization: "Bearer YOUR_API_TOKEN",
      "x-rapiddocx-org-id": "YOUR_ORGANIZATION_ID",
      origin: "https://www.turbodocx.com",
      referer: "https://www.turbodocx.com",
      accept: "application/json, text/plain, */*",
    },
  }
);

const documentId = response.data.data.id; // Save for next step
```

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
origin: https://www.turbodocx.com
referer: https://www.turbodocx.com
accept: application/json, text/plain, */*
dnt: 1
accept-language: en-US,en;q=0.9
priority: u=1, i
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

#### cURL

```bash
curl -X POST "https://www.turbodocx.com/turbosign/documents/4a20eca5-7944-430c-97d5-fcce4be24296/update-with-recipients" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  -H "origin: https://www.turbodocx.com" \
  -H "referer: https://www.turbodocx.com" \
  -H "accept: application/json, text/plain, */*" \
  -d '{
    "document": {
      "name": "Contract Agreement - Updated",
      "description": "This document requires electronic signatures from both parties."
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
  }'
```

#### JavaScript (Fetch)

```javascript
const documentId = "4a20eca5-7944-430c-97d5-fcce4be24296"; // From Step 1

const recipientData = {
  document: {
    name: "Contract Agreement - Updated",
    description:
      "This document requires electronic signatures from both parties.",
  },
  recipients: [
    {
      name: "John Smith",
      email: "john.smith@company.com",
      signingOrder: 1,
      metadata: {
        color: "hsl(200, 75%, 50%)",
        lightColor: "hsl(200, 75%, 93%)",
      },
      documentId: documentId,
    },
    {
      name: "Jane Doe",
      email: "jane.doe@partner.com",
      signingOrder: 2,
      metadata: {
        color: "hsl(270, 75%, 50%)",
        lightColor: "hsl(270, 75%, 93%)",
      },
      documentId: documentId,
    },
  ],
};

const response = await fetch(
  `https://www.turbodocx.com/turbosign/documents/${documentId}/update-with-recipients`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_TOKEN",
      "x-rapiddocx-org-id": "YOUR_ORGANIZATION_ID",
      origin: "https://www.turbodocx.com",
      referer: "https://www.turbodocx.com",
      accept: "application/json, text/plain, */*",
    },
    body: JSON.stringify(recipientData),
  }
);

const result = await response.json();
const recipients = result.data.recipients; // Save recipient IDs for Step 3
```

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
origin: https://www.turbodocx.com
referer: https://www.turbodocx.com
accept: application/json, text/plain, */*
dnt: 1
accept-language: en-US,en;q=0.9
priority: u=1, i
sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-site
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36
x-device-fingerprint: 280624a233f1fd39ce050a9e9d0a4cc9
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

### Field Types

| Type        | Description                | Use Case                     |
| ----------- | -------------------------- | ---------------------------- |
| `signature` | Electronic signature field | Legal signatures             |
| `date`      | Date picker field          | Signing date, agreement date |
| `text`      | Text input field           | Names, titles, custom text   |
| `checkbox`  | Checkbox field             | Acknowledgments, consents    |
| `radio`     | Radio button field         | Single-choice selections     |

### Template Configuration

| Field                    | Type    | Required | Description                                            |
| ------------------------ | ------- | -------- | ------------------------------------------------------ |
| `recipientId`            | string  | Yes      | Recipient ID from Step 2                               |
| `type`                   | string  | Yes      | Field type (signature, date, text, etc.)               |
| `template.anchor`        | string  | Yes      | Text anchor to find in document (e.g., "{Signature1}") |
| `template.placement`     | string  | Yes      | How to place field ("replace", "before", "after")      |
| `template.size`          | object  | Yes      | Field dimensions (width, height in pixels)             |
| `template.offset`        | object  | No       | Position offset from anchor (x, y in pixels)           |
| `template.caseSensitive` | boolean | No       | Whether anchor search is case-sensitive                |
| `template.useRegex`      | boolean | No       | Whether to treat anchor as regex pattern               |
| `defaultValue`           | string  | No       | Pre-filled value for the field                         |
| `required`               | boolean | No       | Whether field must be completed                        |

<!-- ![Step 3: Prepare for Signing Postman Example](/img/turbosign/step3-prepare-postman.png) -->

### Code Examples

#### cURL

```bash
curl -X POST "https://www.turbodocx.com/turbosign/documents/4a20eca5-7944-430c-97d5-fcce4be24296/prepare-for-signing" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-rapiddocx-org-id: YOUR_ORGANIZATION_ID" \
  -H "origin: https://www.turbodocx.com" \
  -H "referer: https://www.turbodocx.com" \
  -H "accept: application/json, text/plain, */*" \
  -d '[
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
      "required": true
    }
  ]'
```

#### JavaScript (Fetch)

```javascript
const documentId = "4a20eca5-7944-430c-97d5-fcce4be24296"; // From Step 1
const recipientIds = [
  "5f673f37-9912-4e72-85aa-8f3649760f6b", // From Step 2
  "a8b9c1d2-3456-7890-abcd-ef1234567890", // From Step 2
];

const signatureFields = [
  {
    recipientId: recipientIds[0],
    type: "signature",
    template: {
      anchor: "{Signature1}",
      placement: "replace",
      size: { width: 200, height: 80 },
      offset: { x: 0, y: 0 },
      caseSensitive: true,
      useRegex: false,
    },
    required: true,
  },
  {
    recipientId: recipientIds[1],
    type: "signature",
    template: {
      anchor: "{Signature2}",
      placement: "replace",
      size: { width: 200, height: 80 },
      offset: { x: 0, y: 0 },
      caseSensitive: true,
      useRegex: false,
    },
    required: true,
  },
];

const response = await fetch(
  `https://www.turbodocx.com/turbosign/documents/${documentId}/prepare-for-signing`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_TOKEN",
      "x-rapiddocx-org-id": "YOUR_ORGANIZATION_ID",
      origin: "https://www.turbodocx.com",
      referer: "https://www.turbodocx.com",
      accept: "application/json, text/plain, */*",
    },
    body: JSON.stringify(signatureFields),
  }
);

const result = await response.json();
console.log("Document sent for signing:", result.success);
```

## Complete Workflow Example

Here's a complete example that demonstrates the entire 3-step process:

### JavaScript Implementation

```javascript
class TurboSignAPI {
  constructor(apiToken, orgId) {
    this.apiToken = apiToken;
    this.orgId = orgId;
    this.baseURL = "https://www.turbodocx.com";
  }

  async uploadDocument(name, fileBlob) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", fileBlob);

    const response = await fetch(`${this.baseURL}/turbosign/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "x-rapiddocx-org-id": this.orgId,
        origin: this.baseURL,
        referer: this.baseURL,
        accept: "application/json, text/plain, */*",
      },
      body: formData,
    });

    const result = await response.json();
    return result.data.id;
  }

  async addRecipients(documentId, recipients) {
    const payload = {
      document: {
        name: "Contract Agreement",
        description: "Please review and sign this document.",
      },
      recipients: recipients.map((recipient, index) => ({
        ...recipient,
        documentId,
        signingOrder: index + 1,
        metadata: {
          color: `hsl(${(index * 60) % 360}, 75%, 50%)`,
          lightColor: `hsl(${(index * 60) % 360}, 75%, 93%)`,
        },
      })),
    };

    const response = await fetch(
      `${this.baseURL}/turbosign/documents/${documentId}/update-with-recipients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiToken}`,
          "x-rapiddocx-org-id": this.orgId,
          origin: this.baseURL,
          referer: this.baseURL,
          accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return result.data.recipients;
  }

  async prepareForSigning(documentId, recipientIds, signatureAnchors) {
    const fields = recipientIds.map((recipientId, index) => ({
      recipientId,
      type: "signature",
      template: {
        anchor: signatureAnchors[index] || `{Signature${index + 1}}`,
        placement: "replace",
        size: { width: 200, height: 80 },
        offset: { x: 0, y: 0 },
        caseSensitive: true,
        useRegex: false,
      },
      required: true,
    }));

    const response = await fetch(
      `${this.baseURL}/turbosign/documents/${documentId}/prepare-for-signing`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiToken}`,
          "x-rapiddocx-org-id": this.orgId,
          origin: this.baseURL,
          referer: this.baseURL,
          accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(fields),
      }
    );

    return await response.json();
  }

  // Complete workflow method
  async processDocument(fileName, fileBlob, recipients, signatureAnchors) {
    try {
      // Step 1: Upload document
      const documentId = await this.uploadDocument(fileName, fileBlob);
      console.log("Document uploaded:", documentId);

      // Step 2: Add recipients
      const addedRecipients = await this.addRecipients(documentId, recipients);
      console.log("Recipients added:", addedRecipients.length);

      // Step 3: Prepare for signing
      const recipientIds = addedRecipients.map((r) => r.id);
      const result = await this.prepareForSigning(
        documentId,
        recipientIds,
        signatureAnchors
      );

      if (result.success) {
        console.log("Document successfully sent for signing!");
        return { documentId, recipients: addedRecipients };
      } else {
        throw new Error("Failed to prepare document for signing");
      }
    } catch (error) {
      console.error("Error processing document:", error);
      throw error;
    }
  }
}

// Usage example
const api = new TurboSignAPI("YOUR_API_TOKEN", "YOUR_ORG_ID");

const recipients = [
  { name: "John Smith", email: "john@company.com" },
  { name: "Jane Doe", email: "jane@partner.com" },
];

const signatureAnchors = ["{Signature1}", "{Signature2}"];

// Process the document
api
  .processDocument("Contract.pdf", pdfFileBlob, recipients, signatureAnchors)
  .then((result) => {
    console.log("Success:", result);
  })
  .catch((error) => {
    console.error("Failed:", error);
  });
```

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

**Solutions**:

- Verify anchor text exists in the PDF document
- Check anchor text matches exactly (case-sensitive by default)
- Test with `caseSensitive: false` if having matching issues
- Use PDF coordinates as fallback if anchors don't work

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

## Rate Limits & Quotas

### Current Limits

- **Upload API**: 10 requests per minute per organization
- **Recipients API**: 20 requests per minute per organization
- **Signing API**: 30 requests per minute per organization
- **File size limit**: 10MB per document
- **Recipients per document**: 50 maximum

### Handling Rate Limits

When you exceed rate limits, the API returns HTTP 429 with a `Retry-After` header:

```javascript
if (response.status === 429) {
  const retryAfter = response.headers.get("Retry-After");
  console.log(`Rate limited. Retry after ${retryAfter} seconds`);
  // Implement exponential backoff
}
```

### Best Practices

- **Implement exponential backoff**: Gradually increase retry delays
- **Monitor usage**: Track API calls to stay within limits
- **Batch operations**: Group multiple recipients in single calls
- **Cache responses**: Store document IDs to avoid redundant uploads

## Testing & Validation

### Test Environment

Use the same production URLs for testing, but with test data:

- **Test organization**: Use a separate test organization ID
- **Test documents**: Use sample PDFs with clear anchor text
- **Test emails**: Use your own email addresses for testing
- **Monitor logs**: Enable detailed logging during testing

### Validation Checklist

- [ ] API authentication is working correctly
- [ ] Document upload returns valid document ID
- [ ] Recipients are added with correct signing order
- [ ] Signature fields are positioned correctly
- [ ] Email notifications are sent to recipients
- [ ] Signing process completes successfully
- [ ] Webhooks are received (if configured)
- [ ] Error handling works for invalid inputs

### Load Testing

Before production deployment:

1. **Test with multiple documents**: Upload several PDFs simultaneously
2. **Test recipient limits**: Try with maximum number of recipients
3. **Test field complexity**: Use documents with many signature fields
4. **Monitor response times**: Ensure acceptable performance
5. **Test error scenarios**: Verify graceful handling of failures

## Next Steps

### Advanced Features

- **Custom branding**: Customize signing interface with your brand
- **Advanced field types**: Use checkboxes, radio buttons, and dropdowns
- **Conditional logic**: Show/hide fields based on other field values
- **Document templates**: Create reusable templates with pre-positioned fields
- **Bulk operations**: Process multiple documents in batch operations

### Integration Patterns

- **Webhook integration**: Receive real-time completion notifications
- **Database storage**: Store document IDs and recipient information
- **User management**: Integrate with your existing user authentication
- **Audit trails**: Maintain detailed logs of all signing activities
- **Document storage**: Archive completed documents securely

### Related Documentation

- [TurboSign Setup Guide](/docs/TurboSign/Setting-up-TurboSign)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
- [API Authentication](/docs/API/turbodocx-api-documentation)
- [Integration Examples](/docs/Integrations)

## Support

Need help with your integration?

- **Documentation**: [https://docs.turbodocx.com](https://docs.turbodocx.com)
- **Support Portal**: Contact our technical support team
- **Community**: Join our developer community for tips and best practices
- **Status Page**: Monitor API status and planned maintenance

---

Ready to get started? Follow the step-by-step guide above to integrate TurboSign API into your application and start collecting electronic signatures programmatically!
