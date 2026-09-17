import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[39px] w-full rounded-md border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft bg-white dark:bg-ghost-dark-surface-deep px-3 py-2 text-sm text-[#112220] dark:text-ghost-dark-ink placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-medium transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
