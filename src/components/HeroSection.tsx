import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SectionId } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Terminal, Gamepad2, Palette, Activity, ArrowRight, Github, Linkedin, Award, Code, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: SectionId) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Exit transforms: as user scrolls down, hero recedes smoothly in depth
  const heroScale = useTransform(scrollYProgress, [0, 0.4, 0.9], [1, 1, 0.85], { clamp: true });
  const heroY = useTransform(scrollYProgress, [0, 0.85], [0, -40], { clamp: true });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4, 0.9], [1, 1, 0], { clamp: true });

  // Differential parallax depth
  const heroBgY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const heroBgOrb2Y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, -15]);

  // Typewriter effect with synchronized role color and crisp transition
  useEffect(() => {
    const currentTitle = PERSONAL_INFO.titles[roleIndex];
    
    let timer: NodeJS.Timeout;
    
    if (!isDeleting && typedText === currentTitle) {
      // Pause at the end of typing
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && typedText === '') {
      // Word fully erased: immediately switch role index so cursor & color match the next word
      setRoleIndex((prev) => (prev + 1) % PERSONAL_INFO.titles.length);
      setIsDeleting(false);
    } else if (!isDeleting && typedText === '') {
      // Brief pause on empty cursor before typing the first letter of the new role
      timer = setTimeout(() => {
        setTypedText(currentTitle.substring(0, 1));
      }, 250);
    } else {
      // Typing or deleting characters
      const timeoutTime = isDeleting ? 40 : 80;
      timer = setTimeout(() => {
        setTypedText(currentTitle.substring(0, typedText.length + (isDeleting ? -1 : 1)));
      }, timeoutTime);
    }
    
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, roleIndex]);

  const disciplines = [
    {
      id: 'engineering' as SectionId,
      title: 'Systems & Software',
      subtitle: 'Rust & High-Performance Architecture',
      tag: 'Rust / Systems',
      icon: Terminal,
      color: '#f97316',
      bgGlow: 'from-orange-500/10 to-amber-500/5',
      stat: 'Cortex-FS Explorer (0.2ms)',
      metric: '620+ LeetCode Guardian',
    },
    {
      id: 'gamedev' as SectionId,
      title: 'Game Development',
      subtitle: 'Unity 2023, Unity 6',
      tag: 'Unreal / Bevy',
      icon: Gamepad2,
      color: '#a855f7',
      bgGlow: 'from-purple-500/10 to-indigo-500/5',
      stat: '4 Playable Engine Titles',
      metric: 'Temporal Heist Roguelite',
    },
    {
      id: 'art' as SectionId,
      title: '3D & Visual Atelier',
      subtitle: 'Hard-Surface Assets, Concept Art',
      tag: 'Blender / ZBrush',
      icon: Palette,
      color: '#2dd4bf',
      bgGlow: 'from-teal-400/20 to-emerald-400/10',
      stat: 'Interactive 3D Viewport',
      metric: 'PBR 4K Mecha & Environments',
    },
    {
      id: 'sports' as SectionId,
      title: 'Athletics & Endurance',
      subtitle: 'AITU Running Club, Competitive Sports & Speedcubing',
      tag: 'Endurance / CFOP',
      icon: Activity,
      color: '#0284c7',
      bgGlow: 'from-sky-500/10 to-cyan-500/5',
      stat: '15 km - 5:20 / km',
      metric: `${PERSONAL_INFO.stats.speedcubePB} PB`,
    },
  ];

  return (
    <section id="hero" ref={sectionRef} className="relative pt-20 pb-4 sm:pt-24 sm:pb-8 overflow-x-clip theme-canvas">
      {/* Subtle Ambient Radial Gradients with parallax */}
      <motion.div
        style={{ y: heroBgY }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none -z-10"
      />
      <motion.div
        style={{ y: heroBgOrb2Y }}
        className="absolute top-1/2 right-1/4 w-[400px] h-[300px] bg-purple-500/10 dark:bg-purple-500/5 blur-[100px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        {/* Dynamic Headline */}
        <motion.div style={{ y: headlineY }} className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight theme-text-primary leading-[1.08] mb-6">
            Designing systems at the nexus of{' '}
            <span className="relative inline-block text-orange-600 dark:text-orange-400">
              rigor
              <span className="absolute bottom-1 left-0 w-full h-2 bg-orange-500/20 -z-10 -rotate-1" />
            </span>{' '}
            and{' '}
            <span className="relative inline-block text-purple-600 dark:text-purple-400">
              imagination.
              <span className="absolute bottom-1 left-0 w-full h-2 bg-purple-500/20 -z-10 rotate-1" />
            </span>
          </h1>

          {/* Typewriter / Cycling Role Display */}
          <div className="flex flex-wrap items-center gap-2 text-xl sm:text-2xl lg:text-3xl font-bold mb-8 h-10 sm:h-12">
            <span className="theme-text-muted font-normal">Systems I build as a</span>
            <div className="inline-flex items-center">
              <span className={`font-mono ${
                roleIndex === 0 ? 'text-orange-500' :
                roleIndex === 1 ? 'text-purple-500' :
                roleIndex === 2 ? 'text-teal-500' :
                'text-sky-500'
              }`}>
                {typedText}
                <span className={`animate-pulse inline-block ml-[2px] w-[3px] h-[1em] align-middle -mt-1 ${
                  roleIndex === 0 ? 'bg-orange-500' :
                  roleIndex === 1 ? 'bg-purple-500' :
                  roleIndex === 2 ? 'bg-teal-500' :
                  'bg-sky-500'
                }`} />
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg lg:text-xl theme-text-secondary leading-relaxed max-w-3xl mb-10">
            {PERSONAL_INFO.bio}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <button
              id="hero-explore-work-btn"
              onClick={() => onNavigate('engineering')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/25 transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              <Code className="w-4 h-4" />
              <span>Explore Technical Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-play-games-btn"
              onClick={() => onNavigate('gamedev')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border theme-border theme-card hover:border-orange-500/50 shadow-sm transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-purple-500" />
              <span>Play Game Prototypes</span>
            </button>

            <div className="flex items-center gap-2 ml-auto sm:ml-2">
              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border theme-border theme-card hover:text-orange-500 hover:scale-110 transition-all duration-200"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border theme-border theme-card hover:text-sky-500 hover:scale-110 transition-all duration-200"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* 4 Multi-Disciplinary Jump Cards */}
        <motion.div style={{ y: cardsY }} className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-bold tracking-wider uppercase theme-text-muted">
              Choose a discipline to enter its custom dynamic space
            </h2>
            <span className="text-xs font-mono text-orange-600 dark:text-orange-400">
              Scroll down or click to transition theme
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {disciplines.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                  key={item.id}
                  id={`discipline-card-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className="group cursor-pointer h-full"
                >
                  <div className="relative p-5 rounded-2xl border theme-border theme-card transition-all duration-300 overflow-hidden flex flex-col justify-between h-full group-hover:shadow-xl group-hover:-translate-y-1.5">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.bgGlow} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`} />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:rotate-6 duration-300 ${
                          item.color === '#2dd4bf' ? 'text-slate-950 font-bold' : 'text-white'
                        }`}
                        style={{ backgroundColor: item.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border theme-border opacity-80">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold theme-text-primary group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs theme-text-secondary line-clamp-2 mb-4 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t theme-border flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-[11px] font-mono theme-text-muted">Highlight</div>
                      <div className="text-xs font-bold font-mono theme-text-primary">{item.stat}</div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 duration-300"
                      style={{ color: item.color }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
