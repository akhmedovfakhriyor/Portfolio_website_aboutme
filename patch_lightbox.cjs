const fs = require('fs');
const file = 'src/components/ArtworkLightbox.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Add useState import
content = content.replace("import { useEffect } from 'react';", "import { useEffect, useState } from 'react';");

// Add state
content = content.replace("export function ArtworkLightbox({ artwork, artworks, onClose, onSelect }: ArtworkLightboxProps) {", "export function ArtworkLightbox({ artwork, artworks, onClose, onSelect }: ArtworkLightboxProps) {\n  const [galleryIndex, setGalleryIndex] = useState(0);\n\n  useEffect(() => {\n    setGalleryIndex(0);\n  }, [artwork?.id]);\n");

// Update main image source
content = content.replace("src={artwork.imageUrl}", "src={artwork.gallery && artwork.gallery.length > 0 ? artwork.gallery[galleryIndex] : artwork.imageUrl}");

// Add thumbnails
const thumbnailsHtml = `
          {/* Gallery Thumbnails */}
          {artwork.gallery && artwork.gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md">
              {artwork.gallery.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setGalleryIndex(idx)}
                  className={\`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer \${
                    galleryIndex === idx ? 'border-teal-400 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }\`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Thumbnail" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
`;

content = content.replace("          {/* Category overlay */}", thumbnailsHtml + "\n          {/* Category overlay */}");

// Wait, the bottom-4 category overlay will conflict with bottom-4 thumbnails.
// Move category overlay to top-left.
content = content.replace(`          {/* Category overlay */}
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-white font-mono text-xs backdrop-blur-md">
            {currentIndex + 1} of {artworks.length} // {artwork.category}
          </div>`, `          {/* Category overlay */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-white font-mono text-xs backdrop-blur-md z-20">
            {currentIndex + 1} of {artworks.length} // {artwork.category}
          </div>`);

fs.writeFileSync(file, content);
console.log('Patched Lightbox');
