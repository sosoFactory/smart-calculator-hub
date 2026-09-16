import React from 'react';
import { Button } from './button';
import { cn } from '../../lib/utils';

export interface SegmentedOption<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  itemClassName?: string;
  variant?: 'dark-solid' | 'slate-solid' | 'light-card';
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  itemClassName,
  variant = 'slate-solid',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'grid gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-[#e5e7eb] dark:border-slate-800',
        className
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const isActive = value === option.id;

        const activeStyles =
          variant === 'dark-solid'
            ? 'bg-[#15171a] hover:bg-[#2e3238] dark:bg-white dark:hover:bg-slate-100 text-white hover:text-white dark:text-[#112220] dark:hover:text-[#112220] shadow-sm font-bold'
            : variant === 'light-card'
            ? 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#112220] dark:text-white shadow-xs font-semibold'
            : 'bg-[#15171a] hover:bg-[#2e3238] dark:bg-slate-800 dark:hover:bg-slate-700 text-white hover:text-white shadow-2xs border dark:border-slate-700 font-bold';

        const inactiveStyles =
          'text-[#64748b] dark:text-slate-400 hover:text-[#112220] dark:hover:text-white font-medium';

        return (
          <Button
            key={option.id}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(option.id)}
            className={cn(
              'h-auto py-1.5 px-2 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1.5',
              isActive ? activeStyles : inactiveStyles,
              itemClassName
            )}
          >
            {option.icon}
            <span>{option.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
