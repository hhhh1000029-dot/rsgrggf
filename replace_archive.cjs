const fs = require('fs');

let content = fs.readFileSync('src/editor/ArchiveModals.tsx', 'utf8');

// Replace main background
content = content.replace(/bg-zinc-900/g, 'bg-white cartoon-panel');
content = content.replace(/bg-zinc-800/g, 'bg-zinc-200 cartoon-border-sm');
content = content.replace(/bg-zinc-950/g, 'bg-white cartoon-border');

// Replace text colors
content = content.replace(/text-white/g, 'text-black');
content = content.replace(/text-zinc-400/g, 'text-zinc-700');
content = content.replace(/text-zinc-500/g, 'text-zinc-800');

// Replace borders
content = content.replace(/border-white\/10/g, 'border-4 border-black');
content = content.replace(/border-white\/5/g, 'border-b-4 border-black');
content = content.replace(/border-zinc-800/g, 'border-4 border-black');

// Replace shadows
content = content.replace(/shadow-2xl/g, 'shadow-[8px_8px_0_rgba(0,0,0,1)]');

fs.writeFileSync('src/editor/ArchiveModals.tsx', content);
console.log('Done replacing in ArchiveModals.tsx');
