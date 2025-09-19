#!/usr/bin/env python3

import requests
import json
from urllib.parse import urlencode
from flask import Flask, request, jsonify

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = Flask(__name__)

def browse_templates(limit=25, offset=0, query='', show_tags=True, selected_tags=None):
    """
    Path B: Browse and Select Existing Templates
    """
    # Build query parameters
    params = {
        'limit': str(limit),
        'offset': str(offset),
        'showTags': str(show_tags).lower()
    }

    if query:
        params['query'] = query

    if selected_tags:
        for tag in selected_tags:
            # Handle multiple values for selectedTags[]
            if 'selectedTags[]' not in params:
                params['selectedTags[]'] = []
            if isinstance(params['selectedTags[]'], list):
                params['selectedTags[]'].append(tag)
            else:
                params['selectedTags[]'] = [params['selectedTags[]'], tag]

    query_string = urlencode(params, doseq=True)
    url = f"{BASE_URL}/template-item?{query_string}"

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Parse response
        result = response.json()
        data = result['data']

        print(f"Found {data['totalRecords']} templates/folders")

        return data

    except requests.exceptions.RequestException as e:
        error_msg = f"Browse failed: {str(e)}"
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                error_msg += f" - {error_data}"
            except:
                error_msg += f" - {e.response.text}"
        print(error_msg)
        raise

def get_template_details(template_id):
    """Get detailed template information"""
    url = f"{BASE_URL}/template/{template_id}"

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        result = response.json()
        template = result['data']['results']

        print(f"Template: {template['name']}")

        variable_count = len(template['variables']) if template.get('variables') else 0
        print(f"Variables: {variable_count}")

        default_font = template.get('defaultFont', 'N/A')
        print(f"Default font: {default_font}")

        return template

    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to get template details: {str(e)}"
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                error_msg += f" - {error_data}"
            except:
                error_msg += f" - {e.response.text}"
        print(error_msg)
        raise

def get_template_pdf_preview(template_id):
    """Get template PDF preview link"""
    url = f"{BASE_URL}/template/{template_id}/previewpdflink"

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        result = response.json()
        pdf_url = result['results']

        print(f"PDF Preview: {pdf_url}")

        return pdf_url

    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to get PDF preview: {str(e)}"
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                error_msg += f" - {error_data}"
            except:
                error_msg += f" - {e.response.text}"
        print(error_msg)
        raise

# Flask route handlers
@app.route('/browse-templates', methods=['GET'])
def browse_templates_endpoint():
    """Browse templates endpoint"""
    try:
        # Get query parameters
        limit = int(request.args.get('limit', 25))
        offset = int(request.args.get('offset', 0))
        query = request.args.get('query', '')
        show_tags = request.args.get('showTags', 'true').lower() == 'true'
        selected_tags = request.args.getlist('selectedTags[]')

        result = browse_templates(limit, offset, query, show_tags, selected_tags or None)

        return jsonify({
            'success': True,
            'message': 'Templates retrieved successfully',
            'data': result
        })

    except Exception as e:
        app.logger.error(f'Error browsing templates: {str(e)}')
        return jsonify({
            'error': 'Template browsing failed',
            'message': str(e)
        }), 500

@app.route('/template/<template_id>', methods=['GET'])
def get_template_details_endpoint(template_id):
    """Get template details endpoint"""
    try:
        template = get_template_details(template_id)

        return jsonify({
            'success': True,
            'message': 'Template details retrieved successfully',
            'data': template
        })

    except Exception as e:
        app.logger.error(f'Error getting template details: {str(e)}')
        return jsonify({
            'error': 'Failed to get template details',
            'message': str(e)
        }), 500

@app.route('/template/<template_id>/preview', methods=['GET'])
def get_template_pdf_preview_endpoint(template_id):
    """Get template PDF preview endpoint"""
    try:
        pdf_url = get_template_pdf_preview(template_id)

        return jsonify({
            'success': True,
            'message': 'PDF preview URL retrieved successfully',
            'data': {'pdfUrl': pdf_url}
        })

    except Exception as e:
        app.logger.error(f'Error getting PDF preview: {str(e)}')
        return jsonify({
            'error': 'Failed to get PDF preview',
            'message': str(e)
        }), 500

