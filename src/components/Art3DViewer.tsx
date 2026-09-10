import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

export function Art3DViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<'mecha' | 'relic' | 'knot' | 'crystal'>('mecha');
  const [autoRotate, setAutoRotate] = useState(true);
  const [shaderStyle, setShaderStyle] = useState<'pbr' | 'clay' | 'wireframe'>('pbr');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentMeshRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const autoRotateRef = useRef(autoRotate);

  // Keep live autoRotate ref in sync with state for continuous animation loop
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Lighting (Aquamarine Seafoam: Luminous Aquamarine Key + Deep Sea Teal Fill + White Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x2dd4bf, 2.2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x14b8a6, 1.8);
    fillLight.position.set(-5, -3, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2, 20);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Group to hold meshes
    const group = new THREE.Group();
    scene.add(group);
    currentMeshRef.current = group;

    // Build the initial model
    buildModel(modelType, group, shaderStyle);

    // Mouse Interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      group.rotation.y += dx * 0.008;
      group.rotation.x += dy * 0.008;

      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      // Only zoom if Ctrl/Cmd is pressed; otherwise let page scroll freely through the section
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        camera.position.z = Math.max(3, Math.min(12, camera.position.z + e.deltaY * 0.005));
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // Touch interaction for mobile
    let prevTouch = { x: 0, y: 0 };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - prevTouch.x;
        const dy = e.touches[0].clientY - prevTouch.y;
        group.rotation.y += dx * 0.01;
        group.rotation.x += dy * 0.01;
        prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    domEl.addEventListener('touchstart', handleTouchStart);
    domEl.addEventListener('touchmove', handleTouchMove);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    // Animation Loop with Visibility Optimization
    let animId: number;
    let isVisible = false;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(animate);
      }
    }, { threshold: 0.05 });
    visibilityObserver.observe(domEl);

    const animate = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(animate);

      if (autoRotateRef.current && !isDragging) {
        group.rotation.y += 0.008;
        group.rotation.x += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('wheel', handleWheel);
      domEl.removeEventListener('touchstart', handleTouchStart);
      domEl.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
    };
  }, []);

  // Update model when states change
  useEffect(() => {
    if (!currentMeshRef.current) return;
    buildModel(modelType, currentMeshRef.current, shaderStyle);
  }, [modelType, shaderStyle]);

  function buildModel(
    type: 'mecha' | 'relic' | 'knot' | 'crystal',
    targetGroup: THREE.Group,
    style: 'pbr' | 'clay' | 'wireframe'
  ) {
    // Clear previous children
    while (targetGroup.children.length > 0) {
      const obj = targetGroup.children[0] as THREE.Mesh;
      if (obj.geometry) obj.geometry.dispose();
      targetGroup.remove(obj);
    }

    let material: THREE.Material;

    if (style === 'wireframe') {
      material = new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
    } else if (style === 'clay') {
      material = new THREE.MeshStandardMaterial({
        color: 0xf3f6f5,
        roughness: 0.75,
        metalness: 0.05,
      });
    } else {
      // PBR Luminous Aquamarine Chrome (#2dd4bf)
      material = new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        roughness: 0.28,
        metalness: 0.82,
      });
    }

    if (type === 'knot') {
      const geom = new THREE.TorusKnotGeometry(1.6, 0.5, 128, 32);
      const mesh = new THREE.Mesh(geom, material);
      targetGroup.add(mesh);
    } else if (type === 'relic') {
      const geom = new THREE.IcosahedronGeometry(2.0, 1);
      const mesh = new THREE.Mesh(geom, material);
      targetGroup.add(mesh);
    } else if (type === 'crystal') {
      const geom = new THREE.OctahedronGeometry(2.2, 0);
      const mesh = new THREE.Mesh(geom, material);
      targetGroup.add(mesh);
    } else {
      // Mecha Core (Composite hard-surface assembly)
      const coreGeom = new THREE.BoxGeometry(1.8, 1.8, 1.8);
      const coreMesh = new THREE.Mesh(coreGeom, material);
      targetGroup.add(coreMesh);

      // Flanking cylinders/thrusters
      const cylGeom = new THREE.CylinderGeometry(0.3, 0.4, 3, 16);
      const leftCyl = new THREE.Mesh(cylGeom, material);
      leftCyl.position.set(-1.6, 0, 0);
      targetGroup.add(leftCyl);

      const rightCyl = new THREE.Mesh(cylGeom, material);
      rightCyl.position.set(1.6, 0, 0);
      targetGroup.add(rightCyl);

      const ringGeom = new THREE.TorusGeometry(2.5, 0.1, 16, 64);
      const ringMesh = new THREE.Mesh(ringGeom, material);
      ringMesh.rotation.x = Math.PI / 2;
      targetGroup.add(ringMesh);
    }
  }

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(3, cameraRef.current.position.z - 0.8);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(12, cameraRef.current.position.z + 0.8);
    }
  };

  return (
    <div
      id="art-3d-model-viewer"
      className="relative w-full rounded-2xl border theme-border theme-card overflow-hidden shadow-xl"
    >
      {/* Top Header / Viewport HUD */}
      <div className="px-5 py-3 border-b theme-border flex flex-wrap items-center justify-between gap-3 bg-black/5 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
          <span className="text-xs font-mono font-bold theme-text-primary">
            WebGL 3D Asset Viewport
          </span>
          <span className="text-[11px] font-mono theme-text-muted hidden sm:inline">
            // Drag to Orbit • Zoom with +/- or Ctrl+Scroll
          </span>
        </div>

        {/* Geometry Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setModelType('mecha')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              modelType === 'mecha'
                ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-sm'
                : 'border theme-border theme-text-secondary hover:theme-text-primary'
            }`}
          >
            Mech Core
          </button>
          <button
            onClick={() => setModelType('relic')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              modelType === 'relic'
                ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-sm'
                : 'border theme-border theme-text-secondary hover:theme-text-primary'
            }`}
          >
            Relic
          </button>
          <button
            onClick={() => setModelType('knot')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              modelType === 'knot'
                ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-sm'
                : 'border theme-border theme-text-secondary hover:theme-text-primary'
            }`}
          >
            Torus
          </button>
          <button
            onClick={() => setModelType('crystal')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              modelType === 'crystal'
                ? 'bg-[#2dd4bf] text-slate-950 font-bold shadow-sm'
                : 'border theme-border theme-text-secondary hover:theme-text-primary'
            }`}
          >
            Crystal
          </button>
        </div>
      </div>

      {/* 3D Canvas Canvas Mount */}
      <div
        ref={containerRef}
        className="w-full h-[260px] sm:h-[420px] bg-gradient-to-b from-[#e8ebea] via-[#e0e8e6] to-[#d2dedb] dark:from-slate-950 dark:to-teal-950/40 cursor-grab active:cursor-grabbing"
      />

      {/* Floating Control Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Style selection */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
          <button
            id="shader-pbr-btn"
            onClick={() => setShaderStyle('pbr')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              shaderStyle === 'pbr' ? 'bg-[#2dd4bf] text-slate-950 font-bold' : 'hover:text-teal-300'
            }`}
          >
            Metallic PBR
          </button>
          <button
            id="shader-clay-btn"
            onClick={() => setShaderStyle('clay')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              shaderStyle === 'clay' ? 'bg-[#2dd4bf] text-slate-950 font-bold' : 'hover:text-teal-300'
            }`}
          >
            Clay Sculpt
          </button>
          <button
            id="shader-wireframe-btn"
            onClick={() => setShaderStyle('wireframe')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              shaderStyle === 'wireframe' ? 'bg-[#2dd4bf] text-slate-950 font-bold' : 'hover:text-teal-300'
            }`}
          >
            Wireframe
          </button>
        </div>

        {/* Toggles & Zoom */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center rounded-xl backdrop-blur-md border border-white/10 bg-black/70 overflow-hidden text-white">
            <button
              id="zoom-in-btn"
              onClick={handleZoomIn}
              className="p-2 hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button
              id="zoom-out-btn"
              onClick={handleZoomOut}
              className="p-2 hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Turntable Auto-Rotation Toggle */}
          <button
            id="turntable-toggle-btn"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
              autoRotate
                ? 'bg-[#2dd4bf] text-slate-950 border-[#2dd4bf] font-bold shadow-md shadow-teal-400/25'
                : 'bg-black/70 text-white border-white/10 hover:border-teal-400'
            }`}
            title={autoRotate ? 'Pause 360° Turntable Rotation' : 'Resume 360° Turntable Rotation'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Turntable</span>
          </button>
        </div>
      </div>
    </div>
  );
}
