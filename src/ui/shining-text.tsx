import { cn } from "@/lib/utils"

type ShiningTextProps = React.ComponentProps<'div'> & {
  disabled?: boolean
  duration?: number
}

export function ShiningText({
  children,
  disabled = false,
  duration = 2,
  className
}: ShiningTextProps) {
  return (
    <div
      className={cn(
        "inline-block bg-clip-text text-transparent",
        "bg-gradient-to-r from-foreground from-40% via-foreground/40 via-50% to-foreground to-60%",
        !disabled && "animate-shine",
        className
      )}
      style={{
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: `${duration}s`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
