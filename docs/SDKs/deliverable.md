---
title: Deliverable SDK
sidebar_position: 8
sidebar_label: Deliverable
description: 'Deliverable SDK for JavaScript, TypeScript, Python, PHP, Go and Java: generate, list, update and download documents from templates.'
keywords:
- turbodocx deliverable javascript
- turbodocx deliverable typescript
- document generation javascript
- template api javascript
- deliverable sdk
- npm turbodocx
- turbodocx deliverable python
- document generation python
- template api python
- deliverable sdk python
- asyncio deliverable
- pip turbodocx
- turbodocx deliverable php
- document generation php
- template api php
- deliverable sdk php
- php 8.1 sdk
- laravel turbodocx
- symfony turbodocx
- composer turbodocx
- turbodocx deliverable go
- document generation go
- template api go
- deliverable sdk golang
- go module
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
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# Deliverable SDK

<QuickstartSkillNudge command="/turbodocx-sdk deliverable" product="Deliverable" />

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

The official TurboDocx Deliverable SDK for JavaScript and TypeScript applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically. Available on npm as `@turbodocx/sdk`.

</TabItem>
<TabItem value="python" label="Python">

The official TurboDocx Deliverable SDK for Python applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically with async/await patterns and comprehensive error handling. Available on PyPI as `turbodocx-sdk`.

</TabItem>
<TabItem value="php" label="PHP">

The official TurboDocx Deliverable SDK for PHP applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically. Available on Packagist as `turbodocx/sdk`.

</TabItem>
<TabItem value="go" label="Go">

The official TurboDocx Deliverable SDK for Go applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically with idiomatic Go patterns, context support, and comprehensive error handling. Available as `github.com/TurboDocx/SDK/packages/go-sdk`.

</TabItem>
<TabItem value="java" label="Java">

The official TurboDocx Deliverable SDK for Java applications. Generate documents from templates with dynamic variable injection, download source files and PDFs, and manage deliverables programmatically with the Builder pattern, comprehensive error handling, and type-safe APIs. Available on Maven Central as `com.turbodocx:turbodocx-sdk`.

</TabItem>
</Tabs>

## Installation {#installation}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

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
<TabItem value="python" label="Python">

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
<TabItem value="php" label="PHP">

```bash
composer require turbodocx/sdk
```

</TabItem>
<TabItem value="go" label="Go">

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

</TabItem>
<TabItem value="java" label="Java">

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
<TabItem value="js" label="JavaScript / TypeScript">

- Node.js 18+ or modern browser
- TypeScript 4.7+ (optional, for type checking)

</TabItem>
<TabItem value="python" label="Python">

- Python 3.9+
- `httpx` (installed automatically)

</TabItem>
<TabItem value="php" label="PHP">

- PHP 8.1 or higher
- Composer
- ext-json
- ext-fileinfo

:::tip Modern PHP Features
This SDK leverages PHP 8.1+ features including enums, named parameters, readonly classes, and match expressions for a superior developer experience.
:::

</TabItem>
<TabItem value="go" label="Go">

- Go 1.21+

</TabItem>
<TabItem value="java" label="Java">

- Java 11+
- OkHttp 4.x (included)
- Gson 2.x (included)

</TabItem>
</Tabs>

---

## Configuration {#configuration}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { Deliverable } = require("@turbodocx/sdk");

// Configure globally (recommended for server-side)
Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY, // Required: Your TurboDocx API key
  orgId: process.env.TURBODOCX_ORG_ID, // Required: Your organization ID
  // Optional: OAuth access token instead of an API key
  // accessToken: process.env.TURBODOCX_ACCESS_TOKEN,
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { Deliverable } from "@turbodocx/sdk";

// Configure globally (recommended for server-side)
Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "", // Required: Your TurboDocx API key
  orgId: process.env.TURBODOCX_ORG_ID || "", // Required: Your organization ID
  // Optional: OAuth access token instead of an API key
  // accessToken: process.env.TURBODOCX_ACCESS_TOKEN,
  // Optional: override base URL for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
</Tabs>

**`DeliverableConfig` fields:**

| Property      | Type     | Required | Description                                            |
| ------------- | -------- | -------- | ------------------------------------------------------ |
| `apiKey`      | `string` | Yes\*    | Your TurboDocx API key                                  |
| `accessToken` | `string` | Yes\*    | OAuth access token, alternative to `apiKey`            |
| `orgId`       | `string` | Yes      | Your organization ID                                    |
| `baseUrl`     | `string` | No       | API base URL (defaults to `https://api.turbodocx.com`) |

\*Supply either `apiKey` or `accessToken`. When both are set, `accessToken` wins.

:::tip No Sender Email Required
Unlike TurboSign, the Deliverable module only requires a credential and `orgId`: no sender email or name is needed.
:::

</TabItem>
<TabItem value="python" label="Python">

```python
from turbodocx_sdk import Deliverable
import os

# Configure globally (recommended)
Deliverable.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],  # Required: Your TurboDocx API key
    org_id=os.environ["TURBODOCX_ORG_ID"],    # Required: Your organization ID
    # base_url="https://api.turbodocx.com"    # Optional: Override base URL
)
```

:::tip No Sender Email Required
Unlike TurboSign, the Deliverable module only requires `api_key` and `org_id`: no sender email or name is needed.
:::

</TabItem>
<TabItem value="php" label="PHP">

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
Unlike TurboSign, the Deliverable module only requires `apiKey` and `orgId`: no sender email or name is needed.
:::

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
    "log"
    "os"

    sdk "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    // Option 1: Standalone deliverable client (no SenderEmail needed)
    deliverable, err := sdk.NewDeliverableClientOnly(sdk.ClientConfig{
        APIKey: os.Getenv("TURBODOCX_API_KEY"),
        OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
    })
    if err != nil {
        log.Fatal(err)
    }

    // Option 2: Full client (includes TurboSign + Deliverable)
    client, err := sdk.NewClientWithConfig(sdk.ClientConfig{
        APIKey:      os.Getenv("TURBODOCX_API_KEY"),
        OrgID:       os.Getenv("TURBODOCX_ORG_ID"),
        SenderEmail: "sender@example.com",
        BaseURL:     "https://api.turbodocx.com", // Optional custom base URL
    })
    if err != nil {
        log.Fatal(err)
    }
    deliverable = client.Deliverable
}
```

:::tip No SenderEmail Required
Use `NewDeliverableClientOnly()` when you only need document generation: it skips the `SenderEmail` validation required by TurboSign.
:::

</TabItem>
<TabItem value="java" label="Java">

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
Use `buildDeliverableClient()` when you only need document generation: it skips the `senderEmail` validation required by TurboSign.
:::

</TabItem>
</Tabs>

### Environment Variables {#environment-variables}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

</TabItem>
<TabItem value="python" label="Python">

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

:::caution API Credentials Required
Both `api_key` and `org_id` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
<TabItem value="php" label="PHP">

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
```

:::caution API Credentials Required
An `apiKey` (or `accessToken` as an alternative) is **required** for all API requests; `orgId` is optional but recommended for organization-scoped operations. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
<TabItem value="go" label="Go">

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
```

</TabItem>
<TabItem value="java" label="Java">

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
```

:::caution API Credentials Required
Both `apiKey` and `orgId` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
</Tabs>

---

## Quick Start {#quick-start}

### Generate a document from a template {#generate-a-document-from-a-template}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { Deliverable } = require("@turbodocx/sdk");

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
});

