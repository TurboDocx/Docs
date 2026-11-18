import os
from typing import Optional

import httpx
import uvicorn
from fastapi import FastAPI, HTTPException
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

app = FastAPI(title="TurboDocx Template Upload")


class UploadRequest(BaseModel):
    name: Optional[str] = "Employee Contract Template"
    description: Optional[str] = "Standard employee contract with variable placeholders"


@app.post("/upload-template")
async def upload_template(request: Optional[UploadRequest] = None):
    """Path A: upload a .docx/.pptx template; TurboDocx extracts its variables."""
    request = request or UploadRequest()

    if not os.path.exists(TEMPLATE_PATH):
        raise HTTPException(status_code=400, detail=f"Template file not found: {TEMPLATE_PATH}")

    with open(TEMPLATE_PATH, "rb") as template_file:
        files = {
            "templateFile": (
                os.path.basename(TEMPLATE_PATH),
                template_file,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        }
        data = {
            "name": request.name,
            "description": request.description,
            "variables": "[]",  # Optional: pre-defined variables
            "tags": "[]",  # Optional: tag objects, e.g. [{"id": "TAG_ID"}]
        }

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{BASE_URL}/template/upload-and-create", headers=HEADERS, files=files, data=data
            )

    # Upload and create answers 201 Created
    if response.status_code != 201:
        raise HTTPException(status_code=502, detail={"error": "Template upload failed", "details": response.text})

    results = response.json()["data"]["results"]
    template = results["template"]

    return {
        "templateId": template["id"],
        "name": template["name"],
        "variables": len(template.get("variables") or []),
        "defaultFont": template.get("defaultFont"),
        "redirectUrl": results["redirectUrl"],
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Example usage:
#   curl -X POST http://localhost:8000/upload-template \
#     -H "Content-Type: application/json" \
#     -d '{"name": "Employee Contract Template"}'
