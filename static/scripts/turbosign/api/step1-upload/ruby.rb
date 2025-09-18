require 'net/http'
require 'uri'

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://www.turbodocx.com/turbosign"
DOCUMENT_NAME = "Contract Agreement"

# Step 1: Upload Document
uri = URI("#{BASE_URL}/documents/upload")
boundary = "----RubyBoundary#{rand(1000000)}"

form_data = ""
form_data << "--#{boundary}\r\n"
form_data << "Content-Disposition: form-data; name=\"name\"\r\n\r\n"
form_data << "#{DOCUMENT_NAME}\r\n"
form_data << "--#{boundary}\r\n"
form_data << "Content-Disposition: form-data; name=\"file\"; filename=\"document.pdf\"\r\n"
form_data << "Content-Type: application/pdf\r\n\r\n"
form_data << File.read('./document.pdf')
form_data << "\r\n--#{boundary}--\r\n"

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Authorization'] = "Bearer #{API_TOKEN}"
request['x-rapiddocx-org-id'] = ORG_ID
request['User-Agent'] = 'TurboDocx API Client'
request['Content-Type'] = "multipart/form-data; boundary=#{boundary}"
request.body = form_data

response = http.request(request)
puts response.body