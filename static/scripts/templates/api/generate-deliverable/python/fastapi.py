import requests
import json
import uuid
from datetime import datetime

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

class DeliverableGenerator:
    """Final Step: Generate Deliverable (Both Paths Converge Here)"""

    def __init__(self, api_token, org_id, base_url):
        self.api_token = api_token
        self.org_id = org_id
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'x-rapiddocx-org-id': org_id,
            'User-Agent': 'TurboDocx API Client',
            'Content-Type': 'application/json'
        }

    def generate_deliverable(self, template_id, deliverable_data):
        """Generate a deliverable document from template with variable substitution"""
        try:
            url = f"{self.base_url}/deliverable"

            payload = {
                "templateId": template_id,
                "name": deliverable_data["name"],
                "description": deliverable_data.get("description", ""),
                "variables": deliverable_data["variables"],
                "tags": deliverable_data.get("tags", []),
                "fonts": deliverable_data.get("fonts", "[]"),
                "defaultFont": deliverable_data.get("defaultFont", "Arial"),
                "replaceFonts": deliverable_data.get("replaceFonts", True),
                "metadata": deliverable_data.get("metadata", {})
            }

            print(f"Generating deliverable...")
            print(f"Template ID: {template_id}")
            print(f"Deliverable Name: {payload['name']}")
            print(f"Variables: {len(payload['variables'])}")

            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()

            result = response.json()
            deliverable = result['data']['results']['deliverable']

            print("✅ Deliverable generated successfully!")
            print(f"Deliverable ID: {deliverable['id']}")
            print(f"Created by: {deliverable['createdBy']}")
            print(f"Created on: {deliverable['createdOn']}")
            print(f"Template ID: {deliverable['templateId']}")

            return deliverable

        except requests.exceptions.RequestException as e:
            print(f"Error generating deliverable: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response body: {e.response.text}")
            raise

    def create_simple_variables(self):
        """Example: Simple variable structure - easy to understand"""
        return [
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


    def download_deliverable(self, deliverable_id, filename):
        """Download the generated deliverable file"""
        try:
            url = f"{self.base_url}/deliverable/file/{deliverable_id}"

            print(f"Downloading file: {filename}")
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()

            print(f"✅ File ready for download: {filename}")
            print(f"📁 Content-Type: {response.headers.get('content-type')}")
            print(f"📊 Content-Length: {response.headers.get('content-length')} bytes")

            # In a real application, you would save the file
            # with open(filename, 'wb') as f:
            #     f.write(response.content)

            return {
                'filename': filename,
                'content_type': response.headers.get('content-type'),
                'content_length': response.headers.get('content-length')
            }

        except requests.exceptions.RequestException as e:
            print(f"Error downloading file: {e}")
            raise

def example_generate_deliverable():
    """Example usage with realistic data"""
    try:
        generator = DeliverableGenerator(API_TOKEN, ORG_ID, BASE_URL)

        # This would come from either Path A (upload) or Path B (browse/select)
        template_id = "0b1099cf-d7b9-41a4-822b-51b68fd4885a"

        deliverable_data = {
            "name": "Contract - John Smith",
            "description": "Simple contract example",
            "variables": generator.create_simple_variables()
        }

        print("=== Final Step: Generate Deliverable ===")
        deliverable = generator.generate_deliverable(template_id, deliverable_data)

        # Download the generated file
        print("\n=== Download Generated File ===")
        generator.download_deliverable(deliverable['id'], f"{deliverable['name']}.docx")

        return deliverable

    except Exception as error:
        print(f"Deliverable generation failed: {error}")

# Example usage
if __name__ == "__main__":
    example_generate_deliverable()