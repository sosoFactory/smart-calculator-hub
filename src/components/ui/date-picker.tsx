import * as React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { parseLocalDate } from "../../utils/dateCalculator"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface DatePickerProps {
  value?: string // YYYY-MM-DD
  onChange?: (dateString: string) => void
  placeholder?: string
  className?: string
  id?: string
  disabled?: boolean
  startYear?: number
  endYear?: number
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "날짜를 선택하세요",
  className,
  id,
  disabled = false,
  startYear = 1920,
  endYear = 2100,
}) => {
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => (value ? parseLocalDate(value) : undefined), [value])

  const handleSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const formatted = format(date, "yyyy-MM-dd")
      onChange(formatted)
      setOpen(false)
    }
  }

  const handleSetToday = (e: React.MouseEvent) => {
    e.stopPropagation()
    const today = new Date()
    if (onChange) {
      onChange(format(today, "yyyy-MM-dd"))
      setOpen(false)
    }
  }

  const displayText = React.useMemo(() => {
    if (!selectedDate) return placeholder
    try {
      return format(selectedDate, "yyyy-MM-dd (eee)", { locale: ko })
    } catch {
      return value || placeholder
    }
  }, [selectedDate, value, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-slate-900/60 text-sm font-bold text-[#112220] dark:text-slate-100 flex items-center justify-between transition-all hover:bg-slate-100/70 dark:hover:bg-ghost-dark-hover focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] text-left",
            !value && "text-slate-400 dark:text-ghost-dark-ink-stone font-normal",
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <CalendarIcon className="w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0" />
            <span className="truncate tabular-nums">{displayText}</span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 dark:text-ghost-dark-ink-stone bg-slate-200/50 dark:bg-ghost-dark-surface-deep px-1.5 py-0.5 rounded-md shrink-0">
            선택
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto p-0 border border-slate-200 dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface-drawer shadow-2xl rounded-2xl overflow-hidden"
      >
        <div className="p-2 border-b border-slate-100 dark:border-ghost-dark-hairline flex items-center justify-between bg-slate-50/50 dark:bg-ghost-dark-surface-deep/40">
          <span className="text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute px-1">
            달력에서 날짜 선택
          </span>
          <button
            type="button"
            onClick={handleSetToday}
            className="text-[11px] font-bold text-[#112220] dark:text-[#d1ff19] hover:underline px-2 py-0.5 rounded"
          >
            오늘로 지정
          </button>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          defaultMonth={selectedDate || new Date()}
          captionLayout="dropdown"
          startMonth={new Date(startYear, 0)}
          endMonth={new Date(endYear, 11)}
        />
      </PopoverContent>
    </Popover>
  )
}
