import { User } from "@/types/response-schema"
import { UserAvatar } from "@/components/user-avatar"
import { VerifiedBadge } from "./verified-badge"
import { parseBio } from "../utils/parse-bio"
import { formatNumber } from "@/utils/number"
import { sanitizeHandle } from "@/lib/atp/strings/handles"
import { Trans } from "@lingui/react/macro"

interface ProfileDisplayProps {
  user: User
}

export function ProfileDisplay({ user }: ProfileDisplayProps) {
  return (
    <>
      <div className="flex gap-x-4 items-center">
        <div className="shrink-0">
          <UserAvatar
            username={user.username}
            displayName={user.displayName}
            src={user.avatar}
            size="xl"
            expandable
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-x-2">
            <h1 className="text-pretty text-xl font-bold">{user.displayName || user.username}</h1>
            <VerifiedBadge
              className="size-4"
              verification={user.verification}
            />
          </div>
          <div className="text-muted-foreground flex items-center gap-x-2 flex-wrap">
            <div>{sanitizeHandle(user.username, '@')}</div>
            <div aria-hidden="true" role="separator">·</div>
            <div><span className="text-foreground">{formatNumber(user.followers ?? 0)}</span> <Trans>followers</Trans></div>
          </div>
        </div>
      </div>

      {user.bio && (
        <div className="mt-4 text-pretty whitespace-pre-wrap">
          {parseBio(user.bio)}
        </div>
      )}
    </>
  )
}
