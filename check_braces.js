const fs = require('fs');
const code = fs.readFileSync('src/editor/EditorMain.tsx', 'utf8');
const lines = code.split('\n');
let openBraces = 0;
let openParens = 0;
let inChartMaster = false;
let chartMasterStart = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const ChartMaster: React.FC<{')) {
    inChartMaster = true;
    chartMasterStart = i;
  }
  if (inChartMaster) {
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '{') openBraces++;
      if (line[j] === '}') openBraces--;
      if (line[j] === '(') openParens++;
      if (line[j] === ')') openParens--;
    }
    if (openBraces === 0 && openParens === 0 && i > chartMasterStart) {
      console.log('ChartMaster closed at line:', i + 1);
      break;
    }
  }
}
console.log('Final openBraces:', openBraces);
console.log('Final openParens:', openParens);
