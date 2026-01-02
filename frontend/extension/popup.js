document.getElementById('saveBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const notes = document.getElementById('notes').value;
  const btn = document.getElementById('saveBtn');
  
  status.textContent = "Connecting to Copilot...";
  btn.disabled = true;
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  try {
    const response = await fetch('http://localhost:8000/api/ingest/clip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: tab.url,
        notes: notes
      })
    });

    if (response.ok) {
      status.textContent = "✅ Success! Added to your queue.";
      status.style.color = "green";
      setTimeout(() => window.close(), 1500);
    } else {
      status.textContent = "❌ Error: Backend rejected request.";
      btn.disabled = false;
    }
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Failed to reach localhost:8000.";
    btn.disabled = false;
  }
});
