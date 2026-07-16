const fs = require('fs');
const glob = require('glob');

const files = glob.globSync('src/**/*.{tsx,ts}');

let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace indigo, purple, pink colors with zinc
  // We use regex with word boundaries to only match tailwind classes
  
  content = content.replace(/\bindigo\b/g, 'zinc');
  content = content.replace(/\bpurple\b/g, 'zinc');
  content = content.replace(/\bpink\b/g, 'zinc');
  
  // Specific replacements for vibrant text/bg that we want to turn into primary or muted
  // For example, some 'from-zinc-500 to-zinc-600' might look dull, but it fits the monochrome aesthetic.
  // We can let the user's B&W request take over fully.

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated theme colors in ${file}`);
    modifiedCount++;
  }
});

console.log(`Replaced colors in ${modifiedCount} files.`);
