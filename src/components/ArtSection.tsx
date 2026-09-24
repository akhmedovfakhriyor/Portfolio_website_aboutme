import { useState, useRef, useEffect } from 'react';
import { motion, useTransform } from 'motion/react';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { ARTWORKS } from '../data/portfolioData';
import { Artwork } from '../types';
import { ArtworkLightbox } from './ArtworkLightbox';
import { SmartImage } from './SmartImage';
import { CollectibleCardFrame } from './CollectibleCardFrame';
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
  const titleRef = useRef<HTMLDivElement>(null);
  const { sectionY, sectionScale, sectionOpacity, scrollYProgress } = useSectionMotion(sectionRef, {
    titleRef,
  });

  // Differential parallax depth
  const bgY = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const galleryY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [userSelectedMode, setUserSelectedMode] = useState<boolean>(false);
  const [columnMode, setColumnMode] = useState<'compact' | 'single'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 'single';
    }
    return 'compact';
  });

  // Automatically update default layout on viewport resize unless the user manually toggled
  useEffect(() => {
    if (userSelectedMode) return;
    const handleResize = () => {
      setColumnMode(window.innerWidth < 640 ? 'single' : 'compact');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userSelectedMode]);

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
    <section id="art" style={{ paddingTop: '0px', paddingBottom: '66px', paddingLeft: '0px' }} className="relative min-h-screen flex flex-col justify-center theme-canvas overflow-x-clip" ref={sectionRef}>
      {/* Ambient Radial Glow with Aquamarine Seafoam and Parallax (hardware-accelerated, zero blur raster cost) */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.16)_0%,rgba(20,184,166,0.04)_50%,transparent_75%)] rounded-full pointer-events-none -z-10 will-change-transform transform-gpu"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full will-change-transform transform-gpu"
      >
        {/* Section Header with In-Line Filter Pills */}
        <motion.div ref={titleRef} style={{ y: headerY }} className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
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
              id="gallery-view-grid-btn"
              onClick={() => {
                setColumnMode('compact');
                setUserSelectedMode(true);
              }}
              title="Grid View (Multi-column)"
              aria-label="Grid View"
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                columnMode === 'compact'
                  ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-sm'
                  : 'theme-text-muted hover:theme-text-primary'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              id="gallery-view-list-btn"
              onClick={() => {
                setColumnMode('single');
                setUserSelectedMode(true);
              }}
              title="List View (Full-width Showcase)"
              aria-label="List View"
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                columnMode === 'single'
                  ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-sm'
                  : 'theme-text-muted hover:theme-text-primary'
              }`}
            >
              <Rows className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {columnMode === 'compact' ? (
          /* Multi-column Visual Grid (2 cols mobile, 3 cols tablet, 4 cols PC/widescreen) */
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-3 sm:gap-6">
            {filteredArtworks.map((art, index) => {
              const rarityLabel = art.model3d
                ? '3D GOLD SPEC'
                : art.rarity === 'gold'
                ? 'GOLD FOIL'
                : art.rarity === 'diamond'
                ? 'DIAMOND SPEC'
                : art.rarity === 'epic'
                ? 'EPIC ARCANA'
                : art.rarity === 'prismatic'
                ? 'PRISMATIC HOLO'
                : 'SILVER CHROME';

              return (
                <CollectibleCardFrame
                  key={art.id}
                  id={`art-${art.id}`}
                  discipline="art"
                  seriesNumber={String(index + 1).padStart(2, '0')}
                  editionYear={art.year}
                  rarityTier={art.rarity}
                  rarity={rarityLabel}
                  title={art.title}
                  subtitle={art.category}
                  backgroundImage={art.imageUrl}
                  cardCount={art.gallery && art.gallery.length > 1 ? art.gallery.length : 1}
                  galleryPreviews={art.gallery}
                  isOpen={selectedArtwork?.id === art.id}
                  onOpen={() => setSelectedArtwork(art)}
                  className="break-inside-avoid mb-4 sm:mb-6 block"
                >
                  <div className="flex flex-col justify-between h-full bg-stone-900/40">
                  {/* Static Image Frame */}
                  <div className="relative w-full overflow-hidden bg-stone-200/50 dark:bg-stone-900 flex justify-center aspect-[4/3] border-b theme-border">
                    <SmartImage
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Top Badge (Only for 3D) */}
                    {art.model3d && (
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2dd4bf] text-slate-950 font-bold shadow-sm">
                          3D
                        </span>
                      </div>
                    )}

                    {/* Gallery Count Badge */}
                    {art.gallery && art.gallery.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 flex items-center justify-center gap-1 w-7 h-7 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white/90 shadow-sm z-10">
                        <span className="text-[10px] font-bold font-mono leading-none">{art.gallery.length}</span>
                      </div>
                    )}

                    {/* Hover overlay with Inspect Icon */}
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white font-mono text-xs flex items-center gap-1.5 shadow-lg border border-teal-400/30">
                        <ZoomIn className="w-3.5 h-3.5 text-teal-400" />
                        <span>Inspect Lightbox ⟲</span>
                      </div>
                    </div>
                  </div>

                  {/* Artwork Details */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-sm sm:text-base theme-text-primary group-hover:text-teal-400 transition-colors truncate">
                          {art.title}
                        </h4>
                        <span className="text-[10px] sm:text-xs font-mono theme-text-muted shrink-0">{art.year}</span>
                      </div>
                      <p className="hidden sm:block text-xs theme-text-secondary line-clamp-2 mb-3 leading-relaxed">
                        {art.description}
                      </p>
                    </div>

                    <div className="pt-2 sm:pt-2.5 border-t theme-border flex items-center justify-between gap-1">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded border theme-border theme-text-muted truncate max-w-[120px]">
                          {art.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CollectibleCardFrame>
            );
          })}
          </div>
        ) : (
          /* Detailed Rows / List View (Horizontal showcase cards on PC, spacious stack on mobile) */
          <div className="flex flex-col gap-4 sm:gap-6 max-w-5xl mx-auto">
            {filteredArtworks.map((art, index) => {
              const rarityLabel = art.model3d
                ? '3D GOLD SPEC'
                : art.rarity === 'gold'
                ? 'GOLD FOIL'
                : art.rarity === 'diamond'
                ? 'DIAMOND SPEC'
                : art.rarity === 'epic'
                ? 'EPIC ARCANA'
                : art.rarity === 'prismatic'
                ? 'PRISMATIC HOLO'
                : 'SILVER CHROME';

              return (
                <CollectibleCardFrame
                  key={art.id}
                  id={`artwork-row-${art.id}`}
                  discipline="art"
                  seriesNumber={String(index + 1).padStart(2, '0')}
                  editionYear={art.year}
                  rarityTier={art.rarity}
                  rarity={rarityLabel}
                  title={art.title}
                  subtitle={art.category}
                  backgroundImage={art.imageUrl}
                  cardCount={art.gallery && art.gallery.length > 1 ? art.gallery.length : 1}
                  galleryPreviews={art.gallery}
                  isOpen={selectedArtwork?.id === art.id}
                  onOpen={() => setSelectedArtwork(art)}
                  className="w-full block mb-4"
                >
                  <div className="relative rounded-xl overflow-hidden flex flex-col sm:flex-row bg-stone-900/40">
                  {/* Left: Artwork Preview Frame */}
                  <div className="relative w-full sm:w-72 md:w-80 lg:w-96 shrink-0 aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-stone-200/50 dark:bg-stone-900 flex justify-center border-b sm:border-b-0 sm:border-r theme-border">
                    <SmartImage
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Top Badge (Only for 3D) */}
                    {art.model3d && (
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 z-10">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2dd4bf] text-slate-950 font-bold shadow-sm">
                          3D Interactive
                        </span>
                      </div>
                    )}

                    {/* Gallery Count Badge */}
                    {art.gallery && art.gallery.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono font-bold shadow-sm z-10">
                        <span>{art.gallery.length} images</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Detailed Description & Metadata */}
                  <div className="p-4 sm:p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h4 className="font-bold text-base sm:text-xl theme-text-primary group-hover:text-teal-400 transition-colors">
                          {art.title}
                        </h4>
                        <span className="text-xs sm:text-sm font-mono theme-text-muted">{art.year}</span>
                      </div>

                      <p className="text-xs sm:text-sm theme-text-secondary leading-relaxed my-2 sm:my-3">
                        {art.description}
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t theme-border flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded-full border theme-border theme-text-secondary bg-stone-100 dark:bg-stone-800/60">
                          {art.category}
                        </span>
                        {art.model3d && (
                          <span className="hidden sm:inline text-xs font-mono text-teal-400 font-medium">
                            • 3D asset available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CollectibleCardFrame>
            );
          })}
          </div>
        )}
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
