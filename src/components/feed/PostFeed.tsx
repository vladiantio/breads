import { PostCard } from "../post/PostCard";
import { PostWithAuthor, User } from "@/types/ResponseSchema";

interface PostFeedProps {
  posts: PostWithAuthor[]
  authorFeed?: User
}

export function PostFeed({
  posts,
  authorFeed,
}: PostFeedProps) {
  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          authorFeed={authorFeed}
        />
      ))}
    </>
  );
}
