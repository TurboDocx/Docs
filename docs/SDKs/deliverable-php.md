---
title: PHP SDK
sidebar_position: 10
sidebar_label: "Deliverable: PHP"
description: Official TurboDocx Deliverable PHP SDK. Modern PHP 8.1+ with strong typing, enums, and PSR standards for document generation from templates.
keywords:
  - turbodocx deliverable php
  - document generation php
  - template api php
  - deliverable sdk php
  - php 8.1 sdk
  - laravel turbodocx
  - symfony turbodocx
  - composer turbodocx
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PHP SDK

The official TurboDocx Deliverable SDK for PHP applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically. Available on Packagist as `turbodocx/sdk`.

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

use TurboDocx\Deliverable;
use TurboDocx\Config\DeliverableConfig;

// Configure with all options
Deliverable::configure(new DeliverableConfig(
    apiKey: $_ENV['TURBODOCX_API_KEY'],   // Required: Your TurboDocx API key
    orgId: $_ENV['TURBODOCX_ORG_ID'],     // Required: Your organization ID
    baseUrl: 'https://api.turbodocx.com'  // Optional: Custom API endpoint
));
```

</TabItem>
<TabItem value="env" label="From Environment">

```php
<?php

use TurboDocx\Deliverable;
use TurboDocx\Config\DeliverableConfig;

// Auto-configure from environment variables
Deliverable::configure(DeliverableConfig::fromEnvironment());

// Reads from: TURBODOCX_API_KEY, TURBODOCX_ORG_ID
```

</TabItem>
</Tabs>

:::tip No senderEmail Required
Unlike TurboSign, the Deliverable module only requires `apiKey` and `orgId` — no sender email or name is needed.
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

:::caution API Credentials Required
Both `apiKey` and `orgId` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Generate a document from a template

```php
<?php

use TurboDocx\Deliverable;
use TurboDocx\Config\DeliverableConfig;

Deliverable::configure(DeliverableConfig::fromEnvironment());

// Generate a document from a template with variables
$result = Deliverable::generateDeliverable([
    'name' => 'Q1 Report',
    'templateId' => 'your-template-id',
    'variables' => [
        ['placeholder' => '{CompanyName}', 'text' => 'Acme Corporation', 'mimeType' => 'text'],
        ['placeholder' => '{Date}', 'text' => '2026-03-12', 'mimeType' => 'text'],
    ],
    'description' => 'Quarterly business report',
    'tags' => ['reports', 'quarterly'],
]);

echo "Deliverable ID: {$result['results']['deliverable']['id']}\n";
```

:::caution Always Handle Errors
The above examples omit error handling for brevity. In production, wrap all Deliverable calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

### Download and manage deliverables

```php
<?php

use TurboDocx\Deliverable;

// List deliverables with pagination
$list = Deliverable::listDeliverables(['limit' => 10, 'showTags' => true]);
echo "Total: {$list['totalRecords']}\n";

// Get deliverable details
$details = Deliverable::getDeliverableDetails('deliverable-uuid', showTags: true);
echo "Name: {$details['name']}\n";

// Download source file (DOCX/PPTX)
$sourceFile = Deliverable::downloadSourceFile('deliverable-uuid');
file_put_contents('report.docx', $sourceFile);

// Download PDF
$pdfFile = Deliverable::downloadPDF('deliverable-uuid');
file_put_contents('report.pdf', $pdfFile);

// Update deliverable
$updated = Deliverable::updateDeliverableInfo('deliverable-uuid', [
    'name' => 'Q1 Report - Final',
    'description' => 'Final quarterly business report',
]);

// Delete deliverable
$deleted = Deliverable::deleteDeliverable('deliverable-uuid');
```

:::caution Always Handle Errors
The above examples omit error handling for brevity. In production, wrap all Deliverable calls in try-catch blocks. See [Error Handling](#error-handling) for complete patterns.
:::

---

## Variable Types

The Deliverable module supports four variable types for template injection:

### 1. Text Variables

Inject plain text values into template placeholders:

```php
$variables = [
    ['placeholder' => '{CompanyName}', 'text' => 'Acme Corporation', 'mimeType' => 'text'],
    ['placeholder' => '{Date}', 'text' => '2026-03-12', 'mimeType' => 'text'],
];
```

### 2. HTML Variables

Inject rich HTML content with formatting:

```php
$variables = [
    [
        'placeholder' => '{Summary}',
        'text' => '<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>',
        'mimeType' => 'html',
    ],
];
```

### 3. Image Variables

Inject images by providing a URL or base64-encoded content:

```php
$variables = [
    [
        'placeholder' => '{Logo}',
        'text' => 'https://example.com/logo.png',
        'mimeType' => 'image',
    ],
];
```

### 4. Markdown Variables

Inject markdown content that gets converted to formatted text:

```php
$variables = [
    [
        'placeholder' => '{Notes}',
        'text' => "## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.",
        'mimeType' => 'markdown',
    ],
];
```

:::info Variable Stack
For repeating content (e.g., table rows), use `variableStack` instead of `text` to provide multiple values for the same placeholder. See the [PHP Types section](#php-types) for details.
:::

---

## API Reference

### Configure

Configure the SDK with your API credentials and organization settings.

```php
use TurboDocx\Deliverable;
use TurboDocx\Config\DeliverableConfig;

