const fs = require('fs');
const dataFile = 'src/data/portfolioData.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

const startIndex = content.indexOf('export const ARTWORKS: Artwork[] = [');
if (startIndex !== -1) {
  let before = content.substring(0, startIndex);
  let artContent = content.substring(startIndex);
  
  artContent = artContent.replace(/{\s*id:\s*'art-generated-\d+'[\s\S]*?}/g, (match) => {
    let type = 'Digital Art';
    if (match.includes('.jpg') || match.includes('.jpeg')) type = 'JPG Image';
    else if (match.includes('.png')) type = 'PNG Image';
    else if (match.includes('.gif')) type = 'GIF Animation';
    
    return match.replace(/tools:\s*\[.*?\]/, `tools: ['${type}']`);
  });
  
  fs.writeFileSync(dataFile, before + artContent);
  console.log('Fixed tools correctly');
}
