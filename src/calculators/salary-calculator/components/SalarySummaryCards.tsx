import React from 'react';
import { SalaryCalculationResult } from '../../../types/salary';
import { formatKoreanUnit, formatNumberWithWon } from '../../../utils/formatters';
import { Badge } from '../../../components/ui/badge';
import { Banknote, ShieldAlert, PieChart, Sparkles } from 'lucide-react';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import { ResultHeroCard } from '../../../components/common/ResultHeroCard';
import { CopyResultButton } from '../../../components/common/CopyResultButton';

interface SalarySummaryCardsProps {
  result: SalaryCalculationResult;
}

export const SalarySummaryCards: React.FC<SalarySummaryCardsProps> = ({ result }) => {
  const getCopyText = () => `[스마트 계산기] 2026 연봉/월급 실수령액 계산 결과
- 세전 ${result.input.paymentType === 'annual' ? '연봉' : '월급'}: ${formatNumberWithWon(result.input.grossAmount)} (${formatKoreanUnit(result.input.grossAmount)})
- 월 예상 실수령액: ${formatNumberWithWon(result.netMonthlySalary)} (${formatKoreanUnit(result.netMonthlySalary)})
- 연간 환산 실수령액: ${formatNumberWithWon(result.netAnnualSalary)} (${formatKoreanUnit(result.netAnnualSalary)})
- 월 총 공제액: ${formatNumberWithWon(result.totalMonthlyDeduction)} (공제율 ${result.totalDeductionRatio}%)
  * 국민연금: ${formatNumberWithWon(result.nationalPension)}
  * 건강보험: ${formatNumberWithWon(result.healthInsurance)}
  * 요양보험: ${formatNumberWithWon(result.longTermCare)}
  * 고용보험: ${formatNumberWithWon(result.employmentInsurance)}
  * 근로소득세: ${formatNumberWithWon(result.incomeTax)}
  * 지방소득세: ${formatNumberWithWon(result.localIncomeTax)}`;

  return (
    <div className="@container space-y-3">
      {/* 1. 최상단 대형 메인 하이라이트 카드 (월 예상 실수령액) */}
      <ResultHeroCard
        badge={
          <>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
              <Sparkles className="w-3 h-3" />
              월 예상 실수령액
            </span>
            {result.takeHomeRatio > 0 && (
              <Badge
                variant="outline"
                className="text-[11px] font-semibold border-slate-700 dark:border-ghost-dark-hairline-soft text-slate-300 bg-slate-800/60 dark:bg-ghost-dark-hairline whitespace-nowrap"
              >
                실수령 {result.takeHomeRatio}%
              </Badge>
            )}
          </>
        }
        action={<CopyResultButton text={getCopyText} />}
        mainValue={`${result.netMonthlySalary.toLocaleString('ko-KR')}원`}
        koreanReading={formatKoreanUnit(result.netMonthlySalary)}
        subtext={
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="break-keep">
              연간 총 환산 수령액:{' '}
              <strong className="text-white font-medium tabular-nums whitespace-nowrap">
                {formatNumberWithWon(result.netAnnualSalary)}
              </strong>
              <span className="text-slate-400 ml-1 whitespace-nowrap">
                ({formatKoreanUnit(result.netAnnualSalary)})
              </span>
            </span>
          </div>
        }
      />

      {/* 2. 3단 서브 요약 카드 그리드 (세전 월 환산액, 월 총 공제액, 총 공제율) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* 세전 월 환산액 */}
        <SubMetricCard
          label="세전 월 환산액"
          icon={Banknote}
          value={formatNumberWithWon(result.grossMonthlySalary)}
          description={`과세 ${formatNumberWithWon(result.taxableMonthlySalary)} + 비과세 ${formatNumberWithWon(result.nonTaxableMonthly)}`}
        />

        {/* 월 총 공제액 */}
        <SubMetricCard
          label="월 총 공제액"
          icon={ShieldAlert}
          iconColor="text-rose-500"
          value={`-${formatNumberWithWon(result.totalMonthlyDeduction)}`}
          valueColor="rose"
          description={`보험 ${formatNumberWithWon(result.totalFourMajorInsurances)} + 세금 ${formatNumberWithWon(result.totalTax)}`}
        />

        {/* 총 공제 비율 */}
        <SubMetricCard
          label="총 공제 비율"
          icon={PieChart}
          iconColor="text-amber-500"
          value={`${result.totalDeductionRatio}%`}
          description={`연간 총 공제 ${formatNumberWithWon(result.totalMonthlyDeduction * 12)}`}
        />
      </div>
    </div>
  );
};
