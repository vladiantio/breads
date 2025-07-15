import { FC } from 'react';
import { User } from '@/types/response-schema';
import { ProfileDisplay } from './profile-display';
import { AuthorHeader } from './author-header';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user, isCurrentUser }) => {
  return (
    <>
      <AuthorHeader
        user={user}
        isCurrentUser={isCurrentUser}
      />

      <div className="px-4 pb-4">
        {user.banner ? (
          <div
            className="bg-muted rounded-2xl w-full aspect-[3/1] bg-center bg-cover mb-4"
            style={{ backgroundImage: `url(${user.banner})` }}
          />
        ) : null}

        <ProfileDisplay user={user} />
      </div>
    </>
  );
};

export { ProfileHeader };
