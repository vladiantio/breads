import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export const ProfileTabs: FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <Tabs className="sticky bg-background top-14 z-10" value={activeTab} onValueChange={setActiveTab}>
      <ScrollArea>
        <TabsList className="rounded-none bg-transparent p-3 min-w-full">
          <TabsTrigger
            value="posts"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:mx-auto after:max-w-16 after:bottom-0 after:-mb-1 after:h-1 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:mx-auto after:max-w-16 after:bottom-0 after:-mb-1 after:h-1 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Replies
          </TabsTrigger>
          <TabsTrigger
            value="reposts"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:mx-auto after:max-w-16 after:bottom-0 after:-mb-1 after:h-1 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Reposts
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  )
}