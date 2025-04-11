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
      "inline-flex items-center justify-center px-4 py-3 text-muted-foreground rounded-md hover:bg-foreground/10 hover:text-accent-foreground active:bg-foreground/5 [&.active]:text-foreground [&_svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[background,color]",
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
