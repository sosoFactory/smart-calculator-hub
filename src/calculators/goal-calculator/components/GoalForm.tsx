import React from 'react';
import { GoalInput, GoalTaxType } from '../../../types/goal';
import { formatKoreanCurrency } from '../../../utils/formatters';
import { NumericInput } from '../../../components/ui/numeric-input';
import { Slider } from '../../../components/ui/slider';
import { Button } from '../../../components/ui/button';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { SegmentedControl, SegmentedOption } from '../../../components/ui/segmented-control';
import { RotateCcw, Target, Calendar, TrendingUp, Wallet, Shield } from 'lucide-react';

interface GoalFormProps {
  input: GoalInput;
  onChange: (updated: GoalInput) => void;
  onReset: () => void;
}

const TARGET_AMOUNT_PRESETS = [
  { label: '+5,000만', value: 50_000_000 },
  { label: '+1억', value: 100_000_000 },
  { label: '+3억', value: 300_000_000 },
  { label: '+5억', value: 500_000_000 },
  { label: '+10억', value: 1_000_000_000 },
];

const TARGET_YEAR_PRESETS = [3, 5, 7, 10, 15, 20, 30];

const RATE_PRESETS = [
  { label: '3.5% 예적금', value: 3.5 },
  { label: '5.0% 채권혼합', value: 5.0 },
  { label: '7.0% 글로벌주식', value: 7.0 },
  { label: '10.0% 적극투자', value: 10.0 },
];

const INITIAL_AMOUNT_PRESETS = [
  { label: '0원', value: 0 },
  { label: '+1,000만', value: 10_000_000 },
  { label: '+3,000만', value: 30_000_000 },
  { label: '+5,000만', value: 50_000_000 },
  { label: '+1억', value: 100_000_000 },
];

const TAX_OPTIONS: SegmentedOption<GoalTaxType>[] = [
  { id: 'normal', label: '일반 (15.4%)' },
  { id: 'isa', label: 'ISA (9.9%)' },
  { id: 'exempt', label: '비과세 (0%)' },
];

export const GoalForm: React.FC<GoalFormProps> = ({ input, onChange, onReset }) => {
  const updateField = <K extends keyof GoalInput>(field: K, val: GoalInput[K]) => {
    onChange({
      ...input,
      [field]: val,
    });
  };

  const handleAddTargetAmount = (addVal: number) => {
    const next = Math.min(10_000_000_000, input.targetAmount + addVal);
    updateField('targetAmount', next);
  };

  const handleAddInitialAmount = (addVal: number) => {
    if (addVal === 0) {
      updateField('initialAmount', 0);
      return;
    }
    const next = Math.min(input.targetAmount, input.initialAmount + addVal);
    updateField('initialAmount', next);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 space-y-6 shadow-2xs transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-slate-800">
        <h2 className="text-base font-bold text-[#112220] dark:text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#d1ff19]" />
          <span>목표 조건 설정</span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8 px-2.5 text-xs text-[#64748b] dark:text-slate-400 hover:text-[#112220] dark:hover:text-slate-200 border-[#e5e7eb] dark:border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          초기화
        </Button>
      </div>

      <div className="space-y-5">
        {/* 1. 목표 자산 (원) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#112220] dark:text-slate-200 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-violet-500" />
              <span>목표 자산</span>
            </label>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
              {formatKoreanCurrency(input.targetAmount)}
            </span>
          </div>

          <NumericInput
            value={input.targetAmount}
            onNumberChange={(val) => updateField('targetAmount', Math.max(10_000_000, Math.min(10_000_000_000, val || 0)))}
            suffix="원"
            thousandSeparator={true}
            placeholder="500,000,000"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {TARGET_AMOUNT_PRESETS.map((p) => (
              <SelectableChip
                key={p.label}
                isSelected={false}
                onClick={() => handleAddTargetAmount(p.value)}
                size="sm"
              >
                {p.label}
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* 2. 달성 목표 기간 (년) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#112220] dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-500" />
              <span>목표 달성 기간</span>
            </label>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {input.targetYears}년 ({input.targetYears * 12}개월)
            </span>
          </div>

          <Slider
            value={[input.targetYears]}
            onValueChange={([val]) => updateField('targetYears', val)}
            min={1}
            max={40}
            step={1}
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {TARGET_YEAR_PRESETS.map((years) => (
              <SelectableChip
                key={years}
                isSelected={input.targetYears === years}
                onClick={() => updateField('targetYears', years)}
                size="sm"
              >
                {years}년
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* 3. 예상 연 수익률 (%) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#112220] dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>예상 연 수익률</span>
            </label>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {input.annualRate.toFixed(1)}%
            </span>
          </div>

          <Slider
            value={[input.annualRate]}
            onValueChange={([val]) => updateField('annualRate', Number(val.toFixed(1)))}
            min={-5}
            max={30}
            step={0.1}
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {RATE_PRESETS.map((p) => (
              <SelectableChip
                key={p.label}
                isSelected={input.annualRate === p.value}
                onClick={() => updateField('annualRate', p.value)}
                size="sm"
              >
                {p.label}
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* 4. 현재 보유 초기 자금 (원) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#112220] dark:text-slate-200 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-amber-500" />
              <span>초기 보유 자금 (거치금)</span>
            </label>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {formatKoreanCurrency(input.initialAmount)}
            </span>
          </div>

          <NumericInput
            value={input.initialAmount}
            onNumberChange={(val) => updateField('initialAmount', Math.max(0, Math.min(input.targetAmount, val || 0)))}
            suffix="원"
            thousandSeparator={true}
            placeholder="0"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {INITIAL_AMOUNT_PRESETS.map((p) => (
              <SelectableChip
                key={p.label}
                isSelected={input.initialAmount === p.value}
                onClick={() => handleAddInitialAmount(p.value)}
                size="sm"
              >
                {p.label}
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* 5. 이자소득 과세 방식 */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#112220] dark:text-slate-200 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>과세 방식</span>
          </label>
          <SegmentedControl
            options={TAX_OPTIONS}
            value={input.taxType}
            onChange={(val) => updateField('taxType', val)}
          />
        </div>
      </div>
    </div>
  );
};
