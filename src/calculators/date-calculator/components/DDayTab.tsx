import React, { useState, useMemo } from 'react';
import { calculateDDay, formatLocalDate, getTodayString } from '../../../utils/dateCalculator';
import { FormHeader } from '../../../components/common/FormHeader';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Calendar, Copy, Check, Clock, CalendarDays, Milestone } from 'lucide-react';

export const DDayTab: React.FC = () => {
  const today = getTodayString();
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return formatLocalDate(d);
  };

  const [targetDate, setTargetDate] = useState<string>(getDefaultDate);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => calculateDDay(targetDate, today), [targetDate, today]);

  const handleCopy = async () => {
    const statusText =
      result.diffDays > 0
        ? `${result.diffDays}일 남음`
        : result.diffDays === 0
        ? '오늘'
        : `${Math.abs(result.diffDays)}일 지남`;
    const text = `[스마트 계산기] 디데이 계산 결과
- 목표일: ${result.targetDate}
- 현재 상태: ${result.label} (${statusText})
- 기준일: ${result.baseDate}`;

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

  const setPreset = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    setTargetDate(formatLocalDate(d));
  };

  const setYearEnd = () => {
    const currentYear = new Date().getFullYear();
    setTargetDate(`${currentYear}-12-31`);
  };

  const setNextYear = () => {
    const nextYear = new Date().getFullYear() + 1;
    setTargetDate(`${nextYear}-01-01`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* 1. 입력 폼 영역 (표준 FormHeader + SelectableChip) */}
      <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-5 sm:space-y-6 w-full">
        <FormHeader
          badge="디데이 설정"
          title="목표일 또는 기념일 선택"
          description="시험, 약속, 커플 기념일 등 목표 날짜를 지정하면 실시간 디데이와 주요 기념일 캘린더를 계산합니다"
          onReset={() => setTargetDate(getDefaultDate())}
        />

        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
                <span>목표 날짜</span>
              </label>
              <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
                {targetDate}
              </span>
            </div>

            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-slate-900/60 text-sm font-bold text-[#112220] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#15171a] dark:focus:ring-[#d1ff19] transition-all"
            />

            {/* 표준 프리셋 칩 (SelectableChip) */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              <SelectableChip
                isSelected={result.diffDays === 0}
                onClick={() => setPreset(0)}
              >
                오늘 (D-DAY)
              </SelectableChip>
              <SelectableChip
                isSelected={result.diffDays === 7}
                onClick={() => setPreset(7)}
              >
                +7일 (1주 뒤)
              </SelectableChip>
              <SelectableChip
                isSelected={result.diffDays === 30}
                onClick={() => setPreset(30)}
              >
                +30일
              </SelectableChip>
              <SelectableChip
                isSelected={result.diffDays === 100}
                onClick={() => setPreset(100)}
              >
                +100일
              </SelectableChip>
              <SelectableChip
                isSelected={targetDate.endsWith('12-31')}
                onClick={setYearEnd}
              >
                올해 말 (12/31)
              </SelectableChip>
              <SelectableChip
                isSelected={targetDate.endsWith('01-01') && targetDate > today}
                onClick={setNextYear}
              >
                새해 (1/1)
              </SelectableChip>
            </div>
          </div>
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
                  <CalendarDays className="w-3.5 h-3.5" />
                  디데이 카운트다운
                </span>
                <span className="text-xs text-[#d1ff19] font-bold px-2 py-0.5 rounded-full bg-[#d1ff19]/10 border border-[#d1ff19]/20 shrink-0">
                  {result.isToday ? '오늘 당일' : result.isPast ? '과거 기준일' : '미래 목표일'}
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
                  {result.label}
                </span>
                <span className="text-xs sm:text-sm text-slate-300 font-semibold break-keep">
                  {result.isToday
                    ? '오늘이 바로 지정하신 날입니다'
                    : result.isPast
                    ? `${Math.abs(result.diffDays)}일 지났습니다`
                    : `${result.diffDays}일 남았습니다`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                기준일({result.baseDate}) ➔ 목표일({result.targetDate})
              </p>
            </div>
          </div>
        </div>

        {/* 3단 서브 요약 지표 카드 (PRD 11.12 단일 규격) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>오늘 기준일</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.baseDate}
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              연산 기준 시점
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>목표/기념일</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.targetDate}
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              설정된 타겟 날짜
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>현재 상태</span>
              <Milestone className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink truncate">
              {result.isToday ? 'D-DAY 당일' : result.isPast ? `D+${Math.abs(result.diffDays)} 경과` : `D-${result.diffDays} 진행 중`}
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              {result.isPast ? '기준일 이후 경과 일수' : '도달까지 남은 기간'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. 주요 기념일 캘린더 테이블 */}
      <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="meta" size="sm" className="shrink-0 font-bold">
              기념일 캘린더
            </Badge>
            <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink">
              주요 기념일 및 마일스톤 날짜
            </h3>
          </div>
          <span className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute">시작일 = 1일차</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-ghost-dark-hairline text-[#64748b] dark:text-ghost-dark-ink-mute">
                <th className="py-2.5 px-3 font-bold">기념일</th>
                <th className="py-2.5 px-3 font-bold">도달 날짜</th>
                <th className="py-2.5 px-3 font-bold">요일</th>
                <th className="py-2.5 px-3 font-bold text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb] dark:divide-ghost-dark-hairline">
              {result.milestones.map((m) => (
                <tr key={m.days} className="hover:bg-slate-50/50 dark:hover:bg-ghost-dark-hover transition-colors">
                  <td className="py-3 px-3 font-bold text-[#112220] dark:text-ghost-dark-ink">
                    {m.label}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-ghost-dark-ink-soft tabular-nums font-semibold">
                    {m.date}
                  </td>
                  <td className="py-3 px-3 text-[#64748b] dark:text-ghost-dark-ink-mute font-medium">
                    {m.dayOfWeek}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.isPast
                          ? 'bg-slate-100 text-slate-400 dark:bg-ghost-dark-surface-elevated dark:text-ghost-dark-ink-stone'
                          : 'bg-[#d1ff19]/20 text-[#112220] dark:text-[#d1ff19] border border-[#d1ff19]/30'
                      }`}
                    >
                      {m.isPast ? '지남' : '예정'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
