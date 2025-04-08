import { User } from "@/types/ResponseSchema";
import { FC } from "react";
import UserAvatar from "../shared/UserAvatar";
import { parseBio } from "@/utils/parseBio";
import { formatNumber } from "@/utils/number";

interface ProfileDisplayProps {
  user: User;
}

export const ProfileDisplay: FC<ProfileDisplayProps> = ({ user }) => {
  return (
    <>
      <div className="flex gap-x-4 items-center justify-between">
        <div>
          <h1 className="text-pretty text-xl font-bold">{user.displayName}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
        <UserAvatar user={user} size="xl" clickable={false} />
      </div>

      <div className="mt-3 space-y-3">
        {user.bio.split('\n\n').map((para) => (
          <p className="text-pretty whitespace-pre-wrap">{parseBio(para)}</p>
        ))}
      </div>

      <div className="mt-3">
        <span className="font-semibold">{formatNumber(user.followers)}</span>
        <span className="text-muted-foreground ml-1">followers</span>
      </div>
    </>
  );
};
