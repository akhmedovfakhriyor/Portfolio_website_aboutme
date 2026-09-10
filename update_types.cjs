const fs = require('fs');
const file = 'src/types.ts';
let content = fs.readFileSync(file, 'utf-8');
content = content.replace(/imageUrl:\s*string;/, "imageUrl: string;\n  gallery?: string[];");
content = content.replace(/'Digital & Concept Art' \| 'UI & Visual Design' \| 'Traditional Art'/, "'Digital Art' | 'Traditional Art'");
fs.writeFileSync(file, content);
console.log('Types updated');
