// Get all shortcut buttons
const shortcutButtons = document.querySelectorAll('.shortcut-btn');
const shortcutsList = document.getElementById('shortcutsList');
const statusEl = document.getElementById('status');

const CRXDE_PATH = "/crx/de/index.jsp";
const EDITOR_PATH = "/editor.html";
const ASSETDETAILS_PATH = "/assetdetails.html";
const METADATA_PATH = "/mnt/overlay/dam/gui/content/assets/metadataeditor.external.html";
const PROPERTIES_PATH = "/mnt/overlay/wcm/core/content/sites/properties.html";
const SITES_PATH = "/sites.html";
const ASSETS_PATH = "/assets.html";
const CONTENT_PATH = "/content";

// Show status message
function showStatus(message, type = '', { persist = false } = {}) {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  if (message && !persist) {
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'status';
    }, 3000);
  }
}

function isAuthorUrl(urlString) {
  if (!urlString) return false;

  let url;
  try {
    url = new URL(urlString);
  } catch (error) {
    return false;
  }

  const path = url.pathname;
  if (path === CRXDE_PATH) return true;
  if (path === METADATA_PATH || path === PROPERTIES_PATH) return true;
  if (path.startsWith(SITES_PATH)) return true;
  if (path.startsWith(EDITOR_PATH)) return true;
  if (path.startsWith(ASSETDETAILS_PATH)) return true;
  if (path.startsWith(ASSETS_PATH)) return true;
  if (path.startsWith(CONTENT_PATH) && path !== CONTENT_PATH) return true;
  return false;
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

async function initPopup() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const isAuthorPage = isAuthorUrl(tab?.url);

    if (!isAuthorPage) {
      shortcutsList?.classList.add('is-hidden');
      showStatus('Open an AEM author page to use shortcuts.', 'info', { persist: true });
      return;
    }

    // Add click handlers to all buttons
    shortcutButtons.forEach(button => {
      button.addEventListener('click', () => {
        const shortcutName = button.getAttribute('data-shortcut');
        executeShortcut(shortcutName);
      });
    });
  } catch (error) {
    shortcutsList?.classList.add('is-hidden');
    showStatus('Unable to detect the current page.', 'error', { persist: true });
  }
}

initPopup();
