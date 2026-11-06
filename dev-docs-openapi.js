// API reference generation. Regenerate the endpoint pages after editing the spec or a guide:
//   rm docs/API/*.api.mdx docs/API/*.info.mdx && npx docusaurus gen-api-docs petstore --plugin-id apiDocs
// (the plugin never overwrites an existing page, hence the rm; Deliverable-API.md and sidebar.js are hand-written, keep them).
// Pages land in docs/API: their URLs carry SEO, so the folder and the operation summaries must not change.
// Hand-written prose for an endpoint lives in api-guides/<page-id>.md and is appended below the reference.
const fs = require("fs");
const path = require("path");
const md = (name) => require(`docusaurus-plugin-openapi-docs/lib/markdown/${name}`);
const { render } = md("utils");
const { createMethodEndpoint } = md("createMethodEndpoint");
const { createDeprecationNotice } = md("createDeprecationNotice");
const { createDescription } = md("createDescription");
const { createRequestHeader } = md("createRequestHeader");
const { createRequestBodyDetails } = md("createRequestBodyDetails");
const { createParamsDetails } = md("createParamsDetails");
const { createStatusCodes } = md("createStatusCodes");

// Same building blocks as the plugin's default page, in our section order:
// title row, method + URL, description, body params, path/query/header params, responses, guide prose.
function apiPage({ id, title, api }) {
  const { deprecated, description, method, path: apiPath, parameters, requestBody, responses } = api;
  const guide = path.join(__dirname, "api-guides", `${id}.md`);
  const prose = fs.existsSync(guide) ? fs.readFileSync(guide, "utf8") : "";
  return render([
    `import MethodEndpoint from "@theme/ApiExplorer/MethodEndpoint";\n`,
    `import ParamsDetails from "@theme/ParamsDetails";\n`,
    `import RequestSchema from "@theme/RequestSchema";\n`,
    `import StatusCodes from "@theme/StatusCodes";\n`,
    `import Heading from "@theme/Heading";\n`,
    `import Translate from "@docusaurus/Translate";\n\n`,
    `<ApiTitle method=${JSON.stringify(method)} title=${JSON.stringify(title)} />\n\n`,
    createMethodEndpoint(method, apiPath),
    createDeprecationNotice({ deprecated, description: api["x-deprecated-description"] }),
    createDescription(description),
    requestBody || parameters ? createRequestHeader("Request") : undefined,
    createRequestBodyDetails({ title: "Body", body: requestBody }),
    createParamsDetails({ parameters }),
    createStatusCodes({ responses }),
    prose ? `\n\n${prose}` : undefined,
  ]);
}

const apiConfig = {
  petstore: {
    specPath: "tdocxcollection.yml",
    outputDir: "docs/API",
    markdownGenerators: { createApiPageMD: apiPage },
  },
};

module.exports = {
  config: apiConfig,
};
