---
title: TurboWebhooks Java SDK
sidebar_position: 19
sidebar_label: "TurboWebhooks: Java"
description: Official TurboDocx Webhooks SDK for Java. Subscribe to all seven TurboSign signature events with the WebhookEvent enum, verify inbound webhook signatures with HMAC-SHA256, and manage delivery history programmatically.
keywords:
  - turbodocx webhooks
  - turbowebhooks java
  - webhook java
  - hmac signature verification java
  - signature webhook spring boot
  - signature webhook servlet
  - webhook receiver spring
  - webhook receiver servlet
  - webhook secret java
  - webhook events java
  - webhookevent enum java
  - signature lifecycle events
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboWebhooks Java SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbowebhooks" product="TurboWebhooks" />

The official TurboDocx Webhooks SDK for Java applications (Spring Boot, Servlet, Jakarta EE, etc.). Subscribe a single per-organization HTTPS endpoint to TurboDocx signature events, verify inbound signatures with HMAC-SHA256, replay delivery attempts, and rotate secrets — all from Java 11+. Distributed as `com.turbodocx:turbodocx-sdk` on Maven Central (same artifact as TurboSign).

<br />

:::info What is TurboWebhooks?
TurboWebhooks lets your application receive real-time notifications across the whole signature lifecycle — sent, viewed, each recipient signing, partial progress, completed, voided, and finalization failures — instead of polling the API. Each organization has a single, named webhook (`signature`) that mirrors the **Signature Webhooks** page in the dashboard, so SDK-managed and UI-managed configuration stays in sync.

For the full conceptual overview of how webhooks work in TurboSign (delivery retries, payload schema, dashboard UI), see [TurboSign → Webhooks](/docs/TurboSign/Webhooks).
:::

## Installation

<Tabs>
<TabItem value="maven" label="Maven">

```xml
<dependency>
    <groupId>com.turbodocx</groupId>
    <artifactId>turbodocx-sdk</artifactId>
    <version>0.5.0</version>
</dependency>
```

</TabItem>
<TabItem value="gradle" label="Gradle">

```groovy
implementation 'com.turbodocx:turbodocx-sdk:0.5.0'
```

</TabItem>
<TabItem value="gradle-kts" label="Gradle (Kotlin DSL)">

```kotlin
implementation("com.turbodocx:turbodocx-sdk:0.5.0")
```

</TabItem>
</Tabs>

Then import:

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.TurboWebhooks;
import com.turbodocx.TurboDocxException;
import com.turbodocx.WebhookSignatureVerifier;
```

## Requirements

- Java 11 or higher
- An **administrator** TurboDocx API key (the webhook routes are gated on the administrator role — non-admin keys return HTTP 403)
- All TurboWebhooks methods return `com.google.gson.JsonObject` for forward compatibility — new server fields surface without an SDK upgrade

## Configuration

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.TurboWebhooks;

TurboWebhooks webhooks = new TurboDocxClient.Builder()
    .apiKey(System.getenv("TURBODOCX_API_KEY"))
    .orgId(System.getenv("TURBODOCX_ORG_ID"))
    .buildWebhooksClient();
```

`buildWebhooksClient()` does **not** require `senderEmail` — webhook routes don't send email, so the sender validation that `build()` enforces for TurboSign is skipped here. The returned `TurboWebhooks` is an admin-scoped client; construct once and reuse.

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role throws `TurboDocxException.AuthorizationException` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

### Environment Variables

```bash
TURBODOCX_API_KEY=your_admin_api_key
TURBODOCX_ORG_ID=your_org_id
# optional — defaults to https://api.turbodocx.com
TURBODOCX_BASE_URL=https://api.turbodocx.com
# store the secret returned by createWebhook so your receiver can verify signatures
TURBODOCX_WEBHOOK_SECRET=whsec_...
```

:::warning Administrator role required
TurboWebhooks endpoints require the **administrator** role on the API key. A valid TDX- key without the role throws `TurboDocxException.AuthorizationException` (HTTP 403). Generate or rotate keys in the **Settings → API Keys** page.
:::

## Webhook Events

TurboSign dispatches **seven** events. Subscribe to any subset — the events list requires at least one.

