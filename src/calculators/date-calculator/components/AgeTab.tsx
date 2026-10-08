import React, { useState, useMemo } from 'react';
import { calculateAge } from '../../../utils/dateCalculator';
import { FormHeader } from '../../../components/common/FormHeader';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { DatePicker } from '../../../components/ui/date-picker';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import { ResultHeroCard } from '../../../components/common/ResultHeroCard';
import { CopyResultButton } from '../../../components/common/CopyResultButton';
import { Calendar, Sparkles, Heart, Gift } from 'lucide-react';

export const AgeTab: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');

  const result = useMemo(() => calculateAge(birthDate), [birthDate]);

  const getCopyText = () => `[스마트 계산기] 만 나이 및 생애 지표 결과
- 생년월일: ${result.birthDate}
- 공식 만 나이: 만 ${result.internationalAge}세 (연 나이: ${result.annualAge}세)
- 살아온 일수: 태어난 지 ${result.daysLived.toLocaleString()}일째
- 띠/별자리: ${result.zodiac} / ${result.horoscope}
- 다음 생일: ${result.daysToNextBirthday === 0 ? '오늘' : `D-${result.daysToNextBirthday}`}`;

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
          <ResultHeroCard
            badge={
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ghost-lime/20 text-ghost-lime border border-ghost-lime/30">
                  <Calendar className="w-3.5 h-3.5" />
                  공식 만 나이 (2023년 통일법)
                </span>
                <span className="text-xs text-ghost-lime font-bold px-2 py-0.5 rounded-full bg-ghost-lime/10 border border-ghost-lime/20 shrink-0">
                  연 나이 {result.annualAge}세
                </span>
              </>
            }
            action={<CopyResultButton text={getCopyText} />}
            mainValue={`만 ${result.internationalAge}세`}
            subtext={
              <span className="text-xs sm:text-sm text-slate-300 font-semibold break-keep">
                (출생일 {result.birthDate} 기준 법적 연령)
              </span>
            }
          />

        {/* 3단 서브 요약 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <SubMetricCard
            label="살아온 날수"
            icon={Heart}
            iconColor="rose"
            value={`D+${result.daysLived.toLocaleString()}일`}
            description="출생 당일을 1일로 기산"
          />

          <SubMetricCard
            label="다음 생일까지"
            icon={Gift}
            iconColor="indigo"
            badge={result.daysToNextBirthday === 0 ? '축하합니다' : undefined}
            badgeColor="emerald"
            value={result.daysToNextBirthday === 0 ? '오늘 생일!' : `D-${result.daysToNextBirthday}`}
            description="다가오는 생일 D-day"
          />

          <SubMetricCard
            label="띠 / 별자리"
            icon={Sparkles}
            iconColor="amber"
            value={`${result.zodiac} • ${result.horoscope}`}
            description="12간지 및 서양 12성좌"
          />
        </div>
      </div>
    </div>
  </div>
);
};

