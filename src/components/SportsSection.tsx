import { useRef } from 'react';
import { SPORTS_DATA } from '../data/portfolioData';
import { motion, useScroll, useTransform } from 'motion/react';
import { RubiksCubeWidget } from './RubiksCubeWidget';
import { Activity, Trophy, Timer } from 'lucide-react';

export function SportsSection() {
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

  // Differential parallax depth with solid visibility
  const bgY = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const runnerY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const sportsGridY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const quoteY = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const running = SPORTS_DATA.running;

  return (
    <section id="sports" className="relative pt-4 pb-14 sm:pt-6 sm:pb-20 theme-canvas overflow-x-clip" ref={sectionRef}>
      {/* Background Soft Sky Blue Radial Glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold theme-badge mb-3">
              <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Discipline 04 // Athletics, Endurance & Rhythm</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight theme-text-primary">
              Biomechanical Discipline & Mental Fortitude
            </h2>
            <p className="mt-3 text-sm sm:text-base theme-text-secondary max-w-2xl leading-relaxed">
              Physical conditioning feeds cognitive clarity. Whether pacing distance runs with AITU running club, executing tactical pitch transitions in football, or drilling Rubik&apos;s cube algorithms, athletics forms the bedrock of my engineering stamina.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl border theme-border theme-card flex items-center gap-2 text-xs font-mono">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="font-bold theme-text-primary">AITU running club</span>
            </div>
          </div>
        </motion.div>

        {/* Runner Banner */}
        <motion.div style={{ y: runnerY }} className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-700 via-sky-800 to-slate-900 text-white shadow-xl overflow-hidden mb-12 border border-sky-500/20">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/20 backdrop-blur-md mb-3">
                {running.title}
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                {running.headline}
              </h3>
              <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-xl">
                Progressive distance building, aerobic efficiency & pace discipline across all tempos.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div>
                <div className="text-[11px] font-mono text-sky-200">Distance</div>
                <div className="text-base sm:text-xl font-black">{running.longestDistance}</div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-sky-200">Time</div>
                <div className="text-base sm:text-xl font-black">{running.time}</div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-sky-200">Pace</div>
                <div className="text-base sm:text-xl font-black">{running.pace}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Distance & Tempo Records + Speedcubing Grid */}
        <motion.div style={{ y: sportsGridY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-14">
            {/* Best Results: Distance & Tempo Tab */}
            <div
              id="running-records-widget"
              className="p-6 rounded-2xl border theme-border theme-card shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold border border-sky-500/20">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base theme-text-primary">Best Results // Distance & Tempo</h4>
                      <p className="text-xs font-mono theme-text-muted">Personal distance & tempo benchmarks</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800">
                    PBs
                  </span>
                </div>

                {/* Benchmarks List */}
                <div className="space-y-2 mt-4">
                  {running.records.map((item, idx) => (
                    <div
                      key={item.distance}
                      className="flex items-center justify-between p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/70 dark:bg-slate-900/50 dark:hover:bg-sky-950/30 border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-300/80 dark:hover:border-sky-500/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-xs font-mono font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.distance}</span>
                        <span className="hidden sm:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-xs">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800/60">
                          {item.tempo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t theme-border flex items-center justify-between text-xs font-mono theme-text-muted">
                <span>Discipline: Pace Control</span>
                <span className="text-sky-600 dark:text-sky-400 font-semibold">Max: 15 km</span>
              </div>
            </div>

            {/* Speedcubing Widget */}
            <RubiksCubeWidget />
          </div>

          {/* Team Sports Repertoire Cards */}
          <div className="mb-14">
            <h3 className="text-xl font-bold theme-text-primary mb-6">
              Team Sports & Hand-Eye Coordination
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPORTS_DATA.teamSports.map((sport) => (
                <div
                  key={sport.sport}
                  className="p-6 rounded-2xl border theme-border theme-card hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-lg font-bold theme-text-primary mb-1">
                      {sport.sport}
                    </h4>
                    <div className="text-xs font-mono text-sky-600 dark:text-sky-400 font-semibold mb-3">
                      {sport.position}
                    </div>

                    <p className="text-xs sm:text-sm theme-text-secondary leading-relaxed">
                      {sport.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Philosophy Quote Container */}
        <motion.div
          style={{ y: quoteY }}
          className="mt-12 p-8 sm:p-10 rounded-3xl border theme-border theme-card shadow-sm bg-gradient-to-br from-sky-500/5 to-indigo-500/5 dark:from-sky-500/10 dark:to-indigo-500/5 text-center transition-colors duration-500"
        >
          <p className="max-w-3xl mx-auto text-xl sm:text-2xl md:text-3xl font-extrabold theme-text-primary tracking-tight leading-snug">
            &quot;Systems require structure; art breathes soul into logic; athletics forges the vessel.&quot;
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
