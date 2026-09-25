import React, { useState, useMemo } from 'react';
import { calculateDateDiff, formatLocalDate, getTodayString } from '../../../utils/dateCalculator';
import { FormHeader } from '../../../components/common/FormHeader';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Button } from '../../../components/ui/button';
import { DatePicker } from '../../../components/ui/date-picker';
import { Calendar, Copy, Check, Briefcase, SunMedium, CalendarRange } from 'lucide-react';

export const DateDiffTab: React.FC = () => {
  const today = getTodayString();
  const getDefaultEnd = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return formatLocalDate(d);
  };

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(getDefaultEnd);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => calculateDateDiff(startDate, endDate), [startDate, endDate]);

  const handleCopy = async () => {
    const text = `[스마트 계산기] 날짜 간격 계산 결과
- 기간: ${result.startDate} ~ ${result.endDate}
- 총 일수: ${result.totalDays.toLocaleString()}일 (${result.formattedPeriod})
- 평일 근무일: ${result.businessDays.toLocaleString()}일 (주말 제외)
- 주말(토/일): ${result.weekendDays.toLocaleString()}일`;

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

  const setDiffPreset = (days: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);
    setStartDate(formatLocalDate(start));
    setEndDate(formatLocalDate(end));
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(formatLocalDate(start));
    setEndDate(formatLocalDate(end));
  };

  const setYearEnd = () => {
    const now = new Date();
    const end = new Date(now.getFullYear(), 11, 31);
    setStartDate(formatLocalDate(now));
    setEndDate(formatLocalDate(end));
  };

  const handleReset = () => {
    setStartDate(today);
    setEndDate(getDefaultEnd());
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* 1. 입력 폼 영역 (표준 FormHeader + SelectableChip) */}
      <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-5 sm:space-y-6 w-full">
        <FormHeader
          badge="간격 측정"
          title="시작일 및 종료일 입력"
          description="두 날짜 사이의 총 일수와 주말을 제외한 평일 근무일수(영업일)를 정확히 계산합니다"
          onReset={handleReset}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
                <span>시작일</span>
              </label>
              <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
                {startDate}
              </span>
            </div>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="시작일을 선택하세요"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base flex items-center gap-1.5">
                <CalendarRange className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
                <span>종료일</span>
              </label>
              <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
                {endDate}
              </span>
            </div>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="종료일을 선택하세요"
            />
          </div>
        </div>

        {/* 빠른 프리셋 칩 (SelectableChip) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <SelectableChip
            isSelected={startDate === today && result.totalDays === 7}
            onClick={() => setDiffPreset(7)}
          >
            오늘부터 1주일
          </SelectableChip>
          <SelectableChip
            isSelected={startDate === today && result.totalDays === 30}
            onClick={() => setDiffPreset(30)}
          >
            오늘부터 1개월
          </SelectableChip>
          <SelectableChip
            isSelected={startDate === today && result.totalDays === 100}
            onClick={() => setDiffPreset(100)}
          >
            오늘부터 100일
          </SelectableChip>
          <SelectableChip
            isSelected={false}
            onClick={setThisMonth}
          >
            이번 달 (1일~말일)
          </SelectableChip>
          <SelectableChip
            isSelected={endDate.endsWith('12-31') && startDate === today}
            onClick={setYearEnd}
          >
            올해 남은 기간
          </SelectableChip>
        </div>
      </div>

      {/* 2. 메인 결과 대시보드 (PRD 11.12 단일 디자인 규격 준수) */}
      <div className="space-y-3.5 sm:space-y-4 w-full">
        {/* 메인 다크 서피스 카드 */}
        <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft p-5 sm:p-6 text-white shadow-sm">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
                  <CalendarRange className="w-3.5 h-3.5" />
                  두 날짜 간격 계산 결과
                </span>
                <span className="text-xs text-[#d1ff19] font-bold px-2 py-0.5 rounded-full bg-[#d1ff19]/10 border border-[#d1ff19]/20 shrink-0">
                  약 {result.weeks}주차
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
              <div className="flex items-baseline gap-2.5 flex-wrap pt-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#d1ff19] tracking-tight tabular-nums break-keep">
                  {result.totalDays.toLocaleString()}일간
                </span>
                <span className="text-xs sm:text-sm text-slate-300 font-semibold break-keep">
                  ({result.formattedPeriod})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {result.startDate} ~ {result.endDate}
              </p>
            </div>
          </div>
        </div>

        {/* 3단 서브 요약 지표 카드 (PRD 11.12 단일 규격) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>평일 근무일 (영업일)</span>
              <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.businessDays.toLocaleString()}일
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              주말(토/일) 제외 순수 근무일
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>주말 일수 (토/일)</span>
              <SunMedium className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.weekendDays.toLocaleString()}일
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              휴일 토요일 및 일요일
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>총 주차(Weeks)</span>
              <CalendarRange className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.weeks}주 {result.totalDays % 7}일
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              7일 단위 주차 환산
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
