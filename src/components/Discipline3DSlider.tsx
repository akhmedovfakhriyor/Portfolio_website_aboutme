import React, { useState, useEffect, useRef, PointerEvent } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { SectionId } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Terminal,
  Gamepad2,
  Palette,
  Activity,
  Sparkles,
} from 'lucide-react';
import {
  createPodium,
  createTerminalModel,
  createGamepadModel,
  createTabletModel,
  createRunningShoesModel,
} from './discipline3DModels';

interface Discipline3DSliderProps {
  onNavigate: (section: SectionId) => void;
  headerRef?: React.RefObject<HTMLDivElement | null>;
}

interface DisciplineItem {
  id: SectionId;
  title: string;
  subtitle: string;
  tag: string;
  icon: typeof Terminal;
  color: string;
  stat: string;
  hint: string;
  create3DModel: () => THREE.Group;
}

const DISCIPLINE_ITEMS: DisciplineItem[] = [
  {
    id: 'engineering',
    title: 'Systems & Software',
    subtitle: 'Rust & High-Performance Architecture',
    tag: 'Rust / Systems',
    icon: Terminal,
    color: '#f97316',
    stat: 'Cortex-FS Explorer (0.2ms)',
    hint: 'Sub-millisecond Lock-Free Indexing',
    create3DModel: createTerminalModel,
  },
  {
    id: 'gamedev',
    title: 'Game Development',
    subtitle: 'Unity 2023, Unity 6 & Unreal',
    tag: 'Unreal / Bevy',
    icon: Gamepad2,
    color: '#a855f7',
    stat: '4 Playable Engine Titles',
    hint: 'Temporal Heist & Custom Shaders',
    create3DModel: createGamepadModel,
  },
  {
    id: 'art',
    title: '3D & Visual Atelier',
    subtitle: 'Hard-Surface Assets & Concept Art',
    tag: 'Blender / ZBrush',
    icon: Palette,
    color: '#2dd4bf',
    stat: 'Interactive 3D Viewport',
    hint: 'PBR 4K Mecha & Environments',
    create3DModel: createTabletModel,
  },
  {
    id: 'sports',
    title: 'Athletics & Endurance',
    subtitle: 'Football & Speedcubing',
    tag: 'Athletics / CFOP',
    icon: Activity,
    color: '#0284c7',
    stat: 'Match Ball & Sub-10s CFOP',
    hint: 'Hex-Panel Match Ball & Speedcube',
    create3DModel: createRunningShoesModel,
  },
];

