import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavIconLink } from "../navigation/NavIconLink";
import { LogInIcon, SettingsIcon } from "lucide-react";
import { t } from "@lingui/core/macro";

const FeedTabs: FC = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const isMobile = useIsMobile();

  return (
    <div className="sticky bg-background top-0 z-10 w-full">
      <div className="h-16 relative flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="m56 128a24 24 0 0 0-24 24 24 24 0 0 0 24 24h64a24 24 0 0 0 24-24 24 24 0 0 0-24-24z"/><path d="m24 64a24 24 0 0 0-24 24 24 24 0 0 0 24 24h128a24 24 0 0 0 24-24 24 24 0 0 0-24-24z"/><path d="m56 0a24 24 0 0 0-24 24 24 24 0 0 0 24 24h64a24 24 0 0 0 24-24 24 24 0 0 0-24-24z"/></svg>
        {isMobile && (
          <>
            <div className="absolute inset-y-0 left-4 flex items-center">
              <NavIconLink
                icon={SettingsIcon}
                label={t`Settings`}
                to="/settings"
              />
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center">
              <NavIconLink
                icon={LogInIcon}
                label={t`Log in`}
                to="/login"
              />
            </div>
          </>
        )}
      </div>
      <Tabs
        variant="underline"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <ScrollArea>
          <TabsList className="p-2 min-w-full">
            <TabsTrigger
              value="discover"
              className="grow"
            >
              {t`Discover`}
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="grow"
            >
              {t`Following`}
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tabs>
    </div>
  )
}

export { FeedTabs };
