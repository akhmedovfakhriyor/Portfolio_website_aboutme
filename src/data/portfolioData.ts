import { GameProject, Artwork } from '../types';

export const PERSONAL_INFO = {
  name: 'Fakhriyor Akhmedov',
  email: 'akhmedovfakhriyor@gmail.com',
  location: 'Astana, UTC+5 • Remote Worldwide',
  titles: [
    'Systems & Software Engineer',
    'Indie Game Developer',
    '3D & Concept Artist',
    'Life enjoyer',
  ],
  bio: 'Bridging the gap between low-level systems, game mechanics, visual aesthetics, and physical endurance. I treat code as architecture, game development as narrative sculpture, and athletics as cognitive discipline.',
  socials: {
    github: 'https://github.com/akhmedovfakhriyor',
    linkedin: 'https://www.linkedin.com/in/fakhriyor-akhmedov-457181362',
    cara: 'https://cara.app/sofar',
    instagram: 'https://www.instagram.com/3_sofar_3?stkn=MTdvc2ZwMW5ia3J4dw==',
    leetcode: 'https://leetcode.com/u/s0Far/',
    strava: 'https://strava.app.link/NLloluISj6b',
  },
  stats: {
    githubCommits: '0',
    githubStars: '0',
    leetcodeSolved: '0',
    leetcodeRating: 'Problem Solver',
    marathonPB: '15 km (5:20 / km)',
    speedcubePB: '17.42s (3x3)',
  }
};

export const TECH_STACK = [
  { name: 'Rust', category: 'Systems', level: 'Advanced', icon: 'Cpu' },
  { name: 'Unreal Engine 5', category: 'Game Dev', level: 'Intermediate', icon: 'Gamepad2' },
  { name: 'Unity', category: 'Game Dev', level: 'Advanced', icon: 'Sparkles' },
  { name: 'Blender', category: '3D Art', level: 'Proficient', icon: 'Palette' },
  { name: 'C#', category: 'Languages', level: 'Proficient', icon: 'Code' },
  { name: 'Git', category: 'DevOps', level: 'Advanced', icon: 'Terminal' },
];

export const RUST_PROJECT_CODE = {
  'src/main.rs': `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::Path, sync::Mutex};
use rusqlite::{Connection, Result};
use tauri::State;
use walkdir::WalkDir;

// --- Snippet: Tauri IPC Commands ---

#[tauri::command]
fn list_children(db: State<DbConnection>, dir: String) -> Result<Vec<FileMeta>, Error> {
    let conn = db.0.lock().map_err(|_| Error::MutexPoison)?;
    let like_pattern = format!("{}\%", dir.trim_end_matches('\').replace("\", "\\"));
    
    let mut stmt = conn.prepare(
        "SELECT name, path, extension, size, modified 
         FROM main_table 
         WHERE path LIKE ?1 ESCAPE '\'"
    )?;
    
    let rows = stmt.query_map(rusqlite::params![like_pattern], |row| {
        Ok(FileMeta {
            name: row.get(0)?,
            path: row.get(1)?,
            extension: row.get(2)?,
            size: row.get(3)?,
            modified: row.get(4)?,
        })
    })?;
    
    Ok(rows.filter_map(Result::ok).collect())
}

#[tauri::command]
fn search_files(db: State<DbConnection>, name: String, extension: String) -> Result<Vec<FileMeta>, Error> {
    let conn = db.0.lock().map_err(|_| Error::MutexPoison)?;
    // ... [Database search logic omitted for brevity] ...
    Ok(vec![]) 
}

#[tauri::command]
fn open_file(path: String) -> Result<(), Error> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(&["/C", "start", "", &path])
            .creation_flags(0x08000000)
            .spawn()
            .map_err(|e| Error::Io(e))?;
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // ... [Database initialization omitted] ...
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_children,
            search_files,
            open_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}`,
  'Cargo.toml': `[dependencies]
serde_json = "1.0"
serde = { version = "1.0", features = ["derive"] }
tauri = { version = "1.5", features = ["shell-open"] }
rusqlite = { version = "0.29.0", features = ["bundled"] }
walkdir = "2.3.3"
opener = "0.6.1"`,
  'FileExplorer.jsx': `// src/components/FileExplorer.jsx
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
// ... [MUI imports omitted] ...

const FileExplorer = () => {
  const [currentDir, setCurrentDir] = useState('C:\');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadDirectory(currentDir);
  }, [currentDir]);

  const loadDirectory = async (path) => {
    try {
      const result = await invoke('list_children', { dir: path });
      setFiles(result);
    } catch (error) {
      console.error('Error loading directory:', error);
    }
  };

  const handleFileClick = async (file) => {
    if (!file.extension) {
      setCurrentDir(file.path);
    } else {
      await invoke('open_file', { path: file.path });
    }
  };

  return (
    <div className="file-explorer-container">
      {/* ... [Render Logic Omitted] ... */}
    </div>
  );
};

export default FileExplorer;`
};



