const fs = require('fs');
const path = require('path');

// Source directory is within the project's public directory
const sourceDir = path.join(__dirname, 'public', 'data');
const buildDir = path.join(__dirname, 'build', 'data');

// Create the build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy all JSON files from the source directory to the build directory
try {
  const files = fs.readdirSync(sourceDir)
    .filter(file => file.endsWith('.json'));

  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const buildPath = path.join(buildDir, file);
    
    fs.copyFileSync(sourcePath, buildPath);
    console.log(`Copied ${file} to build directory`);
  });

  console.log('All data files copied successfully');
} catch (error) {
  console.error('Error copying data files:', error);
  process.exit(1);
}
