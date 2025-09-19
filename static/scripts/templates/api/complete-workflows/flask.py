#!/usr/bin/env python3

import os
import requests
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = Flask(__name__)

class TemplateWorkflowManager:
    """
    Complete Template Workflow Manager
    Demonstrates both upload and browse/select paths
    """

    def __init__(self, api_token, org_id, base_url):
        self.api_token = api_token
        self.org_id = org_id
        self.base_url = base_url
        print('=== TurboDocx Template Generation Workflow Manager ===')

    def demonstrate_complete_workflow(self):
        print('\nSelect workflow path:')
        print('A) Upload new template')
        print('B) Browse and select existing template')

        # For this example, we'll demonstrate both paths
        print('\n=== Demonstrating Path A: Upload Template ===')
        template_id_a = self.demonstrate_upload_workflow()

        print('\n=== Demonstrating Path B: Browse Templates ===')
        template_id_b = self.demonstrate_browse_workflow()

        # Generate deliverables for both templates if successful
        results = {}

        if template_id_a:
            print('\n=== Generating Deliverable from Uploaded Template ===')
            results['uploadPath'] = self.generate_and_download_deliverable(template_id_a, 'A')

        if template_id_b:
            print('\n=== Generating Deliverable from Selected Template ===')
            results['browsePath'] = self.generate_and_download_deliverable(template_id_b, 'B')

        return {
            'uploadedTemplateId': template_id_a,
            'selectedTemplateId': template_id_b,
            'results': results
        }

    def demonstrate_upload_workflow(self):
        try:
            print('\n--- Path A: Upload and Create Template ---')

            # Check for template file
            template_file = './contract-template.docx'
            if not os.path.exists(template_file):
                print(f'⚠️  Template file not found: {template_file}')
                print('Creating a placeholder message for demonstration')
                return None

            result = self.upload_template(template_file)
            template = result['data']['results']['template']

            print('✅ Upload workflow completed')
            print(f'Template ID: {template["id"]}')
            print('Ready for deliverable generation')

            return template['id']

        except Exception as e:
            print(f'❌ Upload workflow failed: {str(e)}')
            return None

    def demonstrate_browse_workflow(self):
        try:
            print('\n--- Path B: Browse and Select Template ---')

            # Browse templates
            browse_result = self.browse_templates(10, 0, 'contract', True)

            # Find first template (not folder)
            selected_template = None
            for item in browse_result['results']:
                if item.get('type') == 'template':
                    selected_template = item
                    break

            if not selected_template:
                print('⚠️  No templates found in browse results')
                return None

            print(f'Selected: {selected_template["name"]}')

            # Get detailed information
            template_details = self.get_template_details(selected_template['id'])

            # Optionally get PDF preview
            pdf_preview = self.get_template_pdf_preview(selected_template['id'])

            print('✅ Browse workflow completed')
            print(f'Template ID: {template_details["id"]}')
            print(f'PDF Preview: {pdf_preview}')
            print('Ready for deliverable generation')

            return template_details['id']

        except Exception as e:
            print(f'❌ Browse workflow failed: {str(e)}')
            return None

    def generate_and_download_deliverable(self, template_id, path_label):
        try:
            print(f'\n--- Generating Deliverable (Path {path_label}) ---')

            deliverable_data = self.create_deliverable_data(template_id, path_label)
            deliverable = self.generate_deliverable(template_id, deliverable_data)

            # Download the file
            download_result = self.download_deliverable(
                deliverable['id'],
                f'{deliverable["name"]}_path_{path_label}.docx'
            )

            print(f'✅ Complete workflow finished successfully for Path {path_label}')
            print(f'Deliverable ID: {deliverable["id"]}')
            print(f'Download info: {json.dumps(download_result, indent=2)}')

            return {
                'deliverable': deliverable,
                'downloadResult': download_result
            }

        except Exception as e:
            print(f'❌ Deliverable generation failed for Path {path_label}: {str(e)}')
            raise

    def upload_template(self, template_file_path):
        url = f"{self.base_url}/template/upload-and-create"

        with open(template_file_path, 'rb') as file:
            files = {
                'templateFile': (os.path.basename(template_file_path), file,
                               'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            }

            data = {
                'name': 'Employee Contract Template',
                'description': 'Standard employee contract with variable placeholders',
                'variables': '[]',
                'tags': '["hr", "contract", "template"]'
            }

            headers = {
                'Authorization': f'Bearer {self.api_token}',
                'x-rapiddocx-org-id': self.org_id,
                'User-Agent': 'TurboDocx API Client'
            }

            response = requests.post(url, files=files, data=data, headers=headers)
            response.raise_for_status()
            return response.json()

    def browse_templates(self, limit, offset, query, show_tags):
        from urllib.parse import urlencode

        params = {
            'limit': str(limit),
            'offset': str(offset),
            'showTags': str(show_tags).lower()
        }

        if query:
            params['query'] = query

        query_string = urlencode(params)
        url = f"{self.base_url}/template-item?{query_string}"

        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'x-rapiddocx-org-id': self.org_id,
            'User-Agent': 'TurboDocx API Client'
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()['data']

    def get_template_details(self, template_id):
        url = f"{self.base_url}/template/{template_id}"

        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'x-rapiddocx-org-id': self.org_id,
            'User-Agent': 'TurboDocx API Client'
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()['data']['results']

    def get_template_pdf_preview(self, template_id):
        url = f"{self.base_url}/template/{template_id}/previewpdflink"

        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'x-rapiddocx-org-id': self.org_id,
            'User-Agent': 'TurboDocx API Client'
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()['results']

    def generate_deliverable(self, template_id, deliverable_data):
        url = f"{self.base_url}/deliverable"

        print('Generating deliverable...')
        print(f'Template ID: {template_id}')
        print(f'Deliverable Name: {deliverable_data["name"]}')
        print(f'Variables: {len(deliverable_data["variables"])}')

        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'x-rapiddocx-org-id': self.org_id,
            'User-Agent': 'TurboDocx API Client',
            'Content-Type': 'application/json'
        }

        response = requests.post(url, json=deliverable_data, headers=headers)
        response.raise_for_status()

        # Parse JSON response
        result = response.json()
        deliverable = result['data']['results']['deliverable']

        print('✅ Deliverable generated successfully!')
        print(f'Deliverable ID: {deliverable["id"]}')
        print(f'Created by: {deliverable["createdBy"]}')
        print(f'Created on: {deliverable["createdOn"]}')
        print(f'Template ID: {deliverable["templateId"]}')

        return deliverable

    def download_deliverable(self, deliverable_id, filename):
        print(f'Downloading file: {filename}')

        url = f"{self.base_url}/deliverable/file/{deliverable_id}"

        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'x-rapiddocx-org-id': self.org_id,
            'User-Agent': 'TurboDocx API Client'
        }

        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()

        print(f'✅ File ready for download: {filename}')

        content_type = response.headers.get('Content-Type', 'N/A')
        content_length = response.headers.get('Content-Length', 'N/A')

        print(f'📁 Content-Type: {content_type}')
        print(f'📊 Content-Length: {content_length} bytes')

        # In a real application, you would save the file
        # with open(filename, 'wb') as f:
        #     for chunk in response.iter_content(chunk_size=8192):
        #         f.write(chunk)

        return {
            'filename': filename,
            'contentType': content_type,
            'contentLength': content_length
        }

    def create_deliverable_data(self, template_id, path_label):
        now = datetime.utcnow().isoformat() + 'Z'

        return {
            'templateId': template_id,
            'name': f'Contract Document - Path {path_label}',
            'description': f'Employment contract generated via workflow path {path_label}',
            'variables': self.create_complex_variables(),
            'tags': ['hr', 'contract', 'employee', 'engineering'],
            'fonts': '[{"name":"Arial","usage":269}]',
            'defaultFont': 'Arial',
            'replaceFonts': True,
            'metadata': {
                'sessions': [
                    {
                        'id': str(uuid.uuid4()),
                        'starttime': now,
                        'endtime': now
                    }
                ],
                'createdBy': 'Python Workflow Manager',
                'documentType': 'Employment Contract',
                'version': 'v1.0',
                'workflowPath': path_label
            }
        }

    def create_complex_variables(self):
        return [
            {
                'mimeType': 'text',
                'name': 'Employee Name',
                'placeholder': '{EmployeeName}',
                'text': 'John Smith',
                'allowRichTextInjection': 0,
                'autogenerated': False,
                'count': 1,
                'order': 1,
                'subvariables': [
                    {
                        'placeholder': '{EmployeeName.Title}',
                        'text': 'Senior Software Engineer'
                    },
                    {
                        'placeholder': '{EmployeeName.StartDate}',
                        'text': 'January 15, 2024'
                    }
                ],
                'metadata': {
                    'department': 'Engineering',
                    'level': 'Senior'
                },
                'aiPrompt': 'Generate a professional job description for a senior software engineer role'
            },
            {
                'mimeType': 'text',
                'name': 'Company Information',
                'placeholder': '{CompanyInfo}',
                'text': 'TechCorp Solutions Inc.',
                'allowRichTextInjection': 1,
                'autogenerated': False,
                'count': 1,
                'order': 2,
                'subvariables': [
                    {
                        'placeholder': '{CompanyInfo.Address}',
                        'text': '123 Innovation Drive, Tech City, TC 12345'
                    },
                    {
                        'placeholder': '{CompanyInfo.Phone}',
                        'text': '(555) 123-4567'
                    }
                ],
                'metadata': {},
                'aiPrompt': ''
            }
        ]

