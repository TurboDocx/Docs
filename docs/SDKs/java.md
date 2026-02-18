---
title: Java SDK
sidebar_position: 6
sidebar_label: "TurboSign: Java"
description: Official TurboDocx Java SDK. Builder pattern API with comprehensive error handling for document generation and digital signatures.
keywords:
  - turbodocx java
  - turbosign java
  - maven turbodocx
  - gradle turbodocx
  - java sdk
  - document api java
  - esignature java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Java SDK

The official TurboDocx SDK for Java applications. Build document generation and digital signature workflows with the Builder pattern, comprehensive error handling, and type-safe APIs. Available on Maven Central as `com.turbodocx:sdk`.

## Installation

<Tabs>
<TabItem value="maven" label="Maven" default>

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>turbodocx-sdk</artifactId>
    <version>0.1.6</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle (Kotlin)">

```kotlin
implementation("com.turbodocx:turbodocx-sdk:0.1.6")
```

</TabItem>
<TabItem value="gradle-groovy" label="Gradle (Groovy)">

```groovy
implementation 'com.turbodocx:turbodocx-sdk:0.1.6'
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

public class Main {
    public static void main(String[] args) {
        // Create client with Builder pattern
        TurboDocxClient client = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .senderEmail(System.getenv("TURBODOCX_SENDER_EMAIL"))  // REQUIRED
            .senderName(System.getenv("TURBODOCX_SENDER_NAME"))    // Optional but recommended
            .build();

        // Or with custom base URL
        TurboDocxClient client = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .senderEmail(System.getenv("TURBODOCX_SENDER_EMAIL"))
            .senderName(System.getenv("TURBODOCX_SENDER_NAME"))
            .baseUrl("https://api.turbodocx.com")
            .build();
    }
}
```

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
export TURBODOCX_SENDER_EMAIL=you@company.com
export TURBODOCX_SENDER_NAME="Your Company Name"
```

:::warning API Credentials Required
`apiKey`, `orgId`, and `senderEmail` are **required** for all API requests. `senderEmail` is used as the reply-to address for signature request emails. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Quick Start

### Send a Document for Signature

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.models.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.Arrays;

public class Main {
    public static void main(String[] args) throws Exception {
        TurboDocxClient client = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .senderEmail(System.getenv("TURBODOCX_SENDER_EMAIL"))
            .senderName(System.getenv("TURBODOCX_SENDER_NAME"))
            .build();

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        SendSignatureResponse result = client.turboSign().sendSignature(
            new SendSignatureRequest.Builder()
                .fileLink("https://www.turbodocx.com/examples/turbodocx.pdf")
                .documentName("Service Agreement")
                .senderName("Acme Corp")
                .senderEmail("contracts@acme.com")
                .recipients(Arrays.asList(
                    new Recipient("Alice Smith", "alice@example.com", 1),
                    new Recipient("Bob Johnson", "bob@example.com", 2)
                ))
                .fields(Arrays.asList(
                    // Alice's signature
                    new Field("signature", 1, 100, 650, 200, 50, "alice@example.com"),
                    new Field("date", 1, 320, 650, 100, 30, "alice@example.com"),
                    // Bob's signature
                    new Field("signature", 1, 100, 720, 200, 50, "bob@example.com"),
                    new Field("date", 1, 320, 720, 100, 30, "bob@example.com")
                ))
                .build()
        );

        System.out.println("Result: " + gson.toJson(result));
    }
}
```

### Using Template-Based Fields

```java
// Template-based field using anchor text
Field.TemplateAnchor templateAnchor = new Field.TemplateAnchor(
    "{SIGNATURE_ALICE}",      // anchor text to find
    null,                     // searchText (alternative to anchor)
    "replace",                // placement: replace/before/after/above/below
    new Field.Size(200, 50),  // size
    null,                     // offset
    false,                    // caseSensitive
    false                     // useRegex
);

// Field with template anchor (no page/x/y coordinates needed)
Field templateField = new Field(
    "signature",              // type
    null,                     // page (null for template-based)
    null,                     // x (null for template-based)
    null,                     // y (null for template-based)
    null,                     // width (null, using template size)
    null,                     // height (null, using template size)
    "alice@example.com",      // recipientEmail
    null,                     // defaultValue
    null,                     // isMultiline
    null,                     // isReadonly
    null,                     // required
    null,                     // backgroundColor
    templateAnchor            // template anchor config
);

SendSignatureResponse result = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        .fileLink("https://www.turbodocx.com/examples/turbodocx.pdf")
        .recipients(Arrays.asList(
            new Recipient("Alice Smith", "alice@example.com", 1)
        ))
        .fields(Arrays.asList(templateField))
        .build()
);
```

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.
:::

---

## File Input Methods

The SDK supports multiple ways to provide your document:

### 1. File Upload (byte[])

Upload a document directly from file bytes:

