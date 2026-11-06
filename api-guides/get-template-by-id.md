## Overview

The Get Template by ID endpoint returns a single template's full details: its metadata, creator, and the variables available to it. The variables array merges the template's own variables with any inherited from its folder and from your organization's global (knowledge base) variables, so it reflects everything the template can fill in at generation time.

## When to use it

Use this endpoint to load a template's details and variable list before generating a document, to check whether a template is TurboDocx-provided (and therefore read-only), or to confirm a metadata change made with [Edit Template Metadata](/docs/API/edit-template-metadata).

## Request notes

Pass `showTags=true` to include the template's `tags` array in the response; it is omitted by default.

## Related endpoints

- [Get Templates and Folders](/docs/API/get-templates-and-folders) to list templates and find a `TemplateId`
- [Edit Template Metadata](/docs/API/edit-template-metadata) to rename, retag, or move this template
- [Delete Template](/docs/API/delete-template) to remove this template
