import { AuthorLink } from "@/components/shared/author-link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { DebouncedInput } from "@/ui/debounced-input";
import { InputAddOns, InputAddOnLabel } from "@/ui/input-add-ons";
import SearchIcon from '@/icons/search.svg?react';
import { useActorsSearch } from "@/lib/atp/hooks/use-actors-search";
import { isInvalidHandle, sanitizeHandle } from "@/lib/atp/strings/handles";
import { AppBskyActorDefs } from "@atproto/api";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { t } from "@lingui/core/macro";

function AuthorItem({
  actor
}: {
  actor: AppBskyActorDefs.ProfileViewBasic
}) {
  const navigate = useNavigate();

  return (
    <div
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
          verification={actor.verification}
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
        <InputAddOns>
          <InputAddOnLabel>
            <SearchIcon width={16} height={16} />
          </InputAddOnLabel>
          <DebouncedInput
            autoFocus
            className="h-12 rounded-xl"
            placeholder={t`Search...`}
            value={query}
            onChange={(value) => setQuery(String(value))}
          />
        </InputAddOns>
      </div>

      {data?.map((actor) => (
        <AuthorItem
          key={actor.did}
          actor={actor}
        />
      ))}
    </>
  )
}
