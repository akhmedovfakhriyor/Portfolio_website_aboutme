/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useThemeObserver } from './hooks/useThemeObserver';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RustCodeExplorer } from './components/RustCodeExplorer';
import { GameSection } from './components/GameSection';
import { ArtSection } from './components/ArtSection';
import { SportsSection } from './components/SportsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GlobalConstellationCanvas } from './components/GlobalConstellationCanvas';
import { ResumeModal } from './components/ResumeModal';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CommandPalette } from './components/CommandPalette';
import { startBackgroundAssetPreloading } from './utils/assetPreloader';

export default function App() {
  const { activeSection, scrollToSection, colorMode, toggleColorMode } = useThemeObserver();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    // Start idle preloading for all media assets so they load seamlessly as user scrolls
    startBackgroundAssetPreloading(600);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="app-root" className="min-h-screen theme-canvas relative selection:bg-orange-500/20 selection:text-orange-500 overflow-x-clip">
      {/* Global Interactive Constellation Canvas (Adapts color & curvature across all themes) */}
      <GlobalConstellationCanvas activeSection={activeSection} />

      {/* Dynamic Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        colorMode={colorMode}
        onToggleColorMode={toggleColorMode}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Sections */}
      <main className="relative z-10 overflow-x-clip">
        {/* 1. Home / Hero Section */}
        <HeroSection
          onNavigate={scrollToSection}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* 2. Technical & Software Engineering Section */}
        <RustCodeExplorer />

        {/* 3. Game Development Section */}
        <GameSection />

        {/* 4. Art Gallery Section */}
        <ArtSection />

        {/* 5. Personal Life & Sports Section */}
        <SportsSection />

        {/* 6. Contact Section */}
        <ContactSection
          onOpenResume={() => setIsResumeOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Floating Go to Top Round Button (Bottom Right) */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          id="scroll-to-top-btn"
          onClick={() => scrollToSection('hero')}
          aria-label="Scroll to top"
          title="Back to top"
          className="group w-12 h-12 rounded-full border theme-border bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xl hover:shadow-2xl hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 stroke-[2.5]" />
        </button>
      </div>

      <CommandPalette
        colorMode={colorMode}
        onToggleColorMode={toggleColorMode}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Interactive Printable & Downloadable Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

