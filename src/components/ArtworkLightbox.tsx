import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Artwork } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { X, ChevronLeft, ChevronRight, ZoomIn, Palette, Layers, Calendar, ExternalLink } from 'lucide-react';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  artworks: Artwork[];
  onClose: () => void;
  onSelect: (art: Artwork) => void;
}

export function ArtworkLightbox({ artwork, artworks, onClose, onSelect }: ArtworkLightboxProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    setGalleryIndex(0);
  }, [artwork?.id]);

  useEffect(() => {
    if (artwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [artwork]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!artwork) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artwork, galleryIndex, onClose, artworks, onSelect]);

  if (!artwork) return null;

  const currentIndex = artworks.findIndex((a) => a.id === artwork.id);

  const handleNext = () => {
    if (artwork.gallery && galleryIndex < artwork.gallery.length - 1) {
      setGalleryIndex(galleryIndex + 1);
    } else {
      const nextIndex = (currentIndex + 1) % artworks.length;
      onSelect(artworks[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (artwork.gallery && galleryIndex > 0) {
      setGalleryIndex(galleryIndex - 1);
    } else {
      const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
      onSelect(artworks[prevIndex]);
    }
  };

  return createPortal(
    <div
      id="artwork-lightbox-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-hidden animate-fadeIn"
      onClick={onClose}
    >
      {/* Lightbox Container */}
      <div
        className="relative w-full max-w-5xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-lightbox-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left/Middle: High-Res Image Viewport */}
        <div className="relative md:w-3/5 min-h-[260px] sm:min-h-[500px] bg-black flex items-center justify-center overflow-hidden">
          <img
            src={artwork.gallery && artwork.gallery.length > 0 ? artwork.gallery[galleryIndex] : artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full max-h-[75vh] object-contain select-none"
            referrerPolicy="no-referrer"
          />

          {/* Navigation Arrows */}
          <button
            id="lightbox-prev-btn"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110 cursor-pointer"
            aria-label="Previous Artwork"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="lightbox-next-btn"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110 cursor-pointer"
            aria-label="Next Artwork"
          >
            <ChevronRight className="w-5 h-5" />
          </button>


          {/* Gallery Thumbnails */}
          {artwork.gallery && artwork.gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md">
              {artwork.gallery.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setGalleryIndex(idx)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    galleryIndex === idx ? 'border-teal-400 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Thumbnail" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Category overlay */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-white font-mono text-xs backdrop-blur-md z-20">
            {currentIndex + 1} of {artworks.length} // {artwork.category}
          </div>
        </div>

        {/* Right Pane: Artwork Curator Details */}
        <div className="md:w-2/5 p-6 sm:p-8 bg-stone-900 flex flex-col justify-between text-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-teal-400/20 text-teal-300 border border-teal-400/40">
                {artwork.category}
              </span>
              <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {artwork.year}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              {artwork.title}
            </h3>

            <p className="text-stone-300 text-sm leading-relaxed mb-6">
              {artwork.description}
            </p>

            {/* Tools Used */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>Medium & Software</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {artwork.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-stone-800 border border-stone-700 text-stone-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400">
            <span>{PERSONAL_INFO.name} Atelier</span>
            <span className="text-teal-300 font-semibold">High-Resolution Render</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
