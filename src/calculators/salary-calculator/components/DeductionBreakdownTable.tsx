import React, { useState } from 'react';
import { SalaryCalculationResult } from '../../../types/salary';
import { formatNumberWithWon } from '../../../utils/formatters';
import { SegmentedControl, SegmentedOption } from '../../../components/ui/segmented-control';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';

interface DeductionBreakdownTableProps {
  result: SalaryCalculationResult;
}

type PayerMode = 'employee' | 'employer';

const PAYER_OPTIONS: SegmentedOption<PayerMode>[] = [
  { id: 'employee', label: '근로자 본인 부담' },
  { id: 'employer', label: '회사(사업주) 지원금' },
];

export const DeductionBreakdownTable: React.FC<DeductionBreakdownTableProps> = ({
  result,
}) => {
  const [payerMode, setPayerMode] = useState<PayerMode>('employee');

  const isEmployee = payerMode === 'employee';

  const totalMonthly = isEmployee
    ? result.totalMonthlyDeduction
    : result.totalEmployerInsurances;

  const totalAnnual = totalMonthly * 12;

  // 공제 비중 포맷터 헬퍼
  const formatRatio = (monthly: number, gross: number, itemRatio: number) => {
    if (monthly <= 0 || gross <= 0) return '-';
    if (isEmployee) return `${itemRatio}%`;
    return `${((monthly / gross) * 100).toFixed(2)}%`;
  };

  return (
    <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-4">
      {/* 헤더: 타이틀 & 근로자/회사 탭 */}
      <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-3 pb-2 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div>
          <h3 className="text-base font-bold text-[#112220] dark:text-ghost-dark-ink">
            공제 항목별 세부 명세표
          </h3>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
            4대 사회보험료 및 국세청 간이세액표 기준 세금 공제액
          </p>
        </div>

        <div className="w-full @lg:w-auto">
          <SegmentedControl
            value={payerMode}
            options={PAYER_OPTIONS}
            onChange={(val) => setPayerMode(val)}
            variant="dark-solid"
            className="w-full @lg:w-64"
            itemClassName="py-1.5 text-xs whitespace-nowrap"
          />
        </div>
      </div>

      {/* 표준 명세 테이블 래퍼 (모바일 음수 마진 -mx-5 및 엣지 투 엣지 스와이프 보장 - PRD 12.6 명세) */}
      <div className="-mx-5 sm:mx-0 overflow-x-auto px-5 sm:px-0">
        <Table className="min-w-[480px]">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">공제 항목</TableHead>
              <TableHead className="whitespace-nowrap">산출 기준 및 요율</TableHead>
              <TableHead className="text-right whitespace-nowrap">월 부담액</TableHead>
              <TableHead className="text-right whitespace-nowrap">연간 누적</TableHead>
              <TableHead className="text-right whitespace-nowrap">비중</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.deductionItems.map((item) => {
              const monthly = isEmployee
                ? item.employeeMonthlyAmount
                : item.employerMonthlyAmount;

              const isTaxItem =
                item.id === 'income_tax' || item.id === 'local_income_tax';

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute">
                    {isTaxItem && !isEmployee
                      ? '해당 없음 (근로자 본인 납부)'
                      : item.description}
                  </TableCell>
                  <TableCell className="font-bold text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                    {monthly > 0 ? formatNumberWithWon(monthly) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-[#64748b] dark:text-ghost-dark-ink-mute tabular-nums whitespace-nowrap">
                    {monthly > 0 ? formatNumberWithWon(monthly * 12) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-[#64748b] dark:text-ghost-dark-ink-mute tabular-nums whitespace-nowrap">
                    {formatRatio(monthly, result.grossMonthlySalary, item.percentageOfGross)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">총 합계</TableCell>
              <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-mute font-normal">
                {isEmployee ? '4대 보험 + 세금 합산' : '4대 보험 회사 지원 합산'}
              </TableCell>
              <TableCell className="text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums text-sm font-bold whitespace-nowrap">
                {formatNumberWithWon(totalMonthly)}
              </TableCell>
              <TableCell className="text-right text-[#64748b] dark:text-ghost-dark-ink-mute tabular-nums text-sm font-bold whitespace-nowrap">
                {formatNumberWithWon(totalAnnual)}
              </TableCell>
              <TableCell className="text-right text-[#112220] dark:text-ghost-dark-ink tabular-nums font-bold whitespace-nowrap">
                {result.grossMonthlySalary > 0
                  ? `${((totalMonthly / result.grossMonthlySalary) * 100).toFixed(
                      1
                    )}%`
                  : '0%'}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
