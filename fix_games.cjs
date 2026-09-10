const fs = require('fs');

// Fix portfolioData.ts
let data = fs.readFileSync('src/data/portfolioData.ts', 'utf-8');

data = data.replace(
  /title:\s*'Procedural Animation: Centipedes & Spider',\s*tagline:[\s\S]*?engine:\s*'Unity 6',/g,
  (match) => match.replace("engine: 'Unity 6'", "engine: 'Unity 2023'")
);

data = data.replace(
  /title:\s*'Pixel Perfect Camera & Dynamic Weather',\s*tagline:[\s\S]*?engine:\s*'Godot 4',/g,
  (match) => match.replace("engine: 'Godot 4'", "engine: 'Unity 2023'")
);

data = data.replace(
  /title:\s*'Umbra: Procedural Arm',\s*tagline:[\s\S]*?engine:\s*'Unity 6',/g,
  (match) => match.replace("engine: 'Unity 6'", "engine: 'Unity 2023'")
);

data = data.replace(
  /title:\s*'Vae-Mond: Shadow Exchange',\s*tagline:[\s\S]*?engine:\s*'Godot 4',/g,
  (match) => match.replace("engine: 'Godot 4'", "engine: 'Unity 6'")
);

fs.writeFileSync('src/data/portfolioData.ts', data);
console.log('Fixed portfolioData.ts engines');

// Fix GameSection.tsx filters and features
let section = fs.readFileSync('src/components/GameSection.tsx', 'utf-8');

section = section.replace(
  /const engines = \['All', 'Unreal Engine 5', 'Unity 6', 'Bevy \(Rust\)', 'Godot 4'\];/,
  "const engines = ['All', 'Unity 2023', 'Unity 6'];"
);

section = section.replace("WebGL & Embedded Web Frames", "Inverse Kinematics & Locomotion");
section = section.replace("Interactive Builds", "Procedural Animation");

section = section.replace("Custom Shaders, PBR & Post-FX", "Pixel-Perfect Tracking & Shaders");
section = section.replace("Graphics Pipeline", "Custom Rendering");

section = section.replace("Rust ECS & Deterministic Physics", "Spatial Puzzles & Physics");
section = section.replace("Engine Mechanics", "Game Mechanics");

fs.writeFileSync('src/components/GameSection.tsx', section);
console.log('Fixed GameSection.tsx');

// Fix HeroSection.tsx
let hero = fs.readFileSync('src/components/HeroSection.tsx', 'utf-8');
hero = hero.replace("Unreal Engine 5, Unity 6 & Custom Bevy ECS", "Unity 2023, Unity 6 & Procedural Animation");
fs.writeFileSync('src/components/HeroSection.tsx', hero);
console.log('Fixed HeroSection.tsx');

