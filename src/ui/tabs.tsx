import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tabsTriggerVariants = cva(
  "hover:text-muted-foreground data-active:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "data-active:bg-accent data-active:shadow-xs",
        underline:
          "data-active:after:bg-foreground relative after:absolute after:inset-x-0 after:mx-auto after:max-w-16 after:bottom-0 after:h-0.5 after:rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type TabsContextType = VariantProps<typeof tabsTriggerVariants>

const TabsContext = React.createContext<TabsContextType | null>(null)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("useTabs must be used within a Tabs.")
  }

  return context
}

function Tabs({
  className,
  variant,
  ...props
}: TabsPrimitive.Root.Props & VariantProps<typeof tabsTriggerVariants>) {
  const contextValue = React.useMemo<TabsContextType>(
    () => ({
      variant,
    }),
    [variant]
  )

  return (
    <TabsContext value={contextValue}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </TabsContext>
  )
}

function TabsList({
  className,
  ...props
}: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground/70 inline-flex w-fit items-center justify-center p-0.5",
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.Tab.Props) {
  const { variant } = useTabs()

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, className }))}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
