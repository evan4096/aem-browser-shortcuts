// Get all shortcut buttons
const shortcutButtons = document.querySelectorAll('.shortcut-btn');
const statusEl = document.getElementById('status');

// Show status message
function showStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  if (message) {
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'status';
    }, 3000);
  }
}

// Execute shortcut code in the active tab
async function executeShortcut(shortcutName) {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showStatus('No active tab found', 'error');
      return;
    }

    // Check if we can inject into this tab (chrome:// pages, etc. are restricted)
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
      showStatus('Cannot run on this page', 'error');
      return;
    }

    // Inject the shortcut script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [`${shortcutName}.js`]
    });

    showStatus('Shortcut executed', 'success');
    
    // Close popup after a short delay
    setTimeout(() => {
      window.close();
    }, 500);
  } catch (error) {
    console.error('Error executing shortcut:', error);
    showStatus('Error: ' + error.message, 'error');
  }
}

// Add click handlers to all buttons
shortcutButtons.forEach(button => {
  button.addEventListener('click', () => {
    const shortcutName = button.getAttribute('data-shortcut');
    executeShortcut(shortcutName);
  });
});
