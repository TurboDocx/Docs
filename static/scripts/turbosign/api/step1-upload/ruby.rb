require 'net/http'
require 'uri'

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

response = http.request(request)
puts response.body