#!/usr/bin/env python3

import requests
import json
from typing import Optional, List
from urllib.parse import urlencode
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import uvicorn

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

app = FastAPI(
    title="TurboDocx Template Browser Service",
    description="FastAPI service for browsing and selecting templates from TurboDocx API",
    version="1.0.0"
)

class BrowseRequest(BaseModel):
    limit: Optional[int] = 10
    offset: Optional[int] = 0
    query: Optional[str] = 'contract'
    showTags: Optional[bool] = True

class BrowseResponse(BaseModel):
    success: bool
    message: str
    data: dict

class TemplateResponse(BaseModel):
    success: bool
    message: str
    data: dict

class PreviewResponse(BaseModel):
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

def browse_templates(limit: int = 25, offset: int = 0, query: str = '',
                    show_tags: bool = True, selected_tags: Optional[List[str]] = None) -> dict:
    """
    Path B: Browse and Select Existing Templates
    """
    # Build query parameters
    params = {
        'limit': str(limit),
        'offset': str(offset),
        'showTags': str(show_tags).lower()
    }

    if query:
        params['query'] = query

    if selected_tags:
        for tag in selected_tags:
            # Handle multiple values for selectedTags[]
            if 'selectedTags[]' not in params:
                params['selectedTags[]'] = []
            if isinstance(params['selectedTags[]'], list):
                params['selectedTags[]'].append(tag)
            else:
                params['selectedTags[]'] = [params['selectedTags[]'], tag]

    query_string = urlencode(params, doseq=True)
    url = f"{BASE_URL}/template-item?{query_string}"

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Parse response
        result = response.json()
        data = result['data']

        print(f"Found {data['totalRecords']} templates/folders")

        return data

    except requests.exceptions.RequestException as e:
        error_msg = f"Browse failed: {str(e)}"
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                error_msg += f" - {error_data}"
            except:
                error_msg += f" - {e.response.text}"
        print(error_msg)
        raise

def get_template_details(template_id: str) -> dict:
    """Get detailed template information"""
    url = f"{BASE_URL}/template/{template_id}"

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        result = response.json()
        template = result['data']['results']

        print(f"Template: {template['name']}")

        variable_count = len(template['variables']) if template.get('variables') else 0
        print(f"Variables: {variable_count}")

        default_font = template.get('defaultFont', 'N/A')
        print(f"Default font: {default_font}")

        return template

    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to get template details: {str(e)}"
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                error_msg += f" - {error_data}"
            except:
                error_msg += f" - {e.response.text}"
        print(error_msg)
        raise

def get_template_pdf_preview(template_id: str) -> str:
    """Get template PDF preview link"""
    url = f"{BASE_URL}/template/{template_id}/previewpdflink"

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        result = response.json()
        pdf_url = result['results']

        print(f"PDF Preview: {pdf_url}")

        return pdf_url

    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to get PDF preview: {str(e)}"
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                error_msg += f" - {error_data}"
            except:
                error_msg += f" - {e.response.text}"
        print(error_msg)
        raise

