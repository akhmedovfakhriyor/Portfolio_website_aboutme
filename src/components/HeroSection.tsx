import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { SectionId } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowRight, Github, Send, FileText, Code, Gamepad2 } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: SectionId) => void;
  onOpenResume?: () => void;
}

export function HeroSection({ onNavigate, onOpenResume }: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.16,
    restDelta: 0.0005,
  });

  // Exit transforms: as user scrolls down, hero holds focus and smoothly recedes with organic spring physics
  const heroScale = useTransform(smoothProgress, [0, 0.35, 0.95], [1, 1, 0.93], { clamp: true });
  const heroY = useTransform(smoothProgress, [0, 0.35, 0.95], [0, 0, -40], { clamp: true });
  const heroOpacity = useTransform(smoothProgress, [0, 0.35, 0.9], [1, 1, 0], { clamp: true });

  // Differential parallax depth
  const heroBgY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const heroBgOrb2Y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 15]);

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

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 overflow-x-clip theme-canvas min-h-screen flex flex-col justify-center"
    >
      {/* Subtle Ambient Radial Gradients with parallax (hardware-accelerated, zero blur raster cost) */}
      <motion.div
        style={{ y: heroBgY }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14)_0%,rgba(249,115,22,0.04)_50%,transparent_75%)] rounded-full pointer-events-none -z-10 will-change-transform transform-gpu"
      />
      <motion.div
        style={{ y: heroBgOrb2Y }}
        className="absolute top-1/2 right-1/4 w-[400px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.14)_0%,rgba(168,85,247,0.04)_50%,transparent_75%)] rounded-full pointer-events-none -z-10 will-change-transform transform-gpu"
      />

      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full will-change-transform transform-gpu"
      >
        {/* Dynamic Headline */}
        <motion.div style={{ y: headlineY }} className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight theme-text-primary leading-[1.1] mb-6">
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
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 text-base sm:text-xl lg:text-2xl font-bold mb-6 min-h-[3.25rem] sm:min-h-[2.5rem]">
            <span className="theme-text-muted font-normal shrink-0">Systems I build as a</span>
            <div className="inline-flex items-baseline max-w-full">
              <span className={`font-mono border-b-2 border-current pb-0.5 inline-flex items-baseline break-words ${
                roleIndex === 0 ? 'text-orange-500' :
                roleIndex === 1 ? 'text-purple-500' :
                roleIndex === 2 ? 'text-teal-500' :
                'text-sky-500'
              }`}>
                <span>{typedText}</span>
                <span className="inline-block w-0 select-none pointer-events-none text-transparent" aria-hidden="true">
                  J
                </span>
                <span className={`animate-pulse inline-block ml-[2px] w-[3px] h-[0.85em] self-center shrink-0 ${
                  roleIndex === 0 ? 'bg-orange-500' :
                  roleIndex === 1 ? 'bg-purple-500' :
                  roleIndex === 2 ? 'bg-teal-500' :
                  'bg-sky-500'
                }`} />
              </span>
            </div>
          </div>

          <p className="text-[18px] theme-text-secondary leading-relaxed max-w-3xl mb-10">
            {PERSONAL_INFO.bio}
          </p>

          {/* Primary Action Buttons */}
          <div className="w-full max-w-[360px] grid grid-cols-4 gap-2.5 mb-0 sm:max-w-none sm:flex sm:flex-wrap sm:items-center sm:gap-3.5">
            {/* Explore Technical Work */}
            <button
              id="hero-explore-work-btn"
              onClick={() => onNavigate('engineering')}
              className="col-span-4 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/25 transition-all hover:scale-[1.02] sm:hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              <Code className="w-4 h-4" />
              <span>Explore Technical Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Games */}
            <button
              id="hero-play-games-btn"
              onClick={() => onNavigate('gamedev')}
              className="col-span-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm border theme-border theme-card hover:border-orange-500/50 shadow-sm transition-all hover:scale-[1.02] sm:hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Games</span>
            </button>

            {/* Resume / CV */}
            {onOpenResume && (
              <button
                id="hero-view-resume-btn"
                onClick={onOpenResume}
                className="col-span-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl font-bold text-sm font-mono border border-orange-500/30 theme-card text-orange-600 dark:text-orange-400 hover:border-orange-500 hover:bg-orange-500/10 shadow-sm transition-all hover:scale-[1.02] sm:hover:scale-105 active:scale-95 duration-200 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Resume / CV</span>
              </button>
            )}

            {/* GitHub */}
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noreferrer"
              className="col-span-1 w-full sm:w-auto p-3 sm:p-3.5 rounded-xl border theme-border theme-card hover:text-orange-500 hover:border-orange-500/50 hover:scale-[1.05] active:scale-95 transition-all duration-200 flex items-center justify-center"
              aria-label="GitHub Profile"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {/* Telegram */}
            <a
              href={PERSONAL_INFO.socials.telegram}
              target="_blank"
              rel="noreferrer"
              className="col-span-1 w-full sm:w-auto p-3 sm:p-3.5 rounded-xl border theme-border theme-card text-sky-500 hover:text-sky-400 hover:border-sky-500/50 hover:scale-[1.05] active:scale-95 transition-all duration-200 flex items-center justify-center"
              aria-label="Telegram (@HardstuckIron)"
              title="Telegram (@HardstuckIron)"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
