import requests
from flask import Flask, request, jsonify, Response

app = Flask(__name__)

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "x-rapiddocx-org-id": ORG_ID,
    "Content-Type": "application/json",
}


@app.route("/generate", methods=["POST"])
def generate_deliverable():
    """Generate a deliverable document from a template with variable substitution."""
    data = request.get_json()
    template_id = data.get("templateId")

    if not template_id:
        return jsonify({"error": "templateId is required"}), 400

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
        "replaceFonts": True,
    }

    try:
        response = requests.post(
            f"{BASE_URL}/v1/deliverable", headers=HEADERS, json=payload
        )
        response.raise_for_status()

        result = response.json()
        deliverable = result["data"]["results"]["deliverable"]

        return jsonify(
            {
                "message": "Deliverable generated successfully",
                "deliverable": {
                    "id": deliverable["id"],
                    "name": deliverable["name"],
                    "createdBy": deliverable["createdBy"],
                    "createdOn": deliverable["createdOn"],
                    "templateId": deliverable["templateId"],
                },
            }
        ), 201

    except requests.exceptions.RequestException as e:
        error_body = e.response.text if hasattr(e, "response") and e.response is not None else str(e)
        return jsonify({"error": "Failed to generate deliverable", "details": error_body}), 502


@app.route("/download/<deliverable_id>", methods=["GET"])
def download_deliverable(deliverable_id):
    """Download the generated deliverable file."""
    try:
        response = requests.get(
            f"{BASE_URL}/v1/deliverable/file/{deliverable_id}", headers=HEADERS
        )
        response.raise_for_status()

        return Response(
            response.content,
            content_type=response.headers.get("content-type", "application/octet-stream"),
            headers={
                "Content-Disposition": f'attachment; filename="deliverable-{deliverable_id}.docx"'
            },
        )

    except requests.exceptions.RequestException as e:
        error_body = e.response.text if hasattr(e, "response") and e.response is not None else str(e)
        return jsonify({"error": "Failed to download deliverable", "details": error_body}), 502


if __name__ == "__main__":
    app.run()
