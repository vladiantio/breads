import { cn } from "@/lib/utils"
import {
  forwardRef,
  JSX,
  Ref,
  useEffect,
  useState
} from "react"

type imgResolution =
  | "default"
  | "mqdefault"
  | "hqdefault"
  | "sddefault"
  | "maxresdefault"

interface YTEmbedProps {
  id: string
  title: string
  adNetwork?: boolean
  noCookie?: boolean
  params?: string
  playlistCoverId?: string
  poster?: imgResolution
  webp?: boolean
  onClick?: (e: React.MouseEvent) => void
  onIframeAdded?: () => void
  muted?: boolean,
  thumbnail?: string
  containerElement?: keyof JSX.IntrinsicElements
  className?: string
}

function YTEmbedComponent({
  id,
  title,
  adNetwork = false,
  noCookie = true,
  params,
  playlistCoverId,
  poster = 'hqdefault',
  webp = true,
  onClick: onClickProp,
  onIframeAdded,
  muted,
  thumbnail,
  containerElement: ContainerElement = 'article',
  className,
}: YTEmbedProps, ref: Ref<HTMLIFrameElement>) {
  const [preconnected, setPreconnected] = useState(false)
  const [iframe, setIframe] = useState(false)
  const videoId = encodeURIComponent(id)
  const videoPlaylistCoverId = typeof playlistCoverId === 'string' ? encodeURIComponent(playlistCoverId) : null
  const paramsImp = params ? `&${params}` : ""
  const mutedImp = muted ? "&mute=1" : ""
  const format = webp ? 'webp' : 'jpg'
  const vi = webp ? 'vi_webp' : 'vi'
  const posterUrl = thumbnail ?? (!videoPlaylistCoverId
    ? `https://i.ytimg.com/${vi}/${videoId}/${poster}.${format}`
    : `https://i.ytimg.com/${vi}/${videoPlaylistCoverId}/${poster}.${format}`)

  const ytUrl = noCookie
    ? "https://www.youtube-nocookie.com"
    : "https://www.youtube.com"

  const iframeSrc = !videoPlaylistCoverId
    ? `${ytUrl}/embed/${videoId}?autoplay=1&state=1${mutedImp}${paramsImp}`
    : `${ytUrl}/embed/videoseries?autoplay=1${mutedImp}&list=${videoId}${paramsImp}`

  const warmConnections = () => {
    if (preconnected) return
    setPreconnected(true)
  }

  const handleClick = (e: React.MouseEvent) => {
    onClickProp?.(e)
    if (iframe) return
    setIframe(true)
  }

  useEffect(() => {
    if (iframe) {
      onIframeAdded?.()
    }
  }, [iframe, onIframeAdded])

  return (
    <>
      {preconnected && (
        <>
          <link rel="preconnect" href={ytUrl} />
          <link rel="preconnect" href="https://www.google.com" />
          {adNetwork && (
            <>
              <link rel="preconnect" href="https://static.doubleclick.net" />
              <link
                rel="preconnect"
                href="https://googleads.g.doubleclick.net"
              />
            </>
          )}
        </>
      )}
      <ContainerElement
        onPointerOver={warmConnections}
        onClick={handleClick}
        className={cn("relative overflow-hidden border rounded-lg bg-black", className)}
        aria-label={title}
        role={!iframe ? 'button' : undefined}
      >
        <div
          className={cn(
            "aspect-video opacity-100 transition-[opacity] duration-300",
            iframe && 'opacity-0'
          )}
        >
          <img
            src={posterUrl}
            loading="lazy"
            className="aspect-video object-cover size-full"
          />
          <div className={cn("absolute top-0 inset-0 size-full grid place-content-center")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 68 48"
              width={68}
              height={48}
            >
              <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/>
              <path d="M45 24 27 14v20" fill="white"/>
            </svg>
          </div>
        </div>
        {iframe && (
          <iframe
            ref={ref}
            className="absolute top-0 inset-0 border-0 size-full"
            title={title}
            allow="accelerometer autoplay encrypted-media gyroscope picture-in-picture"
            allowFullScreen
            src={iframeSrc}
          />
        )}
      </ContainerElement>
    </>
  )
}

const YTEmbed = forwardRef<HTMLIFrameElement, YTEmbedProps>(YTEmbedComponent)

export { YTEmbed, type YTEmbedProps }
