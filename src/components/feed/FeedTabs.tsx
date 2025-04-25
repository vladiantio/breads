import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavIconLink } from "../navigation/NavIconLink";
import { LogInIcon, SettingsIcon } from "lucide-react";

const FeedTabs: FC = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const isMobile = useIsMobile();

  return (
    <div className="sticky bg-background top-0 z-10 w-full">
      <div className="h-16 relative flex items-center justify-center">
        <div>🐝</div>
        {isMobile && (
          <>
            <div className="absolute inset-y-0 left-4 flex items-center">
              <NavIconLink
                icon={SettingsIcon}
                label="Settings"
                to="/settings"
              />
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center">
              <NavIconLink
                icon={LogInIcon}
                label="Log in"
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
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="grow"
            >
              Following
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tabs>
    </div>
  )
}

export default FeedTabs;