@app.route('/browse-workflow', methods=['POST'])
def browse_workflow_endpoint():
    """Complete browse workflow endpoint"""
    try:
        data = request.get_json() or {}
        limit = data.get('limit', 10)
        offset = data.get('offset', 0)
        query = data.get('query', 'contract')
        show_tags = data.get('showTags', True)

        # Step 1: Browse templates
        print('1. Browsing templates...')
        browse_result = browse_templates(limit, offset, query, show_tags)

        # Find a template (not a folder)
        selected_template = None
        for item in browse_result['results']:
            if item.get('type') == 'template':
                selected_template = item
                break

        if not selected_template:
            return jsonify({
                'error': 'No templates found',
                'message': 'No templates found in browse results'
            }), 404

        print(f"Selected template: {selected_template['name']} ({selected_template['id']})")

        # Step 2: Get detailed template information
        print('2. Getting template details...')
        template_details = get_template_details(selected_template['id'])

        # Step 3: Get PDF preview (optional)
        print('3. Getting PDF preview...')
        pdf_preview = get_template_pdf_preview(selected_template['id'])

        result = {
            'selectedTemplate': selected_template,
            'templateDetails': template_details,
            'pdfPreview': pdf_preview,
            'summary': {
                'templateId': template_details['id'],
                'variableCount': len(template_details['variables']) if template_details.get('variables') else 0,
                'pdfPreviewUrl': pdf_preview
            }
        }

        return jsonify({
            'success': True,
            'message': 'Browse workflow completed successfully',
            'data': result
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
        'service': 'template-browser'
    })

@app.route('/browse-info', methods=['GET'])
def browse_info():
    """Service information endpoint"""
    return jsonify({
        'service': 'TurboDocx Template Browser Service',
        'endpoints': {
            'GET /browse-templates': 'Browse available templates with filtering',
            'GET /template/<template_id>': 'Get detailed template information',
            'GET /template/<template_id>/preview': 'Get template PDF preview URL',
            'POST /browse-workflow': 'Complete browse and select workflow',
            'GET /health': 'Service health check',
            'GET /browse-info': 'Service information'
        },
        'configuration': {
            'baseUrl': BASE_URL,
            'hasToken': bool(API_TOKEN and API_TOKEN != 'YOUR_API_TOKEN'),
            'hasOrgId': bool(ORG_ID and ORG_ID != 'YOUR_ORGANIZATION_ID')
        }
    })

def demonstrate_browse_workflow():
    """Example usage function"""
    try:
        print('=== Path B: Browse and Select Template ===')

        # Step 1: Browse all templates
        print('\n1. Browsing templates...')
        browse_result = browse_templates(10, 0, 'contract', True)

        # Find a template (not a folder)
        selected_template = None
        for item in browse_result['results']:
            if item.get('type') == 'template':
                selected_template = item
                break

        if not selected_template:
            print('No templates found in browse results')
            exit(1)

        print(f"\nSelected template: {selected_template['name']} ({selected_template['id']})")

        # Step 2: Get detailed template information
        print('\n2. Getting template details...')
        template_details = get_template_details(selected_template['id'])

        # Step 3: Get PDF preview (optional)
        print('\n3. Getting PDF preview...')
        pdf_preview = get_template_pdf_preview(selected_template['id'])

        print('\n=== Template Ready for Generation ===')
        print(f"Template ID: {template_details['id']}")

        variable_count = len(template_details['variables']) if template_details.get('variables') else 0
        print(f"Variables available: {variable_count}")
        print(f"PDF Preview: {pdf_preview}")

        return {
            'templateId': template_details['id'],
            'templateDetails': template_details,
            'pdfPreview': pdf_preview
        }

    except Exception as e:
        print(f'Browsing workflow failed: {str(e)}')
        exit(1)

if __name__ == '__main__':
    import sys

    if '--demo' in sys.argv:
        # Run demonstration
        demonstrate_browse_workflow()
    else:
        # Start Flask server
        import os
        port = int(os.environ.get('PORT', 5002))
        host = os.environ.get('HOST', '0.0.0.0')

        print('🚀 TurboDocx Template Browser Service started')
        print(f'📡 Server listening on http://{host}:{port}')
        print('\nAvailable endpoints:')
        print(f'  GET  http://{host}:{port}/browse-templates')
        print(f'  GET  http://{host}:{port}/template/<template_id>')
        print(f'  GET  http://{host}:{port}/template/<template_id>/preview')
        print(f'  POST http://{host}:{port}/browse-workflow')
        print(f'  GET  http://{host}:{port}/health')
        print(f'  GET  http://{host}:{port}/browse-info')

        app.run(host=host, port=port, debug=False)