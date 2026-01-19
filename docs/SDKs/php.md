---
title: PHP SDK
sidebar_position: 5
sidebar_label: 'TurboSign: PHP'
description: Official TurboDocx PHP SDK. Modern PHP 8.1+ with strong typing, enums, and PSR standards for document generation and digital signatures.
keywords:
  - turbodocx php
  - turbosign php
  - php sdk
  - composer turbodocx
  - php 8.1 sdk
  - laravel turbodocx
  - symfony turbodocx
  - document api php
  - esignature php
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PHP SDK

The official TurboDocx SDK for PHP applications. Build document generation and digital signature workflows with modern PHP 8.1+ features, strong typing, and comprehensive error handling. Available on Packagist as `turbodocx/sdk`.

## Installation

```bash
composer require turbodocx/sdk
```

## Requirements

- PHP 8.1 or higher
- Composer
- ext-json
- ext-fileinfo

:::tip Modern PHP Features
This SDK leverages PHP 8.1+ features including enums, named parameters, readonly classes, and match expressions for a superior developer experience.
:::

---

## Configuration

<Tabs>
<TabItem value="manual" label="Manual Configuration" default>

```php
<?php

use TurboDocx\TurboSign;
use TurboDocx\Config\HttpClientConfig;

// Configure with all options
TurboSign::configure(new HttpClientConfig(
    apiKey: $_ENV['TURBODOCX_API_KEY'],           // Required: Your TurboDocx API key
    orgId: $_ENV['TURBODOCX_ORG_ID'],             // Required: Your organization ID
    senderEmail: $_ENV['TURBODOCX_SENDER_EMAIL'], // Required: Reply-to email for signature requests
    senderName: $_ENV['TURBODOCX_SENDER_NAME'],   // Optional: Sender name (strongly recommended)
    baseUrl: 'https://api.turbodocx.com'          // Optional: Custom API endpoint
));
```

</TabItem>
<TabItem value="env" label="From Environment">

```php
<?php

use TurboDocx\TurboSign;
use TurboDocx\Config\HttpClientConfig;

// Auto-configure from environment variables
TurboSign::configure(HttpClientConfig::fromEnvironment());

// Reads from: TURBODOCX_API_KEY, TURBODOCX_ORG_ID,
//             TURBODOCX_SENDER_EMAIL, TURBODOCX_SENDER_NAME
```

</TabItem>
</Tabs>

:::warning Sender Email Required
The `senderEmail` parameter is **required** for PHP SDK. This email appears as the reply-to address in signature request emails. Without it, emails will default to "API Service User via TurboSign".
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
TURBODOCX_SENDER_EMAIL=you@company.com
TURBODOCX_SENDER_NAME=Your Company Name
```

:::warning API Credentials Required
Both `apiKey` and `orgId` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Send a Document for Signature

```php
<?php

use TurboDocx\TurboSign;
use TurboDocx\Config\HttpClientConfig;
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;

TurboSign::configure(HttpClientConfig::fromEnvironment());

// Send document with coordinate-based fields
$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        recipients: [
            new Recipient('Alice Smith', 'alice@example.com', 1),
            new Recipient('Bob Johnson', 'bob@example.com', 2)
        ],
        fields: [
            // Alice's signature
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'alice@example.com',
                page: 1,
                x: 100,
                y: 650,
                width: 200,
                height: 50
            ),
            new Field(
                type: SignatureFieldType::DATE,
                recipientEmail: 'alice@example.com',
                page: 1,
                x: 320,
                y: 650,
                width: 100,
                height: 30
            ),
            // Bob's signature
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'bob@example.com',
                page: 1,
                x: 100,
                y: 720,
                width: 200,
                height: 50
            ),
            new Field(
                type: SignatureFieldType::DATE,
                recipientEmail: 'bob@example.com',
                page: 1,
                x: 320,
                y: 720,
                width: 100,
                height: 30
            )
        ],
        fileLink: 'https://example.com/contract.pdf',
        documentName: 'Service Agreement',
        senderName: 'Acme Corp',
        senderEmail: 'contracts@acme.com'
    )
);

echo "Document ID: {$result->documentId}\n";
```

:::warning Always Handle Errors
The above examples omit error handling for brevity. In production, wrap all TurboSign calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

### Using Template-Based Fields

```php
<?php

use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;
use TurboDocx\Types\TemplateConfig;
use TurboDocx\Types\FieldPlacement;

