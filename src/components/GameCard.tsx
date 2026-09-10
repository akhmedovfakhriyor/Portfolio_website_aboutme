import { useState } from 'react';
import { GameProject } from '../types';
import { Maximize2, Sparkles, Layers, Cpu, ArrowUpRight } from 'lucide-react';

interface GameCardProps {
  key?: string;
  game: GameProject;
  onSelect: (game: GameProject) => void;
}

export function GameCard({ game, onSelect }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={`game-card-${game.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(game)}
      className="group cursor-pointer h-full"
    >
      <div className="relative rounded-2xl border theme-border theme-card overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1.5 flex flex-col justify-between h-full">
        {/* Media Preview Container */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-slate-950 border-b theme-border">
        {/* Background GIF (Always loaded, but invisible until hover) */}
        <img
          src={game.previewGif}
          alt={`${game.title} preview`}
          className={`absolute inset-0 w-full h-full object-cover block transition-all duration-700 group-hover:scale-105 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
        />
        {/* Foreground Thumbnail (Fades out on hover) */}
        <img
          src={game.thumbnail}
          alt={game.title}
          className={`absolute inset-0 w-full h-full object-cover block transition-all duration-700 group-hover:scale-105 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          referrerPolicy="no-referrer"
        />

        {/* Engine Badge Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 backdrop-blur-md">
            {game.engine}
          </span>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono text-slate-300 bg-black/60 border border-white/10 backdrop-blur-md">
            {game.status}
          </span>
        </div>

        {/* Info Icon Hover Indicator */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}>
          <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 backdrop-blur-sm">
            <Maximize2 className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Year stamp */}
        <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-300 bg-black/50 px-2 py-0.5 rounded">
          {game.year}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-extrabold theme-text-primary group-hover:text-purple-400 transition-colors">
              {game.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-purple-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          <p className="text-xs sm:text-sm theme-text-secondary line-clamp-2 mb-4 leading-relaxed">
            {game.tagline}
          </p>
        </div>

        <div>
          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {game.genre.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md border theme-border opacity-80 theme-text-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t theme-border flex items-center justify-between text-xs font-mono">
            <span className="text-purple-400 font-bold group-hover:underline flex items-center gap-1">
              View Details
            </span>
            <div className="flex gap-3 text-[11px]" onClick={(e) => e.stopPropagation()}>
              {game.repoUrl && (
                <a href={game.repoUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400 theme-text-secondary transition-colors font-bold z-10 hover:underline">
                  Source
                </a>
              )}
              {game.demoUrl && (
                <a href={game.demoUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400 theme-text-secondary transition-colors font-bold z-10 hover:underline">
                  Link
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
