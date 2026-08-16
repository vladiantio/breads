import { useEffect, useRef } from "react"
import type Hls from "hls.js"
import type { ErrorData } from "hls.js"
import { toast } from "sonner"
import { useComposedRefs } from "@/lib/compose-refs"

type HLSPlayerProps = Omit<React.ComponentPropsWithoutRef<"video">, "src"> & {
  src: string
  onError?: (error: ErrorEvent | ErrorData) => void
  onReady?: () => void
  ref?: React.Ref<HTMLVideoElement>
}

export function HLSPlayer({
  ref,
  src,
  onError: onErrorProp,
  onReady,
  ...props
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const composedRef = useComposedRefs(ref, videoRef)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls: Hls | null = null
    let cancelled = false
    let nativeCleanup: (() => void) | null = null

    const initializePlayer = async () => {
      if (cancelled) return

      const { default: HlsClass } = await import("hls.js")

      if (cancelled) return

      if (HlsClass.isSupported()) {
        hls = new HlsClass({
          enableWorker: true,
        })

        hls.loadSource(src)
        hls.attachMedia(video)

        hls.on(HlsClass.Events.MANIFEST_PARSED, () => {
          if (!cancelled) onReady?.()
        })

        hls.on(HlsClass.Events.ERROR, (_, data) => {
          if (cancelled) return

          if (data.fatal) {
            switch (data.type) {
              case HlsClass.ErrorTypes.NETWORK_ERROR:
                toast("Video", {
                  description: "Network error occurred",
                  duration: 3000,
                })
                hls?.startLoad()
                break
              case HlsClass.ErrorTypes.MEDIA_ERROR:
                toast("Video", {
                  description: "Media error occurred",
                  duration: 3000,
                })
                hls?.recoverMediaError()
                break
              default:
                toast("Video", {
                  description: "An unrecoverable error occurred",
                  duration: 3000,
                })
                hls?.destroy()
                break
            }
            onErrorProp?.(data)
          }
        })
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // For browsers that support HLS natively (Safari)
        video.src = src

        const onLoadedMetadata = () => {
          if (!cancelled) onReady?.()
        }

        const onNativeError = (event: Event) => {
          if (cancelled) return

          toast("Video", {
            description: "Video playback error",
            duration: 3000,
          })
          onErrorProp?.(event as ErrorEvent)
        }

        video.addEventListener("loadedmetadata", onLoadedMetadata)
        video.addEventListener("error", onNativeError)

        nativeCleanup = () => {
          video.removeEventListener("loadedmetadata", onLoadedMetadata)
          video.removeEventListener("error", onNativeError)
        }
      } else {
        toast("Video", {
          description: "HLS is not supported in this browser",
          duration: 3000,
        })
        onErrorProp?.(new ErrorEvent("error", { message: "HLS not supported" }))
      }
    }

    initializePlayer()

    // Cleanup
    return () => {
      cancelled = true
      hls?.destroy()
      nativeCleanup?.()
    }
  }, [src, onErrorProp, onReady])

  return <video ref={composedRef} {...props} />
}
