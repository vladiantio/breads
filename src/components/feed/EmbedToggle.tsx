import { PropsWithChildren, useState } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface EmbedToggleProps extends PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
  label: string
}

export function EmbedToggle({
  children,
  label,
  onClick,
  ...props
}: EmbedToggleProps) {
  const [ showEmbed, setShowEmbed ] = useState(false);

  const handleEmbedToggle = () => {
    setShowEmbed(show => !show);
  };

  return (
    <div
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
