import React, { useState } from 'react';
import { BmiResult } from '../../../types/bmi';
import { Button } from '../../../components/ui/button';
import { Copy, Check, Sparkles, Target, ShieldCheck, Scale } from 'lucide-react';

interface BmiSummaryCardsProps {
  result: BmiResult;
}

export const BmiSummaryCards: React.FC<BmiSummaryCardsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `[스마트 계산기] BMI & 비만도 측정 결과
- 나의 BMI: ${result.bmi} (${result.categoryInfo.label})
- 적정 표준 체중: ${result.idealWeight}kg
- 정상 체중 범위: ${result.normalWeightMin}kg ~ ${result.normalWeightMax}kg
- 조절 권장 가이드: ${result.weightDiffLabel}
- 건강 가이드: ${result.healthComment}`;

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

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'underweight':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'normal':
        return 'bg-emerald-500/20 text-emerald-300 dark:bg-[#d1ff19]/20 dark:text-[#d1ff19] border-emerald-500/40 dark:border-[#d1ff19]/40';
      case 'pre-obese':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'obese-1':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'obese-2':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'obese-3':
        return 'bg-purple-600/20 text-purple-300 border-purple-600/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getDiffColor = (status: 'maintain' | 'lose' | 'gain') => {
    switch (status) {
      case 'maintain':
        return 'text-emerald-600 dark:text-[#d1ff19]';
      case 'lose':
        return 'text-rose-500 dark:text-rose-400';
      case 'gain':
        return 'text-blue-500 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-3">
      {/* 1. 최상단 대형 메인 하이라이트 카드 (Ghost Ink-Base 다크 서피스 + 상단 스펙트럼 컬러 보더) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft text-white p-5 sm:p-6 shadow-sm">
        {/* 상단 스펙트럼 액센트 컬러 라인 보더 */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${result.categoryInfo.bgColor}`} />

        {/* 우측 하단 배경 은은한 블러 장식 */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 relative z-10 pt-1">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15">
                <Sparkles className="w-3 h-3 text-[#d1ff19]" />
                체질량지수 (BMI)
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${getCategoryBadgeClass(result.category)}`}>
                {result.categoryInfo.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black tabular-nums tracking-tight text-white">
                {result.bmi}
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-400">
                kg/m²
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium pt-1">
              {result.categoryInfo.description}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="self-start sm:self-center h-8 px-2.5 gap-1.5 text-xs border-slate-700 dark:border-ghost-dark-hairline-soft bg-slate-800/80 dark:bg-ghost-dark-hairline hover:bg-slate-700 dark:hover:bg-ghost-dark-hairline-soft text-slate-100 rounded-lg shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#d1ff19]" />
                <span className="text-[#d1ff19] font-bold">복사완료</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>결과 복사</span>
              </>
            )}
          </Button>
        </div>

        {/* 하단 건강 실천 팁 배너 */}
        <div className="mt-4 pt-3.5 border-t border-slate-800 dark:border-ghost-dark-hairline-soft flex items-start gap-2 text-xs text-slate-300 relative z-10">
          <span className="text-[#d1ff19] font-bold shrink-0">💡 건강 가이드:</span>
          <span>{result.healthComment}</span>
        </div>
      </div>

      {/* 2. 3대 핵심 서브 요약 카드 그리드 */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        {/* 1. 나의 적정 표준 체중 */}
        <div className="@container p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs min-w-0">
          <div className="flex flex-col @xs:flex-row @xs:items-center @xs:justify-between gap-1 @xs:gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#64748b] dark:text-ghost-dark-ink-mute uppercase tracking-wider block flex items-center gap-1">
                <Target className="w-3 h-3 text-sky-500" />
                적정 표준 체중
              </span>
              <p className="text-[11px] font-bold text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
                KSSO 표준 공식
              </p>
            </div>
            <div className="text-base sm:text-lg xl:text-xl font-black text-[#112220] dark:text-ghost-dark-ink tracking-tight flex items-baseline gap-0.5 whitespace-nowrap @xs:text-right">
              <span>{result.idealWeight}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-ghost-dark-ink-mute shrink-0">kg</span>
            </div>
          </div>
        </div>

        {/* 2. 정상 체중 범위 */}
        <div className="@container p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs min-w-0">
          <div className="flex flex-col @xs:flex-row @xs:items-center @xs:justify-between gap-1 @xs:gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#64748b] dark:text-ghost-dark-ink-mute uppercase tracking-wider block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                정상 체중 범위
              </span>
              <p className="text-[11px] font-bold text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
                BMI 18.5 ~ 22.9
              </p>
            </div>
            <div className="text-base sm:text-lg xl:text-xl font-black text-[#112220] dark:text-ghost-dark-ink tracking-tight flex items-baseline gap-0.5 whitespace-nowrap @xs:text-right">
              <span>{result.normalWeightMin} ~ {result.normalWeightMax}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-ghost-dark-ink-mute shrink-0">kg</span>
            </div>
          </div>
        </div>

        {/* 3. 체중 조절 목표 */}
        <div className="@container p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs min-w-0">
          <div className="flex flex-col @xs:flex-row @xs:items-center @xs:justify-between gap-1 @xs:gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#64748b] dark:text-ghost-dark-ink-mute uppercase tracking-wider block flex items-center gap-1">
                <Scale className="w-3 h-3 text-amber-500" />
                체중 조절 목표
              </span>
              <p className="text-[11px] font-bold text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
                {result.weightDiffStatus === 'maintain' ? '정상 범위 유지 중' : '정상 진입 권장치'}
              </p>
            </div>
            <div className={`text-base sm:text-lg xl:text-xl font-black tracking-tight flex items-baseline gap-0.5 whitespace-nowrap @xs:text-right ${getDiffColor(result.weightDiffStatus)}`}>
              <span>
                {result.weightDiffStatus === 'maintain'
                  ? '유지 중'
                  : result.weightDiffStatus === 'lose'
                  ? `-${result.weightDiff}`
                  : `+${result.weightDiff}`}
              </span>
              {result.weightDiffStatus !== 'maintain' && (
                <span className="text-xs font-semibold text-slate-500 dark:text-ghost-dark-ink-mute shrink-0">kg</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
