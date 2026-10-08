import React from 'react';
import { RepaymentCalculationResult } from '../../../types/loan';
import { formatKoreanLoanAmount } from '../../../utils/loanCalculator';
import { TrendingDown, Sparkles, CreditCard, Banknote, ShieldAlert, CircleDollarSign } from 'lucide-react';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import { ResultHeroCard } from '../../../components/common/ResultHeroCard';
import { CopyResultButton } from '../../../components/common/CopyResultButton';

interface LoanSummaryCardsProps {
  result: RepaymentCalculationResult;
  loanAmount: number;
}

export const LoanSummaryCards: React.FC<LoanSummaryCardsProps> = ({ result, loanAmount }) => {
  const interestRatio = loanAmount > 0 ? (result.totalInterest / loanAmount) * 100 : 0;
  const early = result.earlyRepayment;

  const getCopyText = () => `[스마트 계산기] 대출 이자 및 상환액 계산 결과
- 대출 원금: ${loanAmount.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(loanAmount)})
- 첫 달 상환액: ${result.firstMonthPayment.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(result.firstMonthPayment)})
- 월평균 상환액: ${result.monthlyAveragePayment.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(result.monthlyAveragePayment)})
- 총 대출이자: ${result.totalInterest.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(result.totalInterest)}, 원금의 ${interestRatio.toFixed(1)}%)
- 총 상환금액: ${result.totalRepayment.toLocaleString('ko-KR')}원 (${formatKoreanLoanAmount(result.totalRepayment)})`;

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
      <ResultHeroCard
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
            <CreditCard className="w-3 h-3" />
            첫 달 상환액 (1회차)
          </span>
        }
        action={<CopyResultButton text={getCopyText} />}
        mainValue={`${result.firstMonthPayment.toLocaleString('ko-KR')}원`}
        koreanReading={formatKoreanLoanAmount(result.firstMonthPayment)}
        subtext={
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
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
        }
      />

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
          badge={`${interestRatio.toFixed(1)}%`}
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
