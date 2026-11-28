import os
from urllib.parse import quote

import requests
from flask import Flask, Response, jsonify, request

app = Flask(__name__)

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


class TurboDocxError(Exception):
    def __init__(self, message, status=502):
        super().__init__(message)
        self.status = status


@app.errorhandler(TurboDocxError)
def handle_turbodocx_error(error):
    return jsonify({"error": str(error)}), error.status


def turbodocx(method, path, expected_status=200, **kwargs):
    response = requests.request(method, f"{BASE_URL}{path}", headers=HEADERS, timeout=60, **kwargs)
    if response.status_code != expected_status:
        raise TurboDocxError(f"TurboDocx API error {response.status_code}: {response.text}")
    return response


def upload_template():
    """Path A, step 1: upload a template (upload and create answers 201 Created)."""
    with open(TEMPLATE_PATH, "rb") as template_file:
        response = turbodocx(
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


def select_template(query):
    """Path B, steps 1-2: find a template, then load its details."""
    params = {"limit": 10, "offset": 0, "query": query, "showTags": "true"}
    items = turbodocx("GET", "/template-item", params=params).json()["data"]["results"]
    selected = next((item for item in items if item["type"] == "template"), None)
    if selected is None:
        raise TurboDocxError(f'No template matches "{query}"', status=404)
    return turbodocx("GET", f"/template/{quote(selected['id'], safe='')}").json()["data"]["results"]


def generate_deliverable(template, path_label):
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
    return turbodocx("POST", "/v1/deliverable", json=payload).json()["data"]["results"]["deliverable"]


@app.route("/workflow/upload", methods=["POST"])
def workflow_upload():
    """Path A: upload a new template, then generate from it."""
    if not os.path.exists(TEMPLATE_PATH):
        return jsonify({"error": f"Template file not found: {TEMPLATE_PATH}"}), 400
    template = upload_template()
    deliverable = generate_deliverable(template, "A")
    return jsonify({"templateId": template["id"], "deliverableId": deliverable["id"], "download": f"/deliverables/{deliverable['id']}/download"})


@app.route("/workflow/browse", methods=["POST"])
def workflow_browse():
    """Path B: pick an existing template, then generate from it. Body: {"query": "contract"}"""
    query = (request.get_json(silent=True) or {}).get("query") or "contract"
    template = select_template(query)
    deliverable = generate_deliverable(template, "B")
    return jsonify({"templateId": template["id"], "deliverableId": deliverable["id"], "download": f"/deliverables/{deliverable['id']}/download"})


@app.route("/deliverables/<deliverable_id>/download", methods=["GET"])
def download_deliverable(deliverable_id):
    """The generated file."""
    response = turbodocx("GET", f"/v1/deliverable/file/{quote(deliverable_id, safe='')}")
    return Response(
        response.content,
        mimetype=response.headers.get("content-type", "application/octet-stream"),
        headers={"Content-Disposition": f'attachment; filename="deliverable-{deliverable_id}.docx"'},
    )


if __name__ == "__main__":
    app.run(port=5000)

# Example usage:
#   curl -X POST http://localhost:5000/workflow/upload
#   curl -X POST http://localhost:5000/workflow/browse -H "Content-Type: application/json" -d '{"query": "contract"}'
#   curl -o contract.docx http://localhost:5000/deliverables/DELIVERABLE_ID/download