export const GAME_PROJECTS: GameProject[] = [
  {
    id: 'procedural-creatures',
    title: 'Procedural Animation: Centipedes & Spider',
    tagline: 'Multi-legged procedural locomotion, inverse kinematics gait cycles, and terrain adaptation.',
    genre: ['Procedural Animation', 'IK Gait', 'Physics'],
    engine: 'Unity 2023',
    year: '2024',
    status: 'Finished Diploma work',
    description: 'A deep exploration of procedural animation for complex multi-legged creatures, featuring dynamic inverse kinematics foot-stepping algorithms, spine ripple propagation for centipedes, and adaptive stance calculation over non-planar rocky terrain.',
    myRole: 'Lead Programmer & Technical Artist',
    technicalChallenges: [
      'Engineered a deterministic Raycast IK foot placement solver calculating ray hits against dynamic terrain topography.',
      'Constructed Verlet spine segment constraints that realistically propagate rotational torque down the centipede body.',
      'Implemented dynamic gait cycle orchestration allowing realistic transitions between walking, trotting, and climbing states.',
    ],
    features: [
      'Raycast-driven inverse kinematics with dynamic ray stepping cycles',
      'Realistic spine ripple physics propagation for centipede segment chains',
      'Spider adaptive stance and multi-limb coordination algorithms',
      'High-performance 60fps execution on dense physics colliders',
    ],
    thumbnail: '/assets/media/game-1-procedural/5208829628586336426.webp',
    previewGif: '/assets/media/game-1-procedural/5211081428400020515.webp',
    banner: '/assets/media/game-1-procedural/5208829628586336426.webp',
    screenshots: [
      '/assets/media/game-1-procedural/5208829628586336426.webp',
      '/assets/media/game-1-procedural/5211081428400020515.webp',
      '/assets/media/game-1-procedural/5211081428400020508.webp',
    ],
    webglPlayable: false,
    repoUrl: 'https://github.com/akhmedovfakhriyor/Procedural_animation_4legs',
  },
  {
    id: 'pixel-perfect-weather',
    title: 'Pixel Perfect Camera & Dynamic Weather',
    tagline: 'Crisp sub-pixel camera tracking paired with custom GPU weather particles and ambient shaders.',
    genre: ['Pixel Art', 'Shaders', 'Environment'],
    engine: 'Unity 2023',
    year: '2024',
    status: 'Mechanic prototype',
    description: 'An advanced 2D rendering pipeline focusing on true pixel-perfect camera tracking without jitter or sub-pixel artifacting, coupled with an interactive multi-layered weather engine generating rain, fog volumetric lighting, and wind-blown atmospheric particles.',
    myRole: 'Graphics & Engine Programmer',
    technicalChallenges: [
      'Built a custom pixel-snap camera matrix rounding view coordinates to integer pixel boundaries to eliminate sprite shimmer.',
      'Programmed custom fragment shaders for surface wetness, puddle ripple distortions, and raindrops colliding with geometry.',
      'Engineered an ambient lighting color ramp that dynamically adjusts color grades according to storm intensity.',
    ],
    features: [
      'Jitter-free pixel-perfect camera tracking with fractional position smoothing',
      'GPU particle weather simulation: rain drops, fog volume, and wind drifts',
      'Dynamic wetness shaders with surface ripple distortion buffers',
      'Dynamic day/night and atmospheric storm lighting system',
    ],
    thumbnail: '/assets/media/game-2-camera/{973DE20A-6867-402C-9196-D98E7BA33C6C}.webp',
    previewGif: '/assets/media/game-2-camera/sandscappers_preview.webp',
    previewVideo: '/assets/media/game-2-camera/2_1sandscapper.mp4',
    banner: '/assets/media/game-2-camera/{973DE20A-6867-402C-9196-D98E7BA33C6C}.webp',
    screenshots: [
      '/assets/media/game-2-camera/sandscappers_preview.webp',
      '/assets/media/game-2-camera/{973DE20A-6867-402C-9196-D98E7BA33C6C}.webp',
      '/assets/media/game-2-camera/{0DEDFE0A-F61C-42C8-AFB2-A2C33E6CC57C}.webp',
      '/assets/media/game-2-camera/{2398519E-2F81-436C-8D5B-F8F7BD2FAC1C}.webp',
    ],
    webglPlayable: false,
    repoUrl: 'https://github.com/akhmedovfakhriyor/SandScappers_pixelPerfect_camera',
  },
  {
    id: 'umbra-arm',
    title: 'Umbra: Procedural Arm',
    tagline: 'Dark fantasy physics-driven action featuring procedural inverse kinematics arm articulation.',
    genre: ['Action', 'Procedural IK', 'Physics'],
    engine: 'Unity 2023',
    year: '2024',
    status: 'In Development',
    description: 'Umbra centers on a biomechanical dark entity wielding a dynamically articulated procedural limb. The multi-jointed appendage realistically computes inverse kinematics and surface contacts in real-time, responding fluidly to player momentum, terrain elevation, and combat weight.',
    myRole: 'Gameplay & Procedural Animation Programmer',
    technicalChallenges: [
      'Developed real-time analytical inverse kinematics (FABRIK) calculating multi-segment arm positioning at sub-millisecond costs.',
      'Constructed Verlet integration physics springs for organic weight recoil, secondary motion, and ground impact shocks.',
      'Designed adaptive foot and hand placement routines that conform to uneven collision meshes dynamically.',
    ],
    features: [
      'Procedurally animated multi-jointed arm with dynamic IK target tracking',
      'Realistic momentum transfer and secondary biomechanical oscillation',
      'Adaptive surface snapping across complex vertical level topography',
      'High-performance physics loop running synchronously with fixed update',
    ],
    thumbnail: '/assets/media/game-3-umbra/{11D1195D-4D77-40E0-A8E7-D93C0D3EF592}.png',
    previewGif: '/assets/media/game-3-umbra/{148FDED4-7DA1-450F-9C21-7DFA7E84606C}.png',
    banner: '/assets/media/game-3-umbra/{DE1453C2-2DCD-40DA-B64D-701C5AEFEF60}.png',
    screenshots: [
      '/assets/media/game-3-umbra/UmbraRun_GIF.webp',
      '/assets/media/game-3-umbra/{11D1195D-4D77-40E0-A8E7-D93C0D3EF592}.png',
      '/assets/media/game-3-umbra/{148FDED4-7DA1-450F-9C21-7DFA7E84606C}.png',
      '/assets/media/game-3-umbra/{DE1453C2-2DCD-40DA-B64D-701C5AEFEF60}.png',
      '/assets/media/game-3-umbra/{D2DB01CA-D2D6-4374-9CB1-D7733E0E3135}.webp',
    ],
    webglPlayable: false,
    repoUrl: 'https://github.com/akhmedovfakhriyor/Umbra_proceduraly_generated_arm',
  },
  {
    id: 'vae-mond',
    title: 'Vae-Mond: Shadow Exchange',
    tagline: 'Atmospheric puzzle-platformer where you manipulate light and swap places with your shadow clone.',
    genre: ['Puzzle', 'Platformer', 'Spatial'],
    engine: 'Unity 6',
    year: '2024',
    status: 'Playable Prototype',
    description: 'A mind-bending spatial puzzle game where you control a solitary protagonist and their shadow reflection. By casting light sources and utilizing an instant quantum transposition mechanic, players solve dual-plane environmental enigmas by exchanging positions with their shadow clone.',
    myRole: 'Lead Designer & Systems Developer',
    technicalChallenges: [
      'Engineered an instant spatial-exchange coordinate system preserving momentum and gravitational vectors across dual states.',
      'Built a 2D dynamic shadow caster generating interactive silhouette geometry in real-time.',
      'Created bespoke puzzle levels requiring multi-step causality planning between physical and umbral planes.',
    ],
    features: [
      'Instant shadow clone position exchange mechanic with momentum preservation',
      'Dynamic occlusion-based shadow casting and interactive silhouette triggers',
      'Integrated gameplay recording clip and custom level geometry pipeline',
      'Crisp pixel-art aesthetic paired with ambient reactive lighting',
    ],
    thumbnail: '/assets/media/game-4-vaemond/vae-mond_clean.png',
    previewGif: '/assets/media/game-4-vaemond/{CA74AFF1-86ED-4EF4-9D05-47ABB2795E68}.webp',
    previewVideo: '/assets/media/game-4-vaemond/vae-mond.mp4',
    banner: '/assets/media/game-4-vaemond/vae-mond_clean.png',
    screenshots: [
      '/assets/media/game-4-vaemond/vae-mond_lvl.png',
      '/assets/media/game-4-vaemond/{CA74AFF1-86ED-4EF4-9D05-47ABB2795E68}.webp',
    ],
    webglPlayable: false,
    demoUrl: 'https://s0far.itch.io/vae-mond',
  }
];

