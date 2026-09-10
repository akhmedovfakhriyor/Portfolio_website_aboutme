import { useState , useRef} from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: enterProgress } = useScroll({
    target: sectionRef,
    offset: ["start 100%", "start 35%"]
  });
  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ["end 55%", "end 10%"]
  });
  
  // Distinct 3D depth emergence from behind (entrance) and receding upward fade (exit)
  const sectionScale = useTransform(() => {
    const enter = enterProgress.get();
    const exit = exitProgress.get();
    if (enter < 1) return 0.85 + (0.15 * enter);
    if (exit > 0) return 1 - (0.15 * exit);
    return 1;
  });
  const sectionY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [200, 0, 0, -200], { clamp: true });
  const sectionOpacity = useTransform(() => {
    const enter = enterProgress.get();
    const exit = exitProgress.get();
    if (enter < 1) return 0.1 + (0.9 * enter);
    if (exit > 0) return 1 - (0.9 * exit);
    return 1;
  });

  // Atmospheric background parallax & internal foreground offsets
  const bgY = useTransform(scrollYProgress, [0, 1], [-120, 120]);
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
    <section id="engineering" className="relative py-4 sm:py-6 theme-canvas overflow-x-clip" ref={sectionRef}>
      {/* Background Section Glow Accent */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-10 right-10 w-[500px] h-[500px] bg-orange-600/10 blur-[130px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
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

          {/* LeetCode Highlight */}
          {PERSONAL_INFO.stats.leetcodeRating && PERSONAL_INFO.stats.leetcodeRating !== '0' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border theme-border theme-card text-xs font-mono font-medium">
                <Award className="w-4 h-4 text-orange-500" />
                <span>{PERSONAL_INFO.stats.leetcodeRating}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Featured Project Component: Interactive Code Editor / File Explorer */}
        <motion.div style={{ y: ideCardY }} className="rounded-2xl border theme-border bg-slate-950 text-slate-100 shadow-2xl overflow-hidden mb-16">
          {/* Editor Top Bar */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Traffic light dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
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
            <div className="flex items-center gap-2">
              <button
                id="run-cargo-bench-btn"
                onClick={handleRunBenchmark}
                disabled={isRunningBench}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold shadow transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Simulates Tauri desktop build & IPC command binding in the web preview"
              >
                <Play className={`w-3.5 h-3.5 ${isRunningBench ? 'animate-spin' : 'fill-white'}`} />
                <span>{isRunningBench ? 'Simulating Build...' : 'Simulate Tauri Build'}</span>
              </button>

              <button
                id="copy-code-btn"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href="https://github.com/akhmedovfakhriyor/file-explorer.git"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all border border-slate-700/80 hover:border-orange-500/50"
                title="View GitHub Repository: https://github.com/akhmedovfakhriyor/file-explorer.git"
              >
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span>GitHub Repo</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Editor Body: Split into File Tree Sidebar and Code Pane */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
            {/* Left Sidebar: File Tree */}
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/80 p-3">
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
                          ? 'bg-orange-500/20 text-orange-300 font-semibold border-l-2 border-orange-500'
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

            {/* Right Pane: Code Viewer & Terminal Simulation */}
            <div className="md:col-span-9 flex flex-col justify-between bg-slate-950">
              {/* Active Tab Bar */}
              <div className="flex items-center px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 text-xs font-mono text-slate-400">
                <span className="text-orange-400 font-semibold">{activeFile}</span>
                <span className="ml-auto text-slate-500">
                  UTF-8 • {activeFile.endsWith('.rs') ? 'Rust Source' : activeFile.endsWith('.jsx') ? 'React JSX' : 'Cargo TOML'}
                </span>
              </div>

              {/* Code Contents with Line Numbers */}
              <div className="p-4 overflow-x-auto h-[320px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-200 custom-scrollbar">
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

              {/* Interactive Terminal / Benchmark Console */}
              <div className="border-t border-slate-800 bg-black/80 p-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-slate-300">Tauri Build & IPC Console</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-sans border border-slate-700/50">
                      Web Simulation
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 min-h-[90px] space-y-1">
                  {benchOutput ? (
                    benchOutput.map((line, i) => (
                      <div
                        key={i}
                        className={`${
                          line.startsWith('✅')
                            ? 'text-emerald-400 font-bold'
                            : line.startsWith('⚡')
                            ? 'text-cyan-400 font-semibold'
                            : line.startsWith('$')
                            ? 'text-amber-400'
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
                      <span>$ cargo tauri build</span>
                      <span className="w-2 h-4 bg-orange-500 animate-pulse inline-block" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
