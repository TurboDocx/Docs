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

The official TurboDocx SDK for Ruby applications. Build document generation and digital signature workflows from Ruby, Rails or Sinatra with a simple synchronous API and comprehensive error handling. Available on RubyGems as [`turbodocx-sdk`](https://rubygems.org/gems/turbodocx-sdk).

## Installation

<Tabs>
<TabItem value="gem" label="gem" default>

```bash
gem install turbodocx-sdk
```

</TabItem>
<TabItem value="bundler" label="Bundler">

```bash
bundle add turbodocx-sdk
```

Or add `gem "turbodocx-sdk"` to your `Gemfile` and run `bundle install`.

</TabItem>
</Tabs>

## Requirements

- Ruby 2.7+
- No runtime dependencies (uses the standard library's `net/http`)

---

## Configuration

Each product module is configured on its own. If you skip `configure`, the module reads the `TURBODOCX_*` environment variables below.

```ruby
require "turbodocx_sdk"

# TurboSign (requires a sender email)
TurboDocxSdk::TurboSign.configure(
  api_key:      ENV["TURBODOCX_API_KEY"],
  org_id:       ENV["TURBODOCX_ORG_ID"],
  sender_email: ENV["TURBODOCX_SENDER_EMAIL"], # Required for TurboSign (reply-to address)
  sender_name:  "Your Company"                 # Optional: sender name shown in emails
  # base_url:   "https://api.turbodocx.com"    # Optional custom base URL
)

# Deliverable, TurboQuote and TurboWebhooks take the same credentials
TurboDocxSdk::Deliverable.configure(
  api_key: ENV["TURBODOCX_API_KEY"],
  org_id:  ENV["TURBODOCX_ORG_ID"]
)
```

### Environment Variables

```bash
export TURBODOCX_API_KEY=your_api_key_here
export TURBODOCX_ORG_ID=your_org_id_here
export TURBODOCX_SENDER_EMAIL=you@example.com  # Required for TurboSign (reply-to address)
export TURBODOCX_SENDER_NAME="Your Company"    # Optional
```

To get your credentials, follow the **[Get Your Credentials](/docs/SDKs#1-get-your-credentials)** steps from the SDKs main page.

---

## Product guides

Each product guide opens on the Ruby tab:

- [TurboSign](/docs/SDKs/turbosign?language=ruby): send documents for signature, track status, download signed PDFs and audit trails
- [Deliverable](/docs/SDKs/deliverable?language=ruby): generate documents from templates
- [TurboWebhooks](/docs/SDKs/webhooks?language=ruby): receive real-time signature events
- [TurboQuote](/docs/SDKs/quote?language=ruby): create, send and download quotes

## Resources

- [RubyGems](https://rubygems.org/gems/turbodocx-sdk)
- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