```java
import java.nio.file.Files;
import java.nio.file.Paths;

byte[] pdfBytes = Files.readAllBytes(Paths.get("/path/to/document.pdf"));

SendSignatureResponse result = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        .file(pdfBytes)
        .recipients(Arrays.asList(
            new Recipient("John Doe", "john@example.com", 1)
        ))
        .fields(Arrays.asList(
            new Field("signature", 1, 100, 500, 200, 50, "john@example.com")
        ))
        .build()
);
```

### 2. File URL

Provide a publicly accessible URL to your document:

```java
SendSignatureResponse result = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        .fileLink("https://www.turbodocx.com/examples/turbodocx.pdf")
        .recipients(Arrays.asList(
            new Recipient("John Doe", "john@example.com", 1)
        ))
        .fields(Arrays.asList(
            new Field("signature", 1, 100, 500, 200, 50, "john@example.com")
        ))
        .build()
);
```

:::tip When to use fileLink
Use `fileLink` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

### 3. TurboDocx Deliverable ID

Use a document generated by TurboDocx document generation:

```java
SendSignatureResponse result = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        .deliverableId("deliverable-uuid-from-turbodocx")
        .recipients(Arrays.asList(
            new Recipient("John Doe", "john@example.com", 1)
        ))
        .fields(Arrays.asList(
            new Field("signature", 1, 100, 500, 200, 50, "john@example.com")
        ))
        .build()
);
```

:::info Integration with TurboDocx
`deliverableId` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

### 4. TurboDocx Template ID

Use a pre-configured TurboDocx template:

```java
SendSignatureResponse result = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        .templateId("template-uuid-from-turbodocx")
        .recipients(Arrays.asList(
            new Recipient("John Doe", "john@example.com", 1)
        ))
        .fields(Arrays.asList(
            new Field("signature", 1, 100, 500, 200, 50, "john@example.com")
        ))
        .build()
);
```

:::info Integration with TurboDocx
`templateId` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

---

## API Reference

### Configure

Create a new TurboDocx client using the Builder pattern.

```java
TurboDocxClient client = new TurboDocxClient.Builder()
    .apiKey("your-api-key")                    // Required
    .orgId("your-org-id")                      // Required
    .senderEmail("you@company.com")            // Required
    .senderName("Your Company")                // Optional but recommended
    .baseUrl("https://api.turbodocx.com")      // Optional
    .build();
```

### Prepare for review

Upload a document for preview without sending emails.

```java
CreateSignatureReviewLinkResponse result = client.turboSign().createSignatureReviewLink(
    new CreateSignatureReviewLinkRequest.Builder()
        .fileLink("https://www.turbodocx.com/examples/turbodocx.pdf")
        .documentName("Contract Draft")
        .recipients(Arrays.asList(
            new Recipient("John Doe", "john@example.com", 1)
        ))
        .fields(Arrays.asList(
            new Field("signature", 1, 100, 500, 200, 50, "john@example.com")
        ))
        .build()
);

System.out.println("Result: " + gson.toJson(result));
```

### Prepare for signing

Upload a document and immediately send signature requests.

```java
SendSignatureResponse result = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        .fileLink("https://www.turbodocx.com/examples/turbodocx.pdf")
        .documentName("Service Agreement")
        .senderName("Your Company")
        .senderEmail("sender@company.com")
        .recipients(Arrays.asList(
            new Recipient("Recipient Name", "recipient@example.com", 1)
        ))
        .fields(Arrays.asList(
            new Field("signature", 1, 100, 500, 200, 50, "recipient@example.com")
        ))
        .build()
);

System.out.println("Result: " + gson.toJson(result));
```

### Get status

Check the status of a document.

```java
DocumentStatusResponse status = client.turboSign().getStatus("document-uuid");

System.out.println("Result: " + gson.toJson(status));
```

### Download document

Download the completed signed document.

```java
byte[] pdfData = client.turboSign().download("document-uuid");

// Save to file
Files.write(Paths.get("signed-contract.pdf"), pdfData);
```

### Get audit trail

Retrieve the audit trail for a document.

```java
AuditTrailResponse auditTrail = client.turboSign().getAuditTrail("document-uuid");

System.out.println("Result: " + gson.toJson(auditTrail));
```

### Void

Cancel/void a signature request.

```java
VoidDocumentResponse result = client.turboSign().voidDocument("document-uuid", "Contract terms changed");
```

### Resend

Resend signature request emails.

```java
// Resend to specific recipients
ResendEmailResponse result = client.turboSign().resendEmail(
    "document-uuid",
    Arrays.asList("recipient-uuid-1", "recipient-uuid-2")
);
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
| `TurboDocxException.NotFoundException`       | 404         | Document or resource not found     |
| `TurboDocxException.RateLimitException`      | 429         | Too many requests                  |
| `TurboDocxException.NetworkException`        | -           | Network connectivity issues        |

### Error Properties

| Property          | Type     | Description                  |
| ----------------- | -------- | ---------------------------- |
| `getMessage()`    | `String` | Human-readable error message |
| `getStatusCode()` | `int`    | HTTP status code             |
| `getCode()`       | `String` | Error code (if available)    |

### Example

```java
import com.turbodocx.TurboDocxException;

