import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-1 cursor-pointer",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-ghost-dark-surface-elevated border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft">
      <SliderPrimitive.Range className="absolute h-full bg-[#15171a] dark:bg-[#d1ff19] rounded-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[#15171a] dark:border-[#d1ff19] bg-white dark:bg-ghost-dark-surface-deep transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-105" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
