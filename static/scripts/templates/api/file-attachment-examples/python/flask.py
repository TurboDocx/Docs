from flask import Flask, request, jsonify
import requests
import json
import os

app = Flask(__name__)

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

@app.route('/upload-template-with-data', methods=['POST'])
def upload_template_with_data_file():
    """
    Upload template with Excel data file attachment and sheet selection
    This Flask endpoint demonstrates advanced template upload with data source integration
    """
    try:
        # Check if files are present
        if 'templateFile' not in request.files or 'dataFile' not in request.files:
            return jsonify({
                'error': 'Both templateFile and dataFile are required'
            }), 400

        template_file = request.files['templateFile']
        data_file = request.files['dataFile']

        if template_file.filename == '' or data_file.filename == '':
            return jsonify({
                'error': 'Both files must have filenames'
            }), 400

        # Get form parameters
        template_name = request.form.get('templateName', 'Flask Upload Template')
        template_description = request.form.get('templateDescription', 'Template uploaded via Flask API')
        selected_sheet = request.form.get('selectedSheet', 'Sheet1')
        data_range = request.form.get('dataRange', 'A1:F50')
        ai_hint = request.form.get('aiHint', '')

        # Generate unique data file ID
        data_file_id = f'flask-data-{hash(data_file.filename) % 10000}'

        # Prepare files for upload to TurboDocx API
        files = {
            'templateFile': (template_file.filename, template_file.read(), template_file.content_type),
            f'FileResource-{data_file_id}': (data_file.filename, data_file.read(), data_file.content_type)
        }

        # Reset file pointers for potential re-read
        template_file.seek(0)
        data_file.seek(0)

        # Sheet selection and data range metadata
        file_metadata = {
            data_file_id: {
                "selectedSheet": selected_sheet,
                "hasMultipleSheets": True,
                "dataRange": data_range,
                "description": "Flask API uploaded data source"
            }
        }

        # Form data for template metadata
        form_data = {
            'name': template_name,
            'description': template_description,
            'fileResourceMetadata': json.dumps(file_metadata),
            'tags': json.dumps(["flask-api", "data-enhanced", "file-attachment"])
        }

        # Add variables if AI hint is provided
        if ai_hint:
            variables = [
                {
                    "name": "Flask Generated Content",
                    "placeholder": "{FlaskContent}",
                    "aiHint": ai_hint,
                    "dataSourceId": data_file_id
                },
                {
                    "name": "Data Summary",
                    "placeholder": "{DataSummary}",
                    "aiHint": f"Summarize data from {selected_sheet} sheet, range {data_range}",
                    "dataSourceId": data_file_id
                }
            ]
            form_data['variables'] = json.dumps(variables)

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx Flask Client'
        }

        print(f'Flask: Uploading template {template_file.filename}')
        print(f'Flask: Data source {data_file.filename} (Sheet: {selected_sheet})')
        print(f'Flask: Data range: {data_range}')

        # Upload to TurboDocx API
        response = requests.post(
            f"{BASE_URL}/template/upload-and-create",
            headers=headers,
            files=files,
            data=form_data
        )

        if response.status_code != 200:
            return jsonify({
                'error': f'TurboDocx API error: {response.status_code}',
                'detail': response.text
            }), response.status_code

        result = response.json()
        template = result['data']['results']['template']

        return jsonify({
            'success': True,
            'message': 'Template with data file uploaded successfully via Flask',
            'template': {
                'id': template['id'],
                'name': template['name'],
                'variables_count': len(template.get('variables', [])),
                'data_sources_count': len(template.get('dataSources', [])),
                'default_font': template.get('defaultFont'),
                'fonts_count': len(template.get('fonts', []))
            },
            'data_source': {
                'filename': data_file.filename,
                'selected_sheet': selected_sheet,
                'data_range': data_range
            },
            'redirect_url': result['data']['results']['redirectUrl']
        })

    except Exception as e:
        app.logger.error(f'Upload error: {str(e)}')
        return jsonify({
            'error': 'Upload failed',
            'detail': str(e)
        }), 500

