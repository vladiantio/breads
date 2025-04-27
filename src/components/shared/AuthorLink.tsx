import { Link } from "@tanstack/react-router";
import { AuthorHoverCard } from "../feed/AuthorHoverCard";
import { cn } from "@/lib/utils";
import VerifiedAccountIcon from '@/icons/verified-account.svg?react';
import { isInvalidHandle, sanitizeHandle } from "@/lib/atp/strings/handles";

interface AuthorLinkProps {
  did?: string
  username: string
  displayName?: string
  className?: string
  showVerifiedBadge?: boolean
}

function AuthorLink({
  did,
  username,
  displayName,
  className,
  showVerifiedBadge,
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
          {displayName ?? sanitizeHandle(username)}
        </Link>
      </AuthorHoverCard>
      {showVerifiedBadge && <VerifiedAccountIcon className="ml-2 size-3" />}
    </div>
  );
}

export { AuthorLink };
