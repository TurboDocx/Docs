import requests
import json

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

# Step 3: Prepare for Signing
document_id = "4a20eca5-7944-430c-97d5-fcce4be24296"

url = f"{BASE_URL}/documents/{document_id}/prepare-for-signing"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_TOKEN}",
    "x-rapiddocx-org-id": ORG_ID,
    "User-Agent": "TurboDocx API Client"
}

signature_fields = [
    {
        "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
        "type": "signature",
        "template": {
            "anchor": "{Signature1}",
            "placement": "replace",
            "size": {"width": 200, "height": 80},
            "offset": {"x": 0, "y": 0},
            "caseSensitive": True,
            "useRegex": False
        },
        "defaultValue": "",
        "required": True
    },
    {
        "recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
        "type": "date",
        "template": {
            "anchor": "{Date1}",
            "placement": "replace",
            "size": {"width": 150, "height": 30},
            "offset": {"x": 0, "y": 0},
            "caseSensitive": True,
            "useRegex": False
        },
        "defaultValue": "",
        "required": True
    },
    {
        "recipientId": "a8b9c1d2-3456-7890-abcd-ef1234567890",
        "type": "signature",
        "template": {
            "anchor": "{Signature2}",
            "placement": "replace",
            "size": {"width": 200, "height": 80},
            "offset": {"x": 0, "y": 0},
            "caseSensitive": True,
            "useRegex": False
        },
        "defaultValue": "",
        "required": True
    },
    {
        "recipientId": "a8b9c1d2-3456-7890-abcd-ef1234567890",
        "type": "text",
        "template": {
            "anchor": "{Title2}",
            "placement": "replace",
            "size": {"width": 200, "height": 30},
            "offset": {"x": 0, "y": 0},
            "caseSensitive": True,
            "useRegex": False
        },
        "defaultValue": "Business Partner",
        "required": False
    }
]

response = requests.post(url, headers=headers, json=signature_fields)
result = response.json()
print(result)