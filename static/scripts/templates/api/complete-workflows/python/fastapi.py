import os
from typing import Optional
from urllib.parse import quote

import httpx
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"
TEMPLATE_PATH = "./contract-template.docx"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "x-rapiddocx-org-id": ORG_ID,
    "User-Agent": "TurboDocx API Client",
}

app = FastAPI(title="TurboDocx Complete Workflow")


async def turbodocx(method: str, path: str, expected_status: int = 200, **kwargs) -> httpx.Response:
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.request(method, f"{BASE_URL}{path}", headers=HEADERS, **kwargs)
    if response.status_code != expected_status:
        raise HTTPException(status_code=502, detail=f"TurboDocx API error {response.status_code}: {response.text}")
    return response


async def upload_template() -> dict:
    """Path A, step 1: upload a template (upload and create answers 201 Created)."""
    with open(TEMPLATE_PATH, "rb") as template_file:
        response = await turbodocx(
            "POST",
            "/template/upload-and-create",
            expected_status=201,
            files={
                "templateFile": (
                    os.path.basename(TEMPLATE_PATH),
                    template_file,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                )
            },
            data={
                "name": "Employee Contract Template",
                "description": "Standard employee contract with variable placeholders",
                "variables": "[]",
                "tags": "[]",
            },
        )
    return response.json()["data"]["results"]["template"]


async def select_template(query: str) -> dict:
    """Path B, steps 1-2: find a template, then load its details."""
    params = {"limit": 10, "offset": 0, "query": query, "showTags": "true"}
    items = (await turbodocx("GET", "/template-item", params=params)).json()["data"]["results"]
    selected = next((item for item in items if item["type"] == "template"), None)
    if selected is None:
        raise HTTPException(status_code=404, detail=f'No template matches "{query}"')
    return (await turbodocx("GET", f"/template/{quote(selected['id'], safe='')}")).json()["data"]["results"]


async def generate_deliverable(template: dict, path_label: str) -> dict:
    """Both paths: generate a deliverable, filling each of the template's variables."""
    payload = {
        "templateId": template["id"],
        "name": f"Contract Document - Path {path_label}",
        "description": f"Employment contract generated via workflow path {path_label}",
        "variables": [
            {
                "placeholder": variable["placeholder"],
                "text": f"Sample value for {variable.get('name') or variable['placeholder']}",
                "mimeType": "text",
            }
            for variable in template.get("variables") or []
        ],
        "tags": ["api-generated"],
    }
    response = await turbodocx("POST", "/v1/deliverable", json=payload)
    return response.json()["data"]["results"]["deliverable"]


class BrowseRequest(BaseModel):
    query: Optional[str] = "contract"


@app.post("/workflow/upload")
async def workflow_upload():
    """Path A: upload a new template, then generate from it."""
    if not os.path.exists(TEMPLATE_PATH):
        raise HTTPException(status_code=400, detail=f"Template file not found: {TEMPLATE_PATH}")
    template = await upload_template()
    deliverable = await generate_deliverable(template, "A")
    return {"templateId": template["id"], "deliverableId": deliverable["id"], "download": f"/deliverables/{deliverable['id']}/download"}


@app.post("/workflow/browse")
async def workflow_browse(request: Optional[BrowseRequest] = None):
    """Path B: pick an existing template, then generate from it."""
    template = await select_template((request or BrowseRequest()).query or "contract")
    deliverable = await generate_deliverable(template, "B")
    return {"templateId": template["id"], "deliverableId": deliverable["id"], "download": f"/deliverables/{deliverable['id']}/download"}


@app.get("/deliverables/{deliverable_id}/download")
async def download_deliverable(deliverable_id: str):
    """The generated file."""
    response = await turbodocx("GET", f"/v1/deliverable/file/{quote(deliverable_id, safe='')}")
    return Response(
        content=response.content,
        media_type=response.headers.get("content-type", "application/octet-stream"),
        headers={"Content-Disposition": f'attachment; filename="deliverable-{deliverable_id}.docx"'},
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Example usage:
#   curl -X POST http://localhost:8000/workflow/upload
#   curl -X POST http://localhost:8000/workflow/browse -H "Content-Type: application/json" -d '{"query": "contract"}'
#   curl -o contract.docx http://localhost:8000/deliverables/DELIVERABLE_ID/download
