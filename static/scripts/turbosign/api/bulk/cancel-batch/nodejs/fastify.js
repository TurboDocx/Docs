const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";
const BATCH_ID = "YOUR_BATCH_ID"; // Replace with actual batch ID to cancel

// Fastify route handler example
async function cancelBatch(request, reply) {
  try {
    // Send POST request to cancel batch
    const response = await fetch(`${BASE_URL}/turbosign/bulk/batch/${BATCH_ID}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client',
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.success) {
      return reply.send({
        success: true,
        batchId: result.batchId,
        status: result.status,
        message: result.message,
        cancelledJobs: result.cancelledJobs,
        succeededJobs: result.succeededJobs,
        refundedCredits: result.refundedCredits
      });
    } else {
      return reply.code(400).send({
        success: false,
        error: result.error || result.message,
        code: result.code
      });
    }
  } catch (error) {
    console.error('Error cancelling batch:', error);
    return reply.code(500).send({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Export for use in Fastify app
module.exports = { cancelBatch };
