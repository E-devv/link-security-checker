import os
import base64
import requests
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

VT_API_KEY = os.getenv("VT_API_KEY")
VT_API_URL = "https://www.virustotal.com/api/v3/urls"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/scan", methods=["POST"])
def scan_url():
    if not VT_API_KEY:
        return jsonify({"error": "VirusTotal API key is missing."}), 500

    data = request.get_json()
    if not data or "url" not in data:
        return jsonify({"error": "URL is required."}), 400

    url_to_scan = data["url"]

    # URL-safe Base64 encoding without padding
    encoded_url = base64.urlsafe_b64encode(url_to_scan.encode()).rstrip(b"=").decode()

    analysis_url = f"{VT_API_URL}/{encoded_url}"

    headers = {
        "x-apikey": VT_API_KEY
    }

    try:
        response = requests.get(analysis_url, headers=headers)

        if response.status_code == 404:
            return jsonify({
                "status": "UNKNOWN",
                "message": "URL has not been analyzed by VirusTotal"
            })

        response.raise_for_status()  # Raise an exception for other bad status codes

        analysis_result = response.json()

        stats = analysis_result.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
        malicious_count = stats.get("malicious", 0)

        status = "SAFE"
        if malicious_count > 0:
            status = "DANGER"
        elif stats.get("suspicious", 0) > 0:
            status = "WARNING"

        return jsonify({
            "status": status,
            "malicious_count": malicious_count
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to connect to VirusTotal: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
