import { FC } from 'react';
import { User } from '@/data/users';
import UserAvatar from '../shared/UserAvatar';
import { ProfileTabs } from './ProfileTabs';
import { formatNumber } from '@/utils/number';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
// import FollowButton from '../shared/FollowButton';
// import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user, isCurrentUser }) => {
  // const navigate = useNavigate();

  // const formatDate = (dateStr: string) => {
  //   const date = new Date(dateStr);
  //   return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  // };

  return (
    <>
      <div className="sticky top-0 z-10 bg-background px-4 py-2 flex items-center justify-between">
        <ArrowLeft />
        <div className="text-center text-sm">
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
      {/* <div className="header-blur flex items-center px-4 py-2">
        <button 
          className="icon-button mr-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{user.displayName}</h1>
          <p className="text-sm text-muted-foreground">
            {formatNumber(user.followers)} followers
          </p>
        </div>
      </div> */}

      <div className="px-4 pb-4">
        <div
          className="bg-muted rounded-2xl w-full aspect-[3/1] bg-center bg-cover"
          style={{ backgroundImage: `url(${user.banner})` }}
        />

        <div className="mt-3 grid grid-cols-[1fr_calc(var(--spacing)_*_16)] gap-x-16 items-center">
          <div>
            <h1 className="text-xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <UserAvatar user={user} size="xl" clickable={false} />
        </div>

        <p className="mt-3">{user.bio}</p>

        {/* <div className="flex items-center mt-3 text-muted-foreground text-sm">
          <Calendar size={16} className="mr-1" />
          <span>Joined {formatDate(user.joinDate)}</span>
        </div> */}

        <div className="flex space-x-4 mt-3">
          <div>
            <span className="font-semibold">{formatNumber(user.followers)}</span>
            <span className="text-muted-foreground ml-1">followers</span>
          </div>
          <div>
            <span className="font-semibold">{formatNumber(user.following)}</span>
            <span className="text-muted-foreground ml-1">following</span>
          </div>
        </div>
      </div>

      <ProfileTabs />
    </>
  );
};

export default ProfileHeader;
