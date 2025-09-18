require 'net/http'
require 'uri'
require 'json'

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://www.turbodocx.com/turbosign"
DOCUMENT_NAME = "Contract Agreement"

# Step 3: Prepare for Signing
document_id = "4a20eca5-7944-430c-97d5-fcce4be24296"

signature_fields = [
  {
    "recipientId" => "5f673f37-9912-4e72-85aa-8f3649760f6b",
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
    "recipientId" => "5f673f37-9912-4e72-85aa-8f3649760f6b",
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
    "recipientId" => "a8b9c1d2-3456-7890-abcd-ef1234567890",
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
    "recipientId" => "a8b9c1d2-3456-7890-abcd-ef1234567890",
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

uri = URI("#{BASE_URL}/documents/#{document_id}/prepare-for-signing")

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request['Authorization'] = "Bearer #{API_TOKEN}"
request['x-rapiddocx-org-id'] = ORG_ID
request['User-Agent'] = 'TurboDocx API Client'
request.body = signature_fields.to_json

response = http.request(request)
puts response.body