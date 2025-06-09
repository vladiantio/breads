import { UserAvatar } from '../shared/UserAvatar';
import { LogInIcon, SettingsIcon } from 'lucide-react';
import { NavIconLink } from './NavIconLink';
import { NavLinks } from './NavLinks';
import { useCurrentProfile } from '@/lib/atp/hooks/use-current-profile';
import { t } from "@lingui/core/macro";

export const Navbar: React.FC = () => {
  const {
    data: profile,
    isAuthenticated,
  } = useCurrentProfile();

  return (
    <nav className="flex flex-col justify-between fixed left-0 inset-y-0 p-4">
      <div className="flex flex-col items-center gap-1 p-1 bg-popover rounded-full">
        {isAuthenticated ? (
          <UserAvatar
            size="lg"
            displayName={profile?.displayName}
            username={profile?.username}
            src={profile?.avatar}
          />
        ) : (
          <NavIconLink
            icon={LogInIcon}
            label={t`Log in`}
            to="/login"
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-1 p-1 bg-popover rounded-full">
        <NavLinks />
      </div>
      <div className="flex flex-col items-center gap-1 p-1 bg-popover rounded-full">
        <NavIconLink 
          icon={SettingsIcon}
          label={t`Settings`}
          to="/settings"
        />
      </div>
    </nav>
  );
};
