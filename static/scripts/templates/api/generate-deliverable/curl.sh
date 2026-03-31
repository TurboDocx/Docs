#!/bin/bash

# Configuration - Update these values
API_TOKEN="YOUR_API_TOKEN"
ORG_ID="YOUR_ORGANIZATION_ID"
BASE_URL="https://api.turbodocx.com"

# Final Step: Generate Deliverable (Both Paths Converge Here)

echo "=== Final Step: Generate Deliverable ==="

# Template ID - This would come from either Path A (upload) or Path B (browse/select)
TEMPLATE_ID="0b1099cf-d7b9-41a4-822b-51b68fd4885a"

echo "Template ID: $TEMPLATE_ID"
echo "Generating deliverable with simple variable structure..."

# Generate deliverable with simple variable payload
curl -X POST "$BASE_URL/deliverable" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "x-rapiddocx-org-id: $ORG_ID" \
  -H "User-Agent: TurboDocx API Client" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "'$TEMPLATE_ID'",
    "name": "Contract - John Smith",
    "description": "Simple contract example",
    "variables": [
      {
        "name": "Company Name",
        "placeholder": "{CompanyName}",
        "text": "Acme Corporation"
      },
      {
        "name": "Employee Name",
        "placeholder": "{EmployeeName}",
        "text": "John Smith"
      },
      {
        "name": "Date",
        "placeholder": "{Date}",
        "text": "January 15, 2024"
      }
    ]
  }' | jq '.'

echo -e "\n=== Deliverable Generation Complete ==="

# Extract deliverable ID for download
DELIVERABLE_ID=$(echo "$GENERATE_RESPONSE" | jq -r '.data.results.deliverable.id')
DELIVERABLE_NAME=$(echo "$GENERATE_RESPONSE" | jq -r '.data.results.deliverable.name')

if [ "$DELIVERABLE_ID" != "null" ] && [ -n "$DELIVERABLE_ID" ]; then
    echo "\n=== Download Generated File ==="
    echo "Downloading deliverable: $DELIVERABLE_NAME"

    curl -X GET "$BASE_URL/deliverable/file/$DELIVERABLE_ID" \
      -H "Authorization: Bearer $API_TOKEN" \
      -H "x-rapiddocx-org-id: $ORG_ID" \
      -H "User-Agent: TurboDocx API Client" \
      --output "$DELIVERABLE_NAME.docx" \
      --write-out "Downloaded: %{filename_effective} (%{size_download} bytes)\n"
else
    echo "❌ Could not extract deliverable ID from response"
fi

