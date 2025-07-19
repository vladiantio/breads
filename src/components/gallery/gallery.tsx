import { useState } from "react";
import { PostWithAuthor } from "@/types/response-schema";
import { Link } from "@tanstack/react-router";
import { AlertCircleIcon, FilmIcon, ImageIcon, ImagesIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { HLSPlayer } from "../shared/hls-player";
import { isMobileDevice } from "@/lib/browser";
import { MasonryVerticalVirtualizerDynamic } from "@/ui/virtualizer";

interface GalleryProps {
  posts: PostWithAuthor[];
}

function GalleryCard({ post }: { post: PostWithAuthor }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const thumb = post.embedVideo ? post.embedVideo.thumbnail : post.embedImages?.[0].thumb;
  const alt = post.embedVideo ? post.embedVideo.alt : post.embedImages?.[0].alt;
  const aspectRatio = post.embedVideo ? post.embedVideo.aspectRatio : post.embedImages?.[0].aspectRatio;
  const handleHovered = (hovered: boolean) => {
    if (isMobileDevice()) return;
    setIsHovered(hovered);
  };
  return (
    <article className="w-full p-1">
      <div
        className="w-full bg-accent overflow-hidden relative rounded-lg"
        style={{
          aspectRatio: aspectRatio ? aspectRatio.width / aspectRatio.height : 1
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
              className="object-contain size-full"
              loading="lazy"
            />
            {(post.embedVideo && isHovered) && (
              <>
                <HLSPlayer
                  src={post.embedVideo.playlist}
                  poster={post.embedVideo.thumbnail}
                  autoPlay
                  disablePictureInPicture
                  loop
                  muted={isMuted}
                  className="object-contain absolute inset-0 size-full"
                />
                <button
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  aria-pressed={isMuted}
                  className="absolute z-[1] bottom-2 right-2 bg-background/50 backdrop-blur-sm p-2 rounded-full [&>svg]:size-4 transition-all hover:bg-accent/50"
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
            <div className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm p-2 rounded-full [&>svg]:size-4">
              {post.embedVideo ? (
                <FilmIcon />
              ) : post.embedImages!.length > 1 ? (
                <ImagesIcon />
              ) : (
                <ImageIcon />
              )}
            </div>
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
    </article>
  );
}

export function Gallery({
  posts,
}: GalleryProps) {
  const filteredPosts = posts.filter((post) => post.embedImages?.length || post.embedVideo);

  return (
    <MasonryVerticalVirtualizerDynamic
      className="p-1"
      items={filteredPosts}
      render={(post) => (
        <GalleryCard post={post} />
      )}
    />
  );
}
