const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Fastify route handler example
async function prepareDocumentForSigning(request, reply) {
  try {
    // Prepare form data
    const formData = new FormData();

    // Add file
    formData.append('file', fs.createReadStream('./contract.pdf'));

    // Add document metadata
    formData.append('documentName', 'Contract Agreement');
    formData.append('documentDescription', 'Please review and sign this contract');

    // Add recipients (as JSON string)
    const recipients = JSON.stringify([
      {
        name: "John Smith",
        email: "john.smith@company.com",
        signingOrder: 1
      },
      {
        name: "Jane Doe",
        email: "jane.doe@partner.com",
        signingOrder: 2
      }
    ]);
    formData.append('recipients', recipients);

    // Add fields (as JSON string) - Coordinate-based positioning
    const fields = JSON.stringify([
      {
        recipientEmail: "john.smith@company.com",
        type: "signature",
        page: 1,
        x: 100,
        y: 200,
        width: 200,
        height: 80,
        required: true
      },
      {
        recipientEmail: "john.smith@company.com",
        type: "date",
        page: 1,
        x: 100,
        y: 300,
        width: 150,
        height: 30,
        required: true
      },
      {
        recipientEmail: "jane.doe@partner.com",
        type: "signature",
        page: 1,
        x: 350,
        y: 200,
        width: 200,
        height: 80,
        required: true
      }
    ]);
    formData.append('fields', fields);

    // Send request
    const response = await fetch(`${BASE_URL}/turbosign/single/prepare-for-signing`, {
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
        documentId: result.documentId,
        message: 'Document sent for signing. Emails are being sent to recipients.'
      });
    } else {
      return reply.code(400).send({
        success: false,
        error: result.error || 'Failed to prepare document',
        code: result.code
      });
    }
  } catch (error) {
    console.error('Error preparing document:', error);
    return reply.code(500).send({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Export for use in Fastify app
module.exports = { prepareDocumentForSigning };
