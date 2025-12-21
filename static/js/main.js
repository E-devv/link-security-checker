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

            if (data.status === 'DANGER') {
                resultCard.className = 'card danger';
            } else if (data.status === 'WARNING' || data.status === 'UNKNOWN') {
                resultCard.className = 'card warning';
            } else if (data.status === 'SAFE') {
                resultCard.className = 'card safe';
            } else {
                resultCard.className = 'card warning';
            }
            resultMessage.textContent = data.message;
        })
        .catch(error => {
            loading.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            resultCard.className = 'card danger';
            resultMessage.textContent = `Error: ${error.message}`;
        });
    });
});