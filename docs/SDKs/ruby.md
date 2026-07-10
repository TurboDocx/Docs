---
title: TurboSign Ruby SDK
sidebar_position: 7
sidebar_label: "TurboSign: Ruby"
description: Official TurboDocx Ruby SDK. Simple synchronous API for document generation and digital signatures from Ruby, Rails, and Sinatra.
keywords:
  - turbodocx ruby
  - turbosign ruby
  - ruby sdk
  - gem turbodocx
  - rails turbodocx
  - sinatra turbodocx
  - document api ruby
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboSign Ruby SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" />

The official TurboDocx SDK for Ruby applications. Build document generation and digital signature workflows with a simple synchronous API and comprehensive error handling. Available on RubyGems as `turbodocx-sdk`.

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
TurboDocxSdk::TurboSign.configure(
  api_key:      ENV["TURBODOCX_API_KEY"],   # Required: Your TurboDocx API key
  org_id:       ENV["TURBODOCX_ORG_ID"],    # Required: Your organization ID
  sender_email: "contracts@yourcompany.com", # Required: Reply-to address for signature emails
  sender_name:  "Your Company"               # Recommended: Sender name shown in emails
  # base_url:   "https://api.turbodocx.com"  # Optional: Override base URL
)
```

:::tip Authentication
Authenticate using `api_key`. API keys are recommended for server-side applications.
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
TURBODOCX_SENDER_EMAIL=contracts@yourcompany.com
TURBODOCX_SENDER_NAME=Your Company
```

:::warning API Credentials Required
`api_key` and `org_id` are **required** for all API requests. TurboSign additionally **requires `sender_email`** (set it on `configure`, per call, or via the `TURBODOCX_SENDER_EMAIL` environment variable) — `configure` raises a `TurboDocxSdk::ValidationError` without it. `sender_name` is optional but strongly recommended. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Send a Document for Signature

```ruby
require "turbodocx_sdk"

TurboDocxSdk::TurboSign.configure(
  api_key:      ENV["TURBODOCX_API_KEY"],
  org_id:       ENV["TURBODOCX_ORG_ID"],
  sender_email: "contracts@acme.com",
  sender_name:  "Acme Corp"
)

result = TurboDocxSdk::TurboSign.send_signature(
  # Request-hash keys are camelCase — the SDK forwards them to the API verbatim
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
    { name: "Bob Johnson", email: "bob@example.com", signingOrder: 2 }
  ],
  fields: [
    # Alice's signature
    { type: "signature", page: 1, x: 100, y: 650, width: 200, height: 50, recipientEmail: "alice@example.com" },
    { type: "date", page: 1, x: 320, y: 650, width: 100, height: 30, recipientEmail: "alice@example.com" },
    # Bob's signature
    { type: "signature", page: 1, x: 100, y: 720, width: 200, height: 50, recipientEmail: "bob@example.com" },
    { type: "date", page: 1, x: 320, y: 720, width: 100, height: 30, recipientEmail: "bob@example.com" }
  ],
  fileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
  documentName: "Service Agreement",
  senderName:   "Acme Corp",
  senderEmail:  "contracts@acme.com"
)

puts JSON.pretty_generate(result)
```

### Using Template-Based Fields

```ruby
result = TurboDocxSdk::TurboSign.send_signature(
  recipients: [{ name: "Alice Smith", email: "alice@example.com", signingOrder: 1 }],
  fields: [
    {
      type:           "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor:    "{SIGNATURE_ALICE}",
        placement: "replace",
        size:      { width: 200, height: 50 }
      }
    },
    {
      type:           "date",
      recipientEmail: "alice@example.com",
      template: {
        anchor:    "{DATE_ALICE}",
        placement: "replace",
        size:      { width: 100, height: 30 }
      }
    }
  ],
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf"
)

puts JSON.pretty_generate(result)
```

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.
:::

---

## File Input Methods

TurboSign supports four different ways to provide document files:

