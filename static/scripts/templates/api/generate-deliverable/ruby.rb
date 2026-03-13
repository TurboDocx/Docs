require 'net/http'
require 'uri'
require 'json'

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

##
# Final Step: Generate Deliverable (Both Paths Converge Here)
##

def generate_deliverable(template_id, deliverable_data)
  uri = URI("#{BASE_URL}/v1/deliverable")

  puts "Generating deliverable..."
  puts "Template ID: #{template_id}"
  puts "Deliverable Name: #{deliverable_data['name']}"
  puts "Variables: #{deliverable_data['variables'].length}"

  # Create HTTP connection
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  # Create request
  request = Net::HTTP::Post.new(uri)
  request['Authorization'] = "Bearer #{API_TOKEN}"
  request['x-rapiddocx-org-id'] = ORG_ID
  request['User-Agent'] = 'TurboDocx API Client'
  request['Content-Type'] = 'application/json'

  # Set request body
  request.body = deliverable_data.to_json

  # Make request
  response = http.request(request)

  unless response.code == '200'
    raise "HTTP error #{response.code}: #{response.body}"
  end

  # Parse JSON response
  result = JSON.parse(response.body)
  deliverable = result['data']['results']['deliverable']

  puts "✅ Deliverable generated successfully!"
  puts "Deliverable ID: #{deliverable['id']}"
  puts "Created by: #{deliverable['createdBy']}"
  puts "Created on: #{deliverable['createdOn']}"
  puts "Template ID: #{deliverable['templateId']}"

  deliverable
rescue JSON::ParserError => e
  raise "Failed to parse JSON response: #{e.message}"
rescue => e
  puts "Deliverable generation failed: #{e.message}"
  raise
end

def download_deliverable(deliverable_id, filename)
  puts "Downloading file: #{filename}"

  uri = URI("#{BASE_URL}/v1/deliverable/file/#{deliverable_id}")

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Get.new(uri)
  request['Authorization'] = "Bearer #{API_TOKEN}"
  request['x-rapiddocx-org-id'] = ORG_ID
  request['User-Agent'] = 'TurboDocx API Client'

  response = http.request(request)

  unless response.code == '200'
    raise "Download failed: #{response.code}"
  end

  puts "✅ File ready for download: #{filename}"

  content_type = response['Content-Type'] || 'N/A'
  content_length = response['Content-Length'] || 'N/A'

  puts "📁 Content-Type: #{content_type}"
  puts "📊 Content-Length: #{content_length} bytes"

  # In a real application, you would save the file
  # File.write(filename, response.body)

  {
    'filename' => filename,
    'content_type' => content_type,
    'content_length' => content_length
  }
rescue => e
  puts "Download failed: #{e.message}"
  raise
end

# Example usage
begin
  puts "=== Final Step: Generate Deliverable ==="

  # This would come from either Path A (upload) or Path B (browse/select)
  template_id = "0b1099cf-d7b9-41a4-822b-51b68fd4885a"

  deliverable_data = {
    'templateId' => template_id,
    'name' => 'Employee Contract - John Smith',
    'description' => 'Employment contract for new senior developer',
    'variables' => [
      { 'placeholder' => '{EmployeeName}', 'text' => 'John Smith', 'mimeType' => 'text' },
      { 'placeholder' => '{CompanyName}', 'text' => 'TechCorp Solutions Inc.', 'mimeType' => 'text' },
      { 'placeholder' => '{JobTitle}', 'text' => 'Senior Software Engineer', 'mimeType' => 'text' },
      {
        'mimeType' => 'html',
        'placeholder' => '{ContactBlock}',
        'text' => '<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>',
        'subvariables' => [
          { 'placeholder' => '{contactName}', 'text' => 'Jane Doe', 'mimeType' => 'text' },
          { 'placeholder' => '{contactPhone}', 'text' => '(555) 123-4567', 'mimeType' => 'text' }
        ]
      }
    ],
    'tags' => ['hr', 'contract', 'employee']
  }

  deliverable = generate_deliverable(template_id, deliverable_data)

  # Download the generated file
  puts "\n=== Download Generated File ==="
  download_deliverable(deliverable['id'], "#{deliverable['name']}.docx")

rescue => e
  puts "Deliverable generation failed: #{e.message}"
  exit 1
end
