import { PropsWithChildren, useState } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmbedToggleProps extends PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
  label: string
}

export function EmbedToggle({
  children,
  label,
  onClick,
  className,
  ...props
}: EmbedToggleProps) {
  const [ showEmbed, setShowEmbed ] = useState(false);

  const handleEmbedToggle = () => {
    setShowEmbed(show => !show);
  };

  return (
    <div
      className={cn("w-fit", className)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      {...props}
    >
      <Button
        size="sm"
        variant="outline"
        onClick={handleEmbedToggle}
      >
        { showEmbed ? <EyeOffIcon /> : <EyeIcon /> }
        { showEmbed ? 'Hide' : 'Show' } {label}
      </Button>

      {showEmbed ? children : null}
    </div>
  );
}
