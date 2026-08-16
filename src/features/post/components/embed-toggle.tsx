import { PropsWithChildren, useState } from "react";
import { Button } from "@/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        className={cn("relative z-20", props.className)}
      >
        { showEmbed ? <EyeOffIcon /> : <EyeIcon /> }
        { showEmbed ? t("post.embed.hide") : t("post.embed.show") } {label}
      </Button>

      {showEmbed ? (
        <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      ) : null}
    </>
  );
}
