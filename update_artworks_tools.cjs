const fs = require('fs');
const dataFile = 'src/data/portfolioData.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

const updatedContent = content.replace(/imageUrl:\s*'(.*?)',\s*featured:/g, (match, url) => {
  let type = 'Digital Arts';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) type = 'JPG Image';
  else if (url.endsWith('.png')) type = 'PNG Image';
  else if (url.endsWith('.gif')) type = 'GIF Animation';
  
  return `tools: ['${type}'],\n    description: 'Personal artwork exploration.',\n    imageUrl: '${url}',\n    featured:`;
}).replace(/tools:\s*\['Digital Arts'\],\s*description:\s*'Personal artwork exploration.',\s*imageUrl:/g, 'imageUrl:');

// wait, safer to just find and replace the tool array based on the URL in the same object block.
