export type SectionId = 'hero' | 'engineering' | 'gamedev' | 'art' | 'sports' | 'contact';
export type ColorMode = 'dark' | 'light';

export interface ThemeConfig {
  id: SectionId;
  name: string;
  className: string;
  accentColor: string;
  bgDesc: string;
  label: string;
}

export interface GameProject {
  id: string;
  title: string;
  tagline: string;
  genre: string[];
  engine: string;
  year: string;
  status: string;
  description: string;
  myRole: string;
  technicalChallenges: string[];
  features: string[];
  thumbnail: string;
  previewGif: string;
  previewVideo?: string;
  banner: string;
  screenshots: string[];
  webglPlayable: boolean;
  demoUrl?: string;
  repoUrl?: string;
}

export interface Artwork {
  id: string;
  title: string;
  category: '3D Models' | 'Digital Art' | 'Traditional Art';
  year: string;
  tools: string[];
  dimensions?: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  model3d?: boolean;
  colorPalette?: string[];
  featured?: boolean;
}

export interface SportHighlight {
  id: string;
  title: string;
  category: 'running' | 'teamsport' | 'speedcubing';
  stats: { label: string; value: string; unit?: string }[];
  description: string;
  badge: string;
}
