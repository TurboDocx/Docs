const fetch = require('node-fetch');
const express = require('express');

const app = express();

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";
const BATCH_ID = "YOUR_BATCH_ID"; // Replace with actual batch ID to cancel

// POST /cancel-batch: Cancel a batch: pending jobs stop and their credits are refunded
app.post('/cancel-batch', async (req, res) => {
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
      console.log('✅ Batch cancelled successfully');
      console.log('Batch ID:', result.batchId);
      console.log('Status:', result.status);
      console.log('\n📊 Cancellation Summary:');
      console.log('Cancelled Jobs:', result.cancelledJobs);
      console.log('Succeeded Jobs (already completed):', result.succeededJobs);
      console.log('Refunded Credits:', result.refundedCredits);
      console.log('\n💰 Credits have been refunded to your account for cancelled jobs');
      console.log('✅ Jobs that already succeeded remain completed');
    } else {
      console.error('❌ Error:', result.error || result.message);
      if (result.code) {
        console.error('Error Code:', result.code);
      }
    }

    return res.status(response.status).json(result);
  } catch (error) {
    console.error('Error calling TurboDocx:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Server listening on http://localhost:3000'));

// Example usage:
//   curl -X POST http://localhost:3000/cancel-batch