@app.route('/upload-multi-sheet-template', methods=['POST'])
def upload_template_with_multiple_sheets():
    """
    Example: Process multiple sheets from the same Excel file
    """
    try:
        if 'templateFile' not in request.files or 'dataFile' not in request.files:
            return jsonify({'error': 'Both templateFile and dataFile are required'}), 400

        template_file = request.files['templateFile']
        data_file = request.files['dataFile']

        template_name = request.form.get('templateName', 'Multi-Sheet Flask Template')
        primary_sheet = request.form.get('primarySheet', 'Summary')
        alternative_sheets_str = request.form.get('alternativeSheets', 'Revenue,Expenses,Projections')

        # Parse alternative sheets
        alternative_sheets = [sheet.strip() for sheet in alternative_sheets_str.split(',') if sheet.strip()]

        data_file_id = f'flask-multisheet-{hash(data_file.filename) % 10000}'

        files = {
            'templateFile': (template_file.filename, template_file.read(), template_file.content_type),
            f'FileResource-{data_file_id}': (data_file.filename, data_file.read(), data_file.content_type)
        }

        # Define multiple sheet usage
        file_metadata = {
            data_file_id: {
                "selectedSheet": primary_sheet,
                "hasMultipleSheets": True,
                "alternativeSheets": alternative_sheets,
                "dataRange": "A1:Z100",
                "description": "Flask multi-sheet data source"
            }
        }

        # Variables that reference different sheets
        variables = [
            {
                "name": "Primary Sheet Summary",
                "placeholder": "{PrimarySummary}",
                "aiHint": f"Create summary from {primary_sheet} sheet data",
                "dataSourceId": data_file_id,
                "sheetReference": primary_sheet
            }
        ]

        # Add variables for alternative sheets (limit to 3)
        for i, sheet in enumerate(alternative_sheets[:3]):
            variables.append({
                "name": f"{sheet} Analysis",
                "placeholder": f"{{{sheet.replace(' ', '')}Analysis}}",
                "aiHint": f"Analyze data trends from {sheet} sheet",
                "dataSourceId": data_file_id,
                "sheetReference": sheet
            })

        form_data = {
            'name': template_name,
            'description': 'Flask multi-sheet data analysis template',
            'fileResourceMetadata': json.dumps(file_metadata),
            'variables': json.dumps(variables),
            'tags': json.dumps(["flask-multi-sheet", "comprehensive", "data-analysis"])
        }

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx Flask Client'
        }

        response = requests.post(
            f"{BASE_URL}/template/upload-and-create",
            headers=headers,
            files=files,
            data=form_data
        )

        if response.status_code != 200:
            return jsonify({
                'error': f'TurboDocx API error: {response.status_code}',
                'detail': response.text
            }), response.status_code

        result = response.json()
        template = result['data']['results']['template']

        return jsonify({
            'success': True,
            'message': 'Multi-sheet template uploaded successfully via Flask',
            'template': {
                'id': template['id'],
                'name': template['name'],
                'sheets_referenced': [primary_sheet] + alternative_sheets,
                'variables_count': len(template.get('variables', []))
            },
            'sheets_configuration': {
                'primary_sheet': primary_sheet,
                'alternative_sheets': alternative_sheets
            }
        })

    except Exception as e:
        app.logger.error(f'Multi-sheet upload error: {str(e)}')
        return jsonify({
            'error': 'Multi-sheet upload failed',
            'detail': str(e)
        }), 500

@app.route('/', methods=['GET'])
def index():
    """
    API information endpoint
    """
    return jsonify({
        'message': 'TurboDocx Flask File Attachment API',
        'endpoints': {
            'POST /upload-template-with-data': 'Upload template with single sheet data file',
            'POST /upload-multi-sheet-template': 'Upload template with multi-sheet data file',
            'GET /': 'API information'
        },
        'example_curl': {
            'single_sheet': '''curl -X POST http://localhost:5000/upload-template-with-data \\
  -F "templateFile=@template.docx" \\
  -F "dataFile=@data.xlsx" \\
  -F "templateName=My Template" \\
  -F "selectedSheet=Sheet1" \\
  -F "dataRange=A1:F50" \\
  -F "aiHint=Generate summary from data"''',
            'multi_sheet': '''curl -X POST http://localhost:5000/upload-multi-sheet-template \\
  -F "templateFile=@template.docx" \\
  -F "dataFile=@data.xlsx" \\
  -F "templateName=Multi Sheet Template" \\
  -F "primarySheet=Summary" \\
  -F "alternativeSheets=Revenue,Expenses"'''
        }
    })

@app.errorhandler(413)
def too_large(e):
    return jsonify({
        'error': 'File too large',
        'detail': 'The uploaded file exceeds the maximum size limit'
    }), 413

if __name__ == "__main__":
    print("Starting Flask server for TurboDocx file attachment examples...")
    print("Available endpoints:")
    print("  POST /upload-template-with-data - Upload template with single sheet data")
    print("  POST /upload-multi-sheet-template - Upload template with multi-sheet data")
    print("  GET / - API information and curl examples")

    # Configure max file size (16MB)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

    app.run(debug=True, host='0.0.0.0', port=5000)