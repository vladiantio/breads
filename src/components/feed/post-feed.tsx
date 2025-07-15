import { PostCard } from "../post/post-card";
import { PostWithAuthor, User } from "@/types/response-schema";

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
