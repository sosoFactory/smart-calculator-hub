import React, { useState } from 'react';
import { GoalCalculationResult } from '../../../types/goal';
import { formatCurrency, formatKoreanCurrency } from '../../../utils/formatters';
import { Target, Coins, TrendingUp, Percent, Copy, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface GoalSummaryCardsProps {
  result: GoalCalculationResult;
}

/**
 * 목표 자산 역산 계산기 요약 대시보드 컴포넌트
 * 목표 달성 필요 월 적립액 대형 메인 카드(복사 지원) 및 3단 서브 요약 카드(투입 원금, 복리 수익, 수익 기여도) 제공
 */
export const GoalSummaryCards: React.FC<GoalSummaryCardsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const {
    targetAmount,
    targetYears,
    monthlyContribution,
    totalPrincipal,
    totalInterest,
    interestRatio,
    initialAmount,
  } = result;

  // 목표 역산 핵심 결과 클립보드 원클릭 복사
  const handleCopy = async () => {
    const text = `[스마트 계산기] 목표 자산 역산 계산 결과
- 목표 금액: ${formatCurrency(targetAmount)} (${formatKoreanCurrency(targetAmount)})
- 달성 기간: ${targetYears}년
- 필요 월 적립액: 매월 ${formatCurrency(monthlyContribution)} (${formatKoreanCurrency(monthlyContribution)})
- 총 투입 원금: ${formatCurrency(totalPrincipal)} (${formatKoreanCurrency(totalPrincipal)})
- 예상 복리 수익: +${formatCurrency(totalInterest)} (${formatKoreanCurrency(totalInterest)})
- 이자/수익 기여도: ${interestRatio}%`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-4 w-full">
      {/* 1. 메인 핵심 카드: 필요 월 적립액 (Ghost Ink-Base 다크 서피스) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft p-5 sm:p-6 text-white shadow-sm">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
                <Target className="w-3.5 h-3.5" />
                목표 달성 필요 월 적립액
              </span>
              <span className="text-xs text-[#d1ff19] font-bold px-2 py-0.5 rounded-full bg-[#d1ff19]/10 border border-[#d1ff19]/20 shrink-0">
                {targetYears}년 목표
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2.5 text-xs bg-slate-800/80 dark:bg-ghost-dark-hairline hover:bg-slate-700 dark:hover:bg-ghost-dark-hairline-soft border-slate-700 dark:border-ghost-dark-hairline-soft text-white rounded-lg shrink-0 flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#d1ff19]" />
                  <span>복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-300" />
                  <span>결과 복사</span>
                </>
              )}
            </Button>
          </div>

          <div>
            <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
              <span className="text-xs text-slate-400 font-medium shrink-0">매월</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#d1ff19] tracking-tight tabular-nums break-keep">
                {formatCurrency(monthlyContribution)}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-semibold break-keep">
                ({formatKoreanCurrency(monthlyContribution)})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed break-keep">
              목표 <span className="text-white font-semibold">{formatKoreanCurrency(targetAmount)}</span> 달성을 위해 매월 적립해야 하는 금액입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 2. 3단 서브 요약 카드 (PRD 3.7: 총 투입 원금, 예상 복리 수익, 이자/수익 기여도) */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(185px,1fr))] gap-2.5 sm:gap-3">
        {/* 1) 총 투입 원금 */}
        <div className="bg-white dark:bg-ghost-dark-surface rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline p-3.5 sm:p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between sm:justify-start gap-1.5 text-slate-500 dark:text-ghost-dark-ink-mute">
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="text-xs font-semibold">총 투입 원금</span>
            </div>
            <span className="sm:hidden text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone truncate">
              {initialAmount > 0 ? '초기 자금 + 월 적립' : '순수 월 적립액'}
            </span>
          </div>
          <p className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
            {formatCurrency(totalPrincipal)}
          </p>
          <p className="hidden sm:block text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone truncate">
            {initialAmount > 0 ? '초기 자금 + 월 적립' : '전액 순수 월 적립'}
          </p>
        </div>

        {/* 2) 예상 복리 수익 */}
        <div className="bg-white dark:bg-ghost-dark-surface rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline p-3.5 sm:p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between sm:justify-start gap-1.5 text-slate-500 dark:text-ghost-dark-ink-mute">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold">예상 복리 수익</span>
            </div>
            <span className="sm:hidden text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
              +{formatKoreanCurrency(totalInterest)}
            </span>
          </div>
          <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            +{formatCurrency(totalInterest)}
          </p>
          <p className="hidden sm:block text-[11px] text-emerald-600/80 dark:text-emerald-400/80 truncate font-medium">
            복리 효과로 불어난 순이익
          </p>
        </div>

        {/* 3) 이자/수익 기여도 (PRD 3.7) */}
        <div className="bg-white dark:bg-ghost-dark-surface rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline p-3.5 sm:p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between sm:justify-start gap-1.5 text-slate-500 dark:text-ghost-dark-ink-mute">
            <div className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="text-xs font-semibold">이자/수익 기여도</span>
            </div>
            <span className="sm:hidden text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              목표액의 {interestRatio}%
            </span>
          </div>
          <p className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {interestRatio}%
          </p>
          <p className="hidden sm:block text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone truncate font-medium">
            전체 목표 자산 중 복리 이자 비중
          </p>
        </div>
      </div>
    </div>
  );
};
