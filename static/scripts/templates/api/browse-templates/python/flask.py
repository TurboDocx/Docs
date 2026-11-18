from urllib.parse import quote

import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "x-rapiddocx-org-id": ORG_ID,
    "User-Agent": "TurboDocx API Client",
}


class TurboDocxError(Exception):
    pass


def turbodocx_get(path, params=None):
    response = requests.get(f"{BASE_URL}{path}", headers=HEADERS, params=params, timeout=30)
    if response.status_code != 200:
        raise TurboDocxError(f"TurboDocx API error {response.status_code}: {response.text}")
    return response.json()


@app.errorhandler(TurboDocxError)
def handle_turbodocx_error(error):
    return jsonify({"error": str(error)}), 502


@app.route("/templates", methods=["GET"])
def browse_templates():
    """Path B: browse templates and folders."""
    # A list of tuples repeats selectedTags once per tag ID (?selectedTags=<id>&selectedTags=<id>)
    params = [
        ("limit", request.args.get("limit", "25")),
        ("offset", request.args.get("offset", "0")),
        ("showTags", "true"),
    ]
    if request.args.get("query"):
        params.append(("query", request.args["query"]))
    params += [("selectedTags", tag_id) for tag_id in request.args.getlist("selectedTags")]

    data = turbodocx_get("/template-item", params)["data"]

    return jsonify(
        {
            "totalRecords": data["totalRecords"],
            "templates": [item for item in data["results"] if item["type"] == "template"],
            "folders": [item for item in data["results"] if item["type"] == "folder"],
        }
    )


@app.route("/templates/<template_id>", methods=["GET"])
def get_template(template_id):
    """Template details (variables, fonts) and its PDF preview link."""
    template_path = f"/template/{quote(template_id, safe='')}"
    template = turbodocx_get(template_path)["data"]["results"]
    preview = turbodocx_get(f"{template_path}/previewpdflink")

    return jsonify(
        {
            "id": template["id"],
            "name": template["name"],
            "defaultFont": template.get("defaultFont"),
            "variables": template.get("variables") or [],
            "pdfPreviewUrl": preview["results"],
        }
    )


if __name__ == "__main__":
    app.run(port=5000)

# Example usage:
#   curl "http://localhost:5000/templates?query=contract"
#   curl http://localhost:5000/templates/TEMPLATE_ID
