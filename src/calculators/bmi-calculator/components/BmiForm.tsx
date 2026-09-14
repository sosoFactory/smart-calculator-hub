import React from 'react';
import { BmiInput, Gender } from '../../../types/bmi';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { NumericInput } from '../../../components/ui/numeric-input';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Slider } from '../../../components/ui/slider';
import { SegmentedControl, SegmentedOption } from '../../../components/ui/segmented-control';
import { RotateCcw } from 'lucide-react';
import { useClampedNumberInput } from '../../../hooks/useClampedNumberInput';

interface BmiFormProps {
  input: BmiInput;
  onChange: (updated: BmiInput) => void;
  onReset: () => void;
}

const GENDER_OPTIONS: SegmentedOption<Gender>[] = [
  { id: 'male', label: '남성' },
  { id: 'female', label: '여성' },
];

const HEIGHT_PRESETS = [160, 165, 170, 175, 180];
const WEIGHT_PRESETS = [50, 60, 70, 80, 90];

export const BmiForm: React.FC<BmiFormProps> = ({ input, onChange, onReset }) => {
  const updateField = <K extends keyof BmiInput>(field: K, val: BmiInput[K]) => {
    onChange({
      ...input,
      [field]: val,
    });
  };

  const heightInput = useClampedNumberInput({
    value: input.height,
    onChange: (val) => updateField('height', val),
    min: 100,
    max: 250,
    fallback: 170,
    precision: 0,
  });

  const weightInput = useClampedNumberInput({
    value: input.weight,
    onChange: (val) => updateField('weight', val),
    min: 30,
    max: 200,
    fallback: 65,
    precision: 1,
  });

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 space-y-5 shadow-2xs transition-colors">
      {/* 1. 상단 타이틀 & 표준 초기화 버튼 */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-slate-800 gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="meta" size="sm" className="shrink-0">
              건강 측정
            </Badge>
            <h2 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 whitespace-nowrap">
              신체 정보 입력
            </h2>
          </div>
          <p className="text-xs text-[#64748b] dark:text-slate-400 break-keep">
            대한비만학회(KSSO) 한국인 표준 체질량지수 기준 자동 적용
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2.5 gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#112220] dark:hover:text-white rounded-lg shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </Button>
      </div>

      {/* 2. 성별 선택 탭 */}
      <div>
        <label className="block text-xs font-bold text-[#112220] dark:text-slate-200 mb-2">
          성별
        </label>
        <SegmentedControl
          options={GENDER_OPTIONS}
          value={input.gender}
          onChange={(val) => updateField('gender', val)}
          variant="slate-solid"
          itemClassName="py-2 text-xs sm:text-sm font-bold"
        />
      </div>

      {/* 3. 신장 (키) */}
      <div>
        <label htmlFor="bmi-height" className="block text-xs sm:text-sm font-semibold text-[#112220] dark:text-slate-200 cursor-pointer mb-1.5">
          신장 (cm)
        </label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm select-none"
            onClick={() => updateField('height', Math.max(100, input.height - 1))}
            disabled={input.height <= 100}
            aria-label="신장 1cm 감소"
          >
            -1
          </Button>
          <div className="flex-1 min-w-0">
            <NumericInput
              id="bmi-height"
              aria-label="신장 (cm)"
              type="number"
              min="100"
              max="250"
              value={heightInput.value}
              onChange={heightInput.onChange}
              onBlur={heightInput.onBlur}
              placeholder="170"
              suffix="cm"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm select-none"
            onClick={() => updateField('height', Math.min(250, input.height + 1))}
            disabled={input.height >= 250}
            aria-label="신장 1cm 증가"
          >
            +1
          </Button>
        </div>
        <Slider
          id="bmi-height-slider"
          min={100}
          max={220}
          step={1}
          value={[input.height]}
          onValueChange={([val]) => updateField('height', val)}
          className="my-3"
          aria-label="신장 슬라이더"
        />
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {HEIGHT_PRESETS.map((preset) => (
            <SelectableChip
              key={preset}
              isSelected={input.height === preset}
              onClick={() => updateField('height', preset)}
            >
              {preset}cm
            </SelectableChip>
          ))}
        </div>
      </div>

      {/* 4. 체중 (몸무게) */}
      <div>
        <label htmlFor="bmi-weight" className="block text-xs sm:text-sm font-semibold text-[#112220] dark:text-slate-200 cursor-pointer mb-1.5">
          체중 (kg)
        </label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm select-none"
            onClick={() => updateField('weight', Math.max(30, Math.round(input.weight - 1)))}
            disabled={input.weight <= 30}
            aria-label="체중 1kg 감소"
          >
            -1
          </Button>
          <div className="flex-1 min-w-0">
            <NumericInput
              id="bmi-weight"
              aria-label="체중 (kg)"
              type="number"
              step="1"
              min="30"
              max="200"
              value={weightInput.value}
              onChange={weightInput.onChange}
              onBlur={weightInput.onBlur}
              placeholder="65"
              suffix="kg"
              allowDecimals
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm select-none"
            onClick={() => updateField('weight', Math.min(200, Math.round(input.weight + 1)))}
            disabled={input.weight >= 200}
            aria-label="체중 1kg 증가"
          >
            +1
          </Button>
        </div>
        <Slider
          id="bmi-weight-slider"
          min={30}
          max={150}
          step={1}
          value={[input.weight]}
          onValueChange={([val]) => updateField('weight', Math.round(val))}
          className="my-3"
          aria-label="체중 슬라이더"
        />
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {WEIGHT_PRESETS.map((preset) => (
            <SelectableChip
              key={preset}
              isSelected={input.weight === preset}
              onClick={() => updateField('weight', preset)}
            >
              {preset}kg
            </SelectableChip>
          ))}
        </div>
      </div>
    </div>
  );
};
