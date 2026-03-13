const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Common headers for TurboDocx API requests
function getHeaders() {
  return {
    Authorization: `Bearer ${API_TOKEN}`,
    "x-rapiddocx-org-id": ORG_ID,
    "Content-Type": "application/json",
    "User-Agent": "TurboDocx API Client",
  };
}

/**
 * POST /generate
 * Generate a deliverable document from a template with variable substitution.
 *
 * Expected JSON body: { templateId: string }
 */
app.post("/generate", async (req, res) => {
  try {
    const { templateId } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: "templateId is required" });
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
            { placeholder: "{contactPhone}", text: "(555) 123-4567", mimeType: "text" },
          ],
        },
      ],
      tags: ["hr", "contract", "employee"],
    };

    console.log("Generating deliverable...");
    console.log(`Template ID: ${templateId}`);
    console.log(`Variables: ${payload.variables.length}`);

    const response = await fetch(`${BASE_URL}/v1/deliverable`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ error: `TurboDocx API error: ${errorText}` });
    }

    const result = await response.json();
    const deliverable = result.data.results.deliverable;

    console.log("Deliverable generated successfully!");
    console.log(`Deliverable ID: ${deliverable.id}`);

    return res.status(201).json({
      message: "Deliverable generated successfully",
      deliverable: {
        id: deliverable.id,
        name: deliverable.name,
        createdBy: deliverable.createdBy,
        createdOn: deliverable.createdOn,
        templateId: deliverable.templateId,
      },
    });
  } catch (error) {
    console.error("Error generating deliverable:", error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /download/:id
 * Download a generated deliverable file by its ID.
 */
app.get("/download/:id", async (req, res) => {
  try {
    const deliverableId = req.params.id;

    console.log(`Downloading deliverable: ${deliverableId}`);

    const response = await fetch(
      `${BASE_URL}/v1/deliverable/file/${deliverableId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "x-rapiddocx-org-id": ORG_ID,
          "User-Agent": "TurboDocx API Client",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ error: `Download failed: ${errorText}` });
    }

    const contentType = response.headers.get("content-type");
    const contentDisposition = response.headers.get("content-disposition");

    // Forward the file stream to the client
    res.setHeader("Content-Type", contentType || "application/octet-stream");
    if (contentDisposition) {
      res.setHeader("Content-Disposition", contentDisposition);
    }

    response.body.pipe(res);
  } catch (error) {
    console.error("Error downloading deliverable:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TurboDocx Express server running on http://localhost:${PORT}`);
});

// -------------------------------------------------------------------
// Example usage - call the routes with curl or any HTTP client:
//
//   Generate a deliverable:
//     curl -X POST http://localhost:3000/generate \
//       -H "Content-Type: application/json" \
//       -d '{"templateId": "0b1099cf-d7b9-41a4-822b-51b68fd4885a"}'
//
//   Download the generated file (use the id from the response above):
//     curl -O http://localhost:3000/download/DELIVERABLE_ID
// -------------------------------------------------------------------
