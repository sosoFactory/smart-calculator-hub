import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { parseLocalDate } from "../../utils/dateCalculator"
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
  showTodayButton?: boolean
}

/**
 * YYYY-MM-DD 형식의 실제 달력 상 유효한 날짜인지 검증
 */
const isValidDateString = (str: string): boolean => {
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return false
  const y = parseInt(match[1], 10)
  const m = parseInt(match[2], 10)
  const d = parseInt(match[3], 10)
  if (m < 1 || m > 12) return false
  const maxDays = new Date(y, m, 0).getDate()
  return d >= 1 && d <= maxDays
}

/**
 * 숫자 입력을 YYYY-MM-DD 형식으로 포맷팅
 */
const formatDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 4) return digits
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value = "",
  onChange,
  placeholder = "YYYY-MM-DD",
  className,
  id,
  disabled = false,
  startYear = 1920,
  endYear = 2100,
  showTodayButton = true,
}) => {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)

  // 외부 value prop 변경 시 로컬 인풋 값 동기화
  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const selectedDate = React.useMemo(
    () => (value && isValidDateString(value) ? parseLocalDate(value) : undefined),
    [value]
  )

  // 캘린더에서 날짜 콕 찍어 선택 시
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const formatted = format(date, "yyyy-MM-dd")
      setInputValue(formatted)
      onChange(formatted)
      setOpen(false)
    }
  }

  // 오늘 날짜로 즉시 지정
  const handleSetToday = (e: React.MouseEvent) => {
    e.stopPropagation()
    const today = format(new Date(), "yyyy-MM-dd")
    setInputValue(today)
    if (onChange) {
      onChange(today)
    }
    setOpen(false)
  }

  // 직접 키보드 타이핑 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    // 백스페이스 등으로 '-'가 지워질 때의 자연스러운 처리
    const formatted = formatDateInput(rawVal)
    setInputValue(formatted)

    if (isValidDateString(formatted)) {
      if (onChange) {
        onChange(formatted)
      }
    }
  }

  // 포커스 아웃 시 유효하지 않은 값이면 이전 정상 value로 복원
  const handleInputBlur = () => {
    if (!inputValue) {
      if (onChange && value) {
        onChange("")
      }
      return
    }

    if (!isValidDateString(inputValue)) {
      // 불완전하거나 유효하지 않으면 이전 정상 value로 복원
      setInputValue(value)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "relative flex items-center w-full rounded-xl transition-all",
          className
        )}
      >
        {/* 직접 키보드 타이핑 가능한 input */}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            "w-full h-11 pl-3.5 pr-12 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-slate-900/60 text-sm font-bold text-[#112220] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-ghost-dark-ink-stone tracking-tight focus:outline-none focus:ring-2 focus:ring-[#15171a] dark:focus:ring-[#d1ff19] transition-all disabled:opacity-50 disabled:cursor-not-allowed tabular-nums"
          )}
        />

        {/* 달력 열기 트리거 아이콘 버튼 */}
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label="달력 열기"
            aria-haspopup="dialog"
            aria-expanded={open}
            className="absolute right-1.5 top-1.5 bottom-1.5 w-8 flex items-center justify-center rounded-lg hover:bg-slate-200/60 dark:hover:bg-ghost-dark-hover text-slate-500 hover:text-[#112220] dark:text-ghost-dark-ink-stone dark:hover:text-[#d1ff19] transition-colors disabled:opacity-40"
          >
            <CalendarIcon className="w-4 h-4 shrink-0" />
          </button>
        </PopoverTrigger>
      </div>

      <PopoverContent
        align="start"
        className="w-auto p-0 border border-slate-200 dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface-drawer shadow-2xl rounded-2xl overflow-hidden"
      >
        <div className="p-2.5 border-b border-slate-100 dark:border-ghost-dark-hairline flex items-center justify-between bg-slate-50/50 dark:bg-ghost-dark-surface-deep/40">
          <span className="text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute px-1">
            달력에서 날짜 선택
          </span>
          {showTodayButton && (
            <button
              type="button"
              onClick={handleSetToday}
              className="text-[11px] font-bold text-[#112220] dark:text-[#d1ff19] hover:underline px-2 py-0.5 rounded cursor-pointer"
            >
              오늘로 지정
            </button>
          )}
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleCalendarSelect}
          defaultMonth={selectedDate || new Date()}
          captionLayout="dropdown"
          startMonth={new Date(startYear, 0)}
          endMonth={new Date(endYear, 11)}
        />

        {showTodayButton && (
          <div className="p-2 border-t border-slate-100 dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-ghost-dark-surface-deep/40">
            <button
              type="button"
              onClick={handleSetToday}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-ghost-dark-surface-deep dark:hover:bg-ghost-dark-hover text-[#112220] dark:text-[#d1ff19] border border-slate-200 dark:border-ghost-dark-hairline transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              오늘 날짜로 선택 ({format(new Date(), "yyyy-MM-dd")})
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

