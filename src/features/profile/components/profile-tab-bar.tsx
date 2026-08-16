import { Link } from '@tanstack/react-router'
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/ui/scroll-area"

const tabLinkClass = cn(
  "hover:text-muted-foreground data-active:text-foreground inline-flex items-center justify-center rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap transition-all data-active:after:bg-foreground relative after:absolute after:inset-x-0 after:mx-auto after:max-w-16 after:bottom-0 after:h-0.5 after:rounded-full",
  "grow",
)

interface ProfileTabBarProps {
  username: string
}

export function ProfileTabBar({ username }: ProfileTabBarProps) {
  const { t } = useTranslation()

  const tabList = [
    { value: 'posts', label: t('profile.tabs.posts'), to: '/profile/$username' },
    { value: 'replies', label: t('profile.tabs.replies'), to: '/profile/$username/replies' },
    { value: 'reposts', label: t('profile.tabs.reposts'), to: '/profile/$username/reposts' },
    { value: 'media', label: t('profile.tabs.media'), to: '/profile/$username/media' },
    { value: 'videos', label: t('profile.tabs.videos'), to: '/profile/$username/videos' },
  ]

  return (
    <nav className="bg-background sticky top-16 z-[2]">
      <ScrollArea>
        <div className="text-muted-foreground/70 inline-flex w-fit items-center justify-center p-2 min-w-full">
          {tabList.map((tab) => (
            <Link
              key={`tab-${tab.value}`}
              to={tab.to}
              params={{ username }}
              className={tabLinkClass}
              activeProps={{ 'data-active': true }}
              activeOptions={{ exact: true }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  )
}
