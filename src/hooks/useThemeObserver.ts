import { useEffect, useState, useCallback, useRef } from 'react';
import { SectionId, ColorMode } from '../types';

export const SECTION_THEMES: Record<SectionId, { class: string; label: string; accent: string; dark: boolean }> = {
  hero: { class: 'theme-hero', label: 'Overview', accent: '#ea580c', dark: false },
  engineering: { class: 'theme-tech', label: 'Rust & Engineering', accent: '#f97316', dark: true },
  gamedev: { class: 'theme-game', label: 'Game Studio', accent: '#a855f7', dark: true },
  art: { class: 'theme-art', label: 'Art Gallery', accent: '#2dd4bf', dark: false },
  sports: { class: 'theme-sports', label: 'Sports & Life', accent: '#0284c7', dark: false },
  contact: { class: 'theme-contact', label: 'Connect', accent: '#ff5722', dark: true },
};

const SECTIONS: SectionId[] = ['hero', 'engineering', 'gamedev', 'art', 'sports', 'contact'];

// Focus trigger line: ~40% down the viewport for natural reading-flow alignment
const TRIGGER_PERCENT = 0.40;

const getInitialColorMode = (): ColorMode => 'dark';

// Synchronously apply theme class, dark mode class, and meta theme-color to document
export const applyThemeClasses = (sectionId: SectionId, _colorMode?: ColorMode) => {
  const themeConfig = SECTION_THEMES[sectionId] || SECTION_THEMES.hero;

  Object.values(SECTION_THEMES).forEach((t) => {
    document.body.classList.remove(t.class);
    document.documentElement.classList.remove(t.class);
  });

  document.body.classList.add(themeConfig.class);
  document.documentElement.classList.add(themeConfig.class);

  // Exclusively dark mode
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
  document.body.classList.add('dark');
  document.body.classList.remove('light');
  document.documentElement.setAttribute('data-color-mode', 'dark');

  const metaThemeColor = document.querySelector("meta[name='theme-color']");
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeConfig.accent);
  }
};

// Authoritative, symmetric recompute — same result regardless of scroll direction.
// Walks sections bottom-to-top; the lowest section on screen that crossed the trigger line wins.
const evaluateActiveSection = (): SectionId => {
  const vh = window.innerHeight || document.documentElement.clientHeight || 800;
  const triggerY = vh * TRIGGER_PERCENT;

  const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.offsetHeight
  );

  // Bottom-of-page snap: activate contact when scrolled near the end
  if (docHeight > 0 && scrollY + vh >= docHeight - 60) {
    return 'contact';
  }
  // Top-of-page snap: activate hero when at the top
  if (scrollY < 40) {
    return 'hero';
  }

  // Bounding client rect evaluation across all sections
  for (let i = SECTIONS.length - 1; i >= 0; i--) {
    const id = SECTIONS[i];
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= triggerY && rect.bottom > 0) {
      return id;
    }
  }

  return 'hero';
};

