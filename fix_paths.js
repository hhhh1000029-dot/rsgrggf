const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{tsx,ts}');

const replacements = [
  { from: /'\/data\//g, to: '\'./data/' },
  { from: /'\/notes\//g, to: '\'./notes/' },
  { from: /'\/intro_logo\.png'/g, to: '\'./intro_logo.png\'' },
  { from: /'\/Menu_Bgm\.mp3'/g, to: '\'./Menu_Bgm.mp3\'' },
  { from: /'\/chapter_/g, to: '\'./chapter_' },
  { from: /'\/morning_background\.jpg'/g, to: '\'./morning_background.jpg\'' },
  { from: /'\/Evening_Background\.png'/g, to: '\'./Evening_Background.png\'' },
  { from: /'\/normal\.png'/g, to: '\'./normal.png\'' },
  { from: /'\/weird\.png'/g, to: '\'./weird.png\'' },
  { from: /\"\/intro_logo\.png\"/g, to: '\"./intro_logo.png\"' },
  { from: /\"\/normal\.png\"/g, to: '\"./normal.png\"' },
  { from: /\"\/weird\.png\"/g, to: '\"./weird.png\"' }
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Modified', file);
  }
}
