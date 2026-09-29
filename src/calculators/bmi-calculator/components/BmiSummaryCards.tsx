import React, { useState } from 'react';
import { BmiResult } from '../../../types/bmi';
import { Button } from '../../../components/ui/button';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
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


  return (
    <div className="space-y-3">
      {/* 1. 최상단 대형 메인 하이라이트 카드 (Ghost Ink-Base 다크 서피스 + 상단 스펙트럼 컬러 보더) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft text-white p-5 sm:p-6 shadow-sm">
        {/* 상단 스펙트럼 액센트 컬러 라인 보더 */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${result.categoryInfo.bgColor}`} />

        {/* 우측 하단 배경 은은한 블러 장식 */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3 pt-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
                <Sparkles className="w-3 h-3" />
                체질량지수 (BMI)
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${getCategoryBadgeClass(result.category)}`}>
                {result.categoryInfo.label}
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
            <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#d1ff19] tabular-nums whitespace-nowrap">
                {result.bmi}
                <span className="text-lg sm:text-xl font-medium text-slate-200 ml-1">
                  kg/m²
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">
                ({result.categoryInfo.label} 판정)
              </span>
            </div>

            <div className="text-xs text-slate-400 pt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span>{result.categoryInfo.description}</span>
            </div>
          </div>
        </div>

        {/* 하단 건강 실천 팁 배너 */}
        <div className="mt-4 pt-3.5 border-t border-slate-800 dark:border-ghost-dark-hairline flex items-center gap-2 text-xs text-slate-300 relative z-10">
          <span className="text-[#d1ff19] font-medium shrink-0">건강 가이드:</span>
          <span>{result.healthComment}</span>
        </div>
      </div>

      {/* 2. 3대 핵심 서브 요약 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <SubMetricCard
          label="적정 표준 체중"
          icon={Target}
          iconColor="indigo"
          badge="KSSO 표준"
          badgeColor="slate"
          value={`${result.idealWeight}kg`}
          description="신장 기준 권장 표준 몸무게"
        />

        <SubMetricCard
          label="정상 체중 범위"
          icon={ShieldCheck}
          iconColor="emerald"
          badge="BMI 18.5~22.9"
          badgeColor="emerald"
          value={`${result.normalWeightMin} ~ ${result.normalWeightMax}kg`}
          description="대한비만학회 정상 체중 구간"
        />

        <SubMetricCard
          label="체중 조절 목표"
          icon={Scale}
          iconColor={
            result.weightDiffStatus === 'maintain'
              ? 'emerald'
              : result.weightDiffStatus === 'lose'
              ? 'rose'
              : 'indigo'
          }
          badge={result.weightDiffStatus === 'maintain' ? '정상 유지 중' : '권장 변화량'}
          badgeColor={
            result.weightDiffStatus === 'maintain'
              ? 'emerald'
              : result.weightDiffStatus === 'lose'
              ? 'rose'
              : 'indigo'
          }
          value={
            result.weightDiffStatus === 'maintain'
              ? '유지 중'
              : result.weightDiffStatus === 'lose'
              ? `-${result.weightDiff}kg`
              : `+${result.weightDiff}kg`
          }
          valueColor={
            result.weightDiffStatus === 'maintain'
              ? 'emerald'
              : result.weightDiffStatus === 'lose'
              ? 'rose'
              : 'indigo'
          }
          description={
            result.weightDiffStatus === 'maintain'
              ? '현재 정상 체중을 유지하세요'
              : '정상 체중 진입 권장치'
          }
        />
      </div>
    </div>
  );
};
