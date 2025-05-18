import { FC, useEffect, useRef } from 'react';
import Hls, { ErrorData } from 'hls.js';
import { toast } from 'sonner';

type HLSPlayerProps = {
  src: string;
  onError?: (error: ErrorEvent | ErrorData) => void;
  onReady?: () => void;
} & Omit<React.ComponentPropsWithoutRef<'video'>, 'src' | 'onError'>;

const HLSPlayer: FC<HLSPlayerProps> = ({
  src,
  autoPlay = false,
  playsInline = true,
  onError,
  onReady,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: Hls | null = null;
    
    const initializePlayer = () => {
      if (!videoRef.current) return;
      
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          // lowLatencyMode: true,
        });
        
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(err => {
              console.warn('Auto-play was prevented by the browser:', err);
            });
          }
          onReady?.();
        });
        
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                toast("Video", {
                  description: "Network error occurred",
                  duration: 3000,
                });
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                toast("Video", {
                  description: "Media error occurred",
                  duration: 3000,
                });
                hls?.recoverMediaError();
                break;
              default:
                toast("Video", {
                  description: "An unrecoverable error occurred",
                  duration: 3000,
                });
                hls?.destroy();
                break;
            }
            onError?.(data);
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // For browsers that support HLS natively (Safari)
        videoRef.current.src = src;
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(err => {
              console.warn('Auto-play was prevented by the browser:', err);
            });
          }
          onReady?.();
        });
        
        videoRef.current.addEventListener('error', (e) => {
          toast("Video", {
            description: "Video playback error",
            duration: 3000,
          });
          onError?.(e);
        });
      } else {
        toast("Video", {
          description: "HLS is not supported in this browser",
          duration: 3000,
        });
        onError?.(new ErrorEvent('error', { message: 'HLS not supported' }));
      }
    };
    
    initializePlayer();
    
    // Cleanup
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [autoPlay, src, onError, onReady]);

  return (
    <video
      ref={videoRef}
      playsInline={playsInline}
      {...props}
    />
  );
};

export { HLSPlayer };
