const fs = require('fs');
const { globSync } = require('glob');

const files = globSync('src/app/(dashboard)/**/*.tsx');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Remove import
  content = content.replace(/import\s*\{\s*Topbar\s*\}\s*from\s*['"]@\/components\/layout\/topbar['"];?\n?/g, '');
  
  // Remove inline Topbar: <Topbar title="..." description="..." />
  content = content.replace(/<Topbar\s+title=[^>]+(\/>|><\/Topbar>)\s*\n?/g, '');
  
  // Remove multiline Topbar:
  content = content.replace(/<Topbar\n[^\/]+(\/>|><\/Topbar>)\s*\n?/g, '');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Cleaned:', file);
    count++;
  }
});
console.log('Cleaned ' + count + ' files.');
