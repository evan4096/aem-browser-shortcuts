# AEM Browser Shortcuts Chrome Extension

A Chrome extension that provides quick access to AEM (Adobe Experience Manager) shortcuts through a popup drawer.

## Features

- **CRXDE**: Opens the current page in CRXDE Lite
- **Edit**: Opens the current page in the AEM editor
- **Preview**: Opens the current page in preview mode (WCM mode disabled)
- **Sites**: Opens the current page in the Sites console
- **Properties**: Opens the properties dialog for the current page

## Development

### Prerequisites

- Node.js and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

This will:
- Generate extension icons
- Build all JavaScript files
- Copy manifest, popup files, and icons to the `dist` directory

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `dist` directory from this project
5. The extension icon should appear in your Chrome toolbar

### Usage

1. Navigate to any AEM page
2. Click the extension icon in the Chrome toolbar
3. Click on any shortcut button in the popup drawer
4. The shortcut will execute in the current tab

## Project Structure

```
src/
  js/
    crxde.js          # CRXDE shortcut
    edit.js           # Edit shortcut
    preview.js        # Preview shortcut
    sites.js          # Sites shortcut
    properties.js     # Properties shortcut
    common/           # Shared utilities and constants
  popup/
    popup.html        # Extension popup UI
    popup.css         # Popup styles
    popup.js          # Popup logic
  icons/              # Extension icons (generated)
manifest.json         # Chrome extension manifest
```

## Building

- `npm run build` - Build the extension for production
- `npm run build:icons` - Generate extension icons only
- `npm run build:js` - Build JavaScript files only
