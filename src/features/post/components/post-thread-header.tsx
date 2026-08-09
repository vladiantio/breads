import { Button } from "@/ui/button"
import { GoBackButton } from "@/components/go-back-button"
import { PostWithAuthor } from "@/types/response-schema"
import { useTranslation } from "react-i18next"

interface PostThreadHeaderProps {
  post?: PostWithAuthor
}

export function PostThreadHeader({ post }: PostThreadHeaderProps) {
  const { t } = useTranslation()
  return (
    <div className="sticky top-0 z-[2] bg-background px-4 h-16 flex items-center gap-x-4">
      <GoBackButton className="-ml-1" />
      <div className="font-bold flex-1">
        {t("post.thread")}
      </div>
      {post?.viewer?.replyDisabled !== true ? (
        <div className="flex items-center">
          <Button size="sm">
            {t("post.actions.reply")}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
