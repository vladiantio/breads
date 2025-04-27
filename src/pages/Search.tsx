import { AuthorLink } from "@/components/shared/AuthorLink";
import UserAvatar from "@/components/shared/UserAvatar";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { InputGroup, InputGroupText } from "@/components/ui/input";
import SearchIcon from '@/icons/search.svg?react';
import { useActorsSearch } from "@/lib/atp/hooks/use-actors-search";
import { useSimpleVerificationState } from "@/lib/atp/hooks/use-verification";
import { isInvalidHandle, sanitizeHandle } from "@/lib/atp/strings/handles";
import { AppBskyActorDefs } from "@atproto/api";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

function AuthorItem({
  actor
}: {
  actor: AppBskyActorDefs.ProfileViewBasic
}) {
  const navigate = useNavigate();
  const { showBadge } = useSimpleVerificationState({ verification: actor.verification });

  return (
    <div
      key={actor.did}
      className="flex gap-x-4 items-center p-4 transition-[background-color] rounded-lg hover:bg-card active:bg-card/60"
      role="button"
      onClick={() => {
        navigate({
          to: '/profile/$username',
          params: {
            username: isInvalidHandle(actor.handle) ? actor.did : actor.handle,
          },
        });
      }}
    >
      <UserAvatar
        username={actor.handle}
        displayName={actor.displayName}
        src={actor.avatar}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <AuthorLink
          did={actor.did}
          displayName={actor.displayName}
          username={actor.handle}
          showVerifiedBadge={showBadge}
        />
        <p className="text-muted-foreground truncate">{sanitizeHandle(actor.handle, '@')}</p>
      </div>
    </div>
  )
}

export function Search() {
  const [query, setQuery] = useState('');
  const {
    data,
  } = useActorsSearch({ q: query });

  return (
    <>
      <div className="p-4">
        <InputGroup>
          <InputGroupText>
            <SearchIcon width={16} height={16} />
          </InputGroupText>
          <DebouncedInput
            autoFocus
            className="h-12 rounded-xl"
            placeholder="Search..."
            value={query}
            onChange={(value) => setQuery(String(value))}
          />
        </InputGroup>
      </div>

      {data?.map((actor) => (
        <AuthorItem actor={actor} />
      ))}
    </>
  )
}
