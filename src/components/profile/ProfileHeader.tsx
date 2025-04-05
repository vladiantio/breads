import { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { User } from '@/types/ResponseSchema';
import { Button } from '../ui/button';
import { ProfileDisplay } from './ProfileDisplay';
import { ProfileTabs } from './ProfileTabs';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user, isCurrentUser }) => {
  const { history } = useRouter();

  return (
    <>
      <div className="sticky top-0 z-10 bg-background px-4 h-14 flex items-center justify-between gap-x-3">
        <Button
          variant="ghost"
          className="rounded-full !p-2 -ml-1"
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

        <ProfileDisplay user={user} />
      </div>

      <ProfileTabs />
    </>
  );
};

export default ProfileHeader;
