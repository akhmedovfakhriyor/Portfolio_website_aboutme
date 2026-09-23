import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Hexagon, Award, CheckCircle2 } from 'lucide-react';
import { CollectibleRarity } from '../types';

export interface CollectibleCardFrameProps {
  key?: React.Key;
  id: string;
  discipline: 'game' | 'art';
  seriesNumber: string;
  rarityTier?: CollectibleRarity;
  rarity?: string;
  editionYear: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cardCount?: number;
  galleryPreviews?: string[];
  isOpen?: boolean;
  onOpen: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CollectibleCardFrame({
  id,
  discipline,
  seriesNumber,
  rarityTier,
  rarity,
  editionYear,
  title,
  subtitle,
  backgroundImage,
  cardCount,
  galleryPreviews,
  isOpen = false,
  onOpen,
  children,
  className = '',
}: CollectibleCardFrameProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize into one of the 5 collectible tiers: silver | gold | diamond | epic | prismatic
  const tier: CollectibleRarity = rarityTier || (
    rarity?.toLowerCase().includes('gold') ? 'gold' :
    rarity?.toLowerCase().includes('diamond') || rarity?.toLowerCase().includes('dimond') ? 'diamond' :
    rarity?.toLowerCase().includes('epic') || rarity?.toLowerCase().includes('purple') ? 'epic' :
    rarity?.toLowerCase().includes('prismatic') || rarity?.toLowerCase().includes('holographic') || rarity?.toLowerCase().includes('holo') ? 'prismatic' :
    'silver'
  );

  const displayRarity = rarity || (
    tier === 'silver' ? 'SILVER CHROME' :
    tier === 'gold' ? 'GOLD FOIL' :
    tier === 'diamond' ? 'DIAMOND SPEC' :
    tier === 'epic' ? 'EPIC ARCANA' :
    'PRISMATIC HOLO'
  );

  // Sync internal flip state with isOpen: stays flipped while window is open, spins back on exit
  useEffect(() => {
    if (isOpen) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  }, [isOpen]);

  // Clean up animation frames on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Performance-optimized cursor tracking using requestAnimationFrame to prevent high-rate event thrashing
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      // Tilt range ±12 degrees for realistic physical feel
      setTilt({
        x: -y * 12,
        y: x * 12,
      });

      // Cursor position tracking for dynamic ray shine reflection
      setGlare({
        x: Math.round((x + 0.5) * 100),
        y: Math.round((y + 0.5) * 100),
        opacity: 0.85,
      });
    });
  }, [isFlipped]);

  const handleMouseEnter = useCallback(() => {
    if (!isFlipped) {
      setIsHovered(true);
    }
  }, [isFlipped]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const handleClick = useCallback(() => {
    if (isFlipped || isOpen) return;
    setIsFlipped(true);
    // Smoothly transition after card spin starts
    setTimeout(() => {
      onOpen();
    }, 320);
  }, [isFlipped, isOpen, onOpen]);

  const isGame = discipline === 'game';

  // Tier-specific vibrant outline borders, softened background elevation shadow, badges, and accents
  // Base neutral border for calm, unified gallery presentation when not hovered
  const neutralRestingBorder = 'rgba(255, 255, 255, 0.14)';
  let foilAccentBorder = '';
  let tierBorderColor = neutralRestingBorder;
  let tierBorderHover = '#ffffff';
  let glowShadow = '0 8px 18px -6px rgba(0, 0, 0, 0.4)';
  let cornerFiligree = 'border-slate-300';
  let badgeTextColor = 'text-slate-200';
  let cardBackSealGradient = 'from-slate-700 via-slate-800 to-zinc-700 border-slate-300/80';
  let stampBadgeBg = 'bg-slate-400/20 text-slate-200 border-slate-300/50';
  let stampBadgeText = 'SILVER SPEC';
  let headerAccentClass = 'border-slate-300/40 text-slate-200';

  if (tier === 'gold') {
    tierBorderHover = '#fbbf24';
    foilAccentBorder = '';
    cornerFiligree = 'border-amber-400';
    badgeTextColor = 'text-amber-300';
    cardBackSealGradient = 'from-amber-800 via-stone-900 to-yellow-800 border-amber-400/80';
    stampBadgeBg = 'bg-amber-500/20 text-amber-300 border-amber-400/50';
    stampBadgeText = 'GOLD SPEC';
    headerAccentClass = 'border-amber-400/50 text-amber-300';
    if (isHovered && !isFlipped) {
      // Soft, low-intensity elevation with subtle amber hint (no blinding halo)
      glowShadow = '0 14px 28px -8px rgba(245, 158, 11, 0.22), 0 4px 12px -2px rgba(0, 0, 0, 0.35)';
    }
  } else if (tier === 'diamond') {
    tierBorderHover = '#22d3ee';
    foilAccentBorder = '';
    cornerFiligree = 'border-cyan-400';
    badgeTextColor = 'text-cyan-300';
    cardBackSealGradient = 'from-cyan-900 via-slate-900 to-blue-900 border-cyan-400/80';
    stampBadgeBg = 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50';
    stampBadgeText = 'DIAMOND SPEC';
    headerAccentClass = 'border-cyan-400/50 text-cyan-300';
    if (isHovered && !isFlipped) {
      glowShadow = '0 14px 28px -8px rgba(6, 182, 212, 0.22), 0 4px 12px -2px rgba(0, 0, 0, 0.35)';
    }
  } else if (tier === 'epic') {
    tierBorderHover = '#c084fc';
    foilAccentBorder = '';
    cornerFiligree = 'border-purple-400';
    badgeTextColor = 'text-purple-300';
    cardBackSealGradient = 'from-purple-900 via-slate-900 to-indigo-900 border-purple-400/80';
    stampBadgeBg = 'bg-purple-500/20 text-purple-300 border-purple-400/50';
    stampBadgeText = 'EPIC SPEC';
    headerAccentClass = 'border-purple-400/50 text-purple-300';
    if (isHovered && !isFlipped) {
      glowShadow = '0 14px 28px -8px rgba(168, 85, 247, 0.22), 0 4px 12px -2px rgba(0, 0, 0, 0.35)';
    }
  } else if (tier === 'prismatic') {
    tierBorderHover = '#f472b6';
    foilAccentBorder = '';
    cornerFiligree = 'border-pink-400';
    badgeTextColor = 'text-pink-300';
    cardBackSealGradient = 'from-pink-900 via-slate-900 to-teal-900 border-pink-400/80';
    stampBadgeBg = 'bg-pink-500/20 text-pink-300 border-pink-400/50';
    stampBadgeText = 'PRISMATIC SPEC';
    headerAccentClass = 'border-pink-400/50 text-pink-300';
    if (isHovered && !isFlipped) {
      glowShadow = '0 14px 28px -8px rgba(244, 114, 182, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.35)';
    }
  } else {
    // Silver tier default
    tierBorderHover = '#cbd5e1';
    foilAccentBorder = '';
    cornerFiligree = 'border-slate-300';
    badgeTextColor = 'text-slate-200';
    cardBackSealGradient = 'from-slate-700 via-slate-800 to-zinc-700 border-slate-300/80';
    stampBadgeBg = 'bg-slate-400/20 text-slate-200 border-slate-300/50';
    stampBadgeText = 'SILVER SPEC';
    headerAccentClass = 'border-slate-300/40 text-slate-200';
    if (isHovered && !isFlipped) {
      glowShadow = '0 14px 28px -8px rgba(148, 163, 184, 0.20), 0 4px 12px -2px rgba(0, 0, 0, 0.35)';
    }
  }

  // Consistent collector crest on the back across ALL card rarities (including diamond, silver, gold, etc.)
  const cardBackIcon = <Award className={`w-8 h-8 sm:w-10 sm:h-10 ${badgeTextColor} mb-1`} />;

  // Dynamic moving ray shine effect across ALL card rarities
  // The ray is oriented permanently from lower-left to top-right (~126deg).
  // Position reflects inverted physical specular highlight:
  // - Pointing down -> ray moves UP
  // - Hovering top-left -> ray moves LOWER
  let sheenBackground = 'transparent';
  let sheenOpacity = 0;

  if (isHovered && !isFlipped) {
    // Normalized cursor coordinates from -1 (left / top) to +1 (right / bottom)
    const normX = (glare.x - 50) / 50;
    const normY = (glare.y - 50) / 50;

    // Fixed low-left to right-up angle (~126deg) with minimal micro-shift (under ±2deg)
    const rayAngle = Math.round(126 + normX * 1.5 - normY * 1.0);

    // Specular reflection movement across the diagonal axis:
    // - When cursor is pointing down (normY > 0), ray sweeps UP (smaller center %)
    // - When cursor hovers top-left (normX < 0, normY < 0), ray sweeps LOWER (larger center %)
    const offset = (-normY * 34) + (-normX * 22);
    const center = Math.round(Math.max(12, Math.min(88, 50 + offset)));

    if (tier === 'silver') {
      sheenOpacity = 0.42;
      sheenBackground = `linear-gradient(${rayAngle}deg, transparent ${center - 25}%, rgba(255, 255, 255, 0.12) ${center - 12}%, rgba(255, 255, 255, 0.50) ${center}%, rgba(203, 213, 225, 0.24) ${center + 12}%, transparent ${center + 25}%)`;
    } else if (tier === 'gold') {
      sheenOpacity = 0.44;
      sheenBackground = `linear-gradient(${rayAngle}deg, transparent ${center - 25}%, rgba(254, 243, 199, 0.14) ${center - 12}%, rgba(251, 191, 36, 0.52) ${center}%, rgba(245, 158, 11, 0.28) ${center + 12}%, transparent ${center + 25}%)`;
    } else if (tier === 'diamond') {
      sheenOpacity = 0.44;
      sheenBackground = `linear-gradient(${rayAngle}deg, transparent ${center - 25}%, rgba(165, 243, 252, 0.16) ${center - 12}%, rgba(103, 232, 249, 0.54) ${center}%, rgba(56, 189, 248, 0.30) ${center + 12}%, transparent ${center + 25}%)`;
    } else if (tier === 'epic') {
      sheenOpacity = 0.44;
      sheenBackground = `linear-gradient(${rayAngle}deg, transparent ${center - 25}%, rgba(233, 213, 255, 0.16) ${center - 12}%, rgba(192, 132, 252, 0.54) ${center}%, rgba(168, 85, 247, 0.30) ${center + 12}%, transparent ${center + 25}%)`;
    } else if (tier === 'prismatic') {
      sheenOpacity = 0.46;
      sheenBackground = `linear-gradient(${rayAngle}deg, transparent ${center - 28}%, rgba(255, 99, 132, 0.26) ${center - 16}%, rgba(255, 190, 80, 0.28) ${center - 8}%, rgba(75, 215, 180, 0.36) ${center}%, rgba(56, 189, 248, 0.36) ${center + 8}%, rgba(168, 85, 247, 0.28) ${center + 16}%, transparent ${center + 28}%)`;
    }
  }

  // Multi-card deck support: detect if this card holds a multi-item set
  const isWide = className.includes('w-full') || className.includes('artwork-row');
  const count = cardCount || (galleryPreviews ? galleryPreviews.length : 1);
  const previewImg1 = galleryPreviews && galleryPreviews.length > 1 ? galleryPreviews[1] : undefined;
  const previewImg2 = galleryPreviews && galleryPreviews.length > 2 ? galleryPreviews[2] : (galleryPreviews && galleryPreviews.length > 1 ? galleryPreviews[1] : undefined);

  return (
    <div
      ref={cardRef}
      id={`collectible-card-${id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative cursor-pointer select-none [perspective:1400px] ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* ========================================================= */}
      {/* UNDERNEATH STACKED CARDS (CASCADES TO RIGHT ON HOVER)     */}
      {/* ========================================================= */}
      {/* Layer 3: Deepest card (#03) behind everything, fanned right */}
      {count >= 3 && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 pointer-events-none transition-colors duration-300 bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950"
          initial={false}
          animate={{
            rotateZ: isFlipped ? 0 : isHovered ? (isWide ? 4.8 : 10.5) : 2.2,
            rotateX: isFlipped ? 0 : tilt.x * 0.3,
            rotateY: isFlipped ? 0 : tilt.y * 0.3,
            x: isFlipped ? 0 : isHovered ? (isWide ? 22 : 32) : 5,
            y: isFlipped ? 0 : isHovered ? (isWide ? 14 : 22) : 3,
            z: isFlipped ? -70 : isHovered ? -50 : -30,
            scale: isFlipped ? 0.92 : isHovered ? 0.975 : 0.985,
            opacity: isFlipped ? 0 : isHovered ? 0.95 : 0.65,
          }}
          transition={
            isFlipped
              ? { duration: 0.35 }
              : { type: 'spring', stiffness: 320, damping: 24, mass: 0.8 }
          }
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center',
            borderColor: (isHovered || isFlipped) ? tierBorderHover : tierBorderColor,
            zIndex: 0,
            boxShadow: isHovered ? '0 16px 32px -6px rgba(0, 0, 0, 0.75)' : '0 4px 8px -2px rgba(0, 0, 0, 0.4)',
          }}
        >
          {previewImg2 ? (
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={previewImg2}
                alt=""
                className="w-full h-full object-cover opacity-85 filter saturate-90 brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-black/40" />
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/85 text-[9px] font-mono font-bold text-white border border-white/20 shadow-md">
                #03
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 opacity-30">
              <Hexagon className="w-8 h-8 text-white/40" />
            </div>
          )}
        </motion.div>
      )}

      {/* Layer 2: Middle card (#02) directly behind top card, fanned slightly right */}
      {count >= 2 && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 pointer-events-none transition-colors duration-300 bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950"
          initial={false}
          animate={{
            rotateZ: isFlipped ? 0 : isHovered ? (isWide ? 2.4 : 5.5) : 1.1,
            rotateX: isFlipped ? 0 : tilt.x * 0.4,
            rotateY: isFlipped ? 0 : tilt.y * 0.4,
            x: isFlipped ? 0 : isHovered ? (isWide ? 11 : 16) : 2.5,
            y: isFlipped ? 0 : isHovered ? (isWide ? 7 : 11) : 1.5,
            z: isFlipped ? -40 : isHovered ? -25 : -15,
            scale: isFlipped ? 0.94 : isHovered ? 0.99 : 0.992,
            opacity: isFlipped ? 0 : isHovered ? 1 : 0.75,
          }}
          transition={
            isFlipped
              ? { duration: 0.35 }
              : { type: 'spring', stiffness: 320, damping: 24, mass: 0.8 }
          }
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center',
            borderColor: (isHovered || isFlipped) ? tierBorderHover : tierBorderColor,
            zIndex: 1,
            boxShadow: isHovered ? '0 18px 36px -6px rgba(0, 0, 0, 0.8)' : '0 4px 10px -2px rgba(0, 0, 0, 0.45)',
          }}
        >
          {previewImg1 ? (
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={previewImg1}
                alt=""
                className="w-full h-full object-cover opacity-85 filter saturate-95 brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-black/30" />
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/85 text-[9px] font-mono font-bold text-white border border-white/20 shadow-md">
                #02
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 opacity-40">
              <Hexagon className="w-8 h-8 text-white/40" />
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* TOP ACTIVE COLLECTIBLE CARD                               */}
      {/* ========================================================= */}
      <motion.div
        className="w-full h-full relative"
        animate={{
          rotateX: isFlipped ? 0 : tilt.x,
          rotateY: isFlipped ? 180 : tilt.y,
          y: isHovered && !isFlipped ? -10 : 0,
          z: isHovered && !isFlipped ? 35 : 0,
          scale: isHovered && !isFlipped ? 1.025 : 1,
        }}
        transition={
          isFlipped
            ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            : { type: 'spring', stiffness: 350, damping: 24, mass: 0.8 }
        }
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: glowShadow,
          borderRadius: '1.25rem',
          zIndex: 10,
        }}
      >
        {/* ========================================================= */}
        {/* FRONT FACE OF THE COLLECTIBLE CARD                       */}
        {/* ========================================================= */}
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden border-2 bg-[var(--surface-card,#131b2e)] text-slate-100 transition-colors duration-300 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderColor: (isHovered || isFlipped) ? tierBorderHover : tierBorderColor,
          }}
        >
          {/* Top Collectible Header Ribbon */}
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[10px] font-mono shrink-0 z-20">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold tracking-wider ${stampBadgeBg}`}>
                {displayRarity}
              </span>
              <span className="text-white/60 font-medium">#{seriesNumber}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white/60">{editionYear}</span>
            </div>
          </div>

          {/* Front Content (Thumbnail, details, tags) */}
          <div className="flex-1 flex flex-col justify-between relative z-10">
            {children}
          </div>

          {/* Diagonal Rainbow/Metallic Sheen */}
          {sheenOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 rounded-2xl"
              style={{
                opacity: sheenOpacity,
                background: sheenBackground,
              }}
            />
          )}

          {/* Bottom Card Footer Stamp */}
          <div className="px-3 py-1 bg-black/60 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/50 shrink-0 z-20">
            <span>COLLECTIBLE ARCHIVE SPEC</span>
            <span className={`${(isHovered || isFlipped) ? badgeTextColor : 'text-white/60'} font-bold flex items-center gap-1 transition-colors duration-200`}>
              CLICK TO INSPECT <span className="text-[11px]">⟲</span>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK FACE OF THE COLLECTIBLE CARD (High-Tech Collector)   */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 bg-gradient-to-br from-slate-950 via-stone-950 to-slate-900 text-white p-5 flex flex-col justify-between select-none shadow-2xl transition-colors duration-300"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderColor: (isHovered || isFlipped) ? tierBorderHover : tierBorderColor,
          }}
        >
          {/* Main Picture Scaled Appropriately and Blurred */}
          {backgroundImage && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl">
              <img
                src={backgroundImage}
                alt=""
                className="w-full h-full object-cover scale-110 blur-md opacity-60 brightness-90 saturate-110"
                referrerPolicy="no-referrer"
              />
              <div
                className={`absolute inset-0 ${
                  isGame
                    ? 'bg-gradient-to-t from-slate-950/85 via-purple-950/50 to-slate-950/80'
                    : 'bg-gradient-to-t from-stone-950/85 via-teal-950/50 to-stone-950/80'
                }`}
              />
            </div>
          )}

          {/* Ornate Cybernetic Foil Background Texture */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Corner Filigree Brackets */}
          <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${cornerFiligree} rounded-tl pointer-events-none`} />
          <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ${cornerFiligree} rounded-tr pointer-events-none`} />
          <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 ${cornerFiligree} rounded-bl pointer-events-none`} />
          <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 ${cornerFiligree} rounded-br pointer-events-none`} />

          {/* Card Back Top Banner */}
          <div className="flex items-center justify-between border-b border-white/15 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <Hexagon className={`w-4 h-4 ${badgeTextColor}`} />
              <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-white/90">
                FAKHRIYOR ARCHIVE
              </span>
            </div>
            <span className={`text-[10px] font-mono ${badgeTextColor} font-bold`}>
              SERIES #{seriesNumber}
            </span>
          </div>

          {/* Central Collector Seal & Holographic Crest */}
          <div className="relative my-auto flex flex-col items-center justify-center text-center z-10 py-4">
            {/* Concentric Rotating Aesthetic Rings */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-3">
              <div
                className={`absolute inset-0 rounded-full border border-dashed ${
                  tier === 'gold'
                    ? 'border-amber-400/40'
                    : tier === 'diamond'
                    ? 'border-cyan-400/40'
                    : tier === 'epic'
                    ? 'border-purple-400/40'
                    : tier === 'prismatic'
                    ? 'border-pink-400/40'
                    : 'border-slate-300/40'
                } animate-[spin_20s_linear_infinite]`}
              />
              <div
                className={`absolute inset-2 rounded-full border border-double ${
                  tier === 'gold'
                    ? 'border-amber-500/50'
                    : tier === 'diamond'
                    ? 'border-cyan-500/50'
                    : tier === 'epic'
                    ? 'border-purple-500/50'
                    : tier === 'prismatic'
                    ? 'border-teal-400/50'
                    : 'border-slate-400/50'
                }`}
              />
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center bg-gradient-to-tr ${cardBackSealGradient} border shadow-inner`}
              >
                {cardBackIcon}
              </div>
            </div>

            <h4 className="font-extrabold text-sm sm:text-base tracking-wide text-white mb-1">
              {title}
            </h4>
            <p className="text-[11px] font-mono text-white/60 line-clamp-1 max-w-[240px]">
              {subtitle || 'Verified Interactive Portfolio Asset'}
            </p>

            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>TRANSITIONING TO WORKSPACE...</span>
            </div>
          </div>

          {/* Card Back Bottom Hologram Security Stamp */}
          <div className="border-t border-white/15 pt-2 flex items-center justify-between text-[9px] font-mono relative z-10">
            <div className="flex items-center gap-1.5 text-white/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>SEC-ID: FK-{editionYear}-{seriesNumber}</span>
            </div>
            <div className={`px-2 py-0.5 rounded ${stampBadgeBg} text-[8px] font-bold tracking-wider`}>
              {stampBadgeText}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
