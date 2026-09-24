import { RefObject } from 'react';
import { useScroll, useTransform, useSpring, MotionValue } from 'motion/react';

interface UseSectionMotionOptions {
  isLastSection?: boolean;
  titleRef?: RefObject<HTMLElement | null>;
}

interface SectionMotionResult {
  sectionY: MotionValue<number>;
  sectionScale: MotionValue<number>;
  sectionOpacity: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

export function useSectionMotion(
  sectionRef: RefObject<HTMLElement | null>,
  options: UseSectionMotionOptions = {}
): SectionMotionResult {
  const { isLastSection = false, titleRef } = options;

  // The motion entry target: if a specific section title/header ref is provided,
  // accurately track the title element itself; otherwise fall back to sectionRef.
  const motionTarget = titleRef || sectionRef;

  // Global scroll progress for background parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Entry window: begins as the section name enters the bottom of the viewport (0%),
  // reaching full size (100% scale) ONLY when the section name has passed 65% of the screen
  // (where 0 is bottom and 100% is top of the screen, corresponding to 35% from top of viewport).
  const { scrollYProgress: rawEnterProgress } = useScroll({
    target: motionTarget,
    offset: ['start 100%', 'start 35%'],
  });

  // Exit window: gently recedes into depth as the bottom of the section scrolls past
  const { scrollYProgress: rawExitProgress } = useScroll({
    target: sectionRef,
    offset: ['end 80%', 'end 15%'],
  });

  // Responsive spring physics filter: delivers immediate scroll tracking during rapid motion
  // while preserving silky, organic cubic deceleration without sluggish rubber-banding lag
  const enterSpring = useSpring(rawEnterProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.08,
    restDelta: 0.001,
  });

  const exitSpring = useSpring(rawExitProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.08,
    restDelta: 0.001,
  });

  // Silky vertical float: gently lifts up 50px into place
  const sectionY = useTransform([enterSpring, exitSpring], ([enter, exit]: number[]) => {
    const clampedEnter = Math.max(0, Math.min(1, enter));
    if (clampedEnter < 1) {
      // Smooth power curve so vertical float completes cleanly at full size
      const factor = Math.pow(clampedEnter, 1.2);
      return (1 - factor) * 50;
    }
    if (!isLastSection) {
      const clampedExit = Math.max(0, Math.min(1, exit));
      if (clampedExit > 0) {
        return -clampedExit * 35;
      }
    }
    return 0;
  });

  // 3D depth emergence: starts distinctly smaller at 0.80 scale (20% reduced) when first
  // coming onto the screen, and smoothly expands into full size (1.0) precisely when
  // the section name crosses 65% of the screen
  const sectionScale = useTransform([enterSpring, exitSpring], ([enter, exit]: number[]) => {
    const clampedEnter = Math.max(0, Math.min(1, enter));
    if (clampedEnter < 1) {
      const factor = Math.pow(clampedEnter, 1.2);
      return 0.80 + 0.20 * factor;
    }
    if (!isLastSection) {
      const clampedExit = Math.max(0, Math.min(1, exit));
      if (clampedExit > 0) {
        return 1 - 0.06 * clampedExit;
      }
    }
    return 1;
  });

  // Smooth, natural opacity dissolve starting from a subtle 0.20
  const sectionOpacity = useTransform([enterSpring, exitSpring], ([enter, exit]: number[]) => {
    const clampedEnter = Math.max(0, Math.min(1, enter));
    if (clampedEnter < 1) {
      return 0.20 + 0.80 * Math.pow(clampedEnter, 1.15);
    }
    if (!isLastSection) {
      const clampedExit = Math.max(0, Math.min(1, exit));
      if (clampedExit > 0) {
        return Math.max(0, 1 - clampedExit);
      }
    }
    return 1;
  });

  return {
    sectionY,
    sectionScale,
    sectionOpacity,
    scrollYProgress,
  };
}
