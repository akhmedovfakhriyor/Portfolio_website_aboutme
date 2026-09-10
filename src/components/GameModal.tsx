import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GameProject } from '../types';
import { X, Layers, Sparkles, Shield, Flame, CheckCircle, ExternalLink, Github, Image as ImageIcon } from 'lucide-react';

interface GameModalProps {
  game: GameProject | null;
  onClose: () => void;
}

export function GameModal({ game, onClose }: GameModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'gallery'>('overview');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Close on Escape & Body Scroll Lock
  useEffect(() => {
    if (game) {
      document.body.style.overflow = 'hidden';
      setActiveTab('overview');
      setExpandedImage(null);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [game]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (expandedImage) {
          setExpandedImage(null);
        } else {
          onClose();
        }
      }
    };
    
    if (game) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [game, expandedImage, onClose]);



  if (!game) return null;

  return createPortal(
    <>
      <div
        id="game-detail-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md overflow-hidden animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="game-detail-modal-container"
        className="relative w-full max-w-4xl h-full max-h-[calc(100vh-6rem)] flex flex-col bg-slate-900 border border-purple-500/30 rounded-3xl text-slate-100 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full Modal Blurred Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={game.thumbnail}
            alt=""
            className="w-full h-full object-cover opacity-80 blur-sm scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/40" />
        </div>

        {/* Content Container (z-index above background) */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header Banner */}
          <div className="relative pt-8 pb-6 px-6 sm:px-8 w-full shrink-0 border-b border-white/10">
            {/* Close Button */}
            <button
              id="close-game-modal-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Game Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-purple-500/30 text-purple-300 border border-purple-500/40">
                    {game.engine}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono text-slate-300 bg-black/50 border border-white/10">
                    {game.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{game.year}</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {game.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {game.repoUrl && (
                  <a
                    href={game.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source</span>
                  </a>
                )}
                {game.demoUrl && (
                  <a
                    href={game.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 fill-white" />
                    <span>{game.demoUrl.includes('itch.io') ? 'Play on Itch.io' : 'View Project'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex shrink-0 border-b border-white/10 bg-black/20 px-6 gap-6 text-sm font-semibold overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Architecture
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'process'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Development Insights
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Gallery</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Featured Video Player */}
              {game.previewVideo && (
                <div className="rounded-2xl overflow-hidden border border-purple-500/30 bg-black/60 shadow-lg">
                  <video
                    src={game.previewVideo}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full max-h-80 object-contain mx-auto"
                  />
                  <div className="px-4 py-2 bg-slate-950/80 border-t border-white/10 text-[11px] font-mono text-purple-300 flex items-center justify-between">
                    <span>Active Gameplay Footage</span>
                    <span className="text-slate-400">Recorded Gameplay Clip</span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-base font-bold text-white mb-2">Narrative & Core Concept</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{game.description}</p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Technical & Engine Milestones</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {game.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 flex items-start gap-2.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                {game.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-purple-950/70 border border-purple-800 text-purple-300"
                  >
                    #{g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Process */}
          {activeTab === 'process' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Key Technical Challenges</h4>
                <div className="space-y-3">
                  {game.technicalChallenges.map((challenge, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex gap-3"
                    >
                      <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300 leading-relaxed">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Media Gallery */}
          {activeTab === 'gallery' && (
            <div className="columns-1 sm:columns-2 gap-4 space-y-4 pb-4">
              {game.previewVideo && (
                <div className="relative rounded-xl overflow-hidden bg-slate-800 border border-purple-500/40 break-inside-avoid shadow-sm">
                  <video
                    src={game.previewVideo}
                    controls
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-2.5 bg-slate-900/90 text-xs font-mono text-purple-300 border-t border-white/5">
                    Gameplay Clip
                  </div>
                </div>
              )}
              {game.screenshots.map((shot, idx) => (
                <div
                  key={idx}
                  onClick={() => setExpandedImage(shot)}
                  className="group cursor-pointer break-inside-avoid"
                >
                  <div className="relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 shadow-sm transition-all duration-300 group-hover:shadow-purple-500/20 group-hover:-translate-y-1">
                  <img
                    src={shot}
                    alt={`Gallery Image ${idx + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 shrink-0 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Engine: {game.engine}</span>
          <span className="text-purple-400">Available on Steam & Itch.io</span>
        </div>
        </div> {/* End of Content Container */}
      </div>
    </div>

      {/* Expanded Lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fadeIn cursor-pointer"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedImage(null);
            }}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={expandedImage}
            alt="Expanded View"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>,
    document.body
  );
}
