const fs = require('fs');
const code = fs.readFileSync('src/editor/EditorMain.tsx', 'utf8');
const lines = code.split('\n');

let inChartMaster = false;
let chartMasterStart = 0;
let openBraces = 0;
let openParens = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const ChartMaster: React.FC<{')) {
    inChartMaster = true;
  }
  if (inChartMaster && line.includes('}) => {')) {
    chartMasterStart = i;
    openBraces = 1; // for the { in => {
    continue;
  }
  if (inChartMaster && chartMasterStart > 0 && i > chartMasterStart) {
    let cleanLine = line.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '');
    cleanLine = cleanLine.replace(/\/\/.*/, '');
    cleanLine = cleanLine.replace(/\/\*[\s\S]*?\*\//g, '');
    
    for (let j = 0; j < cleanLine.length; j++) {
      if (cleanLine[j] === '{') openBraces++;
      if (cleanLine[j] === '}') openBraces--;
      if (cleanLine[j] === '(') openParens++;
      if (cleanLine[j] === ')') openParens--;
    }
    
    if (openBraces <= 0) {
      console.log('ChartMaster closed at line:', i + 1, 'with openBraces', openBraces);
      break;
    }
  }
}
console.log('Final openBraces:', openBraces);
console.log('Final openParens:', openParens);