try {
    SendSignatureResponse result = client.turboSign().sendSignature(request);
} catch (TurboDocxException.AuthenticationException e) {
    System.err.println("Authentication failed: " + e.getMessage());
    // Check your API key and org ID
} catch (TurboDocxException.ValidationException e) {
    System.err.println("Validation error: " + e.getMessage());
    // Check request parameters
} catch (TurboDocxException.NotFoundException e) {
    System.err.println("Not found: " + e.getMessage());
    // Document or recipient doesn't exist
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

---

## Types

### Signature Field Types

The `type` field accepts the following string values:

| Type           | Description      |
| -------------- | ---------------- |
| `"signature"`  | Signature field  |
| `"initials"`   | Initials field   |
| `"text"`       | Text input field |
| `"date"`       | Date field       |
| `"checkbox"`   | Checkbox field   |
| `"full_name"`  | Full name field  |
| `"first_name"` | First name field |
| `"last_name"`  | Last name field  |
| `"email"`      | Email field      |
| `"title"`      | Title field      |
| `"company"`    | Company field    |

### Recipient

| Property       | Type     | Required | Description                                       |
| -------------- | -------- | -------- | ------------------------------------------------- |
| `name`         | `String` | Yes      | Recipient's full name                             |
| `email`        | `String` | Yes      | Recipient's email address                         |
| `signingOrder` | `int`    | Yes      | Order in which recipient should sign (1, 2, 3...) |

### Field

| Property          | Type             | Required | Description                                 |
| ----------------- | ---------------- | -------- | ------------------------------------------- |
| `type`            | `String`         | Yes      | Field type (see table above)                |
| `recipientEmail`  | `String`         | Yes      | Email of the recipient who fills this field |
| `page`            | `Integer`        | No\*     | Page number (1-indexed)                     |
| `x`               | `Integer`        | No\*     | X coordinate in pixels                      |
| `y`               | `Integer`        | No\*     | Y coordinate in pixels                      |
| `width`           | `Integer`        | No\*     | Field width in pixels                       |
| `height`          | `Integer`        | No\*     | Field height in pixels                      |
| `defaultValue`    | `String`         | No       | Pre-filled value                            |
| `isMultiline`     | `Boolean`        | No       | Enable multiline for text fields            |
| `isReadonly`      | `Boolean`        | No       | Make field read-only                        |
| `required`        | `Boolean`        | No       | Make field required                         |
| `backgroundColor` | `String`         | No       | Background color                            |
| `template`        | `TemplateAnchor` | No       | Template anchor configuration               |

\*Required when not using template anchors

#### Template Configuration

When using `template` instead of coordinates:

| Property        | Type      | Required | Description                                                                           |
| --------------- | --------- | -------- | ------------------------------------------------------------------------------------- | --- |
| `anchor`        | `String`  | Yes      | Text to find in document (e.g., `"{SIGNATURE}"`)                                      |     |
| `placement`     | `String`  | Yes      | Position relative to anchor: `"replace"`, `"before"`, `"after"`, `"above"`, `"below"` |
| `size`          | `Size`    | Yes      | Size with `width` and `height`                                                        |
| `offset`        | `Offset`  | No       | Offset with `x` and `y`                                                               |
| `caseSensitive` | `Boolean` | No       | Case-sensitive anchor search                                                          |
| `useRegex`      | `Boolean` | No       | Use regex for anchor search                                                           |

### Request Parameters

Both `CreateSignatureReviewLinkRequest` and `SendSignatureRequest` accept:

| Property              | Type              | Required    | Description              |
| --------------------- | ----------------- | ----------- | ------------------------ |
| `file`                | `byte[]`          | Conditional | File content as bytes    |
| `fileLink`            | `String`          | Conditional | URL to document          |
| `deliverableId`       | `String`          | Conditional | TurboDocx deliverable ID |
| `templateId`          | `String`          | Conditional | TurboDocx template ID    |
| `recipients`          | `List<Recipient>` | Yes         | List of recipients       |
| `fields`              | `List<Field>`     | Yes         | List of fields           |
| `documentName`        | `String`          | No          | Document display name    |
| `documentDescription` | `String`          | No          | Document description     |
| `senderName`          | `String`          | No          | Sender's name            |
| `senderEmail`         | `String`          | No          | Sender's email           |
| `ccEmails`            | `List<String>`    | No          | CC email addresses       |

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

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
- [Maven Central](https://search.maven.org/artifact/com.turbodocx/turbodocx-sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
