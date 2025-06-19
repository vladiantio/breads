import { cn } from "@/lib/utils"

function InputAddOns({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/input relative",
        "[&:has([data-slot=text]:first-child)>input]:ps-9",
        "[&:has([data-slot=text]:last-child)>input]:pe-9",
        className
      )}
      role="group"
      {...props}
    >
      {children}
    </div>
  )
}

function InputAddOnLabel({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-muted-foreground/80 pointer-events-none absolute inset-y-0 flex items-center justify-center",
        "first:start-0 first:ps-3",
        "last:end-0 last:pe-3",
        "group-has-[input:focus]/input:text-primary group-has-[input:disabled]/input:opacity-50",
        className
      )}
      data-slot="text"
      role="presentation"
      {...props}
    >
      {children}
    </div>
  )
}

export { InputAddOns, InputAddOnLabel }
