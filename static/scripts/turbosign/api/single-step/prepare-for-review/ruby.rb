require 'net/http'
require 'uri'
require 'json'
require 'mime/types'

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

def prepare_document_for_review
  # Prepare recipients
  recipients = [
    {
      name: "John Smith",
      email: "john.smith@company.com",
      signingOrder: 1},
    {
      name: "Jane Doe",
      email: "jane.doe@partner.com",
      signingOrder: 2}
  ]

  # Prepare fields - Coordinate-based
  fields = [
    {
      recipientEmail: "john.smith@company.com",
      type: "signature",
      page: 1,
      x: 100,
      y: 200,
      width: 200,
      height: 80,
      required: true
    },
    {
      recipientEmail: "john.smith@company.com",
      type: "date",
      page: 1,
      x: 100,
      y: 300,
      width: 150,
      height: 30,
      required: true
    },
    {
      recipientEmail: "jane.doe@partner.com",
      type: "signature",
      page: 1,
      x: 350,
      y: 200,
      width: 200,
      height: 80,
      required: true
    }
  ]

  # Create multipart form data
  uri = URI.parse("#{BASE_URL}/turbosign/single/prepare-for-review")

  boundary = "----WebKitFormBoundary#{rand(1000000000)}"

  post_body = []

  # Add file
  file_path = "./contract.pdf"
  file_content = File.read(file_path)
  post_body << "--#{boundary}\r\n"
  post_body << "Content-Disposition: form-data; name=\"file\"; filename=\"contract.pdf\"\r\n"
  post_body << "Content-Type: application/pdf\r\n\r\n"
  post_body << file_content
  post_body << "\r\n"

  # Add form fields
  form_fields = {
    'documentName' => 'Contract Agreement',
    'documentDescription' => 'Please review and sign this contract',
    'senderName' => 'Your Company',
    'senderEmail' => 'sender@company.com',
    'recipients' => recipients.to_json,
    'fields' => fields.to_json
  }

  form_fields.each do |key, value|
    post_body << "--#{boundary}\r\n"
    post_body << "Content-Disposition: form-data; name=\"#{key}\"\r\n\r\n"
    post_body << value.to_s
    post_body << "\r\n"
  end

  post_body << "--#{boundary}--\r\n"

  # Create HTTP request
  request = Net::HTTP::Post.new(uri.request_uri)
  request["Authorization"] = "Bearer #{API_TOKEN}"
  request["x-rapiddocx-org-id"] = ORG_ID
  request["User-Agent"] = "TurboDocx API Client"
  request["Content-Type"] = "multipart/form-data; boundary=#{boundary}"
  request.body = post_body.join

  # Send request
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  response = http.request(request)
  result = JSON.parse(response.body)

  if result['success']
    puts "✅ Document prepared for review"
    puts "Document ID: #{result['documentId']}"
    puts "Status: #{result['status']}"
    puts "Preview URL: #{result['previewUrl']}"
    puts "\n📋 Recipients:"
    result['recipients'].each do |recipient|
      puts "  - #{recipient['name']} (#{recipient['email']}) - ID: #{recipient['id']}"
    end
    puts "\n🔍 Open this URL to preview the document:"
    puts result['previewUrl']
  else
    puts "❌ Error: #{result['error'] || result['message']}"
    puts "Error Code: #{result['code']}" if result['code']
    exit 1
  end
rescue => e
  puts "❌ Exception: #{e.message}"
  puts e.backtrace
  exit 1
end

# Run the function
prepare_document_for_review
