import React from 'react';
import { CurrencyCode, CurrencyItem } from '../../../types/exchange';
import { CURRENCIES_DATA } from '../../../utils/exchangeCalculator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  id?: string;
  label?: string;
  variant?: 'light' | 'dark';
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
  id,
  label,
  variant = 'light',
}) => {
  const currencies = Object.values(CURRENCIES_DATA) as CurrencyItem[];
  const isDark = variant === 'dark';

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className={`block text-xs font-semibold pt-[0.5px] ${
            isDark ? 'text-slate-300' : 'text-[#64748b]'
          }`}
        >
          {label}
        </label>
      )}
      <Select value={value} onValueChange={(val) => onChange(val as CurrencyCode)}>
        <SelectTrigger
          id={id}
          className={`w-full h-8 text-xs font-bold transition-all px-2 sm:px-3 truncate ${
            isDark
              ? 'bg-[#24272c] dark:bg-ghost-dark-surface text-white border-slate-700 dark:border-ghost-dark-hairline-soft hover:bg-[#2e3238] dark:hover:bg-ghost-dark-hover focus:ring-[#d1ff19]'
              : 'bg-white dark:bg-ghost-dark-surface-elevated border-[#e5e7eb] dark:border-ghost-dark-hairline-soft text-[#112220] dark:text-ghost-dark-ink hover:border-[#15171a] dark:hover:border-[#d1ff19]'
          }`}
        >
          <SelectValue placeholder="통화 선택" />
        </SelectTrigger>
        <SelectContent
          className={`max-h-72 ${
            isDark ? 'bg-[#15171a] dark:bg-ghost-dark-surface-elevated border-slate-800 dark:border-ghost-dark-hairline-soft text-white' : 'bg-white dark:bg-ghost-dark-surface-elevated border-[#e5e7eb] dark:border-ghost-dark-hairline-soft text-[#112220] dark:text-ghost-dark-ink'
          }`}
        >
          {currencies.map((curr) => (
            <SelectItem
              key={curr.code}
              value={curr.code}
              className={`py-2 text-xs ${
                isDark
                  ? 'text-white hover:bg-slate-800 dark:hover:bg-ghost-dark-surface focus:bg-slate-800 dark:focus:bg-ghost-dark-surface focus:text-[#d1ff19]'
                  : 'text-[#112220] dark:text-ghost-dark-ink hover:bg-slate-100 dark:hover:bg-ghost-dark-hover'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-6 font-mono font-bold text-[11px] rounded px-1 text-center ${
                    isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 dark:bg-ghost-dark-surface-deep text-[#112220] dark:text-ghost-dark-ink-base'
                  }`}
                >
                  {curr.symbol}
                </span>
                <span className="font-semibold">{curr.code}</span>
                <span className={isDark ? 'text-slate-400 text-[11px]' : 'text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px]'}>
                  {curr.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
