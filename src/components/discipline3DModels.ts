import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * Creates the high-tech illuminated podium base that all 3D objects sit on.
 */
export function createPodium(accentColor: string): THREE.Group {
  const podiumGroup = new THREE.Group();
  podiumGroup.name = 'podium';

  // Base circular pedestal - Anodized Dark Metal
  const baseGeo = new THREE.CylinderGeometry(1.95, 2.15, 0.18, 48);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0c1018,
    roughness: 0.28,
    metalness: 0.88,
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.09;
  baseMesh.receiveShadow = true;
  podiumGroup.add(baseMesh);

  // Recessed inner floor disc
  const floorGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.05, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x06090e,
    roughness: 0.18,
    metalness: 0.92,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.y = 0.02;
  podiumGroup.add(floorMesh);

  // Concentric radial tech grooves on podium floor
  const ringGeo1 = new THREE.RingGeometry(1.2, 1.23, 64);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(accentColor),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45,
  });
  const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
  ringMesh1.rotation.x = -Math.PI / 2;
  ringMesh1.position.y = 0.048;
  podiumGroup.add(ringMesh1);

  const ringGeo2 = new THREE.RingGeometry(0.6, 0.63, 64);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(accentColor),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35,
  });
  const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
  ringMesh2.rotation.x = -Math.PI / 2;
  ringMesh2.position.y = 0.048;
  podiumGroup.add(ringMesh2);

  // Glowing neon perimeter rim ring
  const neonGeo = new THREE.TorusGeometry(1.88, 0.035, 16, 64);
  const neonMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    emissive: new THREE.Color(accentColor),
    emissiveIntensity: 2.8,
    roughness: 0.2,
  });
  const neonMesh = new THREE.Mesh(neonGeo, neonMat);
  neonMesh.rotation.x = Math.PI / 2;
  neonMesh.position.y = 0.05;
  podiumGroup.add(neonMesh);

  // Soft contact shadow disc under podium
  const shadowGeo = new THREE.CircleGeometry(2.35, 32);
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 30, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
    gradient.addColorStop(0.6, 'rgba(0,0,0,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -0.21;
  podiumGroup.add(shadowMesh);

  return podiumGroup;
}

/**
 * 0. Systems & Software: Sleek High-End Workstation + Cortex Server Node & Precision Rust Gear
 */
