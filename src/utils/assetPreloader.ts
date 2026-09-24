import { GAME_PROJECTS, ARTWORKS } from '../data/portfolioData';

// Track already preloaded assets to prevent duplicate fetches across sessions
const preloadedUrls = new Set<string>();

/**
 * Checks whether user has enabled Data Saver mode or is on a 2G network.
 */
function shouldSkipBackgroundPreload(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as unknown as {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
    };
  };
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType === 'slow-2g' || nav.connection?.effectiveType === '2g') return true;
  return false;
}

/**
 * Returns prioritized portfolio asset URLs:
 * Phase 1: All primary card thumbnails & preview clips across Games and Art Gallery
 * Phase 2: Deep inspection assets (multi-slide galleries & extra screenshot angles)
 */
export function getPrioritizedPortfolioAssetUrls(): string[] {
  const primaryUrls: string[] = [];
  const secondaryUrls: string[] = [];

  const addUnique = (target: string[], url: string | undefined) => {
    if (!url) return;
    if (!primaryUrls.includes(url) && !secondaryUrls.includes(url) && !target.includes(url)) {
      target.push(url);
    }
  };

  // Phase 1A: Primary Game Card Thumbnail Images ONLY (NO heavy videos!)
  GAME_PROJECTS.forEach((game) => {
    addUnique(primaryUrls, game.thumbnail);
  });

  // Phase 1B: Primary Art Gallery Card Thumbnails
  ARTWORKS.forEach((art) => {
    addUnique(primaryUrls, art.imageUrl);
  });

  return primaryUrls;
}

/**
 * Preloads all gallery slides for an artwork immediately (e.g. on card hover)
 */
export function preloadArtworkGallery(art?: { imageUrl?: string; gallery?: string[] }) {
  if (!art) return;
  if (art.imageUrl) preloadImage(art.imageUrl);
  if (art.gallery) {
    art.gallery.forEach((url) => preloadImage(url));
  }
}

/**
 * Preloads screenshots and media for a game project (e.g. on card hover)
 */
export function preloadGameAssets(game?: { thumbnail?: string; previewGif?: string; previewVideo?: string; banner?: string; screenshots?: string[] }) {
  if (!game) return;
  if (game.thumbnail) preloadImage(game.thumbnail);
  if (game.previewGif) preloadImage(game.previewGif);
  if (game.banner) preloadImage(game.banner);
  if (game.previewVideo) preloadVideo(game.previewVideo);
  if (game.screenshots) {
    game.screenshots.forEach((s) => preloadImage(s));
  }
}

/**
 * Preloads a single video into the browser cache
 */
export function preloadVideo(url: string): Promise<void> {
  if (preloadedUrls.has(url)) return Promise.resolve();

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = () => {
      preloadedUrls.add(url);
      resolve();
    };
    video.onerror = () => {
      resolve();
    };
    video.src = url;
  });
}

/**
 * Preloads a single image into the browser cache
 */
export function preloadImage(url: string): Promise<void> {
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return preloadVideo(url);
  }
  if (preloadedUrls.has(url)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.decoding = 'async';
    img.onload = () => {
      preloadedUrls.add(url);
      resolve();
    };
    img.onerror = () => {
      // Resolve anyway so queue continues without blocking
      resolve();
    };
    img.src = url;
  });
}

/**
 * Progressively preloads assets during browser idle time in staged priority order.
 * - Respects Data-Saver / 2G metered connections
 * - Pauses execution when tab is backgrounded
 * - Batches requests during idle time so it never affects 60 FPS animations
 */
export function startBackgroundAssetPreloading(delayMs: number = 400) {
  if (typeof window === 'undefined') return;
  if (shouldSkipBackgroundPreload()) return;

  const runPreload = () => {
    const assetUrls = getPrioritizedPortfolioAssetUrls();
    let currentIndex = 0;
    const batchSize = 2; // Lightweight batch
    let isProcessing = false;

    // Track user scrolling so preloading NEVER runs during active scrolling
    let isScrolling = false;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      isScrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    function processNextBatch() {
      if (currentIndex >= assetUrls.length) {
        window.removeEventListener('scroll', onScroll);
        return;
      }
      if (isProcessing) return;

      // Never process batches during active scrolling or when tab is hidden
      if (isScrolling || (typeof document !== 'undefined' && document.hidden)) {
        scheduleNext(600);
        return;
      }

      isProcessing = true;
      const batch = assetUrls.slice(currentIndex, currentIndex + batchSize);
      currentIndex += batchSize;

      Promise.all(batch.map((url) => preloadImage(url)))
        .catch(() => {})
        .finally(() => {
          isProcessing = false;
          scheduleNext(300);
        });
    }

    function scheduleNext(idleTimeout: number) {
      if (currentIndex >= assetUrls.length) return;

      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => processNextBatch(), { timeout: idleTimeout });
      } else {
        setTimeout(processNextBatch, 180);
      }
    }

    scheduleNext(1200);
  };

  // Allow hero section, 3D Canvas, and font layout to stabilize before starting background prefetching
  setTimeout(runPreload, delayMs);
}
