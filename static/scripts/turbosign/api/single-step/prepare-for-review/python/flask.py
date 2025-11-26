import json
import requests
from flask import Flask, jsonify

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = Flask(__name__)

@app.route('/prepare-for-review', methods=['POST'])
def prepare_document_for_review():
    try:
        # Prepare form data
        files = {
            'file': ('contract.pdf', open('./contract.pdf', 'rb'), 'application/pdf')
        }

        # Prepare form fields
        data = {
            'documentName': 'Contract Agreement',
            'documentDescription': 'Please review and sign this contract',
            'senderName': 'Your Company',
            'senderEmail': 'sender@company.com'
        }

        # Add recipients (as JSON string)
        recipients = json.dumps([
            {
                "name": "John Smith",
                "email": "john.smith@company.com",
                "signingOrder": 1
            },
            {
                "name": "Jane Doe",
                "email": "jane.doe@partner.com",
                "signingOrder": 2
            }
        ])
        data['recipients'] = recipients

        # Add fields (as JSON string) - Coordinate-based positioning
        fields = json.dumps([
            {
                "recipientEmail": "john.smith@company.com",
                "type": "signature",
                "page": 1,
                "x": 100,
                "y": 200,
                "width": 200,
                "height": 80,
                "required": True
            },
            {
                "recipientEmail": "john.smith@company.com",
                "type": "date",
                "page": 1,
                "x": 100,
                "y": 300,
                "width": 150,
                "height": 30,
                "required": True
            },
            {
                "recipientEmail": "jane.doe@partner.com",
                "type": "signature",
                "page": 1,
                "x": 350,
                "y": 200,
                "width": 200,
                "height": 80,
                "required": True
            }
        ])
        data['fields'] = fields

        # Prepare headers
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        # Send request
        response = requests.post(
            f'{BASE_URL}/turbosign/single/prepare-for-review',
            headers=headers,
            data=data,
            files=files
        )

        result = response.json()

        if result.get('success'):
            return jsonify({
                'success': True,
                'documentId': result['documentId'],
                'status': result['status'],
                'previewUrl': result['previewUrl'],
                'recipients': result['recipients'],
                'message': 'Document prepared for review successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to prepare document'),
                'code': result.get('code')
            }), 400

    except Exception as error:
        print(f'Error preparing document: {error}')
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
