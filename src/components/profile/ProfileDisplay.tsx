import { User } from "@/types/ResponseSchema";
import { FC } from "react";
import { UserAvatar } from "../shared/UserAvatar";
import { parseBio } from "@/utils/parseBio";
import { formatNumber } from "@/utils/number";
import VerifiedAccountIcon from '@/icons/verified-account.svg?react';
import { useSimpleVerificationState } from "@/lib/atp/hooks/use-verification";
import { sanitizeHandle } from "@/lib/atp/strings/handles";

interface ProfileDisplayProps {
  user: User;
}

export const ProfileDisplay: FC<ProfileDisplayProps> = ({ user }) => {
  const { showBadge } = useSimpleVerificationState({ verification: user.verification });

  return (
    <>
      <div className="flex gap-x-4 items-center justify-between">
        <div>
          <h1 className="text-pretty text-xl font-bold">{user.displayName || user.username}</h1>
          <p className="text-muted-foreground">{sanitizeHandle(user.username, '@')}</p>
        </div>
        <div className="relative">
          <UserAvatar 
            username={user.username}
            displayName={user.displayName}
            src={user.avatar}
            size="xl"
          />
          {showBadge && (
            <div className="absolute -left-0.5 -bottom-0.5">
              <VerifiedAccountIcon />
            </div>
          )}
        </div>
      </div>

      {user.bio && (
        <div className="mt-4 space-y-3">
          {user.bio.split('\n\n').map((para, i) => (
            <p
              key={`p-${i}`}
              className="text-pretty whitespace-pre-wrap"
            >
              {parseBio(para)}
            </p>
          ))}
        </div>
      )}

      <div className="mt-4">
        <span className="font-semibold">{formatNumber(user.followers ?? 0)}</span>
        <span className="text-muted-foreground ml-1">followers</span>
      </div>
    </>
  );
};
