import requests

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://www.turbodocx.com/turbosign"
DOCUMENT_NAME = "Contract Agreement"

# Step 1: Upload Document
files = {
    'name': (None, DOCUMENT_NAME),
    'file': ('document.pdf', open('document.pdf', 'rb'), 'application/pdf')
}

response = requests.post(
    f'{BASE_URL}/documents/upload',
    headers={
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    },
    files=files
)

result = response.json()
print(result)