import json
import requests
from flask import Flask, jsonify

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
BATCH_ID = "YOUR_BATCH_ID"  # Replace with actual batch ID to cancel

app = Flask(__name__)

@app.route('/cancel-batch', methods=['POST'])
def cancel_batch():
    try:
        # Prepare headers
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client',
            'Content-Type': 'application/json'
        }

        # Send POST request to cancel batch
        response = requests.post(
            f'{BASE_URL}/turbosign/bulk/batch/{BATCH_ID}/cancel',
            headers=headers
        )

        result = response.json()

        if result.get('success'):
            return jsonify({
                'success': True,
                'batchId': result['batchId'],
                'status': result['status'],
                'message': result['message'],
                'cancelledJobs': result['cancelledJobs'],
                'succeededJobs': result['succeededJobs'],
                'refundedCredits': result['refundedCredits']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to cancel batch'),
                'code': result.get('code')
            }), 400

    except Exception as error:
        print(f'Error cancelling batch: {error}')
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
