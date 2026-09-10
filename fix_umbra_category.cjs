const fs = require('fs');
const dataFile = 'src/data/portfolioData.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

const startIndex = content.indexOf('export const ARTWORKS: Artwork[] = [');
if (startIndex !== -1) {
  let before = content.substring(0, startIndex);
  let artContent = content.substring(startIndex);
  
  artContent = artContent.replace(/{\s*id:\s*'art-generated-\d+'[\s\S]*?}/g, (match) => {
    if (match.includes('Umbra Sketches')) {
      return match.replace(/category:\s*'Traditional Art'/, "category: 'Digital Art'");
    }
    return match;
  });
  
  fs.writeFileSync(dataFile, before + artContent);
  console.log('Fixed Umbra Sketches category!');
}
