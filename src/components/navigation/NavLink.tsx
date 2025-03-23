import { cn } from "@/lib/utils";
import { SvgIcon } from "@/types/SvgIcon";
import { Link, LinkComponentProps } from "@tanstack/react-router";

interface NavLinkProps extends LinkComponentProps<"a"> {
  label: string;
  icon: SvgIcon;
};

export const NavLink: React.FC<NavLinkProps> = ({
  className,
  icon: Icon,
  label,
  ...props
}) => (
  <Link
    aria-label={label}
    className={cn("inline-flex items-center justify-center h-9 px-3 py-5 min-w-9 rounded-md text-sm font-medium hover:bg-muted [&.active]:bg-accent [&.active]:text-accent-foreground [&_svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow]", className)}
    title={label}
    {...props}
  >
    <Icon size={24} />
  </Link>
);
