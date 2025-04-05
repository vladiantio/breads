import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export const ProfileTabs: FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <Tabs
      className="sticky bg-background top-14 z-10"
      variant="underline"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <ScrollArea>
        <TabsList className="p-1.5 min-w-full">
          <TabsTrigger
            value="posts"
            className="grow"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="grow"
          >
            Replies
          </TabsTrigger>
          <TabsTrigger
            value="reposts"
            className="grow"
          >
            Reposts
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  )
}