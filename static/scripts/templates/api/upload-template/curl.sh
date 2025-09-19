#!/bin/bash

# Configuration - Update these values
API_TOKEN="YOUR_API_TOKEN"
ORG_ID="YOUR_ORGANIZATION_ID"
BASE_URL="https://api.turbodocx.com"
TEMPLATE_NAME="Employee Contract Template"
TEMPLATE_FILE="./contract-template.docx"

# Path A: Upload and Create Template
echo "Uploading template: $TEMPLATE_NAME"

UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/template/upload-and-create" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client" \
  -F "templateFile=@$TEMPLATE_FILE" \
  -F "name=$TEMPLATE_NAME" \
  -F "description=Standard employee contract with variable placeholders" \
  -F 'variables=[]' \
  -F 'tags=["hr", "contract", "template"]')

echo "Upload Response:"
echo "$UPLOAD_RESPONSE" | jq '.'

# Extract template ID and details
TEMPLATE_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.results.template.id')
TEMPLATE_NAME_RETURNED=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.results.template.name')
VARIABLE_COUNT=$(echo "$UPLOAD_RESPONSE" | jq '.data.results.template.variables | length // 0')
DEFAULT_FONT=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.results.template.defaultFont')
FONT_COUNT=$(echo "$UPLOAD_RESPONSE" | jq '.data.results.template.fonts | length // 0')
REDIRECT_URL=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.results.redirectUrl')

if [ "$TEMPLATE_ID" = "null" ] || [ -z "$TEMPLATE_ID" ]; then
    echo "❌ Failed to extract template ID from upload response"
    exit 1
fi

echo "✅ Template uploaded: $TEMPLATE_NAME_RETURNED ($TEMPLATE_ID)"
echo "📊 Variables extracted: $VARIABLE_COUNT"
echo "🔤 Default font: $DEFAULT_FONT"
echo "📝 Fonts used: $FONT_COUNT"
echo "🔗 Redirect to: $REDIRECT_URL"

echo "Template upload complete!"