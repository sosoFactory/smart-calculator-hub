import React from 'react';
import { cn } from '../../lib/utils';

export interface ChartTooltipItem {
  label: string;
  value: string;
  /** 텍스트 색상 클래스 (예: 'text-emerald-400', 'text-sky-400', 'text-rose-400' 등) */
  color?: string;
  /** 보조 수치나 부가 텍스트 */
  subValue?: string;
}

export interface ChartTooltipCardProps {
  /** 툴팁 상단 제목 (기준점 등) */
  title?: React.ReactNode;
  /** 표준화된 항목 목록 */
  items?: ChartTooltipItem[];
  /** 커스텀 내부 엘리먼트 */
  children?: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
}

export const ChartTooltipCard: React.FC<ChartTooltipCardProps> = ({
  title,
  items,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white p-3 rounded-xl shadow-lg border border-slate-700 dark:border-ghost-dark-hairline-soft text-xs space-y-1 min-w-[140px]',
        className
      )}
    >
      {title && <div className="font-bold text-[#d1ff19]">{title}</div>}

      {items &&
        items.map((item, idx) => (
          <div key={idx} className={item.color || 'text-slate-200'}>
            <span>
              {item.label}: {item.value}
            </span>
            {item.subValue && (
              <span className="text-[11px] text-slate-400 ml-1 block sm:inline">
                {item.subValue}
              </span>
            )}
          </div>
        ))}

      {children}
    </div>
  );
};
