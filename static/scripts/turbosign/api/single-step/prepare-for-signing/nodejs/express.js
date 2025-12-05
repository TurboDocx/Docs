const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Prepare form data
const formData = new FormData();

// Add file
formData.append('file', fs.createReadStream('./contract.pdf'));

// Add document metadata
formData.append('documentName', 'Contract Agreement');
formData.append('documentDescription', 'Please review and sign this contract');
formData.append('senderName', 'Your Company');
formData.append('senderEmail', 'sender@company.com');

// Add recipients (as JSON string)
const recipients = JSON.stringify([
  {
    name: "John Smith",
    email: "john.smith@company.com",
    signingOrder: 1
  },
  {
    name: "Jane Doe",
    email: "jane.doe@partner.com",
    signingOrder: 2
  }
]);
formData.append('recipients', recipients);

// Add fields (as JSON string) - Coordinate-based positioning
const fields = JSON.stringify([
  {
    recipientEmail: "john.smith@company.com",
    type: "signature",
    page: 1,
    x: 100,
    y: 200,
    width: 200,
    height: 80,
    required: true
  },
  {
    recipientEmail: "john.smith@company.com",
    type: "date",
    page: 1,
    x: 100,
    y: 300,
    width: 150,
    height: 30,
    required: true
  },
  {
    recipientEmail: "jane.doe@partner.com",
    type: "signature",
    page: 1,
    x: 350,
    y: 200,
    width: 200,
    height: 80,
    required: true
  }
]);
formData.append('fields', fields);

// Optional: Add CC emails
const ccEmails = JSON.stringify(["manager@company.com", "legal@company.com"]);
formData.append('ccEmails', ccEmails);

// Send request to prepare-for-signing endpoint
const response = await fetch(`${BASE_URL}/turbosign/single/prepare-for-signing`, {
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

if (result.success) {
  console.log('✅ Document sent for signing');
  console.log('Document ID:', result.documentId);
  console.log('Message:', result.message);
  console.log('\n📧 Emails are being sent to recipients asynchronously');
  console.log('💡 Tip: Set up webhooks to receive notifications when signing is complete');
} else {
  console.error('❌ Error:', result.error || result.message);
  if (result.code) {
    console.error('Error Code:', result.code);
  }
}
