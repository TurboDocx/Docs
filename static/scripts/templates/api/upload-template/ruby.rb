require 'net/http'
require 'uri'
require 'json'
require 'mime/types'

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
TEMPLATE_NAME = "Employee Contract Template"

##
# Path A: Upload and Create Template
# Uploads a .docx/.pptx template and extracts variables automatically
##

def upload_template(template_file_path)
  # Check if file exists
  unless File.exist?(template_file_path)
    raise "Template file not found: #{template_file_path}"
  end

  uri = URI("#{BASE_URL}/template/upload-and-create")
  boundary = "----RubyBoundary#{rand(1000000)}"

  # Build multipart form data
  form_data = ""

  # Template file field
  form_data << "--#{boundary}\r\n"
  form_data << "Content-Disposition: form-data; name=\"templateFile\"; filename=\"#{File.basename(template_file_path)}\"\r\n"
  form_data << "Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n"
  form_data << File.read(template_file_path)

  # Name field
  form_data << "\r\n--#{boundary}\r\n"
  form_data << "Content-Disposition: form-data; name=\"name\"\r\n\r\n"
  form_data << TEMPLATE_NAME

  # Description field
  form_data << "\r\n--#{boundary}\r\n"
  form_data << "Content-Disposition: form-data; name=\"description\"\r\n\r\n"
  form_data << "Standard employee contract with variable placeholders"

  # Variables field
  form_data << "\r\n--#{boundary}\r\n"
  form_data << "Content-Disposition: form-data; name=\"variables\"\r\n\r\n"
  form_data << "[]"

  # Tags field
  form_data << "\r\n--#{boundary}\r\n"
  form_data << "Content-Disposition: form-data; name=\"tags\"\r\n\r\n"
  form_data << '["hr", "contract", "template"]'

  form_data << "\r\n--#{boundary}--\r\n"

  # Create HTTP connection
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  # Create request
  request = Net::HTTP::Post.new(uri)
  request['Authorization'] = "Bearer #{API_TOKEN}"
  request['x-rapiddocx-org-id'] = ORG_ID
  request['User-Agent'] = 'TurboDocx API Client'
  request['Content-Type'] = "multipart/form-data; boundary=#{boundary}"
  request.body = form_data

  # Make request
  response = http.request(request)

  unless response.code == '200'
    raise "HTTP error #{response.code}: #{response.body}"
  end

  # Parse JSON response
  result = JSON.parse(response.body)
  template = result['data']['results']['template']

  puts "Template uploaded successfully: #{template['id']}"
  puts "Template name: #{template['name']}"

  # Handle nullable variables field
  variable_count = template['variables'] ? template['variables'].length : 0
  puts "Variables extracted: #{variable_count}"

  puts "Default font: #{template['defaultFont']}"

  # Handle nullable fonts field
  font_count = template['fonts'] ? template['fonts'].length : 0
  puts "Fonts used: #{font_count}"

  puts "Redirect to: #{result['data']['results']['redirectUrl']}"
  puts "Ready to generate documents with template: #{template['id']}"

  result
rescue JSON::ParserError => e
  raise "Failed to parse JSON response: #{e.message}"
rescue => e
  puts "Upload failed: #{e.message}"
  raise
end

# Example usage
begin
  template_file = "./contract-template.docx"
  result = upload_template(template_file)
rescue => e
  puts "Error: #{e.message}"
  exit 1
end