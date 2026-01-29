import requests
from flask import Flask, jsonify

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = Flask(__name__)

@app.route('/audit-trail/<document_id>', methods=['GET'])
def get_audit_trail(document_id):
    try:
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        response = requests.get(
            f'{BASE_URL}/turbosign/documents/{document_id}/audit-trail',
            headers=headers
        )

        result = response.json()

        if not response.ok:
            return jsonify({
                'success': False,
                'error': result.get('error', result.get('message', 'Failed to get audit trail')),
                'code': result.get('code')
            }), response.status_code

        # Return the audit trail with document info
        return jsonify({
            'success': True,
            'document': result['document'],
            'auditTrail': result['auditTrail'],
            'entryCount': len(result['auditTrail'])
        }), 200

    except Exception as error:
        print(f'Error getting audit trail: {error}')
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
