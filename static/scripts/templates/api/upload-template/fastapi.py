#!/usr/bin/env python3

import os
import requests
import json
import tempfile
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import uvicorn

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
TEMPLATE_NAME = "Employee Contract Template"

app = FastAPI(
    title="TurboDocx Template Upload Service",
    description="FastAPI service for uploading templates to TurboDocx API",
    version="1.0.0"
)

class UploadRequest(BaseModel):
    templateFilePath: str

class UploadResponse(BaseModel):
    success: bool
    message: str
    data: dict

class ConfigurationInfo(BaseModel):
    baseUrl: str
    hasToken: bool
    hasOrgId: bool

class ServiceInfo(BaseModel):
    service: str
    endpoints: dict
    configuration: ConfigurationInfo

def upload_template(template_file_path: str) -> dict:
    """
    Path A: Upload and Create Template
    Uploads a .docx/.pptx template and extracts variables automatically
    """
    # Check if file exists
    if not os.path.exists(template_file_path):
        raise FileNotFoundError(f"Template file not found: {template_file_path}")

    url = f"{BASE_URL}/template/upload-and-create"

    # Prepare files and data
    with open(template_file_path, 'rb') as file:
        files = {
            'templateFile': (os.path.basename(template_file_path), file,
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        }

        data = {
            'name': TEMPLATE_NAME,
            'description': 'Standard employee contract with variable placeholders',
            'variables': '[]',
            'tags': '["hr", "contract", "template"]'
        }

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        print(f"Uploading template: {os.path.basename(template_file_path)}")
        print(f"Template name: {TEMPLATE_NAME}")

        try:
            response = requests.post(url, files=files, data=data, headers=headers)
            response.raise_for_status()

            # Parse response
            result = response.json()
            template = result['data']['results']['template']

            print(f"✅ Template uploaded successfully: {template['id']}")
            print(f"Template name: {template['name']}")

            # Handle nullable variables field
            variable_count = len(template['variables']) if template.get('variables') else 0
            print(f"Variables extracted: {variable_count}")

            print(f"Default font: {template.get('defaultFont', 'N/A')}")

            # Handle nullable fonts field
            font_count = len(template['fonts']) if template.get('fonts') else 0
            print(f"Fonts used: {font_count}")

            print(f"Redirect to: {result['data']['results']['redirectUrl']}")
            print(f"Ready to generate documents with template: {template['id']}")

            return result

        except requests.exceptions.RequestException as e:
            error_msg = f"Upload failed: {str(e)}"
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg += f" - {error_data}"
                except:
                    error_msg += f" - {e.response.text}"
            print(error_msg)
            raise

# FastAPI route handlers
@app.post("/upload-template", response_model=UploadResponse)
async def upload_template_endpoint(request: UploadRequest):
    """Upload template from file path"""
    try:
        result = upload_template(request.templateFilePath)

        return UploadResponse(
            success=True,
            message="Template uploaded successfully",
            data=result
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Template upload failed: {str(e)}")

@app.post("/upload-file", response_model=UploadResponse)
async def upload_file_endpoint(templateFile: UploadFile = File(...)):
    """Upload template file directly"""
    try:
        # Validate file type
        if not templateFile.filename.endswith(('.docx', '.pptx')):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only .docx and .pptx files are supported."
            )

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(templateFile.filename)[1]) as temp_file:
            content = await templateFile.read()
            temp_file.write(content)
            temp_path = temp_file.name

        try:
            result = upload_template(temp_path)

            return UploadResponse(
                success=True,
                message="Template uploaded successfully",
                data=result
            )

        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "template-upload"
    }

@app.get("/upload-info", response_model=ServiceInfo)
async def upload_info():
    """Service information endpoint"""
    return ServiceInfo(
        service="TurboDocx Template Upload Service",
        endpoints={
            "POST /upload-template": "Upload a template file (JSON with templateFilePath)",
            "POST /upload-file": "Upload a template file (multipart form data)",
            "GET /health": "Service health check",
            "GET /upload-info": "Service information",
            "GET /docs": "Interactive API documentation",
            "GET /redoc": "Alternative API documentation"
        },
        configuration=ConfigurationInfo(
            baseUrl=BASE_URL,
            hasToken=bool(API_TOKEN and API_TOKEN != 'YOUR_API_TOKEN'),
            hasOrgId=bool(ORG_ID and ORG_ID != 'YOUR_ORGANIZATION_ID')
        )
    )

def demonstrate_upload():
    """Example usage function"""
    try:
        print('=== Template Upload Demonstration ===')

        template_file = './contract-template.docx'
        result = upload_template(template_file)

        print('\n=== Upload Complete ===')
        print('Template ready for deliverable generation')

        return result

    except Exception as e:
        print(f'Demonstration failed: {str(e)}')
        exit(1)

if __name__ == '__main__':
    import sys

    if '--demo' in sys.argv:
        # Run demonstration
        demonstrate_upload()
    else:
        # Start FastAPI server
        port = int(os.environ.get('PORT', 8001))
        host = os.environ.get('HOST', '0.0.0.0')

        print('🚀 TurboDocx Template Upload Service started')
        print(f'📡 Server listening on http://{host}:{port}')
        print('\nAvailable endpoints:')
        print(f'  POST http://{host}:{port}/upload-template')
        print(f'  POST http://{host}:{port}/upload-file')
        print(f'  GET  http://{host}:{port}/health')
        print(f'  GET  http://{host}:{port}/upload-info')
        print(f'  GET  http://{host}:{port}/docs (Interactive API docs)')
        print(f'  GET  http://{host}:{port}/redoc (Alternative API docs)')

        uvicorn.run(app, host=host, port=port)