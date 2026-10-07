import React from 'react';
import { CashFlowCalculationResult } from '../../../types/cashFlow';
import { formatCurrency, formatKoreanCurrency } from '../../../utils/formatters';
import { downloadCSV } from '../../../utils/csvDownloader';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { Download, Table as TableIcon } from 'lucide-react';

interface CashFlowTableProps {
  result: CashFlowCalculationResult;
}

export const CashFlowTable: React.FC<CashFlowTableProps> = ({ result }) => {
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
  } = result;

  const handleExportCsv = () => {
    const filename = `파이어_현금흐름_명세서_${new Date().toISOString().slice(0, 10)}.csv`;
    const headers = ['구분', '세전 필요 수익금', `예상 세금 (${taxRatePercent}%)`, '세후 실수령액', '실효 수익률'];
    const rows: (string | number)[][] = [
      [
        '월간 기준',
        `${monthlyGross.toLocaleString()}원`,
        `${monthlyTax.toLocaleString()}원`,
        `${monthlyNet.toLocaleString()}원`,
        `${effectiveNetReturnRate.toFixed(2)}%`,
      ],
      [
        '연간 기준',
        `${annualGross.toLocaleString()}원`,
        `${annualTax.toLocaleString()}원`,
        `${annualNet.toLocaleString()}원`,
        `${effectiveNetReturnRate.toFixed(2)}%`,
      ],
      [
        '필요 총 은퇴 원금',
        `${requiredCapital.toLocaleString()}원 (${formatKoreanCurrency(requiredCapital)})`,
        '-',
        '-',
        '-',
      ],
    ];

    downloadCSV(filename, headers, rows);
  };

  return (
    <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-4 w-full">
      {/* 테이블 상단 헤더 & CSV 다운로드 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0" />
            <span>주기별 현금흐름 상세 명세표</span>
          </h3>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5 break-keep">
            월간 및 연간 세전 필요 수익금, 과세 금액, 세후 실수령액 정밀 대조
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          className="h-8 px-2.5 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 bg-white dark:bg-ghost-dark-surface-elevated border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-50 dark:hover:bg-ghost-dark-hover text-[#112220] dark:text-ghost-dark-ink self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV 다운로드</span>
        </Button>
      </div>

      {/* 전역 공통 Table 컴포넌트 (모바일 음수 마진 및 가로 스와이프 보장 - PRD 12.6 명세) */}
      <div className="-mx-5 sm:mx-0 overflow-x-auto px-5 sm:px-0">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow className="border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
              <TableHead className="text-xs font-bold text-[#64748b] dark:text-ghost-dark-ink-mute whitespace-nowrap">
                구분
              </TableHead>
              <TableHead className="text-xs font-bold text-right text-[#64748b] dark:text-ghost-dark-ink-mute whitespace-nowrap">
                세전 필요 수익금
              </TableHead>
              <TableHead className="text-xs font-bold text-right text-[#64748b] dark:text-ghost-dark-ink-mute whitespace-nowrap">
                예상 세금 ({taxRatePercent}%)
              </TableHead>
              <TableHead className="text-xs font-bold text-right text-[#64748b] dark:text-ghost-dark-ink-mute whitespace-nowrap">
                세후 실수령액
              </TableHead>
              <TableHead className="text-xs font-bold text-right text-[#64748b] dark:text-ghost-dark-ink-mute whitespace-nowrap">
                실효 수익률
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/60">
              <TableCell className="text-xs font-medium text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                월간 기준
              </TableCell>
              <TableCell className="text-xs text-right font-medium text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                {formatCurrency(monthlyGross)}
              </TableCell>
              <TableCell className="text-xs text-right font-medium text-rose-500 tabular-nums whitespace-nowrap">
                -{formatCurrency(monthlyTax)}
              </TableCell>
              <TableCell className="text-xs text-right font-bold text-emerald-600 dark:text-[#d1ff19] tabular-nums whitespace-nowrap">
                {formatCurrency(monthlyNet)}
              </TableCell>
              <TableCell className="text-xs text-right text-[#64748b] dark:text-ghost-dark-ink-mute tabular-nums whitespace-nowrap">
                연 {effectiveNetReturnRate.toFixed(2)}%
              </TableCell>
            </TableRow>
            <TableRow className="border-b-0 bg-slate-50/50 dark:bg-ghost-dark-surface-deep">
              <TableCell className="text-xs font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                연간 기준
              </TableCell>
              <TableCell className="text-xs text-right font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                {formatCurrency(annualGross)}
              </TableCell>
              <TableCell className="text-xs text-right font-bold text-rose-500 tabular-nums whitespace-nowrap">
                -{formatCurrency(annualTax)}
              </TableCell>
              <TableCell className="text-xs text-right font-bold text-emerald-600 dark:text-[#d1ff19] tabular-nums whitespace-nowrap">
                {formatCurrency(annualNet)}
              </TableCell>
              <TableCell className="text-xs text-right font-bold text-emerald-600 dark:text-[#d1ff19] tabular-nums whitespace-nowrap">
                연 {effectiveNetReturnRate.toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
