const fs = require('fs');
const code = fs.readFileSync('src/editor/EditorMain.tsx', 'utf8');
const lines = code.split('\n');

let inChartMaster = false;
let chartMasterStart = 0;
let divCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const ChartMaster: React.FC<{')) {
    inChartMaster = true;
    chartMasterStart = i;
  }
  if (inChartMaster && i >= 7064 && i <= 10124) {
    const openDivs = (line.match(/<div/g) || []).length;
    const closeDivs = (line.match(/<\/div>/g) || []).length;
    divCount += openDivs - closeDivs;
    if (divCount < 0) {
      console.log('Negative div count at line:', i + 1, line);
    }
  }
}
console.log('Final div count:', divCount);
