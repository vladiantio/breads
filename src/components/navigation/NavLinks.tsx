import { NavIconLink } from "./NavIconLink";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import HomeIcon from '@/icons/home.svg?react';
import SearchIcon from '@/icons/search.svg?react';
import SquarePenIcon from '@/icons/square-pen.svg?react';
import BellIcon from '@/icons/bell.svg?react';
import UserIcon from '@/icons/person-rounded.svg?react';
import { LogInIcon } from "lucide-react";
import { useAtpStore } from "@/lib/atp/store";

export const NavLinks: React.FC = () => {
  const { isAuthenticated, session } = useAtpStore();

  return (
    <>
      <NavIconLink 
        icon={HomeIcon}
        label="Home"
        to="/"
        fillOnHover
      />

      {!isAuthenticated && (
        <Button
          title="Log in"
          size="icon"
          className="px-7 py-6"
        >
          <Link to="/login">
            <LogInIcon className="size-6" />
          </Link>
        </Button>
      )}

      <NavIconLink 
        icon={SearchIcon}
        label="Search"
        to="/search"
      />

      {isAuthenticated && (
        <>
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
              username: session?.handle,
            }}
            fillOnHover
          />
        </>
      )}
    </>
  );
}
