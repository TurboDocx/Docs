import requests
from flask import Flask, send_file, jsonify
from io import BytesIO

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = Flask(__name__)

@app.route('/download/<document_id>', methods=['GET'])
def download_signed_document(document_id):
    try:
        # Step 1: Get the presigned download URL
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        response = requests.get(
            f'{BASE_URL}/turbosign/documents/{document_id}/download',
            headers=headers
        )

        result = response.json()

        if not response.ok:
            return jsonify({
                'success': False,
                'error': result.get('error', result.get('message', 'Failed to get download URL')),
                'code': result.get('code')
            }), response.status_code

        download_url = result['downloadUrl']
        file_name = result['fileName']

        # Step 2: Download the actual file from S3
        file_response = requests.get(download_url)

        if not file_response.ok:
            return jsonify({
                'success': False,
                'error': 'Failed to download file from storage'
            }), 500

        # Return the PDF file
        return send_file(
            BytesIO(file_response.content),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=file_name
        )

    except Exception as error:
        print(f'Error downloading document: {error}')
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
