import { SectionId } from '../types';
import { SECTION_THEMES } from '../hooks/useThemeObserver';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  activeSection: SectionId;
  onNavigate?: (section: SectionId) => void;
}

export function Footer({ activeSection }: FooterProps) {
  const currentTheme = SECTION_THEMES[activeSection];

  const initials = PERSONAL_INFO.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="portfolio-footer"
      className="relative z-10 border-t theme-border theme-canvas py-8 transition-colors duration-300 w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          {/* Brand & Ethos */}
          <div className="text-center md:text-left shrink-0">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs shadow"
                style={{ backgroundColor: currentTheme.accent }}
              >
                {initials}
              </div>
              <span className="font-extrabold text-lg theme-text-primary">{PERSONAL_INFO.name}</span>
            </div>
          </div>

          {/* Connect Across Networks */}
          <div className="flex-1 flex flex-wrap items-center justify-center gap-6 text-sm font-mono">
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noreferrer"
              className="theme-text-secondary hover:text-[var(--accent-primary)] transition-colors"
            >
              GitHub
            </a>
            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="theme-text-secondary hover:text-[var(--accent-primary)] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={PERSONAL_INFO.socials.artstation}
              target="_blank"
              rel="noreferrer"
              className="theme-text-secondary hover:text-[var(--accent-primary)] transition-colors"
            >
              ArtStation
            </a>
            <a
              href={PERSONAL_INFO.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="theme-text-secondary hover:text-[var(--accent-primary)] transition-colors"
            >
              X (Twitter)
            </a>
            {PERSONAL_INFO.socials.strava && (
              <a
                href={PERSONAL_INFO.socials.strava}
                target="_blank"
                rel="noreferrer"
                className="theme-text-secondary hover:text-[var(--accent-primary)] transition-colors"
              >
                Strava
              </a>
            )}
            {PERSONAL_INFO.socials.leetcode && (
              <a
                href={PERSONAL_INFO.socials.leetcode}
                target="_blank"
                rel="noreferrer"
                className="theme-text-secondary hover:text-[var(--accent-primary)] transition-colors"
              >
                LeetCode
              </a>
            )}
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t theme-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono theme-text-muted">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {PERSONAL_INFO.name}.</span>
            <span>All rights reserved.</span>
          </div>

          {/* Back to top link */}
          <button
            id="back-to-top-btn"
            onClick={handleBackToTop}
            className="flex items-center gap-1.5 theme-text-secondary hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