# Flask route handlers
@app.route('/complete-workflow', methods=['POST'])
def complete_workflow_endpoint():
    """Complete workflow demonstration endpoint"""
    try:
        print('Starting complete workflow demonstration...')

        workflow_manager = TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL)
        result = workflow_manager.demonstrate_complete_workflow()

        return jsonify({
            'success': True,
            'message': 'Complete workflow demonstration finished',
            'data': result
        })

    except Exception as e:
        app.logger.error(f'Error in complete workflow: {str(e)}')
        return jsonify({
            'error': 'Complete workflow failed',
            'message': str(e)
        }), 500

@app.route('/upload-workflow', methods=['POST'])
def upload_workflow_endpoint():
    """Upload workflow endpoint"""
    try:
        data = request.get_json() or {}
        template_file_path = data.get('templateFilePath', './contract-template.docx')

        workflow_manager = TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL)
        template_id = workflow_manager.demonstrate_upload_workflow()

        if not template_id:
            return jsonify({
                'error': 'Upload workflow failed',
                'message': 'Template file not found or upload failed'
            }), 404

        # Generate deliverable
        deliverable_result = workflow_manager.generate_and_download_deliverable(template_id, 'Upload')

        return jsonify({
            'success': True,
            'message': 'Upload workflow completed successfully',
            'data': {
                'templateId': template_id,
                **deliverable_result
            }
        })

    except Exception as e:
        app.logger.error(f'Error in upload workflow: {str(e)}')
        return jsonify({
            'error': 'Upload workflow failed',
            'message': str(e)
        }), 500

