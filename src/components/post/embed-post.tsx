import { PostWithAuthor } from "@/types/response-schema";
import { PostCard } from "./post-card";

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