export function Discipline3DSlider({ onNavigate, headerRef }: Discipline3DSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const currentItem = DISCIPLINE_ITEMS[currentIndex];

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentStageGroupRef = useRef<THREE.Group | null>(null);
  const podiumGroupRef = useRef<THREE.Group | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Hover ref to prevent stale closures in animation frame loop
  const isHoveredRef = useRef(false);
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Dynamic interpolation values for podium & model
  const currentPodiumScaleRef = useRef(1.0);
  const currentPodiumYRef = useRef(0.0);

  const currentModelScaleRef = useRef(1.0);
  const currentModelZRef = useRef(0.0);
  const currentModelYRef = useRef(0.0);

  // Focus hover zone tracking
  const isOverButtonRef = useRef(false);

  // Rotation & mouse tilt tracking
  const currentRotationYRef = useRef(0);
  const tiltXRef = useRef(0);
  const tiltYRef = useRef(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DISCIPLINE_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DISCIPLINE_ITEMS.length) % DISCIPLINE_ITEMS.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.95, 7.0);
    camera.lookAt(0, 0.90, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Studio Lights - Tuned for crisp metallic reflections & deep obsidian contrast
    const ambientLight = new THREE.AmbientLight(0x0a101d, 0.55);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    mainKeyLight.position.set(5, 7, 5);
    scene.add(mainKeyLight);

    const frontKeyLight = new THREE.DirectionalLight(0xdce7f9, 0.85);
    frontKeyLight.position.set(0, 2.2, 5.5);
    scene.add(frontKeyLight);

    const coolRimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    coolRimLight.position.set(-5, 3.5, 2.5);
    scene.add(coolRimLight);

    // Subtle colored backlight halo from behind the model (prevents washing front into muddy brown)
    const accentPointLight = new THREE.PointLight(currentItem.color, 1.2, 10);
    accentPointLight.position.set(0, 2.0, -1.2);
    scene.add(accentPointLight);
    pointLightRef.current = accentPointLight;

    const rimLight = new THREE.DirectionalLight(currentItem.color, 1.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop with Visibility Occlusion (pauses WebGL when scrolled offscreen)
    let animationFrameId: number | null = null;
    let isVisible = true;

    const animate = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);

      const isHover = isHoveredRef.current;

      // 1. Podium animation: smoothly shrinks to scale 0 and lowers down when hovered
      if (podiumGroupRef.current) {
        const targetPodiumScale = isHover ? 0.0 : 1.0;
        const targetPodiumY = isHover ? -0.4 : 0.0;

        currentPodiumScaleRef.current = THREE.MathUtils.lerp(
          currentPodiumScaleRef.current,
          targetPodiumScale,
          0.1
        );
        currentPodiumYRef.current = THREE.MathUtils.lerp(
          currentPodiumYRef.current,
          targetPodiumY,
          0.1
        );

        const pScale = currentPodiumScaleRef.current;
        podiumGroupRef.current.scale.set(pScale, pScale, pScale);
        podiumGroupRef.current.position.y = currentPodiumYRef.current;
        podiumGroupRef.current.visible = pScale > 0.01;
      }

      // 2. Model animation: smoothly moves closer (Z), scales up (+22%), stays centered, and stops auto-rotating
      if (modelGroupRef.current) {
        const targetModelScale = isHover ? 1.22 : 1.0;
        const targetModelZ = isHover ? 0.45 : 0.0;
        const targetModelY = isHover ? 0.0 : 0.0;

        currentModelScaleRef.current = THREE.MathUtils.lerp(
          currentModelScaleRef.current,
          targetModelScale,
          0.09
        );
        currentModelZRef.current = THREE.MathUtils.lerp(
          currentModelZRef.current,
          targetModelZ,
          0.09
        );
        currentModelYRef.current = THREE.MathUtils.lerp(
          currentModelYRef.current,
          targetModelY,
          0.09
        );

        // Subtle organic floating bob
        const time = Date.now() * 0.0015;
        const bob = Math.sin(time) * 0.025;

        modelGroupRef.current.scale.set(
          currentModelScaleRef.current,
          currentModelScaleRef.current,
          currentModelScaleRef.current
        );
        modelGroupRef.current.position.set(
          0,
          currentModelYRef.current + bob,
          currentModelZRef.current
        );

        // Rotation behavior
        if (!isHover) {
          // Continuously spins when not hovered
          currentRotationYRef.current += 0.007;
          modelGroupRef.current.rotation.y = currentRotationYRef.current;

          // Smoothly return X and Z tilt to neutral
          modelGroupRef.current.rotation.x = THREE.MathUtils.lerp(
            modelGroupRef.current.rotation.x,
            0.05,
            0.06
          );
          modelGroupRef.current.rotation.z = THREE.MathUtils.lerp(
            modelGroupRef.current.rotation.z,
            0,
            0.06
          );
        } else {
          // When HOVERED:
          // 1. Auto-rotation stops!
          // 2. Model quickly aligns towards the nearest front angle with a dynamic 3/4 perspective
          const fullRotations = Math.round(currentRotationYRef.current / (Math.PI * 2));
          const targetFrontAngle = fullRotations * (Math.PI * 2) + 0.15;

          currentRotationYRef.current = THREE.MathUtils.lerp(
            currentRotationYRef.current,
            targetFrontAngle,
            0.20
          );

          // 3. Responsive mouse inspection tilt
          const targetRotY = currentRotationYRef.current + tiltYRef.current * 0.36;
          const targetRotX = tiltXRef.current * 0.22;
          const targetRotZ = -tiltYRef.current * 0.1;

          modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(
            modelGroupRef.current.rotation.y,
            targetRotY,
            0.22
          );
          modelGroupRef.current.rotation.x = THREE.MathUtils.lerp(
            modelGroupRef.current.rotation.x,
            targetRotX,
            0.18
          );
          modelGroupRef.current.rotation.z = THREE.MathUtils.lerp(
            modelGroupRef.current.rotation.z,
            targetRotZ,
            0.18
          );
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // IntersectionObserver to pause rendering when the section is not visible
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const inView = entry.isIntersecting;
          isVisible = inView;
          if (inView && animationFrameId === null) {
            animate();
          } else if (!inView && animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    animate();

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update 3D Stage when currentIndex changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (currentStageGroupRef.current) {
      scene.remove(currentStageGroupRef.current);
      currentStageGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      currentStageGroupRef.current = null;
      podiumGroupRef.current = null;
      modelGroupRef.current = null;
    }

    if (pointLightRef.current) {
      pointLightRef.current.color.set(currentItem.color);
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.set(currentItem.color);
    }

    const stageGroup = new THREE.Group();

    // 1. Podium
    const podium = createPodium(currentItem.color);
    stageGroup.add(podium);
    podiumGroupRef.current = podium;

    // 2. 3D Model
    const model = currentItem.create3DModel();
    stageGroup.add(model);
    modelGroupRef.current = model;

    // Reset interpolation values for smooth transition
    currentPodiumScaleRef.current = isHovered ? 0.0 : 1.0;
    currentPodiumYRef.current = isHovered ? -0.4 : 0.0;
    currentModelScaleRef.current = isHovered ? 1.22 : 1.0;
    currentModelZRef.current = isHovered ? 0.45 : 0.0;
    currentModelYRef.current = isHovered ? 0.0 : 0.0;

    // Initial scale transition
    stageGroup.scale.set(0.01, 0.01, 0.01);
    scene.add(stageGroup);
    currentStageGroupRef.current = stageGroup;

    let progress = 0;
    const popInTimer = setInterval(() => {
      progress += 0.12;
      if (progress >= 1) {
        stageGroup.scale.set(1.0, 1.0, 1.0);
        clearInterval(popInTimer);
      } else {
        const ease = 1 - Math.pow(1 - progress, 3);
        stageGroup.scale.set(ease, ease, ease);
      }
    }, 16);

    return () => {
      clearInterval(popInTimer);
    };
  }, [currentIndex, currentItem]);

  // Pointer move interaction for 3D mouse inspection tilt with focused hover radius
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Compute pixel distance from the center of the 3D model
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Focused elliptical hover zone around the central 3D model, its pedestal, and gears
    // Generous radius covering the entire glowing pedestal ring and model equipment
    const radiusX = Math.min(320, rect.width * 0.46);
    const radiusY = Math.min(220, rect.height * 0.48);
    const isInsideHoverRadius = Math.pow(dx / radiusX, 2) + Math.pow(dy / radiusY, 2) <= 1.0;
    const shouldHover = isInsideHoverRadius || isOverButtonRef.current;

    if (shouldHover) {
      const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const yNorm = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      tiltYRef.current = Math.max(-1, Math.min(1, xNorm));
      tiltXRef.current = Math.max(-1, Math.min(1, yNorm));
      setIsHovered(true);
    } else {
      setIsHovered(false);
      tiltXRef.current = 0;
      tiltYRef.current = 0;
    }
  };

  // Only trigger section entry if clicked within the exact interaction radius (or on the explore CTA)
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const radiusX = Math.min(320, rect.width * 0.46);
    const radiusY = Math.min(220, rect.height * 0.48);
    const isInsideRadius = Math.pow(dx / radiusX, 2) + Math.pow(dy / radiusY, 2) <= 1.0;
    if (isInsideRadius || isOverButtonRef.current) {
      onNavigate(currentItem.id);
    }
  };

  return (
    <div
      id="discipline-3d-showcase-section"
      className="relative w-full max-w-5xl mx-auto select-none flex flex-col items-center scroll-mt-24"
    >
      {/* Active Discipline Section Header - Prominently and conveniently positioned above the 3D stage */}
      <div ref={headerRef} className="flex flex-col items-center justify-center text-center w-full mb-3 sm:mb-4 z-20 pointer-events-none px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase mb-1.5 border backdrop-blur-md transition-colors shadow-xs"
              style={{
                color: currentItem.color,
                backgroundColor: `${currentItem.color}15`,
                borderColor: `${currentItem.color}35`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: currentItem.color }}
              />
              <span>{currentItem.tag}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold theme-text-primary tracking-tight leading-tight">
              {currentItem.title}
            </h2>

            <p className="text-xs sm:text-sm theme-text-secondary mt-1 font-mono max-w-md">
              {currentItem.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Central 3D Stage Viewport (Borderless, Proportionate & Fits Viewport Completely) */}
      <div
        className={`relative w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center justify-center overflow-visible ${
          isHovered ? 'cursor-pointer' : 'cursor-default'
        }`}
        onMouseLeave={() => {
          setIsHovered(false);
          isOverButtonRef.current = false;
          tiltXRef.current = 0;
          tiltYRef.current = 0;
        }}
        onPointerMove={handlePointerMove}
        onClick={handleStageClick}
      >
        {/* Canvas Mount Container */}
        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center pointer-events-auto"
        />

        {/* Ambient Radial Color Bloom Behind Podium */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
          style={{ backgroundColor: currentItem.color }}
        />

        {/* Left Carousel Arrow Button - Responsive Light & Dark Mode */}
        <button
          id="slider-prev-btn"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/85 dark:bg-black/50 border border-black/10 dark:border-white/15 text-stone-700 dark:text-white/70 hover:text-stone-950 dark:hover:text-white hover:bg-white dark:hover:bg-black/80 hover:scale-110 active:scale-95 transition-all shadow-md backdrop-blur-md cursor-pointer"
          aria-label="Previous 3D Discipline"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Carousel Arrow Button - Responsive Light & Dark Mode */}
        <button
          id="slider-next-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/85 dark:bg-black/50 border border-black/10 dark:border-white/15 text-stone-700 dark:text-white/70 hover:text-stone-950 dark:hover:text-white hover:bg-white dark:hover:bg-black/80 hover:scale-110 active:scale-95 transition-all shadow-md backdrop-blur-md cursor-pointer"
          aria-label="Next 3D Discipline"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating Instruction Hint at bottom when not hovered */}
        <AnimatePresence>
          {!isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 dark:bg-black/50 border border-black/10 dark:border-white/15 backdrop-blur-sm text-stone-700 dark:text-stone-300 text-[11px] font-mono shadow-sm z-20 pointer-events-none transition-colors duration-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Hover model to inspect • Click to enter</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================================== */}
        {/* HOVER INTERACTION CALL-TO-ACTION                                    */}
        {/* =================================================================== */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onMouseEnter={() => {
                isOverButtonRef.current = true;
                setIsHovered(true);
              }}
              onMouseLeave={() => {
                isOverButtonRef.current = false;
              }}
              className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-1.5"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/60 border border-black/10 dark:border-white/10 text-[9px] font-mono text-stone-700 dark:text-stone-300 backdrop-blur-sm shadow-sm transition-colors duration-300">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentItem.color }} />
                <span>Click to enter {currentItem.title}</span>
              </div>

              <button
                id={`explore-btn-${currentItem.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(currentItem.id);
                }}
                className="px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs font-mono text-white flex items-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20 group"
                style={{
                  backgroundColor: currentItem.color,
                  boxShadow: `0 8px 24px -4px ${currentItem.color}80`,
                }}
              >
                <span>Explore {currentItem.title}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
