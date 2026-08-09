import { User } from "@/types/response-schema"
import { Button } from "@/ui/button"
import { sanitizeHandle } from "@/lib/atp/strings/handles"
import { GoBackButton } from "@/components/go-back-button"
import { FollowButton } from "./follow-button"
import { useTranslation } from "react-i18next"

interface AuthorHeaderProps {
  user: Partial<User>
  isCurrentUser?: boolean
}

export function AuthorHeader({
  user,
  isCurrentUser = false,
}: AuthorHeaderProps) {
  const { t } = useTranslation()
  return (
    <div className="sticky top-0 z-[2] bg-background px-4 h-16 flex items-center justify-between gap-x-4">
      <GoBackButton className="-ml-1" />
      <div className="text-center text-sm overflow-hidden [&>*]:truncate">
        {user.displayName && (
          <p className="font-semibold">{user.displayName}</p>
        )}
        {user.username && (
          <p className="text-muted-foreground">{sanitizeHandle(user.username, "@")}</p>
        )}
      </div>
      <div className="flex items-center">
        {isCurrentUser ? (
          <Button size="sm" variant="outline">
            {t("profile.edit")}
          </Button>
        ) : (
          <FollowButton size="sm" />
        )}
      </div>
    </div>
  )
}
