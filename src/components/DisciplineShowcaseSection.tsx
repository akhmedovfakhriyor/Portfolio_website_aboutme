import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SectionId } from '../types';
import { Discipline3DSlider } from './Discipline3DSlider';

interface DisciplineShowcaseSectionProps {
  onNavigate: (section: SectionId) => void;
}

export function DisciplineShowcaseSection({ onNavigate }: DisciplineShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Multi-phase scroll tracking: strictly begins emerging once upper section is scrolled halfway
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const { scrollYProgress: enterProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'start 25%'],
  });
  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ['end 75%', 'end 20%'],
  });

  // Accelerated parallax translation: lifts up into view as upper section is scrolled halfway
  const sectionY = useTransform([enterProgress, exitProgress], ([enter, exit]: number[]) => {
    if (enter < 1) {
      const remaining = Math.max(0, 1 - enter);
      return remaining * remaining * 150;
    }
    if (exit > 0) {
      return -exit * 60;
    }
    return 0;
  });

  // Smooth 3D depth emergence & exit: starts deep at 0.82 and gets close to us (1.0)
  const sectionScale = useTransform([enterProgress, exitProgress], ([enter, exit]: number[]) => {
    if (enter < 1) return 0.82 + 0.18 * Math.max(0, enter);
    if (exit > 0) return 1 - 0.12 * exit;
    return 1;
  });

  // Strict unfading: 0 while looking at upper section, unfades to 1 once scrolled halfway
  const sectionOpacity = useTransform([enterProgress, exitProgress], ([enter, exit]: number[]) => {
    if (enter < 1) {
      return Math.max(0, Math.min(1, enter));
    }
    if (exit > 0) return Math.max(0, 1 - exit);
    return 1;
  });

  // Ambient background depth parallax
  const bgY = useTransform(scrollYProgress, [0, 1], [-90, 90]);

  return (
    <section
      id="disciplines"
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-20 theme-canvas overflow-x-clip min-h-screen flex flex-col justify-center"
    >
      {/* Background ambient radial glow accent with parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[450px] sm:h-[550px] bg-orange-500/10 dark:bg-orange-500/5 blur-[140px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center"
      >
        <Discipline3DSlider onNavigate={onNavigate} />
      </motion.div>
    </section>
  );
}
