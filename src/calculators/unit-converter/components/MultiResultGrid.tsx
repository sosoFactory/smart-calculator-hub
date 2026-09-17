import React, { useState } from 'react';
import { UnitConversionResult } from '../../../types/unit';
import { Copy, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

interface MultiResultGridProps {
  results: UnitConversionResult[];
  activeUnitId: string;
  inputValue?: number | '';
  activeUnitSymbol?: string;
}

export const MultiResultGrid: React.FC<MultiResultGridProps> = ({
  results,
  activeUnitId,
  inputValue,
  activeUnitSymbol,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-6 space-y-3.5 shadow-2xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink tracking-tight">
              전체 단위 일괄 환산표
            </h2>
            {inputValue !== undefined && inputValue !== '' && activeUnitSymbol && (
              <span className="sm:hidden text-[11px] font-medium text-[#64748b] dark:text-ghost-dark-ink-soft bg-slate-100 dark:bg-ghost-dark-surface-elevated px-2 py-0.5 rounded-full shrink-0">
                기준: {inputValue} {activeUnitSymbol}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute leading-relaxed">
            현재 입력값을 기준으로 모든 관련 단위로 즉시 동시 변환됩니다.
          </p>
        </div>
        {inputValue !== undefined && inputValue !== '' && activeUnitSymbol && (
          <span className="hidden sm:inline-flex text-[11px] font-medium text-[#64748b] dark:text-ghost-dark-ink-soft bg-slate-100 dark:bg-ghost-dark-surface-elevated px-2.5 py-1 rounded-full shrink-0">
            기준: {inputValue} {activeUnitSymbol}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {results.map((item) => {
          const isCurrentActive = item.unit.id === activeUnitId;
          const isCopied = copiedId === item.unit.id;

          return (
            <div
              key={item.unit.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isCurrentActive
                  ? 'bg-slate-50 dark:bg-ghost-dark-surface-elevated border-[#15171a] dark:border-[#d1ff19] ring-1 ring-[#15171a]/10 dark:ring-[#d1ff19]/20'
                  : 'bg-white dark:bg-ghost-dark-surface-deep border-[#e5e7eb] dark:border-ghost-dark-hairline hover:border-slate-400 dark:hover:border-ghost-dark-hairline-soft'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className={`text-xs font-bold block ${isCurrentActive ? 'text-[#112220] dark:text-[#d1ff19]' : 'text-[#112220] dark:text-ghost-dark-ink'}`}>
                    {item.unit.name}
                  </span>
                  <span className="text-[10px] text-[#64748b] dark:text-ghost-dark-ink-mute">
                    {item.unit.symbol}
                  </span>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(item.formattedValue, item.unit.id)}
                      className="h-7 w-7 text-slate-500 hover:text-[#112220] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-ghost-dark-hover rounded-md"
                      aria-label={`${item.unit.name} 복사`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {isCopied ? '복사 완료!' : '결과값 복사'}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="mt-1 flex items-baseline justify-between gap-1 overflow-x-auto">
                <span className="font-extrabold text-base sm:text-lg text-[#112220] dark:text-ghost-dark-ink tracking-tight truncate">
                  {item.formattedValue}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-ghost-dark-ink-mute shrink-0">
                  {item.unit.symbol}
                </span>
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-ghost-dark-hairline min-h-[20px]">
                <p className="text-[10px] text-slate-400 dark:text-ghost-dark-ink-stone truncate">
                  {item.unit.description || `${item.unit.name} (${item.unit.symbol})`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
