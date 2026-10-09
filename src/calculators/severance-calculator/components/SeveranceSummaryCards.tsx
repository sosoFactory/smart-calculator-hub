import React from 'react';
import { DollarSign, Receipt, Clock, CalendarDays } from 'lucide-react';
import { SeveranceResult } from '../../../types/severance';
import { ResultHeroCard } from '../../../components/common/ResultHeroCard';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import { CopyResultButton } from '../../../components/common/CopyResultButton';
import { formatNumberWithWon, formatKoreanCurrency } from '../../../utils/formatters';

interface SeveranceSummaryCardsProps {
  result: SeveranceResult;
}

export const SeveranceSummaryCards: React.FC<SeveranceSummaryCardsProps> = ({ result }) => {
  const getCopyText = () => {
    return [
      `[스마트 계산기 허브] 퇴직금 계산 결과`,
      `- 총 재직기간: ${result.formattedServicePeriod} (총 ${result.totalDays}일)`,
      `- 1일 평균임금: ${formatNumberWithWon(result.dailyAverageWage)}`,
      `- 세전 퇴직금: ${formatNumberWithWon(result.grossSeverancePay)} (${formatKoreanCurrency(result.grossSeverancePay)})`,
      `- 예상 퇴직소득세: ${formatNumberWithWon(result.taxDetail.totalTax)} (실효세율 ${result.taxDetail.effectiveTaxRate}%)`,
      `- 세후 예상 실수령액: ${formatNumberWithWon(result.netSeverancePay)} (${formatKoreanCurrency(result.netSeverancePay)})`,
    ].join('\n');
  };

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* 1. 메인 세후 실수령 퇴직금 히어로 카드 */}
      <ResultHeroCard
        badge={
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-ghost-lime border border-white/10">
            예상 실수령 퇴직금 (세후)
          </span>
        }
        action={
          <CopyResultButton
            text={getCopyText}
            label="결과 복사"
            size="sm"
            variant="secondary"
            className="text-xs h-7 px-2.5"
          />
        }
        mainValue={formatNumberWithWon(result.netSeverancePay)}
        koreanReading={result.netSeverancePay > 0 ? formatKoreanCurrency(result.netSeverancePay) : undefined}
        subtext={
          result.isEligible ? (
            <span className="text-xs text-white/70">
              세전 퇴직금 {formatNumberWithWon(result.grossSeverancePay)}에서 세금 {formatNumberWithWon(result.taxDetail.totalTax)} 공제 (실효세율 {result.taxDetail.effectiveTaxRate}%)
            </span>
          ) : (
            <span className="text-xs text-amber-300">
              계속 근로기간이 1년(365일) 미만으로 법정 퇴직금 지급 요건에 해당하지 않습니다.
            </span>
          )
        }
      />

      {/* 2. 서브 지표 4개 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* 세전 퇴직금 */}
        <SubMetricCard
          label="세전 퇴직금"
          icon={DollarSign}
          value={formatNumberWithWon(result.grossSeverancePay)}
          description="법정 기준 총액"
          valueColor="default"
        />

        {/* 총 퇴직소득세 */}
        <SubMetricCard
          label="퇴직소득세"
          icon={Receipt}
          value={formatNumberWithWon(result.taxDetail.totalTax)}
          badge={`세율 ${result.taxDetail.effectiveTaxRate}%`}
          badgeColor="rose"
          description="소득세 + 지방세"
          valueColor={result.taxDetail.totalTax > 0 ? 'rose' : 'default'}
        />

        {/* 1일 평균임금 */}
        <SubMetricCard
          label="1일 평균임금"
          icon={Clock}
          value={formatNumberWithWon(result.dailyAverageWage)}
          description="최근 3개월 기준"
          valueColor="default"
        />

        {/* 총 재직기간 */}
        <SubMetricCard
          label="총 재직기간"
          icon={CalendarDays}
          value={result.formattedServicePeriod}
          badge={`${result.totalDays}일`}
          badgeColor="emerald"
          description="근속기간"
          valueColor="default"
        />
      </div>
    </div>
  );
};
