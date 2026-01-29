import requests
from fastapi import FastAPI, HTTPException

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = FastAPI()

@app.get('/audit-trail/{document_id}')
async def get_audit_trail(document_id: str):
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
            raise HTTPException(
                status_code=response.status_code,
                detail={
                    'error': result.get('error', result.get('message', 'Failed to get audit trail')),
                    'code': result.get('code')
                }
            )

        # Return the audit trail with document info
        data = result['data']
        return {
            'success': True,
            'document': data['document'],
            'auditTrail': data['auditTrail'],
            'entryCount': len(data['auditTrail'])
        }

    except HTTPException:
        raise
    except Exception as error:
        print(f'Error getting audit trail: {error}')
        raise HTTPException(
            status_code=500,
            detail={
                'error': 'Internal server error',
                'message': str(error)
            }
        )
