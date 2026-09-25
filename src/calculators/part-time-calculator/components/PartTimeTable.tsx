import React, { useState } from 'react';
import { PartTimeCalculationResult, PartTimeInput } from '../../../types/partTime';
import { formatNumberWithWon } from '../../../utils/formatters';
import { downloadCSV } from '../../../utils/csvDownloader';
import { Button } from '../../../components/ui/button';
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
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

interface PartTimeTableProps {
  input: PartTimeInput;
  result: PartTimeCalculationResult;
}

export const PartTimeTable: React.FC<PartTimeTableProps> = ({ input, result }) => {
  const [viewMode, setViewMode] = useState<'both' | 'monthly' | 'weekly'>('both');
  const [showInsuranceDetail, setShowInsuranceDetail] = useState(false);

  const { weekly, monthly, isHolidayAllowanceEligible } = result;
  const isFourInsurances = input.taxType === 'four_insurances';

  const handleExportCsv = () => {
    const filename = `알바급여_주휴수당_명세서_${new Date().toISOString().slice(0, 10)}.csv`;
    const headers = ['구분', '항목', '주간 기준', '월간 환산 기준 (월 4.35주)', '비고'];
    const rows: (string | number)[][] = [
      ['기본 정보', '시급', `${input.hourlyWage.toLocaleString()}원`, `${input.hourlyWage.toLocaleString()}원`, ''],
      ['근로시간', '소정근로시간', `${weekly.workHours.toFixed(1)}시간`, `${monthly.workHours.toFixed(1)}시간`, ''],
      ['근로시간', '주휴인정시간', `${weekly.holidayAllowanceHours.toFixed(1)}시간`, `${monthly.holidayAllowanceHours.toFixed(1)}시간`, isHolidayAllowanceEligible ? '충족' : '미충족'],
      ['근로시간', '총 유급시간', `${weekly.totalPaidHours.toFixed(1)}시간`, `${monthly.totalPaidHours.toFixed(1)}시간`, ''],
      ['지급 항목', '기본급', weekly.baseWage, monthly.baseWage, ''],
      ['지급 항목', '주휴수당', weekly.holidayAllowance, monthly.holidayAllowance, ''],
      ['지급 항목', '연장근로수당(1.5배)', weekly.overtimePay, monthly.overtimePay, ''],
      ['지급 항목', '야간근로수당(0.5배)', weekly.nightPay, monthly.nightPay, ''],
      ['지급 항목', '휴일근로수당(1.5배)', weekly.holidayWorkPay, monthly.holidayWorkPay, ''],
      ['합계', '세전 총급여', weekly.grossWage, monthly.grossWage, ''],
      ['공제 항목', `공제액(${input.taxType})`, weekly.taxAmount, monthly.taxAmount, ''],
      ['실수령액', '예상 실수령액', weekly.netWage, monthly.netWage, ''],
    ];

    downloadCSV(filename, headers, rows);
  };

  const VIEW_OPTIONS: SegmentedOption<'both' | 'monthly' | 'weekly'>[] = [
    { id: 'both', label: '전체' },
    { id: 'monthly', label: '월간' },
    { id: 'weekly', label: '주간' },
  ];

  const showWeekly = viewMode === 'both' || viewMode === 'weekly';
  const showMonthly = viewMode === 'both' || viewMode === 'monthly';

  return (
    <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-4">
      {/* 헤더 & CSV 다운로드 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div>
          <h3 className="text-base font-bold text-[#112220] dark:text-ghost-dark-ink">
            급여 및 유급시간 세부 명세표
          </h3>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
            주간 및 월간 환산(4.35주) 기준 법정 유급시간과 세부 산출 내역
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* 뷰 선택 (SegmentedControl 표준 적용) */}
          <div className="w-48">
            <SegmentedControl
              options={VIEW_OPTIONS}
              value={viewMode}
              onChange={setViewMode}
              variant="slate-solid"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-8 px-2.5 text-xs rounded-lg border-slate-200 dark:border-ghost-dark-hairline text-[#112220] dark:text-ghost-dark-ink-soft hover:bg-slate-50 dark:hover:bg-ghost-dark-hairline shrink-0"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            CSV 다운로드
          </Button>
        </div>
      </div>

      {/* 테이블 본문: PRD 12.6 명세 모바일 엣지 투 엣지 스크롤 (-mx-5 sm:mx-0 px-5 sm:px-0) */}
      <div className="-mx-5 sm:mx-0 overflow-x-auto px-5 sm:px-0">
        <Table className="min-w-[440px]">
          <TableHeader>
            <TableRow className="border-b border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-ghost-dark-surface-deep/50">
              <TableHead className="w-1/3 text-left font-semibold text-[#64748b] dark:text-ghost-dark-ink-soft whitespace-nowrap">
                구분 및 산출 항목
              </TableHead>
              {showWeekly && (
                <TableHead className="text-right font-semibold text-[#64748b] dark:text-ghost-dark-ink-soft whitespace-nowrap">
                  주간 기준
                </TableHead>
              )}
              {showMonthly && (
                <TableHead className="text-right font-semibold text-[#64748b] dark:text-ghost-dark-ink-soft whitespace-nowrap">
                  월간 기준 (4.35주)
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 유급 시간 섹션 */}
            <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50">
              <TableCell className="font-medium text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                기본 근로시간
              </TableCell>
              {showWeekly && (
                <TableCell className="text-right tabular-nums text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
                  {weekly.workHours.toFixed(1)}시간
                </TableCell>
              )}
              {showMonthly && (
                <TableCell className="text-right tabular-nums text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
                  {monthly.workHours.toFixed(1)}시간
                </TableCell>
              )}
            </TableRow>

            <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50">
              <TableCell className="font-medium text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                주휴 인정시간
                {!isHolidayAllowanceEligible && (
                  <span className="text-[11px] text-amber-500 font-normal ml-1.5">(미발생)</span>
                )}
              </TableCell>
              {showWeekly && (
                <TableCell className="text-right tabular-nums text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
                  {weekly.holidayAllowanceHours.toFixed(1)}시간
                </TableCell>
              )}
              {showMonthly && (
                <TableCell className="text-right tabular-nums text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
                  {monthly.holidayAllowanceHours.toFixed(1)}시간
                </TableCell>
              )}
            </TableRow>

            <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50 bg-slate-50/40 dark:bg-ghost-dark-surface-deep/40">
              <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                총 유급 인정시간
              </TableCell>
              {showWeekly && (
                <TableCell className="text-right font-bold tabular-nums text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  {weekly.totalPaidHours.toFixed(1)}시간
                </TableCell>
              )}
              {showMonthly && (
                <TableCell className="text-right font-bold tabular-nums text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  {monthly.totalPaidHours.toFixed(1)}시간
                </TableCell>
              )}
            </TableRow>

            {/* 급여 지급 항목 */}
            <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50">
              <TableCell className="font-medium text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                기본급
              </TableCell>
              {showWeekly && (
                <TableCell className="text-right tabular-nums text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
                  {formatNumberWithWon(weekly.baseWage)}
                </TableCell>
              )}
              {showMonthly && (
                <TableCell className="text-right tabular-nums text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
                  {formatNumberWithWon(monthly.baseWage)}
                </TableCell>
              )}
            </TableRow>

            <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50">
              <TableCell className="font-medium text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                주휴수당
              </TableCell>
              {showWeekly && (
                <TableCell className="text-right tabular-nums font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  +{formatNumberWithWon(weekly.holidayAllowance)}
                </TableCell>
              )}
              {showMonthly && (
                <TableCell className="text-right tabular-nums font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  +{formatNumberWithWon(monthly.holidayAllowance)}
                </TableCell>
              )}
            </TableRow>

            {/* 가산수당 (존재할 경우 표시) */}
            {(monthly.overtimePay > 0 || monthly.nightPay > 0 || monthly.holidayWorkPay > 0) && (
              <>
                {monthly.overtimePay > 0 && (
                  <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50">
                    <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-soft pl-6 whitespace-nowrap">
                      └ 연장가산수당 (1.5배)
                    </TableCell>
                    {showWeekly && (
                      <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        +{formatNumberWithWon(weekly.overtimePay)}
                      </TableCell>
                    )}
                    {showMonthly && (
                      <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        +{formatNumberWithWon(monthly.overtimePay)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
                {monthly.nightPay > 0 && (
                  <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50">
                    <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-soft pl-6 whitespace-nowrap">
                      └ 야간가산수당 (0.5배)
                    </TableCell>
                    {showWeekly && (
                      <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        +{formatNumberWithWon(weekly.nightPay)}
                      </TableCell>
                    )}
                    {showMonthly && (
                      <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        +{formatNumberWithWon(monthly.nightPay)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
                {monthly.holidayWorkPay > 0 && (
                  <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50">
                    <TableCell className="text-[#64748b] dark:text-ghost-dark-ink-soft pl-6 whitespace-nowrap">
                      └ 휴일근로수당 (1.5배)
                    </TableCell>
                    {showWeekly && (
                      <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        +{formatNumberWithWon(weekly.holidayWorkPay)}
                      </TableCell>
                    )}
                    {showMonthly && (
                      <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        +{formatNumberWithWon(monthly.holidayWorkPay)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </>
            )}

            {/* 세전 총급여 */}
            <TableRow className="border-b border-slate-200 dark:border-ghost-dark-hairline bg-slate-100/50 dark:bg-ghost-dark-surface-elevated/50 font-bold">
              <TableCell className="text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                세전 총급여
              </TableCell>
              {showWeekly && (
                <TableCell className="text-right tabular-nums text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  {formatNumberWithWon(weekly.grossWage)}
                </TableCell>
              )}
              {showMonthly && (
                <TableCell className="text-right tabular-nums text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                  {formatNumberWithWon(monthly.grossWage)}
                </TableCell>
              )}
            </TableRow>

            {/* 공제 항목 */}
            <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/50">
              <TableCell className="font-medium text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span>공제액 ({input.taxType === 'none' ? '미적용' : input.taxType === 'freelancer' ? '프리랜서 3.3%' : '4대 보험'})</span>
                  {isFourInsurances && (
                    <button
                      type="button"
                      onClick={() => setShowInsuranceDetail(!showInsuranceDetail)}
                      className="text-xs text-blue-500 hover:underline inline-flex items-center"
                    >
                      {showInsuranceDetail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </TableCell>
              {showWeekly && (
                <TableCell className="text-right tabular-nums text-rose-500 dark:text-rose-400 whitespace-nowrap">
                  -{formatNumberWithWon(weekly.taxAmount)}
                </TableCell>
              )}
              {showMonthly && (
                <TableCell className="text-right tabular-nums text-rose-500 dark:text-rose-400 whitespace-nowrap">
                  -{formatNumberWithWon(monthly.taxAmount)}
                </TableCell>
              )}
            </TableRow>

            {/* 4대 보험 세부 내역 펼침 */}
            {isFourInsurances && showInsuranceDetail && (
              <>
                <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/40 text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
                  <TableCell className="pl-6 whitespace-nowrap">└ 국민연금 (4.5%)</TableCell>
                  {showWeekly && <TableCell className="text-right tabular-nums whitespace-nowrap">-</TableCell>}
                  {showMonthly && (
                    <TableCell className="text-right tabular-nums whitespace-nowrap">
                      -{formatNumberWithWon(monthly.nationalPension)}
                    </TableCell>
                  )}
                </TableRow>
                <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/40 text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
                  <TableCell className="pl-6 whitespace-nowrap">└ 건강보험 (3.545%)</TableCell>
                  {showWeekly && <TableCell className="text-right tabular-nums whitespace-nowrap">-</TableCell>}
                  {showMonthly && (
                    <TableCell className="text-right tabular-nums whitespace-nowrap">
                      -{formatNumberWithWon(monthly.healthInsurance)}
                    </TableCell>
                  )}
                </TableRow>
                <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/40 text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
                  <TableCell className="pl-6 whitespace-nowrap">└ 장기요양 (건강보험의 12.95%)</TableCell>
                  {showWeekly && <TableCell className="text-right tabular-nums whitespace-nowrap">-</TableCell>}
                  {showMonthly && (
                    <TableCell className="text-right tabular-nums whitespace-nowrap">
                      -{formatNumberWithWon(monthly.longTermCare)}
                    </TableCell>
                  )}
                </TableRow>
                <TableRow className="border-b border-slate-100 dark:border-ghost-dark-hairline/40 text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
                  <TableCell className="pl-6 whitespace-nowrap">└ 고용보험 (0.9%)</TableCell>
                  {showWeekly && <TableCell className="text-right tabular-nums whitespace-nowrap">-</TableCell>}
                  {showMonthly && (
                    <TableCell className="text-right tabular-nums whitespace-nowrap">
                      -{formatNumberWithWon(monthly.employmentInsurance)}
                    </TableCell>
                  )}
                </TableRow>
              </>
            )}
          </TableBody>

          {/* 최종 실수령액 푸터 (타 테이블과 동일한 표준 규격) */}
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                예상 실수령액
              </TableCell>
              {showWeekly && (
                <TableCell className="text-right font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums text-sm whitespace-nowrap">
                  {formatNumberWithWon(weekly.netWage)}
                </TableCell>
              )}
              {showMonthly && (
                <TableCell className="text-right font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums text-sm whitespace-nowrap">
                  {formatNumberWithWon(monthly.netWage)}
                </TableCell>
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute pt-1 space-y-0.5">
        <p>• 월간 환산은 고용노동부 행정해석 공식에 따라 1개월 평균 4.34524주(365일 ÷ 7일 ÷ 12개월)를 적용하여 정밀 산정합니다.</p>
        <p>• 4대 사회보험은 월 60시간(주 15시간) 이상 근로 시 원칙적 가입 대상이며 실제 부과액은 개인별 비과세 및 고시 요율에 따라 소폭 상이할 수 있습니다.</p>
      </div>
    </div>
  );
};
