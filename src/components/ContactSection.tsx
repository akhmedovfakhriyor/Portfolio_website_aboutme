import { useState , useRef} from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Mail, MapPin, Sparkles, Copy, Check } from 'lucide-react';

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"]
  });
  const { scrollYProgress: enterProgress } = useScroll({
    target: sectionRef,
    offset: ["start 100%", "start 35%"]
  });

  // Distinct 3D depth emergence from behind (entrance), staying 100% solid at page bottom
  const sectionScale = useTransform(enterProgress, [0, 1], [0.85, 1]);
  const sectionY = useTransform(scrollYProgress, [0, 0.45, 1], [150, 0, 0], { clamp: true });
  const sectionOpacity = useTransform(enterProgress, [0, 1], [0.1, 1]);

  // Floating ambient parallax constrained to avoid vertical document overflow
  const bgY = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="relative pt-14 pb-8 sm:pt-20 sm:pb-12 theme-canvas overflow-x-clip" ref={sectionRef}>
      {/* Seamless Ambient Radial Glow without edge clipping */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(234,88,12,0.12),transparent_70%)] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[480px] h-[260px] bg-orange-600/10 blur-[110px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div style={{ y: headerY }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold theme-badge mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Phase 05 // Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight theme-text-primary mb-4">
            Let&apos;s Build Something Remarkable.
          </h2>
          <p className="text-sm sm:text-base theme-text-secondary leading-relaxed max-w-2xl mx-auto">
            Whether you want to discuss systems engineering, game development, 3D art direction, or athletics — feel free to reach out directly via email or connect on social platforms.
          </p>
        </motion.div>

        {/* Primary Contact Cards Grid */}
        <motion.div style={{ y: cardsY }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Direct Email Card */}
          <div className="p-6 rounded-3xl border theme-border theme-card shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono theme-text-muted">Direct Email</div>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-base font-bold theme-text-primary font-mono hover:text-orange-500 transition-colors break-all"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t theme-border">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
              <button
                id="copy-email-btn"
                onClick={handleCopyEmail}
                className="py-2.5 px-4 rounded-xl border theme-border hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer theme-text-secondary"
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Location & Timezone Card */}
          <div className="p-6 rounded-3xl border theme-border theme-card shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono theme-text-muted">Location & Timezone</div>
                <div className="text-base font-bold theme-text-primary mt-0.5">{PERSONAL_INFO.location}</div>
                <p className="text-xs theme-text-secondary mt-1">Available for remote contracts, full-time roles & global collaborations.</p>
              </div>
            </div>

            <div className="pt-4 border-t theme-border flex items-center gap-2 text-xs font-mono theme-text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: Open to inquiries & opportunities</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
