import React from 'react';
import { ScenarioComparison } from '../types/calculator';
import {
  formatCurrency,
  formatKoreanUnit,
  formatPercent,
} from '../utils/formatters';
import { TrendingUp, Zap } from 'lucide-react';
import { Badge } from './ui/badge';

interface ComparisonViewProps {
  comparison: ScenarioComparison;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ comparison }) => {
  const { scenarioA, scenarioB, resultA, resultB, diffPostTax, diffNetInterest, diffReturnRate } =
    comparison;

  const isBBetter = diffPostTax >= 0;

  return (
    <div className="bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white rounded-[24px] p-5 sm:p-6 border border-[#1f2937] dark:border-ghost-dark-hairline-soft">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-md bg-white/10 text-[#d1ff19] flex items-center justify-center">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            시나리오 A vs B 심층 비교 분석
          </h3>
          <p className="text-xs text-[#94a3b8]">
            동일 기간({scenarioA.years}년) 투자 시 최종 자산 및 수익 격차
          </p>
        </div>
      </div>

      {/* 격차 하이라이트 요약 배너 */}
      <div
        className={`p-3.5 sm:p-4 rounded-md mb-4 border ${
          isBBetter
            ? 'bg-white/5 border-white/10 text-white'
            : 'bg-rose-950/30 border-rose-800/40 text-rose-200'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1 text-[#d1ff19]">
          <TrendingUp className="w-4 h-4" />
          <span>전략 성과 비교 분석</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          {scenarioB.name} 전략을 적용할 경우, {scenarioA.name} 대비 최종 수령액이{' '}
          <strong className={isBBetter ? 'text-[#d1ff19] font-bold' : 'text-rose-400 font-bold'}>
            {formatCurrency(Math.abs(diffPostTax))} ({formatKoreanUnit(Math.abs(diffPostTax))})
          </strong>{' '}
          {isBBetter ? '더 많아지며' : '더 적어지며'} (순이자 차이: {formatCurrency(diffNetInterest)}), 순수익률은{' '}
          <strong className={isBBetter ? 'text-[#d1ff19] font-bold' : 'text-rose-400 font-bold'}>
            {formatPercent(Math.abs(diffReturnRate), true)}p
          </strong>{' '}
          {isBBetter ? '더 높습니다.' : '더 낮습니다.'}
        </p>
      </div>

      {/* 2열 비교 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 시나리오 A */}
        <div className="bg-white/5 rounded-md p-3.5 sm:p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-white border-white/20">
              {scenarioA.name}
            </Badge>
            <span className="text-xs text-[#94a3b8] font-semibold">
              연 {scenarioA.annualRate}%
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#94a3b8]">총 투자원금</span>
              <span className="font-semibold">{formatCurrency(resultA.totalPrincipal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#94a3b8]">세후 순이자</span>
              <span className="font-semibold text-white">{formatCurrency(resultA.netInterest)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#94a3b8]">순수익률</span>
              <span className="font-semibold">{formatPercent(resultA.netReturnRate)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-300 font-semibold">최종 수령액</span>
              <span className="font-bold text-sm text-[#d1ff19]">{formatCurrency(resultA.futureValuePostTax)}</span>
            </div>
          </div>
        </div>

        {/* 시나리오 B */}
        <div className="bg-white/5 rounded-md p-3.5 sm:p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="eyebrow">
              {scenarioB.name}
            </Badge>
            <span className="text-xs text-[#94a3b8] font-semibold">
              연 {scenarioB.annualRate}%
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#94a3b8]">총 투자원금</span>
              <span className="font-semibold">{formatCurrency(resultB.totalPrincipal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#94a3b8]">세후 순이자</span>
              <span className="font-semibold text-white">{formatCurrency(resultB.netInterest)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#94a3b8]">순수익률</span>
              <span className="font-semibold">{formatPercent(resultB.netReturnRate)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-300 font-semibold">최종 수령액</span>
              <span className="font-bold text-sm text-[#d1ff19]">{formatCurrency(resultB.futureValuePostTax)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
