const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Fastify route handler example
async function listBatches(request, reply) {
  try {
    // Prepare query parameters
    const queryParams = new URLSearchParams({
      limit: '20',
      offset: '0',
      status: 'pending,processing,completed' // Can be single value or comma-separated
      // startDate: '2024-01-01', // Optional: Filter by start date
      // endDate: '2024-12-31',   // Optional: Filter by end date
      // query: 'Q4'              // Optional: Search batches by name
    });

    // Send GET request to list batches endpoint
    const response = await fetch(`${BASE_URL}/turbosign/bulk/batches?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
      }
    });

    const result = await response.json();

    if (result.data) {
      return reply.send({
        success: true,
        totalRecords: result.data.totalRecords,
        batches: result.data.batches
      });
    } else {
      return reply.code(400).send({
        success: false,
        error: result.error || 'Failed to retrieve batches',
        code: result.code
      });
    }
  } catch (error) {
    console.error('Error retrieving batches:', error);
    return reply.code(500).send({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Export for use in Fastify app
module.exports = { listBatches };
