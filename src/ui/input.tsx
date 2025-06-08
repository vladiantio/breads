import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-input/30 border border-transparent flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "group-has-[[data-slot=text]:first-child]/input:ps-9",
        "group-has-[[data-slot=text]:last-child]/input:pe-9",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function InputGroup({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("group/input relative", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function InputGroupText({ className, children, ...props }: React.ComponentProps<"div">) {
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
      {...props}
    >
      {children}
    </div>
  )
}

export { Input, InputGroup, InputGroupText }
