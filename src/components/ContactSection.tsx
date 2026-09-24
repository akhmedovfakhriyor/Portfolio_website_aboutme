import { useState, useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Mail, MapPin, Sparkles, Copy, Check, Send, FileText, Download } from 'lucide-react';

interface ContactSectionProps {
  onOpenResume?: () => void;
}

export function ContactSection({ onOpenResume }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { sectionY, sectionScale, sectionOpacity, scrollYProgress } = useSectionMotion(sectionRef, {
    titleRef,
    isLastSection: true,
  });

  // Floating ambient parallax constrained to avoid vertical document overflow
  const bgY = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTelegram, setCopiedTelegram] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyTelegram = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.telegramHandle);
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 2000);
  };

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-24 min-h-screen flex flex-col justify-center theme-canvas overflow-x-clip" ref={sectionRef}>
      {/* Seamless Ambient Radial Glow without edge clipping */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(234,88,12,0.12),transparent_70%)] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[480px] h-[260px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.14)_0%,rgba(234,88,12,0.03)_50%,transparent_75%)] rounded-full pointer-events-none -z-10 will-change-transform transform-gpu"
        aria-hidden="true"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full will-change-transform transform-gpu"
      >
        <motion.div ref={titleRef} style={{ y: headerY }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold theme-badge mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Phase 05 // Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight theme-text-primary mb-4">
            Let&apos;s Build Something Remarkable.
          </h2>
          <p className="text-sm sm:text-base theme-text-secondary leading-relaxed max-w-2xl mx-auto">
            Whether you want to discuss systems engineering, game development, 3D art direction, or career opportunities — feel free to reach out directly via Telegram, email, or view my resume.
          </p>
        </motion.div>

        {/* Primary Contact Cards Grid */}
        <motion.div style={{ y: cardsY }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Direct Email Card */}
          <div className="p-4 sm:p-6 rounded-3xl border theme-border theme-card shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0 w-full">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono theme-text-muted">Direct Email</div>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-sm sm:text-base font-bold theme-text-primary font-mono hover:text-orange-500 transition-colors break-words block leading-snug mt-0.5"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t theme-border">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/20"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>Send Email</span>
              </a>
              <button
                id="copy-email-btn"
                onClick={handleCopyEmail}
                className="py-2.5 px-3 sm:px-4 rounded-xl border theme-border hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer theme-text-secondary shrink-0"
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Direct Telegram Card (Blue Styling) */}
          <div className="p-4 sm:p-6 rounded-3xl border border-sky-500/20 theme-card shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0 w-full">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono text-sky-600 dark:text-sky-400 font-semibold">Direct Telegram</div>
                  <a
                    href={PERSONAL_INFO.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm sm:text-base font-bold theme-text-primary font-mono hover:text-sky-500 transition-colors break-words block leading-snug mt-0.5"
                  >
                    {PERSONAL_INFO.telegramHandle}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t theme-border">
              <a
                href={PERSONAL_INFO.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Message on Telegram</span>
              </a>
              <button
                id="copy-telegram-btn"
                onClick={handleCopyTelegram}
                className="py-2.5 px-3 sm:px-4 rounded-xl border border-sky-500/30 hover:bg-sky-500/10 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer text-sky-600 dark:text-sky-400 shrink-0"
                title="Copy Telegram username"
              >
                {copiedTelegram ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedTelegram ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Resume / CV Card */}
          <div className="p-4 sm:p-6 rounded-3xl border theme-border theme-card shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-mono theme-text-muted">Curriculum Vitae</div>
                <div className="text-sm sm:text-base font-bold theme-text-primary mt-0.5 leading-snug">
                  Resume (C# / Unity Game Dev)
                </div>
                <p className="text-xs theme-text-secondary mt-1 leading-relaxed">
                  1-page printable CV detailing project architecture, Unity/Rust experience, and technical achievements.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t theme-border flex items-center gap-2">
              <button
                id="contact-open-resume-btn"
                onClick={onOpenResume}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>View & Download Resume / CV</span>
              </button>
            </div>
          </div>

          {/* Location & Timezone Card */}
          <div className="p-4 sm:p-6 rounded-3xl border theme-border theme-card shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-mono theme-text-muted">Location & Timezone</div>
                <div className="text-sm sm:text-base font-bold theme-text-primary mt-0.5 leading-snug">{PERSONAL_INFO.location}</div>
                <p className="text-xs theme-text-secondary mt-1 leading-relaxed">Available for remote contracts, full-time game dev roles & global opportunities.</p>
              </div>
            </div>

            <div className="pt-4 border-t theme-border flex items-center gap-2 text-xs font-mono theme-text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: Open to Junior Game Dev roles</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

