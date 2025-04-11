import React from 'react';
import HomeIcon from '@/icons/home.svg?react';
import SearchIcon from '@/icons/search.svg?react';
import SquarePenIcon from '@/icons/square-pen.svg?react';
import BellIcon from '@/icons/bell.svg?react';
import UserIcon from '@/icons/person-rounded.svg?react';
import { NavIconLink } from './NavIconLink';
import { Button } from '../ui/button';
import { getCurrentUser } from '@/data/users';

export const MobileNav: React.FC = () => {
  return (
    <>
      <nav className="sticky bottom-0 inset-x-0 z-50 pb-8 px-4">
        <div className="flex items-center justify-around p-2 bg-card/75 backdrop-blur-lg rounded-2xl mx-auto max-w-sm">
          <NavIconLink 
            icon={HomeIcon}
            label="Home"
            to="/"
            fillOnHover
          />

          <NavIconLink 
            icon={SearchIcon}
            label="Search"
            to="/search"
          />

          <Button 
            title="New Post"
            size="icon"
            className="px-7 py-6"
          >
            <SquarePenIcon className="size-6" />
          </Button>

          <NavIconLink 
            icon={BellIcon}
            label="Notifications"
            to="/notifications"
            fillOnHover
          />

          <NavIconLink 
            icon={UserIcon}
            label="Profile"
            to="/profile/$username"
            params={{
              username: getCurrentUser().username,
            }}
            fillOnHover
          />
        </div>
      </nav>
      <div className="fixed bottom-0 inset-x-0 z-40 h-16 mask-t-from-0% mask-t-to-100% bg-background"/>
    </>
  );
};
