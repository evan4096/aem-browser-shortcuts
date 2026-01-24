const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '../src/icons');
const svgSourcePath = path.join(__dirname, '../src/icon.svg');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons for each size from the SVG source
async function generateIcons() {
  // Check if source SVG exists
  if (!fs.existsSync(svgSourcePath)) {
    console.error(`Error: Source SVG not found at ${svgSourcePath}`);
    console.error('Please copy your SVG file to src/icon.svg');
    process.exit(1);
  }

  for (const size of iconSizes) {
    const outputPath = path.join(iconsDir, `icon-${size}.png`);
    
    await sharp(svgSourcePath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`Generated icon-${size}.png`);
  }
}

generateIcons().catch(console.error);