export function useThemeObserver() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [colorMode, setColorModeState] = useState<ColorMode>(getInitialColorMode);
  const activeSectionRef = useRef<SectionId>('hero');
  const colorModeRef = useRef<ColorMode>(colorMode);
  const manualLockRef = useRef(false);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleRafRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Keep ref synced
  useEffect(() => {
    colorModeRef.current = colorMode;
  }, [colorMode]);

  // Synchronize on mount and whenever activeSection or colorMode state updates
  useEffect(() => {
    applyThemeClasses(activeSection, colorMode);
  }, [activeSection, colorMode]);

  const toggleColorMode = useCallback(() => {
    // Exclusively dark mode
    colorModeRef.current = 'dark';
    try {
      localStorage.setItem('portfolio_color_mode', 'dark');
    } catch (e) {
      // LocalStorage fallback
    }
    applyThemeClasses(activeSectionRef.current, 'dark');
  }, []);

  const setColorMode = useCallback((_mode: ColorMode) => {
    colorModeRef.current = 'dark';
    try {
      localStorage.setItem('portfolio_color_mode', 'dark');
    } catch (e) {
      // LocalStorage fallback
    }
    setColorModeState('dark');
    applyThemeClasses(activeSectionRef.current, 'dark');
  }, []);

  const runUpdate = useCallback(() => {
    if (manualLockRef.current) return;

    const detected = evaluateActiveSection();
    if (detected !== activeSectionRef.current) {
      activeSectionRef.current = detected;
      applyThemeClasses(detected, colorModeRef.current);
      setActiveSection(detected);
    }
  }, []);

  const scheduleTick = useCallback(() => {
    if (manualLockRef.current) return;
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      runUpdate();
    });
  }, [runUpdate]);

  const releaseLock = useCallback(() => {
    manualLockRef.current = false;
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
    if (settleRafRef.current !== null) {
      cancelAnimationFrame(settleRafRef.current);
      settleRafRef.current = null;
    }
  }, []);

  useEffect(() => {
    const elements = SECTIONS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    // Multi-threshold IntersectionObserver:
    // Does NOT rely solely on isIntersecting; forces boundingClientRect re-evaluation
    // within the callback on any intersectionRatio changes.
    let observer: IntersectionObserver | null = null;
    if (elements.length > 0) {
      const thresholds = [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
      observer = new IntersectionObserver(
        (entries) => {
          if (manualLockRef.current) return;
          // Inspect entry boundingClientRect and intersectionRatio
          for (const entry of entries) {
            if (entry.intersectionRatio >= 0 || entry.boundingClientRect) {
              scheduleTick();
              break;
            }
          }
        },
        { threshold: thresholds }
      );

      elements.forEach((el) => observer!.observe(el));
    }

    // Scroll & Gesture Handler:
    // If the user scrolls, drags, or gestures with wheel/touch, hand control back immediately
    const handleUserGesture = () => {
      if (manualLockRef.current) {
        releaseLock();
        scheduleTick();
      }
    };

    const handleScroll = () => {
      scheduleTick();
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('wheel', handleUserGesture, { passive: true, capture: true });
    window.addEventListener('touchmove', handleUserGesture, { passive: true, capture: true });
    window.addEventListener('touchstart', handleUserGesture, { passive: true, capture: true });
    window.addEventListener('keydown', handleUserGesture, { passive: true, capture: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check on mount
    runUpdate();

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll, { capture: true } as any);
      document.removeEventListener('scroll', handleScroll, { capture: true } as any);
      window.removeEventListener('wheel', handleUserGesture, { capture: true } as any);
      window.removeEventListener('touchmove', handleUserGesture, { capture: true } as any);
      window.removeEventListener('touchstart', handleUserGesture, { capture: true } as any);
      window.removeEventListener('keydown', handleUserGesture, { capture: true } as any);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      releaseLock();
    };
  }, [scheduleTick, runUpdate, releaseLock]);

  const scrollToSection = useCallback((sectionId: SectionId) => {
    manualLockRef.current = true;
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    if (settleRafRef.current !== null) cancelAnimationFrame(settleRafRef.current);

    // Show the clicked section as active immediately
    activeSectionRef.current = sectionId;
    applyThemeClasses(sectionId, colorModeRef.current);
    setActiveSection(sectionId);

    const el = document.getElementById(sectionId);
    if (!el) {
      releaseLock();
      return;
    }

    const navOffset = 64;
    const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const top = el.getBoundingClientRect().top + currentScroll - navOffset;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight,
      document.body.offsetHeight
    );
    const maxScroll = Math.max(0, docHeight - window.innerHeight);
    const targetY = Math.min(Math.max(0, top), maxScroll);

    window.scrollTo({ top: targetY, behavior: 'smooth' });

    // Release the lock only once the page has actually settled at the target —
    // this scales dynamically with scroll distance rather than an arbitrary timer guess.
    let settledFrames = 0;
    let lastScroll = -1;
    const watchForSettle = () => {
      const current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const distance = Math.abs(current - targetY);
      const isSettled = distance <= 3 || (Math.abs(current - lastScroll) < 0.5 && lastScroll >= 0);
      lastScroll = current;

      if (isSettled) {
        settledFrames++;
      } else {
        settledFrames = 0;
      }

      if (settledFrames >= 4) {
        releaseLock();
        runUpdate();
        return;
      }
      settleRafRef.current = requestAnimationFrame(watchForSettle);
    };
    settleRafRef.current = requestAnimationFrame(watchForSettle);

    // Safety net in case scroll never reports exactly settled (e.g. browser clamping)
    lockTimeoutRef.current = setTimeout(() => {
      releaseLock();
      runUpdate();
    }, 2500);
  }, [runUpdate, releaseLock]);

  return {
    activeSection,
    setActiveSection,
    scrollToSection,
    currentTheme: SECTION_THEMES[activeSection],
    colorMode,
    toggleColorMode,
    setColorMode,
  };
}
