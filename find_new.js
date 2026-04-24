const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      searchDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('new ')) {
          const match = lines[i].match(/new\s+([a-zA-Z0-9_]+)/);
          if (match) {
            const constructor = match[1];
            if (!['Set', 'Map', 'Date', 'Promise', 'Image', 'Blob', 'FileReader', 'Uint8Array', 'GoogleGenAI', 'Error'].includes(constructor)) {
              console.log(`${fullPath}:${i + 1}: ${lines[i].trim()}`);
            }
          }
        }
      }
    }
  }
}

searchDir('src');