// Generate a document from a template with variables
const result = await Deliverable.generateDeliverable({
  name: "Q1 Report",
  templateId: "your-template-id",
  variables: [
    { placeholder: "{CompanyName}", text: "Acme Corporation", mimeType: "text" },
    { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
  ],
  description: "Quarterly business report",
  tags: ["reports", "quarterly"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { Deliverable } from "@turbodocx/sdk";
import type { CreateDeliverableRequest } from "@turbodocx/sdk";

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
});

// Generate a document from a template with variables
const request: CreateDeliverableRequest = {
  name: "Q1 Report",
  templateId: "your-template-id",
  variables: [
    { placeholder: "{CompanyName}", text: "Acme Corporation", mimeType: "text" },
    { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
  ],
  description: "Quarterly business report",
  tags: ["reports", "quarterly"],
};

const result = await Deliverable.generateDeliverable(request);
console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
import json
from turbodocx_sdk import Deliverable
import os

Deliverable.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"]
)

async def generate_report():
    # Generate a document from a template with variables
    result = await Deliverable.generate_deliverable(
        name="Q1 Report",
        template_id="your-template-id",
        variables=[
            {"placeholder": "{CompanyName}", "text": "Acme Corporation", "mimeType": "text"},
            {"placeholder": "{Date}", "text": "2026-03-12", "mimeType": "text"},
        ],
        description="Quarterly business report",
        tags=["reports", "quarterly"],
    )

    print("Result:", json.dumps(result, indent=2))

asyncio.run(generate_report())
```

</TabItem>
<TabItem value="php" label="PHP">

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

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"

    sdk "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    deliverable, err := sdk.NewDeliverableClientOnly(sdk.ClientConfig{
        APIKey: os.Getenv("TURBODOCX_API_KEY"),
        OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
    })
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    result, err := deliverable.GenerateDeliverable(ctx, &sdk.CreateDeliverableRequest{
        Name:       "Q1 Report",
        TemplateID: "your-template-id",
        Variables: []sdk.DeliverableVariable{
            {Placeholder: "{CompanyName}", Text: "Acme Corporation", MimeType: "text"},
            {Placeholder: "{Date}", Text: "2026-03-12", MimeType: "text"},
        },
        Description: "Quarterly business report",
        Tags:        []string{"reports", "quarterly"},
    })
    if err != nil {
        log.Fatal(err)
    }

    b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
}
```

</TabItem>
<TabItem value="java" label="Java">

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

</TabItem>
</Tabs>

### Download and manage deliverables {#download-and-manage-deliverables}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { Deliverable } = require("@turbodocx/sdk");
const { writeFileSync } = require("fs");

// List deliverables with pagination
const list = await Deliverable.listDeliverables({ limit: 10, showTags: true });
console.log(`Total: ${list.totalRecords}`);

// Get deliverable details
const details = await Deliverable.getDeliverableDetails("deliverable-uuid");
console.log(`Name: ${details.name}`);

// Download source file (DOCX/PPTX)
const buffer = await Deliverable.downloadSourceFile("deliverable-uuid");
writeFileSync("report.docx", Buffer.from(buffer));

// Download PDF
const pdfBuffer = await Deliverable.downloadPDF("deliverable-uuid");
writeFileSync("report.pdf", Buffer.from(pdfBuffer));

// Update deliverable
await Deliverable.updateDeliverableInfo("deliverable-uuid", {
  name: "Q1 Report - Final",
  description: "Final quarterly business report",
});

// Delete deliverable
await Deliverable.deleteDeliverable("deliverable-uuid");
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { Deliverable } from "@turbodocx/sdk";
import { writeFileSync } from "fs";

// List deliverables with pagination
const list = await Deliverable.listDeliverables({ limit: 10, showTags: true });
console.log(`Total: ${list.totalRecords}`);

// Get deliverable details
const details = await Deliverable.getDeliverableDetails("deliverable-uuid");
console.log(`Name: ${details.name}`);

// Download source file (DOCX/PPTX)
const buffer = await Deliverable.downloadSourceFile("deliverable-uuid");
writeFileSync("report.docx", Buffer.from(buffer));

// Download PDF
const pdfBuffer = await Deliverable.downloadPDF("deliverable-uuid");
writeFileSync("report.pdf", Buffer.from(pdfBuffer));

// Update deliverable
await Deliverable.updateDeliverableInfo("deliverable-uuid", {
  name: "Q1 Report - Final",
  description: "Final quarterly business report",
});

// Delete deliverable
await Deliverable.deleteDeliverable("deliverable-uuid");
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
from turbodocx_sdk import Deliverable
import os

Deliverable.configure(
    api_key=os.environ["TURBODOCX_API_KEY"],
    org_id=os.environ["TURBODOCX_ORG_ID"]
)

async def manage_deliverables():
    # List deliverables with pagination
    items = await Deliverable.list_deliverables(limit=10, show_tags=True)
    print(f"Total: {items['totalRecords']}")

    # Get deliverable details
    details = await Deliverable.get_deliverable_details("deliverable-uuid")
    print(f"Name: {details['name']}")

    # Download source file (DOCX/PPTX)
    source_bytes = await Deliverable.download_source_file("deliverable-uuid")
    with open("report.docx", "wb") as f:
        f.write(source_bytes)

    # Download PDF
    pdf_bytes = await Deliverable.download_pdf("deliverable-uuid")
    with open("report.pdf", "wb") as f:
        f.write(pdf_bytes)

    # Update deliverable
    await Deliverable.update_deliverable_info(
        "deliverable-uuid",
        name="Q1 Report - Final",
        description="Final quarterly business report",
    )

    # Delete deliverable
    await Deliverable.delete_deliverable("deliverable-uuid")

asyncio.run(manage_deliverables())
```

</TabItem>
<TabItem value="php" label="PHP">

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

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"

    sdk "github.com/TurboDocx/SDK/packages/go-sdk"
)

func main() {
    deliverable, err := sdk.NewDeliverableClientOnly(sdk.ClientConfig{
        APIKey: os.Getenv("TURBODOCX_API_KEY"),
        OrgID:  os.Getenv("TURBODOCX_ORG_ID"),
    })
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    // List deliverables with pagination
    list, err := deliverable.ListDeliverables(ctx, &sdk.ListDeliverablesOptions{
        Limit:    10,
        ShowTags: true,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Total: %d\n", list.TotalRecords)

    // Get deliverable details
    details, err := deliverable.GetDeliverableDetails(ctx, "deliverable-uuid", &sdk.GetDeliverableOptions{
        ShowTags: true,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Name: %s\n", details.Name)

    // Download source file (DOCX/PPTX)
    sourceData, err := deliverable.DownloadSourceFile(ctx, "deliverable-uuid")
    if err != nil {
        log.Fatal(err)
    }
    os.WriteFile("report.docx", sourceData, 0644)

    // Download PDF
    pdfData, err := deliverable.DownloadPDF(ctx, "deliverable-uuid")
    if err != nil {
        log.Fatal(err)
    }
    os.WriteFile("report.pdf", pdfData, 0644)

    // Update deliverable
    updateResult, err := deliverable.UpdateDeliverableInfo(ctx, "deliverable-uuid", &sdk.UpdateDeliverableRequest{
        Name:        "Q1 Report - Final",
        Description: "Final quarterly business report",
        Tags:        &[]string{"reports", "final"},
    })
    if err != nil {
        log.Fatal(err)
    }
    b, _ := json.MarshalIndent(updateResult, "", "  "); fmt.Println("Result:", string(b))

    // Delete deliverable
    deleteResult, err := deliverable.DeleteDeliverable(ctx, "deliverable-uuid")
    if err != nil {
        log.Fatal(err)
    }
    b, _ = json.MarshalIndent(deleteResult, "", "  "); fmt.Println("Result:", string(b))
}
```

</TabItem>
<TabItem value="java" label="Java">

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

</TabItem>
</Tabs>

---

## Variable Types {#variable-types}

The Deliverable module supports four variable types for template injection:

### 1. Text Variables {#1-text-variables}

Inject plain text values into template placeholders:

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const variables = [
  { placeholder: "{CompanyName}", text: "Acme Corporation", mimeType: "text" },
  { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
];
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const variables: DeliverableVariable[] = [
  { placeholder: "{CompanyName}", text: "Acme Corporation", mimeType: "text" },
  { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
];
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
variables = [
    {"placeholder": "{CompanyName}", "text": "Acme Corporation", "mimeType": "text"},
    {"placeholder": "{Date}", "text": "2026-03-12", "mimeType": "text"},
]
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$variables = [
    ['placeholder' => '{CompanyName}', 'text' => 'Acme Corporation', 'mimeType' => 'text'],
    ['placeholder' => '{Date}', 'text' => '2026-03-12', 'mimeType' => 'text'],
];
```

</TabItem>
<TabItem value="go" label="Go">

```go
variables := []sdk.DeliverableVariable{
    {Placeholder: "{CompanyName}", Text: "Acme Corporation", MimeType: "text"},
    {Placeholder: "{Date}", Text: "2026-03-12", MimeType: "text"},
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
DeliverableVariable var = new DeliverableVariable();
var.setPlaceholder("{CompanyName}");
var.setText("Acme Corporation");
var.setMimeType("text");
```

</TabItem>
</Tabs>

### 2. HTML Variables {#2-html-variables}

Inject rich HTML content with formatting:

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

```javascript
const variables = [
  {
    placeholder: "{Summary}",
    text: "<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>",
    mimeType: "html",
  },
];
```

</TabItem>
<TabItem value="python" label="Python">

```python
variables = [
    {
        "placeholder": "{Summary}",
        "text": "<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>",
        "mimeType": "html",
    },
]
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$variables = [
    [
        'placeholder' => '{Summary}',
        'text' => '<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>',
        'mimeType' => 'html',
    ],
];
```

</TabItem>
<TabItem value="go" label="Go">

```go
variables := []sdk.DeliverableVariable{
    {
        Placeholder: "{Summary}",
        Text:        "<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>",
        MimeType:    "html",
    },
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
DeliverableVariable var = new DeliverableVariable();
var.setPlaceholder("{Summary}");
var.setText("<p>This is a <strong>formatted</strong> summary with <em>rich text</em>.</p>");
var.setMimeType("html");
```

</TabItem>
</Tabs>

### 3. Image Variables {#3-image-variables}

Inject images by providing a URL or base64-encoded content:

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

```javascript
const variables = [
  {
    placeholder: "{Logo}",
    text: "https://example.com/logo.png",
    mimeType: "image",
  },
];
```

</TabItem>
<TabItem value="python" label="Python">

```python
variables = [
    {
        "placeholder": "{Logo}",
        "text": "https://example.com/logo.png",
        "mimeType": "image",
    },
]
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$variables = [
    [
        'placeholder' => '{Logo}',
        'text' => 'https://example.com/logo.png',
        'mimeType' => 'image',
    ],
];
```

</TabItem>
<TabItem value="go" label="Go">

```go
variables := []sdk.DeliverableVariable{
    {
        Placeholder: "{Logo}",
        Text:        "https://example.com/logo.png",
        MimeType:    "image",
    },
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
DeliverableVariable var = new DeliverableVariable();
var.setPlaceholder("{Logo}");
var.setText("https://example.com/logo.png");
var.setMimeType("image");
```

</TabItem>
</Tabs>

### 4. Markdown Variables {#4-markdown-variables}

Inject markdown content that gets converted to formatted text:

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

```javascript
const variables = [
  {
    placeholder: "{Notes}",
    text: "## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.",
    mimeType: "markdown",
  },
];
```

:::info Variable Stack
For repeating content (e.g., table rows), use `variableStack` instead of `text` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

</TabItem>
<TabItem value="python" label="Python">

```python
variables = [
    {
        "placeholder": "{Notes}",
        "text": "## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.",
        "mimeType": "markdown",
    },
]
```

:::info Variable Stack
For repeating content (e.g., table rows), use `variableStack` instead of `text` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

</TabItem>
<TabItem value="php" label="PHP">

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

</TabItem>
<TabItem value="go" label="Go">

```go
variables := []sdk.DeliverableVariable{
    {
        Placeholder: "{Notes}",
        Text:        "## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.",
        MimeType:    "markdown",
    },
}
```

:::info Variable Stack
For repeating content (e.g., table rows), use `VariableStack` instead of `Text` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

</TabItem>
<TabItem value="java" label="Java">

```java
DeliverableVariable var = new DeliverableVariable();
var.setPlaceholder("{Notes}");
var.setText("## Key Points\n- First item\n- Second item\n\n**Important:** Review before submission.");
var.setMimeType("markdown");
```

:::info Variable Stack
For repeating content (e.g., table rows), use `setVariableStack()` instead of `setText()` to provide multiple values for the same placeholder. See the [Types section](#createdeliverablerequest) for details.
:::

</TabItem>
</Tabs>

---

## API Reference {#api-reference}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python">

:::note Async snippets
The snippets below are partial and run inside an `async` function. They assume you have already called `Deliverable.configure(...)` and that `asyncio` and `json` are imported (`import asyncio, json`). For a complete runnable script, wrap the calls in `async def main(): ...` and run with `asyncio.run(main())`, as shown in [Quick Start](#quick-start).
:::

</TabItem>
</Tabs>

### Configure {#configure}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

Configure the SDK with your API credentials and organization settings.

**Example:**

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const { Deliverable } = require("@turbodocx/sdk");

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY,
  orgId: process.env.TURBODOCX_ORG_ID,
  // Optional: override for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import { Deliverable } from "@turbodocx/sdk";

Deliverable.configure({
  apiKey: process.env.TURBODOCX_API_KEY || "",
  orgId: process.env.TURBODOCX_ORG_ID || "",
  // Optional: override for testing
  // baseUrl: 'https://api.turbodocx.com'
});
```

</TabItem>
</Tabs>

:::caution API Credentials Required
Both `apiKey` and `orgId` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
<TabItem value="python" label="Python">

Configure the SDK with your API credentials and organization settings.

```python
Deliverable.configure(
    api_key: Optional[str] = None,                   # API key (or use access_token)
    access_token: Optional[str] = None,              # OAuth2 access token (alternative to api_key)
    base_url: str = "https://api.turbodocx.com",     # Optional: API base URL
    org_id: Optional[str] = None,                    # Required: Your organization ID
)
```

:::caution API Credentials Required
All parameters are optional and keyword-only. Either `api_key` or `access_token` must be provided for authentication, and `org_id` is **required** for all Deliverable operations (enforced at runtime). To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
<TabItem value="php" label="PHP">

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

</TabItem>
<TabItem value="go" label="Go">

Create a new TurboDocx Deliverable client.

```go
// Standalone deliverable client (no SenderEmail needed)
deliverable, err := sdk.NewDeliverableClientOnly(sdk.ClientConfig{
    APIKey: "your-api-key",
    OrgID:  "your-org-id",
})

// Full client (includes TurboSign + Deliverable)
client, err := sdk.NewClientWithConfig(sdk.ClientConfig{
    APIKey:      "your-api-key",
    OrgID:       "your-org-id",
    SenderEmail: "sender@example.com",
    BaseURL:     "https://api.turbodocx.com", // Optional
})
deliverable := client.Deliverable
```

:::caution API Credentials Required
Both `APIKey` and `OrgID` parameters are **required** for all API requests. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

</TabItem>
<TabItem value="java" label="Java">

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

The builder authenticates with either `apiKey(...)` or `accessToken(...)` (a bearer token), and exposes three build targets:

| Builder method             | Returns             | Use for                                             |
| -------------------------- | ------------------- | --------------------------------------------------- |
| `build()`                  | `TurboDocxClient`   | Full client, `turboSign()` and `deliverable()`       |
| `buildDeliverableClient()` | `DeliverableClient` | Document generation only (no `senderEmail` needed)   |
| `buildWebhooksClient()`    | `TurboWebhooks`     | Signature webhook subscriptions, see [TurboWebhooks Java SDK](/docs/SDKs/webhooks?language=java) |

```java
// Authenticate with a bearer access token instead of an API key
DeliverableClient deliverable = new TurboDocxClient.Builder()
    .accessToken(System.getenv("TURBODOCX_ACCESS_TOKEN"))
    .orgId(System.getenv("TURBODOCX_ORG_ID"))
    .buildDeliverableClient();
```

:::info Sharing one HTTP client
`DeliverableClient` also has a public constructor, `new DeliverableClient(HttpClient)`, if you already hold a configured `HttpClient` and want the deliverable module to reuse it. Most applications should use the builder instead.
:::

</TabItem>
</Tabs>

### Generate deliverable {#generate-deliverable}

Generate a new document from a template with variable substitution.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await Deliverable.generateDeliverable({
  name: "Q1 Report",
  templateId: "your-template-id",
  variables: [
    { placeholder: "{CompanyName}", text: "Acme Corp", mimeType: "text" },
    { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
  ],
  description: "Quarterly business report",
  tags: ["reports", "quarterly"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await Deliverable.generateDeliverable({
  name: "Q1 Report",
  templateId: "your-template-id",
  variables: [
    { placeholder: "{CompanyName}", text: "Acme Corp", mimeType: "text" },
    { placeholder: "{Date}", text: "2026-03-12", mimeType: "text" },
  ],
  description: "Quarterly business report",
  tags: ["reports", "quarterly"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
result = await Deliverable.generate_deliverable(
    name="Q1 Report",
    template_id="your-template-id",
    variables=[
        {"placeholder": "{CompanyName}", "text": "Acme Corp", "mimeType": "text"},
        {"placeholder": "{Date}", "text": "2026-03-12", "mimeType": "text"},
    ],
    description="Quarterly business report",
    tags=["reports", "quarterly"],
)

print("Result:", json.dumps(result, indent=2))
```

</TabItem>
<TabItem value="php" label="PHP">

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

</TabItem>
<TabItem value="go" label="Go">

```go
result, err := deliverable.GenerateDeliverable(ctx, &sdk.CreateDeliverableRequest{
    Name:       "Q1 Report",
    TemplateID: "your-template-id",
    Variables: []sdk.DeliverableVariable{
        {Placeholder: "{CompanyName}", Text: "Acme Corp", MimeType: "text"},
        {Placeholder: "{Date}", Text: "2026-03-12", MimeType: "text"},
    },
    Description: "Quarterly business report",
    Tags:        []string{"reports", "quarterly"},
})
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
```

</TabItem>
<TabItem value="java" label="Java">

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

</TabItem>
</Tabs>

### List deliverables {#list-deliverables}

List deliverables with pagination, search, and filtering.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const list = await Deliverable.listDeliverables({
  limit: 10,
  offset: 0,
  query: "report",
  showTags: true,
});

console.log(JSON.stringify(list, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const list = await Deliverable.listDeliverables({
  limit: 10,
  offset: 0,
  query: "report",
  showTags: true,
});

console.log(JSON.stringify(list, null, 2));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
items = await Deliverable.list_deliverables(
    limit=10,
    offset=0,
    query="report",
    show_tags=True,
)

print("Result:", json.dumps(items, indent=2))
```

</TabItem>
<TabItem value="php" label="PHP">

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

</TabItem>
<TabItem value="go" label="Go">

```go
list, err := deliverable.ListDeliverables(ctx, &sdk.ListDeliverablesOptions{
    Limit:    10,
    Offset:   0,
    Query:    "report",
    ShowTags: true,
})
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(list, "", "  "); fmt.Println("Result:", string(b))
```

</TabItem>
<TabItem value="java" label="Java">

```java
ListDeliverablesRequest request = new ListDeliverablesRequest();
request.setLimit(10);
request.setOffset(0);
request.setQuery("report");
request.setShowTags(true);

DeliverableListResponse list = deliverable.listDeliverables(request);

System.out.println("Result: " + gson.toJson(list));
```

</TabItem>
</Tabs>

### Get deliverable details {#get-deliverable-details}

Retrieve the full details of a single deliverable, including variables and fonts.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const details = await Deliverable.getDeliverableDetails("deliverable-uuid", {
  showTags: true,
});

console.log(JSON.stringify(details, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const details = await Deliverable.getDeliverableDetails("deliverable-uuid", {
  showTags: true,
});

console.log(JSON.stringify(details, null, 2));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
details = await Deliverable.get_deliverable_details("deliverable-uuid", show_tags=True)

print("Result:", json.dumps(details, indent=2))
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$details = Deliverable::getDeliverableDetails('deliverable-uuid', showTags: true);

echo "Name: {$details['name']}\n";
echo "Template: {$details['templateName']}\n";
echo "Created: {$details['createdOn']}\n";
```

</TabItem>
<TabItem value="go" label="Go">

```go
details, err := deliverable.GetDeliverableDetails(ctx, "deliverable-uuid", &sdk.GetDeliverableOptions{
    ShowTags: true,
})
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(details, "", "  "); fmt.Println("Result:", string(b))
```

</TabItem>
<TabItem value="java" label="Java">

```java
DeliverableRecord details = deliverable.getDeliverableDetails("deliverable-uuid", true);

System.out.println("Result: " + gson.toJson(details));
```

</TabItem>
</Tabs>

### Update deliverable info {#update-deliverable-info}

Update a deliverable's name, description, or tags.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await Deliverable.updateDeliverableInfo("deliverable-uuid", {
  name: "Q1 Report - Final",
  description: "Final quarterly business report",
  tags: ["reports", "final"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await Deliverable.updateDeliverableInfo("deliverable-uuid", {
  name: "Q1 Report - Final",
  description: "Final quarterly business report",
  tags: ["reports", "final"],
});

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
result = await Deliverable.update_deliverable_info(
    "deliverable-uuid",
    name="Q1 Report - Final",
    description="Final quarterly business report",
    tags=["reports", "final"],
)

print("Result:", json.dumps(result, indent=2))
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$result = Deliverable::updateDeliverableInfo('deliverable-uuid', [
    'name' => 'Q1 Report - Final',
    'description' => 'Final quarterly business report',
    'tags' => ['reports', 'final'],
]);

echo "Updated: {$result['deliverableId']}\n";
```

</TabItem>
<TabItem value="go" label="Go">

```go
result, err := deliverable.UpdateDeliverableInfo(ctx, "deliverable-uuid", &sdk.UpdateDeliverableRequest{
    Name:        "Q1 Report - Final",
    Description: "Final quarterly business report",
    Tags:        &[]string{"reports", "final"},
})
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
```

</TabItem>
<TabItem value="java" label="Java">

```java
UpdateDeliverableRequest request = new UpdateDeliverableRequest();
request.setName("Q1 Report - Final");
request.setDescription("Final quarterly business report");
request.setTags(List.of("reports", "final"));

UpdateDeliverableResponse result = deliverable.updateDeliverableInfo("deliverable-uuid", request);

System.out.println("Result: " + gson.toJson(result));
```

</TabItem>
</Tabs>

### Delete deliverable {#delete-deliverable}

Soft-delete a deliverable.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const result = await Deliverable.deleteDeliverable("deliverable-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const result = await Deliverable.deleteDeliverable("deliverable-uuid");

console.log(JSON.stringify(result, null, 2));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
result = await Deliverable.delete_deliverable("deliverable-uuid")

print("Result:", json.dumps(result, indent=2))
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$result = Deliverable::deleteDeliverable('deliverable-uuid');

echo "Deleted: {$result['deliverableId']}\n";
echo "Message: {$result['message']}\n";
```

</TabItem>
<TabItem value="go" label="Go">

```go
result, err := deliverable.DeleteDeliverable(ctx, "deliverable-uuid")
if err != nil {
    log.Fatal(err)
}

b, _ := json.MarshalIndent(result, "", "  "); fmt.Println("Result:", string(b))
```

</TabItem>
<TabItem value="java" label="Java">

```java
DeleteDeliverableResponse result = deliverable.deleteDeliverable("deliverable-uuid");

System.out.println("Result: " + gson.toJson(result));
```

</TabItem>
</Tabs>

### Download source file {#download-source-file}

Download the original source file (DOCX or PPTX).

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const buffer = await Deliverable.downloadSourceFile("deliverable-uuid");

// Node.js: Save to file
const { writeFileSync } = require("fs");
writeFileSync("report.docx", Buffer.from(buffer));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const buffer = await Deliverable.downloadSourceFile("deliverable-uuid");

// Node.js: Save to file
import { writeFileSync } from "fs";
writeFileSync("report.docx", Buffer.from(buffer));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
source_bytes = await Deliverable.download_source_file("deliverable-uuid")

# Save to file
with open("report.docx", "wb") as f:
    f.write(source_bytes)
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$sourceFile = Deliverable::downloadSourceFile('deliverable-uuid');

// Save to file
file_put_contents('report.docx', $sourceFile);

// Or send as HTTP response
header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
header('Content-Disposition: attachment; filename="report.docx"');
echo $sourceFile;
```

</TabItem>
<TabItem value="go" label="Go">

```go
sourceData, err := deliverable.DownloadSourceFile(ctx, "deliverable-uuid")
if err != nil {
    log.Fatal(err)
}

// Save to file
err = os.WriteFile("report.docx", sourceData, 0644)
if err != nil {
    log.Fatal(err)
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
byte[] sourceData = deliverable.downloadSourceFile("deliverable-uuid");

// Save to file
Files.write(Paths.get("report.docx"), sourceData);
```

</TabItem>
</Tabs>

### Download PDF {#download-pdf}

Download the PDF version of a deliverable.

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const buffer = await Deliverable.downloadPDF("deliverable-uuid");

// Node.js: Save to file
const { writeFileSync } = require("fs");
writeFileSync("report.pdf", Buffer.from(buffer));
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const buffer = await Deliverable.downloadPDF("deliverable-uuid");

// Node.js: Save to file
import { writeFileSync } from "fs";
writeFileSync("report.pdf", Buffer.from(buffer));
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="python" label="Python">

```python
pdf_bytes = await Deliverable.download_pdf("deliverable-uuid")

# Save to file
with open("report.pdf", "wb") as f:
    f.write(pdf_bytes)
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$pdfFile = Deliverable::downloadPDF('deliverable-uuid');

// Save to file
file_put_contents('report.pdf', $pdfFile);

// Or send as HTTP response
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="report.pdf"');
echo $pdfFile;
```

</TabItem>
<TabItem value="go" label="Go">

```go
pdfData, err := deliverable.DownloadPDF(ctx, "deliverable-uuid")
if err != nil {
    log.Fatal(err)
}

// Save to file
err = os.WriteFile("report.pdf", pdfData, 0644)
if err != nil {
    log.Fatal(err)
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
byte[] pdfData = deliverable.downloadPDF("deliverable-uuid");

// Save to file
Files.write(Paths.get("report.pdf"), pdfData);
```

</TabItem>
</Tabs>

---

## Error Handling {#error-handling}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

`Deliverable.generateDeliverable()` rejects with `NotFoundError` when `templateId` doesn't match a template in the org, and `ValidationError` when an entry in `variables` is missing a required field. Both extend the base `TurboDocxError` class:

</TabItem>
<TabItem value="python" label="Python">

`Deliverable.generate_deliverable()` raises `NotFoundError` when `template_id` doesn't match a template in the org, and `ValidationError` for invalid request parameters, most commonly a variable dict missing `text` (required unless it sets `variableStack` or `isDisabled: True`) or specifying an unsupported `mimeType`. Both extend the base `TurboDocxError`:

</TabItem>
<TabItem value="php" label="PHP">

`Deliverable::generateDeliverable()` throws `NotFoundException` when `templateId` doesn't match a template in the org, and `ValidationException` when a variable in the `variables` array is missing a required field:

</TabItem>
<TabItem value="go" label="Go">

`GenerateDeliverable` returns `NotFoundError` when `TemplateID` doesn't match a template in the org, and `ValidationError` for invalid request parameters, most commonly a `DeliverableVariable` missing `Text` (required unless it sets `VariableStack` or `IsDisabled: true`) or specifying an unsupported `MimeType`. Match on the concrete type with `errors.As`, same as every other Go SDK call:

</TabItem>
<TabItem value="java" label="Java">

`deliverable.generateDeliverable()` throws `TurboDocxException.NotFoundException` when `templateId` doesn't match a template in the org, and `TurboDocxException.ValidationException` when a variable in the request is missing a required field:

</TabItem>
</Tabs>

### Handling Errors {#handling-errors}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

<Tabs groupId="js-variant">
<TabItem value="javascript" label="JavaScript" default>

```javascript
const {
  Deliverable,
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} = require("@turbodocx/sdk");

try {
  const result = await Deliverable.generateDeliverable({
    name: "Q1 Report",
    templateId: "your-template-id",
    variables: [
      { placeholder: "{CompanyName}", text: "Acme Corp", mimeType: "text" },
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
    // Template or deliverable doesn't exist
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
<TabItem value="typescript" label="TypeScript">

```typescript
import {
  Deliverable,
  TurboDocxError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from "@turbodocx/sdk";

try {
  const result = await Deliverable.generateDeliverable({
    name: "Q1 Report",
    templateId: "your-template-id",
    variables: [
      { placeholder: "{CompanyName}", text: "Acme Corp", mimeType: "text" },
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
    // Template or deliverable doesn't exist
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

The full typed-error table (`AuthenticationError`, `AuthorizationError`, `ConflictError`, `RateLimitError`, `NetworkError`, HTTP status and code mapping) and the `message`/`statusCode`/`code` properties shared by every error are documented once in the [JavaScript / TypeScript SDK's Error Handling reference](./javascript.md#error-handling).

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
from turbodocx_sdk import (
    Deliverable,
    TurboDocxError,
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    NetworkError,
)

async def main():
    try:
        result = await Deliverable.generate_deliverable(
            name="Q1 Report",
            template_id="your-template-id",
            variables=[
                {"placeholder": "{CompanyName}", "text": "Acme Corp", "mimeType": "text"},
            ],
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
        # Template or deliverable doesn't exist
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

asyncio.run(main())
```

The full typed-error table (`AuthenticationError`, `AuthorizationError`, `ConflictError`, `RateLimitError`, `NetworkError`, HTTP status mapping) and the `message`/`status_code`/`code` attributes shared by every error are documented once in the [Python SDK's Error Handling reference](./python.md#error-handling).

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php

use TurboDocx\Deliverable;
use TurboDocx\Exceptions\TurboDocxException;
use TurboDocx\Exceptions\AuthenticationException;
use TurboDocx\Exceptions\AuthorizationException;
use TurboDocx\Exceptions\ValidationException;
use TurboDocx\Exceptions\NotFoundException;
use TurboDocx\Exceptions\ConflictException;
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
} catch (AuthorizationException $e) {
    // 403 - API key lacks required permissions
    echo "Authorization error: {$e->getMessage()}\n";
} catch (ValidationException $e) {
    // 400 - Invalid request data
    echo "Validation error: {$e->getMessage()}\n";
} catch (NotFoundException $e) {
    // 404 - Deliverable or template not found
    echo "Not found: {$e->getMessage()}\n";
} catch (ConflictException $e) {
    // 409 - Resource conflict
    echo "Conflict: {$e->getMessage()}\n";
} catch (RateLimitException $e) {
    // 429 - Rate limit exceeded
    echo "Rate limit: {$e->getMessage()}\n";
} catch (NetworkException $e) {
    // Network/connection error
    echo "Network error: {$e->getMessage()}\n";
}
```

The full typed-exception table (`AuthenticationException`, `AuthorizationException`, `ConflictException`, `RateLimitException`, `NetworkException`, HTTP status mapping) and the `getMessage()`/`statusCode`/`errorCode` properties shared by every exception are documented once in the [PHP SDK's Error Handling reference](./php.md#error-handling).

</TabItem>
<TabItem value="go" label="Go">

```go
import (
    "errors"
    "log"

    sdk "github.com/TurboDocx/SDK/packages/go-sdk"
)

result, err := deliverable.GenerateDeliverable(ctx, request)
if err != nil {
    // Check for specific error types
    var authErr *sdk.AuthenticationError
    var validationErr *sdk.ValidationError
    var notFoundErr *sdk.NotFoundError
    var rateLimitErr *sdk.RateLimitError
    var networkErr *sdk.NetworkError

    switch {
    case errors.As(err, &authErr):
        log.Printf("Authentication failed: %s", authErr.Message)
    case errors.As(err, &validationErr):
        log.Printf("Validation error: %s", validationErr.Message)
    case errors.As(err, &notFoundErr):
        log.Printf("Not found: %s", notFoundErr.Message)
    case errors.As(err, &rateLimitErr):
        log.Printf("Rate limited: %s", rateLimitErr.Message)
    case errors.As(err, &networkErr):
        log.Printf("Network error: %s", networkErr.Message)
    default:
        // Base TurboDocxError or unexpected error
        var turboErr *sdk.TurboDocxError
        if errors.As(err, &turboErr) {
            log.Printf("API error [%d]: %s", turboErr.StatusCode, turboErr.Message)
        } else {
            log.Fatal(err)
        }
    }
}
```

The full typed-error table (`AuthenticationError`, `AuthorizationError`, `ConflictError`, `RateLimitError`, `NetworkError`, HTTP status mapping) and the `Message`/`StatusCode`/`Code` fields on every error are documented once in the [Go SDK's Error Handling reference](./go.md#error-handling).

</TabItem>
<TabItem value="java" label="Java">

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

The full typed-exception table (`AuthenticationException`, `AuthorizationException`, `ConflictException`, `RateLimitException`, `NetworkException`, HTTP status mapping) and the `getMessage()`/`getStatusCode()`/`getCode()` methods shared by every exception are documented once in the [Java SDK's Error Handling reference](./java.md#error-handling).

</TabItem>
</Tabs>

---

<a id="python-types"></a>
<a id="php-types"></a>
<a id="types"></a>

## TypeScript Types / Python Types / PHP Types / Types {#typescript-types}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

The SDK exports TypeScript types for full type safety. Import them directly from the package.

</TabItem>
<TabItem value="python" label="Python">

The SDK uses Python type hints with `Dict[str, Any]` for flexible JSON-like structures.

</TabItem>
</Tabs>

### Importing Types {#importing-types}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

```typescript
import type {
  // Variable types
  DeliverableVariable,
  VariableMimeType,
  // Request types
  DeliverableConfig,
  CreateDeliverableRequest,
  UpdateDeliverableRequest,
  ListDeliverablesOptions,
  // Response types
  CreateDeliverableResponse,
  UpdateDeliverableResponse,
  DeleteDeliverableResponse,
  DeliverableListResponse,
  // Record types
  DeliverableRecord,
  Tag,
  Font,
} from "@turbodocx/sdk";
```

</TabItem>
<TabItem value="python" label="Python">

```python
from typing import Dict, List, Any, Optional
```

</TabItem>
</Tabs>

### VariableMimeType {#variablemimetype}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

Union type for variable content types:

```typescript
type VariableMimeType = "text" | "html" | "image" | "markdown";
```

</TabItem>
<TabItem value="java" label="Java">

String values for variable content types:

| Value        | Description                   |
| ------------ | ----------------------------- |
| `"text"`     | Plain text injection          |
| `"html"`     | Rich HTML content             |
| `"image"`    | Image URL or base64 content   |
| `"markdown"` | Markdown converted to text    |

</TabItem>
</Tabs>

<a id="variable-array-structure"></a>

### DeliverableVariable / Variable Array Structure {#deliverablevariable}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

Variable configuration for template injection:

| Property                 | Type                    | Required | Description                                          |
| ------------------------ | ----------------------- | -------- | ---------------------------------------------------- |
| `placeholder`            | `string`                | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `text`                   | `string`                | No\*     | Value to inject                                      |
| `mimeType`               | `VariableMimeType`      | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `isDisabled`             | `boolean`               | No       | Skip this variable during generation                 |
| `subvariables`           | `DeliverableVariable[]` | No       | Nested sub-variables for HTML content                |
| `variableStack`          | `object \| array`       | No       | Multiple instances for repeating content             |
| `aiPrompt`               | `string`                | No       | AI prompt for content generation (max 16,000 chars)  |
| `allowRichTextInjection` | `boolean`               | No       | Whether to allow rich text injection                 |

\*Required unless `variableStack` is provided or `isDisabled` is true.

</TabItem>
<TabItem value="python" label="Python">

Variable configuration for template injection:

&nbsp;

| Property                 | Type              | Required | Description                                          |
| ------------------------ | ----------------- | -------- | ---------------------------------------------------- |
| `placeholder`            | `str`             | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `text`                   | `str`             | No\*     | Value to inject                                      |
| `mimeType`               | `str`             | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `isDisabled`             | `bool`            | No       | Skip this variable during generation                 |
| `subvariables`           | `list[dict]`      | No       | Nested sub-variables for HTML content                |
| `variableStack`          | `dict \| list`    | No       | Multiple instances for repeating content             |
| `aiPrompt`               | `str`             | No       | AI prompt for content generation (max 16,000 chars)  |

\*Required unless `variableStack` is provided or `isDisabled` is true.

</TabItem>
<TabItem value="php" label="PHP">

Variables are passed as associative arrays with the following keys:

| Key                      | Type           | Required | Description                                          |
| ------------------------ | -------------- | -------- | ---------------------------------------------------- |
| `placeholder`            | `string`       | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `text`                   | `string`       | No\*     | Value to inject                                      |
| `mimeType`               | `string`       | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `isDisabled`             | `bool`         | No       | Skip this variable during generation                 |
| `allowRichTextInjection` | `bool`         | No       | Whether to allow rich text injection                 |
| `subvariables`           | `array`        | No       | Nested sub-variables for HTML content                |
| `variableStack`          | `array`        | No       | Multiple instances for repeating content             |
| `aiPrompt`               | `string`       | No       | AI prompt for content generation (max 16,000 chars)  |

\*Required unless `variableStack` is provided or `isDisabled` is true.

</TabItem>
<TabItem value="go" label="Go">

Variable configuration for template injection:

| Property                 | Type                    | Required | Description                                          |
| ------------------------ | ----------------------- | -------- | ---------------------------------------------------- |
| `Placeholder`            | `string`                | Yes      | Template placeholder (e.g., `{CompanyName}`)         |
| `Text`                   | `string`                | No\*     | Value to inject                                      |
| `MimeType`               | `string`                | Yes      | `"text"`, `"html"`, `"image"`, or `"markdown"`       |
| `IsDisabled`             | `FlexBool`              | No       | Skip this variable during generation                 |
| `Subvariables`           | `[]DeliverableVariable` | No       | Nested sub-variables for HTML content                |
| `VariableStack`          | `interface{}`           | No       | Multiple instances for repeating content             |
| `AIPrompt`               | `string`                | No       | AI prompt for content generation (max 16,000 chars)  |
| `AllowRichTextInjection` | `FlexBool`              | No       | Whether to allow rich text injection                 |

\*Required unless `VariableStack` is provided or `IsDisabled` is true.

:::note `FlexBool`, not `bool`
Boolean fields on the deliverable types are the SDK's `FlexBool`, a named `bool`. Untyped literals work as-is (`IsDisabled: true`), but assigning to or from an existing `bool` variable needs an explicit conversion: `var b bool = bool(rec.IsActive)`, `IsDisabled: turbodocx.FlexBool(myBool)`.
:::

</TabItem>
<TabItem value="java" label="Java">

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
| `allowRichTextInjection` | `Boolean`                     | No       | Allow rich text (HTML) to be injected for this variable |

\*Required unless `variableStack` is provided or `isDisabled` is true.

</TabItem>
</Tabs>

<a id="generate-deliverable-request"></a>

### CreateDeliverableRequest / Generate Deliverable Request {#createdeliverablerequest}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

Request configuration for `generateDeliverable`:

| Property       | Type                    | Required | Description                                |
| -------------- | ----------------------- | -------- | ------------------------------------------ |
| `name`         | `string`                | Yes      | Deliverable name (3-255 characters)        |
| `templateId`   | `string`                | Yes      | Template ID to generate from               |
| `variables`    | `DeliverableVariable[]` | Yes      | Variables for template substitution        |
| `description`  | `string`                | No       | Description (up to 65,535 characters)      |
| `tags`         | `string[]`              | No       | Tag strings to associate                   |

</TabItem>
<TabItem value="python" label="Python">

Request configuration for `generate_deliverable`:

&nbsp;

| Property        | Type         | Required | Description                                |
| --------------- | ------------ | -------- | ------------------------------------------ |
| `name`          | `str`        | Yes      | Deliverable name (3-255 characters)        |
| `template_id`   | `str`        | Yes      | Template ID to generate from               |
| `variables`     | `list[dict]` | Yes      | Variables for template substitution        |
| `description`   | `str`        | No       | Description (up to 65,535 characters)      |
| `tags`          | `list[str]`  | No       | Tag strings to associate                   |

</TabItem>
<TabItem value="php" label="PHP">

Request array for `generateDeliverable`:

| Key            | Type     | Required | Description                                |
| -------------- | -------- | -------- | ------------------------------------------ |
| `name`         | `string` | Yes      | Deliverable name (3-255 characters)        |
| `templateId`   | `string` | Yes      | Template ID to generate from               |
| `variables`    | `array`  | Yes      | Variables for template substitution        |
| `description`  | `string` | No       | Description (up to 65,535 characters)      |
| `tags`         | `array`  | No       | Tag strings to associate                   |

</TabItem>
<TabItem value="go" label="Go">

Request configuration for `GenerateDeliverable`:

| Property       | Type                    | Required | Description                                |
| -------------- | ----------------------- | -------- | ------------------------------------------ |
| `Name`         | `string`                | Yes      | Deliverable name (3-255 characters)        |
| `TemplateID`   | `string`                | Yes      | Template ID to generate from               |
| `Variables`    | `[]DeliverableVariable` | Yes      | Variables for template substitution        |
| `Description`  | `string`                | No       | Description (up to 65,535 characters)      |
| `Tags`         | `[]string`              | No       | Tag strings to associate                   |

</TabItem>
<TabItem value="java" label="Java">

Request configuration for `generateDeliverable`:

| Property       | Type                          | Required | Description                                |
| -------------- | ----------------------------- | -------- | ------------------------------------------ |
| `name`         | `String`                      | Yes      | Deliverable name (3-255 characters)        |
| `templateId`   | `String`                      | Yes      | Template ID to generate from               |
| `variables`    | `List<DeliverableVariable>`   | Yes      | Variables for template substitution        |
| `description`  | `String`                      | No       | Description (up to 65,535 characters)      |
| `tags`         | `List<String>`                | No       | Tag strings to associate                   |

</TabItem>
</Tabs>

<a id="update-deliverable-request"></a>

### UpdateDeliverableRequest / Update Deliverable Request {#updatedeliverablerequest}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

Request configuration for `updateDeliverableInfo`:

| Property      | Type       | Required | Description                              |
| ------------- | ---------- | -------- | ---------------------------------------- |
| `name`        | `string`   | No       | Updated name (3-255 characters)          |
| `description` | `string`   | No       | Updated description                      |
| `tags`        | `string[]` | No       | Replace all tags (empty array to remove) |

</TabItem>
<TabItem value="python" label="Python">

Request configuration for `update_deliverable_info`:

&nbsp;

| Property      | Type        | Required | Description                              |
| ------------- | ----------- | -------- | ---------------------------------------- |
| `name`        | `str`       | No       | Updated name (3-255 characters)          |
| `description` | `str`       | No       | Updated description                      |
| `tags`        | `list[str]` | No       | Replace all tags (empty list to remove)  |

</TabItem>
<TabItem value="php" label="PHP">

Request array for `updateDeliverableInfo`:

| Key           | Type     | Required | Description                              |
| ------------- | -------- | -------- | ---------------------------------------- |
| `name`        | `string` | No       | Updated name (3-255 characters)          |
| `description` | `string` | No       | Updated description                      |
| `tags`        | `array`  | No       | Replace all tags (empty array to remove) |

</TabItem>
<TabItem value="go" label="Go">

Request configuration for `UpdateDeliverableInfo`:

| Property      | Type        | Required | Description                                                      |
| ------------- | ----------- | -------- | ---------------------------------------------------------------- |
| `Name`        | `string`    | No       | Updated name (3-255 characters)                                  |
| `Description` | `string`    | No       | Updated description                                              |
| `Tags`        | `*[]string` | No       | Replace all tags (`nil` = no change, `&[]string{}` = remove all) |

</TabItem>
<TabItem value="java" label="Java">

Request configuration for `updateDeliverableInfo`:

| Property      | Type           | Required | Description                              |
| ------------- | -------------- | -------- | ---------------------------------------- |
| `name`        | `String`       | No       | Updated name (3-255 characters)          |
| `description` | `String`       | No       | Updated description                      |
| `tags`        | `List<String>` | No       | Replace all tags (empty list to remove)  |

</TabItem>
</Tabs>

<a id="list-deliverables-options"></a>
<a id="listdeliverablesrequest"></a>

### ListDeliverablesOptions / List Deliverables Options / ListDeliverablesRequest {#listdeliverablesoptions}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

Options for `listDeliverables`:

&nbsp;

| Property       | Type       | Required | Description                          |
| -------------- | ---------- | -------- | ------------------------------------ |
| `limit`        | `number`   | No       | Results per page (1-100, default 6)  |
| `offset`       | `number`   | No       | Results to skip (default 0)          |
| `query`        | `string`   | No       | Search query to filter by name       |
| `showTags`     | `boolean`  | No       | Include tags in the response         |

</TabItem>
<TabItem value="python" label="Python">

Options for `list_deliverables`:

&nbsp;

| Property        | Type    | Required | Description                          |
| --------------- | ------- | -------- | ------------------------------------ |
| `limit`         | `int`   | No       | Results per page (1-100, default 6)  |
| `offset`        | `int`   | No       | Results to skip (default 0)          |
| `query`         | `str`   | No       | Search query to filter by name       |
| `show_tags`     | `bool`  | No       | Include tags in the response         |

</TabItem>
<TabItem value="php" label="PHP">

Options array for `listDeliverables`:

| Key            | Type     | Required | Description                          |
| -------------- | -------- | -------- | ------------------------------------ |
| `limit`        | `int`    | No       | Results per page (1-100, default 6)  |
| `offset`       | `int`    | No       | Results to skip (default 0)          |
| `query`        | `string` | No       | Search query to filter by name       |
| `showTags`     | `bool`   | No       | Include tags in the response         |

</TabItem>
<TabItem value="go" label="Go">

Options for `ListDeliverables`:

| Property       | Type       | Required | Description                          |
| -------------- | ---------- | -------- | ------------------------------------ |
| `Limit`        | `int`      | No       | Results per page (1-100, default 6)  |
| `Offset`       | `int`      | No       | Results to skip (default 0)          |
| `Query`        | `string`   | No       | Search query to filter by name       |
| `ShowTags`     | `bool`     | No       | Include tags in the response         |

</TabItem>
<TabItem value="java" label="Java">

Options for `listDeliverables`:

| Property       | Type       | Required | Description                          |
| -------------- | ---------- | -------- | ------------------------------------ |
| `limit`        | `Integer`  | No       | Results per page (1-100, default 6)  |
| `offset`       | `Integer`  | No       | Results to skip (default 0)          |
| `query`        | `String`   | No       | Search query to filter by name       |
| `showTags`     | `Boolean`  | No       | Include tags in the response         |

</TabItem>
</Tabs>

<a id="deliverable-record"></a>

### DeliverableRecord / Deliverable Record {#deliverablerecord}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

The deliverable object returned by both `listDeliverables` and `getDeliverableDetails`. Fields marked _details only_ are populated only by `getDeliverableDetails`:

&nbsp;

| Property             | Type                    | Description                                          |
| -------------------- | ----------------------- | ---------------------------------------------------- |
| `id`                 | `string`                | Unique deliverable ID (UUID)                         |
| `name`               | `string`                | Deliverable name                                     |
| `description`        | `string`                | Description text                                     |
| `templateId`         | `string`                | Source template ID                                   |
| `templateName`       | `string`                | Source template name                                 |
| `templateNotDeleted` | `boolean`               | Whether the source template still exists             |
| `createdBy`          | `string`                | User ID of the creator                               |
| `email`              | `string`                | Creator's email address                              |
| `fileSize`           | `number`                | File size in bytes                                   |
| `fileType`           | `string`                | MIME type of the generated file                      |
| `defaultFont`        | `string`                | Default font used                                    |
| `fonts`              | `Font[]`                | Fonts used in the document                           |
| `isActive`           | `boolean`               | Whether the deliverable is active                    |
| `createdOn`          | `string`                | ISO 8601 creation timestamp                          |
| `updatedOn`          | `string`                | ISO 8601 last update timestamp                       |
| `variables`          | `DeliverableVariable[]` | Parsed variable objects with values (_details only_) |
| `tags`               | `Tag[]`                 | Associated tags (when `showTags=true`)               |

</TabItem>
<TabItem value="python" label="Python">

The deliverable object returned by `list_deliverables`:

&nbsp;

| Property          | Type     | Description                           |
| ----------------- | -------- | ------------------------------------- |
| `id`              | `str`    | Unique deliverable ID (UUID)          |
| `name`            | `str`    | Deliverable name                      |
| `description`     | `str`    | Description text                      |
| `templateId`      | `str`    | Source template ID                    |
| `createdBy`       | `str`    | User ID of the creator                |
| `email`           | `str`    | Creator's email address               |
| `fileSize`        | `int`    | File size in bytes                    |
| `fileType`        | `str`    | MIME type of the generated file       |
| `defaultFont`     | `str`    | Default font used                     |
| `fonts`           | `list`   | Fonts used in the document            |
| `isActive`        | `bool`   | Whether the deliverable is active     |
| `createdOn`       | `str`    | ISO 8601 creation timestamp           |
| `updatedOn`       | `str`    | ISO 8601 last update timestamp        |
| `tags`            | `list`   | Associated tags (when `show_tags=True`)|

</TabItem>
<TabItem value="php" label="PHP">

The deliverable record returned by `listDeliverables`:

| Key              | Type     | Description                           |
| ---------------- | -------- | ------------------------------------- |
| `id`             | `string` | Unique deliverable ID (UUID)          |
| `name`           | `string` | Deliverable name                      |
| `description`    | `string` | Description text                      |
| `templateId`     | `string` | Source template ID                    |
| `createdBy`      | `string` | User ID of the creator                |
| `email`          | `string` | Creator's email address               |
| `fileSize`       | `int`    | File size in bytes                    |
| `fileType`       | `string` | MIME type of the generated file       |
| `defaultFont`    | `string` | Default font used                     |
| `fonts`          | `array`  | Fonts used in the document            |
| `isActive`       | `bool`   | Whether the deliverable is active     |
| `createdOn`      | `string` | ISO 8601 creation timestamp           |
| `updatedOn`      | `string` | ISO 8601 last update timestamp        |
| `tags`           | `array`  | Associated tags (when `showTags=true`)|

</TabItem>
<TabItem value="go" label="Go">

The deliverable object returned by both `ListDeliverables` and `GetDeliverableDetails`:

| Property             | Type                    | Description                              |
| -------------------- | ----------------------- | ---------------------------------------- |
| `ID`                 | `string`                | Unique deliverable ID (UUID)             |
| `Name`               | `string`                | Deliverable name                         |
| `Description`        | `string`                | Description text                         |
| `TemplateID`         | `string`                | Source template ID                       |
| `TemplateName`       | `string`                | Source template name                     |
| `TemplateNotDeleted` | `*FlexBool`             | Whether the source template still exists |
| `CreatedBy`          | `string`                | User ID of the creator                   |
| `Email`              | `string`                | Creator's email address                  |
| `FileSize`           | `int64`                 | File size in bytes                       |
| `FileType`           | `string`                | MIME type of the generated file          |
| `DefaultFont`        | `string`                | Default font used                        |
| `Fonts`              | `[]Font`                | Fonts used in the document               |
| `IsActive`           | `FlexBool`              | Whether the deliverable is active        |
| `CreatedOn`          | `string`                | ISO 8601 creation timestamp              |
| `UpdatedOn`          | `string`                | ISO 8601 last update timestamp           |
| `Variables`          | `[]DeliverableVariable` | Parsed variable objects with values      |
| `Tags`               | `[]Tag`                 | Associated tags (when `ShowTags=true`)   |

</TabItem>
<TabItem value="java" label="Java">

The deliverable object returned by both `listDeliverables` and `getDeliverableDetails`. Both methods return the same type.

| Property             | Type                         | Description                              |
| -------------------- | ---------------------------- | ---------------------------------------- |
| `id`                 | `String`                     | Unique deliverable ID (UUID)             |
| `name`               | `String`                     | Deliverable name                         |
| `description`        | `String`                     | Description text                         |
| `templateId`         | `String`                     | Source template ID                       |
| `templateName`       | `String`                     | Source template name                     |
| `templateNotDeleted` | `boolean`                    | Whether the source template still exists |
| `createdBy`          | `String`                     | User ID of the creator                   |
| `email`              | `String`                     | Creator's email address                  |
| `fileSize`           | `Long`                       | File size in bytes                       |
| `fileType`           | `String`                     | MIME type of the generated file          |
| `defaultFont`        | `String`                     | Default font used                        |
| `isActive`           | `boolean`                    | Whether the deliverable is active        |
| `createdOn`          | `String`                     | ISO 8601 creation timestamp              |
| `updatedOn`          | `String`                     | ISO 8601 last update timestamp           |
| `variables`          | `List<DeliverableVariable>`  | Parsed variable objects with values      |
| `tags`               | `List<Tag>`                  | Associated tags (when `showTags=true`)   |

</TabItem>
</Tabs>

<a id="deliverable-detail-record"></a>

### DeliverableDetailRecord / Deliverable Detail Record {#deliverabledetailrecord}

<Tabs groupId="language" queryString>
<TabItem value="python" label="Python">

The deliverable object returned by `get_deliverable_details`. Includes all fields from [DeliverableRecord](#deliverablerecord) **except `fileSize`**, plus:

&nbsp;

| Property             | Type         | Description                              |
| -------------------- | ------------ | ---------------------------------------- |
| `templateName`       | `str`        | Source template name                     |
| `templateNotDeleted` | `bool`       | Whether the source template still exists |
| `variables`          | `list[dict]` | Parsed variable objects with values      |

</TabItem>
<TabItem value="php" label="PHP">

The deliverable record returned by `getDeliverableDetails`. Includes all fields from [Deliverable Record](#deliverable-record) **except `fileSize`**, plus:

| Key                  | Type     | Description                              |
| -------------------- | -------- | ---------------------------------------- |
| `templateName`       | `string` | Source template name                     |
| `templateNotDeleted` | `bool`   | Whether the source template still exists |
| `variables`          | `array`  | Parsed variable objects with values      |

</TabItem>
</Tabs>

### Tag {#tag}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

Tag object included when `showTags` is enabled:

&nbsp;

| Property    | Type      | Description                          |
| ----------- | --------- | ------------------------------------ |
| `id`        | `string`  | Tag unique identifier (UUID)         |
| `label`     | `string`  | Tag display name                     |
| `isActive`  | `boolean` | Whether the tag is active            |
| `updatedOn` | `string`  | ISO 8601 last update timestamp       |
| `createdOn` | `string`  | ISO 8601 creation timestamp          |
| `createdBy` | `string`  | User ID of the tag creator           |
| `orgId`     | `string`  | Organization ID                      |

</TabItem>
<TabItem value="python" label="Python">

Tag object included when `show_tags` is enabled. Each tag is a `dict` with:

| Key         | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| `id`        | `str`  | Tag unique identifier (UUID)         |
| `label`     | `str`  | Tag display name                     |
| `isActive`  | `bool` | Whether the tag is active            |
| `updatedOn` | `str`  | ISO 8601 last update timestamp       |
| `createdOn` | `str`  | ISO 8601 creation timestamp          |
| `createdBy` | `str`  | User ID of the tag creator           |
| `orgId`     | `str`  | Organization ID                      |

</TabItem>
<TabItem value="php" label="PHP">

Tag object included when `showTags` is enabled. Each tag is an associative array with:

| Key         | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `id`        | `string` | Tag unique identifier (UUID)         |
| `label`     | `string` | Tag display name                     |
| `isActive`  | `bool`   | Whether the tag is active            |
| `updatedOn` | `string` | ISO 8601 last update timestamp       |
| `createdOn` | `string` | ISO 8601 creation timestamp          |
| `createdBy` | `string` | User ID of the tag creator           |
| `orgId`     | `string` | Organization ID                      |

</TabItem>
<TabItem value="go" label="Go">

Tag object included when `ShowTags` is enabled:

| Property    | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `ID`        | `string` | Tag unique identifier (UUID)         |
| `Label`     | `string` | Tag display name                     |
| `IsActive`  | `FlexBool` | Whether the tag is active          |
| `UpdatedOn` | `string` | ISO 8601 last update timestamp       |
| `CreatedOn` | `string` | ISO 8601 creation timestamp          |
| `CreatedBy` | `string` | User ID of the tag creator           |
| `OrgID`     | `string` | Organization ID                      |

</TabItem>
<TabItem value="java" label="Java">

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

</TabItem>
</Tabs>

---

## Additional Documentation {#additional-documentation}

For detailed information about advanced configuration and API concepts, see:

### Core API References {#core-api-references}

- **[TurboDocx Templating](/docs/TurboDocx%20Templating/How%20to%20Create%20a%20Template)** - How to create and configure document templates
- **[Variable Reference](/docs/API/Deliverable%20API#variable-object-structure)** - Complete guide to variable types, formatting, and advanced injection options
- **[API Reference](/docs/API/Deliverable%20API)** - Full REST API documentation for Deliverable endpoints

---

## Resources {#resources}

<Tabs groupId="language" queryString>
<TabItem value="js" label="JavaScript / TypeScript">

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/js-sdk)
- [npm Package](https://www.npmjs.com/package/@turbodocx/sdk)
- [API Reference](/docs/API/Deliverable%20API)

</TabItem>
<TabItem value="python" label="Python">

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/py-sdk)
- [PyPI Package](https://pypi.org/project/turbodocx-sdk/)
- [API Reference](/docs/API/Deliverable%20API)

</TabItem>
<TabItem value="php" label="PHP">

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/php-sdk)
- [Packagist Package](https://packagist.org/packages/turbodocx/sdk)
- [API Reference](/docs/API/Deliverable%20API)

</TabItem>
<TabItem value="go" label="Go">

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [API Reference](/docs/API/Deliverable%20API)
- [Webhook Configuration](/docs/TurboSign/Webhooks)

</TabItem>
<TabItem value="java" label="Java">

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
- [Maven Central](https://search.maven.org/artifact/com.turbodocx/turbodocx-sdk)
- [API Reference](/docs/API/Deliverable%20API)

</TabItem>
</Tabs>
