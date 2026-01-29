const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Document ID from a completed signature request
const documentId = "4a20eca5-7944-430c-97d5-fcce4be24296";

// Step 1: Get the presigned download URL
const response = await fetch(`${BASE_URL}/turbosign/documents/${documentId}/download`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'x-rapiddocx-org-id': ORG_ID,
    'User-Agent': 'TurboDocx API Client'
  }
});

const result = await response.json();

if (response.ok) {
  console.log('Download URL:', result.downloadUrl);
  console.log('File Name:', result.fileName);

  // Step 2: Download the actual file from S3
  const fileResponse = await fetch(result.downloadUrl);

  if (fileResponse.ok) {
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to file
    fs.writeFileSync(result.fileName, buffer);
    console.log(`Signed document saved to: ${result.fileName}`);
  } else {
    console.error('Failed to download file from S3:', fileResponse.statusText);
  }
} else {
  console.error('Error getting download URL:', result.error || result.message);
  if (result.code) {
    console.error('Error Code:', result.code);
  }
}