$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        recipients: [
            new Recipient('Alice Smith', 'alice@example.com', 1)
        ],
        fields: [
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'alice@example.com',
                template: new TemplateConfig(
                    anchor: '{SIGNATURE_ALICE}',
                    placement: FieldPlacement::REPLACE,
                    size: ['width' => 200, 'height' => 50]
                )
            ),
            new Field(
                type: SignatureFieldType::DATE,
                recipientEmail: 'alice@example.com',
                template: new TemplateConfig(
                    anchor: '{DATE_ALICE}',
                    placement: FieldPlacement::REPLACE,
                    size: ['width' => 100, 'height' => 30]
                )
            )
        ],
        fileLink: 'https://example.com/contract-with-placeholders.pdf',
        senderName: 'Your Company',
        senderEmail: 'sender@company.com'
    )
);
```

:::warning Always Handle Errors
The above examples omit error handling for brevity. In production, wrap all TurboSign calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.
:::

---

## File Input Methods

TurboSign supports four different ways to provide document files:

### 1. File Upload (Direct)

```php
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;

$pdfContent = file_get_contents('./contract.pdf');

$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        file: $pdfContent,
        fileName: 'contract.pdf',  // Optional
        recipients: [
            new Recipient('John Doe', 'john@example.com', 1)
        ],
        fields: [
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'john@example.com',
                page: 1,
                x: 100,
                y: 500,
                width: 200,
                height: 50
            )
        ]
    )
);
```

### 2. File URL

```php
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;

$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        fileLink: 'https://storage.example.com/contracts/agreement.pdf',
        recipients: [
            new Recipient('John Doe', 'john@example.com', 1)
        ],
        fields: [
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'john@example.com',
                page: 1,
                x: 100,
                y: 500,
                width: 200,
                height: 50
            )
        ]
    )
);
```

:::tip When to use fileLink
Use `fileLink` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

### 3. TurboDocx Deliverable ID

```php
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;

// Use a previously generated TurboDocx document
$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        deliverableId: 'deliverable-uuid-from-turbodocx',
        recipients: [
            new Recipient('John Doe', 'john@example.com', 1)
        ],
        fields: [
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'john@example.com',
                page: 1,
                x: 100,
                y: 500,
                width: 200,
                height: 50
            )
        ]
    )
);
```

:::info Integration with TurboDocx
`deliverableId` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

### 4. TurboDocx Template ID

```php
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;
use TurboDocx\Types\TemplateConfig;
use TurboDocx\Types\FieldPlacement;

// Use a pre-configured TurboSign template
$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        templateId: 'template-uuid-from-turbodocx',
        recipients: [
            new Recipient('Alice Smith', 'alice@example.com', 1)
        ],
        fields: [
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'alice@example.com',
                template: new TemplateConfig(
                    anchor: '{SIGNATURE_ALICE}',
                    placement: FieldPlacement::REPLACE,
                    size: ['width' => 200, 'height' => 50]
                )
            )
        ]
    )
);
```

:::info Integration with TurboDocx
`templateId` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

---

## API Reference

### Configure

Configure the SDK with your API credentials and organization settings.

```php
use TurboDocx\TurboSign;
use TurboDocx\Config\HttpClientConfig;

// Manual configuration
TurboSign::configure(new HttpClientConfig(
    apiKey: 'your-api-key',
    orgId: 'your-org-id',
    senderEmail: 'you@company.com',
    senderName: 'Your Company'
));

// Or from environment
TurboSign::configure(HttpClientConfig::fromEnvironment());
```

### Prepare for review

Upload a document for preview without sending signature request emails.

```php
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\CreateSignatureReviewLinkRequest;

$result = TurboSign::createSignatureReviewLink(
    new CreateSignatureReviewLinkRequest(
        recipients: [
            new Recipient('John Doe', 'john@example.com', 1)
        ],
        fields: [
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'john@example.com',
                page: 1,
                x: 100,
                y: 500,
                width: 200,
                height: 50
            )
        ],
        fileLink: 'https://example.com/document.pdf',
        documentName: 'Contract Draft'
    )
);

echo "Preview URL: {$result->previewUrl}\n";
echo "Document ID: {$result->documentId}\n";
```

### Prepare for signing

Upload a document and immediately send signature requests to all recipients.

```php
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;

$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        recipients: [
            new Recipient('Recipient Name', 'recipient@example.com', 1)
        ],
        fields: [
            new Field(
                type: SignatureFieldType::SIGNATURE,
                recipientEmail: 'recipient@example.com',
                page: 1,
                x: 100,
                y: 500,
                width: 200,
                height: 50
            )
        ],
        fileLink: 'https://example.com/document.pdf',
        documentName: 'Service Agreement'
    )
);

