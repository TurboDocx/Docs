const Fastify = require('fastify');
const axios = require('axios');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Shared headers for TurboDocx API requests
const apiHeaders = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'x-rapiddocx-org-id': ORG_ID,
  'User-Agent': 'TurboDocx API Client',
  'Content-Type': 'application/json'
};

// Initialize Fastify
const fastify = Fastify({ logger: true });

/**
 * POST /generate
 * Generate a deliverable document from a template with variable substitution
 */
fastify.post('/generate', async (request, reply) => {
  try {
    const { templateId } = request.body;

    if (!templateId) {
      return reply.status(400).send({ error: 'templateId is required' });
    }

    const payload = {
      templateId: templateId,
      name: "Employee Contract - John Smith",
      description: "Employment contract for new senior developer",
      variables: [
        { placeholder: "{EmployeeName}", text: "John Smith", mimeType: "text" },
        { placeholder: "{CompanyName}", text: "TechCorp Solutions Inc.", mimeType: "text" },
        { placeholder: "{JobTitle}", text: "Senior Software Engineer", mimeType: "text" },
        {
          mimeType: "html",
          placeholder: "{ContactBlock}",
          text: "<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>",
          subvariables: [
            { placeholder: "{contactName}", text: "Jane Doe", mimeType: "text" },
            { placeholder: "{contactPhone}", text: "(555) 123-4567", mimeType: "text" }
          ]
        }
      ],
      tags: ["hr", "contract", "employee"],
    };

    fastify.log.info(`Generating deliverable for template: ${templateId}`);
    fastify.log.info(`Deliverable Name: ${payload.name}`);
    fastify.log.info(`Variables: ${payload.variables.length}`);

    const response = await axios.post(`${BASE_URL}/v1/deliverable`, payload, {
      headers: apiHeaders
    });

    const deliverable = response.data.data.results.deliverable;

    fastify.log.info(`Deliverable generated successfully - ID: ${deliverable.id}`);

    return reply.send({
      success: true,
      deliverable: {
        id: deliverable.id,
        createdBy: deliverable.createdBy,
        createdOn: deliverable.createdOn,
        templateId: deliverable.templateId
      }
    });

  } catch (error) {
    fastify.log.error(error, 'Error generating deliverable');
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message;
    return reply.status(status).send({ error: message });
  }
});

/**
 * GET /download/:id
 * Download a generated deliverable file by its ID
 */
fastify.get('/download/:id', async (request, reply) => {
  try {
    const { id } = request.params;

    fastify.log.info(`Downloading deliverable: ${id}`);

    const response = await axios.get(`${BASE_URL}/v1/deliverable/file/${id}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
      },
      responseType: 'arraybuffer'
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const contentLength = response.headers['content-length'];

    fastify.log.info(`File downloaded - Content-Type: ${contentType}, Size: ${contentLength} bytes`);

    return reply
      .header('Content-Type', contentType)
      .header('Content-Disposition', `attachment; filename="deliverable-${id}.docx"`)
      .send(Buffer.from(response.data));

  } catch (error) {
    fastify.log.error(error, 'Error downloading deliverable');
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message;
    return reply.status(status).send({ error: message });
  }
});

// Start the Fastify server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('TurboDocx Fastify server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Example usage:
//
// 1. Generate a deliverable:
//    curl -X POST http://localhost:3000/generate \
//      -H "Content-Type: application/json" \
//      -d '{"templateId": "0b1099cf-d7b9-41a4-822b-51b68fd4885a"}'
//
// 2. Download the generated file:
//    curl -O http://localhost:3000/download/DELIVERABLE_ID
