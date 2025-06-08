import { useState } from "react";
import { PostWithAuthor } from "@/types/ResponseSchema";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/ui/skeleton";
import { FilmIcon, ImageIcon, ImagesIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { HLSPlayer } from "../shared/HLSPlayer";
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
            className="absolute bottom-2 right-2 bg-background/50 backdrop-blur p-2 rounded-full [&>svg]:size-4"
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
      {post.embedVideo && (
        <div className="absolute top-2 right-2 bg-background/50 backdrop-blur p-2 rounded-full [&>svg]:size-4">
          <FilmIcon />
        </div>
      )}
      {post.embedImages?.length && (post.embedImages.length > 1 ? (
        <div className="absolute top-2 right-2 bg-background/50 backdrop-blur p-2 rounded-full [&>svg]:size-4">
          <ImagesIcon />
        </div>
      ) : (
        <div className="absolute top-2 right-2 bg-background/50 backdrop-blur p-2 rounded-full [&>svg]:size-4">
          <ImageIcon />
        </div>
      ))}
    </Link>
  );
}

export function Gallery({
  posts,
}: GalleryProps) {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.filter((post: PostWithAuthor) => post.embedImages?.length || post.embedVideo).map((post: PostWithAuthor) => (
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
