#!/usr/bin/env python3

import os
import requests
import json
import uuid
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from pathlib import Path

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024  # 25MB max file size

class AIVariableService:
    """AI-Powered Variable Generation Service"""

    def __init__(self, api_token: str, org_id: str, base_url: str = BASE_URL):
        self.api_token = api_token
        self.org_id = org_id
        self.base_url = base_url

    def generate_variable(self, **kwargs):
        """Generate AI-powered variable content with optional file attachment"""

        file_path = kwargs.get('file_path')
        file_metadata = kwargs.get('file_metadata', {})
        name = kwargs.get('name')
        placeholder = kwargs.get('placeholder')
        template_id = kwargs.get('template_id')
        ai_hint = kwargs.get('ai_hint')
        rich_text_enabled = kwargs.get('rich_text_enabled', False)

        url = f"{self.base_url}/ai/generate/variable/one"

        # Prepare headers
        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'x-rapiddocx-org-id': self.org_id,
            'User-Agent': 'TurboDocx AI Client (Flask)'
        }

        # Prepare form data
        data = {
            'name': name,
            'placeholder': placeholder,
            'aiHint': ai_hint,
            'richTextEnabled': str(rich_text_enabled).lower()
        }

        if template_id:
            data['templateId'] = template_id

        files = {}

        # Handle file attachment
        if file_path and os.path.exists(file_path):
            file_uuid = str(uuid.uuid4())
            file_path_obj = Path(file_path)

            # Open file for upload
            files[f'FileResource-{file_uuid}'] = (
                file_path_obj.name,
                open(file_path_obj, 'rb'),
                self._get_content_type(file_path_obj)
            )

            # Prepare file metadata
            default_metadata = {
                file_uuid: {
                    'contentType': 'document',
                    'hasMultipleSheets': False
                }
            }

            default_metadata[file_uuid].update(file_metadata)
            data['fileResourceMetadata'] = json.dumps(default_metadata)

        try:
            print(f"Generating AI variable: {name}")
            print(f"AI Hint: {ai_hint[:100]}...")

            response = requests.post(url, headers=headers, data=data, files=files)
            response.raise_for_status()

            result = response.json()

            print("✅ AI Variable generated successfully!")
            print(f"Content Type: {result['data']['mimeType']}")
            print(f"Generated Content: {result['data']['text'][:100]}...")

            return result

        except requests.exceptions.RequestException as e:
            error_msg = f"AI Variable generation failed: {str(e)}"
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg += f" - {error_data}"
                except:
                    error_msg += f" - {e.response.text}"
            print(f"❌ {error_msg}")
            raise

        finally:
            # Close file handles
            for file_handle in files.values():
                if hasattr(file_handle[1], 'close'):
                    file_handle[1].close()

    def _get_content_type(self, file_path: Path) -> str:
        """Get appropriate content type based on file extension"""
        extension = file_path.suffix.lower()
        content_types = {
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.xls': 'application/vnd.ms-excel',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.doc': 'application/msword',
            '.pdf': 'application/pdf',
            '.csv': 'text/csv',
            '.txt': 'text/plain',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg'
        }
        return content_types.get(extension, 'application/octet-stream')

# Initialize service
ai_service = AIVariableService(API_TOKEN, ORG_ID)

# Routes

