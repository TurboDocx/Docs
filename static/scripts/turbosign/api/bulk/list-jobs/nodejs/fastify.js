const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";
const BATCH_ID = "YOUR_BATCH_ID"; // Replace with actual batch ID

// Fastify route handler example
async function listJobs(request, reply) {
  try {
    // Prepare query parameters
    const queryParams = new URLSearchParams({
      limit: '20',
      offset: '0'
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
      // Jobs include: id, batchId, documentId, documentName, status, recipientEmails,
      // attempts, errorCode, errorMessage, createdOn, updatedOn, lastAttemptedAt
      return reply.send({
        success: true,
        batchId: result.data.batchId,
        batchName: result.data.batchName,
        batchStatus: result.data.batchStatus,
        statistics: {
          totalJobs: result.data.totalJobs,
          totalRecords: result.data.totalRecords,
          succeededJobs: result.data.succeededJobs,
          failedJobs: result.data.failedJobs,
          pendingJobs: result.data.pendingJobs
        },
        jobs: result.data.jobs
      });
    } else {
      return reply.code(400).send({
        success: false,
        error: result.error || 'Failed to retrieve jobs',
        code: result.code
      });
    }
  } catch (error) {
    console.error('Error retrieving jobs:', error);
    return reply.code(500).send({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Export for use in Fastify app
module.exports = { listJobs };
