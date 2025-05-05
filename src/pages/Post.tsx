import PostCard from "@/components/feed/PostCard";
import AuthorHeader from "@/components/profile/AuthorHeader";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { usePostThread } from "@/lib/atp/hooks/use-post-thread";
import { PostWithAuthor, ThreadResponseSchema } from "@/types/ResponseSchema";

function flatReplies(replies: ThreadResponseSchema[]): PostWithAuthor[] {
  return replies.reduce((acc: PostWithAuthor[], reply) => {
    if (reply.post) {
      reply.post.isThreadParent = reply.replies.length > 0;
      return [...acc, reply.post];
    }
    if (reply.replies.length > 0) {
      return [...acc, ...flatReplies(reply.replies)];
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

  return (
    <>
      <AuthorHeader
        user={data?.post?.author ?? {}}
      />

      {data?.post ? (
        <PostCard
          post={data.post}
          fromATP
          isDetail
        />
      ) : null}

      {data?.replies ? flatReplies(data.replies).map(post => (
        <PostCard
          key={post.id}
          post={post}
          fromATP
        />
      )) : null}
    </>
  )
}
