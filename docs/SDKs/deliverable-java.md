---
title: Java SDK
sidebar_position: 12
sidebar_label: "Deliverable: Java"
description: Official TurboDocx Deliverable Java SDK. Builder pattern API with comprehensive error handling for document generation from templates.
keywords:
  - turbodocx deliverable java
  - document generation java
  - template api java
  - deliverable sdk java
  - maven turbodocx
  - gradle turbodocx
  - java sdk
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Java SDK

The official TurboDocx Deliverable SDK for Java applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically with the Builder pattern, comprehensive error handling, and type-safe APIs. Available on Maven Central as `com.turbodocx:sdk`.

## Installation

<Tabs>
<TabItem value="maven" label="Maven" default>

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle (Kotlin)">

```kotlin
implementation("com.turbodocx:sdk:1.0.0")
```

</TabItem>
<TabItem value="gradle-groovy" label="Gradle (Groovy)">

```groovy
implementation 'com.turbodocx:sdk:1.0.0'
```

</TabItem>
</Tabs>

## Requirements

- Java 11+
- OkHttp 4.x (included)
- Gson 2.x (included)

---

## Configuration

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.DeliverableClient;

public class Main {
    public static void main(String[] args) {
        // Option 1: Standalone deliverable client (no senderEmail needed)
        DeliverableClient deliverable = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .buildDeliverableClient();

        // Option 2: Full client (includes TurboSign + Deliverable)
        TurboDocxClient client = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .senderEmail("sender@example.com")
            .build();
        DeliverableClient deliverable = client.deliverable();
    }
}
```

:::tip No senderEmail Required
Use `buildDeliverableClient()` when you only need document generation — it skips the `senderEmail` validation required by TurboSign.
:::

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
```

:::caution API Credentials Required
Both `apiKey` and `orgId` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Generate a document from a template

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.DeliverableClient;
import com.turbodocx.models.deliverable.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        DeliverableClient deliverable = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .buildDeliverableClient();

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        DeliverableVariable var1 = new DeliverableVariable();
        var1.setPlaceholder("{CompanyName}");
        var1.setText("Acme Corporation");
        var1.setMimeType("text");

        DeliverableVariable var2 = new DeliverableVariable();
        var2.setPlaceholder("{Date}");
        var2.setText("2026-03-12");
        var2.setMimeType("text");

        CreateDeliverableRequest request = new CreateDeliverableRequest();
        request.setName("Q1 Report");
        request.setTemplateId("your-template-id");
        request.setVariables(List.of(var1, var2));
        request.setDescription("Quarterly business report");
        request.setTags(List.of("reports", "quarterly"));

        CreateDeliverableResponse result = deliverable.generateDeliverable(request);

        System.out.println("Result: " + gson.toJson(result));
    }
}
```

### Download and manage deliverables

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.DeliverableClient;
import com.turbodocx.models.deliverable.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        DeliverableClient deliverable = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .buildDeliverableClient();

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        // List deliverables with pagination
        ListDeliverablesRequest listRequest = new ListDeliverablesRequest();
        listRequest.setLimit(10);
        listRequest.setShowTags(true);
        DeliverableListResponse list = deliverable.listDeliverables(listRequest);
        System.out.println("Total: " + list.getTotalRecords());

        // Get deliverable details
        DeliverableRecord details = deliverable.getDeliverableDetails("deliverable-uuid");
        System.out.println("Name: " + details.getName());

        // Download source file (DOCX/PPTX)
        byte[] sourceFile = deliverable.downloadSourceFile("deliverable-uuid");
        Files.write(Paths.get("report.docx"), sourceFile);

        // Download PDF
        byte[] pdfFile = deliverable.downloadPDF("deliverable-uuid");
        Files.write(Paths.get("report.pdf"), pdfFile);

        // Update deliverable
        UpdateDeliverableRequest updateRequest = new UpdateDeliverableRequest();
        updateRequest.setName("Q1 Report - Final");
        updateRequest.setDescription("Final quarterly business report");
        updateRequest.setTags(List.of("reports", "final"));
        deliverable.updateDeliverableInfo("deliverable-uuid", updateRequest);

        // Delete deliverable
        deliverable.deleteDeliverable("deliverable-uuid");
    }
}
```

---

## Variable Types

The Deliverable module supports four variable types for template injection:

### 1. Text Variables

Inject plain text values into template placeholders:

```java
DeliverableVariable var = new DeliverableVariable();
var.setPlaceholder("{CompanyName}");
var.setText("Acme Corporation");
var.setMimeType("text");
```

### 2. HTML Variables

Inject rich HTML content with formatting:

```java
DeliverableVariable var = new DeliverableVariable();
var.setPlaceholder("{Summary}");
var.setText("<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>");
var.setMimeType("html");
```

### 3. Image Variables

Inject images by providing a URL or base64-encoded content:

```java
DeliverableVariable var = new DeliverableVariable();
var.setPlaceholder("{Logo}");
var.setText("https://example.com/logo.png");
var.setMimeType("image");
```

