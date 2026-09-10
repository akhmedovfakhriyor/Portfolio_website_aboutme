import { GAME_PROJECTS, ARTWORKS } from '../data/portfolioData';

// Track already preloaded assets to prevent duplicate fetches
const preloadedUrls = new Set<string>();

/**
 * Collect all high-priority and secondary media URLs across the site
 */
export function getAllPortfolioAssetUrls(): string[] {
  const urls: string[] = [];

  // 1. Game Projects (Thumbnails, previews, screenshots)
  GAME_PROJECTS.forEach((game) => {
    if (game.thumbnail) urls.push(game.thumbnail);
    if (game.previewGif) urls.push(game.previewGif);
    if (game.banner && game.banner !== game.thumbnail) urls.push(game.banner);
    if (game.screenshots) {
      game.screenshots.forEach((s) => {
        if (s && !urls.includes(s)) urls.push(s);
      });
    }
  });

  // 2. Art Gallery (Main images, galleries)
  ARTWORKS.forEach((art) => {
    if (art.imageUrl && !urls.includes(art.imageUrl)) urls.push(art.imageUrl);
    if (art.gallery) {
      art.gallery.forEach((img) => {
        if (img && !urls.includes(img)) urls.push(img);
      });
    }
  });

  return urls;
}

/**
 * Preloads a single image into the browser cache
 */
export function preloadImage(url: string): Promise<void> {
  if (preloadedUrls.has(url)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      preloadedUrls.add(url);
      resolve();
    };
    img.onerror = () => {
      // Resolve anyway so queue continues
      resolve();
    };
    img.src = url;
  });
}

/**
 * Progressively preloads assets during browser idle time
 * Uses low-concurrency batches so it never blocks main thread or user interactions
 */
export function startBackgroundAssetPreloading(delayMs: number = 800) {
  if (typeof window === 'undefined') return;

  const runPreload = () => {
    const assetUrls = getAllPortfolioAssetUrls();
    let currentIndex = 0;
    const batchSize = 2; // Low concurrency to preserve bandwidth

    function processNextBatch() {
      if (currentIndex >= assetUrls.length) return;

      const batch = assetUrls.slice(currentIndex, currentIndex + batchSize);
      currentIndex += batchSize;

      Promise.all(batch.map((url) => preloadImage(url))).then(() => {
        // Schedule next batch during idle time
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => processNextBatch(), { timeout: 1500 });
        } else {
          setTimeout(processNextBatch, 200);
        }
      });
    }

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => processNextBatch(), { timeout: 2000 });
    } else {
      setTimeout(processNextBatch, 300);
    }
  };

  // Give initial screen and interactive JS time to render first
  setTimeout(runPreload, delayMs);
}
