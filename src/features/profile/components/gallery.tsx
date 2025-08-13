import { useState } from "react"
import { PostWithAuthor } from "@/types/response-schema"
import { Link } from "@tanstack/react-router"
import {
  AlertCircleIcon,
  FilmIcon,
  HeartIcon,
  ImageIcon,
  ImagesIcon,
  MessageCircleIcon,
  RepeatIcon,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react"
import { HLSPlayer } from "@/components/hls-player"
import { isMobileDevice } from "@/lib/browser"
import { MasonryVerticalVirtualizerDynamic } from "@/ui/virtualizer"
import { formatNumber } from "@/utils/number"

const aspectRatioMin = 0.5
const aspectRatioMax = 2

interface GalleryProps {
  posts: PostWithAuthor[]
}

function MediaCard({ post }: { post: PostWithAuthor }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const thumb = post.embedVideo ? post.embedVideo.thumbnail : post.embedImages?.[0].thumb
  const alt = post.embedVideo ? post.embedVideo.alt : post.embedImages?.[0].alt
  const aspectRatio = post.embedVideo ? post.embedVideo.aspectRatio : post.embedImages?.[0].aspectRatio
  const aspectRatioValue = Math.min(aspectRatioMax, Math.max(aspectRatioMin, aspectRatio ? aspectRatio.width / aspectRatio.height : 1))
  const handleHovered = (hovered: boolean) => {
    if (isMobileDevice()) return
    setIsHovered(hovered)
  }

  return (
    <article className="w-full p-1">
      <div
        className="bg-accent border overflow-hidden relative rounded-lg w-full"
        style={{
          aspectRatio: aspectRatioValue
        }}
        onMouseOver={() => handleHovered(true)}
        onMouseLeave={() => handleHovered(false)}
      >
        {post.labelInfo ? (
          <div className="size-full flex flex-col items-center justify-center gap-4">
            <AlertCircleIcon className="size-12" />
            <p className="text-xs text-muted-foreground">{post.labelInfo}</p>
          </div>
        ) : (
          <>
            <img
              src={thumb}
              alt={alt}
              className="object-cover object-top-left size-full"
              loading="lazy"
            />
            {(post.embedVideo && isHovered) && (
              <>
                <HLSPlayer
                  src={post.embedVideo.playlist}
                  poster={thumb}
                  autoPlay
                  disablePictureInPicture
                  loop
                  muted={isMuted}
                  className="object-contain absolute inset-0 size-full backdrop-blur-md"
                />
                <button
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  aria-pressed={isMuted}
                  className="dark absolute z-[1] bottom-2 right-2 bg-background/50 backdrop-blur-sm text-foreground p-2 rounded-full [&>svg]:size-4 transition-all hover:bg-accent/50"
                  onClick={() => setIsMuted(prev => !prev)}
                >
                  {isMuted ? (
                    <VolumeOffIcon />
                  ) : (
                    <Volume2Icon />
                  )}
                </button>
              </>
            )}
            <div className="dark absolute top-2 right-2 bg-background/50 backdrop-blur-sm text-foreground p-2 rounded-full [&>svg]:size-4">
              {post.embedVideo ? (
                <FilmIcon />
              ) : post.embedImages!.length > 1 ? (
                <ImagesIcon />
              ) : (
                <ImageIcon />
              )}
            </div>
            {(post.likes > 0 || post.replies > 0 || post.reposts > 0) && (
              <div className="dark absolute bottom-2 left-2 bg-background/50 backdrop-blur-sm text-foreground px-3 py-2 rounded-full [&_svg]:size-4 flex gap-2 font-semibold text-xs">
                {post.likes > 0 && (
                  <div className="flex items-center gap-1"><HeartIcon /><span>{formatNumber(post.likes)}</span></div>
                )}
                {post.replies > 0 && (
                  <div className="flex items-center gap-1"><MessageCircleIcon /><span>{formatNumber(post.replies)}</span></div>
                )}
                {post.reposts > 0 && (
                  <div className="flex items-center gap-1"><RepeatIcon /><span>{formatNumber(post.reposts)}</span></div>
                )}
              </div>
            )}
          </>
        )}
        <Link
          to="/profile/$username/post/$postId"
          params={{
            username: post.author.username,
            postId: post.uri.split('app.bsky.feed.post/')[1]
          }}
          className="before:absolute before:inset-0"
          onMouseEnter={() => handleHovered(true)}
          onMouseLeave={() => handleHovered(false)}
        >
          <span className="sr-only">View post</span>
        </Link>
      </div>
      {post.content.trim() && (
        <div className="mt-1">
          <p className="font-semibold text-sm line-clamp-1 whitespace-pre-wrap">{post.content}</p>
        </div>
      )}
    </article>
  )
}

export function Gallery({
  posts,
}: GalleryProps) {
  const filteredPosts = posts.filter((post) => post.embedImages?.length || post.embedVideo)

  return (
    <MasonryVerticalVirtualizerDynamic
      className="p-1"
      items={filteredPosts}
      render={(post) => (
        <MediaCard post={post} />
      )}
    />
  )
}
