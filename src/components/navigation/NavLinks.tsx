import { NavIconLink } from "./NavIconLink";
import { Button } from "@/ui/button";
import HomeIcon from '@/icons/home.svg?react';
import SearchIcon from '@/icons/search.svg?react';
import SquarePenIcon from '@/icons/square-pen.svg?react';
import BellIcon from '@/icons/bell.svg?react';
import UserIcon from '@/icons/person-rounded.svg?react';
import { useAtpStore } from "@/lib/atp/store";
import { t } from "@lingui/core/macro";

export const NavLinks: React.FC = () => {
  const { isAuthenticated, session } = useAtpStore();

  return (
    <>
      <NavIconLink 
        icon={HomeIcon}
        label={t`Home`}
        to="/"
        fillOnHover
      />

      <NavIconLink 
        icon={SearchIcon}
        label={t`Search`}
        to="/search"
      />

      {isAuthenticated && (
        <>
          <Button
            title={t`New Post`}
            size="icon"
            className="px-7 py-6"
          >
            <SquarePenIcon className="size-6" />
          </Button>

          <NavIconLink 
            icon={BellIcon}
            label={t`Notifications`}
            to="/notifications"
            fillOnHover
          />

          <NavIconLink 
            icon={UserIcon}
            label={t`Profile`}
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
