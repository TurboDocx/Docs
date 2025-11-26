import json
import requests
from fastapi import FastAPI, HTTPException, Path, Query
from pydantic import BaseModel
from typing import List, Optional, Any

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
BATCH_ID = "YOUR_BATCH_ID"  # Replace with actual batch ID

app = FastAPI()

class JobStatistics(BaseModel):
    totalJobs: int
    totalRecords: int
    succeededJobs: int
    failedJobs: int
    pendingJobs: int

class JobInfo(BaseModel):
    id: str
    batchId: str
    documentId: Optional[str]
    documentName: str
    status: str
    recipientEmails: List[str]
    attempts: int
    errorCode: Optional[str] = None
    errorMessage: Optional[str] = None
    createdOn: str
    updatedOn: str
    lastAttemptedAt: Optional[str] = None

class ListJobsResponse(BaseModel):
    success: bool
    batchId: str
    batchName: str
    batchStatus: str
    statistics: JobStatistics
    jobs: List[JobInfo]

@app.get('/list-jobs', response_model=ListJobsResponse)
async def list_jobs(
    limit: Optional[int] = Query(20, description="Number of jobs to return"),
    offset: Optional[int] = Query(0, description="Number of jobs to skip"),
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
            f'{BASE_URL}/turbosign/bulk/batch/{BATCH_ID}/jobs',
            headers=headers,
            params=params
        )

        result = response.json()

        if result.get('data'):
            jobs_data = result['data']
            return ListJobsResponse(
                success=True,
                batchId=jobs_data['batchId'],
                batchName=jobs_data['batchName'],
                batchStatus=jobs_data['batchStatus'],
                statistics=JobStatistics(
                    totalJobs=jobs_data['totalJobs'],
                    totalRecords=jobs_data['totalRecords'],
                    succeededJobs=jobs_data['succeededJobs'],
                    failedJobs=jobs_data['failedJobs'],
                    pendingJobs=jobs_data['pendingJobs']
                ),
                jobs=jobs_data['jobs']
            )
        else:
            raise HTTPException(
                status_code=400,
                detail={
                    'error': result.get('error', 'Failed to retrieve jobs'),
                    'code': result.get('code')
                }
            )

    except HTTPException:
        raise
    except Exception as error:
        print(f'Error retrieving jobs: {error}')
        raise HTTPException(
            status_code=500,
            detail={
                'error': 'Internal server error',
                'message': str(error)
            }
        )
