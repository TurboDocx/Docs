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

const authHeaders = {
  Authorization: `Bearer ${API_TOKEN}`,
  "x-rapiddocx-org-id": ORG_ID,
  "User-Agent": "TurboDocx API Client",
};

async function turboDocx(path, options = {}, expectedStatus = 200) {
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers: { ...authHeaders, ...options.headers } });
  if (response.status !== expectedStatus) {
    const error = new Error(`TurboDocx API error ${response.status}: ${await response.text()}`);
    error.statusCode = 502;
    throw error;
  }
  return response;
}

// Path A, step 1: upload a template (upload and create answers 201 Created)
async function uploadTemplate() {
  const formData = new FormData();
  formData.append("templateFile", fs.createReadStream(TEMPLATE_PATH));
  formData.append("name", "Employee Contract Template");
  formData.append("description", "Standard employee contract with variable placeholders");
  formData.append("variables", "[]");
  formData.append("tags", "[]");

  const response = await turboDocx(
    "/template/upload-and-create",
    { method: "POST", headers: formData.getHeaders(), body: formData },
    201
  );
  return (await response.json()).data.results.template;
}

// Path B, steps 1-2: find a template, then load its details
async function selectTemplate(query) {
  const params = new URLSearchParams({ limit: "10", offset: "0", query, showTags: "true" });
  const items = (await (await turboDocx(`/template-item?${params}`)).json()).data.results;
  const selected = items.find((item) => item.type === "template");
  if (!selected) {
    const error = new Error(`No template matches "${query}"`);
    error.statusCode = 404;
    throw error;
  }
  return (await (await turboDocx(`/template/${encodeURIComponent(selected.id)}`)).json()).data.results;
}

// Both paths: generate a deliverable, filling each of the template's variables
async function generateDeliverable(template, pathLabel) {
  const payload = {
    templateId: template.id,
    name: `Contract Document - Path ${pathLabel}`,
    description: `Employment contract generated via workflow path ${pathLabel}`,
    variables: (template.variables || []).map((variable) => ({
      placeholder: variable.placeholder,
      text: `Sample value for ${variable.name || variable.placeholder}`,
      mimeType: "text",
    })),
    tags: ["api-generated"],
  };

  const response = await turboDocx("/v1/deliverable", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await response.json()).data.results.deliverable;
}

/** POST /workflow/upload — Path A: upload a new template, then generate from it */
fastify.post("/workflow/upload", async (request, reply) => {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    return reply.status(400).send({ error: `Template file not found: ${TEMPLATE_PATH}` });
  }
  const template = await uploadTemplate();
  const deliverable = await generateDeliverable(template, "A");
  return reply.send({ templateId: template.id, deliverableId: deliverable.id, download: `/deliverables/${deliverable.id}/download` });
});

/** POST /workflow/browse — Path B: pick an existing template, then generate from it. Body: { query } */
fastify.post("/workflow/browse", async (request, reply) => {
  const template = await selectTemplate((request.body && request.body.query) || "contract");
  const deliverable = await generateDeliverable(template, "B");
  return reply.send({ templateId: template.id, deliverableId: deliverable.id, download: `/deliverables/${deliverable.id}/download` });
});

/** GET /deliverables/:id/download — the generated file */
fastify.get("/deliverables/:id/download", async (request, reply) => {
  const response = await turboDocx(`/v1/deliverable/file/${encodeURIComponent(request.params.id)}`);
  return reply
    .header("Content-Type", response.headers.get("content-type") || "application/octet-stream")
    .header("Content-Disposition", `attachment; filename="deliverable-${request.params.id}.docx"`)
    .send(await response.buffer());
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
//   curl -X POST http://localhost:3000/workflow/upload
//   curl -X POST http://localhost:3000/workflow/browse -H "Content-Type: application/json" -d '{"query": "contract"}'
//   curl -o contract.docx http://localhost:3000/deliverables/DELIVERABLE_ID/download
