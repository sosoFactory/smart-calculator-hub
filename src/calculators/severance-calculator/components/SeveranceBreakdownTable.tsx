import React from 'react';
import { Sparkles } from 'lucide-react';
import { SeveranceResult } from '../../../types/severance';
import { formatNumberWithWon } from '../../../utils/formatters';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';

interface SeveranceBreakdownTableProps {
  result: SeveranceResult;
}

export const SeveranceBreakdownTable: React.FC<SeveranceBreakdownTableProps> = ({ result }) => {
  const { taxDetail, irpComparison } = result;

  return (
    <div className="space-y-4">
      {/* 1. IRP(개인형 퇴직연금) 이전 시 절세 혜택 분석 카드 (표준 카드 컨테이너) */}
      <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#112220] dark:text-ghost-dark-ink">
              IRP(퇴직연금) 계좌 수령 시 절세 혜택
            </h3>
            <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
              만 55세 이후 연금으로 수령 시 퇴직소득세의 30%~40% 감면 혜택
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* 일시금 수령 */}
          <div className="p-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-ghost-dark-surface-deep space-y-1.5">
            <span className="text-[11px] font-semibold text-[#64748b] dark:text-ghost-dark-ink-mute block">
              일반 일시금 수령
            </span>
            <div className="text-base font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {formatNumberWithWon(irpComparison.lumpSumTax)}
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute">
              세금 100% 전액 징수
            </p>
          </div>

          {/* IRP 10년 이하 연금 수령 (30% 절세) */}
          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                10년 이하 연금 수령
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-ghost-dark-surface px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/50">
                30% 감면
              </span>
            </div>
            <div className="text-base font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
              {formatNumberWithWon(irpComparison.irpTax10Years)}
            </div>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {formatNumberWithWon(irpComparison.taxSavings10Years)} 절세 효과
            </p>
          </div>

          {/* IRP 10년 초과 연금 수령 (40% 절세) */}
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                10년 초과 연금 수령
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-ghost-dark-surface px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">
                40% 감면
              </span>
            </div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
              {formatNumberWithWon(irpComparison.irpTaxOver10Years)}
            </div>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {formatNumberWithWon(irpComparison.taxSavingsOver10Years)} 절세 효과
            </p>
          </div>
        </div>
      </div>

      {/* 2. 표준 퇴직소득세 상세 공제 산출 명세표 (공용 Table 컴포넌트 적용) */}
      <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-4">
        {/* 헤더: 타이틀 & 서브타이틀 */}
        <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-3 pb-2 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
          <div>
            <h3 className="text-base font-bold text-[#112220] dark:text-ghost-dark-ink">
              퇴직소득세 단계별 산출 명세표
            </h3>
            <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
              2024~2026 현행 소득세법 기준 근속연수공제 및 환산급여공제 상세 내역
            </p>
          </div>
        </div>

        {/* 표준 명세 테이블 래퍼 (모바일 음수 마진 -mx-5 및 엣지 투 엣지 스와이프 보장) */}
        <div className="-mx-5 sm:mx-0 overflow-x-auto px-5 sm:px-0">
          <Table className="min-w-[480px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">단계 및 항목</TableHead>
                <TableHead className="whitespace-nowrap">산출 기준 및 계산식</TableHead>
                <TableHead className="text-right whitespace-nowrap">금액 / 공제액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  세법상 근속연수
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                  입사일~퇴사일 실근무일수 기반 연 단위 절상
                </TableCell>
                <TableCell className="font-bold text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                  {taxDetail.serviceYears}년
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  근속연수공제
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                  근속연수 구간별 법정 세액 감면 공제
                </TableCell>
                <TableCell className="font-bold text-right text-rose-500 dark:text-rose-400 tabular-nums whitespace-nowrap">
                  -{formatNumberWithWon(taxDetail.serviceDeduction)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  환산급여 (연 환산액)
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                  (세전 퇴직금 - 근속연수공제) ÷ 근속연수 × 12
                </TableCell>
                <TableCell className="font-bold text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                  {formatNumberWithWon(taxDetail.convertedSalary)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  환산급여공제
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                  환산급여 구간별 누진공제 (법정 기준)
                </TableCell>
                <TableCell className="font-bold text-right text-rose-500 dark:text-rose-400 tabular-nums whitespace-nowrap">
                  -{formatNumberWithWon(taxDetail.convertedDeduction)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  퇴직소득 과세표준
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                  환산급여 - 환산급여공제
                </TableCell>
                <TableCell className="font-bold text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                  {formatNumberWithWon(taxDetail.taxBase)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  환산산출세액
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                  종합소득세 기본세율(6%~45%) 누진 적용
                </TableCell>
                <TableCell className="font-bold text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                  {formatNumberWithWon(taxDetail.convertedTaxAmount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  퇴직소득세 (국세)
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                  환산산출세액 ÷ 12 × 근속연수
                </TableCell>
                <TableCell className="font-bold text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                  {formatNumberWithWon(taxDetail.calculatedTax)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  지방소득세
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                  국세 산출세액의 10%
                </TableCell>
                <TableCell className="font-bold text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                  {formatNumberWithWon(taxDetail.localTax)}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  총 퇴직소득세 합계
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute font-normal">
                  국세 + 지방소득세 (실효세율 {taxDetail.effectiveTaxRate}%)
                </TableCell>
                <TableCell className="text-right text-rose-600 dark:text-rose-400 tabular-nums text-sm font-bold whitespace-nowrap">
                  {formatNumberWithWon(taxDetail.totalTax)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};
