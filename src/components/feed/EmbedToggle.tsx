import { PropsWithChildren, useState } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface EmbedToggleProps extends PropsWithChildren, React.HTMLAttributes<HTMLButtonElement> {
  label: string
}

export function EmbedToggle({
  children,
  label,
  onClick,
  ...props
}: EmbedToggleProps) {
  const [ showEmbed, setShowEmbed ] = useState(false);

  const handleEmbedToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowEmbed(show => !show);
    onClick?.(e);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={handleEmbedToggle}
        {...props}
      >
        { showEmbed ? <EyeOffIcon /> : <EyeIcon /> }
        { showEmbed ? 'Hide' : 'Show' } {label}
      </Button>

      {showEmbed ? (
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      ) : null}
    </>
  );
}
