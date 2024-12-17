function updateUrlList() {
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = '';
    
    urls.forEach(url => {
        const urlTag = document.createElement('div');
        urlTag.className = 'url-tag';
        urlTag.innerHTML = `
            <span>${url}</span>
            <button onclick="removeUrl('${url}')">&times;</button>
        `;
        urlList.appendChild(urlTag);
    });
}

async function ingestUrls() {
    if (urls.size === 0) {
        showStatus('Please add at least one URL', 'error');
        return;
    }

    const button = document.getElementById('ingestButton');
    button.classList.add('loading');
    button.disabled = true;

    try {
        const response = await fetch('/api/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: Array.from(urls) })
        });

        const data = await response.json();
        
        if (data.success) {
            showStatus('URLs ingested successfully', 'success');
            urls.clear();
            updateUrlList();
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

async function sendQuery() {
    const queryInput = document.getElementById('queryInput');
    const query = queryInput.value.trim();
    
    if (!query) return;
    
    addMessage(query, 'user');
    queryInput.value = '';
    queryInput.disabled = true;

    try {
        const response = await fetch('/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        
        if (data.success) {
            addMessage(data.response, 'assistant');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        queryInput.disabled = false;
        queryInput.focus();
    }
}

function addMessage(text, sender) {
    const chatHistory = document.getElementById('chatHistory');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status-bar status-${type}`;
    setTimeout(() => {
        status.textContent = '';
        status.className = 'status-bar';
    }, 5000);
}

// Handle Enter key in inputs
document.getElementById('urlInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addUrl();
});

document.getElementById('queryInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendQuery();
});
