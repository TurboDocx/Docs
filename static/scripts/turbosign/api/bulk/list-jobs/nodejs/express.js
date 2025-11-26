const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";
const BATCH_ID = "YOUR_BATCH_ID"; // Replace with actual batch ID

// Prepare query parameters
const queryParams = new URLSearchParams({
  limit: '20',
  offset: '0',
  // status: 'pending,processing,succeeded,failed', // Optional: Filter by status
  // query: 'john'                                  // Optional: Search by recipient name/email
});

// Send GET request to list jobs for a batch
const response = await fetch(`${BASE_URL}/turbosign/bulk/batch/${BATCH_ID}/jobs?${queryParams}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'x-rapiddocx-org-id': ORG_ID,
    'User-Agent': 'TurboDocx API Client'
  }
});

const result = await response.json();

if (result.data) {
  console.log('✅ Successfully retrieved jobs for batch');
  console.log('Batch ID:', result.data.batchId);
  console.log('Batch Name:', result.data.batchName);
  console.log('Batch Status:', result.data.batchStatus);
  console.log('\n📊 Statistics:');
  console.log('Total Jobs:', result.data.totalJobs);
  console.log('Total Records:', result.data.totalRecords);
  console.log('Succeeded:', result.data.succeededJobs);
  console.log('Failed:', result.data.failedJobs);
  console.log('Pending:', result.data.pendingJobs);

  console.log('\n📋 Jobs in this page:', result.data.jobs.length);

  result.data.jobs.forEach((job, index) => {
    console.log(`\n${index + 1}. Job ID: ${job.id}`);
    console.log('   Document:', job.documentName);
    console.log('   Document ID:', job.documentId || 'N/A');
    console.log('   Status:', job.status);
    console.log('   Recipients:', job.recipientEmails.join(', '));
    console.log('   Attempts:', job.attempts);
    if (job.errorMessage) {
      console.log('   Error:', job.errorMessage);
      console.log('   Error Code:', job.errorCode);
    }
    console.log('   Created:', new Date(job.createdOn).toLocaleString());
    console.log('   Updated:', new Date(job.updatedOn).toLocaleString());
  });

  console.log('\n💡 Tip: Use status filter to find failed or pending jobs');
} else {
  console.error('❌ Error:', result.error || 'Failed to retrieve jobs');
  if (result.code) {
    console.error('Error Code:', result.code);
  }
}