echo "Document ID: {$result->documentId}\n";
```

### Get status

Retrieve the current status of a document.

```php
$status = TurboSign::getStatus('document-uuid');

echo "Document Status: {$status->status}\n";  // 'pending', 'completed', 'voided'
```

### Download document

Download the completed signed document as PDF content.

```php
$pdfContent = TurboSign::download('document-uuid');

// Save to file
file_put_contents('signed-contract.pdf', $pdfContent);

// Or send as HTTP response
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="signed.pdf"');
echo $pdfContent;
```

### Void

Cancel/void a signature request that hasn't been completed.

```php
use TurboDocx\Types\Responses\VoidDocumentResponse;

$result = TurboSign::void('document-uuid', 'Document needs to be revised');

echo "Success: " . ($result->success ? 'Yes' : 'No') . "\n";
echo "Message: {$result->message}\n";
```

### Resend

Resend signature request emails to specific recipients.

```php
// Resend to specific recipients
$result = TurboSign::resend('document-uuid', ['recipient-id-1', 'recipient-id-2']);

// Resend to all recipients
$result = TurboSign::resend('document-uuid', []);

echo "Recipients notified: {$result->recipientCount}\n";
```

### Get audit trail

Retrieve the complete audit trail for a document, including all events and actions.

```php
$audit = TurboSign::getAuditTrail('document-uuid');

echo "Audit Trail:\n";
foreach ($audit->auditTrail as $entry) {
    echo "  {$entry->timestamp} - {$entry->actionType}";
    if ($entry->user) {
        echo " by {$entry->user->name}";
    }
    echo "\n";
}
```

---

## Field Types

TurboSign supports 11 different field types using PHP enums:

```php
use TurboDocx\Types\SignatureFieldType;

SignatureFieldType::SIGNATURE    // Signature field
SignatureFieldType::INITIAL       // Initial field
SignatureFieldType::DATE          // Date stamp (auto-filled when signed)
SignatureFieldType::TEXT          // Free text input
SignatureFieldType::FULL_NAME     // Full name (auto-filled from recipient)
SignatureFieldType::FIRST_NAME    // First name
SignatureFieldType::LAST_NAME     // Last name
SignatureFieldType::EMAIL         // Email address
SignatureFieldType::TITLE         // Job title
SignatureFieldType::COMPANY       // Company name
SignatureFieldType::CHECKBOX      // Checkbox field
```

### Field Positioning

TurboSign supports two ways to position fields:

#### 1. Coordinate-Based (Pixel Perfect)

```php
new Field(
    type: SignatureFieldType::SIGNATURE,
    recipientEmail: 'john@example.com',
    page: 1,          // Page number (1-indexed)
    x: 100,           // X coordinate
    y: 500,           // Y coordinate
    width: 200,       // Width in pixels
    height: 50        // Height in pixels
)
```

#### 2. Template Anchors (Dynamic)

```php
use TurboDocx\Types\TemplateConfig;
use TurboDocx\Types\FieldPlacement;

new Field(
    type: SignatureFieldType::SIGNATURE,
    recipientEmail: 'john@example.com',
    template: new TemplateConfig(
        anchor: '{signature1}',                // Text to find in PDF
        placement: FieldPlacement::REPLACE,    // How to place the field
        size: ['width' => 100, 'height' => 30]
    )
)
```

**Placement Options:**
- `FieldPlacement::REPLACE` - Replace the anchor text
- `FieldPlacement::BEFORE` - Place before the anchor
- `FieldPlacement::AFTER` - Place after the anchor
- `FieldPlacement::ABOVE` - Place above the anchor
- `FieldPlacement::BELOW` - Place below the anchor

### Advanced Field Options

```php
// Checkbox (pre-checked, readonly)
new Field(
    type: SignatureFieldType::CHECKBOX,
    recipientEmail: 'john@example.com',
    page: 1,
    x: 100,
    y: 600,
    width: 20,
    height: 20,
    defaultValue: 'true',     // Pre-checked
    isReadonly: true          // Cannot be unchecked
)

// Multiline text field
new Field(
    type: SignatureFieldType::TEXT,
    recipientEmail: 'john@example.com',
    page: 1,
    x: 100,
    y: 200,
    width: 400,
    height: 100,
    isMultiline: true,        // Allow multiple lines
    required: true,           // Field is required
    backgroundColor: '#f0f0f0' // Background color
)

