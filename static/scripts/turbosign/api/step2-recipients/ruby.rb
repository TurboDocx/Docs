require 'net/http'
require 'uri'
require 'json'

# Step 2: Add Recipients
document_id = "4a20eca5-7944-430c-97d5-fcce4be24296"

payload = {
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

uri = URI("https://www.turbodocx.com/turbosign/documents/#{document_id}/update-with-recipients")

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request['Authorization'] = 'Bearer YOUR_API_TOKEN'
request['x-rapiddocx-org-id'] = 'YOUR_ORGANIZATION_ID'
request['User-Agent'] = 'TurboDocx API Client'
request.body = payload.to_json

response = http.request(request)
puts response.body