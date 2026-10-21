---
title: TurboDocx Ruby SDK
sidebar_position: 7
sidebar_label: Ruby
description: Install and configure the TurboDocx Ruby SDK, then open the TurboSign, Deliverable, TurboWebhooks or TurboQuote guide.
keywords:
- turbodocx ruby
- turbosign ruby
- ruby sdk
- gem turbodocx
- rails turbodocx
- sinatra turbodocx
- document api ruby
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartSkillNudge from '@site/src/components/QuickstartSkillNudge';

# TurboDocx Ruby SDK

<QuickstartSkillNudge command="/turbodocx-sdk turbosign" product="TurboSign" />

The official TurboDocx SDK for Ruby applications. Build document generation and digital signature workflows with a simple synchronous API and comprehensive error handling. Available on RubyGems as `turbodocx-sdk`.

## Installation

<Tabs>
<TabItem value="gem" label="gem" default>

```bash
gem install turbodocx-sdk
```

</TabItem>
<TabItem value="bundler" label="Bundler">

Add to your `Gemfile`:

```ruby
gem "turbodocx-sdk"
```

Then run:

```bash
bundle install
```

</TabItem>
</Tabs>

## Requirements

- Ruby 2.7+
- No runtime dependencies (uses the standard library's `net/http`)

---

## Configuration

```ruby
require "turbodocx_sdk"

# Configure globally (recommended)
TurboDocxSdk::TurboSign.configure(
  api_key:      ENV["TURBODOCX_API_KEY"],   # Required: Your TurboDocx API key
  org_id:       ENV["TURBODOCX_ORG_ID"],    # Required: Your organization ID
  sender_email: "contracts@yourcompany.com", # Required: Reply-to address for signature emails
  sender_name:  "Your Company"               # Recommended: Sender name shown in emails
  # base_url:   "https://api.turbodocx.com"  # Optional: Override base URL
)
```

:::tip Authentication
Authenticate using `api_key`. API keys are recommended for server-side applications.
:::

### Environment Variables

```bash
# .env
TURBODOCX_API_KEY=your_api_key_here
TURBODOCX_ORG_ID=your_org_id_here
TURBODOCX_SENDER_EMAIL=contracts@yourcompany.com
TURBODOCX_SENDER_NAME=Your Company
```

:::warning API Credentials Required
`api_key` and `org_id` are **required** for all API requests. TurboSign additionally **requires `sender_email`** (set it on `configure`, per call, or via the `TURBODOCX_SENDER_EMAIL` environment variable): `configure` raises a `TurboDocxSdk::ValidationError` without it. `sender_name` is optional but strongly recommended. To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.
:::

---

## Product guides

Each product guide opens on the Ruby tab:

- [TurboSign](/docs/SDKs/turbosign?language=ruby): send documents for signature, track status, download signed PDFs and audit trails
- [Deliverable](/docs/SDKs/deliverable?language=ruby): generate documents from templates
- [TurboWebhooks](/docs/SDKs/webhooks?language=ruby): receive real-time signature events
- [TurboQuote](/docs/SDKs/quote?language=ruby): create, send and download quotes

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk)
- [RubyGems Package](https://rubygems.org/gems/turbodocx-sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
