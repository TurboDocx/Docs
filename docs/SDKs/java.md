---
title: Java SDK
sidebar_position: 6
sidebar_label: Java
description: Official TurboDocx Java SDK. Builder pattern with Spring Boot integration for document generation and digital signatures.
keywords:
  - turbodocx java
  - turbosign java
  - maven turbodocx
  - gradle turbodocx
  - spring boot sdk
  - document api java
  - esignature java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Java SDK

The official TurboDocx SDK for Java applications. Builder pattern API with Spring Boot integration.

[![Maven Central](https://img.shields.io/maven-central/v/com.turbodocx/sdk?logo=java&logoColor=white)](https://search.maven.org/artifact/com.turbodocx/sdk)
[![GitHub](https://img.shields.io/github/stars/turbodocx/sdk?style=social)](https://github.com/TurboDocx/SDK)

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
- Jackson for JSON serialization (included)

---

## Configuration

### Basic Configuration

```java
import com.turbodocx.sdk.TurboSign;

// Create a client
TurboSign turboSign = new TurboSign(System.getenv("TURBODOCX_API_KEY"));

// Or with builder
TurboSign turboSign = TurboSign.builder()
    .apiKey(System.getenv("TURBODOCX_API_KEY"))
    .baseUrl("https://api.turbodocx.com")
    .timeout(Duration.ofSeconds(30))
    .build();
```

### Spring Boot Configuration

```java
// application.yml
turbodocx:
  api-key: ${TURBODOCX_API_KEY}

// TurboDocxConfig.java
@Configuration
public class TurboDocxConfig {

    @Bean
    public TurboSign turboSign(@Value("${turbodocx.api-key}") String apiKey) {
        return new TurboSign(apiKey);
    }
}
```

---

## Quick Start

### Send a Document for Signature

```java
import com.turbodocx.sdk.TurboSign;
import com.turbodocx.sdk.models.*;

public class Main {
    public static void main(String[] args) {
        TurboSign turboSign = new TurboSign(System.getenv("TURBODOCX_API_KEY"));

        SigningResult result = turboSign.prepareForSigningSingle(
            SigningRequest.builder()
                .fileLink("https://example.com/contract.pdf")
                .documentName("Service Agreement")
                .senderName("Acme Corp")
                .senderEmail("contracts@acme.com")
                .recipient(Recipient.builder()
                    .name("Alice Smith")
                    .email("alice@example.com")
                    .order(1)
                    .build())
                .recipient(Recipient.builder()
                    .name("Bob Johnson")
                    .email("bob@example.com")
                    .order(2)
                    .build())
                // Alice's signature
                .field(Field.builder()
                    .type(FieldType.SIGNATURE)
                    .page(1).x(100).y(650).width(200).height(50)
                    .recipientOrder(1)
                    .build())
                .field(Field.builder()
                    .type(FieldType.DATE)
                    .page(1).x(320).y(650).width(100).height(30)
                    .recipientOrder(1)
                    .build())
                // Bob's signature
                .field(Field.builder()
                    .type(FieldType.SIGNATURE)
                    .page(1).x(100).y(720).width(200).height(50)
                    .recipientOrder(2)
                    .build())
                .field(Field.builder()
                    .type(FieldType.DATE)
                    .page(1).x(320).y(720).width(100).height(30)
                    .recipientOrder(2)
                    .build())
                .build()
        );

        System.out.println("Document ID: " + result.getDocumentId());
        for (Recipient recipient : result.getRecipients()) {
            System.out.println(recipient.getName() + ": " + recipient.getSignUrl());
        }
    }
}
```

### Using Template-Based Fields

```java
SigningResult result = turboSign.prepareForSigningSingle(
    SigningRequest.builder()
        .fileLink("https://example.com/contract-with-placeholders.pdf")
        .recipient(Recipient.builder()
            .name("Alice Smith")
            .email("alice@example.com")
            .order(1)
            .build())
        .field(Field.builder()
            .type(FieldType.SIGNATURE)
            .anchor("{SIGNATURE_ALICE}")
            .width(200).height(50)
            .recipientOrder(1)
            .build())
        .field(Field.builder()
            .type(FieldType.DATE)
            .anchor("{DATE_ALICE}")
            .width(100).height(30)
            .recipientOrder(1)
            .build())
        .build()
);
```

---

## API Reference

### prepareForReview()

Upload a document for preview without sending emails.

```java
ReviewResult result = turboSign.prepareForReview(
    ReviewRequest.builder()
        .fileLink("https://example.com/document.pdf")
        // Or upload directly:
        // .file(Files.readAllBytes(Path.of("document.pdf")))
        .documentName("Contract Draft")
        .recipient(Recipient.builder()
            .name("John Doe")
            .email("john@example.com")
            .order(1)
            .build())
        .field(Field.builder()
            .type(FieldType.SIGNATURE)
            .page(1).x(100).y(500).width(200).height(50)
            .recipientOrder(1)
            .build())
        .build()
);

System.out.println(result.getDocumentId());
System.out.println(result.getPreviewUrl());
```

### prepareForSigningSingle()

Upload a document and immediately send signature requests.

```java
SigningResult result = turboSign.prepareForSigningSingle(
    SigningRequest.builder()
        .fileLink("https://example.com/document.pdf")
        .documentName("Service Agreement")
        .senderName("Your Company")
        .senderEmail("sender@company.com")
        .recipient(Recipient.builder()
            .name("Recipient Name")
            .email("recipient@example.com")
            .order(1)
            .build())
        .field(Field.builder()
            .type(FieldType.SIGNATURE)
            .page(1).x(100).y(500).width(200).height(50)
            .recipientOrder(1)
            .build())
        .build()
);
```

### getStatus()

Check the status of a document.

```java
DocumentStatus status = turboSign.getStatus("document-uuid");

System.out.println(status.getStatus()); // "pending", "completed", or "voided"
System.out.println(status.getCompletedAt());

for (Recipient recipient : status.getRecipients()) {
    System.out.println(recipient.getName() + ": " + recipient.getStatus());
    System.out.println("Signed at: " + recipient.getSignedAt());
}
```

### download()

Download the completed signed document.

```java
byte[] pdfBytes = turboSign.download("document-uuid");

// Save to file
Files.write(Path.of("signed-contract.pdf"), pdfBytes);

// Or upload to S3
s3Client.putObject(PutObjectRequest.builder()
    .bucket("my-bucket")
    .key("signed-contract.pdf")
    .build(),
    RequestBody.fromBytes(pdfBytes)
);
```

### void()

Cancel/void a signature request.

```java
turboSign.voidDocument("document-uuid", "Contract terms changed");
```

### resend()

Resend signature request emails.

```java
// Resend to all pending recipients
turboSign.resend("document-uuid");

// Resend to specific recipients
turboSign.resend("document-uuid", List.of("recipient-uuid-1", "recipient-uuid-2"));
```

---

## Spring Boot Examples

### REST Controller

```java
import com.turbodocx.sdk.TurboSign;
import com.turbodocx.sdk.models.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final TurboSign turboSign;

    public ContractController(TurboSign turboSign) {
        this.turboSign = turboSign;
    }

    @PostMapping("/send")
    public SendContractResponse sendContract(@RequestBody SendContractRequest request) {
        SigningResult result = turboSign.prepareForSigningSingle(
            SigningRequest.builder()
                .fileLink(request.getContractUrl())
                .recipient(Recipient.builder()
                    .name(request.getRecipientName())
                    .email(request.getRecipientEmail())
                    .order(1)
                    .build())
                .field(Field.builder()
                    .type(FieldType.SIGNATURE)
                    .page(1).x(100).y(650).width(200).height(50)
                    .recipientOrder(1)
                    .build())
                .build()
        );

        return new SendContractResponse(
            result.getDocumentId(),
            result.getRecipients().get(0).getSignUrl()
        );
    }

    @GetMapping("/{id}/status")
    public DocumentStatus getStatus(@PathVariable String id) {
        return turboSign.getStatus(id);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable String id) {
        byte[] pdfBytes = turboSign.download(id);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"signed-document.pdf\"")
            .body(pdfBytes);
    }
}

record SendContractRequest(String recipientName, String recipientEmail, String contractUrl) {}
record SendContractResponse(String documentId, String signUrl) {}
```

### Service Layer

```java
import com.turbodocx.sdk.TurboSign;
import com.turbodocx.sdk.models.*;
import org.springframework.stereotype.Service;

@Service
public class ContractService {

    private final TurboSign turboSign;

    public ContractService(TurboSign turboSign) {
        this.turboSign = turboSign;
    }

    public SigningResult sendForSignature(String documentUrl, String recipientName, String recipientEmail) {
        return turboSign.prepareForSigningSingle(
            SigningRequest.builder()
                .fileLink(documentUrl)
                .recipient(Recipient.builder()
                    .name(recipientName)
                    .email(recipientEmail)
                    .order(1)
                    .build())
                .field(Field.builder()
                    .type(FieldType.SIGNATURE)
                    .page(1).x(100).y(650).width(200).height(50)
                    .recipientOrder(1)
                    .build())
                .build()
        );
    }

    public DocumentStatus checkStatus(String documentId) {
        return turboSign.getStatus(documentId);
    }

    public byte[] downloadSigned(String documentId) {
        return turboSign.download(documentId);
    }
}
```

---

## Error Handling

```java
import com.turbodocx.sdk.TurboSign;
import com.turbodocx.sdk.exceptions.*;

try {
    SigningResult result = turboSign.prepareForSigningSingle(request);
} catch (UnauthorizedException e) {
    System.out.println("Invalid API key");
} catch (InvalidDocumentException e) {
    System.out.println("Could not process document: " + e.getMessage());
} catch (RateLimitedException e) {
    System.out.println("Rate limited, retry after: " + e.getRetryAfter() + " seconds");
} catch (NotFoundException e) {
    System.out.println("Document not found");
} catch (TurboDocxException e) {
    System.out.println("Error " + e.getCode() + ": " + e.getMessage());
}
```

---

## Types

### Field Types

```java
public enum FieldType {
    SIGNATURE,
    INITIALS,
    TEXT,
    DATE,
    CHECKBOX,
    FULL_NAME,
    EMAIL,
    TITLE,
    COMPANY
}
```

### Models

```java
@Builder
public class Recipient {
    private String name;
    private String email;
    private int order;
    // Response fields
    private String id;
    private String status;
    private String signUrl;
    private Instant signedAt;
}

@Builder
public class Field {
    private FieldType type;
    private Integer page;
    private Integer x;
    private Integer y;
    private int width;
    private int height;
    private int recipientOrder;
    private String anchor; // For template-based fields
}

@Builder
public class SigningRequest {
    private String fileLink;
    private byte[] file;
    private String documentName;
    private String senderName;
    private String senderEmail;
    @Singular private List<Recipient> recipients;
    @Singular private List<Field> fields;
}

public class SigningResult {
    private String documentId;
    private List<Recipient> recipients;
}

public class DocumentStatus {
    private String status; // "pending", "completed", "voided"
    private Instant completedAt;
    private List<Recipient> recipients;
}
```

---

## Webhook Signature Verification

Verify that webhooks are genuinely from TurboDocx:

```java
import com.turbodocx.sdk.WebhookVerifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook")
public class WebhookController {

    @Value("${turbodocx.webhook-secret}")
    private String webhookSecret;

    @PostMapping
    public ResponseEntity<?> handleWebhook(
            @RequestBody String body,
            @RequestHeader("X-TurboDocx-Signature") String signature,
            @RequestHeader("X-TurboDocx-Timestamp") String timestamp) {

        boolean isValid = WebhookVerifier.verifySignature(signature, timestamp, body, webhookSecret);

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
        }

        ObjectMapper mapper = new ObjectMapper();
        WebhookEvent event = mapper.readValue(body, WebhookEvent.class);

        switch (event.getEvent()) {
            case "signature.document.completed":
                System.out.println("Document completed: " + event.getData().getDocumentId());
                break;
            case "signature.document.voided":
                System.out.println("Document voided: " + event.getData().getDocumentId());
                break;
        }

        return ResponseEntity.ok(Map.of("received", true));
    }
}
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
- [Maven Central](https://search.maven.org/artifact/com.turbodocx/sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
