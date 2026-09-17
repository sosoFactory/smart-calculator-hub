import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#15171a] text-white hover:bg-[#1f2937] dark:bg-slate-100 dark:text-[#112220] dark:hover:bg-white",
        destructive: "bg-rose-600 text-white hover:bg-rose-700",
        outline:
          "border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft bg-white dark:bg-ghost-dark-surface-deep hover:bg-slate-50 dark:hover:bg-ghost-dark-hover text-[#112220] dark:text-ghost-dark-ink",
        secondary:
          "bg-slate-100 dark:bg-ghost-dark-surface-elevated text-[#112220] dark:text-ghost-dark-ink hover:bg-slate-200 dark:hover:bg-dark-border",
        ghost: "hover:bg-slate-100 dark:hover:bg-ghost-dark-hover hover:text-[#112220] dark:hover:text-ghost-dark-ink text-[#334155] dark:text-ghost-dark-ink-soft",
        link: "text-[#15171a] dark:text-[#d1ff19] underline-offset-4 hover:underline",
        lime: "bg-[#d1ff19] text-[#112220] hover:bg-[#bef264] font-bold",
      },
      size: {
        default: "h-[39px] px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "h-9 w-9",
        switch: "h-6 w-11 p-0.5 justify-start",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
