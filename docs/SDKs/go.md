---
title: TurboDocx Go SDK
sidebar_position: 4
sidebar_label: Go
description: Install and configure the TurboDocx Go SDK, then open the TurboSign, Deliverable, TurboWebhooks or TurboQuote guide.
keywords:
- turbodocx go
- turbosign go
- golang sdk
- go module
- document api go
- esignature golang
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboDocx Go SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" />

The official TurboDocx SDK for Go applications. Build document generation and digital signature workflows with idiomatic Go patterns, context support, and comprehensive error handling. Available as `github.com/TurboDocx/SDK/packages/go-sdk`.

## Installation

```bash
go get github.com/TurboDocx/SDK/packages/go-sdk
```

## Requirements

- Go 1.21+

---

## Configuration

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

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
export TURBODOCX_SENDER_EMAIL=you@example.com  # Required for TurboSign (reply-to address)
```

---

## Product guides

Each product guide opens on the Go tab:

- [TurboSign](/docs/SDKs/turbosign?language=go): send documents for signature, track status, download signed PDFs and audit trails
- [Deliverable](/docs/SDKs/deliverable?language=go): generate documents from templates
- [TurboWebhooks](/docs/SDKs/webhooks?language=go): receive real-time signature events
- [TurboQuote](/docs/SDKs/quote?language=go): create, send and download quotes

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/go-sdk)
- [API Reference](/docs/TurboSign/API%20Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
