const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Fastify route handler example
async function bulkIngest(request, reply) {
  try {
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
      return reply.send({
        success: true,
        batchId: result.batchId,
        batchName: result.batchName,
        totalJobs: result.totalJobs,
        status: result.status,
        message: 'Bulk batch created successfully'
      });
    } else {
      return reply.code(400).send({
        success: false,
        error: result.error || 'Failed to create bulk batch',
        code: result.code,
        data: result.data
      });
    }
  } catch (error) {
    console.error('Error creating bulk batch:', error);
    return reply.code(500).send({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Export for use in Fastify app
module.exports = { bulkIngest };
