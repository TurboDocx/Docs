---
title: Ruby SDK
sidebar_position: 7
sidebar_label: Ruby
description: Official TurboDocx Ruby SDK. Idiomatic Ruby with Rails and Sidekiq integration for document generation and digital signatures.
keywords:
  - turbodocx ruby
  - turbosign ruby
  - rubygems turbodocx
  - rails sdk
  - sidekiq integration
  - document api ruby
  - esignature ruby
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ruby SDK

The official TurboDocx SDK for Ruby applications. Idiomatic Ruby with Rails and background job integration.

[![Gem Version](https://img.shields.io/gem/v/turbodocx-sdk?logo=ruby&logoColor=white)](https://rubygems.org/gems/turbodocx-sdk)
[![GitHub](https://img.shields.io/github/stars/turbodocx/sdk?style=social)](https://github.com/TurboDocx/SDK)

## Installation

<Tabs>
<TabItem value="gem" label="gem" default>

```bash
gem install turbodocx-sdk
```

</TabItem>
<TabItem value="bundler" label="Bundler">

```ruby
# Gemfile
gem 'turbodocx-sdk'
```

Then run:

```bash
bundle install
```

</TabItem>
</Tabs>

## Requirements

- Ruby 3.0+
- `faraday` (installed automatically)

---

## Configuration

### Basic Configuration

```ruby
require 'turbodocx'

# Global configuration
TurboDocx.configure do |config|
  config.api_key = ENV['TURBODOCX_API_KEY']
  # Optional
  config.base_url = 'https://api.turbodocx.com'
  config.timeout = 30
end

# Or create a client instance
client = TurboDocx::TurboSign.new(api_key: ENV['TURBODOCX_API_KEY'])
```

### Rails Configuration

```ruby
# config/initializers/turbodocx.rb
TurboDocx.configure do |config|
  config.api_key = Rails.application.credentials.turbodocx[:api_key]
end
```

---

## Quick Start

### Send a Document for Signature

```ruby
require 'turbodocx'

TurboDocx.configure do |config|
  config.api_key = ENV['TURBODOCX_API_KEY']
end

result = TurboDocx::TurboSign.prepare_for_signing_single(
  file_link: 'https://example.com/contract.pdf',
  document_name: 'Service Agreement',
  sender_name: 'Acme Corp',
  sender_email: 'contracts@acme.com',
  recipients: [
    { name: 'Alice Smith', email: 'alice@example.com', order: 1 },
    { name: 'Bob Johnson', email: 'bob@example.com', order: 2 }
  ],
  fields: [
    # Alice's signature
    { type: 'signature', page: 1, x: 100, y: 650, width: 200, height: 50, recipient_order: 1 },
    { type: 'date', page: 1, x: 320, y: 650, width: 100, height: 30, recipient_order: 1 },
    # Bob's signature
    { type: 'signature', page: 1, x: 100, y: 720, width: 200, height: 50, recipient_order: 2 },
    { type: 'date', page: 1, x: 320, y: 720, width: 100, height: 30, recipient_order: 2 }
  ]
)

puts "Document ID: #{result.document_id}"
result.recipients.each do |recipient|
  puts "#{recipient.name}: #{recipient.sign_url}"
end
```

### Using Template-Based Fields

```ruby
result = TurboDocx::TurboSign.prepare_for_signing_single(
  file_link: 'https://example.com/contract-with-placeholders.pdf',
  recipients: [
    { name: 'Alice Smith', email: 'alice@example.com', order: 1 }
  ],
  fields: [
    { type: 'signature', anchor: '{SIGNATURE_ALICE}', width: 200, height: 50, recipient_order: 1 },
    { type: 'date', anchor: '{DATE_ALICE}', width: 100, height: 30, recipient_order: 1 }
  ]
)
```

---

## API Reference

### prepare_for_review

Upload a document for preview without sending emails.

```ruby
result = TurboDocx::TurboSign.prepare_for_review(
  file_link: 'https://example.com/document.pdf',
  # Or upload directly:
  # file: File.read('document.pdf'),
  document_name: 'Contract Draft',
  recipients: [
    { name: 'John Doe', email: 'john@example.com', order: 1 }
  ],
  fields: [
    { type: 'signature', page: 1, x: 100, y: 500, width: 200, height: 50, recipient_order: 1 }
  ]
)

puts result.document_id
puts result.preview_url
```

### prepare_for_signing_single

Upload a document and immediately send signature requests.

```ruby
result = TurboDocx::TurboSign.prepare_for_signing_single(
  file_link: 'https://example.com/document.pdf',
  document_name: 'Service Agreement',
  sender_name: 'Your Company',
  sender_email: 'sender@company.com',
  recipients: [
    { name: 'Recipient Name', email: 'recipient@example.com', order: 1 }
  ],
  fields: [
    { type: 'signature', page: 1, x: 100, y: 500, width: 200, height: 50, recipient_order: 1 }
  ]
)
```

### get_status

Check the status of a document.

```ruby
status = TurboDocx::TurboSign.get_status('document-uuid')

puts status.status  # 'pending', 'completed', or 'voided'
puts status.completed_at

status.recipients.each do |recipient|
  puts "#{recipient.name}: #{recipient.status}"
  puts "Signed at: #{recipient.signed_at}"
end
```

### download

Download the completed signed document.

```ruby
pdf_data = TurboDocx::TurboSign.download('document-uuid')

# Save to file
File.binwrite('signed-contract.pdf', pdf_data)

# Or upload to S3
s3_client.put_object(
  bucket: 'my-bucket',
  key: 'signed-contract.pdf',
  body: pdf_data
)
```

### void

Cancel/void a signature request.

```ruby
TurboDocx::TurboSign.void('document-uuid', reason: 'Contract terms changed')
```

### resend

Resend signature request emails.

```ruby
# Resend to all pending recipients
TurboDocx::TurboSign.resend('document-uuid')

# Resend to specific recipients
TurboDocx::TurboSign.resend('document-uuid', recipient_ids: ['recipient-uuid-1', 'recipient-uuid-2'])
```

---

## Rails Examples

### Controller

```ruby
# app/controllers/api/contracts_controller.rb
class Api::ContractsController < ApplicationController
  def send_contract
    result = TurboDocx::TurboSign.prepare_for_signing_single(
      file_link: params[:contract_url],
      recipients: [
        { name: params[:recipient_name], email: params[:recipient_email], order: 1 }
      ],
      fields: [
        { type: 'signature', page: 1, x: 100, y: 650, width: 200, height: 50, recipient_order: 1 }
      ]
    )

    render json: {
      document_id: result.document_id,
      sign_url: result.recipients.first.sign_url
    }
  rescue TurboDocx::Error => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def status
    status = TurboDocx::TurboSign.get_status(params[:id])
    render json: status
  rescue TurboDocx::NotFoundError
    render json: { error: 'Document not found' }, status: :not_found
  end

  def download
    pdf_data = TurboDocx::TurboSign.download(params[:id])
    send_data pdf_data,
              type: 'application/pdf',
              filename: 'signed-document.pdf',
              disposition: 'attachment'
  end
end
```

### Routes

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    post 'contracts/send', to: 'contracts#send_contract'
    get 'contracts/:id/status', to: 'contracts#status'
    get 'contracts/:id/download', to: 'contracts#download'
  end
end
```

### Service Object

```ruby
# app/services/contract_signing_service.rb
class ContractSigningService
  def initialize(document_url:, recipient_name:, recipient_email:)
    @document_url = document_url
    @recipient_name = recipient_name
    @recipient_email = recipient_email
  end

  def call
    TurboDocx::TurboSign.prepare_for_signing_single(
      file_link: @document_url,
      recipients: [
        { name: @recipient_name, email: @recipient_email, order: 1 }
      ],
      fields: signature_fields
    )
  end

  private

  def signature_fields
    [
      { type: 'signature', page: 1, x: 100, y: 650, width: 200, height: 50, recipient_order: 1 },
      { type: 'date', page: 1, x: 320, y: 650, width: 100, height: 30, recipient_order: 1 }
    ]
  end
end

# Usage
result = ContractSigningService.new(
  document_url: 'https://example.com/contract.pdf',
  recipient_name: 'John Doe',
  recipient_email: 'john@example.com'
).call
```

---

## Background Jobs

### Sidekiq

```ruby
# app/jobs/send_contract_for_signature_job.rb
class SendContractForSignatureJob
  include Sidekiq::Job

  def perform(contract_id, recipient_email, recipient_name)
    contract = Contract.find(contract_id)

    result = TurboDocx::TurboSign.prepare_for_signing_single(
      file_link: contract.document_url,
      document_name: contract.name,
      recipients: [
        { name: recipient_name, email: recipient_email, order: 1 }
      ],
      fields: [
        { type: 'signature', page: 1, x: 100, y: 650, width: 200, height: 50, recipient_order: 1 }
      ]
    )

    contract.update!(
      turbosign_document_id: result.document_id,
      sign_url: result.recipients.first.sign_url,
      status: 'pending_signature'
    )
  rescue TurboDocx::Error => e
    contract.update!(status: 'signature_failed', error_message: e.message)
    raise
  end
end

# Usage
SendContractForSignatureJob.perform_async(contract.id, 'john@example.com', 'John Doe')
```

### ActiveJob

```ruby
# app/jobs/check_signature_status_job.rb
class CheckSignatureStatusJob < ApplicationJob
  queue_as :default

  def perform(contract_id)
    contract = Contract.find(contract_id)
    return unless contract.turbosign_document_id.present?

    status = TurboDocx::TurboSign.get_status(contract.turbosign_document_id)

    case status.status
    when 'completed'
      contract.update!(status: 'signed', signed_at: status.completed_at)
      ContractSignedMailer.notify(contract).deliver_later
    when 'voided'
      contract.update!(status: 'voided')
    else
      # Recheck later
      CheckSignatureStatusJob.set(wait: 1.hour).perform_later(contract_id)
    end
  end
end
```

---

## Error Handling

```ruby
begin
  result = TurboDocx::TurboSign.prepare_for_signing_single(...)
rescue TurboDocx::UnauthorizedError
  puts 'Invalid API key'
rescue TurboDocx::InvalidDocumentError => e
  puts "Could not process document: #{e.message}"
rescue TurboDocx::RateLimitedError => e
  puts "Rate limited, retry after: #{e.retry_after} seconds"
rescue TurboDocx::NotFoundError
  puts 'Document not found'
rescue TurboDocx::Error => e
  puts "Error #{e.code}: #{e.message}"
end
```

---

## Field Types

```ruby
# Available field types
'signature'   # Electronic signature drawing/typing
'initials'    # Initials field
'text'        # Free-form text input
'date'        # Date stamp (auto-filled on signing)
'checkbox'    # Checkbox for agreements
'full_name'   # Signer's full name (auto-filled)
'email'       # Signer's email address (auto-filled)
'title'       # Job title field
'company'     # Company name field
```

---

## Webhook Signature Verification

Verify that webhooks are genuinely from TurboDocx:

```ruby
# app/controllers/webhooks_controller.rb
class WebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def turbodocx
    signature = request.headers['X-TurboDocx-Signature']
    timestamp = request.headers['X-TurboDocx-Timestamp']
    body = request.raw_post

    is_valid = TurboDocx::WebhookVerifier.verify(
      signature: signature,
      timestamp: timestamp,
      body: body,
      secret: ENV['TURBODOCX_WEBHOOK_SECRET']
    )

    unless is_valid
      return render json: { error: 'Invalid signature' }, status: :unauthorized
    end

    event = JSON.parse(body)

    case event['event']
    when 'signature.document.completed'
      handle_document_completed(event['data'])
    when 'signature.document.voided'
      handle_document_voided(event['data'])
    end

    render json: { received: true }
  end

  private

  def handle_document_completed(data)
    contract = Contract.find_by(turbosign_document_id: data['document_id'])
    return unless contract

    contract.update!(status: 'signed', signed_at: Time.parse(data['completed_at']))
    DownloadSignedDocumentJob.perform_later(contract.id)
  end

  def handle_document_voided(data)
    contract = Contract.find_by(turbosign_document_id: data['document_id'])
    return unless contract

    contract.update!(status: 'voided', void_reason: data['void_reason'])
  end
end
```

### Routes

```ruby
# config/routes.rb
Rails.application.routes.draw do
  post 'webhooks/turbodocx', to: 'webhooks#turbodocx'
end
```

---

## Resources

- [GitHub Repository](https://github.com/TurboDocx/SDK/tree/main/packages/ruby-sdk)
- [RubyGems Package](https://rubygems.org/gems/turbodocx-sdk)
- [API Reference](/docs/TurboSign/API-Signatures)
- [Webhook Configuration](/docs/TurboSign/Webhooks)
