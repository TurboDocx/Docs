#!/bin/bash

# Configuration - Update these values
API_TOKEN="YOUR_API_TOKEN"
ORG_ID="YOUR_ORGANIZATION_ID"
BASE_URL="https://api.turbodocx.com"
TEMPLATE_NAME="Employee Contract Template"
TEMPLATE_FILE="./contract-template.docx"

# Path A: Upload and Create Template
echo "Uploading template: $TEMPLATE_NAME"

curl -X POST "$BASE_URL/template/upload-and-create" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client" \
  -F "templateFile=@$TEMPLATE_FILE" \
  -F "name=$TEMPLATE_NAME" \
  -F "description=Standard employee contract with variable placeholders" \
  -F 'variables=[]' \
  -F 'tags=["hr", "contract", "template"]' \
  | jq '.'

echo "Template upload complete!"

# Extract template ID from response for next steps
# You can pipe the output to jq to extract specific values:
# | jq -r '.data.template.id'