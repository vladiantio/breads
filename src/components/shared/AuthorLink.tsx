import { Link } from "@tanstack/react-router";
import { AuthorHoverCard } from "../profile/AuthorHoverCard";
import { cn } from "@/lib/utils";
import { isInvalidHandle, sanitizeHandle } from "@/lib/atp/strings/handles";
import type { AppBskyActorDefs } from "@atproto/api";
import { VerifiedBadge } from "./VerifiedBadge";

interface AuthorLinkProps {
  did?: string
  username: string
  displayName?: string
  className?: string
  verification?: AppBskyActorDefs.VerificationState
}

export function AuthorLink({
  did,
  username,
  displayName,
  className,
  verification,
}: AuthorLinkProps) {
  const validHandle = isInvalidHandle(username) ? did ?? username : username;

  return (
    <div className="inline-flex items-center overflow-hidden">
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
      <VerifiedBadge
        className="ml-2 size-3"
        verification={verification}
      />
    </div>
  );
}
