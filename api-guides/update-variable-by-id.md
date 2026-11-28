## Overview

The Update Variable (by ID) endpoint replaces a knowledge-base or template-folder variable's content and metadata. Unlike [Edit Template Metadata](/docs/API/edit-template-metadata), this is a full replace, not a partial patch: `mimeType` and `text` are required on every call. `isGlobal` and `templateFolderId` are both optional; at most one may be set.

## When to use it

Use this endpoint to edit a reusable variable you found with [Read Variables (Folder)](/docs/API/read-variables-folder), for example correcting its text, changing its name, or replacing its tag list.

## Request notes

`{VariableId}` in the path is the `variableMapId` returned by [Read Variables (Folder)](/docs/API/read-variables-folder), not the underlying `Variable.id`. Optionally send `isGlobal: true` or `templateFolderId`, but not both; sending both is rejected. For an image variable, set `mimeType` to `"image"` and `text` to a base64 data string.

## Related endpoints

- [Read Variables (Folder)](/docs/API/read-variables-folder) to find the `variableMapId` to update
- [Delete Variables (by IDs)](/docs/API/delete-variables-by-i-ds) to remove variables instead of editing them
