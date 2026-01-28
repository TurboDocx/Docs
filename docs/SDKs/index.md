---
title: Sign Documents with Code | TurboDocx SDKs
sidebar_position: 1
sidebar_label: Overview
description: Official TurboDocx SDKs for JavaScript, Python, PHP, Go, and Java. Send documents for signature via API and automate document signing workflows.
keywords:
  - sign documents api
  - esignature sdk
  - document signing api
  - turbodocx sdk
  - turbosign api
  - javascript document signing
  - python esignature
  - php document api
  - go signing sdk
  - java esignature api
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboDocx SDKs

Official client libraries for the TurboDocx API. Build document generation and digital signature workflows in your language of choice.

## Available SDKs

| Language                  | Package                    | Install Command                                                      | Links                                                                                                |
| :------------------------ | :------------------------- | :------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **JavaScript/TypeScript** | `@turbodocx/sdk`           | `npm install @turbodocx/sdk`                                         | [Docs](/docs/SDKs/javascript) [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)   |
| **Python**                | `turbodocx-sdk`            | `pip install turbodocx-sdk`                                          | [Docs](/docs/SDKs/python) [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)       |
| **PHP**                   | `turbodocx/sdk`            | `composer require turbodocx/sdk`                                     | [Docs](/docs/SDKs/php) [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)         |
| **Go**                    | `github.com/turbodocx/sdk` | `go get github.com/turbodocx/sdk`                                    | [Docs](/docs/SDKs/go) [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)           |
| **Java**                  | `com.turbodocx:sdk`        | [Maven Central](https://search.maven.org/artifact/com.turbodocx/sdk) | [Docs](/docs/SDKs/java) [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)       |

:::tip Low-code or No-code?
Check out our [n8n community node](https://www.npmjs.com/package/@turbodocx/n8n-nodes-turbodocx) for workflow automation, or get [TurboDocx Writer](https://appsource.microsoft.com/en-us/product/office/WA200007397) for Microsoft Word.
:::

---

## Quick Start

Get up and running in under 2 minutes.

### 1. Get Your Credentials

Before you begin, you'll need two things from your TurboDocx account:

- **API Access Token**: Your authentication key
- **Organization ID**: Your unique organization identifier

#### How to Get Your Credentials

1. **Login to TurboDocx**: Visit [https://www.turbodocx.com](https://www.turbodocx.com)
2. **Navigate to Settings**: Access your organization settings
3. **API Keys Section**: Generate or copy your API access token
4. **Organization ID**: Copy your organization ID from the same settings page

![TurboSign API Key](/img/turbosign/api/api-key.png)
![TurboSign Organization ID](/img/turbosign/api/org-id.png)

:::tip Keep Your Credentials Secure

- Store your API key and Organization ID as environment variables
- Never commit credentials to version control
- Rotate your API keys regularly for security
:::

### 2. Install the SDK

<Tabs groupId="language">
<TabItem value="js" label="JavaScript" default>

```bash
npm install @turbodocx/sdk
# or
yarn add @turbodocx/sdk
# or
pnpm add @turbodocx/sdk
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```bash
npm install @turbodocx/sdk
# or
yarn add @turbodocx/sdk
# or
pnpm add @turbodocx/sdk

# TypeScript types are included in the package
```

</TabItem>
<TabItem value="python" label="Python">

```bash
pip install turbodocx-sdk
# or
poetry add turbodocx-sdk
```

</TabItem>
<TabItem value="php" label="PHP">

```bash
composer require turbodocx/sdk
```

</TabItem>
<TabItem value="go" label="Go">

```bash
go get github.com/turbodocx/sdk
```

</TabItem>
<TabItem value="java" label="Java">

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

</TabItem>
</Tabs>

### 3. Send Your First Document for Signature

<Tabs groupId="language">
<TabItem value="js" label="JavaScript" default>

```javascript
const { TurboSign } = require("@turbodocx/sdk");
// or with ES modules:
// import { TurboSign } from '@turbodocx/sdk';

// Configure with your API key
TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
});

// Send a document for signature
const result = await TurboSign.sendSignature({
  fileLink: "https://example.com/contract.pdf",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});

console.log(`Document sent! ID: ${result.documentId}`);
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
import { TurboSign } from "@turbodocx/sdk";

// Configure with your API key
TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
});

