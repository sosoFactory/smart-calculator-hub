import React from 'react';
import { BmiInput, Gender } from '../../../types/bmi';
import { Slider } from '../../../components/ui/slider';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { FormHeader } from '../../../components/common/FormHeader';

interface BmiFormProps {
  input: BmiInput;
  onChange: (updated: BmiInput) => void;
  onReset: () => void;
}

const GENDER_OPTIONS = [
  { id: 'male' as Gender, label: '남성' },
  { id: 'female' as Gender, label: '여성' },
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

  return (
    <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-5 sm:space-y-6">
      {/* 1. 상단 타이틀 & 표준 초기화 버튼 */}
      <FormHeader
        badge="건강 측정"
        title="신체 정보 입력"
        description="대한비만학회(KSSO) 한국인 표준 체질량지수 기준 자동 적용"
        onReset={onReset}
      />

      {/* 2. 성별 선택 (독립 라디오 칩 그룹) */}
      <div>
        <label className="block text-xs font-bold text-[#112220] dark:text-ghost-dark-ink-base mb-2">
          성별
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GENDER_OPTIONS.map((opt) => (
            <SelectableChip
              key={opt.id}
              isSelected={input.gender === opt.id}
              onClick={() => updateField('gender', opt.id)}
              className="h-auto py-2 text-xs sm:text-sm font-semibold text-center justify-center"
            >
              {opt.label}
            </SelectableChip>
          ))}
        </div>
      </div>

      {/* 3. 신장 (단독 슬라이더 + 상단 수치 표기) */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label htmlFor="bmi-height-slider" className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink-base cursor-pointer">
            신장 (키)
          </label>
          <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
            {input.height} cm
          </span>
        </div>
        <Slider
          id="bmi-height-slider"
          min={100}
          max={220}
          step={1}
          value={[input.height]}
          onValueChange={([val]) => updateField('height', val)}
          className="my-2.5"
          aria-label="신장 슬라이더"
        />
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {HEIGHT_PRESETS.map((preset) => (
            <SelectableChip
              key={preset}
              isSelected={input.height === preset}
              onClick={() => updateField('height', preset)}
              size="sm"
            >
              {preset}cm
            </SelectableChip>
          ))}
        </div>
      </div>

      {/* 4. 체중 (단독 슬라이더 + 상단 수치 표기) */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label htmlFor="bmi-weight-slider" className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink-base cursor-pointer">
            체중 (몸무게)
          </label>
          <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
            {input.weight} kg
          </span>
        </div>
        <Slider
          id="bmi-weight-slider"
          min={30}
          max={150}
          step={1}
          value={[input.weight]}
          onValueChange={([val]) => updateField('weight', Math.round(val))}
          className="my-2.5"
          aria-label="체중 슬라이더"
        />
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {WEIGHT_PRESETS.map((preset) => (
            <SelectableChip
              key={preset}
              isSelected={input.weight === preset}
              onClick={() => updateField('weight', preset)}
              size="sm"
            >
              {preset}kg
            </SelectableChip>
          ))}
        </div>
      </div>
    </div>
  );
};
