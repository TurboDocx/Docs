// API reference generation. Regenerate the endpoint pages after editing the spec or a guide:
//   npx docusaurus gen-api-docs petstore
// Pages land in docs/API (their URLs carry SEO, so the folder and the operation summaries must not change).
// Hand-written prose for an endpoint lives in api-guides/<page-id>.md and is appended below the reference.
const fs = require("fs");
const path = require("path");
const { createApiPageMD } = require("docusaurus-plugin-openapi-docs/lib/markdown");
const { createHeading } = require("docusaurus-plugin-openapi-docs/lib/markdown/createHeading");

function apiPage(item) {
  const guide = path.join(__dirname, "api-guides", `${item.id}.md`);
  const prose = fs.existsSync(guide) ? fs.readFileSync(guide, "utf8") : "";
  // Title row (title, Copy page, method badge) replaces the generator's plain H1.
  const heading = createHeading(item.title).join("");
  const md = createApiPageMD(item).replace(
    heading,
    `<ApiTitle method=${JSON.stringify(item.api.method)} title=${JSON.stringify(item.title)} />\n\n`
  );
  return `${md}\n\n${prose}`;
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
