require 'net/http'
require 'uri'
require 'json'

# Configuration
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

def generate_ai_variable
  uri = URI("#{BASE_URL}/ai/generate/variable/one")

  payload = {
    'name' => 'Company Performance Summary',
    'placeholder' => '{Q4Performance}',
    'templateId' => 'template-abc123',
    'aiHint' => 'Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements',
    'richTextEnabled' => true
  }

  # Create HTTP connection
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  # Create request
  request = Net::HTTP::Post.new(uri)
  request['Authorization'] = "Bearer #{API_TOKEN}"
  request['x-rapiddocx-org-id'] = ORG_ID
  request['Content-Type'] = 'application/json'
  request.body = payload.to_json

  # Send request
  response = http.request(request)

  unless response.code == '200'
    raise "AI generation failed: #{response.code}"
  end

  result = JSON.parse(response.body)
  puts "Generated variable: #{result['data']}"
  result
end

# Run the example
begin
  generate_ai_variable
rescue => e
  puts "Error: #{e.message}"
end