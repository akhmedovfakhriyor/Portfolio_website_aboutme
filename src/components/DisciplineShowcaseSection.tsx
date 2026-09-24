import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { SectionId } from '../types';
import { Discipline3DSlider } from './Discipline3DSlider';

interface DisciplineShowcaseSectionProps {
  onNavigate: (section: SectionId) => void;
}

export function DisciplineShowcaseSection({ onNavigate }: DisciplineShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { sectionY, sectionScale, sectionOpacity, scrollYProgress } = useSectionMotion(sectionRef, {
    titleRef,
  });

  // Ambient background depth parallax
  const bgY = useTransform(scrollYProgress, [0, 1], [-70, 70]);

  return (
    <section
      id="disciplines"
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-20 theme-canvas overflow-x-clip min-h-screen flex flex-col justify-center"
    >
      {/* Background ambient radial glow accent with parallax (hardware-accelerated, zero blur raster cost) */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[450px] sm:h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14)_0%,rgba(249,115,22,0.03)_50%,transparent_75%)] rounded-full pointer-events-none -z-10 will-change-transform transform-gpu"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center will-change-transform transform-gpu"
      >
        <Discipline3DSlider onNavigate={onNavigate} headerRef={titleRef} />
      </motion.div>
    </section>
  );
}
