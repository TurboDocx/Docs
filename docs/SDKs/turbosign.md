---
title: TurboSign SDK
sidebar_position: 2
sidebar_label: TurboSign
description: 'TurboSign SDK for JavaScript, TypeScript, Python, PHP, Go and Java: send documents for signature, track status, download signed PDFs and audit trails.'
keywords:
- turbodocx javascript
- turbodocx typescript
- turbosign javascript
- node.js sdk
- typescript sdk
- npm turbodocx
- document api javascript
- esignature javascript
- turbodocx python
- turbosign python
- python sdk
- pip turbodocx
- asyncio sdk
- fastapi turbodocx
- django turbodocx
- document api python
- turbodocx php
- turbosign php
- php sdk
- composer turbodocx
- php 8.1 sdk
- laravel turbodocx
- symfony turbodocx
- document api php
- esignature php
- turbodocx go
- turbosign go
- golang sdk
- go module
- document api go
- esignature golang
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
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboSign SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" />

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

The official TurboDocx SDK for JavaScript and TypeScript applications. Build document generation and digital signature workflows with full TypeScript support, async/await patterns, and comprehensive error handling. Available on npm as `@turbodocx/sdk`.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

The official TurboDocx SDK for Python applications. Build document generation and digital signature workflows with async/await patterns and comprehensive error handling. Available on PyPI as `turbodocx-sdk`.

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

The official TurboDocx SDK for PHP applications. Build document generation and digital signature workflows with modern PHP 8.1+ features, strong typing, and comprehensive error handling. Available on Packagist as `turbodocx/sdk`.

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

The official TurboDocx SDK for Go applications. Build document generation and digital signature workflows with idiomatic Go patterns, context support, and comprehensive error handling. Available as `github.com/TurboDocx/SDK/packages/go-sdk`.

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

The official TurboDocx SDK for Java applications. Build document generation and digital signature workflows with the Builder pattern, comprehensive error handling, and type-safe APIs. Available on Maven Central as `com.turbodocx:turbodocx-sdk`.

</TabItem>
</Tabs>

## Installation {#installation}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @turbodocx/sdk
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @turbodocx/sdk
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @turbodocx/sdk
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

<Tabs>
<TabItem value="pip" label="pip" default>

```bash
pip install turbodocx-sdk
```

</TabItem>
<TabItem value="poetry" label="Poetry">

```bash
poetry add turbodocx-sdk
```

</TabItem>
<TabItem value="pipenv" label="Pipenv">

```bash
pipenv install turbodocx-sdk
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```bash
composer require turbodocx/sdk
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

<Tabs>
<TabItem value="maven" label="Maven" default>

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>turbodocx-sdk</artifactId>
    <version>0.7.0</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle (Kotlin)">

```kotlin
implementation("com.turbodocx:turbodocx-sdk:0.7.0")
```

</TabItem>
<TabItem value="gradle-groovy" label="Gradle (Groovy)">

```groovy
implementation 'com.turbodocx:turbodocx-sdk:0.7.0'
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Requirements {#requirements}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

- Node.js 18+ or modern browser
- TypeScript 4.7+ (optional, for type checking)

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

- Python 3.9+
- `httpx` (installed automatically)

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

- PHP 8.1 or higher
- Composer
- ext-json
- ext-fileinfo

:::tip Modern PHP Features
This SDK leverages PHP 8.1+ features including enums, named parameters, readonly classes, and match expressions for a superior developer experience.
:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

- Go 1.21+

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

- Java 11+
- OkHttp 4.x (included)
- Gson 2.x (included)

</TabItem>
</Tabs>

---

## Configuration {#configuration}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { TurboSign } = require("@turbodocx/sdk");

// Configure globally (recommended for server-side)
TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY, // Required : Your TurboDocx API key
  orgId: process.env.TURBODOCX_ORG_ID, // Required: Your organization ID
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL, // Required: reply-to address for signature request emails
  senderName: "Your Company Name", // Optional but recommended: appears as the sender name
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { TurboSign } from "@turbodocx/sdk";

// Configure globally (recommended for server-side)
TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "", // Required : Your TurboDocx API key
  orgId: process.env.TURBODOCX_ORG_ID || "", // Required: Your organization ID
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL || "", // Required: reply-to address for signature request emails
  senderName: "Your Company Name", // Optional but recommended: appears as the sender name
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
</Tabs>

:::tip Authentication
Authenticate using `apiKey`. API keys are recommended for server-side applications.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
from turbodocx_sdk import TurboSign
import os

# Configure globally (recommended)
TurboSign.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],        # Required: Your TurboDocx API key
    org_id=os.environ["TURBODOCX_ORG_ID"],          # Required: Your organization ID
    sender_email="contracts@yourcompany.com",       # Required: Reply-to address for signature emails
    sender_name="Your Company",                     # Recommended: Sender name shown in emails
    # base_url="https://api.turbodocx.com"          # Optional: Override base URL
)
```

:::tip Authentication
Authenticate using `api_key`. API keys are recommended for server-side applications.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
The `senderEmail` parameter is **required** for TurboSign. This email appears as the reply-to address in signature request emails. If you omit it, `configure()` throws a `ValidationException` before any request is sent (unless `skipSenderValidation` is enabled, which TurboSign does not use).
:::

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
package main

import (
    "log"
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    // Create a new client (reads SenderEmail from TURBODOCX_SENDER_EMAIL)
    client, err := turbodocx.NewClient(
        os.Getenv("TURBODOCX_API_KEY"),
        os.Getenv("TURBODOCX_ORG_ID"),
    )
    if err != nil {
        log.Fatal(err)
    }
    _ = client

    // Or with custom configuration
    client, err = turbodocx.NewClientWithConfig(turbodocx.ClientConfig{
        APIKey:      os.Getenv("TURBODOCX_API_KEY"),
        OrgID:       os.Getenv("TURBODOCX_ORG_ID"),
        SenderEmail: os.Getenv("TURBODOCX_SENDER_EMAIL"), // Required for TurboSign
        BaseURL:     "https://api.turbodocx.com",         // Optional custom base URL
    })
    if err != nil {
        log.Fatal(err)
    }
    _ = client
}
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```java
import com.turbodocx.TurboDocxClient;

public class Main {
    public static void main(String[] args) {
        // Create client with Builder pattern
        TurboDocxClient client = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .senderEmail(System.getenv("TURBODOCX_SENDER_EMAIL"))
            .build();

        // Or with custom base URL
        TurboDocxClient customClient = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .senderEmail(System.getenv("TURBODOCX_SENDER_EMAIL"))
            .baseUrl("https://api.turbodocx.com")
            .build();
    }
}
```

</TabItem>
</Tabs>

### Builder Options {#builder-options}

<Tabs groupId="language" queryString>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

| Method                          | Type     | Required | Default                       | Description                                        |
| ------------------------------- | -------- | -------- | ----------------------------- | -------------------------------------------------- |
| `apiKey(String)`                | `String` | Yes\*    | -                             | Organization API key                               |
| `accessToken(String)`           | `String` | Yes\*    | -                             | Bearer access token (alternative to `apiKey`)      |
| `orgId(String)`                 | `String` | Yes      | -                             | Organization ID                                    |
| `senderEmail(String)`           | `String` | Yes      | -                             | Reply-to address for signature request emails      |
| `senderName(String)`            | `String` | No       | -                             | Display name used on signature request emails      |
| `baseUrl(String)`               | `String` | No       | `https://api.turbodocx.com`   | API base URL                                       |
| `connectTimeoutSeconds(int)`    | `int`    | No       | `60`                          | Connection timeout                                 |
| `readTimeoutSeconds(int)`       | `int`    | No       | `120`                         | Read timeout, raise it for large document uploads |
| `writeTimeoutSeconds(int)`      | `int`    | No       | `60`                          | Write timeout, raise it for large document uploads |

\*Provide either `apiKey` or `accessToken`.

```java
// Tune the timeouts for large documents
TurboDocxClient client = new TurboDocxClient.Builder()
    .apiKey(System.getenv("TURBODOCX_API_KEY"))
    .orgId(System.getenv("TURBODOCX_ORG_ID"))
    .senderEmail(System.getenv("TURBODOCX_SENDER_EMAIL"))
    .connectTimeoutSeconds(30)
    .readTimeoutSeconds(300)
    .writeTimeoutSeconds(300)
    .build();
```

</TabItem>
</Tabs>

### Closing the Client {#closing-the-client}

<Tabs groupId="language" queryString>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

`TurboDocxClient` implements `AutoCloseable`. Calling `close()` shuts down the underlying OkHttp dispatcher and connection pool, so long-running JVM services should close clients they no longer need. Use try-with-resources for short-lived clients:

```java
try (TurboDocxClient client = new TurboDocxClient.Builder()
        .apiKey(System.getenv("TURBODOCX_API_KEY"))
        .orgId(System.getenv("TURBODOCX_ORG_ID"))
        .senderEmail(System.getenv("TURBODOCX_SENDER_EMAIL"))
        .build()) {

    SendSignatureResponse result = client.turboSign().sendSignature(request);
}
```

:::tip Reuse a single client
Creating a client per request leaks OkHttp threads until they are closed. Prefer one long-lived client for the life of your application and call `client.close()` during shutdown.
:::

</TabItem>
</Tabs>

### Environment Variables {#environment-variables}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
TURBODOCX_SENDER_EMAIL=contracts@yourcompany.com
TURBODOCX_SENDER_NAME=Your Company
```

:::warning API Credentials Required
`api_key` and `org_id` are **required** for all API requests. TurboSign additionally **requires `sender_email`** (set it on `configure()`, per call, or via the `TURBODOCX_SENDER_EMAIL` environment variable): `configure()` raises a `ValidationError` without it. `sender_name` is optional but strongly recommended. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
export TURBODOCX_SENDER_EMAIL=you@example.com  # Required for TurboSign (reply-to address)
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
export TURBODOCX_SENDER_EMAIL=sender@yourcompany.com
```

:::warning API Credentials Required
Three parameters are **required** for TurboSign operations: `apiKey` (or `accessToken`), `orgId`, and `senderEmail`. The `senderEmail` is used as the reply-to address for signature request emails. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
</Tabs>

---

## Quick Start {#quick-start}

### Send a Document for Signature {#send-a-document-for-signature}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { TurboSign } = require("@turbodocx/sdk");

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL,
});

(async () => {
  // Send document with coordinate-based fields
  const result = await TurboSign.sendSignature({
    fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
    documentName: "Service Agreement",
    senderName: "Acme Corp",
    senderEmail: "contracts@acme.com",
    recipients: [
      { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
      { name: "Bob Johnson", email: "bob@example.com", signingOrder: 2 },
    ],
    fields: [
      // Alice's signature
      {
        type: "signature",
        page: 1,
        x: 100,
        y: 650,
        width: 200,
        height: 50,
        recipientEmail: "alice@example.com",
      },
      {
        type: "date",
        page: 1,
        x: 320,
        y: 650,
        width: 100,
        height: 30,
        recipientEmail: "alice@example.com",
        // Pins a fixed date in MM/DD/YYYY; omit to auto-fill the signing date
        defaultValue: "12/31/2026",
      },
      // Bob's signature
      {
        type: "signature",
        page: 1,
        x: 100,
        y: 720,
        width: 200,
        height: 50,
        recipientEmail: "bob@example.com",
      },
      {
        type: "date",
        page: 1,
        x: 320,
        y: 720,
        width: 100,
        height: 30,
        recipientEmail: "bob@example.com",
      },
    ],
  });

  console.log(JSON.stringify(result, null, 2));
})();
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { TurboSign } from "@turbodocx/sdk";

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL || "",
});

// Send document with coordinate-based fields
const result = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  documentName: "Service Agreement",
  senderName: "Acme Corp",
  senderEmail: "contracts@acme.com",
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
    { name: "Bob Johnson", email: "bob@example.com", signingOrder: 2 },
  ],
  fields: [
    // Alice's signature
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "alice@example.com",
    },
    {
      type: "date",
      page: 1,
      x: 320,
      y: 650,
      width: 100,
      height: 30,
      recipientEmail: "alice@example.com",
    },
    // Bob's signature
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 720,
      width: 200,
      height: 50,
      recipientEmail: "bob@example.com",
    },
    {
      type: "date",
      page: 1,
      x: 320,
      y: 720,
      width: 100,
      height: 30,
      recipientEmail: "bob@example.com",
    },
  ],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
import asyncio
import json
import os
from turbodocx_sdk import TurboSign

TurboSign.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"],
    sender_email="contracts@acme.com",
    sender_name="Acme Corp",
)

