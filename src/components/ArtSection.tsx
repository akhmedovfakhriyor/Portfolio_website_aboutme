import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ARTWORKS } from '../data/portfolioData';
import { Artwork } from '../types';
import { ArtworkLightbox } from './ArtworkLightbox';
import { SmartImage } from './SmartImage';
import { Palette, ZoomIn, LayoutGrid, Rows } from 'lucide-react';

function parseYearToDate(yearStr: string): number {
  const str = yearStr.trim();
  
  // Try to find any 4-digit numbers (years)
  const years = str.match(/\b\d{4}\b/g);
  let year = 2025; // default fallback
  if (years && years.length > 0) {
    // Pick the highest year found in the string (for ranges like '2025 - 2026')
    year = Math.max(...years.map(Number));
  }
  
  // Find month names
  const months: { [key: string]: number } = {
    jan: 1, january: 1,
    feb: 2, february: 2,
    mar: 3, march: 3,
    apr: 4, april: 4,
    may: 5,
    jun: 6, june: 6,
    jul: 7, july: 7,
    aug: 8, august: 8,
    sep: 9, september: 9, sept: 9,
    oct: 10, october: 10,
    nov: 11, november: 11,
    dec: 12, december: 12
  };
  
  let month = 0; // default to 0 if no month specified
  const words = str.toLowerCase().split(/[^a-z0-9]/);
  for (const word of words) {
    if (months[word] !== undefined) {
      month = months[word];
    }
  }
  
  return year * 100 + month;
}

export function ArtSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: enterProgress } = useScroll({
    target: sectionRef,
    offset: ["start 100%", "start 35%"]
  });
  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ["end 55%", "end 10%"]
  });

  // Distinct 3D depth emergence from behind (entrance) and receding upward fade (exit)
  const sectionScale = useTransform(() => {
    const enter = enterProgress.get();
    const exit = exitProgress.get();
    if (enter < 1) return 0.85 + (0.15 * enter);
    if (exit > 0) return 1 - (0.15 * exit);
    return 1;
  });
  const sectionOpacity = useTransform(() => {
    const enter = enterProgress.get();
    const exit = exitProgress.get();
    if (enter < 1) return 0.1 + (0.9 * enter);
    if (exit > 0) return 1 - (0.9 * exit);
    return 1;
  });

  // Differential parallax depth
  const bgY = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const galleryY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [columnMode, setColumnMode] = useState<'compact' | 'single'>('compact');

  const categories = [
    'All',
    'Digital Art',
    'Traditional Art',
    '3D Models',
  ];

  const sortedArtworks = [...ARTWORKS].sort((a, b) => parseYearToDate(b.year) - parseYearToDate(a.year));

  const filteredArtworks = activeTab === 'All'
    ? sortedArtworks
    : sortedArtworks.filter((art) => art.category === activeTab);

  return (
    <section id="art" className="relative py-8 sm:py-12 theme-canvas overflow-x-clip" ref={sectionRef}>
      {/* Ambient Radial Glow with Aquamarine Seafoam */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-teal-400/20 via-emerald-400/10 to-teal-500/5 blur-[140px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header with In-Line Filter Pills */}
        <motion.div style={{ y: headerY }} className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold theme-badge mb-3">
              <Palette className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Discipline 03 // 3D & Visual Atelier</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight theme-text-primary">
              Form, Lighting & Hard-Surface Aesthetics
            </h2>
            <p className="mt-3 text-sm sm:text-base theme-text-secondary leading-relaxed">
              3D modeling, hard-surface assets, and digital artwork created with Blender.
            </p>
          </div>

          {/* Filterable Tabs: Wrap cleanly to second row if exceeding screen width */}
          <div className="flex flex-wrap items-center gap-2 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`art-tab-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === cat
                    ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-md shadow-teal-400/25'
                    : 'border theme-border theme-card theme-text-secondary hover:theme-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Curated Gallery Grid */}
        <motion.div style={{ y: galleryY }}>
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold theme-text-primary">
              Curated Visual Works ({filteredArtworks.length})
            </h3>
            <span className="hidden sm:inline text-xs font-mono theme-text-muted">
              • Click to inspect in high-res lightbox
            </span>
          </div>

          {/* Layout density toggle for mobile and responsive screens */}
          <div className="flex items-center gap-1 p-1 rounded-xl border theme-border theme-card">
            <button
              onClick={() => setColumnMode('compact')}
              title="2 Columns (Compact Grid)"
              aria-label="2 Columns (Compact Grid)"
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                columnMode === 'compact'
                  ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-sm'
                  : 'theme-text-muted hover:theme-text-primary'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">2 Cols</span>
            </button>
            <button
              onClick={() => setColumnMode('single')}
              title="Single Column View"
              aria-label="Single Column View"
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                columnMode === 'single'
                  ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-sm'
                  : 'theme-text-muted hover:theme-text-primary'
              }`}
            >
              <Rows className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">1 Col</span>
            </button>
          </div>
        </div>

        <div
          className={
            columnMode === 'compact'
              ? 'columns-2 sm:columns-2 lg:columns-3 gap-3 sm:gap-6'
              : 'columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6'
          }
        >
          {filteredArtworks.map((art) => (
            <div
              key={art.id}
              id={`artwork-card-${art.id}`}
              onClick={() => setSelectedArtwork(art)}
              className="group cursor-pointer break-inside-avoid mb-3 sm:mb-6 block"
            >
              <div className="relative rounded-xl sm:rounded-2xl border theme-border theme-card overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 flex flex-col justify-between">
                {/* Static Image Frame (Aspect Ratio locked to prevent layout jump) */}
              <div className="relative w-full overflow-hidden bg-stone-200/50 dark:bg-stone-900 flex justify-center aspect-[4/3]">
                <SmartImage
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay with Inspect Icon */}
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2 shadow-lg border border-white/20">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Lightbox</span>
                  </div>
                </div>

                {/* Top Badge (Only for 3D) */}
                {art.model3d && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-2">
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[9px] sm:text-[10px] font-mono bg-[#2dd4bf] text-slate-950 font-bold shadow-sm">
                      3D
                    </span>
                  </div>
                )}

                {/* Gallery Count Badge */}
                {art.gallery && art.gallery.length > 1 && (
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center justify-center gap-1 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white/90 shadow-sm z-10 group-hover:bg-black/90 transition-colors">
                    <span className="text-[10px] sm:text-xs font-bold font-mono leading-none">{art.gallery.length}</span>
                  </div>
                )}
              </div>

              {/* Artwork Details with scaled mobile typography */}
              <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
                    <h4 className="font-bold text-xs sm:text-base theme-text-primary group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                      {art.title}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-mono theme-text-muted shrink-0">{art.year}</span>
                  </div>
                  <p className="hidden sm:block text-xs theme-text-secondary line-clamp-2 mb-4 leading-relaxed">
                    {art.description}
                  </p>
                </div>

                <div className="pt-2 sm:pt-3 border-t theme-border flex items-center justify-between gap-1">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded border theme-border theme-text-muted truncate max-w-[90px] sm:max-w-none">
                      {art.category}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-teal-600 dark:text-teal-400 flex items-center gap-0.5 sm:gap-1 shrink-0">
                    Inspect
                  </span>
                </div>
              </div>
              </div>
            </div>
          ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox Modal */}
      <ArtworkLightbox
        artwork={selectedArtwork}
        artworks={filteredArtworks}
        onClose={() => setSelectedArtwork(null)}
        onSelect={(art) => setSelectedArtwork(art)}
      />
    </section>
  );
}
