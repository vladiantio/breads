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

type VideoRendition = {
  id: string
  width?: number
  height?: number
  bitrate?: number
}

/**
 * Bridges hls.js levels to the W3C `videoRenditions` interface that
 * media-chrome reads. Chrome/Firefox don't implement it natively, so we
 * polyfill it on the video element: the Quality submenu in MediaPlayerSettings
 * listens to `addrendition`/`change` events and sets `selectedIndex`.
 */
function createVideoRenditions(applySelection: (index: number) => void) {
  const target = new EventTarget()
  const list = [] as unknown as VideoRendition[] & {
    selectedIndex: number
    item: (index: number) => VideoRendition | null
    addEventListener: EventTarget["addEventListener"]
    removeEventListener: EventTarget["removeEventListener"]
    dispatchEvent: EventTarget["dispatchEvent"]
  }

  let selectedIndex = -1

  Object.defineProperty(list, "selectedIndex", {
    configurable: true,
    get: () => selectedIndex,
    set: (value: number) => {
      if (value === selectedIndex) return
      selectedIndex = value
      // -1 means Auto
      applySelection(value)
      target.dispatchEvent(new Event("change"))
    },
  })

  list.item = (index) => list[index] ?? null
  list.addEventListener = target.addEventListener.bind(target)
  list.removeEventListener = target.removeEventListener.bind(target)
  list.dispatchEvent = target.dispatchEvent.bind(target)

  return {
    list,
    setLevels(levels: { width?: number; height?: number; bitrate?: number }[]) {
      const next = levels.map((level, index) => ({
        id: String(index),
        width: level.width,
        height: level.height,
        bitrate: level.bitrate,
      }))

      const changed =
        next.length !== list.length ||
        next.some(
          (level, i) =>
            level.width !== list[i]?.width ||
            level.height !== list[i]?.height ||
            level.bitrate !== list[i]?.bitrate
        )
      if (!changed) return

      list.splice(0, list.length, ...next)

      if (selectedIndex >= list.length) {
        selectedIndex = -1
        // Auto (-1); keep hls.js in sync so the UI and playback agree
        applySelection(-1)
        target.dispatchEvent(new Event("change"))
      }
      target.dispatchEvent(new Event("addrendition"))
    },
  }
}

export function HLSPlayer({
  ref,
  src,
  onError: onErrorProp,
  onReady,
  ...props
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)
  const renditionsRef = useRef<ReturnType<typeof createVideoRenditions> | null>(
    null
  )

  const composedRef = useComposedRefs(ref, videoRef)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const renditions = createVideoRenditions((index) => {
      if (hlsRef.current) hlsRef.current.currentLevel = index
    })
    renditionsRef.current = renditions

    if (!("videoRenditions" in video)) {
      Object.defineProperty(video, "videoRenditions", {
        configurable: true,
        get: () => renditionsRef.current?.list,
      })
    }


    let hls: Hls | null = null
    let cancelled = false
    let nativeCleanup: (() => void) | null = null
    let started = false
    let stoppedForOffscreen = false
    let offscreenTimer: ReturnType<typeof setTimeout> | null = null
    let observer: IntersectionObserver | null = null

    const syncLevels = () => {
      if (!cancelled) renditionsRef.current?.setLevels(hls?.levels ?? [])
    }

    const initializePlayer = async () => {
      if (cancelled) return

      const { default: HlsClass } = await import("hls.js")

      if (cancelled) return

      if (HlsClass.isSupported()) {
        hls = new HlsClass({
          enableWorker: true,
        })
        hlsRef.current = hls

        hls.loadSource(src)
        hls.attachMedia(video)

        hls.on(HlsClass.Events.MANIFEST_PARSED, () => {
          if (!cancelled) {
            syncLevels()
            onReady?.()
          }
        })

        hls.on(HlsClass.Events.LEVELS_UPDATED, syncLevels)

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

    const start = () => {
      if (started || cancelled) return
      started = true
      initializePlayer()
    }

    const pauseForOffscreen = () => {
      if (!started || stoppedForOffscreen || offscreenTimer !== null) return

      // Dwell briefly so quick scroll-throughs don't tear down playback
      offscreenTimer = setTimeout(() => {
        offscreenTimer = null
        if (cancelled) return
        stoppedForOffscreen = true
        video.pause()
        hls?.stopLoad()
      }, 2000)
    }

    const resumeFromOffscreen = () => {
      if (offscreenTimer !== null) {
        clearTimeout(offscreenTimer)
        offscreenTimer = null
      }
      if (!stoppedForOffscreen) return
      stoppedForOffscreen = false
      hls?.startLoad()
    }

    if (typeof IntersectionObserver === "undefined") {
      start()
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (!started) start()
              else resumeFromOffscreen()
            } else {
              pauseForOffscreen()
            }
          }
        },
        // Start loading just before the video scrolls into view
        { rootMargin: "300px" }
      )
      observer.observe(video)
    }

    // Cleanup
    return () => {
      cancelled = true
      observer?.disconnect()
      if (offscreenTimer !== null) clearTimeout(offscreenTimer)
      hlsRef.current = null
      renditionsRef.current = null
      hls?.destroy()
      nativeCleanup?.()
    }
  }, [src, onErrorProp, onReady])

  return <video ref={composedRef} {...props} />
}
