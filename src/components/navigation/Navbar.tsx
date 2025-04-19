import React from 'react';
import UserAvatar from '../shared/UserAvatar';
import { SettingsIcon } from 'lucide-react';
import { NavIconLink } from './NavIconLink';
import { NavLinks } from './NavLinks';

export const Navbar: React.FC = () => {
  return (
    <nav
      className="flex flex-col justify-between fixed -ml-22 inset-y-0 p-4"
    >
      <div className="flex flex-col items-center gap-4">
        <UserAvatar
          size="lg"
          displayName="Guest"
        />
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