:::note camelCase request keys
The keys inside the request hash (`fileLink`, `deliverableId`, `templateId`, `documentName`, `recipientEmail`, `signingOrder`, …) are **camelCase** — the SDK passes them to the API verbatim and does **not** convert snake_case hash keys. Only the method keyword arguments on `configure` (`api_key:`, `sender_email:`, …) are snake_case.
:::

### 1. File Upload (path or IO)

Pass a local file path (`String`) or any IO object (e.g., `File.open`, `StringIO`) — the SDK uploads it as multipart form data and detects the file type from magic bytes.

```ruby
result = TurboDocxSdk::TurboSign.send_signature(
  file: "./contract.pdf",  # local path — or an IO: File.open("./contract.pdf", "rb")
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 }
  ],
  fields: [
    {
      type:           "signature",
      page:           1,
      x:              100,
      y:              650,
      width:          200,
      height:         50,
      recipientEmail: "john@example.com"
    }
  ]
)
```

### 2. File URL (fileLink)

```ruby
result = TurboDocxSdk::TurboSign.send_signature(
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 }
  ],
  fields: [
    {
      type:           "signature",
      page:           1,
      x:              100,
      y:              650,
      width:          200,
      height:         50,
      recipientEmail: "john@example.com"
    }
  ]
)
```

:::tip When to use fileLink
Use `fileLink` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

### 3. TurboDocx Deliverable ID

```ruby
# Use a previously generated TurboDocx document
result = TurboDocxSdk::TurboSign.send_signature(
  deliverableId: "deliverable-uuid-from-turbodocx",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 }
  ],
  fields: [
    {
      type:           "signature",
      page:           1,
      x:              100,
      y:              650,
      width:          200,
      height:         50,
      recipientEmail: "john@example.com"
    }
  ]
)
```

:::info Integration with TurboDocx
`deliverableId` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

### 4. TurboDocx Template ID

```ruby
# Use a pre-configured TurboSign template
result = TurboDocxSdk::TurboSign.send_signature(
  templateId: "template-uuid-from-turbodocx",  # Template already contains anchors
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 }
  ],
  fields: [
    {
      type:           "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor:    "{SIGNATURE_ALICE}",
        placement: "replace",
        size:      { width: 200, height: 50 }
      }
    }
  ]
)
```

:::info Integration with TurboDocx
`templateId` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

---

## API Reference

All methods are class-level: call `TurboDocxSdk::TurboSign.configure` once, then invoke any method directly on the class. Every method is synchronous and returns a plain `Hash` (or raw bytes for downloads).

### Configure

Configure the SDK with your API credentials and organization settings.

```ruby
TurboDocxSdk::TurboSign.configure(
  api_key:      "your-api-key",              # Required: Your TurboDocx API key
  org_id:       "your-org-id",               # Required: Your organization ID
  sender_email: "you@company.com",           # Required: Reply-to address for signature emails
  sender_name:  "Your Company",              # Recommended: Sender name shown in emails
  base_url:     "https://api.turbodocx.com"  # Optional: API base URL
)
```

### Prepare for review

Upload a document for preview without sending signature request emails.

```ruby
result = TurboDocxSdk::TurboSign.create_signature_review_link(
  recipients: [{ name: "John Doe", email: "john@example.com", signingOrder: 1 }],
  fields: [{ type: "signature", page: 1, x: 100, y: 500, width: 200, height: 50, recipientEmail: "john@example.com" }],
  fileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
  documentName: "Contract Draft"
)

puts result["documentId"]
puts result["previewUrl"]
```

### Prepare for signing

Upload a document and immediately send signature requests to all recipients.

```ruby
result = TurboDocxSdk::TurboSign.send_signature(
  recipients: [{ name: "Recipient Name", email: "recipient@example.com", signingOrder: 1 }],
  fields: [{ type: "signature", page: 1, x: 100, y: 500, width: 200, height: 50, recipientEmail: "recipient@example.com" }],
  fileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
  documentName: "Service Agreement",
  senderName:   "Your Company",
  senderEmail:  "sender@company.com"
)

puts result["documentId"]
```

