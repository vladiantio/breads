import { FC } from 'react';
import { User } from '@/types/ResponseSchema';
import UserAvatar from '../shared/UserAvatar';
import { ProfileTabs } from './ProfileTabs';
import { formatNumber } from '@/utils/number';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { parseBio } from '@/utils/parseBio';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user, isCurrentUser }) => {
  const { history } = useRouter();

  return (
    <>
      <div className="sticky top-0 z-10 bg-background px-3 h-14 flex items-center justify-between gap-x-3">
        <Button
          variant="ghost"
          className="rounded-full !p-2"
          onClick={() => history.go(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="text-center text-sm overflow-hidden [&>*]:truncate">
          <p className="font-bold">{user.displayName}</p>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
        <div className="flex items-center">
          {!isCurrentUser ? (
            <Button size="sm">
              Follow
            </Button>
          ) : (
            <Button size="sm" variant="outline">
              Edit profile
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        {user.banner ? (
          <div
            className="bg-muted rounded-2xl w-full aspect-[3/1] bg-center bg-cover mb-3"
            style={{ backgroundImage: `url(${user.banner})` }}
          />
        ) : null}

        <div className="flex gap-x-4 items-center justify-between">
          <div className="overflow-hidden [&>*]:truncate">
            <h1 className="text-xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <UserAvatar user={user} size="xl" clickable={false} />
        </div>

        <div className="mt-3 space-y-3">
          {user.bio.split('\n\n').map((para) => (
            <p className="whitespace-pre-wrap">{parseBio(para)}</p>
          ))}
        </div>

        <div className="mt-3">
          <span className="font-semibold">{formatNumber(user.followers)}</span>
          <span className="text-muted-foreground ml-1">followers</span>
        </div>
      </div>

      <ProfileTabs />
    </>
  );
};

export default ProfileHeader;
