import {
  Copy,
  Flag,
  LinkIcon,
  MoreHorizontal,
  XCircle
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { Trans } from '@lingui/react/macro'
import { Button } from '@/ui/button'
import { usePostCard } from './PostCardContext'

export function PostCardMenu() {
  const {
    onCopyLink,
    onCopyText,
    onNotInterested,
    onReport,
  } = usePostCard()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem onClick={onCopyLink} className="cursor-pointer">
          <LinkIcon />
          <span><Trans>Copy link</Trans></span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyText} className="cursor-pointer">
          <Copy />
          <span><Trans>Copy text</Trans></span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNotInterested} className="cursor-pointer">
          <XCircle />
          <span><Trans>Not interested in this post</Trans></span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReport} className="cursor-pointer" variant="destructive">
          <Flag />
          <span><Trans>Report post</Trans></span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