### Get status

Retrieve the current status of a document.

```ruby
result = TurboDocxSdk::TurboSign.get_status("document-uuid")

puts JSON.pretty_generate(result)
```

### Download document

Download the completed signed document as PDF bytes.

```ruby
pdf_bytes = TurboDocxSdk::TurboSign.download("document-uuid")

# Save to file
File.binwrite("signed-contract.pdf", pdf_bytes)
```

### Void

Cancel/void a signature request.

```ruby
result = TurboDocxSdk::TurboSign.void_document("document-uuid", "Contract terms changed")
```

### Resend

Resend signature request emails to specific recipients.

```ruby
result = TurboDocxSdk::TurboSign.resend_email("document-uuid", ["recipient-uuid-1", "recipient-uuid-2"])
```

### Get audit trail

Retrieve the complete audit trail for a document, including all events and actions.

```ruby
result = TurboDocxSdk::TurboSign.get_audit_trail("document-uuid")

result["auditTrail"].each do |entry|
  puts "#{entry['actionType']} at #{entry['timestamp']}"
end
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
| `NotFoundError`       | 404         | Document or resource not found      |
| `ConflictError`       | 409         | Request conflicts with current resource state |
| `RateLimitError`      | 429         | Too many requests                   |
| `NetworkError`        | -           | Network connectivity issues         |

### Handling Errors

```ruby
require "turbodocx_sdk"

begin
  result = TurboDocxSdk::TurboSign.send_signature(
    recipients: [{ name: "John Doe", email: "john@example.com", signingOrder: 1 }],
    fields: [{
      type:           "signature",
      page:           1,
      x:              100,
      y:              650,
      width:          200,
      height:         50,
      recipientEmail: "john@example.com"
    }],
    fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf"
  )
rescue TurboDocxSdk::AuthenticationError => e
  puts "Authentication failed: #{e.message}"
  # Check your API key and org ID
rescue TurboDocxSdk::ValidationError => e
  puts "Validation error: #{e.message}"
  # Check request parameters
rescue TurboDocxSdk::NotFoundError => e
  puts "Resource not found: #{e.message}"
  # Document or recipient doesn't exist
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

The SDK uses plain Ruby `Hash` objects for flexible JSON-like structures. Symbol and string keys are both accepted; the key **spelling stays camelCase** because the SDK forwards the hash to the API verbatim.

### SignatureFieldType

String values for field types:

```ruby
# Available field type values
field_types = [
  "signature",
  "initial",
  "date",
  "text",
  "full_name",
  "title",
  "company",
  "first_name",
  "last_name",
  "email",
  "checkbox"
]
```

### Recipient

Recipient configuration for signature requests:

&nbsp;

| Property       | Type      | Required | Description               |
| -------------- | --------- | -------- | ------------------------- |
| `name`         | `String`  | Yes      | Recipient's full name     |
| `email`        | `String`  | Yes      | Recipient's email address |
| `signingOrder` | `Integer` | Yes      | Signing order (1-indexed) |

```ruby
recipient = {
  name:         "John Doe",
  email:        "john@example.com",
  signingOrder: 1
}
```

### Field

Field configuration supporting both coordinate-based and template-based positioning:

&nbsp;

