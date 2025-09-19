#!/usr/bin/env python3

import os
import requests
import json
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
TEMPLATE_NAME = "Employee Contract Template"

app = Flask(__name__)

def upload_template(template_file_path):
    """
    Path A: Upload and Create Template
    Uploads a .docx/.pptx template and extracts variables automatically
    """
    # Check if file exists
    if not os.path.exists(template_file_path):
        raise FileNotFoundError(f"Template file not found: {template_file_path}")

    url = f"{BASE_URL}/template/upload-and-create"

    # Prepare files and data
    with open(template_file_path, 'rb') as file:
        files = {
            'templateFile': (os.path.basename(template_file_path), file,
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        }

        data = {
            'name': TEMPLATE_NAME,
            'description': 'Standard employee contract with variable placeholders',
            'variables': '[]',
            'tags': '["hr", "contract", "template"]'
        }

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        print(f"Uploading template: {os.path.basename(template_file_path)}")
        print(f"Template name: {TEMPLATE_NAME}")

        try:
            response = requests.post(url, files=files, data=data, headers=headers)
            response.raise_for_status()

            # Parse response
            result = response.json()
            template = result['data']['results']['template']

            print(f"✅ Template uploaded successfully: {template['id']}")
            print(f"Template name: {template['name']}")

            # Handle nullable variables field
            variable_count = len(template['variables']) if template.get('variables') else 0
            print(f"Variables extracted: {variable_count}")

            print(f"Default font: {template.get('defaultFont', 'N/A')}")

            # Handle nullable fonts field
            font_count = len(template['fonts']) if template.get('fonts') else 0
            print(f"Fonts used: {font_count}")

            print(f"Redirect to: {result['data']['results']['redirectUrl']}")
            print(f"Ready to generate documents with template: {template['id']}")

            return result

        except requests.exceptions.RequestException as e:
            error_msg = f"Upload failed: {str(e)}"
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg += f" - {error_data}"
                except:
                    error_msg += f" - {e.response.text}"
            print(error_msg)
            raise

# Flask route handlers
@app.route('/upload-template', methods=['POST'])
def upload_template_endpoint():
    """Upload template endpoint"""
    try:
        data = request.get_json()

        if not data or 'templateFilePath' not in data:
            return jsonify({
                'error': 'templateFilePath is required'
            }), 400

        template_file_path = data['templateFilePath']
        result = upload_template(template_file_path)

        return jsonify({
            'success': True,
            'message': 'Template uploaded successfully',
            'data': result
        })

    except FileNotFoundError as e:
        return jsonify({
            'error': 'File not found',
            'message': str(e)
        }), 404

    except Exception as e:
        app.logger.error(f'Error uploading template: {str(e)}')
        return jsonify({
            'error': 'Template upload failed',
            'message': str(e)
        }), 500

@app.route('/upload-file', methods=['POST'])
def upload_file_endpoint():
    """Upload template file directly via form data"""
    try:
        if 'templateFile' not in request.files:
            return jsonify({
                'error': 'No template file provided'
            }), 400

        file = request.files['templateFile']
        if file.filename == '':
            return jsonify({
                'error': 'No file selected'
            }), 400

        # Save the uploaded file temporarily
        if file:
            filename = secure_filename(file.filename)
            temp_path = os.path.join('/tmp', filename)
            file.save(temp_path)

            try:
                result = upload_template(temp_path)

                return jsonify({
                    'success': True,
                    'message': 'Template uploaded successfully',
                    'data': result
                })

            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.remove(temp_path)

    except Exception as e:
        app.logger.error(f'Error uploading file: {str(e)}')
        return jsonify({
            'error': 'File upload failed',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'template-upload'
    })

@app.route('/upload-info', methods=['GET'])
def upload_info():
    """Service information endpoint"""
    return jsonify({
        'service': 'TurboDocx Template Upload Service',
        'endpoints': {
            'POST /upload-template': 'Upload a template file (JSON with templateFilePath)',
            'POST /upload-file': 'Upload a template file (multipart form data)',
            'GET /health': 'Service health check',
            'GET /upload-info': 'Service information'
        },
        'configuration': {
            'baseUrl': BASE_URL,
            'hasToken': bool(API_TOKEN and API_TOKEN != 'YOUR_API_TOKEN'),
            'hasOrgId': bool(ORG_ID and ORG_ID != 'YOUR_ORGANIZATION_ID')
        }
    })

def demonstrate_upload():
    """Example usage function"""
    try:
        print('=== Template Upload Demonstration ===')

        template_file = './contract-template.docx'
        result = upload_template(template_file)

        print('\n=== Upload Complete ===')
        print('Template ready for deliverable generation')

        return result

    except Exception as e:
        print(f'Demonstration failed: {str(e)}')
        exit(1)

if __name__ == '__main__':
    import sys

    if '--demo' in sys.argv:
        # Run demonstration
        demonstrate_upload()
    else:
        # Start Flask server
        port = int(os.environ.get('PORT', 5001))
        host = os.environ.get('HOST', '0.0.0.0')

        print('🚀 TurboDocx Template Upload Service started')
        print(f'📡 Server listening on http://{host}:{port}')
        print('\nAvailable endpoints:')
        print(f'  POST http://{host}:{port}/upload-template')
        print(f'  POST http://{host}:{port}/upload-file')
        print(f'  GET  http://{host}:{port}/health')
        print(f'  GET  http://{host}:{port}/upload-info')

        app.run(host=host, port=port, debug=False)