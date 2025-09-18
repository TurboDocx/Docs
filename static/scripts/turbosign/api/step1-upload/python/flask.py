import requests

# Step 1: Upload Document
files = {
    'name': (None, 'Contract Agreement'),
    'file': ('document.pdf', open('document.pdf', 'rb'), 'application/pdf')
}

response = requests.post(
    'https://www.turbodocx.com/turbosign/documents/upload',
    headers={
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'x-rapiddocx-org-id': 'YOUR_ORGANIZATION_ID',
        'User-Agent': 'TurboDocx API Client'
    },
    files=files
)

result = response.json()
print(result)