# FastAPI route handlers
@app.get("/browse-templates", response_model=BrowseResponse)
async def browse_templates_endpoint(
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    query: str = Query(''),
    showTags: bool = Query(True),
    selectedTags: Optional[List[str]] = Query(None)
):
    """Browse templates with filtering options"""
    try:
        result = browse_templates(limit, offset, query, showTags, selectedTags)

        return BrowseResponse(
            success=True,
            message="Templates retrieved successfully",
            data=result
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Template browsing failed: {str(e)}")

@app.get("/template/{template_id}", response_model=TemplateResponse)
async def get_template_details_endpoint(template_id: str):
    """Get detailed template information"""
    try:
        template = get_template_details(template_id)

        return TemplateResponse(
            success=True,
            message="Template details retrieved successfully",
            data=template
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get template details: {str(e)}")

@app.get("/template/{template_id}/preview", response_model=PreviewResponse)
async def get_template_pdf_preview_endpoint(template_id: str):
    """Get template PDF preview URL"""
    try:
        pdf_url = get_template_pdf_preview(template_id)

        return PreviewResponse(
            success=True,
            message="PDF preview URL retrieved successfully",
            data={"pdfUrl": pdf_url}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get PDF preview: {str(e)}")

@app.post("/browse-workflow", response_model=BrowseResponse)
async def browse_workflow_endpoint(request: BrowseRequest):
    """Complete browse and select workflow"""
    try:
        # Step 1: Browse templates
        print('1. Browsing templates...')
        browse_result = browse_templates(request.limit, request.offset, request.query, request.showTags)

        # Find a template (not a folder)
        selected_template = None
        for item in browse_result['results']:
            if item.get('type') == 'template':
                selected_template = item
                break

        if not selected_template:
            raise HTTPException(
                status_code=404,
                detail="No templates found in browse results"
            )

        print(f"Selected template: {selected_template['name']} ({selected_template['id']})")

        # Step 2: Get detailed template information
        print('2. Getting template details...')
        template_details = get_template_details(selected_template['id'])

        # Step 3: Get PDF preview (optional)
        print('3. Getting PDF preview...')
        pdf_preview = get_template_pdf_preview(selected_template['id'])

        result = {
            'selectedTemplate': selected_template,
            'templateDetails': template_details,
            'pdfPreview': pdf_preview,
            'summary': {
                'templateId': template_details['id'],
                'variableCount': len(template_details['variables']) if template_details.get('variables') else 0,
                'pdfPreviewUrl': pdf_preview
            }
        }

        return BrowseResponse(
            success=True,
            message="Browse workflow completed successfully",
            data=result
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Browse workflow failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "template-browser"
    }

@app.get("/browse-info", response_model=ServiceInfo)
async def browse_info():
    """Service information endpoint"""
    return ServiceInfo(
        service="TurboDocx Template Browser Service",
        endpoints={
            "GET /browse-templates": "Browse available templates with filtering",
            "GET /template/{template_id}": "Get detailed template information",
            "GET /template/{template_id}/preview": "Get template PDF preview URL",
            "POST /browse-workflow": "Complete browse and select workflow",
            "GET /health": "Service health check",
            "GET /browse-info": "Service information",
            "GET /docs": "Interactive API documentation",
            "GET /redoc": "Alternative API documentation"
        },
        configuration=ConfigurationInfo(
            baseUrl=BASE_URL,
            hasToken=bool(API_TOKEN and API_TOKEN != 'YOUR_API_TOKEN'),
            hasOrgId=bool(ORG_ID and ORG_ID != 'YOUR_ORGANIZATION_ID')
        )
    )

def demonstrate_browse_workflow():
    """Example usage function"""
    try:
        print('=== Path B: Browse and Select Template ===')

        # Step 1: Browse all templates
        print('\n1. Browsing templates...')
        browse_result = browse_templates(10, 0, 'contract', True)

        # Find a template (not a folder)
        selected_template = None
        for item in browse_result['results']:
            if item.get('type') == 'template':
                selected_template = item
                break

        if not selected_template:
            print('No templates found in browse results')
            exit(1)

        print(f"\nSelected template: {selected_template['name']} ({selected_template['id']})")

        # Step 2: Get detailed template information
        print('\n2. Getting template details...')
        template_details = get_template_details(selected_template['id'])

        # Step 3: Get PDF preview (optional)
        print('\n3. Getting PDF preview...')
        pdf_preview = get_template_pdf_preview(selected_template['id'])

        print('\n=== Template Ready for Generation ===')
        print(f"Template ID: {template_details['id']}")

        variable_count = len(template_details['variables']) if template_details.get('variables') else 0
        print(f"Variables available: {variable_count}")
        print(f"PDF Preview: {pdf_preview}")

        return {
            'templateId': template_details['id'],
            'templateDetails': template_details,
            'pdfPreview': pdf_preview
        }

    except Exception as e:
        print(f'Browsing workflow failed: {str(e)}')
        exit(1)

if __name__ == '__main__':
    import sys
    import os

    if '--demo' in sys.argv:
        # Run demonstration
        demonstrate_browse_workflow()
    else:
        # Start FastAPI server
        port = int(os.environ.get('PORT', 8002))
        host = os.environ.get('HOST', '0.0.0.0')

        print('🚀 TurboDocx Template Browser Service started')
        print(f'📡 Server listening on http://{host}:{port}')
        print('\nAvailable endpoints:')
        print(f'  GET  http://{host}:{port}/browse-templates')
        print(f'  GET  http://{host}:{port}/template/{{template_id}}')
        print(f'  GET  http://{host}:{port}/template/{{template_id}}/preview')
        print(f'  POST http://{host}:{port}/browse-workflow')
        print(f'  GET  http://{host}:{port}/health')
        print(f'  GET  http://{host}:{port}/browse-info')
        print(f'  GET  http://{host}:{port}/docs (Interactive API docs)')
        print(f'  GET  http://{host}:{port}/redoc (Alternative API docs)')

        uvicorn.run(app, host=host, port=port)