// Send a document for signature
const result = await TurboSign.sendSignature({
  fileLink: "https://example.com/contract.pdf",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});

console.log(`Document sent! ID: ${result.documentId}`);
```

</TabItem>
<TabItem value="python" label="Python">

```python
from turbodocx import TurboSign
import os

# Configure with your API key
TurboSign.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"]
)

# Send a document for signature
result = TurboSign.send_signature(
    file_link="https://example.com/contract.pdf",
    recipients=[
        {"name": "John Doe", "email": "john@example.com", "signingOrder": 1}
    ],
    fields=[
        {"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipientEmail": "john@example.com"}
    ]
)

print(f"Document sent! ID: {result.documentId}")
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php

use TurboDocx\TurboSign;
use TurboDocx\Config\HttpClientConfig;
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;

// Configure with your API key
TurboSign::configure(new HttpClientConfig(
    apiKey: $_ENV['TURBODOCX_API_KEY'],
    orgId: $_ENV['TURBODOCX_ORG_ID'],
    senderEmail: $_ENV['TURBODOCX_SENDER_EMAIL']
));

// Send a document for signature
$result = TurboSign::sendSignature(
    new SendSignatureRequest(
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
        fileLink: 'https://example.com/contract.pdf'
    )
);

echo "Document sent! ID: {$result->documentId}\n";
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
    "context"
    "fmt"
    "os"

    "github.com/turbodocx/sdk"
)

