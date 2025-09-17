require 'net/http'
require 'uri'
require 'json'

# Complete Workflow: Upload → Recipients → Prepare

# Step 1: Upload Document
uri = URI('https://www.turbodocx.com/turbosign/documents/upload')
boundary = "----RubyBoundary#{rand(1000000)}"

form_data = ""
form_data << "--#{boundary}\r\n"
form_data << "Content-Disposition: form-data; name=\"name\"\r\n\r\n"
form_data << "Contract Agreement\r\n"
form_data << "--#{boundary}\r\n"
form_data << "Content-Disposition: form-data; name=\"file\"; filename=\"document.pdf\"\r\n"
form_data << "Content-Type: application/pdf\r\n\r\n"
form_data << File.read('./document.pdf')
form_data << "\r\n--#{boundary}--\r\n"

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Authorization'] = 'Bearer YOUR_API_TOKEN'
request['x-rapiddocx-org-id'] = 'YOUR_ORGANIZATION_ID'
request['origin'] = 'https://www.turbodocx.com'
request['referer'] = 'https://www.turbodocx.com'
request['accept'] = 'application/json, text/plain, */*'
request['Content-Type'] = "multipart/form-data; boundary=#{boundary}"
request.body = form_data

upload_response = http.request(request)
upload_result = JSON.parse(upload_response.body)
document_id = upload_result['data']['id']

# Step 2: Add Recipients
recipient_payload = {
  "document" => {
    "name" => "Contract Agreement - Updated",
    "description" => "This document requires electronic signatures from both parties. Please review all content carefully before signing."
  },
  "recipients" => [
    {
      "name" => "John Smith",
      "email" => "john.smith@company.com",
      "signingOrder" => 1,
      "metadata" => {
        "color" => "hsl(200, 75%, 50%)",
        "lightColor" => "hsl(200, 75%, 93%)"
      },
      "documentId" => document_id
    },
    {
      "name" => "Jane Doe",
      "email" => "jane.doe@partner.com",
      "signingOrder" => 2,
      "metadata" => {
        "color" => "hsl(270, 75%, 50%)",
        "lightColor" => "hsl(270, 75%, 93%)"
      },
      "documentId" => document_id
    }
  ]
}

uri2 = URI("https://www.turbodocx.com/turbosign/documents/#{document_id}/update-with-recipients")

request2 = Net::HTTP::Post.new(uri2)
request2['Content-Type'] = 'application/json'
request2['Authorization'] = 'Bearer YOUR_API_TOKEN'
request2['x-rapiddocx-org-id'] = 'YOUR_ORGANIZATION_ID'
request2['origin'] = 'https://www.turbodocx.com'
request2['referer'] = 'https://www.turbodocx.com'
request2['accept'] = 'application/json, text/plain, */*'
request2.body = recipient_payload.to_json

recipient_response = http.request(request2)
recipient_result = JSON.parse(recipient_response.body)
recipients = recipient_result['data']['recipients']

# Step 3: Prepare for Signing
signature_fields = [
  {
    "recipientId" => recipients[0]['id'],
    "type" => "signature",
    "template" => {
      "anchor" => "{Signature1}",
      "placement" => "replace",
      "size" => { "width" => 200, "height" => 80 },
      "offset" => { "x" => 0, "y" => 0 },
      "caseSensitive" => true,
      "useRegex" => false
    },
    "defaultValue" => "",
    "required" => true
  },
  {
    "recipientId" => recipients[0]['id'],
    "type" => "date",
    "template" => {
      "anchor" => "{Date1}",
      "placement" => "replace",
      "size" => { "width" => 150, "height" => 30 },
      "offset" => { "x" => 0, "y" => 0 },
      "caseSensitive" => true,
      "useRegex" => false
    },
    "defaultValue" => "",
    "required" => true
  },
  {
    "recipientId" => recipients[1]['id'],
    "type" => "signature",
    "template" => {
      "anchor" => "{Signature2}",
      "placement" => "replace",
      "size" => { "width" => 200, "height" => 80 },
      "offset" => { "x" => 0, "y" => 0 },
      "caseSensitive" => true,
      "useRegex" => false
    },
    "defaultValue" => "",
    "required" => true
  },
  {
    "recipientId" => recipients[1]['id'],
    "type" => "text",
    "template" => {
      "anchor" => "{Title2}",
      "placement" => "replace",
      "size" => { "width" => 200, "height" => 30 },
      "offset" => { "x" => 0, "y" => 0 },
      "caseSensitive" => true,
      "useRegex" => false
    },
    "defaultValue" => "Business Partner",
    "required" => false
  }
]

uri3 = URI("https://www.turbodocx.com/turbosign/documents/#{document_id}/prepare-for-signing")

request3 = Net::HTTP::Post.new(uri3)
request3['Content-Type'] = 'application/json'
request3['Authorization'] = 'Bearer YOUR_API_TOKEN'
request3['x-rapiddocx-org-id'] = 'YOUR_ORGANIZATION_ID'
request3['origin'] = 'https://www.turbodocx.com'
request3['referer'] = 'https://www.turbodocx.com'
request3['accept'] = 'application/json, text/plain, */*'
request3.body = signature_fields.to_json

prepare_response = http.request(request3)
puts prepare_response.body