### 4. Markdown Variables

Inject markdown content that gets converted to formatted text:

```java
DeliverableVariable var = new DeliverableVariable();
var.setPlaceholder("{Notes}");
var.setText("## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.");
var.setMimeType("markdown");
```

:::info Variable Stack
For repeating content (e.g., table rows), use `setVariableStack()` instead of `setText()` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

---

## API Reference

### Configure

Create a new Deliverable client using the Builder pattern.

```java
// Standalone deliverable client
DeliverableClient deliverable = new TurboDocxClient.Builder()
    .apiKey("your-api-key")       // Required
    .orgId("your-org-id")         // Required
    .buildDeliverableClient();

// Or from the full client
TurboDocxClient client = new TurboDocxClient.Builder()
    .apiKey("your-api-key")       // Required
    .orgId("your-org-id")         // Required
    .senderEmail("sender@co.com") // Required for TurboSign
    .build();
DeliverableClient deliverable = client.deliverable();
```

### Generate deliverable

Generate a new document from a template with variable substitution.

```java
DeliverableVariable var1 = new DeliverableVariable();
var1.setPlaceholder("{CompanyName}");
var1.setText("Acme Corp");
var1.setMimeType("text");

CreateDeliverableRequest request = new CreateDeliverableRequest();
request.setName("Q1 Report");
request.setTemplateId("your-template-id");
request.setVariables(List.of(var1));
request.setDescription("Quarterly business report");
request.setTags(List.of("reports", "quarterly"));

CreateDeliverableResponse result = deliverable.generateDeliverable(request);

System.out.println("Result: " + gson.toJson(result));
```

### List deliverables

List deliverables with pagination, search, and filtering.

```java
ListDeliverablesRequest request = new ListDeliverablesRequest();
request.setLimit(10);
request.setOffset(0);
request.setQuery("report");
request.setShowTags(true);

DeliverableListResponse list = deliverable.listDeliverables(request);

System.out.println("Result: " + gson.toJson(list));
```

### Get deliverable details

Retrieve the full details of a single deliverable, including variables and fonts.

```java
DeliverableRecord details = deliverable.getDeliverableDetails("deliverable-uuid", true);

System.out.println("Result: " + gson.toJson(details));
```

### Update deliverable info

Update a deliverable's name, description, or tags.

```java
UpdateDeliverableRequest request = new UpdateDeliverableRequest();
request.setName("Q1 Report - Final");
request.setDescription("Final quarterly business report");
request.setTags(List.of("reports", "final"));

UpdateDeliverableResponse result = deliverable.updateDeliverableInfo("deliverable-uuid", request);

System.out.println("Result: " + gson.toJson(result));
```

### Delete deliverable

Soft-delete a deliverable.

```java
DeleteDeliverableResponse result = deliverable.deleteDeliverable("deliverable-uuid");

System.out.println("Result: " + gson.toJson(result));
```

### Download source file

Download the original source file (DOCX or PPTX).

```java
byte[] sourceData = deliverable.downloadSourceFile("deliverable-uuid");

// Save to file
Files.write(Paths.get("report.docx"), sourceData);
```

### Download PDF

Download the PDF version of a deliverable.

```java
byte[] pdfData = deliverable.downloadPDF("deliverable-uuid");

// Save to file
Files.write(Paths.get("report.pdf"), pdfData);
```

---

## Error Handling

The SDK provides typed exceptions for different error scenarios:

### Error Types

| Error Type                                   | Status Code | Description                        |
| -------------------------------------------- | ----------- | ---------------------------------- |
| `TurboDocxException`                         | varies      | Base exception for all API errors  |
| `TurboDocxException.AuthenticationException` | 401         | Invalid or missing API credentials |
| `TurboDocxException.ValidationException`     | 400         | Invalid request parameters         |
| `TurboDocxException.NotFoundException`       | 404         | Deliverable or template not found  |
| `TurboDocxException.RateLimitException`      | 429         | Too many requests                  |
| `TurboDocxException.NetworkException`        | -           | Network connectivity issues        |

### Handling Errors

```java
import com.turbodocx.TurboDocxException;

try {
    CreateDeliverableResponse result = deliverable.generateDeliverable(request);
} catch (TurboDocxException.AuthenticationException e) {
    System.err.println("Authentication failed: " + e.getMessage());
    // Check your API key and org ID
} catch (TurboDocxException.ValidationException e) {
    System.err.println("Validation error: " + e.getMessage());
    // Check request parameters
} catch (TurboDocxException.NotFoundException e) {
    System.err.println("Not found: " + e.getMessage());
    // Template or deliverable doesn't exist
} catch (TurboDocxException.RateLimitException e) {
    System.err.println("Rate limited: " + e.getMessage());
    // Wait and retry
} catch (TurboDocxException.NetworkException e) {
    System.err.println("Network error: " + e.getMessage());
    // Check connectivity
} catch (TurboDocxException e) {
    // Base exception for other API errors
    System.err.println("API error [" + e.getStatusCode() + "]: " + e.getMessage());
}
```