@app.route('/ai/generate-basic', methods=['POST'])
def generate_basic():
    """Generate AI variable without file attachment"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'JSON payload required'}), 400

        required_fields = ['name', 'placeholder', 'aiHint']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        result = ai_service.generate_variable(
            name=data['name'],
            placeholder=data['placeholder'],
            ai_hint=data['aiHint'],
            template_id=data.get('templateId'),
            rich_text_enabled=data.get('richTextEnabled', False)
        )

        return jsonify({
            'success': True,
            'message': 'AI variable generated successfully',
            'data': result
        })

    except Exception as e:
        app.logger.error(f'Error in basic generation: {str(e)}')
        return jsonify({
            'error': 'AI variable generation failed',
            'message': str(e)
        }), 500

@app.route('/ai/generate-with-file', methods=['POST'])
def generate_with_file():
    """Generate AI variable with file attachment"""
    try:
        # Check for required form fields
        required_fields = ['name', 'placeholder', 'aiHint']
        missing_fields = [field for field in required_fields if not request.form.get(field)]

        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Handle file upload
        file_path = None
        if 'file' in request.files:
            file = request.files['file']
            if file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join('/tmp', filename)
                file.save(file_path)

        # Parse file metadata
        file_metadata = {}
        if request.form.get('fileMetadata'):
            try:
                file_metadata = json.loads(request.form.get('fileMetadata'))
            except json.JSONDecodeError:
                app.logger.warning('Invalid file metadata JSON, using defaults')

        result = ai_service.generate_variable(
            file_path=file_path,
            file_metadata=file_metadata,
            name=request.form['name'],
            placeholder=request.form['placeholder'],
            ai_hint=request.form['aiHint'],
            template_id=request.form.get('templateId'),
            rich_text_enabled=request.form.get('richTextEnabled', 'false').lower() == 'true'
        )

        # Clean up uploaded file
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            'success': True,
            'message': 'AI variable generated successfully with file',
            'data': result
        })

    except Exception as e:
        # Clean up on error
        if 'file_path' in locals() and file_path and os.path.exists(file_path):
            os.remove(file_path)

        app.logger.error(f'Error in file-based generation: {str(e)}')
        return jsonify({
            'error': 'AI variable generation with file failed',
            'message': str(e)
        }), 500

@app.route('/ai/generate-batch', methods=['POST'])
def generate_batch():
    """Batch generate multiple AI variables"""
    try:
        # Parse variables from form or JSON
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json()
            variables = data.get('variables', [])
            file_path = None
        else:
            variables_json = request.form.get('variables')
            if not variables_json:
                return jsonify({'error': 'Missing variables field'}), 400

            try:
                variables = json.loads(variables_json)
            except json.JSONDecodeError:
                return jsonify({'error': 'Invalid variables JSON format'}), 400

            # Handle file upload
            file_path = None
            if 'file' in request.files:
                file = request.files['file']
                if file.filename:
                    filename = secure_filename(file.filename)
                    file_path = os.path.join('/tmp', filename)
                    file.save(file_path)

        if not isinstance(variables, list):
            return jsonify({'error': 'Variables must be an array'}), 400

        # Parse file metadata
        file_metadata = {}
        metadata_str = request.form.get('fileMetadata') if request.form else None
        if metadata_str:
            try:
                file_metadata = json.loads(metadata_str)
            except json.JSONDecodeError:
                app.logger.warning('Invalid file metadata JSON, using defaults')

        results = []
        for variable in variables:
            try:
                result = ai_service.generate_variable(
                    file_path=file_path,
                    file_metadata=file_metadata,
                    name=variable.get('name'),
                    placeholder=variable.get('placeholder'),
                    ai_hint=variable.get('aiHint'),
                    template_id=variable.get('templateId'),
                    rich_text_enabled=variable.get('richTextEnabled', False)
                )
                results.append({
                    'success': True,
                    'variable': variable.get('name'),
                    'data': result
                })
            except Exception as e:
                results.append({
                    'success': False,
                    'variable': variable.get('name'),
                    'error': str(e)
                })

        # Clean up uploaded file
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            'success': True,
            'message': 'Batch AI variable generation completed',
            'results': results
        })

    except Exception as e:
        # Clean up on error
        if 'file_path' in locals() and file_path and os.path.exists(file_path):
            os.remove(file_path)

        app.logger.error(f'Error in batch generation: {str(e)}')
        return jsonify({
            'error': 'Batch AI variable generation failed',
            'message': str(e)
        }), 500

@app.route('/ai/complete-workflow', methods=['POST'])
def complete_workflow():
    """Complete AI generation and template integration workflow"""
    try:
        # Check for required form fields
        required_fields = ['variableName', 'placeholder', 'aiHint']
        missing_fields = [field for field in required_fields if not request.form.get(field)]

        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Handle file upload
        file_path = None
        if 'file' in request.files:
            file = request.files['file']
            if file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join('/tmp', filename)
                file.save(file_path)

        # Parse file metadata
        file_metadata = {}
        if request.form.get('fileMetadata'):
            try:
                file_metadata = json.loads(request.form.get('fileMetadata'))
            except json.JSONDecodeError:
                app.logger.warning('Invalid file metadata JSON, using defaults')

        # Step 1: Generate AI content
        ai_result = ai_service.generate_variable(
            file_path=file_path,
            file_metadata=file_metadata,
            name=request.form['variableName'],
            placeholder=request.form['placeholder'],
            ai_hint=request.form['aiHint'],
            template_id=request.form.get('templateId'),
            rich_text_enabled=True
        )

        # Step 2: Prepare template variables
        template_variables = [{
            'name': request.form['variableName'],
            'placeholder': request.form['placeholder'],
            'text': ai_result['data']['text'],
            'mimeType': ai_result['data']['mimeType'],
            'allowRichTextInjection': 1 if ai_result['data']['mimeType'] == 'html' else 0
        }]

        # Clean up uploaded file
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            'success': True,
            'message': 'Complete AI workflow executed successfully',
            'data': {
                'aiContent': ai_result,
                'templateVariables': template_variables,
                'summary': {
                    'variableName': request.form['variableName'],
                    'contentType': ai_result['data']['mimeType'],
                    'contentLength': len(ai_result['data']['text'])
                }
            }
        })

    except Exception as e:
        # Clean up on error
        if 'file_path' in locals() and file_path and os.path.exists(file_path):
            os.remove(file_path)

        app.logger.error(f'Error in complete workflow: {str(e)}')
        return jsonify({
            'error': 'Complete AI workflow failed',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ai-variable-generation-flask',
        'timestamp': app.logger.handlers[0].formatter.formatTime(None) if app.logger.handlers else None
    })

@app.route('/ai/info', methods=['GET'])
def service_info():
    """Service information endpoint"""
    return jsonify({
        'service': 'TurboDocx AI Variable Generation Service (Flask)',
        'endpoints': {
            'POST /ai/generate-basic': 'Generate AI variable without file attachment',
            'POST /ai/generate-with-file': 'Generate AI variable with file attachment',
            'POST /ai/generate-batch': 'Batch generate multiple AI variables',
            'POST /ai/complete-workflow': 'Complete AI generation and template integration',
            'GET /health': 'Service health check',
            'GET /ai/info': 'Service information',
            'GET /ai/examples': 'Usage examples'
        },
        'configuration': {
            'baseUrl': BASE_URL,
            'hasToken': bool(API_TOKEN and API_TOKEN != 'YOUR_API_TOKEN'),
            'hasOrgId': bool(ORG_ID and ORG_ID != 'YOUR_ORGANIZATION_ID'),
            'maxFileSize': '25MB'
        },
        'supportedFileTypes': [
            'Excel (.xlsx, .xls)',
            'Word (.docx, .doc)',
            'PDF (.pdf)',
            'CSV (.csv)',
            'Text (.txt)',
            'Images (.png, .jpg, .jpeg)'
        ]
    })

@app.route('/ai/examples', methods=['GET'])
def usage_examples():
    """Usage examples endpoint"""
    return jsonify({
        'examples': [
            {
                'name': 'Basic Generation',
                'endpoint': 'POST /ai/generate-basic',
                'contentType': 'application/json',
                'payload': {
                    'name': 'Company Overview',
                    'placeholder': '{CompanyOverview}',
                    'aiHint': 'Generate a professional company overview for a technology consulting firm',
                    'richTextEnabled': False
                }
            },
            {
                'name': 'Excel Analysis',
                'endpoint': 'POST /ai/generate-with-file',
                'contentType': 'multipart/form-data',
                'formFields': {
                    'name': 'Financial Summary',
                    'placeholder': '{FinancialSummary}',
                    'aiHint': 'Analyze Q4 financial data and generate executive summary',
                    'fileMetadata': '{"selectedSheet":"Q4 Results","hasMultipleSheets":true}',
                    'richTextEnabled': 'true',
                    'file': '[Excel file upload]'
                }
            },
            {
                'name': 'Batch Generation',
                'endpoint': 'POST /ai/generate-batch',
                'contentType': 'multipart/form-data',
                'formFields': {
                    'variables': json.dumps([
                        {
                            'name': 'Executive Summary',
                            'placeholder': '{ExecutiveSummary}',
                            'aiHint': 'Create high-level executive summary'
                        },
                        {
                            'name': 'Key Metrics',
                            'placeholder': '{KeyMetrics}',
                            'aiHint': 'Extract important KPIs and metrics'
                        }
                    ]),
                    'fileMetadata': '{"contentType":"business-data"}',
                    'file': '[Data file upload]'
                }
            }
        ],
        'curlExamples': [
            {
                'name': 'Basic Generation',
                'curl': '''curl -X POST http://localhost:5001/ai/generate-basic \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Company Overview",
    "placeholder": "{CompanyOverview}",
    "aiHint": "Generate a professional company overview",
    "richTextEnabled": false
  }\'
'''
            },
            {
                'name': 'File Upload',
                'curl': '''curl -X POST http://localhost:5001/ai/generate-with-file \\
  -F "name=Financial Summary" \\
  -F "placeholder={FinancialSummary}" \\
  -F "aiHint=Analyze financial data and create summary" \\
  -F "richTextEnabled=true" \\
  -F "fileMetadata={\\"selectedSheet\\":\\"Q4 Results\\"}" \\
  -F "file=@financial-data.xlsx"'''
            }
        ]
    })

# Error handlers
@app.errorhandler(413)
def file_too_large(e):
    return jsonify({
        'error': 'File too large',
        'message': 'Maximum file size is 25MB'
    }), 413

@app.errorhandler(500)
def internal_error(e):
    return jsonify({
        'error': 'Internal server error',
        'message': str(e)
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    host = os.environ.get('HOST', '0.0.0.0')

    print('🤖 TurboDocx AI Variable Generation Service (Flask) started')
    print(f'📡 Server listening on http://{host}:{port}')
    print('\nAvailable endpoints:')
    print(f'  POST http://{host}:{port}/ai/generate-basic')
    print(f'  POST http://{host}:{port}/ai/generate-with-file')
    print(f'  POST http://{host}:{port}/ai/generate-batch')
    print(f'  POST http://{host}:{port}/ai/complete-workflow')
    print(f'  GET  http://{host}:{port}/health')
    print(f'  GET  http://{host}:{port}/ai/info')
    print(f'  GET  http://{host}:{port}/ai/examples')

    app.run(host=host, port=port, debug=False)