export function createTerminalModel(): THREE.Group {
  const group = new THREE.Group();

  const titaniumDarkMat = new THREE.MeshStandardMaterial({
    color: 0x0c1017,
    roughness: 0.18,
    metalness: 0.92,
  });

  const aluminumStandMat = new THREE.MeshStandardMaterial({
    color: 0x1e2736,
    roughness: 0.22,
    metalness: 0.9,
  });

  const glassBezelMat = new THREE.MeshStandardMaterial({
    color: 0x020408,
    roughness: 0.08,
    metalness: 0.95,
  });

  // 1. Ultra-Thin OLED Monitor Chassis with Beveled Edges
  const monitorChassis = new THREE.Mesh(
    new RoundedBoxGeometry(2.35, 1.5, 0.12, 6, 0.035),
    titaniumDarkMat
  );
  monitorChassis.position.set(0, 1.28, 0);
  group.add(monitorChassis);

  // Monitor Tapered Rear Enclosure
  const rearHousing = new THREE.Mesh(
    new RoundedBoxGeometry(1.5, 0.95, 0.22, 5, 0.03),
    titaniumDarkMat
  );
  rearHousing.position.set(0, 1.28, -0.14);
  group.add(rearHousing);

  // Rear Ambient Wall-Wash RGB Light Ring
  const rearGlowGeo = new THREE.TorusGeometry(0.48, 0.02, 16, 48);
  const rearGlowMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.65,
  });
  const rearGlow = new THREE.Mesh(rearGlowGeo, rearGlowMat);
  rearGlow.position.set(0, 1.28, -0.26);
  group.add(rearGlow);

  // Rear Ventilation Grill Grooves
  for (let i = 0; i < 5; i++) {
    const ventMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.015, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x06090e })
    );
    ventMesh.position.set(0, 1.55 - i * 0.06, -0.255);
    group.add(ventMesh);
  }

  // Monitor Front Glass Frame
  const frontFrame = new THREE.Mesh(
    new RoundedBoxGeometry(2.28, 1.44, 0.02, 4, 0.02),
    glassBezelMat
  );
  frontFrame.position.set(0, 1.28, 0.062);
  group.add(frontFrame);

  // 2. Ultra-Sharp 1024x640 Procedural OLED Terminal Screen
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024;
  screenCanvas.height = 640;
  const sCtx = screenCanvas.getContext('2d');
  if (sCtx) {
    sCtx.fillStyle = '#05070c';
    sCtx.fillRect(0, 0, 1024, 640);

    // Phosphor scanlines
    sCtx.fillStyle = 'rgba(249, 115, 22, 0.035)';
    for (let y = 0; y < 640; y += 4) {
      sCtx.fillRect(0, y, 1024, 2);
    }

    // Header Bar
    sCtx.fillStyle = '#0d131f';
    sCtx.fillRect(0, 0, 1024, 52);

    // Window Controls
    const dots = [
      { x: 32, color: '#ff5f56' },
      { x: 58, color: '#ffbd2e' },
      { x: 84, color: '#27c93f' },
    ];
    dots.forEach((d) => {
      sCtx.fillStyle = d.color;
      sCtx.beginPath();
      sCtx.arc(d.x, 26, 7, 0, Math.PI * 2);
      sCtx.fill();
    });

    sCtx.font = 'bold 19px monospace';
    sCtx.fillStyle = '#94a3b8';
    sCtx.fillText('cortex-fs@systems: ~/runtime/engine [Rust 1.85]', 120, 33);

    // Status Pill
    sCtx.fillStyle = 'rgba(34, 197, 94, 0.18)';
    sCtx.roundRect(830, 12, 160, 28, 14);
    sCtx.fill();
    sCtx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
    sCtx.lineWidth = 1.5;
    sCtx.stroke();
    sCtx.fillStyle = '#4ade80';
    sCtx.font = 'bold 15px monospace';
    sCtx.fillText('● ENGINE ACTIVE', 845, 31);

    let lineY = 105;
    const drawLine = (text: string, color: string, bold = false, indent = 0) => {
      sCtx.font = `${bold ? 'bold ' : ''}21px monospace`;
      sCtx.fillStyle = color;
      sCtx.fillText(text, 36 + indent, lineY);
      lineY += 38;
    };

    drawLine('$ cargo build --release --target=x86_64-systems', '#f97316', true);
    drawLine('   Compiling cortex-core v2.4.0 (/kernel/cortex-core)', '#64748b');
    drawLine('   Compiling lockfree-tree v1.2.0 (lock-free concurrency)', '#64748b');
    drawLine('    Finished release [optimized + lto] in 1.42s', '#22c55e', true);
    lineY += 10;
    drawLine('$ ./target/release/cortex-daemon --bind=ipc://cortex.sock', '#f97316', true);
    drawLine('[INFO]  Spinning up lock-free memory ring buffer [128 MiB]', '#38bdf8');
    drawLine('[INFO]  7,204,192 B-Tree indices memory-mapped into RAM', '#4ade80');
    drawLine('⚡ Query latency: 0.084 ms  |  Throughput: 1.42M ops/sec', '#facc15', true);
    lineY += 12;

    sCtx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    sCtx.roundRect(32, lineY - 24, 960, 140, 8);
    sCtx.fill();
    sCtx.strokeStyle = 'rgba(249, 115, 22, 0.25)';
    sCtx.lineWidth = 1;
    sCtx.stroke();

    lineY += 6;
    drawLine('pub async fn execute_batch(ops: &[FileSystemOp]) -> Result<Metrics> {', '#fb923c', true, 16);
    drawLine('    let ctx = RingContext::acquire_zero_copy().await?;', '#e2e8f0', false, 48);
    drawLine('    let res = ctx.dispatch_lockfree(ops).timed()?;', '#38bdf8', false, 48);
    drawLine('    Ok(res) /* Sub-millisecond IPC roundtrip */ █', '#4ade80', true, 48);
  }

  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.minFilter = THREE.LinearFilter;
  screenTex.magFilter = THREE.LinearFilter;

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.18, 1.36),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  screenMesh.position.set(0, 1.28, 0.075);
  group.add(screenMesh);

  // 3. Ergonomic Aeronautics-Grade Stand
  const standArm = new THREE.Mesh(
    new RoundedBoxGeometry(0.18, 0.72, 0.16, 4, 0.03),
    aluminumStandMat
  );
  standArm.position.set(0, 0.52, -0.08);
  standArm.rotation.x = -0.15;
  group.add(standArm);

  const hinge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.24, 24),
    aluminumStandMat
  );
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, 0.88, -0.12);
  group.add(hinge);

  const standBase = new THREE.Mesh(
    new RoundedBoxGeometry(1.05, 0.05, 0.75, 4, 0.02),
    aluminumStandMat
  );
  standBase.position.set(0, 0.14, 0.08);
  group.add(standBase);

  // 4. Companion Unit: High-Performance "Cortex Node" Server Mini-Tower (Right Flank)
  const nodeGroup = new THREE.Group();
  nodeGroup.position.set(1.48, 0.65, 0.0);

  const nodeChassis = new THREE.Mesh(
    new RoundedBoxGeometry(0.46, 1.05, 0.75, 4, 0.03),
    titaniumDarkMat
  );
  nodeGroup.add(nodeChassis);

  for (let i = 0; i < 7; i++) {
    const vent = new THREE.Mesh(
      new RoundedBoxGeometry(0.015, 0.05, 0.55, 2, 0.005),
      new THREE.MeshBasicMaterial({ color: 0x05070c })
    );
    vent.position.set(0.232, 0.32 - i * 0.09, 0);
    nodeGroup.add(vent);
  }

  const ledGlowMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const ledMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 16), ledGlowMat);
  ledMesh.rotation.z = Math.PI / 2;
  ledMesh.position.set(0.233, 0.44, 0.26);
  nodeGroup.add(ledMesh);

  const badgeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.2,
  });
  const nodeBadge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 24), badgeMat);
  nodeBadge.rotation.z = Math.PI / 2;
  nodeBadge.position.set(0.233, 0.0, 0.0);
  nodeGroup.add(nodeBadge);

  const topMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.38, 0.62),
    new THREE.MeshStandardMaterial({
      color: 0x06090f,
      roughness: 0.8,
      metalness: 0.5,
    })
  );
  topMesh.rotation.x = -Math.PI / 2;
  topMesh.position.set(0, 0.53, 0);
  nodeGroup.add(topMesh);
  group.add(nodeGroup);

  // Braided Data Bus Cable
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.3, 0.22, 0.0),
    new THREE.Vector3(0.95, 0.14, 0.25),
    new THREE.Vector3(0.35, 0.16, 0.1),
    new THREE.Vector3(0.0, 0.48, -0.05),
  ]);
  const cableMesh = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 24, 0.022, 8, false),
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.7,
    })
  );
  group.add(cableMesh);

  // 5. Mechanical Keyboard
  const kbGroup = new THREE.Group();
  kbGroup.position.set(0, 0.14, 0.85);
  kbGroup.rotation.x = -0.08;

  const kbChassis = new THREE.Mesh(
    new RoundedBoxGeometry(1.68, 0.07, 0.68, 4, 0.02),
    titaniumDarkMat
  );
  kbGroup.add(kbChassis);

  const keybed = new THREE.Mesh(
    new RoundedBoxGeometry(1.58, 0.02, 0.58, 2, 0.01),
    new THREE.MeshStandardMaterial({ color: 0x080b12, roughness: 0.7 })
  );
  keybed.position.y = 0.032;
  kbGroup.add(keybed);

  const keyMat = new THREE.MeshStandardMaterial({
    color: 0x182030,
    roughness: 0.4,
    metalness: 0.5,
  });
  const accentKeyMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  });

  const spacebar = new THREE.Mesh(
    new RoundedBoxGeometry(0.58, 0.04, 0.09, 2, 0.015),
    accentKeyMat
  );
  spacebar.position.set(0, 0.055, 0.18);
  kbGroup.add(spacebar);

  const escKey = new THREE.Mesh(
    new RoundedBoxGeometry(0.09, 0.04, 0.09, 2, 0.015),
    accentKeyMat
  );
  escKey.position.set(-0.68, 0.055, -0.18);
  kbGroup.add(escKey);

  const enterKey = new THREE.Mesh(
    new RoundedBoxGeometry(0.16, 0.04, 0.09, 2, 0.015),
    accentKeyMat
  );
  enterKey.position.set(0.64, 0.055, 0.02);
  kbGroup.add(enterKey);

  for (let r = 0; r < 4; r++) {
    const rowZ = -0.18 + r * 0.1;
    const rowMesh = new THREE.Mesh(
      new RoundedBoxGeometry(1.36, 0.035, 0.08, 2, 0.01),
      keyMat
    );
    rowMesh.position.set(0, 0.05, rowZ);
    kbGroup.add(rowMesh);
  }
  group.add(kbGroup);

  // 6. Floating Precision-Milled Rust Cog / Holographic Architecture Badge
  const gearGroup = new THREE.Group();
  gearGroup.position.set(-1.42, 1.45, 0.15);

  const gearMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0x9a3412,
    emissiveIntensity: 0.6,
    metalness: 0.88,
    roughness: 0.22,
  });

  const gearHub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32), gearMat);
  gearHub.rotation.x = Math.PI / 2;
  gearGroup.add(gearHub);

  const innerCut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.07, 24),
    new THREE.MeshBasicMaterial({ color: 0x05070c })
  );
  innerCut.rotation.x = Math.PI / 2;
  gearGroup.add(innerCut);

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const tooth = new THREE.Mesh(
      new RoundedBoxGeometry(0.08, 0.14, 0.06, 2, 0.015),
      gearMat
    );
    tooth.position.set(Math.cos(angle) * 0.29, Math.sin(angle) * 0.29, 0);
    tooth.rotation.z = angle;
    gearGroup.add(tooth);
  }

  const holoRing = new THREE.Mesh(
    new THREE.RingGeometry(0.42, 0.44, 48),
    new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    })
  );
  gearGroup.add(holoRing);
  group.add(gearGroup);

  return group;
}

