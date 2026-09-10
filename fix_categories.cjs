const fs = require('fs');
const dataFile = 'src/data/portfolioData.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

content = content.replace(/'Digital & Concept Art'/g, "'Digital Art'");
fs.writeFileSync(dataFile, content);
console.log('Categories fixed in data');
