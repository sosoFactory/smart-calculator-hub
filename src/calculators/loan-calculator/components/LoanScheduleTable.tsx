import React, { useState } from 'react';
import { MonthlyRepayment } from '../../../types/loan';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { downloadCSV } from '../../../utils/csvDownloader';

interface LoanScheduleTableProps {
  schedule: MonthlyRepayment[];
}

export const LoanScheduleTable: React.FC<LoanScheduleTableProps> = ({ schedule }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 1년(12개월) 단위 페이지네이션

  if (!schedule || schedule.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(schedule.length / pageSize);
  const paginatedSchedule = schedule.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // UTF-8 BOM CSV 다운로드
  const handleDownloadCSV = () => {
    const headers = ['회차', '연차', '구분', '납입원금(원)', '대출이자(원)', '월상환액(원)', '남은잔액(원)'];
    const rows = schedule.map((s) => [
      `${s.month}회차`,
      `${s.year}년차 ${s.monthInYear}월`,
      s.isEarlyRepaymentMonth
        ? '중도상환'
        : s.isGracePeriod
        ? '거치기간(이자만)'
        : '정상상환',
      s.principalPayment,
      s.interestPayment,
      s.totalPayment,
      s.remainingBalance,
    ]);

    downloadCSV(`대출상환스케줄표_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="bg-white dark:bg-ghost-dark-surface p-4 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-4">
      {/* 헤더 및 다운로드 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink flex items-center gap-2">
            <span>월별 상환 스케줄 상세표</span>
            <Badge variant="meta" size="sm">
              총 {schedule.length}회차
            </Badge>
          </h3>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
            매월 원금 상환액과 이자 납입액, 줄어드는 대출 잔액 흐름
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadCSV}
          className="h-8 px-2.5 gap-1.5 text-xs font-semibold bg-white dark:bg-ghost-dark-surface-elevated border-[#e5e7eb] dark:border-ghost-dark-hairline-soft hover:bg-slate-50 dark:hover:bg-dark-border text-[#112220] dark:text-ghost-dark-ink rounded-lg shrink-0"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>CSV 다운로드</span>
        </Button>
      </div>

      {/* 표준 테이블 컴포넌트 */}
      <Table className="min-w-[560px]">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">회차</TableHead>
            <TableHead className="whitespace-nowrap text-right">납입 원금</TableHead>
            <TableHead className="whitespace-nowrap text-right">대출 이자</TableHead>
            <TableHead className="whitespace-nowrap text-right">월 상환액</TableHead>
            <TableHead className="whitespace-nowrap text-right">대출 잔액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-[#e5e7eb] dark:divide-ghost-dark-hairline font-medium">
          {paginatedSchedule.map((row) => (
            <TableRow
              key={row.month}
              className={
                row.isEarlyRepaymentMonth
                  ? 'bg-amber-50/40 dark:bg-amber-950/20'
                  : row.isGracePeriod
                  ? 'bg-slate-50/30 dark:bg-ghost-dark-surface-deep/60'
                  : undefined
              }
            >
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#112220] dark:text-ghost-dark-ink-base tabular-nums">
                    {row.month}회
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    ({row.year}년차 {row.monthInYear}월)
                  </span>
                  {row.isEarlyRepaymentMonth && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white">
                      중도상환
                    </span>
                  )}
                  {row.isGracePeriod && !row.isEarlyRepaymentMonth && (
                    <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-slate-200 dark:bg-ghost-dark-surface-elevated text-slate-600 dark:text-ghost-dark-ink-mute">
                      거치
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap tabular-nums">
                {row.principalPayment.toLocaleString('ko-KR')}원
              </TableCell>
              <TableCell className="text-right font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap tabular-nums">
                {row.interestPayment.toLocaleString('ko-KR')}원
              </TableCell>
              <TableCell className="text-right font-extrabold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap tabular-nums">
                {row.totalPayment.toLocaleString('ko-KR')}원
              </TableCell>
              <TableCell className="text-right text-slate-500 dark:text-ghost-dark-ink-mute font-semibold whitespace-nowrap tabular-nums">
                {row.remainingBalance.toLocaleString('ko-KR')}원
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 페이지네이션 (1년 단위) */}
      {totalPages > 1 && (
        <div className="flex flex-col xs:flex-row items-center justify-between gap-2 pt-2.5 border-t border-[#e5e7eb] dark:border-ghost-dark-hairline text-xs">
          <span className="text-slate-500 dark:text-ghost-dark-ink-mute">
            {currentPage}년차 / 총 {totalPages}년차
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="h-8 w-8 p-0"
              aria-label="이전 연차 보기"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-2 text-xs font-bold text-slate-700 dark:text-ghost-dark-ink-soft">
              {currentPage}년차 ({((currentPage - 1) * pageSize) + 1}~{Math.min(currentPage * pageSize, schedule.length)}회)
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-8 w-8 p-0"
              aria-label="다음 연차 보기"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