// Manual configuration
Deliverable::configure(new DeliverableConfig(
    apiKey: 'your-api-key',
    orgId: 'your-org-id'
));

// Or from environment
Deliverable::configure(DeliverableConfig::fromEnvironment());
```

### Generate deliverable

Generate a new document from a template with variable substitution.

```php
$result = Deliverable::generateDeliverable([
    'name' => 'Q1 Report',
    'templateId' => 'your-template-id',
    'variables' => [
        ['placeholder' => '{CompanyName}', 'text' => 'Acme Corp', 'mimeType' => 'text'],
        ['placeholder' => '{Date}', 'text' => '2026-03-12', 'mimeType' => 'text'],
    ],
    'description' => 'Quarterly business report',
    'tags' => ['reports', 'quarterly'],
]);

echo "Deliverable ID: {$result['results']['deliverable']['id']}\n";
```

### List deliverables

List deliverables with pagination, search, and filtering.

```php
$list = Deliverable::listDeliverables([
    'limit' => 10,
    'offset' => 0,
    'query' => 'report',
    'showTags' => true,
]);

echo "Total records: {$list['totalRecords']}\n";
foreach ($list['results'] as $deliverable) {
    echo "  {$deliverable['name']}\n";
}
```

### Get deliverable details

Retrieve the full details of a single deliverable, including variables and fonts.

```php
$details = Deliverable::getDeliverableDetails('deliverable-uuid', showTags: true);

echo "Name: {$details['name']}\n";
echo "Template: {$details['templateName']}\n";
echo "Created: {$details['createdOn']}\n";
```

### Update deliverable info

Update a deliverable's name, description, or tags.

```php
$result = Deliverable::updateDeliverableInfo('deliverable-uuid', [
    'name' => 'Q1 Report - Final',
    'description' => 'Final quarterly business report',
    'tags' => ['reports', 'final'],
]);

echo "Updated: {$result['deliverableId']}\n";
```

### Delete deliverable

Soft-delete a deliverable.

```php
$result = Deliverable::deleteDeliverable('deliverable-uuid');

echo "Deleted: {$result['deliverableId']}\n";
echo "Message: {$result['message']}\n";
```

### Download source file

Download the original source file (DOCX or PPTX).

```php
$sourceFile = Deliverable::downloadSourceFile('deliverable-uuid');

// Save to file
file_put_contents('report.docx', $sourceFile);

// Or send as HTTP response
header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
header('Content-Disposition: attachment; filename="report.docx"');
echo $sourceFile;
```

### Download PDF

Download the PDF version of a deliverable.

```php
$pdfFile = Deliverable::downloadPDF('deliverable-uuid');

// Save to file
file_put_contents('report.pdf', $pdfFile);

// Or send as HTTP response
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="report.pdf"');
echo $pdfFile;
```

### List deliverable items

List all deliverable items (templates + deliverables combined view) with filtering.

```php
$items = Deliverable::listDeliverableItems([
    'limit' => 20,
    'query' => 'proposal',
]);

echo "Total: {$items['totalRecords']}\n";
foreach ($items['results'] as $item) {
    echo "  {$item['name']} ({$item['type']})\n";
}
```

### Get deliverable item

Get a single deliverable item by ID.

```php
$item = Deliverable::getDeliverableItem('item-uuid', showTags: true);

echo "Name: {$item['results']['name']}\n";
echo "Type: {$item['type']}\n";
```

---

## Error Handling

The SDK provides typed exceptions for different error scenarios.

### Error Classes

| Error Class               | Status Code | Description                        |
| ------------------------- | ----------- | ---------------------------------- |
| `TurboDocxException`      | varies      | Base exception for all SDK errors  |
| `AuthenticationException` | 401         | Invalid or missing API credentials |
| `ValidationException`     | 400         | Invalid request parameters         |
| `NotFoundException`       | 404         | Deliverable or template not found  |
| `RateLimitException`      | 429         | Too many requests                  |
| `NetworkException`        | -           | Network connectivity issues        |

### Handling Errors

```php
<?php

use TurboDocx\Deliverable;
use TurboDocx\Exceptions\TurboDocxException;
use TurboDocx\Exceptions\AuthenticationException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Exceptions\NotFoundException;
use TurboDocx\Exceptions\RateLimitException;
use TurboDocx\Exceptions\NetworkException;

