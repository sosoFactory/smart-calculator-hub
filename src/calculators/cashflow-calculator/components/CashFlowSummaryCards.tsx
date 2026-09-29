import React, { useState } from 'react';
import { CashFlowCalculationResult } from '../../../types/cashFlow';
import { formatCurrency, formatKoreanCurrency } from '../../../utils/formatters';
import { Flame, Coins, TrendingUp, AlertTriangle, Check, Copy, Percent } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { SubMetricCard } from '../../../components/common/SubMetricCard';

interface CashFlowSummaryCardsProps {
  result: CashFlowCalculationResult;
}

export const CashFlowSummaryCards: React.FC<CashFlowSummaryCardsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const {
    monthlyNet,
    annualNet,
    monthlyGross,
    annualGross,
    monthlyTax,
    annualTax,
    taxRatePercent,
    effectiveNetReturnRate,
    requiredCapital,
    isComprehensiveTaxWarning,
  } = result;

  const handleCopy = async () => {
    const text = `[스마트 계산기] 파이어 현금흐름 역산 결과
- 필요 총 은퇴 자산: ${formatCurrency(requiredCapital)} (${formatKoreanCurrency(requiredCapital)})
- 목표 월 세후 실수령액: ${formatCurrency(monthlyNet)} (${formatKoreanCurrency(monthlyNet)})
- 연간 세후 실수령액: ${formatCurrency(annualNet)} (${formatKoreanCurrency(annualNet)})
- 연간 필요 세전 수익금: ${formatCurrency(annualGross)} (${formatKoreanCurrency(annualGross)})
- 연간 예상 세금: ${formatCurrency(annualTax)} (${formatKoreanCurrency(annualTax)}) [세율 ${taxRatePercent}%]
- 세후 실효 연 수익률: ${effectiveNetReturnRate.toFixed(2)}%
${isComprehensiveTaxWarning ? '※ 연 금융소득 2,000만원 초과로 금융소득종합과세 및 건보료 부과 대상입니다.' : ''}`;

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

  return (
    <div className="space-y-3.5 sm:space-y-4 w-full">
      {/* 1. 메인 핵심 카드: 필요 총 은퇴 자산 (Ghost 다크 서피스) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft p-5 sm:p-6 text-white shadow-sm">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
                <Flame className="w-3.5 h-3.5" />
                필요 총 은퇴 원금
              </span>
              <span className="text-xs text-slate-300 dark:text-ghost-dark-ink-mute font-medium px-2 py-0.5 rounded-full bg-slate-800/80 dark:bg-ghost-dark-hairline border border-slate-700/60 dark:border-ghost-dark-hairline-soft shrink-0">
                월 {formatKoreanCurrency(monthlyNet)} 수령 기준
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
                  <Copy className="w-3 h-3" />
                  <span>결과 복사</span>
                </>
              )}
            </Button>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#d1ff19] tabular-nums">
              {formatKoreanCurrency(requiredCapital)}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 dark:text-ghost-dark-ink-mute tabular-nums">
              정확한 금액: {formatCurrency(requiredCapital)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3단 서브 요약 지표 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <SubMetricCard
          label="연간 세전 필요 수익"
          icon={TrendingUp}
          iconColor="emerald"
          badge={`월 ${formatCurrency(monthlyGross)}`}
          badgeColor="slate"
          value={formatCurrency(annualGross)}
          description={`한글 독음: ${formatKoreanCurrency(annualGross)}`}
        />

        <SubMetricCard
          label="연간 예상 세금"
          icon={Coins}
          iconColor="rose"
          badge={`${taxRatePercent}%`}
          badgeColor="rose"
          value={formatCurrency(annualTax)}
          valueColor="rose"
          description={`월 ${formatCurrency(monthlyTax)} (${formatKoreanCurrency(annualTax)})`}
        />

        <SubMetricCard
          label="세후 실효 수익률"
          icon={Percent}
          iconColor="indigo"
          value={`연 ${effectiveNetReturnRate.toFixed(2)}%`}
          description="세금 차감 후 실질 연수익"
        />
      </div>

      {/* 3. 금융소득종합과세 안내 배너 (연 2,000만원 초과 시) */}
      {isComprehensiveTaxWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs space-y-1 shadow-2xs transition-colors">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>금융소득종합과세 및 건강보험료 주의 대상</span>
          </div>
          <p className="leading-relaxed text-[11px] sm:text-xs text-amber-700/90 dark:text-amber-300/80 break-keep">
            연간 세전 금융소득(배당·이자)이 <strong>2,000만 원</strong>을 초과하여 타 소득과 합산 과세될 수 있습니다. 직장가입자의 피부양자 자격 유지 기준(연 금융소득 2,000만 원 이하)을 초과하므로 지역가입자로 전환되어 건강보험료가 부과될 수 있습니다. ISA 등 절세계좌 활용을 추천합니다.
          </p>
        </div>
      )}
    </div>
  );
};
