const fetch = require('node-fetch');
const express = require('express');

const app = express();

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// GET /list-batches: List bulk signing batches
app.get('/list-batches', async (req, res) => {
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
      console.log('✅ Successfully retrieved batches');
      console.log('Total Records:', result.data.totalRecords);
      console.log('Batches in this page:', result.data.batches.length);
      console.log('\n📦 Batches:');

      result.data.batches.forEach((batch, index) => {
        console.log(`\n${index + 1}. ${batch.batchName}`);
        console.log('   Batch ID:', batch.id);
        console.log('   Status:', batch.status);
        console.log('   Total Jobs:', batch.totalJobs);
        console.log('   Succeeded:', batch.succeededJobs);
        console.log('   Failed:', batch.failedJobs);
        console.log('   Pending:', batch.pendingJobs);
        console.log('   Created:', new Date(batch.createdOn).toLocaleString());
      });

      console.log('\n💡 Tip: Use limit and offset parameters for pagination');
    } else {
      console.error('❌ Error:', result.error || 'Failed to retrieve batches');
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
//   curl -X GET http://localhost:3000/list-batches
