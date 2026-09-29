import React, { useState } from 'react';
import { RepaymentCalculationResult } from '../../../types/loan';
import { formatKoreanLoanAmount } from '../../../utils/loanCalculator';
import { TrendingDown, Sparkles, Copy, Check, CreditCard, Banknote, ShieldAlert, CircleDollarSign } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { SubMetricCard } from '../../../components/common/SubMetricCard';

interface LoanSummaryCardsProps {
  result: RepaymentCalculationResult;
  loanAmount: number;
}

export const LoanSummaryCards: React.FC<LoanSummaryCardsProps> = ({ result, loanAmount }) => {
  const [copied, setCopied] = useState(false);
  const interestRatio = loanAmount > 0 ? (result.totalInterest / loanAmount) * 100 : 0;
  const early = result.earlyRepayment;

  const handleCopy = async () => {
    const text = `[스마트 계산기] 대출 이자 및 상환액 계산 결과
- 대출 원금: ${loanAmount.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(loanAmount)})
- 첫 달 상환액: ${result.firstMonthPayment.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(result.firstMonthPayment)})
- 월평균 상환액: ${result.monthlyAveragePayment.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(result.monthlyAveragePayment)})
- 총 대출이자: ${result.totalInterest.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(result.totalInterest)}, 원금의 ${interestRatio.toFixed(1)}%)
- 총 상환금액: ${result.totalRepayment.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(result.totalRepayment)})`;

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
    <div className="@container space-y-3">
      {/* 중도상환 순 혜택 하이라이트 배너 (활성화 시) */}
      {early && (
        <div className="p-4 rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-page-fade">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#d1ff19] text-[#112220] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-300 flex items-center gap-1">
                <span>조기 상환 순 이익 (절감이자 - 수수료)</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-[#d1ff19] tracking-tight">
                +{early.netBenefit.toLocaleString('ko-KR')}원
                <span className="text-xs font-normal text-slate-300 ml-1.5">
                  ({formatKoreanLoanAmount(early.netBenefit)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300 border-t sm:border-t-0 sm:border-l border-slate-700 sm:pl-4 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-slate-400 block text-[11px]">아낀 총이자</span>
              <span className="font-bold text-white">
                {early.savedInterest.toLocaleString('ko-KR')}원
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">납부 수수료</span>
              <span className="font-bold text-rose-400">
                {early.feeAmount === 0 ? '0원 (면제)' : `${early.feeAmount.toLocaleString('ko-KR')}원`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 1. 최상단 대형 메인 하이라이트 카드 (첫 달 상환액 / 월 상환액) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft text-white p-5 sm:p-6 shadow-sm">
        {/* 우측 상단 배경 글로우 장식 */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
                <CreditCard className="w-3 h-3" />
                첫 달 상환액 (1회차)
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
            <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#d1ff19] tabular-nums whitespace-nowrap">
                {result.firstMonthPayment.toLocaleString('ko-KR')}
                <span className="text-lg sm:text-xl font-medium text-slate-200 ml-1">
                  원
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">
                ({formatKoreanLoanAmount(result.firstMonthPayment)})
              </span>
            </div>

            <div className="text-xs text-slate-400 pt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span>
                월평균 상환액:{' '}
                <strong className="text-white font-medium tabular-nums">
                  {result.monthlyAveragePayment.toLocaleString('ko-KR')}원
                </strong>
                <span className="text-slate-400 ml-1">
                  ({formatKoreanLoanAmount(result.monthlyAveragePayment)})
                </span>
              </span>

              {result.firstMonthPayment !== result.lastMonthPayment && (
                <span className="text-emerald-400 font-medium inline-flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  막달 {result.lastMonthPayment.toLocaleString('ko-KR')}원
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3대 핵심 서브 요약 카드 그리드 (총 상환금액, 총 대출이자, 대출 원금) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* 1. 총 상환금액 */}
        <SubMetricCard
          label="총 상환금액"
          icon={Banknote}
          value={`${result.totalRepayment.toLocaleString('ko-KR')}원`}
          description={formatKoreanLoanAmount(result.totalRepayment)}
        />

        {/* 2. 총 대출이자 */}
        <SubMetricCard
          label="총 대출이자"
          icon={ShieldAlert}
          iconColor="text-rose-500"
          badge={`원금의 ${interestRatio.toFixed(1)}%`}
          badgeColor="rose"
          value={`${result.totalInterest.toLocaleString('ko-KR')}원`}
          valueColor="rose"
          description={formatKoreanLoanAmount(result.totalInterest)}
        />

        {/* 3. 대출 원금 */}
        <SubMetricCard
          label="대출 원금"
          icon={CircleDollarSign}
          value={`${loanAmount.toLocaleString('ko-KR')}원`}
          description={formatKoreanLoanAmount(loanAmount)}
        />
      </div>
    </div>
  );
};
