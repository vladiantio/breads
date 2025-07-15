import { Link } from "@tanstack/react-router";
import { AuthorHoverCard } from "../profile/author-hover-card";
import { cn } from "@/lib/utils";
import { isInvalidHandle, sanitizeHandle } from "@/lib/atp/strings/handles";
import type { AppBskyActorDefs } from "@atproto/api";
import { VerifiedBadge } from "./verified-badge";

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
  const validHandle = isInvalidHandle(username) ? did ?? username : username;

  return (
    <div className="inline-flex items-center overflow-hidden">
      {onlyText ? (
        <span className="font-semibold text-foreground truncate">{displayName || sanitizeHandle(username)}</span>
      ) : (
        <AuthorHoverCard handle={validHandle}>
          <Link
            to="/profile/$username"
            params={{ username: validHandle }}
            className={cn("font-semibold text-foreground hover:underline active:opacity-60 truncate", className)}
            onClick={(e) => e.stopPropagation()}
          >
            {displayName || sanitizeHandle(username)}
          </Link>
        </AuthorHoverCard>
      )}
      <VerifiedBadge
        className="ml-2 size-3"
        verification={verification}
      />
    </div>
  );
}