export const ARTWORKS: Artwork[] = [
  {
    id: 'art-generated-5',
    title: 'Donut Rendered4',
    category: '3D Models',
    year: 'March 2026',
    tools: [
      'Blender',
      'Cycles'
    ],
    description: '3D geometry and shader study created in Blender.',
    imageUrl: '/assets/media/Art Gallery/3D Models/Donut rendered4.webp',
    featured: true
  },
  {
    id: 'art-generated-0',
    title: 'Umbra Thematic',
    category: 'Digital Art',
    year: 'Dec 2025 - Jan 2026',
    tools: [
      'Digital Art'
    ],
    description: 'Dark fantasy concept art and thematic mood pieces for the Umbra project.',
    imageUrl: '/assets/media/Art Gallery/Digital Art/{11D1195D-4D77-40E0-A8E7-D93C0D3EF592}.png',
    gallery: [
      '/assets/media/Art Gallery/Digital Art/{11D1195D-4D77-40E0-A8E7-D93C0D3EF592}.png',
      '/assets/media/Art Gallery/Digital Art/{148FDED4-7DA1-450F-9C21-7DFA7E84606C}.png'
    ],
    featured: true
  },
  {
    id: 'art-generated-14',
    title: 'Free Hand Drawings',
    category: 'Traditional Art',
    year: '2025 - 2026',
    tools: [
      'Pencil & Paper',
      'Traditional Media'
    ],
    description: 'A collection of expressive free-hand sketches, fabric drapery studies, and traditional character illustrations.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/sad woman.webp',
    gallery: [
      '/assets/media/Art Gallery/Traditional Art/sad woman.webp',
      '/assets/media/Art Gallery/Traditional Art/woman looking up.webp',
      '/assets/media/Art Gallery/Traditional Art/samurai oni.webp',
      '/assets/media/Art Gallery/Traditional Art/anime girl.webp',
      '/assets/media/Art Gallery/Traditional Art/cloth.webp'
    ],
    featured: false
  },
  {
    id: 'art-gaze-nothingness-group',
    title: 'Gaze into the Nothingness',
    category: 'Traditional Art',
    year: 'Apr 2025',
    tools: [
      'Pencil & Paper'
    ],
    description: 'Portrait studies capturing deep and introspective expressions.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/woman in a cap.webp',
    gallery: [
      '/assets/media/Art Gallery/Traditional Art/woman in a cap.webp',
      '/assets/media/Art Gallery/Traditional Art/woman looking away.webp'
    ],
    featured: false
  },
  {
    id: 'art-shading-study-group',
    title: 'Added More Shading',
    category: 'Traditional Art',
    year: 'Dec 2025',
    tools: [
      'Pencil & Paper',
      'Traditional Sketching'
    ],
    description: 'A dedicated group of portrait and concept sketches emphasizing advanced pencil shading, directional contrast, and form.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/woman in a hood.webp',
    gallery: [
      '/assets/media/Art Gallery/Traditional Art/woman in a hood.webp',
      '/assets/media/Art Gallery/Traditional Art/magic.webp',
      '/assets/media/Art Gallery/Traditional Art/king baldwin.webp'
    ],
    featured: false
  },
  {
    id: 'art-generated-13',
    title: 'Oriana',
    category: 'Traditional Art',
    year: 'Nov 2025',
    tools: [
      'Traditional Sketching'
    ],
    description: 'Character portrait and anatomy study.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/oriana.webp',
    featured: false
  },
  {
    id: 'art-generated-4',
    title: 'Despair',
    category: 'Traditional Art',
    year: 'Apr 2025',
    tools: [
      'Pencil & Paper'
    ],
    description: 'Emotional portrait study exploring deep contrast.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/despair.webp',
    featured: false
  },
  {
    id: 'art-generated-24',
    title: 'Listening',
    category: 'Traditional Art',
    year: 'Apr 2025',
    tools: [
      'Pencil & Paper'
    ],
    description: 'Candid portrait capture with delicate pencil shading.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/woman in headphones.webp',
    featured: false
  },
  {
    id: 'art-generated-9',
    title: 'Isha',
    category: 'Traditional Art',
    year: 'Feb 2025',
    tools: [
      'Traditional Sketching'
    ],
    description: 'Character sketch and expressive line work.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/isha.webp',
    featured: false
  },
  {
    id: 'art-generated-10',
    title: 'Jinx',
    category: 'Traditional Art',
    year: 'Feb 2025',
    tools: [
      'Traditional Sketching'
    ],
    description: 'Stylized character illustration.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/jinx.webp',
    featured: false
  },
  {
    id: 'art-generated-6',
    title: 'Hand Sketches',
    category: 'Traditional Art',
    year: 'Jan 2025',
    tools: [
      'Pencil & Paper'
    ],
    description: 'A collection of anatomical hand studies exploring different poses and lighting.',
    imageUrl: '/assets/media/Art Gallery/Traditional Art/hands 2.webp',
    gallery: [
      '/assets/media/Art Gallery/Traditional Art/hands 2.webp',
      '/assets/media/Art Gallery/Traditional Art/hands 1.webp',
      '/assets/media/Art Gallery/Traditional Art/hands 3.webp'
    ],
    featured: true
  },
  {
    id: 'art-generated-17',
    title: 'Umbra Character Concept Sketches',
    category: 'Digital Art',
    year: '2025',
    tools: [
      'Digital Painting',
      'Concept Art'
    ],
    description: 'Initial concept exploration and dynamic poses for the Umbra project.',
    imageUrl: '/assets/media/Art Gallery/Digital Art/umbra sketches 1.webp',
    gallery: [
      '/assets/media/Art Gallery/Digital Art/umbra sketches 1.webp',
      '/assets/media/Art Gallery/Digital Art/umbra sketches 2.webp',
      '/assets/media/Art Gallery/Digital Art/umbra sketches 3.webp',
      '/assets/media/Art Gallery/Digital Art/umbra sketches 4.webp'
    ],
    featured: false
  },
  {
    id: 'art-generated-16',
    title: 'Sand-Scappers',
    category: 'Digital Art',
    year: '2024',
    tools: [
      'Pixel Art',
      'Digital Art'
    ],
    description: 'Environment and mood concept design for SandScappers.',
    imageUrl: '/assets/media/Art Gallery/Digital Art/Screenshot 2023-09-11 175237-Photoroom.webp',
    featured: false
  },
  {
    id: 'art-generated-sandscappers-env',
    title: 'Sand-Scappers Atmospheric Study',
    category: 'Digital Art',
    year: '2024',
    tools: [
      'Pixel Art',
      'Digital Art'
    ],
    description: 'Atmospheric 2D environment study showcasing rain-slicked platforms, dynamic pixel lighting, and volumetric mist.',
    imageUrl: '/assets/media/game-2-camera/{0DEDFE0A-F61C-42C8-AFB2-A2C33E6CC57C}.webp',
    featured: false
  },
  {
    id: 'art-animations-group',
    title: 'Animations & GIFs',
    category: 'Digital Art',
    year: '2022-2024',
    tools: [
      'GIF Animation',
      'Sprite Work'
    ],
    description: 'A collection of animated sprites and short visual loops.',
    imageUrl: '/assets/media/Art Gallery/Digital Art/Voda_GIF.webp',
    gallery: [
      '/assets/media/Art Gallery/Digital Art/Voda_GIF.webp',
      '/assets/media/game-3-umbra/UmbraRun_GIF.webp',
      '/assets/media/game-2-camera/sandscappers_preview.webp'
    ],
    featured: false
  }
];

