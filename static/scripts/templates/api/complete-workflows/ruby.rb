require 'net/http'
require 'uri'
require 'json'

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

##
# Complete Workflow: Upload → Generate → Download
# Simple 3-step process for document generation
##

class TemplateWorkflowManager
  def initialize
    puts "=== TurboDocx Template Generation Workflow Manager ==="
  end

  # Step 1: Upload template file
  def upload_template(template_file_path)
    unless File.exist?(template_file_path)
      raise "Template file not found: #{template_file_path}"
    end

    uri = URI("#{BASE_URL}/template/upload-and-create")
    boundary = "----RubyBoundary#{rand(1000000)}"

    # Build multipart form data
    form_data = ""

    # Template file field
    form_data << "--#{boundary}\r\n"
    form_data << "Content-Disposition: form-data; name=\"templateFile\"; filename=\"template.docx\"\r\n"
    form_data << "Content-Type: application/octet-stream\r\n\r\n"
    form_data << File.read(template_file_path)

    # Name field
    form_data << "\r\n--#{boundary}\r\n"
    form_data << "Content-Disposition: form-data; name=\"name\"\r\n\r\n"
    form_data << "Simple Template"

    # Description field
    form_data << "\r\n--#{boundary}\r\n"
    form_data << "Content-Disposition: form-data; name=\"description\"\r\n\r\n"
    form_data << "Template uploaded for document generation"

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
      raise "Upload failed: #{response.code}"
    end

    result = JSON.parse(response.body)
    template = result['data']['results']['template']

    puts "✅ Template uploaded: #{template['name']} (#{template['id']})"
    template
  end

  # Step 2: Generate deliverable with simple variables
  def generate_deliverable(template_id)
    payload = {
      'templateId' => template_id,
      'name' => 'Generated Document',
      'description' => 'Simple document example',
      'variables' => [
        {
          'mimeType' => 'text',
          'name' => 'Company Name',
          'placeholder' => '{CompanyName}',
          'text' => 'Acme Corporation'
        },
        {
          'mimeType' => 'text',
          'name' => 'Employee Name',
          'placeholder' => '{EmployeeName}',
          'text' => 'John Smith'
        },
        {
          'mimeType' => 'text',
          'name' => 'Date',
          'placeholder' => '{Date}',
          'text' => 'January 15, 2024'
        }
      ]
    }

    uri = URI("#{BASE_URL}/deliverable")

    # Create HTTP connection
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    # Create request
    request = Net::HTTP::Post.new(uri)
    request['Authorization'] = "Bearer #{API_TOKEN}"
    request['x-rapiddocx-org-id'] = ORG_ID
    request['User-Agent'] = 'TurboDocx API Client'
    request['Content-Type'] = 'application/json'
    request.body = payload.to_json

    # Make request
    response = http.request(request)

    unless response.code == '200'
      raise "Generation failed: #{response.code}"
    end

    result = JSON.parse(response.body)
    deliverable = result['data']['results']['deliverable']

    puts "✅ Document generated: #{deliverable['name']} (#{deliverable['id']})"
    deliverable
  end

  # Step 3: Download generated file
  def download_file(deliverable_id, filename)
    uri = URI("#{BASE_URL}/deliverable/file/#{deliverable_id}")

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

    # In a real application, you would save the file:
    # File.write(filename, response.body)
  end

  # Complete workflow: Upload → Generate → Download
  def complete_workflow(template_file_path)
    puts "🚀 Starting complete workflow..."

    # Step 1: Upload template
    puts "\n📤 Step 1: Uploading template..."
    template = upload_template(template_file_path)

    # Step 2: Generate deliverable
    puts "\n📝 Step 2: Generating document..."
    deliverable = generate_deliverable(template['id'])

    # Step 3: Download file
    puts "\n📥 Step 3: Downloading file..."
    filename = "#{deliverable['name']}.docx"
    download_file(deliverable['id'], filename)

    puts "\n✅ Workflow complete!"
    puts "Template: #{template['id']}"
    puts "Document: #{deliverable['id']}"
    puts "File: #{filename}"
  end
end

# Example usage
begin
  workflow_manager = TemplateWorkflowManager.new

  # Replace with your template file path
  template_path = "./template.docx"
  workflow_manager.complete_workflow(template_path)

rescue => e
  puts "❌ Workflow failed: #{e.message}"
  exit 1
end