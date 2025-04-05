import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const FeedTabs: FC = () => {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <Tabs className="sticky bg-background top-0 z-10" value={activeTab} onValueChange={setActiveTab}>
      <ScrollArea>
        <TabsList className="rounded-none bg-transparent p-3 min-w-full">
          <TabsTrigger
            value="discover"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:mx-auto after:max-w-16 after:bottom-0 after:-mb-1 after:h-1 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Discover
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:mx-auto after:max-w-16 after:bottom-0 after:-mb-1 after:h-1 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Following
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  )
}

export default FeedTabs;
