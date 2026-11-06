## Overview

The Read Variables (Folder) endpoint lists reusable variables scoped to your organization's global knowledge base or to a specific template folder. These are standalone variables you manage independently of any one template, for reuse across many templates (for example a company address or a standard clause).

## When to use it

Use this endpoint to build a variable library browser, or to look up a variable's `id` before updating it with [Update Variable by ID](/docs/API/update-variable-by-id) or deleting it with [Delete Variables (by IDs)](/docs/API/delete-variables-by-i-ds).

## Request notes

Optionally pass `isGlobal=true` (your org-wide knowledge base) or `templateFolderId=<folder id>` (a specific folder) to scope the list; at most one may be set, and passing both is rejected. Omit both to list across your accessible scope. `limit` defaults to `6`, `offset` to `0`, and `query` filters by name.

## Related endpoints

- [Update Variable by ID](/docs/API/update-variable-by-id) to change a variable found here
- [Delete Variables (by IDs)](/docs/API/delete-variables-by-i-ds) to remove variables in bulk
- [Get Template by ID](/docs/API/get-template-by-id) to see how folder and global variables merge into a template
