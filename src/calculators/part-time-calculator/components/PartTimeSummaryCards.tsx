import React, { useState } from 'react';
import { PartTimeCalculationResult, PartTimeInput } from '../../../types/partTime';
import { formatKoreanUnit, formatNumberWithWon } from '../../../utils/formatters';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Copy, Check, Sparkles, Clock, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

interface PartTimeSummaryCardsProps {
  input: PartTimeInput;
  result: PartTimeCalculationResult;
}

export const PartTimeSummaryCards: React.FC<PartTimeSummaryCardsProps> = ({ input, result }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');

  const { weekly, monthly, isHolidayAllowanceEligible, ineligibilityReason, effectiveHourlyRate, effectiveRateIncreasePercent } = result;
  const currentView = viewMode === 'monthly' ? monthly : weekly;
  const periodLabel = viewMode === 'monthly' ? '월' : '주';

  const workHoursToDisplay = input.scheduleMode === 'weekly_total'
    ? `${input.weeklyTotalHours}시간`
    : `주 ${input.workingDaysPerWeek}일 × ${input.dailyHours}시간 (${input.dailyHours * input.workingDaysPerWeek}시간)`;

  const handleCopy = async () => {
    const text = `[스마트 계산기] 2026 알바 급여 & 주휴수당 계산 결과
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
      {/* 보기 전환 토글 (월 기준 / 주 기준) */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-semibold text-ghost-dark-ink-soft dark:text-ghost-dark-ink-mute">
          급여 수령 기준
        </span>
        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-ghost-dark-surface-deep border border-slate-200 dark:border-ghost-dark-hairline">
          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'monthly'
                ? 'bg-white dark:bg-ghost-dark-surface-elevated text-slate-900 dark:text-ghost-dark-ink shadow-sm'
                : 'text-slate-600 dark:text-ghost-dark-ink-mute hover:text-slate-900 dark:hover:text-ghost-dark-ink'
            }`}
          >
            월급 기준
          </button>
          <button
            type="button"
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'weekly'
                ? 'bg-white dark:bg-ghost-dark-surface-elevated text-slate-900 dark:text-ghost-dark-ink shadow-sm'
                : 'text-slate-600 dark:text-ghost-dark-ink-mute hover:text-slate-900 dark:hover:text-ghost-dark-ink'
            }`}
          >
            주급 기준
          </button>
        </div>
      </div>

      {/* 1. 최상단 대형 메인 하이라이트 카드 (예상 실수령액) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft text-white p-5 sm:p-6 shadow-sm">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
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
            </div>

            <div className="flex flex-wrap items-baseline gap-2 pt-1">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#d1ff19] tabular-nums whitespace-nowrap">
                {currentView.netWage.toLocaleString('ko-KR')}
                <span className="text-lg sm:text-xl font-medium text-slate-200 ml-1">
                  원
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">
                ({formatKoreanUnit(currentView.netWage)})
              </span>
            </div>

            {/* 실질 시급 인상 효과 배너 */}
            <div className="text-xs text-slate-300 pt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              {isHolidayAllowanceEligible ? (
                <span className="break-keep">
                  기본시급 <strong className="text-white tabular-nums">{formatNumberWithWon(input.hourlyWage)}</strong> ➔ 
                  주휴 포함 실질 시급 <strong className="text-[#d1ff19] tabular-nums">{formatNumberWithWon(effectiveHourlyRate)}</strong>
                  <span className="text-[#d1ff19] font-medium ml-1">(+{effectiveRateIncreasePercent}%)</span>
                </span>
              ) : (
                <span className="text-slate-400 break-keep flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />
                  {ineligibilityReason ?? (!input.hasAttendance ? '결근으로 주휴수당 미반영' : '주 15시간 미만 초단시간 근로')}
                </span>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="self-start sm:self-auto h-8 px-3 text-xs bg-slate-800/80 dark:bg-ghost-dark-hairline hover:bg-slate-700 dark:hover:bg-ghost-dark-hairline-soft border-slate-700 dark:border-ghost-dark-hairline-soft text-white shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-[#d1ff19]" />
                복사 완료
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                결과 복사
              </>
            )}
          </Button>
        </div>

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
      </div>

      {/* 2. 하단 3단 서브 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 카드 1: 기본급 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-ghost-dark-surface border border-slate-200 dark:border-ghost-dark-hairline shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-ghost-dark-ink-mute flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              기본 급여
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-ghost-dark-ink-stone tabular-nums">
              {currentView.workHours.toFixed(1)}시간
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-ghost-dark-ink tabular-nums">
            {formatNumberWithWon(currentView.baseWage)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute truncate">
            {input.hourlyWage.toLocaleString()}원 × {currentView.workHours.toFixed(1)}h
          </div>
        </div>

        {/* 카드 2: 주휴수당 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-ghost-dark-surface border border-slate-200 dark:border-ghost-dark-hairline shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-ghost-dark-ink-mute flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              주휴수당
            </span>
            <span className={`text-[11px] font-semibold tabular-nums ${isHolidayAllowanceEligible ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-ghost-dark-ink-stone'}`}>
              {isHolidayAllowanceEligible ? `유급 ${currentView.holidayAllowanceHours.toFixed(1)}시간` : '미발생'}
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-ghost-dark-ink tabular-nums">
            {formatNumberWithWon(currentView.holidayAllowance)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute truncate">
            {isHolidayAllowanceEligible ? `${formatKoreanUnit(currentView.holidayAllowance)} 추가 지급` : '주 15시간 미만/결근'}
          </div>
        </div>

        {/* 카드 3: 세금 및 공제 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-ghost-dark-surface border border-slate-200 dark:border-ghost-dark-hairline shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-ghost-dark-ink-mute flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              공제액 ({input.taxType === 'none' ? '0%' : input.taxType === 'freelancer' ? '3.3%' : '약 9.4%'})
            </span>
            <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 tabular-nums">
              {currentView.grossWage > 0
                ? `${((currentView.taxAmount / currentView.grossWage) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-ghost-dark-ink tabular-nums">
            -{formatNumberWithWon(currentView.taxAmount)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute truncate">
            {input.taxType === 'none' ? '세금 미적용 (전액 수령)' : input.taxType === 'freelancer' ? '사업소득세 3.3%' : '4대 보험 근로자 부담분'}
          </div>
        </div>
      </div>
    </div>
  );
};
