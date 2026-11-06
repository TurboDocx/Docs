## Overview

The Read Tag endpoint lists the active tags in your organization, sorted alphabetically by `label` by default. Despite the singular name, it returns a paginated array, not a single tag. To fetch one tag by its ID, use `GET /Tag/:id`, which returns a single tag object under `data.results` (404 if not found).

## When to use it

Use this endpoint to populate a tag picker or filter dropdown, or to search for an existing tag by name before deciding whether to create a new one with [Create Tag](/docs/API/create-tag).

## Request notes

`limit` defaults to `6`, `offset` to `0`. `query` filters by a case-insensitive match on `label`. Sort with `column0` (`label`, `createdOn`, or `updatedOn`) and `order0` (`asc` or `desc`).

## Related endpoints

- [Create Tag](/docs/API/create-tag) to add a new tag
- [Update Tag](/docs/API/update-tag) to rename an existing tag
- [Delete Tags (by IDs)](/docs/API/delete-tags-by-i-ds) to remove tags in bulk
- `GET /Tag/:id` to fetch a single tag by ID
