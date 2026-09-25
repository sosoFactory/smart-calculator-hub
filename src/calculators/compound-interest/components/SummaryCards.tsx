import React, { useState } from 'react';
import { CalculationResult } from '../../../types/calculator';
import {
  formatCurrency,
  formatKoreanUnit,
  formatMultiple,
  formatPercent,
} from '../../../utils/formatters';
import { Wallet, PiggyBank, ArrowUpRight, ShieldAlert, Copy, Check } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
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
  const [copied, setCopied] = useState(false);
  const isIndigo = theme === 'indigo';
  const principalRatio =
    result.futureValuePostTax > 0
      ? (result.totalPrincipal / result.futureValuePostTax) * 100
      : 0;

  const isLoss = result.netInterest < 0;

  // 복리 결과 클립보드 원클릭 복사
  const handleCopy = async () => {
    const text = `[스마트 계산기] 연복리 자산 증식 계산 결과
- 세후 최종 수령액: ${formatCurrency(result.futureValuePostTax)} (${formatKoreanUnit(result.futureValuePostTax)})
- 총 투자원금: ${formatCurrency(result.totalPrincipal)} (${formatKoreanUnit(result.totalPrincipal)})
- 세후 순수익: ${formatCurrency(result.netInterest)} (${formatKoreanUnit(result.netInterest)})
- 이자소득세: ${formatCurrency(result.taxAmount)} (${formatKoreanUnit(result.taxAmount)})
- 원금 대비 배수: ${formatMultiple(result.principalMultiple)}`;

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
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <Badge variant={isIndigo ? 'indigo' : 'teal'}>
            {title}
          </Badge>
          <span className="text-xs font-semibold text-slate-500">핵심 결과 요약</span>
        </div>
      )}

      {/* 최종 수령액 하이라이트 대형 카드 (Ghost Ink-Base 다크 서피스) */}
      <div className="relative overflow-hidden bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white rounded-2xl p-5 sm:p-6 border border-[#15171a] dark:border-ghost-dark-hairline-soft shadow-sm">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
                <Wallet className="w-3 h-3" />
                세후 최종 수령액
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                isLoss ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-[#d1ff19]/10 text-[#d1ff19] border-[#d1ff19]/20'
              }`}>
                {formatMultiple(result.principalMultiple)}
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
              <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums whitespace-nowrap ${
                isLoss ? 'text-rose-400' : 'text-[#d1ff19]'
              }`}>
                {formatCurrency(result.futureValuePostTax)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">
                ({formatKoreanUnit(result.futureValuePostTax)})
              </span>
            </div>
          </div>
        </div>

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
      </div>

      {/* 3단 서브 지표 그리드 (비교 모드에서는 좌우 분할 공간 협소 방지를 위해 1열 세로 배치, 단일 모드에서는 sm 3열) */}
      <div className={title ? "grid grid-cols-1 gap-2.5" : "grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3"}>
        {/* 총 투자 원금 */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute">
            <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <PiggyBank className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
              총 투자원금
            </span>
            <span className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone font-medium">
              {formatKoreanUnit(result.totalPrincipal)}
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
            {formatCurrency(result.totalPrincipal)}
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
            원금 비중 {principalRatio.toFixed(1)}%
          </p>
        </div>

        {/* 세후 총 이자 / 손익 */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute">
            <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className={`w-3.5 h-3.5 ${isLoss ? 'text-rose-500 rotate-90' : 'text-emerald-500 dark:text-emerald-400'}`} />
              {isLoss ? '순손실액' : '세후 순이자'}
            </span>
            <span className={`text-[11px] font-medium ${
              isLoss ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'
            }`}>
              {formatPercent(result.netReturnRate, true)}
            </span>
          </div>
          <div className={`text-base sm:text-lg font-bold ${isLoss ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'} tabular-nums`}>
            {formatCurrency(result.netInterest)}
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
            {isLoss ? '투자 원금 대비 손실' : `원금 대비 ${formatMultiple(result.principalMultiple)}`}
          </p>
        </div>

        {/* 이자 소득세 */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute">
            <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              이자 소득세
            </span>
            <span className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone font-medium">
              세전 {formatCurrency(result.grossInterest)}
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400 tabular-nums">
            {formatCurrency(result.taxAmount)}
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
            이자 과세율 15.4% 기준
          </p>
        </div>
      </div>
    </div>
  );
};
