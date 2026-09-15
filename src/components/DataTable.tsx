import React, { useState } from 'react';
import { CalculationResult } from '../types/calculator';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { ChevronDown, ChevronUp, Download, Table as TableIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './ui/table';

interface DataTableProps {
  result: CalculationResult;
  scenarioName?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  result,
  scenarioName = '시나리오',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const downloadCSV = () => {
    const headers = [
      '연차',
      '누적 납입원금(원)',
      '당해연도 세전이자(원)',
      '누적 세전이자(원)',
      '이자소득세(원)',
      '누적 세후이자(원)',
      '세후 총자산(원)',
      '수익률(%)',
    ];

    const rows = result.breakdown.map((row) => [
      `${row.year}년차`,
      row.totalPrincipal,
      row.grossInterestYear,
      row.grossInterestTotal,
      row.taxAmount,
      row.netInterestTotal,
      row.futureValuePostTax,
      row.returnRate.toFixed(2),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${scenarioName}_연도별_복리계산표.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 overflow-hidden transition-colors">
      {/* 아코디언 헤더 */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors select-none">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="data-table-content"
          className="flex-1 min-w-0 h-auto justify-start p-0 text-left font-normal hover:bg-transparent dark:hover:bg-transparent mr-2"
        >
          <span className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <TableIcon className="w-4 h-4 text-[#112220] dark:text-slate-100 shrink-0" />
            <h3 className="text-xs sm:text-base font-bold text-[#112220] dark:text-slate-100 truncate">
              연도별 상세 자산 흐름표
            </h3>
            <span className="text-[11px] sm:text-xs text-[#94a3b8] dark:text-slate-400 font-medium shrink-0">
              ({result.breakdown.length}개년)
            </span>
          </span>
        </Button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isOpen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadCSV}
                  aria-label="CSV 다운로드"
                  className="h-8 w-8 sm:w-auto px-0 sm:px-2.5 gap-1.5 text-xs text-[#112220] dark:text-slate-100 border-[#e5e7eb] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0 flex items-center justify-center"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">CSV 다운로드</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="sm:hidden">CSV 다운로드</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="data-table-content"
                className="h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                aria-label={isOpen ? '흐름표 접기' : '흐름표 펼치기'}
              >
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isOpen ? '흐름표 접기' : '흐름표 펼치기'}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* shadcn Table 본체 */}
      {isOpen && (
        <div id="data-table-content" className="border-t border-slate-100 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-16">연차</TableHead>
                <TableHead className="text-right">누적 원금</TableHead>
                <TableHead className="text-right">당해연도 이자</TableHead>
                <TableHead className="text-right">누적 순이자</TableHead>
                <TableHead className="text-right">세후 총 평가액</TableHead>
                <TableHead className="text-right">수익률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.breakdown.map((row) => (
                <TableRow key={row.year}>
                  <TableCell className="font-bold text-center text-slate-900 dark:text-slate-100 bg-slate-50/40 dark:bg-slate-900/40 whitespace-nowrap tabular-nums">
                    {row.year}년
                  </TableCell>
                  <TableCell className="text-right text-slate-600 dark:text-slate-300 whitespace-nowrap tabular-nums">
                    {formatCurrency(row.totalPrincipal)}
                  </TableCell>
                  <TableCell className="text-right text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums">
                    +{formatCurrency(row.grossInterestYear)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap tabular-nums">
                    +{formatCurrency(row.netInterestTotal)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap tabular-nums">
                    {formatCurrency(row.futureValuePostTax)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-teal-700 dark:text-teal-400 whitespace-nowrap tabular-nums">
                    +{formatPercent(row.returnRate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
