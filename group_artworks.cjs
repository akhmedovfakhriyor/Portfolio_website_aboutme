const fs = require('fs');
const file = 'src/data/portfolioData.ts';
let content = fs.readFileSync(file, 'utf-8');

// Update Hands
content = content.replace(/id:\s*'art-generated-6',\s*title:\s*`Hands 1`,\s*category:\s*'Traditional Art',\s*year:\s*'2024',\s*tools:\s*\['JPG Image'\],\s*description:\s*'Personal artwork exploration.',\s*imageUrl:\s*'\/assets\/media\/Art Gallery\/hands 1\.jpg',\s*featured:\s*(true|false),?/g, 
  "id: 'art-generated-6',\n    title: `Hand Sketches`,\n    category: 'Traditional Art',\n    year: '2024',\n    tools: ['JPG Image'],\n    description: 'A collection of anatomical hand studies exploring different poses and lighting.',\n    imageUrl: '/assets/media/Art Gallery/hands 1.jpg',\n    gallery: ['/assets/media/Art Gallery/hands 1.jpg', '/assets/media/Art Gallery/hands 2.jpg', '/assets/media/Art Gallery/hands 3.jpg'],\n    featured: $1,"
);

// Remove Hands 2 and 3
content = content.replace(/\s*{\s*id:\s*'art-generated-[78]',\s*title:\s*`Hands [23]`[\s\S]*?},/g, '');

// Update Umbra Sketches
content = content.replace(/id:\s*'art-generated-17',\s*title:\s*`Umbra Sketches 1`,\s*category:\s*'Digital Art',\s*year:\s*'2024',\s*tools:\s*\['PNG Image'\],\s*description:\s*'Personal artwork exploration.',\s*imageUrl:\s*'\/assets\/media\/Art Gallery\/umbra sketches 1\.png',\s*featured:\s*(true|false),?/g,
  "id: 'art-generated-17',\n    title: `Umbra Character Concept Sketches`,\n    category: 'Digital Art',\n    year: '2024',\n    tools: ['PNG Image'],\n    description: 'Initial concept exploration and dynamic poses for the Umbra project.',\n    imageUrl: '/assets/media/Art Gallery/umbra sketches 1.png',\n    gallery: ['/assets/media/Art Gallery/umbra sketches 1.png', '/assets/media/Art Gallery/umbra sketches 2.png', '/assets/media/Art Gallery/umbra sketches 3.png', '/assets/media/Art Gallery/umbra sketches 4.png'],\n    featured: $1,"
);

// Remove Umbra Sketches 2, 3, 4
content = content.replace(/\s*{\s*id:\s*'art-generated-(18|19|20)',\s*title:\s*`Umbra Sketches [234]`[\s\S]*?},/g, '');

fs.writeFileSync(file, content);
console.log('Grouped artworks');
