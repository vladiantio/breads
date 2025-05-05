import PostCard from "@/components/feed/PostCard";
import AuthorHeader from "@/components/profile/AuthorHeader";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { usePostThread } from "@/lib/atp/hooks/use-post-thread";
import { PostWithAuthor, ThreadResponseSchema, User } from "@/types/ResponseSchema";

function flatParent(parent: ThreadResponseSchema): PostWithAuthor[] {
  const posts: PostWithAuthor[] = [];

  if (parent.parent)
    posts.push(...flatParent(parent.parent));

  if (parent.post)
    posts.push({
      ...parent.post,
      isThreadParent: true
    });

  return posts;
}

function flatReplies(replies: ThreadResponseSchema[], author: User, depth: number = 0): PostWithAuthor[] {
  return replies
    .slice(depth > 0 ? -8 : 0)
    .reduce((acc: PostWithAuthor[], reply, index) => {
      const limitReplyDepth = depth > 0 && author.id !== reply.post?.author.id;
      if (reply.post) {
        acc.push({
          ...reply.post,
          isThreadParent: reply.replies.length > 0 || (depth > 0 && index < replies.length - 1),
        });
        if (!limitReplyDepth && reply.replies.length > 0) {
          acc.push(...flatReplies(reply.replies, author, depth + 1));
        }
      }
      return acc;
    }, []);
}

export function Post({ uri }: { uri: string }) {
  const {
    data,
    isLoading,
  } = usePostThread({ uri });

  useDocumentTitle(data?.post && (
    data.post.content || `${data.post.embedImages ? `Image${data.post.embedImages.length > 1 ? 's' : ''}` : data.post.embedVideo ? 'Video' : 'Media'} posted by ${(data.post.author.displayName ? `${data.post.author.displayName} (@${data.post.author.username})` : `@${data.post.author.username}`)}`
  ));

  if (isLoading)
    return "Loading...";

  if (!data)
    return "No data";

  return (
    <>
      <AuthorHeader
        user={data.post?.author ?? {}}
      />

      {data.parent ? flatParent(data.parent).map(post => (
        <PostCard
          key={post.id}
          post={post}
          fromATP
        />
      )) : null}

      {data.post ? (
        <PostCard
          post={data.post}
          fromATP
          isDetail
        />
      ) : null}

      {data.post && data.replies ? flatReplies(data.replies, data.post.author).map(post => (
        <PostCard
          key={post.id}
          post={post}
          fromATP
        />
      )) : null}
    </>
  )
}
