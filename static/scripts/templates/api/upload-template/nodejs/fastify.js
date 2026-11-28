const Fastify = require("fastify");
const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");

const fastify = Fastify({ logger: true });

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";
const TEMPLATE_PATH = "./contract-template.docx";

/**
 * POST /upload-template
 * Path A: upload a .docx/.pptx template; TurboDocx extracts its variables.
 *
 * Optional JSON body: { name: string, description: string }
 */
fastify.post("/upload-template", async (request, reply) => {
  const {
    name = "Employee Contract Template",
    description = "Standard employee contract with variable placeholders",
  } = request.body || {};

  if (!fs.existsSync(TEMPLATE_PATH)) {
    return reply.status(400).send({ error: `Template file not found: ${TEMPLATE_PATH}` });
  }

  const formData = new FormData();
  formData.append("templateFile", fs.createReadStream(TEMPLATE_PATH));
  formData.append("name", name);
  formData.append("description", description);
  formData.append("variables", "[]"); // Optional: pre-defined variables
  formData.append("tags", "[]"); // Optional: tag objects, e.g. [{"id": "TAG_ID"}]

  const response = await fetch(`${BASE_URL}/template/upload-and-create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "x-rapiddocx-org-id": ORG_ID,
      "User-Agent": "TurboDocx API Client",
      ...formData.getHeaders(),
    },
    body: formData,
  });

  // Upload and create answers 201 Created
  if (response.status !== 201) {
    return reply.status(502).send({ error: "Template upload failed", status: response.status, details: await response.text() });
  }

  const result = await response.json();
  const { template, redirectUrl } = result.data.results;

  return reply.send({
    templateId: template.id,
    name: template.name,
    variables: template.variables ? template.variables.length : 0,
    defaultFont: template.defaultFont,
    redirectUrl,
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Example usage:
//   curl -X POST http://localhost:3000/upload-template \
//     -H "Content-Type: application/json" \
//     -d '{"name": "Employee Contract Template"}'
