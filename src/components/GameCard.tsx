import { GameProject } from '../types';
import { SmartImage } from './SmartImage';
import { CollectibleCardFrame } from './CollectibleCardFrame';
import { Maximize2, ArrowUpRight } from 'lucide-react';
import { preloadGameAssets } from '../utils/assetPreloader';

interface GameCardProps {
  key?: string;
  game: GameProject;
  index?: number;
  isOpen?: boolean;
  onSelect: (game: GameProject) => void;
}

export function GameCard({ game, index = 0, isOpen = false, onSelect }: GameCardProps) {
  const rarityLabel =
    game.rarity === 'gold' ? 'GOLD FOIL' :
    game.rarity === 'diamond' ? 'DIAMOND SPEC' :
    game.rarity === 'epic' ? 'EPIC ARCANA' :
    game.rarity === 'prismatic' ? 'PRISMATIC HOLO' :
    'SILVER CHROME';

  return (
    <div onMouseEnter={() => preloadGameAssets(game)} className="h-full">
      <CollectibleCardFrame
        id={`game-${game.id}`}
        discipline="game"
        seriesNumber={String(index + 1).padStart(2, '0')}
        editionYear={game.year}
        rarityTier={game.rarity}
        rarity={rarityLabel}
        title={game.title}
        subtitle={game.tagline}
        backgroundImage={game.thumbnail}
        isOpen={isOpen}
        onOpen={() => onSelect(game)}
        className="h-full"
      >
      <div className="flex flex-col justify-between h-full bg-slate-900/40">
        {/* Media Preview Container */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950 border-b theme-border">
          {/* Static Thumbnail */}
          <SmartImage
            src={game.thumbnail}
            alt={game.title}
            className="absolute inset-0 w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          />

          {/* Engine Badge Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-purple-950/90 text-purple-200 border border-purple-400/40 backdrop-blur-md shadow-sm">
              {game.engine}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-200 bg-black/70 border border-white/15 backdrop-blur-md">
              {game.status}
            </span>
          </div>

          {/* Center Hover Indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
            <div className="px-3 py-1.5 rounded-full bg-purple-600/90 text-white font-mono text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/40 border border-purple-400/30">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Open Dossier ⟲</span>
            </div>
          </div>

          {/* Year stamp */}
          <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-slate-300 bg-black/70 border border-white/10 px-2 py-0.5 rounded backdrop-blur-sm z-10">
            {game.year}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-lg sm:text-xl font-extrabold theme-text-primary group-hover:text-purple-400 transition-colors">
                {game.title}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-purple-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <p className="text-xs sm:text-sm theme-text-secondary line-clamp-2 mb-3 leading-relaxed">
              {game.tagline}
            </p>
          </div>

          <div>
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {game.genre.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md border theme-border opacity-90 theme-text-secondary bg-stone-900/30"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Footer */}
            <div className="pt-2.5 border-t theme-border flex items-center justify-end text-xs font-mono">
              <div className="flex gap-2.5 text-[11px]" onClick={(e) => e.stopPropagation()}>
                {game.repoUrl && (
                  <a
                    href={game.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-purple-400 theme-text-secondary transition-colors font-bold z-10 hover:underline"
                  >
                    Source
                  </a>
                )}
                {game.demoUrl && (
                  <a
                    href={game.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-purple-400 theme-text-secondary transition-colors font-bold z-10 hover:underline"
                  >
                    {game.demoUrl.includes('itch.io') ? 'Itch.io ↗' : 'Play ↗'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollectibleCardFrame>
    </div>
  );
}
