#!/bin/bash

# Configuration
API_TOKEN="YOUR_API_TOKEN"
ORG_ID="YOUR_ORGANIZATION_ID"
BASE_URL="https://api.turbodocx.com"

# AI Variable Generation Example
echo "🤖 Generating AI Variable..."

# Generate AI variable
RESPONSE=$(curl -s -X POST "$BASE_URL/ai/generate/variable/one" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Company Performance Summary",
    "placeholder": "{Q4Performance}",
    "templateId": "template-abc123",
    "aiHint": "Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements",
    "richTextEnabled": true
  }')

# Check if generation was successful
if [ $? -ne 0 ]; then
    echo "❌ AI generation failed"
    exit 1
fi

# Extract and display result
GENERATED_TEXT=$(echo "$RESPONSE" | jq -r '.data.text')
CONTENT_TYPE=$(echo "$RESPONSE" | jq -r '.data.mimeType')

if [ "$GENERATED_TEXT" == "null" ] || [ -z "$GENERATED_TEXT" ]; then
    echo "❌ Failed to extract generated content from response"
    echo "Response: $RESPONSE"
    exit 1
fi

echo "✅ AI Variable generated successfully!"
echo "Content Type: $CONTENT_TYPE"
echo "Generated Content: $GENERATED_TEXT"