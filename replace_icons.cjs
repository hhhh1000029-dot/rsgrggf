const fs = require('fs');

function updateIcons(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  
  // Find all <IconName className="..." /> and add strokeWidth={3}
  // This is a bit tricky with regex, but we can try to match <[A-Z][a-zA-Z]* className=... />
  // Actually, let's just replace `<([A-Z][a-zA-Z0-9]*)([^>]*?)>` with `<$1$2 strokeWidth={3}>`
  // But only for lucide icons. We know the imports from lucide-react.
  
  const lucideImportsMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
  if (lucideImportsMatch) {
    const icons = lucideImportsMatch[1].split(',').map(s => s.trim().split(' ')[0]).filter(s => s);
    
    icons.forEach(icon => {
      if (icon === 'Type' || icon === 'Image') return; // Avoid matching standard HTML/React components if any overlap, though usually safe.
      // Replace <Icon ...> with <Icon strokeWidth={3} ...>
      // We need to be careful not to add it multiple times.
      const regex = new RegExp(`<${icon}\\s+([^>]*?)>`, 'g');
      content = content.replace(regex, (match, p1) => {
        if (p1.includes('strokeWidth')) return match;
        return `<${icon} strokeWidth={3} ${p1}>`;
      });
      
      const regex2 = new RegExp(`<${icon}>`, 'g');
      content = content.replace(regex2, `<${icon} strokeWidth={3}>`);
    });
  }

  fs.writeFileSync(filename, content);
  console.log('Done updating icons in ' + filename);
}

updateIcons('src/editor/EditorMain.tsx');
updateIcons('src/editor/VNEditor.tsx');
updateIcons('src/components/LayoutEditor.tsx');
updateIcons('src/editor/ArchiveModals.tsx');
