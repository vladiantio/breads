import { PostFeed } from "@/components/feed/post-feed";
import { PostCard } from "@/components/post/post-card";
import { PostThreadHeader } from "@/components/post/post-thread-header";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { usePostThread } from "@/lib/atp/hooks/use-post-thread";
import { PostWithAuthor, ThreadResponseSchema, User } from "@/types/response-schema";

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
  const slicedReplies = replies.slice(0, depth > 0 ? 2 : undefined);

  return slicedReplies.reduce((acc: PostWithAuthor[], reply, index) => {
    if (reply.post) {
      const showReplies = reply.replies.length > 0 && (depth === 0 || author.id === reply.post?.author.id);
      acc.push({
        ...reply.post,
        isThreadParent: showReplies || (depth > 0 && slicedReplies.length > 1 && index < slicedReplies.length - 1),
      });
      if (showReplies) {
        const repliesAuthor = reply.replies.filter(r => r.post?.author.id === author.id);
        acc.push(...flatReplies(repliesAuthor.length > 0 ? repliesAuthor : reply.replies, author, depth + 1));
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
      <PostThreadHeader />

      {data.parent ? flatParent(data.parent).map(post => (
        <PostCard
          key={post.id}
          post={post}
        />
      )) : null}

      {data.post ? (
        <PostCard
          post={data.post}
          isDetail
        />
      ) : null}

      {data.post && data.replies ? (
        <PostFeed
          posts={flatReplies(data.replies, data.post.author)}
        />
      ) : null}
    </>
  )
}
