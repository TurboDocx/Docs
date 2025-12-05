import json
import requests
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = FastAPI()

class BatchInfo(BaseModel):
    id: str
    batchName: str
    status: str
    totalJobs: int
    succeededJobs: int
    failedJobs: int
    pendingJobs: int
    createdOn: str
    updatedOn: str

class ListBatchesResponse(BaseModel):
    success: bool
    totalRecords: int
    batches: List[BatchInfo]

@app.get('/list-batches', response_model=ListBatchesResponse)
async def list_batches(
    limit: Optional[int] = Query(20, description="Number of batches to return"),
    offset: Optional[int] = Query(0, description="Number of batches to skip"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    try:
        # Prepare query parameters
        params = {
            'limit': str(limit),
            'offset': str(offset)
        }

        if status:
            params['status'] = status

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
            return ListBatchesResponse(
                success=True,
                totalRecords=batches_data['totalRecords'],
                batches=[BatchInfo(**batch) for batch in batches_data['batches']]
            )
        else:
            raise HTTPException(
                status_code=400,
                detail={
                    'error': result.get('error', 'Failed to retrieve batches'),
                    'code': result.get('code')
                }
            )

    except HTTPException:
        raise
    except Exception as error:
        print(f'Error retrieving batches: {error}')
        raise HTTPException(
            status_code=500,
            detail={
                'error': 'Internal server error',
                'message': str(error)
            }
        )
