const fs = require('fs');
const code = fs.readFileSync('src/editor/EditorMain.tsx', 'utf8');
const lines = code.split('\n');

let inChartMaster = false;
let chartMasterStart = 0;
let tagStack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const ChartMaster: React.FC<{')) {
    inChartMaster = true;
    chartMasterStart = i;
  }
  if (inChartMaster && i >= 7064 && i <= 10124) {
    // very naive tag matching
    const openTags = [...line.matchAll(/<([a-zA-Z0-9_.]+)([^>]*?)>/g)];
    const closeTags = [...line.matchAll(/<\/([a-zA-Z0-9_.]+)[^>]*>/g)];
    const selfClosingTags = [...line.matchAll(/<([a-zA-Z0-9_.]+)[^>]*\/>/g)];

    for (const match of openTags) {
      if (!match[0].endsWith('/>')) {
        tagStack.push({ tag: match[1], line: i + 1 });
      }
    }
    for (const match of closeTags) {
      if (tagStack.length > 0) {
        const last = tagStack.pop();
        if (last.tag !== match[1]) {
          console.log(`Mismatch at line ${i + 1}: expected </${last.tag}> (from line ${last.line}) but got </${match[1]}>`);
        }
      } else {
        console.log(`Extra closing tag at line ${i + 1}: </${match[1]}>`);
      }
    }
  }
}
console.log('Remaining tags:', tagStack);
