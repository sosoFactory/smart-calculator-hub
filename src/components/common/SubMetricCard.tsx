import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

export type SubMetricValueColor = 'default' | 'rose' | 'emerald' | 'indigo' | 'amber';
export type SubMetricBadgeColor = 'default' | 'rose' | 'emerald' | 'indigo' | 'amber' | 'slate';

export interface SubMetricCardProps {
  label: string;
  icon?: LucideIcon;
  iconColor?: string;
  badge?: React.ReactNode;
  badgeColor?: SubMetricBadgeColor;
  value: React.ReactNode;
  valueColor?: SubMetricValueColor;
  description?: React.ReactNode;
  className?: string;
}

const VALUE_COLOR_CLASSES: Record<SubMetricValueColor, string> = {
  default: 'text-ghost-ink dark:text-ghost-dark-ink',
  rose: 'text-rose-600 dark:text-rose-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  amber: 'text-amber-600 dark:text-amber-400',
};

const BADGE_COLOR_CLASSES: Record<SubMetricBadgeColor, string> = {
  default: 'text-slate-500 dark:text-ghost-dark-ink-stone font-medium',
  slate: 'bg-slate-100 dark:bg-ghost-dark-surface-elevated text-slate-500 dark:text-ghost-dark-ink-mute px-1.5 py-0.5 rounded font-semibold',
  rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-semibold',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold',
  indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-semibold',
  amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-semibold',
};

/**
 * 전 계산기 결과 하단 3단 서브 요약 지표 공통 카드 컴포넌트
 * Ghost 디자인 시스템 기반의 3행 계층 구조(헤더 아이콘+라벨, 볼드 메인 수치, 하단 캡션) 일원화
 */
export const SubMetricCard: React.FC<SubMetricCardProps> = ({
  label,
  icon: Icon,
  iconColor = 'text-slate-400 dark:text-ghost-dark-ink-stone',
  badge,
  badgeColor = 'default',
  value,
  valueColor = 'default',
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline shadow-2xs space-y-1 transition-colors min-w-0',
        className
      )}
    >
      {/* 1행: 아이콘 + 소제목 (좌측) / 선택적 배지 (우측) */}
      <div className="flex items-center justify-between gap-1.5 text-ghost-ink-mute dark:text-ghost-dark-ink-mute min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && <Icon className={cn('w-3.5 h-3.5 shrink-0', iconColor)} />}
          <span className="text-[11px] font-bold uppercase tracking-wider truncate">
            {label}
          </span>
        </div>
        {badge && (
          <span
            className={cn(
              'text-[10px] sm:text-[11px] tabular-nums shrink-0 whitespace-nowrap',
              BADGE_COLOR_CLASSES[badgeColor]
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {/* 2행: 볼드 메인 수치 */}
      <div
        className={cn(
          'text-base sm:text-lg font-bold tabular-nums truncate whitespace-nowrap',
          VALUE_COLOR_CLASSES[valueColor]
        )}
      >
        {value}
      </div>

      {/* 3행: 보조 설명 및 독음 */}
      {description && (
        <p className="text-[11px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute truncate">
          {description}
        </p>
      )}
    </div>
  );
};
