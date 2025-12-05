import json
import requests
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = FastAPI()

class BulkIngestResponse(BaseModel):
    success: bool
    batchId: str
    batchName: str
    totalJobs: int
    status: str
    message: str

@app.post('/bulk-ingest', response_model=BulkIngestResponse)
async def bulk_ingest(file: UploadFile = File(...)):
    try:
        # Prepare documents array - each document represents one signing job
        documents = [
            {
                'recipients': [
                    {
                        'name': 'John Smith',
                        'email': 'john.smith@company.com',
                        'signingOrder': 1
                    }
                ],
                'fields': [
                    {
                        'recipientEmail': 'john.smith@company.com',
                        'type': 'signature',
                        'page': 1,
                        'x': 100,
                        'y': 200,
                        'width': 200,
                        'height': 80,
                        'required': True
                    },
                    {
                        'recipientEmail': 'john.smith@company.com',
                        'type': 'date',
                        'page': 1,
                        'x': 100,
                        'y': 300,
                        'width': 150,
                        'height': 30,
                        'required': True
                    }
                ],
                'documentName': 'Employment Contract - John Smith',
                'documentDescription': 'Please review and sign your employment contract'
            },
            {
                'recipients': [
                    {
                        'name': 'Jane Doe',
                        'email': 'jane.doe@company.com',
                        'signingOrder': 1
                    }
                ],
                'fields': [
                    {
                        'recipientEmail': 'jane.doe@company.com',
                        'type': 'signature',
                        'page': 1,
                        'x': 100,
                        'y': 200,
                        'width': 200,
                        'height': 80,
                        'required': True
                    },
                    {
                        'recipientEmail': 'jane.doe@company.com',
                        'type': 'date',
                        'page': 1,
                        'x': 100,
                        'y': 300,
                        'width': 150,
                        'height': 30,
                        'required': True
                    }
                ],
                'documentName': 'Employment Contract - Jane Doe',
                'documentDescription': 'Please review and sign your employment contract'
            }
        ]

        # Prepare file
        files = {
            'file': (file.filename, file.file, file.content_type)
        }

        # Prepare form data
        data = {
            'sourceType': 'file',
            'batchName': 'Q4 Employment Contracts',
            'documentName': 'Employment Contract',
            'documentDescription': 'Please review and sign your employment contract',
            'senderName': 'HR Department',
            'senderEmail': 'hr@company.com',
            'documents': json.dumps(documents)
        }

        # Prepare headers
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        # Send request
        response = requests.post(
            f'{BASE_URL}/turbosign/bulk/ingest',
            headers=headers,
            data=data,
            files=files
        )

        result = response.json()

        if result.get('success'):
            return BulkIngestResponse(
                success=True,
                batchId=result['batchId'],
                batchName=result['batchName'],
                totalJobs=result['totalJobs'],
                status=result['status'],
                message=result['message']
            )
        else:
            raise HTTPException(
                status_code=400,
                detail={
                    'error': result.get('error', 'Failed to create bulk batch'),
                    'code': result.get('code'),
                    'data': result.get('data')
                }
            )

    except HTTPException:
        raise
    except Exception as error:
        print(f'Error creating bulk batch: {error}')
        raise HTTPException(
            status_code=500,
            detail={
                'error': 'Internal server error',
                'message': str(error)
            }
        )
