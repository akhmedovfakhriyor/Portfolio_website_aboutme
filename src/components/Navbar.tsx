import { useState, useEffect } from 'react';
import { SectionId, ColorMode } from '../types';
import { SECTION_THEMES } from '../hooks/useThemeObserver';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Terminal, Gamepad2, Palette, Activity, Send, Menu, X, Compass, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  colorMode: ColorMode;
  onToggleColorMode: () => void;
  onOpenResume?: () => void;
}

export function Navbar({ activeSection, onNavigate, colorMode, onToggleColorMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: SectionId; label: string; icon: any }[] = [
    { id: 'hero', label: 'Home', icon: Compass },
    { id: 'engineering', label: 'Systems & Code', icon: Terminal },
    { id: 'gamedev', label: 'Game Dev', icon: Gamepad2 },
    { id: 'art', label: 'Art Gallery', icon: Palette },
    { id: 'sports', label: 'Athletics & Life', icon: Activity },
    { id: 'contact', label: 'Contact', icon: Send },
  ];

  const currentTheme = SECTION_THEMES[activeSection];
  const isLightAccent = currentTheme.accent === '#2dd4bf';

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 py-3.5 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
        scrolled
          ? 'backdrop-blur-xl theme-border shadow-md'
          : 'border-transparent bg-transparent'
      }`}
      style={{
        backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Current Discipline Tag */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('hero')}
            className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer shrink-0"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg transition-[background-color,color,transform] group-hover:scale-105 duration-[800ms] ease-out ${
                isLightAccent ? 'text-slate-950 font-bold' : 'text-white'
              }`}
              style={{ backgroundColor: currentTheme.accent }}
            >
              <span className="font-mono text-base font-bold">
                {PERSONAL_INFO.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight leading-none theme-text-primary">
                {PERSONAL_INFO.name}
              </div>
              <div className="text-xs font-mono theme-text-muted mt-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full transition-colors duration-250" style={{ backgroundColor: currentTheme.accent }} />
                <span className="transition-colors duration-200">{currentTheme.label}</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Pill Dock */}
          <nav
            id="desktop-nav-dock"
            className="hidden md:flex items-stretch gap-1.5 p-1.5 rounded-full border theme-border shadow-sm backdrop-blur-md transition-colors duration-250 overflow-hidden"
            style={{ backgroundColor: 'var(--surface-card)' }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center justify-center gap-2 px-3 py-2 lg:px-3.5 rounded-full text-xs font-semibold tracking-wide transition-[background-color,color,box-shadow] duration-[800ms] ease-out cursor-pointer ${
                    isActive
                      ? isLightAccent
                        ? 'text-slate-950 font-bold shadow-sm'
                        : 'text-white shadow-md'
                      : 'theme-text-secondary hover:theme-text-primary hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.accent : 'transparent',
                  }}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:block xl:whitespace-nowrap leading-[1.1] text-left">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Theme Mode Toggle */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Dark / Light Mode Toggle Button */}
            <button
              id="theme-mode-toggle-btn"
              onClick={onToggleColorMode}
              aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
              className="flex items-center justify-center w-9 h-9 rounded-full border theme-border theme-card shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
            >
              {colorMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 group-hover:-translate-y-0.5 transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-theme-mode-toggle-btn"
              onClick={onToggleColorMode}
              aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2.5 rounded-xl border theme-border theme-card focus:outline-none cursor-pointer"
            >
              {colorMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border theme-border theme-card focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 theme-text-primary" />
              ) : (
                <Menu className="w-5 h-5 theme-text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden px-4 pt-3 pb-5 mt-2 border-b theme-border theme-card shadow-2xl space-y-2 transition-all duration-300"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? isLightAccent
                      ? 'text-slate-950 font-bold shadow-sm'
                      : 'text-white shadow-md'
                    : 'theme-text-primary hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isActive ? currentTheme.accent : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
