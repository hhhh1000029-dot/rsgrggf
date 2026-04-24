const fs = require('fs');

let content = fs.readFileSync('src/components/LayoutEditor.tsx', 'utf8');

// Replace main background
content = content.replace(/bg-black\/90/g, 'bg-cyan-400');
content = content.replace(/bg-zinc-900/g, 'bg-white cartoon-panel');
content = content.replace(/bg-zinc-800/g, 'bg-zinc-200 cartoon-border-sm');
content = content.replace(/bg-zinc-700/g, 'bg-zinc-300');

// Replace text colors
content = content.replace(/text-white/g, 'text-black');
content = content.replace(/text-zinc-400/g, 'text-zinc-700');
content = content.replace(/text-zinc-500/g, 'text-zinc-800');
content = content.replace(/text-zinc-300/g, 'text-zinc-900');

// Replace borders
content = content.replace(/border-white\/10/g, 'border-4 border-black');
content = content.replace(/border-white\/20/g, 'border-4 border-black');
content = content.replace(/border-zinc-800/g, 'border-4 border-black');

// Replace shadows
content = content.replace(/shadow-2xl/g, 'shadow-[8px_8px_0_rgba(0,0,0,1)]');

fs.writeFileSync('src/components/LayoutEditor.tsx', content);
console.log('Done replacing in LayoutEditor.tsx');
