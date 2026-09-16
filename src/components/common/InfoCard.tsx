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

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  items,
  notice,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#e5e7eb] dark:border-slate-800 text-xs text-[#64748b] dark:text-slate-300 shadow-2xs transition-colors',
        className
      )}
    >
      <div className="space-y-2 leading-relaxed">
        <p className="font-bold text-[#112220] dark:text-slate-100 text-xs sm:text-sm pb-2 border-b border-[#e5e7eb] dark:border-slate-800 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#112220] dark:text-[#d1ff19] shrink-0" />
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
          <p className="pt-2 border-t border-[#e5e7eb] dark:border-slate-800 text-[#94a3b8] dark:text-slate-400 text-[11px] leading-normal break-keep">
            ※ <strong>안내 및 고지</strong>: {notice}
          </p>
        )}
      </div>
    </div>
  );
};
