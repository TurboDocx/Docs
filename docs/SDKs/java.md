---
title: TurboDocx Java SDK
sidebar_position: 6
sidebar_label: Java
description: Install and configure the TurboDocx Java SDK, then open the TurboSign, Deliverable, TurboWebhooks or TurboQuote guide.
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
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboDocx Java SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" />

The official TurboDocx SDK for Java applications. Build document generation and digital signature workflows with the Builder pattern, comprehensive error handling, and type-safe APIs. Available on Maven Central as `com.turbodocx:turbodocx-sdk`.

## Installation

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

### Builder Options

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

### Closing the Client

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

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
export TURBODOCX_SENDER_EMAIL=sender@yourcompany.com
```

:::warning API Credentials Required
Three parameters are **required** for TurboSign operations: `apiKey` (or `accessToken`), `orgId`, and `senderEmail`. The `senderEmail` is used as the reply-to address for signature request emails. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Product guides

Each product guide opens on the Java tab:

- [TurboSign](/docs/SDKs/turbosign?language=java): send documents for signature, track status, download signed PDFs and audit trails
- [Deliverable](/docs/SDKs/deliverable?language=java): generate documents from templates
- [TurboWebhooks](/docs/SDKs/webhooks?language=java): receive real-time signature events
- [TurboQuote](/docs/SDKs/quote?language=java): create, send and download quotes

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
- [Maven Central](https://search.maven.org/artifact/com.turbodocx/turbodocx-sdk)
- [API Reference](/docs/TurboSign/API%20Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
