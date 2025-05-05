import PostCard from "@/components/feed/PostCard";
import AuthorHeader from "@/components/profile/AuthorHeader";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { usePostThread } from "@/lib/atp/hooks/use-post-thread";
import { ThreadResponseSchema } from "@/types/ResponseSchema";
import { Fragment } from "react";

function PostReplies({ replies }: { replies: ThreadResponseSchema[] }) {
  return <>
    {replies.map(reply => (
      reply.post ? (
        <Fragment key={reply.post.id}>
          <PostCard
            post={{
              ...reply.post,
              isThreadParent: reply.replies.length > 0
            }}
            fromATP
          />
          {reply.replies.length > 0 ? (
            <PostReplies
              replies={reply.replies}
            />
          ) : null}
        </Fragment>
      ) : null)
    )}
  </>
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

      {data?.replies ? (
        <PostReplies
          replies={data.replies}
        />
      ) : null}
    </>
  )
}
