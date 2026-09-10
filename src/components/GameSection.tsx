import { useState , useRef} from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { GAME_PROJECTS } from '../data/portfolioData';
import { GameProject } from '../types';
import { GameCard } from './GameCard';
import { GameModal } from './GameModal';
import { Gamepad2, Sparkles, Layers, Terminal, MonitorPlay } from 'lucide-react';

export function GameSection() {
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
  const sectionY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [200, 0, 0, -200], { clamp: true });
  const sectionOpacity = useTransform(() => {
    const enter = enterProgress.get();
    const exit = exitProgress.get();
    if (enter < 1) return 0.1 + (0.9 * enter);
    if (exit > 0) return 1 - (0.9 * exit);
    return 1;
  });

  // Differential parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const featuresY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  const [selectedGame, setSelectedGame] = useState<GameProject | null>(null);
  const [engineFilter, setEngineFilter] = useState<string>('All');

  const engines = ['All', 'Unity 2023', 'Unity 6'];

  const filteredGames = engineFilter === 'All'
    ? GAME_PROJECTS
    : GAME_PROJECTS.filter((g) => g.engine === engineFilter);

  return (
    <section id="gamedev" className="relative py-4 sm:py-6 theme-canvas overflow-x-clip" ref={sectionRef}>
      {/* Ambient Neon Purple Gradient */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold theme-badge mb-3">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Discipline 02 // Game Development</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight theme-text-primary">
              Real-Time Worlds & ECS Simulations
            </h2>
            <p className="mt-3 text-sm sm:text-base theme-text-secondary max-w-2xl leading-relaxed">
              Crafting bespoke gameplay systems, responsive character controllers, custom HLSL/WGSL shaders, and procedural world generators across modern engines.
            </p>
          </div>

          {/* Engine Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {engines.map((eng) => (
              <button
                key={eng}
                id={`engine-filter-${eng.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setEngineFilter(eng)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  engineFilter === eng
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'border theme-border theme-card theme-text-secondary hover:theme-text-primary'
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Feature Highlights Row */}
        <motion.div style={{ y: featuresY }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-2xl border theme-border theme-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono theme-text-muted">Procedural Animation</div>
              <div className="text-sm font-bold theme-text-primary">Inverse Kinematics & Locomotion</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl border theme-border theme-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono theme-text-muted">Custom Rendering</div>
              <div className="text-sm font-bold theme-text-primary">Pixel-Perfect Tracking & Shaders</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl border theme-border theme-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono theme-text-muted">Game Mechanics</div>
              <div className="text-sm font-bold theme-text-primary">Spatial Puzzles & Physics</div>
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div style={{ y: cardsY }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={(g) => setSelectedGame(g)}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Game Detail Modal */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </section>
  );
}
