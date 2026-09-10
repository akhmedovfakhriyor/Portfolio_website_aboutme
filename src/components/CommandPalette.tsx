import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Terminal, X, FileText } from 'lucide-react';
import { PERSONAL_INFO, RESUME_DATA } from '../data/portfolioData';
import { ColorMode } from '../types';

interface CommandPaletteProps {
  colorMode?: ColorMode;
  onToggleColorMode?: () => void;
  onOpenResume?: () => void;
}

export function CommandPalette({ colorMode, onToggleColorMode, onOpenResume }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ id: string; command: string; response: React.ReactNode }[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Add initial welcome message if history is empty
      if (history.length === 0) {
        setHistory([
          {
            id: 'welcome',
            command: '',
            response: (
              <div className="text-slate-300">
                Welcome to <span className="text-orange-400 font-bold">FAKHRIYOR_OS v1.0</span>
                <br />
                Type <span className="text-purple-400 font-bold">'help'</span> to see available commands.
              </div>
            )
          }
        ]);
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, history.length]);

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    let response: React.ReactNode = '';
    
    switch (trimmed) {
      case 'help':
        response = (
          <div className="grid grid-cols-1 gap-2 mt-1">
            <div className="flex gap-4"><span className="text-purple-400 w-20">help</span> <span className="text-slate-400">Show this menu</span></div>
            <div className="flex gap-4"><span className="text-purple-400 w-20">about</span> <span className="text-slate-400">Who am I?</span></div>
            <div className="flex gap-4"><span className="text-purple-400 w-20">theme</span> <span className="text-slate-400">Toggle dark / light atmospheric tint mode</span></div>
            <div className="flex gap-4"><span className="text-purple-400 w-20">contact</span> <span className="text-slate-400">Get my email & social links</span></div>
            <div className="flex gap-4"><span className="text-purple-400 w-20">resume</span> <span className="text-slate-400">View resume status</span></div>
            <div className="flex gap-4"><span className="text-purple-400 w-20">clear</span> <span className="text-slate-400">Clear terminal history</span></div>
            <div className="flex gap-4"><span className="text-orange-400 w-20">sudo rm -rf</span> <span className="text-slate-400">Wait, don't type this...</span></div>
          </div>
        );
        break;
      case 'theme':
      case 'mode':
      case 'toggle':
        if (onToggleColorMode) {
          onToggleColorMode();
          const next = colorMode === 'dark' ? 'light' : 'dark';
          response = <div className="text-amber-400">Atmospheric mode switched to: <strong className="uppercase">{next}</strong>. Section-specific tints re-rendered.</div>;
        } else {
          response = <div className="text-slate-400">Current mode: <strong className="uppercase">{colorMode}</strong>.</div>;
        }
        break;
      case 'about':
        response = <div className="text-slate-300">{PERSONAL_INFO.bio} Located in {PERSONAL_INFO.location}.</div>;
        break;
      case 'contact':
        response = (
          <div className="flex flex-col gap-1 mt-1">
            <span>Email: <a href={`mailto:${PERSONAL_INFO.email}`} className="text-orange-400 hover:underline">{PERSONAL_INFO.email}</a></span>
            <span>GitHub: <a href={PERSONAL_INFO.socials.github} target="_blank" className="text-purple-400 hover:underline">github.com/akhmedovfakhriyor</a></span>
            <span>LinkedIn: <a href={PERSONAL_INFO.socials.linkedin} target="_blank" className="text-blue-400 hover:underline">linkedin.com/in/fakhriyor-akhmedov</a></span>
          </div>
        );
        break;
      case 'resume':
      case 'cv':
      case 'run resume.exe':
        response = (
          <div className="flex flex-col gap-2 mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700/80">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 font-mono text-sm">{RESUME_DATA.name} — {RESUME_DATA.title}</span>
              <span className="text-xs text-slate-400 font-mono">{RESUME_DATA.location}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{RESUME_DATA.careerObjective}</p>
            <div className="text-xs text-slate-400 font-mono">
              <strong>Skills:</strong> {RESUME_DATA.skills.programming.join(', ')} • {RESUME_DATA.skills.enginesAndTools.join(', ')}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              {onOpenResume && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenResume();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Interactive Resume / PDF</span>
                </button>
              )}
            </div>
          </div>
        );
        break;
      case 'clear':
        setHistory([]);
        return; // Early return to avoid adding the clear command itself to history
      case 'sudo rm -rf /':
      case 'sudo rm -rf':
        response = <div className="text-red-400 font-bold animate-pulse">ACCESS DENIED. THIS INCIDENT WILL BE REPORTED.</div>;
        break;
      case '':
        response = '';
        break;
      default:
        response = <div className="text-red-300">Command not found: '{trimmed}'. Type 'help' for available commands.</div>;
    }

    setHistory((prev) => [...prev, { id: Date.now().toString(), command: cmd, response }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      processCommand(input);
      setInput('');
      
      // Auto scroll to bottom
      setTimeout(() => {
        const historyContainer = document.getElementById('terminal-history');
        if (historyContainer) {
          historyContainer.scrollTop = historyContainer.scrollHeight;
        }
      }, 50);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0d1117] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden font-mono flex flex-col h-[500px]"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-300 font-bold tracking-wider">FAKHRIYOR_TERMINAL</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-700 rounded-md text-slate-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal History */}
        <div id="terminal-history" className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scroll-smooth custom-scrollbar">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.command && (
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">visitor@fakhriyor:~$</span>
                  <span>{item.command}</span>
                </div>
              )}
              {item.response && (
                <div className="pl-0 text-slate-400 leading-relaxed">
                  {item.response}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Terminal Input */}
        <div className="p-4 bg-[#161b22] border-t border-slate-700/80 shrink-0 flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-sm">visitor@fakhriyor:~$</span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              className="w-full bg-transparent outline-none border-none text-slate-200 text-sm font-mono placeholder:text-slate-600"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
