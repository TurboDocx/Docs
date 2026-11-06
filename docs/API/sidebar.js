// API reference sidebar. Endpoint pages are generated from tdocxcollection.yml (see dev-docs-openapi.js);
// `className` drives the small method tag shown before each endpoint name.
// Guides that live in other sections are `ref` items so they keep their own URL and breadcrumb.
// The sidebar text is the page title: generated pages set sidebar_label, which wins over a label here.
const ep = (id, method) => ({ type: "doc", id: `API/${id}`, className: `api-method ${method}` });
const group = (label, items) => ({ type: "category", label, collapsed: true, items });

module.exports = [
  {
    type: "category",
    label: "Getting Started",
    collapsed: false,
    items: [
      { type: "doc", id: "API/turbodocx-api-documentation", label: "Introduction and Authentication" },
      { type: "doc", id: "API/Deliverable-API", label: "Generate Documents" },
      { type: "ref", id: "TurboSign/API-Signatures", label: "Send for Signature" },
      { type: "ref", id: "TurboSign/API-Bulk-Signatures", label: "Bulk Signatures" },
      { type: "ref", id: "TurboDocx-Templating/API-Templates", label: "Templates" },
      { type: "ref", id: "TurboSign/Webhooks", label: "Webhooks" },
    ],
  },
  {
    type: "category",
    label: "Resources and Endpoints",
    collapsed: false,
    items: [
      group("Templates", [
        ep("upload-template-with-optional-default-values", "post"),
        ep("extract-template-placeholders-and-generate-preview", "post"),
        ep("get-templates-and-folders", "get"),
        ep("get-template-by-id", "get"),
        ep("edit-template-metadata", "patch"),
        ep("delete-template", "delete"),
      ]),
      group("Variables", [
        ep("create-image-variable-folder", "post"),
        ep("read-variables-folder", "get"),
        ep("update-variable-by-id", "put"),
        ep("delete-variables-by-i-ds", "delete"),
      ]),
      group("Tags", [
        ep("create-tag", "post"),
        ep("read-tag", "get"),
        ep("update-tag", "put"),
        ep("delete-tags-by-i-ds", "delete"),
      ]),
      group("Deliverables", [
        ep("generate-deliverable", "post"),
        ep("list-deliverables", "get"),
        ep("get-deliverable", "get"),
        ep("update-deliverable", "patch"),
        ep("delete-deliverable", "delete"),
        ep("download-deliverable-source-file", "get"),
        ep("download-deliverable-pdf", "get"),
      ]),
      group("TurboSign", [
        ep("prepare-document-for-review", "post"),
        ep("send-document-for-signature", "post"),
        ep("list-signature-documents", "get"),
        ep("get-document-status", "get"),
        ep("get-document-recipients", "get"),
        ep("send-signing-reminder", "post"),
        ep("resend-signing-email", "post"),
        ep("void-document", "post"),
        ep("download-signed-document", "get"),
        ep("get-audit-trail", "get"),
        ep("get-template-signature-setup", "get"),
      ]),
      group("Bulk Signatures", [
        ep("create-bulk-batch", "post"),
        ep("list-bulk-batches", "get"),
        ep("get-bulk-batch", "get"),
        ep("list-bulk-batch-jobs", "get"),
        ep("cancel-bulk-batch", "post"),
      ]),
      group("Webhooks", [
        ep("create-webhook", "post"),
        ep("get-webhook", "get"),
        ep("update-webhook", "patch"),
        ep("delete-webhook", "delete"),
        ep("test-webhook", "post"),
        ep("notify-webhook", "post"),
        ep("regenerate-webhook-secret", "post"),
        ep("list-webhook-deliveries", "get"),
        ep("replay-webhook-delivery", "post"),
        ep("get-webhook-stats", "get"),
      ]),
      group("Account", [ep("list-organizations", "get")]),
    ],
  },
  {
    type: "category",
    label: "Embedded Signing",
    collapsed: true,
    items: [
      { type: "ref", id: "TurboSign/embedded-signing/index", label: "Overview" },
      ep("create-embedded-signing-url", "post"),
      ep("get-embedded-signing-settings", "get"),
      { type: "ref", id: "TurboSign/embedded-signing/reference", label: "Embedded Signing Reference" },
    ],
  },
  {
    type: "category",
    label: "SDKs and Integrations",
    collapsed: true,
    items: [
      { type: "ref", id: "SDKs/index", label: "SDKs Overview" },
      { type: "ref", id: "SDKs/agent-skills", label: "Agent Skills" },
    ],
  },
];
