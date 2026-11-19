## Overview

The Delete Variables (by IDs) endpoint removes one or more variables from your knowledge base or a template folder in a single call, along with their versions, tags, and (for image variables) their stored files.

## When to use it

Use this endpoint to let users bulk-clean their variable library, instead of calling a single-variable delete endpoint in a loop.

## Request notes

Each entry in `ids` is a `variableMapId`, the same `id` returned by [Read Variables (Folder)](/docs/API/read-variables-folder).

## Related endpoints

- [Read Variables (Folder)](/docs/API/read-variables-folder) to find the variable IDs to delete
- [Update Variable by ID](/docs/API/update-variable-by-id) to edit a variable instead of deleting it