try {
    $result = Deliverable::generateDeliverable([
        'name' => 'Q1 Report',
        'templateId' => 'your-template-id',
        'variables' => [
            ['placeholder' => '{CompanyName}', 'text' => 'Acme Corp', 'mimeType' => 'text'],
        ],
    ]);
} catch (AuthenticationException $e) {
    // 401 - Invalid API key or access token
    echo "Authentication failed: {$e->getMessage()}\n";
} catch (ValidationException $e) {
    // 400 - Invalid request data
    echo "Validation error: {$e->getMessage()}\n";
} catch (NotFoundException $e) {
    // 404 - Deliverable or template not found
    echo "Not found: {$e->getMessage()}\n";
} catch (RateLimitException $e) {
    // 429 - Rate limit exceeded
    echo "Rate limit: {$e->getMessage()}\n";
} catch (NetworkException $e) {
    // Network/connection error
    echo "Network error: {$e->getMessage()}\n";
}
```

### Error Properties

All exceptions extend `TurboDocxException` and include:

- `getMessage()` - Human-readable error message
- `statusCode` - HTTP status code (if applicable)
- `errorCode` - Error code string (e.g., 'AUTHENTICATION_ERROR')

---

## PHP Types

### Variable Array Structure

Variables are passed as associative arrays with the following keys:

| Key                      | Type           | Required | Description                                          |
| ------------------------ | -------------- | -------- | ---------------------------------------------------- |
| `placeholder`            | `string`       | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `text`                   | `string`       | No\*     | Value to inject                                      |
| `mimeType`               | `string`       | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `isDisabled`             | `bool`         | No       | Skip this variable during generation                 |
| `subvariables`           | `array`        | No       | Nested sub-variables for HTML content                |
| `variableStack`          | `array`        | No       | Multiple instances for repeating content             |
| `aiPrompt`               | `string`       | No       | AI prompt for content generation (max 16,000 chars)  |

\*Required unless `variableStack` is provided or `isDisabled` is true.

### Generate Deliverable Request

Request array for `generateDeliverable`:

| Key            | Type     | Required | Description                                |
| -------------- | -------- | -------- | ------------------------------------------ |
| `name`         | `string` | Yes      | Deliverable name (3-255 characters)        |
| `templateId`   | `string` | Yes      | Template ID to generate from               |
| `variables`    | `array`  | Yes      | Variables for template substitution        |
| `description`  | `string` | No       | Description (up to 65,535 characters)      |
| `tags`         | `array`  | No       | Tag strings to associate                   |

### Update Deliverable Request

Request array for `updateDeliverableInfo`:

| Key           | Type     | Required | Description                              |
| ------------- | -------- | -------- | ---------------------------------------- |
| `name`        | `string` | No       | Updated name (3-255 characters)          |
| `description` | `string` | No       | Updated description                      |
| `tags`        | `array`  | No       | Replace all tags (empty array to remove) |

### List Options

Options array for `listDeliverables`:

> `listDeliverableItems` uses the same options plus `selectedTags` for tag filtering.

| Key            | Type             | Required | Description                          |
| -------------- | ---------------- | -------- | ------------------------------------ |
| `limit`        | `int`            | No       | Results per page (1-100, default 6)  |
| `offset`       | `int`            | No       | Results to skip (default 0)          |
| `query`        | `string`         | No       | Search query to filter by name       |
| `showTags`     | `bool`           | No       | Include tags in the response         |
| `selectedTags` | `string\|array`  | No       | Filter by tag IDs (AND logic) — `listDeliverableItems` only |
| `column0`      | `string`         | No       | Sort column                          |
| `order0`       | `string`         | No       | Sort direction (`"asc"` or `"desc"`) |

### Deliverable Record

The deliverable record returned by `getDeliverableDetails` and included in list results:

| Property       | Type     | Description                           |
| -------------- | -------- | ------------------------------------- |
| `id`                 | `string` | Unique deliverable ID                                    |
| `name`               | `string` | Deliverable name                                         |
| `description`        | `string` | Description text                                         |
| `templateId`         | `string` | Source template ID                                       |
| `templateName`       | `string` | Source template name                                     |
| `createdBy`          | `string` | User ID of the creator                                   |
| `email`              | `string` | Creator's email address                                  |
| `createdOn`          | `string` | ISO 8601 creation timestamp                              |
| `updatedOn`          | `string` | ISO 8601 last update timestamp                           |
| `isActive`           | `bool`   | Whether the deliverable is active                        |
| `fileSize`           | `int`    | File size in bytes                                       |
| `fileType`           | `string` | MIME type of the generated file                          |
| `defaultFont`        | `string` | Default font used                                        |
| `fonts`              | `array`  | Fonts used in the document                               |
| `templateNotDeleted` | `bool`   | Whether the source template still exists                 |
| `variables`          | `array`  | Parsed variable objects with values (in detail response) |
| `tags`               | `array`  | Associated tags (if requested)                           |

---

## Additional Documentation

For detailed information about advanced configuration and API concepts, see:

### Core API References

- **[TurboDocx Templating](/docs/TurboDocx%20Templating/How%20to%20Create%20a%20Template)** - How to create and configure document templates
- **[Variable Reference](/docs/API/Deliverable%20API#variable-object-structure)** - Complete guide to variable types, formatting, and advanced injection options
- **[API Reference](/docs/API/Deliverable%20API)** - Full REST API documentation for Deliverable endpoints

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
- [Packagist Package](https://packagist.org/packages/turbodocx/sdk)
- [API Reference](/docs/API/Deliverable%20API)
