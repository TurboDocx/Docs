const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Complete Workflow: Upload → Recipients → Prepare

// Step 1: Upload Document
const formData = new FormData();
formData.append('name', 'Contract Agreement');
formData.append('file', fs.createReadStream('./document.pdf'));

const uploadResponse = await fetch('https://www.turbodocx.com/turbosign/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
    'origin': 'https://www.turbodocx.com',
    'referer': 'https://www.turbodocx.com',
    'accept': 'application/json, text/plain, */*',
    ...formData.getHeaders()
  },
  body: formData
});

const uploadResult = await uploadResponse.json();
const documentId = uploadResult.data.id;

// Step 2: Add Recipients
const recipientPayload = {
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
      "documentId": documentId
    },
    {
      "name": "Jane Doe",
      "email": "jane.doe@partner.com",
      "signingOrder": 2,
      "metadata": {
        "color": "hsl(270, 75%, 50%)",
        "lightColor": "hsl(270, 75%, 93%)"
      },
      "documentId": documentId
    }
  ]
};

const recipientResponse = await fetch(`https://www.turbodocx.com/turbosign/documents/${documentId}/update-with-recipients`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
    'origin': 'https://www.turbodocx.com',
    'referer': 'https://www.turbodocx.com',
    'accept': 'application/json, text/plain, */*'
  },
  body: JSON.stringify(recipientPayload)
});

const recipientResult = await recipientResponse.json();
const recipients = recipientResult.data.recipients;

// Step 3: Prepare for Signing
const signatureFields = [
  {
    "recipientId": recipients[0].id,
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
    "recipientId": recipients[0].id,
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
    "recipientId": recipients[1].id,
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
    "recipientId": recipients[1].id,
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
];

const prepareResponse = await fetch(`https://www.turbodocx.com/turbosign/documents/${documentId}/prepare-for-signing`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
    'origin': 'https://www.turbodocx.com',
    'referer': 'https://www.turbodocx.com',
    'accept': 'application/json, text/plain, */*'
  },
  body: JSON.stringify(signatureFields)
});

const finalResult = await prepareResponse.json();
console.log(finalResult);