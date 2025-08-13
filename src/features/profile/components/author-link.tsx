import { Link } from "@tanstack/react-router"
import { AuthorHoverCard } from "./author-hover-card"
import { cn } from "@/lib/utils"
import { isInvalidHandle, sanitizeHandle } from "@/lib/atp/strings/handles"
import type { AppBskyActorDefs } from "@atproto/api"
import { VerifiedBadge } from "./verified-badge"

interface AuthorLinkProps {
  did?: string
  username: string
  displayName?: string
  className?: string
  verification?: AppBskyActorDefs.VerificationState
  onlyText?: boolean
}

export function AuthorLink({
  did,
  username,
  displayName,
  className,
  verification,
  onlyText,
}: AuthorLinkProps) {
  const validHandle = isInvalidHandle(username) ? did ?? username : username

  return (
    <div className={cn("inline-flex items-center gap-x-2 overflow-hidden", className)}>
      {onlyText ? (
        <span className="font-semibold text-foreground truncate">{displayName || sanitizeHandle(username)}</span>
      ) : (
        <AuthorHoverCard handle={validHandle}>
          <Link
            to="/profile/$username"
            params={{ username: validHandle }}
            className="font-semibold text-foreground truncate hover:underline active:opacity-60"
            onClick={(e) => e.stopPropagation()}
          >
            {displayName || sanitizeHandle(username)}
          </Link>
        </AuthorHoverCard>
      )}
      <VerifiedBadge
        className="size-3 shrink-0"
        verification={verification}
      />
    </div>
  )
}
