---
# Hidden from the published site: the turbodocx-sdk gem is not on RubyGems yet.
# Remove `draft: true` when the gem is published (TurboDocx/SDK issue).
draft: true
title: Deliverable Ruby SDK
sidebar_position: 13
sidebar_label: "Deliverable: Ruby"
description: Official TurboDocx Deliverable Ruby SDK. Simple synchronous API for document generation from templates.
keywords:
  - turbodocx deliverable ruby
  - document generation ruby
  - template api ruby
  - deliverable sdk ruby
  - rails document generation
  - gem turbodocx
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# Deliverable Ruby SDK

<QuickstartSkillNudge command="/turbodocx-sdk deliverable" product="Deliverable" />

The official TurboDocx Deliverable SDK for Ruby applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically with a simple synchronous API and comprehensive error handling. Available on RubyGems as `turbodocx-sdk`.

## Installation

<Tabs>
<TabItem value="gem" label="gem" default>

```bash
gem install turbodocx-sdk
```

</TabItem>
<TabItem value="bundler" label="Bundler">

Add to your `Gemfile`:

```ruby
gem "turbodocx-sdk"
```

Then run:

```bash
bundle install
```

</TabItem>
</Tabs>

## Requirements

- Ruby 2.7+
- No runtime dependencies (uses the standard library's `net/http`)

---

## Configuration

```ruby
require "turbodocx_sdk"

# Configure globally (recommended)
TurboDocxSdk::Deliverable.configure(
  api_key: ENV["TURBODOCX_API_KEY"],  # Required: Your TurboDocx API key
  org_id:  ENV["TURBODOCX_ORG_ID"]    # Required: Your organization ID
  # base_url: "https://api.turbodocx.com"  # Optional: Override base URL
)
```

:::tip No Sender Email Required
Unlike TurboSign, the Deliverable module only requires `api_key` and `org_id` — no sender email or name is needed.
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

:::caution API Credentials Required
Both `api_key` and `org_id` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Generate a document from a template

```ruby
require "turbodocx_sdk"

TurboDocxSdk::Deliverable.configure(
  api_key: ENV["TURBODOCX_API_KEY"],
  org_id:  ENV["TURBODOCX_ORG_ID"]
)

# Generate a document from a template with variables
# Request-hash keys are camelCase — the SDK forwards them to the API verbatim
result = TurboDocxSdk::Deliverable.generate_deliverable(
  "name"       => "Q1 Report",
  "templateId" => "your-template-id",
  "variables" => [
    { "placeholder" => "{CompanyName}", "text" => "Acme Corporation", "mimeType" => "text" },
    { "placeholder" => "{Date}", "text" => "2026-03-12", "mimeType" => "text" }
  ],
  "description" => "Quarterly business report",
  "tags"        => ["reports", "quarterly"]
)

puts JSON.pretty_generate(result)
```

### Download and manage deliverables

```ruby
require "turbodocx_sdk"

TurboDocxSdk::Deliverable.configure(
  api_key: ENV["TURBODOCX_API_KEY"],
  org_id:  ENV["TURBODOCX_ORG_ID"]
)

# List deliverables with pagination
items = TurboDocxSdk::Deliverable.list_deliverables(limit: 10, show_tags: true)
puts "Total: #{items['totalRecords']}"

# Get deliverable details
details = TurboDocxSdk::Deliverable.get_deliverable_details("deliverable-uuid")
puts "Name: #{details['name']}"

# Download source file (DOCX/PPTX)
source_bytes = TurboDocxSdk::Deliverable.download_source_file("deliverable-uuid")
File.binwrite("report.docx", source_bytes)

# Download PDF
pdf_bytes = TurboDocxSdk::Deliverable.download_pdf("deliverable-uuid")
File.binwrite("report.pdf", pdf_bytes)

# Update deliverable
TurboDocxSdk::Deliverable.update_deliverable_info(
  "deliverable-uuid",
  "name"        => "Q1 Report - Final",
  "description" => "Final quarterly business report"
)

# Delete deliverable
TurboDocxSdk::Deliverable.delete_deliverable("deliverable-uuid")
```

---

## Variable Types

The Deliverable module supports four variable types for template injection:

### 1. Text Variables

Inject plain text values into template placeholders:

```ruby
variables = [
  { "placeholder" => "{CompanyName}", "text" => "Acme Corporation", "mimeType" => "text" },
  { "placeholder" => "{Date}", "text" => "2026-03-12", "mimeType" => "text" }
]
```

### 2. HTML Variables

Inject rich HTML content with formatting:

```ruby
variables = [
  {
    "placeholder" => "{Summary}",
    "text"        => "<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>",
    "mimeType"    => "html"
  }
]
```

### 3. Image Variables

Inject images by providing a URL or base64-encoded content:

```ruby
variables = [
  {
    "placeholder" => "{Logo}",
    "text"        => "https://example.com/logo.png",
    "mimeType"    => "image"
  }
]
```

### 4. Markdown Variables

Inject markdown content that gets converted to formatted text:

```ruby
variables = [
  {
    "placeholder" => "{Notes}",
    "text"        => "## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.",
    "mimeType"    => "markdown"
  }
]
```

:::info Variable Stack
For repeating content (e.g., table rows), use `variableStack` instead of `text` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

---

## API Reference

:::note Runnable snippets
The snippets below assume you have already called `TurboDocxSdk::Deliverable.configure(...)` and added `require "turbodocx_sdk"` (plus `require "json"` if the snippet calls `JSON.pretty_generate`), as shown in [Quick Start](#quick-start). All methods are synchronous.
:::

### Configure

Configure the SDK with your API credentials and organization settings.

```ruby
TurboDocxSdk::Deliverable.configure(
  api_key:      nil,                          # API key (or use access_token)
  access_token: nil,                          # OAuth2 access token (alternative to api_key)
  org_id:       nil,                          # Required: Your organization ID
  base_url:     "https://api.turbodocx.com"   # Optional: API base URL
)
```

:::caution API Credentials Required
All keyword arguments are optional and fall back to environment variables. Either `api_key` or `access_token` must be provided for authentication, and `org_id` is **required** for all Deliverable operations (enforced at runtime). To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

### Generate deliverable

Generate a new document from a template with variable substitution.

```ruby
result = TurboDocxSdk::Deliverable.generate_deliverable(
  "name"       => "Q1 Report",
  "templateId" => "your-template-id",
  "variables" => [
    { "placeholder" => "{CompanyName}", "text" => "Acme Corp", "mimeType" => "text" },
    { "placeholder" => "{Date}", "text" => "2026-03-12", "mimeType" => "text" }
  ],
  "description" => "Quarterly business report",
  "tags"        => ["reports", "quarterly"]
)

puts JSON.pretty_generate(result)
```

### List deliverables

List deliverables with pagination, search, and filtering.

```ruby
items = TurboDocxSdk::Deliverable.list_deliverables(
  limit:     10,
  offset:    0,
  query:     "report",
  show_tags: true
)

puts JSON.pretty_generate(items)
```

### Get deliverable details

Retrieve the full details of a single deliverable, including variables and fonts.

```ruby
details = TurboDocxSdk::Deliverable.get_deliverable_details("deliverable-uuid", show_tags: true)

puts JSON.pretty_generate(details)
```

### Update deliverable info

Update a deliverable's name, description, or tags.

```ruby
result = TurboDocxSdk::Deliverable.update_deliverable_info(
  "deliverable-uuid",
  "name"        => "Q1 Report - Final",
  "description" => "Final quarterly business report",
  "tags"        => ["reports", "final"]
)

puts JSON.pretty_generate(result)
```

### Delete deliverable

Soft-delete a deliverable.

```ruby
result = TurboDocxSdk::Deliverable.delete_deliverable("deliverable-uuid")

puts JSON.pretty_generate(result)
```

### Download source file

Download the original source file (DOCX or PPTX).

```ruby
source_bytes = TurboDocxSdk::Deliverable.download_source_file("deliverable-uuid")

# Save to file
File.binwrite("report.docx", source_bytes)
```

### Download PDF

Download the PDF version of a deliverable.

```ruby
pdf_bytes = TurboDocxSdk::Deliverable.download_pdf("deliverable-uuid")

# Save to file
File.binwrite("report.pdf", pdf_bytes)
```

---

## Error Handling

The SDK provides typed error classes for different failure scenarios. All errors extend the base `TurboDocxSdk::TurboDocxError` class.

### Error Classes

| Error Class           | Status Code | Description                         |
| --------------------- | ----------- | ----------------------------------- |
| `TurboDocxError`      | varies      | Base error class for all SDK errors |
| `AuthenticationError` | 401         | Invalid or missing API credentials  |
| `AuthorizationError`  | 403         | Authenticated but lacks required permissions |
| `ValidationError`     | 400         | Invalid request parameters          |
| `NotFoundError`       | 404         | Deliverable or template not found   |
| `ConflictError`       | 409         | Request conflicts with current resource state |
| `RateLimitError`      | 429         | Too many requests                   |
| `NetworkError`        | -           | Network connectivity issues         |

### Handling Errors

```ruby
require "turbodocx_sdk"

begin
  result = TurboDocxSdk::Deliverable.generate_deliverable(
    "name"       => "Q1 Report",
    "templateId" => "your-template-id",
    "variables" => [
      { "placeholder" => "{CompanyName}", "text" => "Acme Corp", "mimeType" => "text" }
    ]
  )
rescue TurboDocxSdk::AuthenticationError => e
  puts "Authentication failed: #{e.message}"
  # Check your API key and org ID
rescue TurboDocxSdk::AuthorizationError => e
  puts "Not authorized: #{e.message}"
  # Authenticated, but lacks permission for this operation
rescue TurboDocxSdk::ValidationError => e
  puts "Validation error: #{e.message}"
  # Check request parameters
rescue TurboDocxSdk::NotFoundError => e
  puts "Resource not found: #{e.message}"
  # Template or deliverable doesn't exist
rescue TurboDocxSdk::ConflictError => e
  puts "Conflict: #{e.message}"
  # Request conflicts with the current resource state
rescue TurboDocxSdk::RateLimitError => e
  puts "Rate limited: #{e.message}"
  # Wait and retry
rescue TurboDocxSdk::NetworkError => e
  puts "Network error: #{e.message}"
  # Check connectivity
rescue TurboDocxSdk::TurboDocxError => e
  puts "SDK error: #{e.message}, status_code=#{e.status_code}, code=#{e.code}"
end
```

### Error Properties

All errors include these properties:

| Property      | Type             | Description                          |
| ------------- | ---------------- | ------------------------------------ |
| `message`     | `String`         | Human-readable error description     |
| `status_code` | `Integer \| nil` | HTTP status code (if applicable)     |
| `code`        | `String \| nil`  | Machine-readable error code          |

---

## Ruby Request Hashes

The SDK uses plain Ruby `Hash` objects for flexible JSON-like structures. Request-body keys stay **camelCase** (the SDK forwards them verbatim); only the method keyword arguments (`api_key:`, `show_tags:`, …) are snake_case.

### DeliverableVariable

Variable configuration for template injection:

&nbsp;

| Property                 | Type              | Required | Description                                          |
| ------------------------ | ----------------- | -------- | ---------------------------------------------------- |
| `placeholder`            | `String`          | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `text`                   | `String`          | No\*     | Value to inject                                      |
| `mimeType`               | `String`          | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `isDisabled`             | `Boolean`         | No       | Skip this variable during generation                 |
| `subvariables`           | `Array<Hash>`     | No       | Nested sub-variables for HTML content                |
| `variableStack`          | `Hash \| Array`   | No       | Multiple instances for repeating content             |
| `aiPrompt`               | `String`          | No       | AI prompt for content generation (max 16,000 chars)  |

\*Required unless `variableStack` is provided or `isDisabled` is true.

### CreateDeliverableRequest

Request hash for `generate_deliverable`:

&nbsp;

| Property        | Type            | Required | Description                                |
| --------------- | --------------- | -------- | ------------------------------------------ |
| `name`          | `String`        | Yes      | Deliverable name (3-255 characters)        |
| `templateId`    | `String`        | Yes      | Template ID to generate from               |
| `variables`     | `Array<Hash>`   | Yes      | Variables for template substitution        |
| `description`   | `String`        | No       | Description (up to 65,535 characters)      |
| `tags`          | `Array<String>` | No       | Tag strings to associate                   |

### UpdateDeliverableRequest

Request hash for `update_deliverable_info`:

&nbsp;

| Property      | Type            | Required | Description                              |
| ------------- | --------------- | -------- | ---------------------------------------- |
| `name`        | `String`        | No       | Updated name (3-255 characters)          |
| `description` | `String`        | No       | Updated description                      |
| `tags`        | `Array<String>` | No       | Replace all tags (empty array to remove) |

### ListDeliverablesOptions

Options hash for `list_deliverables` (these are query parameters — `show_tags` is accepted as snake_case or camelCase and sent as `showTags`):

&nbsp;

| Property        | Type      | Required | Description                          |
| --------------- | --------- | -------- | ------------------------------------ |
| `limit`         | `Integer` | No       | Results per page (1-100, default 6)  |
| `offset`        | `Integer` | No       | Results to skip (default 0)          |
| `query`         | `String`  | No       | Search query to filter by name       |
| `show_tags`     | `Boolean` | No       | Include tags in the response         |

### DeliverableRecord

The deliverable hash returned by `list_deliverables`:

&nbsp;

| Property          | Type      | Description                           |
| ----------------- | --------- | ------------------------------------- |
| `id`              | `String`  | Unique deliverable ID (UUID)          |
| `name`            | `String`  | Deliverable name                      |
| `description`     | `String`  | Description text                      |
| `templateId`      | `String`  | Source template ID                    |
| `createdBy`       | `String`  | User ID of the creator                |
| `email`           | `String`  | Creator's email address               |
| `fileSize`        | `Integer` | File size in bytes                    |
| `fileType`        | `String`  | MIME type of the generated file       |
| `defaultFont`     | `String`  | Default font used                     |
| `fonts`           | `Array`   | Fonts used in the document            |
| `isActive`        | `Boolean` | Whether the deliverable is active     |
| `createdOn`       | `String`  | ISO 8601 creation timestamp           |
| `updatedOn`       | `String`  | ISO 8601 last update timestamp        |
| `tags`            | `Array`   | Associated tags (when `show_tags: true`) |

### DeliverableDetailRecord

The deliverable hash returned by `get_deliverable_details`. Includes all fields from [DeliverableRecord](#deliverablerecord) **except `fileSize`**, plus:

&nbsp;

| Property             | Type          | Description                              |
| -------------------- | ------------- | ---------------------------------------- |
| `templateName`       | `String`      | Source template name                     |
| `templateNotDeleted` | `Boolean`     | Whether the source template still exists |
| `variables`          | `Array<Hash>` | Parsed variable objects with values      |

### Tag

Tag object included when `show_tags` is enabled. Each tag is a `Hash` with:

| Key         | Type      | Description                          |
| ----------- | --------- | ------------------------------------ |
| `id`        | `String`  | Tag unique identifier (UUID)         |
| `label`     | `String`  | Tag display name                     |
| `isActive`  | `Boolean` | Whether the tag is active            |
| `updatedOn` | `String`  | ISO 8601 last update timestamp       |
| `createdOn` | `String`  | ISO 8601 creation timestamp          |
| `createdBy` | `String`  | User ID of the tag creator           |
| `orgId`     | `String`  | Organization ID                      |

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[TurboDocx Templating](/docs/TurboDocx%20Templating/How%20to%20Create%20a%20Template)** - How to create and configure document templates
- **[Variable Reference](/docs/API/Deliverable%20API#variable-object-structure)** - Complete guide to variable types, formatting, and advanced injection options
- **[API Reference](/docs/API/Deliverable%20API)** - Full REST API documentation for Deliverable endpoints

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk)
- [RubyGems Package](https://rubygems.org/gems/turbodocx-sdk)
- [API Reference](/docs/API/Deliverable%20API)
