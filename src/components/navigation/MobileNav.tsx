import React from 'react';
import { BellIcon, HomeIcon, SearchIcon, SquarePenIcon, UserIcon } from 'lucide-react';
import { NavLink } from './NavLink';
import { Button } from '../ui/button';

export const MobileNav: React.FC = () => {
  return (
    <nav className="sticky bottom-0 inset-x-0 bg-background border-t z-50">
      <div className="flex items-center justify-around p-2">
        <NavLink 
          icon={HomeIcon}
          label="Home"
          to="/"
        />

        <NavLink 
          icon={SearchIcon}
          label="Search"
          to="/search"
        />

        <Button 
          title="New Post"
          className="py-5"
        >
          <SquarePenIcon className="size-6" />
        </Button>

        <NavLink 
          icon={BellIcon}
          label="Notifications"
          to="/notifications"
        />

        <NavLink 
          icon={UserIcon}
          label="Profile"
          to="/profile"
        />
      </div>
    </nav>
  );
};
