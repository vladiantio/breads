import { Link } from "@tanstack/react-router";
import { AuthorHoverCard } from "../feed/AuthorHoverCard";
import { cn } from "@/lib/utils";

interface AuthorLinkProps {
  username: string
  className?: string
}

function AuthorLink({
  username,
  className,
}: AuthorLinkProps) {
  return (
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
  );
}

export { AuthorLink };
