import { useCallback, useMemo, useState } from 'react'
import { PinIcon, RepeatIcon } from 'lucide-react'
import { UserAvatar } from '../shared/UserAvatar'
import { toast } from "sonner"
import { PostWithAuthor } from '@/types/ResponseSchema'
import { convertRichTextToPlainText } from '@/lib/atp/utils'
import { PostCardActions } from './PostCardActions'
import { PostCardContent } from './PostCardContent'
import { PostCardHeader } from './PostCardHeader'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { isInvalidHandle } from '@/lib/atp/strings/handles'
import { AppBskyFeedDefs } from '@atproto/api'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { copyToClipboard } from '@/utils/clipboard'
import { PostCardProvider, type PostCardContextProps } from './PostCardContext'

interface PostCardProps {
  post: PostWithAuthor
  isDetail?: boolean
  isEmbed?: boolean
}

export function PostCard({
  post,
  isDetail = false,
  isEmbed = false,
}: PostCardProps) {
  const navigate = useNavigate()
  // const { toggleLike, toggleRepost, postLikeStatus, postRepostStatus } = useApp()
  
  // const isLiked = postLikeStatus[post.id]
  // const isReposted = postRepostStatus[post.id]
  const [ isLiked, setIsLiked ] = useState(false)
  const [ isReposted, setIsReposted ] = useState(false)
  const validHandle = useMemo(() => isInvalidHandle(post.author.username) ? post.author.id : post.author.username, [post.author])

  const handlePostClick = (e: React.MouseEvent) => {
    if (isEmbed)
      e.stopPropagation()

    if (!isDetail)
      navigate({
        to: '/profile/$username/post/$postId',
        params: {
          username: validHandle,
          postId: post.uri.split('app.bsky.feed.post/')[1],
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

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const postId = post.uri.split('app.bsky.feed.post/')[1]
    const url = `https://bsky.app/profile/${validHandle}/post/${postId}`
    navigator.share({
      url,
      title: post.content,
    })
  }, [post.content, post.uri, validHandle])

  const handleCopyLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const postId = post.uri.split('app.bsky.feed.post/')[1]
    const url = `https://bsky.app/profile/${validHandle}/post/${postId}`
    copyToClipboard(url).then(() => {
      toast(t`Link copied`, {
        description: t`Post link copied to clipboard`,
        duration: 2000,
      })
    })
  }, [post.uri, validHandle])

  const handleCopyText = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const text = convertRichTextToPlainText(post.content, post.facets)
    copyToClipboard(text).then(() => {
      toast(t`Text copied`, {
        description: t`Post text copied to clipboard`,
        duration: 2000,
      })
    })
  }, [post.content, post.facets])

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast(t`Report submitted`, {
      description: t`Thank you for helping keep our community safe`,
      duration: 2000,
    })
  }

  const handleNotInterested = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast(t`Preference saved`, {
      description: t`You'll see less content like this`,
      duration: 2000,
    })
  }

  const repostedBy = AppBskyFeedDefs.isReasonRepost(post.reason) 
    ? post.reason?.by?.displayName 
    : null

  const contextValue = useMemo<PostCardContextProps>(
    () => ({
      post,
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
    }),
    [handleCopyLink, handleCopyText, handleShare, isDetail, isEmbed, isLiked, isReposted, post]
  )

  return (
    <PostCardProvider value={contextValue}>
      <article
        className={cn(
          "transition-[background-color] rounded-lg",
          !isDetail && "cursor-pointer hover:bg-card active:bg-card/60"
        )}
        onClick={handlePostClick}
      >
        {AppBskyFeedDefs.isReasonPin(post.reason)
        ? (
          <div className="flex items-center gap-x-4 text-sm text-muted-foreground pt-4 px-4 -mb-2">
            <PinIcon className="size-4 ml-6" />
            <Trans>Pinned</Trans>
          </div>
        )
        : null }

        {repostedBy ? (
          <div className="flex items-center gap-x-4 text-sm text-muted-foreground pt-4 px-4 -mb-2">
            <RepeatIcon className="size-4 ml-6" />
            <Trans>Reposted by {repostedBy}</Trans>
          </div>
        ) : null}

        {isDetail || isEmbed ? (
          <div className="p-4">
            <div className="flex items-center gap-x-4">
              <UserAvatar
                username={validHandle}
                displayName={post.author.displayName}
                src={post.author.avatar}
                clickable
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
    </PostCardProvider>
  )
}
