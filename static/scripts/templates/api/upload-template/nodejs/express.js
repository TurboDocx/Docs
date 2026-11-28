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

/**
 * POST /upload-template
 * Path A: upload a .docx/.pptx template; TurboDocx extracts its variables.
 *
 * Optional JSON body: { name: string, description: string }
 */
app.post("/upload-template", async (req, res) => {
  const {
    name = "Employee Contract Template",
    description = "Standard employee contract with variable placeholders",
  } = req.body || {};

  if (!fs.existsSync(TEMPLATE_PATH)) {
    return res.status(400).json({ error: `Template file not found: ${TEMPLATE_PATH}` });
  }

  try {
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
      return res.status(502).json({ error: "Template upload failed", status: response.status, details: await response.text() });
    }

    const result = await response.json();
    const { template, redirectUrl } = result.data.results;

    return res.json({
      templateId: template.id,
      name: template.name,
      variables: template.variables ? template.variables.length : 0,
      defaultFont: template.defaultFont,
      redirectUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server listening on http://localhost:3000"));

// Example usage:
//   curl -X POST http://localhost:3000/upload-template \
//     -H "Content-Type: application/json" \
//     -d '{"name": "Employee Contract Template"}'
