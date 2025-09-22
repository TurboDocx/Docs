import requests
import json

# Configuration
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

def generate_ai_variable():
    url = f"{BASE_URL}/ai/generate/variable/one"

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'Content-Type': 'application/json'
    }

    payload = {
        'name': 'Company Performance Summary',
        'placeholder': '{Q4Performance}',
        'templateId': 'template-abc123',
        'aiHint': 'Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements',
        'richTextEnabled': True
    }

    response = requests.post(url, headers=headers, json=payload)

    if not response.ok:
        raise Exception(f"AI generation failed: {response.status_code}")

    result = response.json()
    print(f"Generated variable: {result['data']}")
    return result

# Run the example
if __name__ == "__main__":
    try:
        generate_ai_variable()
    except Exception as e:
        print(f"Error: {e}")