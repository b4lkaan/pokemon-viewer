const fs = require('fs');
const path = require('path');

// Source directory is one level up in the project structure
const sourceDir = path.join(__dirname, '..', 'data');

// Target directories - we need to copy to both public/data and build/data
const publicDir = path.join(__dirname, 'public', 'data');
const buildDir = path.join(__dirname, 'build', 'data');

// Create the target directories if they don't exist
[publicDir, buildDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy all JSON files from the source directory to both target directories
try {
  const files = fs.readdirSync(sourceDir)
    .filter(file => file.endsWith('.json'));
  
  console.log('Found JSON files:', files);
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    
    // Copy to public/data
    const publicPath = path.join(publicDir, file);
    fs.copyFileSync(sourcePath, publicPath);
    console.log(`Copied ${file} to public/data/`);
    
    // Copy to build/data if the build directory exists
    if (fs.existsSync(path.join(__dirname, 'build'))) {
      const buildPath = path.join(buildDir, file);
      fs.copyFileSync(sourcePath, buildPath);
      console.log(`Copied ${file} to build/data/`);
    }
  });
} catch (error) {
  console.error('Error copying data files:', error);
  process.exit(1);
}
