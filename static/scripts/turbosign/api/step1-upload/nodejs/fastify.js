const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Step 1: Upload Document
const formData = new FormData();
formData.append('name', 'Contract Agreement');
formData.append('file', fs.createReadStream('./document.pdf'));

const response = await fetch('https://www.turbodocx.com/turbosign/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
    'User-Agent': 'TurboDocx API Client',
    ...formData.getHeaders()
  },
  body: formData
});

const result = await response.json();
console.log(result);