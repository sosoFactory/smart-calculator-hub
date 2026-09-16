import React from 'react';
import { GoalCalculationResult } from '../../../types/goal';
import { formatCurrency, formatKoreanCurrency } from '../../../utils/formatters';
import { Target, Coins, TrendingUp, PiggyBank } from 'lucide-react';

interface GoalSummaryCardsProps {
  result: GoalCalculationResult;
}

export const GoalSummaryCards: React.FC<GoalSummaryCardsProps> = ({ result }) => {
  const {
    targetAmount,
    targetYears,
    monthlyContribution,
    totalPrincipal,
    totalInterest,
    interestRatio,
    initialAmount,
  } = result;

  return (
    <div className="space-y-4">
      {/* 1. 메인 핵심 카드: 필요 월 적립액 */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#15171a] dark:bg-slate-900 border border-slate-800 p-5 sm:p-7 text-white shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#d1ff19]/10 text-[#d1ff19]">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-300">
                목표 달성 필요 월 적립액
              </span>
            </div>
            <span className="text-xs text-[#d1ff19] font-bold px-2 py-0.5 rounded-full bg-[#d1ff19]/10 border border-[#d1ff19]/20">
              {targetYears}년 목표
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">매월</span>
              <span className="text-2xl sm:text-4xl font-extrabold text-[#d1ff19] tracking-tight tabular-nums">
                {formatCurrency(monthlyContribution)}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-semibold">
                ({formatKoreanCurrency(monthlyContribution)})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              목표 <span className="text-white font-semibold">{formatKoreanCurrency(targetAmount)}</span> 달성을 위해 매월 적립해야 하는 금액입니다.
            </p>
          </div>
        </div>

        {/* 배경 은은한 그라데이션 글로우 */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#d1ff19]/5 blur-3xl pointer-events-none" />
      </div>

      {/* 2. 3단 서브 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 총 투입 원금 */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#e5e7eb] dark:border-slate-800 p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Coins className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-xs font-semibold">총 투입 원금</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-[#112220] dark:text-slate-100 tabular-nums">
            {formatCurrency(totalPrincipal)}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {initialAmount > 0 ? '초기 자금 + 월 적립' : '전액 순수 월 적립'}
          </p>
        </div>

        {/* 복리 이자 수익 */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#e5e7eb] dark:border-slate-800 p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-semibold">예상 복리 수익</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            +{formatCurrency(totalInterest)}
          </p>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 truncate font-medium">
            수익 기여도 {interestRatio}%
          </p>
        </div>

        {/* 목표 달성 총 자산 */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#e5e7eb] dark:border-slate-800 p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <PiggyBank className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold">최종 달성액</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-[#112220] dark:text-slate-100 tabular-nums">
            {formatCurrency(targetAmount)}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate font-medium">
            {formatKoreanCurrency(targetAmount)} 100% 달성
          </p>
        </div>
      </div>
    </div>
  );
};
