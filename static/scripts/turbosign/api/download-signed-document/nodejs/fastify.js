const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

const fastify = require('fastify')({ logger: true });

fastify.get('/download/:documentId', async (request, reply) => {
  const { documentId } = request.params;

  try {
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

    if (!response.ok) {
      return reply.code(response.status).send({
        success: false,
        error: result.error || result.message,
        code: result.code
      });
    }

    // Step 2: Download the actual file from S3
    const fileResponse = await fetch(result.downloadUrl);

    if (!fileResponse.ok) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to download file from storage'
      });
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the PDF file
    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="${result.fileName}"`)
      .send(buffer);

  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

fastify.listen({ port: 3000 });
