## Overview

The Update Tag endpoint changes a tag's `label`. It is a `PUT`; send the new `label` together with the tag's `id`, the same value as `TagId` in the URL. `orgId` is not an accepted body field and returns a validation error if sent. Always include `id`: the endpoint applies the body as sent, and a body without `id` is given a new random one, which changes the tag's ID and returns an empty response. An `id` that differs from `TagId` likewise overwrites the tag's ID.

## When to use it

Use this endpoint to rename a tag across your organization; every template or variable already tagged with it keeps the same tag `id`, so the rename applies everywhere the tag is used.

## Related endpoints

- [Read Tag](/docs/API/read-tag) to find the `TagId` to update
- [Create Tag](/docs/API/create-tag) to add a new tag instead
- [Delete Tags (by IDs)](/docs/API/delete-tags-by-i-ds) to remove tags in bulk
