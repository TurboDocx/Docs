## Overview

The Delete Template endpoint removes a template from your TurboDocx workspace so it can no longer be used to generate documents. Documents you have already generated from the template are not affected, so this is a safe way to retire unused or outdated templates without touching delivered files. There is no un-delete endpoint, so treat deletion as final.

## When to use it

Use this endpoint to remove templates that are no longer in rotation, deduplicate templates created during testing, or let your users manage their own template library from inside your app. If you only want to change a template's name, description, or tags, use [Edit Template Metadata](/docs/API/edit-template-metadata) instead of deleting and re-uploading.

## Request notes

Replace the path segment with the `TemplateId` returned by [Get Templates and Folders](/docs/API/get-templates-and-folders).

## Related endpoints

- [Get Templates and Folders](/docs/API/get-templates-and-folders) to find the `TemplateId` to delete
- [Upload Template with Optional Default Values](/docs/API/upload-template-with-optional-default-values) to create a replacement template
- [Edit Template Metadata](/docs/API/edit-template-metadata) to rename or retag instead of deleting