@app.route('/browse-workflow', methods=['POST'])
def browse_workflow_endpoint():
    """Browse workflow endpoint"""
    try:
        workflow_manager = TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL)
        template_id = workflow_manager.demonstrate_browse_workflow()

        if not template_id:
            return jsonify({
                'error': 'Browse workflow failed',
                'message': 'No templates found or selection failed'
            }), 404

        # Generate deliverable
        deliverable_result = workflow_manager.generate_and_download_deliverable(template_id, 'Browse')

        return jsonify({
            'success': True,
            'message': 'Browse workflow completed successfully',
            'data': {
                'templateId': template_id,
                **deliverable_result
            }
        })

    except Exception as e:
        app.logger.error(f'Error in browse workflow: {str(e)}')
        return jsonify({
            'error': 'Browse workflow failed',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'workflow-manager'
    })

@app.route('/workflow-info', methods=['GET'])
def workflow_info():
    """Service information endpoint"""
    return jsonify({
        'service': 'TurboDocx Complete Workflow Manager Service',
        'endpoints': {
            'POST /complete-workflow': 'Demonstrate both upload and browse workflows',
            'POST /upload-workflow': 'Execute upload workflow only',
            'POST /browse-workflow': 'Execute browse workflow only',
            'GET /health': 'Service health check',
            'GET /workflow-info': 'Service information'
        },
        'configuration': {
            'baseUrl': BASE_URL,
            'hasToken': bool(API_TOKEN and API_TOKEN != 'YOUR_API_TOKEN'),
            'hasOrgId': bool(ORG_ID and ORG_ID != 'YOUR_ORGANIZATION_ID')
        },
        'description': 'Complete workflow manager that demonstrates both template upload and browse/select paths, followed by deliverable generation and download.'
    })

def demonstrate_complete_workflow():
    """Example usage function"""
    try:
        print('=== Complete Template Workflow Demonstration ===')

        workflow_manager = TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL)
        result = workflow_manager.demonstrate_complete_workflow()

        print('\n=== Workflow Demonstration Complete ===')
        print('Both upload and browse/select paths have been demonstrated.')
        print('Choose the appropriate path for your use case:')
        print('- Upload path: When you have new templates to create')
        print('- Browse path: When you want to use existing templates')

        return result

    except Exception as e:
        print(f'Workflow demonstration failed: {str(e)}')
        exit(1)

if __name__ == '__main__':
    import sys

    if '--demo' in sys.argv:
        # Run demonstration
        demonstrate_complete_workflow()
    else:
        # Start Flask server
        port = int(os.environ.get('PORT', 5004))
        host = os.environ.get('HOST', '0.0.0.0')

        print('🚀 TurboDocx Complete Workflow Manager Service started')
        print(f'📡 Server listening on http://{host}:{port}')
        print('\nAvailable endpoints:')
        print(f'  POST http://{host}:{port}/complete-workflow')
        print(f'  POST http://{host}:{port}/upload-workflow')
        print(f'  POST http://{host}:{port}/browse-workflow')
        print(f'  GET  http://{host}:{port}/health')
        print(f'  GET  http://{host}:{port}/workflow-info')

        app.run(host=host, port=port, debug=False)