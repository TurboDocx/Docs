import os

import requests
from flask import Flask, jsonify, request

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


@app.route("/upload-template", methods=["POST"])
def upload_template():
    """Path A: upload a .docx/.pptx template; TurboDocx extracts its variables."""
    body = request.get_json(silent=True) or {}
    name = body.get("name", "Employee Contract Template")
    description = body.get("description", "Standard employee contract with variable placeholders")

    if not os.path.exists(TEMPLATE_PATH):
        return jsonify({"error": f"Template file not found: {TEMPLATE_PATH}"}), 400

    with open(TEMPLATE_PATH, "rb") as template_file:
        files = {
            "templateFile": (
                os.path.basename(TEMPLATE_PATH),
                template_file,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        }
        data = {
            "name": name,
            "description": description,
            "variables": "[]",  # Optional: pre-defined variables
            "tags": "[]",  # Optional: tag objects, e.g. [{"id": "TAG_ID"}]
        }
        response = requests.post(
            f"{BASE_URL}/template/upload-and-create", headers=HEADERS, files=files, data=data, timeout=60
        )

    # Upload and create answers 201 Created
    if response.status_code != 201:
        return jsonify({"error": "Template upload failed", "details": response.text}), 502

    results = response.json()["data"]["results"]
    template = results["template"]

    return jsonify(
        {
            "templateId": template["id"],
            "name": template["name"],
            "variables": len(template.get("variables") or []),
            "defaultFont": template.get("defaultFont"),
            "redirectUrl": results["redirectUrl"],
        }
    )


if __name__ == "__main__":
    app.run(port=5000)

# Example usage:
#   curl -X POST http://localhost:5000/upload-template \
#     -H "Content-Type: application/json" \
#     -d '{"name": "Employee Contract Template"}'
