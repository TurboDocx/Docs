import requests
import os

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

"""
Complete Workflow: Upload → Generate → Download
Simple 3-step process for document generation
"""

# Step 1: Upload template file
def upload_template(template_file_path):
    url = f"{BASE_URL}/template/upload-and-create"

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    }

    with open(template_file_path, 'rb') as file:
        files = {'templateFile': file}
        data = {
            'name': 'Simple Template',
            'description': 'Template uploaded for document generation'
        }

        response = requests.post(url, headers=headers, files=files, data=data)

    if not response.ok:
        raise Exception(f"Upload failed: {response.status_code}")

    result = response.json()
    template = result['data']['results']['template']

    print(f"✅ Template uploaded: {template['name']} ({template['id']})")
    return template

# Step 2: Generate deliverable with simple variables
def generate_deliverable(template_id):
    variables = [
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

    payload = {
        "templateId": template_id,
        "name": "Generated Document",
        "description": "Simple document example",
        "variables": variables
    }

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client',
        'Content-Type': 'application/json'
    }

    response = requests.post(f"{BASE_URL}/deliverable", headers=headers, json=payload)

    if not response.ok:
        raise Exception(f"Generation failed: {response.status_code}")

    result = response.json()
    deliverable = result['data']['results']['deliverable']

    print(f"✅ Document generated: {deliverable['name']} ({deliverable['id']})")
    return deliverable

# Step 3: Download generated file
def download_file(deliverable_id, filename):
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    }

    response = requests.get(f"{BASE_URL}/deliverable/file/{deliverable_id}", headers=headers)

    if not response.ok:
        raise Exception(f"Download failed: {response.status_code}")

    print(f"✅ File ready for download: {filename}")

    # In a real application, you would save the file:
    # with open(filename, 'wb') as f:
    #     f.write(response.content)

    return {
        'filename': filename,
        'content_type': response.headers.get('content-type'),
        'content_length': response.headers.get('content-length')
    }

# Complete workflow: Upload → Generate → Download
def complete_workflow(template_file_path):
    try:
        print("🚀 Starting complete workflow...")

        # Step 1: Upload template
        print("\n📤 Step 1: Uploading template...")
        template = upload_template(template_file_path)

        # Step 2: Generate deliverable
        print("\n📝 Step 2: Generating document...")
        deliverable = generate_deliverable(template['id'])

        # Step 3: Download file
        print("\n📥 Step 3: Downloading file...")
        download_info = download_file(deliverable['id'], f"{deliverable['name']}.docx")

        print("\n✅ Workflow complete!")
        print(f"Template: {template['id']}")
        print(f"Document: {deliverable['id']}")
        print(f"File: {download_info['filename']}")

        return {
            'template': template,
            'deliverable': deliverable,
            'download_info': download_info
        }

    except Exception as error:
        print(f"❌ Workflow failed: {error}")
        raise

# Example usage
def example():
    try:
        # Replace with your template file path
        template_path = './template.docx'
        complete_workflow(template_path)
    except Exception as error:
        print(f"Example failed: {error}")

if __name__ == "__main__":
    example()