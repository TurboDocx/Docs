## Overview

The Edit Template Metadata endpoint updates a template's name, description, folder, or tags without touching its file or variables. Send only the fields you want to change; fields you omit are left as-is.

## When to use it

Use this endpoint to rename a template, move it into a different folder (`templateFolderId`), or replace its tags after you have already uploaded it. To change the file itself, delete the template and upload a new one with [Upload Template with Optional Default Values](/docs/API/upload-template-with-optional-default-values).

## Request notes

Sending `tags` replaces the template's entire tag list: existing tags not included in the array are removed. Each entry only needs the tag's `id`, from [Create Tag](/docs/API/create-tag) or [Read Tag](/docs/API/read-tag).

## Related endpoints

- [Get Template by ID](/docs/API/get-template-by-id) to see the current metadata before editing
- [Delete Template](/docs/API/delete-template) to remove a template instead of editing it
- [Get Templates and Folders](/docs/API/get-templates-and-folders) to find the `TemplateId` to edit
