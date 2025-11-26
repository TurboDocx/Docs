const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Prepare documents array - each document represents one signing job
const documents = [
  {
    recipients: [
      {
        name: 'John Smith',
        email: 'john.smith@company.com',
        signingOrder: 1
      }
    ],
    fields: [
      {
        recipientEmail: 'john.smith@company.com',
        type: 'signature',
        page: 1,
        x: 100,
        y: 200,
        width: 200,
        height: 80,
        required: true
      },
      {
        recipientEmail: 'john.smith@company.com',
        type: 'date',
        page: 1,
        x: 100,
        y: 300,
        width: 150,
        height: 30,
        required: true
      }
    ],
    documentName: 'Employment Contract - John Smith',
    documentDescription: 'Please review and sign your employment contract'
  },
  {
    recipients: [
      {
        name: 'Jane Doe',
        email: 'jane.doe@company.com',
        signingOrder: 1
      }
    ],
    fields: [
      {
        recipientEmail: 'jane.doe@company.com',
        type: 'signature',
        page: 1,
        x: 100,
        y: 200,
        width: 200,
        height: 80,
        required: true
      },
      {
        recipientEmail: 'jane.doe@company.com',
        type: 'date',
        page: 1,
        x: 100,
        y: 300,
        width: 150,
        height: 30,
        required: true
      }
    ],
    documentName: 'Employment Contract - Jane Doe',
    documentDescription: 'Please review and sign your employment contract'
  }
];

// Create form data
const formData = new FormData();
formData.append('sourceType', 'file');
formData.append('file', fs.createReadStream('./contract_template.pdf'));
formData.append('batchName', 'Q4 Employment Contracts');
formData.append('documentName', 'Employment Contract');
formData.append('documentDescription', 'Please review and sign your employment contract');
formData.append('senderName', 'HR Department');
formData.append('senderEmail', 'hr@company.com');
formData.append('documents', JSON.stringify(documents));

// Send request to bulk ingest endpoint
const response = await fetch(`${BASE_URL}/turbosign/bulk/ingest`, {
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
  console.log('✅ Bulk batch created successfully');
  console.log('Batch ID:', result.batchId);
  console.log('Batch Name:', result.batchName);
  console.log('Total Jobs:', result.totalJobs);
  console.log('Status:', result.status);
  console.log('\n📧 Documents will be sent to recipients asynchronously');
  console.log('💡 Tip: Use the batch ID to monitor progress and list jobs');
} else {
  console.error('❌ Error:', result.error || result.message);
  if (result.code) {
    console.error('Error Code:', result.code);
  }
  if (result.data?.invalidDocuments) {
    console.error('Invalid Documents:', JSON.stringify(result.data.invalidDocuments, null, 2));
  }
}
