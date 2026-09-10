const fs = require('fs');
const dataFile = 'src/data/portfolioData.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

const startIndex = content.indexOf('export const ARTWORKS: Artwork[] = [');
if (startIndex !== -1) {
  let before = content.substring(0, startIndex);
  let artContent = content.substring(startIndex);
  
  artContent = artContent.replace(/{\s*id:\s*'art-generated-\d+'[\s\S]*?}/g, (match) => {
    let newCategory = 'Digital Art'; // Default
    
    // Check if it's hand drawn (usually .jpg files from scanner or camera)
    if (match.includes('.jpg') || match.includes('.jpeg') || match.includes('sketches') || match.includes('hands')) {
      newCategory = 'Traditional Art';
    } else if (match.includes('Donut')) {
      newCategory = '3D Models';
    }
    
    // Replace category
    return match.replace(/category:\s*'[^']+'/, `category: '${newCategory}'`);
  });
  
  fs.writeFileSync(dataFile, before + artContent);
  console.log('Fixed categories based on file types!');
}
