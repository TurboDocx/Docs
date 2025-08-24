require 'sinatra'
require 'openssl'
require 'json'
require 'logger'

# WebhookVerifier handles TurboDocx webhook verification
class WebhookVerifier
  def initialize(secret)
    @secret = secret
    @logger = Logger.new(STDOUT)
  end

  # Verifies the webhook signature
  # @param signature [String] X-TurboDocx-Signature header value
  # @param timestamp [String] X-TurboDocx-Timestamp header value  
  # @param body [String] Raw request body
  # @return [Boolean] true if signature is valid
  def verify_signature(signature, timestamp, body)
    return false if signature.nil? || signature.empty? || timestamp.nil? || timestamp.empty?

    # Check timestamp is within 5 minutes
    current_time = Time.now.to_i
    webhook_time = timestamp.to_i
    
    return false if (current_time - webhook_time).abs > 300

    # Generate expected signature
    signed_string = "#{timestamp}.#{body}"
    expected_signature = "sha256=#{compute_hmac(signed_string)}"

    # Timing-safe comparison
    secure_compare(signature, expected_signature)
  end

  # Process webhook event payload
  # @param payload [Hash] The webhook payload
  def process_event(payload)
    event_type = payload['event']
    @logger.info "Received event: #{event_type}"

    case event_type
    when 'signature.document.completed'
      handle_document_completed(payload['data'])
    when 'signature.document.voided'
      handle_document_voided(payload['data'])
    else
      @logger.warn "Unknown event type: #{event_type}"
    end
  end

  private

  # Computes HMAC-SHA256 for the given data
  # @param data [String] The data to sign
  # @return [String] Hex-encoded HMAC
  def compute_hmac(data)
    OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), @secret, data)
  end

  # Timing-safe string comparison
  # @param a [String] First string
  # @param b [String] Second string  
  # @return [Boolean] true if strings are equal
  def secure_compare(a, b)
    return false if a.bytesize != b.bytesize

    result = 0
    a.bytes.zip(b.bytes) { |x, y| result |= x ^ y }
    result == 0
  end

  def handle_document_completed(data)
    document_id = data['documentId'] || 'unknown'
    @logger.info "Document completed: #{document_id}"
    
    # Add your completion logic here
  end

  def handle_document_voided(data)
    document_id = data['documentId'] || 'unknown'
    @logger.info "Document voided: #{document_id}"
    
    # Add your void logic here
  end
end

# Sinatra application setup
class WebhookApp < Sinatra::Base
  def initialize
    super
    @webhook_secret = ENV['WEBHOOK_SECRET'] || 'your-webhook-secret'
    @verifier = WebhookVerifier.new(@webhook_secret)
    @logger = Logger.new(STDOUT)
  end

  # Webhook endpoint
  post '/webhook' do
    # Read raw body
    request.body.rewind
    body = request.body.read

    # Get headers
    signature = request.env['HTTP_X_TURBODOCX_SIGNATURE']
    timestamp = request.env['HTTP_X_TURBODOCX_TIMESTAMP']

    # Verify signature
    unless @verifier.verify_signature(signature, timestamp, body)
      @logger.warn 'Webhook signature verification failed'
      halt 401, 'Unauthorized'
    end

    # Parse JSON payload
    begin
      payload = JSON.parse(body)
    rescue JSON::ParserError => e
      @logger.error "Failed to parse JSON payload: #{e.message}"
      halt 400, 'Bad Request'
    end

    # Process the event
    @verifier.process_event(payload)

    # Return success
    content_type :text
    status 200
    'OK'
  end

  # Health check endpoint
  get '/health' do
    content_type :json
    { status: 'ok', timestamp: Time.now.iso8601 }.to_json
  end
end

# Example standalone usage (without Sinatra)
module WebhookProcessor
  class << self
    # Process a webhook request manually
    # @param headers [Hash] Request headers
    # @param body [String] Raw request body
    # @param secret [String] Webhook secret
    # @return [Boolean] true if processed successfully
    def process_request(headers, body, secret)
      verifier = WebhookVerifier.new(secret)
      
      signature = headers['X-TurboDocx-Signature'] || headers['HTTP_X_TURBODOCX_SIGNATURE']
      timestamp = headers['X-TurboDocx-Timestamp'] || headers['HTTP_X_TURBODOCX_TIMESTAMP']

      # Verify signature
      return false unless verifier.verify_signature(signature, timestamp, body)

      # Parse and process payload
      begin
        payload = JSON.parse(body)
        verifier.process_event(payload)
        true
      rescue JSON::ParserError => e
        puts "Failed to parse JSON payload: #{e.message}"
        false
      end
    end

    # Example method for testing
    def test_webhook_verification
      secret = 'test-secret'
      verifier = WebhookVerifier.new(secret)
      
      timestamp = Time.now.to_i.to_s
      body = '{"event":"signature.document.completed","data":{"documentId":"doc123"}}'
      
      # Generate signature for testing
      signed_string = "#{timestamp}.#{body}"
      signature = "sha256=#{OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), secret, signed_string)}"
      
      # Verify
      result = verifier.verify_signature(signature, timestamp, body)
      puts "Test verification result: #{result}"
      
      # Process event if verification passed
      if result
        payload = JSON.parse(body)
        verifier.process_event(payload)
      end
      
      result
    end
  end
end

# Run the app if this file is executed directly
if __FILE__ == $0
  WebhookApp.run! host: '0.0.0.0', port: 4567
end