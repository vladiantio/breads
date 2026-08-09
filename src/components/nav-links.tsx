import { NavIconLink } from "./nav-icon-link"
import { Button } from "@/ui/button"
import HomeIcon from '@/icons/home.svg?react'
import SearchIcon from '@/icons/search.svg?react'
import SquarePenIcon from '@/icons/square-pen.svg?react'
import BellIcon from '@/icons/bell.svg?react'
import UserIcon from '@/icons/person-rounded.svg?react'
import { useAtpStore } from "@/lib/atp/store"
import { useTranslation } from "react-i18next"

export function NavLinks() {
  const { isAuthenticated, handle } = useAtpStore()
  const { t } = useTranslation()

  return (
    <>
      <NavIconLink
        icon={HomeIcon}
        label={t("nav.home")}
        to="/"
        fillOnHover
      />

      <NavIconLink
        icon={SearchIcon}
        label={t("nav.search")}
        to="/search"
      />

      <Button
        title={t("nav.newPost")}
        size="icon"
        className="p-6 rounded-full"
      >
        <SquarePenIcon className="size-6" />
      </Button>

      <NavIconLink
        icon={BellIcon}
        label={t("nav.notifications")}
        to={isAuthenticated ? "/notifications" : "/login"}
        fillOnHover
      />

      <NavIconLink
        icon={UserIcon}
        label={t("nav.profile")}
        to={isAuthenticated ? "/profile/$username" : "/login"}
        params={{
          username: handle ?? undefined,
        }}
        fillOnHover
      />
    </>
  )
}
