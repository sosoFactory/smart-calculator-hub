import React from 'react';
import { GoalInput, GoalTaxType } from '../../../types/goal';
import { formatKoreanCurrency } from '../../../utils/formatters';
import { NumericInput } from '../../../components/ui/numeric-input';
import { Slider } from '../../../components/ui/slider';
import { Button } from '../../../components/ui/button';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { RotateCcw, Target } from 'lucide-react';

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

const TAX_OPTIONS: { id: GoalTaxType; label: string; rateLabel: string }[] = [
  { id: 'normal', label: '일반과세', rateLabel: '15.4%' },
  { id: 'isa', label: 'ISA 절세', rateLabel: '9.9%' },
  { id: 'exempt', label: '비과세', rateLabel: '0%' },
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
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-6 space-y-5 shadow-2xs transition-colors w-full">
      {/* 상단 타이틀 & 표준 초기화 버튼 */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline gap-2">
        <div className="space-y-0.5 min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink flex items-center gap-2">
            <Target className="w-5 h-5 text-[#112220] dark:text-[#d1ff19] shrink-0" />
            <span className="truncate">목표 조건 설정</span>
          </h2>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute break-keep">
            목표 자산과 기간, 예상 수익률을 입력하면 필요한 매월 적립액을 계산합니다
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2.5 gap-1.5 text-xs text-slate-500 dark:text-ghost-dark-ink-mute hover:text-[#112220] dark:hover:text-white rounded-lg shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </Button>
      </div>

      <div className="space-y-5">
        {/* 1. 목표 자산 (원) */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              목표 자산
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
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

          <div className="flex flex-wrap gap-1.5 pt-2">
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
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-2">
            <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              목표 달성 기간
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
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

          <div className="flex flex-wrap gap-1.5 pt-2.5">
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

        {/* 3. 예상 연 수익률 (%) - step 0.5, min 0 */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-2">
            <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              예상 연 수익률
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
              {input.annualRate.toFixed(1)}%
            </span>
          </div>

          <Slider
            value={[input.annualRate]}
            onValueChange={([val]) => updateField('annualRate', Number(val.toFixed(1)))}
            min={0}
            max={30}
            step={0.5}
          />

          <div className="flex flex-wrap gap-1.5 pt-2.5">
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
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              초기 보유 자금 (거치금)
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
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

          <div className="flex flex-wrap gap-1.5 pt-2">
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

        {/* 5. 이자소득 과세 방식 (반응형 텍스트 + 친절 안내 가이드) */}
        <div>
          <div className="flex items-center justify-between gap-1 mb-2">
            <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
              과세 방식
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums whitespace-nowrap">
              {input.taxType === 'normal' && (
                <>
                  <span className="hidden sm:inline">일반과세 </span>
                  <span>(15.4%)</span>
                </>
              )}
              {input.taxType === 'isa' && (
                <>
                  <span className="hidden sm:inline">ISA 절세 </span>
                  <span>(9.9%)</span>
                </>
              )}
              {input.taxType === 'exempt' && (
                <>
                  <span className="hidden sm:inline">비과세 </span>
                  <span>(0%)</span>
                </>
              )}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TAX_OPTIONS.map((opt) => (
              <SelectableChip
                key={opt.id}
                isSelected={input.taxType === opt.id}
                onClick={() => updateField('taxType', opt.id)}
                className="h-auto py-2 text-xs sm:text-sm font-semibold justify-center text-center"
              >
                <span>{opt.label}</span>
                <span className="text-[11px] opacity-75 ml-1 hidden xs:inline">({opt.rateLabel})</span>
              </SelectableChip>
            ))}
          </div>

          {/* ISA 및 과세 방식 친절 안내 가이드 */}
          <div className="mt-2 text-xs text-[#64748b] dark:text-ghost-dark-ink-mute bg-slate-50 dark:bg-ghost-dark-surface-deep p-2.5 rounded-lg border border-slate-200/80 dark:border-ghost-dark-hairline leading-relaxed">
            {input.taxType === 'normal' && (
              <p>
                <strong className="text-slate-800 dark:text-ghost-dark-ink-base font-semibold">일반과세 (15.4%):</strong> 금융상품 이자·배당 수익에 기본 부과되는 이자소득세(14%)와 지방소득세(1.4%)가 원천징수됩니다.
              </p>
            )}
            {input.taxType === 'isa' && (
              <p>
                <strong className="text-slate-800 dark:text-ghost-dark-ink-base font-semibold">ISA 절세 (9.9% 분리과세):</strong> 개인종합자산관리계좌(ISA)로 순이익 200만~400만원까지 비과세되며, 초과 수익은 종합과세 없이 9.9% 분리과세 혜택을 받습니다.
              </p>
            )}
            {input.taxType === 'exempt' && (
              <p>
                <strong className="text-slate-800 dark:text-ghost-dark-ink-base font-semibold">비과세 (0%):</strong> 청년도약계좌, 비과세종합저축 등 관련 법령에 따라 이자소득세가 전혀 발생하지 않는 절세 상품입니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
