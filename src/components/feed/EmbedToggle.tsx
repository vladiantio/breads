import { PropsWithChildren, useState } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface EmbedToggleProps extends PropsWithChildren {
  className?: string
  label: string
}

export function EmbedToggle({
  className,
  children,
  label,
}: EmbedToggleProps) {
  const [ showEmbed, setShowEmbed ] = useState(false);

  const handleEmbedToggle = () => {
    setShowEmbed(show => !show);
  };

  return (
    <div
      className={className}
      onClick={(e) => e.stopPropagation()}
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
