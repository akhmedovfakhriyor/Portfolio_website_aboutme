import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export function SmartImage({
  src,
  alt,
  className = '',
  skeletonClassName = '',
  containerClassName = '',
  aspectRatio,
  ...props
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if the image is already cached in memory
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-stone-200/60 dark:bg-stone-900/80 ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Static Skeleton Frame (visible until image is fully loaded) */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 z-0 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 animate-pulse flex items-center justify-center ${skeletonClassName}`}
        >
          <div className="w-5 h-5 rounded-full border-2 border-stone-400/30 dark:border-white/20 border-t-teal-500 animate-spin opacity-50" />
        </div>
      )}

      {/* Image in place with zero layout shift */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}

