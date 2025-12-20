document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const scanButton = document.getElementById('scan-button');
    const loading = document.getElementById('loading');
    const resultsContainer = document.getElementById('results-container');
    const resultCard = document.getElementById('result-card');
    const resultMessage = document.getElementById('result-message');

    scanButton.addEventListener('click', () => {
        const url = urlInput.value.trim();

        if (!url) {
            alert('Please enter a URL to scan.');
            return;
        }

        // Show loading spinner and hide previous results
        loading.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        resultCard.classList.remove('safe', 'danger', 'warning');

        fetch('/api/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Network response was not ok') });
            }
            return response.json();
        })
        .then(data => {
            loading.classList.add('hidden');
            resultsContainer.classList.remove('hidden');

            let message = `Status: ${data.status}`;
            if (data.status === 'DANGER') {
                resultCard.className = 'card danger';
                message = `This link is potentially dangerous. ${data.malicious_count} security vendors flagged this URL as malicious.`;
            } else if (data.status === 'WARNING') {
                resultCard.className = 'card warning';
                message = `This link is suspicious. Proceed with caution.`;
            } else if (data.status === 'SAFE') {
                resultCard.className = 'card safe';
                message = `This link appears to be safe.`;
            } else {
                resultCard.className = 'card warning'; // Default to warning for unknown statuses
                message = data.message || 'Could not determine the status of the link.';
            }
            resultMessage.textContent = message;
        })
        .catch(error => {
            loading.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            resultCard.className = 'card danger';
            resultMessage.textContent = `Error: ${error.message}`;
        });
    });
});