import React, { useState, useMemo } from 'react';
import { calculateAge } from '../../../utils/dateCalculator';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Calendar, Copy, Check, Sparkles, Heart, Gift } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

export const AgeTab: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const result = useMemo(() => calculateAge(birthDate), [birthDate]);

  const handleCopy = async () => {
    const text = `[만 나이 및 생애 지표 결과]\n생년월일: ${result.birthDate}\n공식 만 나이: 만 ${result.internationalAge}세 (연 나이: ${result.annualAge}세)\n살아온 날수: 태어난 지 ${result.daysLived.toLocaleString()}일째\n띠/별자리: ${result.zodiac} / ${result.horoscope}\n다음 생일: D-${result.daysToNextBirthday}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      toast({
        title: '나이 계산 결과가 복사되었습니다',
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

  const setYearPreset = (year: number) => {
    setBirthDate(`${year}-01-01`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. 입력 폼 영역 */}
      <Card className="p-4 sm:p-5 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
            <span>생년월일 선택</span>
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50 dark:bg-ghost-dark-surface-elevated text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink focus:outline-none focus:ring-2 focus:ring-[#112220] dark:focus:ring-[#d1ff19]"
          />
        </div>

        {/* 빠른 출생연도 프리셋 버튼 칩 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setYearPreset(2000)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            2000년생
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setYearPreset(1995)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            1995년생
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setYearPreset(1990)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            1990년생
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setYearPreset(1985)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            1985년생
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setYearPreset(1980)}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            1980년생
          </Button>
        </div>
      </Card>

      {/* 2. 메인 결과 하이라이트 카드 */}
      <Card className="p-4 sm:p-6 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute uppercase tracking-wider block mb-1">
              대한민국 공식 만 나이 (2023년 만 나이 통일법)
            </span>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#112220] dark:text-white tracking-tight tabular-nums">
                만 {result.internationalAge}세
              </h2>
              <Badge
                variant="outline"
                className="text-xs px-2.5 py-0.5 font-bold bg-[#d1ff19] text-[#112220] border-[#d1ff19]"
              >
                연 나이 {result.annualAge}세
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-ghost-dark-ink-soft mt-1.5 font-medium">
              출생일 {result.birthDate} 기준 공식 법적 연령
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
              <Heart className="w-3 h-3 text-rose-500" />
              <span>살아온 날수</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              D+{result.daysLived.toLocaleString()}일
            </div>
            <p className="text-[10px] text-slate-400 dark:text-ghost-dark-ink-stone mt-0.5">
              출생 당일을 1일로 기산
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <Gift className="w-3 h-3 text-violet-500" />
              <span>다음 생일까지</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.daysToNextBirthday === 0 ? '오늘 생일!' : `D-${result.daysToNextBirthday}`}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-ghost-dark-ink-stone mt-0.5">
              다가오는 생일 D-day
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>띠 / 별자리</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#112220] dark:text-ghost-dark-ink">
              {result.zodiac} • {result.horoscope}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-ghost-dark-ink-stone mt-0.5">
              12간지 및 서양 12성좌
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
