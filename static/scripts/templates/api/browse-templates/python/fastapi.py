import requests
import json
from urllib.parse import urlencode

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

class TemplateBrowser:
    """Path B: Browse and Select Existing Templates"""

    def __init__(self, api_token, org_id, base_url):
        self.api_token = api_token
        self.org_id = org_id
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'x-rapiddocx-org-id': org_id,
            'User-Agent': 'TurboDocx API Client'
        }

    def browse_templates(self, limit=25, offset=0, query='', show_tags=True, selected_tags=None):
        """Step 1: Browse Templates and Folders"""
        try:
            url = f"{self.base_url}/template-item"

            params = {
                'limit': limit,
                'offset': offset,
                'showTags': str(show_tags).lower()
            }

            if query:
                params['query'] = query

            # Handle multiple selectedTags parameters
            if selected_tags:
                # For requests library, we need to handle multiple values manually
                param_string = urlencode(params)
                for tag in selected_tags:
                    param_string += f"&selectedTags[]={tag}"
                url += f"?{param_string}"
            else:
                url += f"?{urlencode(params)}"

            response = requests.get(url, headers=self.headers)
            response.raise_for_status()

            result = response.json()
            data = result['data']

            print(f"Found {data['totalRecords']} templates/folders")

            return data

        except requests.exceptions.RequestException as e:
            print(f"Error browsing templates: {e}")
            raise

    def get_template_details(self, template_id):
        """Step 2: Get Template Details by ID"""
        try:
            url = f"{self.base_url}/template/{template_id}"

            response = requests.get(url, headers=self.headers)
            response.raise_for_status()

            result = response.json()
            template = result['data']['results']

            print(f"Template: {template['name']}")
            print(f"Variables: {len(template['variables'])}")
            print(f"Default font: {template.get('defaultFont', 'N/A')}")

            return template

        except requests.exceptions.RequestException as e:
            print(f"Error getting template details: {e}")
            raise

    def get_template_pdf_preview(self, template_id):
        """Step 3: Get PDF Preview Link (Optional)"""
        try:
            url = f"{self.base_url}/template/{template_id}/previewpdflink"

            response = requests.get(url, headers=self.headers)
            response.raise_for_status()

            result = response.json()
            pdf_url = result['results']

            print(f"PDF Preview: {pdf_url}")

            return pdf_url

        except requests.exceptions.RequestException as e:
            print(f"Error getting PDF preview: {e}")
            raise

    def browse_folder_contents(self, folder_id, limit=25, offset=0, query=''):
        """Browse Folder Contents"""
        try:
            params = {
                'limit': limit,
                'offset': offset
            }

            if query:
                params['query'] = query

            url = f"{self.base_url}/template-item/{folder_id}?{urlencode(params)}"

            response = requests.get(url, headers=self.headers)
            response.raise_for_status()

            result = response.json()
            folder_data = result['data']['results']

            print(f"Folder: {folder_data['name']}")
            print(f"Templates in folder: {folder_data.get('templateCount', 0)}")

            return folder_data

        except requests.exceptions.RequestException as e:
            print(f"Error browsing folder: {e}")
            raise

def example_browsing_workflow():
    """Example usage - Complete browsing workflow"""
    try:
        print("=== Path B: Browse and Select Template ===")

        browser = TemplateBrowser(API_TOKEN, ORG_ID, BASE_URL)

        # Step 1: Browse all templates
        print("\n1. Browsing templates...")
        browse_result = browser.browse_templates(
            limit=10,
            query='contract',
            show_tags=True
        )

        # Find a template (not a folder)
        template = None
        for item in browse_result['results']:
            if item['type'] == 'template':
                template = item
                break

        if not template:
            print("No templates found in browse results")
            return

        print(f"\nSelected template: {template['name']} ({template['id']})")

        # Step 2: Get detailed template information
        print("\n2. Getting template details...")
        template_details = browser.get_template_details(template['id'])

        # Step 3: Get PDF preview (optional)
        print("\n3. Getting PDF preview...")
        pdf_preview = browser.get_template_pdf_preview(template['id'])

        print("\n=== Template Ready for Generation ===")
        print(f"Template ID: {template_details['id']}")
        print(f"Variables available: {len(template_details['variables'])}")
        print(f"PDF Preview: {pdf_preview}")

        return {
            'template': template_details,
            'pdf_preview': pdf_preview
        }

    except Exception as error:
        print(f"Browsing workflow failed: {error}")

# Example usage
if __name__ == "__main__":
    example_browsing_workflow()