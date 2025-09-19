import requests
import json
import uuid
import os
from datetime import datetime
from urllib.parse import urlencode

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

class TemplateWorkflowManager:
    """
    Complete Template Generation Workflows
    Demonstrates both Path A (Upload) and Path B (Browse/Select) followed by generation
    """

    def __init__(self, api_token, org_id, base_url):
        self.api_token = api_token
        self.org_id = org_id
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'x-rapiddocx-org-id': org_id,
            'User-Agent': 'TurboDocx API Client'
        }

    # ===============================
    # PATH A: Upload New Template
    # ===============================

    def path_a_upload_and_generate(self, template_file_path, deliverable_name):
        """Complete Path A workflow: Upload → Generate"""
        print("🔄 PATH A: Upload New Template → Generate Deliverable")
        print("=" * 48)

        try:
            # Step 1: Upload and create template
            print("\n📤 Step 1: Uploading template...")
            template = self.upload_template(template_file_path)

            # Step 2: Generate deliverable using uploaded template
            print("\n📝 Step 2: Generating deliverable...")
            deliverable = self.generate_deliverable(template['id'], {
                'name': deliverable_name,
                'description': f"Generated from uploaded template: {template['name']}",
                'variables': self.create_variables_from_template(template['variables'])
            })

            print("\n✅ PATH A COMPLETE!")
            print(f"Template ID: {template['id']}")
            print(f"Deliverable ID: {deliverable['id']}")
            print(f"Download: {deliverable['downloadUrl']}")

            return {'template': template, 'deliverable': deliverable}

        except Exception as error:
            print(f"❌ Path A failed: {error}")
            raise

    def upload_template(self, template_file_path):
        """Upload a template file and create template record"""
        if not os.path.exists(template_file_path):
            raise FileNotFoundError(f"Template file not found: {template_file_path}")

        url = f"{self.base_url}/template/upload-and-create"

        files = {
            'templateFile': (
                os.path.basename(template_file_path),
                open(template_file_path, 'rb'),
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
        }

        data = {
            'name': 'API Upload Template',
            'description': 'Template uploaded via API for testing',
            'variables': '[]',
            'tags': '["api", "test", "upload"]'
        }

        try:
            response = requests.post(url, headers=self.headers, files=files, data=data)
            response.raise_for_status()

            result = response.json()
            template = result['data']['template']

            print(f"✅ Template uploaded: {template['name']} ({template['id']})")
            print(f"📊 Variables extracted: {len(template['variables'])}")

            return template

        finally:
            files['templateFile'][1].close()

    # ===============================
    # PATH B: Browse and Select
    # ===============================

    def path_b_browse_and_generate(self, search_query, deliverable_name):
        """Complete Path B workflow: Browse → Select → Generate"""
        print("🔍 PATH B: Browse Existing Templates → Generate Deliverable")
        print("=" * 56)

        try:
            # Step 1: Browse templates
            print("\n🔍 Step 1: Browsing templates...")
            browse_result = self.browse_templates({'query': search_query})

            # Step 2: Select first available template
            selected_template = None
            for item in browse_result['results']:
                if item['type'] == 'template':
                    selected_template = item
                    break

            if not selected_template:
                raise Exception('No templates found in browse results')

            print(f"📋 Selected: {selected_template['name']} ({selected_template['id']})")

            # Step 3: Get template details
            print("\n📖 Step 2: Getting template details...")
            template_details = self.get_template_details(selected_template['id'])

            # Step 4: Get PDF preview (optional)
            print("\n🖼️  Step 3: Getting PDF preview...")
            pdf_preview = self.get_template_pdf_preview(selected_template['id'])

            # Step 5: Generate deliverable
            print("\n📝 Step 4: Generating deliverable...")
            deliverable = self.generate_deliverable(template_details['id'], {
                'name': deliverable_name,
                'description': f"Generated from existing template: {template_details['name']}",
                'variables': self.create_variables_from_template(template_details['variables'])
            })

            print("\n✅ PATH B COMPLETE!")
            print(f"Template ID: {template_details['id']}")
            print(f"Deliverable ID: {deliverable['id']}")
            print(f"Download: {deliverable['downloadUrl']}")

            return {
                'template': template_details,
                'deliverable': deliverable,
                'pdf_preview': pdf_preview
            }

        except Exception as error:
            print(f"❌ Path B failed: {error}")
            raise

    def browse_templates(self, options=None):
        """Browse available templates and folders"""
        if options is None:
            options = {}

        params = {
            'limit': options.get('limit', 25),
            'offset': options.get('offset', 0),
            'showTags': str(options.get('show_tags', True)).lower()
        }

        query = options.get('query', '')
        if query:
            params['query'] = query

        url = f"{self.base_url}/template-item?{urlencode(params)}"

        response = requests.get(url, headers=self.headers)
        response.raise_for_status()

        result = response.json()
        data = result['data']

        print(f"🔍 Found {data['totalRecords']} templates/folders")

        return data

    def get_template_details(self, template_id):
        """Get detailed template information"""
        url = f"{self.base_url}/template/{template_id}"

        response = requests.get(url, headers=self.headers)
        response.raise_for_status()

        result = response.json()
        template = result['data']['results']

        print(f"📊 Variables: {len(template['variables'])}")
        print(f"🔤 Default font: {template.get('defaultFont', 'N/A')}")

        return template

    def get_template_pdf_preview(self, template_id):
        """Get PDF preview URL for template"""
        url = f"{self.base_url}/template/{template_id}/previewpdflink"

        response = requests.get(url, headers=self.headers)
        response.raise_for_status()

        result = response.json()
        pdf_url = result['results']

        print(f"🖼️  PDF Preview available: {pdf_url}")

        return pdf_url

    # ===============================
    # COMMON: Generate Deliverable
    # ===============================

    def generate_deliverable(self, template_id, deliverable_data):
        """Generate a deliverable document from template"""
        payload = {
            "templateId": template_id,
            "name": deliverable_data['name'],
            "description": deliverable_data.get('description', ''),
            "variables": deliverable_data['variables'],
            "tags": deliverable_data.get('tags', ['api-generated']),
            "fonts": deliverable_data.get('fonts', '[]'),
            "defaultFont": deliverable_data.get('defaultFont', 'Arial'),
            "replaceFonts": deliverable_data.get('replaceFonts', True),
            "metadata": deliverable_data.get('metadata', {
                "sessions": [{
                    "id": self.generate_session_id(),
                    "starttime": datetime.utcnow().isoformat() + "Z",
                    "endtime": datetime.utcnow().isoformat() + "Z"
                }],
                "workflow": "API Complete Workflow",
                "generated": datetime.utcnow().isoformat() + "Z"
            })
        }

        url = f"{self.base_url}/deliverable"
        headers = {**self.headers, 'Content-Type': 'application/json'}

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        result = response.json()
        deliverable = result['data']['deliverable']

        print(f"✅ Generated: {deliverable['name']}")
        print(f"📄 Status: {deliverable['status']}")
        print(f"📁 Size: {deliverable['fileSize']} bytes")

        return deliverable

    # ===============================
    # UTILITY FUNCTIONS
    # ===============================

    def create_variables_from_template(self, template_variables):
        """Create variable payload from template variable definitions"""
        return [
            {
                "mimeType": variable.get('mimeType', 'text'),
                "name": variable['name'],
                "placeholder": variable['placeholder'],
                "text": self.generate_sample_text(variable['name']),
                "allowRichTextInjection": variable.get('allowRichTextInjection', 0),
                "autogenerated": False,
                "count": 1,
                "order": index + 1,
                "subvariables": self.create_sample_subvariables(variable['placeholder']),
                "metadata": {
                    "generatedBy": "API Workflow",
                    "variableType": variable.get('mimeType', 'text')
                },
                "aiPrompt": f"Generate appropriate content for {variable['name']}"
            }
            for index, variable in enumerate(template_variables)
        ]

    def generate_sample_text(self, variable_name):
        """Generate sample text based on variable name"""
        sample_data = {
            'company': 'TechCorp Solutions Inc.',
            'employee': 'John Smith',
            'date': datetime.now().strftime('%B %d, %Y'),
            'title': 'Senior Software Engineer',
            'department': 'Engineering',
            'salary': '$95,000',
            'address': '123 Main Street, Tech City, TC 12345',
            'phone': '(555) 123-4567',
            'email': 'john.smith@techcorp.com'
        }

        # Find matching sample data or generate generic text
        for key, value in sample_data.items():
            if key.lower() in variable_name.lower():
                return value

        return f"Sample {variable_name} Content"

    def create_sample_subvariables(self, placeholder):
        """Create relevant subvariables based on placeholder name"""
        placeholder_lower = placeholder.lower()

        if 'employee' in placeholder_lower:
            return [
                {"placeholder": "{Employee.Title}", "text": "Senior Software Engineer"},
                {"placeholder": "{Employee.StartDate}", "text": datetime.now().strftime('%B %d, %Y')}
            ]
        elif 'company' in placeholder_lower:
            return [
                {"placeholder": "{Company.Address}", "text": "123 Main Street, Tech City, TC 12345"},
                {"placeholder": "{Company.Phone}", "text": "(555) 123-4567"}
            ]

        return []

    def generate_session_id(self):
        """Generate a unique session ID"""
        return str(uuid.uuid4())

    # ===============================
    # DEMO FUNCTIONS
    # ===============================

    def demo_path_a(self, template_file_path):
        """Demo Path A workflow"""
        print("🚀 DEMO: Path A - Upload New Template Workflow")
        print("=" * 45)
        print()

        return self.path_a_upload_and_generate(
            template_file_path,
            'Contract Generated via Path A - API Upload'
        )

    def demo_path_b(self):
        """Demo Path B workflow"""
        print("🚀 DEMO: Path B - Browse Existing Template Workflow")
        print("=" * 51)
        print()

        return self.path_b_browse_and_generate(
            'contract',
            'Contract Generated via Path B - Browse & Select'
        )

    def demo_comparison(self):
        """Demo comparison of both workflows"""
        print("🚀 DEMO: Complete Workflow Comparison")
        print("=" * 36)
        print()

        try:
            print("Testing both paths with the same template type...\n")

            # Run Path B first (browse existing)
            path_b_result = self.demo_path_b()

            print("\n" + "=" * 60 + "\n")

            # For Path A, we'd need a template file
            print("📝 Path A requires a template file to upload.")
            print("   Example: workflow.demo_path_a('./contract-template.docx')")

            return {'path_b': path_b_result}

        except Exception as error:
            print(f"Demo comparison failed: {error}")

def run_examples():
    """Run example workflows"""
    workflow = TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL)

    try:
        # Demo Path B (Browse existing templates)
        workflow.demo_path_b()

        # Uncomment to demo Path A (requires template file):
        # workflow.demo_path_a('./path/to/your/template.docx')

        # Uncomment to run full comparison:
        # workflow.demo_comparison()

    except Exception as error:
        print(f"Workflow demo failed: {error}")

# Example usage
if __name__ == "__main__":
    run_examples()