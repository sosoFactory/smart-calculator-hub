import React, { useState, useMemo } from 'react';
import { calculateAge } from '../../../utils/dateCalculator';
import { FormHeader } from '../../../components/common/FormHeader';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Button } from '../../../components/ui/button';
import { DatePicker } from '../../../components/ui/date-picker';
import { Calendar, Copy, Check, Sparkles, Heart, Gift } from 'lucide-react';

export const AgeTab: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => calculateAge(birthDate), [birthDate]);

  const handleCopy = async () => {
    const text = `[스마트 계산기] 만 나이 및 생애 지표 결과
- 생년월일: ${result.birthDate}
- 공식 만 나이: 만 ${result.internationalAge}세 (연 나이: ${result.annualAge}세)
- 살아온 일수: 태어난 지 ${result.daysLived.toLocaleString()}일째
- 띠/별자리: ${result.zodiac} / ${result.horoscope}
- 다음 생일: ${result.daysToNextBirthday === 0 ? '오늘' : `D-${result.daysToNextBirthday}`}`;

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

  const setYearPreset = (year: number) => {
    setBirthDate(`${year}-01-01`);
  };

  const handleReset = () => {
    setBirthDate('2000-01-01');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start w-full">
      {/* 1. 좌측 입력 폼 영역 (5컬럼) */}
      <div className="lg:col-span-5 space-y-4 w-full min-w-0">
        <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-ghost-xl border border-ghost-hairline dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-5 sm:space-y-6 w-full">
          <FormHeader
            badge="나이 측정"
            title="생년월일 입력"
            description="대한민국 2023년 만 나이 통일법 기준 공식 만 나이, 연 나이, 살아온 일수, 12간지 띠 및 별자리를 산출합니다"
            onReset={handleReset}
          />

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-ghost-ink dark:text-ghost-dark-ink-base flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-ghost-ink dark:text-ghost-lime" />
                <span>생년월일 선택</span>
              </label>
              <span className="text-xs font-bold text-ghost-ink dark:text-ghost-lime tabular-nums">
                {birthDate}
              </span>
            </div>
            <DatePicker
              value={birthDate}
              onChange={setBirthDate}
              placeholder="생년월일 (YYYY-MM-DD)"
              startYear={1920}
              endYear={new Date().getFullYear()}
              showTodayButton={false}
            />
          </div>

          {/* 빠른 출생연도 프리셋 칩 (SelectableChip) */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[2000, 1995, 1990, 1985, 1980].map((year) => (
              <SelectableChip
                key={year}
                isSelected={birthDate === `${year}-01-01`}
                onClick={() => setYearPreset(year)}
              >
                {year}년생
              </SelectableChip>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 우측 결과 대시보드 영역 (7컬럼) */}
      <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full min-w-0">
        <div className="space-y-3.5 sm:space-y-4 w-full">
          {/* 메인 다크 서피스 카드 */}
          <div className="relative overflow-hidden rounded-2xl bg-ghost-surface-elevated dark:bg-ghost-dark-surface-elevated border border-ghost-surface-elevated dark:border-ghost-dark-hairline-soft p-5 sm:p-6 text-white shadow-sm">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-ghost-lime/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ghost-lime/20 text-ghost-lime border border-ghost-lime/30">
                  <Calendar className="w-3.5 h-3.5" />
                  공식 만 나이 (2023년 통일법)
                </span>
                <span className="text-xs text-ghost-lime font-bold px-2 py-0.5 rounded-full bg-ghost-lime/10 border border-ghost-lime/20 shrink-0">
                  연 나이 {result.annualAge}세
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
                    <Check className="w-3 h-3 text-ghost-lime" />
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
                <span className="text-3xl sm:text-4xl font-extrabold text-ghost-lime tracking-tight tabular-nums break-keep">
                  만 {result.internationalAge}세
                </span>
                <span className="text-xs sm:text-sm text-slate-300 font-semibold break-keep">
                  (출생일 {result.birthDate} 기준 법적 연령)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3단 서브 요약 지표 카드 (PRD 11.12 단일 규격) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-ghost-ink-mute dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>살아온 날수</span>
              <Heart className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-ghost-ink dark:text-ghost-dark-ink tabular-nums">
              D+{result.daysLived.toLocaleString()}일
            </div>
            <p className="text-[11px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute truncate">
              출생 당일을 1일로 기산
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-ghost-ink-mute dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>다음 생일까지</span>
              <Gift className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-ghost-ink dark:text-ghost-dark-ink tabular-nums">
              {result.daysToNextBirthday === 0 ? '오늘 생일!' : `D-${result.daysToNextBirthday}`}
            </div>
            <p className="text-[11px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute truncate">
              다가오는 생일 D-day
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-ghost-ink-mute dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>띠 / 별자리</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-ghost-ink dark:text-ghost-dark-ink">
              {result.zodiac} • {result.horoscope}
            </div>

            <p className="text-[11px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute truncate">
              12간지 및 서양 12성좌
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

