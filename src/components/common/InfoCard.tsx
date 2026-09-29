import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface InfoCardItem {
  term: string;
  desc: React.ReactNode;
}

export interface InfoCardProps {
  title: string;
  items: InfoCardItem[];
  notice?: React.ReactNode;
  className?: string;
}

/**
 * 전 계산기 하단 공통 상식 및 유의사항 안내 패널 컴포넌트
 * Ghost 디자인 시스템 기반의 단정한 단일 리스트 패널 규격 및 모노크롬 Info 헤더 제공
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  items,
  notice,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline text-xs text-ghost-ink-mute dark:text-ghost-dark-ink-soft shadow-2xs transition-colors',
        className
      )}
    >
      <div className="space-y-2 leading-relaxed">
        <p className="font-bold text-ghost-ink dark:text-ghost-dark-ink text-xs sm:text-sm pb-2 border-b border-ghost-hairline dark:border-ghost-dark-hairline flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-ghost-ink dark:text-ghost-lime shrink-0" />
          <span>{title}</span>
        </p>
        <div className="space-y-1.5 pt-0.5">
          {items.map((item, idx) => (
            <p key={idx} className="break-keep">
              • <strong>{item.term}</strong>: {item.desc}
            </p>
          ))}
        </div>
        {notice && (
          <p className="pt-2 border-t border-ghost-hairline dark:border-ghost-dark-hairline text-ghost-ink-stone dark:text-ghost-dark-ink-mute text-[11px] leading-normal break-keep">
            ※ <strong>안내 및 고지</strong>: {notice}
          </p>
        )}
      </div>
    </div>
  );
};