async def send_contract():
    result = await TurboSign.send_signature(
        recipients=[
            {"name": "Alice Smith", "email": "alice@example.com", "signingOrder": 1},
            {"name": "Bob Johnson", "email": "bob@example.com", "signingOrder": 2}
        ],
        fields=[
            # Alice's signature
            {"type": "signature", "page": 1, "x": 100, "y": 650, "width": 200, "height": 50, "recipientEmail": "alice@example.com"},
            {"type": "date", "page": 1, "x": 320, "y": 650, "width": 100, "height": 30, "recipientEmail": "alice@example.com"},
            # Bob's signature
            {"type": "signature", "page": 1, "x": 100, "y": 720, "width": 200, "height": 50, "recipientEmail": "bob@example.com"},
            {"type": "date", "page": 1, "x": 320, "y": 720, "width": 100, "height": 30, "recipientEmail": "bob@example.com"}
        ],
        file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
        document_name="Service Agreement",
        sender_name="Acme Corp",
        sender_email="contracts@acme.com",
    )

    print("Result:", json.dumps(result, indent=2))

asyncio.run(send_contract())
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
                height: 30,
                defaultValue: '12/31/2026' // Pins a fixed date in MM/DD/YYYY; omit to auto-fill the signing date
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
        fileLink: 'https://www.turbodocx.com/examples/turbodocx.pdf',
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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    client, err := turbodocx.NewClient(
        os.Getenv("TURBODOCX_API_KEY"),
        os.Getenv("TURBODOCX_ORG_ID"),
    )
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
        FileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
        DocumentName: "Service Agreement",
        SenderName:   "Acme Corp",
        SenderEmail:  "contracts@acme.com",
        Recipients: []turbodocx.Recipient{
            {Name: "Alice Smith", Email: "alice@example.com", SigningOrder: 1},
            {Name: "Bob Johnson", Email: "bob@example.com", SigningOrder: 2},
        },
        Fields: []turbodocx.Field{
            // Alice's signature
            {Type: "signature", Page: 1, X: 100, Y: 650, Width: 200, Height: 50, RecipientEmail: "alice@example.com"},
            {Type: "date", Page: 1, X: 320, Y: 650, Width: 100, Height: 30, RecipientEmail: "alice@example.com"},
            // Bob's signature
            {Type: "signature", Page: 1, X: 100, Y: 720, Width: 200, Height: 50, RecipientEmail: "bob@example.com"},
            {Type: "date", Page: 1, X: 320, Y: 720, Width: 100, Height: 30, RecipientEmail: "bob@example.com"},
        },
    })
    if err != nil {
        log.Fatal(err)
    }

    b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
}
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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
                    // defaultValue pins a fixed date in MM/DD/YYYY; omit to auto-fill the signing date
                    new Field("date", 1, 320, 650, 100, 30, "alice@example.com",
                        "12/31/2026", null, null, null, null, null, null),
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

</TabItem>
</Tabs>

### Using Template-Based Fields {#using-template-based-fields}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Use text anchors instead of coordinates
const result = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
    {
      type: "date",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{DATE_ALICE}",
        placement: "replace",
        size: { width: 100, height: 30 },
      },
    },
  ],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Use text anchors instead of coordinates
const result = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
    {
      type: "date",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{DATE_ALICE}",
        placement: "replace",
        size: { width: 100, height: 30 },
      },
    },
  ],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.

**Alternative:** Use a TurboDocx template with pre-configured anchors:

```typescript
const result = await TurboSign.sendSignature({
  templateId: "template-uuid-from-turbodocx", // Template already contains anchors
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
  ],
});
```

:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
import asyncio
import json

async def send_with_template():
    result = await TurboSign.send_signature(
        recipients=[{"name": "Alice Smith", "email": "alice@example.com", "signingOrder": 1}],
        fields=[
            {
                "type": "signature",
                "recipientEmail": "alice@example.com",
                "template": {
                    "anchor": "{SIGNATURE_ALICE}",
                    "placement": "replace",
                    "size": {"width": 200, "height": 50},
                },
            },
            {
                "type": "date",
                "recipientEmail": "alice@example.com",
                # Pins a fixed date in MM/DD/YYYY; omit to auto-fill the signing date
                "defaultValue": "12/31/2026",
                "template": {
                    "anchor": "{DATE_ALICE}",
                    "placement": "replace",
                    "size": {"width": 100, "height": 30},
                },
            },
        ],
        file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
    )

    print("Result:", json.dumps(result, indent=2))

asyncio.run(send_with_template())
```

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
        fileLink: 'https://www.turbodocx.com/examples/turbodocx.pdf',
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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    FileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
    Recipients: []turbodocx.Recipient{
        {Name: "Alice Smith", Email: "alice@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {
            Type:           "signature",
            RecipientEmail: "alice@example.com",
            Template: &turbodocx.TemplateAnchor{
                Anchor:    "{SIGNATURE_ALICE}",
                Placement: "replace",
                Size:      &turbodocx.Size{Width: 200, Height: 50},
            },
        },
        {
            Type:           "date",
            RecipientEmail: "alice@example.com",
            // Pins a fixed date in MM/DD/YYYY; omit to auto-fill the signing date
            DefaultValue:   "12/31/2026",
            Template: &turbodocx.TemplateAnchor{
                Anchor:    "{DATE_ALICE}",
                Placement: "replace",
                Size:      &turbodocx.Size{Width: 100, Height: 30},
            },
        },
    },
})
```

:::info Template Anchors Required
**Important:** The document file must contain the anchor text (e.g., `{SIGNATURE_ALICE}`, `{DATE_ALICE}`) that you reference in your fields. If the anchors don't exist in the document, the API will return an error.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

---

## File Input Methods {#file-input-methods}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

TurboSign supports four different ways to provide document files:

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

TurboSign supports four different ways to provide document files:

:::note Async context
The examples below use `await`, so they must run inside an `async` function (call them with `asyncio.run(...)`). See the [Send a Document for Signature](#send-a-document-for-signature) Quick Start for the full runnable form.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

TurboSign supports four different ways to provide document files:

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

The SDK supports multiple ways to provide your document:

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

The SDK supports multiple ways to provide your document:

</TabItem>
</Tabs>

### 1. File Upload ([]byte) / 1. File Upload (byte[]) {#1-file-upload-byte}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Upload a document directly from file bytes:

```go
pdfBytes, err := os.ReadFile("/path/to/document.pdf")
if err != nil {
    log.Fatal(err)
}

result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    File: pdfBytes,
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### 1. File Upload (Direct) {#1-file-upload-direct}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
<?php

use TurboDocx\TurboSign;
use TurboDocx\Config\HttpClientConfig;
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;

TurboSign::configure(HttpClientConfig::fromEnvironment());

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

</TabItem>
</Tabs>

### 2. File URL {#2-file-url}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
<?php

use TurboDocx\TurboSign;
use TurboDocx\Types\Recipient;
use TurboDocx\Types\Field;
use TurboDocx\Types\SignatureFieldType;
use TurboDocx\Types\Requests\SendSignatureRequest;

$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        fileLink: 'https://www.turbodocx.com/examples/turbodocx.pdf',
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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Provide a publicly accessible URL to your document:

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    FileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})
```

:::tip When to use FileLink
Use `FileLink` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### 1. File Upload (bytes) {#1-file-upload-bytes}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
with open("./contract.pdf", "rb") as f:
    pdf_buffer = f.read()

result = await TurboSign.send_signature(
    file=pdf_buffer,
    recipients=[
        {"name": "John Doe", "email": "john@example.com", "signingOrder": 1},
    ],
    fields=[
        {
            "type": "signature",
            "page": 1,
            "x": 100,
            "y": 650,
            "width": 200,
            "height": 50,
            "recipientEmail": "john@example.com",
        },
    ],
)
```

</TabItem>
</Tabs>

### 1. File Upload (Path, Buffer, or Browser File) {#1-file-upload-path-buffer-or-browser-file}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { readFileSync } = require("fs");
const { TurboSign } = require("@turbodocx/sdk");

const fileBuffer = readFileSync("./contract.pdf");

(async () => {
  const result = await TurboSign.sendSignature({
    file: fileBuffer,
    recipients: [
      { name: "John Doe", email: "john@example.com", signingOrder: 1 },
    ],
    fields: [
      {
        type: "signature",
        page: 1,
        x: 100,
        y: 650,
        width: 200,
        height: 50,
        recipientEmail: "john@example.com",
      },
    ],
  });
})();
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { readFileSync } from "fs";
import { TurboSign } from "@turbodocx/sdk";

const fileBuffer = readFileSync("./contract.pdf");

const result = await TurboSign.sendSignature({
  file: fileBuffer,
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

:::tip Pass a file path directly
`file` accepts `string | File | Buffer`. A `string` is treated as a local file path: the SDK reads it and uses the basename as the document filename, so `file: "./contract.pdf"` works without `readFileSync`. A raw `Blob` is not supported; use a `Buffer` (Node) or a `File` (browser).

When `file` is a `Buffer`, the filename defaults to `document.pdf` (extension detected from the content). Pass `fileName` to control it:

```javascript
await TurboSign.sendSignature({
  file: fileBuffer,
  fileName: "acme-msa.pdf",
  // ...
});
```

:::

</TabItem>
</Tabs>

<a id="2-file-url-file_link"></a>

### 2. File URL (fileLink) / 2. File URL (file_link) {#2-file-url-filelink}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

:::tip When to use fileLink
Use `fileLink` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
result = await TurboSign.send_signature(
    file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
    recipients=[
        {"name": "John Doe", "email": "john@example.com", "signingOrder": 1},
    ],
    fields=[
        {
            "type": "signature",
            "page": 1,
            "x": 100,
            "y": 650,
            "width": 200,
            "height": 50,
            "recipientEmail": "john@example.com",
        },
    ],
)
```

:::tip When to use file_link
Use `file_link` when your documents are already hosted on cloud storage (S3, Google Cloud Storage, etc.). This is more efficient than downloading and re-uploading files.
:::

</TabItem>
</Tabs>

### 3. TurboDocx Deliverable ID {#3-turbodocx-deliverable-id}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Use a previously generated TurboDocx document
const result = await TurboSign.sendSignature({
  deliverableId: "deliverable-uuid-from-turbodocx",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Use a previously generated TurboDocx document
const result = await TurboSign.sendSignature({
  deliverableId: "deliverable-uuid-from-turbodocx",
  recipients: [
    { name: "John Doe", email: "john@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 650,
      width: 200,
      height: 50,
      recipientEmail: "john@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

:::info Integration with TurboDocx
`deliverableId` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
# Use a previously generated TurboDocx document
result = await TurboSign.send_signature(
    deliverable_id="deliverable-uuid-from-turbodocx",
    recipients=[
        {"name": "John Doe", "email": "john@example.com", "signingOrder": 1},
    ],
    fields=[
        {
            "type": "signature",
            "page": 1,
            "x": 100,
            "y": 650,
            "width": 200,
            "height": 50,
            "recipientEmail": "john@example.com",
        },
    ],
)
```

:::info Integration with TurboDocx
`deliverable_id` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
<?php

use TurboDocx\TurboSign;
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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Use a document generated by TurboDocx document generation:

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    DeliverableID: "deliverable-uuid-from-turbodocx",
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})
```

:::info Integration with TurboDocx
`DeliverableID` references documents generated using TurboDocx's document generation API. This creates a seamless workflow: generate → sign.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### 4. TurboDocx Template ID {#4-turbodocx-template-id}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Use a pre-configured TurboSign template
const result = await TurboSign.sendSignature({
  templateId: "template-uuid-from-turbodocx", // Template already contains anchors
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Use a pre-configured TurboSign template
const result = await TurboSign.sendSignature({
  templateId: "template-uuid-from-turbodocx", // Template already contains anchors
  recipients: [
    { name: "Alice Smith", email: "alice@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      recipientEmail: "alice@example.com",
      template: {
        anchor: "{SIGNATURE_ALICE}",
        placement: "replace",
        size: { width: 200, height: 50 },
      },
    },
  ],
});
```

</TabItem>
</Tabs>

:::info Integration with TurboDocx
`templateId` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
# Use a pre-configured TurboSign template
result = await TurboSign.send_signature(
    template_id="template-uuid-from-turbodocx",  # Template already contains anchors
    recipients=[
        {"name": "Alice Smith", "email": "alice@example.com", "signingOrder": 1},
    ],
    fields=[
        {
            "type": "signature",
            "recipientEmail": "alice@example.com",
            "template": {
                "anchor": "{SIGNATURE_ALICE}",
                "placement": "replace",
                "size": {"width": 200, "height": 50},
            },
        },
    ],
)
```

:::info Integration with TurboDocx
`template_id` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

```php
<?php

use TurboDocx\TurboSign;
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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Use a pre-configured TurboDocx template:

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    TemplateID: "template-uuid-from-turbodocx",
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})
```

:::info Integration with TurboDocx
`TemplateID` references pre-configured TurboSign templates created in the TurboDocx dashboard. These templates come with built-in anchors and field positioning, making it easy to reuse signature workflows across multiple documents.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

---

## API Reference {#api-reference}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

:::note Async context
The snippets below use `await`, so they must run inside an `async` function. For a standalone script, wrap the call and run it with `asyncio.run(...)`, and add `import json` if the snippet calls `json.dumps`:

```python
import asyncio
import json

async def main():
    result = await TurboSign.get_status("document-uuid")
    print(json.dumps(result, indent=2))

asyncio.run(main())
```
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

:::note
The snippets below assume a configured `client` and an available `Gson` instance, e.g. `Gson gson = new GsonBuilder().setPrettyPrinting().create();` (as shown in the [Quick Start](#quick-start)).
:::

</TabItem>
</Tabs>

### Configure {#configure}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Configure the SDK with your API credentials and organization settings.

```typescript
TurboSign.configure({
  apiKey: string;        // Required : Your TurboDocx API key
  orgId: string;         // Required: Your organization ID
  senderEmail: string;   // Required: reply-to address for signature request emails
  senderName?: string;   // Optional: sender name in emails (defaults to your API key's name)
  baseUrl?: string;      // Optional: API base URL (default: 'https://api.turbodocx.com')
});
```

**Example:**

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { TurboSign } = require("@turbodocx/sdk");

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL, // Required for TurboSign
  // Optional: override for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { TurboSign } from "@turbodocx/sdk";

TurboSign.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
  senderEmail: process.env.TURBODOCX_SENDER_EMAIL || "", // Required for TurboSign
  // Optional: override for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
</Tabs>

:::warning API Credentials Required
Both `apiKey` and `orgId` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Configure the SDK with your API credentials and organization settings.

```python
TurboSign.configure(
    api_key: str,                                    # Required: Your TurboDocx API key
    org_id: str,                                     # Required: Your organization ID
    sender_email: str,                               # Required: Reply-to address for signature emails
    sender_name: str = None,                         # Recommended: Sender name shown in emails
    base_url: str = "https://api.turbodocx.com"     # Optional: API base URL
)
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Create a new TurboDocx client.

```go
// Simple initialization
client, err := turbodocx.NewClient(apiKey, orgID string)

// With custom configuration
client, err := turbodocx.NewClientWithConfig(turbodocx.ClientConfig{
    APIKey:      "your-api-key",
    OrgID:       "your-org-id",
    SenderEmail: "you@example.com",            // Required for TurboSign (reply-to address)
    BaseURL:     "https://api.turbodocx.com", // Optional
})
```

:::warning API Credentials Required
`APIKey` (or `AccessToken`), `OrgID`, **and** `SenderEmail` are **required** for TurboSign operations. `SenderEmail` is used as the reply-to address for signature request emails (it can also be supplied via the `TURBODOCX_SENDER_EMAIL` environment variable). To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Create a new TurboDocx client using the Builder pattern.

```java
TurboDocxClient client = new TurboDocxClient.Builder()
    .apiKey("your-api-key")       // Required
    .orgId("your-org-id")         // Required
    .senderEmail("sender@yourcompany.com")  // Required for TurboSign
    .baseUrl("https://api.turbodocx.com")  // Optional
    .build();
```

</TabItem>
</Tabs>

### Prepare for review {#prepare-for-review}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Upload a document for preview without sending signature request emails.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { documentId, previewUrl } = await TurboSign.createSignatureReviewLink({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  documentName: "Contract Draft",
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
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const { documentId, previewUrl } = await TurboSign.createSignatureReviewLink({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  documentName: "Contract Draft",
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
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Upload a document for preview without sending signature request emails.

```python
result = await TurboSign.create_signature_review_link(
    recipients=[{"name": "John Doe", "email": "john@example.com", "signingOrder": 1}],
    fields=[{"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipientEmail": "john@example.com"}],
    file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
    document_name="Contract Draft",
)

print(result["documentId"])
print(result["previewUrl"])
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
        fileLink: 'https://www.turbodocx.com/examples/turbodocx.pdf',
        documentName: 'Contract Draft'
    )
);

echo "Preview URL: {$result->previewUrl}\n";
echo "Document ID: {$result->documentId}\n";
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Upload a document for preview without sending emails.

```go
result, err := client.TurboSign.CreateSignatureReviewLink(ctx, &turbodocx.CreateSignatureReviewLinkRequest{
    FileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
    DocumentName: "Contract Draft",
    Recipients: []turbodocx.Recipient{
        {Name: "John Doe", Email: "john@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "john@example.com"},
    },
})

b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### Prepare for signing {#prepare-for-signing}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Upload a document and immediately send signature requests to all recipients.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { documentId } = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  documentName: "Service Agreement",
  senderName: "Your Company",
  senderEmail: "sender@company.com",
  recipients: [
    { name: "Recipient Name", email: "recipient@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 50,
      recipientEmail: "recipient@example.com",
    },
  ],
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const { documentId } = await TurboSign.sendSignature({
  fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
  documentName: "Service Agreement",
  senderName: "Your Company",
  senderEmail: "sender@company.com",
  recipients: [
    { name: "Recipient Name", email: "recipient@example.com", signingOrder: 1 },
  ],
  fields: [
    {
      type: "signature",
      page: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 50,
      recipientEmail: "recipient@example.com",
    },
  ],
});
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Upload a document and immediately send signature requests to all recipients.

```python
result = await TurboSign.send_signature(
    recipients=[{"name": "Recipient Name", "email": "recipient@example.com", "signingOrder": 1}],
    fields=[{"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipientEmail": "recipient@example.com"}],
    file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
    document_name="Service Agreement",
    sender_name="Your Company",
    sender_email="sender@company.com",
)

print(result["documentId"])
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
        fileLink: 'https://www.turbodocx.com/examples/turbodocx.pdf',
        documentName: 'Service Agreement'
    )
);

echo "Document ID: {$result->documentId}\n";
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Upload a document and immediately send signature requests.

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    FileLink:     "https://www.turbodocx.com/examples/turbodocx.pdf",
    DocumentName: "Service Agreement",
    SenderName:   "Your Company",
    SenderEmail:  "sender@company.com",
    Recipients: []turbodocx.Recipient{
        {Name: "Recipient Name", Email: "recipient@example.com", SigningOrder: 1},
    },
    Fields: []turbodocx.Field{
        {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientEmail: "recipient@example.com"},
    },
})
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

### Reminders and expiration {#reminders-and-expiration}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

`sendSignature` can also schedule automatic reminder emails and an expiration deadline. All eight
schedule fields are optional and **both features are off by default**, so omitting them preserves
the original send behavior. The resolved schedule is **frozen onto the document when it is sent**:
changing your org defaults later never alters a document already out for signature.

```php
use TurboDocx\Types\Requests\SendSignatureRequest;

$result = TurboSign::sendSignature(
    new SendSignatureRequest(
        // ...recipients, fields, fileLink, documentName
        remindersEnabled: true,
        reminderDelay: ['value' => 3, 'unit' => 'days'],     // time to the FIRST reminder
        reminderInterval: ['value' => 3, 'unit' => 'days'],  // gap between later reminders
        maxReminders: 5,                                      // -1 unlimited, 0 none, max 50 (default 5)
        expirationEnabled: true,
        expireAfter: ['value' => 30, 'unit' => 'days'],      // how long the document stays signable
        expirationWarning: ['value' => 3, 'unit' => 'days'], // 0 = never warn
        expirationWarningInterval: ['value' => 1, 'unit' => 'days']
    )
);
```

Durations are `['value' => N, 'unit' => 'hours'|'days']` objects. `value` is a whole number from
**1** up to a maximum of **999 days (23976 hours)**; `expirationWarning` also accepts `0` to disable
warnings. `maxReminders` accepts `-1` (unlimited), `0` (none), or any value up to `50`. The resulting
deadline is readable afterwards via `getStatus()->expiresAt`.

</TabItem>
</Tabs>

### Send a reminder {#send-a-reminder}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Send a standalone reminder to whoever's turn it is to sign
(`POST /turbosign/documents/{documentId}/send-reminder`). It is independent of the automatic
cadence: it works even when reminders are disabled or the per-signer cap is already spent, does
**not** consume that cap, and only emails signers at the *current* signing order. Pass `null` (or
omit the argument) to remind everyone eligible; do not pass an empty array, which the API rejects.

```php
// Remind everyone whose turn it is to sign.
$result = TurboSign::sendReminder('document-uuid');

foreach ($result['results'] as $r) {
    // 'sent', 'skipped_wrong_order', 'skipped_completed', ...
    echo "{$r['recipientId']}: {$r['status']}\n";
}

// Or limit to specific recipients (all-or-nothing): every id must be a current-order pending signer.
TurboSign::sendReminder('document-uuid', ['recipient-uuid-1', 'recipient-uuid-2']);
```

</TabItem>
</Tabs>

#### Schedule reminders and expiration {#schedule-reminders-and-expiration}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

`send_signature()` also accepts an optional reminder + expiration schedule. Both features are
**off by default**, so omitting these kwargs preserves the original send behavior. The resolved
deadline is frozen onto the document at send time and is then readable via
`get_status()["expiresAt"]`.

```python
result = await TurboSign.send_signature(
    # ...recipients, fields, file source, etc.
    reminders_enabled=True,
    reminder_delay={"value": 2, "unit": "days"},       # time to the FIRST reminder
    reminder_interval={"value": 3, "unit": "days"},    # gap between later reminders
    max_reminders=5,                                   # -1 unlimited, 0 none, max 50
    expiration_enabled=True,
    expire_after={"value": 14, "unit": "days"},        # how long the document stays signable
    expiration_warning={"value": 1, "unit": "days"},   # 0 = never warn
    expiration_warning_interval={"value": 1, "unit": "days"},
)
```

Durations are `{"value": N, "unit": "days" | "hours"}` objects. `value` is a whole number from
`1` up to a maximum of **999 days / 23976 hours**; `max_reminders` accepts `-1` (unlimited),
`0` (none), or up to `50`, defaulting to `5`; `expiration_warning` may be `0` to disable
warnings. See the full field reference under [Request Parameters](#request-parameters).

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

`SendSignature` accepts an optional `SignatureSchedule` that turns on automatic reminder emails and a signing deadline. Every field is a pointer, and **both features are off by default**: omit the schedule entirely to preserve the original send behavior. The resolved schedule is **frozen onto the document at send time**, so later changes to your org defaults never touch a document already out for signature.

```go
result, err := client.TurboSign.SendSignature(ctx, &turbodocx.SendSignatureRequest{
    // ...file, recipients, fields, etc.
    SignatureSchedule: turbodocx.SignatureSchedule{
        RemindersEnabled:  turbodocx.BoolPtr(true),
        ReminderDelay:     &turbodocx.Duration{Value: 2, Unit: "days"},  // time to the first reminder
        ReminderInterval:  &turbodocx.Duration{Value: 3, Unit: "days"},  // gap between later reminders
        MaxReminders:      turbodocx.IntPtr(5),                          // cap per signer
        ExpirationEnabled: turbodocx.BoolPtr(true),
        ExpireAfter:       &turbodocx.Duration{Value: 14, Unit: "days"}, // how long the document stays signable
        ExpirationWarning: &turbodocx.Duration{Value: 3, Unit: "days"},  // how far before expiry warnings start
    },
})
```

| Field | Type | Notes |
| ----- | ---- | ----- |
| `RemindersEnabled` | `*bool` | Master switch for automatic reminders. Default off. |
| `ReminderDelay` | `*Duration` | Time to the **first** reminder, measured from that signer's invitation. |
| `ReminderInterval` | `*Duration` | Gap between **subsequent** reminders. |
| `MaxReminders` | `*int` | Automatic reminders per signer. Valid range **-1..50**: `-1` unlimited, `0` none, default `5`. |
| `ExpirationEnabled` | `*bool` | Master switch for the signing deadline. Default off. |
| `ExpireAfter` | `*Duration` | How long the document stays signable, counted from sending. |
| `ExpirationWarning` | `*Duration` | How far **before** expiry warnings start. `0` = never warn. |
| `ExpirationWarningInterval` | `*Duration` | Gap between warnings once they start. |

A `Duration` is a `{Value, Unit}` pair; `Unit` is `"hours"` or `"days"`. `Value` is a whole number, **minimum 1** and at most **999 days (23976 hours)**. Reminders and expiry warnings run as two independent clocks, so a signer can receive both streams; they are coordinated so a reminder and a warning never land in the same moment.

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

`sendSignature` accepts an optional `SignatureSchedule` that turns on automatic reminder emails and/or a signing deadline. Both features are **off by default**, so omitting the schedule preserves the original send behavior. The resolved deadline is frozen onto the document at send time and is then readable via `getStatus().getExpiresAt()`.

```java
SignatureSchedule schedule = SignatureSchedule.builder()
    .remindersEnabled(true)
    .reminderDelay(new SignatureSchedule.Duration(3, "days"))        // time to the first reminder
    .reminderInterval(new SignatureSchedule.Duration(3, "days"))     // gap between later reminders
    .maxReminders(5)                                                 // -1..50: -1 unlimited, 0 none (default 5)
    .expirationEnabled(true)
    .expireAfter(new SignatureSchedule.Duration(14, "days"))         // how long the document stays signable
    .expirationWarning(new SignatureSchedule.Duration(2, "days"))    // 0 = never warn
    .expirationWarningInterval(new SignatureSchedule.Duration(1, "days"))
    .build();

SendSignatureResponse result = client.turboSign().sendSignature(
    new SendSignatureRequest.Builder()
        // ...file, recipients, fields, etc.
        .schedule(schedule)
        .build()
);
```

Each `Duration` is a `{value, unit}` pair where `unit` is `"hours"` or `"days"` and `value` is a whole number from **1 up to 999 days (23976 hours)**. `maxReminders` accepts **-1 to 50** (`-1` unlimited, `0` none, default `5`) and caps only automatic reminders, never expiry warnings; `expirationWarning` may be `0` to disable warnings. Reminders and expiry warnings run as two independent clocks, coordinated so a signer never receives both at the same moment, and a reminder cadence that would outlive the expiry window is rejected with `400`.

</TabItem>
</Tabs>

### Reminders & expiration schedule {#reminders--expiration-schedule}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

`sendSignature` (and `createSignatureReviewLink`) accept an optional **reminder and expiration schedule**. Both features are **off by default**: omit these fields and the send behaves exactly as before. The resolved schedule is **frozen onto the document when it is sent**, so later changes to your org defaults never touch a document already out for signature.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.sendSignature({
  // ...fileLink, recipients, fields, etc.

  // Reminders: nudge signers who haven't signed yet
  remindersEnabled: true,
  reminderDelay: { value: 3, unit: "days" },     // time to the FIRST reminder
  reminderInterval: { value: 3, unit: "days" },  // gap between later reminders
  maxReminders: 5,                               // cap per signer

  // Expiration: close the signing window
  expirationEnabled: true,
  expireAfter: { value: 30, unit: "days" },      // how long the document stays signable
  expirationWarning: { value: 3, unit: "days" }, // how far before expiry warnings start
  expirationWarningInterval: { value: 1, unit: "days" },
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.sendSignature({
  // ...fileLink, recipients, fields, etc.

  // Reminders: nudge signers who haven't signed yet
  remindersEnabled: true,
  reminderDelay: { value: 3, unit: "days" },     // time to the FIRST reminder
  reminderInterval: { value: 3, unit: "days" },  // gap between later reminders
  maxReminders: 5,                               // cap per signer

  // Expiration: close the signing window
  expirationEnabled: true,
  expireAfter: { value: 30, unit: "days" },      // how long the document stays signable
  expirationWarning: { value: 3, unit: "days" }, // how far before expiry warnings start
  expirationWarningInterval: { value: 1, unit: "days" },
});
```

</TabItem>
</Tabs>

Durations are `{ value, unit }` objects: `unit` is `"hours"` or `"days"`, and `value` is a whole number from **1 to a maximum of 999 days (23976 hours)**.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `remindersEnabled` | `boolean` | `false` | Send reminder emails at all |
| `reminderDelay` | `Duration` | 3 days | Time to the **first** reminder, measured from that signer's invitation |
| `reminderInterval` | `Duration` | 3 days | Gap between **subsequent** reminders |
| `maxReminders` | `number` | `5` | Cap per signer, range **-1..50** (`-1` unlimited, `0` none). Never caps expiry warnings |
| `expirationEnabled` | `boolean` | `false` | Expire the document at all |
| `expireAfter` | `Duration` | 120 days | How long the document stays signable, counted from **sending** |
| `expirationWarning` | `Duration` | 3 days | How far **before** expiry warnings start. `0` = never warn |
| `expirationWarningInterval` | `Duration` | 1 day | Gap between warnings once they start |

Reminders and expiry warnings run as **two independent clocks**, so a signer keeps getting reminders even after warnings begin; the two are coordinated so a reminder and a warning never land on the same tick. The API rejects a cadence that can't fit its window (for example a reminder interval that outlives `expireAfter`) with `400 InvalidSignatureSchedule`. See the [API validation rules](/docs/TurboSign/API-Signatures#reminders--expiration) for the full list.

</TabItem>
</Tabs>

### Send reminder {#send-reminder}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Send a **standalone reminder** to whoever's turn it is to sign. Unlike the scheduled reminders above, it ignores the configured cadence, works even when reminders are disabled or the per-signer cap is already spent, and does **not** consume that cap. Only signers at the **current** signing order are eligible. It maps to `POST /turbosign/documents/{documentId}/send-reminder`.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Remind everyone whose turn it is: omit the recipient ids
const { results } = await TurboSign.sendReminder("document-uuid");

results.forEach((r) => {
  // Anyone not emailed comes back as a skipped_* status, so you can tell who was reached
  console.log(`${r.recipientId}: ${r.status}`); // e.g. "sent", "skipped_wrong_order"
});

// Or limit the reminder to specific recipients
await TurboSign.sendReminder("document-uuid", ["recipient-uuid-1"]);
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const { results } = await TurboSign.sendReminder("document-uuid");

results.forEach((r) => {
  console.log(`${r.recipientId}: ${r.status}`);
});

await TurboSign.sendReminder("document-uuid", ["recipient-uuid-1"]);
```

</TabItem>
</Tabs>

:::warning Omit: don't send an empty array
To remind everyone eligible, **omit** `recipientIds` entirely. Passing an empty array (`[]`) is rejected with a `400`.
:::

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Send a standalone reminder (`POST /turbosign/documents/:id/send-reminder`) to whoever's turn it
is to sign. It is independent of the automatic reminder cadence: it works even when reminders
are disabled or the per-signer `max_reminders` cap is already spent, does **not** consume that
cap, and only emails signers at the *current* signing order. Omit `recipient_ids` to remind
everyone eligible; do not pass an empty list, which the API rejects.

```python
# Remind everyone whose turn it is:
result = await TurboSign.send_reminder("document-uuid")

# Or limit to specific recipients:
result = await TurboSign.send_reminder("document-uuid", recipient_ids=["recipient-uuid-1"])

for entry in result["results"]:
    # status is e.g. 'sent' or 'skipped_wrong_order'
    print(f"{entry['recipientId']}: {entry['status']}")
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Send a standalone reminder to whoever's turn it is to sign (`POST /turbosign/documents/:id/send-reminder`). It is independent of the automatic reminder cadence: it works even when reminders are disabled or the per-signer `MaxReminders` cap is already spent, does **not** consume that cap, and only emails signers at the **current** signing order. Pass `nil` for `recipientIDs` to remind everyone eligible; do **not** pass an empty slice, which the API rejects.

```go
resp, err := client.TurboSign.SendReminder(ctx, "document-uuid", nil)
if err != nil {
    log.Fatal(err)
}

for _, r := range resp.Results {
    // "sent", "skipped_wrong_order", "skipped_completed", ...
    fmt.Printf("%s: %s\n", r.RecipientID, r.Status)
}
```

This differs from **Resend**: resend re-sends the original invitation email, while send-reminder sends the reminder copy.

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Send a standalone reminder to whoever's turn it is to sign (`POST /turbosign/documents/:id/send-reminder`). It is independent of the automatic reminder cadence: it works even when reminders are disabled or the `maxReminders` cap is spent, does **not** consume that cap, and only emails signers at the **current** signing order. Use the single-arg overload to remind everyone eligible; pass a list to limit it to specific recipients, but do **not** pass an empty list, which the API rejects.

```java
// Remind everyone whose turn it is
SendReminderResponse reminder = client.turboSign().sendReminder("document-uuid");

for (SendReminderResponse.ReminderResult r : reminder.getResults()) {
    // status is e.g. "sent", "skipped_wrong_order", "skipped_completed"
    System.out.println(r.getRecipientId() + ": " + r.getStatus());
}

// Or limit to specific recipients
client.turboSign().sendReminder("document-uuid", Arrays.asList("recipient-uuid-1"));
```

---

</TabItem>
</Tabs>

### Get status {#get-status}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Retrieve the document-level status. For per-signer detail, use [Get recipients](#get-recipients).

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.getStatus("document-uuid");

console.log(result.status); // 'under_review' | 'completed' | 'voided' | ...
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.getStatus("document-uuid");

console.log(result.status); // 'under_review' | 'completed' | 'voided' | ...
```

</TabItem>
</Tabs>

The response carries the document-level **`status`** (`under_review`, `completed`, `voided`, `expired`, …) and **`expiresAt`** (the ISO 8601 signing-window deadline, or `undefined`/`null` when expiration is off). Once that deadline passes the document moves to the terminal **`expired`** status and its signing links stop working. The same `document.expiresAt` is returned by `getRecipients()` alongside per-recipient detail.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Retrieve the document-level status. For per-signer detail, use
[Get recipients](#get-recipients).

```python
result = await TurboSign.get_status("document-uuid")

print("Result:", json.dumps(result, indent=2))

# status is 'under_review', 'completed', 'voided', or the terminal 'expired'
print("Status:", result["status"])
# expiresAt is the signing-window deadline (ISO 8601), or None when expiration is off.
print("Expires:", result.get("expiresAt"))
```

Once a document's deadline passes it moves to the terminal `expired` status and its signing
links stop working. The same `expiresAt` deadline is also returned on the document object from
`get_recipients()` (`result["document"]["expiresAt"]`).

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Retrieve the current status of a document. When expiration is enabled, the response also carries the signing-window deadline as `expiresAt`; once that instant passes the document reaches the terminal `expired` status. The same `expiresAt` is available on the document returned by `getRecipients()`. For per-signer detail, use [Get recipients](#get-recipients).

```php
$status = TurboSign::getStatus('document-uuid');

echo "Document Status: {$status->status}\n";  // 'under_review', 'completed', 'voided', 'expired'
// expiresAt is the signing-window deadline (ISO 8601), or null when expiration is off.
echo "Expires: " . ($status->expiresAt ?? 'never') . "\n";
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Check the status of a document. The response includes `ExpiresAt` (the signing-window deadline as an ISO 8601 string, or `""` when expiration is off) and a `Status` that can reach the terminal value `expired` once the deadline passes. For per-signer detail, use [Get recipients](#get-recipients).

```go
status, err := client.TurboSign.GetStatus(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Status: %s\n", status.Status)  // "under_review", "completed", "voided", "expired", ...
// ExpiresAt is the signing-window deadline (ISO 8601), or "" when expiration is off.
fmt.Printf("Expires: %s\n", status.ExpiresAt)
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Check the document-level status. When an expiration schedule is set, the response also carries `getExpiresAt()` (the signing-window deadline, ISO 8601, or `null` when expiration is off). Once that deadline passes, the document moves to the terminal `expired` status and its signing links stop working. `getRecipients()` exposes the same deadline on `getDocument().getExpiresAt()`. For per-signer detail, use [Get recipients](#get-recipients).

```java
DocumentStatusResponse status = client.turboSign().getStatus("document-uuid");

System.out.println("Status: " + status.getStatus());       // "under_review", "completed", "voided", "expired"
System.out.println("Expires: " + status.getExpiresAt());   // ISO 8601, or null when expiration is off
System.out.println("Result: " + gson.toJson(status));
```

</TabItem>
</Tabs>

### Get recipients {#get-recipients}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

See who the document went to, who has signed, who you are still waiting on, and who sent it.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { document, recipients, summary } = await TurboSign.getRecipients("document-uuid");

console.log(`Sent by ${document.sentBy.name} on ${document.sentOn ?? "not sent yet"}`);
console.log(`${summary.completed}/${summary.total} signed, waiting on ${summary.waitingOn}`);

recipients.forEach((r) => {
  console.log(`${r.name} <${r.email}>: ${r.effectiveStatus}`);
  console.log(`  emailed ${r.delivery.totalSent}x, last ${r.delivery.lastSentOn ?? "never"}`);
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const { document, recipients, summary } = await TurboSign.getRecipients("document-uuid");

console.log(`${summary.completed}/${summary.total} signed, waiting on ${summary.waitingOn}`);

const chasing = recipients.filter(
  (r) => r.effectiveStatus === "pending" || r.effectiveStatus === "viewed",
);
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

See who the document went to, who has signed, who you are still waiting on,
and who sent it.

```python
result = await TurboSign.get_recipients("document-uuid")

summary = result["summary"]
print(f"{summary['completed']}/{summary['total']} signed, waiting on {summary['waitingOn']}")

for r in result["recipients"]:
    print(f"{r['name']} <{r['email']}>: {r['effectiveStatus']}")
    print(f"  emailed {r['delivery']['totalSent']}x")
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

See who the document went to, who has signed, who you are still waiting on,
and who sent it.

```php
$progress = TurboSign::getRecipients('document-uuid');

echo "{$progress->summary->completed}/{$progress->summary->total} signed, ";
echo "waiting on {$progress->summary->waitingOn}\n";

foreach ($progress->recipients as $r) {
    echo "  {$r->name} <{$r->email}>: {$r->effectiveStatus}";
    echo " (emailed {$r->delivery->totalSent}x)\n";
}
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

See who the document went to, who has signed, who you are still waiting on,
and who sent it.

```go
progress, err := client.TurboSign.GetRecipients(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

fmt.Printf("%d/%d signed, waiting on %d\n",
    progress.Summary.Completed, progress.Summary.Total, progress.Summary.WaitingOn)

for _, r := range progress.Recipients {
    fmt.Printf("%s <%s>: %s (emailed %dx)\n",
        r.Name, r.Email, r.EffectiveStatus, r.Delivery.TotalSent)
}
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

See who the document went to, who has signed, who you are still waiting on,
and who sent it.

```java
DocumentRecipientsResponse progress = client.turboSign().getRecipients("document-uuid");

System.out.println(progress.getSummary().getCompleted() + "/"
        + progress.getSummary().getTotal() + " signed, waiting on "
        + progress.getSummary().getWaitingOn());

for (DocumentRecipientsResponse.RecipientSignatureStatus r : progress.getRecipients()) {
    System.out.println(r.getName() + " <" + r.getEmail() + ">: " + r.getEffectiveStatus()
            + " (emailed " + r.getDelivery().getTotalSent() + "x)");
}
```

</TabItem>
</Tabs>

:::tip Two status fields, and they differ on purpose

`status` is the raw database value and is only ever `pending`, `viewed` or `completed`.
`effectiveStatus` layers the document's outcome on top, adding `voided` and `expired`: that
is the one to display.

On a voided or expired document an unsigned signer still reads `pending` in `status`, so
branching on it would show someone as "still to sign" when their signing link is already dead.
A completed signature is never revoked: someone who signed before the document was voided
still reads `completed`.

`summary` counts by `effectiveStatus`, and `waitingOn` (pending + viewed) drops to zero once
the document is terminal.

:::

Each recipient also carries a `delivery` block: `firstSentOn`, `lastSentOn`, `totalSent`,
`reminderCount`, `lastRemindedAt`, `warningCount`, `lastWarningAt`. It counts the signature
request, resends, reminders, expiry warnings and terminal notices; CC notifications are
excluded, since a CC address is not a signer.

:::warning `reminderCount` and `lastRemindedAt` do not mean what their names suggest

`reminderCount` counts **automatic (scheduled) reminders only**: the counter `maxReminders`
caps. A manual "remind now" is a standalone nudge that must not consume the cap budget, so it
does **not** increment this, even though the email it sends *does* appear in `totalSent`.

`lastRemindedAt` is a **cadence clock**, not a record of a reminder: the initial
signature-request send, each scheduled reminder, each manual "remind now" and each expiry
warning all stamp it. Only scheduled reminders bump `reminderCount`.

So a freshly-sent document returns a non-null `lastRemindedAt` equal to the invitation
timestamp alongside `reminderCount: 0`: nobody has been reminded. To answer "have we actually
chased this person", read `totalSent`, not `reminderCount`.

`warningCount` / `lastWarningAt` have no such caveat.

:::

### Download document {#download-document}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Download the completed signed document as a PDF Blob.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { writeFileSync } = require("fs");

(async () => {
  const result = await TurboSign.download("document-uuid");

  // Node.js: Save to file
  const buffer = Buffer.from(await result.arrayBuffer());
  writeFileSync("signed-contract.pdf", buffer);
})();
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.download("document-uuid");

// Node.js: Save to file
import { writeFileSync } from "fs";
const buffer = Buffer.from(await result.arrayBuffer());
writeFileSync("signed-contract.pdf", buffer);
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Download the completed signed document as PDF bytes.

```python
pdf_bytes = await TurboSign.download("document-uuid")

# Save to file
with open("signed-contract.pdf", "wb") as f:
    f.write(pdf_bytes)
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Download the completed signed document.

```go
pdfData, err := client.TurboSign.Download(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

// Save to file
err = os.WriteFile("signed-contract.pdf", pdfData, 0644)
if err != nil {
    log.Fatal(err)
}
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Download the completed signed document.

```java
byte[] pdfData = client.turboSign().download("document-uuid");

// Save to file
Files.write(Paths.get("signed-contract.pdf"), pdfData);
```

</TabItem>
</Tabs>

### Void {#void}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Cancel/void a signature request.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
await TurboSign.void("document-uuid", "Contract terms changed");
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
await TurboSign.void("document-uuid", "Contract terms changed");
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Cancel/void a signature request.

```python
result = await TurboSign.void_document("document-uuid", reason="Contract terms changed")
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Cancel/void a signature request that hasn't been completed.

```php
use TurboDocx\Types\Responses\VoidDocumentResponse;

$result = TurboSign::void('document-uuid', 'Document needs to be revised');

echo "Document ID: {$result->id}\n";
echo "Status: {$result->status}\n";
echo "Void Reason: {$result->voidReason}\n";
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Cancel/void a signature request.

```go
result, err := client.TurboSign.VoidDocument(ctx, "document-uuid", "Contract terms changed")
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Cancel/void a signature request.

```java
VoidDocumentResponse result = client.turboSign().voidDocument("document-uuid", "Contract terms changed");
```

</TabItem>
</Tabs>

### Resend {#resend}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Resend signature request emails to specific recipients.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Resend to specific recipients
await TurboSign.resend("document-uuid", [
  "recipient-uuid-1",
  "recipient-uuid-2",
]);
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Resend to specific recipients
await TurboSign.resend("document-uuid", [
  "recipient-uuid-1",
  "recipient-uuid-2",
]);
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Resend signature request emails to specific recipients.

```python
result = await TurboSign.resend_email("document-uuid", recipient_ids=["recipient-uuid-1", "recipient-uuid-2"])
```

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Resend signature request emails to specific recipients.

```php
// Resend to specific recipients
$result = TurboSign::resend('document-uuid', ['recipient-id-1', 'recipient-id-2']);

// Resend to all recipients
$result = TurboSign::resend('document-uuid', []);

echo "Recipients notified: {$result->recipientCount}\n";
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Resend signature request emails.

```go
// Resend to specific recipients
result, err := client.TurboSign.ResendEmail(ctx, "document-uuid", []string{"recipient-uuid-1", "recipient-uuid-2"})
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Resend signature request emails.

```java
// Resend to specific recipients
ResendEmailResponse result = client.turboSign().resendEmail(
    "document-uuid",
    Arrays.asList("recipient-uuid-1", "recipient-uuid-2")
);
```

</TabItem>
</Tabs>

### Get audit trail {#get-audit-trail}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Retrieve the complete audit trail for a document, including all events and actions.

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await TurboSign.getAuditTrail("document-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await TurboSign.getAuditTrail("document-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

---

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Retrieve the complete audit trail for a document, including all events and actions.

```python
result = await TurboSign.get_audit_trail("document-uuid")

print("Result:", json.dumps(result, indent=2))
```

---

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Retrieve the audit trail for a document.

```go
auditTrail, err := client.TurboSign.GetAuditTrail(ctx, "document-uuid")
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(auditTrail, "", "  "); fmt.Println("Result:", string(b))
```

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Retrieve the audit trail for a document.

```java
AuditTrailResponse auditTrail = client.turboSign().getAuditTrail("document-uuid");

System.out.println("Result: " + gson.toJson(auditTrail));
```

</TabItem>
</Tabs>

## Field Types {#field-types}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
</Tabs>

### Field Positioning {#field-positioning}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

TurboSign supports two ways to position fields:

</TabItem>
</Tabs>

#### 1. Coordinate-Based (Pixel Perfect) {#1-coordinate-based-pixel-perfect}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
</Tabs>

#### 2. Template Anchors (Dynamic) {#2-template-anchors-dynamic}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
</Tabs>

### Advanced Field Options {#advanced-field-options}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
</Tabs>

### Conditional (IF/THEN) Fields {#conditional-ifthen-fields}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

The optional `metadata` builds IF/THEN relationships between fields. Put a `fieldKey` on a
controlling checkbox, then point each dependent field's `controllingFieldKey` back at it.

```php
use TurboDocx\Types\FieldMetadata;
use TurboDocx\Types\FieldConditional;
use TurboDocx\Types\ConditionalOperator;
use TurboDocx\Types\ConditionalAction;

// Controlling checkbox, carries a stable fieldKey
new Field(
    type: SignatureFieldType::CHECKBOX,
    recipientEmail: 'reviewer@company.com',
    page: 1,
    x: 100,
    y: 400,
    width: 20,
    height: 20,
    metadata: new FieldMetadata(fieldKey: 'request_changes')
);

// Dependent text field, hidden until the checkbox is checked
new Field(
    type: SignatureFieldType::TEXT,
    recipientEmail: 'reviewer@company.com',
    page: 1,
    x: 130,
    y: 400,
    width: 300,
    height: 60,
    metadata: new FieldMetadata(
        conditional: new FieldConditional(
            controllingFieldKey: 'request_changes',      // = the checkbox's fieldKey
            operator: ConditionalOperator::IS_CHECKED,   // ::IS_CHECKED | ::IS_NOT_CHECKED
            action: ConditionalAction::SHOW              // ::SHOW | ::UNLOCK
        )
    )
);
```

Use `action: 'unlock'` to keep a field visible but read-only until the box is checked. A
malformed rule returns `400 InvalidConditionalRule`; a well-formed rule whose
`controllingFieldKey` matches no checkbox **fails open** (the field stays visible/editable). See
[Conditional (IF/THEN) Fields](/docs/TurboSign/Conditional-Fields).

---

</TabItem>
</Tabs>

## Error Handling {#error-handling}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

All errors are real `Error` subclasses (`instanceof` works) that extend the base `TurboDocxError`. `code` is a plain string, not an enum member: the HTTP client passes the API's own code through when the response includes one (for example `QUOTE_NOT_FOUND`), and only falls back to the class default below when it doesn't, so you can branch on `err.code` for the precise reason instead of just the HTTP category.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Every error is a plain `Exception` subclass; catch the most specific one first, since `except TurboDocxError` also matches every subclass below it. Each of the 7 named subclasses sets its own `DEFAULT_CODE` class attribute, so `e.code` is populated for those even when the API response itself carries none; the base `TurboDocxError` raised for an unmapped status (e.g. an unexpected 5xx) has `DEFAULT_CODE = None`, so `e.code` can be `None` there.

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

Every typed exception extends `TurboDocxException`, itself a plain `Exception` subclass with two extra readonly properties: `statusCode` (int, HTTP status) and `errorCode` (string, e.g. `'VALIDATION_ERROR'`). Because the constructor hardcodes PHP's built-in `Exception::getCode()` to `0`, read `$e->errorCode`, not `$e->getCode()`, for the machine-readable reason:

```php
use TurboDocx\Exceptions\AuthenticationException;
use TurboDocx\Exceptions\AuthorizationException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Exceptions\NotFoundException;
use TurboDocx\Exceptions\ConflictException;
use TurboDocx\Exceptions\RateLimitException;
use TurboDocx\Exceptions\NetworkException;

try {
    $result = TurboSign::sendSignature(/* ... */);
} catch (AuthenticationException $e) {
    // 401 - Invalid API key or access token
    echo "Authentication failed: {$e->getMessage()}\n";
} catch (AuthorizationException $e) {
    // 403 - Valid credentials without permission for this operation
    echo "Authorization error: {$e->getMessage()}\n";
} catch (ValidationException $e) {
    // 400 - Invalid request data
    echo "Validation error: {$e->getMessage()}\n";
} catch (NotFoundException $e) {
    // 404 - Document not found
    echo "Not found: {$e->getMessage()}\n";
} catch (ConflictException $e) {
    // 409 - Conflicts with the current resource state
    echo "Conflict: {$e->getMessage()}\n";
} catch (RateLimitException $e) {
    // 429 - Rate limit exceeded
    echo "Rate limit: {$e->getMessage()}\n";
} catch (NetworkException $e) {
    // Network/connection error
    echo "Network error: {$e->getMessage()}\n";
} catch (TurboDocxException $e) {
    // Catch-all: read the machine-readable reason from errorCode, not getCode()
    echo "Error {$e->errorCode}: {$e->getMessage()} (status {$e->statusCode})\n";
}
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Every typed error embeds `TurboDocxError` by value, which promotes its `Message string`, `StatusCode int`, and `Code string` fields onto the typed error, so read them directly off the matched variable (`authErr.Message`, not a getter). Match with `errors.As`, as the example below does:

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

Every typed exception is a nested static class of `TurboDocxException` (`TurboDocxException.ValidationException`, not a separate top-level import) and extends `RuntimeException`, so the compiler never forces a catch:

</TabItem>
</Tabs>

### Error Types {#error-types}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

| Error Type            | Status Code | Description                        |
| --------------------- | ----------- | ---------------------------------- |
| `TurboDocxError`      | varies      | Base error type for all API errors |
| `AuthenticationError` | 401         | Invalid or missing API key         |
| `AuthorizationError`  | 403         | Authenticated but lacks required permissions |
| `ValidationError`     | 400         | Invalid request parameters         |
| `NotFoundError`       | 404         | Resource not found                 |
| `ConflictError`       | 409         | Request conflicts with current resource state; most common on the webhook routes (creating or renaming to a name that already exists) |
| `RateLimitError`      | 429         | Too many requests                  |
| `NetworkError`        | -           | Network connectivity issues        |

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

| Error Type                                   | Status Code | Description                        |
| -------------------------------------------- | ----------- | ---------------------------------- |
| `TurboDocxException`                         | varies      | Base exception for all API errors  |
| `TurboDocxException.AuthenticationException` | 401         | Invalid or missing API credentials |
| `TurboDocxException.ValidationException`     | 400         | Invalid request parameters         |
| `TurboDocxException.AuthorizationException`  | 403         | Authenticated but lacks permissions for the route |
| `TurboDocxException.NotFoundException`       | 404         | Document or resource not found     |
| `TurboDocxException.ConflictException`       | 409         | Request conflicts with current state of resource (e.g., webhook name already exists) |
| `TurboDocxException.RateLimitException`      | 429         | Too many requests                  |
| `TurboDocxException.NetworkException`        | -           | Network connectivity issues        |

</TabItem>
</Tabs>

### Error Classes {#error-classes}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

| Error Class           | Status Code | Code                   | Description                         |
| --------------------- | ----------- | ---------------------- | ----------------------------------- |
| `TurboDocxError`      | varies      | varies                 | Base error class for all SDK errors |
| `AuthenticationError` | 401         | `AUTHENTICATION_ERROR` | Invalid or missing API credentials  |
| `AuthorizationError`  | 403         | `AUTHORIZATION_ERROR`  | API key lacks required permissions  |
| `ValidationError`     | 400         | `VALIDATION_ERROR`     | Invalid request parameters          |
| `NotFoundError`       | 404         | `NOT_FOUND`            | Document or resource not found      |
| `ConflictError`       | 409         | `CONFLICT`             | Resource conflict                   |
| `RateLimitError`      | 429         | `RATE_LIMIT_EXCEEDED`  | Too many requests                   |
| `NetworkError`        | -           | `NETWORK_ERROR`        | Network connectivity issues         |

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

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

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

| Error Class               | Status Code | Description                        |
| ------------------------- | ----------- | ---------------------------------- |
| `TurboDocxException`      | varies      | Base exception for all SDK errors  |
| `AuthenticationException` | 401         | Invalid or missing API credentials |
| `AuthorizationException`  | 403         | Valid credentials without permission for this operation |
| `ValidationException`     | 400         | Invalid request parameters         |
| `NotFoundException`       | 404         | Document or resource not found     |
| `ConflictException`       | 409         | Request conflicts with current resource state |
| `RateLimitException`      | 429         | Too many requests                  |
| `NetworkException`        | -           | Network connectivity issues        |

All exceptions extend `TurboDocxException` and include:

- `getMessage()` - Human-readable error message
- `statusCode` - HTTP status code, a public readonly `?int` (null for `NetworkException`)
- `errorCode` - Error code string (e.g., `'AUTHENTICATION_ERROR'`), a public readonly `?string`

---

</TabItem>
</Tabs>

### Handling Errors {#handling-errors}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const {
  TurboSign,
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} = require("@turbodocx/sdk");

(async () => {
  try {
    const result = await TurboSign.sendSignature({
      fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
      recipients: [
        { name: "John Doe", email: "john@example.com", signingOrder: 1 },
      ],
      fields: [
        {
          type: "signature",
          page: 1,
          x: 100,
          y: 650,
          width: 200,
          height: 50,
          recipientEmail: "john@example.com",
        },
      ],
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error("Authentication failed:", error.message);
      // Check your API key and org ID
    } else if (error instanceof ValidationError) {
      console.error("Validation error:", error.message);
      // Check request parameters
    } else if (error instanceof NotFoundError) {
      console.error("Resource not found:", error.message);
      // Document or recipient doesn't exist
    } else if (error instanceof RateLimitError) {
      console.error("Rate limited:", error.message);
      // Wait and retry
    } else if (error instanceof NetworkError) {
      console.error("Network error:", error.message);
      // Check connectivity
    } else if (error instanceof TurboDocxError) {
      console.error("SDK error:", error.message, error.statusCode, error.code);
    }
  }
})();
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import {
  TurboSign,
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from "@turbodocx/sdk";

try {
  const result = await TurboSign.sendSignature({
    fileLink: "https://www.turbodocx.com/examples/turbodocx.pdf",
    recipients: [
      { name: "John Doe", email: "john@example.com", signingOrder: 1 },
    ],
    fields: [
      {
        type: "signature",
        page: 1,
        x: 100,
        y: 650,
        width: 200,
        height: 50,
        recipientEmail: "john@example.com",
      },
    ],
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Authentication failed:", error.message);
    // Check your API key and org ID
  } else if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
    // Check request parameters
  } else if (error instanceof NotFoundError) {
    console.error("Resource not found:", error.message);
    // Document or recipient doesn't exist
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited:", error.message);
    // Wait and retry
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
    // Check connectivity
  } else if (error instanceof TurboDocxError) {
    console.error("SDK error:", error.message, error.statusCode, error.code);
  }
}
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
import asyncio
from turbodocx_sdk import (
    TurboSign,
    TurboDocxError,
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    NetworkError,
)

async def send_with_error_handling():
    try:
        result = await TurboSign.send_signature(
            recipients=[{"name": "John Doe", "email": "john@example.com", "signingOrder": 1}],
            fields=[{
                "type": "signature",
                "page": 1,
                "x": 100,
                "y": 650,
                "width": 200,
                "height": 50,
                "recipientEmail": "john@example.com",
            }],
            file_link="https://www.turbodocx.com/examples/turbodocx.pdf",
        )
    except AuthenticationError as e:
        print(f"Authentication failed: {e}")
        # Check your API key and org ID
    except AuthorizationError as e:
        print(f"Not authorized: {e}")
        # Authenticated, but lacks permission for this operation
    except ValidationError as e:
        print(f"Validation error: {e}")
        # Check request parameters
    except NotFoundError as e:
        print(f"Resource not found: {e}")
        # Document or recipient doesn't exist
    except ConflictError as e:
        print(f"Conflict: {e}")
        # Request conflicts with the current resource state
    except RateLimitError as e:
        print(f"Rate limited: {e}")
        # Wait and retry
    except NetworkError as e:
        print(f"Network error: {e}")
        # Check connectivity
    except TurboDocxError as e:
        print(f"SDK error: {e}, status_code={e.status_code}, code={e.code}")

asyncio.run(send_with_error_handling())
```

</TabItem>
</Tabs>

### Error Properties {#error-properties}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

All errors include these `readonly` properties:

| Property     | Type                  | Description                      |
| ------------ | --------------------- | -------------------------------- |
| `message`    | `string`              | Human-readable error description |
| `statusCode` | `number \| undefined` | HTTP status code (if applicable) |
| `code`       | `string \| undefined` | Machine-readable error code      |

---

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

All errors include these instance attributes:

| Property      | Type          | Description                                         |
| ------------- | ------------- | --------------------------------------------------- |
| `message`     | `str`         | Human-readable error description (via `str(error)`) |
| `status_code` | `int \| None` | HTTP status code (if applicable)                    |
| `code`        | `str \| None` | Machine-readable error code; the API's code wins when present, otherwise the class's `DEFAULT_CODE` |

---

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

| Property     | Type     | Description                  |
| ------------ | -------- | ----------------------------- |
| `Message`    | `string` | Human-readable error message. `Error()` does not return this bare string: it returns `TurboDocx API error [CODE]: MESSAGE (status N)`, omitting the `[CODE]` segment when `Code` is empty. Compare against `.Message` directly, not `err.Error()` |
| `StatusCode` | `int`    | HTTP status code             |
| `Code`       | `string` | Machine-readable code; the API's code wins when present, otherwise the SDK fills in a per-status default for each of the 7 named types above. The bare `TurboDocxError` returned for an unmapped status (e.g. an unexpected 5xx) can have an empty `Code` if the API didn't supply one |

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

| Property          | Type     | Description                  |
| ----------------- | -------- | ---------------------------- |
| `getMessage()`    | `String` | Human-readable error message |
| `getStatusCode()` | `int`    | HTTP status code             |
| `getCode()`       | `String` | Machine-readable code; each of the 7 named subclasses falls back to its own default (e.g. `AuthenticationException`'s `AUTHENTICATION_ERROR`) whenever the API response carries none. The bare `TurboDocxException` thrown for an unmapped status (e.g. an unexpected 5xx) can return `null` |

</TabItem>
</Tabs>

### Example {#example}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

```go
import (
    "errors"

    turbodocx "github.com/TurboDocx/SDK/packages/go-sdk"
)

result, err := client.TurboSign.SendSignature(ctx, request)
if err != nil {
    // Check for specific error types
    var authErr *turbodocx.AuthenticationError
    var authzErr *turbodocx.AuthorizationError
    var validationErr *turbodocx.ValidationError
    var notFoundErr *turbodocx.NotFoundError
    var conflictErr *turbodocx.ConflictError
    var rateLimitErr *turbodocx.RateLimitError
    var networkErr *turbodocx.NetworkError

    switch {
    case errors.As(err, &authErr):
        log.Printf("Authentication failed: %s", authErr.Message)
    case errors.As(err, &authzErr):
        log.Printf("Authorization failed: %s", authzErr.Message)
    case errors.As(err, &validationErr):
        log.Printf("Validation error: %s", validationErr.Message)
    case errors.As(err, &notFoundErr):
        log.Printf("Not found: %s", notFoundErr.Message)
    case errors.As(err, &conflictErr):
        log.Printf("Conflict: %s", conflictErr.Message)
    case errors.As(err, &rateLimitErr):
        log.Printf("Rate limited: %s", rateLimitErr.Message)
    case errors.As(err, &networkErr):
        log.Printf("Network error: %s", networkErr.Message)
    default:
        // Base TurboDocxError or unexpected error
        var turboErr *turbodocx.TurboDocxError
        if errors.As(err, &turboErr) {
            log.Printf("API error [%d]: %s", turboErr.StatusCode, turboErr.Message)
        } else {
            log.Fatal(err)
        }
    }
}
```

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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

</TabItem>
</Tabs>

<a id="python-types"></a>
<a id="php-types"></a>
<a id="types"></a>

## TypeScript Types / Python Types / PHP Types / Types {#typescript-types}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

The SDK exports TypeScript types for full type safety. Import them directly from the package.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

The SDK uses Python type hints with `Dict[str, Any]` for flexible JSON-like structures.

</TabItem>
</Tabs>

### Signature Field Types {#signature-field-types}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

The `Type` field accepts the following string values:

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

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

The `type` field accepts the following string values:

| Type           | Description      |
| -------------- | ---------------- |
| `"signature"`  | Signature field  |
| `"initial"`    | Initials field   |
| `"text"`       | Text input field |
| `"date"`       | Date field       |
| `"checkbox"`   | Checkbox field   |
| `"full_name"`  | Full name field  |
| `"first_name"` | First name field |
| `"last_name"`  | Last name field  |
| `"email"`      | Email field      |
| `"title"`      | Title field      |
| `"company"`    | Company field    |

</TabItem>
</Tabs>

### Enums {#enums}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
    case COMPLETED = 'completed';
    case VOIDED = 'voided';
}

// Conditional (IF/THEN) operator, the condition evaluated against the controlling checkbox
enum ConditionalOperator: string {
    case IS_CHECKED = 'is_checked';
    case IS_NOT_CHECKED = 'is_not_checked';
}

// Conditional (IF/THEN) action, what happens to the dependent field until the condition is met
enum ConditionalAction: string {
    case SHOW = 'show';     // hidden until met
    case UNLOCK = 'unlock'; // visible but read-only until met
}
```

</TabItem>
</Tabs>

### Readonly Classes {#readonly-classes}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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
        public ?string $defaultValue = null,           // checkbox: 'true'/'false'; date: a fixed MM/DD/YYYY (omit to auto-fill the signing date)
        public bool $isMultiline = false,
        public bool $isReadonly = false,
        public bool $required = false,
        public ?string $backgroundColor = null,
        public ?FieldMetadata $metadata = null   // Conditional (IF/THEN) metadata
    ) {}
}

// Conditional (IF/THEN) metadata
final class FieldMetadata {
    public function __construct(
        public ?string $fieldKey = null,              // On a controlling checkbox
        public ?FieldConditional $conditional = null  // On a dependent field
    ) {}
}

final class FieldConditional {
    public function __construct(
        public string $controllingFieldKey,   // = the checkbox's fieldKey (non-empty)
        public ConditionalOperator $operator, // ConditionalOperator::IS_CHECKED | ::IS_NOT_CHECKED
        public ConditionalAction $action      // ConditionalAction::SHOW | ::UNLOCK
    ) {}
}
```

</TabItem>
</Tabs>

### Request Objects {#request-objects}

<Tabs groupId="language" queryString>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

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

</TabItem>
</Tabs>

### Importing Types {#importing-types}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

```typescript
import type {
  // Field types
  SignatureFieldType,
  Field,
  Recipient,
  // Request types
  CreateSignatureReviewLinkRequest,
  SendSignatureRequest,
} from "@turbodocx/sdk";
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

```python
from typing import Dict, List, Any, Optional
```

</TabItem>
</Tabs>

### SignatureFieldType {#signaturefieldtype}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Union type for all available field types:

```typescript
type SignatureFieldType =
  | "signature"
  | "initial"
  | "date"
  | "text"
  | "full_name"
  | "title"
  | "company"
  | "first_name"
  | "last_name"
  | "email"
  | "checkbox";
```

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

String literal values for field types:

```python
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
    "checkbox",
]
```

</TabItem>
</Tabs>

### Recipient {#recipient}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Recipient configuration for signature requests:

| Property       | Type     | Required | Description               |
| -------------- | -------- | -------- | ------------------------- |
| `name`         | `string` | Yes      | Recipient's full name     |
| `email`        | `string` | Yes      | Recipient's email address |
| `signingOrder` | `number` | Yes      | Signing order (1-indexed) |

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Recipient configuration for signature requests:

&nbsp;

| Property       | Type  | Required | Description               |
| -------------- | ----- | -------- | ------------------------- |
| `name`         | `str` | Yes      | Recipient's full name     |
| `email`        | `str` | Yes      | Recipient's email address |
| `signingOrder` | `int` | Yes      | Signing order (1-indexed) |

```python
recipient: Dict[str, Any] = {
    "name": "John Doe",
    "email": "john@example.com",
    "signingOrder": 1
}
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

| Property       | Type     | Required | Description                                       |
| -------------- | -------- | -------- | ------------------------------------------------- |
| `Name`         | `string` | Yes      | Recipient's full name                             |
| `Email`        | `string` | Yes      | Recipient's email address                         |
| `SigningOrder` | `int`    | Yes      | Order in which recipient should sign (1, 2, 3...) |

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

| Property       | Type     | Required | Description                                       |
| -------------- | -------- | -------- | ------------------------------------------------- |
| `name`         | `String` | Yes      | Recipient's full name                             |
| `email`        | `String` | Yes      | Recipient's email address                         |
| `signingOrder` | `int`    | Yes      | Order in which recipient should sign (1, 2, 3...) |

</TabItem>
</Tabs>

### Field {#field}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Field configuration supporting both coordinate-based and template-based positioning:

| Property          | Type                 | Required | Description                                         |
| ----------------- | -------------------- | -------- | --------------------------------------------------- |
| `type`            | `SignatureFieldType` | Yes      | Field type                                          |
| `recipientEmail`  | `string`             | Yes      | Which recipient fills this field                    |
| `page`            | `number`             | No\*     | Page number (1-indexed)                             |
| `x`               | `number`             | No\*     | X coordinate in pixels                              |
| `y`               | `number`             | No\*     | Y coordinate in pixels                              |
| `width`           | `number`             | No\*     | Field width in pixels                               |
| `height`          | `number`             | No\*     | Field height in pixels                              |
| `defaultValue`    | `string`             | No       | Default value (checkbox: `"true"`/`"false"`; date: a fixed `MM/DD/YYYY`, omit to auto-fill the signing date) |
| `isMultiline`     | `boolean`            | No       | Enable multiline text                               |
| `isReadonly`      | `boolean`            | No       | Make field read-only (pre-filled)                   |
| `required`        | `boolean`            | No       | Whether field is required                           |
| `backgroundColor` | `string`             | No       | Background color (hex, rgb, or named)               |
| `template`        | `object`             | No       | Template anchor configuration                       |
| `metadata`        | `object`             | No       | Conditional (IF/THEN) metadata, see below          |

\*Required when not using template anchors

**Metadata Configuration (Conditional Fields):**

The optional `metadata` object builds IF/THEN relationships between fields. Put a `fieldKey` on a
controlling `checkbox`, then point each dependent field's `conditional.controllingFieldKey` back
at it.

| Property                            | Type     | Required | Description                                                       |
| ----------------------------------- | -------- | -------- | ---------------------------------------------------------------- |
| `fieldKey`                          | `string` | No       | Stable id on a **controlling checkbox** (`type: "checkbox"`).    |
| `conditional`                       | `object` | No       | Rule on a **dependent field** (see below).                       |
| `conditional.controllingFieldKey`   | `string` | Yes      | The controlling checkbox's `fieldKey`. Must be non-empty.        |
| `conditional.operator`              | `string` | Yes      | `"is_checked"` \| `"is_not_checked"`.                            |
| `conditional.action`                | `string` | Yes      | `"show"` (hidden until met) \| `"unlock"` (locked until met).    |

```typescript
// Checkbox reveals a text field when checked
const fields: Field[] = [
  {
    type: "checkbox",
    recipientEmail: "reviewer@company.com",
    page: 1, x: 100, y: 400, width: 20, height: 20,
    metadata: { fieldKey: "request_changes" },
  },
  {
    type: "text",
    recipientEmail: "reviewer@company.com",
    page: 1, x: 130, y: 400, width: 300, height: 60,
    metadata: {
      conditional: {
        controllingFieldKey: "request_changes",
        operator: "is_checked",
        action: "show",
      },
    },
  },
];
```

A malformed rule returns `400 InvalidConditionalRule`; a well-formed rule whose
`controllingFieldKey` matches no checkbox **fails open** (the field stays visible/editable). See
[Conditional (IF/THEN) Fields](/docs/TurboSign/Conditional-Fields).

**Template Configuration:**

| Property        | Type      | Required | Description                                                      |
| --------------- | --------- | -------- | ---------------------------------------------------------------- |
| `anchor`        | `string`  | No†      | Text anchor pattern like `{TagName}`                             |
| `searchText`    | `string`  | No†      | Alternative to `anchor`: search for any text in the document     |
| `placement`     | `string`  | No       | `"replace"` \| `"before"` \| `"after"` \| `"above"` \| `"below"` |
| `size`          | `object`  | No       | `{ width: number; height: number }`                              |
| `offset`        | `object`  | No       | `{ x: number; y: number }`                                       |
| `caseSensitive` | `boolean` | No       | Case sensitive search (default: false)                           |
| `useRegex`      | `boolean` | No       | Use regex for anchor/searchText (default: false)                 |

†All template properties are optional in the type definition, but at least one of `anchor` or `searchText` must be provided for anchor-based positioning to work.

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Field configuration supporting both coordinate-based and template-based positioning:

&nbsp;

| Property          | Type   | Required | Description                                         |
| ----------------- | ------ | -------- | --------------------------------------------------- |
| `type`            | `str`  | Yes      | Field type (see SignatureFieldType)                 |
| `recipientEmail`  | `str`  | Yes      | Which recipient fills this field                    |
| `page`            | `int`  | No\*     | Page number (1-indexed)                             |
| `x`               | `int`  | No\*     | X coordinate in pixels                              |
| `y`               | `int`  | No\*     | Y coordinate in pixels                              |
| `width`           | `int`  | No\*     | Field width in pixels                               |
| `height`          | `int`  | No\*     | Field height in pixels                              |
| `defaultValue`    | `str`  | No       | Default value (checkbox: `"true"`/`"false"`; date: a fixed `MM/DD/YYYY`, omit to auto-fill the signing date) |
| `isMultiline`     | `bool` | No       | Enable multiline text                               |
| `isReadonly`      | `bool` | No       | Make field read-only (pre-filled)                   |
| `required`        | `bool` | No       | Whether field is required                           |
| `backgroundColor` | `str`  | No       | Background color (hex, rgb, or named)               |
| `template`        | `Dict` | No       | Template anchor configuration                       |
| `metadata`        | `Dict` | No       | Conditional (IF/THEN) metadata, see below          |

\*Required when not using template anchors

**Metadata Configuration (Conditional Fields):**

The optional `metadata` dict builds IF/THEN relationships between fields. Put a `fieldKey` on a
controlling `checkbox`, then point each dependent field's `conditional.controllingFieldKey` back
at it.

| Property                            | Type   | Required | Description                                                       |
| ----------------------------------- | ------ | -------- | ---------------------------------------------------------------- |
| `fieldKey`                          | `str`  | No       | Stable id on a **controlling checkbox** (`type: "checkbox"`).    |
| `conditional`                       | `Dict` | No       | Rule on a **dependent field** (see below).                       |
| `conditional.controllingFieldKey`   | `str`  | Yes      | The controlling checkbox's `fieldKey`. Must be non-empty.        |
| `conditional.operator`              | `str`  | Yes      | `"is_checked"` \| `"is_not_checked"`.                            |
| `conditional.action`                | `str`  | Yes      | `"show"` (hidden until met) \| `"unlock"` (locked until met).    |

```python
# Checkbox reveals a text field when checked
fields = [
    {
        "type": "checkbox",
        "recipientEmail": "reviewer@company.com",
        "page": 1, "x": 100, "y": 400, "width": 20, "height": 20,
        "metadata": {"fieldKey": "request_changes"},
    },
    {
        "type": "text",
        "recipientEmail": "reviewer@company.com",
        "page": 1, "x": 130, "y": 400, "width": 300, "height": 60,
        "metadata": {
            "conditional": {
                "controllingFieldKey": "request_changes",
                "operator": "is_checked",
                "action": "show",
            }
        },
    },
]
```

A malformed rule returns `400 InvalidConditionalRule`; a well-formed rule whose
`controllingFieldKey` matches no checkbox **fails open** (the field stays visible/editable). See
[Conditional (IF/THEN) Fields](/docs/TurboSign/Conditional-Fields).

**Template Configuration:**

| Property        | Type   | Required | Description                                                      |
| --------------- | ------ | -------- | ---------------------------------------------------------------- |
| `anchor`        | `str`  | Yes      | Text anchor pattern like `{TagName}`                             |
| `placement`     | `str`  | Yes      | `"replace"` \| `"before"` \| `"after"` \| `"above"` \| `"below"` |
| `size`          | `Dict` | Yes      | `{ "width": int, "height": int }`                                |
| `offset`        | `Dict` | No       | `{ "x": int, "y": int }`                                         |
| `caseSensitive` | `bool` | No       | Case sensitive search (default: False)                           |
| `useRegex`      | `bool` | No       | Use regex for anchor/searchText (default: False)                 |

```python
field: Dict[str, Any] = {
    "type": "signature",
    "page": 1,
    "x": 100,
    "y": 500,
    "width": 200,
    "height": 50,
    "recipientEmail": "john@example.com"
}
```

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

| Property          | Type              | Required | Description                                 |
| ----------------- | ----------------- | -------- | ------------------------------------------- |
| `Type`            | `string`          | Yes      | Field type (see table above)                |
| `RecipientEmail`  | `string`          | Yes      | Email of the recipient who fills this field |
| `Page`            | `int`             | No\*     | Page number (1-indexed)                     |
| `X`               | `int`             | No\*     | X coordinate in pixels                      |
| `Y`               | `int`             | No\*     | Y coordinate in pixels                      |
| `Width`           | `int`             | No\*     | Field width in pixels                       |
| `Height`          | `int`             | No\*     | Field height in pixels                      |
| `DefaultValue`    | `string`          | No       | Pre-filled value (checkbox: `"true"`/`"false"`; date: a fixed `MM/DD/YYYY`, omit to auto-fill the signing date) |
| `IsMultiline`     | `bool`            | No       | Enable multiline for text fields            |
| `IsReadonly`      | `bool`            | No       | Make field read-only                        |
| `Required`        | `bool`            | No       | Make field required                         |
| `BackgroundColor` | `string`          | No       | Background color                            |
| `Template`        | `*TemplateAnchor` | No       | Template anchor configuration               |
| `Metadata`        | `*FieldMetadata`  | No       | Conditional (IF/THEN) metadata, see below  |

\*Required when not using template anchors

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

The coordinate-based constructor takes positional arguments in this order: `new Field(type, page, x, y, width, height, recipientEmail)`. For template-based fields, use the extended constructor shown in [Using Template-Based Fields](#using-template-based-fields).

| Property          | Type             | Required | Description                                 |
| ----------------- | ---------------- | -------- | ------------------------------------------- |
| `type`            | `String`         | Yes      | Field type (see table above)                |
| `recipientEmail`  | `String`         | Yes      | Email of the recipient who fills this field |
| `page`            | `Integer`        | No\*     | Page number (1-indexed)                     |
| `x`               | `Integer`        | No\*     | X coordinate in pixels                      |
| `y`               | `Integer`        | No\*     | Y coordinate in pixels                      |
| `width`           | `Integer`        | No\*     | Field width in pixels                       |
| `height`          | `Integer`        | No\*     | Field height in pixels                      |
| `defaultValue`    | `String`         | No       | Pre-filled value (checkbox: `"true"`/`"false"`; date: a fixed `MM/DD/YYYY`, omit to auto-fill the signing date) |
| `isMultiline`     | `Boolean`        | No       | Enable multiline for text fields            |
| `isReadonly`      | `Boolean`        | No       | Make field read-only                        |
| `required`        | `Boolean`        | No       | Make field required                         |
| `backgroundColor` | `String`         | No       | Background color                            |
| `template`        | `TemplateAnchor` | No       | Template anchor configuration               |

\*Required when not using template anchors

</TabItem>
</Tabs>

#### Metadata Configuration (Conditional Fields) {#metadata-configuration-conditional-fields}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

The optional `Metadata` builds IF/THEN relationships between fields. Put a `FieldKey` on a
controlling `checkbox`, then point each dependent field's `Conditional.ControllingFieldKey` back
at it.

| Property                          | Type              | Required | Description                                                    |
| --------------------------------- | ----------------- | -------- | ------------------------------------------------------------- |
| `FieldKey`                        | `string`          | No       | Stable id on a **controlling checkbox** (`Type: "checkbox"`). |
| `Conditional`                     | `*FieldConditional`| No      | Rule on a **dependent field** (see below).                    |
| `Conditional.ControllingFieldKey` | `string`          | Yes      | The controlling checkbox's `FieldKey`. Must be non-empty.     |
| `Conditional.Operator`            | `string`          | Yes      | `"is_checked"` or `"is_not_checked"`.                         |
| `Conditional.Action`              | `string`          | Yes      | `"show"` (hidden until met) or `"unlock"` (locked until met). |

```go
// Checkbox reveals a text field when checked
fields := []turbodocx.Field{
    {
        Type:           "checkbox",
        RecipientEmail: "reviewer@company.com",
        Page:           1, X: 100, Y: 400, Width: 20, Height: 20,
        Metadata: &turbodocx.FieldMetadata{
            FieldKey: "request_changes",
        },
    },
    {
        Type:           "text",
        RecipientEmail: "reviewer@company.com",
        Page:           1, X: 130, Y: 400, Width: 300, Height: 60,
        Metadata: &turbodocx.FieldMetadata{
            Conditional: &turbodocx.FieldConditional{
                ControllingFieldKey: "request_changes",
                Operator:            "is_checked",
                Action:              "show",
            },
        },
    },
}
```

A malformed rule returns `400 InvalidConditionalRule`; a well-formed rule whose
`ControllingFieldKey` matches no checkbox **fails open** (the field stays visible/editable). See
[Conditional (IF/THEN) Fields](/docs/TurboSign/Conditional-Fields).

</TabItem>
</Tabs>

#### Template Configuration {#template-configuration}

<Tabs groupId="language" queryString>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

When using `Template` instead of coordinates:

| Property        | Type     | Required | Description                                                                           |
| --------------- | -------- | -------- | ------------------------------------------------------------------------------------- |
| `Anchor`        | `string` | Yes      | Text to find in document (e.g., `"{SIGNATURE}"`)                                      |
| `Placement`     | `string` | Yes      | Position relative to anchor: `"replace"`, `"before"`, `"after"`, `"above"`, `"below"` |
| `Size`          | `*Size`  | Yes      | Size with `Width` and `Height`                                                        |
| `Offset`        | `*Point` | No       | Offset with `X` and `Y`                                                               |
| `CaseSensitive` | `bool`   | No       | Case-sensitive anchor search                                                          |
| `UseRegex`      | `bool`   | No       | Use regex for anchor search                                                           |

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

When using `template` instead of coordinates:

| Property        | Type      | Required | Description                                                                           |
| --------------- | --------- | -------- | ------------------------------------------------------------------------------------- | --- |
| `anchor`        | `String`  | Yes      | Text to find in document (e.g., `"{SIGNATURE}"`)                                      |     |
| `placement`     | `String`  | Yes      | Position relative to anchor: `"replace"`, `"before"`, `"after"`, `"above"`, `"below"` |
| `size`          | `Size`    | Yes      | Size with `width` and `height`                                                        |
| `offset`        | `Offset`  | No       | Offset with `x` and `y`                                                               |
| `caseSensitive` | `Boolean` | No       | Case-sensitive anchor search                                                          |
| `useRegex`      | `Boolean` | No       | Use regex for anchor search                                                           |

</TabItem>
</Tabs>

### Request Parameters {#request-parameters}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

Request configuration for `create_signature_review_link` and `send_signature` methods:

&nbsp;

| Parameter              | Type         | Required    | Description                    |
| ---------------------- | ------------ | ----------- | ------------------------------ |
| `recipients`           | `List[Dict]` | Yes         | Recipients who will sign       |
| `fields`               | `List[Dict]` | Yes         | Signature fields configuration |
| `file`                 | `bytes`      | Conditional | PDF file content as bytes      |
| `file_name`            | `str`        | No          | Original filename (used with `file` bytes) |
| `file_link`            | `str`        | Conditional | URL to document file           |
| `deliverable_id`       | `str`        | Conditional | TurboDocx deliverable ID       |
| `template_id`          | `str`        | Conditional | TurboDocx template ID          |
| `document_name`        | `str`        | No          | Document name                  |
| `document_description` | `str`        | No          | Document description           |
| `sender_name`          | `str`        | No          | Sender name (overrides the configured value) |
| `sender_email`         | `str`        | No\*\*      | Sender / reply-to email (overrides the configured value) |
| `cc_emails`            | `List[str]`  | No          | Array of CC email addresses    |
| `reminders_enabled`    | `bool`       | No          | Send reminder emails to signers who haven't signed. Off by default |
| `reminder_delay`       | `Dict`       | No          | `{"value": N, "unit": "days"\|"hours"}`, time to the FIRST reminder |
| `reminder_interval`    | `Dict`       | No          | `{"value": N, "unit": ...}`, gap between later reminders |
| `max_reminders`        | `int`        | No          | Cap per signer. `-1` unlimited, `0` none, max `50`. Default `5` |
| `expiration_enabled`   | `bool`       | No          | Close the signing window after `expire_after`. Off by default |
| `expire_after`         | `Dict`       | No          | `{"value": N, "unit": ...}`, how long the document stays signable |
| `expiration_warning`   | `Dict`       | No          | `{"value": N, "unit": ...}`, how far before expiry warnings start. `0` = never warn |
| `expiration_warning_interval` | `Dict` | No          | `{"value": N, "unit": ...}`, gap between warnings once they start |

:::info Duration bounds
Each duration `{"value", "unit"}` uses `"days"` or `"hours"`; `value` is a whole number from `1`
up to **999 days / 23976 hours**. Reminder and expiration are independent and both **off by
default**. See [Schedule reminders and expiration](#schedule-reminders-and-expiration).
:::

:::info File Source (Conditional)
Exactly one file source is required: `file`, `file_link`, `deliverable_id`, or `template_id`.
:::

\*\* `sender_email` is optional per call but **required at the SDK level** for TurboSign: it must be supplied via `configure()`, the `TURBODOCX_SENDER_EMAIL` environment variable, or this per-call parameter, otherwise the SDK raises a `ValidationError`.

---

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

Both `CreateSignatureReviewLinkRequest` and `SendSignatureRequest` accept:

| Property              | Type          | Required    | Description              |
| --------------------- | ------------- | ----------- | ------------------------ |
| `File`                | `[]byte`      | Conditional | File content as bytes    |
| `FileLink`            | `string`      | Conditional | URL to document          |
| `DeliverableID`       | `string`      | Conditional | TurboDocx deliverable ID |
| `TemplateID`          | `string`      | Conditional | TurboDocx template ID    |
| `Recipients`          | `[]Recipient` | Yes         | List of recipients       |
| `Fields`              | `[]Field`     | Yes         | List of fields           |
| `DocumentName`        | `string`      | No          | Document display name    |
| `DocumentDescription` | `string`      | No          | Document description     |
| `SenderName`          | `string`      | No          | Sender's name            |
| `SenderEmail`         | `string`      | No          | Sender's email           |
| `CCEmails`            | `[]string`    | No          | CC email addresses       |

:::info File Source (Conditional)
Exactly one file source is required: `File`, `FileLink`, `DeliverableID`, or `TemplateID`.
:::

---

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

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
| `schedule`            | `SignatureSchedule` | No        | Reminder + expiration schedule (see [Schedule reminders and expiration](#schedule-reminders-and-expiration)) |

:::info File Source (Conditional)
Exactly one file source is required: `file`, `fileLink`, `deliverableId`, or `templateId`.
:::

---

</TabItem>
</Tabs>

### CreateSignatureReviewLinkRequest / SendSignatureRequest {#createsignaturereviewlinkrequest--sendsignaturerequest}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

Request configuration for `createSignatureReviewLink` and `sendSignature` methods:

| Property              | Type          | Required    | Description                    |
| --------------------- | ------------- | ----------- | ------------------------------ |
| `file`                | `string \| File \| Buffer` | Conditional | Document as a local file path, `Buffer`, or browser `File` |
| `fileName`            | `string`      | No          | Original filename, used when `file` is a `Buffer` (defaults to `document.<ext>`) |
| `fileLink`            | `string`      | Conditional | URL to document file           |
| `deliverableId`       | `string`      | Conditional | TurboDocx deliverable ID       |
| `templateId`          | `string`      | Conditional | TurboDocx template ID          |
| `recipients`          | `Recipient[]` | Yes         | Recipients who will sign       |
| `fields`              | `Field[]`     | Yes         | Signature fields configuration |
| `documentName`        | `string`      | No          | Document name                  |
| `documentDescription` | `string`      | No          | Document description           |
| `senderName`          | `string`      | No          | Sender name, falls back to `senderName` in the SDK config, then your API key's name |
| `senderEmail`         | `string`      | Conditional | Sender email, **required on the request** unless supplied via `TurboSign.configure({ senderEmail })` or `TURBODOCX_SENDER_EMAIL` |
| `ccEmails`            | `string[]`    | No          | Array of CC email addresses    |
| `remindersEnabled`    | `boolean`     | No          | Send reminder emails to signers who haven't signed (default `false`) |
| `reminderDelay`       | `Duration`    | No          | `{ value, unit }`, time to the first reminder |
| `reminderInterval`    | `Duration`    | No          | `{ value, unit }`, gap between later reminders |
| `maxReminders`        | `number`      | No          | Cap per signer, range **-1..50** (`-1` unlimited, `0` none, default `5`) |
| `expirationEnabled`   | `boolean`     | No          | Close the signing window after `expireAfter` (default `false`) |
| `expireAfter`         | `Duration`    | No          | `{ value, unit }`, how long the document stays signable |
| `expirationWarning`   | `Duration`    | No          | `{ value, unit }`, how far before expiry warnings start (`0` = never warn) |
| `expirationWarningInterval` | `Duration` | No       | `{ value, unit }`, gap between warnings once they start |

:::info Durations
A `Duration` is `{ value: number, unit: "hours" | "days" }`. `value` is a whole number from **1 to 999 days (23976 hours)**.
:::

:::info File Source (Conditional)
Exactly one file source is required: `file`, `fileLink`, `deliverableId`, or `templateId`.
:::

:::caution Sender email is enforced by the SDK, not by a `SenderEmailRequired`/`SenderNameRequired` API error
Unlike TurboQuote (where the sender comes from the org quote template and there is no per-request
field), TurboSign expects the sender to come from the request body, `TurboSign.configure({ senderEmail })`,
or the `TURBODOCX_SENDER_EMAIL` environment variable. The **SDK enforces this itself**: `TurboSign.configure()`
throws a `ValidationError` if no `senderEmail` is configured (client-side, before any request is sent).
The API itself does not reject a send that omits a sender: if no sender email or name can be resolved,
it falls back to a generic TurboDocx sender identity rather than returning `400 SenderEmailRequired` or
`400 SenderNameRequired`.
:::

---

</TabItem>
</Tabs>

## Additional Documentation {#additional-documentation}

For detailed information about advanced configuration and API concepts, see:

### Core API References {#core-api-references}

- **[Request Body Reference](/docs/TurboSign/API-Signatures#request-body-multipartform-data)** - Complete request body parameters, file sources, and multipart/form-data structure
- **[Recipients Reference](/docs/TurboSign/API-Signatures#recipients-reference)** - Recipient properties, signing order, metadata, and configuration options
- **[Field Types Reference](/docs/TurboSign/API-Signatures#field-types-reference)** - All available field types (signature, date, text, checkbox, etc.) with properties and behaviors
- **[Field Positioning Methods](/docs/TurboSign/API-Signatures#field-positioning-methods)** - Template-based vs coordinate-based positioning, anchor configuration, and best practices

---

## Resources {#resources}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript" attributes={{className: 'tab-lang tab-lang--js'}}>

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
- [npm Package](https://www.npmjs.com/package/@turbodocx/sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)

</TabItem>
<TabItem value="python" label="Python" attributes={{className: 'tab-lang tab-lang--python'}}>

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
- [PyPI Package](https://pypi.org/project/turbodocx-sdk/)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)

</TabItem>
<TabItem value="php" label="PHP" attributes={{className: 'tab-lang tab-lang--php'}}>

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
- [Packagist Package](https://packagist.org/packages/turbodocx/sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)

</TabItem>
<TabItem value="go" label="Go" attributes={{className: 'tab-lang tab-lang--go'}}>

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)

</TabItem>
<TabItem value="java" label="Java" attributes={{className: 'tab-lang tab-lang--java'}}>

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
- [Maven Central](https://search.maven.org/artifact/com.turbodocx/turbodocx-sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)

</TabItem>
</Tabs>