// Readonly text (pre-filled, non-editable)
new Field(
    type: SignatureFieldType::TEXT,
    recipientEmail: 'john@example.com',
    page: 1,
    x: 100,
    y: 300,
    width: 300,
    height: 30,
    defaultValue: 'This text is pre-filled',
    isReadonly: true
)
```

---

## Error Handling

The SDK provides typed exceptions for different error scenarios:

```php
use TurboDocx\Exceptions\AuthenticationException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Exceptions\NotFoundException;
use TurboDocx\Exceptions\RateLimitException;
use TurboDocx\Exceptions\NetworkException;

try {
    $result = TurboSign::sendSignature(/* ... */);
} catch (AuthenticationException $e) {
    // 401 - Invalid API key or access token
    echo "Authentication failed: {$e->getMessage()}\n";
} catch (ValidationException $e) {
    // 400 - Invalid request data
    echo "Validation error: {$e->getMessage()}\n";
} catch (NotFoundException $e) {
    // 404 - Document not found
    echo "Not found: {$e->getMessage()}\n";
} catch (RateLimitException $e) {
    // 429 - Rate limit exceeded
    echo "Rate limit: {$e->getMessage()}\n";
} catch (NetworkException $e) {
    // Network/connection error
    echo "Network error: {$e->getMessage()}\n";
}
```

### Error Classes

| Error Class               | Status Code | Description                        |
| ------------------------- | ----------- | ---------------------------------- |
| `TurboDocxException`      | varies      | Base exception for all SDK errors  |
| `AuthenticationException` | 401         | Invalid or missing API credentials |
| `ValidationException`     | 400         | Invalid request parameters         |
| `NotFoundException`       | 404         | Document or resource not found     |
| `RateLimitException`      | 429         | Too many requests                  |
| `NetworkException`        | -           | Network connectivity issues        |

All exceptions extend `TurboDocxException` and include:
- `getMessage()` - Human-readable error message
- `statusCode` - HTTP status code (if applicable)
- `errorCode` - Error code string (e.g., 'AUTHENTICATION_ERROR')

---

## PHP Types

### Enums

The SDK uses PHP 8.1+ enums for type safety:

```php
// Field types
enum SignatureFieldType: string {
    case SIGNATURE = 'signature';
    case INITIAL = 'initial';
    case DATE = 'date';
    case TEXT = 'text';
    case FULL_NAME = 'full_name';
    case FIRST_NAME = 'first_name';
    case LAST_NAME = 'last_name';
    case EMAIL = 'email';
    case TITLE = 'title';
    case COMPANY = 'company';
    case CHECKBOX = 'checkbox';
}

// Field placement
enum FieldPlacement: string {
    case REPLACE = 'replace';
    case BEFORE = 'before';
    case AFTER = 'after';
    case ABOVE = 'above';
    case BELOW = 'below';
}

// Document status
enum DocumentStatus: string {
    case DRAFT = 'draft';
    case SETUP_COMPLETE = 'setup_complete';
    case REVIEW_READY = 'review_ready';
    case UNDER_REVIEW = 'under_review';
    case PENDING = 'pending';
    case COMPLETED = 'completed';
    case VOIDED = 'voided';
}
```

### Readonly Classes

The SDK uses readonly classes with typed properties:

```php
final class Recipient {
    public function __construct(
        public string $name,
        public string $email,
        public int $signingOrder
    ) {}
}

final class Field {
    public function __construct(
        public SignatureFieldType $type,
        public string $recipientEmail,
        public ?int $page = null,
        public ?int $x = null,
        public ?int $y = null,
        public ?int $width = null,
        public ?int $height = null,
        public ?TemplateConfig $template = null,
        public ?string $defaultValue = null,
        public bool $isMultiline = false,
        public bool $isReadonly = false,
        public bool $required = false,
        public ?string $backgroundColor = null
    ) {}
}
```

### Request Objects

```php
final class SendSignatureRequest {
    public function __construct(
        public array $recipients,           // Recipient[]
        public array $fields,               // Field[]
        public ?string $file = null,
        public ?string $fileName = null,
        public ?string $fileLink = null,
        public ?string $deliverableId = null,
        public ?string $templateId = null,
        public ?string $documentName = null,
        public ?string $documentDescription = null,
        public ?string $senderName = null,
        public ?string $senderEmail = null,
        public ?array $ccEmails = null
    ) {}
}
```

:::info File Source (Conditional)
Exactly one file source is required: `file`, `fileLink`, `deliverableId`, or `templateId`.
:::

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

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
- [Packagist Package](https://packagist.org/packages/turbodocx/sdk)
- [API Reference](/docs/TurboSign/API%20Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
