import { useState } from "react"
import { PinIcon, RepeatIcon } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { toast } from "sonner"
import { PostWithAuthor, User } from "@/types/response-schema"
import { convertRichTextToPlainText } from "@/lib/atp/utils"
import { PostCardActions } from "./post-card-actions"
import { PostCardContent } from "./post-card-content"
import { PostCardHeader } from "./post-card-header"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { isInvalidHandle } from "@/lib/atp/strings/handles"
import { AppBskyFeedDefs } from "@atcute/bluesky"
import { isType } from "@/lib/atp/types/is-type"
import { copyToClipboard } from "@/utils/clipboard"
import { PostCardContext, type PostCardContextProps } from "./post-card-context"
import { useTranslation } from "react-i18next"

interface PostCardProps {
  post: PostWithAuthor
  isDetail?: boolean
  isEmbed?: boolean
  authorFeed?: User
}

export function PostCard({
  post,
  isDetail = false,
  isEmbed = false,
  authorFeed,
}: PostCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  // const { toggleLike, toggleRepost, postLikeStatus, postRepostStatus } = useApp()

  // const isLiked = postLikeStatus[post.id]
  // const isReposted = postRepostStatus[post.id]
  const [ isLiked, setIsLiked ] = useState(false)
  const [ isReposted, setIsReposted ] = useState(false)
  const validHandle = isInvalidHandle(post.author.username) ? post.author.id : post.author.username
  const isSameAuthorFeed = authorFeed ? post.author.id == authorFeed.id : false

  const handlePostClick = (e: React.MouseEvent) => {
    if (isEmbed)
      e.stopPropagation()

    if (!isDetail)
      navigate({
        to: "/profile/$username/post/$postId",
        params: {
          username: validHandle,
          postId: post.uri.split("app.bsky.feed.post/")[1],
        },
      })
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(status => !status)
    // toggleLike(post.id)
  }

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsReposted(status => !status)
    // toggleRepost(post.id)
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    // navigate(`/post/${post.id}`)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const postId = post.uri.split("app.bsky.feed.post/")[1]
    const url = `https://bsky.app/profile/${validHandle}/post/${postId}`
    navigator.share({
      url,
      title: post.content,
    })
  }

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    const postId = post.uri.split("app.bsky.feed.post/")[1]
    const url = `https://bsky.app/profile/${validHandle}/post/${postId}`
    copyToClipboard(url).then(() => {
      toast(t("toast.linkCopied"), {
        description: t("toast.linkCopiedDescription"),
        duration: 2000,
      })
    })
  }

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation()
    const text = convertRichTextToPlainText(post.content, post.facets)
    copyToClipboard(text).then(() => {
      toast(t("toast.textCopied"), {
        description: t("toast.textCopiedDescription"),
        duration: 2000,
      })
    })
  }

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast(t("toast.reportSubmitted"), {
      description: t("toast.reportSubmittedDescription"),
      duration: 2000,
    })
  }

  const handleNotInterested = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast(t("toast.preferenceSaved"), {
      description: t("toast.preferenceSavedDescription"),
      duration: 2000,
    })
  }

  const repostedBy = isType<AppBskyFeedDefs.ReasonRepost>(post.reason, 'app.bsky.feed.defs#reasonRepost')
    ? post.reason?.by?.displayName
    : null

  const contextValue: PostCardContextProps = {
    post,
    isSameAuthorFeed,
    isLiked,
    isReposted,
    onLike: handleLike,
    onRepost: handleRepost,
    onShare: handleShare,
    onReply: handleReply,
    onCopyLink: handleCopyLink,
    onCopyText: handleCopyText,
    onNotInterested: handleNotInterested,
    onReport: handleReport,
    isDetail,
    isEmbed,
  }

  return (
    <PostCardContext value={contextValue}>
      <article
        className={cn(
          "transition-[background-color] rounded-lg",
          !isDetail && "cursor-pointer hover:bg-card active:bg-card/60"
        )}
        onClick={handlePostClick}
      >
        {isType<AppBskyFeedDefs.ReasonPin>(post.reason, 'app.bsky.feed.defs#reasonPin')
        ? (
          <div className="flex items-center gap-x-4 text-sm text-muted-foreground pt-4 px-4 -mb-2">
            <PinIcon className="size-4 ml-6" />
            {t("post.pinned")}
          </div>
        )
        : null }

        {repostedBy ? (
          <div className="flex items-center gap-x-4 text-sm text-muted-foreground pt-4 px-4 -mb-2">
            <RepeatIcon className="size-4 ml-6" />
            {t("post.repostedBy", { repostedBy })}
          </div>
        ) : null}

        {isDetail || isEmbed ? (
          <div className="p-4">
            <div className="flex items-center gap-x-4">
              <UserAvatar
                username={validHandle}
                displayName={post.author.displayName}
                src={post.author.avatar}
                clickable={!isSameAuthorFeed}
              />
              <div className="flex-1 min-w-0">
                <PostCardHeader />
              </div>
            </div>
            <PostCardContent />
            <PostCardActions />
          </div>
        ) : (
          <div className="flex p-4 gap-x-4">
            <div className="flex flex-col items-center relative">
              {post.isThreadParent ? (
                <div className="w-0.5 bg-border rounded-full absolute top-12 -bottom-8" />
              ) : null}
              <div className="h-12 content-center">
                <UserAvatar
                  username={validHandle}
                  displayName={post.author.displayName}
                  src={post.author.avatar}
                  clickable
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <PostCardHeader />
              <PostCardContent />
              <PostCardActions />
            </div>
          </div>
        )}
      </article>
    </PostCardContext>
  )
}
