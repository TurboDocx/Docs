require 'net/http'
require 'uri'
require 'json'
require 'cgi'
require 'securerandom'
require 'time'
require 'mime/types'

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

##
# Complete Template Workflow Manager
# Demonstrates both upload and browse/select paths
##

class TemplateWorkflowManager
  def initialize
    puts "=== TurboDocx Template Generation Workflow Manager ==="
  end

  def demonstrate_complete_workflow
    puts "\nSelect workflow path:"
    puts "A) Upload new template"
    puts "B) Browse and select existing template"

    # For this example, we'll demonstrate both paths
    puts "\n=== Demonstrating Path A: Upload Template ==="
    template_id_a = demonstrate_upload_workflow

    puts "\n=== Demonstrating Path B: Browse Templates ==="
    template_id_b = demonstrate_browse_workflow

    # Generate deliverables for both templates if successful
    if template_id_a
      puts "\n=== Generating Deliverable from Uploaded Template ==="
      generate_and_download_deliverable(template_id_a, "A")
    end

    if template_id_b
      puts "\n=== Generating Deliverable from Selected Template ==="
      generate_and_download_deliverable(template_id_b, "B")
    end
  end

  private

  def demonstrate_upload_workflow
    begin
      puts "\n--- Path A: Upload and Create Template ---"

      # Check for template file
      template_file = "./contract-template.docx"
      unless File.exist?(template_file)
        puts "⚠️  Template file not found: #{template_file}"
        puts "Creating a placeholder message for demonstration"
        return nil
      end

      result = upload_template(template_file)
      template = result['data']['results']['template']

      puts "✅ Upload workflow completed"
      puts "Template ID: #{template['id']}"
      puts "Ready for deliverable generation"

      template['id']
    rescue => e
      puts "❌ Upload workflow failed: #{e.message}"
      nil
    end
  end

  def demonstrate_browse_workflow
    begin
      puts "\n--- Path B: Browse and Select Template ---"

      # Browse templates
      browse_result = browse_templates(10, 0, 'contract', true)

      # Find first template (not folder)
      selected_template = browse_result['results'].find { |item| item['type'] == 'template' }

      if selected_template.nil?
        puts "⚠️  No templates found in browse results"
        return nil
      end

      puts "Selected: #{selected_template['name']}"

      # Get detailed information
      template_details = get_template_details(selected_template['id'])

      # Optionally get PDF preview
      pdf_preview = get_template_pdf_preview(selected_template['id'])

      puts "✅ Browse workflow completed"
      puts "Template ID: #{template_details['id']}"
      puts "PDF Preview: #{pdf_preview}"
      puts "Ready for deliverable generation"

      template_details['id']
    rescue => e
      puts "❌ Browse workflow failed: #{e.message}"
      nil
    end
  end

  def generate_and_download_deliverable(template_id, path_label)
    begin
      puts "\n--- Generating Deliverable (Path #{path_label}) ---"

      deliverable_data = create_deliverable_data(template_id, path_label)
      deliverable = generate_deliverable(template_id, deliverable_data)

      # Download the file
      download_result = download_deliverable(
        deliverable['id'],
        "#{deliverable['name']}_path_#{path_label}.docx"
      )

      puts "✅ Complete workflow finished successfully for Path #{path_label}"
      puts "Deliverable ID: #{deliverable['id']}"
      puts "Download info: #{download_result}"

    rescue => e
      puts "❌ Deliverable generation failed for Path #{path_label}: #{e.message}"
    end
  end

  def upload_template(template_file_path)
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
    form_data << "Employee Contract Template"

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

    JSON.parse(response.body)
  end

  def browse_templates(limit = 25, offset = 0, query = '', show_tags = true, selected_tags = nil)
    # Build query parameters
    params = {
      'limit' => limit.to_s,
      'offset' => offset.to_s,
      'showTags' => show_tags.to_s
    }

    params['query'] = query unless query.empty?

    if selected_tags
      selected_tags.each do |tag|
        params["selectedTags[]"] = tag
      end
    end

    query_string = params.map { |k, v| "#{CGI.escape(k)}=#{CGI.escape(v)}" }.join('&')
    uri = URI("#{BASE_URL}/template-item?#{query_string}")

    # Create HTTP connection
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    # Create request
    request = Net::HTTP::Get.new(uri)
    request['Authorization'] = "Bearer #{API_TOKEN}"
    request['x-rapiddocx-org-id'] = ORG_ID
    request['User-Agent'] = 'TurboDocx API Client'

    # Make request
    response = http.request(request)

    unless response.code == '200'
      raise "HTTP error #{response.code}: #{response.body}"
    end

    JSON.parse(response.body)['data']
  end

  def get_template_details(template_id)
    uri = URI("#{BASE_URL}/template/#{template_id}")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri)
    request['Authorization'] = "Bearer #{API_TOKEN}"
    request['x-rapiddocx-org-id'] = ORG_ID
    request['User-Agent'] = 'TurboDocx API Client'

    response = http.request(request)

    unless response.code == '200'
      raise "HTTP error #{response.code}: #{response.body}"
    end

    JSON.parse(response.body)['data']['results']
  end

  def get_template_pdf_preview(template_id)
    uri = URI("#{BASE_URL}/template/#{template_id}/previewpdflink")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri)
    request['Authorization'] = "Bearer #{API_TOKEN}"
    request['x-rapiddocx-org-id'] = ORG_ID
    request['User-Agent'] = 'TurboDocx API Client'

    response = http.request(request)

    unless response.code == '200'
      raise "HTTP error #{response.code}: #{response.body}"
    end

    JSON.parse(response.body)['results']
  end

  def generate_deliverable(template_id, deliverable_data)
    uri = URI("#{BASE_URL}/deliverable")

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
  end

  def download_deliverable(deliverable_id, filename)
    puts "Downloading file: #{filename}"

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
  end

  def create_deliverable_data(template_id, path_label)
    now = Time.now.utc.strftime('%Y-%m-%dT%H:%M:%S.%3NZ')

    {
      'templateId' => template_id,
      'name' => "Contract Document - Path #{path_label}",
      'description' => "Employment contract generated via workflow path #{path_label}",
      'variables' => create_complex_variables,
      'tags' => ['hr', 'contract', 'employee', 'engineering'],
      'fonts' => '[{"name":"Arial","usage":269}]',
      'defaultFont' => 'Arial',
      'replaceFonts' => true,
      'metadata' => {
        'sessions' => [
          {
            'id' => SecureRandom.uuid,
            'starttime' => now,
            'endtime' => now
          }
        ],
        'createdBy' => 'Ruby Workflow Manager',
        'documentType' => 'Employment Contract',
        'version' => 'v1.0',
        'workflowPath' => path_label
      }
    }
  end

  def create_complex_variables
    [
      {
        'mimeType' => 'text',
        'name' => 'Employee Name',
        'placeholder' => '{EmployeeName}',
        'text' => 'John Smith',
        'allowRichTextInjection' => 0,
        'autogenerated' => false,
        'count' => 1,
        'order' => 1,
        'subvariables' => [
          {
            'placeholder' => '{EmployeeName.Title}',
            'text' => 'Senior Software Engineer'
          },
          {
            'placeholder' => '{EmployeeName.StartDate}',
            'text' => 'January 15, 2024'
          }
        ],
        'metadata' => {
          'department' => 'Engineering',
          'level' => 'Senior'
        },
        'aiPrompt' => 'Generate a professional job description for a senior software engineer role'
      },
      {
        'mimeType' => 'text',
        'name' => 'Company Information',
        'placeholder' => '{CompanyInfo}',
        'text' => 'TechCorp Solutions Inc.',
        'allowRichTextInjection' => 1,
        'autogenerated' => false,
        'count' => 1,
        'order' => 2,
        'subvariables' => [
          {
            'placeholder' => '{CompanyInfo.Address}',
            'text' => '123 Innovation Drive, Tech City, TC 12345'
          },
          {
            'placeholder' => '{CompanyInfo.Phone}',
            'text' => '(555) 123-4567'
          }
        ],
        'metadata' => {},
        'aiPrompt' => ''
      }
    ]
  end
end

# Example usage
begin
  workflow_manager = TemplateWorkflowManager.new
  workflow_manager.demonstrate_complete_workflow

  puts "\n=== Workflow Demonstration Complete ==="
  puts "Both upload and browse/select paths have been demonstrated."
  puts "Choose the appropriate path for your use case:"
  puts "- Upload path: When you have new templates to create"
  puts "- Browse path: When you want to use existing templates"

rescue => e
  puts "Workflow demonstration failed: #{e.message}"
  exit 1
end