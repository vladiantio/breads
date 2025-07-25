import { Heart, MessageCircle, Repeat, Repeat1, Share2 } from 'lucide-react'
import { formatNumber } from '@/utils/number'
import { Button } from '@/ui/button'
import { cn } from '@/lib/utils'
import { t } from "@lingui/core/macro"
import { PostCardMenu } from './post-card-menu'
import { usePostCard } from './post-card-context'

export function PostCardActions() {
  const {
    post: {
      likes,
      replies,
      reposts,
      viewer,
    },
    isLiked,
    isReposted,
    onLike,
    onRepost,
    onShare,
    onReply,
  } = usePostCard()

  return (
    <div className="flex items-center justify-between gap-x-1 mt-4 -mx-3">
      <Button
        title={t`Reply`}
        variant="ghost"
        onClick={onReply}
        className="rounded-full"
        disabled={viewer?.replyDisabled}
      >
        <MessageCircle className='size-5' />
        {replies > 0 && (
          <span>{formatNumber(replies)}</span>
        )}
      </Button>

      <Button
        title={t`Repost`}
        variant="ghost"
        className={cn('rounded-full', isReposted && '!text-green-500')}
        onClick={onRepost}
      >
        {isReposted
          ? <Repeat1 className='size-5' />
          : <Repeat className='size-5' />}
        {reposts + (isReposted ? 1 : 0) > 0 && (
          <span>{formatNumber(reposts + (isReposted ? 1 : 0))}</span>
        )}
      </Button>

      <Button
        title={t`Like`}
        variant="ghost"
        className={cn('rounded-full', isLiked && '!text-red-500')}
        onClick={onLike}
      >
        <Heart
          className={cn('size-5', isLiked && 'fill-current')}
        />
        {likes + (isLiked ? 1 : 0) > 0 && (
          <span>{formatNumber(likes + (isLiked ? 1 : 0))}</span>
        )}
      </Button>

      <Button
        title={t`Share`}
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={onShare}
      >
        <Share2 className='size-5' />
      </Button>
      
      <PostCardMenu />
    </div>
  )
}