| Event | Enum constant | Fires when |
|---|---|---|
| `signature.document.sent` | `WebhookEvent.SENT` | The document is dispatched to recipients |
| `signature.document.viewed` | `WebhookEvent.VIEWED` | A recipient opens the document for the first time |
| `signature.document.recipient_signed` | `WebhookEvent.RECIPIENT_SIGNED` | Any individual signer completes their signature — fires **once per signer**, including the last |
| `signature.document.signed` | `WebhookEvent.SIGNED` | A signer signs and the document is **not yet complete** (document-level partial progress) |
| `signature.document.completed` | `WebhookEvent.COMPLETED` | All recipients have signed and the signed PDF is finalized |
| `signature.document.finalization_failed` | `WebhookEvent.FINALIZATION_FAILED` | The signed PDF fails to finalize (e.g. a KMS signing error); the document is **not** completed |
| `signature.document.voided` | `WebhookEvent.VOIDED` | The document is voided or cancelled |

:::danger `signed` does not mean "the document is done"
`recipient_signed` is the **per-person** event: it fires once for **every** signer (including the last) and carries the signer's identity plus `is_final_signer` and `remaining_signers`.

`signed` is a document-level **partial-progress** event. On each signature `recipient_signed` fires first, then exactly one of `signed` (signers still remain), `completed` (that was the final signature and finalization succeeded), or `finalization_failed` (final signature, finalization failed). Two consequences:

- **`signed` never fires on the final signature.**
- **A single-signer document never emits `signed` at all** — it emits `recipient_signed` (`is_final_signer: true`) then `completed`.

To detect "the whole document is done", use `completed` (or `recipient_signed` with `is_final_signer: true`) — never `signed`.

See [TurboSign → Webhooks](/docs/TurboSign/Webhooks) for the full payload schemas and the lifecycle diagram.
:::

### Event constants

The events ship as the `com.turbodocx.WebhookEvent` enum. `createWebhook` takes a `List<String>` of wire strings, so pass `getValue()` (or `allValues()`).

```java
import com.turbodocx.WebhookEvent;
import com.google.gson.JsonObject;
import java.util.Arrays;
import java.util.List;

// Subscribe to a chosen subset — getValue() gives the wire string.
JsonObject created = webhooks.createWebhook(
    Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),
    Arrays.asList(
        WebhookEvent.SENT.getValue(),
        WebhookEvent.VIEWED.getValue(),
        WebhookEvent.RECIPIENT_SIGNED.getValue(),
        WebhookEvent.COMPLETED.getValue(),
        WebhookEvent.FINALIZATION_FAILED.getValue(),
        WebhookEvent.VOIDED.getValue()
    )
);

// ...or to everything TurboSign emits.
JsonObject all = webhooks.createWebhook(
    Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),
    WebhookEvent.allValues()   // List<String> — all 7 wire strings, lifecycle order
);

// Single value, e.g. for testWebhook / listWebhookDeliveries:
webhooks.testWebhook(WebhookEvent.COMPLETED.getValue(), payload);
```

:::note Raw strings still work
Nothing was narrowed. The events list is still `List<String>`, so existing code keeps compiling and the backend can add new events without an SDK release. The enum exists for discoverability and type safety. `getWebhook()` also returns `availableEvents` — the list the backend advertises at runtime.
:::

## Quick Start

### 1. Create the signature webhook

```java
import com.turbodocx.TurboDocxClient;
import com.turbodocx.TurboDocxException;
import com.turbodocx.TurboWebhooks;
import com.turbodocx.WebhookEvent;
import com.google.gson.JsonObject;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

public class CreateSignatureWebhook {
    public static void main(String[] args) throws Exception {
        TurboWebhooks webhooks = new TurboDocxClient.Builder()
            .apiKey(System.getenv("TURBODOCX_API_KEY"))
            .orgId(System.getenv("TURBODOCX_ORG_ID"))
            .buildWebhooksClient();

        try {
            JsonObject created = webhooks.createWebhook(
                Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),
                Arrays.asList(
                    WebhookEvent.SENT.getValue(),
                    WebhookEvent.VIEWED.getValue(),
                    WebhookEvent.RECIPIENT_SIGNED.getValue(),
                    WebhookEvent.COMPLETED.getValue(),
                    WebhookEvent.FINALIZATION_FAILED.getValue(),
                    WebhookEvent.VOIDED.getValue()
                )
            );

            // SAVE THIS SECRET — it is shown ONCE and cannot be retrieved later.
            Files.writeString(Paths.get(".secret"), created.get("secret").getAsString());
            System.out.println("Created webhook id=" + created.get("id").getAsString());

        } catch (TurboDocxException.ConflictException e) {
            // 409 — the signature webhook already exists for this org.
            // Use updateWebhook or deleteWebhook instead.
            System.out.println("Webhook already exists. Use updateWebhook or deleteWebhook.");
        } catch (TurboDocxException.ValidationException e) {
            // 400 — most commonly a non-HTTPS URL or empty events list.
            System.err.println("Validation failed: " + e.getMessage());
        }
    }
}
```

