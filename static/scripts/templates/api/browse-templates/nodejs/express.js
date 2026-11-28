const express = require("express");
const fetch = require("node-fetch");

const app = express();

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
    throw new Error(`TurboDocx API error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

/**
 * GET /templates?query=contract&limit=25&offset=0&selectedTags=TAG_ID
 * Path B: browse templates and folders.
 */
app.get("/templates", async (req, res) => {
  try {
    const params = new URLSearchParams({
      limit: req.query.limit || "25",
      offset: req.query.offset || "0",
      showTags: "true",
    });
    if (req.query.query) params.append("query", req.query.query);

    // Repeat selectedTags once per tag ID (the API reads ?selectedTags=<id>&selectedTags=<id>)
    [].concat(req.query.selectedTags || []).forEach((tagId) => params.append("selectedTags", tagId));

    const result = await turboDocxGet(`/template-item?${params}`);
    const { results, totalRecords } = result.data;

    res.json({
      totalRecords,
      templates: results.filter((item) => item.type === "template"),
      folders: results.filter((item) => item.type === "folder"),
    });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

/**
 * GET /templates/:id
 * Template details (variables, fonts) and its PDF preview link.
 */
app.get("/templates/:id", async (req, res) => {
  try {
    const id = encodeURIComponent(req.params.id);
    const details = await turboDocxGet(`/template/${id}`);
    const preview = await turboDocxGet(`/template/${id}/previewpdflink`);
    const template = details.data.results;

    res.json({
      id: template.id,
      name: template.name,
      defaultFont: template.defaultFont,
      variables: template.variables || [],
      pdfPreviewUrl: preview.results,
    });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server listening on http://localhost:3000"));

// Example usage:
//   curl "http://localhost:3000/templates?query=contract"
//   curl http://localhost:3000/templates/TEMPLATE_ID