export const SPORTS_DATA = {
  marathon: {
    marathonName: 'Runner',
    personalBest: '15 km - 5:20 / km',
    distance: '15 km',
    pace: '5:20 / km',
    club: 'AITU Running Club',
    vo2Max: '5:20 / km',
  },
  running: {
    title: 'Runner',
    headline: 'Distance Running',
    longestDistance: '15 km',
    time: '1h 20m',
    pace: '5:20 / km',
    records: [
      { distance: '400 m', tempo: '3:55 / km', category: 'Sprint' },
      { distance: '1 km', tempo: '4:13 / km', category: 'Speed' },
      { distance: '2 miles', tempo: '4:24 / km', category: 'Threshold' },
      { distance: '5 km', tempo: '4:33 / km', category: 'Aerobic Base' },
      { distance: '10 km', tempo: '5:10 / km', category: 'Endurance' },
      { distance: '15 km', tempo: '5:20 / km', category: 'Long Run' },
    ],
  },
  teamSports: [
    {
      sport: 'Football',
      position: 'Playmaker',
      tag: 'Nagi Touch',
      description: 'Has the touch of a butterfly — people genuinely compare him to Seishiro Nagi. One effortless cushion touch to kill the ball dead in mid-air.',
    },
    {
      sport: 'Volleyball',
      position: 'Setter',
      tag: 'Express Delivery',
      description: 'The team setter — you need the ball, I deliver it on a silver platter. High floaters, fast tempo sets, whatever your spike needs, consider it placed right in your hitting pocket.',
    },
    {
      sport: 'Table Tennis',
      position: 'Forehand Specialist',
      tag: 'Wild West Quickdraw',
      description: 'Equipped with the fastest forehand in the Wild West. Blink once at the table and the ball has already whipped across the net with pure topspin.',
    }
  ],
  speedcubing: {
    singlePB: '17.42s',
    ao5PB: '28.15s',
    ao12PB: '33.08s',
    method: 'CFOP (Fridrich Method)',
    cubes: ['MoYu WeiLong WR M v9 (Ball-Core)', 'GAN 12 MagLev UV'],
    cfopBreakdown: [
      { phase: 'Cross', time: '0', desc: 'Inspection-planned 8 moves or fewer' },
      { phase: 'F2L (First 2 Layers)', time: '0', desc: 'Lookahead & zero pause transitions' },
      { phase: 'OLL (Orientation)', time: '0', desc: 'Full 57 algorithms memorized' },
      { phase: 'PLL (Permutation)', time: '0', desc: 'Full 21 algorithms execution' },
    ]
  }
};
