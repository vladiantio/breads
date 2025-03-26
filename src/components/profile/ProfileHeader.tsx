import { FC } from 'react';
import { User } from '@/data/users';
import UserAvatar from '../shared/UserAvatar';
import { ProfileTabs } from './ProfileTabs';
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

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + ' K';
    }
    return num.toString();
  };

  return (
    <>
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

      <div className="px-4">
        <div className="bg-muted rounded-md h-32 w-full"></div>
      </div>

      <div className="px-4 pb-4 relative">
        <div className="flex justify-between items-start">
          <div className="absolute -top-16">
            <UserAvatar user={user} size="xl" clickable={false} />
          </div>

          <div className="flex-1"></div>

          {!isCurrentUser ? (
            <div className="mt-4">
              Follow
              {/* <FollowButton userId={user.id} /> */}
            </div>
          ) : (
            <div className="mt-4">
              <button className="border border-border rounded-full py-1.5 px-4 font-medium">
                Edit profile
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h1 className="text-xl font-bold flex items-center">
            {user.displayName}
          </h1>
          <p className="text-muted-foreground">@{user.username}</p>

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

        <div className="mt-4">
          <ProfileTabs />
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