/**
 * 1. Game Development: Next-Gen Sculpted Console Gamepad with Beveled Grips, D-Pad, Dual Sticks, Illuminated Lightbar & Floating Diamond Trophy
 */
export function createGamepadModel(): THREE.Group {
  const group = new THREE.Group();

  // Premium Stealth Matte Finish (PS5 DualSense / Elite Controller Aesthetic)
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x111624,
    roughness: 0.26,
    metalness: 0.75,
  });

  const gripRubberMat = new THREE.MeshStandardMaterial({
    color: 0x0a0d16,
    roughness: 0.65,
    metalness: 0.3,
  });

  const darkAccentMat = new THREE.MeshStandardMaterial({
    color: 0x06080e,
    roughness: 0.35,
    metalness: 0.85,
  });

  const purpleNeonMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    emissive: 0xa855f7,
    emissiveIntensity: 2.8,
    roughness: 0.15,
  });

  // 1. Central Ergonomic Sculpted Body
  const centralBridge = new THREE.Mesh(
    new RoundedBoxGeometry(1.48, 0.88, 0.36, 6, 0.08),
    chassisMat
  );
  centralBridge.position.set(0, 0.96, 0.0);
  group.add(centralBridge);

  // 2. Sculpted Ergonomic Grips (Left & Right) with Tapered Curves
  [-1, 1].forEach((sign) => {
    const gripGroup = new THREE.Group();
    gripGroup.position.set(sign * 0.88, 0.68, 0.06);
    gripGroup.rotation.z = sign * 0.38;
    gripGroup.rotation.x = 0.18;

    // Upper grip barrel
    const upperGrip = new THREE.Mesh(
      new RoundedBoxGeometry(0.48, 0.85, 0.38, 5, 0.09),
      chassisMat
    );
    gripGroup.add(upperGrip);

    // Textured palm swell (inner textured grip panel)
    const palmSwell = new THREE.Mesh(
      new RoundedBoxGeometry(0.32, 0.65, 0.12, 4, 0.04),
      gripRubberMat
    );
    palmSwell.position.set(0, -0.05, -0.16);
    gripGroup.add(palmSwell);

    // Rounded ergonomic bottom horn cap
    const hornCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 24, 16),
      chassisMat
    );
    hornCap.position.set(0, -0.42, 0);
    gripGroup.add(hornCap);

    group.add(gripGroup);
  });

  // 3. Central Touchpad Surface (Beveled with micro-accent border)
  const touchpad = new THREE.Mesh(
    new RoundedBoxGeometry(0.72, 0.48, 0.05, 4, 0.02),
    darkAccentMat
  );
  touchpad.position.set(0, 1.08, 0.18);
  group.add(touchpad);

  // Surrounding Neon Accent Lightbar around Touchpad
  const lightbarTop = new THREE.Mesh(
    new RoundedBoxGeometry(0.78, 0.045, 0.03, 2, 0.01),
    purpleNeonMat
  );
  lightbarTop.position.set(0, 1.34, 0.18);
  group.add(lightbarTop);

  // 4. Directional D-Pad (Left side) with Precision Sculpted Cross
  const dpadGroup = new THREE.Group();
  dpadGroup.position.set(-0.52, 1.02, 0.19);

  const dpadBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.04, 32),
    darkAccentMat
  );
  dpadBase.rotation.x = Math.PI / 2;
  dpadGroup.add(dpadBase);

  const dpadH = new THREE.Mesh(
    new RoundedBoxGeometry(0.42, 0.14, 0.07, 3, 0.015),
    chassisMat
  );
  const dpadV = new THREE.Mesh(
    new RoundedBoxGeometry(0.14, 0.42, 0.07, 3, 0.015),
    chassisMat
  );
  dpadGroup.add(dpadH);
  dpadGroup.add(dpadV);
  group.add(dpadGroup);

  // 5. Dual Analog Sticks with Knurled Rubber Caps & Chrome Rings
  const stickColMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.95,
    roughness: 0.15,
  });
  const stickCapRubber = new THREE.MeshStandardMaterial({
    color: 0x080a10,
    roughness: 0.75,
  });

  [-0.34, 0.34].forEach((posX) => {
    const stickGroup = new THREE.Group();
    stickGroup.position.set(posX, 0.68, 0.2);

    // Chrome spherical gimbal ball socket
    const gimbal = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), stickColMat);
    stickGroup.add(gimbal);

    // Shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16),
      stickColMat
    );
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = 0.08;
    stickGroup.add(shaft);

    // Concave thumbpad cap
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.18, 0.06, 28),
      stickCapRubber
    );
    cap.rotation.x = Math.PI / 2;
    cap.position.z = 0.15;
    stickGroup.add(cap);

    // Illuminated ring under cap
    const stickRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.015, 12, 32),
      purpleNeonMat
    );
    stickRing.position.z = 0.12;
    stickGroup.add(stickRing);

    group.add(stickGroup);
  });

  // 6. Action Face Buttons (Right side - Triangle, Circle, Cross, Square)
  const buttonGroup = new THREE.Group();
  buttonGroup.position.set(0.52, 1.02, 0.19);

  const btnDefs = [
    { x: 0, y: 0.16, color: 0x38bdf8 },  // Y / Triangle (Cyan)
    { x: 0.16, y: 0, color: 0xf43f5e },  // B / Circle (Red/Pink)
    { x: 0, y: -0.16, color: 0x4ade80 }, // A / Cross (Green)
    { x: -0.16, y: 0, color: 0xfbbf24 }, // X / Square (Amber)
  ];

  btnDefs.forEach((b) => {
    const bMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.05, 20),
      new THREE.MeshStandardMaterial({
        color: b.color,
        emissive: b.color,
        emissiveIntensity: 1.4,
        roughness: 0.15,
      })
    );
    bMesh.rotation.x = Math.PI / 2;
    bMesh.position.set(b.x, b.y, 0.025);
    buttonGroup.add(bMesh);
  });
  group.add(buttonGroup);

  // 7. Bumpers (L1/R1) & Curved Ergonomic Triggers (L2/R2)
  [-1, 1].forEach((sign) => {
    // Bumper
    const bumper = new THREE.Mesh(
      new RoundedBoxGeometry(0.48, 0.14, 0.22, 3, 0.03),
      darkAccentMat
    );
    bumper.position.set(sign * 0.62, 1.38, -0.04);
    bumper.rotation.z = sign * 0.14;
    group.add(bumper);

    // Trigger
    const trigger = new THREE.Mesh(
      new RoundedBoxGeometry(0.38, 0.24, 0.24, 3, 0.04),
      chassisMat
    );
    trigger.position.set(sign * 0.62, 1.48, -0.22);
    trigger.rotation.x = -0.32;
    trigger.rotation.z = sign * 0.14;
    group.add(trigger);
  });

  // 8. Floating Holographic Game Engine Trophy / Polyhedron (Left Flank)
  const trophyGroup = new THREE.Group();
  trophyGroup.position.set(-1.42, 1.38, 0.1);

  const icosahedronGeo = new THREE.IcosahedronGeometry(0.26, 0);
  const trophyMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    emissive: 0x9333ea,
    emissiveIntensity: 1.1,
    roughness: 0.15,
    metalness: 0.9,
    wireframe: false,
  });
  const trophyMesh = new THREE.Mesh(icosahedronGeo, trophyMat);
  trophyGroup.add(trophyMesh);

  // Wireframe outline over trophy
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xf3e8ff, wireframe: true });
  const wireMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.268, 0), wireMat);
  trophyGroup.add(wireMesh);

  // Rotating outer holographic orbit ring
  const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.015, 12, 48),
    new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.5,
    })
  );
  orbitRing.rotation.x = Math.PI / 3;
  trophyGroup.add(orbitRing);
  group.add(trophyGroup);

  // Angle the entire controller gracefully toward camera
  group.rotation.x = -0.36;
  return group;
}

