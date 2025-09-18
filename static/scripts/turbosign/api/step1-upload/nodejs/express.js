const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://www.turbodocx.com/turbosign";
const DOCUMENT_NAME = "Contract Agreement";

// Step 1: Upload Document
const formData = new FormData();
formData.append('name', DOCUMENT_NAME);
formData.append('file', fs.createReadStream('./document.pdf'));

const response = await fetch(`${BASE_URL}/documents/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'x-rapiddocx-org-id': ORG_ID,
    'User-Agent': 'TurboDocx API Client',
    ...formData.getHeaders()
  },
  body: formData
});

const result = await response.json();
console.log(result);