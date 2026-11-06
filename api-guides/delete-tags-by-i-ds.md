## Overview

The Delete Tags (by IDs) endpoint deactivates one or more tags in a single call. It is a soft delete: matching tags are marked inactive rather than removed from the database, so they immediately stop appearing in [Read Tag](/docs/API/read-tag) and tag pickers.

## When to use it

Use this endpoint to let users bulk-remove tags they no longer need, instead of calling a single-tag delete endpoint in a loop.

## Related endpoints

- [Read Tag](/docs/API/read-tag) to find the tag IDs to delete
- [Create Tag](/docs/API/create-tag) to add a new tag
- [Update Tag](/docs/API/update-tag) to rename a tag instead of deleting it
