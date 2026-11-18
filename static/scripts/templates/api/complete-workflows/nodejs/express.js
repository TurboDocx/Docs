const express = require("express");
const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

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
    throw new Error(`TurboDocx API error ${response.status}: ${await response.text()}`);
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
    throw new Error(`No template matches "${query}"`);
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
app.post("/workflow/upload", async (req, res) => {
  try {
    if (!fs.existsSync(TEMPLATE_PATH)) {
      return res.status(400).json({ error: `Template file not found: ${TEMPLATE_PATH}` });
    }
    const template = await uploadTemplate();
    const deliverable = await generateDeliverable(template, "A");
    res.json({ templateId: template.id, deliverableId: deliverable.id, download: `/deliverables/${deliverable.id}/download` });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

/** POST /workflow/browse — Path B: pick an existing template, then generate from it. Body: { query } */
app.post("/workflow/browse", async (req, res) => {
  try {
    const template = await selectTemplate((req.body && req.body.query) || "contract");
    const deliverable = await generateDeliverable(template, "B");
    res.json({ templateId: template.id, deliverableId: deliverable.id, download: `/deliverables/${deliverable.id}/download` });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

/** GET /deliverables/:id/download — the generated file */
app.get("/deliverables/:id/download", async (req, res) => {
  try {
    const response = await turboDocx(`/v1/deliverable/file/${encodeURIComponent(req.params.id)}`);
    res.set("Content-Type", response.headers.get("content-type") || "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename="deliverable-${req.params.id}.docx"`);
    res.send(await response.buffer());
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server listening on http://localhost:3000"));

// Example usage:
//   curl -X POST http://localhost:3000/workflow/upload
//   curl -X POST http://localhost:3000/workflow/browse -H "Content-Type: application/json" -d '{"query": "contract"}'
//   curl -o contract.docx http://localhost:3000/deliverables/DELIVERABLE_ID/download
