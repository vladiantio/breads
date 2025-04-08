import { useCallback, useMemo, useState } from 'react';

type ImageStatus = {
  url: string;
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
};

type PreloadStatus = {
  images: Record<string, ImageStatus>;
  allLoaded: boolean;
  anyLoading: boolean;
  errors: Error[];
};

/**
 * A hook that preloads one or more images when a target element is hovered.
 * 
 * @param imageUrls A single image URL or array of image URLs to preload (can be null/undefined)
 * @returns An object containing:
 *  - hoverProps: Props to spread on the element that triggers preloading
 *  - status: Object containing loading status information
 *  - preloadNow: Function to manually trigger preloading
 */
export function useImagePreload(imageUrls?: string | string[] | null) {
  // Handle null, undefined, or empty array by converting to an empty array
  const urls = useMemo(() => imageUrls
    ? Array.isArray(imageUrls)
      ? imageUrls.filter(Boolean) // Filter out null/undefined/empty strings
      : imageUrls ? [imageUrls] : []
    : [], [imageUrls]);

  const [status, setStatus] = useState<PreloadStatus>({
    images: urls.reduce((acc, url) => {
      acc[url] = { url, isLoading: false, isLoaded: false, error: null };
      return acc;
    }, {} as Record<string, ImageStatus>),
    allLoaded: urls.length === 0, // Consider empty array as "all loaded" already
    anyLoading: false,
    errors: [],
  });

  const preloadImages = useCallback(() => {
    // If there are no URLs or all images are already loaded, do nothing
    if (urls.length === 0 || status.allLoaded) return;

    // Create a copy of the current status that we'll update
    const newImageStatus = { ...status.images };
    let anyLoading = false;

    // Start loading any images that haven't loaded yet
    urls.forEach(url => {
      // Initialize status for this URL if it doesn't exist
      if (!newImageStatus[url]) {
        newImageStatus[url] = { url, isLoading: false, isLoaded: false, error: null };
      }

      if (newImageStatus[url].isLoaded || newImageStatus[url].isLoading) {
        if (newImageStatus[url].isLoading) {
          anyLoading = true;
        }
        return;
      }

      // Mark this image as loading
      newImageStatus[url] = {
        ...newImageStatus[url],
        isLoading: true,
      };
      anyLoading = true;

      const img = new Image();

      img.onload = () => {
        setStatus(prevStatus => {
          // Make sure the URL still exists in our state
          if (!prevStatus.images[url]) return prevStatus;

          const updatedImages = {
            ...prevStatus.images,
            [url]: {
              ...prevStatus.images[url],
              isLoading: false,
              isLoaded: true,
            },
          };

          // Check if all images are now loaded
          const allLoaded = urls.every(imageUrl => updatedImages[imageUrl]?.isLoaded);
          const anyStillLoading = urls.some(imageUrl => updatedImages[imageUrl]?.isLoading);
          const errors = urls
            .map(imageUrl => updatedImages[imageUrl]?.error)
            .filter((error): error is Error => error !== null);

          return {
            images: updatedImages,
            allLoaded,
            anyLoading: anyStillLoading,
            errors,
          };
        });
      };

      img.onerror = () => {
        const error = new Error(`Failed to load image: ${url}`);

        setStatus(prevStatus => {
          // Make sure the URL still exists in our state
          if (!prevStatus.images[url]) return prevStatus;

          const updatedImages = {
            ...prevStatus.images,
            [url]: {
              ...prevStatus.images[url],
              isLoading: false,
              error,
            },
          };

          // Check if all images are now loaded
          const allLoaded = urls.every(imageUrl => updatedImages[imageUrl]?.isLoaded);
          const anyStillLoading = urls.some(imageUrl => updatedImages[imageUrl]?.isLoading);
          const errors = urls
            .map(imageUrl => updatedImages[imageUrl]?.error)
            .filter((err): err is Error => err !== null);

          return {
            images: updatedImages,
            allLoaded,
            anyLoading: anyStillLoading,
            errors,
          };
        });
      };

      img.src = url;
    });

    // Update the loading status immediately
    setStatus(prevStatus => ({
      ...prevStatus,
      images: newImageStatus,
      anyLoading,
    }));
  }, [status.allLoaded, status.images, urls]);

  // Props to spread on the element that should trigger preloading
  const hoverProps = {
    onMouseEnter: preloadImages,
    onTouchStart: preloadImages, // For mobile support
  };

  return {
    hoverProps,
    status,
    preloadNow: preloadImages,
  };
}
