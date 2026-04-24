const fs = require('fs');

let content = fs.readFileSync('src/editor/EditorMain.tsx', 'utf8');

// Replace main background
content = content.replace(/bg-gradient-to-br from-zinc-950 via-black to-zinc-900/g, 'bg-cyan-400');
content = content.replace(/bg-zinc-950/g, 'bg-white cartoon-border');
content = content.replace(/bg-zinc-900\/50/g, 'bg-white cartoon-border-sm');
content = content.replace(/bg-zinc-900\/80/g, 'bg-white cartoon-border-sm');
content = content.replace(/bg-zinc-900\/20/g, 'bg-white/50 cartoon-border-sm');
content = content.replace(/bg-zinc-900/g, 'bg-white cartoon-panel');
content = content.replace(/bg-zinc-800\/50/g, 'bg-zinc-100 cartoon-border-sm');
content = content.replace(/bg-zinc-800/g, 'bg-zinc-200 cartoon-border-sm');
content = content.replace(/bg-zinc-700/g, 'bg-zinc-300');

// Replace text colors
content = content.replace(/text-white/g, 'text-black');
content = content.replace(/text-zinc-400/g, 'text-zinc-700');
content = content.replace(/text-zinc-500/g, 'text-zinc-800');
content = content.replace(/text-zinc-300/g, 'text-zinc-900');

// Replace borders
content = content.replace(/border-white\/10/g, 'border-4 border-black');
content = content.replace(/border-white\/5/g, 'border-b-4 border-black');
content = content.replace(/border-zinc-800\/50/g, 'border-4 border-black');
content = content.replace(/border-zinc-800/g, 'border-4 border-black');
content = content.replace(/border-zinc-700/g, 'border-4 border-black');

// Replace shadows
content = content.replace(/shadow-2xl/g, 'shadow-[8px_8px_0_rgba(0,0,0,1)]');
content = content.replace(/shadow-xl/g, 'shadow-[4px_4px_0_rgba(0,0,0,1)]');

// Replace specific button styles
content = content.replace(/hover:bg-white\/10/g, 'hover:bg-pink-400 cartoon-btn');
content = content.replace(/bg-white\/5/g, 'bg-pink-500 cartoon-btn text-white');

fs.writeFileSync('src/editor/EditorMain.tsx', content);
console.log('Done replacing in EditorMain.tsx');
