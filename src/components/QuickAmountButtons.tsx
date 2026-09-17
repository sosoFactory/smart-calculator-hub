import React from 'react';
import { Button } from './ui/button';

interface QuickAmountButtonsProps {
  onAdd: (amount: number) => void;
  onClear: () => void;
}

const AMOUNTS = [
  { label: '+10만', value: 100_000 },
  { label: '+50만', value: 500_000 },
  { label: '+100만', value: 1_000_000 },
  { label: '+1,000만', value: 10_000_000 },
];

export const QuickAmountButtons: React.FC<QuickAmountButtonsProps> = ({ onAdd, onClear }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
      {AMOUNTS.map((item) => (
        <Button
          key={item.value}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAdd(item.value)}
          className="h-auto px-2 py-1 text-xs font-medium text-[#112220] dark:text-ghost-dark-ink-base bg-slate-50 dark:bg-ghost-dark-surface-deep hover:bg-slate-100 dark:hover:bg-ghost-dark-hover active:scale-[0.98] rounded-md transition-colors border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft"
        >
          {item.label}
        </Button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-auto px-2 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/50 dark:hover:bg-rose-900/40 active:scale-[0.98] rounded-md transition-colors border border-rose-200/60 dark:border-rose-900/50 ml-auto hover:text-rose-700 dark:hover:text-rose-300"
      >
        정정
      </Button>
    </div>
  );
};
