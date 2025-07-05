import { PostWithAuthor } from "@/types/ResponseSchema";
import { PostCard } from "./PostCard";

interface EmbedPostProps {
  post: PostWithAuthor
}

export function EmbedPost({ post }: EmbedPostProps) {
  return (
    <div className="bg-background border rounded-lg">
      <PostCard
        post={post}
        isEmbed
      />
    </div>
  );
}
