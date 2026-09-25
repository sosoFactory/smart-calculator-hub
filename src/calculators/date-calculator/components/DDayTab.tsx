import React, { useState, useMemo } from 'react';
import { calculateDDay, formatLocalDate, getTodayString } from '../../../utils/dateCalculator';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Calendar, Copy, Check, Clock, CalendarDays, Milestone } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

export const DDayTab: React.FC = () => {
  const today = getTodayString();
  const [targetDate, setTargetDate] = useState<string>(() => {
    // 기본값: 오늘 기준 30일 뒤
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return formatLocalDate(d);
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const result = useMemo(() => calculateDDay(targetDate, today), [targetDate, today]);

  const handleCopy = async () => {
    const statusText =
      result.diffDays > 0
        ? `${result.diffDays}일 남음`
        : result.diffDays === 0
        ? '오늘'
        : `${Math.abs(result.diffDays)}일 지남`;
    const text = `[디데이 결과]\n목표일: ${result.targetDate}\n상태: ${result.label} (${statusText})`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      toast({
        title: '디데이 결과가 복사되었습니다',
        description: '원하는 곳에 붙여넣어 공유해보세요.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: '복사 실패',
        description: '직접 텍스트를 선택하여 복사해주세요.',
        variant: 'destructive',
      });
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
    <div className="space-y-4 sm:space-y-6">
      {/* 1. 입력 폼 영역 */}
      <Card className="p-4 sm:p-5 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
            <span>목표일 또는 기념일 선택</span>
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50 dark:bg-ghost-dark-surface-elevated text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink focus:outline-none focus:ring-2 focus:ring-[#112220] dark:focus:ring-[#d1ff19]"
          />
        </div>

        {/* 빠른 프리셋 버튼 칩 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(0)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            오늘 (D-DAY)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(7)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            +7일 (1주 뒤)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(30)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            +30일
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(100)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            +100일
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={setYearEnd}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            올해 말 (12/31)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={setNextYear}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            새해 (1/1)
          </Button>
        </div>
      </Card>

      {/* 2. 메인 결과 하이라이트 카드 */}
      <Card className="p-4 sm:p-6 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute uppercase tracking-wider block mb-1">
              디데이 카운트다운
            </span>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#112220] dark:text-white tracking-tight tabular-nums">
                {result.label}
              </h2>
              <Badge
                variant="outline"
                className={`text-xs px-2.5 py-0.5 font-bold ${
                  result.isToday
                    ? 'bg-[#d1ff19] text-[#112220] border-[#d1ff19]'
                    : result.isPast
                    ? 'bg-slate-100 text-slate-600 dark:bg-ghost-dark-surface-elevated dark:text-ghost-dark-ink-soft border-slate-200 dark:border-ghost-dark-hairline'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-[#d1ff19] border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {result.isToday
                  ? '오늘이 바로 그날!'
                  : result.isPast
                  ? `${Math.abs(result.diffDays)}일 경과`
                  : `${result.diffDays}일 남음`}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-ghost-dark-ink-soft mt-1.5 font-medium">
              기준일({result.baseDate})로부터 목표일({result.targetDate})까지
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2.5 gap-1.5 text-xs border-slate-200 dark:border-ghost-dark-hairline text-slate-600 dark:text-ghost-dark-ink-soft hover:bg-slate-50 dark:hover:bg-ghost-dark-hover"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>복사</span>
          </Button>
        </div>

        {/* 3단 서브 요약 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-ghost-dark-hairline">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>오늘 기준일</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink truncate">
              {result.baseDate}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <CalendarDays className="w-3 h-3 text-slate-400" />
              <span>목표/기념일</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink truncate">
              {result.targetDate}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <Milestone className="w-3 h-3 text-slate-400" />
              <span>현재 상태</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink truncate">
              {result.isToday ? 'D-DAY 당일' : result.isPast ? `D+${Math.abs(result.diffDays)} 경과` : `D-${result.diffDays} 진행 중`}
            </div>
          </div>
        </div>
      </Card>

      {/* 3. 주요 기념일 마일스톤 테이블 */}
      <Card className="p-4 sm:p-5 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink flex items-center gap-1.5">
            <Milestone className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
            <span>선택 날짜 기준 주요 기념일 캘린더</span>
          </h3>
          <span className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-mute">시작일 = 1일차</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-ghost-dark-hairline text-slate-400 dark:text-ghost-dark-ink-mute">
                <th className="py-2 px-2 font-semibold">기념일</th>
                <th className="py-2 px-2 font-semibold">날짜</th>
                <th className="py-2 px-2 font-semibold">요일</th>
                <th className="py-2 px-2 font-semibold text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-ghost-dark-hairline">
              {result.milestones.map((m) => (
                <tr key={m.days} className="hover:bg-slate-50/50 dark:hover:bg-ghost-dark-hover transition-colors">
                  <td className="py-2.5 px-2 font-bold text-[#112220] dark:text-ghost-dark-ink">
                    {m.label}
                  </td>
                  <td className="py-2.5 px-2 text-slate-600 dark:text-ghost-dark-ink-soft tabular-nums">
                    {m.date}
                  </td>
                  <td className="py-2.5 px-2 text-slate-500 dark:text-ghost-dark-ink-mute">
                    {m.dayOfWeek}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 font-medium ${
                        m.isPast
                          ? 'bg-slate-100 text-slate-400 dark:bg-ghost-dark-surface-elevated dark:text-ghost-dark-ink-stone border-transparent'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-[#d1ff19] border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {m.isPast ? '지남' : '예정'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
