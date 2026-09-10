import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ExternalLink, Mail, Send, MapPin, FileText, Loader2, Check } from 'lucide-react';
import { RESUME_DATA } from '../data/portfolioData';
import { generateResumePdf } from '../utils/generateResumePdf';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const resumePaperRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDownloadPDF = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      // Small tick to render the loading state smoothly
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      generateResumePdf();
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Seamless browser print fallback if needed
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto no-scrollbar">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10"
          >
            {/* Action Bar Header */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-700/80 bg-slate-950/70 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono leading-none">
                    {RESUME_DATA.name} — Resume / CV
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Junior Game Developer (C# / Unity)
                  </p>
                </div>
              </div>

              {/* Single Download PDF Button & Close */}
              <div className="flex items-center gap-2">
                <button
                  id="download-resume-pdf-btn"
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-75 disabled:cursor-not-allowed text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-orange-600/25 cursor-pointer"
                  title="Download Resume as PDF"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Generating PDF...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>

                <button
                  id="close-resume-modal-btn"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Document Paper */}
            <div className="p-3 sm:p-8 overflow-y-auto flex-1 bg-slate-950/40 no-scrollbar">
              <div
                ref={resumePaperRef}
                id="printable-resume-paper"
                className="max-w-3xl mx-auto bg-white text-slate-900 p-4 sm:p-10 rounded-xl shadow-lg font-sans leading-relaxed text-sm overflow-hidden break-words [overflow-wrap:anywhere]"
              >
                {/* Header info */}
                <div className="border-b border-slate-300 pb-4 mb-5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {RESUME_DATA.name}
                  </h1>
                  <div className="text-sm font-semibold text-slate-700 mt-1">
                    {RESUME_DATA.title}
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-mono break-all [overflow-wrap:anywhere]">
                    <a href={`mailto:${RESUME_DATA.email}`} className="hover:text-orange-600 transition-colors inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{RESUME_DATA.email}</span>
                    </a>
                    <span>•</span>
                    <a href={RESUME_DATA.telegram} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline transition-colors inline-flex items-center gap-1 font-semibold">
                      <Send className="w-3 h-3 text-sky-500 shrink-0" />
                      <span>{RESUME_DATA.telegramHandle}</span>
                    </a>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{RESUME_DATA.location}</span>
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700 font-mono break-all [overflow-wrap:anywhere]">
                    <span>
                      GitHub:{' '}
                      <a href={RESUME_DATA.github} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline font-semibold break-all">
                        {RESUME_DATA.githubDisplay}
                      </a>
                    </span>
                    <span>•</span>
                    <span>
                      itch.io:{' '}
                      <a href={RESUME_DATA.itch} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline font-semibold break-all">
                        {RESUME_DATA.itchDisplay}
                      </a>
                    </span>
                    <span>•</span>
                    <span>
                      Website:{' '}
                      <a href={RESUME_DATA.website} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline font-semibold break-all">
                        {RESUME_DATA.websiteDisplay}
                      </a>
                    </span>
                  </div>
                </div>

                {/* Section 1: Career Objective */}
                <div className="mb-5">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    CAREER OBJECTIVE
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-normal break-words">
                    {RESUME_DATA.careerObjective}
                  </p>
                </div>

                {/* Section 2: Skills */}
                <div className="mb-5">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    SKILLS
                  </h2>
                  <div className="text-xs sm:text-[13px] space-y-1 text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900">Programming:</span>{' '}
                      {RESUME_DATA.skills.programming.join(', ')}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Engines & Tools:</span>{' '}
                      {RESUME_DATA.skills.enginesAndTools.join(', ')}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Art & Design:</span>{' '}
                      {RESUME_DATA.skills.artAndDesign.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Section 3: Projects */}
                <div className="mb-5">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3">
                    PROJECTS (UNITY UNLESS NOTED)
                  </h2>

                  <div className="space-y-4">
                    {/* Project 1 */}
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                        <span className="font-bold text-slate-900">
                          Procedural Creature Animation & AI Locomotion
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Feb 2026 – May 2026
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-700 leading-normal">
                        <li>
                          Trained a four-legged creature&apos;s walking gait with reinforcement learning in Unity ML-Agents — about 12 million steps over 2 days of training.
                        </li>
                        <li>
                          Creature moves using physics-driven procedural animation instead of hand-authored animation clips, including a separate rope/snake-like creature.
                        </li>
                        <li>
                          Procedural physics reactions trigger when an enemy enters the creature&apos;s detection radius.
                        </li>
                      </ul>
                      <div className="mt-1.5 text-xs text-slate-600 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 break-all [overflow-wrap:anywhere]">
                        <span className="font-semibold text-slate-700 shrink-0">More:</span>
                        <a href="https://github.com/akhmedovfakhriyor/Procedural_animation_4legs" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline break-all">
                          github.com/akhmedovfakhriyor/Procedural_animation_4legs
                        </a>
                        <span>,</span>
                        <a href="https://github.com/akhmedovfakhriyor/Umbra_proceduraly_generated_arm" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline break-all">
                          github.com/akhmedovfakhriyor/Umbra_proceduraly_generated_arm
                        </a>
                      </div>
                    </div>

                    {/* Project 2 */}
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                        <span className="font-bold text-slate-900">
                          Pixel-Perfect Pixelated Camera
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Jun 2025 – Jul 2025
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-700 leading-normal">
                        <li>
                          Pixels stay visually stable at any camera angle, with no shimmer during movement — the problem this demo was built to solve.
                        </li>
                        <li>
                          Camera renders at a lower resolution and upscales for the pixelated look; trigonometry snaps movement to pixel boundaries to prevent shimmer.
                        </li>
                        <li>
                          Implemented with custom shaders. Standalone tech demo, not tied to a specific game.
                        </li>
                      </ul>
                      <div className="mt-1.5 text-xs text-slate-600 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 break-all [overflow-wrap:anywhere]">
                        <span className="font-semibold text-slate-700 shrink-0">More:</span>
                        <a href="https://github.com/akhmedovfakhriyor/SandScappers_pixelPerfect_camera" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline break-all">
                          github.com/akhmedovfakhriyor/SandScappers_pixelPerfect_camera
                        </a>
                      </div>
                    </div>

                    {/* Project 3 */}
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                        <span className="font-bold text-slate-900">
                          Vae-mond — Shadow & Reality Puzzle
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Oct 2025 – Nov 2025
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-700 leading-normal">
                        <li>
                          Player swaps control between two characters at once: a girl exploring a 3D room and her shadow, which navigates the walls as a 2D platformer.
                        </li>
                        <li>
                          Shadows cast by the 3D objects double as platform geometry on the 2D side.
                        </li>
                      </ul>
                      <div className="mt-1.5 text-xs text-slate-600 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 break-all [overflow-wrap:anywhere]">
                        <span className="font-semibold text-slate-700 shrink-0">Play:</span>
                        <a href="https://s0far.itch.io/vae-mond" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline break-all">
                          s0far.itch.io/vae-mond
                        </a>
                      </div>
                    </div>

                    {/* Project 4 */}
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                        <span className="font-bold text-slate-900">
                          3D Tetris
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Dec 2025
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 text-xs text-slate-700 leading-normal">
                        <li>
                          Classic Tetris mechanics — rotation, collision, line clears (WebGL).
                        </li>
                      </ul>
                    </div>

                    {/* Project 5 */}
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                        <span className="font-bold text-slate-900">
                          File Explorer in Rust
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Mar 2025 – May 2025
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 text-xs text-slate-700 leading-normal">
                        <li>
                          Search returns results in under 0.1 ms across a local test set of roughly 7 million files — built in Rust to replace Windows&apos; slow native file search.
                        </li>
                      </ul>
                      <div className="mt-1.5 text-xs text-slate-600 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 break-all [overflow-wrap:anywhere]">
                        <span className="font-semibold text-slate-700 shrink-0">Code:</span>
                        <a href="https://github.com/akhmedovfakhriyor/file-explorer" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline break-all">
                          github.com/akhmedovfakhriyor/file-explorer
                        </a>
                      </div>
                    </div>

                    {/* Project 6 */}
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                        <span className="font-bold text-slate-900">
                          Personal portfolio Website
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Sep 2026
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600 break-all [overflow-wrap:anywhere]">
                        Website:{' '}
                        <a href="https://akhmedovfakhriyor-aboutme.vercel.app" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline break-all">
                          akhmedovfakhriyor-aboutme.vercel.app
                        </a>
                      </div>
                    </div>

                    {/* Game Jams */}
                    <div className="pt-1 text-xs text-slate-700 break-words">
                      <span className="font-bold text-slate-900">Game Jams:</span>{' '}
                      1st place (solo), Astana IT University internal game jam — against ~8 teams of 1–4 people. Participant, GMTK Game Jam.
                    </div>
                  </div>
                </div>

                {/* Section 4: Other Experience */}
                <div className="mb-5">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3">
                    OTHER EXPERIENCE (NON-GAMEDEV)
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                        <span className="font-bold text-slate-900">
                          1C Developer-Implementer — LLP First Bit, Astana
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Apr 2026 – Present
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 text-xs text-slate-700 leading-normal">
                        <li>
                          Works with Microsoft SQL Server as the database backend for 1C:Accounting deployments.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                        <span className="font-bold text-slate-900">
                          1C Intern — LLP Office Expert, Almaty
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          May 2025 – Aug 2025
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 text-xs text-slate-700 leading-normal">
                        <li>
                          Basic analytical work related to the implementation of 1C ERP systems.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 5: Education */}
                <div>
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    EDUCATION
                  </h2>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-[13px]">
                    <span className="font-bold text-slate-900">
                      {RESUME_DATA.education.degree}, {RESUME_DATA.education.institution}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {RESUME_DATA.education.period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
