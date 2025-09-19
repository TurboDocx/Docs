import requests
import json

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
TEMPLATE_NAME = "Employee Contract Template"

def upload_template():
    """
    Path A: Upload and Create Template
    Uploads a .docx/.pptx template and extracts variables automatically
    """
    try:
        url = f"{BASE_URL}/template/upload-and-create"

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        # Prepare form data
        files = {
            'templateFile': ('contract-template.docx', open('./contract-template.docx', 'rb'),
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        }

        data = {
            'name': TEMPLATE_NAME,
            'description': 'Standard employee contract with variable placeholders',
            'variables': '[]',  # Optional: pre-defined variables
            'tags': '["hr", "contract", "template"]'
        }

        response = requests.post(url, headers=headers, files=files, data=data)
        response.raise_for_status()

        result = response.json()
        template = result['data']['template']

        print(f"Template uploaded successfully: {template['id']}")
        print(f"Variables extracted: {len(template['variables'])}")
        print(f"Redirect to: {result['data']['redirectUrl']}")

        # Clean up file handle
        files['templateFile'][1].close()

        return template

    except requests.exceptions.RequestException as e:
        print(f"Error uploading template: {e}")
        raise
    except FileNotFoundError:
        print("Error: Template file './contract-template.docx' not found")
        raise
    except json.JSONDecodeError as e:
        print(f"Error parsing response: {e}")
        raise

# Example usage
if __name__ == "__main__":
    try:
        template = upload_template()
        print(f"Ready to generate documents with template: {template['id']}")
    except Exception as error:
        print(f"Upload failed: {error}")