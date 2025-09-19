import { useState } from "react";
import { isMobileDevice } from "@/lib/browser";
import { Drawer, DrawerContent, DrawerTrigger } from "@/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { cn } from "@/lib/utils";

type AltReaderButtonProps = React.ComponentProps<"button">;

function AltReaderButton({
  className,
  ...props
}: AltReaderButtonProps) {
  return (
    <button
      className={cn(
        "dark bg-background/50 text-foreground backdrop-blur-sm py-1.5 px-3 font-bold text-xs rounded-md transition-all hover:bg-accent/50",
        className,
      )}
      {...props}
    >ALT</button>
  )
}

interface AltReaderProps {
  alt: string;
}

export function AltReader({
  alt
}: AltReaderProps) {
  const [open, setOpen] = useState(false);
  const isMobile = isMobileDevice();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <AltReaderButton />
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-6 pb-12 text-pretty whitespace-pre-wrap">{alt}</div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <AltReaderButton />
      </PopoverTrigger>
      <PopoverContent sideOffset={8}>{alt}</PopoverContent>
    </Popover>
  );
}
