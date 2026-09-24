import React, { useState, useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { RUST_PROJECT_CODE, PERSONAL_INFO, TECH_STACK } from '../data/portfolioData';
import { 
  FileCode, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  FolderTree, 
  FileText, 
  Cpu, 
  GitBranch, 
  ExternalLink, 
  Github,
  Zap, 
  Award,
  Box,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function RustCodeExplorer() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { sectionY, sectionScale, sectionOpacity, scrollYProgress } = useSectionMotion(sectionRef, {
    titleRef,
  });

  // Atmospheric background parallax & internal foreground offsets
  const bgY = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const ideCardY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const techGridY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  const [activeFile, setActiveFile] = useState<keyof typeof RUST_PROJECT_CODE>('src/main.rs');
  const [copied, setCopied] = useState(false);
  const [isRunningBench, setIsRunningBench] = useState(false);
  const [benchOutput, setBenchOutput] = useState<string[] | null>(null);
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('All');

  const files = Object.keys(RUST_PROJECT_CODE) as (keyof typeof RUST_PROJECT_CODE)[];

  const handleCopy = () => {
    navigator.clipboard.writeText(RUST_PROJECT_CODE[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunBenchmark = () => {
    setIsRunningBench(true);
    setBenchOutput(['$ cargo tauri build --release']);

    setTimeout(() => {
      setBenchOutput((prev) => [
        ...(prev || []),
        '   Compiling app v0.1.0 (/file-explorer)',
        '   Compiling rusqlite v0.29.0 (bundled SQLite 3.42)',
        '   Finished `release` profile [optimized] in 1.84s',
        '   Launching Tauri IPC subsystem...',
      ]);
    }, 400);

    setTimeout(() => {
      setBenchOutput((prev) => [
        ...(prev || []),
        '⚡ Initializing SQLite engine at %APPDATA%/file_explorer.sqlite3...',
        '   Database tables & composite indexes created (idx_path, idx_name, idx_extension)',
        '   WalkDir indexed C:\\ drive transactions into main_table',
        '   IPC Handlers bound: list_children, search_files, get_file_meta, open_file',
        'ℹ️ Portfolio Web Simulation: In your local desktop shell, this compiles the native desktop binary with real Windows API access.',
        '✅ Tauri Desktop Engine ready: sub-millisecond query responses across indexed paths',
      ]);
      setIsRunningBench(false);
    }, 1200);
  };

  const categories = ['All', ...Array.from(new Set(TECH_STACK.map((t) => t.category)))];
  const filteredTech = selectedTechCategory === 'All' 
    ? TECH_STACK 
    : TECH_STACK.filter((t) => t.category === selectedTechCategory);

  return (
    <section id="engineering" style={{ paddingTop: '66px', paddingLeft: '0px', paddingBottom: '66px' }} className="relative min-h-screen flex flex-col justify-center theme-canvas overflow-x-clip" ref={sectionRef}>
      {/* Background Section Glow Accent with Parallax (hardware-accelerated, zero blur raster cost) */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-10 right-10 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.14)_0%,rgba(234,88,12,0.03)_50%,transparent_75%)] rounded-full pointer-events-none -z-10 will-change-transform transform-gpu"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity, y: sectionY }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full will-change-transform transform-gpu"
      >
        {/* Section Header */}
        <motion.div ref={titleRef} style={{ y: headerY }} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold theme-badge mb-3">
              <Cpu className="w-3.5 h-3.5 text-orange-500" />
              <span>Discipline 01 // Systems & Software</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight theme-text-primary">
              High-Concurrency Systems & Compilers
            </h2>
            <p className="mt-3 text-sm sm:text-base theme-text-secondary max-w-2xl leading-relaxed">
              Writing memory-safe, lock-free, zero-cost abstractions in Rust. Architected for microsecond latencies and predictable hardware cache locality.
            </p>
          </div>
        </motion.div>

        {/* Workstation Console Card */}
        <div className="w-full mb-12 py-1">
          <motion.div 
            style={{ y: ideCardY }} 
            className="relative rounded-2xl border border-slate-800/90 bg-slate-950 text-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85),0_0_30px_-10px_rgba(234,88,12,0.15)] transition-shadow duration-300"
          >
            {/* Editor Top Bar */}
            <div className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 rounded-t-2xl shadow-sm">
              <div className="flex items-center gap-3">
                {/* Traffic light dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="h-4 w-px bg-slate-700 mx-1" />
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-200">
                  <Box className="w-4 h-4 text-orange-400" />
                  <a
                    href="https://github.com/akhmedovfakhriyor/file-explorer.git"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-400 hover:underline transition-colors"
                  >
                    file-explorer
                  </a>
                  <span className="text-slate-500">// Tauri + Rust + SQLite</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                <button
                  id="run-cargo-bench-btn"
                  onClick={handleRunBenchmark}
                  disabled={isRunningBench}
                  className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold shadow-[0_4px_14px_rgba(234,88,12,0.4)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                  title="Simulates Tauri desktop build & IPC command binding in the web preview"
                >
                  <Play className={`w-3.5 h-3.5 shrink-0 ${isRunningBench ? 'animate-spin' : 'fill-white'}`} />
                  <span className="hidden sm:inline">{isRunningBench ? 'Simulating Build...' : 'Simulate Tauri Build'}</span>
                  <span className="sm:hidden">{isRunningBench ? 'Simulating...' : 'Simulate Build'}</span>
                </button>

                <button
                  id="copy-code-btn"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 border border-slate-700/50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <a
                  href="https://github.com/akhmedovfakhriyor/file-explorer.git"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all border border-slate-700/80 hover:border-orange-500/50 whitespace-nowrap shrink-0"
                  title="View GitHub Repository: https://github.com/akhmedovfakhriyor/file-explorer.git"
                >
                  <Github className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="hidden sm:inline">GitHub Repo</span>
                  <span className="sm:hidden">GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                </a>
              </div>
            </div>

            {/* Editor Body: Split into File Tree Sidebar and Code Pane */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
              {/* Left Sidebar: File Tree - Layer Z-Depth 4px */}
              <div 
                style={{ transform: 'translateZ(4px)', transformStyle: 'preserve-3d' }}
                className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/80 p-3"
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 mb-2 flex items-center gap-1.5 font-bold">
                  <FolderTree className="w-3.5 h-3.5 text-orange-400" />
                  <span>Project Explorer</span>
                </div>

                <div className="space-y-1">
                  {files.map((file) => {
                    const isSelected = activeFile === file;
                    return (
                      <button
                        key={file}
                        id={`editor-file-${file.replace(/[/.]/g, '-')}`}
                        onClick={() => setActiveFile(file)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-mono transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500/20 text-orange-300 font-semibold border-l-2 border-orange-500 shadow-[0_2px_8px_rgba(234,88,12,0.2)]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {file.endsWith('.rs') ? (
                            <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                          ) : (
                            <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                          )}
                          <span className="truncate">{file}</span>
                        </div>
                        {file === 'src/main.rs' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/30 text-orange-300 font-sans">
                            Core
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Project Metadata Info Card */}
                <div className="mt-8 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono space-y-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">App Stack</div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Framework:</span>
                    <span className="text-orange-400 font-bold">Tauri 1.5</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Language:</span>
                    <span>Rust 2021</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Database:</span>
                    <span>SQLite (rusqlite)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Frontend:</span>
                    <span>React + MUI</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center text-slate-300">
                    <span className="text-slate-500">Repository:</span>
                    <a
                      href="https://github.com/akhmedovfakhriyor/file-explorer.git"
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-400 hover:text-orange-300 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>file-explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Pane: Code Viewer & 3D Terminal Simulation */}
              <div className="md:col-span-9 flex flex-col justify-between bg-slate-950">
                {/* Active Tab Bar - Layer Z-Depth 5px */}
                <div 
                  style={{ transform: 'translateZ(5px)' }}
                  className="flex items-center px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 text-xs font-mono text-slate-400"
                >
                  <span className="text-orange-400 font-semibold">{activeFile}</span>
                  <span className="ml-auto text-slate-500">
                    UTF-8 • {activeFile.endsWith('.rs') ? 'Rust Source' : activeFile.endsWith('.jsx') ? 'React JSX' : 'Cargo TOML'}
                  </span>
                </div>

                {/* Code Contents with Line Numbers - Layer Z-Depth 5px */}
                <div 
                  style={{ transform: 'translateZ(5px)' }}
                  className="p-4 overflow-x-auto h-[300px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-200 custom-scrollbar"
                >
                  <pre className="flex">
                    {/* Line numbers */}
                    <div className="pr-4 select-none text-slate-600 text-right">
                      {RUST_PROJECT_CODE[activeFile].split('\n').map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                      ))}
                    </div>
                    {/* Code body */}
                    <code className="text-slate-300">
                      {RUST_PROJECT_CODE[activeFile]}
                    </code>
                  </pre>
                </div>

                {/* Terminal Console Deck */}
                <div className="m-3 p-3 rounded-xl border border-slate-700/80 bg-slate-950/95 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.8),0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden backdrop-blur-md">
                  {/* Console Deck Header */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      </span>
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-slate-200 tracking-wide">Tauri Build & IPC Console</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {benchOutput && (
                        <button
                          onClick={() => setBenchOutput(null)}
                          className="text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sunken 3D CRT Terminal Viewport */}
                  <div className="relative rounded-lg overflow-hidden border border-slate-800/90 bg-[#050914] p-3 font-mono text-xs text-slate-300 min-h-[96px] shadow-[inset_0_3px_12px_rgba(0,0,0,0.95),inset_0_0_20px_rgba(16,185,129,0.03)]">
                    {/* CRT Scanline overlay effect */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-10" 
                    />

                    <div className="space-y-1 relative z-20">
                      {benchOutput ? (
                        benchOutput.map((line, i) => (
                          <div
                            key={i}
                            className={`${
                              line.startsWith('✅')
                                ? 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                                : line.startsWith('⚡')
                                ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                                : line.startsWith('$')
                                ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                                : line.startsWith('ℹ️')
                                ? 'text-sky-300'
                                : 'text-slate-400'
                            }`}
                          >
                            {line}
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 italic flex items-center gap-2">
                          <span className="text-emerald-500/80 font-semibold">$</span>
                          <span>cargo tauri build</span>
                          <span className="w-2 h-4 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse inline-block" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack Tags with Category Filters */}
        <motion.div style={{ y: techGridY }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="text-xl font-bold theme-text-primary">Core Technical Repertoire</h3>
              <p className="text-xs theme-text-secondary">Filtering proficiencies across low-level and high-level stacks</p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTechCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedTechCategory === cat
                      ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-600/30'
                      : 'border theme-border theme-card theme-text-secondary hover:theme-text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredTech.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-xl border theme-border theme-card hover:border-orange-500/50 transition-all duration-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm theme-text-primary">{item.name}</div>
                  <div className="text-[10px] font-mono theme-text-muted">{item.category}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border theme-border theme-badge">
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
