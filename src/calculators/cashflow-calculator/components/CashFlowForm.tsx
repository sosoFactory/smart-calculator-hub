import React from 'react';
import { CashFlowInput, CashFlowTaxType } from '../../../types/cashFlow';
import { formatKoreanCurrency } from '../../../utils/formatters';
import { NumericInput } from '../../../components/ui/numeric-input';
import { Slider } from '../../../components/ui/slider';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { FormHeader } from '../../../components/common/FormHeader';

interface CashFlowFormProps {
  input: CashFlowInput;
  onChange: (updated: CashFlowInput) => void;
  onReset: () => void;
}

const MONTHLY_NET_PRESETS = [
  { label: '+50만', value: 500_000 },
  { label: '+100만', value: 1_000_000 },
  { label: '+200만', value: 2_000_000 },
  { label: '+300만', value: 3_000_000 },
  { label: '+500만', value: 5_000_000 },
];

const FIRE_RATE_PRESETS = [
  { label: '3.0% (초보수)', value: 3.0 },
  { label: '4.0% (파이어 룰)', value: 4.0 },
  { label: '5.0% (중립)', value: 5.0 },
  { label: '7.0% (적극)', value: 7.0 },
];

const TAX_OPTIONS: { id: CashFlowTaxType; label: string; rateLabel: string }[] = [
  { id: 'normal', label: '일반과세', rateLabel: '15.4%' },
  { id: 'isa', label: 'ISA 절세', rateLabel: '9.9%' },
  { id: 'none', label: '비과세', rateLabel: '0%' },
];

export const CashFlowForm: React.FC<CashFlowFormProps> = ({ input, onChange, onReset }) => {
  const updateField = <K extends keyof CashFlowInput>(field: K, val: CashFlowInput[K]) => {
    onChange({
      ...input,
      [field]: val,
    });
  };

  const handleAddMonthlyNet = (addVal: number) => {
    const next = Math.min(100_000_000, input.monthlyNetDesired + addVal);
    updateField('monthlyNetDesired', next);
  };

  return (
    <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-5 sm:space-y-6 w-full">
      {/* 1. 상단 타이틀 & 표준 초기화 버튼 */}
      <FormHeader
        badge="파이어 설계"
        title="현금흐름 역산 조건"
        description="목표 월 실수령액과 예상 수익률을 입력하면 필요한 은퇴 자산과 세금을 역산합니다"
        onReset={onReset}
      />

      <div className="space-y-5">
        {/* 1. 목표 월 세후 실수령액 */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              목표 월 세후 실수령액
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
              {formatKoreanCurrency(input.monthlyNetDesired)} / 월
            </span>
          </div>

          <NumericInput
            value={input.monthlyNetDesired}
            onNumberChange={(val) =>
              updateField('monthlyNetDesired', Math.max(0, Math.min(100_000_000, val || 0)))
            }
            suffix="원"
            thousandSeparator={true}
            placeholder="3,000,000"
          />

          <div className="flex flex-wrap gap-1.5 pt-2">
            {MONTHLY_NET_PRESETS.map((p) => (
              <SelectableChip
                key={p.label}
                isSelected={false}
                onClick={() => handleAddMonthlyNet(p.value)}
                size="sm"
              >
                {p.label}
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* 2. 예상 연 수익률 / 배당률 */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              예상 연 수익률 (배당률)
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
              연 {input.annualReturnRate.toFixed(1)}%
            </span>
          </div>

          <div className="py-2">
            <Slider
              value={[input.annualReturnRate]}
              min={1.0}
              max={20.0}
              step={0.1}
              onValueChange={(vals) => updateField('annualReturnRate', Number(vals[0].toFixed(1)))}
              className="w-full"
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 dark:text-ghost-dark-ink-mute px-0.5 mb-2">
            <span>1.0%</span>
            <span>4.0% (트리니티)</span>
            <span>10.0%</span>
            <span>20.0%</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FIRE_RATE_PRESETS.map((p) => (
              <SelectableChip
                key={p.value}
                isSelected={Math.abs(input.annualReturnRate - p.value) < 0.05}
                onClick={() => updateField('annualReturnRate', p.value)}
                size="sm"
              >
                {p.label}
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* 3. 과세 체계 */}
        <div>
          <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base block mb-2">
            과세 체계
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TAX_OPTIONS.map((opt) => {
              const isSelected = input.taxType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateField('taxType', opt.id)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#112220] dark:border-[#d1ff19] bg-slate-100 dark:bg-ghost-dark-surface-elevated text-[#112220] dark:text-white font-bold ring-1 ring-[#112220] dark:ring-[#d1ff19]'
                      : 'border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-ghost-dark-surface-deep text-[#64748b] dark:text-ghost-dark-ink-soft hover:bg-slate-100/70 dark:hover:bg-ghost-dark-hover'
                  }`}
                >
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span
                    className={`text-[11px] mt-0.5 ${
                      isSelected
                        ? 'text-[#112220] dark:text-[#d1ff19] font-bold'
                        : 'text-slate-400 dark:text-ghost-dark-ink-mute'
                    }`}
                  >
                    {opt.rateLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