:::warning HTTPS only
TurboDocx rejects non-HTTPS webhook URLs with HTTP 400. For local development, expose your receiver via an HTTPS tunnel ([ngrok](https://ngrok.com), [cloudflared](https://github.com/cloudflare/cloudflared), or [webhook.site](https://webhook.site)) and pass the tunnel URL to `createWebhook`.
:::

### 2. Verify inbound webhook signatures

When TurboDocx POSTs to your receiver, every request carries an `X-TurboDocx-Signature` header. Verify it before trusting the payload — the helper enforces a 300-second timestamp tolerance and uses `MessageDigest.isEqual` for constant-time comparison.

Java has no free functions, so the helper is exposed as `WebhookSignatureVerifier.verify(...)` — a static method on a final utility class. Semantically equivalent to the free-function form in JS / Py / Go / PHP.

<Tabs>
<TabItem value="spring-boot" label="Spring Boot">

```java
package com.example.webhooks;

import com.turbodocx.WebhookSignatureVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TurboDocxWebhookController {

    @Value("${turbodocx.webhook.secret}")
    private String secret;

    // IMPORTANT: bind to byte[], not a parsed DTO. The signature is computed
    // over raw bytes — Jackson would re-serialize and whitespace mismatch
    // breaks HMAC verification.
    @PostMapping(value = "/webhooks/turbodocx", consumes = "application/json")
    public ResponseEntity<Void> receive(
            @RequestBody byte[] rawBody,
            @RequestHeader("X-TurboDocx-Signature") String signature,
            @RequestHeader("X-TurboDocx-Timestamp") String timestamp) {

        if (!WebhookSignatureVerifier.verify(rawBody, signature, timestamp, secret)) {
            return ResponseEntity.status(401).build();
        }

        // Now safe to parse rawBody as JSON and dispatch on event.eventType.
        return ResponseEntity.ok().build();
    }
}
```

</TabItem>
<TabItem value="servlet" label="Servlet">

```java
package com.example.webhooks;

import com.turbodocx.WebhookSignatureVerifier;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/webhooks/turbodocx")
public class TurboDocxWebhookServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // IMPORTANT: read raw bytes — never call getReader() or getParameter*,
        // those decode and re-encode the payload and break HMAC verification.
        byte[] rawBody = req.getInputStream().readAllBytes();

        String signature = req.getHeader("X-TurboDocx-Signature");
        String timestamp = req.getHeader("X-TurboDocx-Timestamp");
        String secret = System.getenv("TURBODOCX_WEBHOOK_SECRET");

        if (!WebhookSignatureVerifier.verify(rawBody, signature, timestamp, secret)) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "invalid signature");
            return;
        }

        // dispatch on event.eventType ...
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
```

</TabItem>
<TabItem value="jakarta" label="Jakarta EE">

```java
package com.example.webhooks;

import com.turbodocx.WebhookSignatureVerifier;

import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/webhooks/turbodocx")
public class TurboDocxWebhookResource {

    // JAX-RS deserializes byte[] entities as the raw request body — exactly
    // what HMAC verification needs.
    @POST
    public Response receive(
            byte[] rawBody,
            @HeaderParam("X-TurboDocx-Signature") String signature,
            @HeaderParam("X-TurboDocx-Timestamp") String timestamp) {

        String secret = System.getenv("TURBODOCX_WEBHOOK_SECRET");

        if (!WebhookSignatureVerifier.verify(rawBody, signature, timestamp, secret)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        // dispatch on event.eventType ...
        return Response.ok().build();
    }
}
```

</TabItem>
</Tabs>

:::danger Use the raw request body
The HMAC is computed over the **exact bytes** that left the TurboDocx server. Never decode JSON into a DTO and re-serialize before verifying — re-encoded JSON will not byte-match and verification will fail. In Spring, bind to `@RequestBody byte[]`. In a Servlet, use `request.getInputStream().readAllBytes()`. In JAX-RS, declare a `byte[]` entity parameter.
:::

The signature contract:

| Field | Value |
|---|---|
| Header | `X-TurboDocx-Signature: sha256=<hex>` |
| Timestamp header | `X-TurboDocx-Timestamp: <unix-seconds>` |
| Signed string | `timestamp + "." + rawBody` |
| Algorithm | HMAC-SHA256 |
| Tolerance | 300 seconds (configurable via the 6-arg `verify` overload) |
| Comparison | `MessageDigest.isEqual` (constant-time) |

## Method Reference

All methods are instance methods on `com.turbodocx.TurboWebhooks`. Construct once via `new TurboDocxClient.Builder()...buildWebhooksClient()` and reuse.

### createWebhook

Subscribe the org to events. Returns a `JsonObject` with `id` and `secret` — the **secret is shown once**.

```java
import com.turbodocx.WebhookEvent;

JsonObject created = webhooks.createWebhook(
    Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),
    Arrays.asList(
        WebhookEvent.RECIPIENT_SIGNED.getValue(),
        WebhookEvent.COMPLETED.getValue(),
        WebhookEvent.FINALIZATION_FAILED.getValue(),
        WebhookEvent.VOIDED.getValue()
    )
);

// or subscribe to all 7:
// JsonObject created = webhooks.createWebhook(urls, WebhookEvent.allValues());
```

The URL list accepts **1 to 10** HTTPS URLs. The events list requires **at least 1** of the [seven events](#webhook-events), as wire strings — raw strings and `WebhookEvent.*.getValue()` are interchangeable. Both are required on create.

| Exception | Why |
|---|---|
| `TurboDocxException.ConflictException` (409) | The signature webhook already exists for this org. |
| `TurboDocxException.ValidationException` (400) | A URL is not HTTPS, the URL list is empty or has more than 10 entries, or the events list is empty. |
| `TurboDocxException.AuthorizationException` (403) | API key lacks the administrator role. |

### getWebhook

Get the org's signature webhook plus delivery statistics.

```java
JsonObject webhook = webhooks.getWebhook();
// webhook.get("urls"), webhook.get("events"), webhook.get("isActive")
// webhook.getAsJsonObject("deliveryStats"):
//   { totalDeliveries, successfulDeliveries, failedDeliveries, pendingRetries }
// webhook.get("availableEvents")
```

### updateWebhook

Patch one or more fields. Pass `null` for any argument you don't want to change. Renaming is not supported.

```java
JsonObject updated = webhooks.updateWebhook(
    Arrays.asList("https://your-server.example.com/webhooks/turbodocx"),  // urls
    Arrays.asList(                                                         // events
        WebhookEvent.RECIPIENT_SIGNED.getValue(),
        WebhookEvent.COMPLETED.getValue()
    ),
    Boolean.TRUE                                                            // isActive
);

// Leaving urls and events alone: pass null, NOT an empty list.
JsonObject deactivated = webhooks.updateWebhook(null, null, Boolean.FALSE);
```

:::danger Never pass an empty list
`urls` and `events` are optional on update, but optional does **not** relax their minimum length. An empty list serializes to `urls: []` / `events: []`, which the API rejects with a **400** — exactly as it would on create. To leave a field unchanged, pass `null` so the key is omitted; never pass `Collections.emptyList()`. The URL list still caps at 10 entries on update.
:::

### deleteWebhook

Soft-delete the webhook and its delivery history.

```java
JsonObject deleted = webhooks.deleteWebhook();
```

### testWebhook

Fire a synthetic delivery to every URL configured on the webhook. Useful for CI smoke tests before flipping a new receiver into production.

```java
import java.util.LinkedHashMap;
import java.util.Map;

Map<String, Object> payload = new LinkedHashMap<>();
payload.put("documentId",   "...");
payload.put("documentName", "...");

JsonObject result = webhooks.testWebhook(WebhookEvent.COMPLETED.getValue(), payload);

JsonObject summary = result.getAsJsonObject("summary");
System.out.println(summary.get("successful") + "/" + summary.get("total") + " succeeded");
if (summary.has("errors") && summary.get("errors").isJsonArray()) {
    summary.getAsJsonArray("errors").forEach(err ->
        System.out.println("  failure: " + err));   // per-URL failure messages
}
```

`notifyWebhook` is also exposed for symmetry with the backend surface — it routes through the same handler and returns the same shape. Prefer `testWebhook` in new code.

### regenerateWebhookSecret

Rotate the HMAC secret. The new secret is shown **once**; old signatures fail immediately after rotation.

```java
JsonObject rotated = webhooks.regenerateWebhookSecret();
String newSecret = rotated.get("secret").getAsString();
// rotated.get("regeneratedAt")
```

### listWebhookDeliveries

Page through historical delivery attempts with filters. Pass `null` for any filter to skip it; the no-arg overload skips all filters.

```java
JsonObject page = webhooks.listWebhookDeliveries(
    20,                              // limit
    null,                            // offset
    "signature.document.completed",  // eventType
    Boolean.FALSE,                   // isDelivered
    500                              // httpStatus
);
// page.getAsJsonArray("results")
// page.get("totalRecords")
```

### replayWebhookDelivery

Manually retry a past delivery by ID. Returns a freshly-created delivery row.

```java
JsonObject replayed = webhooks.replayWebhookDelivery("delivery-uuid-here");
// replayed.get("id"), replayed.get("httpStatus"), replayed.get("attemptCount"), ...
```

### getWebhookStats

Aggregate delivery stats over a sliding window. Pass `null` for the backend default (30 days).

```java
JsonObject stats = webhooks.getWebhookStats(30);
// stats.getAsJsonObject("summary").get("successRate")
// stats.getAsJsonObject("summary").get("avgResponseTime")  (milliseconds)
// stats.get("eventBreakdown")  (per-event totals)
```

### WebhookSignatureVerifier.verify (static utility)

Verify the `X-TurboDocx-Signature` header on an incoming request. Exposed as a static method on a final utility class — Java has no free functions, but the helper has no `apiKey` / `orgId` dependency, so it can be called from a receiver that runs in a completely different process (or deploy) than the management code.

```java
boolean ok = WebhookSignatureVerifier.verify(
    rawBody,         // byte[] — raw bytes as received
    signatureHeader, // value of X-TurboDocx-Signature
    timestampHeader, // value of X-TurboDocx-Timestamp
    webhookSecret    // the secret from createWebhook
);
```

A `String` body overload is provided for convenience (`verify(String rawBody, ...)`), and a 6-arg overload accepts a custom `toleranceSeconds` plus an optional `LongSupplier now` for testing. Pass `toleranceSeconds = 0` to disable the timestamp check entirely (NOT recommended in production).

## Error Handling

```java
import com.turbodocx.TurboDocxException;

try {
    webhooks.createWebhook(urls, events);
} catch (TurboDocxException.ConflictException e) {
    // 409 — signature webhook already exists; update or delete it instead
} catch (TurboDocxException.ValidationException e) {
    // 400 — non-HTTPS URL, empty events list, etc.
} catch (TurboDocxException.AuthorizationException e) {
    // 403 — API key lacks the administrator role
} catch (TurboDocxException.AuthenticationException e) {
    // 401 — bad or revoked API key
} catch (TurboDocxException.NotFoundException e) {
    // 404 — operating on a non-existent webhook
} catch (TurboDocxException.RateLimitException e) {
    // 429 — back off and retry
} catch (TurboDocxException.NetworkException e) {
    // request never reached the server (DNS, refused, timeout)
} catch (TurboDocxException e) {
    // catch-all for any other typed SDK error (raw 5xx, etc.)
    System.err.println("Error " + e.getStatusCode() + ": " + e.getMessage());
}
```

### Common Error Codes

| Status | Type | When |
|---|---|---|
| 400 | `TurboDocxException.ValidationException` | Non-HTTPS URL, empty `urls`/`events` list, more than 10 URLs, invalid body |
| 401 | `TurboDocxException.AuthenticationException` | Missing or invalid API key |
| 403 | `TurboDocxException.AuthorizationException` | Valid key without administrator role |
| 404 | `TurboDocxException.NotFoundException` | Operating on a non-existent webhook |
| 409 | `TurboDocxException.ConflictException` | Creating when the signature webhook already exists |
| 429 | `TurboDocxException.RateLimitException` | Rate limit exceeded — back off |

## Runnable End-to-End Example

A complete, validated CRUD walkthrough lives in the SDK repo:

**[`packages/java-sdk/examples/TurboWebhooksCrud.java`](https://github.com/TurboDocx/SDK/blob/main/packages/java-sdk/examples/TurboWebhooksCrud.java)**

It exercises every CRUD step plus every error branch (400 / 401 / 403 / 404 / 409) against a live backend. Run it after exporting `TURBODOCX_API_KEY` and `TURBODOCX_ORG_ID`; override `TURBODOCX_RECEIVER_URL` to point at a real receiver (e.g. webhook.site, ngrok).

## Gotchas

- **One webhook per org.** Every method targets the fixed-name `signature` webhook. Creating it twice throws `TurboDocxException.ConflictException` (409). To manage multiple webhooks per org, call the REST API directly.
- **Save the secret immediately.** `createWebhook` and `regenerateWebhookSecret` return the HMAC secret **once**. There is no endpoint to retrieve it later. If you lose it, rotate.
- **`WebhookSignatureVerifier` is a static utility** — Java has no free functions, so call it as `WebhookSignatureVerifier.verify(...)`. Final class with a private constructor; do not subclass.
- **Use the raw bytes for verification.** The HMAC is over the exact request body received. In Spring, bind to `@RequestBody byte[] rawBody` — never `Map`/DTO; Jackson re-serialization breaks verification. In Servlets, use `request.getInputStream().readAllBytes()`. In JAX-RS, declare a `byte[]` entity parameter.
- **Administrator role required.** The webhook routes are gated on `requireOrgRole(administrator)`. Valid TDX- keys without the role throw `TurboDocxException.AuthorizationException` (403).
- **`null` skips fields on `updateWebhook` and `listWebhookDeliveries`.** Pass `null` for any argument you don't want to change/filter.
- **An empty list is not "no change".** On `updateWebhook`, an empty `urls`/`events` list serializes to `[]` and is a **400**, not a no-op. Pass `null` — never `Collections.emptyList()`.
- **`testWebhook` summary includes per-URL errors.** Read `result.getAsJsonObject("summary").getAsJsonArray("errors")` to see exactly which receiver failed and why.
- **All TurboWebhooks methods return `JsonObject`.** New server fields surface without an SDK upgrade — use `.has(key)` / `.get(key)` to navigate.
- **`createWebhook` takes wire strings, not enum constants.** Pass `WebhookEvent.COMPLETED.getValue()` — the events parameter is `List<String>`. `WebhookEvent.allValues()` returns all 7 wire strings in one call (as an unmodifiable list; copy it if you need to mutate).
- **`signature.document.signed` is partial progress, not completion.** It never fires on the final signature, and a single-signer document never emits it at all. Use `WebhookEvent.COMPLETED` to detect a finished document. See [Webhook Events](#webhook-events).

## See Also

- [TurboSign → Webhooks](/docs/TurboSign/Webhooks) — concepts, dashboard UI, retry behavior
- [TurboWebhooks JavaScript / TypeScript SDK](/docs/SDKs/webhooks-javascript) — same API, JS idioms
- [TurboWebhooks Python SDK](/docs/SDKs/webhooks-python) — same API, Python idioms
- [TurboWebhooks Go SDK](/docs/SDKs/webhooks-go) — same API, Go idioms
- [TurboWebhooks PHP SDK](/docs/SDKs/webhooks-php) — same API, PHP idioms
- [TurboSign Java SDK](/docs/SDKs/java) — sending documents for signature
- [SDKs Overview](/docs/SDKs) — all SDKs across all six languages
- [TurboDocx SDK on GitHub](https://github.com/TurboDocx/SDK/tree/main/packages/java-sdk)
