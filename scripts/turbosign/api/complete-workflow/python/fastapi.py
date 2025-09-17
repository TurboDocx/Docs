import requests

# Complete Workflow: Upload → Recipients → Prepare

# Step 1: Upload Document
files = {
    'name': (None, 'Contract Agreement'),
    'file': ('document.pdf', open('document.pdf', 'rb'), 'application/pdf')
}

upload_response = requests.post(
    'https://www.turbodocx.com/turbosign/documents/upload',
    headers={
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
        'origin': 'https://www.turbodocx.com',
        'referer': 'https://www.turbodocx.com',
        'accept': 'application/json, text/plain, */*'
    },
    files=files
)

upload_result = upload_response.json()
document_id = upload_result['data']['id']

# Step 2: Add Recipients
recipient_payload = {
    "document": {
        "name": "Contract Agreement - Updated",
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

recipient_response = requests.post(
    f'https://www.turbodocx.com/turbosign/documents/{document_id}/update-with-recipients',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
        'origin': 'https://www.turbodocx.com',
        'referer': 'https://www.turbodocx.com',
        'accept': 'application/json, text/plain, */*'
    },
    json=recipient_payload
)

recipient_result = recipient_response.json()
recipients = recipient_result['data']['recipients']

# Step 3: Prepare for Signing
signature_fields = [
    {
        "recipientId": recipients[0]['id'],
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
        "recipientId": recipients[0]['id'],
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
        "recipientId": recipients[1]['id'],
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
        "recipientId": recipients[1]['id'],
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

prepare_response = requests.post(
    f'https://www.turbodocx.com/turbosign/documents/{document_id}/prepare-for-signing',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
        'origin': 'https://www.turbodocx.com',
        'referer': 'https://www.turbodocx.com',
        'accept': 'application/json, text/plain, */*'
    },
    json=signature_fields
)

final_result = prepare_response.json()
print(final_result)