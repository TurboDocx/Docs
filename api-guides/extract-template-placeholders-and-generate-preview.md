## Overview

The Extract Template Placeholders and Generate Preview endpoint parses an uploaded DOCX or PPTX file and returns every `{placeholder}` variable and font it found, without creating a template. By default it also renders a PDF preview of the file and returns it inline. This lets you show a user exactly what variables a file contains, and what it looks like, before they commit to uploading it as a template.

## When to use it

Use this endpoint to build an "upload and preview" step ahead of [Upload Template with Optional Default Values](/docs/API/upload-template-with-optional-default-values): show the detected placeholders so the user can confirm or rename them, and show the rendered PDF so they can confirm it's the right file. Pass `skipFile=true` if you only need the extracted variables and fonts and want to skip the (slower) PDF render.

## Related endpoints

- [Upload Template with Optional Default Values](/docs/API/upload-template-with-optional-default-values) to create the template from the same file
- [Get Templates and Folders](/docs/API/get-templates-and-folders) to browse existing templates
