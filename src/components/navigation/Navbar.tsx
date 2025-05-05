import { UserAvatar } from '../shared/UserAvatar';
import { LogInIcon, SettingsIcon } from 'lucide-react';
import { NavIconLink } from './NavIconLink';
import { NavLinks } from './NavLinks';
import { useAtpStore } from '@/lib/atp/store';

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAtpStore();
  return (
    <nav
      className="flex flex-col justify-between fixed -ml-22 inset-y-0 p-4"
    >
      <div className="flex flex-col items-center gap-4">
        {isAuthenticated ? (
          <UserAvatar
            size="lg"
            displayName="Guest"
          />
        ) : (
          <NavIconLink
            icon={LogInIcon}
            label="Log in"
            to="/login"
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-4">
        <NavLinks />
      </div>
      <div className="flex flex-col items-center gap-4">
        <NavIconLink 
          icon={SettingsIcon}
          label="Settings"
          to="/settings"
        />
      </div>
    </nav>
  );
};
