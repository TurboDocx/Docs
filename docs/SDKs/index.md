---
title: SDKs Overview
sidebar_position: 1
sidebar_label: Overview
description: Official TurboDocx SDKs for JavaScript, Python, Go, .NET, Java, and Ruby. Get started with document generation and digital signatures in minutes.
keywords:
  - turbodocx sdk
  - turbosign sdk
  - javascript sdk
  - python sdk
  - go sdk
  - dotnet sdk
  - java sdk
  - ruby sdk
  - document api
  - esignature sdk
  - api client library
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TurboDocx SDKs

Official client libraries for the TurboDocx API. Build document generation and digital signature workflows in your language of choice.

## Available SDKs

| Language | Package | Install Command | Links |
|:---------|:--------|:----------------|:------|
| **JavaScript/TypeScript** | `@turbodocx/sdk` | `npm install @turbodocx/sdk` | [Docs](/docs/SDKs/javascript) · [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk) |
| **Python** | `turbodocx-sdk` | `pip install turbodocx-sdk` | [Docs](/docs/SDKs/python) · [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk) |
| **Go** | `github.com/turbodocx/sdk` | `go get github.com/turbodocx/sdk` | [Docs](/docs/SDKs/go) · [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk) |
| **C# / .NET** | `TurboDocx.Sdk` | `dotnet add package TurboDocx.Sdk` | [Docs](/docs/SDKs/dotnet) · [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/dotnet-sdk) |
| **Java** | `com.turbodocx:sdk` | [Maven Central](https://search.maven.org/artifact/com.turbodocx/sdk) | [Docs](/docs/SDKs/java) · [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk) |
| **Ruby** | `turbodocx-sdk` | `gem install turbodocx-sdk` | [Docs](/docs/SDKs/ruby) · [GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk) |

:::tip Low-code or No-code?
Check out our [n8n community node](https://www.npmjs.com/package/@turbodocx/n8n-nodes-turbodocx) for workflow automation, or get [TurboDocx Writer](https://appsource.microsoft.com/en-us/product/office/WA200007397) for Microsoft Word.
:::

---

## Quick Start

Get up and running in under 2 minutes.

### 1. Get Your API Key

Sign up at [turbodocx.com](https://www.turbodocx.com) and grab your API key from the dashboard under **Settings → API Keys**.

### 2. Install the SDK

<Tabs groupId="language">
<TabItem value="js" label="JavaScript" default>

```bash
npm install @turbodocx/sdk
# or
yarn add @turbodocx/sdk
```

</TabItem>
<TabItem value="python" label="Python">

```bash
pip install turbodocx-sdk
# or
poetry add turbodocx-sdk
```

</TabItem>
<TabItem value="go" label="Go">

```bash
go get github.com/turbodocx/sdk
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```bash
dotnet add package TurboDocx.Sdk
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
<TabItem value="ruby" label="Ruby">

```bash
gem install turbodocx-sdk
# or add to Gemfile:
gem 'turbodocx-sdk'
```

</TabItem>
</Tabs>

### 3. Send Your First Document for Signature

<Tabs groupId="language">
<TabItem value="js" label="JavaScript" default>

```typescript
import { TurboSign } from '@turbodocx/sdk';

// Configure with your API key
TurboSign.configure({ apiKey: process.env.TURBODOCX_API_KEY });

// Send a document for signature
const { documentId, recipients } = await TurboSign.prepareForSigningSingle({
  fileLink: 'https://example.com/contract.pdf',
  recipients: [
    { name: 'John Doe', email: 'john@example.com', order: 1 }
  ],
  fields: [
    { type: 'signature', page: 1, x: 100, y: 500, width: 200, height: 50, recipientOrder: 1 }
  ]
});

console.log(`Document sent! Sign URL: ${recipients[0].signUrl}`);
```

</TabItem>
<TabItem value="python" label="Python">

```python
from turbodocx import TurboSign
import os

# Configure with your API key
TurboSign.configure(api_key=os.environ["TURBODOCX_API_KEY"])

# Send a document for signature
result = await TurboSign.prepare_for_signing_single(
    file_link="https://example.com/contract.pdf",
    recipients=[
        {"name": "John Doe", "email": "john@example.com", "order": 1}
    ],
    fields=[
        {"type": "signature", "page": 1, "x": 100, "y": 500, "width": 200, "height": 50, "recipient_order": 1}
    ]
)

print(f"Document sent! Sign URL: {result.recipients[0].sign_url}")
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
    client := sdk.NewTurboSign(os.Getenv("TURBODOCX_API_KEY"))

    // Send a document for signature
    result, err := client.PrepareForSigningSingle(context.Background(), &sdk.SigningRequest{
        FileLink: "https://example.com/contract.pdf",
        Recipients: []sdk.Recipient{
            {Name: "John Doe", Email: "john@example.com", Order: 1},
        },
        Fields: []sdk.Field{
            {Type: "signature", Page: 1, X: 100, Y: 500, Width: 200, Height: 50, RecipientOrder: 1},
        },
    })
    if err != nil {
        panic(err)
    }

    fmt.Printf("Document sent! Sign URL: %s\n", result.Recipients[0].SignUrl)
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
using TurboDocx.Sdk;

// Configure with your API key
var turboSign = new TurboSignClient(Environment.GetEnvironmentVariable("TURBODOCX_API_KEY"));

// Send a document for signature
var result = await turboSign.PrepareForSigningSingleAsync(new SigningRequest
{
    FileLink = "https://example.com/contract.pdf",
    Recipients = new[]
    {
        new Recipient { Name = "John Doe", Email = "john@example.com", Order = 1 }
    },
    Fields = new[]
    {
        new Field { Type = "signature", Page = 1, X = 100, Y = 500, Width = 200, Height = 50, RecipientOrder = 1 }
    }
});

Console.WriteLine($"Document sent! Sign URL: {result.Recipients[0].SignUrl}");
```

</TabItem>
<TabItem value="java" label="Java">

```java
import com.turbodocx.sdk.TurboSign;
import com.turbodocx.sdk.models.*;

public class Main {
    public static void main(String[] args) {
        // Configure with your API key
        TurboSign turboSign = new TurboSign(System.getenv("TURBODOCX_API_KEY"));

        // Send a document for signature
        SigningResult result = turboSign.prepareForSigningSingle(
            SigningRequest.builder()
                .fileLink("https://example.com/contract.pdf")
                .recipient(Recipient.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .order(1)
                    .build())
                .field(Field.builder()
                    .type("signature")
                    .page(1).x(100).y(500).width(200).height(50)
                    .recipientOrder(1)
                    .build())
                .build()
        );

        System.out.println("Document sent! Sign URL: " + result.getRecipients().get(0).getSignUrl());
    }
}
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
require 'turbodocx'

# Configure with your API key
TurboDocx.configure do |config|
  config.api_key = ENV['TURBODOCX_API_KEY']
end

# Send a document for signature
result = TurboDocx::TurboSign.prepare_for_signing_single(
  file_link: 'https://example.com/contract.pdf',
  recipients: [
    { name: 'John Doe', email: 'john@example.com', order: 1 }
  ],
  fields: [
    { type: 'signature', page: 1, x: 100, y: 500, width: 200, height: 50, recipient_order: 1 }
  ]
)

puts "Document sent! Sign URL: #{result.recipients.first.sign_url}"
```

</TabItem>
</Tabs>

---

## Core Features

All TurboDocx SDKs provide access to:

### TurboSign — Digital Signatures

Send documents for legally-binding eSignatures with full audit trails.

| Method | Description |
|:-------|:------------|
| `prepareForReview()` | Upload document for preview without sending emails |
| `prepareForSigningSingle()` | Upload and immediately send signature requests |
| `getStatus()` | Check document and recipient signing status |
| `download()` | Download the completed signed document |
| `void()` | Cancel/void a signature request |
| `resend()` | Resend signature request emails |

[Learn more about TurboSign →](/docs/TurboSign/Setting-up-TurboSign)

### TurboDocx — Document Generation *(Coming Soon)*

Generate documents from templates with dynamic data.

---

## Field Positioning

TurboSign supports two methods for placing signature fields:

### Coordinate-Based (Pixel Positioning)

Specify exact positions using page coordinates:

```javascript
{
  type: 'signature',
  page: 1,
  x: 100,      // pixels from left
  y: 500,      // pixels from top
  width: 200,
  height: 50,
  recipientOrder: 1
}
```

### Template-Based (Text Anchors)

Use text markers in your PDF to position fields automatically:

```javascript
{
  type: 'signature',
  anchor: '{SIGNATURE_1}',  // text to find in PDF
  width: 200,
  height: 50,
  recipientOrder: 1
}
```

:::tip When to use each method
- **Coordinate-based**: Best for PDFs with fixed layouts where you know exact positions
- **Template-based**: Best for templates where content may shift, using anchor text like `{SIGNATURE_1}`
:::

---

## Error Handling

All SDKs provide structured error handling with detailed error codes:

<Tabs groupId="language">
<TabItem value="js" label="JavaScript" default>

```typescript
import { TurboSign, TurboDocxError } from '@turbodocx/sdk';

try {
  const result = await TurboSign.prepareForSigningSingle({ /* ... */ });
} catch (error) {
  if (error instanceof TurboDocxError) {
    console.error(`Error ${error.code}: ${error.message}`);
    // Handle specific error codes
    if (error.code === 'INVALID_DOCUMENT') {
      // Handle invalid document error
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
    result = await TurboSign.prepare_for_signing_single(...)
except TurboDocxError as e:
    print(f"Error {e.code}: {e.message}")
    if e.code == "INVALID_DOCUMENT":
        # Handle invalid document error
        pass
```

</TabItem>
<TabItem value="go" label="Go">

```go
result, err := client.PrepareForSigningSingle(ctx, request)
if err != nil {
    var turboErr *sdk.TurboDocxError
    if errors.As(err, &turboErr) {
        fmt.Printf("Error %s: %s\n", turboErr.Code, turboErr.Message)
        if turboErr.Code == "INVALID_DOCUMENT" {
            // Handle invalid document error
        }
    }
}
```

</TabItem>
</Tabs>

### Common Error Codes

| Code | Description |
|:-----|:------------|
| `UNAUTHORIZED` | Invalid or expired API key |
| `INVALID_DOCUMENT` | Document could not be processed |
| `INVALID_RECIPIENT` | Invalid recipient email or data |
| `RATE_LIMITED` | Too many requests, slow down |
| `NOT_FOUND` | Document or resource not found |

---

## Next Steps

<div className="row">
  <div className="col col--4">
    <div className="card">
      <div className="card__header">
        <h3>API Signatures</h3>
      </div>
      <div className="card__body">
        <p>Complete guide to TurboSign API integration with detailed examples.</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href="/docs/TurboSign/API-Signatures">View Guide →</a>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card">
      <div className="card__header">
        <h3>Webhooks</h3>
      </div>
      <div className="card__body">
        <p>Receive real-time notifications when documents are signed.</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href="/docs/TurboSign/Webhooks">Configure Webhooks →</a>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card">
      <div className="card__header">
        <h3>GitHub Repository</h3>
      </div>
      <div className="card__body">
        <p>View source code, report issues, and contribute to the SDKs.</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href="https://github.com/TurboDocx/SDK">View on GitHub →</a>
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
