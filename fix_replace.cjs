const fs = require('fs');

function fixFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(/bg-pink-500 cartoon-btn text-white0/g, 'bg-white/50');
  content = content.replace(/hover:bg-pink-400 cartoon-btn rounded-xl text-zinc-700 hover:text-black/g, 'hover:bg-pink-400 rounded-xl text-black');
  content = content.replace(/bg-pink-500 cartoon-btn text-white rounded-lg border border-4 border-black/g, 'bg-pink-500 text-white rounded-lg border-4 border-black');
  fs.writeFileSync(filename, content);
  console.log('Fixed ' + filename);
}

fixFile('src/editor/EditorMain.tsx');
fixFile('src/editor/VNEditor.tsx');
fixFile('src/components/LayoutEditor.tsx');
fixFile('src/editor/ArchiveModals.tsx');
