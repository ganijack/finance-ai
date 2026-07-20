const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(dashboard)/reports/page.tsx',
  'src/app/(dashboard)/recurring/page.tsx',
  'src/app/(dashboard)/receipts/page.tsx',
  'src/app/(dashboard)/insights/page.tsx',
  'src/app/(dashboard)/goals/page.tsx',
  'src/app/(dashboard)/calendar/page.tsx',
  'src/app/(dashboard)/budgets/page.tsx',
  'src/app/(dashboard)/analytics/page.tsx',
];

const basePath = 'd:\\personal project';

for (const file of files) {
  const filePath = path.join(basePath, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Step 1: Replace the import
  // Handle: import { formatCurrency } from "@/lib/utils";
  // Handle: import { formatCurrency, formatDate } from "@/lib/utils";  
  // Handle: import { formatCurrency, formatDateShort } from "@/lib/utils";
  
  if (content.includes('formatCurrency, ')) {
    content = content.replace(/import \{ formatCurrency, /g, 'import { ');
  } else if (content.includes(', formatCurrency ')) {
    content = content.replace(/, formatCurrency /g, ' ');
  } else if (content.includes('formatCurrency }')) {
    content = content.replace(/formatCurrency \}/g, '}');
  } else {
    // Only import is formatCurrency itself
    content = content.replace(/import \{ formatCurrency \} from "@\/lib\/utils";\n?/g, '');
  }
  
  // Step 2: Add useCurrency import (after the last import line)
  if (!content.includes('useCurrency')) {
    // Find the last import statement and add after it
    const importLine = 'import { useCurrency } from "@/components/providers/currency-provider";';
    
    // Find the position after the last import
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, importLine);
      content = lines.join('\n');
    }
  }

  // Step 3: Add the hook call inside the component function
  // Find "export default function" and add hook after the opening brace
  if (!content.includes('const { format } = useCurrency()') && !content.includes('useCurrency()')) {
    // Find the first line after "export default function ... {"
    content = content.replace(
      /(export default function \w+\([^)]*\)\s*\{)/,
      '$1\n  const { format } = useCurrency();'
    );
  }

  // Step 4: Replace all formatCurrency( with format(
  content = content.replace(/formatCurrency\(/g, 'format(');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${file}`);
}

console.log('Done! All files updated.');
