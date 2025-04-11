import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const FeedTabs: FC = () => {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <Tabs
      className="sticky bg-background top-0 z-10"
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
  )
}

export default FeedTabs;
