const fs = require('fs');

function colorize(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  
  const colors = ['bg-pink-400', 'bg-lime-400', 'bg-orange-400', 'bg-cyan-400', 'bg-yellow-400'];
  let colorIndex = 0;
  
  // Replace bg-zinc-200 with a rotating colorful background
  content = content.replace(/bg-zinc-200/g, () => {
    const color = colors[colorIndex % colors.length];
    colorIndex++;
    return color;
  });

  // Replace bg-zinc-300 with a rotating colorful background
  content = content.replace(/bg-zinc-300/g, () => {
    const color = colors[colorIndex % colors.length];
    colorIndex++;
    return color;
  });

  fs.writeFileSync(filename, content);
  console.log('Colorized ' + filename);
}

colorize('src/editor/EditorMain.tsx');
colorize('src/editor/VNEditor.tsx');
colorize('src/components/LayoutEditor.tsx');
colorize('src/editor/ArchiveModals.tsx');
