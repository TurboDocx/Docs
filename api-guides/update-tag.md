## Overview

The Update Tag endpoint changes a tag's `label`. It is a `PUT`, but in practice `label` is the only field you should send. `orgId` is not an accepted body field and returns a validation error if sent. `id` is different: it isn't rejected by validation, and it isn't ignored either; the endpoint applies whatever body you send, so an `id` that differs from the `TagId` in the URL will overwrite the tag's actual `id` instead of being discarded. Omit `id` from the body and let the URL path segment identify the tag to update.

## When to use it

Use this endpoint to rename a tag across your organization; every template or variable already tagged with it keeps the same tag `id`, so the rename applies everywhere the tag is used.

## Related endpoints

- [Read Tag](/docs/API/read-tag) to find the `TagId` to update
- [Create Tag](/docs/API/create-tag) to add a new tag instead
- [Delete Tags (by IDs)](/docs/API/delete-tags-by-i-ds) to remove tags in bulk
