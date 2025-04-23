import { Link } from "@tanstack/react-router";
import { AuthorHoverCard } from "../feed/AuthorHoverCard";
import { cn } from "@/lib/utils";
import VerifiedAccountIcon from '@/icons/verified-account.svg?react';

interface AuthorLinkProps {
  username: string
  className?: string
  showVerifiedBadge?: boolean
}

function AuthorLink({
  username,
  className,
  showVerifiedBadge,
}: AuthorLinkProps) {
  return (
    <div className="inline-flex items-center">
      <AuthorHoverCard handle={username}>
        <Link
          to="/profile/$username"
          params={{ username }}
          className={cn("font-semibold text-foreground hover:underline active:opacity-60 truncate", className)}
          onClick={(e) => e.stopPropagation()}
        >
          {username}
        </Link>
      </AuthorHoverCard>
      {showVerifiedBadge && <VerifiedAccountIcon className="ml-2 size-3" />}
    </div>
  );
}

export { AuthorLink };
