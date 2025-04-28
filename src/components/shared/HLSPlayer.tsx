import { CSSProperties, FC, MouseEventHandler, useEffect, useRef } from 'react';
import Hls, { ErrorData } from 'hls.js';
import { toast } from 'sonner';

interface HLSPlayerProps {
  src: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  className?: string;
  style?: CSSProperties;
  onError?: (error: ErrorEvent | ErrorData) => void;
  onReady?: () => void;
  onClick?: MouseEventHandler<HTMLVideoElement>;
}

const HLSPlayer: FC<HLSPlayerProps> = ({
  src,
  poster,
  width,
  height,
  autoPlay,
  controls = true,
  muted = false,
  playsInline = true,
  className,
  style,
  onError,
  onReady,
  onClick,
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
  }, [src, autoPlay, onError, onReady]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      width={width}
      height={height}
      controls={controls}
      muted={muted}
      className={className}
      style={style}
      onClick={onClick}
      playsInline={playsInline}
    />
  );
};

export default HLSPlayer;
