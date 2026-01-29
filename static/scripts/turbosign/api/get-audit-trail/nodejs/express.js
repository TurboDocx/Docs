const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Document ID from a signature request
const documentId = "4a20eca5-7944-430c-97d5-fcce4be24296";

// Get the audit trail
const response = await fetch(`${BASE_URL}/turbosign/documents/${documentId}/audit-trail`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'x-rapiddocx-org-id': ORG_ID,
    'User-Agent': 'TurboDocx API Client'
  }
});

const result = await response.json();

if (response.ok) {
  console.log('Document:', result.document.name);
  console.log('Document ID:', result.document.id);
  console.log('\nAudit Trail:');
  console.log('============');

  result.auditTrail.forEach((entry, index) => {
    console.log(`\n${index + 1}. ${entry.actionType}`);
    console.log(`   Timestamp: ${entry.timestamp}`);

    if (entry.user) {
      console.log(`   User: ${entry.user.name} (${entry.user.email})`);
    }

    if (entry.recipient) {
      console.log(`   Recipient: ${entry.recipient.name} (${entry.recipient.email})`);
    }

    if (entry.details) {
      console.log(`   Details: ${JSON.stringify(entry.details)}`);
    }

    // Hash chain info for verification
    if (entry.previousHash) {
      console.log(`   Previous Hash: ${entry.previousHash.substring(0, 16)}...`);
    }
    console.log(`   Current Hash: ${entry.currentHash.substring(0, 16)}...`);
  });
} else {
  console.error('Error getting audit trail:', result.error || result.message);
  if (result.code) {
    console.error('Error Code:', result.code);
  }
}
