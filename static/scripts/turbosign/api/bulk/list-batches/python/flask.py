import json
import requests
from flask import Flask, jsonify, request

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = Flask(__name__)

@app.route('/list-batches', methods=['GET'])
def list_batches():
    try:
        # Prepare query parameters
        params = {
            'limit': '20',
            'offset': '0',
            'status': 'pending,processing,completed'  # Can be single value or comma-separated
            # 'startDate': '2024-01-01',  # Optional: Filter by start date
            # 'endDate': '2024-12-31',    # Optional: Filter by end date
            # 'query': 'Q4'               # Optional: Search batches by name
        }

        # Prepare headers
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        # Send GET request
        response = requests.get(
            f'{BASE_URL}/turbosign/bulk/batches',
            headers=headers,
            params=params
        )

        result = response.json()

        if result.get('data'):
            batches_data = result['data']
            formatted_batches = []

            for batch in batches_data['batches']:
                formatted_batches.append({
                    'id': batch['id'],
                    'batchName': batch['batchName'],
                    'status': batch['status'],
                    'totalJobs': batch['totalJobs'],
                    'succeededJobs': batch['succeededJobs'],
                    'failedJobs': batch['failedJobs'],
                    'pendingJobs': batch['pendingJobs'],
                    'createdOn': batch['createdOn'],
                    'updatedOn': batch['updatedOn']
                })

            return jsonify({
                'success': True,
                'totalRecords': batches_data['totalRecords'],
                'batches': formatted_batches
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to retrieve batches'),
                'code': result.get('code')
            }), 400

    except Exception as error:
        print(f'Error retrieving batches: {error}')
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
