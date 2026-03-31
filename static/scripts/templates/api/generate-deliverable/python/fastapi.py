from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import uvicorn
import io

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "x-rapiddocx-org-id": ORG_ID,
    "User-Agent": "TurboDocx API Client",
    "Content-Type": "application/json",
}

# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------

class Subvariable(BaseModel):
    placeholder: str
    text: Optional[str] = None
    mimeType: Optional[str] = None


class Variable(BaseModel):
    placeholder: str
    text: Optional[str] = None
    mimeType: Optional[str] = None
    subvariables: Optional[List[Subvariable]] = None
    variableStack: Optional[Dict[str, Any]] = None


class DeliverableRequest(BaseModel):
    templateId: str
    name: str
    description: Optional[str] = ""
    variables: List[Variable]
    tags: Optional[List[str]] = []

# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------

app = FastAPI(title="TurboDocx Deliverable Generator")


@app.post("/generate")
async def generate_deliverable(request: DeliverableRequest):
    """Generate a deliverable document from a template with variable substitution."""

    url = f"{BASE_URL}/v1/deliverable"
    payload = request.model_dump(exclude_none=True)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=HEADERS, json=payload)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=f"TurboDocx API error: {exc.response.text}",
            )

    result = response.json()
    deliverable = result["data"]["results"]["deliverable"]
    return {
        "deliverableId": deliverable["id"],
        "name": deliverable["name"],
        "createdBy": deliverable["createdBy"],
        "createdOn": deliverable["createdOn"],
        "templateId": deliverable["templateId"],
    }


@app.get("/download/{deliverable_id}")
async def download_deliverable(deliverable_id: str):
    """Download the generated deliverable file."""

    url = f"{BASE_URL}/v1/deliverable/file/{deliverable_id}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=HEADERS)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=f"TurboDocx API error: {exc.response.text}",
            )

    content_type = response.headers.get("content-type", "application/octet-stream")

    return StreamingResponse(
        io.BytesIO(response.content),
        media_type=content_type,
        headers={"Content-Disposition": f'attachment; filename="{deliverable_id}.docx"'},
    )


# ---------------------------------------------------------------------------
# Example usage – run this file directly to test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Demonstrates the expected payload structure.
    # Start the server, then POST this JSON to http://localhost:8000/generate

    template_id = "0b1099cf-d7b9-41a4-822b-51b68fd4885a"

    payload = {
        "templateId": template_id,
        "name": "Employee Contract - John Smith",
        "description": "Employment contract for new senior developer",
        "variables": [
            {"placeholder": "{EmployeeName}", "text": "John Smith", "mimeType": "text"},
            {"placeholder": "{CompanyName}", "text": "TechCorp Solutions Inc.", "mimeType": "text"},
            {"placeholder": "{JobTitle}", "text": "Senior Software Engineer", "mimeType": "text"},
            {
                "mimeType": "html",
                "placeholder": "{ContactBlock}",
                "text": "<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>",
                "subvariables": [
                    {"placeholder": "{contactName}", "text": "Jane Doe", "mimeType": "text"},
                    {"placeholder": "{contactPhone}", "text": "(555) 123-4567", "mimeType": "text"},
                ],
            },
        ],
        "tags": ["hr", "contract", "employee"],
    }

    print("Example payload for POST /generate:")
    import json
    print(json.dumps(payload, indent=2))

    uvicorn.run(app, host="0.0.0.0", port=8000)