func main() {
    // Configure with your API key
    client := sdk.NewTurboSign(
        os.Getenv("TURBODOCX_API_KEY"),
        os.Getenv("TURBODOCX_ORG_ID"),
    )

    // Send a document for signature
    result, err := client.TurboSign.SendSignature(context.Background(), &sdk.SendSignatureRequest{
        FileLink: "https://example.com/contract.pdf",
        Recipients: []sdk.Recipient{
            {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
        },
        Fields: []sdk.Field{
            {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
        },
    })
    if err != nil {
        panic(err)
    }

    fmt.Printf("Document sent! ID: %s\n", result.documentId)
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
import com.turbodocx.sdk.TurboSign;
import com.turbodocx.sdk.models.*;

public class Main {
    public static void main(String[] args) {
        // Configure with your API key
        TurboSign turboSign = new TurboSign(
            System.getenv("TURBODOCX_API_KEY"),
            System.getenv("TURBODOCX_ORG_ID")
        );

        // Send a document for signature
        SigningResult result = turboSign.sendSignature(
            SigningRequest.builder()
                .fileLink("https://example.com/contract.pdf")
                .recipient(Recipient.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .signingOrder(1)
                    .build())
                .field(Field.builder()
                    .type("signature")
                    .page(1).x(100).y(500).width(200).height(50)
                    .recipientEmail("john@example.com")
                    .build())
                .build()
        );

        System.out.println("Document sent! ID: " + result.documentId);
    }
}
```

</TabItem>
</Tabs>

---

## Core Features

All TurboDocx SDKs provide access to:

### TurboSign — Digital Signatures

Send documents for legally-binding eSignatures with full audit trails.

| Method                        | Description                                             |
| :---------------------------- | :------------------------------------------------------ |
| `createSignatureReviewLink()` | Upload document for preview without sending emails      |
| `sendSignature()`             | Upload and immediately send signature requests          |
| `getStatus()`               | Check document and recipient signing status             |
| `download()`                | Download the completed signed document                  |
| `void()`                    | Cancel/void a signature request                         |
| `resend()`                  | Resend signature request emails                         |
| `getAuditTrail()`           | Get complete audit trail with all events and timestamps |

[Learn more about TurboSign →](/docs/TurboSign/Setting%20up%20TurboSign)

### TurboDocx — Document Generation _(Coming Soon)_

Generate documents from templates with dynamic data.

---

## Field Positioning

TurboSign supports two methods for placing signature fields on your documents:

| Method               | Best For                                                                 |
| :------------------- | :----------------------------------------------------------------------- |
| **Coordinate-Based** | PDFs with fixed layouts where you know exact pixel positions             |
| **Template-Based**   | Documents where content may shift, using text anchors like `{SIGNATURE}` |

:::info Field Positioning Reference
For detailed information about both positioning methods, including anchor configuration, placement options, and best practices, see the **[Field Positioning Methods](/docs/TurboSign/API%20Signatures#field-positioning-methods)** guide.
:::

:::info Complete Field Types Reference
For a comprehensive list of all available field types (signature, initials, text, date, checkbox, full_name, email, title, company) and their detailed usage, see the [Field Types section in the API Signatures guide](/docs/TurboSign/API%20Signatures#field-types-reference).
:::

---

## Error Handling

All SDKs provide structured error handling with detailed error codes:

<Tabs groupId="language">
<TabItem value="js" label="JavaScript" default>

```javascript
const { TurboSign, TurboDocxError } = require("@turbodocx/sdk");

try {
  const result = await TurboSign.sendSignature({
    /* ... */
  });
} catch (error) {
  if (error instanceof TurboDocxError) {
    console.error(`Error ${error.code}: ${error.message}`);
    // Handle specific error codes
    if (error.code === "VALIDATION_ERROR") {
      // Handle validation error
    }
  }
}
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
import { TurboSign, TurboDocxError } from "@turbodocx/sdk";

try {
  const result = await TurboSign.sendSignature({
    /* ... */
  });
} catch (error) {
  if (error instanceof TurboDocxError) {
    console.error(`Error ${error.code}: ${error.message}`);
    // Handle specific error codes
    if (error.code === "VALIDATION_ERROR") {
      // Handle validation error
    }
  }
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
from turbodocx import TurboSign
from turbodocx.exceptions import TurboDocxError

try:
    result = await TurboSign.send_signature(...)
except TurboDocxError as e:
    print(f"Error {e.code}: {e.message}")
    if e.code == "VALIDATION_ERROR":
        # Handle validation error
        pass
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php

use TurboDocx\TurboSign;
use TurboDocx\Exceptions\TurboDocxException;
use TurboDocx\Exceptions\ValidationException;

try {
    $result = TurboSign::sendSignature(/* ... */);
} catch (ValidationException $e) {
    echo "Validation error: {$e->getMessage()}\n";
    // Handle validation error
} catch (TurboDocxException $e) {
    echo "Error {$e->getCode()}: {$e->getMessage()}\n";
    echo "Status code: {$e->statusCode}\n";
}
```

</TabItem>
<TabItem value="go" label="Go">

```go
result, err := client.TurboSign.SendSignature(ctx, request)
if err != nil {
    var turboErr *sdk.TurboDocxError
    if errors.As(err, &turboErr) {
        fmt.Printf("Error %s: %s\n", turboErr.Code, turboErr.Message)
        if turboErr.Code == "VALIDATION_ERROR" {
            // Handle validation error
        }
    }
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
import com.turbodocx.sdk.TurboSign;
import com.turbodocx.sdk.TurboDocxException;
import com.turbodocx.sdk.TurboDocxException.*;

try {
    SigningResult result = turboSign.sendSignature(/* ... */);
} catch (AuthenticationException e) {
    System.err.println("Invalid API key: " + e.getMessage());
} catch (ValidationException e) {
    System.err.println("Validation error: " + e.getMessage());
    System.err.println("Error code: " + e.getCode());
} catch (RateLimitException e) {
    System.err.println("Rate limited: " + e.getMessage());
} catch (TurboDocxException e) {
    System.err.println("Error " + e.getCode() + ": " + e.getMessage());
    System.err.println("Status code: " + e.getStatusCode());
}
```

</TabItem>
</Tabs>

### Common Error Codes

| Code                   | HTTP Status | Description                           |
| :--------------------- | :---------- | :------------------------------------ |
| `AUTHENTICATION_ERROR` | 401         | Invalid or expired API key            |
| `VALIDATION_ERROR`     | 400         | Invalid request data or parameters    |
| `NOT_FOUND`            | 404         | Document or resource not found        |
| `RATE_LIMIT_EXCEEDED`  | 429         | Too many requests, retry with backoff |
| `NETWORK_ERROR`        | N/A         | Network connection or timeout error   |

---

## Next Steps

<div className="row">
  <div className="col col--4">
    <div
      className="card"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 'none',
        borderRadius: '16px',
        background: 'var(--ifm-background-surface-color)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div className="card__header" style={{padding: '1.5rem 1.5rem 1rem', border: 'none'}}>
        <h3 style={{margin: 0, fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>API Signatures</h3>
      </div>
      <div className="card__body" style={{flexGrow: 1, padding: '0 1.5rem 1.5rem'}}>
        <p style={{margin: 0, color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.7, fontSize: '0.95rem'}}>Complete guide to TurboSign API integration with detailed examples.</p>
      </div>
      <div className="card__footer" style={{padding: '0 1.5rem 1.5rem', border: 'none'}}>
        <a
          href="/docs/TurboSign/API%20Signatures"
          style={{
            display: 'block',
            width: '100%',
            padding: '0.85rem 1.5rem',
            background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)',
            color: '#ffffff',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--ifm-color-primary-dark) 0%, var(--ifm-color-primary-darker) 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)';
          }}
        >
          View Guide →
        </a>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div
      className="card"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 'none',
        borderRadius: '16px',
        background: 'var(--ifm-background-surface-color)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div className="card__header" style={{padding: '1.5rem 1.5rem 1rem', border: 'none'}}>
        <h3 style={{margin: 0, fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Webhooks</h3>
      </div>
      <div className="card__body" style={{flexGrow: 1, padding: '0 1.5rem 1.5rem'}}>
        <p style={{margin: 0, color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.7, fontSize: '0.95rem'}}>Receive real-time notifications when documents are signed.</p>
      </div>
      <div className="card__footer" style={{padding: '0 1.5rem 1.5rem', border: 'none'}}>
        <a
          href="/docs/TurboSign/Webhooks"
          style={{
            display: 'block',
            width: '100%',
            padding: '0.85rem 1.5rem',
            background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)',
            color: '#ffffff',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--ifm-color-primary-dark) 0%, var(--ifm-color-primary-darker) 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)';
          }}
        >
          Configure Webhooks →
        </a>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div
      className="card"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 'none',
        borderRadius: '16px',
        background: 'var(--ifm-background-surface-color)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div className="card__header" style={{padding: '1.5rem 1.5rem 1rem', border: 'none'}}>
        <h3 style={{margin: 0, fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>GitHub Repository</h3>
      </div>
      <div className="card__body" style={{flexGrow: 1, padding: '0 1.5rem 1.5rem'}}>
        <p style={{margin: 0, color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.7, fontSize: '0.95rem'}}>View source code, report issues, and contribute to the SDKs.</p>
      </div>
      <div className="card__footer" style={{padding: '0 1.5rem 1.5rem', border: 'none'}}>
        <a
          href="https://github.com/TurboDocx/SDK"
          style={{
            display: 'block',
            width: '100%',
            padding: '0.85rem 1.5rem',
            background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)',
            color: '#ffffff',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--ifm-color-primary-dark) 0%, var(--ifm-color-primary-darker) 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)';
          }}
        >
          View on GitHub →
        </a>
      </div>
    </div>
  </div>
</div>

---

## Support

Need help with the SDKs?

- **Discord Community**: [Join our Discord](https://discord.gg/NYKwz4BcpX) for real-time support
- **GitHub Issues**: [Report bugs or request features](https://github.com/TurboDocx/SDK/issues)
- **Documentation**: Browse the language-specific guides in the sidebar
