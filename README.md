# Link Security Checker

Link Security Checker is a Flask-based API that allows you to scan URLs for potential security threats using the VirusTotal API. It provides a simple way to check if a link is safe before clicking on it.

## Features

- Scan URLs for malware and phishing attempts.
- Get a simple "SAFE," "DANGER," or "WARNING" status for each URL.
- Easy to integrate into other applications.

## Getting Started

### Prerequisites

- Python 3.6+
- pip

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/link-security-checker.git
    cd link-security-checker
    ```
2.  Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Create a `.env` file in the root of the project and add your VirusTotal API key:
    ```
    VT_API_KEY=your_virustotal_api_key
    ```
4.  Run the application:
    ```bash
    python app.py
    ```

## API Usage

### Scan a URL

-   **URL:** `/api/scan`
-   **Method:** `POST`
-   **Headers:** `Content-Type: application/json`
-   **Body:**
    ```json
    {
      "url": "http://example.com"
    }
    ```
-   **Response:**
    ```json
    {
      "status": "SAFE",
      "malicious_count": 0
    }
    ```

## Documentation Updates

This documentation will be updated as the project progresses.
