const fetch = require('node-fetch');

// Step 2: Add Recipients
const documentId = "4a20eca5-7944-430c-97d5-fcce4be24296";

const payload = {
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

const response = await fetch(`https://www.turbodocx.com/turbosign/documents/${documentId}/update-with-recipients`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
    'origin': 'https://www.turbodocx.com',
    'referer': 'https://www.turbodocx.com',
    'accept': 'application/json, text/plain, */*',
    'dnt': '1',
    'accept-language': 'en-US,en;q=0.9',
    'priority': 'u=1, i'
  },
  body: JSON.stringify(payload)
});

const result = await response.json();
console.log(result);