const Fastify = require("fastify");
const fetch = require("node-fetch");

const fastify = Fastify({ logger: true });

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
  "x-rapiddocx-org-id": ORG_ID,
  "User-Agent": "TurboDocx API Client",
};

async function turboDocxGet(path) {
  const response = await fetch(`${BASE_URL}${path}`, { headers });
  if (!response.ok) {
    const error = new Error(`TurboDocx API error ${response.status}: ${await response.text()}`);
    error.statusCode = 502;
    throw error;
  }
  return response.json();
}

/**
 * GET /templates?query=contract&limit=25&offset=0&selectedTags=TAG_ID
 * Path B: browse templates and folders.
 */
fastify.get("/templates", async (request, reply) => {
  const { query, limit = "25", offset = "0", selectedTags } = request.query;

  const params = new URLSearchParams({ limit, offset, showTags: "true" });
  if (query) params.append("query", query);

  // Repeat selectedTags once per tag ID (the API reads ?selectedTags=<id>&selectedTags=<id>)
  [].concat(selectedTags || []).forEach((tagId) => params.append("selectedTags", tagId));

  const result = await turboDocxGet(`/template-item?${params}`);
  const { results, totalRecords } = result.data;

  return reply.send({
    totalRecords,
    templates: results.filter((item) => item.type === "template"),
    folders: results.filter((item) => item.type === "folder"),
  });
});

/**
 * GET /templates/:id
 * Template details (variables, fonts) and its PDF preview link.
 */
fastify.get("/templates/:id", async (request, reply) => {
  const id = encodeURIComponent(request.params.id);
  const details = await turboDocxGet(`/template/${id}`);
  const preview = await turboDocxGet(`/template/${id}/previewpdflink`);
  const template = details.data.results;

  return reply.send({
    id: template.id,
    name: template.name,
    defaultFont: template.defaultFont,
    variables: template.variables || [],
    pdfPreviewUrl: preview.results,
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
//   curl "http://localhost:3000/templates?query=contract"
//   curl http://localhost:3000/templates/TEMPLATE_ID
