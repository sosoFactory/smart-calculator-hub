import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { ko } from "date-fns/locale"
import "react-day-picker/style.css"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = ko,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn("p-2 sm:p-3 select-none", className)}
      classNames={{
        root: `${defaultClassNames.root} w-full`,
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center h-8",
        caption_label: "inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink tracking-tight pointer-events-none",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 absolute left-1 rounded-lg border-slate-200 dark:border-ghost-dark-hairline text-slate-700 dark:text-slate-200"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 absolute right-1 rounded-lg border-slate-200 dark:border-ghost-dark-hairline text-slate-700 dark:text-slate-200"
        ),
        month_grid: "w-full border-collapse space-y-1 mt-2",
        weekdays: "flex w-full justify-between mb-1",
        weekday:
          "text-slate-400 dark:text-ghost-dark-ink-stone rounded-md w-9 font-medium text-[0.8rem] text-center",
        weeks: "w-full space-y-1",
        week: "flex w-full justify-between mt-1",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium rounded-xl aria-selected:opacity-100 transition-colors hover:bg-slate-100 dark:hover:bg-ghost-dark-hover text-[#112220] dark:text-ghost-dark-ink"
        ),
        selected:
          "!bg-[#d1ff19] !text-[#112220] font-extrabold shadow-sm hover:!bg-[#bef264] rounded-xl",
        today:
          "font-bold text-[#15171a] dark:text-[#d1ff19] ring-1 ring-slate-300 dark:ring-ghost-dark-hairline-bright rounded-xl",
        outside:
          "text-slate-300 dark:text-ghost-dark-ink-mute/50 opacity-50 aria-selected:opacity-30",
        disabled: "text-slate-300 dark:text-ghost-dark-ink-mute/30 opacity-40 cursor-not-allowed",
        hidden: "invisible",
        dropdowns: "flex items-center gap-2 justify-center z-10",
        dropdown_root:
          "relative inline-flex items-center justify-between rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-ghost-dark-surface-deep dark:hover:bg-ghost-dark-hover border border-slate-200 dark:border-ghost-dark-hairline px-2.5 py-1 transition-colors cursor-pointer text-xs font-bold text-[#112220] dark:text-ghost-dark-ink shadow-xs",
        dropdown:
          "absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 appearance-none m-0 p-0 border-0 bg-transparent",
        months_dropdown: "",
        years_dropdown: "",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          if (orientation === "left") {
            return (
              <ChevronLeft
                className={cn("h-4 w-4", chevronClassName)}
                {...chevronProps}
              />
            )
          }
          if (orientation === "down") {
            return (
              <ChevronDown
                className={cn("h-3.5 w-3.5 text-slate-500 dark:text-ghost-dark-ink-stone ml-1", chevronClassName)}
                {...chevronProps}
              />
            )
          }
          return (
            <ChevronRight
              className={cn("h-4 w-4", chevronClassName)}
              {...chevronProps}
            />
          )
        },
      }}

      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
