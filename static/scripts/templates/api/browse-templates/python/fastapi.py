from typing import List, Optional
from urllib.parse import quote

import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, Query

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "x-rapiddocx-org-id": ORG_ID,
    "User-Agent": "TurboDocx API Client",
}

app = FastAPI(title="TurboDocx Template Browser")


async def turbodocx_get(path: str, params=None):
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(f"{BASE_URL}{path}", headers=HEADERS, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"TurboDocx API error {response.status_code}: {response.text}")
    return response.json()


@app.get("/templates")
async def browse_templates(
    query: Optional[str] = None,
    limit: int = 25,
    offset: int = 0,
    selectedTags: List[str] = Query(default=[]),
):
    """Path B: browse templates and folders."""
    # A list of tuples repeats selectedTags once per tag ID (?selectedTags=<id>&selectedTags=<id>)
    params = [("limit", limit), ("offset", offset), ("showTags", "true")]
    if query:
        params.append(("query", query))
    params += [("selectedTags", tag_id) for tag_id in selectedTags]

    data = (await turbodocx_get("/template-item", params))["data"]

    return {
        "totalRecords": data["totalRecords"],
        "templates": [item for item in data["results"] if item["type"] == "template"],
        "folders": [item for item in data["results"] if item["type"] == "folder"],
    }


@app.get("/templates/{template_id}")
async def get_template(template_id: str):
    """Template details (variables, fonts) and its PDF preview link."""
    template_path = f"/template/{quote(template_id, safe='')}"
    template = (await turbodocx_get(template_path))["data"]["results"]
    preview = await turbodocx_get(f"{template_path}/previewpdflink")

    return {
        "id": template["id"],
        "name": template["name"],
        "defaultFont": template.get("defaultFont"),
        "variables": template.get("variables") or [],
        "pdfPreviewUrl": preview["results"],
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Example usage:
#   curl "http://localhost:8000/templates?query=contract"
#   curl http://localhost:8000/templates/TEMPLATE_ID
