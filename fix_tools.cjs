const fs = require('fs');
const dataFile = 'src/data/portfolioData.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

const regex = /({[\s\S]*?id:\s*'art-generated-[0-9]+'[\s\S]*?})/g;

content = content.replace(regex, (match) => {
  let type = 'Digital Art';
  if (match.includes('.jpg')) type = 'JPG Image';
  if (match.includes('.png')) type = 'PNG Image';
  if (match.includes('.gif')) type = 'GIF Animation';
  
  return match.replace(/tools:\s*\['Digital Arts'\],/, `tools: ['${type}'],`);
});

fs.writeFileSync(dataFile, content);
console.log('Fixed tools');
