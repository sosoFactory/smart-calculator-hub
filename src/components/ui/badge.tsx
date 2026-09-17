import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border font-semibold leading-normal transition-colors focus:outline-none focus:ring-2 focus:ring-[#15171a] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#15171a] text-white hover:bg-[#1f2937]",
        secondary:
          "border-transparent bg-slate-100 dark:bg-ghost-dark-surface-elevated text-[#112220] dark:text-ghost-dark-ink hover:bg-slate-200 dark:hover:bg-dark-border",
        destructive:
          "border-transparent bg-rose-600 text-white hover:bg-rose-700",
        outline: "border-[#e5e7eb] dark:border-ghost-dark-hairline-soft text-[#334155] dark:text-ghost-dark-ink-soft",
        meta: "border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50/70 dark:bg-ghost-dark-surface-deep text-[#475569] dark:text-ghost-dark-ink-soft",
        lime: "border-transparent bg-[#d1ff19] text-[#112220] font-bold",
        eyebrow: "border-transparent bg-[#d1ff19] text-[#112220] font-bold text-[11px] tracking-widest uppercase px-2 py-0.5 rounded-xs",
        teal: "border-[#e5e7eb] dark:border-ghost-dark-hairline-soft bg-slate-50 dark:bg-ghost-dark-surface-deep text-[#112220] dark:text-ghost-dark-ink",
        indigo: "border-[#15171a] dark:border-ghost-dark-hairline-soft bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "h-5 px-1.5 text-[10px] font-semibold leading-none shrink-0 whitespace-nowrap rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
