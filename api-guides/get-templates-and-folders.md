## Overview

The Get Templates and Folders endpoint lists the templates and folders at the root of your TurboDocx workspace, including each item's ID, name, parent folder, and tags. By default it returns only root-level items; pass `type=template` to enumerate every template across all folders. It is the starting point for most integrations: call it to discover the `TemplateId` values you pass to document generation, or to build a template picker inside your own app.

## When to use it

Use this endpoint to populate a "choose a template" dropdown, sync your template library into another system, or look up the ID of a template before generating a document or deleting it. Results include each item's `tags` by default (`showTags` defaults to `true`); page through large libraries with `limit` and `offset`.

## Pagination and filtering

Page with `limit` (default `9`) and `offset` (default `0`): request successive pages by increasing `offset` by `limit`, and use `totalRecords` to know when to stop. Other supported query parameters:

- `query` — free-text search across template names
- `selectedTags` — one or more tag IDs (GUIDs) to filter by
- `column0` + `order0` — sort by `name`, `createdOn`, `updatedOn`, `email`, or `templateCount`, in `asc` or `desc` order
- `showTags` — set to `false` to omit the `tags` array

## Related endpoints

- [Get Template by ID](/docs/API/get-template-by-id) to fetch one template's full details
- [Upload Template with Optional Default Values](/docs/API/upload-template-with-optional-default-values) to add a new template
- [Delete Template](/docs/API/delete-template) to remove a template you found here
