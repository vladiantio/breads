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
import { usePostCard } from './post-card-context'
import { isMobileDevice } from '@/lib/browser'
import { Drawer, DrawerContent, DrawerTrigger } from '@/ui/drawer'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/ui/separator'

type AltReaderButtonProps = React.ComponentProps<"button">;

function PostCardMenuButton({
  className,
  onClick: onClickProp,
  ...props
}: AltReaderButtonProps) {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClickProp?.(e)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={onClick}
      {...props}
    >
      <MoreHorizontal className="size-5" />
    </Button>
  )
}

export function PostCardMenu() {
  const {
    onCopyLink,
    onCopyText,
    onNotInterested,
    onReport,
  } = usePostCard()
  const [open, setOpen] = useState(false)
  const isMobile = isMobileDevice()

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <PostCardMenuButton />
        </DrawerTrigger>
        <DrawerContent>
          <div className="flex flex-col pb-6">
            <Button onClick={onCopyLink} className="justify-start h-12" size="lg" variant="ghost">
              <LinkIcon />
              <span><Trans>Copy link</Trans></span>
            </Button>
            <Button onClick={onCopyText} className="justify-start h-12" size="lg" variant="ghost">
              <Copy />
              <span><Trans>Copy text</Trans></span>
            </Button>
            <Separator />
            <Button onClick={onNotInterested} className="justify-start h-12" size="lg" variant="ghost">
              <XCircle />
              <span><Trans>Not interested in this post</Trans></span>
            </Button>
            <Button onClick={onReport} className="justify-start h-12" size="lg" variant="ghost-destructive">
              <Flag />
              <span><Trans>Report post</Trans></span>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    )

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <PostCardMenuButton />
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
