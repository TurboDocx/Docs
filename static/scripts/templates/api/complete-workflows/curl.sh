#!/bin/bash

# Configuration - Update these values
API_TOKEN="YOUR_API_TOKEN"
ORG_ID="YOUR_ORGANIZATION_ID"
BASE_URL="https://api.turbodocx.com"

# Complete Workflow: Upload → Generate → Download
# Simple 3-step process for document generation

echo "🚀 Starting complete workflow..."

# Step 1: Upload template file
echo
echo "📤 Step 1: Uploading template..."

TEMPLATE_FILE="./template.docx"

if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ Template file not found: $TEMPLATE_FILE"
    echo "Please provide a valid template file path"
    exit 1
fi

# Upload template
UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/template/upload-and-create" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client" \
  -F "templateFile=@$TEMPLATE_FILE" \
  -F "name=Simple Template" \
  -F "description=Template uploaded for document generation")

# Check if upload was successful
if [ $? -ne 0 ]; then
    echo "❌ Upload failed"
    exit 1
fi

# Extract template ID
TEMPLATE_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.results.template.id')
TEMPLATE_NAME=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.results.template.name')

if [ "$TEMPLATE_ID" == "null" ] || [ -z "$TEMPLATE_ID" ]; then
    echo "❌ Failed to extract template ID from response"
    exit 1
fi

echo "✅ Template uploaded: $TEMPLATE_NAME ($TEMPLATE_ID)"

# Step 2: Generate deliverable with simple variables
echo
echo "📝 Step 2: Generating document..."

DELIVERABLE_RESPONSE=$(curl -s -X POST "$BASE_URL/deliverable" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "'$TEMPLATE_ID'",
    "name": "Generated Document",
    "description": "Simple document example",
    "variables": [
      {
        "mimeType": "text",
        "name": "Company Name",
        "placeholder": "{CompanyName}",
        "text": "Acme Corporation"
      },
      {
        "mimeType": "text",
        "name": "Employee Name",
        "placeholder": "{EmployeeName}",
        "text": "John Smith"
      },
      {
        "mimeType": "text",
        "name": "Date",
        "placeholder": "{Date}",
        "text": "January 15, 2024"
      }
    ]
  }')

# Extract deliverable ID
DELIVERABLE_ID=$(echo "$DELIVERABLE_RESPONSE" | jq -r '.data.results.deliverable.id')
DELIVERABLE_NAME=$(echo "$DELIVERABLE_RESPONSE" | jq -r '.data.results.deliverable.name')

if [ "$DELIVERABLE_ID" == "null" ] || [ -z "$DELIVERABLE_ID" ]; then
    echo "❌ Failed to generate document"
    echo "Response: $DELIVERABLE_RESPONSE"
    exit 1
fi

echo "✅ Document generated: $DELIVERABLE_NAME ($DELIVERABLE_ID)"

# Step 3: Download generated file
echo
echo "📥 Step 3: Downloading file..."

DOWNLOAD_FILE="${DELIVERABLE_NAME}.docx"

curl -s -X GET "$BASE_URL/deliverable/file/$DELIVERABLE_ID" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client" \
  --output "$DOWNLOAD_FILE" \
  --write-out "Downloaded: %{filename_effective} (%{size_download} bytes)\n"

if [ $? -eq 0 ]; then
    echo "✅ File ready for download: $DOWNLOAD_FILE"
else
    echo "❌ Download failed"
    exit 1
fi

echo
echo "✅ Workflow complete!"
echo "Template: $TEMPLATE_ID"
echo "Document: $DELIVERABLE_ID"
echo "File: $DOWNLOAD_FILE"