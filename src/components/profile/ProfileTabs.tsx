import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export const ProfileTabs: FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <Tabs className="sticky bg-background top-14 z-10" value={activeTab} onValueChange={setActiveTab}>
      <ScrollArea>
        <TabsList className="gap-x-2 rounded-none bg-transparent p-2 min-w-full">
          <TabsTrigger
            value="posts"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-accent data-[state=active]:active:bg-accent/60 data-[state=active]:hover:bg-accent"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-accent data-[state=active]:active:bg-accent/60 data-[state=active]:hover:bg-accent"
          >
            Replies
          </TabsTrigger>
          <TabsTrigger
            value="reposts"
            className="grow data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:rounded-full data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-accent data-[state=active]:active:bg-accent/60 data-[state=active]:hover:bg-accent"
          >
            Reposts
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  )
}