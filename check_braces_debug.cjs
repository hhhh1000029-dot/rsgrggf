const fs = require('fs');
const code = fs.readFileSync('src/editor/EditorMain.tsx', 'utf8');
const lines = code.split('\n');

let openBraces = 1; // starting at 5746

for (let i = 5746; i <= 6068; i++) {
  const line = lines[i];
  let cleanLine = line.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '');
  cleanLine = cleanLine.replace(/\/\/.*/, '');
  cleanLine = cleanLine.replace(/\/\*[\s\S]*?\*\//g, '');
  
  for (let j = 0; j < cleanLine.length; j++) {
    if (cleanLine[j] === '{') openBraces++;
    if (cleanLine[j] === '}') openBraces--;
  }
  
  console.log(`Line ${i + 1}: ${openBraces} - ${line}`);
  if (openBraces === 0) {
    break;
  }
}
