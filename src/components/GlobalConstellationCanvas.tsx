import { useEffect, useRef, memo } from 'react';
import { SectionId } from '../types';

interface GlobalConstellationCanvasProps {
  activeSection: SectionId;
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  phase: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  r: number;
  g: number;
  b: number;
}

interface ThemeVisualConfig {
  r: number;
  g: number;
  b: number;
  curvature: number; // 0 = straight, 0.4+ = distinct curves
  curveFreq: number;
  maxDistance: number;
}

const THEME_VISUALS: Record<SectionId, ThemeVisualConfig> = {
  hero: {
    r: 255,
    g: 87,
    b: 34, // #ff5722
    curvature: 0.18, // Subtle organic fluid arcs
    curveFreq: 0.002,
    maxDistance: 135,
  },
  engineering: {
    r: 249,
    g: 115,
    b: 22, // #f97316 Rust Orange
    curvature: 0.0, // Strictly straight precision CAD/circuit lines
    curveFreq: 0.0,
    maxDistance: 125,
  },
  gamedev: {
    r: 168,
    g: 85,
    b: 247, // #a855f7 Cyber Neon Purple
    curvature: 0.38, // Dynamic undulating wave arcs
    curveFreq: 0.003,
    maxDistance: 140,
  },
  art: {
    r: 45,
    g: 212,
    b: 191, // #2dd4bf Aquamarine Seafoam
    curvature: 0.45, // Fluid, calligraphic aesthetic ribbons
    curveFreq: 0.0022,
    maxDistance: 145,
  },
  sports: {
    r: 14,
    g: 165,
    b: 233, // #0ea5e9 Refined Athletic Sky Blue
    curvature: 0.28, // Parabolic ballistic trajectories
    curveFreq: 0.0025,
    maxDistance: 135,
  },
  contact: {
    r: 255,
    g: 87,
    b: 34, // #ff5722 Connect Orange
    curvature: 0.2, // Resonant pulse curves
    curveFreq: 0.002,
    maxDistance: 135,
  },
};

