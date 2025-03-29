import { cn } from "@/lib/utils";
import { Link, LinkComponentProps } from "@tanstack/react-router";

interface NavIconLinkProps extends LinkComponentProps<"a"> {
  label: string;
  icon: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string, titleId?: string, desc?: string, descId?: string }
  >;
  fillOnHover?: boolean;
};

export const NavIconLink: React.FC<NavIconLinkProps> = ({
  className,
  icon: Icon,
  label,
  fillOnHover = false,
  ...props
}) => (
  <Link
    aria-label={label}
    className={cn(
      "inline-flex items-center justify-center h-9 px-3 py-5 min-w-9 text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground active:bg-accent/60 [&.active]:text-foreground [&_svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[background,color]",
      fillOnHover && "[&.active_svg]:fill-current",
      className
    )}
    title={label}
    {...props}
  >
    <Icon
      width={24}
      height={24}
      strokeWidth={2}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Link>
);
