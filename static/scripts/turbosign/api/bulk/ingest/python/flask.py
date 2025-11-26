import json
import requests
from flask import Flask, jsonify

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = Flask(__name__)

@app.route('/bulk-ingest', methods=['POST'])
def bulk_ingest():
    try:
        # Prepare documents array - each document represents one signing job
        documents = [
            {
                'recipients': [
                    {
                        'name': 'John Smith',
                        'email': 'john.smith@company.com',
                        'signingOrder': 1
                    }
                ],
                'fields': [
                    {
                        'recipientEmail': 'john.smith@company.com',
                        'type': 'signature',
                        'page': 1,
                        'x': 100,
                        'y': 200,
                        'width': 200,
                        'height': 80,
                        'required': True
                    },
                    {
                        'recipientEmail': 'john.smith@company.com',
                        'type': 'date',
                        'page': 1,
                        'x': 100,
                        'y': 300,
                        'width': 150,
                        'height': 30,
                        'required': True
                    }
                ],
                'documentName': 'Employment Contract - John Smith',
                'documentDescription': 'Please review and sign your employment contract'
            },
            {
                'recipients': [
                    {
                        'name': 'Jane Doe',
                        'email': 'jane.doe@company.com',
                        'signingOrder': 1
                    }
                ],
                'fields': [
                    {
                        'recipientEmail': 'jane.doe@company.com',
                        'type': 'signature',
                        'page': 1,
                        'x': 100,
                        'y': 200,
                        'width': 200,
                        'height': 80,
                        'required': True
                    },
                    {
                        'recipientEmail': 'jane.doe@company.com',
                        'type': 'date',
                        'page': 1,
                        'x': 100,
                        'y': 300,
                        'width': 150,
                        'height': 30,
                        'required': True
                    }
                ],
                'documentName': 'Employment Contract - Jane Doe',
                'documentDescription': 'Please review and sign your employment contract'
            }
        ]

        # Prepare file
        files = {
            'file': ('contract_template.pdf', open('./contract_template.pdf', 'rb'), 'application/pdf')
        }

        # Prepare form data
        data = {
            'sourceType': 'file',
            'batchName': 'Q4 Employment Contracts',
            'documentName': 'Employment Contract',
            'documentDescription': 'Please review and sign your employment contract',
            'senderName': 'HR Department',
            'senderEmail': 'hr@company.com',
            'documents': json.dumps(documents)
        }

        # Prepare headers
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        # Send request
        response = requests.post(
            f'{BASE_URL}/turbosign/bulk/ingest',
            headers=headers,
            data=data,
            files=files
        )

        result = response.json()

        if result.get('success'):
            return jsonify({
                'success': True,
                'batchId': result['batchId'],
                'batchName': result['batchName'],
                'totalJobs': result['totalJobs'],
                'status': result['status'],
                'message': result['message']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to create bulk batch'),
                'code': result.get('code'),
                'data': result.get('data')
            }), 400

    except Exception as error:
        print(f'Error creating bulk batch: {error}')
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