function GlobalConstellationCanvasComponent({ activeSection }: GlobalConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSectionRef = useRef<SectionId>(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Generate responsive floating points
    const pointCount = Math.max(35, Math.min(Math.floor((width * height) / 22000), 65));
    const points: Point[] = [];

    for (let i = 0; i < pointCount; i++) {
      const bvx = (Math.random() - 0.5) * 0.45;
      const bvy = (Math.random() - 0.5) * 0.45;
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: bvx,
        vy: bvy,
        baseVx: bvx,
        baseVy: bvy,
        radius: Math.random() * 1.5 + 2.0,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Active visual shockwaves
    const shockwaves: Shockwave[] = [];

    // Global mouse state
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Color & Curvature interpolation state for seamless theme transitions
    const initialConfig = THEME_VISUALS[activeSection] || THEME_VISUALS.hero;
    let curR = initialConfig.r;
    let curG = initialConfig.g;
    let curB = initialConfig.b;
    let curCurvature = initialConfig.curvature;
    let curMaxDist = initialConfig.maxDistance;

    // Interactive Shockwave & Scatter Click Handler
    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Spawn subtle, compact expanding shockwave ripple
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 6,
        maxRadius: 95,
        alpha: 0.45,
        r: Math.round(curR),
        g: Math.round(curG),
        b: Math.round(curB),
      });

      // Blast wave: violently scatter all points within proximity
      const blastRadius = 240;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < blastRadius) {
          // Exponential impulse: closest points experience explosive dispersion
          const forceFactor = Math.pow(1 - dist / blastRadius, 1.35);
          const impulse = forceFactor * 17.5;
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.35;

          p.vx += Math.cos(angle) * impulse;
          p.vy += Math.sin(angle) * impulse;
        }
      }
    };
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Scroll state tracking to optimize frame budget during active fast scrolling
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let startTime = performance.now();

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      const time = now - startTime;
      const targetConfig = THEME_VISUALS[activeSectionRef.current] || THEME_VISUALS.hero;

      // Smoothly interpolate RGB color & curvature parameters towards current theme
      curR += (targetConfig.r - curR) * 0.045;
      curG += (targetConfig.g - curG) * 0.045;
      curB += (targetConfig.b - curB) * 0.045;
      curCurvature += (targetConfig.curvature - curCurvature) * 0.04;
      curMaxDist += (targetConfig.maxDistance - curMaxDist) * 0.04;

      const curMaxDistSq = curMaxDist * curMaxDist;
      const rInt = Math.round(curR);
      const gInt = Math.round(curG);
      const bInt = Math.round(curB);

      const isMouseInside = mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height;

      // Render and update expanding subtle shockwave ripples
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += (sw.maxRadius - sw.radius) * 0.16 + 2.0;
        sw.alpha *= 0.91;

        const progress = Math.min(sw.radius / sw.maxRadius, 1);

        // Delicate outer ripple ring
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${sw.r}, ${sw.g}, ${sw.b}, ${sw.alpha * 0.55})`;
        ctx.lineWidth = Math.max(0.6, 1.8 * (1 - progress));
        ctx.stroke();

        // Very faint subtle inner halo
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, Math.max(0, sw.radius - 2), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${sw.r}, ${sw.g}, ${sw.b}, ${sw.alpha * 0.2})`;
        ctx.lineWidth = 2.2 * (1 - progress);
        ctx.stroke();

        if (sw.alpha < 0.015 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1);
        }
      }

      // Update and draw points & connections
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];

        // Smoothly ease post-blast velocity back to natural gentle drift
        p1.vx = p1.vx * 0.925 + p1.baseVx * 0.075;
        p1.vy = p1.vy * 0.925 + p1.baseVy * 0.075;

        p1.x += p1.vx;
        p1.y += p1.vy;

        // Wrap or bounce around viewport edges
        if (p1.x < -20) p1.x = width + 20;
        else if (p1.x > width + 20) p1.x = -20;
        if (p1.y < -20) p1.y = height + 20;
        else if (p1.y > height + 20) p1.y = -20;

        // Interactive mouse interaction (gentle, subtle magnetic attraction)
        const dxMouse = mouse.x - p1.x;
        const dyMouse = mouse.y - p1.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        const mouseRadius = 85;
        const mouseRadiusSq = mouseRadius * mouseRadius;
        const isNearMouse = isMouseInside && distMouseSq < mouseRadiusSq;

        if (isNearMouse) {
          const distMouse = Math.sqrt(distMouseSq);
          // Extremely gentle, quadratic falloff pull so dots do not clump or get sucked into the cursor
          const pullStrength = Math.pow(1 - distMouse / mouseRadius, 2) * 0.12;
          p1.x += (dxMouse / distMouse) * pullStrength;
          p1.y += (dyMouse / distMouse) * pullStrength;

          // Subtle connective tether to cursor with theme curve personality
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);

          if (curCurvature < 0.02 || isScrolling) {
            ctx.lineTo(mouse.x, mouse.y);
          } else {
            const mx = (p1.x + mouse.x) / 2;
            const my = (p1.y + mouse.y) / 2;
            const nx = -dyMouse / (distMouse || 1);
            const ny = dxMouse / (distMouse || 1);
            const wave = Math.sin(time * 0.003 + p1.phase);
            const curveOffset = distMouse * curCurvature * 0.35 * wave;
            ctx.quadraticCurveTo(mx + nx * curveOffset, my + ny * curveOffset, mouse.x, mouse.y);
          }

          const tetherAlpha = 0.16 * (1 - distMouse / mouseRadius);
          ctx.strokeStyle = `rgba(${rInt}, ${gInt}, ${bInt}, ${tetherAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Draw outer glow halo around node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius + (isNearMouse ? 2.5 : 1.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rInt}, ${gInt}, ${bInt}, ${isNearMouse ? 0.15 : 0.05})`;
        ctx.fill();

        // Draw solid vibrant node core
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rInt}, ${gInt}, ${bInt}, ${isNearMouse ? 0.45 : 0.20})`;
        ctx.fill();

        // Connect nearby points using fast squared-distance culling
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < curMaxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);

            if (curCurvature < 0.02 || isScrolling) {
              // Straight line during fast scrolling or engineering theme
              ctx.lineTo(p2.x, p2.y);
            } else {
              // Curvy organic/wave line when rested/slow
              const mx = (p1.x + p2.x) / 2;
              const my = (p1.y + p2.y) / 2;
              const nx = -dy / dist;
              const ny = dx / dist;

              const wave = Math.sin(time * 0.0022 + (p1.x + p2.y) * 0.008 + p1.phase);
              const curveOffset = dist * curCurvature * 0.42 * wave;

              const cx = mx + nx * curveOffset;
              const cy = my + ny * curveOffset;

              ctx.quadraticCurveTo(cx, cy, p2.x, p2.y);
            }

            const alpha = 0.15 * (1 - dist / curMaxDist);
            ctx.strokeStyle = `rgba(${rInt}, ${gInt}, ${bInt}, ${alpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="global-constellation-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}

export const GlobalConstellationCanvas = memo(GlobalConstellationCanvasComponent);