### Error Properties

| Property          | Type     | Description                  |
| ----------------- | -------- | ---------------------------- |
| `getMessage()`    | `String` | Human-readable error message |
| `getStatusCode()` | `int`    | HTTP status code             |
| `getCode()`       | `String` | Error code (if available)    |

---

## Types

### VariableMimeType

String values for variable content types:

| Value        | Description                   |
| ------------ | ----------------------------- |
| `"text"`     | Plain text injection          |
| `"html"`     | Rich HTML content             |
| `"image"`    | Image URL or base64 content   |
| `"markdown"` | Markdown converted to text    |

### DeliverableVariable

Variable configuration for template injection:

| Property                 | Type                          | Required | Description                                          |
| ------------------------ | ----------------------------- | -------- | ---------------------------------------------------- |
| `placeholder`            | `String`                      | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `text`                   | `String`                      | No\*     | Value to inject                                      |
| `mimeType`               | `String`                      | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `isDisabled`             | `Boolean`                     | No       | Skip this variable during generation                 |
| `subvariables`           | `List<DeliverableVariable>`   | No       | Nested sub-variables for HTML content                |
| `variableStack`          | `Object`                      | No       | Multiple instances for repeating content             |
| `aiPrompt`               | `String`                      | No       | AI prompt for content generation (max 16,000 chars)  |

\*Required unless `variableStack` is provided or `isDisabled` is true.

### CreateDeliverableRequest

Request configuration for `generateDeliverable`:

| Property       | Type                          | Required | Description                                |
| -------------- | ----------------------------- | -------- | ------------------------------------------ |
| `name`         | `String`                      | Yes      | Deliverable name (3-255 characters)        |
| `templateId`   | `String`                      | Yes      | Template ID to generate from               |
| `variables`    | `List<DeliverableVariable>`   | Yes      | Variables for template substitution        |
| `description`  | `String`                      | No       | Description (up to 65,535 characters)      |
| `tags`         | `List<String>`                | No       | Tag strings to associate                   |

### UpdateDeliverableRequest

Request configuration for `updateDeliverableInfo`:

| Property      | Type           | Required | Description                              |
| ------------- | -------------- | -------- | ---------------------------------------- |
| `name`        | `String`       | No       | Updated name (3-255 characters)          |
| `description` | `String`       | No       | Updated description                      |
| `tags`        | `List<String>` | No       | Replace all tags (empty list to remove)  |

### ListDeliverablesRequest

Options for `listDeliverables`:

| Property       | Type       | Required | Description                          |
| -------------- | ---------- | -------- | ------------------------------------ |
| `limit`        | `Integer`  | No       | Results per page (1-100, default 6)  |
| `offset`       | `Integer`  | No       | Results to skip (default 0)          |
| `query`        | `String`   | No       | Search query to filter by name       |
| `showTags`     | `Boolean`  | No       | Include tags in the response         |

### DeliverableRecord

The deliverable object returned by `listDeliverables`:

| Property          | Type         | Description                           |
| ----------------- | ------------ | ------------------------------------- |
| `id`              | `String`     | Unique deliverable ID (UUID)          |
| `name`            | `String`     | Deliverable name                      |
| `description`     | `String`     | Description text                      |
| `templateId`      | `String`     | Source template ID                    |
| `createdBy`       | `String`     | User ID of the creator                |
| `email`           | `String`     | Creator's email address               |
| `fileSize`        | `Long`       | File size in bytes                    |
| `fileType`        | `String`     | MIME type of the generated file       |
| `defaultFont`     | `String`     | Default font used                     |
| `fonts`           | `List<Font>` | Fonts used in the document            |
| `isActive`        | `Boolean`    | Whether the deliverable is active     |
| `createdOn`       | `String`     | ISO 8601 creation timestamp           |
| `updatedOn`       | `String`     | ISO 8601 last update timestamp        |
| `tags`            | `List<Tag>`  | Associated tags (when `showTags=true`)|

### DeliverableDetailRecord

The deliverable object returned by `getDeliverableDetails`. Includes all fields from [DeliverableRecord](#deliverablerecord) **except `fileSize`**, plus:

| Property             | Type           | Description                              |
| -------------------- | -------------- | ---------------------------------------- |
| `templateName`       | `String`       | Source template name                     |
| `templateNotDeleted` | `Boolean`      | Whether the source template still exists |
| `variables`          | `List<Object>` | Parsed variable objects with values      |

### Tag

Tag object included when `showTags` is enabled:

| Property    | Type      | Description                          |
| ----------- | --------- | ------------------------------------ |
| `id`        | `String`  | Tag unique identifier (UUID)         |
| `label`     | `String`  | Tag display name                     |
| `isActive`  | `boolean` | Whether the tag is active            |
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

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
- [Maven Central](https://search.maven.org/artifact/com.turbodocx/sdk)
- [API Reference](/docs/API/Deliverable%20API)
