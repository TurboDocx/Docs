import requests
import json

# Step 3: Prepare for Signing
document_id = "4a20eca5-7944-430c-97d5-fcce4be24296"

url = f"https://www.turbodocx.com/turbosign/documents/{document_id}/prepare-for-signing"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN",
    "x-rapiddocx-org-id": "YOUR_ORGANIZATION_ID",
    "origin": "https://www.turbodocx.com",
    "referer": "https://www.turbodocx.com",
    "accept": "application/json, text/plain, */*",
    "dnt": "1",
    "accept-language": "en-US,en;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "x-device-fingerprint": "280624a233f1fd39ce050a9e9d0a4cc9"
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