import React from 'react';
import { CalculationResult } from '../../../types/calculator';
import {
  formatCurrency,
  formatKoreanUnit,
  formatMultiple,
  formatNumberWithWon,
  formatPercent,
} from '../../../utils/formatters';
import { Wallet, PiggyBank, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import { ResultHeroCard } from '../../../components/common/ResultHeroCard';
import { CopyResultButton } from '../../../components/common/CopyResultButton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

interface SummaryCardsProps {
  result: CalculationResult;
  title?: string;
  theme?: 'teal' | 'indigo';
}

/**
 * 연복리 계산기 핵심 요약 대시보드 컴포넌트
 * 세후 최종 수령액 메인 하이라이트 카드 및 3단 서브 요약 카드(투자원금, 순이자, 소득세) 제공
 */
export const SummaryCards: React.FC<SummaryCardsProps> = ({
  result,
  title,
  theme = 'teal',
}) => {
  const isIndigo = theme === 'indigo';
  const principalRatio =
    result.futureValuePostTax > 0
      ? (result.totalPrincipal / result.futureValuePostTax) * 100
      : 0;

  const isLoss = result.netInterest < 0;

  // 복리 결과 클립보드 원클릭 복사
  const getCopyText = () => `[스마트 계산기] 연복리 자산 증식 계산 결과
- 세후 최종 수령액: ${formatCurrency(result.futureValuePostTax)} (${formatKoreanUnit(result.futureValuePostTax)})
- 총 투자원금: ${formatCurrency(result.totalPrincipal)} (${formatKoreanUnit(result.totalPrincipal)})
- 세후 순수익: ${formatCurrency(result.netInterest)} (${formatKoreanUnit(result.netInterest)})
- 이자소득세: ${formatCurrency(result.taxAmount)} (${formatKoreanUnit(result.taxAmount)})
- 원금 대비 배수: ${formatMultiple(result.principalMultiple)}`;

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <Badge variant={isIndigo ? 'indigo' : 'teal'}>
            {title}
          </Badge>
          <span className="text-xs font-semibold text-slate-500">핵심 결과 요약</span>
        </div>
      )}

      {/* 최종 수령액 하이라이트 대형 카드 */}
      <ResultHeroCard
        badge={
          <>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
              <Wallet className="w-3 h-3" />
              세후 최종 수령액
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
              isLoss ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-[#d1ff19]/10 text-[#d1ff19] border-[#d1ff19]/20'
            }`}>
              {formatMultiple(result.principalMultiple)}
            </span>
          </>
        }
        action={<CopyResultButton text={getCopyText} />}
        mainValue={
          <span className={isLoss ? 'text-rose-400' : 'text-[#d1ff19]'}>
            {formatCurrency(result.futureValuePostTax)}
          </span>
        }
        koreanReading={formatKoreanUnit(result.futureValuePostTax)}
      >

        {/* 원금 및 이자 구성 바 */}
        <div className="relative z-10 mt-3 pt-3 border-t border-slate-800 dark:border-ghost-dark-hairline">
          <div className="flex justify-between text-[11px] text-[#94a3b8] mb-1 font-medium">
            <span>원금 대비: {principalRatio.toFixed(1)}%</span>
            <span>{isLoss ? '손실률' : '순이익 비중'}: {Math.abs(100 - principalRatio).toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`h-full transition-all duration-300 cursor-help ${isLoss ? 'bg-rose-500' : 'bg-slate-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, principalRatio))}%` }}
                  aria-label="원금 비중"
                />
              </TooltipTrigger>
              <TooltipContent>원금 비중: {principalRatio.toFixed(1)}%</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`h-full transition-all duration-300 cursor-help ${isLoss ? 'bg-rose-400' : 'bg-[#d1ff19]'}`}
                  style={{ width: `${Math.min(100, Math.max(0, 100 - principalRatio))}%` }}
                  aria-label={isLoss ? '손실률' : '이자 비중'}
                />
              </TooltipTrigger>
              <TooltipContent>{isLoss ? '손실률' : '이자 비중'}: {Math.abs(100 - principalRatio).toFixed(1)}%</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </ResultHeroCard>

      {/* 3단 서브 지표 그리드 (비교 모드에서는 좌우 분할 공간 협소 방지를 위해 1열 세로 배치, 단일 모드에서는 sm 3열) */}
      <div className={title ? "grid grid-cols-1 gap-2.5" : "grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3"}>
        <SubMetricCard
          label="총 투자원금"
          icon={PiggyBank}
          iconColor="slate"
          badge={formatKoreanUnit(result.totalPrincipal)}
          badgeColor="slate"
          value={formatNumberWithWon(result.totalPrincipal)}
          description={`원금 비중 ${principalRatio.toFixed(1)}%`}
        />

        <SubMetricCard
          label={isLoss ? '순손실액' : '세후 순이자'}
          icon={ArrowUpRight}
          iconColor={isLoss ? 'rose' : 'emerald'}
          badge={formatPercent(result.netReturnRate, true)}
          badgeColor={isLoss ? 'rose' : 'emerald'}
          value={formatNumberWithWon(result.netInterest)}
          valueColor={isLoss ? 'rose' : 'emerald'}
          description={isLoss ? '투자 원금 대비 손실' : `원금 대비 ${formatMultiple(result.principalMultiple)}`}
        />

        <SubMetricCard
          label="이자 소득세"
          icon={ShieldAlert}
          iconColor="rose"
          badge="15.4%"
          badgeColor="rose"
          value={formatNumberWithWon(result.taxAmount)}
          valueColor="rose"
          description={`세전 이자 ${formatNumberWithWon(result.grossInterest)} 기준`}
        />
      </div>
    </div>
  );
};
