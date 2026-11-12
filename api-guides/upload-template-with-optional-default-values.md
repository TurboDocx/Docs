## Overview

The Upload Template endpoint adds a new DOCX or PPTX template to your TurboDocx workspace in a single multipart request. You can also upload a PDF as a signature-only template (no variables; used to collect signatures, not to generate documents) — see [PDF signature templates](/docs/TurboDocx-Templating/API-Templates#pdf-signature-templates). Alongside the file, you can define the template's variables (the placeholders TurboDocx fills at generation time), give each one a default value, and attach tags. This lets you provision templates programmatically instead of uploading them by hand in the UI, which is how most developers onboard templates at scale.

## When to use it

Use this endpoint to let your users bring their own templates, to migrate a library of documents into TurboDocx during onboarding, or to keep templates in version control and push updates from CI. Once uploaded, generate documents from the returned template ID and manage it with [Get Templates and Folders](/docs/API/get-templates-and-folders) and [Delete Template](/docs/API/delete-template).

## Request fields

| Field | Type | Required | Description |
| ----- | ---- | :------: | ----------- |
| `templateFile` | file (binary) | Yes | The DOCX, PPTX or PDF file to upload. A PDF becomes a signature-only template with no variables. |
| `name` | string | Yes | Display name for the template, for example `SOW Template`. |
| `variables` | JSON string | Yes | Array of placeholder definitions with optional default values. Send `[]` if the template has none. |
| `description` | string | No | Human-readable description. |
| `tags` | JSON string | No | Array of tags for filtering and organization. |

The "optional default values" in the name refers to the per-variable defaults, not to the `variables` field itself: the field is required, but each variable's default value is optional.

## Request notes

Each entry in `variables` maps a placeholder in your document (for example `{CustomerName}`) to a named variable. Set `allowRichTextInjection` to `true` for fields that accept formatted content such as logos or rich blocks.

## Related endpoints

- [Extract Template Placeholders and Generate Preview](/docs/API/extract-template-placeholders-and-generate-preview) to auto-detect placeholders from a file before uploading
- [Get Templates and Folders](/docs/API/get-templates-and-folders) to confirm the upload and retrieve the new template ID
- [Delete Template](/docs/API/delete-template) to remove a template you uploaded
