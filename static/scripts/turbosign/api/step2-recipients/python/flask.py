import requests
import json

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://www.turbodocx.com/turbosign"
DOCUMENT_NAME = "Contract Agreement"

# Step 2: Add Recipients
document_id = "4a20eca5-7944-430c-97d5-fcce4be24296"

url = f"{BASE_URL}/documents/{document_id}/update-with-recipients"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_TOKEN}",
    "x-rapiddocx-org-id": ORG_ID,
    "User-Agent": "TurboDocx API Client"
}

payload = {
    "document": {
        "name": f"{DOCUMENT_NAME} - Updated",
        "description": "This document requires electronic signatures from both parties. Please review all content carefully before signing."
    },
    "recipients": [
        {
            "name": "John Smith",
            "email": "john.smith@company.com",
            "signingOrder": 1,
            "metadata": {
                "color": "hsl(200, 75%, 50%)",
                "lightColor": "hsl(200, 75%, 93%)"
            },
            "documentId": document_id
        },
        {
            "name": "Jane Doe",
            "email": "jane.doe@partner.com",
            "signingOrder": 2,
            "metadata": {
                "color": "hsl(270, 75%, 50%)",
                "lightColor": "hsl(270, 75%, 93%)"
            },
            "documentId": document_id
        }
    ]
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()
print(result)