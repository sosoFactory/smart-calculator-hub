import React from 'react';
import { BmiResult } from '../../../types/bmi';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import { ResultHeroCard } from '../../../components/common/ResultHeroCard';
import { CopyResultButton } from '../../../components/common/CopyResultButton';
import { Sparkles, Target, ShieldCheck, Scale } from 'lucide-react';

interface BmiSummaryCardsProps {
  result: BmiResult;
}

export const BmiSummaryCards: React.FC<BmiSummaryCardsProps> = ({ result }) => {
  const getCopyText = () => `[스마트 계산기] BMI & 비만도 측정 결과
- 나의 BMI: ${result.bmi} (${result.categoryInfo.label})
- 적정 표준 체중: ${result.idealWeight}kg
- 정상 체중 범위: ${result.normalWeightMin}kg ~ ${result.normalWeightMax}kg
- 조절 권장 가이드: ${result.weightDiffLabel}
- 건강 가이드: ${result.healthComment}`;

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
      {/* 1. 최상단 대형 메인 하이라이트 카드 */}
      <ResultHeroCard
        badge={
          <>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
              <Sparkles className="w-3 h-3" />
              체질량지수 (BMI)
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border transition-colors ${getCategoryBadgeClass(result.category)}`}>
              {result.categoryInfo.label}
            </span>
          </>
        }
        action={<CopyResultButton text={getCopyText} />}
        mainValue={`${result.bmi} kg/m²`}
        koreanReading={`${result.categoryInfo.label} 판정`}
        subtext={
          <div className="text-xs text-slate-400 pt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>{result.categoryInfo.description}</span>
          </div>
        }
      >
        {/* 상단 스펙트럼 액센트 컬러 라인 보더 */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${result.categoryInfo.bgColor}`} />

        {/* 하단 건강 실천 팁 배너 */}
        <div className="mt-4 pt-3.5 border-t border-slate-800 dark:border-ghost-dark-hairline flex items-center gap-2 text-xs text-slate-300 relative z-10">
          <span className="text-[#d1ff19] font-medium shrink-0">건강 가이드:</span>
          <span>{result.healthComment}</span>
        </div>
      </ResultHeroCard>

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
