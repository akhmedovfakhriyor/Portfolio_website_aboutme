import { useState, useEffect, useRef } from 'react';
import { SPORTS_DATA } from '../data/portfolioData';
import { Play, Pause, RotateCcw, Shuffle, Sparkles, Award, Timer } from 'lucide-react';

export function RubiksCubeWidget() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [scramble, setScramble] = useState("R U R' U' D2 F' L B2 R2 D' F2 U2 R2 B2");
  const [solved, setSolved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramblesList = [
    "R U R' U' D2 F' L B2 R2 D' F2 U2 R2 B2",
    "F2 D' R2 U B2 R2 D' L2 B2 U2 F' L U' R2 B' F D'",
    "U2 R2 B2 D2 B2 F2 R' B2 L2 F2 U' B D' F' L' U B2",
    "B2 L2 D2 R2 B' U2 F' D2 L2 F' R2 D' L' U R2 F' D2",
  ];

  const handleGenerateScramble = () => {
    const next = scramblesList[Math.floor(Math.random() * scramblesList.length)];
    setScramble(next);
    setSolved(false);
    setElapsedTime(0);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRunning(false);
      setSolved(true);
    } else {
      setElapsedTime(0);
      setSolved(false);
      setIsRunning(true);
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - start);
      }, 10);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTimer = (ms: number) => {
    const totalSec = ms / 1000;
    return totalSec.toFixed(2) + 's';
  };

  return (
    <div
      id="speedcubing-interactive-widget"
      className="p-6 rounded-2xl border theme-border theme-card shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              3x3
            </div>
            <div>
              <h4 className="font-bold text-base theme-text-primary">Speedcubing & Algorithms</h4>
              <p className="text-xs font-mono theme-text-muted">{SPORTS_DATA.speedcubing.method}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 whitespace-nowrap">
            Personal record for 3x3: {SPORTS_DATA.speedcubing.singlePB}
          </span>
        </div>

        {/* 3D Cube Visual Representation (Isometric Grid) */}
        <div className="my-5 p-4 rounded-xl bg-slate-900 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Isometric Cube Faces Render */}
          <div className="w-28 h-28 relative my-2 flex items-center justify-center">
            {/* Front Face Grid */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-black border border-slate-700 shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <div className="w-7 h-7 rounded-sm bg-sky-500 shadow-sm" />
              <div className="w-7 h-7 rounded-sm bg-red-500 shadow-sm" />
              <div className="w-7 h-7 rounded-sm bg-sky-500 shadow-sm" />
              <div className="w-7 h-7 rounded-sm bg-white shadow-sm" />
              <div className="w-7 h-7 rounded-sm bg-orange-500 shadow-sm" />
              <div className="w-7 h-7 rounded-sm bg-yellow-400 shadow-sm" />
              <div className="w-7 h-7 rounded-sm bg-green-500 shadow-sm" />
              <div className="w-7 h-7 rounded-sm bg-red-500 shadow-sm" />
              <div className="w-7 h-7 rounded-sm bg-white shadow-sm" />
            </div>
          </div>

          {/* Scramble string display */}
          <div className="w-full text-center mt-2 px-3 py-1.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-sky-300 tracking-wider break-words">
            {scramble}
          </div>

          {/* Live Timer Display */}
          <div className="mt-4 text-center">
            <div className={`text-3xl font-extrabold font-mono tracking-tight ${
              isRunning ? 'text-sky-400 animate-pulse' : solved ? 'text-emerald-400' : 'text-slate-200'
            }`}>
              {formatTimer(elapsedTime)}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {isRunning ? 'Timing Active...' : solved ? 'Solved!' : 'Ready'}
            </div>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-2 mb-6">
          <button
            id="rubiks-toggle-timer-btn"
            onClick={toggleTimer}
            className={`flex-1 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isRunning ? 'Stop Timer' : 'Start Solve'}</span>
          </button>

          <button
            id="rubiks-scramble-btn"
            onClick={handleGenerateScramble}
            className="p-2.5 rounded-xl border theme-border theme-card hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
            title="Generate New Scramble"
          >
            <Shuffle className="w-4 h-4 theme-text-primary" />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t theme-border mt-5 flex items-center justify-between text-xs font-mono theme-text-muted">
        <span>Hardware: MoYu WR M v9</span>
        <span>Ao5: {SPORTS_DATA.speedcubing.ao5PB}</span>
      </div>
    </div>
  );
}