/**
 * 2. 3D & Visual Atelier: Digital Drawing Tablet + Ultra-Sharp Concept Art + Sculpted Pro Stylus & Holographic Palette
 */
export function createTabletModel(): THREE.Group {
  const group = new THREE.Group();

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x0c111a,
    roughness: 0.2,
    metalness: 0.9,
  });

  const standMat = new THREE.MeshStandardMaterial({
    color: 0x1a2332,
    roughness: 0.25,
    metalness: 0.85,
  });

  // 1. Tablet Body (Beveled CNC Aluminum Slab)
  const tablet = new THREE.Mesh(
    new RoundedBoxGeometry(2.52, 1.74, 0.12, 5, 0.035),
    chassisMat
  );
  tablet.position.set(0, 0.96, 0.05);
  tablet.rotation.x = -0.32; // Leaned back comfortably towards the viewer
  group.add(tablet);

  // 2. Heavy Chamfered Kickstand
  const kickstand = new THREE.Mesh(
    new RoundedBoxGeometry(1.3, 0.88, 0.06, 3, 0.015),
    standMat
  );
  kickstand.position.set(0, 0.52, -0.35);
  kickstand.rotation.x = 0.38;
  group.add(kickstand);

  // 3. High-DPI 1024x720 OLED Digital Art Canvas
  const artCanvas = document.createElement('canvas');
  artCanvas.width = 1024;
  artCanvas.height = 720;
  const aCtx = artCanvas.getContext('2d');
  if (aCtx) {
    // Dark creative workspace background
    aCtx.fillStyle = '#060d13';
    aCtx.fillRect(0, 0, 1024, 720);

    // Fine grid
    aCtx.strokeStyle = 'rgba(45, 212, 191, 0.08)';
    aCtx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 40) {
      aCtx.beginPath();
      aCtx.moveTo(x, 0);
      aCtx.lineTo(x, 720);
      aCtx.stroke();
    }
    for (let y = 0; y < 720; y += 40) {
      aCtx.beginPath();
      aCtx.moveTo(0, y);
      aCtx.lineTo(1024, y);
      aCtx.stroke();
    }

    // Top UI toolbar
    aCtx.fillStyle = '#0b161e';
    aCtx.fillRect(0, 0, 1024, 48);

    aCtx.font = 'bold 18px monospace';
    aCtx.fillStyle = '#2dd4bf';
    aCtx.fillText('ATELIER CANVAS 4K — Shader Graph & Concept Sculpt', 28, 31);

    aCtx.fillStyle = 'rgba(45, 212, 191, 0.2)';
    aCtx.roundRect(850, 10, 145, 28, 14);
    aCtx.fill();
    aCtx.font = 'bold 14px monospace';
    aCtx.fillStyle = '#5eead4';
    aCtx.fillText('● 120 FPS PEN', 870, 29);

    // Central Radiant Concept Artwork Silhouette & Neon Curves
    const grad = aCtx.createLinearGradient(120, 100, 880, 600);
    grad.addColorStop(0, '#2dd4bf');
    grad.addColorStop(0.35, '#06b6d4');
    grad.addColorStop(0.7, '#8b5cf6');
    grad.addColorStop(1, '#ec4899');

    aCtx.strokeStyle = grad;
    aCtx.lineWidth = 9;
    aCtx.lineCap = 'round';
    aCtx.beginPath();
    aCtx.moveTo(180, 520);
    aCtx.bezierCurveTo(240, 220, 520, 140, 780, 320);
    aCtx.bezierCurveTo(920, 440, 680, 590, 440, 480);
    aCtx.bezierCurveTo(280, 400, 360, 260, 560, 290);
    aCtx.stroke();

    // Fine white speculative highlight strokes
    aCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    aCtx.lineWidth = 3.5;
    aCtx.beginPath();
    aCtx.moveTo(240, 470);
    aCtx.bezierCurveTo(300, 260, 540, 190, 740, 330);
    aCtx.stroke();

    // Secondary cybernetic geometric nodes
    const nodes = [
      { x: 320, y: 340, r: 8, c: '#2dd4bf' },
      { x: 520, y: 220, r: 12, c: '#06b6d4' },
      { x: 740, y: 330, r: 9, c: '#a855f7' },
      { x: 440, y: 480, r: 10, c: '#ec4899' },
    ];
    nodes.forEach((n) => {
      aCtx.fillStyle = n.c;
      aCtx.beginPath();
      aCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      aCtx.fill();
      aCtx.strokeStyle = '#ffffff';
      aCtx.lineWidth = 2;
      aCtx.stroke();
    });

    // Right-Side Creative Color Palette Chips
    const chips = ['#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f43f5e', '#fbbf24', '#ffffff'];
    chips.forEach((c, i) => {
      aCtx.fillStyle = c;
      aCtx.beginPath();
      aCtx.arc(960, 120 + i * 62, 16, 0, Math.PI * 2);
      aCtx.fill();
      aCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      aCtx.lineWidth = 2;
      aCtx.stroke();
    });
  }

  const artTex = new THREE.CanvasTexture(artCanvas);
  artTex.minFilter = THREE.LinearFilter;
  artTex.magFilter = THREE.LinearFilter;

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.92, 1.42),
    new THREE.MeshBasicMaterial({ map: artTex })
  );
  screen.position.set(0.19, 0, 0.065);
  tablet.add(screen);

  // 4. ExpressKey Strip on Left Flank
  const stripMat = new THREE.MeshStandardMaterial({
    color: 0x080c12,
    roughness: 0.5,
    metalness: 0.7,
  });
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf,
    emissive: 0x0d9488,
    emissiveIntensity: 1.8,
    roughness: 0.2,
  });

  // Touch Ring Dial
  const touchDial = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.038, 16, 36), ringMat);
  touchDial.position.set(-0.95, 0.28, 0.07);
  tablet.add(touchDial);

  const dialCenter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.03, 24),
    stripMat
  );
  dialCenter.rotation.x = Math.PI / 2;
  dialCenter.position.set(-0.95, 0.28, 0.07);
  tablet.add(dialCenter);

  // 4 Express Keys
  for (let i = 0; i < 4; i++) {
    const btn = new THREE.Mesh(
      new RoundedBoxGeometry(0.24, 0.09, 0.03, 2, 0.01),
      stripMat
    );
    btn.position.set(-0.95, -0.06 - i * 0.14, 0.07);
    tablet.add(btn);
  }

  // 5. Professional Stylus Pen Hovering in Active Drawing Pose
  const penGroup = new THREE.Group();
  penGroup.position.set(0.48, 0.12, 0.24);
  penGroup.rotation.set(0.14, 0.18, -0.52);

  // Barrel
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 1.35, 24),
    new THREE.MeshStandardMaterial({ color: 0x161e28, roughness: 0.25, metalness: 0.85 })
  );
  penGroup.add(barrel);

  // Ergonomic Rubber Grip
  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.054, 0.054, 0.44, 24),
    new THREE.MeshStandardMaterial({ color: 0x090c10, roughness: 0.8 })
  );
  grip.position.y = -0.32;
  penGroup.add(grip);

  // Metallic Dual Rocker Switch
  const rocker = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.18, 0.04, 2, 0.01), ringMat);
  rocker.position.set(0, -0.3, 0.06);
  penGroup.add(rocker);

  // Fine Tapered Drawing Nib
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18, 24), ringMat);
  tip.rotation.x = Math.PI;
  tip.position.y = -0.62;
  penGroup.add(tip);

  // Eraser Cap
  const eraser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.045, 0.14, 24),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35 })
  );
  eraser.position.y = 0.72;
  penGroup.add(eraser);
  tablet.add(penGroup);

  // 6. Floating Holographic Color Wheel / Palette Disc (Left Flank)
  const wheelGroup = new THREE.Group();
  wheelGroup.position.set(-1.45, 1.42, 0.15);

  const wheelGeo = new THREE.RingGeometry(0.14, 0.38, 48);
  const wheelCanvas = document.createElement('canvas');
  wheelCanvas.width = 256;
  wheelCanvas.height = 256;
  const wCtx = wheelCanvas.getContext('2d');
  if (wCtx) {
    const cx = 128, cy = 128;
    for (let angle = 0; angle < 360; angle += 2) {
      const rad = (angle * Math.PI) / 180;
      wCtx.beginPath();
      wCtx.moveTo(cx, cy);
      wCtx.arc(cx, cy, 120, rad, rad + 0.04);
      wCtx.closePath();
      wCtx.fillStyle = `hsl(${angle}, 90%, 55%)`;
      wCtx.fill();
    }
  }
  const wheelTex = new THREE.CanvasTexture(wheelCanvas);
  const wheelMesh = new THREE.Mesh(
    wheelGeo,
    new THREE.MeshBasicMaterial({ map: wheelTex, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  wheelGroup.add(wheelMesh);
  group.add(wheelGroup);

  return group;
}

/**
 * 3. Athletics & Endurance: Classic Match Football (Soccer Ball - Telstar Inspired)
 * Features smaller, crisp hexagons (30 compact white hexagons) and 12 black pentagons
 * with realistic embossed leather seams and inflated panel cushion bump mapping,
 * resting on a sculpted chrome ball-stand with companion speedcube (with no outer halo rings).
 */
export function createRunningShoesModel(): THREE.Group {
  const group = new THREE.Group();

  // Width & height of equirectangular soccer ball map
  const width = 1024;
  const height = 512;

  // 1. 12 Pentagon Centers (Icosahedron Vertices)
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawIco: [number, number, number][] = [
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1],
  ];

  const pentX = new Float32Array(12);
  const pentY = new Float32Array(12);
  const pentZ = new Float32Array(12);
  rawIco.forEach(([x, y, z], i) => {
    const len = Math.hypot(x, y, z);
    pentX[i] = x / len;
    pentY[i] = y / len;
    pentZ[i] = z / len;
  });

  // 2. 20 Hexagon Centers (Icosahedron 20 Face Centroids)
  // Placing hexagons at the 20 face centers creates the exact Archimedean Truncated Icosahedron,
  // ensuring every single hexagon has 6 completely equal-length sides.
  const hexX = new Float32Array(20);
  const hexY = new Float32Array(20);
  const hexZ = new Float32Array(20);
  let hIdx = 0;
  for (let i = 0; i < 12; i++) {
    for (let j = i + 1; j < 12; j++) {
      const dotIJ = pentX[i] * pentX[j] + pentY[i] * pentY[j] + pentZ[i] * pentZ[j];
      if (dotIJ > 0.4) {
        for (let k = j + 1; k < 12; k++) {
          const dotIK = pentX[i] * pentX[k] + pentY[i] * pentY[k] + pentZ[i] * pentZ[k];
          const dotJK = pentX[j] * pentX[k] + pentY[j] * pentY[k] + pentZ[j] * pentZ[k];
          if (dotIK > 0.4 && dotJK > 0.4 && hIdx < 20) {
            const mx = pentX[i] + pentX[j] + pentX[k];
            const my = pentY[i] + pentY[j] + pentY[k];
            const mz = pentZ[i] + pentZ[j] + pentZ[k];
            const mlen = Math.hypot(mx, my, mz);
            hexX[hIdx] = mx / mlen;
            hexY[hIdx] = my / mlen;
            hexZ[hIdx] = mz / mlen;
            hIdx++;
          }
        }
      }
    }
  }

  // Precomputed Trigonometric Lookup Arrays for 1024x512 equirectangular projection
  const cosLat = new Float32Array(height);
  const sinLat = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    const lat = (1 - y / height) * Math.PI - Math.PI / 2;
    cosLat[y] = Math.cos(lat);
    sinLat[y] = Math.sin(lat);
  }

  const cosLon = new Float32Array(width);
  const sinLon = new Float32Array(width);
  for (let x = 0; x < width; x++) {
    const lon = (x / width) * Math.PI * 2 - Math.PI;
    cosLon[x] = Math.cos(lon);
    sinLon[x] = Math.sin(lon);
  }

  // Angular distance scaling factor so incircles of regular pentagons and hexagons touch with equal edges
  const INV_R_PENT = 3.478; // 1 / 0.2875 rad
  const INV_R_HEX = 2.740;  // 1 / 0.3649 rad

  // 3. Render High-Resolution Procedural Truncated Soccer Ball Textures
  const vCanvas = document.createElement('canvas');
  vCanvas.width = width;
  vCanvas.height = height;
  const ctx = vCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d');

  if (ctx && bCtx) {
    const imgData = ctx.createImageData(width, height);
    const bumpData = bCtx.createImageData(width, height);
    const pixels = imgData.data;
    const bPixels = bumpData.data;

    let pIdx = 0;
    for (let y = 0; y < height; y++) {
      const cl = cosLat[y];
      const sl = sinLat[y];

      for (let x = 0; x < width; x++) {
        const px = cl * sinLon[x];
        const py = sl;
        const pz = cl * cosLon[x];

        // Find closest among 12 Pentagons
        let maxPent = -1;
        for (let i = 0; i < 12; i++) {
          const dot = px * pentX[i] + py * pentY[i] + pz * pentZ[i];
          if (dot > maxPent) maxPent = dot;
        }

        // Find top 2 closest among 20 Hexagons
        let maxHex1 = -1;
        let maxHex2 = -1;
        for (let j = 0; j < 20; j++) {
          const dot = px * hexX[j] + py * hexY[j] + pz * hexZ[j];
          if (dot > maxHex1) {
            maxHex2 = maxHex1;
            maxHex1 = dot;
          } else if (dot > maxHex2) {
            maxHex2 = dot;
          }
        }

        const aPent = Math.acos(Math.min(1, Math.max(-1, maxPent)));
        const aHex1 = Math.acos(Math.min(1, Math.max(-1, maxHex1)));
        const aHex2 = Math.acos(Math.min(1, Math.max(-1, maxHex2)));

        const uPent = aPent * INV_R_PENT;
        const uHex1 = aHex1 * INV_R_HEX;
        const uHex2 = aHex2 * INV_R_HEX;

        const isPentagon = uPent < uHex1;
        let diff: number;
        if (isPentagon) {
          diff = (uHex1 - uPent) * 0.2875;
        } else {
          const secondU = Math.min(uPent, uHex2);
          diff = (secondU - uHex1) * 0.3649;
        }

        // Subtle micro-leather grain noise
        const grain = ((x ^ (y * 3)) % 7) * 1.2;

        if (diff < 0.014) {
          // Deep embossed recessed seam trench
          pixels[pIdx] = 18;
          pixels[pIdx + 1] = 20;
          pixels[pIdx + 2] = 26;
          pixels[pIdx + 3] = 255;

          bPixels[pIdx] = 22;
          bPixels[pIdx + 1] = 22;
          bPixels[pIdx + 2] = 22;
          bPixels[pIdx + 3] = 255;
        } else if (diff < 0.028) {
          // Panel bevel transition roll
          const blend = (diff - 0.014) / 0.014;
          const bumpVal = Math.round(30 + blend * 170);

          if (isPentagon) {
            const c = Math.round(20 + blend * 12 + grain);
            pixels[pIdx] = c;
            pixels[pIdx + 1] = c + 1;
            pixels[pIdx + 2] = c + 4;
          } else {
            const c = Math.round(195 + blend * 58 + grain);
            pixels[pIdx] = c;
            pixels[pIdx + 1] = c;
            pixels[pIdx + 2] = c + 2;
          }
          pixels[pIdx + 3] = 255;

          bPixels[pIdx] = bumpVal;
          bPixels[pIdx + 1] = bumpVal;
          bPixels[pIdx + 2] = bumpVal;
          bPixels[pIdx + 3] = 255;
        } else {
          // Inflated leather panel cushion with convex pillowed puff
          const puff = Math.min(1.0, (diff - 0.028) / 0.045);
          const bumpVal = Math.round(205 + puff * 50);

          if (isPentagon) {
            // Iconic Onyx Black Pentagon
            const c = Math.round(24 + grain);
            pixels[pIdx] = c;
            pixels[pIdx + 1] = c + 2;
            pixels[pIdx + 2] = c + 5;
          } else {
            // Equal-Sided Crisp White Regular Hexagon
            const c = Math.round(252 - (1 - puff) * 6 + grain);
            pixels[pIdx] = c;
            pixels[pIdx + 1] = c;
            pixels[pIdx + 2] = c + 2;
          }
          pixels[pIdx + 3] = 255;

          bPixels[pIdx] = bumpVal;
          bPixels[pIdx + 1] = bumpVal;
          bPixels[pIdx + 2] = bumpVal;
          bPixels[pIdx + 3] = 255;
        }

        pIdx += 4;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    bCtx.putImageData(bumpData, 0, 0);

    // Authentic Gold Specification Stamp on Front Hexagon Panel
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MATCH PRO', 571, 252);
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#b45309';
    ctx.fillText('OFFICIAL SIZE 5', 571, 270);
  }

  const ballTexture = new THREE.CanvasTexture(vCanvas);
  ballTexture.wrapS = THREE.RepeatWrapping;
  ballTexture.wrapT = THREE.ClampToEdgeWrapping;

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;

  // High-poly sphere for smooth soccer ball silhouette
  const ballGeo = new THREE.SphereGeometry(0.88, 64, 48);
  const ballMat = new THREE.MeshStandardMaterial({
    map: ballTexture,
    bumpMap: bumpTexture,
    bumpScale: 0.045,
    roughness: 0.38,
    metalness: 0.06,
  });

  const football = new THREE.Mesh(ballGeo, ballMat);
  football.position.set(0, 0.98, 0.0);
  football.rotation.set(0.42, -0.68, 0.18); // Dynamic classic 3/4 presentation angle
  group.add(football);

  // Chrome display ring stand on the podium
  const standGroup = new THREE.Group();
  standGroup.position.set(0, 0.12, 0);

  const standRingMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.95,
    roughness: 0.15,
  });

  const standRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.045, 16, 48),
    standRingMat
  );
  standRing.rotation.x = Math.PI / 2;
  standGroup.add(standRing);

  // 3 Triangular support prongs holding the ball securely
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const prong = new THREE.Mesh(
      new RoundedBoxGeometry(0.06, 0.16, 0.06, 2, 0.01),
      standRingMat
    );
    prong.position.set(Math.cos(angle) * 0.52, 0.06, Math.sin(angle) * 0.52);
    prong.rotation.y = -angle;
    standGroup.add(prong);
  }
  group.add(standGroup);

  // Companion Floating Speedcube (CFOP Competition Rubik's Cube) - Clean, ring-free
  const cubeGroup = new THREE.Group();
  cubeGroup.position.set(1.18, 1.45, 0.1);
  cubeGroup.rotation.set(0.38, 0.52, 0.22);

  const cubeCore = new THREE.Mesh(
    new RoundedBoxGeometry(0.42, 0.42, 0.42, 3, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x090c12, roughness: 0.35 })
  );
  cubeGroup.add(cubeCore);

  const faceColors = [
    { dir: 'x+', col: 0xef4444 }, // Red
    { dir: 'x-', col: 0xf97316 }, // Orange
    { dir: 'y+', col: 0xffffff }, // White
    { dir: 'y-', col: 0xeab308 }, // Yellow
    { dir: 'z+', col: 0x0284c7 }, // Blue
    { dir: 'z-', col: 0x22c55e }, // Green
  ];

  faceColors.forEach((face) => {
    for (let u = -1; u <= 1; u++) {
      for (let v = -1; v <= 1; v++) {
        const tile = new THREE.Mesh(
          new RoundedBoxGeometry(0.12, 0.12, 0.012, 2, 0.008),
          new THREE.MeshStandardMaterial({
            color: face.col,
            roughness: 0.25,
            metalness: 0.08,
          })
        );
        if (face.dir === 'x+') {
          tile.rotation.y = Math.PI / 2;
          tile.position.set(0.218, u * 0.134, v * 0.134);
        } else if (face.dir === 'x-') {
          tile.rotation.y = -Math.PI / 2;
          tile.position.set(-0.218, u * 0.134, v * 0.134);
        } else if (face.dir === 'y+') {
          tile.rotation.x = -Math.PI / 2;
          tile.position.set(u * 0.134, 0.218, v * 0.134);
        } else if (face.dir === 'y-') {
          tile.rotation.x = Math.PI / 2;
          tile.position.set(u * 0.134, -0.218, v * 0.134);
        } else if (face.dir === 'z+') {
          tile.position.set(u * 0.134, v * 0.134, 0.218);
        } else if (face.dir === 'z-') {
          tile.rotation.y = Math.PI;
          tile.position.set(u * 0.134, v * 0.134, -0.218);
        }
        cubeGroup.add(tile);
      }
    }
  });

  group.add(cubeGroup);

  return group;
}

export const createFootballModel = createRunningShoesModel;
