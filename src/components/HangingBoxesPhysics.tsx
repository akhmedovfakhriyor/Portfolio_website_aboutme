import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Mail, MapPin, Copy, Check, Send, FileText, Download, Scissors, RotateCcw, Volume2, VolumeX, Hand, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { physicsAudio } from '../utils/physicsAudio';

interface HangingBoxesPhysicsProps {
  onOpenResume?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface BladePoint {
  x: number;
  y: number;
  time: number;
}

interface RopeSegment {
  id: string;
  boxIndex: number;
  anchorSide: 'left' | 'right';
  anchor: { x: number; y: number };
  boxAttachOffset: { x: number; y: number };
  constraint: Matter.Constraint;
  isCut: boolean;
  snappedAt?: number;
}

export function HangingBoxesPhysics({ onOpenResume }: HangingBoxesPhysicsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTelegram, setCopiedTelegram] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isGravityMode, setIsGravityMode] = useState(false);

  // Card DOM refs
  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Physics state refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const cardBodiesRef = useRef<Matter.Body[]>([]);
  const ropesRef = useRef<RopeSegment[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const bladePointsRef = useRef<BladePoint[]>([]);
  const isPointerDownRef = useRef(false);
  const pointerStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const grabbedBodyRef = useRef<Matter.Body | null>(null);
  const grabConstraintRef = useRef<Matter.Constraint | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Card Dimensions based on screen
  const getCardLayout = useCallback((width: number, height: number) => {
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 900;
    
    // Width and height of cards
    const cardW = isMobile ? Math.min(width - 32, 340) : isTablet ? (width - 48) / 2 : 360;
    const cardH = 175;

    let initialPositions: { x: number; y: number }[] = [];

    if (isMobile) {
      // 1-column stack
      const startY = 120;
      const gapY = 195;
      initialPositions = [
        { x: width / 2, y: startY },
        { x: width / 2, y: startY + gapY },
        { x: width / 2, y: startY + gapY * 2 },
        { x: width / 2, y: startY + gapY * 3 },
      ];
    } else {
      // 2-column grid hanging in the open section
      const col1X = width / 2 - cardW / 2 - 16;
      const col2X = width / 2 + cardW / 2 + 16;
      const row1Y = 135;
      const row2Y = row1Y + cardH + 45;

      initialPositions = [
        { x: col1X, y: row1Y }, // Box 0: Email
        { x: col2X, y: row1Y }, // Box 1: Telegram
        { x: col1X, y: row2Y }, // Box 2: Resume
        { x: col2X, y: row2Y }, // Box 3: Location
      ];
    }

    return { cardW, cardH, initialPositions };
  }, []);

  // Check line segment intersection
  const checkLineIntersection = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number }
  ) => {
    const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (Math.abs(denom) < 0.0001) return null;

    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
    const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return {
        x: p1.x + ua * (p2.x - p1.x),
        y: p1.y + ua * (p2.y - p1.y)
      };
    }
    return null;
  };

  // Spawn spark particles on slice or heavy impact
  const spawnSparks = (x: number, y: number, count: number = 16) => {
    const colors = ['#f97316', '#38bdf8', '#a855f7', '#fbbf24', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1.0,
        maxLife: Math.random() * 20 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 2,
      });
    }
  };

  // Cut a specific rope
  const cutRope = (rope: RopeSegment, intersectPoint?: { x: number; y: number }) => {
    if (rope.isCut || !engineRef.current) return;
    rope.isCut = true;
    rope.snappedAt = Date.now();
    Matter.Composite.remove(engineRef.current.world, rope.constraint);

    const hitX = intersectPoint ? intersectPoint.x : rope.anchor.x;
    const hitY = intersectPoint ? intersectPoint.y : (rope.anchor.y + 50);

    spawnSparks(hitX, hitY, 18);
    physicsAudio.playSliceSound();

    // Apply a reactive tumble impulse
    const body = cardBodiesRef.current[rope.boxIndex];
    if (body) {
      Matter.Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.008,
        y: 0.003
      });
    }

    // If all ropes are cut, mark gravity active
    const remaining = ropesRef.current.filter(r => !r.isCut);
    if (remaining.length === 0) {
      setIsGravityMode(true);
    }
  };

  // Trigger Google Gravity (cut all and fling)
  const triggerGoogleGravity = () => {
    ropesRef.current.forEach(rope => {
      if (!rope.isCut) {
        cutRope(rope);
      }
    });
    setIsGravityMode(true);

    // Apply chaotic explosive pop to all cards
    cardBodiesRef.current.forEach(body => {
      Matter.Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.035,
        y: -0.015 - Math.random() * 0.02
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
    });
  };

  // Initialize and Reset Physics Engine
  const setupPhysics = useCallback(() => {
    if (!containerRef.current) return;

    // Clean previous engine
    if (runnerRef.current && engineRef.current) {
      Matter.Runner.stop(runnerRef.current);
    }
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
    }

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const isMobile = width < 640;
    const height = isMobile ? 860 : 660;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.15, scale: 0.001 }
    });
    engineRef.current = engine;

    const { cardW, cardH, initialPositions } = getCardLayout(width, height);

    // Create Floor and Boundaries (No visible box, open arena)
    const wallThickness = 120;
    const floor = Matter.Bodies.rectangle(
      width / 2,
      height + wallThickness / 2 - 10,
      width * 3,
      wallThickness,
      { isStatic: true, friction: 0.85, restitution: 0.4, label: 'floor' }
    );

    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2 + 6,
      height / 2,
      wallThickness,
      height * 3,
      { isStatic: true, friction: 0.4, label: 'leftWall' }
    );

    const rightWall = Matter.Bodies.rectangle(
      width + wallThickness / 2 - 6,
      height / 2,
      wallThickness,
      height * 3,
      { isStatic: true, friction: 0.4, label: 'rightWall' }
    );

    Matter.Composite.add(engine.world, [floor, leftWall, rightWall]);

    // Create 4 Card Rigid Bodies
    const bodies: Matter.Body[] = [];
    const ropes: RopeSegment[] = [];

    initialPositions.forEach((pos, idx) => {
      const body = Matter.Bodies.rectangle(pos.x, pos.y, cardW, cardH, {
        chamfer: { radius: 24 },
        density: 0.003,
        friction: 0.75,
        frictionAir: 0.012,
        restitution: 0.38,
        label: `card-${idx}`
      });

      bodies.push(body);

      // 2 hanging ropes per box: Left & Right attachments
      const attachSpread = cardW * 0.38;
      
      const leftAnchor = {
        x: pos.x - attachSpread,
        y: Math.max(10, pos.y - 110 - (idx % 2 === 0 ? 15 : 0))
      };
      const leftConstraint = Matter.Constraint.create({
        pointA: leftAnchor,
        bodyB: body,
        pointB: { x: -attachSpread, y: -cardH / 2 + 8 },
        stiffness: 0.95,
        damping: 0.08,
        length: pos.y - leftAnchor.y
      });

      const rightAnchor = {
        x: pos.x + attachSpread,
        y: Math.max(10, pos.y - 110 - (idx % 2 !== 0 ? 15 : 0))
      };
      const rightConstraint = Matter.Constraint.create({
        pointA: rightAnchor,
        bodyB: body,
        pointB: { x: attachSpread, y: -cardH / 2 + 8 },
        stiffness: 0.95,
        damping: 0.08,
        length: pos.y - rightAnchor.y
      });

      ropes.push({
        id: `rope-${idx}-left`,
        boxIndex: idx,
        anchorSide: 'left',
        anchor: leftAnchor,
        boxAttachOffset: { x: -attachSpread, y: -cardH / 2 + 8 },
        constraint: leftConstraint,
        isCut: false
      });

      ropes.push({
        id: `rope-${idx}-right`,
        boxIndex: idx,
        anchorSide: 'right',
        anchor: rightAnchor,
        boxAttachOffset: { x: attachSpread, y: -cardH / 2 + 8 },
        constraint: rightConstraint,
        isCut: false
      });

      Matter.Composite.add(engine.world, [body, leftConstraint, rightConstraint]);
    });

    cardBodiesRef.current = bodies;
    ropesRef.current = ropes;
    grabbedBodyRef.current = null;
    grabConstraintRef.current = null;
    setIsGravityMode(false);

    // Collision sound listener
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const speedA = Matter.Vector.magnitude(pair.bodyA.velocity);
        const speedB = Matter.Vector.magnitude(pair.bodyB.velocity);
        const maxSpeed = Math.max(speedA, speedB);
        if (maxSpeed > 2.2) {
          physicsAudio.playImpactSound(Math.min(1.0, maxSpeed / 9));
        }
      });
    });

    // Start runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
  }, [getCardLayout]);

  // Handle pointer down (detect card grabbing for Google Gravity throw, or slice start)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !engineRef.current) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isPointerDownRef.current = true;
    pointerStartPosRef.current = { x, y, time: Date.now() };
    lastPointerPosRef.current = { x, y };
    bladePointsRef.current = [{ x, y, time: Date.now() }];

    // Check if clicked directly on any card body for Google Gravity grabbing & tossing
    const hitBodies = Matter.Query.point(cardBodiesRef.current, { x, y });
    if (hitBodies.length > 0) {
      const targetBody = hitBodies[0];
      grabbedBodyRef.current = targetBody;

      // Create dynamic grab constraint for smooth Google Gravity tossing
      const grabConstraint = Matter.Constraint.create({
        pointA: { x, y },
        bodyB: targetBody,
        pointB: {
          x: (x - targetBody.position.x) * Math.cos(-targetBody.angle) - (y - targetBody.position.y) * Math.sin(-targetBody.angle),
          y: (x - targetBody.position.x) * Math.sin(-targetBody.angle) + (y - targetBody.position.y) * Math.cos(-targetBody.angle),
        },
        stiffness: 0.45,
        damping: 0.15,
      });

      grabConstraintRef.current = grabConstraint;
      Matter.Composite.add(engineRef.current.world, grabConstraint);
    }
  };

  // Handle pointer move (update grab position, throw velocity, slice ropes)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    bladePointsRef.current.push({ x: currentX, y: currentY, time: Date.now() });
    if (bladePointsRef.current.length > 20) {
      bladePointsRef.current.shift();
    }

    // If grabbing a body (Google Gravity drag & toss)
    if (grabConstraintRef.current) {
      grabConstraintRef.current.pointA = { x: currentX, y: currentY };
    }

    // Check slice intersection with ropes
    if (lastPointerPosRef.current) {
      const p1 = lastPointerPosRef.current;
      const p2 = { x: currentX, y: currentY };

      ropesRef.current.forEach((rope) => {
        if (rope.isCut) return;
        const body = cardBodiesRef.current[rope.boxIndex];
        if (!body) return;

        const cos = Math.cos(body.angle);
        const sin = Math.sin(body.angle);
        const attachX = body.position.x + rope.boxAttachOffset.x * cos - rope.boxAttachOffset.y * sin;
        const attachY = body.position.y + rope.boxAttachOffset.x * sin + rope.boxAttachOffset.y * cos;

        const hit = checkLineIntersection(p1, p2, rope.anchor, { x: attachX, y: attachY });
        if (hit) {
          cutRope(rope, hit);
        }
      });
    }

    lastPointerPosRef.current = { x: currentX, y: currentY };
  };

  // Handle pointer release (release grab & impart throwing inertia)
  const handlePointerUp = () => {
    if (grabConstraintRef.current && engineRef.current) {
      Matter.Composite.remove(engineRef.current.world, grabConstraintRef.current);
      grabConstraintRef.current = null;
    }
    grabbedBodyRef.current = null;
    isPointerDownRef.current = false;
    lastPointerPosRef.current = null;
  };

  // Main Render Loop (Canvas for ropes, pins, blade trail, sparks + DOM Sync)
  useEffect(() => {
    setupPhysics();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const renderLoop = () => {
      if (canvas && ctx && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Top Anchor Pegs & Hanging Ropes (Clean, open aesthetic)
        ropesRef.current.forEach((rope) => {
          const body = cardBodiesRef.current[rope.boxIndex];
          if (!body) return;

          // Anchor Peg Pin
          ctx.beginPath();
          ctx.arc(rope.anchor.x, rope.anchor.y, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ea580c';
          ctx.fill();
          ctx.strokeStyle = '#fed7aa';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Peg Center Rivet
          ctx.beginPath();
          ctx.arc(rope.anchor.x, rope.anchor.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();

          if (!rope.isCut) {
            const cos = Math.cos(body.angle);
            const sin = Math.sin(body.angle);
            const attachX = body.position.x + rope.boxAttachOffset.x * cos - rope.boxAttachOffset.y * sin;
            const attachY = body.position.y + rope.boxAttachOffset.x * sin + rope.boxAttachOffset.y * cos;

            // Draw Braided Rope Strand
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(rope.anchor.x, rope.anchor.y);
            
            const midX = (rope.anchor.x + attachX) / 2;
            const midY = (rope.anchor.y + attachY) / 2 + 2;
            ctx.quadraticCurveTo(midX, midY, attachX, attachY);

            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Rope inner twist highlight
            ctx.strokeStyle = '#fde68a';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.restore();

            // Card attachment copper ring
            ctx.beginPath();
            ctx.arc(attachX, attachY, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ea580c';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });

        // 2. Update and Draw Sparks / Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18;
          p.life -= 1 / p.maxLife;

          if (p.life <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }

        // 3. Draw Glowing Blade Slash Trail
        const now = Date.now();
        bladePointsRef.current = bladePointsRef.current.filter((pt) => now - pt.time < 200);

        if (bladePointsRef.current.length > 1) {
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          for (let i = 1; i < bladePointsRef.current.length; i++) {
            const p1 = bladePointsRef.current[i - 1];
            const p2 = bladePointsRef.current[i];
            const age = (now - p2.time) / 200;
            const alpha = Math.max(0, 1 - age);
            const width = Math.max(1, (1 - age) * 6);

            // Outer Neon Glow
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(249, 115, 22, ${alpha * 0.55})`;
            ctx.lineWidth = width * 2;
            ctx.stroke();

            // Core Razor Line
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
            ctx.lineWidth = width;
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 4. Synchronize DOM Cards with Matter.js Bodies
      cardBodiesRef.current.forEach((body, idx) => {
        const domEl = cardRefs[idx].current;
        if (domEl) {
          const x = body.position.x;
          const y = body.position.y;
          const angle = body.angle;
          domEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}rad)`;
        }
      });

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      setupPhysics();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
    };
  }, [setupPhysics]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyTelegram = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(PERSONAL_INFO.telegramHandle);
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 2000);
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    physicsAudio.enabled = next;
  };

  return (
    <div className="w-full relative select-none">
      {/* Google Gravity & Cut-the-Rope Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono font-semibold shadow-sm">
          <Scissors className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="hidden sm:inline">Slice ropes to cut &bull; Grab and toss boxes (Google Gravity physics)</span>
          <span className="sm:hidden">Swipe to slice &bull; Drag to toss boxes</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl border theme-border theme-card hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-mono theme-text-secondary cursor-pointer flex items-center gap-1.5 shadow-sm"
            title={audioEnabled ? 'Mute Physics Sound' : 'Enable Physics Sound'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Google Gravity Trigger */}
          <button
            onClick={triggerGoogleGravity}
            className="px-3.5 py-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Trigger Google Gravity free-fall on all boxes"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gravity</span>
          </button>

          {/* Reset / Re-hang Ropes Button */}
          <button
            onClick={setupPhysics}
            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-600/20 active:scale-95"
            title="Re-hang all boxes to original positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Seamless Open Physics Arena (No outer container box) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full h-[860px] sm:h-[660px] bg-transparent cursor-grab active:cursor-grabbing touch-none select-none"
        style={{ touchAction: 'none' }}
      >
        {/* Background Visual Canvas for Ropes, Pegs & Cutting Trail */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Card 0: Direct Email Card */}
        <div
          ref={cardRefs[0]}
          className="absolute top-0 left-0 w-[340px] sm:w-[360px] h-[175px] rounded-3xl border theme-border theme-card shadow-2xl flex flex-col justify-between p-4 sm:p-5 pointer-events-auto will-change-transform z-10 select-none backdrop-blur-md cursor-grab active:cursor-grabbing transition-[shadow] hover:shadow-orange-500/20 hover:border-orange-500/40"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 w-full">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-mono theme-text-muted">Direct Email</div>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm sm:text-[15px] font-bold theme-text-primary font-mono hover:text-orange-500 transition-colors break-words block leading-snug mt-0.5"
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t theme-border">
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-600/20"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>Send Email</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="py-2 px-3 rounded-xl border theme-border hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-mono flex items-center gap-1 cursor-pointer theme-text-secondary shrink-0"
              title="Copy email to clipboard"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Card 1: Direct Telegram Card */}
        <div
          ref={cardRefs[1]}
          className="absolute top-0 left-0 w-[340px] sm:w-[360px] h-[175px] rounded-3xl border border-sky-500/30 theme-card shadow-2xl flex flex-col justify-between p-4 sm:p-5 pointer-events-auto will-change-transform z-10 select-none backdrop-blur-md cursor-grab active:cursor-grabbing transition-[shadow] hover:shadow-sky-500/20 hover:border-sky-500/50"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 w-full">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-semibold">Direct Telegram</div>
                <a
                  href={PERSONAL_INFO.telegram}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm sm:text-[15px] font-bold theme-text-primary font-mono hover:text-sky-500 transition-colors break-words block leading-snug mt-0.5"
                >
                  {PERSONAL_INFO.telegramHandle}
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t theme-border">
            <a
              href={PERSONAL_INFO.telegram}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/20"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Message</span>
            </a>
            <button
              onClick={handleCopyTelegram}
              className="py-2 px-3 rounded-xl border border-sky-500/30 hover:bg-sky-500/10 transition-all text-xs font-mono flex items-center gap-1 cursor-pointer text-sky-600 dark:text-sky-400 shrink-0"
              title="Copy Telegram username"
            >
              {copiedTelegram ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTelegram ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Curriculum Vitae / Resume Card */}
        <div
          ref={cardRefs[2]}
          className="absolute top-0 left-0 w-[340px] sm:w-[360px] h-[175px] rounded-3xl border theme-border theme-card shadow-2xl flex flex-col justify-between p-4 sm:p-5 pointer-events-auto will-change-transform z-10 select-none backdrop-blur-md cursor-grab active:cursor-grabbing transition-[shadow] hover:shadow-purple-500/20 hover:border-purple-500/40"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-mono theme-text-muted">Curriculum Vitae</div>
              <div className="text-sm sm:text-[15px] font-bold theme-text-primary mt-0.5 leading-snug">
                Resume (C# / Unity Game Dev)
              </div>
              <p className="text-[11px] theme-text-secondary mt-0.5 leading-tight line-clamp-2">
                1-page printable CV detailing project architecture, Unity/Rust and technical achievements.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t theme-border flex items-center gap-2">
            <button
              id="physics-open-resume-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenResume) onOpenResume();
              }}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>View & Download Resume / CV</span>
            </button>
          </div>
        </div>

        {/* Card 3: Location & Timezone Card */}
        <div
          ref={cardRefs[3]}
          className="absolute top-0 left-0 w-[340px] sm:w-[360px] h-[175px] rounded-3xl border theme-border theme-card shadow-2xl flex flex-col justify-between p-4 sm:p-5 pointer-events-auto will-change-transform z-10 select-none backdrop-blur-md cursor-grab active:cursor-grabbing transition-[shadow] hover:shadow-blue-500/20 hover:border-blue-500/40"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-mono theme-text-muted">Location & Timezone</div>
              <div className="text-sm sm:text-[15px] font-bold theme-text-primary mt-0.5 leading-snug">{PERSONAL_INFO.location}</div>
              <p className="text-[11px] theme-text-secondary mt-0.5 leading-tight line-clamp-2">Available for remote contracts, full-time game dev roles & global opportunities.</p>
            </div>
          </div>

          <div className="pt-3 border-t theme-border flex items-center gap-2 text-[11px] font-mono theme-text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">Status: Open to Junior Game Dev roles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
