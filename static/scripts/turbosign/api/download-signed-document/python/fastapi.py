import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from io import BytesIO

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = FastAPI()

@app.get('/download/{document_id}')
async def download_signed_document(document_id: str):
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
            raise HTTPException(
                status_code=response.status_code,
                detail={
                    'error': result.get('error', result.get('message', 'Failed to get download URL')),
                    'code': result.get('code')
                }
            )

        download_url = result['downloadUrl']
        file_name = result['fileName']

        # Step 2: Download the actual file from S3
        file_response = requests.get(download_url)

        if not file_response.ok:
            raise HTTPException(
                status_code=500,
                detail={'error': 'Failed to download file from storage'}
            )

        # Return the PDF file as a streaming response
        return StreamingResponse(
            BytesIO(file_response.content),
            media_type='application/pdf',
            headers={
                'Content-Disposition': f'attachment; filename="{file_name}"'
            }
        )

    except HTTPException:
        raise
    except Exception as error:
        print(f'Error downloading document: {error}')
        raise HTTPException(
            status_code=500,
            detail={
                'error': 'Internal server error',
                'message': str(error)
            }
        )
