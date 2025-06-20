import { User } from "@/types/ResponseSchema";
import { FC } from "react";
import { UserAvatar } from "../shared/UserAvatar";
import { parseBio } from "@/utils/parseBio";
import { formatNumber } from "@/utils/number";
import VerifiedAccountIcon from '@/icons/verified-account.svg?react';
import { useSimpleVerificationState } from "@/lib/atp/hooks/use-verification";
import { sanitizeHandle } from "@/lib/atp/strings/handles";
import { Trans } from "@lingui/react/macro";

interface ProfileDisplayProps {
  user: User;
}

export const ProfileDisplay: FC<ProfileDisplayProps> = ({ user }) => {
  const { showBadge } = useSimpleVerificationState({ verification: user.verification });

  return (
    <>
      <div className="flex gap-x-4 items-center">
        <UserAvatar 
          username={user.username}
          displayName={user.displayName}
          src={user.avatar}
          size="xl"
        />
        <div>
          <div className="flex items-center gap-x-2">
            <h1 className="text-pretty text-xl font-bold">{user.displayName || user.username}</h1>
            {showBadge && <VerifiedAccountIcon className="size-4" />}
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
  );
};
