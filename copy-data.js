const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'data');
const targetDir = path.join(__dirname, 'public', 'data');

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all JSON files from the source directory to the target directory
fs.readdirSync(sourceDir)
  .filter(file => file.endsWith('.json'))
  .forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file} to public/data/`);
  });
