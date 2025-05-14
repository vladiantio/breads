import { PostCard } from "./PostCard";
import { PostWithAuthor } from "@/types/ResponseSchema";

interface PostFeedProps {
  posts: PostWithAuthor[];
}

export function PostFeed({
  posts,
}: PostFeedProps) {
  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </>
  );
}
