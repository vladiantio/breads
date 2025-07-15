import { useState } from "react";
import { PostWithAuthor } from "@/types/response-schema";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/ui/skeleton";
import { AlertCircleIcon, FilmIcon, ImageIcon, ImagesIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { HLSPlayer } from "../shared/hls-player";
import { isMobileDevice } from "@/lib/browser";

interface GalleryProps {
  posts: PostWithAuthor[];
}

function GalleryCard({ post }: { post: PostWithAuthor }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const thumb = post.embedVideo ? post.embedVideo.thumbnail : post.embedImages?.[0].thumb;
  const alt = post.embedVideo ? post.embedVideo.alt : post.embedImages?.[0].alt;
  const handleHovered = (hovered: boolean) => {
    if (isMobileDevice()) return;
    setIsHovered(hovered);
  };
  return (
    <Link
      to="/profile/$username/post/$postId"
      params={{
        username: post.author.username,
        postId: post.uri.split('app.bsky.feed.post/')[1]
      }}
      className="aspect-[9/16] bg-accent overflow-hidden relative"
      onMouseEnter={() => handleHovered(true)}
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
            className="object-cover absolute -inset-1/2 min-w-[200%] min-h-[200%] blur-3xl opacity-60"
            loading="lazy"
            aria-hidden="true"
          />
          <img
            src={thumb}
            alt={alt}
            className="object-contain absolute inset-0 size-full"
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
                className="absolute bottom-2 right-2 bg-background/50 backdrop-blur-sm p-2 rounded-full [&>svg]:size-4 transition-all hover:bg-accent/50"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMuted(prev => !prev);
                }}
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
    </Link>
  );
}

export function Gallery({
  posts,
}: GalleryProps) {
  const filteredPosts = posts.filter((post) => post.embedImages?.length || post.embedVideo);

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {filteredPosts.map((post) => (
        <GalleryCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
}

export function GallerySkeleton({length}: {length: number}) {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="aspect-[9/16] overflow-hidden relative"
        >
          <Skeleton className="size-full rounded-none" />
        </div>
      ))}
    </div>
  );
}
