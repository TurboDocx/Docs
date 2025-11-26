import json
import requests
from flask import Flask, jsonify, request

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
BATCH_ID = "YOUR_BATCH_ID"  # Replace with actual batch ID

app = Flask(__name__)

@app.route('/list-jobs', methods=['GET'])
def list_jobs():
    try:
        # Prepare query parameters
        params = {
            'limit': '20',
            'offset': '0'
            # 'status': 'pending,processing,succeeded,failed',  # Optional: Filter by status
            # 'query': 'john'                                   # Optional: Search by recipient name/email
        }

        # Prepare headers
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        # Send GET request
        response = requests.get(
            f'{BASE_URL}/turbosign/bulk/batch/{BATCH_ID}/jobs',
            headers=headers,
            params=params
        )

        result = response.json()

        if result.get('data'):
            jobs_data = result['data']
            formatted_jobs = []

            for job in jobs_data['jobs']:
                job_info = {
                    'id': job['id'],
                    'batchId': job['batchId'],
                    'documentId': job.get('documentId'),
                    'documentName': job['documentName'],
                    'status': job['status'],
                    'recipientEmails': job['recipientEmails'],
                    'attempts': job['attempts'],
                    'createdOn': job['createdOn'],
                    'updatedOn': job['updatedOn'],
                    'lastAttemptedAt': job.get('lastAttemptedAt')
                }
                if job.get('errorMessage'):
                    job_info['errorMessage'] = job['errorMessage']
                    job_info['errorCode'] = job['errorCode']

                formatted_jobs.append(job_info)

            return jsonify({
                'success': True,
                'batchId': jobs_data['batchId'],
                'batchName': jobs_data['batchName'],
                'batchStatus': jobs_data['batchStatus'],
                'statistics': {
                    'totalJobs': jobs_data['totalJobs'],
                    'totalRecords': jobs_data['totalRecords'],
                    'succeededJobs': jobs_data['succeededJobs'],
                    'failedJobs': jobs_data['failedJobs'],
                    'pendingJobs': jobs_data['pendingJobs']
                },
                'jobs': formatted_jobs
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to retrieve jobs'),
                'code': result.get('code')
            }), 400

    except Exception as error:
        print(f'Error retrieving jobs: {error}')
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
