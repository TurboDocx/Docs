## Overview

This endpoint creates a reusable variable scoped to a template folder or to your organization's global knowledge base, independent of any single template. Despite the name, it is not limited to images: `mimeType` also accepts `text` and `html`, and the same endpoint is used for [Read Variables (Folder)](/docs/API/read-variables-folder) to later list.

## When to use it

Use this endpoint to build a shared library of content, such as a company logo, a standard address block, or boilerplate legal language, that multiple templates can reference by placeholder without duplicating the content in each one.

## Request notes

Optionally send `templateFolderId` (scopes the variable to that folder) or `isGlobal: true` (adds it to your org-wide knowledge base); at most one may be set, and sending both is rejected. `text` must be a base64 `data:` URI when `mimeType` is `"image"`, or plain text/HTML otherwise. `placeholder` must be unique within its folder or knowledge base and, if set, must be wrapped in curly braces, for example `{CompanyLogo}`.

## Related endpoints

- [Read Variables (Folder)](/docs/API/read-variables-folder) to list variables you have created
- [Update Variable by ID](/docs/API/update-variable-by-id) to edit a variable after creating it
- [Delete Variables (by IDs)](/docs/API/delete-variables-by-i-ds) to remove variables in bulk
