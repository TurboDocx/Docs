const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

const fastify = require('fastify')({ logger: true });

fastify.get('/audit-trail/:documentId', async (request, reply) => {
  const { documentId } = request.params;

  try {
    const response = await fetch(`${BASE_URL}/turbosign/documents/${documentId}/audit-trail`, {
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

    // Return the audit trail with document info
    const { document, auditTrail } = result.data;

    return reply.send({
      success: true,
      document: document,
      auditTrail: auditTrail,
      entryCount: auditTrail.length
    });

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
