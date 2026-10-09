import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { SeveranceResult } from '../../../types/severance';
import { formatNumberWithWon } from '../../../utils/formatters';

interface SeveranceBreakdownTableProps {
  result: SeveranceResult;
}

export const SeveranceBreakdownTable: React.FC<SeveranceBreakdownTableProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { taxDetail, irpComparison } = result;

  return (
    <div className="space-y-4">
      {/* 1. IRP(개인형 퇴직연금) 이전 시 절세 혜택 분석 카드 */}
      <div className="bg-white dark:bg-ghost-dark-surface rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline p-5 sm:p-6 shadow-2xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ghost-ink dark:text-ghost-dark-ink">
                IRP(퇴직연금) 이전 시 절세 혜택
              </h3>
              <p className="text-xs text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
                만 55세 이후 연금으로 수령 시 퇴직소득세를 대폭 감면받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* 일시금 수령 */}
          <div className="p-3.5 rounded-xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface-deep/40 dark:bg-ghost-dark-surface-deep space-y-1.5">
            <span className="text-[11px] font-semibold text-ghost-ink-mute dark:text-ghost-dark-ink-mute block">
              일반 일시금 수령
            </span>
            <div className="text-base font-bold text-ghost-ink dark:text-ghost-dark-ink">
              {formatNumberWithWon(irpComparison.lumpSumTax)}
            </div>
            <p className="text-[11px] text-ghost-ink-stone dark:text-ghost-dark-ink-stone">
              세금 100% 전액 징수
            </p>
          </div>

          {/* IRP 10년 이하 연금 수령 (30% 절세) */}
          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                10년 이하 연금 수령
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-ghost-dark-surface px-1.5 py-0.5 rounded">
                30% 감면
              </span>
            </div>
            <div className="text-base font-bold text-indigo-700 dark:text-indigo-300">
              {formatNumberWithWon(irpComparison.irpTax10Years)}
            </div>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {formatNumberWithWon(irpComparison.taxSavings10Years)} 절세 효과
            </p>
          </div>

          {/* IRP 10년 초과 연금 수령 (40% 절세) */}
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                10년 초과 연금 수령
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-ghost-dark-surface px-1.5 py-0.5 rounded">
                40% 감면
              </span>
            </div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-300">
              {formatNumberWithWon(irpComparison.irpTaxOver10Years)}
            </div>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {formatNumberWithWon(irpComparison.taxSavingsOver10Years)} 절세 효과
            </p>
          </div>
        </div>
      </div>

      {/* 2. 퇴직소득세 상세 공제 산출 내역 (접이식 아코디언) */}
      <div className="bg-white dark:bg-ghost-dark-surface rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline shadow-2xs overflow-hidden transition-colors">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-ghost-surface-deep/50 dark:hover:bg-ghost-dark-hover transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-ghost-ink-mute dark:text-ghost-dark-ink-mute" />
            <span className="text-sm font-bold text-ghost-ink dark:text-ghost-dark-ink">
              퇴직소득세 단계별 상세 산출 내역
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
            <span>{isOpen ? '접기' : '자세히 보기'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isOpen && (
          <div className="px-5 pb-5 pt-1 border-t border-ghost-hairline dark:border-ghost-dark-hairline text-xs">
            <div className="divide-y divide-ghost-hairline/80 dark:divide-ghost-dark-hairline/80">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-ghost-ink-mute dark:text-ghost-dark-ink-mute">세법상 근속연수</span>
                <span className="font-semibold text-ghost-ink dark:text-ghost-dark-ink">{taxDetail.serviceYears}년</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-ghost-ink-mute dark:text-ghost-dark-ink-mute">근속연수공제</span>
                <span className="font-semibold text-ghost-ink dark:text-ghost-dark-ink">-{formatNumberWithWon(taxDetail.serviceDeduction)}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-ghost-ink-mute dark:text-ghost-dark-ink-mute">환산급여 (연 환산액)</span>
                <span className="font-semibold text-ghost-ink dark:text-ghost-dark-ink">{formatNumberWithWon(taxDetail.convertedSalary)}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-ghost-ink-mute dark:text-ghost-dark-ink-mute">환산급여공제</span>
                <span className="font-semibold text-ghost-ink dark:text-ghost-dark-ink">-{formatNumberWithWon(taxDetail.convertedDeduction)}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-ghost-ink-mute dark:text-ghost-dark-ink-mute">퇴직소득 과세표준</span>
                <span className="font-semibold text-ghost-ink dark:text-ghost-dark-ink">{formatNumberWithWon(taxDetail.taxBase)}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-ghost-ink-mute dark:text-ghost-dark-ink-mute">환산산출세액</span>
                <span className="font-semibold text-ghost-ink dark:text-ghost-dark-ink">{formatNumberWithWon(taxDetail.convertedTaxAmount)}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-ghost-ink-mute dark:text-ghost-dark-ink-mute">퇴직소득 산출세액 (국세)</span>
                <span className="font-semibold text-ghost-ink dark:text-ghost-dark-ink">{formatNumberWithWon(taxDetail.calculatedTax)}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-ghost-ink-mute dark:text-ghost-dark-ink-mute">지방소득세 (국세의 10%)</span>
                <span className="font-semibold text-ghost-ink dark:text-ghost-dark-ink">{formatNumberWithWon(taxDetail.localTax)}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between font-bold text-ghost-ink dark:text-ghost-dark-ink bg-ghost-surface-deep/50 dark:bg-ghost-dark-surface-deep px-2.5 rounded-lg">
                <span>총 퇴직소득세 (실효세율 {taxDetail.effectiveTaxRate}%)</span>
                <span className="text-rose-600 dark:text-rose-400">{formatNumberWithWon(taxDetail.totalTax)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
