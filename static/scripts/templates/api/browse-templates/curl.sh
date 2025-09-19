#!/bin/bash

# Configuration - Update these values
API_TOKEN="YOUR_API_TOKEN"
ORG_ID="YOUR_ORGANIZATION_ID"
BASE_URL="https://api.turbodocx.com"

# Path B: Browse and Select Existing Templates

echo "=== Path B: Browse and Select Template ==="

# Step 1: Browse Templates and Folders
echo -e "\n1. Browsing templates..."

BROWSE_RESPONSE=$(curl -s -X GET "$BASE_URL/template-item?limit=10&offset=0&query=contract&showTags=true" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client")

echo "Browse Results:"
echo "$BROWSE_RESPONSE" | jq '.'

# Extract first template ID from response
TEMPLATE_ID=$(echo "$BROWSE_RESPONSE" | jq -r '.data.results[] | select(.type == "template") | .id' | head -1)

if [ "$TEMPLATE_ID" = "null" ] || [ -z "$TEMPLATE_ID" ]; then
  echo "No templates found in browse results"
  exit 1
fi

echo -e "\nSelected template ID: $TEMPLATE_ID"

# Step 2: Get Template Details
echo -e "\n2. Getting template details..."

TEMPLATE_DETAILS=$(curl -s -X GET "$BASE_URL/template/$TEMPLATE_ID" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client")

echo "Template Details:"
echo "$TEMPLATE_DETAILS" | jq '.'

# Extract template info
TEMPLATE_NAME=$(echo "$TEMPLATE_DETAILS" | jq -r '.data.results.name')
VARIABLE_COUNT=$(echo "$TEMPLATE_DETAILS" | jq '.data.results.variables | length')

echo -e "\nTemplate: $TEMPLATE_NAME"
echo "Variables: $VARIABLE_COUNT"

# Step 3: Get PDF Preview (Optional)
echo -e "\n3. Getting PDF preview..."

PDF_PREVIEW=$(curl -s -X GET "$BASE_URL/template/$TEMPLATE_ID/previewpdflink" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client")

echo "PDF Preview Response:"
echo "$PDF_PREVIEW" | jq '.'

PDF_URL=$(echo "$PDF_PREVIEW" | jq -r '.results')
echo -e "\nPDF Preview URL: $PDF_URL"

echo -e "\n=== Template Ready for Generation ==="
echo "Template ID: $TEMPLATE_ID"
echo "Template Name: $TEMPLATE_NAME"
echo "Variables available: $VARIABLE_COUNT"
echo "PDF Preview: $PDF_URL"

# Optional: Browse a specific folder
echo -e "\n--- Optional: Browse Folder Contents ---"
echo "To browse a specific folder, use:"
echo "curl -X GET \"$BASE_URL/template-item/FOLDER_ID?limit=25&offset=0\" \\"
echo "  -H \"Authorization: Bearer $API_TOKEN\" \\"
echo "  -H \"x-rapiddocx-org-id: $ORG_ID\" \\"
echo "  -H \"User-Agent: TurboDocx API Client\""

# Optional: Search with filters
echo -e "\n--- Optional: Advanced Search ---"
echo "Search with tags:"
echo "curl -X GET \"$BASE_URL/template-item?query=contract&selectedTags[]=hr&selectedTags[]=template\" \\"
echo "  -H \"Authorization: Bearer $API_TOKEN\" \\"
echo "  -H \"x-rapiddocx-org-id: $ORG_ID\" \\"
echo "  -H \"User-Agent: TurboDocx API Client\""