from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import httpx
import json
from typing import Optional

app = FastAPI(title="TurboDocx File Attachment API")

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

@app.post("/upload-template-with-data")
async def upload_template_with_data_file(
    template_file: UploadFile = File(..., description="Main template file (DOCX/PPTX)"),
    data_file: UploadFile = File(..., description="Excel data source file"),
    template_name: str = Form(..., description="Template name"),
    template_description: str = Form(..., description="Template description"),
    selected_sheet: str = Form(default="Sheet1", description="Selected sheet name"),
    data_range: Optional[str] = Form(default=None, description="Data range (e.g., A1:F50)"),
    ai_hint: Optional[str] = Form(default=None, description="AI hint for variable generation")
):
    """
    Upload template with Excel data file attachment and sheet selection
    This FastAPI endpoint demonstrates advanced template upload with data source integration
    """
    try:
        # Generate unique data file ID
        data_file_id = f'data-{hash(data_file.filename) % 10000}'

        # Prepare files for upload to TurboDocx API
        files = {
            'templateFile': (template_file.filename, await template_file.read(), template_file.content_type),
            f'FileResource-{data_file_id}': (data_file.filename, await data_file.read(), data_file.content_type)
        }

        # Sheet selection and data range metadata
        file_metadata = {
            data_file_id: {
                "selectedSheet": selected_sheet,
                "hasMultipleSheets": True,
                "description": f"Data source for AI variable generation"
            }
        }

        if data_range:
            file_metadata[data_file_id]["dataRange"] = data_range

        # Form data for template metadata
        form_data = {
            'name': template_name,
            'description': template_description,
            'fileResourceMetadata': json.dumps(file_metadata),
            'tags': json.dumps(["api-upload", "data-enhanced", "fastapi"])
        }

        # Add variables if AI hint is provided
        if ai_hint:
            variables = [
                {
                    "name": "AI Generated Content",
                    "placeholder": "{AIContent}",
                    "aiHint": ai_hint,
                    "dataSourceId": data_file_id
                }
            ]
            form_data['variables'] = json.dumps(variables)

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx FastAPI Client'
        }

        print(f'Uploading template: {template_file.filename}')
        print(f'Data source: {data_file.filename} (Sheet: {selected_sheet})')
        if data_range:
            print(f'Data range: {data_range}')

        # Upload to TurboDocx API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BASE_URL}/template/upload-and-create",
                headers=headers,
                files=files,
                data=form_data
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TurboDocx API error: {response.text}"
            )

        result = response.json()
        template = result['data']['results']['template']

        return JSONResponse(content={
            "success": True,
            "message": "Template with data file uploaded successfully",
            "template": {
                "id": template["id"],
                "name": template["name"],
                "variables_count": len(template.get("variables", [])),
                "data_sources_count": len(template.get("dataSources", [])),
                "default_font": template.get("defaultFont"),
                "fonts_count": len(template.get("fonts", []))
            },
            "redirect_url": result["data"]["results"]["redirectUrl"]
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/upload-template-multi-sheet")
async def upload_template_with_multiple_sheets(
    template_file: UploadFile = File(..., description="Main template file"),
    data_file: UploadFile = File(..., description="Multi-sheet Excel file"),
    template_name: str = Form(..., description="Template name"),
    primary_sheet: str = Form(default="Summary", description="Primary sheet name"),
    alternative_sheets: str = Form(default="", description="Comma-separated alternative sheet names")
):
    """
    Example: Process multiple sheets from the same Excel file
    """
    try:
        data_file_id = f'multisheet-{hash(data_file.filename) % 10000}'

        files = {
            'templateFile': (template_file.filename, await template_file.read(), template_file.content_type),
            f'FileResource-{data_file_id}': (data_file.filename, await data_file.read(), data_file.content_type)
        }

        # Parse alternative sheets
        alt_sheets = [sheet.strip() for sheet in alternative_sheets.split(",") if sheet.strip()]

        # Define multiple sheet usage
        file_metadata = {
            data_file_id: {
                "selectedSheet": primary_sheet,
                "hasMultipleSheets": True,
                "alternativeSheets": alt_sheets,
                "dataRange": "A1:Z100",
                "description": "Multi-sheet business data"
            }
        }

        # Variables that reference different sheets
        variables = [
            {
                "name": "Primary Summary",
                "placeholder": "{PrimarySummary}",
                "aiHint": f"Create summary from {primary_sheet} sheet data",
                "dataSourceId": data_file_id,
                "sheetReference": primary_sheet
            }
        ]

        # Add variables for alternative sheets
        for sheet in alt_sheets[:2]:  # Limit to first 2 alternative sheets
            variables.append({
                "name": f"{sheet} Analysis",
                "placeholder": f"{{{sheet}Analysis}}",
                "aiHint": f"Analyze data from {sheet} sheet",
                "dataSourceId": data_file_id,
                "sheetReference": sheet
            })

        form_data = {
            'name': template_name,
            'description': 'Multi-sheet data analysis template',
            'fileResourceMetadata': json.dumps(file_metadata),
            'variables': json.dumps(variables),
            'tags': json.dumps(["multi-sheet", "comprehensive", "fastapi"])
        }

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx FastAPI Client'
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BASE_URL}/template/upload-and-create",
                headers=headers,
                files=files,
                data=form_data
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TurboDocx API error: {response.text}"
            )

        result = response.json()
        template = result['data']['results']['template']

        return JSONResponse(content={
            "success": True,
            "message": "Multi-sheet template uploaded successfully",
            "template": {
                "id": template["id"],
                "name": template["name"],
                "sheets_referenced": [primary_sheet] + alt_sheets,
                "variables_count": len(template.get("variables", []))
            }
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-sheet upload failed: {str(e)}")

@app.get("/")
async def root():
    """
    API information endpoint
    """
    return {
        "message": "TurboDocx File Attachment API",
        "endpoints": [
            "/upload-template-with-data",
            "/upload-template-multi-sheet"
        ],
        "description": "Upload templates with Excel data file attachments and sheet selection"
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server for TurboDocx file attachment examples...")
    print("Available endpoints:")
    print("  POST /upload-template-with-data - Upload template with single sheet data")
    print("  POST /upload-template-multi-sheet - Upload template with multi-sheet data")
    print("  GET / - API information")
    uvicorn.run(app, host="0.0.0.0", port=8000)