| Property          | Type      | Required | Description                                         |
| ----------------- | --------- | -------- | --------------------------------------------------- |
| `type`            | `String`  | Yes      | Field type (see SignatureFieldType)                 |
| `recipientEmail`  | `String`  | Yes      | Which recipient fills this field                    |
| `page`            | `Integer` | No\*     | Page number (1-indexed)                             |
| `x`               | `Integer` | No\*     | X coordinate in pixels                              |
| `y`               | `Integer` | No\*     | Y coordinate in pixels                              |
| `width`           | `Integer` | No\*     | Field width in pixels                               |
| `height`          | `Integer` | No\*     | Field height in pixels                              |
| `defaultValue`    | `String`  | No       | Default value (for checkbox: `"true"` or `"false"`) |
| `isMultiline`     | `Boolean` | No       | Enable multiline text                               |
| `isReadonly`      | `Boolean` | No       | Make field read-only (pre-filled)                   |
| `required`        | `Boolean` | No       | Whether field is required                           |
| `backgroundColor` | `String`  | No       | Background color (hex, rgb, or named)               |
| `template`        | `Hash`    | No       | Template anchor configuration                       |

\*Required when not using template anchors

**Template Configuration:**

| Property        | Type      | Required | Description                                                      |
| --------------- | --------- | -------- | ---------------------------------------------------------------- |
| `anchor`        | `String`  | Yes      | Text anchor pattern like `{TagName}`                             |
| `placement`     | `String`  | Yes      | `"replace"` \| `"before"` \| `"after"` \| `"above"` \| `"below"` |
| `size`          | `Hash`    | Yes      | `{ width: Integer, height: Integer }`                            |
| `offset`        | `Hash`    | No       | `{ x: Integer, y: Integer }`                                     |
| `caseSensitive` | `Boolean` | No       | Case sensitive search (default: false)                           |
| `useRegex`      | `Boolean` | No       | Use regex for anchor/searchText (default: false)                 |

```ruby
field = {
  type:           "signature",
  page:           1,
  x:              100,
  y:              500,
  width:          200,
  height:         50,
  recipientEmail: "john@example.com"
}
```

### Request Parameters

Request configuration for `create_signature_review_link` and `send_signature` methods:

&nbsp;

| Parameter             | Type            | Required    | Description                    |
| --------------------- | --------------- | ----------- | ------------------------------ |
| `recipients`          | `Array<Hash>`   | Yes         | Recipients who will sign       |
| `fields`              | `Array<Hash>`   | Yes         | Signature fields configuration |
| `file`                | `String \| IO`  | Conditional | Local file path or an IO object (multipart upload) |
| `fileLink`            | `String`        | Conditional | URL to document file           |
| `deliverableId`       | `String`        | Conditional | TurboDocx deliverable ID       |
| `templateId`          | `String`        | Conditional | TurboDocx template ID          |
| `documentName`        | `String`        | No          | Document name                  |
| `documentDescription` | `String`        | No          | Document description           |
| `senderName`          | `String`        | No          | Sender name (overrides the configured value) |
| `senderEmail`         | `String`        | No\*\*      | Sender / reply-to email (overrides the configured value) |
| `ccEmails`            | `Array<String>` | No          | Array of CC email addresses    |

:::info File Source (Conditional)
Exactly one file source is required: `file`, `fileLink`, `deliverableId`, or `templateId`.
:::

\*\* `senderEmail` is optional per call but **required at the SDK level** for TurboSign: it must be supplied via `configure`, the `TURBODOCX_SENDER_EMAIL` environment variable, or this per-call parameter, otherwise the SDK raises a `TurboDocxSdk::ValidationError`.

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[Request Body Reference](/docs/TurboSign/API%20Signatures#request-body-multipartform-data)** - Complete request body parameters, file sources, and multipart/form-data structure
- **[Recipients Reference](/docs/TurboSign/API%20Signatures#recipients-reference)** - Recipient properties, signing order, metadata, and configuration options
- **[Field Types Reference](/docs/TurboSign/API%20Signatures#field-types-reference)** - All available field types (signature, date, text, checkbox, etc.) with properties and behaviors
- **[Field Positioning Methods](/docs/TurboSign/API%20Signatures#field-positioning-methods)** - Template-based vs coordinate-based positioning, anchor configuration, and best practices

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk)
- [RubyGems Package](https://rubygems.org/gems/turbodocx-sdk)
- [API Reference](/docs/TurboSign/API%20Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
