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
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      {/* Lightbox Container */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] sm:max-h-[88vh] bg-stone-900 border border-stone-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-lightbox-btn"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          aria-label="Close Lightbox"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left/Middle: High-Res Image Viewport */}
        <div className="relative w-full md:w-3/5 h-[36vh] sm:h-[45vh] md:h-auto md:min-h-[480px] bg-black flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={artwork.gallery && artwork.gallery.length > 0 ? artwork.gallery[galleryIndex] : artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full max-h-[36vh] sm:max-h-[45vh] md:max-h-[75vh] object-contain select-none p-1 sm:p-2 md:p-4"
            referrerPolicy="no-referrer"
          />

          {/* Navigation Arrows */}
          <button
            id="lightbox-prev-btn"
            onClick={handlePrev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110 cursor-pointer z-20"
            aria-label="Previous Artwork"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            id="lightbox-next-btn"
            onClick={handleNext}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110 cursor-pointer z-20"
            aria-label="Next Artwork"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Gallery Thumbnails */}
          {artwork.gallery && artwork.gallery.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md max-w-[90%] overflow-x-auto z-20">
              {artwork.gallery.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setGalleryIndex(idx)}
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    galleryIndex === idx ? 'border-teal-400 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Thumbnail" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane: Artwork Curator Details */}
        <div className="w-full md:w-2/5 p-4 sm:p-7 md:p-8 bg-stone-900 flex flex-col justify-between text-stone-100 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-teal-400/20 text-teal-300 border border-teal-400/40">
                {artwork.category}
              </span>
              <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {artwork.year}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {artwork.title}
            </h3>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {artwork.description}
            </p>

            {/* Tools Used */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>Medium & Software</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {artwork.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono bg-stone-800 border border-stone-700 text-stone-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-stone-800 flex items-center justify-between text-[11px] sm:text-xs font-mono text-stone-400 shrink-0">
            <span>{PERSONAL_INFO.name} Atelier</span>
            <span className="text-teal-300 font-semibold">High-Resolution Render</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
