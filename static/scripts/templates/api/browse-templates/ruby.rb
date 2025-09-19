require 'net/http'
require 'uri'
require 'json'
require 'cgi'

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

##
# Path B: Browse and Select Existing Templates
##

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

  # Parse JSON response
  result = JSON.parse(response.body)
  data = result['data']

  puts "Found #{data['totalRecords']} templates/folders"

  data
rescue JSON::ParserError => e
  raise "Failed to parse JSON response: #{e.message}"
rescue => e
  puts "Browse failed: #{e.message}"
  raise
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

  result = JSON.parse(response.body)
  template = result['data']['results']

  puts "Template: #{template['name']}"

  variable_count = template['variables'] ? template['variables'].length : 0
  puts "Variables: #{variable_count}"

  default_font = template['defaultFont'] || 'N/A'
  puts "Default font: #{default_font}"

  template
rescue JSON::ParserError => e
  raise "Failed to parse JSON response: #{e.message}"
rescue => e
  puts "Failed to get template details: #{e.message}"
  raise
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

  result = JSON.parse(response.body)
  pdf_url = result['results']

  puts "PDF Preview: #{pdf_url}"

  pdf_url
rescue JSON::ParserError => e
  raise "Failed to parse JSON response: #{e.message}"
rescue => e
  puts "Failed to get PDF preview: #{e.message}"
  raise
end

# Example usage - Complete browsing workflow
begin
  puts "=== Path B: Browse and Select Template ==="

  # Step 1: Browse all templates
  puts "\n1. Browsing templates..."
  browse_result = browse_templates(10, 0, 'contract', true)

  # Find a template (not a folder)
  selected_template = browse_result['results'].find { |item| item['type'] == 'template' }

  if selected_template.nil?
    puts "No templates found in browse results"
    exit 1
  end

  puts "\nSelected template: #{selected_template['name']} (#{selected_template['id']})"

  # Step 2: Get detailed template information
  puts "\n2. Getting template details..."
  template_details = get_template_details(selected_template['id'])

  # Step 3: Get PDF preview (optional)
  puts "\n3. Getting PDF preview..."
  pdf_preview = get_template_pdf_preview(selected_template['id'])

  puts "\n=== Template Ready for Generation ==="
  puts "Template ID: #{template_details['id']}"

  variable_count = template_details['variables'] ? template_details['variables'].length : 0
  puts "Variables available: #{variable_count}"
  puts "PDF Preview: #{pdf_preview}"

rescue => e
  puts "Browsing workflow failed: #{e.message}"
  exit 1
end