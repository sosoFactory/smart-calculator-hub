import React, { useState, useMemo } from 'react';
import { calculateDateDiff, formatLocalDate, getTodayString } from '../../../utils/dateCalculator';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Calendar, Copy, Check, Briefcase, SunMedium, CalendarRange } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

export const DateDiffTab: React.FC = () => {
  const today = getTodayString();
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return formatLocalDate(d);
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const result = useMemo(() => calculateDateDiff(startDate, endDate), [startDate, endDate]);

  const handleCopy = async () => {
    const text = `[날짜 간격 계산 결과]\n기간: ${result.startDate} ~ ${result.endDate}\n총 일수: ${result.totalDays}일 (${result.formattedPeriod})\n평일 근무일: ${result.businessDays}일\n주말: ${result.weekendDays}일`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      toast({
        title: '날짜 간격 결과가 복사되었습니다',
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. 입력 폼 영역 */}
      <Card className="p-4 sm:p-5 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
              <span>시작일</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50 dark:bg-ghost-dark-surface-elevated text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink focus:outline-none focus:ring-2 focus:ring-[#112220] dark:focus:ring-[#d1ff19]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink mb-1.5 flex items-center gap-1.5">
              <CalendarRange className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
              <span>종료일</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50 dark:bg-ghost-dark-surface-elevated text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink focus:outline-none focus:ring-2 focus:ring-[#112220] dark:focus:ring-[#d1ff19]"
            />
          </div>
        </div>

        {/* 빠른 프리셋 버튼 칩 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDiffPreset(7)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            오늘부터 1주일
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDiffPreset(30)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            오늘부터 1개월
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDiffPreset(100)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            오늘부터 100일
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={setThisMonth}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            이번 달 (1일~말일)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={setYearEnd}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            올해 남은 기간
          </Button>
        </div>
      </Card>

      {/* 2. 메인 결과 하이라이트 카드 */}
      <Card className="p-4 sm:p-6 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute uppercase tracking-wider block mb-1">
              두 날짜 간격 계산 결과
            </span>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#112220] dark:text-white tracking-tight tabular-nums">
                {result.totalDays.toLocaleString()}일간
              </h2>
              <Badge
                variant="outline"
                className="text-xs px-2.5 py-0.5 font-bold bg-[#d1ff19] text-[#112220] border-[#d1ff19]"
              >
                약 {result.weeks}주차
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-ghost-dark-ink-soft mt-1.5 font-medium">
              {result.startDate} ~ {result.endDate} ({result.formattedPeriod})
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
              <Briefcase className="w-3 h-3 text-emerald-500" />
              <span>평일 근무일 (영업일)</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.businessDays.toLocaleString()}일
            </div>
            <p className="text-[10px] text-slate-400 dark:text-ghost-dark-ink-stone mt-0.5">
              주말(토/일) 제외 순수 근무일
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <SunMedium className="w-3 h-3 text-amber-500" />
              <span>주말 일수 (토/일)</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.weekendDays.toLocaleString()}일
            </div>
            <p className="text-[10px] text-slate-400 dark:text-ghost-dark-ink-stone mt-0.5">
              휴일 토요일 및 일요일
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <CalendarRange className="w-3 h-3 text-indigo-500" />
              <span>총 주차(Weeks)</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.weeks}주 {result.totalDays % 7}일
            </div>
            <p className="text-[10px] text-slate-400 dark:text-ghost-dark-ink-stone mt-0.5">
              7일 단위 주차 환산
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
