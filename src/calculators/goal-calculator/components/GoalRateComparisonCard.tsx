import React from 'react';
import { RateComparisonItem } from '../../../types/goal';
import { formatCurrency, formatKoreanCurrency } from '../../../utils/formatters';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

interface GoalRateComparisonCardProps {
  comparisons: RateComparisonItem[];
  currentRate: number;
}

export const GoalRateComparisonCard: React.FC<GoalRateComparisonCardProps> = ({
  comparisons,
  currentRate,
}) => {
  const getStrategyName = (rate: number) => {
    if (rate <= 4.0) return '예·적금 안전형';
    if (rate <= 7.5) return '인덱스 펀드 안정형';
    return '적극 투자 성장형';
  };

  return (
    <div className='bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-2xs transition-colors'>
      <div className='flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-slate-800'>
        <div>
          <h3 className='text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 flex items-center gap-2'>
            <TrendingUp className='w-4 h-4 text-[#d1ff19]' />
            <span>수익률 시나리오별 월 적립금 비교</span>
          </h3>
          <p className='text-xs text-[#64748b] dark:text-slate-400 mt-0.5'>
            수익률이 높아질수록 목표 달성을 위해 매월 넣어야 하는 돈이 획기적으로 줄어듭니다
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        {comparisons.map((item) => {
          const isSelected = item.rate === currentRate;
          return (
            <div
              key={item.rate}
              className={`rounded-2xl p-4 border transition-all space-y-3 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 dark:border-emerald-500/50 ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 block'>
                    {getStrategyName(item.rate)}
                  </span>
                  <span className='text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100'>
                    연 {item.rate}%
                  </span>
                </div>
                {isSelected && (
                  <div className='flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-[#d1ff19] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full'>
                    <CheckCircle2 className='w-3 h-3' />
                    <span>현재 설정</span>
                  </div>
                )}
              </div>

              <div className='space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800'>
                <span className='text-xs text-slate-400 block'>필요 월 적립액</span>
                <p className='text-base sm:text-lg font-extrabold text-[#112220] dark:text-slate-100 tabular-nums'>
                  {formatCurrency(item.monthlyContribution)}
                </p>
                <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                  {formatKoreanCurrency(item.monthlyContribution)} / 월
                </p>
              </div>

              <div className='pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]'>
                <span className='text-slate-400'>총 투입 원금</span>
                <span className='font-semibold text-slate-600 dark:text-slate-300 tabular-nums'>
                  {formatKoreanCurrency(item.totalPrincipal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
