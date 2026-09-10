const fs = require('fs');

let content = fs.readFileSync('src/data/portfolioData.ts', 'utf8');

const vodaGifEntry = `{
    id: 'art-generated-21',
    title: 'Voda GIF',
    category: 'Digital Art',
    year: '2022',
    tools: [
      'GIF Animation'
    ],
    description: 'Personal artwork exploration.',
    imageUrl: '/assets/media/Art Gallery/Voda_GIF.gif',
    featured: false
  }`;

const replacement = `{
    id: 'art-animations-group',
    title: 'Animations & GIFs',
    category: 'Digital Art',
    year: '2022-2024',
    tools: [
      'GIF Animation',
      'Sprite Work'
    ],
    description: 'A collection of animated sprites and short visual loops.',
    imageUrl: '/assets/media/Art Gallery/Voda_GIF.gif',
    gallery: [
      {
        url: '/assets/media/Art Gallery/Voda_GIF.gif',
        caption: 'Voda Animation Loop'
      },
      {
        url: '/assets/media/game-3-umbra/UmbraRun_GIF.gif',
        caption: 'Umbra Run Cycle'
      }
    ],
    featured: false
  }`;

content = content.replace(vodaGifEntry, replacement);

fs.writeFileSync('src/data/portfolioData.ts', content);
console.log("GIFs grouped.");
