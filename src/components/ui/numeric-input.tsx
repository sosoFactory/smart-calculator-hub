import * as React from "react"
import { cn } from "../../lib/utils"

export interface NumericInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: number | string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNumberChange?: (value: number) => void
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

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <input
          type={type}
          inputMode={inputMode || (allowDecimals ? "decimal" : "numeric")}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full text-right font-bold text-[#112220] dark:text-ghost-dark-ink pl-3 pr-10 py-2 border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft rounded-xl text-base sm:text-lg tracking-tight bg-slate-50/50 dark:bg-ghost-dark-surface-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors h-11",
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
