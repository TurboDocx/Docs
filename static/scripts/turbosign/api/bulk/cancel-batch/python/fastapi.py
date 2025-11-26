import json
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
BATCH_ID = "YOUR_BATCH_ID"  # Replace with actual batch ID to cancel

app = FastAPI()

class CancelBatchResponse(BaseModel):
    success: bool
    batchId: str
    status: str
    message: str
    cancelledJobs: int
    succeededJobs: int
    refundedCredits: int

@app.post('/cancel-batch', response_model=CancelBatchResponse)
async def cancel_batch():
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
            return CancelBatchResponse(
                success=True,
                batchId=result['batchId'],
                status=result['status'],
                message=result['message'],
                cancelledJobs=result['cancelledJobs'],
                succeededJobs=result['succeededJobs'],
                refundedCredits=result['refundedCredits']
            )
        else:
            raise HTTPException(
                status_code=400,
                detail={
                    'error': result.get('error', 'Failed to cancel batch'),
                    'code': result.get('code')
                }
            )

    except HTTPException:
        raise
    except Exception as error:
        print(f'Error cancelling batch: {error}')
        raise HTTPException(
            status_code=500,
            detail={
                'error': 'Internal server error',
                'message': str(error)
            }
        )
