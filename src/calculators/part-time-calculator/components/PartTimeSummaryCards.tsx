import React, { useState } from 'react';
import { PartTimeCalculationResult, PartTimeInput } from '../../../types/partTime';
import { formatKoreanUnit, formatNumberWithWon } from '../../../utils/formatters';
import { Badge } from '../../../components/ui/badge';
import { SegmentedControl, SegmentedOption } from '../../../components/ui/segmented-control';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import { ResultHeroCard } from '../../../components/common/ResultHeroCard';
import { CopyResultButton } from '../../../components/common/CopyResultButton';
import { Sparkles, Clock, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

interface PartTimeSummaryCardsProps {
  input: PartTimeInput;
  result: PartTimeCalculationResult;
}

export const PartTimeSummaryCards: React.FC<PartTimeSummaryCardsProps> = ({ input, result }) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');

  const { weekly, monthly, isHolidayAllowanceEligible, ineligibilityReason, effectiveHourlyRate, effectiveRateIncreasePercent } = result;
  const currentView = viewMode === 'monthly' ? monthly : weekly;
  const periodLabel = viewMode === 'monthly' ? '월' : '주';

  const workHoursToDisplay = `주 ${input.weeklyWorkHours}시간`;

  const getCopyText = () => `[스마트 계산기] 2026 알바 급여 & 주휴수당 계산 결과
- 시급: ${formatNumberWithWon(input.hourlyWage)}
- 주당 근로시간: ${workHoursToDisplay}
- 주휴수당 발생 여부: ${isHolidayAllowanceEligible ? `발생 (주 ${weekly.holidayAllowanceHours.toFixed(1)}시간 인정)` : `미발생 (${ineligibilityReason ?? '요건 미충족'})`}
- 실질 체감 시급: ${formatNumberWithWon(effectiveHourlyRate)} (+${effectiveRateIncreasePercent}%)
- 세금 공제: ${input.taxType === 'none' ? '미적용 (0%)' : input.taxType === 'freelancer' ? '프리랜서 (3.3%)' : '4대 보험 (약 9.4%)'}
------------------------------------
[월간 기준 환산 (월 4.35주)]
- 월 예상 실수령액: ${formatNumberWithWon(monthly.netWage)} (${formatKoreanUnit(monthly.netWage)})
- 월 세전 총급여: ${formatNumberWithWon(monthly.grossWage)}
  * 기본급: ${formatNumberWithWon(monthly.baseWage)}
  * 주휴수당: ${formatNumberWithWon(monthly.holidayAllowance)}
  * 가산수당: ${formatNumberWithWon(monthly.additionalPayTotal)}
- 월 총 공제액: ${formatNumberWithWon(monthly.taxAmount)}
------------------------------------
[주간 기준]
- 주 예상 실수령액: ${formatNumberWithWon(weekly.netWage)}
- 주 세전 총급여: ${formatNumberWithWon(weekly.grossWage)}
  * 주 기본급: ${formatNumberWithWon(weekly.baseWage)}
  * 주 주휴수당: ${formatNumberWithWon(weekly.holidayAllowance)}`;

  const VIEW_OPTIONS: SegmentedOption<'monthly' | 'weekly'>[] = [
    { id: 'monthly', label: '월급 기준' },
    { id: 'weekly', label: '주급 기준' },
  ];

  return (
    <div className="@container space-y-3">
      {/* 보기 전환 토글 (월 기준 / 주 기준) */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-bold text-ghost-ink dark:text-ghost-dark-ink">
          급여 수령 기준
        </span>
        <div className="w-44">
          <SegmentedControl
            options={VIEW_OPTIONS}
            value={viewMode}
            onChange={setViewMode}
            variant="slate-solid"
          />
        </div>
      </div>

      {/* 1. 최상단 대형 메인 하이라이트 카드 (예상 실수령액) */}
      <ResultHeroCard
        badge={
          <>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
              <Sparkles className="w-3 h-3" />
              {periodLabel} 예상 실수령액
            </span>

            {isHolidayAllowanceEligible ? (
              <Badge
                variant="outline"
                className="text-[11px] font-semibold border-[#d1ff19]/40 text-[#d1ff19] bg-[#d1ff19]/10 whitespace-nowrap"
              >
                주휴수당 포함 (실질시급 {formatNumberWithWon(effectiveHourlyRate)})
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[11px] font-medium border-slate-700 dark:border-ghost-dark-hairline-soft text-slate-400 bg-slate-800/60 dark:bg-ghost-dark-hairline whitespace-nowrap"
              >
                주휴수당 미발생
              </Badge>
            )}
          </>
        }
        action={<CopyResultButton text={getCopyText} />}
        mainValue={`${currentView.netWage.toLocaleString('ko-KR')}원`}
        koreanReading={formatKoreanUnit(currentView.netWage)}
        subtext={
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {isHolidayAllowanceEligible ? (
              <span className="break-keep">
                기본시급 <strong className="text-white tabular-nums">{formatNumberWithWon(input.hourlyWage)}</strong> ➔ 
                주휴 포함 실질 시급 <strong className="text-[#d1ff19] tabular-nums">{formatNumberWithWon(effectiveHourlyRate)}</strong>
                <span className="text-[#d1ff19] font-medium ml-1">(+{effectiveRateIncreasePercent}%)</span>
              </span>
            ) : (
              <span className="text-slate-400 break-keep flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />
                {ineligibilityReason ?? '주 15시간 미만 초단시간 근로 (주휴수당 미발생)'}
              </span>
            )}
          </div>
        }
      >
        {/* 하단 요약 인포 바 */}
        <div className="mt-4 pt-3 border-t border-slate-800 dark:border-ghost-dark-hairline flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            {periodLabel} 총 유급시간: <strong className="text-white tabular-nums">{currentView.totalPaidHours.toFixed(1)}시간</strong>
            {viewMode === 'monthly' && <span className="text-slate-500 ml-1">(월 4.35주 환산)</span>}
          </span>
          <span>
            세전 {periodLabel}급: <strong className="text-white tabular-nums">{formatNumberWithWon(currentView.grossWage)}</strong>
          </span>
        </div>
      </ResultHeroCard>

      {/* 2. 하단 3단 서브 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <SubMetricCard
          label="기본 급여"
          icon={Clock}
          iconColor="indigo"
          badge={`${currentView.workHours.toFixed(1)}시간`}
          badgeColor="slate"
          value={formatNumberWithWon(currentView.baseWage)}
          description={`${input.hourlyWage.toLocaleString()}원 × ${currentView.workHours.toFixed(1)}h`}
        />

        <SubMetricCard
          label="주휴수당"
          icon={Calendar}
          iconColor="emerald"
          badge={isHolidayAllowanceEligible ? `유급 ${currentView.holidayAllowanceHours.toFixed(1)}시간` : '미발생'}
          badgeColor={isHolidayAllowanceEligible ? 'emerald' : 'slate'}
          value={formatNumberWithWon(currentView.holidayAllowance)}
          description={isHolidayAllowanceEligible ? `${formatKoreanUnit(currentView.holidayAllowance)} 추가 지급` : '주 15시간 미만'}
        />

        <SubMetricCard
          label={`공제액 (${input.taxType === 'none' ? '0%' : input.taxType === 'freelancer' ? '3.3%' : '약 9.4%'})`}
          icon={ShieldCheck}
          iconColor="rose"
          badge={
            currentView.grossWage > 0
              ? `${((currentView.taxAmount / currentView.grossWage) * 100).toFixed(1)}%`
              : '0%'
          }
          badgeColor="rose"
          value={`-${formatNumberWithWon(currentView.taxAmount)}`}
          valueColor="rose"
          description={
            input.taxType === 'none'
              ? '세금 미적용 (전액 수령)'
              : input.taxType === 'freelancer'
              ? '사업소득세 3.3%'
              : '4대 보험 근로자 부담분'
          }
        />
      </div>
    </div>
  );
};
