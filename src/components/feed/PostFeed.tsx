import PostCard from "./PostCard";
import { PostWithAuthor } from "@/types/ResponseSchema";

interface PostFeedProps {
  posts: PostWithAuthor[];
  fromATP?: boolean;
}

export function PostFeed({
  posts,
  fromATP,
}: PostFeedProps) {
  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          fromATP={fromATP}
        />
      ))}
    </>
  );
}
