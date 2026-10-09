import React from 'react';
import { Banknote, Receipt, CalendarDays, Sparkles } from 'lucide-react';
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
      `[스마트 계산기] 퇴직금 및 퇴직소득세 계산 결과`,
      `- 총 재직기간: ${result.formattedServicePeriod} (총 ${result.totalDays}일)`,
      `- 1일 평균임금: ${formatNumberWithWon(result.dailyAverageWage)}`,
      `- 세전 퇴직금: ${formatNumberWithWon(result.grossSeverancePay)} (${formatKoreanCurrency(result.grossSeverancePay)})`,
      `- 예상 퇴직소득세: ${formatNumberWithWon(result.taxDetail.totalTax)} (실효세율 ${result.taxDetail.effectiveTaxRate}%)`,
      `- 세후 예상 실수령액: ${formatNumberWithWon(result.netSeverancePay)} (${formatKoreanCurrency(result.netSeverancePay)})`,
    ].join('\n');
  };

  return (
    <div className="@container space-y-3">
      {/* 1. 최상단 대형 메인 하이라이트 카드 (예상 실수령 퇴직금) */}
      <ResultHeroCard
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
            <Sparkles className="w-3 h-3" />
            예상 실수령 퇴직금 (세후)
          </span>
        }
        action={<CopyResultButton text={getCopyText} />}
        mainValue={`${result.netSeverancePay.toLocaleString('ko-KR')}원`}
        koreanReading={result.netSeverancePay > 0 ? formatKoreanCurrency(result.netSeverancePay) : undefined}
        subtext={
          result.isEligible ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/90">
              <span className="break-keep">
                세전 퇴직금: <strong className="text-white font-medium tabular-nums">{formatNumberWithWon(result.grossSeverancePay)}</strong>
              </span>
              <span className="text-slate-500">·</span>
              <span className="break-keep">
                총 세금: <strong className="text-rose-400 font-medium tabular-nums">{formatNumberWithWon(result.taxDetail.totalTax)}</strong>
                <span className="text-slate-400 ml-1">({result.taxDetail.effectiveTaxRate}%)</span>
              </span>
            </div>
          ) : (
            <span className="text-xs text-amber-300">
              계속 근로기간이 1년(365일) 미만으로 법정 퇴직금 지급 요건에 해당하지 않습니다.
            </span>
          )
        }
      />

      {/* 2. 3단 서브 요약 지표 카드 그리드 (SSOT 규격) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* 1) 세전 퇴직금 */}
        <SubMetricCard
          label="세전 퇴직금"
          icon={Banknote}
          value={formatNumberWithWon(result.grossSeverancePay)}
          description={result.grossSeverancePay > 0 ? formatKoreanCurrency(result.grossSeverancePay) : '법정 기준 총액'}
          valueColor="default"
        />

        {/* 2) 총 퇴직소득세 */}
        <SubMetricCard
          label="퇴직소득세"
          icon={Receipt}
          iconColor="text-rose-500"
          value={formatNumberWithWon(result.taxDetail.totalTax)}
          badge={`세율 ${result.taxDetail.effectiveTaxRate}%`}
          badgeColor="rose"
          description="국세 + 지방세 합산"
          valueColor={result.taxDetail.totalTax > 0 ? 'rose' : 'default'}
        />

        {/* 3) 총 재직기간 */}
        <SubMetricCard
          label="총 재직기간"
          icon={CalendarDays}
          value={result.formattedServicePeriod}
          badge={`${result.totalDays}일`}
          badgeColor="emerald"
          description={`1일 평균임금 ${formatNumberWithWon(result.dailyAverageWage)}`}
          valueColor="default"
        />
      </div>
    </div>
  );
};
