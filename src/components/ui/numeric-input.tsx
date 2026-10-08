import * as React from "react"
import { RotateCcw } from "lucide-react"
import { cn } from "../../lib/utils"

export interface NumericInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: number | string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNumberChange?: (value: number) => void
  onClear?: () => void
  showClear?: boolean
  clearLabel?: string
  suffix?: React.ReactNode
  thousandSeparator?: boolean
  allowDecimals?: boolean
  displayZero?: boolean
  containerClassName?: string
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      className,
      containerClassName,
      type = "text",
      value,
      onChange,
      onNumberChange,
      onClear,
      showClear,
      clearLabel = "정정",
      suffix,
      thousandSeparator = false,
      allowDecimals = false,
      displayZero = false,
      placeholder = "0",
      inputMode,
      ...props
    },
    ref
  ) => {
    // Format display value
    const displayValue = React.useMemo(() => {
      if (value === undefined || value === null) {
        return ""
      }
      if (typeof value === "number") {
        if (value === 0 && !displayZero) {
          return ""
        }
        if (thousandSeparator) {
          return value.toLocaleString("ko-KR")
        }
        return value.toString()
      }
      if (typeof value === "string") {
        if (value === "" || (value === "0" && !displayZero)) {
          return value === "0" && !displayZero ? "" : value
        }
        if (thousandSeparator) {
          const digits = value.replace(/[^0-9]/g, "")
          return digits ? parseInt(digits, 10).toLocaleString("ko-KR") : ""
        }
        return value
      }
      return String(value)
    }, [value, thousandSeparator, displayZero])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e)
      }
      if (onNumberChange) {
        const raw = e.target.value
        if (allowDecimals) {
          const cleaned = raw.replace(/[^0-9.-]/g, "")
          const num = parseFloat(cleaned)
          onNumberChange(isNaN(num) ? 0 : num)
        } else {
          const cleaned = raw.replace(/[^0-9]/g, "")
          const num = parseInt(cleaned, 10)
          onNumberChange(isNaN(num) ? 0 : num)
        }
      }
    }

    // 금액 정정(0원 리셋) 핸들러
    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (onClear) {
        onClear()
      } else if (onNumberChange) {
        onNumberChange(0)
      } else if (onChange) {
        const syntheticEvent = {
          target: { value: "0" },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    // 유효한 금액이 있는지 여부 판별 (0보다 클 때 정정 버튼 활성화)
    const numVal = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""))
    const hasValue = !isNaN(numVal) && numVal > 0

    // 기본적으로 원화 단위('원') 입력창이거나 onClear/onNumberChange가 전달된 경우 정정 버튼 활성화
    const shouldShowClear = showClear ?? Boolean(onClear || (onNumberChange && suffix === "원"))

    return (
      <div className={cn("relative w-full", containerClassName)}>
        {shouldShowClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="금액 정정"
            tabIndex={-1}
            className={cn(
              "absolute left-2.5 top-1/2 -translate-y-1/2 z-10",
              "inline-flex items-center gap-1 h-6 px-1.5 rounded-md",
              "text-[11px] font-semibold tracking-tight",
              "text-rose-500 hover:text-rose-600 dark:text-rose-400",
              "bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/50",
              "hover:bg-rose-100/70 dark:hover:bg-rose-900/60 active:scale-95",
              "transition-all duration-150 cursor-pointer select-none",
              hasValue
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-90 pointer-events-none"
            )}
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span>{clearLabel}</span>
          </button>
        )}
        <input
          type={type}
          inputMode={inputMode || (allowDecimals ? "decimal" : "numeric")}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full text-right font-bold text-[#112220] dark:text-ghost-dark-ink pr-10 py-2 border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft rounded-xl text-base sm:text-lg tracking-tight bg-slate-50/50 dark:bg-ghost-dark-surface-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors h-11",
            shouldShowClear ? "pl-16" : "pl-3",
            !suffix && "pr-3",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 dark:text-ghost-dark-ink-stone pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
    )
  }
)

NumericInput.displayName = "NumericInput"

export { NumericInput }
