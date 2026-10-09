import React from 'react';
import { Calendar, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SeveranceInput } from '../../../types/severance';
import { calculateServicePeriod } from '../../../utils/severanceCalculator';
import { NumericInput } from '../../../components/ui/numeric-input';
import { DatePicker } from '../../../components/ui/date-picker';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Button } from '../../../components/ui/button';
import { formatKoreanCurrency } from '../../../utils/formatters';

interface SeveranceFormProps {
  input: SeveranceInput;
  onChange: (input: SeveranceInput) => void;
  onReset: () => void;
}

export const SeveranceForm: React.FC<SeveranceFormProps> = ({
  input,
  onChange,
  onReset,
}) => {
  const period = calculateServicePeriod(input.startDate, input.endDate);

  const handleFieldChange = <K extends keyof SeveranceInput>(
    field: K,
    value: SeveranceInput[K]
  ) => {
    onChange({
      ...input,
      [field]: value,
    });
  };

  const handleSalaryPreset = (amountToAdd: number) => {
    handleFieldChange('baseSalary', Math.max(0, input.baseSalary + amountToAdd));
  };

  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline p-5 sm:p-6 shadow-2xs space-y-6 transition-colors">
      {/* 폼 헤더 */}
      <div className="flex items-center justify-between pb-4 border-b border-ghost-hairline dark:border-ghost-dark-hairline">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-ghost-ink dark:text-ghost-dark-ink flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ghost-ink-mute dark:text-ghost-dark-ink-mute" />
            근무 기간 및 임금 조건
          </h2>
          <p className="text-xs text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
            입·퇴사일과 최근 3개월 평균 급여를 입력하세요.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2.5 text-xs text-ghost-ink-stone hover:text-ghost-ink dark:hover:text-ghost-dark-ink gap-1.5"
          title="기본값으로 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </Button>
      </div>

      {/* 1. 입사일 & 퇴사일 영역 */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 입사일 */}
          <div className="space-y-1.5">
            <label
              htmlFor="severance-start-date"
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink"
            >
              입사일자
            </label>
            <DatePicker
              id="severance-start-date"
              value={input.startDate}
              onChange={(d) => handleFieldChange('startDate', d)}
              placeholder="YYYY-MM-DD"
              className="w-full"
            />
          </div>

          {/* 퇴사일 */}
          <div className="space-y-1.5">
            <label
              htmlFor="severance-end-date"
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink"
            >
              퇴사일자 (마지막 근무일)
            </label>
            <DatePicker
              id="severance-end-date"
              value={input.endDate}
              onChange={(d) => handleFieldChange('endDate', d)}
              placeholder="YYYY-MM-DD"
              className="w-full"
            />
          </div>
        </div>

        {/* 재직 기간 요약 배너 */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
            period.isEligible
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {period.isEligible ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <span className="font-semibold truncate">
              {period.isEligible ? '법정 퇴직금 지급 대상' : '재직 1년 미만 (법정 퇴직금 미지급)'}
            </span>
          </div>
          <div className="text-right font-medium shrink-0">
            <span>{period.formattedServicePeriod}</span>
            <span className="text-[11px] opacity-75 ml-1">({period.totalDays}일)</span>
          </div>
        </div>
      </div>

      {/* 2. 최근 3개월 월 평균 급여 */}
      <div className="space-y-2 pt-1 border-t border-ghost-hairline/80 dark:border-ghost-dark-hairline/80">
        <div className="flex items-center justify-between">
          <label
            htmlFor="severance-base-salary"
            className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink"
          >
            최근 3개월 월 평균 급여 (기본급 + 고정수당)
          </label>
          <span className="text-xs font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
            {formatKoreanCurrency(input.baseSalary)}
          </span>
        </div>
        <NumericInput
          id="severance-base-salary"
          value={input.baseSalary}
          onNumberChange={(v) => handleFieldChange('baseSalary', v)}
          suffix="원"
          thousandSeparator
          showClear
          placeholder="3,000,000"
          className="h-10 text-right pr-8"
        />

        {/* 빠른 금액 추가 칩 */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-ghost-ink-stone dark:text-ghost-dark-ink-stone mr-1">
            빠른 추가:
          </span>
          {[
            { label: '+10만', val: 100_000 },
            { label: '+50만', val: 500_000 },
            { label: '+100만', val: 1_000_000 },
            { label: '+300만', val: 3_000_000 },
            { label: '+500만', val: 5_000_000 },
          ].map((item) => (
            <SelectableChip
              key={item.label}
              onClick={() => handleSalaryPreset(item.val)}
              className="text-[11px] h-6 px-2"
            >
              {item.label}
            </SelectableChip>
          ))}
        </div>
      </div>

      {/* 3. 연간 상여금 총액 */}
      <div className="space-y-2 pt-1 border-t border-ghost-hairline/80 dark:border-ghost-dark-hairline/80">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label
              htmlFor="severance-annual-bonus"
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink"
            >
              최근 1년 연간 상여금 총액 (선택)
            </label>
            <p className="text-[11px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
              퇴직 전 1년간 지급된 정기 상여금의 3/12 자동 산입
            </p>
          </div>
          <span className="text-xs font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
            {input.annualBonus > 0 ? formatKoreanCurrency(input.annualBonus) : '0원'}
          </span>
        </div>
        <NumericInput
          id="severance-annual-bonus"
          value={input.annualBonus}
          onNumberChange={(v) => handleFieldChange('annualBonus', v)}
          suffix="원"
          thousandSeparator
          showClear
          placeholder="0"
          className="h-10 text-right pr-8"
        />
      </div>

      {/* 4. 연간 연차수당 총액 */}
      <div className="space-y-2 pt-1 border-t border-ghost-hairline/80 dark:border-ghost-dark-hairline/80">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label
              htmlFor="severance-annual-leave"
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink"
            >
              최근 1년 연차유급휴가 미사용수당 (선택)
            </label>
            <p className="text-[11px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
              퇴직 전 지급받은 미사용 연차수당의 3/12 자동 산입
            </p>
          </div>
          <span className="text-xs font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
            {input.annualLeaveAllowance > 0 ? formatKoreanCurrency(input.annualLeaveAllowance) : '0원'}
          </span>
        </div>
        <NumericInput
          id="severance-annual-leave"
          value={input.annualLeaveAllowance}
          onNumberChange={(v) => handleFieldChange('annualLeaveAllowance', v)}
          suffix="원"
          thousandSeparator
          showClear
          placeholder="0"
          className="h-10 text-right pr-8"
        />
      </div>
    </div>
  );
};
