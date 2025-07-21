import { Button } from "@/ui/button"
import { Trans } from "@lingui/react/macro"
import { GoBackButton } from "../shared/go-back-button"
import { PostWithAuthor } from "@/types/response-schema"

interface PostThreadHeaderProps {
  post?: PostWithAuthor
}

export function PostThreadHeader({ post }: PostThreadHeaderProps) {
  return (
    <div className="sticky top-0 z-[2] bg-background px-4 h-16 flex items-center gap-x-4">
      <GoBackButton className="-ml-1" />
      <div className="font-bold flex-1">
        <Trans>Thread</Trans>
      </div>
      {post?.viewer?.replyDisabled !== true ? (
        <div className="flex items-center">
          <Button size="sm">
            <Trans>Reply</Trans>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
