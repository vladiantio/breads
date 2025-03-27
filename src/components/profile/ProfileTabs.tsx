import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export const ProfileTabs: FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <Tabs className="sticky bg-background top-14 z-10" value={activeTab} onValueChange={setActiveTab}>
      <ScrollArea>
        <TabsList className="gap-2 rounded-none border-b bg-transparent px-0 py-1 min-w-full">
          <TabsTrigger
            value="posts"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Replies
          </TabsTrigger>
          <TabsTrigger
            value="reposts"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Reposts
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  )
}